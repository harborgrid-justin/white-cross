/**
 * IntegrationConfig Model
 *
 * Configuration for external system integrations (SIS, EHR, etc.)
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  HasMany,
} from 'sequelize-typescript';
import { IntegrationLog } from './integration-log.model';

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

/**
 * IntegrationConfig Model
 * Configuration for external system integrations
 */
@Table({
  tableName: 'integration_configs',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['is_active'] },
    { fields: ['last_sync_at'] },
    { fields: ['created_at'] },
  ],
})
export class IntegrationConfig extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Human-readable name for this integration',
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(IntegrationType)),
    allowNull: false,
    comment: 'Type of external system being integrated',
  })
  @Index
  type: IntegrationType;

  @Column({
    type: DataType.ENUM(...Object.values(IntegrationStatus)),
    allowNull: false,
    defaultValue: IntegrationStatus.INACTIVE,
    comment: 'Current status of the integration',
  })
  @Index
  status: IntegrationStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'API endpoint URL for the external system',
  })
  endpoint: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'API key for authentication',
  })
  apiKey: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'Username for basic authentication',
  })
  username: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Password for basic authentication',
  })
  password: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Additional configuration settings',
  })
  settings: Record<string, any> | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Authentication configuration details',
  })
  authentication: Record<string, any> | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Sync frequency in minutes',
  })
  syncFrequency: number | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether this integration is active',
  })
  @Index
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the last sync operation occurred',
  })
  @Index
  lastSyncAt: Date | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    comment: 'Status of the last sync operation',
  })
  lastSyncStatus: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'When this integration was configured',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'When this integration was last updated',
  })
  declare updatedAt: Date;

  // Relationships
  @HasMany(() => IntegrationLog, {
    foreignKey: 'integrationId',
    as: 'logs',
  })
  logs: IntegrationLog[];
}