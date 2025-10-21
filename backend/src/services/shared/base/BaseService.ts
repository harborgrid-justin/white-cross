/**
 * Base service class providing common functionality for all services
 */

import { logger } from '../../../utils/logger';
import { 
  PaginationParams, 
  PaginatedResponse,
  PaginationConstraints 
} from '../types/pagination';
import { 
  buildPaginationQuery, 
  processPaginatedResult,
  validatePaginationParams 
} from '../database/pagination';
import { 
  ValidationResult, 
  BulkOperationResult,
  ServiceResponse 
} from '../types/common';
import { validateUUID } from '../validation/commonValidators';

/**
 * Base service configuration options
 */
export interface BaseServiceConfig {
  serviceName: string;
  tableName?: string;
  paginationConstraints?: PaginationConstraints;
  enableAuditLogging?: boolean;
}

/**
 * Base service class with common functionality
 */
export abstract class BaseService {
  protected readonly serviceName: string;
  protected readonly tableName?: string;
  protected readonly paginationConstraints: PaginationConstraints;
  protected readonly enableAuditLogging: boolean;

  constructor(config: BaseServiceConfig) {
    this.serviceName = config.serviceName;
    this.tableName = config.tableName;
    this.paginationConstraints = config.paginationConstraints || {};
    this.enableAuditLogging = config.enableAuditLogging ?? true;
  }

  /**
   * Log service operation
   */
  protected logInfo(message: string, metadata?: any): void {
    logger.info(`[${this.serviceName}] ${message}`, metadata);
  }

  /**
   * Log service error
   */
  protected logError(message: string, error?: any, metadata?: any): void {
    logger.error(`[${this.serviceName}] ${message}`, { error, ...metadata });
  }

  /**
   * Log service warning
   */
  protected logWarning(message: string, metadata?: any): void {
    logger.warn(`[${this.serviceName}] ${message}`, metadata);
  }

  /**
   * Validate and normalize pagination parameters
   */
  protected validatePagination(params: PaginationParams): ValidationResult & { 
    normalizedParams?: { page: number; limit: number; offset: number } 
  } {
    const validation = validatePaginationParams(params, this.paginationConstraints);
    
    if (!validation.isValid) {
      return validation;
    }

    const normalizedParams = buildPaginationQuery(params, this.paginationConstraints);
    
    return {
      ...validation,
      normalizedParams
    };
  }

  /**
   * Create a paginated response
   */
  protected createPaginatedResponse<T>(
    result: { rows: T[]; count: number },
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    return processPaginatedResult(result, page, limit);
  }

  /**
   * Validate UUID and return validation result
   */
  protected validateId(id: string, fieldName: string = 'ID'): ValidationResult {
    return validateUUID(id, fieldName);
  }

  /**
   * Handle service errors with consistent error responses
   */
  protected handleError<T>(
    operation: string,
    error: any,
    metadata?: any
  ): ServiceResponse<T> {
    const errorMessage = error?.message || 'An unexpected error occurred';
    
    this.logError(`Error in ${operation}`, error, metadata);
    
    // Don't expose internal errors to clients
    let clientMessage = errorMessage;
    if (error?.name === 'SequelizeConnectionError') {
      clientMessage = 'Database connection error. Please try again later.';
    } else if (error?.name === 'SequelizeValidationError') {
      clientMessage = `Validation failed: ${error.errors?.map((e: any) => e.message).join(', ')}`;
    } else if (error?.name === 'SequelizeUniqueConstraintError') {
      clientMessage = 'A record with this information already exists.';
    }

    return {
      success: false,
      error: clientMessage
    };
  }

  /**
   * Handle successful operations with consistent responses
   */
  protected handleSuccess<T>(
    operation: string,
    data: T,
    message?: string,
    metadata?: any
  ): ServiceResponse<T> {
    this.logInfo(`${operation} completed successfully`, metadata);
    
    return {
      success: true,
      data,
      message
    };
  }

