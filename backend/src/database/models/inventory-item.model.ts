import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  BeforeCreate,
  Scopes,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
    {
      // Full-text search GIN index (created by migration)
      name: 'idx_inventory_items_search_vector',
      using: 'GIN',
      fields: ['search_vector'] as any, // tsvector type, managed by PostgreSQL trigger
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
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] InventoryItem ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
