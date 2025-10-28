import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SystemConfiguration } from './system-configuration.entity';

/**
 * ConfigurationHistory Entity
 *
 * Tracks changes to system configuration settings
 */
@Entity('configuration_history')
@Index(['configKey'])
@Index(['changedBy'])
export class ConfigurationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  configKey: string;

  @Column({ type: 'text', nullable: true })
  oldValue: string;

  @Column({ type: 'text' })
  newValue: string;

  @Column({ type: 'uuid' })
  changedBy: string;

  @Column({ type: 'uuid' })
  configurationId: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => SystemConfiguration, (config) => config.history)
  @JoinColumn({ name: 'configurationId' })
  configuration: SystemConfiguration;
}
