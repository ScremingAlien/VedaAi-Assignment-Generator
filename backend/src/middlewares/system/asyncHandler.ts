import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Async Handler Wrapper
 * -------------------------------------------------------
 * Utility to wrap async route handlers and automatically
 * forward errors to Express error middleware.
 *
 * Eliminates the need for repetitive try/catch blocks
 * in controllers and routes.
 *
 * @export
 * @function asyncHandler
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Wrapped Express middleware
 *
 * @example
 * // Without asyncHandler
 * app.get("/users", async (req, res, next) => {
 *   try {
 *     const users = await getUsers();
 *     res.json(users);
 *   } catch (err) {
 *     next(err);
 *   }
 * });
 *
 * @example
 * // With asyncHandler
 * app.get(
 *   "/users",
 *   asyncHandler(async (req, res) => {
 *     const users = await getUsers();
 *     res.success({ data: users });
 *   })
 * );
 */

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
