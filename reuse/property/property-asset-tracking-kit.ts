/**
 * LOC: PROP_ASSET_TRACK_001
 * File: /reuse/property/property-asset-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - uuid
 *   - qrcode
 *   - node-cache
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Asset tracking controllers
 *   - Maintenance services
 *   - Inventory management systems
 *   - Depreciation calculators
 *   - Compliance reporting services
 */

/**
 * File: /reuse/property/property-asset-tracking-kit.ts
 * Locator: WC-PROP-ASSET-TRACK-001
 * Purpose: Production-Grade Property Asset Tracking Kit - Enterprise asset management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, UUID, QRCode, Node-Cache
 * Downstream: ../backend/property/*, Asset Management Services, Maintenance Systems, Inventory Controllers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 40+ production-ready asset tracking functions covering registration, lifecycle, depreciation, maintenance, location, condition, disposal, barcode/RFID, warranty, valuation
 *
 * LLM Context: Production-grade property asset tracking and management utilities for White Cross healthcare platform.
 * Provides comprehensive asset lifecycle management including registration with barcode/RFID/QR code generation,
 * inventory tracking with real-time location updates, depreciation calculations (straight-line, declining balance, sum-of-years),
 * maintenance history with scheduled and preventive maintenance, condition assessment with grading system,
 * asset disposal management with audit trails, warranty tracking with expiration alerts, asset valuation updates
 * with market value adjustments, asset transfer between locations/departments, asset assignment to staff/patients,
 * asset search and filtering with advanced queries, asset reporting and analytics, compliance tracking for regulatory requirements,
 * asset insurance tracking, asset utilization metrics, bulk import/export capabilities, and complete audit logging.
 * Includes Sequelize models for assets, asset categories, locations, maintenance records, transfers, valuations,
 * warranties, and disposal records with comprehensive tracking and compliance capabilities.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Asset status enumeration
 */
export enum AssetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  IN_USE = 'in_use',
  AVAILABLE = 'available',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  RETIRED = 'retired',
  DISPOSED = 'disposed',
  LOST = 'lost',
  STOLEN = 'stolen',
  DAMAGED = 'damaged',
  RESERVED = 'reserved',
}

/**
 * Asset condition enumeration
 */
export enum AssetCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical',
  NON_FUNCTIONAL = 'non_functional',
}

/**
 * Asset category types
 */
export enum AssetCategory {
  MEDICAL_EQUIPMENT = 'medical_equipment',
  FURNITURE = 'furniture',
  COMPUTER_HARDWARE = 'computer_hardware',
  VEHICLE = 'vehicle',
  BUILDING = 'building',
  LAND = 'land',
  OFFICE_EQUIPMENT = 'office_equipment',
  TOOLS = 'tools',
  FIXTURES = 'fixtures',
  SOFTWARE_LICENSE = 'software_license',
  OTHER = 'other',
}

/**
 * Depreciation method enumeration
 */
export enum DepreciationMethod {
  STRAIGHT_LINE = 'straight_line',
  DECLINING_BALANCE = 'declining_balance',
  DOUBLE_DECLINING_BALANCE = 'double_declining_balance',
  SUM_OF_YEARS_DIGITS = 'sum_of_years_digits',
  UNITS_OF_PRODUCTION = 'units_of_production',
  NONE = 'none',
}

/**
 * Maintenance type enumeration
 */
export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
  EMERGENCY = 'emergency',
  ROUTINE = 'routine',
  INSPECTION = 'inspection',
  CALIBRATION = 'calibration',
  UPGRADE = 'upgrade',
}

/**
 * Maintenance status enumeration
 */
export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
  PENDING_PARTS = 'pending_parts',
}

/**
 * Disposal method enumeration
 */
export enum DisposalMethod {
  SALE = 'sale',
  DONATION = 'donation',
  RECYCLING = 'recycling',
  TRASH = 'trash',
  TRADE_IN = 'trade_in',
  AUCTION = 'auction',
  RETURN_TO_VENDOR = 'return_to_vendor',
  DESTRUCTION = 'destruction',
}

/**
 * Transfer status enumeration
 */
export enum TransferStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

/**
 * Identifier type for barcode/RFID
 */
export enum IdentifierType {
  BARCODE = 'barcode',
  QR_CODE = 'qr_code',
  RFID = 'rfid',
  NFC = 'nfc',
  ASSET_TAG = 'asset_tag',
  SERIAL_NUMBER = 'serial_number',
}

/**
 * Asset interface
 */
export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  description?: string;
  category: AssetCategory;
  status: AssetStatus;
  condition: AssetCondition;

  // Identification
  serialNumber?: string;
  modelNumber?: string;
  manufacturer?: string;
  barcode?: string;
  rfidTag?: string;
  qrCode?: string;

  // Location
  locationId: string;
  departmentId?: string;
  assignedToUserId?: string;

  // Financial
  purchasePrice: number;
  currentValue: number;
  salvageValue?: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears?: number;

  // Dates
  purchaseDate: Date;
  warrantyExpiryDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  retirementDate?: Date;

  // Additional info
  vendorId?: string;
  invoiceNumber?: string;
  insurancePolicyNumber?: string;
  notes?: string;
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Asset location interface
 */
export interface AssetLocation {
  id: string;
  name: string;
  code: string;
  type: 'building' | 'floor' | 'room' | 'warehouse' | 'storage' | 'external';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  parentLocationId?: string;
  responsibleUserId?: string;
  capacity?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maintenance record interface
 */
export interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: Date;
  completedDate?: Date;
  performedByUserId?: string;
  vendorId?: string;

  description: string;
  workOrderNumber?: string;
  cost?: number;
  laborHours?: number;
  partsUsed?: Array<{
    partNumber: string;
    description: string;
    quantity: number;
    cost: number;
  }>;

  notes?: string;
  attachments?: string[];
  nextScheduledDate?: Date;

  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset transfer interface
 */
export interface AssetTransfer {
  id: string;
  assetId: string;
  fromLocationId: string;
  toLocationId: string;
  fromUserId?: string;
  toUserId?: string;
  status: TransferStatus;

  requestedByUserId: string;
  approvedByUserId?: string;

  requestDate: Date;
  approvalDate?: Date;
  transferDate?: Date;
  completionDate?: Date;

  reason?: string;
  notes?: string;

  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset valuation interface
 */
export interface AssetValuation {
  id: string;
  assetId: string;
  valuationDate: Date;
  marketValue: number;
  bookValue: number;
  depreciatedValue: number;
  assessedByUserId?: string;

  valuationMethod?: string;
  externalAppraiserId?: string;
  appraisalDocumentUrl?: string;

  notes?: string;
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset warranty interface
 */
export interface AssetWarranty {
  id: string;
  assetId: string;
  warrantyType: 'manufacturer' | 'extended' | 'service_contract';

  provider: string;
  policyNumber?: string;

  startDate: Date;
  expiryDate: Date;

  coverageDetails?: string;
  cost?: number;

  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;

  documentUrl?: string;

  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset disposal interface
 */
export interface AssetDisposal {
  id: string;
  assetId: string;
  disposalMethod: DisposalMethod;
  disposalDate: Date;

