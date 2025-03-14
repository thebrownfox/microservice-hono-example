import type { ServiceResponse } from "./types.ts";

// TODO: Use these in the service code and implement proper error handling

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
