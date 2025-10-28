import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IntegrationLog } from './integration-log.entity';

export enum IntegrationType {
  SIS = 'SIS',
  EHR = 'EHR',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
  INSURANCE = 'INSURANCE',
  PARENT_PORTAL = 'PARENT_PORTAL',
  HEALTH_APP = 'HEALTH_APP',
  GOVERNMENT_REPORTING = 'GOVERNMENT_REPORTING',
}

export enum IntegrationStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  TESTING = 'TESTING',
  SYNCING = 'SYNCING',
  ERROR = 'ERROR',
}

@Entity('integration_configs')
export class IntegrationConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: IntegrationType,
  })
  type: IntegrationType;

  @Column({
    type: 'enum',
    enum: IntegrationStatus,
    default: IntegrationStatus.INACTIVE,
  })
  status: IntegrationStatus;

  @Column({ type: 'text', nullable: true })
  endpoint: string | null;

  @Column({ type: 'text', nullable: true })
  apiKey: string | null;

  @Column({ length: 100, nullable: true })
  username: string | null;

  @Column({ type: 'text', nullable: true })
  password: string | null;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  authentication: Record<string, any> | null;

  @Column({ type: 'int', nullable: true })
  syncFrequency: number | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date | null;

  @Column({ length: 20, nullable: true })
  lastSyncStatus: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => IntegrationLog, (log) => log.integration)
  logs: IntegrationLog[];
}
