import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
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
  CUSTOM = 'custom',
}

export enum OutputFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
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
  indexes: [
    {
      fields: ['report_type'],
    },
  ],
})
export class ReportTemplate extends Model<ReportTemplateAttributes> implements ReportTemplateAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ReportType) as string[])),
    allowNull: false,
    field: 'report_type',
  })
  reportType: ReportType;

  @AllowNull
  @Column({
    type: DataType.JSONB,
    field: 'query_configuration',
  })
  queryConfiguration?: Record<string, any>;

  @Column({
    type: DataType.ENUM(...(Object.values(OutputFormat) as string[])),
    allowNull: false,
    defaultValue: OutputFormat.PDF,
    field: 'default_output_format',
  })
  defaultOutputFormat: OutputFormat;

  @AllowNull
  @Column({
    type: DataType.JSONB,
    field: 'format_options',
  })
  formatOptions?: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'created_by',
  })
  createdBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
