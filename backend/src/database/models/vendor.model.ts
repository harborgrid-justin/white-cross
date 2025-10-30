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
    },
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
}