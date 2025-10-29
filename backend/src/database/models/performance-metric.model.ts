/**
 * PerformanceMetric Model
 *
 * Sequelize model for storing system performance metrics
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  AllowNull,
} from 'sequelize-typescript';

/**
 * Metric types for performance monitoring
 */
export enum MetricType {
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  DISK_USAGE = 'DISK_USAGE',
  API_RESPONSE_TIME = 'API_RESPONSE_TIME',
  DATABASE_QUERY_TIME = 'DATABASE_QUERY_TIME',
  ACTIVE_USERS = 'ACTIVE_USERS',
  ERROR_RATE = 'ERROR_RATE',
  REQUEST_COUNT = 'REQUEST_COUNT',
}

/**
 * PerformanceMetric attributes interface
 */
export interface PerformanceMetricAttributes {
  id?: string;
  metricType: MetricType;
  value: number;
  unit?: string;
  tags?: Record<string, any>;
  recordedAt: Date;
  createdAt?: Date;
}

/**
 * PerformanceMetric creation attributes interface
 */
export interface CreatePerformanceMetricAttributes {
  metricType: MetricType;
  value: number;
  unit?: string;
  tags?: Record<string, any>;
  recordedAt: Date;
}

/**
 * PerformanceMetric Model
 *
 * Stores system performance metrics over time for monitoring and analysis
 */
@Table({
  tableName: 'performance_metrics',
  timestamps: true,
  updatedAt: false, // Metrics are immutable
  underscored: true,
  indexes: [
    { fields: ['metric_type'] },
    { fields: ['recorded_at'] },
  ],
})
export class PerformanceMetric extends Model<PerformanceMetricAttributes, CreatePerformanceMetricAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...(Object.values(MetricType) as string[])),
    allowNull: false,
    comment: 'Type of performance metric being recorded',
  })
  @Index
  metricType: MetricType;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Numerical value of the metric',
  })
  value: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Unit of measurement (e.g., %, ms, GB)',
  })
  unit?: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Additional tags for categorizing the metric',
  })
  tags?: Record<string, any>;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Timestamp when the metric was recorded',
  })
  @Index
  recordedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the metric record was created',
  })
  declare createdAt?: Date;
}