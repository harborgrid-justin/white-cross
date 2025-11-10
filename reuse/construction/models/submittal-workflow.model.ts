
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
} from 'sequelize-typescript';
import { WorkflowType, WorkflowStatus } from '../types/submittal.types';
import { ConstructionSubmittal } from './construction-submittal.model';

@Table({
  tableName: 'submittal_workflows',
  timestamps: true,
  indexes: [
    { fields: ['submittalId'], unique: true },
    { fields: ['overallStatus'] },
    { fields: ['escalationRequired'] },
    { fields: ['targetCompletionDate'] },
  ],
})
export class SubmittalWorkflow extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionSubmittal)
  @AllowNull(false)
  @Column(DataType.UUID)
  submittalId: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(WorkflowType)),
  })
  workflowType: WorkflowType;

  @AllowNull(false)
  @Column(DataType.JSON)
  steps: any[];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  currentStepIndex: number;

  @AllowNull(false)
  @Default(WorkflowStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(WorkflowStatus)),
  })
  overallStatus: WorkflowStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  targetCompletionDate: Date;

  @Column(DataType.DATE)
  actualCompletionDate?: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  escalationRequired: boolean;

  @Column(DataType.DATE)
  escalatedAt?: Date;

  @Column(DataType.STRING(100))
  escalatedTo?: string;

  @Column(DataType.DATE)
  pausedAt?: Date;

  @Column(DataType.TEXT)
  pauseReason?: string;

  @Column(DataType.DATE)
  resumedAt?: Date;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  totalDaysActive: number;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
