/**
 * LOC: FB7BC7F846
 * WC-GEN-046 | AuditLog.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - AuditLogRepository.ts (database/repositories/impl/AuditLogRepository.ts)
 */

/**
 * WC-GEN-046 | AuditLog.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditAction } from '../../types/enums';

/**
 * AuditLog Model
 *
 * HIPAA Compliance: This model is critical for HIPAA compliance, recording all access
 * and modifications to Protected Health Information (PHI). It provides a complete audit
 * trail for regulatory compliance, security monitoring, and forensic analysis.
 *
 * Key Features:
 * - Immutable audit trail of all system actions
 * - Records who accessed what data, when, and from where
 * - Supports compliance reporting and security investigations
 * - Captures before/after changes for data modification tracking
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

interface AuditLogCreationAttributes
  extends Optional<AuditLogAttributes, 'id' | 'createdAt' | 'userId' | 'entityId' | 'changes' | 'ipAddress' | 'userAgent'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public userId?: string;
  public action!: AuditAction;
  public entityType!: string;
  public entityId?: string;
  public changes?: any;
  public ipAddress?: string;
  public userAgent?: string;
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
