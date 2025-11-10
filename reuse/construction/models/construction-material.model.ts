
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { MaterialCategory, UnitOfMeasure, MaterialStatus } from '../types/material.types';
import { MaterialRequisition } from './material-requisition.model';
import { MaterialTransaction } from './material-transaction.model';

@Table({
  tableName: 'construction_materials',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['sku'], unique: true },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['vendorId'] },
  ],
})
export class ConstructionMaterial extends Model {
  @ApiProperty({
    description: 'Unique material identifier',
    example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
  })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({
    description: 'Material SKU/part number',
    example: 'CONC-MIX-3000',
  })
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  sku: string;

  @ApiProperty({
    description: 'Material name',
    example: 'Ready-Mix Concrete 3000 PSI',
  })
  @AllowNull(false)
  @Column(DataType.STRING(200))
  name: string;

  @ApiProperty({
    description: 'Material description',
    example: 'High-strength ready-mix concrete, 3000 PSI compressive strength',
  })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({
    description: 'Material category',
    enum: MaterialCategory,
    example: MaterialCategory.CONCRETE,
  })
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(MaterialCategory)),
  })
  category: MaterialCategory;

  @ApiProperty({
    description: 'Unit of measure',
    enum: UnitOfMeasure,
    example: UnitOfMeasure.CUBIC_YARD,
  })
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(UnitOfMeasure)),
  })
  unitOfMeasure: UnitOfMeasure;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 1250.5,
  })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 4))
  stockQuantity: number;

  @ApiProperty({
    description: 'Minimum stock level for reorder',
    example: 500,
  })
  @Column(DataType.DECIMAL(15, 4))
  reorderPoint?: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 3000,
  })
  @Column(DataType.DECIMAL(15, 4))
  maxStockLevel?: number;

  @ApiProperty({
    description: 'Material status',
    enum: MaterialStatus,
    example: MaterialStatus.AVAILABLE,
  })
  @AllowNull(false)
  @Default(MaterialStatus.AVAILABLE)
  @Column({
    type: DataType.ENUM(...Object.values(MaterialStatus)),
  })
  status: MaterialStatus;

  @ApiProperty({
    description: 'Unit cost',
    example: 125.50,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  unitCost: number;

  @ApiProperty({
    description: 'Last purchase price',
    example: 120.00,
  })
  @Column(DataType.DECIMAL(15, 2))
  lastPurchasePrice?: number;

  @ApiProperty({
    description: 'Average cost (weighted)',
    example: 123.25,
  })
  @Column(DataType.DECIMAL(15, 2))
  averageCost?: number;

  @ApiProperty({
    description: 'Primary vendor/supplier ID',
    example: 'VEND-123',
  })
  @Index
  @Column(DataType.STRING(50))
  vendorId?: string;

  @ApiProperty({
    description: 'Vendor part number',
    example: 'SUPP-CONC-3K',
  })
  @Column(DataType.STRING(100))
  vendorPartNumber?: string;

  @ApiProperty({
    description: 'Manufacturer name',
    example: 'ABC Concrete Co.',
  })
  @Column(DataType.STRING(200))
  manufacturer?: string;

  @ApiProperty({
    description: 'Lead time in days',
    example: 7,
  })
  @Column(DataType.INTEGER)
  leadTimeDays?: number;

  @ApiProperty({
    description: 'Storage location',
    example: 'Warehouse A, Section 3, Aisle 5',
  })
  @Column(DataType.STRING(200))
  storageLocation?: string;

  @ApiProperty({
    description: 'Shelf life in days (null = no expiration)',
    example: 365,
  })
  @Column(DataType.INTEGER)
  shelfLifeDays?: number;

  @ApiProperty({
    description: 'Whether material is hazardous',
    example: false,
  })
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isHazardous: boolean;

  @ApiProperty({
    description: 'Safety Data Sheet (SDS) URL',
    example: 'https://example.com/sds/concrete-mix-3000.pdf',
  })
  @Column(DataType.STRING(500))
  sdsUrl?: string;

  @ApiProperty({
    description: 'Material certifications required',
    example: ['ASTM-C94', 'ISO-9001'],
  })
  @Column(DataType.ARRAY(DataType.STRING))
  requiredCertifications?: string[];

  @ApiProperty({
    description: 'Material specifications (JSON)',
    example: { psi: 3000, slump: '4-6 inches', airContent: '6%' },
  })
  @Column(DataType.JSONB)
  specifications?: Record<string, any>;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Store in dry location, protect from freezing',
  })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({
    description: 'Whether material is active',
    example: true,
  })
  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => MaterialRequisition)
  requisitions?: MaterialRequisition[];

  @HasMany(() => MaterialTransaction)
  transactions?: MaterialTransaction[];
}
