/**
 * LOC: 9344915592
 * WC-GEN-042 | AuditableModel.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - Student.ts (database/models/core/Student.ts)
 *   - Allergy.ts (database/models/healthcare/Allergy.ts)
 *   - ChronicCondition.ts (database/models/healthcare/ChronicCondition.ts)
 *   - GrowthMeasurement.ts (database/models/healthcare/GrowthMeasurement.ts)
 *   - HealthRecord.ts (database/models/healthcare/HealthRecord.ts)
 *   - ... and 7 more
 */

/**
 * WC-GEN-042 | AuditableModel.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../../utils/logger, ../../types/enums | Dependencies: sequelize, ../../../utils/logger, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Auditable Base Model for HIPAA Compliance
 * Provides automatic audit trail for all PHI (Protected Health Information)
 */

import { Model, DataTypes, ModelStatic } from 'sequelize';
import { logger } from '../../../utils/logger';
import { AuditAction } from '../../types/enums';

export class AuditableModel extends Model {
  /**
   * Setup audit hooks for a model
   */
  static setupAuditHooks(model: ModelStatic<any>, entityType: string) {
    (model as any).addHook('afterCreate', async (instance: any, options: any) => {
      try {
        await AuditableModel.logAuditEvent({
          action: AuditAction.CREATE,
          entityType,
          entityId: instance.id,
          userId: instance.createdBy || options.userId,
          changes: { new: instance.toJSON() },
          transaction: options.transaction,
        });
      } catch (error) {
        logger.error('Failed to log audit event (create)', { entityType, entityId: instance.id, error });
      }
    });

    (model as any).addHook('afterUpdate', async (instance: any, options: any) => {
      try {
        const changes = instance._previousDataValues
          ? { old: instance._previousDataValues, new: instance.dataValues }
          : null;

        await AuditableModel.logAuditEvent({
          action: AuditAction.UPDATE,
          entityType,
          entityId: instance.id,
          userId: instance.updatedBy || options.userId,
          changes,
          transaction: options.transaction,
        });
      } catch (error) {
        logger.error('Failed to log audit event (update)', { entityType, entityId: instance.id, error });
      }
    });

    (model as any).addHook('afterDestroy', async (instance: any, options: any) => {
      try {
        await AuditableModel.logAuditEvent({
          action: AuditAction.DELETE,
          entityType,
          entityId: instance.id,
          userId: options.userId,
          changes: { old: instance.toJSON() },
          transaction: options.transaction,
        });
      } catch (error) {
        logger.error('Failed to log audit event (delete)', { entityType, entityId: instance.id, error });
      }
    });

    (model as any).addHook('beforeUpdate', (instance: any, options: any) => {
      if (options.userId) {
        instance.updatedBy = options.userId;
      }
    });

    (model as any).addHook('beforeCreate', (instance: any, options: any) => {
      if (options.userId) {
        instance.createdBy = options.userId;
      }
    });
  }

  private static async logAuditEvent(params: {
    action: AuditAction;
    entityType: string;
    entityId: string;
    userId?: string;
    changes?: any;
    transaction?: any;
  }) {
    const { action, entityType, entityId, userId, changes, transaction } = params;

    logger.info('PHI Access Audit', {
      timestamp: new Date().toISOString(),
      entityType,
      action,
      entityId,
      userId,
      changes: changes ? JSON.stringify(changes).substring(0, 200) : undefined,
    });
  }

  static getAuditableFields() {
    return {
      createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    };
  }
}
