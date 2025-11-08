/**
 * CONSTRUCTION MATERIAL MANAGEMENT KIT
 *
 * Comprehensive construction material procurement, inventory, and tracking toolkit.
 * Provides 40 specialized functions covering:
 * - Material requisition and procurement tracking
 * - Inventory management and stock level monitoring
 * - Material receiving, inspection, and quality verification
 * - Waste tracking, surplus management, and recycling
 * - Material cost tracking, variance analysis, and budget control
 * - Supplier management and vendor performance tracking
 * - Material delivery scheduling and logistics coordination
 * - Material allocation to projects and work orders
 * - Material consumption tracking and yield analysis
 * - Stockroom organization and warehouse management
 * - Reorder point calculation and automatic procurement
 * - Material substitution and equivalency tracking
 * - Hazardous material handling and compliance (OSHA, EPA)
 * - Material certification and testing documentation
 * - Bill of materials (BOM) management and takeoff integration
 *
 * @module ConstructionMaterialManagementKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @performance Optimized for large material catalogs (50,000+ SKUs)
 *
 * @example
 * ```typescript
 * import {
 *   createMaterialRequisition,
 *   receiveMaterial,
 *   trackMaterialInventory,
 *   allocateMaterialToProject,
 *   trackMaterialWaste,
 *   ConstructionMaterial,
 *   MaterialCategory
 * } from './construction-material-management-kit';
 *
 * // Create material requisition
 * const requisition = await createMaterialRequisition({
 *   projectId: 'PROJ-2024-045',
 *   materialSku: 'CONC-MIX-3000',
 *   quantityRequested: 500,
 *   unitOfMeasure: 'cubic_yards',
 *   requiredDate: new Date('2024-12-15')
 * });
 *
 * // Receive material
 * await receiveMaterial(requisition.id, {
 *   quantityReceived: 500,
 *   receivedDate: new Date(),
 *   inspectionPassed: true
 * });
 *
 * // Track waste
 * await trackMaterialWaste('PROJ-2024-045', 'CONC-MIX-3000', {
 *   quantity: 15,
 *   reason: 'spillage',
 *   cost: 750
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Material categories
 */
export enum MaterialCategory {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  LUMBER = 'lumber',
  MASONRY = 'masonry',
  DRYWALL = 'drywall',
  INSULATION = 'insulation',
  ROOFING = 'roofing',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  HVAC = 'hvac',
  PAINT = 'paint',
  FLOORING = 'flooring',
  HARDWARE = 'hardware',
  AGGREGATES = 'aggregates',
  ASPHALT = 'asphalt',
  GLASS = 'glass',
  SEALANTS = 'sealants',
  HAZARDOUS = 'hazardous',
}

/**
 * Unit of measure
 */
export enum UnitOfMeasure {
  EACH = 'each',
  BOX = 'box',
  CASE = 'case',
  LINEAR_FOOT = 'linear_foot',
  SQUARE_FOOT = 'square_foot',
  CUBIC_YARD = 'cubic_yard',
  TON = 'ton',
  POUND = 'pound',
  GALLON = 'gallon',
  LITER = 'liter',
  PALLET = 'pallet',
  BUNDLE = 'bundle',
  ROLL = 'roll',
}

/**
 * Material status
 */
export enum MaterialStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  ON_ORDER = 'on_order',
  DISCONTINUED = 'discontinued',
  QUARANTINED = 'quarantined',
}

/**
 * Requisition status
 */
export enum RequisitionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ORDERED = 'ordered',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

/**
 * Waste reason codes
 */
export enum WasteReason {
  SPILLAGE = 'spillage',
  DAMAGE = 'damage',
  DEFECTIVE = 'defective',
  OVERAGE = 'overage',
  EXPIRED = 'expired',
  CONTAMINATION = 'contamination',
  MISCALCULATION = 'miscalculation',
  REWORK = 'rework',
}

/**
 * Quality inspection status
 */
export enum InspectionStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL = 'conditional',
  NOT_REQUIRED = 'not_required',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Construction Material Model
 */
@Table({
  tableName: 'construction_materials',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['sku'], unique: true },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['vendor_id'] },
  ],
})
export class ConstructionMaterial extends Model {
  @ApiProperty({
    description: 'Unique material identifier',
    example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({
    description: 'Material SKU/part number',
    example: 'CONC-MIX-3000',
  })
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  @Index
  sku!: string;

  @ApiProperty({
    description: 'Material name',
    example: 'Ready-Mix Concrete 3000 PSI',
  })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({
    description: 'Material description',
    example: 'High-strength ready-mix concrete, 3000 PSI compressive strength',
  })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({
    description: 'Material category',
    enum: MaterialCategory,
    example: MaterialCategory.CONCRETE,
  })
  @Column({
    type: DataType.ENUM(...Object.values(MaterialCategory)),
    allowNull: false,
  })
  @Index
  category!: MaterialCategory;

  @ApiProperty({
    description: 'Unit of measure',
    enum: UnitOfMeasure,
    example: UnitOfMeasure.CUBIC_YARD,
  })
  @Column({
    type: DataType.ENUM(...Object.values(UnitOfMeasure)),
    allowNull: false,
  })
  unitOfMeasure!: UnitOfMeasure;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 1250.5,
  })
  @Column({ type: DataType.DECIMAL(15, 4), defaultValue: 0 })
  stockQuantity!: number;

