import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MetricType } from '../../types/enums';

/**
 * PerformanceMetric Model
 * Tracks system performance metrics for monitoring and optimization
 * Supports various metric types including CPU, memory, API performance
 */

interface PerformanceMetricAttributes {
  id: string;
  metricType: MetricType;
  value: number;
  unit?: string;
  context?: any;
  recordedAt: Date;
}

interface PerformanceMetricCreationAttributes
  extends Optional<PerformanceMetricAttributes, 'id' | 'unit' | 'context' | 'recordedAt'> {}

export class PerformanceMetric
  extends Model<PerformanceMetricAttributes, PerformanceMetricCreationAttributes>
  implements PerformanceMetricAttributes
{
  public id!: string;
  public metricType!: MetricType;
  public value!: number;
  public unit?: string;
  public context?: any;
  public readonly recordedAt!: Date;
}

PerformanceMetric.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    metricType: {
      type: DataTypes.ENUM(...Object.values(MetricType)),
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    context: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    recordedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'performance_metrics',
    timestamps: false,
    indexes: [
      { fields: ['metricType', 'recordedAt'] },
      { fields: ['recordedAt'] },
    ],
  }
);
