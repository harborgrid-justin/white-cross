/**
 * WebSocket Exception Filter
 *
 * Global exception filter for WebSocket events.
 * Provides standardized error handling, logging, and error response formatting.
 *
 * Features:
 * - Catches all exceptions from WebSocket event handlers
 * - Formats errors consistently for clients
 * - Logs errors for debugging and monitoring
 * - Handles WsException and standard Error types
 * - Prevents sensitive information leakage
 * - HIPAA-compliant error logging
 *
 * Error Response Format:
 * {
 *   type: 'ERROR_TYPE',
 *   message: 'User-friendly error message',
 *   timestamp: '2025-01-01T00:00:00.000Z',
 *   requestId: 'uuid' // Optional for tracking
 * }
 *
 * @class WsExceptionFilter
 */
import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import type { JsonValue } from '@/infrastructure/websocket';

/**
 * Error types for standardized error responses
 */
export enum WsErrorType {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/**
 * Error object structure from WsException
 */
interface WsErrorObject {
  type?: string;
  message?: string;
  details?: JsonValue;
}

/**
 * Standardized error response interface
 */
export interface WsErrorResponse {
  type: WsErrorType | string;
  message: string;
  timestamp: string;
  requestId?: string;
  details?: JsonValue;
}

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  /**
   * Catches and handles WebSocket exceptions
   *
   * @param exception - The exception that was thrown
   * @param host - The arguments host containing context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>();
    const pattern = host.switchToWs().getPattern();

    // Extract user information for logging (if available)
    const userId = (client as any).user?.userId || 'anonymous';
    const organizationId = (client as any).user?.organizationId || 'unknown';

    // Build error response
    const errorResponse = this.buildErrorResponse(exception);

    // Log the error with context (HIPAA-compliant - no PHI in logs)
    this.logError(exception, {
      socketId: client.id,
      userId,
      organizationId,
      pattern,
      errorType: errorResponse.type,
    });

    // Send error to client
    client.emit('error', errorResponse);

    // Optionally disconnect client for critical errors
    if (this.shouldDisconnect(exception)) {
      this.logger.warn(
        `Disconnecting client ${client.id} (user: ${userId}) due to critical error`,
      );
      client.disconnect();
    }
  }

  /**
   * Builds a standardized error response from an exception
   *
   * @param exception - The exception to process
   * @returns Formatted error response
   */
  private buildErrorResponse(exception: unknown): WsErrorResponse {
    const timestamp = new Date().toISOString();

    // Handle WsException (NestJS WebSocket exceptions)
    if (exception instanceof WsException) {
      const error = exception.getError();

      if (typeof error === 'string') {
        return {
          type: WsErrorType.BAD_REQUEST,
          message: error,
          timestamp,
        };
      }

      if (typeof error === 'object' && error !== null) {
        const errorObj = error as WsErrorObject;
        return {
          type: errorObj.type || WsErrorType.BAD_REQUEST,
          message: errorObj.message || 'An error occurred',
          timestamp,
          details: errorObj.details,
        };
      }
    }

    // Handle standard Error
    if (exception instanceof Error) {
      // Map common error types
      const errorType = this.mapErrorType(exception);

      // In production, don't expose internal error details
      const message =
        process.env.NODE_ENV === 'production'
          ? this.getSafeErrorMessage(errorType)
          : exception.message;

      return {
        type: errorType,
        message,
        timestamp,
      };
    }

    // Handle unknown error types
    return {
      type: WsErrorType.INTERNAL_ERROR,
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : String(exception),
      timestamp,
    };
  }

  /**
   * Maps error types to standardized error types
   *
   * @param error - The error to map
   * @returns Standardized error type
   */
  private mapErrorType(error: Error): WsErrorType {
    const message = error.message.toLowerCase();

    if (message.includes('authentication') || message.includes('token')) {
      return WsErrorType.AUTHENTICATION_FAILED;
    }

    if (message.includes('authorization') || message.includes('permission')) {
      return WsErrorType.AUTHORIZATION_FAILED;
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return WsErrorType.VALIDATION_ERROR;
    }

    if (message.includes('rate limit')) {
      return WsErrorType.RATE_LIMIT_EXCEEDED;
    }

    if (message.includes('not found')) {
      return WsErrorType.RESOURCE_NOT_FOUND;
    }

    if (message.includes('conflict') || message.includes('already exists')) {
      return WsErrorType.CONFLICT;
    }

    if (message.includes('unavailable') || message.includes('timeout')) {
      return WsErrorType.SERVICE_UNAVAILABLE;
    }

    return WsErrorType.INTERNAL_ERROR;
  }

  /**
   * Gets a safe error message for production
   *
   * @param errorType - The error type
   * @returns Safe error message
   */
  private getSafeErrorMessage(errorType: WsErrorType): string {
    const messages: Record<WsErrorType, string> = {
      [WsErrorType.AUTHENTICATION_FAILED]: 'Authentication required',
      [WsErrorType.AUTHORIZATION_FAILED]: 'Access denied',
      [WsErrorType.VALIDATION_ERROR]: 'Invalid request data',
      [WsErrorType.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please slow down',
      [WsErrorType.RESOURCE_NOT_FOUND]: 'Resource not found',
      [WsErrorType.CONFLICT]: 'Request conflicts with current state',
      [WsErrorType.INTERNAL_ERROR]: 'An unexpected error occurred',
      [WsErrorType.BAD_REQUEST]: 'Bad request',
      [WsErrorType.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
    };

    return messages[errorType] || 'An error occurred';
  }

  /**
   * Logs error with context (HIPAA-compliant)
   *
   * @param exception - The exception to log
   * @param context - Additional context for logging
   */
  private logError(
    exception: unknown,
    context: {
      socketId: string;
      userId: string;
      organizationId: string;
      pattern: string;
      errorType: string;
    },
  ): void {
    const logContext = {
      socketId: context.socketId,
      userId: context.userId,
      organizationId: context.organizationId,
      pattern: context.pattern,
      errorType: context.errorType,
    };

    if (exception instanceof Error) {
      this.logger.error(
        `WebSocket Error: ${exception.message}`,
        exception.stack,
        JSON.stringify(logContext),
      );
    } else {
      this.logger.error(
        `WebSocket Error: ${String(exception)}`,
        JSON.stringify(logContext),
      );
    }

    // In production, also log to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry, DataDog, or other monitoring service
      // await this.monitoringService.captureException(exception, logContext);
    }
  }

  /**
   * Determines if the client should be disconnected based on the error
   *
   * @param exception - The exception to check
   * @returns True if client should be disconnected
   */
  private shouldDisconnect(exception: unknown): boolean {
    // Disconnect for authentication failures
    if (exception instanceof Error) {
      const message = exception.message.toLowerCase();

      if (
        message.includes('authentication') ||
        message.includes('invalid token') ||
        message.includes('token expired')
      ) {
        return true;
      }
    }

    // Don't disconnect for other errors - allow client to retry
    return false;
  }
}
