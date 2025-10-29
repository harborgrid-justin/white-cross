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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';
import { HealthRecord } from './health-record.model';

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
  student?: Student;
  healthRecord?: HealthRecord;
}

@Table({
  tableName: 'chronic_conditions',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id', 'is_active'],
    },
    {
      fields: ['status', 'is_active'],
    },
    {
      fields: ['next_review_date'],
    },
    {
      fields: ['requires_iep'],
    },
    {
      fields: ['requires_504'],
    },
  ],
})
export class ChronicCondition extends Model<ChronicConditionAttributes> implements ChronicConditionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => HealthRecord)
  @Column({
    type: DataType.UUID,
    field: 'health_record_id',
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
    field: 'icd_code',
  })
  icdCode?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'diagnosed_date',
  })
  diagnosedDate: Date;

  @AllowNull
  @Column({
    type: DataType.STRING(200),
    field: 'diagnosed_by',
  })
  diagnosedBy?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ConditionStatus) as string[])),
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
    field: 'care_plan',
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
    field: 'emergency_protocol',
  })
  emergencyProtocol?: string;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
    field: 'last_review_date',
  })
  lastReviewDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
    field: 'next_review_date',
  })
  @Index
  nextReviewDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'requires_iep',
  })
  @Index
  requiresIEP: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'requires_504',
  })
  @Index
  requires504: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  @Index
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => Student, { foreignKey: 'studentId', as: 'student' })
  student?: Student;

  @BelongsTo(() => HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' })
  healthRecord?: HealthRecord;
}
