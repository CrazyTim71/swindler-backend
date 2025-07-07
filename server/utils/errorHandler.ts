export function createApiError(message: string, statusCode: number = 500, data?: any) {
  return createError({
    statusCode,
    statusMessage: message,
    data: data,
  });
}

export function sendApiResponse(event: any, message: string, statusCode: number = 500, error: Boolean = false) {
  event.node.res.statusCode = statusCode;

  let response = {
    "statusCode": statusCode,
    "message": message,
  };

  if (error) {
    response = { ...{'error': true}, ...response}
  };

  return response;
}