import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../lib/errors';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Express middleware factory to validate incoming requests against Zod schemas.
 */
export function validate(schemas: ValidationSchemas): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join('; ');
        next(new AppError(`Validation Error: ${issues}`, 400, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
}
