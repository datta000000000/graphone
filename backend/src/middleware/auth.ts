import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { sendError } from '../lib/response';

/**
 * Middleware to authenticate requests to write routes using the X-API-Key header.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== env.API_KEY) {
    sendError(res, 'Unauthorized: Invalid or missing API key', 401, 'UNAUTHORIZED');
    return;
  }

  next();
}
