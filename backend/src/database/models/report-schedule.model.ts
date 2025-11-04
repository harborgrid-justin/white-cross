import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo
  } ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { ReportTemplate } from './report-template.model';
import { ReportType, OutputFormat } from './report-execution.model';

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  CUSTOM = 'custom'
  }

export interface ReportScheduleAttributes {
  id: string;
  name: string;
  reportType: ReportType;
  templateId?: string;
  frequency: ScheduleFrequency;
  cronExpression?: string;
  outputFormat: OutputFormat;
  parameters?: Record<string, any>;
  recipients: string[];
  isActive: boolean;
  lastExecutedAt?: Date;
  nextExecutionAt?: Date;
  executionCount: number;
  failureCount: number;
  lastError?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  template?: ReportTemplate;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'report_schedules',
  timestamps: true,
  underscored: false
  ,
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_report_schedule_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_report_schedule_updated_at'
    }
  ]})
export class ReportSchedule extends Model<ReportScheduleAttributes> implements ReportScheduleAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportType)]
    },
    allowNull: false
  })
  reportType: ReportType;

  @AllowNull
  @ForeignKey(() => require('./report-template.model').ReportTemplate)
  @Column({
    type: DataType.UUID
  })
  templateId?: string;

  @BelongsTo(() => require('./report-template.model').ReportTemplate, { foreignKey: 'templateId', as: 'template' })
  declare template?: any;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ScheduleFrequency)]
    },
    allowNull: false
  })
  frequency: ScheduleFrequency;

  @AllowNull
  @Column({
    type: DataType.STRING(100)
  })
  cronExpression?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(OutputFormat)]
    },
    allowNull: false,
    defaultValue: OutputFormat.PDF
  })
  outputFormat: OutputFormat;

  @AllowNull
  @Column(DataType.JSONB)
  parameters?: Record<string, any>;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: []
  })
  recipients: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  lastExecutedAt?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  nextExecutionAt?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  executionCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  failureCount: number;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  lastError?: string;

  @AllowNull
  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ReportSchedule) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] ReportSchedule ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
