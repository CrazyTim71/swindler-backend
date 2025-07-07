import { hashPassword } from "~/utils/crypto";
import { createApiError, sendApiResponse } from "~/utils/errorHandler";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password, passwordRepeated, email } = body

  if (!username || !password || !passwordRepeated || !email) {
    throw createApiError('Missing required fields', 400);
  }

  const validationResult = signupSchema.safeParse(body)
  if (!validationResult.success) {
    throw createApiError('Invalid input', 400, validationResult.error.errors)
  }

  if (password != passwordRepeated) {
    throw createApiError('Passwords do not match', 400);
  }

  try {
    
    // check if the username or mail already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username},
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return sendApiResponse(event, 'User already exists', 400, true);
    }

    const hashedPW = await hashPassword(password);
    if (!hashedPW) {
      return sendApiResponse(event, 'Internal server error', 500, true)
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        "password": hashedPW,
        email,
      },
    });

    if (!newUser) {
      return sendApiResponse(event, 'Database error', 500, true)
    }

    return { "success": true, "data": newUser }

  } catch (error: any) {
    throw createApiError('Database error', 500, error);
  }
});