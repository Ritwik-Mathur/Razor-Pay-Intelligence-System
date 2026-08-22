import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`Error on ${req.method} ${req.url}:`, err.message || err);
  const statusCode = err.statusCode || err.status || 500;
  return sendError(res, err.message || 'Internal Server Error', statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
}
