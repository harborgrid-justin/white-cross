import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'inventory_items',
  timestamps: true,
  underscored: false,
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
    {
      fields: ['createdAt'],
      name: 'idx_inventory_item_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_inventory_item_updated_at',
    },
  ],
})
export class InventoryItem
  extends Model<InventoryItemAttributes>
  implements InventoryItemAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  category: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.STRING(255),
    unique: true,
  })
  sku?: string;

  @Column(DataType.STRING(255))
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

  @Column(DataType.STRING(255))
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
  @HasMany(() => require('./inventory-transaction.model').InventoryTransaction)
  declare transactions?: any[];

  @HasMany(() => require('./maintenance-log.model').MaintenanceLog)
  declare maintenanceLogs?: any[];

  @HasMany(() => require('./purchase-order-item.model').PurchaseOrderItem)
  declare purchaseOrderItems?: any[];

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: InventoryItem) {
    await createModelAuditHook('InventoryItem', instance);
  }
}

// Default export for Sequelize-TypeScript
export default InventoryItem;
