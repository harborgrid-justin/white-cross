/**
 * Audit Logging Service
 * Handles core audit logging operations including CRUD operations,
 * authentication events, authorization events, and security events
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecutionContext } from '../types';
import { AuditAction, isPHIEntity } from '../types/database.enums';
import { AuditLog, AuditSeverity, ComplianceType } from '../models/audit-log.model';
import { AuditHelperService } from './audit-helper.service';

/**
 * Audit Logging Service
 *
 * Provides core audit logging functionality:
 * - CRUD operation logging (Create, Read, Update, Delete)
 * - Bulk operation logging
 * - Export operation logging
 * - Transaction operation logging
 * - Cache access logging
 * - Authentication event logging
 * - Authorization event logging
 * - Security event logging
 * - PHI access logging for HIPAA compliance
 * - Failed operation logging
 */
@Injectable()
export class AuditLoggingService {
  private readonly logger = new Logger(AuditLoggingService.name);

  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
    private readonly auditHelper: AuditHelperService,
  ) {}

  /**
   * Log entity creation
   */
  async logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
    transaction?: any,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.CREATE,
      entityType,
      entityId,
      context,
      newValues: data,
      previousValues: null,
      changes: data,
      success: true,
      transaction,
    });
  }

  /**
   * Log entity read/access
   * Only logs PHI entity access for performance
   */
  async logRead(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    transaction?: any,
  ): Promise<void> {
    // Only log PHI entity access for performance
    if (isPHIEntity(entityType)) {
      await this.createAuditEntry({
        action: AuditAction.READ,
        entityType,
        entityId,
        context,
        changes: null,
        previousValues: null,
        newValues: null,
        success: true,
        transaction,
      });
    }
  }

  /**
   * Log entity update with before/after values
   */
  async logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: unknown; after: unknown }>,
    transaction?: any,
  ): Promise<void> {
    const previousValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(changes)) {
      previousValues[key] = value.before;
      newValues[key] = value.after;
    }

    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType,
      entityId,
      context,
      changes,
      previousValues: this.auditHelper.sanitizeSensitiveData(previousValues),
      newValues: this.auditHelper.sanitizeSensitiveData(newValues),
      success: true,
      transaction,
    });
  }

  /**
   * Log entity deletion
   */
  async logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
    transaction?: any,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.DELETE,
      entityType,
      entityId,
      context,
      previousValues: data,
      newValues: null,
      changes: data,
      success: true,
      transaction,
    });
  }

  /**
   * Log bulk operations
   */
  async logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
    transaction?: any,
  ): Promise<void> {
    const action = operation.includes('DELETE')
      ? AuditAction.BULK_DELETE
      : AuditAction.BULK_UPDATE;

    await this.createAuditEntry({
      action,
      entityType,
      entityId: null,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      metadata,
      success: true,
      severity: AuditSeverity.HIGH,
      transaction,
    });
  }

  /**
   * Log export operations
   */
  async logExport(
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.EXPORT,
      entityType,
      entityId: null,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      metadata,
      success: true,
      severity: isPHIEntity(entityType)
        ? AuditSeverity.HIGH
        : AuditSeverity.MEDIUM,
    });
  }

  /**
   * Log transaction operations
   */
  async logTransaction(
    operation: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    const action = operation.includes('COMMIT')
      ? AuditAction.TRANSACTION_COMMIT
      : AuditAction.TRANSACTION_ROLLBACK;

    await this.createAuditEntry({
      action,
      entityType: 'Transaction',
      entityId: metadata.transactionId as string,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      metadata,
      success: operation.includes('COMMIT'),
    });
  }

  /**
   * Log cache access operations
   */
  async logCacheAccess(
    operation: string,
    cacheKey: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const action =
      operation === 'READ'
        ? AuditAction.CACHE_READ
        : operation === 'WRITE'
          ? AuditAction.CACHE_WRITE
          : AuditAction.CACHE_DELETE;

    // Only log cache operations for PHI data
    const isPHICache =
      cacheKey.toLowerCase().includes('health') ||
      cacheKey.toLowerCase().includes('student') ||
      cacheKey.toLowerCase().includes('medication');

    if (isPHICache) {
      try {
        await (this.auditLogModel as any).create({
          action,
          entityType: 'Cache',
          entityId: null,
          userId: null,
          userName: 'SYSTEM',
          changes: null,
          previousValues: null,
          newValues: null,
          ipAddress: null,
          userAgent: null,
          requestId: null,
          sessionId: null,
          isPHI: true,
          complianceType: ComplianceType.HIPAA,
          severity: AuditSeverity.LOW,
          success: true,
          errorMessage: null,
          metadata: { cacheKey, ...metadata },
          tags: ['cache', 'system'],
        });
      } catch (error) {
        this.logger.warn(`Failed to log cache access: ${error.message}`);
      }
    } else {
      this.logger.debug(`Cache ${action}: ${cacheKey}`);
    }
  }

  /**
   * Log authentication events (login, logout, password change)
   */
  async logAuthEvent(
    action:
      | 'LOGIN'
      | 'LOGOUT'
      | 'PASSWORD_CHANGE'
      | 'MFA_ENABLED'
      | 'MFA_DISABLED',
    userId: string,
    context: ExecutionContext,
    success: boolean = true,
    errorMessage?: string,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType: 'User',
      entityId: userId,
      context,
      changes: { action },
      previousValues: null,
      newValues: null,
      success,
      errorMessage: errorMessage || null,
      severity: success ? AuditSeverity.LOW : AuditSeverity.HIGH,
      tags: ['authentication', action.toLowerCase()],
    });
  }

  /**
   * Log authorization events (permission checks, role changes)
   */
  async logAuthzEvent(
    action: string,
    userId: string,
    resource: string,
    context: ExecutionContext,
    granted: boolean,
    reason?: string,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType: 'Authorization',
      entityId: userId,
      context,
      changes: { action, resource, granted, reason },
      previousValues: null,
      newValues: null,
      success: granted,
      errorMessage: granted ? null : reason || 'Access denied',
      severity: granted ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      tags: ['authorization', granted ? 'granted' : 'denied'],
    });
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    eventType: string,
    description: string,
    context: ExecutionContext,
    severity: AuditSeverity = AuditSeverity.HIGH,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType: 'SecurityEvent',
      entityId: null,
      context,
      changes: { eventType, description },
      previousValues: null,
      newValues: null,
      metadata,
      success: true,
      severity,
      tags: ['security', eventType],
    });
  }

  /**
   * Log PHI access for HIPAA compliance
   * Used by model hooks to track PHI field modifications
   */
  async logPHIAccess(
    options: {
      entityType: string;
      entityId: string;
      action: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE';
      changedFields?: string[];
      userId?: string;
      userName?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, unknown>;
    },
    transaction?: any,
  ): Promise<void> {
    const action = AuditAction[options.action];
    const context: ExecutionContext = {
      userId: options.userId || 'system',
      userName: options.userName || 'SYSTEM',
      userRole: 'SYSTEM',
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
      timestamp: new Date(),
    };

    await this.createAuditEntry({
      action,
      entityType: options.entityType,
      entityId: options.entityId,
      context,
      changes: options.changedFields
        ? { changedFields: options.changedFields }
        : null,
      previousValues: null,
      newValues: null,
      metadata: {
        ...options.metadata,
        phiAccess: true,
        changedFields: options.changedFields,
      },
      success: true,
      severity: AuditSeverity.MEDIUM,
      tags: ['phi', 'model-hook', options.entityType.toLowerCase()],
      transaction,
    });
  }

  /**
   * Log failed operation
   */
  async logFailure(
    action: AuditAction,
    entityType: string,
    entityId: string | null,
    context: ExecutionContext,
    errorMessage: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.createAuditEntry({
      action,
      entityType,
      entityId,
      context,
      changes: null,
      previousValues: null,
      newValues: null,
      success: false,
      errorMessage,
      metadata,
      severity: AuditSeverity.HIGH,
      tags: ['failure', 'error'],
    });
  }

  /**
   * Create audit entry in database
   * Private helper method to centralize audit log creation
   */
  private async createAuditEntry(params: {
    action: AuditAction;
    entityType: string;
    entityId: string | null;
    context: ExecutionContext;
    changes: any;
    previousValues?: any;
    newValues?: any;
    metadata?: any;
    success?: boolean;
    errorMessage?: string | null;
    severity?: AuditSeverity;
    tags?: string[];
    transaction?: any;
  }): Promise<void> {
    const {
      action,
      entityType,
      entityId,
      context,
      changes,
      previousValues = null,
      newValues = null,
      metadata = null,
      success = true,
      errorMessage = null,
      severity,
      tags = [],
      transaction = null,
    } = params;

    try {
      // Determine if this is PHI data
      const isPHI = isPHIEntity(entityType);

      // Determine compliance type
      const complianceType = this.auditHelper.determineComplianceType(entityType, isPHI);

      // Determine severity if not provided
      const auditSeverity =
        severity || this.auditHelper.determineSeverity(action, entityType, success);

      // Sanitize sensitive data
      const sanitizedChanges = changes
        ? this.auditHelper.sanitizeSensitiveData(changes)
        : null;
      const sanitizedPreviousValues = previousValues
        ? this.auditHelper.sanitizeSensitiveData(previousValues)
        : null;
      const sanitizedNewValues = newValues
        ? this.auditHelper.sanitizeSensitiveData(newValues)
        : null;

      // Create options for the audit log entry
      const createOptions: any = {
        action,
        entityType,
        entityId,
        userId: context.userId || null,
        userName: context.userName || null,
        changes: sanitizedChanges,
        previousValues: sanitizedPreviousValues,
        newValues: sanitizedNewValues,
        ipAddress: context.ipAddress || null,
        userAgent: context.userAgent || null,
        requestId: context.transactionId || context.correlationId || null,
        sessionId: context.correlationId || null,
        isPHI,
        complianceType,
        severity: auditSeverity,
        success,
        errorMessage,
        metadata,
        tags: [...tags, entityType.toLowerCase(), action.toLowerCase()],
      };

      // If transaction is provided, use it for atomicity
      if (transaction) {
        await (this.auditLogModel as any).create(createOptions, {
          transaction,
        });
      } else {
        await (this.auditLogModel as any).create(createOptions);
      }

      this.logger.debug(
        `AUDIT [${action}] ${entityType}:${entityId || 'bulk'} by ${context.userId || 'SYSTEM'} - ${success ? 'SUCCESS' : 'FAILED'}${transaction ? ' [IN TRANSACTION]' : ''}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create audit entry: ${error.message}`,
        error.stack,
      );
      // Don't throw - audit failures shouldn't break operations
    }
  }
}
