import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SyncSession } from './sync-session.entity';

export enum ConflictResolution {
  KEEP_LOCAL = 'KEEP_LOCAL',
  KEEP_SIS = 'KEEP_SIS',
}

@Entity('sync_conflicts')
export class SyncConflict {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ length: 100 })
  field: string;

  @Column({ type: 'jsonb' })
  localValue: any;

  @Column({ type: 'jsonb' })
  sisValue: any;

  @Column({
    type: 'enum',
    enum: ConflictResolution,
    nullable: true,
  })
  resolution: ConflictResolution | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  resolvedBy: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => SyncSession, (session) => session.conflicts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session: SyncSession;
}
