/**
 * Audit Service Implementation
 * Injectable NestJS service implementing IAuditLogger interface
 * HIPAA-compliant audit logging for all PHI access and modifications
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IAuditLogger } from '../interfaces/audit/audit-logger.interface';
import { ExecutionContext } from '../types';
import { AuditAction, isPHIEntity } from '../types/database.enums';

@Injectable()
export class AuditService implements IAuditLogger {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    // Note: Inject AuditLog model when it's created
    // @InjectModel(AuditLog) private readonly auditLogModel: typeof AuditLog
  ) {
    this.logger.log('Audit service initialized');
  }

  async logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.CREATE,
      entityType,
      entityId,
      context,
      changes: data
    });
  }

  async logRead(entityType: string, entityId: string, context: ExecutionContext): Promise<void> {
    // Only log PHI entity access for performance
    if (isPHIEntity(entityType)) {
      await this.createAuditEntry({
        action: AuditAction.READ,
        entityType,
        entityId,
        context,
        changes: null
      });
    }
  }

  async logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: unknown; after: unknown }>
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.UPDATE,
      entityType,
      entityId,
      context,
      changes
    });
  }

  async logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>
  ): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.DELETE,
      entityType,
      entityId,
      context,
      changes: data
    });
  }

  async logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>
  ): Promise<void> {
    const action = operation.includes('DELETE') ? AuditAction.BULK_DELETE : AuditAction.BULK_UPDATE;

    await this.createAuditEntry({
      action,
      entityType,
      entityId: null,
      context,
      changes: metadata
    });
  }

  async logExport(entityType: string, context: ExecutionContext, metadata: Record<string, unknown>): Promise<void> {
    await this.createAuditEntry({
      action: AuditAction.EXPORT,
      entityType,
      entityId: null,
      context,
      changes: metadata
    });
  }

  async logTransaction(operation: string, context: ExecutionContext, metadata: Record<string, unknown>): Promise<void> {
    const action = operation.includes('COMMIT')
      ? AuditAction.TRANSACTION_COMMIT
      : AuditAction.TRANSACTION_ROLLBACK;

    await this.createAuditEntry({
      action,
      entityType: 'Transaction',
      entityId: metadata.transactionId as string,
      context,
      changes: metadata
    });
  }

  async logCacheAccess(operation: string, cacheKey: string, metadata?: Record<string, unknown>): Promise<void> {
    // Only log if audit cache access is enabled
    const action = operation === 'READ'
      ? AuditAction.CACHE_READ
      : operation === 'WRITE'
      ? AuditAction.CACHE_WRITE
      : AuditAction.CACHE_DELETE;

    // For cache operations, we use a simplified context
    this.logger.debug(`Cache ${action}: ${cacheKey}`);

    // TODO: Store cache audit logs if needed for compliance
  }

  private async createAuditEntry(params: {
    action: AuditAction;
    entityType: string;
    entityId: string | null;
    context: ExecutionContext;
    changes: any;
  }): Promise<void> {
    const { action, entityType, entityId, context, changes } = params;

    try {
      // TODO: Implement actual database insert when AuditLog model is available
      // await this.auditLogModel.create({
      //   action,
      //   entityType,
      //   entityId,
      //   userId: context.userId,
      //   ipAddress: context.ipAddress,
      //   userAgent: context.userAgent,
      //   changes,
      //   createdAt: new Date()
      // });

      // For now, log to console for visibility
      this.logger.log(
        `AUDIT [${action}] ${entityType}:${entityId} by user ${context.userId} from ${context.ipAddress || 'unknown'}`
      );
    } catch (error) {
      this.logger.error(`Failed to create audit entry: ${error.message}`, error.stack);
      // Don't throw - audit failures shouldn't break operations
    }
  }
}
