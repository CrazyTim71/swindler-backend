import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { generateKeyPairSync } from 'crypto';
import type { User } from '~~/types/backend/db';

export function initJWT() {
  const config = useRuntimeConfig();

  if (config.jwtPrivateKeyPath && config.jwtPublicKeyPath) {
    return fs.existsSync(config.jwtPrivateKeyPath) && fs.existsSync(config.jwtPublicKeyPath);
  }
  
  const privKeyPath = process.env.NITRO_JWT_PRIVATE_KEY_PATH;
  const pubKeyPath = process.env.NITRO_JWT_PUBLIC_KEY_PATH;

  if (fs.existsSync(privKeyPath) && fs.existsSync(pubKeyPath)) {
    return true;
  } else {
    try {
      const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });

      fs.writeFileSync(privKeyPath, privateKey, 'utf8');
      fs.writeFileSync(pubKeyPath, publicKey, 'utf8');

      return true
    } catch (error: any) {
      console.error('JWT initialization failed:', error);
      return false;
    }
  }
}

export function generateJWT(user: User): string {
  if (!process.env.NITRO_JWT_PRIVATE_KEY_PATH) {
    throw new Error('JWT not initialized. Call initJWT() first.');
  }

  const privateKey = fs.readFileSync(process.env.NITRO_JWT_PRIVATE_KEY_PATH, 'utf8');

  const signOptions = {
    issuer:  "Swindler Corp",
    subject:  user.id.toString(),
    audience:  "Swindler Users",
    expiresIn:  "1h",
    algorithm:  "RS256",
  };

  const payload = { 
    "userId": user.id.toString(),
    "username": user.username,
    "admin": user.admin,  
  };

  return jsonwebtoken.sign(payload, privateKey, signOptions);
}

export function verifyJWT(jwtToken: string): Boolean {
  if (!process.env.NITRO_JWT_PUBLIC_KEY_PATH) {
    throw new Error('JWT not initialized. Call initJWT() first.');
  }

  const publicKey = fs.readFileSync(process.env.NITRO_JWT_PUBLIC_KEY_PATH, 'utf8');
  const decoded = decodeJWT(jwtToken);
  if (!decoded || !('userId' in decoded)) {
    throw createApiError("Invalid JWT", 400);
  }

  const verifyOptions = {
    issuer:  "Swindler Corp",
    subject:  decoded['userId'],
    audience:  "Swindler Users",
    expiresIn:  "1h",
    algorithm:  "RS256",
  };
    
  return jsonwebtoken.verify(jwtToken, publicKey, verifyOptions);
}

export function decodeJWT(jwtToken: string) {
  return jsonwebtoken.decode(jwtToken);
}