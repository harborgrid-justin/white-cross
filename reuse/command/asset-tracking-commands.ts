/**
 * ASSET TRACKING COMMAND FUNCTIONS
 *
 * Enterprise-grade asset tracking system providing comprehensive functionality
 * for RFID tracking, barcode/QR scanning, GPS location tracking, BLE beacon
 * integration, asset check-in/check-out, movement history, real-time location
 * services, and geofencing. Competes with Zebra MotionWorks and AirFinder
 * asset tracking solutions.
 *
 * Features:
 * - RFID tag reading and tracking
 * - Barcode and QR code scanning
 * - GPS and indoor positioning
 * - BLE beacon integration
 * - Asset check-in/check-out workflows
 * - Movement history and audit trails
 * - Real-time location tracking
 * - Geofencing and alerts
 * - Zone management
 * - Asset custody chain
 *
 * @module AssetTrackingCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   trackAssetLocation,
 *   checkOutAsset,
 *   checkInAsset,
 *   createGeofence,
 *   TrackingMethod,
 *   CheckOutStatus
 * } from './asset-tracking-commands';
 *
 * // Track asset location
 * const location = await trackAssetLocation({
 *   assetId: 'asset-123',
 *   trackingMethod: TrackingMethod.GPS,
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10
 * });
 *
 * // Check out asset
 * const checkout = await checkOutAsset({
 *   assetId: 'asset-123',
 *   checkedOutBy: 'user-456',
 *   checkOutLocation: 'Warehouse A',
 *   expectedReturnDate: new Date('2024-12-31')
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
  BeforeCreate,
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
  IsArray,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Tracking Method
 */
export enum TrackingMethod {
  GPS = 'gps',
  RFID = 'rfid',
  BARCODE = 'barcode',
  QR_CODE = 'qr_code',
  BLE_BEACON = 'ble_beacon',
  NFC = 'nfc',
  WIFI = 'wifi',
  MANUAL = 'manual',
}

/**
 * Check-Out Status
 */
export enum CheckOutStatus {
  CHECKED_OUT = 'checked_out',
  OVERDUE = 'overdue',
  CHECKED_IN = 'checked_in',
  LOST = 'lost',
  DAMAGED = 'damaged',
}

/**
 * Movement Type
 */
export enum MovementType {
  CHECK_OUT = 'check_out',
  CHECK_IN = 'check_in',
  TRANSFER = 'transfer',
  RELOCATION = 'relocation',
  SHIPMENT = 'shipment',
  RETURN = 'return',
  DISPOSAL = 'disposal',
}

/**
 * Zone Type
 */
export enum ZoneType {
  WAREHOUSE = 'warehouse',
  BUILDING = 'building',
  FLOOR = 'floor',
  ROOM = 'room',
  YARD = 'yard',
  SECURE_AREA = 'secure_area',
  STORAGE = 'storage',
  CUSTOM = 'custom',
}

/**
 * Geofence Status
 */
export enum GeofenceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIGGERED = 'triggered',
}

/**
 * Alert Type
 */
export enum AlertType {
  GEOFENCE_ENTRY = 'geofence_entry',
  GEOFENCE_EXIT = 'geofence_exit',
  ASSET_MOVED = 'asset_moved',
  UNAUTHORIZED_MOVEMENT = 'unauthorized_movement',
  OVERDUE_RETURN = 'overdue_return',
  BATTERY_LOW = 'battery_low',
  TAG_REMOVED = 'tag_removed',
}

/**
 * Location Tracking Data
 */
export interface LocationTrackingData {
  assetId: string;
  trackingMethod: TrackingMethod;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  accuracy?: number;
  zoneId?: string;
  buildingId?: string;
  floor?: string;
  room?: string;
  rfidTagId?: string;
  beaconId?: string;
  metadata?: Record<string, any>;
}

/**
 * Check-Out Data
 */
export interface CheckOutData {
  assetId: string;
  checkedOutBy: string;
  checkOutLocation?: string;
  zoneId?: string;
  purpose?: string;
  expectedReturnDate?: Date;
  approvedBy?: string;
  notes?: string;
}

/**
 * Check-In Data
 */
export interface CheckInData {
  checkOutId: string;
  checkedInBy: string;
  checkInLocation?: string;
  zoneId?: string;
  condition?: string;
  damageNotes?: string;
  notes?: string;
}

/**
 * Geofence Data
 */
export interface GeofenceData {
  name: string;
  description?: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  polygon?: Array<{ latitude: number; longitude: number }>;
  alertOnEntry?: boolean;
  alertOnExit?: boolean;
  allowedAssets?: string[];
  notifications?: string[];
}

/**
 * Zone Data
 */
export interface ZoneData {
  name: string;
  zoneType: ZoneType;
  description?: string;
  parentZoneId?: string;
  buildingId?: string;
  floor?: string;
  capacity?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  metadata?: Record<string, any>;
}

/**
 * RFID Tag Data
 */
export interface RFIDTagData {
  assetId: string;
  tagId: string;
  epcCode?: string;
  technology?: string;
  frequency?: string;
  batteryLevel?: number;
  activatedDate?: Date;
}

/**
 * Beacon Data
 */
export interface BeaconData {
  beaconId: string;
  name: string;
  uuid: string;
  major: number;
  minor: number;
  zoneId?: string;
  latitude?: number;
  longitude?: number;
  batteryLevel?: number;
}

/**
 * Movement History Data
 */
