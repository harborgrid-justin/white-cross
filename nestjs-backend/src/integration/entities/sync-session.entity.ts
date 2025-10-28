import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SyncConflict } from './sync-conflict.entity';

export enum SyncStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

export enum SyncDirection {
  PULL = 'PULL',
  PUSH = 'PUSH',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
}

@Entity('sync_sessions')
export class SyncSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  configId: string;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  status: SyncStatus;

  @Column({
    type: 'enum',
    enum: SyncDirection,
  })
  direction: SyncDirection;

  @Column({ type: 'jsonb' })
  stats: {
    studentsProcessed: number;
    studentsCreated: number;
    studentsUpdated: number;
    studentsSkipped: number;
    studentsFailed: number;
    errors: string[];
    warnings: string[];
  };

  @Column({ type: 'simple-array' })
  entities: string[];

  @Column({ type: 'int', default: 0 })
  recordsProcessed: number;

  @Column({ type: 'int', default: 0 })
  recordsSuccessful: number;

  @Column({ type: 'int', default: 0 })
  recordsFailed: number;

  @Column({ length: 50 })
  triggeredBy: string;

  @Column({ type: 'text', nullable: true })
  completionMessage: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => SyncConflict, (conflict) => conflict.session)
  conflicts: SyncConflict[];
}
