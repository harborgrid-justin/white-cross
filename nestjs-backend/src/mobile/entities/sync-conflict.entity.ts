import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { SyncEntityType, ConflictResolution, SyncStatus } from '../enums';

/**
 * Sync Conflict Version Interface
 */
export interface ConflictVersion {
  data: any;
  timestamp: Date;
  userId: string;
}

/**
 * Sync Conflict Entity
 * Stores detected conflicts during offline synchronization
 */
@Entity('sync_conflicts')
@Index(['status'])
@Index(['entityType'])
export class SyncConflict {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  queueItemId: string;

  @Column({
    type: 'enum',
    enum: SyncEntityType
  })
  entityType: SyncEntityType;

  @Column()
  entityId: string;

  @Column({ type: 'json' })
  clientVersion: ConflictVersion;

  @Column({ type: 'json' })
  serverVersion: ConflictVersion;

  @Column({
    type: 'enum',
    enum: ConflictResolution,
    nullable: true
  })
  resolution: ConflictResolution;

  @Column({ nullable: true })
  resolvedAt: Date;

  @Column({ nullable: true })
  resolvedBy: string;

  @Column({ type: 'json', nullable: true })
  mergedData: any;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING
  })
  status: SyncStatus;

  @CreateDateColumn()
  createdAt: Date;
}
