
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
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { InspectionStatus, WasteReason } from '../types/material.types';
import { ConstructionMaterial } from './construction-material.model';
import { MaterialRequisition } from './material-requisition.model';

@Table({
  tableName: 'material_transactions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['materialId'] },
    { fields: ['projectId'] },
    { fields: ['transactionType'] },
    { fields: ['transactionDate'] },
    { fields: ['requisitionId'] },
  ],
})
export class MaterialTransaction extends Model {
  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'f1e2d3c4-b5a6-9876-5432-1098fedcba98',
  })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({
    description: 'Transaction number',
    example: 'TXN-2024-001234',
  })
  @AllowNull(false)
  @Column(DataType.STRING(50))
  transactionNumber: string;

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
    description: 'Related requisition ID',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @ForeignKey(() => MaterialRequisition)
  @Index
  @Column(DataType.UUID)
  requisitionId?: string;

  @BelongsTo(() => MaterialRequisition)
  requisition?: MaterialRequisition;

  @ApiProperty({
    description: 'Transaction type',
    example: 'receipt',
  })
  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('receipt', 'issue', 'transfer', 'adjustment', 'waste', 'return'))
  transactionType: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-11-15T14:30:00Z',
  })
  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  transactionDate: Date;

  @ApiProperty({
    description: 'Quantity (positive for receipts, negative for issues)',
    example: 500,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 4))
  quantity: number;

  @ApiProperty({
    description: 'Unit cost at time of transaction',
    example: 125.50,
  })
  @Column(DataType.DECIMAL(15, 2))
  unitCost?: number;

  @ApiProperty({
    description: 'Total cost',
    example: 62750.00,
  })
  @Column(DataType.DECIMAL(15, 2))
  totalCost?: number;

  @ApiProperty({
    description: 'Project ID (for issues, transfers, waste)',
    example: 'PROJ-2024-045',
  })
  @Index
  @Column(DataType.STRING(50))
  projectId?: string;

  @ApiProperty({
    description: 'From location (for transfers)',
    example: 'Warehouse A',
  })
  @Column(DataType.STRING(200))
  fromLocation?: string;

  @ApiProperty({
    description: 'To location (for transfers)',
    example: 'Job Site - 123 Main St',
  })
  @Column(DataType.STRING(200))
  toLocation?: string;

  @ApiProperty({
    description: 'Waste reason (if transaction_type = waste)',
    enum: WasteReason,
    example: WasteReason.SPILLAGE,
  })
  @Column({
    type: DataType.ENUM(...Object.values(WasteReason)),
  })
  wasteReason?: WasteReason;

  @ApiProperty({
    description: 'Quality inspection status',
    enum: InspectionStatus,
    example: InspectionStatus.PASSED,
  })
  @AllowNull(false)
  @Default(InspectionStatus.NOT_REQUIRED)
  @Column({
    type: DataType.ENUM(...Object.values(InspectionStatus)),
  })
  inspectionStatus: InspectionStatus;

  @ApiProperty({
    description: 'Inspector name',
    example: 'Jane Doe',
  })
  @Column(DataType.STRING(100))
  inspectorName?: string;

  @ApiProperty({
    description: 'Inspection notes',
    example: 'All materials meet specifications, minor cosmetic damage to packaging',
  })
  @Column(DataType.TEXT)
  inspectionNotes?: string;

  @ApiProperty({
    description: 'Received by / issued by user ID',
    example: 'USR-456',
  })
  @Column(DataType.STRING(50))
  handledBy?: string;

  @ApiProperty({
    description: 'Delivery receipt / ticket number',
    example: 'DR-2024-9876',
  })
  @Column(DataType.STRING(50))
  receiptNumber?: string;

  @ApiProperty({
    description: 'Transaction notes',
    example: 'Partial delivery, balance to follow next week',
  })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({
    description: 'Certification documents',
    example: ['cert-001.pdf', 'test-report-002.pdf'],
  })
  @Column(DataType.ARRAY(DataType.STRING))
  certificationDocuments?: string[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;
}
