import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IntegrationConfig } from './integration-config.entity';

@Entity('integration_logs')
export class IntegrationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  integrationId: string | null;

  @Column({ length: 50 })
  integrationType: string;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 20 })
  status: string;

  @Column({ type: 'int', nullable: true })
  recordsProcessed: number | null;

  @Column({ type: 'int', nullable: true })
  recordsSucceeded: number | null;

  @Column({ type: 'int', nullable: true })
  recordsFailed: number | null;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => IntegrationConfig, (config) => config.logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'integrationId' })
  integration: IntegrationConfig;
}
