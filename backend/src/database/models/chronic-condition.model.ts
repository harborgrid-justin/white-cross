import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';

export enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  CONTROLLED = 'CONTROLLED',
  IN_REMISSION = 'IN_REMISSION',
  RESOLVED = 'RESOLVED',
}

export interface ChronicConditionAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosisDate: Date;
  diagnosedBy?: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  medications?: any;
  treatments?: string;
  accommodationsRequired: boolean;
  accommodationDetails?: string;
  emergencyProtocol?: string;
  actionPlan?: string;
  nextReviewDate?: Date;
  reviewFrequency?: string;
  restrictions?: any;
  precautions?: any;
  triggers: string[];
  notes?: string;
  carePlan?: string;
  lastReviewDate?: Date;
  createdBy?: string;
  updatedBy?: string;
}

@Table({
  tableName: 'chronic_conditions',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId', 'status'],
    },
    {
      fields: ['severity', 'status'],
    },
    {
      fields: ['nextReviewDate'],
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
  })
  studentId: string;

  @Column(DataType.UUID)
  healthRecordId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  condition: string;

  @Column(DataType.STRING)
  icdCode?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  diagnosisDate: Date;

  @Column(DataType.STRING)
  diagnosedBy?: string;

  @Default(ConditionSeverity.MODERATE)
  @Column({
    type: DataType.ENUM(...Object.values(ConditionSeverity)),
    allowNull: false,
  })
  severity: ConditionSeverity;

  @Default(ConditionStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(ConditionStatus)),
    allowNull: false,
  })
  status: ConditionStatus;

  @Column(DataType.JSONB)
  medications?: any;

  @Column(DataType.TEXT)
  treatments?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  accommodationsRequired: boolean;

  @Column(DataType.TEXT)
  accommodationDetails?: string;

  @Column(DataType.TEXT)
  emergencyProtocol?: string;

  @Column(DataType.TEXT)
  actionPlan?: string;

  @Column(DataType.DATE)
  nextReviewDate?: Date;

  @Column(DataType.STRING)
  reviewFrequency?: string;

  @Column(DataType.JSONB)
  restrictions?: any;

  @Column(DataType.JSONB)
  precautions?: any;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  triggers: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.TEXT)
  carePlan?: string;

  @Column(DataType.DATE)
  lastReviewDate?: Date;

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
}
