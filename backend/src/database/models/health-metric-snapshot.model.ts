import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  BeforeCreate,
  CreatedAt,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum TrendDirection {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  STABLE = 'STABLE',
  FLUCTUATING = 'FLUCTUATING',
}

export interface HealthMetricSnapshotAttributes {
  id: string;
  schoolId: string;
  metricName: string;
  value: number;
  unit: string;
  category: string;
  trend?: TrendDirection;
  metadata?: Record<string, any>;
  snapshotDate: Date;
}

@Table({
  tableName: 'health_metric_snapshots',
  timestamps: false, // Only createdAt, no updatedAt
  indexes: [
    {
      fields: ['schoolId', 'snapshotDate'],
    },
    {
      fields: ['metricName', 'snapshotDate'],
    },
  ],
})
export class HealthMetricSnapshot extends Model<HealthMetricSnapshotAttributes> implements HealthMetricSnapshotAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  schoolId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  metricName: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  unit: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category: string;

  @Column({
    type: DataType.ENUM(...Object.values(TrendDirection)),
  })
  trend?: TrendDirection;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  snapshotDate: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;
}