  /**
   * Normalize text data (trim, case handling)
   */
  protected normalizeText(text: string, options: {
    toLowerCase?: boolean;
    toUpperCase?: boolean;
    trim?: boolean;
  } = {}): string {
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
    const errors = [];
    const now = new Date();
    
    if (date <= now) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be in the future`,
        code: 'INVALID_DATE'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Validate date is in the past
   */
  protected validatePastDate(date: Date, fieldName: string): ValidationResult {
    const errors = [];
    const now = new Date();
    
    if (date >= now) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be in the past`,
        code: 'INVALID_DATE'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  /**
   * Execute a database transaction with error handling
   */
  protected async executeTransaction<T>(
    operation: string,
    transactionCallback: (transaction: any) => Promise<T>,
    sequelize: any
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
    processor: (item: TInput, index: number) => Promise<TResult>
  ): Promise<BulkOperationResult> {
    const results: BulkOperationResult = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      results.processed++;
      
      try {
        await processor(item, i);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        this.logError(`Bulk operation ${operation} failed for item ${i + 1}`, error, { item });
      }
    }

    this.logInfo(`Bulk operation ${operation} completed`, {
      processed: results.processed,
      successful: results.successful,
      failed: results.failed
    });

    return results;
  }

  /**
   * Check if entity exists by ID
   */
  protected async checkEntityExists(
    model: any,
    id: string,
    entityName: string = 'Entity'
  ): Promise<{ exists: boolean; entity?: any; error?: string }> {
    try {
      const entity = await model.findByPk(id);
      
      if (!entity) {
        return {
          exists: false,
          error: `${entityName} not found`
        };
      }
      
      return {
        exists: true,
        entity
      };
    } catch (error) {
      this.logError(`Error checking ${entityName} existence`, error, { id });
      return {
        exists: false,
        error: `Error checking ${entityName} existence`
      };
    }
  }

  /**
   * Build common WHERE clause for text search
   */
  protected buildSearchClause(
    searchTerm: string,
    searchFields: string[],
    Op: any
  ): any {
    if (!searchTerm || searchFields.length === 0) {
      return {};
    }

    return {
      [Op.or]: searchFields.map(field => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` }
      }))
    };
  }

  /**
   * Add audit trail entry (if enabled)
   */
  protected async addAuditEntry(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    changes?: any,
    metadata?: any
  ): Promise<void> {
    if (!this.enableAuditLogging) {
      return;
    }

    try {
      // This would typically use an audit service
      // For now, just log the audit information
      this.logInfo('Audit entry', {
        action,
        entityType,
        entityId,
        userId,
        changes,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logError('Failed to create audit entry', error, {
        action,
        entityType,
        entityId
      });
    }
  }

  /**
   * Generic soft delete implementation
   */
  protected async softDelete(
    model: any,
    id: string,
    userId?: string
  ): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      const validation = this.validateId(id);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors[0]?.message || 'Invalid ID'
        };
      }

      const entity = await model.findByPk(id);
      if (!entity) {
        return {
          success: false,
          error: 'Record not found'
        };
      }

      await entity.update({ isActive: false });
      
      await this.addAuditEntry('soft_delete', model.name, id, userId);
      
      return this.handleSuccess('soft delete', { success: true });
    } catch (error) {
      return this.handleError('soft delete', error);
    }
  }

  /**
   * Generic reactivate implementation
   */
  protected async reactivate(
    model: any,
    id: string,
    userId?: string
  ): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      const validation = this.validateId(id);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors[0]?.message || 'Invalid ID'
        };
      }

      const entity = await model.findByPk(id);
      if (!entity) {
        return {
          success: false,
          error: 'Record not found'
        };
      }

      await entity.update({ isActive: true });
      
      await this.addAuditEntry('reactivate', model.name, id, userId);
      
      return this.handleSuccess('reactivate', { success: true });
    } catch (error) {
      return this.handleError('reactivate', error);
    }
  }
}
