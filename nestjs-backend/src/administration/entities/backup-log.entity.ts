import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BackupType, BackupStatus } from '../enums/administration.enums';

/**
 * BackupLog Entity
 *
 * Tracks database backup operations and their status
 */
@Entity('backup_logs')
@Index(['status'])
@Index(['startedAt'])
export class BackupLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: BackupType,
  })
  type: BackupType;

  @Column({
    type: 'enum',
    enum: BackupStatus,
  })
  status: BackupStatus;

  @Column({ length: 255, nullable: true })
  fileName: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'uuid', nullable: true })
  triggeredBy: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
