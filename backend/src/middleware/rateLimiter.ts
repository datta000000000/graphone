import rateLimit from 'express-rate-limit';
import { sendError } from '../lib/response';

/**
 * Rate limiting middleware: 100 requests per minute per IP.
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    sendError(
      res,
      'Too many requests from this IP. Please try again after a minute.',
      429,
      'RATE_LIMITED'
    );
  },
});
