import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
} from '../enums/administration.enums';
import { ConfigurationHistory } from './configuration-history.entity';

/**
 * SystemConfiguration Entity
 *
 * Stores system-wide and scoped configuration settings
 */
@Entity('system_configurations')
@Index(['key'], { unique: true })
@Index(['category'])
@Index(['scope'])
export class SystemConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({
    type: 'enum',
    enum: ConfigCategory,
    default: ConfigCategory.GENERAL,
  })
  category: ConfigCategory;

  @Column({
    type: 'enum',
    enum: ConfigValueType,
    default: ConfigValueType.STRING,
  })
  valueType: ConfigValueType;

  @Column({ length: 100, nullable: true })
  subCategory: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: true })
  isEditable: boolean;

  @Column({ default: false })
  requiresRestart: boolean;

  @Column({
    type: 'enum',
    enum: ConfigScope,
    default: ConfigScope.SYSTEM,
  })
  scope: ConfigScope;

  @Column({ type: 'uuid', nullable: true })
  scopeId: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => ConfigurationHistory, (history) => history.configuration)
  history: ConfigurationHistory[];
}
