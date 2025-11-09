/**
 * @fileoverview Error Handling & Monitoring Barrel Export
 * @module core/errors
 *
 * Comprehensive error handling, monitoring, and logging utilities including
 * error handlers, recovery strategies, monitoring, and structured logging.
 *
 * @example Error handling
 * ```typescript
 * import { createErrorHandler, ErrorTypes } from '@reuse/core/errors';
 *
 * const errorHandler = createErrorHandler({
 *   logErrors: true,
 *   formatResponse: true,
 *   captureStackTrace: true
 * });
 *
 * app.use(errorHandler);
 * ```
 *
 * @example Structured logging
 * ```typescript
 * import { createLogger } from '@reuse/core/errors';
 *
 * const logger = createLogger({
 *   level: 'info',
 *   format: 'json',
 *   destination: 'combined.log'
 * });
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to process request', { error, requestId });
 * ```
 */
export * from './handlers';
export * from './monitoring';
export * from './logging';
export * from './handling-kit';
export { default as ErrorHandlingKit } from './handling-kit';
//# sourceMappingURL=index.d.ts.map