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
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';
import { FollowUpAction } from './follow-up-action.model';
import { WitnessStatement } from './witness-statement.model';

export enum IncidentType {
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  BEHAVIORAL = 'BEHAVIORAL',
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum InsuranceClaimStatus {
  NOT_FILED = 'NOT_FILED',
  FILED = 'FILED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  CLOSED = 'CLOSED',
}

export enum ComplianceStatus {
  PENDING = 'PENDING',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
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
  followUpActions?: FollowUpAction[];
  witnessStatements?: WitnessStatement[];
}

@Table({
  tableName: 'incident_reports',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['reportedById'],
    },
    {
      fields: ['type', 'occurredAt'],
    },
    {
      fields: ['severity'],
    },
  ],
})
export class IncidentReport extends Model<IncidentReportAttributes> implements IncidentReportAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  reportedById: string;

  @Column({
    type: DataType.ENUM(...Object.values(IncidentType)),
    allowNull: false,
  })
  type: IncidentType;

  @Column({
    type: DataType.ENUM(...Object.values(IncidentSeverity)),
    allowNull: false,
  })
  severity: IncidentSeverity;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  witnesses: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  actionsTaken: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  parentNotified: boolean;

  @Column(DataType.STRING)
  parentNotificationMethod?: string;

  @Column(DataType.DATE)
  parentNotifiedAt?: Date;

  @Column(DataType.UUID)
  parentNotifiedBy?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  followUpRequired: boolean;

  @Column(DataType.TEXT)
  followUpNotes?: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  attachments: string[];

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  evidencePhotos: string[];

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  evidenceVideos: string[];

  @Column(DataType.STRING)
  insuranceClaimNumber?: string;

  @Column({
    type: DataType.ENUM(...Object.values(InsuranceClaimStatus)),
  })
  insuranceClaimStatus?: InsuranceClaimStatus;

  @Default(ComplianceStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(ComplianceStatus)),
    allowNull: false,
  })
  legalComplianceStatus: ComplianceStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  occurredAt: Date;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  @BelongsTo(() => Student)
  student?: Student;

  @HasMany(() => FollowUpAction)
  followUpActions?: FollowUpAction[];

  @HasMany(() => WitnessStatement)
  witnessStatements?: WitnessStatement[];
}
