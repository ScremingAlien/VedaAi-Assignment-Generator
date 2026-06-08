import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { SafeParseReturnType, ZodSchema } from 'zod/v3';

import { AppError } from '../../core/errors/AppError.js';

/**
 * Zod Validation Middleware
 * -------------------------------------------------------
 * Validates incoming request data (body, query, params)
 * using a provided Zod schema.
 *
 * On validation failure:
 *  - Forwards a structured AppError to global error handler
 *
 * On success:
 *  - Attaches validated & sanitized data to `req.validated`
 *
 * @param {ZodSchema} schema - Zod schema for validation
 * @returns {Function} Express middleware
 *
 * @example
 *   z.object({
 *     body: z.object({...}),
 *     query: z.object({...}).optional(),
 *     params: z.object({...}).optional()
 *   })
 *
 */

export default function validate(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Validate request against schema
    const result: SafeParseReturnType<any, any> = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Validation failed
    if (!result.success) {
      /**
       * Format Zod errors into a consistent structure
       * Example output:
       * [
       *   { field: "body.email", message: "Invalid email" },
       *   { field: "params.id", message: "Required" }
       * ]
       */
      const formattedErrors: { field: string; message: string }[] = result.error.errors.map(
        (err) => ({
          field: err.path.join('.') || 'root', // fallback if no path
          message: err.message,
        }),
      );

      /**
       * Forward error to global error handler
       * DO NOT send response here (keeps architecture clean)
       */
      next(
        new AppError(
          'Validation failed', // human-readable message
          400, // HTTP status code
          'VALIDATION_ERROR', // machine-readable error code
          formattedErrors, // detailed validation issues
        ),
      );
      return;
    }

    /**
     * Optional (recommended in strict systems):
     * Replace raw input with validated data
     * This ensures no unsafe/unvalidated data flows forward
     */
    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;

    // Proceed to next middleware/controller
    next();
  };
}