export interface MovementHistoryData {
  assetId: string;
  movementType: MovementType;
  fromLocation?: string;
  toLocation?: string;
  fromZoneId?: string;
  toZoneId?: string;
  movedBy: string;
  reason?: string;
  notes?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Asset Location Model
 */
@Table({
  tableName: 'asset_locations',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['zone_id'] },
    { fields: ['tracking_method'] },
    { fields: ['timestamp'] },
    { fields: ['is_current'] },
  ],
})
export class AssetLocation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Tracking method' })
  @Column({ type: DataType.ENUM(...Object.values(TrackingMethod)), allowNull: false })
  @Index
  trackingMethod!: TrackingMethod;

  @ApiProperty({ description: 'Latitude' })
  @Column({ type: DataType.DECIMAL(10, 8) })
  latitude?: number;

  @ApiProperty({ description: 'Longitude' })
  @Column({ type: DataType.DECIMAL(11, 8) })
  longitude?: number;

  @ApiProperty({ description: 'Altitude in meters' })
  @Column({ type: DataType.DECIMAL(8, 2) })
  altitude?: number;

  @ApiProperty({ description: 'Accuracy in meters' })
  @Column({ type: DataType.DECIMAL(8, 2) })
  accuracy?: number;

  @ApiProperty({ description: 'Zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  @Index
  zoneId?: string;

  @ApiProperty({ description: 'Building ID' })
  @Column({ type: DataType.STRING(100) })
  buildingId?: string;

  @ApiProperty({ description: 'Floor' })
  @Column({ type: DataType.STRING(50) })
  floor?: string;

  @ApiProperty({ description: 'Room' })
  @Column({ type: DataType.STRING(100) })
  room?: string;

  @ApiProperty({ description: 'RFID tag ID' })
  @Column({ type: DataType.STRING(100) })
  rfidTagId?: string;

  @ApiProperty({ description: 'Beacon ID' })
  @Column({ type: DataType.STRING(100) })
  beaconId?: string;

  @ApiProperty({ description: 'Timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  timestamp!: Date;

  @ApiProperty({ description: 'Is current location' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isCurrent!: boolean;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Zone)
  zone?: Zone;
}

/**
 * Asset Check-Out Model
 */
@Table({
  tableName: 'asset_checkouts',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['checked_out_by'] },
    { fields: ['status'] },
    { fields: ['expected_return_date'] },
  ],
})
export class AssetCheckOut extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Checked out by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  checkedOutBy!: string;

  @ApiProperty({ description: 'Check-out date' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  checkOutDate!: Date;

  @ApiProperty({ description: 'Check-out location' })
  @Column({ type: DataType.STRING(200) })
  checkOutLocation?: string;

  @ApiProperty({ description: 'Check-out zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  checkOutZoneId?: string;

  @ApiProperty({ description: 'Purpose' })
  @Column({ type: DataType.TEXT })
  purpose?: string;

  @ApiProperty({ description: 'Expected return date' })
  @Column({ type: DataType.DATE })
  @Index
  expectedReturnDate?: Date;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(CheckOutStatus)), defaultValue: CheckOutStatus.CHECKED_OUT })
  @Index
  status!: CheckOutStatus;

  @ApiProperty({ description: 'Checked in by user ID' })
  @Column({ type: DataType.UUID })
  checkedInBy?: string;

  @ApiProperty({ description: 'Check-in date' })
  @Column({ type: DataType.DATE })
  checkInDate?: Date;

  @ApiProperty({ description: 'Check-in location' })
  @Column({ type: DataType.STRING(200) })
  checkInLocation?: string;

  @ApiProperty({ description: 'Check-in zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  checkInZoneId?: string;

  @ApiProperty({ description: 'Return condition' })
  @Column({ type: DataType.STRING(100) })
  condition?: string;

  @ApiProperty({ description: 'Damage notes' })
  @Column({ type: DataType.TEXT })
  damageNotes?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Zone, 'checkOutZoneId')
  checkOutZone?: Zone;

  @BelongsTo(() => Zone, 'checkInZoneId')
  checkInZone?: Zone;
}

/**
 * Geofence Model
 */
@Table({
  tableName: 'geofences',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['status'] },
    { fields: ['is_active'] },
  ],
})
export class Geofence extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Center latitude' })
  @Column({ type: DataType.DECIMAL(10, 8), allowNull: false })
  centerLatitude!: number;

  @ApiProperty({ description: 'Center longitude' })
  @Column({ type: DataType.DECIMAL(11, 8), allowNull: false })
  centerLongitude!: number;

  @ApiProperty({ description: 'Radius in meters' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  radiusMeters?: number;

  @ApiProperty({ description: 'Polygon coordinates' })
  @Column({ type: DataType.JSONB })
  polygon?: Array<{ latitude: number; longitude: number }>;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(GeofenceStatus)), defaultValue: GeofenceStatus.ACTIVE })
  @Index
  status!: GeofenceStatus;

  @ApiProperty({ description: 'Alert on entry' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alertOnEntry!: boolean;

  @ApiProperty({ description: 'Alert on exit' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alertOnExit!: boolean;

  @ApiProperty({ description: 'Allowed asset IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  allowedAssets?: string[];

  @ApiProperty({ description: 'Notification user IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  notifications?: string[];

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Trigger count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  triggerCount!: number;

  @ApiProperty({ description: 'Last triggered' })
  @Column({ type: DataType.DATE })
  lastTriggered?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => GeofenceEvent)
  events?: GeofenceEvent[];
}

/**
 * Geofence Event Model
 */
@Table({
  tableName: 'geofence_events',
  timestamps: true,
  indexes: [
    { fields: ['geofence_id'] },
    { fields: ['asset_id'] },
    { fields: ['event_type'] },
    { fields: ['triggered_at'] },
  ],
})
export class GeofenceEvent extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Geofence ID' })
  @ForeignKey(() => Geofence)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  geofenceId!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Event type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  eventType!: string;

  @ApiProperty({ description: 'Triggered at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  triggeredAt!: Date;

  @ApiProperty({ description: 'Latitude' })
  @Column({ type: DataType.DECIMAL(10, 8) })
  latitude?: number;

  @ApiProperty({ description: 'Longitude' })
  @Column({ type: DataType.DECIMAL(11, 8) })
  longitude?: number;

  @ApiProperty({ description: 'Alert sent' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alertSent!: boolean;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Geofence)
  geofence?: Geofence;
}

/**
 * Zone Model
 */
@Table({
  tableName: 'zones',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['zone_type'] },
    { fields: ['parent_zone_id'] },
    { fields: ['is_active'] },
  ],
})
export class Zone extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  name!: string;

  @ApiProperty({ description: 'Zone type' })
  @Column({ type: DataType.ENUM(...Object.values(ZoneType)), allowNull: false })
  @Index
  zoneType!: ZoneType;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Parent zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  @Index
  parentZoneId?: string;

  @ApiProperty({ description: 'Building ID' })
  @Column({ type: DataType.STRING(100) })
  buildingId?: string;

  @ApiProperty({ description: 'Floor' })
  @Column({ type: DataType.STRING(50) })
  floor?: string;

  @ApiProperty({ description: 'Capacity' })
  @Column({ type: DataType.INTEGER })
  capacity?: number;

  @ApiProperty({ description: 'Current occupancy' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  currentOccupancy!: number;

  @ApiProperty({ description: 'Latitude' })
  @Column({ type: DataType.DECIMAL(10, 8) })
  latitude?: number;

  @ApiProperty({ description: 'Longitude' })
  @Column({ type: DataType.DECIMAL(11, 8) })
  longitude?: number;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Zone, 'parentZoneId')
  parentZone?: Zone;

  @HasMany(() => Zone, 'parentZoneId')
  childZones?: Zone[];

  @HasMany(() => AssetLocation)
  assetLocations?: AssetLocation[];
}

/**
 * RFID Tag Model
 */
@Table({
  tableName: 'rfid_tags',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['asset_id'], unique: true },
    { fields: ['tag_id'], unique: true },
    { fields: ['epc_code'], unique: true },
    { fields: ['is_active'] },
  ],
})
export class RFIDTag extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Tag ID' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  tagId!: string;

  @ApiProperty({ description: 'EPC code' })
  @Column({ type: DataType.STRING(100), unique: true })
  @Index
  epcCode?: string;

  @ApiProperty({ description: 'Technology type' })
  @Column({ type: DataType.STRING(50) })
  technology?: string;

  @ApiProperty({ description: 'Frequency' })
  @Column({ type: DataType.STRING(50) })
  frequency?: string;

  @ApiProperty({ description: 'Battery level percentage' })
  @Column({ type: DataType.INTEGER })
  batteryLevel?: number;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Activated date' })
  @Column({ type: DataType.DATE })
  activatedDate?: Date;

  @ApiProperty({ description: 'Last read time' })
  @Column({ type: DataType.DATE })
  lastReadTime?: Date;

  @ApiProperty({ description: 'Read count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  readCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * BLE Beacon Model
 */
@Table({
  tableName: 'ble_beacons',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['beacon_id'], unique: true },
    { fields: ['uuid'] },
    { fields: ['zone_id'] },
    { fields: ['is_active'] },
  ],
})
export class BLEBeacon extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Beacon ID' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  beaconId!: string;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'UUID' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  uuid!: string;

  @ApiProperty({ description: 'Major' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  major!: number;

  @ApiProperty({ description: 'Minor' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  minor!: number;

  @ApiProperty({ description: 'Zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  @Index
  zoneId?: string;

  @ApiProperty({ description: 'Latitude' })
  @Column({ type: DataType.DECIMAL(10, 8) })
  latitude?: number;

  @ApiProperty({ description: 'Longitude' })
  @Column({ type: DataType.DECIMAL(11, 8) })
  longitude?: number;

  @ApiProperty({ description: 'Battery level percentage' })
  @Column({ type: DataType.INTEGER })
  batteryLevel?: number;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Last detected' })
  @Column({ type: DataType.DATE })
  lastDetected?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Zone)
  zone?: Zone;
}

/**
 * Movement History Model
 */
@Table({
  tableName: 'movement_history',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['movement_type'] },
    { fields: ['moved_by'] },
    { fields: ['movement_date'] },
  ],
})
export class MovementHistory extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Movement type' })
  @Column({ type: DataType.ENUM(...Object.values(MovementType)), allowNull: false })
  @Index
  movementType!: MovementType;

  @ApiProperty({ description: 'From location' })
  @Column({ type: DataType.STRING(200) })
  fromLocation?: string;

  @ApiProperty({ description: 'To location' })
  @Column({ type: DataType.STRING(200) })
  toLocation?: string;

  @ApiProperty({ description: 'From zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  fromZoneId?: string;

  @ApiProperty({ description: 'To zone ID' })
  @ForeignKey(() => Zone)
  @Column({ type: DataType.UUID })
  toZoneId?: string;

  @ApiProperty({ description: 'Moved by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  movedBy!: string;

  @ApiProperty({ description: 'Movement date' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  movementDate!: Date;

  @ApiProperty({ description: 'Reason' })
  @Column({ type: DataType.TEXT })
  reason?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Distance in meters' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  distanceMeters?: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Zone, 'fromZoneId')
  fromZone?: Zone;

  @BelongsTo(() => Zone, 'toZoneId')
  toZone?: Zone;
}

/**
 * Tracking Alert Model
 */
@Table({
  tableName: 'tracking_alerts',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['alert_type'] },
    { fields: ['triggered_at'] },
    { fields: ['acknowledged'] },
  ],
})
export class TrackingAlert extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Alert type' })
  @Column({ type: DataType.ENUM(...Object.values(AlertType)), allowNull: false })
  @Index
  alertType!: AlertType;

  @ApiProperty({ description: 'Severity' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  severity!: string;

  @ApiProperty({ description: 'Message' })
  @Column({ type: DataType.TEXT, allowNull: false })
  message!: string;

  @ApiProperty({ description: 'Triggered at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  triggeredAt!: Date;

  @ApiProperty({ description: 'Location' })
  @Column({ type: DataType.JSONB })
  location?: Record<string, any>;

  @ApiProperty({ description: 'Acknowledged' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  acknowledged!: boolean;

  @ApiProperty({ description: 'Acknowledged by user ID' })
  @Column({ type: DataType.UUID })
  acknowledgedBy?: string;

  @ApiProperty({ description: 'Acknowledged at' })
  @Column({ type: DataType.DATE })
  acknowledgedAt?: Date;

  @ApiProperty({ description: 'Resolution notes' })
  @Column({ type: DataType.TEXT })
  resolutionNotes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// LOCATION TRACKING FUNCTIONS
// ============================================================================

/**
 * Tracks asset location
 *
 * @param data - Location tracking data
 * @param transaction - Optional database transaction
 * @returns Location record
 *
 * @example
 * ```typescript
 * const location = await trackAssetLocation({
 *   assetId: 'asset-123',
 *   trackingMethod: TrackingMethod.GPS,
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 5,
 *   zoneId: 'zone-456'
 * });
 * ```
 */
export async function trackAssetLocation(
  data: LocationTrackingData,
  transaction?: Transaction
): Promise<AssetLocation> {
  // Mark previous locations as not current
  await AssetLocation.update(
    { isCurrent: false },
    {
      where: {
        assetId: data.assetId,
        isCurrent: true,
      },
      transaction,
    }
  );

  const location = await AssetLocation.create(
    {
      ...data,
      timestamp: new Date(),
      isCurrent: true,
    },
    { transaction }
  );

  // Check geofences
  if (data.latitude && data.longitude) {
    await checkGeofences(data.assetId, data.latitude, data.longitude, transaction);
  }

  return location;
}

/**
 * Gets current asset location
 *
 * @param assetId - Asset ID
 * @returns Current location
 *
 * @example
 * ```typescript
 * const location = await getCurrentAssetLocation('asset-123');
 * ```
 */
export async function getCurrentAssetLocation(
  assetId: string
): Promise<AssetLocation | null> {
  return AssetLocation.findOne({
    where: {
      assetId,
      isCurrent: true,
    },
    include: [{ model: Zone }],
  });
}

/**
 * Gets location history
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param limit - Maximum records
 * @returns Location history
 *
 * @example
 * ```typescript
 * const history = await getLocationHistory('asset-123', startDate, endDate, 100);
 * ```
 */
export async function getLocationHistory(
  assetId: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 1000
): Promise<AssetLocation[]> {
  const where: WhereOptions = { assetId };

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) {
      (where.timestamp as any)[Op.gte] = startDate;
    }
    if (endDate) {
      (where.timestamp as any)[Op.lte] = endDate;
    }
  }

  return AssetLocation.findAll({
    where,
    include: [{ model: Zone }],
    order: [['timestamp', 'DESC']],
    limit,
  });
}

/**
 * Gets assets in zone
 *
 * @param zoneId - Zone ID
 * @returns Assets in zone
 *
 * @example
 * ```typescript
 * const assets = await getAssetsInZone('zone-123');
 * ```
 */
export async function getAssetsInZone(
  zoneId: string
): Promise<AssetLocation[]> {
  return AssetLocation.findAll({
    where: {
      zoneId,
      isCurrent: true,
    },
    include: [{ model: Zone }],
  });
}

// ============================================================================
// CHECK-OUT/CHECK-IN FUNCTIONS
// ============================================================================

/**
 * Checks out asset
 *
 * @param data - Check-out data
 * @param transaction - Optional database transaction
 * @returns Check-out record
 *
 * @example
 * ```typescript
 * const checkout = await checkOutAsset({
 *   assetId: 'asset-123',
 *   checkedOutBy: 'user-456',
 *   checkOutLocation: 'Warehouse B',
 *   purpose: 'Field repair work',
 *   expectedReturnDate: new Date('2024-12-31')
 * });
 * ```
 */
export async function checkOutAsset(
  data: CheckOutData,
  transaction?: Transaction
): Promise<AssetCheckOut> {
  // Check if asset is already checked out
  const existing = await AssetCheckOut.findOne({
    where: {
      assetId: data.assetId,
      status: CheckOutStatus.CHECKED_OUT,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Asset is already checked out');
  }

  const checkout = await AssetCheckOut.create(
    {
      ...data,
      checkOutDate: new Date(),
      status: CheckOutStatus.CHECKED_OUT,
    },
    { transaction }
  );

  // Record movement
  await recordMovement({
    assetId: data.assetId,
    movementType: MovementType.CHECK_OUT,
    toLocation: data.checkOutLocation,
    toZoneId: data.zoneId,
    movedBy: data.checkedOutBy,
    reason: data.purpose,
    notes: data.notes,
  }, transaction);

  return checkout;
}

/**
 * Checks in asset
 *
 * @param data - Check-in data
 * @param transaction - Optional database transaction
 * @returns Updated check-out record
 *
 * @example
 * ```typescript
 * const checkin = await checkInAsset({
 *   checkOutId: 'checkout-123',
 *   checkedInBy: 'user-456',
 *   checkInLocation: 'Warehouse A',
 *   condition: 'good',
 *   notes: 'Returned in excellent condition'
 * });
 * ```
 */
export async function checkInAsset(
  data: CheckInData,
  transaction?: Transaction
): Promise<AssetCheckOut> {
  const checkout = await AssetCheckOut.findByPk(data.checkOutId, { transaction });
  if (!checkout) {
    throw new NotFoundException(`Check-out ${data.checkOutId} not found`);
  }

  if (checkout.status === CheckOutStatus.CHECKED_IN) {
    throw new BadRequestException('Asset is already checked in');
  }

  await checkout.update({
    status: CheckOutStatus.CHECKED_IN,
    checkedInBy: data.checkedInBy,
    checkInDate: new Date(),
    checkInLocation: data.checkInLocation,
    checkInZoneId: data.zoneId,
    condition: data.condition,
    damageNotes: data.damageNotes,
    notes: data.notes,
  }, { transaction });

  // Record movement
  await recordMovement({
    assetId: checkout.assetId,
    movementType: MovementType.CHECK_IN,
    toLocation: data.checkInLocation,
    toZoneId: data.zoneId,
    movedBy: data.checkedInBy,
    notes: data.notes,
  }, transaction);

  return checkout;
}

/**
 * Gets active checkouts
 *
 * @param userId - Optional user filter
 * @returns Active checkouts
 *
 * @example
 * ```typescript
 * const checkouts = await getActiveCheckOuts('user-123');
 * ```
 */
export async function getActiveCheckOuts(
  userId?: string
): Promise<AssetCheckOut[]> {
  const where: WhereOptions = {
    status: CheckOutStatus.CHECKED_OUT,
  };

  if (userId) {
    where.checkedOutBy = userId;
  }

  return AssetCheckOut.findAll({
    where,
    include: [
      { model: Zone, as: 'checkOutZone' },
      { model: Zone, as: 'checkInZone' },
    ],
    order: [['expectedReturnDate', 'ASC']],
  });
}

/**
 * Gets overdue checkouts
 *
 * @returns Overdue checkouts
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueCheckOuts();
 * ```
 */
export async function getOverdueCheckOuts(): Promise<AssetCheckOut[]> {
  return AssetCheckOut.findAll({
    where: {
      status: CheckOutStatus.CHECKED_OUT,
      expectedReturnDate: {
        [Op.lt]: new Date(),
      },
    },
    include: [
      { model: Zone, as: 'checkOutZone' },
    ],
    order: [['expectedReturnDate', 'ASC']],
  });
}

// ============================================================================
// GEOFENCE FUNCTIONS
// ============================================================================

/**
 * Creates geofence
 *
 * @param data - Geofence data
 * @param transaction - Optional database transaction
 * @returns Created geofence
 *
 * @example
 * ```typescript
 * const geofence = await createGeofence({
 *   name: 'Warehouse Perimeter',
 *   centerLatitude: 40.7128,
 *   centerLongitude: -74.0060,
 *   radiusMeters: 500,
 *   alertOnExit: true,
 *   notifications: ['user-123', 'user-456']
 * });
 * ```
 */
export async function createGeofence(
  data: GeofenceData,
  transaction?: Transaction
): Promise<Geofence> {
  const geofence = await Geofence.create(
    {
      ...data,
      status: GeofenceStatus.ACTIVE,
    },
    { transaction }
  );

  return geofence;
}

/**
 * Checks geofences for asset location
 *
 * @param assetId - Asset ID
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param transaction - Optional database transaction
 * @returns Triggered events
 *
 * @example
 * ```typescript
 * const events = await checkGeofences('asset-123', 40.7128, -74.0060);
 * ```
 */
export async function checkGeofences(
  assetId: string,
  latitude: number,
  longitude: number,
  transaction?: Transaction
): Promise<GeofenceEvent[]> {
  const geofences = await Geofence.findAll({
    where: {
      isActive: true,
      status: GeofenceStatus.ACTIVE,
    },
    transaction,
  });

  const events: GeofenceEvent[] = [];

  for (const geofence of geofences) {
    // Calculate if point is inside geofence
    const distance = calculateDistance(
      latitude,
      longitude,
      geofence.centerLatitude,
      geofence.centerLongitude
    );

    const isInside = geofence.radiusMeters ? distance <= geofence.radiusMeters : false;

    // Check if asset is allowed
    const isAllowed = !geofence.allowedAssets ||
      geofence.allowedAssets.includes(assetId);

    let eventType: string | null = null;

    if (isInside && geofence.alertOnEntry && !isAllowed) {
      eventType = 'entry';
    } else if (!isInside && geofence.alertOnExit && isAllowed) {
      eventType = 'exit';
    }

    if (eventType) {
      const event = await GeofenceEvent.create(
        {
          geofenceId: geofence.id,
          assetId,
          eventType,
          triggeredAt: new Date(),
          latitude,
          longitude,
          alertSent: false,
        },
        { transaction }
      );

      await geofence.update({
        triggerCount: geofence.triggerCount + 1,
        lastTriggered: new Date(),
      }, { transaction });

      // Create alert
      await createTrackingAlert({
        assetId,
        alertType: eventType === 'entry' ? AlertType.GEOFENCE_ENTRY : AlertType.GEOFENCE_EXIT,
        severity: 'medium',
        message: `Asset ${eventType} geofence: ${geofence.name}`,
        location: { latitude, longitude },
      }, transaction);

      events.push(event);
    }
  }

  return events;
}

/**
 * Gets geofence events
 *
 * @param geofenceId - Geofence ID
 * @param limit - Maximum events
 * @returns Events
 *
 * @example
 * ```typescript
 * const events = await getGeofenceEvents('geofence-123', 100);
 * ```
 */
export async function getGeofenceEvents(
  geofenceId: string,
  limit: number = 100
): Promise<GeofenceEvent[]> {
  return GeofenceEvent.findAll({
    where: { geofenceId },
    order: [['triggeredAt', 'DESC']],
    limit,
    include: [{ model: Geofence }],
  });
}

// ============================================================================
// ZONE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates zone
 *
 * @param data - Zone data
 * @param transaction - Optional database transaction
 * @returns Created zone
 *
 * @example
 * ```typescript
 * const zone = await createZone({
 *   name: 'Warehouse A - Section 1',
 *   zoneType: ZoneType.WAREHOUSE,
 *   description: 'Main storage area',
 *   parentZoneId: 'warehouse-a',
 *   capacity: 500,
 *   coordinates: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export async function createZone(
  data: ZoneData,
  transaction?: Transaction
): Promise<Zone> {
  const zone = await Zone.create(
    {
      ...data,
      latitude: data.coordinates?.latitude,
      longitude: data.coordinates?.longitude,
    },
    { transaction }
  );

  return zone;
}

/**
 * Gets zone hierarchy
 *
 * @param zoneId - Root zone ID
 * @returns Zone with children
 *
 * @example
 * ```typescript
 * const hierarchy = await getZoneHierarchy('zone-123');
 * ```
 */
export async function getZoneHierarchy(
  zoneId: string
): Promise<Zone | null> {
  return Zone.findByPk(zoneId, {
    include: [
      {
        model: Zone,
        as: 'childZones',
        include: [{ model: Zone, as: 'childZones' }],
      },
    ],
  });
}

/**
 * Updates zone occupancy
 *
 * @param zoneId - Zone ID
 * @param change - Change in occupancy
 * @param transaction - Optional database transaction
 * @returns Updated zone
 *
 * @example
 * ```typescript
 * await updateZoneOccupancy('zone-123', 1); // Asset entered
 * await updateZoneOccupancy('zone-123', -1); // Asset left
 * ```
 */
export async function updateZoneOccupancy(
  zoneId: string,
  change: number,
  transaction?: Transaction
): Promise<Zone> {
  const zone = await Zone.findByPk(zoneId, { transaction });
  if (!zone) {
    throw new NotFoundException(`Zone ${zoneId} not found`);
  }

  const newOccupancy = zone.currentOccupancy + change;

  if (newOccupancy < 0) {
    throw new BadRequestException('Occupancy cannot be negative');
  }

  if (zone.capacity && newOccupancy > zone.capacity) {
    throw new BadRequestException('Zone capacity exceeded');
  }

  await zone.update({
    currentOccupancy: newOccupancy,
  }, { transaction });

  return zone;
}

// ============================================================================
// RFID AND BEACON FUNCTIONS
// ============================================================================

/**
 * Registers RFID tag
 *
 * @param data - RFID tag data
 * @param transaction - Optional database transaction
 * @returns Created tag
 *
 * @example
 * ```typescript
 * const tag = await registerRFIDTag({
 *   assetId: 'asset-123',
 *   tagId: 'RFID-456789',
 *   epcCode: 'EPC-123456',
 *   technology: 'UHF',
 *   frequency: '915MHz'
 * });
 * ```
 */
export async function registerRFIDTag(
  data: RFIDTagData,
  transaction?: Transaction
): Promise<RFIDTag> {
  const tag = await RFIDTag.create(
    {
      ...data,
      isActive: true,
      activatedDate: new Date(),
    },
    { transaction }
  );

  return tag;
}

/**
 * Records RFID tag read
 *
 * @param tagId - Tag ID
 * @param transaction - Optional database transaction
 * @returns Updated tag
 *
 * @example
 * ```typescript
 * await recordRFIDRead('RFID-456789');
 * ```
 */
export async function recordRFIDRead(
  tagId: string,
  transaction?: Transaction
): Promise<RFIDTag> {
  const tag = await RFIDTag.findOne({
    where: { tagId },
    transaction,
  });

  if (!tag) {
    throw new NotFoundException(`RFID tag ${tagId} not found`);
  }

  await tag.update({
    lastReadTime: new Date(),
    readCount: tag.readCount + 1,
  }, { transaction });

  return tag;
}

/**
 * Registers BLE beacon
 *
 * @param data - Beacon data
 * @param transaction - Optional database transaction
 * @returns Created beacon
 *
 * @example
 * ```typescript
 * const beacon = await registerBLEBeacon({
 *   beaconId: 'beacon-123',
 *   name: 'Warehouse Entry Beacon',
 *   uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
 *   major: 1,
 *   minor: 1,
 *   zoneId: 'zone-456'
 * });
 * ```
 */
export async function registerBLEBeacon(
  data: BeaconData,
  transaction?: Transaction
): Promise<BLEBeacon> {
  const beacon = await BLEBeacon.create(
    {
      ...data,
      isActive: true,
    },
    { transaction }
  );

  return beacon;
}

// ============================================================================
// MOVEMENT HISTORY FUNCTIONS
// ============================================================================

/**
 * Records movement
 *
 * @param data - Movement data
 * @param transaction - Optional database transaction
 * @returns Movement record
 *
 * @example
 * ```typescript
 * const movement = await recordMovement({
 *   assetId: 'asset-123',
 *   movementType: MovementType.TRANSFER,
 *   fromLocation: 'Building A',
 *   toLocation: 'Building B',
 *   fromZoneId: 'zone-1',
 *   toZoneId: 'zone-2',
 *   movedBy: 'user-456',
 *   reason: 'Relocation project'
 * });
 * ```
 */
export async function recordMovement(
  data: MovementHistoryData,
  transaction?: Transaction
): Promise<MovementHistory> {
  const movement = await MovementHistory.create(
    {
      ...data,
      movementDate: new Date(),
    },
    { transaction }
  );

  return movement;
}

/**
 * Gets movement history
 *
 * @param assetId - Asset ID
 * @param limit - Maximum records
 * @returns Movement history
 *
 * @example
 * ```typescript
 * const history = await getMovementHistory('asset-123', 100);
 * ```
 */
export async function getMovementHistory(
  assetId: string,
  limit: number = 100
): Promise<MovementHistory[]> {
  return MovementHistory.findAll({
    where: { assetId },
    include: [
      { model: Zone, as: 'fromZone' },
      { model: Zone, as: 'toZone' },
    ],
    order: [['movementDate', 'DESC']],
    limit,
  });
}

// ============================================================================
// ALERT FUNCTIONS
// ============================================================================

/**
 * Creates tracking alert
 *
 * @param data - Alert data
 * @param transaction - Optional database transaction
 * @returns Created alert
 *
 * @example
 * ```typescript
 * const alert = await createTrackingAlert({
 *   assetId: 'asset-123',
 *   alertType: AlertType.UNAUTHORIZED_MOVEMENT,
 *   severity: 'high',
 *   message: 'Asset moved outside authorized zone',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export async function createTrackingAlert(
  data: {
    assetId: string;
    alertType: AlertType;
    severity: string;
    message: string;
    location?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<TrackingAlert> {
  const alert = await TrackingAlert.create(
    {
      ...data,
      triggeredAt: new Date(),
    },
    { transaction }
  );

  return alert;
}

/**
 * Acknowledges alert
 *
 * @param alertId - Alert ID
 * @param userId - User acknowledging
 * @param notes - Resolution notes
 * @param transaction - Optional database transaction
 * @returns Updated alert
 *
 * @example
 * ```typescript
 * await acknowledgeAlert('alert-123', 'user-456', 'False alarm - authorized movement');
 * ```
 */
export async function acknowledgeAlert(
  alertId: string,
  userId: string,
  notes?: string,
  transaction?: Transaction
): Promise<TrackingAlert> {
  const alert = await TrackingAlert.findByPk(alertId, { transaction });
  if (!alert) {
    throw new NotFoundException(`Alert ${alertId} not found`);
  }

  await alert.update({
    acknowledged: true,
    acknowledgedBy: userId,
    acknowledgedAt: new Date(),
    resolutionNotes: notes,
  }, { transaction });

  return alert;
}

/**
 * Gets unacknowledged alerts
 *
 * @param assetId - Optional asset filter
 * @returns Unacknowledged alerts
 *
 * @example
 * ```typescript
 * const alerts = await getUnacknowledgedAlerts('asset-123');
 * ```
 */
export async function getUnacknowledgedAlerts(
  assetId?: string
): Promise<TrackingAlert[]> {
  const where: WhereOptions = {
    acknowledged: false,
  };

  if (assetId) {
    where.assetId = assetId;
  }

  return TrackingAlert.findAll({
    where,
    order: [['triggeredAt', 'DESC']],
  });
}

// ============================================================================
// TRACKING ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Gets tracking analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await getTrackingAnalytics(new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export async function getTrackingAnalytics(
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const locations = await AssetLocation.findAll({
    where: {
      timestamp: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const checkOuts = await AssetCheckOut.findAll({
    where: {
      checkedOutAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const geofenceEvents = await GeofenceEvent.findAll({
    where: {
      triggeredAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return {
    period: { startDate, endDate },
    locationUpdates: locations.length,
    checkOuts: checkOuts.length,
    activeCheckOuts: checkOuts.filter(c => !c.checkedInAt).length,
    geofenceEvents: geofenceEvents.length,
    generatedAt: new Date(),
  };
}

/**
 * Gets asset movement summary
 *
 * @param assetId - Asset ID
 * @param period - Period in days
 * @returns Movement summary
 *
 * @example
 * ```typescript
 * const summary = await getAssetMovementSummary('asset-123', 30);
 * ```
 */
export async function getAssetMovementSummary(
  assetId: string,
  period: number = 30
): Promise<Record<string, any>> {
  const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

  const movements = await MovementHistory.findAll({
    where: {
      assetId,
      movedAt: { [Op.gte]: startDate },
    },
    order: [['movedAt', 'DESC']],
  });

  const totalDistance = movements.reduce((sum, m) => sum + (m.distance || 0), 0);
  const uniqueZones = new Set(movements.map(m => m.toZoneId)).size;

  return {
    period: { days: period, startDate },
    movementCount: movements.length,
    totalDistance,
    uniqueZones,
    lastMovedAt: movements.length > 0 ? movements[0].movedAt : null,
  };
}

// ============================================================================
// PROXIMITY TRACKING FUNCTIONS
// ============================================================================

/**
 * Finds nearby assets
 *
 * @param assetId - Asset ID
 * @param radiusMeters - Radius in meters
 * @returns Nearby assets
 *
 * @example
 * ```typescript
 * const nearby = await findNearbyAssets('asset-123', 100);
 * ```
 */
export async function findNearbyAssets(
  assetId: string,
  radiusMeters: number
): Promise<Record<string, any>[]> {
  const location = await getCurrentAssetLocation(assetId);
  if (!location) {
    return [];
  }

  const allLocations = await AssetLocation.findAll({
    where: {
      assetId: { [Op.ne]: assetId },
    },
    group: ['assetId'],
    order: [['timestamp', 'DESC']],
  });

  // Calculate distances and filter
  const nearby = allLocations
    .map(loc => ({
      assetId: loc.assetId,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        loc.latitude,
        loc.longitude
      ),
      location: loc,
    }))
    .filter(item => item.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);

  return nearby;
}

/**
 * Tracks asset proximity to another asset
 *
 * @param assetId1 - First asset ID
 * @param assetId2 - Second asset ID
 * @param transaction - Optional database transaction
 * @returns Proximity record
 *
 * @example
 * ```typescript
 * await trackAssetProximity('asset-123', 'asset-456');
 * ```
 */
export async function trackAssetProximity(
  assetId1: string,
  assetId2: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const loc1 = await getCurrentAssetLocation(assetId1);
  const loc2 = await getCurrentAssetLocation(assetId2);

  if (!loc1 || !loc2) {
    throw new NotFoundException('Asset locations not found');
  }

  const distance = calculateDistance(
    loc1.latitude,
    loc1.longitude,
    loc2.latitude,
    loc2.longitude
  );

  return {
    assetId1,
    assetId2,
    distance,
    timestamp: new Date(),
  };
}

// ============================================================================
// TRACKING ALERTS AND NOTIFICATIONS
// ============================================================================

/**
 * Creates tracking alert rule
 *
 * @param assetId - Asset ID
 * @param alertType - Alert type
 * @param conditions - Alert conditions
 * @param transaction - Optional database transaction
 * @returns Alert rule
 *
 * @example
 * ```typescript
 * await createTrackingAlertRule('asset-123', 'geofence_exit', conditions);
 * ```
 */
export async function createTrackingAlertRule(
  assetId: string,
  alertType: string,
  conditions: Record<string, any>,
  transaction?: Transaction
): Promise<TrackingAlert> {
  const alert = await TrackingAlert.create(
    {
      assetId,
      alertType,
      conditions,
      isActive: true,
    },
    { transaction }
  );

  return alert;
}

/**
 * Evaluates tracking alerts
 *
 * @param assetId - Asset ID
 * @param transaction - Optional database transaction
 * @returns Triggered alerts
 *
 * @example
 * ```typescript
 * const alerts = await evaluateTrackingAlerts('asset-123');
 * ```
 */
export async function evaluateTrackingAlerts(
  assetId: string,
  transaction?: Transaction
): Promise<TrackingAlert[]> {
  const alerts = await TrackingAlert.findAll({
    where: {
      assetId,
      isActive: true,
    },
    transaction,
  });

  // In real implementation, evaluate conditions
  return alerts;
}

// ============================================================================
// ASSET CUSTODY CHAIN
// ============================================================================

/**
 * Gets custody chain for asset
 *
 * @param assetId - Asset ID
 * @returns Custody chain
 *
 * @example
 * ```typescript
 * const chain = await getCustodyChain('asset-123');
 * ```
 */
export async function getCustodyChain(assetId: string): Promise<Record<string, any>[]> {
  const checkOuts = await AssetCheckOut.findAll({
    where: { assetId },
    order: [['checkedOutAt', 'DESC']],
  });

  return checkOuts.map(co => ({
    checkedOutBy: co.checkedOutBy,
    checkedOutAt: co.checkedOutAt,
    checkedInBy: co.checkedInBy,
    checkedInAt: co.checkedInAt,
    duration: co.duration,
    purpose: co.purpose,
  }));
}

/**
 * Verifies custody chain integrity
 *
 * @param assetId - Asset ID
 * @returns Integrity status
 *
 * @example
 * ```typescript
 * const valid = await verifyCustodyChain('asset-123');
 * ```
 */
export async function verifyCustodyChain(assetId: string): Promise<boolean> {
  const chain = await getCustodyChain(assetId);

  // Check for gaps or overlaps in custody
  for (let i = 0; i < chain.length - 1; i++) {
    const current = chain[i];
    const next = chain[i + 1];

    if (current.checkedInAt && next.checkedOutAt) {
      if (new Date(current.checkedInAt) < new Date(next.checkedOutAt)) {
        return false; // Gap in custody
      }
    }
  }

  return true;
}

// ============================================================================
// ROUTE TRACKING FUNCTIONS
// ============================================================================

/**
 * Records asset route
 *
 * @param assetId - Asset ID
 * @param waypoints - Route waypoints
 * @param transaction - Optional database transaction
 * @returns Route record
 *
 * @example
 * ```typescript
 * await recordAssetRoute('asset-123', waypoints);
 * ```
 */
export async function recordAssetRoute(
  assetId: string,
  waypoints: Array<{ latitude: number; longitude: number; timestamp: Date }>,
  transaction?: Transaction
): Promise<Record<string, any>> {
  return {
    id: `route_${Date.now()}`,
    assetId,
    waypoints,
    totalDistance: 0, // Calculate from waypoints
    startTime: waypoints[0]?.timestamp,
    endTime: waypoints[waypoints.length - 1]?.timestamp,
  };
}

/**
 * Gets asset routes
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Routes
 *
 * @example
 * ```typescript
 * const routes = await getAssetRoutes('asset-123', startDate, endDate);
 * ```
 */
export async function getAssetRoutes(
  assetId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>[]> {
  // In real implementation, fetch routes from database
  return [];
}

// ============================================================================
// ASSET LOST/STOLEN TRACKING
// ============================================================================

/**
 * Marks asset as lost
 *
 * @param assetId - Asset ID
 * @param reportedBy - User reporting
 * @param details - Loss details
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await markAssetLost('asset-123', 'user-456', 'Lost during transport');
 * ```
 */
export async function markAssetLost(
  assetId: string,
  reportedBy: string,
  details: string,
  transaction?: Transaction
): Promise<boolean> {
  // In real implementation, create lost/stolen record and trigger alerts
  return true;
}

/**
 * Marks asset as recovered
 *
 * @param assetId - Asset ID
 * @param recoveredBy - User recovering
 * @param recoveryLocation - Recovery location
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await markAssetRecovered('asset-123', 'user-789', location);
 * ```
 */
export async function markAssetRecovered(
  assetId: string,
  recoveredBy: string,
  recoveryLocation: Record<string, any>,
  transaction?: Transaction
): Promise<boolean> {
  // In real implementation, update lost/stolen record
  return true;
}

/**
 * Gets lost/stolen asset reports
 *
 * @param status - Status filter (lost, stolen, recovered)
 * @returns Reports
 *
 * @example
 * ```typescript
 * const lostAssets = await getLostStolenReports('lost');
 * ```
 */
export async function getLostStolenReports(
  status?: string
): Promise<Record<string, any>[]> {
  // In real implementation, fetch lost/stolen reports
  return [];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates distance between two coordinates
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  AssetLocation,
  AssetCheckOut,
  Geofence,
  GeofenceEvent,
  Zone,
  RFIDTag,
  BLEBeacon,
  MovementHistory,
  TrackingAlert,

  // Location Tracking Functions
  trackAssetLocation,
  getCurrentAssetLocation,
  getLocationHistory,
  getAssetsInZone,

  // Check-Out/Check-In Functions
  checkOutAsset,
  checkInAsset,
  getActiveCheckOuts,
  getOverdueCheckOuts,

  // Geofence Functions
  createGeofence,
  checkGeofences,
  getGeofenceEvents,

  // Zone Management Functions
  createZone,
  getZoneHierarchy,
  updateZoneOccupancy,

  // RFID and Beacon Functions
  registerRFIDTag,
  recordRFIDRead,
  registerBLEBeacon,

  // Movement History Functions
  recordMovement,
  getMovementHistory,

  // Alert Functions
  createTrackingAlert,
  acknowledgeAlert,
  getUnacknowledgedAlerts,

  // Analytics Functions
  getTrackingAnalytics,
  getAssetMovementSummary,

  // Proximity Tracking Functions
  findNearbyAssets,
  trackAssetProximity,

  // Alert Rule Functions
  createTrackingAlertRule,
  evaluateTrackingAlerts,

  // Custody Chain Functions
  getCustodyChain,
  verifyCustodyChain,

  // Route Tracking Functions
  recordAssetRoute,
  getAssetRoutes,

  // Lost/Stolen Tracking Functions
  markAssetLost,
  markAssetRecovered,
  getLostStolenReports,
};
