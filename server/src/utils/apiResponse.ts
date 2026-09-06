/**
 * Standard API Response Utilities
 * Ensures consistent response format across all endpoints
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
  message: string,
  data: T
): ApiSuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  message: string,
  error: string | Error,
  statusCode: number
): ApiErrorResponse {
  return {
    success: false,
    message,
    error: error instanceof Error ? error.message : error,
    statusCode,
  };
}
