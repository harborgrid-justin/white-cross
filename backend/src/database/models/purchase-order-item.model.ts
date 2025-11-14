import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface PurchaseOrderItemAttributes {
  id: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
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
  tableName: 'purchase_order_items',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['purchaseOrderId'],
    },
    {
      fields: ['inventoryItemId'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_purchase_order_item_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_purchase_order_item_updated_at',
    },
  ],
})
export class PurchaseOrderItem
  extends Model<PurchaseOrderItemAttributes>
  implements PurchaseOrderItemAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./purchase-order.model').PurchaseOrder)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  purchaseOrderId: string;

  @ForeignKey(() => require('./inventory-item.model').InventoryItem)
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
  @BelongsTo(() => require('./purchase-order.model').PurchaseOrder)
  declare purchaseOrder?: any;

  @BelongsTo(() => require('./inventory-item.model').InventoryItem)
  declare inventoryItem?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: PurchaseOrderItem) {
    await createModelAuditHook('PurchaseOrderItem', instance);
  }
}

// Default export for Sequelize-TypeScript
export default PurchaseOrderItem;
