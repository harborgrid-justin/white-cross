import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Re-export enums for convenience
export { AccommodationType } from '../../chronic-condition/enums';

/**
 * Chronic condition status indicating management phase and clinical state.
 *
 * Status drives care workflows, review scheduling, and reporting:
 * - ACTIVE: Requires ongoing management and monitoring
 * - MANAGED: Under control but still requires periodic review
 * - RESOLVED: Successfully treated or outgrown, minimal monitoring
 * - MONITORING: Under observation, not yet confirmed or actively managed
 */
export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  RESOLVED = 'RESOLVED',
  MONITORING = 'MONITORING',
}

export interface ChronicConditionAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: Date;
  diagnosedBy?: string;
  status: ConditionStatus;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications: string[];
  restrictions: string[];
  triggers: string[];
  accommodations: string[];
  emergencyProtocol?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  requiresIEP: boolean;
  requires504: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  student?: any;
  healthRecord?: any;
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
  tableName: 'chronic_conditions',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId', 'isActive'],
    },
    {
      fields: ['status', 'isActive'],
    },
    {
      fields: ['nextReviewDate'],
    },
    {
      fields: ['requiresIEP'],
    },
    {
      fields: ['requires504'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_chronic_condition_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_chronic_condition_updated_at',
    },
  ],
})
export class ChronicCondition
  extends Model<ChronicConditionAttributes>
  implements ChronicConditionAttributes
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
    onDelete: 'CASCADE',
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => require('./health-record.model').HealthRecord)
  @Column({
    type: DataType.UUID,
  })
  healthRecordId?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  condition: string;

  @AllowNull
  @Column({
    type: DataType.STRING(20),
  })
  icdCode?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  diagnosedDate: Date;

  @AllowNull
  @Column({
    type: DataType.STRING(200),
  })
  diagnosedBy?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ConditionStatus)],
    },
    allowNull: false,
    defaultValue: ConditionStatus.ACTIVE,
  })
  @Index
  status: ConditionStatus;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
  })
  severity?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  carePlan?: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  medications: string[];

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  restrictions: string[];

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  triggers: string[];

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  accommodations: string[];

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  emergencyProtocol?: string;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  lastReviewDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  @Index
  nextReviewDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Index
  requiresIEP: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Index
  requires504: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @Index
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  declare student?: any;

  @BelongsTo(() => require('./health-record.model').HealthRecord, {
    foreignKey: 'healthRecordId',
    as: 'healthRecord',
  })
  declare healthRecord?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ChronicCondition) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] ChronicCondition ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
