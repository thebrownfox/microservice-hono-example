import type { ServiceResponse } from "./types.ts";

export function createSuccessResponse<T>(data: T, statusCode = 200): ServiceResponse<T> {
  return {
    data,
    statusCode,
  };
}

export function createErrorResponse<T>(error: string, statusCode = 500): ServiceResponse<T> {
  return {
    error,
    statusCode,
  };
}
