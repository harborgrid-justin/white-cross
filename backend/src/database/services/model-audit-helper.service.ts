/**
 * Model Audit Helper Service
 * Singleton service to provide audit logging capabilities to Sequelize model hooks
 *
 * This service solves the problem of accessing NestJS injectable services from
 * Sequelize static model hooks which don't have access to the DI container.
 */

import { Injectable } from '@nestjs/common';
import { AuditService } from './audit.service';

/**
 * Singleton instance holder
 */
let modelAuditHelperInstance: ModelAuditHelper | null = null;

/**
 * Model Audit Helper
 * Provides a global singleton that model hooks can use to log audit events
 */
@Injectable()
export class ModelAuditHelper {
  constructor(private readonly auditService: AuditService) {
    // Set the singleton instance when the service is instantiated
    modelAuditHelperInstance = this;
  }

  /**
   * Get the singleton instance
   * This is called by model hooks to access the audit service
   */
  static getInstance(): ModelAuditHelper | null {
    return modelAuditHelperInstance;
  }

  /**
   * Log PHI access from model hooks
   * Provides a convenient method for model hooks to log PHI access
   */
  async logPHIAccessFromHook(
    entityType: string,
    entityId: string,
    action: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE',
    changedFields?: string[],
    transaction?: any,
  ): Promise<void> {
    // Only log if there are actual changes
    if (action === 'UPDATE' && (!changedFields || changedFields.length === 0)) {
      return;
    }

    await this.auditService.logPHIAccess(
      {
        entityType,
        entityId,
        action,
        changedFields,
      },
      transaction,
    );
  }

  /**
   * Log PHI field changes from model hooks
   * Identifies PHI fields and logs them appropriately
   */
  async logPHIFieldChanges(
    entityType: string,
    entityId: string,
    allChangedFields: string[],
    phiFields: string[],
    transaction?: any,
  ): Promise<void> {
    // Filter to only PHI fields that changed
    const changedPHIFields = allChangedFields.filter((field) =>
      phiFields.some((phiField) => field.toLowerCase() === phiField.toLowerCase()),
    );

    if (changedPHIFields.length > 0) {
      await this.auditService.logPHIAccess(
        {
          entityType,
          entityId,
          action: 'UPDATE',
          changedFields: changedPHIFields,
        },
        transaction,
      );
    }
  }
}

/**
 * Helper function for model hooks to log PHI access
 * This can be called directly from Sequelize model hooks
 */
export async function logModelPHIAccess(
  entityType: string,
  entityId: string,
  action: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE',
  changedFields?: string[],
  transaction?: any,
): Promise<void> {
  const helper = ModelAuditHelper.getInstance();
  if (helper) {
    await helper.logPHIAccessFromHook(entityType, entityId, action, changedFields, transaction);
  } else {
    // Fallback to console logging if service not initialized yet
    console.log(
      `[AUDIT] ${entityType} ${entityId} ${action} ${changedFields ? `- Fields: ${changedFields.join(', ')}` : ''} at ${new Date().toISOString()}`,
    );
  }
}

/**
 * Helper function for model hooks to log PHI field changes
 * Automatically filters for PHI fields
 */
export async function logModelPHIFieldChanges(
  entityType: string,
  entityId: string,
  allChangedFields: string[],
  phiFields: string[],
  transaction?: any,
): Promise<void> {
  const helper = ModelAuditHelper.getInstance();
  if (helper) {
    await helper.logPHIFieldChanges(
      entityType,
      entityId,
      allChangedFields,
      phiFields,
      transaction,
    );
  } else {
    // Fallback to console logging if service not initialized yet
    const changedPHIFields = allChangedFields.filter((field) =>
      phiFields.some((phiField) => field.toLowerCase() === phiField.toLowerCase()),
    );
    if (changedPHIFields.length > 0) {
      console.log(
        `[AUDIT] PHI modified for ${entityType} ${entityId} at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed PHI fields: ${changedPHIFields.join(', ')}`);
    }
  }
}
