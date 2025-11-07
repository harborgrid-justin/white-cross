/**
 * Base service class providing common functionality for all services
 */

import { LoggerService } from '../logging/logger.service';
import { PaginationParams, PaginatedResponse, PaginationConstraints } from '../types/pagination';
import {
  buildPaginationQuery,
  processPaginatedResult,
  validatePaginationParams,
} from '../database/pagination';
import { ValidationResult, BulkOperationResult, ServiceResponse } from '../types/common';
import { validateUUID } from '../validation/commonValidators';

// Placeholder types for missing validation types
interface ErrorMetadata {
  [key: string]: any;
}

interface ApplicationError extends Error {
  code?: string;
  statusCode?: number;
}

interface SequelizeValidationErrorItem {
  message: string;
  type: string;
  path: string;
  value: any;
}

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

import { Model, ModelStatic, Transaction, Op, Sequelize } from 'sequelize';

/**
 * Base service configuration options
 */
export interface BaseServiceConfig {
  serviceName: string;
  tableName?: string;
  paginationConstraints?: PaginationConstraints;
  enableAuditLogging?: boolean;
  logger: LoggerService;
}

/**
 * Base service class with common functionality
 */
export abstract class BaseService {
  protected readonly serviceName: string;
  protected readonly tableName?: string;
  protected readonly paginationConstraints: PaginationConstraints;
  protected readonly enableAuditLogging: boolean;
  protected readonly logger: LoggerService;

  constructor(config: BaseServiceConfig) {
    this.serviceName = config.serviceName;
    this.tableName = config.tableName;
    this.paginationConstraints = config.paginationConstraints || {};
    this.enableAuditLogging = config.enableAuditLogging ?? true;
    this.logger = config.logger;
  }

  /**
   * Log service operation
   */
  protected logInfo(message: string): void {
    this.logger.log(`[${this.serviceName}] ${message}`, 'BaseService');
  }

  /**
   * Log service error
   */
  protected logError(
    message: string,
    error?: ApplicationError | Error,
  ): void {
    this.logger.error(`[${this.serviceName}] ${message}`, error as Error, 'BaseService');
  }

  /**
   * Log service warning
   */
  protected logWarning(message: string): void {
    this.logger.warn(`[${this.serviceName}] ${message}`, 'BaseService');
  }

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
   * Validate UUID and return validation result
   */
  protected validateId(id: string, fieldName: string = 'ID'): ValidationResult {
    return validateUUID(id, fieldName) as unknown as ValidationResult;
  }

  /**
   * Handle service errors with consistent error responses
   */
  protected handleError<T>(
    operation: string,
    error: ApplicationError | Error | unknown,
    metadata?: ErrorMetadata,
  ): ServiceResponse<T> {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    this.logError(`Error in ${operation}`, error, metadata);

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

  /**
   * Handle successful operations with consistent responses
   */
  protected handleSuccess<T>(
    operation: string,
    data: T,
    message?: string,
    metadata?: ErrorMetadata,
  ): ServiceResponse<T> {
    this.logInfo(`${operation} completed successfully`, metadata);

    return {
      success: true,
      data,
      message,
    };
  }

  /**
   * Normalize text data (trim, case handling)
   */
  protected normalizeText(
    text: string,
    options: {
      toLowerCase?: boolean;
      toUpperCase?: boolean;
      trim?: boolean;
    } = {},
  ): string {
    if (!text) return text;

    const { toLowerCase = false, toUpperCase = false, trim = true } = options;

    let normalized = text;

    if (trim) {
      normalized = normalized.trim();
    }

    if (toLowerCase) {
      normalized = normalized.toLowerCase();
    } else if (toUpperCase) {
      normalized = normalized.toUpperCase();
    }

    return normalized;
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
      return this.handleError(operation, error);
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

        this.logError(`Bulk operation ${operation} failed for item ${i + 1}`, error, {
          additionalContext: { item },
        });
      }
    }

