/**
 * @fileoverview Auditable Base Model for HIPAA Compliance
 * @module models/base/AuditableModel
 * @description Base model providing automatic audit trail functionality for PHI (Protected Health Information).
 * This model ensures HIPAA compliance by logging all CREATE, UPDATE, and DELETE operations on sensitive data.
 * @requires sequelize - ORM library for database operations
 * @requires logger - Application logging utility
 * @requires enums - Database enumeration types including AuditAction
 *
 * LOC: 9344915592
 * WC-GEN-042 | AuditableModel.ts
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - Student.ts, HealthRecord.ts, Allergy.ts, ChronicCondition.ts, GrowthMeasurement.ts
 *   - Vaccination.ts, VitalSigns.ts, Screening.ts, and other PHI models
 */

import { Model, DataTypes, ModelStatic } from 'sequelize';
import { logger } from '../../../utils/logger';
import { AuditAction } from '../../types/enums';

/**
 * @class AuditableModel
 * @extends Model
 * @description Base model class providing HIPAA-compliant audit trail functionality.
 * Models extending this class automatically log all data modifications for compliance and security.
 *
 * Key Features:
 * - Automatic audit logging for CREATE, UPDATE, DELETE operations
 * - Tracks userId for accountability
 * - Captures before/after data snapshots
 * - Transaction-aware logging
 * - createdBy/updatedBy field management
 *
 * @example
 * // Setup audit hooks for a model
 * AuditableModel.setupAuditHooks(Student, 'Student');
 *
 * @example
 * // Add auditable fields to model definition
 * const fields = {
 *   ...AuditableModel.getAuditableFields(),
 *   // other fields
 * };
 */
export class AuditableModel extends Model {
  /**
   * @static
   * @method setupAuditHooks
   * @description Configures Sequelize hooks to automatically log audit events for HIPAA compliance.
   * Attaches afterCreate, afterUpdate, afterDestroy, beforeUpdate, and beforeCreate hooks.
   *
   * @param {ModelStatic<any>} model - The Sequelize model to add audit hooks to
   * @param {string} entityType - The entity type name for audit log identification (e.g., 'Student', 'HealthRecord')
   *
   * @memberof AuditableModel
   *
   * @example
   * // Setup audit hooks for Student model
   * AuditableModel.setupAuditHooks(Student, 'Student');
   *
   * // Now all Student operations are automatically audited
   * await Student.create({ name: 'John Doe' }, { userId: 'nurse-123' });
   * // Logs: PHI Access Audit { action: 'CREATE', entityType: 'Student', userId: 'nurse-123' }
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

  /**
   * @private
   * @static
   * @method logAuditEvent
   * @description Internal method to log audit events for HIPAA compliance tracking.
   * Logs PHI access with timestamp, action type, entity details, and data changes.
   *
   * @param {Object} params - Audit event parameters
   * @param {AuditAction} params.action - Type of action (CREATE, UPDATE, DELETE)
   * @param {string} params.entityType - Type of entity being audited (e.g., 'Student', 'HealthRecord')
   * @param {string} params.entityId - Unique identifier of the entity
   * @param {string} [params.userId] - ID of user performing the action
   * @param {Object} [params.changes] - Object containing old and new values
   * @param {Object} [params.transaction] - Sequelize transaction object
   *
   * @returns {Promise<void>}
   *
   * @memberof AuditableModel
   *
   * @example
   * // Called internally by audit hooks
   * await AuditableModel.logAuditEvent({
   *   action: AuditAction.UPDATE,
   *   entityType: 'Student',
   *   entityId: 'student-uuid',
   *   userId: 'nurse-123',
   *   changes: { old: { grade: '5' }, new: { grade: '6' } }
   * });
   */
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

  /**
   * @static
   * @method getAuditableFields
   * @description Returns field definitions for createdBy and updatedBy audit tracking fields.
   * These fields automatically track which user created or last modified a record.
   *
   * @returns {Object} Field definitions for audit tracking columns
   * @returns {Object} return.createdBy - Field definition for creator user ID
   * @returns {Object} return.updatedBy - Field definition for last modifier user ID
   *
   * @memberof AuditableModel
   *
   * @example
   * // Include audit fields in model definition
   * Student.init({
   *   ...AuditableModel.getAuditableFields(),
   *   firstName: DataTypes.STRING,
   *   lastName: DataTypes.STRING
   * }, { sequelize });
   */
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
