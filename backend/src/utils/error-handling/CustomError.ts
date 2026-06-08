import { AppError } from '../../core/errors/AppError.js';

export const NotFoundError = (msg: string = 'Resource not found'): AppError =>
  new AppError(msg, 404, 'NOT_FOUND');

export const ValidationError = (details: string | object): AppError =>
  new AppError('Validation failed', 400, 'VALIDATION_ERROR', details);

export const UnauthorizedError = (msg: string = 'Unauthorized'): AppError =>
  new AppError(msg, 401, 'UNAUTHORIZED');

export const ForbiddenError = (msg: string = 'Forbidden'): AppError =>
  new AppError(msg, 403, 'FORBIDDEN');
