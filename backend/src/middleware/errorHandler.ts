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

    logger.error({
      error: {
        message: boomError.message,
        stack: boomError.stack,
        status: boomError.output.statusCode
      },
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        payload: request.payload
      }
    });

    return h.continue;
  }

  // Handle regular errors
  if (response instanceof Error) {
    const error = response as ErrorWithStatus;
    const status = error.status || error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    logger.error({
      error: {
        message: error.message,
        stack: error.stack,
        status
      },
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        payload: request.payload
      }
    });

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