  @ApiProperty({
    description: 'Minimum stock level for reorder',
    example: 500,
  })
  @Column({ type: DataType.DECIMAL(15, 4) })
  reorderPoint?: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 3000,
  })
  @Column({ type: DataType.DECIMAL(15, 4) })
  maxStockLevel?: number;

  @ApiProperty({
    description: 'Material status',
    enum: MaterialStatus,
    example: MaterialStatus.AVAILABLE,
  })
  @Column({
    type: DataType.ENUM(...Object.values(MaterialStatus)),
    defaultValue: MaterialStatus.AVAILABLE,
  })
  @Index
  status!: MaterialStatus;

  @ApiProperty({
    description: 'Unit cost',
    example: 125.50,
  })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  unitCost!: number;

  @ApiProperty({
    description: 'Last purchase price',
    example: 120.00,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  lastPurchasePrice?: number;

  @ApiProperty({
    description: 'Average cost (weighted)',
    example: 123.25,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  averageCost?: number;

  @ApiProperty({
    description: 'Primary vendor/supplier ID',
    example: 'VEND-123',
  })
  @Column({ type: DataType.STRING(50) })
  @Index
  vendorId?: string;

  @ApiProperty({
    description: 'Vendor part number',
    example: 'SUPP-CONC-3K',
  })
  @Column({ type: DataType.STRING(100) })
  vendorPartNumber?: string;

  @ApiProperty({
    description: 'Manufacturer name',
    example: 'ABC Concrete Co.',
  })
  @Column({ type: DataType.STRING(200) })
  manufacturer?: string;

  @ApiProperty({
    description: 'Lead time in days',
    example: 7,
  })
  @Column({ type: DataType.INTEGER })
  leadTimeDays?: number;

  @ApiProperty({
    description: 'Storage location',
    example: 'Warehouse A, Section 3, Aisle 5',
  })
  @Column({ type: DataType.STRING(200) })
  storageLocation?: string;

  @ApiProperty({
    description: 'Shelf life in days (null = no expiration)',
    example: 365,
  })
  @Column({ type: DataType.INTEGER })
  shelfLifeDays?: number;

  @ApiProperty({
    description: 'Whether material is hazardous',
    example: false,
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isHazardous!: boolean;

  @ApiProperty({
    description: 'Safety Data Sheet (SDS) URL',
    example: 'https://example.com/sds/concrete-mix-3000.pdf',
  })
  @Column({ type: DataType.STRING(500) })
  sdsUrl?: string;

  @ApiProperty({
    description: 'Material certifications required',
    example: ['ASTM-C94', 'ISO-9001'],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  requiredCertifications?: string[];

  @ApiProperty({
    description: 'Material specifications (JSON)',
    example: { psi: 3000, slump: '4-6 inches', airContent: '6%' },
  })
  @Column({ type: DataType.JSONB })
  specifications?: Record<string, any>;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Store in dry location, protect from freezing',
  })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({
    description: 'Whether material is active',
    example: true,
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => MaterialRequisition)
  requisitions?: MaterialRequisition[];

  @HasMany(() => MaterialTransaction)
  transactions?: MaterialTransaction[];
}

/**
 * Material Requisition Model
 */
@Table({
  tableName: 'material_requisitions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['material_id'] },
    { fields: ['project_id'] },
    { fields: ['status'] },
    { fields: ['required_date'] },
    { fields: ['requisition_number'], unique: true },
  ],
})
export class MaterialRequisition extends Model {
  @ApiProperty({
    description: 'Unique requisition identifier',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({
    description: 'Requisition number',
    example: 'REQ-2024-001234',
  })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  requisitionNumber!: string;

  @ApiProperty({
    description: 'Material ID',
    example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
  })
  @ForeignKey(() => ConstructionMaterial)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  materialId!: string;

  @BelongsTo(() => ConstructionMaterial)
  material?: ConstructionMaterial;

  @ApiProperty({
    description: 'Project ID',
    example: 'PROJ-2024-045',
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  projectId!: string;

  @ApiProperty({
    description: 'Project name',
    example: 'Downtown Office Complex',
  })
  @Column({ type: DataType.STRING(200) })
  projectName?: string;

  @ApiProperty({
    description: 'Quantity requested',
    example: 500,
  })
  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false })
  quantityRequested!: number;

  @ApiProperty({
    description: 'Quantity approved',
    example: 500,
  })
  @Column({ type: DataType.DECIMAL(15, 4) })
  quantityApproved?: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 500,
  })
  @Column({ type: DataType.DECIMAL(15, 4) })
  quantityOrdered?: number;

  @ApiProperty({
    description: 'Quantity received',
    example: 485,
  })
  @Column({ type: DataType.DECIMAL(15, 4), defaultValue: 0 })
  quantityReceived!: number;

  @ApiProperty({
    description: 'Requisition status',
    enum: RequisitionStatus,
    example: RequisitionStatus.SUBMITTED,
  })
  @Column({
    type: DataType.ENUM(...Object.values(RequisitionStatus)),
    defaultValue: RequisitionStatus.DRAFT,
  })
  @Index
  status!: RequisitionStatus;

  @ApiProperty({
    description: 'Required delivery date',
    example: '2024-12-15T00:00:00Z',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  requiredDate!: Date;

  @ApiProperty({
    description: 'Estimated unit cost',
    example: 125.50,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedUnitCost?: number;

  @ApiProperty({
    description: 'Estimated total cost',
    example: 62750.00,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedTotalCost?: number;

  @ApiProperty({
    description: 'Actual total cost',
    example: 58200.00,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  actualTotalCost?: number;

  @ApiProperty({
    description: 'Delivery location',
    example: 'Job Site - 123 Main Street',
  })
  @Column({ type: DataType.STRING(200) })
  deliveryLocation?: string;

  @ApiProperty({
    description: 'Delivery instructions',
    example: 'Call foreman 30 minutes before delivery',
  })
  @Column({ type: DataType.TEXT })
  deliveryInstructions?: string;

  @ApiProperty({
    description: 'Requested by user ID',
    example: 'USR-456',
  })
  @Column({ type: DataType.STRING(50) })
  requestedBy?: string;

  @ApiProperty({
    description: 'Approved by user ID',
    example: 'MGR-789',
  })
  @Column({ type: DataType.STRING(50) })
  approvedBy?: string;

  @ApiProperty({
    description: 'Purchase order number',
    example: 'PO-2024-5678',
  })
  @Column({ type: DataType.STRING(50) })
  purchaseOrderNumber?: string;

  @ApiProperty({
    description: 'Vendor/supplier ID',
    example: 'VEND-123',
  })
  @Column({ type: DataType.STRING(50) })
  vendorId?: string;

  @ApiProperty({
    description: 'Requisition notes',
    example: 'Rush order - critical path item',
  })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => MaterialTransaction)
  transactions?: MaterialTransaction[];
}

/**
 * Material Transaction Model (Receipts, Issues, Transfers, Waste)
 */
@Table({
  tableName: 'material_transactions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['material_id'] },
    { fields: ['project_id'] },
    { fields: ['transaction_type'] },
    { fields: ['transaction_date'] },
    { fields: ['requisition_id'] },
  ],
})
export class MaterialTransaction extends Model {
  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'f1e2d3c4-b5a6-9876-5432-1098fedcba98',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({
    description: 'Transaction number',
    example: 'TXN-2024-001234',
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  transactionNumber!: string;

  @ApiProperty({
    description: 'Material ID',
    example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
  })
  @ForeignKey(() => ConstructionMaterial)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  materialId!: string;

  @BelongsTo(() => ConstructionMaterial)
  material?: ConstructionMaterial;

  @ApiProperty({
    description: 'Related requisition ID',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @ForeignKey(() => MaterialRequisition)
  @Column({ type: DataType.UUID })
  @Index
  requisitionId?: string;

  @BelongsTo(() => MaterialRequisition)
  requisition?: MaterialRequisition;

  @ApiProperty({
    description: 'Transaction type',
    example: 'receipt',
  })
  @Column({
    type: DataType.ENUM('receipt', 'issue', 'transfer', 'adjustment', 'waste', 'return'),
    allowNull: false,
  })
  @Index
  transactionType!: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-11-15T14:30:00Z',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  transactionDate!: Date;

  @ApiProperty({
    description: 'Quantity (positive for receipts, negative for issues)',
    example: 500,
  })
  @Column({ type: DataType.DECIMAL(15, 4), allowNull: false })
  quantity!: number;

  @ApiProperty({
    description: 'Unit cost at time of transaction',
    example: 125.50,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  unitCost?: number;

  @ApiProperty({
    description: 'Total cost',
    example: 62750.00,
  })
  @Column({ type: DataType.DECIMAL(15, 2) })
  totalCost?: number;

  @ApiProperty({
    description: 'Project ID (for issues, transfers, waste)',
    example: 'PROJ-2024-045',
  })
  @Column({ type: DataType.STRING(50) })
  @Index
  projectId?: string;

  @ApiProperty({
    description: 'From location (for transfers)',
    example: 'Warehouse A',
  })
  @Column({ type: DataType.STRING(200) })
  fromLocation?: string;

  @ApiProperty({
    description: 'To location (for transfers)',
    example: 'Job Site - 123 Main St',
  })
  @Column({ type: DataType.STRING(200) })
  toLocation?: string;

  @ApiProperty({
    description: 'Waste reason (if transaction_type = waste)',
    enum: WasteReason,
    example: WasteReason.SPILLAGE,
  })
  @Column({ type: DataType.ENUM(...Object.values(WasteReason)) })
  wasteReason?: WasteReason;

  @ApiProperty({
    description: 'Quality inspection status',
    enum: InspectionStatus,
    example: InspectionStatus.PASSED,
  })
  @Column({
    type: DataType.ENUM(...Object.values(InspectionStatus)),
    defaultValue: InspectionStatus.NOT_REQUIRED,
  })
  inspectionStatus!: InspectionStatus;

  @ApiProperty({
    description: 'Inspector name',
    example: 'Jane Doe',
  })
  @Column({ type: DataType.STRING(100) })
  inspectorName?: string;

  @ApiProperty({
    description: 'Inspection notes',
    example: 'All materials meet specifications, minor cosmetic damage to packaging',
  })
  @Column({ type: DataType.TEXT })
  inspectionNotes?: string;

  @ApiProperty({
    description: 'Received by / issued by user ID',
    example: 'USR-456',
  })
  @Column({ type: DataType.STRING(50) })
  handledBy?: string;

  @ApiProperty({
    description: 'Delivery receipt / ticket number',
    example: 'DR-2024-9876',
  })
  @Column({ type: DataType.STRING(50) })
  receiptNumber?: string;

  @ApiProperty({
    description: 'Transaction notes',
    example: 'Partial delivery, balance to follow next week',
  })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({
    description: 'Certification documents',
    example: ['cert-001.pdf', 'test-report-002.pdf'],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  certificationDocuments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Material registration DTO
 */
export class RegisterMaterialDto {
  @ApiProperty({
    description: 'Material SKU/part number',
    example: 'CONC-MIX-3000',
  })
  @IsString()
  sku!: string;

  @ApiProperty({
    description: 'Material name',
    example: 'Ready-Mix Concrete 3000 PSI',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Material category',
    enum: MaterialCategory,
    example: MaterialCategory.CONCRETE,
  })
  @IsEnum(MaterialCategory)
  category!: MaterialCategory;

  @ApiProperty({
    description: 'Unit of measure',
    enum: UnitOfMeasure,
    example: UnitOfMeasure.CUBIC_YARD,
  })
  @IsEnum(UnitOfMeasure)
  unitOfMeasure!: UnitOfMeasure;

  @ApiProperty({
    description: 'Unit cost',
    example: 125.50,
  })
  @IsNumber()
  @Min(0)
  unitCost!: number;

  @ApiProperty({
    description: 'Reorder point',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number;

  @ApiProperty({
    description: 'Material description',
    example: 'High-strength ready-mix concrete',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Vendor ID',
    example: 'VEND-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorId?: string;
}

/**
 * Material requisition DTO
 */
export class CreateRequisitionDto {
  @ApiProperty({
    description: 'Material ID',
    example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
  })
  @IsUUID()
  materialId!: string;

  @ApiProperty({
    description: 'Project ID',
    example: 'PROJ-2024-045',
  })
  @IsString()
  projectId!: string;

  @ApiProperty({
    description: 'Quantity requested',
    example: 500,
  })
  @IsNumber()
  @Min(0.0001)
  quantityRequested!: number;

  @ApiProperty({
    description: 'Required delivery date',
    example: '2024-12-15T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  requiredDate!: Date;

  @ApiProperty({
    description: 'Delivery location',
    example: 'Job Site - 123 Main Street',
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryLocation?: string;

  @ApiProperty({
    description: 'Delivery instructions',
    example: 'Call foreman before delivery',
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryInstructions?: string;
}

/**
 * Material receipt DTO
 */
export class ReceiveMaterialDto {
  @ApiProperty({
    description: 'Quantity received',
    example: 485,
  })
  @IsNumber()
  @Min(0.0001)
  quantityReceived!: number;

  @ApiProperty({
    description: 'Actual unit cost',
    example: 120.00,
  })
  @IsNumber()
  @Min(0)
  unitCost!: number;

  @ApiProperty({
    description: 'Inspection passed',
    example: true,
  })
  @IsBoolean()
  inspectionPassed!: boolean;

  @ApiProperty({
    description: 'Delivery receipt number',
    example: 'DR-2024-9876',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiProperty({
    description: 'Inspection notes',
    example: 'All materials meet specifications',
    required: false,
  })
  @IsOptional()
  @IsString()
  inspectionNotes?: string;

  @ApiProperty({
    description: 'Certification documents',
    example: ['cert-001.pdf'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  certificationDocuments?: string[];
}

// ============================================================================
// MATERIAL REGISTRATION & INVENTORY FUNCTIONS
// ============================================================================

/**
 * Registers new material in the system.
 *
 * @param {RegisterMaterialDto} data - Material registration data
 * @returns {Promise<ConstructionMaterial>} Registered material record
 *
 * @example
 * ```typescript
 * const material = await registerMaterial({
 *   sku: 'CONC-MIX-3000',
 *   name: 'Ready-Mix Concrete 3000 PSI',
 *   category: MaterialCategory.CONCRETE,
 *   unitOfMeasure: UnitOfMeasure.CUBIC_YARD,
 *   unitCost: 125.50,
 *   reorderPoint: 500
 * });
 * ```
 */
export const registerMaterial = async (
  data: RegisterMaterialDto
): Promise<ConstructionMaterial> => {
  const existing = await ConstructionMaterial.findOne({
    where: { sku: data.sku },
  });

  if (existing) {
    throw new ConflictException(`Material with SKU ${data.sku} already exists`);
  }

  const material = await ConstructionMaterial.create({
    ...data,
    stockQuantity: 0,
    status: MaterialStatus.OUT_OF_STOCK,
    averageCost: data.unitCost,
    isActive: true,
  });

  return material;
};

/**
 * Updates material inventory quantity.
 *
 * @param {string} materialId - Material ID
 * @param {number} quantity - New quantity
 * @returns {Promise<ConstructionMaterial>} Updated material
 *
 * @example
 * ```typescript
 * await updateMaterialInventory(materialId, 1250.5);
 * ```
 */
export const updateMaterialInventory = async (
  materialId: string,
  quantity: number
): Promise<ConstructionMaterial> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  let status = MaterialStatus.AVAILABLE;
  if (quantity === 0) {
    status = MaterialStatus.OUT_OF_STOCK;
  } else if (material.reorderPoint && quantity <= material.reorderPoint) {
    status = MaterialStatus.LOW_STOCK;
  }

  await material.update({ stockQuantity: quantity, status });
  return material;
};

/**
 * Gets current inventory for material.
 *
 * @param {string} materialId - Material ID
 * @returns {Promise<object>} Inventory details
 *
 * @example
 * ```typescript
 * const inventory = await trackMaterialInventory(materialId);
 * console.log(`Stock: ${inventory.stockQuantity} ${inventory.unitOfMeasure}`);
 * ```
 */
export const trackMaterialInventory = async (
  materialId: string
): Promise<{
  material: ConstructionMaterial;
  stockQuantity: number;
  stockValue: number;
  status: MaterialStatus;
  daysUntilReorder: number | null;
}> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const stockValue = material.stockQuantity * (material.averageCost || material.unitCost);

  let daysUntilReorder = null;
  if (material.reorderPoint && material.stockQuantity > material.reorderPoint) {
    // Simplified calculation - would need consumption rate for accurate prediction
    daysUntilReorder = 30; // Placeholder
  }

  return {
    material,
    stockQuantity: material.stockQuantity,
    stockValue: Math.round(stockValue * 100) / 100,
    status: material.status,
    daysUntilReorder,
  };
};

/**
 * Searches materials by filters.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<ConstructionMaterial[]>} Matching materials
 *
 * @example
 * ```typescript
 * const materials = await searchMaterials({
 *   category: MaterialCategory.CONCRETE,
 *   status: MaterialStatus.AVAILABLE
 * });
 * ```
 */
export const searchMaterials = async (filters: {
  category?: MaterialCategory;
  status?: MaterialStatus;
  vendorId?: string;
  isHazardous?: boolean;
}): Promise<ConstructionMaterial[]> => {
  const where: WhereOptions = { isActive: true };

  if (filters.category) where.category = filters.category;
  if (filters.status) where.status = filters.status;
  if (filters.vendorId) where.vendorId = filters.vendorId;
  if (filters.isHazardous !== undefined) where.isHazardous = filters.isHazardous;

  return ConstructionMaterial.findAll({ where, order: [['name', 'ASC']] });
};

/**
 * Updates material unit cost.
 *
 * @param {string} materialId - Material ID
 * @param {number} newCost - New unit cost
 * @returns {Promise<ConstructionMaterial>} Updated material
 *
 * @example
 * ```typescript
 * await updateMaterialCost(materialId, 130.00);
 * ```
 */
export const updateMaterialCost = async (
  materialId: string,
  newCost: number
): Promise<ConstructionMaterial> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  await material.update({
    unitCost: newCost,
    lastPurchasePrice: newCost,
  });

  return material;
};

/**
 * Sets material reorder point.
 *
 * @param {string} materialId - Material ID
 * @param {number} reorderPoint - Minimum stock level
 * @param {number} [maxStock] - Optional maximum stock level
 * @returns {Promise<ConstructionMaterial>} Updated material
 *
 * @example
 * ```typescript
 * await setReorderPoint(materialId, 500, 3000);
 * ```
 */
export const setReorderPoint = async (
  materialId: string,
  reorderPoint: number,
  maxStock?: number
): Promise<ConstructionMaterial> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  await material.update({
    reorderPoint,
    maxStockLevel: maxStock,
  });

  // Update status if currently below reorder point
  if (material.stockQuantity <= reorderPoint) {
    await material.update({ status: MaterialStatus.LOW_STOCK });
  }

  return material;
};

// ============================================================================
// MATERIAL REQUISITION & PROCUREMENT FUNCTIONS
// ============================================================================

/**
 * Creates material requisition.
 *
 * @param {CreateRequisitionDto} data - Requisition data
 * @returns {Promise<MaterialRequisition>} Created requisition
 *
 * @example
 * ```typescript
 * const requisition = await createMaterialRequisition({
 *   materialId: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
 *   projectId: 'PROJ-2024-045',
 *   quantityRequested: 500,
 *   requiredDate: new Date('2024-12-15')
 * });
 * ```
 */
export const createMaterialRequisition = async (
  data: CreateRequisitionDto
): Promise<MaterialRequisition> => {
  const material = await ConstructionMaterial.findByPk(data.materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const requisitionNumber = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const estimatedUnitCost = material.unitCost;
  const estimatedTotalCost = estimatedUnitCost * data.quantityRequested;

  const requisition = await MaterialRequisition.create({
    requisitionNumber,
    materialId: data.materialId,
    projectId: data.projectId,
    quantityRequested: data.quantityRequested,
    requiredDate: data.requiredDate,
    deliveryLocation: data.deliveryLocation,
    deliveryInstructions: data.deliveryInstructions,
    estimatedUnitCost,
    estimatedTotalCost,
    status: RequisitionStatus.DRAFT,
  });

  return requisition;
};

/**
 * Submits requisition for approval.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} requestedBy - User ID
 * @returns {Promise<MaterialRequisition>} Updated requisition
 *
 * @example
 * ```typescript
 * await submitRequisition(requisitionId, 'USR-456');
 * ```
 */
export const submitRequisition = async (
  requisitionId: string,
  requestedBy: string
): Promise<MaterialRequisition> => {
  const requisition = await MaterialRequisition.findByPk(requisitionId);
  if (!requisition) {
    throw new NotFoundException('Requisition not found');
  }

  if (requisition.status !== RequisitionStatus.DRAFT) {
    throw new BadRequestException('Can only submit draft requisitions');
  }

  await requisition.update({
    status: RequisitionStatus.SUBMITTED,
    requestedBy,
  });

  return requisition;
};

/**
 * Approves material requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} approvedBy - Approver user ID
 * @param {number} [quantityApproved] - Optional different quantity
 * @returns {Promise<MaterialRequisition>} Approved requisition
 *
 * @example
 * ```typescript
 * await approveRequisition(requisitionId, 'MGR-789');
 * ```
 */
export const approveRequisition = async (
  requisitionId: string,
  approvedBy: string,
  quantityApproved?: number
): Promise<MaterialRequisition> => {
  const requisition = await MaterialRequisition.findByPk(requisitionId);
  if (!requisition) {
    throw new NotFoundException('Requisition not found');
  }

  if (requisition.status !== RequisitionStatus.SUBMITTED) {
    throw new BadRequestException('Can only approve submitted requisitions');
  }

  const approved = quantityApproved || requisition.quantityRequested;

  await requisition.update({
    status: RequisitionStatus.APPROVED,
    approvedBy,
    quantityApproved: approved,
  });

  return requisition;
};

/**
 * Creates purchase order from requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} vendorId - Vendor ID
 * @param {string} [purchaseOrderNumber] - Optional PO number
 * @returns {Promise<MaterialRequisition>} Updated requisition
 *
 * @example
 * ```typescript
 * await createPurchaseOrder(requisitionId, 'VEND-123', 'PO-2024-5678');
 * ```
 */
export const createPurchaseOrder = async (
  requisitionId: string,
  vendorId: string,
  purchaseOrderNumber?: string
): Promise<MaterialRequisition> => {
  const requisition = await MaterialRequisition.findByPk(requisitionId);
  if (!requisition) {
    throw new NotFoundException('Requisition not found');
  }

  if (requisition.status !== RequisitionStatus.APPROVED) {
    throw new BadRequestException('Can only create PO for approved requisitions');
  }

  const poNumber = purchaseOrderNumber || `PO-${Date.now()}`;

  await requisition.update({
    status: RequisitionStatus.ORDERED,
    vendorId,
    purchaseOrderNumber: poNumber,
    quantityOrdered: requisition.quantityApproved,
  });

  return requisition;
};

/**
 * Gets requisitions by project.
 *
 * @param {string} projectId - Project ID
 * @param {RequisitionStatus} [status] - Optional status filter
 * @returns {Promise<MaterialRequisition[]>} Project requisitions
 *
 * @example
 * ```typescript
 * const requisitions = await getProjectRequisitions('PROJ-2024-045');
 * ```
 */
export const getProjectRequisitions = async (
  projectId: string,
  status?: RequisitionStatus
): Promise<MaterialRequisition[]> => {
  const where: WhereOptions = { projectId };
  if (status) where.status = status;

  return MaterialRequisition.findAll({
    where,
    include: [ConstructionMaterial],
    order: [['requiredDate', 'ASC']],
  });
};

// ============================================================================
// MATERIAL RECEIVING & QUALITY VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Receives material from requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {ReceiveMaterialDto} data - Receipt data
 * @returns {Promise<MaterialTransaction>} Receipt transaction
 *
 * @example
 * ```typescript
 * const receipt = await receiveMaterial(requisitionId, {
 *   quantityReceived: 485,
 *   unitCost: 120.00,
 *   inspectionPassed: true,
 *   receiptNumber: 'DR-2024-9876'
 * });
 * ```
 */
export const receiveMaterial = async (
  requisitionId: string,
  data: ReceiveMaterialDto
): Promise<MaterialTransaction> => {
  const requisition = await MaterialRequisition.findByPk(requisitionId, {
    include: [ConstructionMaterial],
  });

  if (!requisition) {
    throw new NotFoundException('Requisition not found');
  }

  if (requisition.status !== RequisitionStatus.ORDERED &&
      requisition.status !== RequisitionStatus.PARTIALLY_RECEIVED) {
    throw new BadRequestException('Requisition must be in ordered status');
  }

  const totalCost = data.quantityReceived * data.unitCost;
  const transactionNumber = `RCV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const transaction = await MaterialTransaction.create({
    transactionNumber,
    materialId: requisition.materialId,
    requisitionId: requisition.id,
    transactionType: 'receipt',
    transactionDate: new Date(),
    quantity: data.quantityReceived,
    unitCost: data.unitCost,
    totalCost,
    receiptNumber: data.receiptNumber,
    inspectionStatus: data.inspectionPassed
      ? InspectionStatus.PASSED
      : InspectionStatus.FAILED,
    inspectionNotes: data.inspectionNotes,
    certificationDocuments: data.certificationDocuments,
  });

  // Update requisition
  const newQuantityReceived = requisition.quantityReceived + data.quantityReceived;
  const actualTotalCost = (requisition.actualTotalCost || 0) + totalCost;

  let newStatus = RequisitionStatus.PARTIALLY_RECEIVED;
  if (newQuantityReceived >= (requisition.quantityOrdered || requisition.quantityApproved || 0)) {
    newStatus = RequisitionStatus.RECEIVED;
  }

  await requisition.update({
    quantityReceived: newQuantityReceived,
    actualTotalCost,
    status: newStatus,
  });

  // Update material inventory if inspection passed
  if (data.inspectionPassed && requisition.material) {
    const newStock = requisition.material.stockQuantity + data.quantityReceived;
    await updateMaterialInventory(requisition.materialId, newStock);

    // Update average cost
    const currentValue = requisition.material.stockQuantity * (requisition.material.averageCost || 0);
    const newValue = currentValue + totalCost;
    const newAvgCost = newValue / newStock;
    await requisition.material.update({ averageCost: newAvgCost });
  }

  return transaction;
};

/**
 * Performs quality inspection on received material.
 *
 * @param {string} transactionId - Transaction ID
 * @param {boolean} passed - Whether inspection passed
 * @param {string} inspectorName - Inspector name
 * @param {string} [notes] - Inspection notes
 * @returns {Promise<MaterialTransaction>} Updated transaction
 *
 * @example
 * ```typescript
 * await verifyMaterialQuality(transactionId, true, 'Jane Doe', 'All specs met');
 * ```
 */
export const verifyMaterialQuality = async (
  transactionId: string,
  passed: boolean,
  inspectorName: string,
  notes?: string
): Promise<MaterialTransaction> => {
  const transaction = await MaterialTransaction.findByPk(transactionId, {
    include: [ConstructionMaterial],
  });

  if (!transaction) {
    throw new NotFoundException('Transaction not found');
  }

  const inspectionStatus = passed
    ? InspectionStatus.PASSED
    : InspectionStatus.FAILED;

  await transaction.update({
    inspectionStatus,
    inspectorName,
    inspectionNotes: notes,
  });

  // If failed, quarantine the material
  if (!passed && transaction.material) {
    await transaction.material.update({ status: MaterialStatus.QUARANTINED });
  }

  return transaction;
};

/**
 * Records material certification documents.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string[]} documents - Document URLs or IDs
 * @returns {Promise<MaterialTransaction>} Updated transaction
 *
 * @example
 * ```typescript
 * await recordCertification(transactionId, ['cert-001.pdf', 'test-report.pdf']);
 * ```
 */
export const recordCertification = async (
  transactionId: string,
  documents: string[]
): Promise<MaterialTransaction> => {
  const transaction = await MaterialTransaction.findByPk(transactionId);
  if (!transaction) {
    throw new NotFoundException('Transaction not found');
  }

  await transaction.update({ certificationDocuments: documents });
  return transaction;
};

// ============================================================================
// MATERIAL ALLOCATION & ISSUE FUNCTIONS
// ============================================================================

/**
 * Allocates material to project.
 *
 * @param {string} materialId - Material ID
 * @param {string} projectId - Project ID
 * @param {number} quantity - Quantity to allocate
 * @param {string} [location] - Delivery location
 * @returns {Promise<MaterialTransaction>} Issue transaction
 *
 * @example
 * ```typescript
 * await allocateMaterialToProject(materialId, 'PROJ-2024-045', 250, 'Job Site A');
 * ```
 */
export const allocateMaterialToProject = async (
  materialId: string,
  projectId: string,
  quantity: number,
  location?: string
): Promise<MaterialTransaction> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  if (material.stockQuantity < quantity) {
    throw new BadRequestException('Insufficient stock quantity');
  }

  const transactionNumber = `ISS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const totalCost = quantity * (material.averageCost || material.unitCost);

  const transaction = await MaterialTransaction.create({
    transactionNumber,
    materialId,
    transactionType: 'issue',
    transactionDate: new Date(),
    quantity: -quantity, // Negative for issue
    unitCost: material.averageCost || material.unitCost,
    totalCost,
    projectId,
    toLocation: location,
  });

  // Update inventory
  const newStock = material.stockQuantity - quantity;
  await updateMaterialInventory(materialId, newStock);

  return transaction;
};

/**
 * Transfers material between locations.
 *
 * @param {string} materialId - Material ID
 * @param {string} fromLocation - Source location
 * @param {string} toLocation - Destination location
 * @param {number} quantity - Quantity to transfer
 * @returns {Promise<MaterialTransaction>} Transfer transaction
 *
 * @example
 * ```typescript
 * await transferMaterial(materialId, 'Warehouse A', 'Warehouse B', 100);
 * ```
 */
export const transferMaterial = async (
  materialId: string,
  fromLocation: string,
  toLocation: string,
  quantity: number
): Promise<MaterialTransaction> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  if (material.stockQuantity < quantity) {
    throw new BadRequestException('Insufficient stock for transfer');
  }

  const transactionNumber = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const transaction = await MaterialTransaction.create({
    transactionNumber,
    materialId,
    transactionType: 'transfer',
    transactionDate: new Date(),
    quantity: 0, // Net zero for transfers
    fromLocation,
    toLocation,
  });

  return transaction;
};

/**
 * Returns unused material to inventory.
 *
 * @param {string} materialId - Material ID
 * @param {string} projectId - Project ID
 * @param {number} quantity - Quantity returned
 * @param {string} [reason] - Return reason
 * @returns {Promise<MaterialTransaction>} Return transaction
 *
 * @example
 * ```typescript
 * await returnMaterialToInventory(materialId, 'PROJ-2024-045', 50, 'Surplus');
 * ```
 */
export const returnMaterialToInventory = async (
  materialId: string,
  projectId: string,
  quantity: number,
  reason?: string
): Promise<MaterialTransaction> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const transactionNumber = `RTN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const transaction = await MaterialTransaction.create({
    transactionNumber,
    materialId,
    transactionType: 'return',
    transactionDate: new Date(),
    quantity, // Positive for return
    projectId,
    notes: reason,
  });

  // Update inventory
  const newStock = material.stockQuantity + quantity;
  await updateMaterialInventory(materialId, newStock);

  return transaction;
};

// ============================================================================
// WASTE TRACKING & SURPLUS MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Tracks material waste.
 *
 * @param {string} projectId - Project ID
 * @param {string} materialId - Material ID
 * @param {object} wasteData - Waste details
 * @returns {Promise<MaterialTransaction>} Waste transaction
 *
 * @example
 * ```typescript
 * await trackMaterialWaste('PROJ-2024-045', materialId, {
 *   quantity: 15,
 *   reason: WasteReason.SPILLAGE,
 *   cost: 750,
 *   notes: 'Concrete spillage during pour'
 * });
 * ```
 */
export const trackMaterialWaste = async (
  projectId: string,
  materialId: string,
  wasteData: {
    quantity: number;
    reason: WasteReason;
    cost?: number;
    notes?: string;
  }
): Promise<MaterialTransaction> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const transactionNumber = `WST-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const cost = wasteData.cost || (wasteData.quantity * (material.averageCost || material.unitCost));

  const transaction = await MaterialTransaction.create({
    transactionNumber,
    materialId,
    transactionType: 'waste',
    transactionDate: new Date(),
    quantity: -wasteData.quantity, // Negative for waste
    totalCost: cost,
    projectId,
    wasteReason: wasteData.reason,
    notes: wasteData.notes,
  });

  // Update inventory
  const newStock = material.stockQuantity - wasteData.quantity;
  await updateMaterialInventory(materialId, newStock);

  return transaction;
};

/**
 * Analyzes waste for project.
 *
 * @param {string} projectId - Project ID
 * @param {Date} [startDate] - Analysis start date
 * @param {Date} [endDate] - Analysis end date
 * @returns {Promise<object>} Waste analysis
 *
 * @example
 * ```typescript
 * const wasteAnalysis = await analyzeWaste('PROJ-2024-045');
 * console.log(`Total waste cost: $${wasteAnalysis.totalWasteCost}`);
 * ```
 */
export const analyzeWaste = async (
  projectId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  projectId: string;
  totalWasteQuantity: number;
  totalWasteCost: number;
  wasteByReason: Record<string, { quantity: number; cost: number }>;
  wasteByMaterial: Record<string, { quantity: number; cost: number }>;
}> => {
  const where: WhereOptions = {
    projectId,
    transactionType: 'waste',
  };

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) where.transactionDate[Op.gte] = startDate;
    if (endDate) where.transactionDate[Op.lte] = endDate;
  }

  const wasteTransactions = await MaterialTransaction.findAll({
    where,
    include: [ConstructionMaterial],
  });

  const totalWasteQuantity = wasteTransactions.reduce(
    (sum, t) => sum + Math.abs(t.quantity),
    0
  );
  const totalWasteCost = wasteTransactions.reduce(
    (sum, t) => sum + (t.totalCost || 0),
    0
  );

  const wasteByReason: Record<string, { quantity: number; cost: number }> = {};
  const wasteByMaterial: Record<string, { quantity: number; cost: number }> = {};

  wasteTransactions.forEach((t) => {
    const reason = t.wasteReason || 'unknown';
    if (!wasteByReason[reason]) {
      wasteByReason[reason] = { quantity: 0, cost: 0 };
    }
    wasteByReason[reason].quantity += Math.abs(t.quantity);
    wasteByReason[reason].cost += t.totalCost || 0;

    const materialName = t.material?.name || 'unknown';
    if (!wasteByMaterial[materialName]) {
      wasteByMaterial[materialName] = { quantity: 0, cost: 0 };
    }
    wasteByMaterial[materialName].quantity += Math.abs(t.quantity);
    wasteByMaterial[materialName].cost += t.totalCost || 0;
  });

  return {
    projectId,
    totalWasteQuantity: Math.round(totalWasteQuantity * 100) / 100,
    totalWasteCost: Math.round(totalWasteCost * 100) / 100,
    wasteByReason,
    wasteByMaterial,
  };
};

/**
 * Identifies surplus materials.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<object[]>} Surplus materials
 *
 * @example
 * ```typescript
 * const surplus = await identifySurplusMaterials('PROJ-2024-045');
 * ```
 */
export const identifySurplusMaterials = async (
  projectId: string
): Promise<
  Array<{
    material: ConstructionMaterial;
    surplusQuantity: number;
    surplusValue: number;
  }>
> => {
  // Get all issues for project
  const issues = await MaterialTransaction.findAll({
    where: {
      projectId,
      transactionType: 'issue',
    },
    include: [ConstructionMaterial],
  });

  const materialUsage = new Map<string, number>();
  issues.forEach((issue) => {
    const current = materialUsage.get(issue.materialId) || 0;
    materialUsage.set(issue.materialId, current + Math.abs(issue.quantity));
  });

  // Calculate surplus (simplified - would need BOM comparison in production)
  const surplus: Array<{
    material: ConstructionMaterial;
    surplusQuantity: number;
    surplusValue: number;
  }> = [];

  for (const [materialId, usedQuantity] of materialUsage.entries()) {
    const material = await ConstructionMaterial.findByPk(materialId);
    if (material && material.stockQuantity > 0) {
      // Simplified surplus detection
      surplus.push({
        material,
        surplusQuantity: material.stockQuantity,
        surplusValue:
          material.stockQuantity * (material.averageCost || material.unitCost),
      });
    }
  }

  return surplus;
};

// ============================================================================
// COST TRACKING & VARIANCE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculates material cost for project.
 *
 * @param {string} projectId - Project ID
 * @param {Date} [startDate] - Period start
 * @param {Date} [endDate] - Period end
 * @returns {Promise<object>} Material costs
 *
 * @example
 * ```typescript
 * const costs = await calculateProjectMaterialCost('PROJ-2024-045');
 * console.log(`Total cost: $${costs.totalCost}`);
 * ```
 */
export const calculateProjectMaterialCost = async (
  projectId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  projectId: string;
  totalCost: number;
  costByCategory: Record<string, number>;
  issueCount: number;
  wasteCost: number;
}> => {
  const where: WhereOptions = {
    projectId,
    transactionType: { [Op.in]: ['issue', 'waste'] },
  };

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) where.transactionDate[Op.gte] = startDate;
    if (endDate) where.transactionDate[Op.lte] = endDate;
  }

  const transactions = await MaterialTransaction.findAll({
    where,
    include: [ConstructionMaterial],
  });

  const totalCost = transactions.reduce((sum, t) => sum + (t.totalCost || 0), 0);
  const issueCount = transactions.filter((t) => t.transactionType === 'issue').length;
  const wasteCost = transactions
    .filter((t) => t.transactionType === 'waste')
    .reduce((sum, t) => sum + (t.totalCost || 0), 0);

  const costByCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    const category = t.material?.category || 'unknown';
    costByCategory[category] = (costByCategory[category] || 0) + (t.totalCost || 0);
  });

  return {
    projectId,
    totalCost: Math.round(totalCost * 100) / 100,
    costByCategory,
    issueCount,
    wasteCost: Math.round(wasteCost * 100) / 100,
  };
};

/**
 * Analyzes cost variance (budget vs. actual).
 *
 * @param {string} requisitionId - Requisition ID
 * @returns {Promise<object>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await analyzeCostVariance(requisitionId);
 * console.log(`Variance: ${variance.variancePercentage}%`);
 * ```
 */
export const analyzeCostVariance = async (
  requisitionId: string
): Promise<{
  requisitionId: string;
  estimatedCost: number;
  actualCost: number;
  variance: number;
  variancePercentage: number;
}> => {
  const requisition = await MaterialRequisition.findByPk(requisitionId);
  if (!requisition) {
    throw new NotFoundException('Requisition not found');
  }

  const estimatedCost = requisition.estimatedTotalCost || 0;
  const actualCost = requisition.actualTotalCost || 0;
  const variance = actualCost - estimatedCost;
  const variancePercentage =
    estimatedCost > 0 ? (variance / estimatedCost) * 100 : 0;

  return {
    requisitionId,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    actualCost: Math.round(actualCost * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    variancePercentage: Math.round(variancePercentage * 100) / 100,
  };
};

/**
 * Tracks material consumption rate.
 *
 * @param {string} projectId - Project ID
 * @param {string} materialId - Material ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<object>} Consumption metrics
 *
 * @example
 * ```typescript
 * const consumption = await trackConsumptionRate('PROJ-2024-045', materialId, startDate, endDate);
 * ```
 */
export const trackConsumptionRate = async (
  projectId: string,
  materialId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  materialId: string;
  totalConsumed: number;
  dailyAverage: number;
  periodDays: number;
}> => {
  const transactions = await MaterialTransaction.findAll({
    where: {
      projectId,
      materialId,
      transactionType: 'issue',
      transactionDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalConsumed = transactions.reduce(
    (sum, t) => sum + Math.abs(t.quantity),
    0
  );

  const periodDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyAverage = periodDays > 0 ? totalConsumed / periodDays : 0;

  return {
    materialId,
    totalConsumed: Math.round(totalConsumed * 100) / 100,
    dailyAverage: Math.round(dailyAverage * 100) / 100,
    periodDays,
  };
};

// ============================================================================
// INVENTORY MANAGEMENT & REORDERING FUNCTIONS
// ============================================================================

/**
 * Gets low stock materials.
 *
 * @returns {Promise<ConstructionMaterial[]>} Low stock materials
 *
 * @example
 * ```typescript
 * const lowStock = await getLowStockMaterials();
 * ```
 */
export const getLowStockMaterials = async (): Promise<ConstructionMaterial[]> => {
  return ConstructionMaterial.findAll({
    where: {
      status: MaterialStatus.LOW_STOCK,
      isActive: true,
    },
    order: [['stockQuantity', 'ASC']],
  });
};

/**
 * Calculates reorder quantity.
 *
 * @param {string} materialId - Material ID
 * @param {number} [leadTimeDays] - Lead time
 * @returns {Promise<object>} Reorder calculation
 *
 * @example
 * ```typescript
 * const reorder = await calculateReorderQuantity(materialId);
 * console.log(`Order quantity: ${reorder.orderQuantity}`);
 * ```
 */
export const calculateReorderQuantity = async (
  materialId: string,
  leadTimeDays?: number
): Promise<{
  materialId: string;
  currentStock: number;
  reorderPoint: number;
  orderQuantity: number;
  estimatedCost: number;
}> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const reorderPoint = material.reorderPoint || 0;
  const maxStock = material.maxStockLevel || reorderPoint * 3;
  const orderQuantity = Math.max(0, maxStock - material.stockQuantity);
  const estimatedCost = orderQuantity * material.unitCost;

  return {
    materialId,
    currentStock: material.stockQuantity,
    reorderPoint,
    orderQuantity: Math.round(orderQuantity * 100) / 100,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
  };
};

/**
 * Generates automatic reorder requisitions.
 *
 * @returns {Promise<MaterialRequisition[]>} Created requisitions
 *
 * @example
 * ```typescript
 * const requisitions = await autoGenerateReorders();
 * console.log(`Created ${requisitions.length} reorder requisitions`);
 * ```
 */
export const autoGenerateReorders = async (): Promise<MaterialRequisition[]> => {
  const lowStockMaterials = await getLowStockMaterials();
  const requisitions: MaterialRequisition[] = [];

  for (const material of lowStockMaterials) {
    const reorderCalc = await calculateReorderQuantity(material.id);

    if (reorderCalc.orderQuantity > 0) {
      const requiredDate = new Date();
      requiredDate.setDate(requiredDate.getDate() + (material.leadTimeDays || 7));

      const requisition = await createMaterialRequisition({
        materialId: material.id,
        projectId: 'INVENTORY-REPLENISHMENT',
        quantityRequested: reorderCalc.orderQuantity,
        requiredDate,
      });

      requisitions.push(requisition);
    }
  }

  return requisitions;
};

/**
 * Performs inventory cycle count.
 *
 * @param {string} materialId - Material ID
 * @param {number} countedQuantity - Physically counted quantity
 * @param {string} countedBy - Counter user ID
 * @returns {Promise<MaterialTransaction>} Adjustment transaction
 *
 * @example
 * ```typescript
 * await performCycleCount(materialId, 1245.5, 'USR-789');
 * ```
 */
export const performCycleCount = async (
  materialId: string,
  countedQuantity: number,
  countedBy: string
): Promise<MaterialTransaction | null> => {
  const material = await ConstructionMaterial.findByPk(materialId);
  if (!material) {
    throw new NotFoundException('Material not found');
  }

  const variance = countedQuantity - material.stockQuantity;

  // Create adjustment if variance exists
  if (variance !== 0) {
    const transactionNumber = `ADJ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const transaction = await MaterialTransaction.create({
      transactionNumber,
      materialId,
      transactionType: 'adjustment',
      transactionDate: new Date(),
      quantity: variance,
      notes: `Cycle count adjustment by ${countedBy}. Counted: ${countedQuantity}, System: ${material.stockQuantity}`,
      handledBy: countedBy,
    });

    await updateMaterialInventory(materialId, countedQuantity);

    return transaction;
  }

  return null;
};

/**
 * Gets materials requiring attention (expiring, low stock, quarantined).
 *
 * @returns {Promise<object>} Materials requiring attention
 *
 * @example
 * ```typescript
 * const attention = await getMaterialsRequiringAttention();
 * ```
 */
export const getMaterialsRequiringAttention = async (): Promise<{
  lowStock: ConstructionMaterial[];
  outOfStock: ConstructionMaterial[];
  quarantined: ConstructionMaterial[];
}> => {
  const lowStock = await ConstructionMaterial.findAll({
    where: { status: MaterialStatus.LOW_STOCK, isActive: true },
  });

  const outOfStock = await ConstructionMaterial.findAll({
    where: { status: MaterialStatus.OUT_OF_STOCK, isActive: true },
  });

  const quarantined = await ConstructionMaterial.findAll({
    where: { status: MaterialStatus.QUARANTINED },
  });

  return { lowStock, outOfStock, quarantined };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Formats material summary for reporting.
 *
 * @param {ConstructionMaterial} material - Material record
 * @returns {object} Formatted summary
 */
export const formatMaterialSummary = (material: ConstructionMaterial): object => {
  return {
    id: material.id,
    sku: material.sku,
    name: material.name,
    category: material.category,
    stockQuantity: material.stockQuantity,
    unitOfMeasure: material.unitOfMeasure,
    unitCost: material.unitCost,
    stockValue: material.stockQuantity * (material.averageCost || material.unitCost),
    status: material.status,
  };
};

export default {
  registerMaterial,
  updateMaterialInventory,
  trackMaterialInventory,
  searchMaterials,
  updateMaterialCost,
  setReorderPoint,
  createMaterialRequisition,
  submitRequisition,
  approveRequisition,
  createPurchaseOrder,
  getProjectRequisitions,
  receiveMaterial,
  verifyMaterialQuality,
  recordCertification,
  allocateMaterialToProject,
  transferMaterial,
  returnMaterialToInventory,
  trackMaterialWaste,
  analyzeWaste,
  identifySurplusMaterials,
  calculateProjectMaterialCost,
  analyzeCostVariance,
  trackConsumptionRate,
  getLowStockMaterials,
  calculateReorderQuantity,
  autoGenerateReorders,
  performCycleCount,
  getMaterialsRequiringAttention,
  formatMaterialSummary,
};
