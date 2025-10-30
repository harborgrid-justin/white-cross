import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';


export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ORDERED = 'ORDERED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderAttributes {
  id: string;
  orderNumber: string;
  vendorId: string;
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: PurchaseOrderStatus;
  notes?: string;
}

@Table({
  tableName: 'purchase_orders',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['orderNumber'],
      unique: true,
    },
    {
      fields: ['vendorId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['orderDate'],
    },
  ],
})
export class PurchaseOrder extends Model<PurchaseOrderAttributes> implements PurchaseOrderAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  orderNumber: string;

  @ForeignKey(() => require('./vendor.model').Vendor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  vendorId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  orderDate: Date;

  @Column(DataType.DATE)
  expectedDate?: Date;

  @Column(DataType.DATE)
  receivedDate?: Date;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  subtotal: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  tax: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  shipping: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  total: number;

  @Default(PurchaseOrderStatus.PENDING)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(PurchaseOrderStatus)]
    },
    allowNull: false,
  })
  status: PurchaseOrderStatus;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Relationships
  @BelongsTo(() => require('./vendor.model').Vendor)
  declare vendor?: any;

  @HasMany(() => require('./purchase-order-item.model').PurchaseOrderItem)
  declare items?: any[];
}