import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | object;
  module: string;
  timestamp: string;
  path: string;
  correlationId: string;
  errorCode?: string;
  retryAfter?: number;
  validationErrors?: any[];
}

@Catch()
export class DiscoveryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DiscoveryExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle validation errors specially
      if (
        status === HttpStatus.BAD_REQUEST &&
        this.isValidationError(exceptionResponse)
      ) {
        errorResponse = this.createValidationErrorResponse(
          exceptionResponse,
          request,
        );
      } else {
        errorResponse = this.createHttpExceptionResponse(
          exceptionResponse,
          request,
        );
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = this.createInternalServerErrorResponse(
        exception,
        request,
      );
    }

    // Log the error for monitoring and debugging
    this.logError(exception, request, status);

    // Set rate limit headers if applicable
    if (status === HttpStatus.TOO_MANY_REQUESTS && errorResponse.retryAfter) {
      response.setHeader(
        'Retry-After',
        Math.ceil(errorResponse.retryAfter / 1000),
      );
      response.setHeader(
        'X-RateLimit-Reset',
        Date.now() + errorResponse.retryAfter,
      );
    }

    response.status(status).json(errorResponse);
  }

  private isValidationError(exceptionResponse: any): boolean {
    return (
      typeof exceptionResponse === 'object' &&
      exceptionResponse.message &&
      Array.isArray(exceptionResponse.message)
    );
  }

  private createValidationErrorResponse(
    exceptionResponse: any,
    request: Request,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Validation Failed',
      message: 'Input validation failed',
      module: 'discovery',
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: this.getCorrelationId(request),
      errorCode: 'VALIDATION_FAILED',
      validationErrors: Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message],
    };
  }

  private createHttpExceptionResponse(
    exceptionResponse: any,
    request: Request,
  ): ErrorResponse {
    if (typeof exceptionResponse === 'object') {
      return {
        ...exceptionResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
        correlationId: this.getCorrelationId(request),
      };
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: exceptionResponse,
      module: 'discovery',
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: this.getCorrelationId(request),
    };
  }

  private createInternalServerErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during discovery operation',
      module: 'discovery',
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: this.getCorrelationId(request),
      errorCode: 'INTERNAL_SERVER_ERROR',
    };
  }

  private getCorrelationId(request: Request): string {
    return (
      (request.headers['x-correlation-id'] as string) ||
      (request.headers['x-request-id'] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
  }

  private logError(exception: unknown, request: Request, status: number): void {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const correlationId = this.getCorrelationId(request);

    const logContext = {
      method,
      url,
      ip,
      userAgent,
      correlationId,
      statusCode: status,
    };

    if (status >= 500) {
      this.logger.error(
        `Discovery API Server Error: ${method} ${url}`,
        exception instanceof Error ? exception.stack : exception,
        logContext,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `Discovery API Client Error: ${method} ${url}`,
        exception instanceof Error ? exception.message : exception,
        logContext,
      );
    }
  }
}
