import { sendApiDataResponse } from "~/utils/apiResponses";
import { generateJWT } from "~/utils/crypto/jwt";
import { checkPassword } from "~/utils/crypto/password";
import type { User } from "~~/types/backend/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validationResult = loginSchema.safeParse(body);
  if (!validationResult.success) {
    throw createApiError('Invalid input', 400, validationResult.error.errors)
  }
  
  const { username, password } = validationResult.data

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    if (!user) {
      return sendApiResponse(event, "Wrong username or password", 400);
    }

    const passwordCorrect = await checkPassword(password, user.password);
    if (passwordCorrect) {
      const jwt = generateJWT(user as User);
      return sendApiDataResponse(event, {"success": true, "jwt": jwt}, 200)
    } else {
      return sendApiResponse(event, "Wrong username or password", 400);
    }
  } catch (error: any) {
    throw createApiError('Database error', 500, error);
  }
});
