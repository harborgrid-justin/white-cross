import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum ViolationType {
  HIPAA_BREACH = 'HIPAA_BREACH',
  FERPA_VIOLATION = 'FERPA_VIOLATION',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_LEAK = 'DATA_LEAK',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  PROCEDURE_VIOLATION = 'PROCEDURE_VIOLATION',
  TRAINING_DEFICIENCY = 'TRAINING_DEFICIENCY'
}

export enum ViolationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ViolationStatus {
  REPORTED = 'REPORTED',
  INVESTIGATING = 'INVESTIGATING',
  REMEDIATION_IN_PROGRESS = 'REMEDIATION_IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
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

@Table({
  tableName: 'compliance_violations',
  timestamps: true,
  indexes: [
    {
      fields: ['violation_type'],
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['reported_by'],
    },
    {
      fields: ['assigned_to'],
    },
    {
      fields: ['discovered_at'],
    },
  ],
})
export class ComplianceViolation extends Model<ComplianceViolationAttributes> implements ComplianceViolationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ViolationType)),
    allowNull: false,
    field: 'violation_type',
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
    type: DataType.ENUM(...Object.values(ViolationSeverity)),
    allowNull: false,
  })
  severity: ViolationSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(ViolationStatus)),
    allowNull: false,
    defaultValue: ViolationStatus.REPORTED,
  })
  status: ViolationStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'reported_by',
  })
  reportedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'discovered_at',
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
}</content>
<parameter name="filePath">c:\temp\white-cross\backend\src\database\models\compliance-violation.model.ts