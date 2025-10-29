import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { InventoryTransaction } from './inventory-transaction.model';
import { MaintenanceLog } from './maintenance-log.model';
import { PurchaseOrderItem } from './purchase-order-item.model';

export interface InventoryItemAttributes {
  id: string;
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
  isActive: boolean;
}

@Table({
  tableName: 'inventory_items',
  timestamps: true,
  indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['sku'],
      unique: true,
    },
    {
      fields: ['supplier'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['reorderLevel'],
    },
  ],
})
export class InventoryItem extends Model<InventoryItemAttributes> implements InventoryItemAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  sku?: string;

  @Column(DataType.STRING)
  supplier?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  unitCost?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reorderLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reorderQuantity: number;

  @Column(DataType.STRING)
  location?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Relationships
  @HasMany(() => InventoryTransaction)
  transactions?: InventoryTransaction[];

  @HasMany(() => MaintenanceLog)
  maintenanceLogs?: MaintenanceLog[];

  @HasMany(() => PurchaseOrderItem)
  purchaseOrderItems?: PurchaseOrderItem[];
}