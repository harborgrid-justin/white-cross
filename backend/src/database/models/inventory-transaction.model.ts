import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;

export enum InventoryTransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  DISPOSAL = 'DISPOSAL',
}

export interface InventoryTransactionAttributes {
  id: string;
  inventoryItemId: string;
  type: InventoryTransactionType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: Date;
  performedById: string;
  notes?: string;
}

@Table({
  tableName: 'inventory_transactions',
  timestamps: true,
  indexes: [
    {
      fields: ['inventoryItemId'],
    },
    {
      fields: ['type'],
    },
    {
      fields: ['performedById'],
    },
    {
      fields: ['createdAt'],
    },
  ],
})
export class InventoryTransaction extends Model<InventoryTransactionAttributes> implements InventoryTransactionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./inventory-item.model').InventoryItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inventoryItemId: string;

  @Column({
    type: DataType.ENUM(...(Object.values(InventoryTransactionType) as string[])),
    allowNull: false,
  })
  type: InventoryTransactionType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  unitCost?: number;

  @Column(DataType.STRING)
  reason?: string;

  @Column(DataType.STRING)
  batchNumber?: string;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  performedById: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  // Relationships
  @BelongsTo(() => require('./inventory-item.model').InventoryItem)
  declare inventoryItem?: any;
}