import { sendApiDataResponse } from "~/utils/apiResponses";
import { checkPassword } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

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
      // TODO: implement jwt stuff
      return sendApiDataResponse(event, {"success": true, "jwt": "dummy"}, 200)
    } else {
      return sendApiResponse(event, "Wrong username or password", 400);
    }
  } catch (error: any) {
    throw createApiError('Database error', 500, error);
  }
});
