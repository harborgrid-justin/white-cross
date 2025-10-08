import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { logger } from '../utils/logger';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (request: Request, h: ResponseToolkit) => {
  const response = request.response;

  // Handle Boom errors (Hapi's error objects)
  if (Boom.isBoom(response)) {
    const boomError = response as Boom.Boom;

    logger.error(
      `API Error: ${boomError.message} [${boomError.output.statusCode}] ${request.method} ${request.url.pathname}`,
      boomError
    );

    return h.continue;
  }

  // Handle regular errors
  if (response instanceof Error) {
    const error = response as ErrorWithStatus;
    const status = error.status || error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    logger.error(
      `API Error: ${message} [${status}] ${request.method} ${request.url.pathname}`,
      error
    );

    return h.response({
      success: false,
      error: {
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    }).code(status);
  }

  return h.continue;
};
