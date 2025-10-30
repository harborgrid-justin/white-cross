import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;
;
;

export enum IncidentType {
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  BEHAVIORAL = 'BEHAVIORAL',
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER'
  }

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
  }

export enum InsuranceClaimStatus {
  NOT_FILED = 'NOT_FILED',
  FILED = 'FILED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  CLOSED = 'CLOSED'
  }

export enum ComplianceStatus {
  PENDING = 'PENDING',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW'
  }

export interface IncidentReportAttributes {
  id: string;
  studentId: string;
  reportedById: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotifiedAt?: Date;
  parentNotifiedBy?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  attachments: string[];
  evidencePhotos: string[];
  evidenceVideos: string[];
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: InsuranceClaimStatus;
  legalComplianceStatus: ComplianceStatus;
  occurredAt: Date;
  createdBy?: string;
  updatedBy?: string;
  followUpActions?: any[];
  witnessStatements?: any[];
}

@Table({
  tableName: 'incident_reports',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId']
  },
    {
      fields: ['reportedById']
  },
    {
      fields: ['type', 'occurredAt']
  },
    {
      fields: ['severity']
  },
  ]
  })
export class IncidentReport extends Model<IncidentReportAttributes> implements IncidentReportAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  studentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  reportedById: string;

  @Column({
    type: DataType.ENUM(...(Object.values(IncidentType) as string[])),
    allowNull: false
  })
  type: IncidentType;

  @Column({
    type: DataType.ENUM(...(Object.values(IncidentSeverity) as string[])),
    allowNull: false
  })
  severity: IncidentSeverity;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  location: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  witnesses: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  actionsTaken: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN
  })
  parentNotified: boolean;

  @Column({
    type: DataType.STRING
  })
  parentNotificationMethod?: string;

  @Column({
    type: DataType.DATE
  })
  parentNotifiedAt?: Date;

  @Column({
    type: DataType.UUID
  })
  parentNotifiedBy?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN
  })
  followUpRequired: boolean;

  @Column({
    type: DataType.TEXT
  })
  followUpNotes?: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  attachments: string[];

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  evidencePhotos: string[];

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false
  })
  evidenceVideos: string[];

  @Column({
    type: DataType.STRING
  })
  insuranceClaimNumber?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(InsuranceClaimStatus) as string[]))
  })
  insuranceClaimStatus?: InsuranceClaimStatus;

  @Default(ComplianceStatus.PENDING)
  @Column({
    type: DataType.ENUM(...(Object.values(ComplianceStatus) as string[])),
    allowNull: false
  })
  legalComplianceStatus: ComplianceStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  occurredAt: Date;

  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  @Column({
    type: DataType.UUID
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE
  })
  declare updatedAt: Date;

  @BelongsTo(() => require('./student.model').Student)
  declare student?: any;

  @HasMany(() => require('./follow-up-action.model').FollowUpAction)
  declare followUpActions?: any[];

  @HasMany(() => require('./witness-statement.model').WitnessStatement)
  declare witnessStatements?: any[];
}
