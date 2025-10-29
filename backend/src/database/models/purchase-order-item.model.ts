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
import { PurchaseOrder } from './purchase-order.model';
import { InventoryItem } from './inventory-item.model';

export interface PurchaseOrderItemAttributes {
  id: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

@Table({
  tableName: 'purchase_order_items',
  timestamps: true,
  indexes: [
    {
      fields: ['purchaseOrderId'],
    },
    {
      fields: ['inventoryItemId'],
    },
  ],
})
export class PurchaseOrderItem extends Model<PurchaseOrderItemAttributes> implements PurchaseOrderItemAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => PurchaseOrder)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  purchaseOrderId: string;

  @ForeignKey(() => InventoryItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inventoryItemId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  unitCost: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  totalCost: number;

  @Column(DataType.DATE)
  declare createdAt: Date;

  // Relationships
  @BelongsTo(() => PurchaseOrder)
  purchaseOrder?: PurchaseOrder;

  @BelongsTo(() => InventoryItem)
  inventoryItem?: InventoryItem;
}