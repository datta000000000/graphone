import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';
import { sendError } from '../lib/response';
import { env } from '../config/env';

/**
 * Global Express error handling middleware.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Log the error for internal tracking
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  // Handle express-rate-limit or body-parser errors that might have status codes
  const statusCode = err.status || err.statusCode || 500;
  let code = 'INTERNAL_ERROR';

  if (statusCode === 400) code = 'VALIDATION_ERROR';
  if (statusCode === 401) code = 'UNAUTHORIZED';
  if (statusCode === 403) code = 'FORBIDDEN';
  if (statusCode === 404) code = 'NOT_FOUND';
  if (statusCode === 429) code = 'RATE_LIMITED';

  const message = env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected error occurred on the server.'
    : err.message || 'Internal Server Error';

  sendError(res, message, statusCode, code);
}
