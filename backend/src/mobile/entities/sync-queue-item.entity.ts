import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { SyncActionType, SyncEntityType, SyncPriority, ConflictResolution } from '../enums';

/**
 * Sync Queue Item Entity
 * Stores offline sync queue for data synchronization
 */
@Entity('sync_queue_items')
@Index(['deviceId'])
@Index(['userId'])
@Index(['synced'])
@Index(['priority'])
export class SyncQueueItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  deviceId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: SyncActionType
  })
  actionType: SyncActionType;

  @Column({
    type: 'enum',
    enum: SyncEntityType
  })
  entityType: SyncEntityType;

  @Column()
  entityId: string;

  @Column({ type: 'json' })
  data: any;

  @Column()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  syncedAt: Date;

  @Column({ default: false })
  synced: boolean;

  @Column({ default: 0 })
  attempts: number;

  @Column({ default: 3 })
  maxAttempts: number;

  @Column({ nullable: true })
  lastError: string;

  @Column({ default: false })
  conflictDetected: boolean;

  @Column({
    type: 'enum',
    enum: ConflictResolution,
    nullable: true
  })
  conflictResolution: ConflictResolution;

  @Column({
    type: 'enum',
    enum: SyncPriority,
    default: SyncPriority.NORMAL
  })
  priority: SyncPriority;

  @Column({ default: true })
  requiresOnline: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
