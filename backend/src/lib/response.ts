import { Response } from 'express';
import { ApiResponse, ApiError } from '../types';

/**
 * Sends a structured API success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: { total?: number; cursor?: string | null }
): Response {
  const responseBody: ApiResponse<T> = {
    data,
    meta,
    error: null,
  };
  return res.status(statusCode).json(responseBody);
}

/**
 * Sends a structured API error response.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR'
): Response {
  const responseBody: ApiError = {
    data: null,
    error: {
      code,
      message,
    },
  };
  return res.status(statusCode).json(responseBody);
}
