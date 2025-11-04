import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Scopes,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'sync_states',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['entityType', 'entityId'],
      unique: true
    },,
    {
      fields: ['createdAt'],
      name: 'idx_sync_state_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_sync_state_updated_at'
    }
  ]
})
export class SyncState extends Model<SyncStateAttributes> implements SyncStateAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  entityType: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  entityId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  lastSyncAt: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
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
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] SyncState ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
