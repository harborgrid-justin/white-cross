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
    },
    action: {
      type: DataTypes.ENUM(...Object.values(AuditAction)),
      allowNull: false,
      comment: 'Type of action performed',
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of entity (e.g., User, Student, Medication)',
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID of the affected entity',
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Before/after values for modifications',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the request',
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User agent string from the request',
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
  }
);
