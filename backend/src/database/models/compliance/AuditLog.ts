/**
 * @fileoverview AuditLog Database Model
 * @module database/models/compliance/AuditLog
 * @description Sequelize model for immutable audit trail of all system actions.
 * Critical for HIPAA compliance, recording all access and modifications to Protected
 * Health Information (PHI) with complete traceability for regulatory audits.
 *
 * Key Features:
 * - Immutable audit trail of all system actions (create, read, update, delete)
 * - Records who accessed what data, when, from where (IP), and with what (user agent)
 * - Captures before/after changes for data modification tracking
 * - Supports compliance reporting and security investigations
 * - Protected from modification/deletion via database hooks
 * - 6-year retention required for HIPAA compliance
 *
 * @security Audit logs are IMMUTABLE - cannot be modified or deleted
 * @security Tracks all PHI access for compliance and forensic analysis
 * @compliance HIPAA - Required 6-year retention of PHI access logs
 * @compliance HIPAA - Tracks who accessed/modified PHI, when, from where
 * @compliance FERPA - Educational record access audit trail
 *
 * @requires sequelize - ORM for database operations
 * @requires AuditAction - Enumeration of audit action types
 *
 * LOC: FB7BC7F846
 * WC-GEN-046 | AuditLog.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - AuditLogRepository.ts (database/repositories/impl/AuditLogRepository.ts)
 *   - All services that access/modify PHI
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditAction } from '../../types/enums';

/**
 * @interface AuditLogAttributes
 * @description TypeScript interface defining all AuditLog model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} [userId] - User who performed the action (null for system actions)
 * @property {AuditAction} action - Action type (CREATE, READ, UPDATE, DELETE, LOGIN, etc.)
 * @property {string} entityType - Type of entity affected (e.g., 'Student', 'HealthRecord', 'Medication')
 * @property {string} [entityId] - ID of the affected entity (null for list operations)
 * @property {any} [changes] - Before/after values for modifications (JSONB)
 * @property {string} [ipAddress] - IP address of the request (for security tracking)
 * @property {string} [userAgent] - User agent string (for device/browser tracking)
 * @property {Date} createdAt - Timestamp when action occurred (IMMUTABLE)
 */
interface AuditLogAttributes {
  id: string;
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

/**
 * @interface AuditLogCreationAttributes
 * @description Attributes required when creating a new AuditLog instance.
 * Extends AuditLogAttributes with optional fields that have defaults or are auto-generated.
 */
interface AuditLogCreationAttributes
  extends Optional<AuditLogAttributes, 'id' | 'createdAt' | 'userId' | 'entityId' | 'changes' | 'ipAddress' | 'userAgent'> {}

/**
 * @class AuditLog
 * @extends Model
 * @description Immutable audit log model for HIPAA compliance and security monitoring.
 * Records all system actions with complete traceability for regulatory audits and forensic analysis.
 *
 * @tablename audit_logs
 *
 * HIPAA Compliance Requirements:
 * - Must retain audit logs for minimum 6 years
 * - Must track all PHI access (read, create, update, delete)
 * - Must record who accessed data, when, from where
 * - Must be immutable (cannot be modified or deleted)
 * - Must support compliance reporting and investigations
 *
 * Audit Trail Information:
 * - WHO: userId field identifies the user who performed the action
 * - WHAT: entityType + entityId identify the data that was accessed/modified
 * - WHEN: createdAt timestamp records exact time of action
 * - WHERE: ipAddress tracks location/network of access
 * - HOW: userAgent tracks device/browser used for access
 * - CHANGES: changes field captures before/after values for modifications
 *
 * Common Use Cases:
 * - Compliance audits: Query logs for specific time periods or users
 * - Security investigations: Track unauthorized access attempts
 * - Data forensics: Reconstruct history of data modifications
 * - User activity monitoring: Review actions by specific users
 * - System monitoring: Detect unusual access patterns
 *
 * @example
 * // Create audit log entry
 * await AuditLog.create({
 *   userId: 'nurse-uuid',
 *   action: AuditAction.READ,
 *   entityType: 'HealthRecord',
 *   entityId: 'record-uuid',
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...'
 * });
 *
 * @example
 * // Query audit logs for a specific user
 * const userLogs = await AuditLog.findAll({
 *   where: { userId: 'user-uuid' },
 *   order: [['createdAt', 'DESC']],
 *   limit: 100
 * });
 *
 * @example
 * // Find all access to a specific student record
 * const studentAccess = await AuditLog.findAll({
 *   where: {
 *     entityType: 'Student',
 *     entityId: 'student-uuid'
 *   }
 * });
 *
 * @security IMMUTABLE - beforeUpdate/beforeDestroy hooks prevent modification
 * @security 6-year retention required for HIPAA compliance
 * @compliance HIPAA - Complete audit trail of PHI access
 */
export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for each audit log entry
   */
  public id!: string;

