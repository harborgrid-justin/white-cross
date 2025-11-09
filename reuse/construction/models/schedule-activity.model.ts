
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { DurationType, ActivityStatus, ConstraintType } from '../types/schedule.types';

@Table({
  tableName: 'schedule_activities',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['activityId'], unique: true },
    { fields: ['activityCode'] },
    { fields: ['status'] },
    { fields: ['isCritical'] },
    { fields: ['isMilestone'] },
    { fields: ['plannedStartDate'] },
    { fields: ['plannedFinishDate'] },
    { fields: ['projectId', 'status'] },
    { fields: ['projectId', 'isCritical'] },
    { fields: ['discipline'] },
    { fields: ['phase'] },
  ],
})
export class ScheduleActivity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  activityId: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  activityCode: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  activityName: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(100))
  discipline: string;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(100))
  phase: string;

  @Column(DataType.STRING(50))
  workPackageId?: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  duration: number;

  @AllowNull(false)
  @Default(DurationType.WORKING_DAYS)
  @Column({
    type: DataType.ENUM(...Object.values(DurationType)),
  })
  durationType: DurationType;

  @AllowNull(false)
  @Column(DataType.DATE)
  plannedStartDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  plannedFinishDate: Date;

  @Column(DataType.DATE)
  actualStartDate?: Date;

  @Column(DataType.DATE)
  actualFinishDate?: Date;

  @Column(DataType.DATE)
  forecastStartDate?: Date;

  @Column(DataType.DATE)
  forecastFinishDate?: Date;

  @Column(DataType.DATE)
  earlyStartDate?: Date;

  @Column(DataType.DATE)
  earlyFinishDate?: Date;

  @Column(DataType.DATE)
  lateStartDate?: Date;

  @Column(DataType.DATE)
  lateFinishDate?: Date;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  totalFloat: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  freeFloat: number;

  @AllowNull(false)
  @Default(ActivityStatus.NOT_STARTED)
  @Column({
    type: DataType.ENUM(...Object.values(ActivityStatus)),
  })
  status: ActivityStatus;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  percentComplete: number;

  @Column({
    type: DataType.ENUM(...Object.values(ConstraintType)),
  })
  constraintType?: ConstraintType;

  @Column(DataType.DATE)
  constraintDate?: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isCritical: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isMilestone: boolean;

  @Column(DataType.DATE)
  baselineStartDate?: Date;

  @Column(DataType.DATE)
  baselineFinishDate?: Date;

  @Column(DataType.INTEGER)
  baselineDuration?: number;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