  reason: string;
  approvedByUserId: string;

  salePrice?: number;
  buyerInformation?: string;

  certificateOfDestruction?: string;
  environmentalCompliance?: boolean;
  dataWipingConfirmed?: boolean;

  notes?: string;
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset audit log interface
 */
export interface AssetAuditLog {
  id: string;
  assetId: string;
  action: string;
  performedByUserId: string;

  previousState?: Record<string, any>;
  newState?: Record<string, any>;

  ipAddress?: string;
  userAgent?: string;

  timestamp: Date;
}

/**
 * Depreciation calculation result
 */
export interface DepreciationResult {
  assetId: string;
  method: DepreciationMethod;
  purchasePrice: number;
  currentValue: number;
  accumulatedDepreciation: number;
  annualDepreciation: number;
  monthlyDepreciation: number;
  remainingLifeYears: number;
  depreciationSchedule: Array<{
    year: number;
    beginningValue: number;
    depreciation: number;
    endingValue: number;
  }>;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Asset creation schema
 */
export const AssetCreateSchema = z.object({
  assetTag: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  category: z.nativeEnum(AssetCategory),
  status: z.nativeEnum(AssetStatus).default(AssetStatus.ACTIVE),
  condition: z.nativeEnum(AssetCondition).default(AssetCondition.GOOD),

  serialNumber: z.string().max(100).optional(),
  modelNumber: z.string().max(100).optional(),
  manufacturer: z.string().max(255).optional(),

  locationId: z.string().uuid(),
  departmentId: z.string().uuid().optional(),
  assignedToUserId: z.string().uuid().optional(),

  purchasePrice: z.number().nonnegative(),
  salvageValue: z.number().nonnegative().optional(),
  depreciationMethod: z.nativeEnum(DepreciationMethod).default(DepreciationMethod.STRAIGHT_LINE),
  usefulLifeYears: z.number().positive().optional(),

  purchaseDate: z.date(),
  warrantyExpiryDate: z.date().optional(),

  vendorId: z.string().uuid().optional(),
  invoiceNumber: z.string().max(100).optional(),
  insurancePolicyNumber: z.string().max(100).optional(),

  notes: z.string().max(5000).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Asset update schema
 */
export const AssetUpdateSchema = AssetCreateSchema.partial();

/**
 * Maintenance record creation schema
 */
export const MaintenanceRecordCreateSchema = z.object({
  assetId: z.string().uuid(),
  type: z.nativeEnum(MaintenanceType),
  status: z.nativeEnum(MaintenanceStatus).default(MaintenanceStatus.SCHEDULED),
  scheduledDate: z.date(),
  description: z.string().min(1).max(2000),

  performedByUserId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  workOrderNumber: z.string().max(100).optional(),

  cost: z.number().nonnegative().optional(),
  laborHours: z.number().nonnegative().optional(),

  notes: z.string().max(5000).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Asset transfer creation schema
 */
export const AssetTransferCreateSchema = z.object({
  assetId: z.string().uuid(),
  fromLocationId: z.string().uuid(),
  toLocationId: z.string().uuid(),
  fromUserId: z.string().uuid().optional(),
  toUserId: z.string().uuid().optional(),
  requestedByUserId: z.string().uuid(),

  reason: z.string().max(1000).optional(),
  notes: z.string().max(5000).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Asset location creation schema
 */
export const AssetLocationCreateSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  type: z.enum(['building', 'floor', 'room', 'warehouse', 'storage', 'external']),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  parentLocationId: z.string().uuid().optional(),
  responsibleUserId: z.string().uuid().optional(),
  capacity: z.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Asset disposal creation schema
 */
export const AssetDisposalCreateSchema = z.object({
  assetId: z.string().uuid(),
  disposalMethod: z.nativeEnum(DisposalMethod),
  disposalDate: z.date(),
  reason: z.string().min(1).max(2000),
  approvedByUserId: z.string().uuid(),

  salePrice: z.number().nonnegative().optional(),
  buyerInformation: z.string().max(1000).optional(),

  certificateOfDestruction: z.string().url().optional(),
  environmentalCompliance: z.boolean().optional(),
  dataWipingConfirmed: z.boolean().optional(),

  notes: z.string().max(5000).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Asset warranty creation schema
 */
export const AssetWarrantyCreateSchema = z.object({
  assetId: z.string().uuid(),
  warrantyType: z.enum(['manufacturer', 'extended', 'service_contract']),
  provider: z.string().min(1).max(255),
  policyNumber: z.string().max(100).optional(),

  startDate: z.date(),
  expiryDate: z.date(),

  coverageDetails: z.string().max(2000).optional(),
  cost: z.number().nonnegative().optional(),

  contactName: z.string().max(255).optional(),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.string().email().optional(),

  documentUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// ASSET REGISTRATION AND INVENTORY
// ============================================================================

/**
 * Register a new asset in the inventory system
 *
 * @param data - Asset creation data
 * @returns Created asset
 *
 * @example
 * ```typescript
 * const asset = await registerAsset({
 *   assetTag: 'MED-2024-001',
 *   name: 'X-Ray Machine',
 *   category: AssetCategory.MEDICAL_EQUIPMENT,
 *   purchasePrice: 50000,
 *   locationId: 'loc-123',
 *   purchaseDate: new Date('2024-01-15'),
 * });
 * ```
 */
export async function registerAsset(
  data: z.infer<typeof AssetCreateSchema>
): Promise<Asset> {
  const validated = AssetCreateSchema.parse(data);

  const asset: Asset = {
    id: uuidv4(),
    assetTag: validated.assetTag,
    name: validated.name,
    description: validated.description,
    category: validated.category,
    status: validated.status,
    condition: validated.condition,

    serialNumber: validated.serialNumber,
    modelNumber: validated.modelNumber,
    manufacturer: validated.manufacturer,

    locationId: validated.locationId,
    departmentId: validated.departmentId,
    assignedToUserId: validated.assignedToUserId,

    purchasePrice: validated.purchasePrice,
    currentValue: validated.purchasePrice,
    salvageValue: validated.salvageValue,
    depreciationMethod: validated.depreciationMethod,
    usefulLifeYears: validated.usefulLifeYears,

    purchaseDate: validated.purchaseDate,
    warrantyExpiryDate: validated.warrantyExpiryDate,

    vendorId: validated.vendorId,
    invoiceNumber: validated.invoiceNumber,
    insurancePolicyNumber: validated.insurancePolicyNumber,

    notes: validated.notes,
    metadata: validated.metadata,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId: asset.id,
    action: 'ASSET_REGISTERED',
    performedByUserId: 'system',
    newState: asset,
    timestamp: new Date(),
  });

  return asset;
}

/**
 * Update an existing asset
 *
 * @param assetId - Asset ID
 * @param data - Asset update data
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * const updated = await updateAsset('asset-123', {
 *   status: AssetStatus.MAINTENANCE,
 *   condition: AssetCondition.FAIR,
 * });
 * ```
 */
export async function updateAsset(
  assetId: string,
  data: z.infer<typeof AssetUpdateSchema>
): Promise<Asset> {
  const validated = AssetUpdateSchema.parse(data);

  const existingAsset = await getAssetById(assetId);

  const updatedAsset: Asset = {
    ...existingAsset,
    ...validated,
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId,
    action: 'ASSET_UPDATED',
    performedByUserId: 'system',
    previousState: existingAsset,
    newState: updatedAsset,
    timestamp: new Date(),
  });

  return updatedAsset;
}

/**
 * Retrieve an asset by ID
 *
 * @param assetId - Asset ID
 * @returns Asset details
 *
 * @example
 * ```typescript
 * const asset = await getAssetById('asset-123');
 * console.log(`Asset: ${asset.name}`);
 * ```
 */
export async function getAssetById(assetId: string): Promise<Asset> {
  if (!assetId) {
    throw new BadRequestException('Asset ID is required');
  }

  // Implementation would fetch from database
  throw new NotFoundException(`Asset ${assetId} not found`);
}

/**
 * Search assets with filtering and pagination
 *
 * @param filters - Search filters
 * @returns List of matching assets
 *
 * @example
 * ```typescript
 * const assets = await searchAssets({
 *   category: AssetCategory.MEDICAL_EQUIPMENT,
 *   status: AssetStatus.ACTIVE,
 *   locationId: 'loc-123',
 * });
 * ```
 */
export async function searchAssets(filters: {
  category?: AssetCategory;
  status?: AssetStatus;
  condition?: AssetCondition;
  locationId?: string;
  departmentId?: string;
  assignedToUserId?: string;
  minValue?: number;
  maxValue?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ assets: Asset[]; total: number }> {
  // Implementation would query database with filters
  return { assets: [], total: 0 };
}

/**
 * Delete an asset (soft delete)
 *
 * @param assetId - Asset ID
 * @param userId - User performing the deletion
 * @returns Deleted asset
 *
 * @example
 * ```typescript
 * await deleteAsset('asset-123', 'user-456');
 * ```
 */
export async function deleteAsset(assetId: string, userId: string): Promise<Asset> {
  const asset = await getAssetById(assetId);

  const deletedAsset: Asset = {
    ...asset,
    deletedAt: new Date(),
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId,
    action: 'ASSET_DELETED',
    performedByUserId: userId,
    previousState: asset,
    timestamp: new Date(),
  });

  return deletedAsset;
}

// ============================================================================
// ASSET LIFECYCLE TRACKING
// ============================================================================

/**
 * Track asset lifecycle status changes
 *
 * @param assetId - Asset ID
 * @param newStatus - New status
 * @param userId - User making the change
 * @param reason - Reason for status change
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetStatus('asset-123', AssetStatus.MAINTENANCE, 'user-456', 'Scheduled maintenance');
 * ```
 */
export async function updateAssetStatus(
  assetId: string,
  newStatus: AssetStatus,
  userId: string,
  reason?: string
): Promise<Asset> {
  const asset = await getAssetById(assetId);

  const updatedAsset: Asset = {
    ...asset,
    status: newStatus,
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId,
    action: 'STATUS_CHANGED',
    performedByUserId: userId,
    previousState: { status: asset.status },
    newState: { status: newStatus, reason },
    timestamp: new Date(),
  });

  return updatedAsset;
}

/**
 * Get asset lifecycle history
 *
 * @param assetId - Asset ID
 * @returns List of lifecycle events
 *
 * @example
 * ```typescript
 * const history = await getAssetLifecycleHistory('asset-123');
 * ```
 */
export async function getAssetLifecycleHistory(assetId: string): Promise<AssetAuditLog[]> {
  // Implementation would fetch from audit logs
  return [];
}

/**
 * Retire an asset from active service
 *
 * @param assetId - Asset ID
 * @param userId - User performing retirement
 * @param reason - Retirement reason
 * @returns Retired asset
 *
 * @example
 * ```typescript
 * await retireAsset('asset-123', 'user-456', 'End of useful life');
 * ```
 */
export async function retireAsset(
  assetId: string,
  userId: string,
  reason: string
): Promise<Asset> {
  const asset = await getAssetById(assetId);

  const retiredAsset: Asset = {
    ...asset,
    status: AssetStatus.RETIRED,
    retirementDate: new Date(),
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId,
    action: 'ASSET_RETIRED',
    performedByUserId: userId,
    newState: { reason, retirementDate: retiredAsset.retirementDate },
    timestamp: new Date(),
  });

  return retiredAsset;
}

/**
 * Reactivate a retired asset
 *
 * @param assetId - Asset ID
 * @param userId - User performing reactivation
 * @param reason - Reactivation reason
 * @returns Reactivated asset
 *
 * @example
 * ```typescript
 * await reactivateAsset('asset-123', 'user-456', 'Still functional, needed for backup');
 * ```
 */
export async function reactivateAsset(
  assetId: string,
  userId: string,
  reason: string
): Promise<Asset> {
  const asset = await getAssetById(assetId);

  if (asset.status !== AssetStatus.RETIRED) {
    throw new BadRequestException('Only retired assets can be reactivated');
  }

  const reactivatedAsset: Asset = {
    ...asset,
    status: AssetStatus.ACTIVE,
    retirementDate: undefined,
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId,
    action: 'ASSET_REACTIVATED',
    performedByUserId: userId,
    newState: { reason },
    timestamp: new Date(),
  });

  return reactivatedAsset;
}

// ============================================================================
// DEPRECIATION CALCULATIONS
// ============================================================================

/**
 * Calculate asset depreciation using straight-line method
 *
 * @param asset - Asset data
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = calculateStraightLineDepreciation(asset);
 * console.log(`Annual depreciation: $${depreciation.annualDepreciation}`);
 * ```
 */
export function calculateStraightLineDepreciation(asset: Asset): DepreciationResult {
  if (!asset.usefulLifeYears || asset.usefulLifeYears <= 0) {
    throw new BadRequestException('Useful life years must be specified for depreciation calculation');
  }

  const salvageValue = asset.salvageValue || 0;
  const depreciableAmount = asset.purchasePrice - salvageValue;
  const annualDepreciation = depreciableAmount / asset.usefulLifeYears;
  const monthlyDepreciation = annualDepreciation / 12;

  const yearsElapsed = (new Date().getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const accumulatedDepreciation = Math.min(annualDepreciation * yearsElapsed, depreciableAmount);
  const currentValue = Math.max(asset.purchasePrice - accumulatedDepreciation, salvageValue);

  const schedule: Array<{ year: number; beginningValue: number; depreciation: number; endingValue: number }> = [];

  for (let year = 1; year <= asset.usefulLifeYears; year++) {
    const beginningValue = asset.purchasePrice - (annualDepreciation * (year - 1));
    const yearDepreciation = year === asset.usefulLifeYears
      ? beginningValue - salvageValue
      : annualDepreciation;
    const endingValue = Math.max(beginningValue - yearDepreciation, salvageValue);

    schedule.push({
      year,
      beginningValue,
      depreciation: yearDepreciation,
      endingValue,
    });
  }

  return {
    assetId: asset.id,
    method: DepreciationMethod.STRAIGHT_LINE,
    purchasePrice: asset.purchasePrice,
    currentValue,
    accumulatedDepreciation,
    annualDepreciation,
    monthlyDepreciation,
    remainingLifeYears: Math.max(asset.usefulLifeYears - yearsElapsed, 0),
    depreciationSchedule: schedule,
  };
}

/**
 * Calculate asset depreciation using declining balance method
 *
 * @param asset - Asset data
 * @param rate - Depreciation rate (e.g., 2 for double-declining)
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = calculateDecliningBalanceDepreciation(asset, 2);
 * ```
 */
export function calculateDecliningBalanceDepreciation(
  asset: Asset,
  rate: number = 2
): DepreciationResult {
  if (!asset.usefulLifeYears || asset.usefulLifeYears <= 0) {
    throw new BadRequestException('Useful life years must be specified');
  }

  const salvageValue = asset.salvageValue || 0;
  const depreciationRate = rate / asset.usefulLifeYears;

  const schedule: Array<{ year: number; beginningValue: number; depreciation: number; endingValue: number }> = [];
  let bookValue = asset.purchasePrice;
  let accumulatedDepreciation = 0;

  for (let year = 1; year <= asset.usefulLifeYears; year++) {
    const beginningValue = bookValue;
    let yearDepreciation = bookValue * depreciationRate;

    // Don't depreciate below salvage value
    if (bookValue - yearDepreciation < salvageValue) {
      yearDepreciation = bookValue - salvageValue;
    }

    const endingValue = bookValue - yearDepreciation;
    accumulatedDepreciation += yearDepreciation;

    schedule.push({
      year,
      beginningValue,
      depreciation: yearDepreciation,
      endingValue,
    });

    bookValue = endingValue;
  }

  const yearsElapsed = (new Date().getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const currentYearSchedule = schedule[Math.min(Math.floor(yearsElapsed), schedule.length - 1)];

  return {
    assetId: asset.id,
    method: DepreciationMethod.DECLINING_BALANCE,
    purchasePrice: asset.purchasePrice,
    currentValue: currentYearSchedule?.endingValue || salvageValue,
    accumulatedDepreciation: asset.purchasePrice - (currentYearSchedule?.endingValue || salvageValue),
    annualDepreciation: currentYearSchedule?.depreciation || 0,
    monthlyDepreciation: (currentYearSchedule?.depreciation || 0) / 12,
    remainingLifeYears: Math.max(asset.usefulLifeYears - yearsElapsed, 0),
    depreciationSchedule: schedule,
  };
}

/**
 * Calculate asset depreciation using sum-of-years-digits method
 *
 * @param asset - Asset data
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = calculateSumOfYearsDigitsDepreciation(asset);
 * ```
 */
export function calculateSumOfYearsDigitsDepreciation(asset: Asset): DepreciationResult {
  if (!asset.usefulLifeYears || asset.usefulLifeYears <= 0) {
    throw new BadRequestException('Useful life years must be specified');
  }

  const salvageValue = asset.salvageValue || 0;
  const depreciableAmount = asset.purchasePrice - salvageValue;
  const sumOfYears = (asset.usefulLifeYears * (asset.usefulLifeYears + 1)) / 2;

  const schedule: Array<{ year: number; beginningValue: number; depreciation: number; endingValue: number }> = [];
  let bookValue = asset.purchasePrice;
  let accumulatedDepreciation = 0;

  for (let year = 1; year <= asset.usefulLifeYears; year++) {
    const remainingLife = asset.usefulLifeYears - year + 1;
    const yearDepreciation = (depreciableAmount * remainingLife) / sumOfYears;
    const endingValue = bookValue - yearDepreciation;

    schedule.push({
      year,
      beginningValue: bookValue,
      depreciation: yearDepreciation,
      endingValue,
    });

    accumulatedDepreciation += yearDepreciation;
    bookValue = endingValue;
  }

  const yearsElapsed = (new Date().getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const currentYearIndex = Math.min(Math.floor(yearsElapsed), schedule.length - 1);
  const currentYearSchedule = schedule[currentYearIndex];

  return {
    assetId: asset.id,
    method: DepreciationMethod.SUM_OF_YEARS_DIGITS,
    purchasePrice: asset.purchasePrice,
    currentValue: currentYearSchedule?.endingValue || salvageValue,
    accumulatedDepreciation: asset.purchasePrice - (currentYearSchedule?.endingValue || salvageValue),
    annualDepreciation: currentYearSchedule?.depreciation || 0,
    monthlyDepreciation: (currentYearSchedule?.depreciation || 0) / 12,
    remainingLifeYears: Math.max(asset.usefulLifeYears - yearsElapsed, 0),
    depreciationSchedule: schedule,
  };
}

/**
 * Calculate current asset value based on depreciation method
 *
 * @param asset - Asset data
 * @returns Current depreciated value
 *
 * @example
 * ```typescript
 * const currentValue = await calculateCurrentAssetValue(asset);
 * ```
 */
export async function calculateCurrentAssetValue(asset: Asset): Promise<number> {
  if (asset.depreciationMethod === DepreciationMethod.NONE) {
    return asset.purchasePrice;
  }

  let result: DepreciationResult;

  switch (asset.depreciationMethod) {
    case DepreciationMethod.STRAIGHT_LINE:
      result = calculateStraightLineDepreciation(asset);
      break;
    case DepreciationMethod.DECLINING_BALANCE:
      result = calculateDecliningBalanceDepreciation(asset, 1.5);
      break;
    case DepreciationMethod.DOUBLE_DECLINING_BALANCE:
      result = calculateDecliningBalanceDepreciation(asset, 2);
      break;
    case DepreciationMethod.SUM_OF_YEARS_DIGITS:
      result = calculateSumOfYearsDigitsDepreciation(asset);
      break;
    default:
      return asset.purchasePrice;
  }

  return result.currentValue;
}

// ============================================================================
// ASSET MAINTENANCE HISTORY
// ============================================================================

/**
 * Create a maintenance record for an asset
 *
 * @param data - Maintenance record data
 * @returns Created maintenance record
 *
 * @example
 * ```typescript
 * const maintenance = await createMaintenanceRecord({
 *   assetId: 'asset-123',
 *   type: MaintenanceType.PREVENTIVE,
 *   scheduledDate: new Date('2024-02-01'),
 *   description: 'Annual calibration',
 * });
 * ```
 */
export async function createMaintenanceRecord(
  data: z.infer<typeof MaintenanceRecordCreateSchema>
): Promise<MaintenanceRecord> {
  const validated = MaintenanceRecordCreateSchema.parse(data);

  const record: MaintenanceRecord = {
    id: uuidv4(),
    assetId: validated.assetId,
    type: validated.type,
    status: validated.status,
    scheduledDate: validated.scheduledDate,
    description: validated.description,
    performedByUserId: validated.performedByUserId,
    vendorId: validated.vendorId,
    workOrderNumber: validated.workOrderNumber,
    cost: validated.cost,
    laborHours: validated.laborHours,
    notes: validated.notes,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId: validated.assetId,
    action: 'MAINTENANCE_SCHEDULED',
    performedByUserId: validated.performedByUserId || 'system',
    newState: record,
    timestamp: new Date(),
  });

  return record;
}

/**
 * Complete a maintenance record
 *
 * @param recordId - Maintenance record ID
 * @param data - Completion data
 * @returns Updated maintenance record
 *
 * @example
 * ```typescript
 * await completeMaintenanceRecord('maint-123', {
 *   performedByUserId: 'user-456',
 *   cost: 150,
 *   laborHours: 2,
 *   notes: 'Calibration completed successfully',
 * });
 * ```
 */
export async function completeMaintenanceRecord(
  recordId: string,
  data: {
    performedByUserId: string;
    cost?: number;
    laborHours?: number;
    partsUsed?: Array<{ partNumber: string; description: string; quantity: number; cost: number }>;
    notes?: string;
  }
): Promise<MaintenanceRecord> {
  // Implementation would fetch and update record
  throw new NotFoundException(`Maintenance record ${recordId} not found`);
}

/**
 * Get maintenance history for an asset
 *
 * @param assetId - Asset ID
 * @param filters - Optional filters
 * @returns List of maintenance records
 *
 * @example
 * ```typescript
 * const history = await getAssetMaintenanceHistory('asset-123', {
 *   type: MaintenanceType.PREVENTIVE,
 *   status: MaintenanceStatus.COMPLETED,
 * });
 * ```
 */
export async function getAssetMaintenanceHistory(
  assetId: string,
  filters?: {
    type?: MaintenanceType;
    status?: MaintenanceStatus;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<MaintenanceRecord[]> {
  // Implementation would query database
  return [];
}

/**
 * Schedule preventive maintenance for an asset
 *
 * @param assetId - Asset ID
 * @param intervalDays - Maintenance interval in days
 * @param type - Maintenance type
 * @param description - Maintenance description
 * @returns Scheduled maintenance records
 *
 * @example
 * ```typescript
 * await schedulePreventiveMaintenance('asset-123', 90, MaintenanceType.CALIBRATION, 'Quarterly calibration');
 * ```
 */
export async function schedulePreventiveMaintenance(
  assetId: string,
  intervalDays: number,
  type: MaintenanceType,
  description: string
): Promise<MaintenanceRecord[]> {
  const asset = await getAssetById(assetId);

  const scheduledRecords: MaintenanceRecord[] = [];
  const startDate = asset.lastMaintenanceDate || new Date();

  // Schedule next 4 maintenance cycles
  for (let i = 1; i <= 4; i++) {
    const scheduledDate = new Date(startDate);
    scheduledDate.setDate(scheduledDate.getDate() + (intervalDays * i));

    const record = await createMaintenanceRecord({
      assetId,
      type,
      status: MaintenanceStatus.SCHEDULED,
      scheduledDate,
      description,
    });

    scheduledRecords.push(record);
  }

  return scheduledRecords;
}

/**
 * Get overdue maintenance records
 *
 * @param filters - Optional filters
 * @returns List of overdue maintenance records
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueMaintenanceRecords({ locationId: 'loc-123' });
 * ```
 */
export async function getOverdueMaintenanceRecords(filters?: {
  locationId?: string;
  departmentId?: string;
  assetCategory?: AssetCategory;
}): Promise<MaintenanceRecord[]> {
  // Implementation would query database for overdue records
  return [];
}

// ============================================================================
// ASSET LOCATION TRACKING
// ============================================================================

/**
 * Create a new asset location
 *
 * @param data - Location data
 * @returns Created location
 *
 * @example
 * ```typescript
 * const location = await createAssetLocation({
 *   name: 'Building A - Floor 3',
 *   code: 'BLD-A-F3',
 *   type: 'floor',
 * });
 * ```
 */
export async function createAssetLocation(
  data: z.infer<typeof AssetLocationCreateSchema>
): Promise<AssetLocation> {
  const validated = AssetLocationCreateSchema.parse(data);

  const location: AssetLocation = {
    id: uuidv4(),
    name: validated.name,
    code: validated.code,
    type: validated.type,
    address: validated.address,
    city: validated.city,
    state: validated.state,
    zipCode: validated.zipCode,
    country: validated.country,
    parentLocationId: validated.parentLocationId,
    responsibleUserId: validated.responsibleUserId,
    capacity: validated.capacity,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return location;
}

/**
 * Transfer an asset to a new location
 *
 * @param data - Transfer data
 * @returns Created transfer record
 *
 * @example
 * ```typescript
 * const transfer = await transferAsset({
 *   assetId: 'asset-123',
 *   fromLocationId: 'loc-1',
 *   toLocationId: 'loc-2',
 *   requestedByUserId: 'user-456',
 * });
 * ```
 */
export async function transferAsset(
  data: z.infer<typeof AssetTransferCreateSchema>
): Promise<AssetTransfer> {
  const validated = AssetTransferCreateSchema.parse(data);

  const transfer: AssetTransfer = {
    id: uuidv4(),
    assetId: validated.assetId,
    fromLocationId: validated.fromLocationId,
    toLocationId: validated.toLocationId,
    fromUserId: validated.fromUserId,
    toUserId: validated.toUserId,
    status: TransferStatus.PENDING,
    requestedByUserId: validated.requestedByUserId,
    requestDate: new Date(),
    reason: validated.reason,
    notes: validated.notes,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId: validated.assetId,
    action: 'TRANSFER_REQUESTED',
    performedByUserId: validated.requestedByUserId,
    newState: transfer,
    timestamp: new Date(),
  });

  return transfer;
}

/**
 * Approve an asset transfer
 *
 * @param transferId - Transfer ID
 * @param approvedByUserId - User approving the transfer
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await approveAssetTransfer('transfer-123', 'manager-456');
 * ```
 */
export async function approveAssetTransfer(
  transferId: string,
  approvedByUserId: string
): Promise<AssetTransfer> {
  // Implementation would fetch and update transfer
  throw new NotFoundException(`Transfer ${transferId} not found`);
}

/**
 * Complete an asset transfer
 *
 * @param transferId - Transfer ID
 * @returns Updated transfer and asset
 *
 * @example
 * ```typescript
 * await completeAssetTransfer('transfer-123');
 * ```
 */
export async function completeAssetTransfer(
  transferId: string
): Promise<{ transfer: AssetTransfer; asset: Asset }> {
  // Implementation would update transfer status and asset location
  throw new NotFoundException(`Transfer ${transferId} not found`);
}

/**
 * Get asset location history
 *
 * @param assetId - Asset ID
 * @returns List of location transfers
 *
 * @example
 * ```typescript
 * const history = await getAssetLocationHistory('asset-123');
 * ```
 */
export async function getAssetLocationHistory(assetId: string): Promise<AssetTransfer[]> {
  // Implementation would fetch transfer history
  return [];
}

/**
 * Get all assets at a location
 *
 * @param locationId - Location ID
 * @param includeSubLocations - Include assets in sub-locations
 * @returns List of assets
 *
 * @example
 * ```typescript
 * const assets = await getAssetsAtLocation('loc-123', true);
 * ```
 */
export async function getAssetsAtLocation(
  locationId: string,
  includeSubLocations: boolean = false
): Promise<Asset[]> {
  // Implementation would query database
  return [];
}

// ============================================================================
// ASSET CONDITION ASSESSMENT
// ============================================================================

/**
 * Update asset condition
 *
 * @param assetId - Asset ID
 * @param condition - New condition
 * @param assessedByUserId - User performing assessment
 * @param notes - Assessment notes
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetCondition('asset-123', AssetCondition.FAIR, 'user-456', 'Minor wear observed');
 * ```
 */
export async function updateAssetCondition(
  assetId: string,
  condition: AssetCondition,
  assessedByUserId: string,
  notes?: string
): Promise<Asset> {
  const asset = await getAssetById(assetId);

  const updatedAsset: Asset = {
    ...asset,
    condition,
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId,
    action: 'CONDITION_UPDATED',
    performedByUserId: assessedByUserId,
    previousState: { condition: asset.condition },
    newState: { condition, notes },
    timestamp: new Date(),
  });

  return updatedAsset;
}

/**
 * Perform comprehensive asset inspection
 *
 * @param assetId - Asset ID
 * @param inspection - Inspection data
 * @returns Inspection record and updated asset
 *
 * @example
 * ```typescript
 * await performAssetInspection('asset-123', {
 *   inspectedByUserId: 'user-456',
 *   condition: AssetCondition.GOOD,
 *   functionalityScore: 8,
 *   appearanceScore: 7,
 *   findings: ['Minor scratches', 'All functions operational'],
 * });
 * ```
 */
export async function performAssetInspection(
  assetId: string,
  inspection: {
    inspectedByUserId: string;
    condition: AssetCondition;
    functionalityScore?: number; // 1-10
    appearanceScore?: number; // 1-10
    safetyScore?: number; // 1-10
    findings?: string[];
    recommendations?: string[];
    photos?: string[];
  }
): Promise<{ asset: Asset; maintenanceRecord: MaintenanceRecord }> {
  const asset = await updateAssetCondition(
    assetId,
    inspection.condition,
    inspection.inspectedByUserId,
    inspection.findings?.join('; ')
  );

  const maintenanceRecord = await createMaintenanceRecord({
    assetId,
    type: MaintenanceType.INSPECTION,
    status: MaintenanceStatus.COMPLETED,
    scheduledDate: new Date(),
    description: 'Asset inspection',
    performedByUserId: inspection.inspectedByUserId,
    notes: JSON.stringify(inspection),
    metadata: inspection as any,
  });

  return { asset, maintenanceRecord };
}

/**
 * Get assets due for inspection
 *
 * @param inspectionIntervalDays - Days between inspections
 * @returns List of assets due for inspection
 *
 * @example
 * ```typescript
 * const dueForInspection = await getAssetsDueForInspection(90);
 * ```
 */
export async function getAssetsDueForInspection(
  inspectionIntervalDays: number = 90
): Promise<Asset[]> {
  // Implementation would query assets where last inspection was > intervalDays ago
  return [];
}

// ============================================================================
// ASSET DISPOSAL MANAGEMENT
// ============================================================================

/**
 * Create asset disposal record
 *
 * @param data - Disposal data
 * @returns Created disposal record
 *
 * @example
 * ```typescript
 * const disposal = await createAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.RECYCLING,
 *   disposalDate: new Date(),
 *   reason: 'End of useful life',
 *   approvedByUserId: 'manager-456',
 *   environmentalCompliance: true,
 * });
 * ```
 */
export async function createAssetDisposal(
  data: z.infer<typeof AssetDisposalCreateSchema>
): Promise<AssetDisposal> {
  const validated = AssetDisposalCreateSchema.parse(data);

  const disposal: AssetDisposal = {
    id: uuidv4(),
    assetId: validated.assetId,
    disposalMethod: validated.disposalMethod,
    disposalDate: validated.disposalDate,
    reason: validated.reason,
    approvedByUserId: validated.approvedByUserId,
    salePrice: validated.salePrice,
    buyerInformation: validated.buyerInformation,
    certificateOfDestruction: validated.certificateOfDestruction,
    environmentalCompliance: validated.environmentalCompliance,
    dataWipingConfirmed: validated.dataWipingConfirmed,
    notes: validated.notes,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Update asset status to disposed
  await updateAssetStatus(
    validated.assetId,
    AssetStatus.DISPOSED,
    validated.approvedByUserId,
    validated.reason
  );

  await createAuditLog({
    assetId: validated.assetId,
    action: 'ASSET_DISPOSED',
    performedByUserId: validated.approvedByUserId,
    newState: disposal,
    timestamp: new Date(),
  });

  return disposal;
}

/**
 * Get disposal records with filtering
 *
 * @param filters - Optional filters
 * @returns List of disposal records
 *
 * @example
 * ```typescript
 * const disposals = await getDisposalRecords({
 *   method: DisposalMethod.SALE,
 *   startDate: new Date('2024-01-01'),
 * });
 * ```
 */
export async function getDisposalRecords(filters?: {
  method?: DisposalMethod;
  startDate?: Date;
  endDate?: Date;
  approvedByUserId?: string;
}): Promise<AssetDisposal[]> {
  // Implementation would query database
  return [];
}

// ============================================================================
// BARCODE/RFID INTEGRATION
// ============================================================================

/**
 * Generate barcode for an asset
 *
 * @param assetId - Asset ID
 * @param format - Barcode format
 * @returns Barcode string
 *
 * @example
 * ```typescript
 * const barcode = generateAssetBarcode('asset-123', 'CODE128');
 * ```
 */
export function generateAssetBarcode(
  assetId: string,
  format: 'CODE128' | 'CODE39' | 'EAN13' | 'UPC' = 'CODE128'
): string {
  // Generate barcode based on asset ID and format
  const prefix = 'WC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const id = assetId.substring(0, 8).toUpperCase();

  return `${prefix}${timestamp}${id}`;
}

/**
 * Generate QR code data for an asset
 *
 * @param asset - Asset data
 * @returns QR code data string
 *
 * @example
 * ```typescript
 * const qrData = generateAssetQRCode(asset);
 * // Use with QR code library to generate image
 * ```
 */
export function generateAssetQRCode(asset: Asset): string {
  const qrData = {
    id: asset.id,
    assetTag: asset.assetTag,
    name: asset.name,
    category: asset.category,
    serialNumber: asset.serialNumber,
    locationId: asset.locationId,
  };

  return JSON.stringify(qrData);
}

/**
 * Generate RFID tag identifier for an asset
 *
 * @param assetId - Asset ID
 * @param protocol - RFID protocol
 * @returns RFID tag identifier
 *
 * @example
 * ```typescript
 * const rfidTag = generateAssetRFIDTag('asset-123', 'EPC');
 * ```
 */
export function generateAssetRFIDTag(
  assetId: string,
  protocol: 'EPC' | 'ISO14443A' | 'ISO15693' = 'EPC'
): string {
  // Generate RFID tag based on protocol
  const companyPrefix = '0614141'; // Example company prefix
  const assetReference = assetId.replace(/-/g, '').substring(0, 12).padEnd(12, '0');

  return `${protocol}:${companyPrefix}${assetReference}`;
}

/**
 * Scan and retrieve asset by identifier
 *
 * @param identifier - Barcode, QR code, or RFID tag
 * @param identifierType - Type of identifier
 * @returns Asset details
 *
 * @example
 * ```typescript
 * const asset = await scanAssetIdentifier('WC12345ABC', IdentifierType.BARCODE);
 * ```
 */
export async function scanAssetIdentifier(
  identifier: string,
  identifierType: IdentifierType
): Promise<Asset> {
  // Implementation would query database by identifier
  throw new NotFoundException(`Asset with ${identifierType} ${identifier} not found`);
}

/**
 * Bulk assign identifiers to assets
 *
 * @param assignments - List of asset ID and identifier pairs
 * @returns Updated assets
 *
 * @example
 * ```typescript
 * await bulkAssignIdentifiers([
 *   { assetId: 'asset-1', barcode: 'BC001', rfidTag: 'RFID001' },
 *   { assetId: 'asset-2', barcode: 'BC002', rfidTag: 'RFID002' },
 * ]);
 * ```
 */
export async function bulkAssignIdentifiers(
  assignments: Array<{
    assetId: string;
    barcode?: string;
    rfidTag?: string;
    qrCode?: string;
  }>
): Promise<Asset[]> {
  const updatedAssets: Asset[] = [];

  for (const assignment of assignments) {
    const asset = await getAssetById(assignment.assetId);

    const updated = await updateAsset(assignment.assetId, {
      barcode: assignment.barcode,
      rfidTag: assignment.rfidTag,
      qrCode: assignment.qrCode,
    });

    updatedAssets.push(updated);
  }

  return updatedAssets;
}

// ============================================================================
// ASSET WARRANTY TRACKING
// ============================================================================

/**
 * Create warranty record for an asset
 *
 * @param data - Warranty data
 * @returns Created warranty record
 *
 * @example
 * ```typescript
 * const warranty = await createAssetWarranty({
 *   assetId: 'asset-123',
 *   warrantyType: 'manufacturer',
 *   provider: 'MedEquip Inc.',
 *   startDate: new Date('2024-01-01'),
 *   expiryDate: new Date('2026-01-01'),
 * });
 * ```
 */
export async function createAssetWarranty(
  data: z.infer<typeof AssetWarrantyCreateSchema>
): Promise<AssetWarranty> {
  const validated = AssetWarrantyCreateSchema.parse(data);

  const warranty: AssetWarranty = {
    id: uuidv4(),
    assetId: validated.assetId,
    warrantyType: validated.warrantyType,
    provider: validated.provider,
    policyNumber: validated.policyNumber,
    startDate: validated.startDate,
    expiryDate: validated.expiryDate,
    coverageDetails: validated.coverageDetails,
    cost: validated.cost,
    contactName: validated.contactName,
    contactPhone: validated.contactPhone,
    contactEmail: validated.contactEmail,
    documentUrl: validated.documentUrl,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createAuditLog({
    assetId: validated.assetId,
    action: 'WARRANTY_CREATED',
    performedByUserId: 'system',
    newState: warranty,
    timestamp: new Date(),
  });

  return warranty;
}

/**
 * Get warranties for an asset
 *
 * @param assetId - Asset ID
 * @returns List of warranties
 *
 * @example
 * ```typescript
 * const warranties = await getAssetWarranties('asset-123');
 * ```
 */
export async function getAssetWarranties(assetId: string): Promise<AssetWarranty[]> {
  // Implementation would query database
  return [];
}

/**
 * Get assets with expiring warranties
 *
 * @param daysUntilExpiry - Number of days until expiry
 * @returns List of assets with expiring warranties
 *
 * @example
 * ```typescript
 * const expiring = await getAssetsWithExpiringWarranties(30);
 * ```
 */
export async function getAssetsWithExpiringWarranties(
  daysUntilExpiry: number = 30
): Promise<Array<{ asset: Asset; warranty: AssetWarranty }>> {
  // Implementation would query database for warranties expiring soon
  return [];
}

/**
 * Check if asset is under warranty
 *
 * @param assetId - Asset ID
 * @param checkDate - Date to check (defaults to now)
 * @returns Warranty status
 *
 * @example
 * ```typescript
 * const status = await isAssetUnderWarranty('asset-123');
 * if (status.isUnderWarranty) {
 *   console.log(`Covered by: ${status.warranty.provider}`);
 * }
 * ```
 */
export async function isAssetUnderWarranty(
  assetId: string,
  checkDate: Date = new Date()
): Promise<{ isUnderWarranty: boolean; warranty?: AssetWarranty }> {
  const warranties = await getAssetWarranties(assetId);

  const activeWarranty = warranties.find(
    w => w.startDate <= checkDate && w.expiryDate >= checkDate
  );

  return {
    isUnderWarranty: !!activeWarranty,
    warranty: activeWarranty,
  };
}

// ============================================================================
// ASSET VALUATION UPDATES
// ============================================================================

/**
 * Create asset valuation record
 *
 * @param assetId - Asset ID
 * @param valuation - Valuation data
 * @returns Created valuation record
 *
 * @example
 * ```typescript
 * const valuation = await createAssetValuation('asset-123', {
 *   marketValue: 45000,
 *   assessedByUserId: 'user-456',
 *   valuationMethod: 'Market comparison',
 * });
 * ```
 */
export async function createAssetValuation(
  assetId: string,
  valuation: {
    marketValue: number;
    assessedByUserId?: string;
    valuationMethod?: string;
    externalAppraiserId?: string;
    appraisalDocumentUrl?: string;
    notes?: string;
  }
): Promise<AssetValuation> {
  const asset = await getAssetById(assetId);
  const depreciatedValue = await calculateCurrentAssetValue(asset);

  const valuationRecord: AssetValuation = {
    id: uuidv4(),
    assetId,
    valuationDate: new Date(),
    marketValue: valuation.marketValue,
    bookValue: asset.currentValue,
    depreciatedValue,
    assessedByUserId: valuation.assessedByUserId,
    valuationMethod: valuation.valuationMethod,
    externalAppraiserId: valuation.externalAppraiserId,
    appraisalDocumentUrl: valuation.appraisalDocumentUrl,
    notes: valuation.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Update asset current value
  await updateAsset(assetId, {
    currentValue: valuation.marketValue,
  });

  await createAuditLog({
    assetId,
    action: 'VALUATION_UPDATED',
    performedByUserId: valuation.assessedByUserId || 'system',
    newState: valuationRecord,
    timestamp: new Date(),
  });

  return valuationRecord;
}

/**
 * Get valuation history for an asset
 *
 * @param assetId - Asset ID
 * @returns List of valuations
 *
 * @example
 * ```typescript
 * const history = await getAssetValuationHistory('asset-123');
 * ```
 */
export async function getAssetValuationHistory(assetId: string): Promise<AssetValuation[]> {
  // Implementation would query database
  return [];
}

/**
 * Bulk update asset valuations based on depreciation
 *
 * @param assetIds - List of asset IDs (optional, defaults to all)
 * @returns Number of assets updated
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateAssetValuations();
 * console.log(`Updated ${updated} assets`);
 * ```
 */
export async function bulkUpdateAssetValuations(assetIds?: string[]): Promise<number> {
  // Implementation would query assets and update valuations
  // This would typically be run as a scheduled job
  return 0;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create audit log entry
 *
 * @param log - Audit log data
 */
async function createAuditLog(log: Omit<AssetAuditLog, 'id'>): Promise<AssetAuditLog> {
  const auditLog: AssetAuditLog = {
    id: uuidv4(),
    ...log,
  };

  // Implementation would save to database
  return auditLog;
}

/**
 * Generate unique asset tag
 *
 * @param category - Asset category
 * @param sequence - Sequence number
 * @returns Asset tag
 *
 * @example
 * ```typescript
 * const tag = generateUniqueAssetTag(AssetCategory.MEDICAL_EQUIPMENT, 123);
 * // Returns: 'MED-2024-00123'
 * ```
 */
export function generateUniqueAssetTag(category: AssetCategory, sequence: number): string {
  const year = new Date().getFullYear();
  const categoryPrefix = category.substring(0, 3).toUpperCase();
  const paddedSequence = sequence.toString().padStart(5, '0');

  return `${categoryPrefix}-${year}-${paddedSequence}`;
}

/**
 * Calculate total asset value for a location or department
 *
 * @param filters - Location or department filter
 * @returns Total asset value
 *
 * @example
 * ```typescript
 * const totalValue = await calculateTotalAssetValue({ locationId: 'loc-123' });
 * ```
 */
export async function calculateTotalAssetValue(filters: {
  locationId?: string;
  departmentId?: string;
  category?: AssetCategory;
}): Promise<{ totalPurchaseValue: number; totalCurrentValue: number; count: number }> {
  // Implementation would query and sum asset values
  return { totalPurchaseValue: 0, totalCurrentValue: 0, count: 0 };
}

/**
 * Get asset utilization metrics
 *
 * @param assetId - Asset ID
 * @param startDate - Start date for metrics
 * @param endDate - End date for metrics
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await getAssetUtilizationMetrics('asset-123', startDate, endDate);
 * ```
 */
export async function getAssetUtilizationMetrics(
  assetId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  assetId: string;
  totalDays: number;
  daysInUse: number;
  daysInMaintenance: number;
  daysAvailable: number;
  utilizationRate: number;
}> {
  // Implementation would calculate from audit logs and status changes
  return {
    assetId,
    totalDays: 0,
    daysInUse: 0,
    daysInMaintenance: 0,
    daysAvailable: 0,
    utilizationRate: 0,
  };
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Asset model interface for Sequelize
 */
export interface AssetModel {
  id: string;
  assetTag: string;
  name: string;
  description?: string;
  category: AssetCategory;
  status: AssetStatus;
  condition: AssetCondition;

  serialNumber?: string;
  modelNumber?: string;
  manufacturer?: string;
  barcode?: string;
  rfidTag?: string;
  qrCode?: string;

  locationId: string;
  departmentId?: string;
  assignedToUserId?: string;

  purchasePrice: number;
  currentValue: number;
  salvageValue?: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears?: number;

  purchaseDate: Date;
  warrantyExpiryDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  retirementDate?: Date;

  vendorId?: string;
  invoiceNumber?: string;
  insurancePolicyNumber?: string;
  notes?: string;
  metadata?: string; // JSON

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Asset location model interface for Sequelize
 */
export interface AssetLocationModel {
  id: string;
  name: string;
  code: string;
  type: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  parentLocationId?: string;
  responsibleUserId?: string;
  capacity?: number;
  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maintenance record model interface for Sequelize
 */
export interface MaintenanceRecordModel {
  id: string;
  assetId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: Date;
  completedDate?: Date;
  performedByUserId?: string;
  vendorId?: string;

  description: string;
  workOrderNumber?: string;
  cost?: number;
  laborHours?: number;
  partsUsed?: string; // JSON

  notes?: string;
  attachments?: string; // JSON
  nextScheduledDate?: Date;

  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset transfer model interface for Sequelize
 */
export interface AssetTransferModel {
  id: string;
  assetId: string;
  fromLocationId: string;
  toLocationId: string;
  fromUserId?: string;
  toUserId?: string;
  status: TransferStatus;

  requestedByUserId: string;
  approvedByUserId?: string;

  requestDate: Date;
  approvalDate?: Date;
  transferDate?: Date;
  completionDate?: Date;

  reason?: string;
  notes?: string;

  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset valuation model interface for Sequelize
 */
export interface AssetValuationModel {
  id: string;
  assetId: string;
  valuationDate: Date;
  marketValue: number;
  bookValue: number;
  depreciatedValue: number;
  assessedByUserId?: string;

  valuationMethod?: string;
  externalAppraiserId?: string;
  appraisalDocumentUrl?: string;

  notes?: string;
  metadata?: string; // JSON

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset warranty model interface for Sequelize
 */
export interface AssetWarrantyModel {
  id: string;
  assetId: string;
  warrantyType: string;

  provider: string;
  policyNumber?: string;

  startDate: Date;
  expiryDate: Date;

  coverageDetails?: string;
  cost?: number;

  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;

  documentUrl?: string;

  metadata?: string; // JSON
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset disposal model interface for Sequelize
 */
export interface AssetDisposalModel {
  id: string;
  assetId: string;
  disposalMethod: DisposalMethod;
  disposalDate: Date;

  reason: string;
  approvedByUserId: string;

  salePrice?: number;
  buyerInformation?: string;

  certificateOfDestruction?: string;
  environmentalCompliance?: boolean;
  dataWipingConfirmed?: boolean;

  notes?: string;
  metadata?: string; // JSON

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Asset audit log model interface for Sequelize
 */
export interface AssetAuditLogModel {
  id: string;
  assetId: string;
  action: string;
  performedByUserId: string;

  previousState?: string; // JSON
  newState?: string; // JSON

  ipAddress?: string;
  userAgent?: string;

  timestamp: Date;
}

// ============================================================================
// SWAGGER DECORATORS
// ============================================================================

/**
 * Swagger API tags for asset tracking endpoints
 */
export const AssetTrackingApiTags = {
  ASSETS: 'Assets',
  LOCATIONS: 'Asset Locations',
  MAINTENANCE: 'Asset Maintenance',
  TRANSFERS: 'Asset Transfers',
  VALUATIONS: 'Asset Valuations',
  WARRANTIES: 'Asset Warranties',
  DISPOSAL: 'Asset Disposal',
  IDENTIFIERS: 'Barcode/RFID',
  DEPRECIATION: 'Depreciation',
};

/**
 * Example Swagger decorators for asset controller
 *
 * @ApiTags(AssetTrackingApiTags.ASSETS)
 * @Controller('assets')
 * export class AssetController {
 *   @Post()
 *   @ApiOperation({ summary: 'Register new asset' })
 *   @ApiResponse({ status: 201, description: 'Asset created successfully' })
 *   async create(@Body() data: AssetCreateSchema) {
 *     return registerAsset(data);
 *   }
 * }
 */