    this.logInfo(`Bulk operation ${operation} completed`, {
      additionalContext: {
        processed: results.processed,
        successful: results.successful,
        failed: results.failed,
      },
    });

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
      this.logError(`Error checking ${entityName} existence`, error, {
        additionalContext: { id },
      });
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
   * Add audit trail entry (if enabled)
   */
  protected async addAuditEntry(
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
      this.logInfo('Audit entry', {
        userId,
        timestamp: new Date(),
        additionalContext: {
          action,
          entityType,
          entityId,
          changes,
          ...metadata,
        },
      });
    } catch (error) {
      this.logError('Failed to create audit entry', error, {
        additionalContext: {
          action,
          entityType,
          entityId,
        },
      });
    }
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

      await this.addAuditEntry('soft_delete', model.name, id, userId);

      return this.handleSuccess('soft delete', { success: true });
    } catch (error) {
      return this.handleError('soft delete', error);
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

      await this.addAuditEntry('reactivate', model.name, id, userId);

      return this.handleSuccess('reactivate', { success: true });
    } catch (error) {
      return this.handleError('reactivate', error);
    }
  }

  /**
   * CRITICAL: Find entity by ID or throw error
   * Eliminates duplicated pattern across 20+ services
   *
   * @param model - Sequelize model to query
   * @param id - Entity ID to find
   * @param entityName - Name of entity for error message
   * @param transaction - Optional transaction
   * @returns Promise<T> - Found entity
   * @throws Error if entity not found
   *
   * @example
   * const student = await this.findEntityOrFail(Student, studentId, 'Student', transaction);
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
   * CRITICAL: Create paginated query with common options
   * Eliminates duplicated pagination logic across services
   *
   * @param model - Sequelize model to query
   * @param options - Pagination and query options
   * @returns Promise<PaginatedResponse<T>> - Paginated result
   *
   * @example
   * const result = await this.createPaginatedQuery(Student, {
   *   page: 1,
   *   limit: 20,
   *   where: { isActive: true },
   *   include: [{ model: HealthRecord, as: 'healthRecords' }],
   *   order: [['lastName', 'ASC']]
   * });
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
   * CRITICAL: Reload entity with standard associations
   * Eliminates duplicated association reloading across services
   *
   * @param entity - Entity to reload
   * @param associations - Array of association configurations
   * @param transaction - Optional transaction
   * @returns Promise<T> - Reloaded entity with associations
   *
   * @example
   * await this.reloadWithStandardAssociations(medication, [
   *   {
   *     model: Student,
   *     as: 'student',
   *     attributes: ['id', 'firstName', 'lastName', 'studentNumber']
   *   },
   *   {
   *     model: User,
   *     as: 'prescribedBy',
   *     attributes: ['id', 'firstName', 'lastName', 'email']
   *   }
   * ], transaction);
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
   * Common pattern for filtering by date ranges
   *
   * @param field - Field name to filter
   * @param startDate - Start of date range (optional)
   * @param endDate - End of date range (optional)
   * @returns WHERE clause object
   *
   * @example
   * const dateFilter = this.buildDateRangeClause('createdAt', startDate, endDate);
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
   * Sanitize input data by removing undefined/null values
   * Useful for update operations where you only want to update provided fields
   *
   * @param data - Input data object
   * @param options - Sanitization options
   * @returns Sanitized data object
   *
   * @example
   * const sanitized = this.sanitizeInput(updateData, { removeNull: true, removeUndefined: true });
   */
  protected sanitizeInput<T extends Record<string, unknown>>(
    data: T,
    options: {
      removeNull?: boolean;
      removeUndefined?: boolean;
      removeEmptyStrings?: boolean;
    } = {},
  ): Partial<T> {
    const { removeNull = true, removeUndefined = true, removeEmptyStrings = false } = options;

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      // Skip undefined
      if (removeUndefined && value === undefined) {
        continue;
      }

      // Skip null
      if (removeNull && value === null) {
        continue;
      }

      // Skip empty strings
      if (removeEmptyStrings && value === '') {
        continue;
      }

      sanitized[key] = value;
    }

    return sanitized as Partial<T>;
  }

  /**
   * Validate required fields are present in input data
   *
   * @param data - Input data object
   * @param requiredFields - Array of required field names
   * @param fieldLabels - Optional mapping of field names to user-friendly labels
   * @returns ValidationResult
   *
   * @example
   * const validation = this.validateRequiredFields(data, ['studentId', 'medicationId'], {
   *   studentId: 'Student ID',
   *   medicationId: 'Medication ID'
   * });
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
}
