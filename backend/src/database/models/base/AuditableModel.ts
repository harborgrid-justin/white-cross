/**
 * Auditable Base Model for HIPAA Compliance
 * Provides automatic audit trail for all PHI (Protected Health Information)
 */

import { Model, DataTypes } from 'sequelize';
import { logger } from '../../../utils/logger';
import { AuditAction } from '../../types/enums';

export class AuditableModel extends Model {
  /**
   * Setup audit hooks for a model
   */
  static setupAuditHooks(model: typeof Model, entityType: string) {
    model.addHook('afterCreate', async (instance: any, options: any) => {
      try {
        await this.logAuditEvent({
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

    model.addHook('afterUpdate', async (instance: any, options: any) => {
      try {
        const changes = instance._previousDataValues
          ? { old: instance._previousDataValues, new: instance.dataValues }
          : null;

        await this.logAuditEvent({
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

    model.addHook('afterDestroy', async (instance: any, options: any) => {
      try {
        await this.logAuditEvent({
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

    model.addHook('beforeUpdate', (instance: any, options: any) => {
      if (options.userId) {
        instance.updatedBy = options.userId;
      }
    });

    model.addHook('beforeCreate', (instance: any, options: any) => {
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
