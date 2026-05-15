import { SuccessResponse } from '../schemas/success.response';

export function successResponse<T>(
  data: T,
  message: string,
  stausCode: number = 200,
): SuccessResponse<T> {
  return {
    success: true,
    statusCode: stausCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function emptyReponse(
  message: string,
  stausCode: number = 200,
): SuccessResponse<null> {
  return {
    success: true,
    statusCode: stausCode,
    message,
    data: null,
    timestamp: new Date().toISOString(),
  };
}
