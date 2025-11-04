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
  Scopes,
  BeforeUpdate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export enum InventoryTransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  DISPOSAL = 'DISPOSAL'
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'inventory_transactions',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['inventoryItemId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['performedById']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['createdAt'],
      name: 'idx_inventory_transaction_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_inventory_transaction_updated_at'
    }
  ]
})
export class InventoryTransaction extends Model<InventoryTransactionAttributes> implements InventoryTransactionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./inventory-item.model').InventoryItem)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  inventoryItemId: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(InventoryTransactionType)]
    },
    allowNull: false
  })
  type: InventoryTransactionType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2)
  })
  unitCost?: number;

  @Column(DataType.STRING(255))
  reason?: string;

  @Column(DataType.STRING(255))
  batchNumber?: string;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  performedById: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  // Relationships
  @BelongsTo(() => require('./inventory-item.model').InventoryItem)
  declare inventoryItem?: any;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: InventoryTransaction) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] InventoryTransaction ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}