import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { RequestContextService } from '@/common/context/request-context.service';
import { LoggerService } from '@/common/logging/logger.service';
import {
  PaginatedResponse,
  PaginationConstraints,
  PaginationParams,
} from '@/database/types/pagination.types';
import {
  buildPaginationQuery,
  processPaginatedResult,
  validatePaginationParams,
} from '@/database/pagination';
import { BulkOperationResult, ServiceResponse, ValidationResult } from '@/common/types/common';
import { validateUUID as validateUUIDUtil } from '@/common/validation/commonValidators';
import { Model, ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

/**
 * Base Service Options
 * Configuration options for base service
 */
export interface BaseServiceOptions {
  /**
   * Service name for logging
   * Defaults to constructor name
   */
  serviceName?: string;

  /**
   * Whether to automatically log all errors
   * Default: true
   */
  autoLogErrors?: boolean;

  /**
   * Whether to include stack traces in error logs
   * Default: true (but never exposed to clients)
   */
  includeStackTrace?: boolean;

  /**
   * Table name for database operations
   */
  tableName?: string;

  /**
   * Pagination constraints
   */
  paginationConstraints?: PaginationConstraints;

  /**
   * Whether to enable audit logging
   * Default: true
   */
  enableAuditLogging?: boolean;

  /**
   * Custom logger service (optional)
   */
  logger?: LoggerService;
}

/**
 * Base Service Configuration (legacy support)
 */
export interface BaseServiceConfig {
  serviceName: string;
  tableName?: string;
  paginationConstraints?: PaginationConstraints;
  enableAuditLogging?: boolean;
  logger: LoggerService;
}

/**
 * Validation error codes
 */
enum ValidationErrorCode {
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_VALUE = 'INVALID_VALUE',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_SMALL = 'TOO_SMALL',
  TOO_LARGE = 'TOO_LARGE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
}

/**
 * Error metadata interface
 */
interface ErrorMetadata {
  [key: string]: any;
}

/**
 * Application error interface (legacy)
 */
interface ApplicationError extends Error {
  code?: string;
  statusCode?: number;
}

/**
 * Sequelize validation error item
 */
interface SequelizeValidationErrorItem {
  message: string;
  type: string;
  path: string;
  value: any;
}

/**
 * Base Service
 *
 * Comprehensive abstract base class for all services in the application.
 * Combines functionality from multiple BaseService implementations:
 * - Standardized logging and error handling
 * - Request context integration
 * - Database operations and pagination
 * - Validation helpers
 * - Audit logging
 * - HIPAA compliance
 */
@Injectable()
export abstract class BaseService {
  protected readonly logger: Logger | LoggerService;
  protected readonly options: Required<BaseServiceOptions>;
  protected readonly serviceName: string;
  protected readonly tableName?: string;
  protected readonly paginationConstraints: PaginationConstraints;
  protected readonly enableAuditLogging: boolean;

  // Legacy properties for backward compatibility
  protected readonly requestContext?: RequestContextService;

  constructor(
    requestContextOrOptions?: RequestContextService | BaseServiceOptions | BaseServiceConfig,
    options?: BaseServiceOptions,
  ) {
    // Handle different constructor signatures for backward compatibility
    if (requestContextOrOptions instanceof RequestContextService) {
      // Legacy constructor: (requestContext, options?)
      this.requestContext = requestContextOrOptions;
      this.options = {
        serviceName: options?.serviceName || this.constructor.name,
        autoLogErrors: options?.autoLogErrors ?? true,
        includeStackTrace: options?.includeStackTrace ?? true,
        tableName: options?.tableName,
        paginationConstraints: options?.paginationConstraints || {},
        enableAuditLogging: options?.enableAuditLogging ?? true,
        logger: options?.logger,
      };
    } else if (requestContextOrOptions && 'logger' in requestContextOrOptions) {
      // Config-based constructor: (config)
      const config = requestContextOrOptions as BaseServiceConfig;
      this.options = {
        serviceName: config.serviceName,
        autoLogErrors: true,
        includeStackTrace: true,
        tableName: config.tableName,
        paginationConstraints: config.paginationConstraints || {},
        enableAuditLogging: config.enableAuditLogging ?? true,
        logger: config.logger,
      };
    } else {
      // Options-based constructor: (options?)
      const opts = requestContextOrOptions as BaseServiceOptions;
      this.options = {
        serviceName: opts?.serviceName || this.constructor.name,
        autoLogErrors: opts?.autoLogErrors ?? true,
        includeStackTrace: opts?.includeStackTrace ?? true,
        tableName: opts?.tableName,
        paginationConstraints: opts?.paginationConstraints || {},
        enableAuditLogging: opts?.enableAuditLogging ?? true,
        logger: opts?.logger,
      };
    }

    this.serviceName = this.options.serviceName;
    this.tableName = this.options.tableName;
    this.paginationConstraints = this.options.paginationConstraints;
    this.enableAuditLogging = this.options.enableAuditLogging;

    // Initialize logger
    if (this.options.logger) {
      this.logger = this.options.logger;
    } else {
      this.logger = new Logger(this.serviceName);
    }
  }

  // ==================== Logging Methods ====================

  /**
   * Log an info message with consistent formatting
   */
  protected logInfo(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.log(message, context);
    } else {
      this.logger.log(`[${this.serviceName}] ${message}`, 'BaseService');
    }
  }

  /**
   * Log an error message with consistent formatting
   */
  protected logError(message: string, trace?: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.error(message, trace, context);
    } else {
      this.logger.error(`[${this.serviceName}] ${message}`, trace as any, 'BaseService');
    }
  }

  /**
   * Log a warning message with consistent formatting
   */
  protected logWarning(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.warn(message, context);
    } else {
      this.logger.warn(`[${this.serviceName}] ${message}`, 'BaseService');
    }
  }

  /**
   * Log a debug message with consistent formatting
   */
  protected logDebug(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.debug(message, context);
    } else {
      this.logger.debug(`[${this.serviceName}] ${message}`, 'BaseService');
    }
  }

  /**
   * Log a verbose message with consistent formatting
   */
  protected logVerbose(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.verbose(message, context);
    } else {
      // LoggerService may not have verbose, use debug
      this.logger.debug(`[${this.serviceName}] ${message}`, 'BaseService');
    }
  }

  // ==================== Error Handling ====================

  /**
   * Handle and log errors consistently across services
   */
  protected handleError(error: any, operation: string, context?: string): void {
    const errorMessage = `Failed to ${operation}: ${
      error instanceof Error ? error.message : String(error)
    }`;
    this.logError(errorMessage, error instanceof Error ? error.stack : undefined, context);
    throw error;
  }

  /**
   * Handle errors with HIPAA-compliant logging
   * Logs full error details internally but never exposes PHI to clients
   */
  protected handleErrorHipaa(message: string, error: unknown): never {
    // Build context for logging
    const context = {
      ...(this.requestContext?.getLogContext() || {}),
      message,
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    };

    if (this.options.autoLogErrors) {
      if (this.options.includeStackTrace && error instanceof Error && error.stack) {
        this.logError(`${message}: ${error.message}`, error.stack, JSON.stringify(context));
      } else {
        this.logError(
          `${message}: ${error instanceof Error ? error.message : String(error)}`,
          undefined,
          JSON.stringify(context),
        );
      }
    }

    // Rethrow known exceptions as-is
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }

    // Wrap unknown errors in InternalServerErrorException
    // Never expose internal details to clients (HIPAA compliance)
    throw new InternalServerErrorException(message || 'An unexpected error occurred');
  }

  /**
   * Handle service errors with consistent error responses (legacy)
   */
  protected handleErrorLegacy<T>(
    operation: string,
    error: unknown,
  ): ServiceResponse<T> {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    this.logError(`Error in ${operation}`, error as Error);

    // Don't expose internal errors to clients
    let clientMessage = errorMessage;

    if (error && typeof error === 'object' && 'name' in error) {
      const errorName = (error as { name: string }).name;

      if (errorName === 'SequelizeConnectionError') {
        clientMessage = 'Database connection error. Please try again later.';
      } else if (errorName === 'SequelizeValidationError') {
        const errors = (error as { errors?: SequelizeValidationErrorItem[] }).errors;
        clientMessage = `Validation failed: ${errors?.map((e) => e.message).join(', ') || 'Unknown validation error'}`;
      } else if (errorName === 'SequelizeUniqueConstraintError') {
        clientMessage = 'A record with this information already exists.';
      }
    }

    return {
      success: false,
      error: clientMessage,
    };
  }

  // ==================== Validation Methods ====================

  /**
   * Validate required parameters and throw descriptive errors
   */
  protected validateRequired(params: Record<string, any>, operation: string): void {
    const missing = Object.entries(params)
      .filter(([, value]) => value === undefined || value === null)
      .map(([key]) => key);

    if (missing.length > 0) {
      const error = new Error(
        `Missing required parameters for ${operation}: ${missing.join(', ')}`,
      );
      this.handleError(error, operation);
    }
  }

  /**
   * Validate UUID format
   * @throws BadRequestException if invalid
   */
  protected validateUUID(id: string, fieldName: string = 'ID'): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }
  }

  /**
   * Validate required field
   * @throws BadRequestException if missing or empty
   */
  protected validateRequiredField(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(`${fieldName} is required`);
    }
  }

  /**
   * Validate date is not in the future
   * @throws BadRequestException if date is future
   */
  protected validateNotFuture(date: Date | string, fieldName: string): void {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj > new Date()) {
      throw new BadRequestException(`${fieldName} cannot be in the future`);
    }
  }

  /**
   * Validate date is not in the past
   * @throws BadRequestException if date is past
   */
  protected validateNotPast(date: Date | string, fieldName: string): void {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj < new Date()) {
      throw new BadRequestException(`${fieldName} cannot be in the past`);
    }
  }

  /**
   * Validate email format
   * @throws BadRequestException if invalid
   */
  protected validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  /**
   * Validate phone number format (US format)
   * @throws BadRequestException if invalid
   */
  protected validatePhoneNumber(phone: string): void {
    const phoneRegex =
      /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException(
        'Invalid phone number format. Expected: (123) 456-7890',
      );
    }
  }

  /**
   * Validate UUID and return validation result
   */
  protected validateId(id: string, fieldName: string = 'ID'): ValidationResult {
    return validateUUIDUtil(id, fieldName) as unknown as ValidationResult;
  }

  /**
   * Validate date is in the future
   */
  protected validateFutureDate(date: Date, fieldName: string): ValidationResult {
    const errors: Array<{
      field: string;
      message: string;
      code: ValidationErrorCode;
    }> = [];
    const now = new Date();

    if (date <= now) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be in the future`,
        code: ValidationErrorCode.INVALID_VALUE,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  /**
   * Validate date is in the past
   */
  protected validatePastDate(date: Date, fieldName: string): ValidationResult {
    const errors: Array<{
      field: string;
      message: string;
      code: ValidationErrorCode;
    }> = [];
    const now = new Date();

    if (date >= now) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be in the past`,
        code: ValidationErrorCode.INVALID_VALUE,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  /**
   * Validate required fields are present in input data
   */
  protected validateRequiredFields(
    data: Record<string, unknown>,
    requiredFields: string[],
    fieldLabels?: Record<string, string>,
  ): ValidationResult {
    const errors: Array<{
      field: string;
      message: string;
      code: ValidationErrorCode;
    }> = [];

    for (const field of requiredFields) {
      const value = data[field];
      const label = fieldLabels?.[field] || field;

      if (value === undefined || value === null || value === '') {
        errors.push({
          field,
          message: `${label} is required`,
          code: ValidationErrorCode.REQUIRED_FIELD,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  // ==================== Execution Helpers ====================

  /**
   * Execute operation with standardized error handling and logging
   */
  protected async executeWithLogging<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    try {
      this.logDebug(`Starting ${operation}`, context);
      const result = await fn();
      this.logDebug(`Completed ${operation}`, context);
      return result;
    } catch (error) {
      this.handleError(error, operation, context);
      throw error; // This won't be reached due to handleError throwing, but keeps TypeScript happy
    }
  }

  /**
   * Execute operation synchronously with standardized error handling and logging
   */
  protected executeSync<T>(operation: string, fn: () => T, context?: string): T {
    try {
      this.logDebug(`Starting ${operation}`, context);
      const result = fn();
      this.logDebug(`Completed ${operation}`, context);
      return result;
    } catch (error) {
      this.handleError(error, operation, context);
      throw error; // This won't be reached due to handleError throwing, but keeps TypeScript happy
    }
  }

  // ==================== Database Operations ====================

  /**
   * Validate and normalize pagination parameters
   */
  protected validatePagination(params: PaginationParams): ValidationResult & {
    normalizedParams?: { page: number; limit: number; offset: number };
  } {
    const validation = validatePaginationParams(params, this.paginationConstraints);

    if (!validation.isValid) {
      return validation;
    }

    const normalizedParams = buildPaginationQuery(params, this.paginationConstraints);

    return {
      ...validation,
      normalizedParams,
    };
  }

  /**
   * Create a paginated response
   */
  protected createPaginatedResponse<T>(
    result: { rows: T[]; count: number },
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return processPaginatedResult(result, page, limit);
  }

  /**
   * Execute a database transaction with error handling
   */
  protected async executeTransaction<T>(
    operation: string,
    transactionCallback: (transaction: Transaction) => Promise<T>,
    sequelize: Sequelize,
  ): Promise<ServiceResponse<T>> {
    const transaction = await sequelize.transaction();

    try {
      const result = await transactionCallback(transaction);
      await transaction.commit();

      return this.handleSuccess(operation, result);
    } catch (error) {
      await transaction.rollback();
      return this.handleErrorLegacy(operation, error);
    }
  }

  /**
   * Bulk operation helper with progress tracking
   */
  protected async executeBulkOperation<TInput, TResult>(
    operation: string,
    items: TInput[],
    processor: (item: TInput, index: number) => Promise<TResult>,
  ): Promise<BulkOperationResult> {
    const results: BulkOperationResult = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      results.processed++;

      try {
        await processor(item, i);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );

        this.logError(`Bulk operation ${operation} failed for item ${i + 1}`, error as Error);
      }
    }

    this.logInfo(`Bulk operation ${operation} completed`);

    return results;
  }

  /**
   * Check if entity exists by ID
   */
  protected async checkEntityExists<T extends Model>(
    model: ModelStatic<T>,
    id: string,
    entityName: string = 'Entity',
  ): Promise<{ exists: boolean; entity?: T; error?: string }> {
    try {
      const entity = await model.findByPk(id);

      if (!entity) {
        return {
          exists: false,
          error: `${entityName} not found`,
        };
      }

      return {
        exists: true,
        entity,
      };
    } catch (error) {
      this.logError(`Error checking ${entityName} existence`, error as Error);
      return {
        exists: false,
        error: `Error checking ${entityName} existence`,
      };
    }
  }

  /**
   * Build common WHERE clause for text search
   */
  protected buildSearchClause(searchTerm: string, searchFields: string[]): Record<string, unknown> {
    if (!searchTerm || searchFields.length === 0) {
      return {};
    }

    return {
      [Op.or]: searchFields.map((field) => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` },
      })),
    } as Record<string, unknown>;
  }

  /**
   * Find entity by ID or throw error
   */
  protected async findEntityOrFail<T extends Model>(
    model: ModelStatic<T>,
    id: string,
    entityName: string = 'Entity',
    transaction?: Transaction,
  ): Promise<T> {
    const entity = await model.findByPk(id, { transaction });

    if (!entity) {
      throw new Error(`${entityName} not found: ${id}`);
    }

    return entity;
  }

  /**
   * Create paginated query with common options
   */
  protected async createPaginatedQuery<T extends Model>(
    model: ModelStatic<T>,
    options: {
      page?: number;
      limit?: number;
      where?: Record<string, unknown>;
      include?: unknown[];
      order?: unknown[];
      attributes?: string[];
    },
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 20, where = {}, include = [], order = [], attributes } = options;

    // Validate pagination
    const validation = this.validatePagination({ page, limit });
    if (!validation.isValid || !validation.normalizedParams) {
      throw new Error(validation.errors?.[0]?.message || 'Invalid pagination parameters');
    }

    const { offset } = validation.normalizedParams;

    // Execute query
    const { rows, count } = await model.findAndCountAll({
      where: where as any,
      include: include as any,
      order: order as any,
      attributes,
      offset,
      limit,
      distinct: true, // Important for proper counting with joins
    });

    // Create paginated response
    return this.createPaginatedResponse({ rows, count }, page, limit);
  }

  /**
   * Reload entity with standard associations
   */
  protected async reloadWithStandardAssociations<T extends Model>(
    entity: T,
    associations: Array<{
      model: ModelStatic<Model>;
      as: string;
      attributes?: string[];
      include?: unknown[];
    }>,
    transaction?: Transaction,
  ): Promise<T> {
    await entity.reload({
      include: associations as any,
      transaction,
    });

    return entity;
  }

  /**
   * Build date range WHERE clause
   */
  protected buildDateRangeClause(
    field: string,
    startDate?: Date,
    endDate?: Date,
  ): Record<string, unknown> {
    const dateClause: Record<string, unknown> = {};

    if (startDate || endDate) {
      const rangeConditions: Record<string | symbol, unknown> = {};

      if (startDate) {
        rangeConditions[Op.gte] = startDate;
      }

      if (endDate) {
        rangeConditions[Op.lte] = endDate;
      }

      dateClause[field] = rangeConditions;
    }

    return dateClause;
  }

  /**
   * Generic soft delete implementation
   */
  protected async softDelete<T extends Model>(
    model: ModelStatic<T>,
    id: string,
    userId?: string,
  ): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      const validation = this.validateId(id);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors[0]?.message || 'Invalid ID',
        };
      }

      const entity = await model.findByPk(id);
      if (!entity) {
        return {
          success: false,
          error: 'Record not found',
        };
      }

      await entity.update({ isActive: false } as unknown as Partial<T>);

      await this.logAuditEvent('soft_delete', model.name, id, userId);

      return this.handleSuccess('soft delete', { success: true });
    } catch (error) {
      return this.handleErrorLegacy('soft delete', error);
    }
  }

  /**
   * Generic reactivate implementation
   */
  protected async reactivate<T extends Model>(
    model: ModelStatic<T>,
    id: string,
    userId?: string,
  ): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      const validation = this.validateId(id);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors[0]?.message || 'Invalid ID',
        };
      }

      const entity = await model.findByPk(id);
      if (!entity) {
        return {
          success: false,
          error: 'Record not found',
        };
      }

      await entity.update({ isActive: true } as unknown as Partial<T>);

      await this.logAuditEvent('reactivate', model.name, id, userId);

      return this.handleSuccess('reactivate', { success: true });
    } catch (error) {
      return this.handleErrorLegacy('reactivate', error);
    }
  }

  // ==================== Input Sanitization ====================

  /**
   * Sanitize input data by removing null/undefined values and trimming strings
   */
  protected sanitizeInput<T extends Record<string, any>>(
    input: T,
    options: {
      removeNull?: boolean;
      removeUndefined?: boolean;
      trimStrings?: boolean;
      removeEmptyStrings?: boolean;
    } = {},
  ): Partial<T> {
    const {
      removeNull = true,
      removeUndefined = true,
      trimStrings = true,
      removeEmptyStrings = false,
    } = options;

    const sanitized: Partial<T> = {};

    for (const [key, value] of Object.entries(input)) {
      let processedValue = value;

      // Remove null values if requested
      if (removeNull && processedValue === null) {
        continue;
      }

      // Remove undefined values if requested
      if (removeUndefined && processedValue === undefined) {
        continue;
      }

      // Trim strings if requested
      if (trimStrings && typeof processedValue === 'string') {
        processedValue = processedValue.trim();

        // Remove empty strings if requested
        if (removeEmptyStrings && processedValue === '') {
          continue;
        }
      }

      // Recursively sanitize nested objects
      if (processedValue && typeof processedValue === 'object' && !Array.isArray(processedValue)) {
        processedValue = this.sanitizeInput(processedValue, options);
      }

      sanitized[key as keyof T] = processedValue;
    }

    return sanitized;
  }

  // ==================== Audit & Context Methods ====================

  /**
   * Add audit trail entry (if enabled)
   */
  protected async logAuditEvent(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    changes?: Record<string, unknown>,
    metadata?: ErrorMetadata,
  ): Promise<void> {
    if (!this.enableAuditLogging) {
      return;
    }

    try {
      // This would typically use an audit service
      // For now, just log the audit information
      this.logInfo(`Audit entry: ${action} on ${entityType}`);
    } catch (error) {
      this.logError('Failed to create audit entry', error as Error);
    }
  }

  /**
   * Get current user ID from request context
   * @throws BadRequestException if not authenticated
   */
  protected requireUserId(): string {
    if (!this.requestContext) {
      throw new BadRequestException('Request context not available');
    }
    const userId = this.requestContext.userId;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return userId;
  }

  /**
   * Check if user has required role
   * @throws BadRequestException if role missing
   */
  protected requireRole(role: string): void {
    if (!this.requestContext) {
      throw new BadRequestException('Request context not available');
    }
    if (!this.requestContext.hasRole(role)) {
      throw new BadRequestException(`Requires ${role} role`);
    }
  }

  /**
   * Check if user has any of the required roles
   * @throws BadRequestException if no matching role
   */
  protected requireAnyRole(roles: string[]): void {
    if (!this.requestContext) {
      throw new BadRequestException('Request context not available');
    }
    if (!this.requestContext.hasAnyRole(roles)) {
      throw new BadRequestException(
        `Requires one of the following roles: ${roles.join(', ')}`,
      );
    }
  }

  /**
   * Get audit context for logging operations
   */
  protected getAuditContext() {
    return this.requestContext?.getAuditContext() || {};
  }

  /**
   * Create audit log entry
   */
  protected createAuditLog(
    action: string,
    resource: string,
    resourceId?: string,
    details?: any,
  ) {
    return {
      ...this.getAuditContext(),
      action,
      resource,
      resourceId,
      details,
    };
  }

  // ==================== Logging Methods ====================

  /**
   * Log an informational message
   */
  protected logInfo(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.log(message, context || this.serviceName);
    } else {
      this.logger.log(message, context || this.serviceName);
    }
  }

  /**
   * Log an error message
   */
  protected logError(message: string, error?: any, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.error(message, error?.stack || error, context || this.serviceName);
    } else {
      this.logger.error(message, error, context || this.serviceName);
    }
  }

  /**
   * Log a debug message
   */
  protected logDebug(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.debug(message, context || this.serviceName);
    } else {
      this.logger.debug(message, context || this.serviceName);
    }
  }

  /**
   * Log a warning message
   */
  protected logWarning(message: string, context?: string): void {
    if (this.logger instanceof Logger) {
      this.logger.warn(message, context || this.serviceName);
    } else {
      this.logger.warn(message, context || this.serviceName);
    }
  }

  // ==================== Legacy Success Handler ====================

  /**
   * Handle successful operations with consistent responses
   */
  protected handleSuccess<T>(
    operation: string,
    data: T,
    message?: string,
  ): ServiceResponse<T> {
    this.logInfo(`${operation} completed successfully`);

    return {
      success: true,
      data,
      message,
    };
  }
}
