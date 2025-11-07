import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ReportType, OutputFormat } from '../constants/report.constants';

/**
 * Report Template Model
 * Stores reusable report templates with query configurations
 */
@Table({
  tableName: 'report_templates',
  timestamps: true,
})
export class ReportTemplate extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(ReportType) as string[])),
    allowNull: false,
  })
  reportType!: ReportType;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  queryConfiguration?: Record<string, any>;

  @Default(OutputFormat.PDF)
  @Column({
    type: DataType.ENUM(...(Object.values(OutputFormat) as string[])),
    allowNull: false,
  })
  defaultOutputFormat!: OutputFormat;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  formatOptions?: Record<string, any>;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdBy?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;
}
