import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface SyncStateAttributes {
  id?: string;
  entityType: string;
  entityId: string;
  lastSyncAt: Date;
  syncStatus: string;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'sync_states',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['entityType', 'entityId'],
      unique: true,
    },
    {
      fields: ['createdAt'],
      name: 'idx_sync_state_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_sync_state_updated_at',
    },
  ],
})
export class SyncState
  extends Model<SyncStateAttributes>
  implements SyncStateAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  entityType: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  entityId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  lastSyncAt: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  syncStatus: string;

  @Column(DataType.TEXT)
  errorMessage?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: SyncState) {
    await createModelAuditHook('SyncState', instance);
  }
}

// Default export for Sequelize-TypeScript
export default SyncState;
