import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  BeforeCreate,
} ,
  Scopes,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export interface VendorAttributes {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
  isActive: boolean;
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
  tableName: 'vendors',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['email'],
      unique: true,
    },
    {
      fields: ['isActive'],
    },,
    {
      fields: ['createdAt'],
      name: 'idx_vendor_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_vendor_updated_at'
    }
  ],
})
export class Vendor extends Model<VendorAttributes> implements VendorAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING(255))
  contactName?: string;

  @Column({
    type: DataType.STRING(255),
    unique: true,
  })
  email?: string;

  @Column(DataType.STRING(255))
  phone?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Column(DataType.STRING(255))
  website?: string;

  @Column(DataType.STRING(255))
  taxId?: string;

  @Column(DataType.TEXT)
  paymentTerms?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column({
    type: DataType.DECIMAL(3, 2),
  })
  rating?: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Relationships
  @HasMany(() => require('./purchase-order.model').PurchaseOrder)
  declare purchaseOrders?: any[];


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Vendor) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] Vendor ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}