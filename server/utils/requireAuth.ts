import { decodeJWT, verifyJWT } from "./crypto/jwt";

export async function requireAuth(event: any) {
  const authHeader = getRequestHeader(event, 'authorization');
  
  if (!authHeader) {
    throw createApiError('Authorization header missing or invalid', 401);
  }

  const token = authHeader;

  try {
    const validToken = verifyJWT(token);
    if (!validToken) {
      throw createApiError('Forbidden', 403);
    }

    const decodedToken = decodeJWT(token);

    event.context.user = {
      id: parseInt(decodedToken.userId),
      username: decodedToken.username,
      admin: decodedToken.admin
    };
    
    return true;
  } catch (error: any) {
    throw createApiError('Invalid or expired token', 401, error);
  }
}

export async function requireJWT(event: any) {
  await requireAuth(event);
}

export async function requireAdminAuth(event: any) {
  await requireAuth(event);
  const user = event.context.user;
  
  if (!user.admin) {
    throw createApiError('Forbidden', 403);
  }
}