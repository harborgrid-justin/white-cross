import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum ViolationType {
  HIPAA_BREACH = 'HIPAA_BREACH',
  FERPA_VIOLATION = 'FERPA_VIOLATION',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_LEAK = 'DATA_LEAK',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  PROCEDURE_VIOLATION = 'PROCEDURE_VIOLATION',
  TRAINING_DEFICIENCY = 'TRAINING_DEFICIENCY',
}

export enum ViolationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ViolationStatus {
  REPORTED = 'REPORTED',
  INVESTIGATING = 'INVESTIGATING',
  REMEDIATION_IN_PROGRESS = 'REMEDIATION_IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface ComplianceViolationAttributes {
  id?: string;
  violationType: ViolationType;
  title: string;
  description: string;
  severity: ViolationSeverity;
  status: ViolationStatus;
  reportedBy: string;
  discoveredAt: Date;
  affectedStudents?: string[];
  affectedDataCategories?: string[];
  rootCause?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'compliance_violations',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['violationType'],
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['reportedBy'],
    },
    {
      fields: ['assignedTo'],
    },
    {
      fields: ['discoveredAt'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_compliance_violation_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_compliance_violation_updated_at',
    },
  ],
})
export class ComplianceViolation
  extends Model<ComplianceViolationAttributes>
  implements ComplianceViolationAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ViolationType)],
    },
    allowNull: false,
  })
  violationType: ViolationType;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ViolationSeverity)],
    },
    allowNull: false,
  })
  severity: ViolationSeverity;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ViolationStatus)],
    },
    allowNull: false,
    defaultValue: ViolationStatus.REPORTED,
  })
  status: ViolationStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  reportedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  discoveredAt: Date;

  @AllowNull
  @Column(DataType.JSONB)
  affectedStudents?: string[];

  @AllowNull
  @Column(DataType.JSONB)
  affectedDataCategories?: string[];

  @AllowNull
  @Column(DataType.TEXT)
  rootCause?: string;

  @AllowNull
  @Column(DataType.UUID)
  assignedTo?: string;

  @AllowNull
  @Column(DataType.TEXT)
  resolutionNotes?: string;

  @AllowNull
  @Column(DataType.DATE)
  resolvedAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ComplianceViolation) {
    await createModelAuditHook('ComplianceViolation', instance);
  }
}

// Default export for Sequelize-TypeScript
export default ComplianceViolation;
