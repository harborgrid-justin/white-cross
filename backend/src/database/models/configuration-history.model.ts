/**
 * ConfigurationHistory Model
 *
 * Sequelize model for tracking changes to system configuration settings
 */

import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';

/**
 * ConfigurationHistory attributes interface
 */
export interface ConfigurationHistoryAttributes {
  id?: string;
  configKey: string;
  oldValue?: string;
  newValue: string;
  changedBy: string;
  configurationId: string;
  createdAt?: Date;
}

/**
 * ConfigurationHistory creation attributes interface
 */
export interface CreateConfigurationHistoryAttributes {
  configKey: string;
  oldValue?: string;
  newValue: string;
  changedBy: string;
  configurationId: string;
}

/**
 * ConfigurationHistory Model
 *
 * Tracks changes to system configuration settings
 */
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'configuration_history',
  timestamps: true,
  updatedAt: false, // History records are immutable
  underscored: false,
  indexes: [
    { fields: ['configKey'] },
    { fields: ['changedBy'] },
    { fields: ['configurationId'] },
    {
      fields: ['createdAt'],
      name: 'idx_configuration_history_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_configuration_history_updated_at',
    },
  ],
})
export class ConfigurationHistory extends Model<
  ConfigurationHistoryAttributes,
  CreateConfigurationHistoryAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Configuration key that was changed',
  })
  @Index
  configKey: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Previous value before the change',
  })
  oldValue?: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'New value after the change',
  })
  newValue: string;

  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'ID of the user who made the change',
  })
  @Index
  changedBy: string;

  @ForeignKey(() => require('./system-config.model').SystemConfig)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'ID of the system configuration that was changed',
  })
  @Index
  configurationId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Timestamp when the configuration change was made',
  })
  declare createdAt?: Date;

  // Relationships
  @BelongsTo(() => require('./system-config.model').SystemConfig, {
    foreignKey: 'configurationId',
    as: 'configuration',
  })
  declare configuration?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ConfigurationHistory) {
    await createModelAuditHook('ConfigurationHistory', instance);
  }
}
