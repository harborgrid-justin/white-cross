
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { RequisitionStatus } from '../types/material.types';
import { ConstructionMaterial } from './construction-material.model';
import { MaterialTransaction } from './material-transaction.model';

@Table({
  tableName: 'material_requisitions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['materialId'] },
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['requiredDate'] },
    { fields: ['requisitionNumber'], unique: true },
  ],
})
export class MaterialRequisition extends Model {
  @ApiProperty({
    description: 'Unique requisition identifier',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({
    description: 'Requisition number',
    example: 'REQ-2024-001234',
  })
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  requisitionNumber: string;

  @ApiProperty({
    description: 'Material ID',
    example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
  })
  @ForeignKey(() => ConstructionMaterial)
  @AllowNull(false)
  @Column(DataType.UUID)
  materialId: string;

  @BelongsTo(() => ConstructionMaterial)
  material?: ConstructionMaterial;

  @ApiProperty({
    description: 'Project ID',
    example: 'PROJ-2024-045',
  })
  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Downtown Office Complex',
  })
  @Column(DataType.STRING(200))
  projectName?: string;

  @ApiProperty({
    description: 'Quantity requested',
    example: 500,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 4))
  quantityRequested: number;

  @ApiProperty({
    description: 'Quantity approved',
    example: 500,
  })
  @Column(DataType.DECIMAL(15, 4))
  quantityApproved?: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 500,
  })
  @Column(DataType.DECIMAL(15, 4))
  quantityOrdered?: number;

  @ApiProperty({
    description: 'Quantity received',
    example: 485,
  })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 4))
  quantityReceived: number;

  @ApiProperty({
    description: 'Requisition status',
    enum: RequisitionStatus,
    example: RequisitionStatus.SUBMITTED,
  })
  @AllowNull(false)
  @Default(RequisitionStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(RequisitionStatus)),
  })
  status: RequisitionStatus;

  @ApiProperty({
    description: 'Required delivery date',
    example: '2024-12-15T00:00:00Z',
  })
  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  requiredDate: Date;

  @ApiProperty({
    description: 'Estimated unit cost',
    example: 125.50,
  })
  @Column(DataType.DECIMAL(15, 2))
  estimatedUnitCost?: number;

  @ApiProperty({
    description: 'Estimated total cost',
    example: 62750.00,
  })
  @Column(DataType.DECIMAL(15, 2))
  estimatedTotalCost?: number;

  @ApiProperty({
    description: 'Actual total cost',
    example: 58200.00,
  })
  @Column(DataType.DECIMAL(15, 2))
  actualTotalCost?: number;

  @ApiProperty({
    description: 'Delivery location',
    example: 'Job Site - 123 Main Street',
  })
  @Column(DataType.STRING(200))
  deliveryLocation?: string;

  @ApiProperty({
    description: 'Delivery instructions',
    example: 'Call foreman 30 minutes before delivery',
  })
  @Column(DataType.TEXT)
  deliveryInstructions?: string;

  @ApiProperty({
    description: 'Requested by user ID',
    example: 'USR-456',
  })
  @Column(DataType.STRING(50))
  requestedBy?: string;

  @ApiProperty({
    description: 'Approved by user ID',
    example: 'MGR-789',
  })
  @Column(DataType.STRING(50))
  approvedBy?: string;

  @ApiProperty({
    description: 'Purchase order number',
    example: 'PO-2024-5678',
  })
  @Column(DataType.STRING(50))
  purchaseOrderNumber?: string;

  @ApiProperty({
    description: 'Vendor/supplier ID',
    example: 'VEND-123',
  })
  @Column(DataType.STRING(50))
  vendorId?: string;

  @ApiProperty({
    description: 'Requisition notes',
    example: 'Rush order - critical path item',
  })
  @Column(DataType.TEXT)
  notes?: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => MaterialTransaction)
  transactions?: MaterialTransaction[];
}
