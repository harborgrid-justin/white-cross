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
  Scopes,
  BeforeUpdate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export enum TrendDirection {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  STABLE = 'STABLE',
  FLUCTUATING = 'FLUCTUATING'
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'health_metric_snapshots',
  timestamps: false, // Only createdAt, no updatedAt
  indexes: [
    {
      fields: ['schoolId', 'snapshotDate']
    },
    {
      fields: ['metricName', 'snapshotDate']
    },
    {
      fields: ['createdAt'],
      name: 'idx_health_metric_snapshot_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_health_metric_snapshot_updated_at'
    }
  ]
})
export class HealthMetricSnapshot extends Model<HealthMetricSnapshotAttributes> implements HealthMetricSnapshotAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  schoolId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  metricName: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  value: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  unit: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  category: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(TrendDirection)]
    }
  })
  trend?: TrendDirection;

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  snapshotDate: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare createdAt: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: HealthMetricSnapshot) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] HealthMetricSnapshot ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
