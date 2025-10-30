import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum ReportType {
  HEALTH_TRENDS = 'health_trends',
  MEDICATION_USAGE = 'medication_usage',
  INCIDENT_STATISTICS = 'incident_statistics',
  ATTENDANCE_CORRELATION = 'attendance_correlation',
  COMPLIANCE = 'compliance',
  DASHBOARD = 'dashboard',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
  }

export enum OutputFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
  }

export interface ReportTemplateAttributes {
  id: string;
  name: string;
  description?: string;
  reportType: ReportType;
  queryConfiguration?: Record<string, any>;
  defaultOutputFormat: OutputFormat;
  formatOptions?: Record<string, any>;
  isActive: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'report_templates',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['reportType']
  },
  ]
  })
export class ReportTemplate extends Model<ReportTemplateAttributes> implements ReportTemplateAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  name: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ReportType)]
    },
    allowNull: false
  })
  reportType: ReportType;

  @AllowNull
  @Column({
    type: DataType.JSONB
  })
  queryConfiguration?: Record<string, any>;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(OutputFormat)]
    },
    allowNull: false,
    defaultValue: OutputFormat.PDF
  })
  defaultOutputFormat: OutputFormat;

  @AllowNull
  @Column({
    type: DataType.JSONB
  })
  formatOptions?: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @AllowNull
  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