  /**
   * @property {string} userId - User who performed the action
   * @security Tracks WHO accessed/modified data for compliance
   * @validation Must be valid User UUID if provided
   */
  public userId?: string;

  /**
   * @property {AuditAction} action - Type of action performed
   * @security Tracks WHAT operation was performed (READ, CREATE, UPDATE, DELETE, etc.)
   */
  public action!: AuditAction;

  /**
   * @property {string} entityType - Type of entity affected
   * @security Tracks WHAT TYPE of data was accessed (Student, HealthRecord, etc.)
   * @validation 2-100 characters
   */
  public entityType!: string;

  /**
   * @property {string} entityId - ID of affected entity
   * @security Tracks WHICH SPECIFIC record was accessed
   * @validation Max 100 characters
   */
  public entityId?: string;

  /**
   * @property {any} changes - Before/after values for modifications
   * @security Tracks HOW data was changed (for UPDATE operations)
   * @validation Must be valid JSON object if provided
   */
  public changes?: any;

  /**
   * @property {string} ipAddress - IP address of the request
   * @security Tracks WHERE access originated (network location)
   * @validation Must be valid IPv4 or IPv6 address
   */
  public ipAddress?: string;

  /**
   * @property {string} userAgent - User agent string
   * @security Tracks device/browser used for access
   * @validation Max 500 characters
   */
  public userAgent?: string;

  /**
   * @property {Date} createdAt - Timestamp when action occurred
   * @security Tracks WHEN action occurred
   * @security IMMUTABLE - cannot be changed after creation
   * @readonly
   */
  public readonly createdAt!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User who performed the action',
      validate: {
        isUUID: {
          args: 4,
          msg: 'User ID must be a valid UUID when provided'
        }
      }
    },
    action: {
      type: DataTypes.ENUM(...Object.values(AuditAction)),
      allowNull: false,
      comment: 'Type of action performed',
      validate: {
        notNull: {
          msg: 'Action is required for audit trail'
        },
        notEmpty: {
          msg: 'Action cannot be empty'
        }
      }
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of entity (e.g., User, Student, Medication)',
      validate: {
        notNull: {
          msg: 'Entity type is required for audit trail'
        },
        notEmpty: {
          msg: 'Entity type cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Entity type must be between 2 and 100 characters'
        }
      }
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID of the affected entity',
      validate: {
        len: {
          args: [0, 100],
          msg: 'Entity ID cannot exceed 100 characters'
        }
      }
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Before/after values for modifications',
      validate: {
        isValidJSON(value: any) {
          if (value && typeof value !== 'object') {
            throw new Error('Changes must be a valid JSON object');
          }
        }
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the request',
      validate: {
        isValidIP(value: string | null) {
          if (value) {
            const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
            if (!ipv4Pattern.test(value) && !ipv6Pattern.test(value)) {
              throw new Error('IP address must be in valid IPv4 or IPv6 format');
            }
          }
        }
      }
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User agent string from the request',
      validate: {
        len: {
          args: [0, 500],
          msg: 'User agent cannot exceed 500 characters'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false,
    indexes: [
      { fields: ['userId', 'createdAt'] },
      { fields: ['entityType', 'entityId'] },
      { fields: ['action'] },
      { fields: ['createdAt'] },
    ],
    hooks: {
      /**
       * HIPAA COMPLIANCE: Prevent modification of audit logs
       * Audit logs must be immutable to maintain compliance
       */
      beforeUpdate: () => {
        throw new Error('HIPAA VIOLATION: Audit logs are immutable and cannot be modified');
      },
      /**
       * HIPAA COMPLIANCE: Prevent deletion of audit logs
       * Audit logs must be retained for compliance
       */
      beforeDestroy: () => {
        throw new Error('HIPAA VIOLATION: Audit logs are immutable and cannot be deleted');
      },
      beforeBulkUpdate: () => {
        throw new Error('HIPAA VIOLATION: Audit logs are immutable and cannot be modified');
      },
      beforeBulkDestroy: () => {
        throw new Error('HIPAA VIOLATION: Audit logs are immutable and cannot be deleted');
      }
    }
  }
);
