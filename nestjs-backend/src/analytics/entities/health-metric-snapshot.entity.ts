import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { TrendDirection } from '../enums';

/**
 * Health Metric Snapshot Entity
 * Point-in-time health metrics for analytics
 */
@Entity('health_metric_snapshots')
@Index(['schoolId', 'snapshotDate'])
@Index(['metricName', 'snapshotDate'])
export class HealthMetricSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  schoolId: string;

  @Column()
  metricName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column()
  unit: string;

  @Column()
  category: string;

  @Column({
    type: 'enum',
    enum: TrendDirection,
    nullable: true,
  })
  trend?: TrendDirection;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @Column('timestamp')
  @Index()
  snapshotDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
