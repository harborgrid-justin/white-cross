import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export enum IncidentType {
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  BEHAVIORAL = 'BEHAVIORAL',
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  EMERGENCY = 'EMERGENCY',
  SAFETY = 'SAFETY',
  OTHER = 'OTHER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
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
  status: IncidentStatus;
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['occurredAt', 'DESC']],
  },
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['occurredAt', 'DESC']],
  }),
  byType: (type: IncidentType) => ({
    where: { type },
    order: [['occurredAt', 'DESC']],
  }),
  bySeverity: (severity: IncidentSeverity) => ({
    where: { severity },
    order: [['occurredAt', 'DESC']],
  }),
  byStatus: (status: IncidentStatus) => ({
    where: { status },
    order: [['occurredAt', 'DESC']],
  }),
  pendingReview: {
    where: {
      status: {
        [Op.in]: [
          IncidentStatus.PENDING_REVIEW,
          IncidentStatus.UNDER_INVESTIGATION,
        ],
      },
    },
    order: [['occurredAt', 'ASC']],
  },
  critical: {
    where: {
      severity: {
        [Op.in]: [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL],
      },
    },
    order: [['occurredAt', 'DESC']],
  },
  requiresAction: {
    where: {
      status: IncidentStatus.REQUIRES_ACTION,
    },
    order: [
      ['severity', 'DESC'],
      ['occurredAt', 'ASC'],
    ],
  },
  parentNotRequired: {
    where: {
      parentNotified: false,
    },
    order: [['occurredAt', 'ASC']],
  },
  withFollowUp: {
    where: {
      followUpRequired: true,
    },
    order: [['occurredAt', 'DESC']],
  },
}))
@Table({
  tableName: 'incident_reports',
  timestamps: true,
  underscored: false,
  paranoid: true,
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
    {
      fields: ['status'],
      name: 'idx_incident_reports_status',
    },
    {
      fields: ['createdAt'],
      name: 'idx_incident_reports_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_incident_reports_updated_at',
    },
    // GIN index for efficient array searches on evidence photos
    {
      fields: ['evidencePhotos'],
      using: 'GIN',
      name: 'idx_incident_reports_evidence_photos_gin',
    },
  ],
})
export class IncidentReport
  extends Model<IncidentReportAttributes>
  implements IncidentReportAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  studentId: string;

  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  reportedById: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(IncidentType)],
    },
    allowNull: false,
  })
  type: IncidentType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(IncidentSeverity)],
    },
    allowNull: false,
  })
  severity: IncidentSeverity;

  @Default(IncidentStatus.PENDING_REVIEW)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(IncidentStatus)],
    },
    allowNull: false,
    defaultValue: IncidentStatus.PENDING_REVIEW,
  })
  status: IncidentStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  location: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
  })
  witnesses: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  actionsTaken: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  parentNotified: boolean;

  @Column({
    type: DataType.STRING(255),
  })
  parentNotificationMethod?: string;

  @Column({
    type: DataType.DATE,
  })
  parentNotifiedAt?: Date;

  @Column({
    type: DataType.UUID,
  })
  parentNotifiedBy?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  followUpRequired: boolean;

  @Column({
    type: DataType.TEXT,
  })
  followUpNotes?: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
  })
  attachments: string[];

  @Index({ using: 'GIN', name: 'idx_incident_reports_evidence_photos_gin' })
  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
  })
  evidencePhotos: string[];

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
    allowNull: false,
  })
  evidenceVideos: string[];

  @Column({
    type: DataType.STRING(255),
  })
  insuranceClaimNumber?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(InsuranceClaimStatus)],
    },
  })
  insuranceClaimStatus?: InsuranceClaimStatus;

  @Default(ComplianceStatus.PENDING)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ComplianceStatus)],
    },
    allowNull: false,
  })
  legalComplianceStatus: ComplianceStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  occurredAt: Date;

  @Column({
    type: DataType.UUID,
  })
  createdBy?: string;

  @Column({
    type: DataType.UUID,
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  declare student?: any;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'reportedById',
    as: 'reporter',
  })
  declare reporter?: any;

  @HasMany(() => require('./follow-up-action.model').FollowUpAction, {
    foreignKey: 'incidentReportId',
    as: 'followUpActions',
  })
  declare followUpActions?: any[];

  @HasMany(() => require('./witness-statement.model').WitnessStatement, {
    foreignKey: 'incidentReportId',
    as: 'witnessStatements',
  })
  declare witnessStatements?: any[];

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: IncidentReport, options: any) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const { logModelPHIAccess } = await import(
        '@/services/model-audit-helper.service.js'
      );
      const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
      await logModelPHIAccess(
        'IncidentReport',
        instance.id,
        action,
        changedFields,
        options?.transaction,
      );
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateParentNotification(instance: IncidentReport) {
    if (instance.parentNotified && !instance.parentNotificationMethod) {
      throw new Error(
        'parentNotificationMethod is required when parent is notified',
      );
    }
    if (instance.parentNotified && !instance.parentNotifiedAt) {
      instance.parentNotifiedAt = new Date();
    }
  }
}
