import type { NextFunction, Request, Response } from 'express';
import z from 'zod';

import envManager from '../../core/env/env.js';
import { AppError } from '../../core/errors/AppError.js';
import { logger } from '../../infra/logger/index.js';
import getRequestId from '../../infra/request-context/index.js';

/**
 * Global Error Handler Middleware
 * -------------------------------------------------------
 * - Normalizes all errors to AppError
 * - Logs structured error
 * - Sends consistent API response
 */
export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let error: AppError;

  // Normalize unknown errors
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof z.ZodError) {
    error = new AppError(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      false,
    );
  } else if (err instanceof Error) {
    error = new AppError(
      err.message || 'Internal Server Error',
      500,
      'INTERNAL_ERROR',
      null,
      false,
    );
  } else {
    error = new AppError('Internal Server Error', 500, 'INTERNAL_ERROR', null, false);
  }

  // Get requestId from context
  const requestId = getRequestId();

  // Structured logging
  logger.error('API Error', {
    requestId,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    details: error.details,
  });

  const response: Record<string, unknown> = {
    success: false,
    message: error.message,
    error: {
      code: error.code,
      details: error.details,
    },
    requestId,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Show stack only in development
  if (envManager.isDevelopment()) {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
}
