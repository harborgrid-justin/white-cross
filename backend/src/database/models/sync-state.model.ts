import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
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

@Table({
  tableName: 'sync_states',
  timestamps: true,
  indexes: [
    {
      fields: ['entityType', 'entityId'],
      unique: true,
    },
  ],
})
export class SyncState extends Model<SyncStateAttributes> implements SyncStateAttributes {
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
}
