/**
 * ASSET LOCATION MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset location management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive location tracking including:
 * - Location hierarchy management (facilities, buildings, floors, rooms, zones)
 * - Location assignment and real-time tracking
 * - Location capacity tracking and optimization
 * - Location-based asset searching and filtering
 * - Geofencing and boundary management
 * - GPS tracking and coordinate management
 * - Complete location history and audit trails
 * - Sublocation management and nesting
 * - Location tree structures and navigation
 * - Space utilization analytics
 * - Location-based access control
 * - Environmental conditions monitoring
 *
 * @module AssetLocationCommands
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
 *   createLocation,
 *   assignAssetToLocation,
 *   trackAssetLocation,
 *   getLocationHierarchy,
 *   LocationType
 * } from './asset-location-commands';
 *
 * // Create location
 * const location = await createLocation({
 *   locationCode: 'BLD-A-FL3-RM301',
 *   locationName: 'Building A - Floor 3 - Room 301',
 *   locationType: LocationType.ROOM,
 *   parentLocationId: 'floor-3-id',
 *   capacity: 50,
 *   gpsCoordinates: { latitude: 40.7128, longitude: -74.0060 }
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
  IsArray,
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
 * Location types
 */
export enum LocationType {
  FACILITY = 'facility',
  BUILDING = 'building',
  FLOOR = 'floor',
  WING = 'wing',
  DEPARTMENT = 'department',
  ROOM = 'room',
  ZONE = 'zone',
  STORAGE_AREA = 'storage_area',
  WAREHOUSE = 'warehouse',
  SHELF = 'shelf',
  BIN = 'bin',
  LOCKER = 'locker',
  OUTDOOR_AREA = 'outdoor_area',
  VEHICLE = 'vehicle',
  MOBILE_UNIT = 'mobile_unit',
}

/**
 * Location status
 */
export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_CONSTRUCTION = 'under_construction',
  UNDER_MAINTENANCE = 'under_maintenance',
  DECOMMISSIONED = 'decommissioned',
  TEMPORARY = 'temporary',
}

/**
 * Access level
 */
export enum AccessLevel {
  PUBLIC = 'public',
  RESTRICTED = 'restricted',
  CONFIDENTIAL = 'confidential',
  HIGHLY_RESTRICTED = 'highly_restricted',
  SECURE = 'secure',
}

/**
 * GPS coordinates
 */
export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

/**
 * Location dimensions
 */
export interface LocationDimensions {
  length?: number;
  width?: number;
  height?: number;
  area?: number;
  volume?: number;
  unit: 'feet' | 'meters' | 'square_feet' | 'square_meters' | 'cubic_feet' | 'cubic_meters';
}

/**
 * Environmental conditions
 */
export interface EnvironmentalConditions {
  temperature?: number;
  humidity?: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  isClimateControlled?: boolean;
  hasFireSuppression?: boolean;
  hasSecuritySystem?: boolean;
  hasAccessControl?: boolean;
}

/**
 * Location data
 */
export interface LocationData {
  locationCode: string;
  locationName: string;
  locationType: LocationType;
  parentLocationId?: string;
  description?: string;
  address?: Record<string, any>;
  gpsCoordinates?: GPSCoordinates;
  dimensions?: LocationDimensions;
  capacity?: number;
  accessLevel?: AccessLevel;
  environmentalConditions?: EnvironmentalConditions;
  manager?: string;
  contactInfo?: Record<string, any>;
  operatingHours?: string;
  isActive?: boolean;
}

/**
 * Asset location assignment
 */
export interface AssetLocationAssignment {
  assetId: string;
  locationId: string;
  assignedBy: string;
  assignmentDate?: Date;
  notes?: string;
  subLocation?: string;
  position?: string;
}

/**
 * Geofence definition
 */
export interface GeofenceDefinition {
  locationId: string;
  geofenceName: string;
  boundaryType: 'circle' | 'polygon' | 'rectangle';
  centerPoint?: GPSCoordinates;
  radius?: number;
  radiusUnit?: 'meters' | 'feet' | 'kilometers' | 'miles';
  polygonPoints?: GPSCoordinates[];
  rectangleBounds?: {
    northEast: GPSCoordinates;
    southWest: GPSCoordinates;
  };
  alertOnEntry?: boolean;
  alertOnExit?: boolean;
}

/**
 * Location utilization metrics
 */
export interface LocationUtilization {
  locationId: string;
  totalCapacity: number;
  currentOccupancy: number;
  utilizationPercentage: number;
  availableSpace: number;
  assetCount: number;
  spaceByCategory: Record<string, number>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Location Model
 */
@Table({
  tableName: 'asset_locations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['location_code'], unique: true },
    { fields: ['location_type'] },
    { fields: ['parent_location_id'] },
    { fields: ['status'] },
    { fields: ['is_active'] },
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

  @ApiProperty({ description: 'Location code' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  locationCode!: string;

  @ApiProperty({ description: 'Location name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  locationName!: string;

  @ApiProperty({ description: 'Location type' })
  @Column({
    type: DataType.ENUM(...Object.values(LocationType)),
    allowNull: false,
  })
  @Index
  locationType!: LocationType;

  @ApiProperty({ description: 'Parent location ID' })
  @ForeignKey(() => AssetLocation)
  @Column({ type: DataType.UUID })
  @Index
  parentLocationId?: string;

  @ApiProperty({ description: 'Location status' })
  @Column({
    type: DataType.ENUM(...Object.values(LocationStatus)),
    defaultValue: LocationStatus.ACTIVE,
  })
  @Index
  status!: LocationStatus;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Full hierarchical path' })
  @Column({ type: DataType.STRING(1000) })
  hierarchyPath?: string;

  @ApiProperty({ description: 'Hierarchy level' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  hierarchyLevel!: number;

  @ApiProperty({ description: 'Address' })
  @Column({ type: DataType.JSONB })
  address?: Record<string, any>;

  @ApiProperty({ description: 'GPS coordinates' })
  @Column({ type: DataType.JSONB })
  gpsCoordinates?: GPSCoordinates;

  @ApiProperty({ description: 'Dimensions' })
  @Column({ type: DataType.JSONB })
  dimensions?: LocationDimensions;

  @ApiProperty({ description: 'Capacity (max assets)' })
  @Column({ type: DataType.INTEGER })
  capacity?: number;

  @ApiProperty({ description: 'Current occupancy' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  currentOccupancy!: number;

  @ApiProperty({ description: 'Access level' })
  @Column({ type: DataType.ENUM(...Object.values(AccessLevel)) })
  accessLevel?: AccessLevel;

  @ApiProperty({ description: 'Environmental conditions' })
  @Column({ type: DataType.JSONB })
  environmentalConditions?: EnvironmentalConditions;

  @ApiProperty({ description: 'Location manager user ID' })
  @Column({ type: DataType.UUID })
  manager?: string;

  @ApiProperty({ description: 'Contact information' })
  @Column({ type: DataType.JSONB })
  contactInfo?: Record<string, any>;

  @ApiProperty({ description: 'Operating hours' })
  @Column({ type: DataType.STRING(500) })
  operatingHours?: string;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Custom fields' })
  @Column({ type: DataType.JSONB })
  customFields?: Record<string, any>;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => AssetLocation)
  parentLocation?: AssetLocation;

  @HasMany(() => AssetLocation)
  childLocations?: AssetLocation[];

  @HasMany(() => AssetLocationHistory)
  locationHistory?: AssetLocationHistory[];

  @HasMany(() => LocationGeofence)
  geofences?: LocationGeofence[];
}

/**
 * Asset Location History Model
 */
@Table({
  tableName: 'asset_location_history',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['location_id'] },
    { fields: ['assigned_date'] },
    { fields: ['removed_date'] },
  ],
})
export class AssetLocationHistory extends Model {
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

  @ApiProperty({ description: 'Location ID' })
  @ForeignKey(() => AssetLocation)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  locationId!: string;

  @ApiProperty({ description: 'Sub-location detail' })
  @Column({ type: DataType.STRING(200) })
  subLocation?: string;

  @ApiProperty({ description: 'Position within location' })
  @Column({ type: DataType.STRING(200) })
  position?: string;

  @ApiProperty({ description: 'Assigned by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  assignedBy!: string;

  @ApiProperty({ description: 'Assigned date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  assignedDate!: Date;

  @ApiProperty({ description: 'Removed date' })
  @Column({ type: DataType.DATE })
  @Index
  removedDate?: Date;

  @ApiProperty({ description: 'Removal reason' })
  @Column({ type: DataType.TEXT })
  removalReason?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Is current location' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isCurrent!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => AssetLocation)
  location?: AssetLocation;
}

/**
 * Location Geofence Model
 */
@Table({
  tableName: 'location_geofences',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['location_id'] },
    { fields: ['geofence_name'] },
    { fields: ['is_active'] },
  ],
})
export class LocationGeofence extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Location ID' })
  @ForeignKey(() => AssetLocation)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  locationId!: string;

  @ApiProperty({ description: 'Geofence name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  geofenceName!: string;

  @ApiProperty({ description: 'Boundary type' })
  @Column({
    type: DataType.ENUM('circle', 'polygon', 'rectangle'),
    allowNull: false,
  })
  boundaryType!: 'circle' | 'polygon' | 'rectangle';

  @ApiProperty({ description: 'Center point (for circle)' })
  @Column({ type: DataType.JSONB })
  centerPoint?: GPSCoordinates;

  @ApiProperty({ description: 'Radius (for circle)' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  radius?: number;

  @ApiProperty({ description: 'Radius unit' })
  @Column({ type: DataType.ENUM('meters', 'feet', 'kilometers', 'miles') })
  radiusUnit?: string;

  @ApiProperty({ description: 'Polygon points' })
  @Column({ type: DataType.JSONB })
  polygonPoints?: GPSCoordinates[];

  @ApiProperty({ description: 'Rectangle bounds' })
  @Column({ type: DataType.JSONB })
  rectangleBounds?: {
    northEast: GPSCoordinates;
    southWest: GPSCoordinates;
  };

  @ApiProperty({ description: 'Alert on entry' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alertOnEntry!: boolean;

  @ApiProperty({ description: 'Alert on exit' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  alertOnExit!: boolean;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => AssetLocation)
  location?: AssetLocation;
}

/**
 * GPS Tracking Log Model
 */
@Table({
  tableName: 'gps_tracking_logs',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['tracked_at'] },
  ],
})
export class GPSTrackingLog extends Model {
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

  @ApiProperty({ description: 'GPS coordinates' })
  @Column({ type: DataType.JSONB, allowNull: false })
  coordinates!: GPSCoordinates;

  @ApiProperty({ description: 'Tracked at' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  trackedAt!: Date;

  @ApiProperty({ description: 'Speed (if available)' })
  @Column({ type: DataType.DECIMAL(10, 2) })
  speed?: number;

  @ApiProperty({ description: 'Heading/direction (degrees)' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  heading?: number;

  @ApiProperty({ description: 'Battery level (percentage)' })
  @Column({ type: DataType.INTEGER })
  batteryLevel?: number;

  @ApiProperty({ description: 'Signal strength' })
  @Column({ type: DataType.INTEGER })
  signalStrength?: number;

  @ApiProperty({ description: 'Tracking source' })
  @Column({ type: DataType.STRING(100) })
  trackingSource?: string;

  @CreatedAt
  createdAt!: Date;
}

// ============================================================================
// LOCATION MANAGEMENT
// ============================================================================

/**
 * Creates a new location
 *
 * @param data - Location data
 * @param transaction - Optional database transaction
 * @returns Created location
 *
 * @example
 * ```typescript
 * const location = await createLocation({
 *   locationCode: 'BLD-A-FL2',
 *   locationName: 'Building A - Floor 2',
 *   locationType: LocationType.FLOOR,
 *   parentLocationId: 'building-a-id',
 *   capacity: 100,
 *   accessLevel: AccessLevel.RESTRICTED
 * });
 * ```
 */
export async function createLocation(
  data: LocationData,
  transaction?: Transaction,
): Promise<AssetLocation> {
  // Check for duplicate location code
  const existing = await AssetLocation.findOne({
    where: { locationCode: data.locationCode },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Location code ${data.locationCode} already exists`);
  }

  // Validate parent location if specified
  let hierarchyPath = data.locationCode;
  let hierarchyLevel = 0;

  if (data.parentLocationId) {
    const parent = await AssetLocation.findByPk(data.parentLocationId, { transaction });
    if (!parent) {
      throw new NotFoundException(`Parent location ${data.parentLocationId} not found`);
    }

    hierarchyPath = `${parent.hierarchyPath}/${data.locationCode}`;
    hierarchyLevel = parent.hierarchyLevel + 1;
  }

  const location = await AssetLocation.create(
    {
      ...data,
      hierarchyPath,
      hierarchyLevel,
      status: LocationStatus.ACTIVE,
      currentOccupancy: 0,
      isActive: data.isActive !== false,
    },
    { transaction },
  );

  return location;
}

/**
 * Updates location details
 *
 * @param locationId - Location ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated location
 *
 * @example
 * ```typescript
 * await updateLocation('loc-123', {
 *   capacity: 150,
 *   manager: 'user-001',
 *   environmentalConditions: {
 *     temperature: 72,
 *     humidity: 45,
 *     isClimateControlled: true
 *   }
 * });
 * ```
 */
export async function updateLocation(
  locationId: string,
  updates: Partial<LocationData>,
  transaction?: Transaction,
): Promise<AssetLocation> {
  const location = await AssetLocation.findByPk(locationId, { transaction });
  if (!location) {
    throw new NotFoundException(`Location ${locationId} not found`);
  }

  // If parent is being changed, update hierarchy
  if (updates.parentLocationId !== undefined) {
    if (updates.parentLocationId) {
      const parent = await AssetLocation.findByPk(updates.parentLocationId, { transaction });
      if (!parent) {
        throw new NotFoundException(`Parent location ${updates.parentLocationId} not found`);
      }

      updates['hierarchyPath'] = `${parent.hierarchyPath}/${location.locationCode}`;
      updates['hierarchyLevel'] = parent.hierarchyLevel + 1;
    } else {
      updates['hierarchyPath'] = location.locationCode;
      updates['hierarchyLevel'] = 0;
    }
  }

  await location.update(updates, { transaction });
  return location;
}

/**
 * Gets location by ID with full details
 *
 * @param locationId - Location ID
 * @param includeChildren - Whether to include child locations
 * @returns Location details
 *
 * @example
 * ```typescript
 * const location = await getLocationById('loc-123', true);
 * ```
 */
export async function getLocationById(
  locationId: string,
  includeChildren: boolean = false,
): Promise<AssetLocation> {
  const include = includeChildren
    ? [
        { model: AssetLocation, as: 'parentLocation' },
        { model: AssetLocation, as: 'childLocations' },
        { model: LocationGeofence, as: 'geofences' },
      ]
    : [{ model: AssetLocation, as: 'parentLocation' }];

  const location = await AssetLocation.findByPk(locationId, { include });
  if (!location) {
    throw new NotFoundException(`Location ${locationId} not found`);
  }

  return location;
}

/**
 * Gets complete location hierarchy from root
 *
 * @param rootLocationId - Optional root location ID (if not provided, gets all top-level)
 * @returns Location hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = await getLocationHierarchy('facility-001');
 * ```
 */
export async function getLocationHierarchy(
  rootLocationId?: string,
): Promise<AssetLocation[]> {
  const where: WhereOptions = { isActive: true };

  if (rootLocationId) {
    where.id = rootLocationId;
  } else {
    where.parentLocationId = null;
  }

  const locations = await AssetLocation.findAll({
    where,
    include: [
      {
        model: AssetLocation,
        as: 'childLocations',
        include: [
          {
            model: AssetLocation,
            as: 'childLocations',
            include: [
              {
                model: AssetLocation,
                as: 'childLocations',
              },
            ],
          },
        ],
      },
    ],
    order: [['locationName', 'ASC']],
  });

  return locations;
}

/**
 * Gets all child locations recursively
 *
 * @param parentLocationId - Parent location ID
 * @returns All descendant locations
 *
 * @example
 * ```typescript
 * const children = await getAllChildLocations('building-a');
 * ```
 */
export async function getAllChildLocations(
  parentLocationId: string,
): Promise<AssetLocation[]> {
  const parent = await AssetLocation.findByPk(parentLocationId);
  if (!parent) {
    throw new NotFoundException(`Location ${parentLocationId} not found`);
  }

  return AssetLocation.findAll({
    where: {
      hierarchyPath: {
        [Op.like]: `${parent.hierarchyPath}/%`,
      },
      isActive: true,
    },
    order: [['hierarchyLevel', 'ASC'], ['locationName', 'ASC']],
  });
}

/**
 * Searches locations with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered locations
 *
 * @example
 * ```typescript
 * const locations = await searchLocations({
 *   locationType: LocationType.ROOM,
 *   status: LocationStatus.ACTIVE,
 *   minCapacity: 50
 * });
 * ```
 */
export async function searchLocations(
  filters: {
    locationType?: LocationType | LocationType[];
    status?: LocationStatus;
    parentLocationId?: string;
    accessLevel?: AccessLevel;
    minCapacity?: number;
    maxCapacity?: number;
    hasGPS?: boolean;
    searchTerm?: string;
  },
  options: FindOptions = {},
): Promise<{ locations: AssetLocation[]; total: number }> {
  const where: WhereOptions = { isActive: true };

  if (filters.locationType) {
    where.locationType = Array.isArray(filters.locationType)
      ? { [Op.in]: filters.locationType }
      : filters.locationType;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.parentLocationId) {
    where.parentLocationId = filters.parentLocationId;
  }

  if (filters.accessLevel) {
    where.accessLevel = filters.accessLevel;
  }

  if (filters.minCapacity !== undefined || filters.maxCapacity !== undefined) {
    where.capacity = {};
    if (filters.minCapacity !== undefined) {
      (where.capacity as any)[Op.gte] = filters.minCapacity;
    }
    if (filters.maxCapacity !== undefined) {
      (where.capacity as any)[Op.lte] = filters.maxCapacity;
    }
  }

  if (filters.hasGPS) {
    where.gpsCoordinates = { [Op.ne]: null };
  }

  if (filters.searchTerm) {
    where[Op.or] = [
      { locationCode: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { locationName: { [Op.iLike]: `%${filters.searchTerm}%` } },
      { description: { [Op.iLike]: `%${filters.searchTerm}%` } },
    ];
  }

  const { rows: locations, count: total } = await AssetLocation.findAndCountAll({
    where,
    ...options,
  });

  return { locations, total };
}

// ============================================================================
// ASSET LOCATION ASSIGNMENT
// ============================================================================

/**
 * Assigns asset to location
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Location history record
 *
 * @example
 * ```typescript
 * await assignAssetToLocation({
 *   assetId: 'asset-123',
 *   locationId: 'loc-456',
 *   assignedBy: 'user-001',
 *   subLocation: 'Shelf 3B',
 *   position: 'Row 5, Slot 12'
 * });
 * ```
 */
export async function assignAssetToLocation(
  data: AssetLocationAssignment,
  transaction?: Transaction,
): Promise<AssetLocationHistory> {
  const location = await AssetLocation.findByPk(data.locationId, { transaction });
  if (!location) {
    throw new NotFoundException(`Location ${data.locationId} not found`);
  }

  // Check capacity
  if (location.capacity && location.currentOccupancy >= location.capacity) {
    throw new BadRequestException(`Location ${location.locationName} is at full capacity`);
  }

  // Mark previous location assignment as no longer current
  await AssetLocationHistory.update(
    { isCurrent: false, removedDate: new Date() },
    {
      where: {
        assetId: data.assetId,
        isCurrent: true,
      },
      transaction,
    },
  );

  // Create new location history
  const history = await AssetLocationHistory.create(
    {
      assetId: data.assetId,
      locationId: data.locationId,
      subLocation: data.subLocation,
      position: data.position,
      assignedBy: data.assignedBy,
      assignedDate: data.assignmentDate || new Date(),
      notes: data.notes,
      isCurrent: true,
    },
    { transaction },
  );

  // Update location occupancy
  await location.increment('currentOccupancy', { by: 1, transaction });

  return history;
}

/**
 * Removes asset from location
 *
 * @param assetId - Asset ID
 * @param removedBy - User ID
 * @param reason - Removal reason
 * @param transaction - Optional database transaction
 * @returns Updated history record
 *
 * @example
 * ```typescript
 * await removeAssetFromLocation('asset-123', 'user-001', 'Asset transferred');
 * ```
 */
export async function removeAssetFromLocation(
  assetId: string,
  removedBy: string,
  reason?: string,
  transaction?: Transaction,
): Promise<AssetLocationHistory | null> {
  const currentHistory = await AssetLocationHistory.findOne({
    where: {
      assetId,
      isCurrent: true,
    },
    transaction,
  });

  if (!currentHistory) {
    return null;
  }

  await currentHistory.update(
    {
      isCurrent: false,
      removedDate: new Date(),
      removalReason: reason,
    },
    { transaction },
  );

  // Update location occupancy
  const location = await AssetLocation.findByPk(currentHistory.locationId, { transaction });
  if (location) {
    await location.decrement('currentOccupancy', { by: 1, transaction });
  }

  return currentHistory;
}

/**
 * Gets current location for asset
 *
 * @param assetId - Asset ID
 * @returns Current location or null
 *
 * @example
 * ```typescript
 * const location = await getCurrentAssetLocation('asset-123');
 * ```
 */
export async function getCurrentAssetLocation(
  assetId: string,
): Promise<AssetLocation | null> {
  const history = await AssetLocationHistory.findOne({
    where: {
      assetId,
      isCurrent: true,
    },
    include: [{ model: AssetLocation, as: 'location' }],
  });

  return history?.location || null;
}

/**
 * Gets location history for asset
 *
 * @param assetId - Asset ID
 * @param limit - Maximum records to return
 * @returns Location history
 *
 * @example
 * ```typescript
 * const history = await getAssetLocationHistory('asset-123', 10);
 * ```
 */
export async function getAssetLocationHistory(
  assetId: string,
  limit: number = 50,
): Promise<AssetLocationHistory[]> {
  return AssetLocationHistory.findAll({
    where: { assetId },
    include: [{ model: AssetLocation, as: 'location' }],
    order: [['assignedDate', 'DESC']],
    limit,
  });
}

/**
 * Gets all assets in location
 *
 * @param locationId - Location ID
 * @param includeSublocations - Whether to include child locations
 * @returns Asset IDs in location
 *
 * @example
 * ```typescript
 * const assetIds = await getAssetsInLocation('loc-123', true);
 * ```
 */
export async function getAssetsInLocation(
  locationId: string,
  includeSublocations: boolean = false,
): Promise<string[]> {
  const where: WhereOptions = { isCurrent: true };

  if (includeSublocations) {
    const location = await AssetLocation.findByPk(locationId);
    if (!location) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }

    // Get all child locations
    const childLocations = await AssetLocation.findAll({
      where: {
        [Op.or]: [
          { id: locationId },
          { hierarchyPath: { [Op.like]: `${location.hierarchyPath}/%` } },
        ],
      },
    });

    const locationIds = childLocations.map((l) => l.id);
    where.locationId = { [Op.in]: locationIds };
  } else {
    where.locationId = locationId;
  }

  const histories = await AssetLocationHistory.findAll({
    where,
    attributes: ['assetId'],
  });

  return histories.map((h) => h.assetId);
}

// ============================================================================
// LOCATION CAPACITY AND UTILIZATION
// ============================================================================

/**
 * Calculates location utilization
 *
 * @param locationId - Location ID
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await calculateLocationUtilization('loc-123');
 * ```
 */
export async function calculateLocationUtilization(
  locationId: string,
): Promise<LocationUtilization> {
  const location = await AssetLocation.findByPk(locationId);
  if (!location) {
    throw new NotFoundException(`Location ${locationId} not found`);
  }

  const totalCapacity = location.capacity || 0;
  const currentOccupancy = location.currentOccupancy;
  const availableSpace = Math.max(0, totalCapacity - currentOccupancy);
  const utilizationPercentage = totalCapacity > 0 ? (currentOccupancy / totalCapacity) * 100 : 0;

  // Get asset count (more accurate than occupancy)
  const assetIds = await getAssetsInLocation(locationId, false);
  const assetCount = assetIds.length;

  return {
    locationId,
    totalCapacity,
    currentOccupancy,
    utilizationPercentage,
    availableSpace,
    assetCount,
    spaceByCategory: {}, // Would be populated with actual asset type breakdown
  };
}

/**
 * Finds available locations with capacity
 *
 * @param minCapacity - Minimum available capacity needed
 * @param locationType - Optional location type filter
 * @returns Available locations
 *
 * @example
 * ```typescript
 * const available = await findAvailableLocations(10, LocationType.ROOM);
 * ```
 */
export async function findAvailableLocations(
  minCapacity: number,
  locationType?: LocationType,
): Promise<AssetLocation[]> {
  const where: WhereOptions = {
    isActive: true,
    status: LocationStatus.ACTIVE,
  };

  if (locationType) {
    where.locationType = locationType;
  }

  const locations = await AssetLocation.findAll({ where });

  // Filter by available capacity
  return locations.filter((loc) => {
    if (!loc.capacity) return false;
    const available = loc.capacity - loc.currentOccupancy;
    return available >= minCapacity;
  });
}

/**
 * Optimizes asset placement across locations
 *
 * @param locationIds - Locations to optimize
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await optimizeLocationUtilization(['loc-1', 'loc-2']);
 * ```
 */
export async function optimizeLocationUtilization(
  locationIds: string[],
): Promise<Array<{
  locationId: string;
  currentUtilization: number;
  recommendation: string;
  suggestedActions: string[];
}>> {
  const recommendations = [];

  for (const locationId of locationIds) {
    const utilization = await calculateLocationUtilization(locationId);
    const location = await AssetLocation.findByPk(locationId);

    let recommendation = '';
    const suggestedActions: string[] = [];

    if (utilization.utilizationPercentage >= 90) {
      recommendation = 'Over-utilized - consider expanding or redistributing assets';
      suggestedActions.push('Review asset necessity in this location');
      suggestedActions.push('Consider moving some assets to nearby locations');
      suggestedActions.push('Evaluate capacity expansion options');
    } else if (utilization.utilizationPercentage >= 70) {
      recommendation = 'Well-utilized - monitor for future capacity needs';
      suggestedActions.push('Plan for potential capacity needs');
    } else if (utilization.utilizationPercentage <= 30) {
      recommendation = 'Under-utilized - consider consolidation opportunities';
      suggestedActions.push('Evaluate potential for asset consolidation');
      suggestedActions.push('Consider repurposing this space');
    } else {
      recommendation = 'Optimal utilization';
    }

    recommendations.push({
      locationId,
      currentUtilization: utilization.utilizationPercentage,
      recommendation,
      suggestedActions,
    });
  }

  return recommendations;
}

// ============================================================================
// GPS TRACKING AND GEOFENCING
// ============================================================================

/**
 * Records GPS tracking point
 *
 * @param assetId - Asset ID
 * @param coordinates - GPS coordinates
 * @param additionalData - Optional additional tracking data
 * @param transaction - Optional database transaction
 * @returns Tracking log entry
 *
 * @example
 * ```typescript
 * await recordGPSTracking('asset-123', {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10
 * }, {
 *   speed: 45,
 *   heading: 180,
 *   batteryLevel: 85
 * });
 * ```
 */
export async function recordGPSTracking(
  assetId: string,
  coordinates: GPSCoordinates,
  additionalData?: {
    speed?: number;
    heading?: number;
    batteryLevel?: number;
    signalStrength?: number;
    trackingSource?: string;
  },
  transaction?: Transaction,
): Promise<GPSTrackingLog> {
  return GPSTrackingLog.create(
    {
      assetId,
      coordinates,
      trackedAt: new Date(),
      ...additionalData,
    },
    { transaction },
  );
}

/**
 * Gets GPS tracking history
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param limit - Maximum records
 * @returns GPS tracking history
 *
 * @example
 * ```typescript
 * const history = await getGPSTrackingHistory(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   100
 * );
 * ```
 */
export async function getGPSTrackingHistory(
  assetId: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 100,
): Promise<GPSTrackingLog[]> {
  const where: WhereOptions = { assetId };

  if (startDate || endDate) {
    where.trackedAt = {};
    if (startDate) {
      (where.trackedAt as any)[Op.gte] = startDate;
    }
    if (endDate) {
      (where.trackedAt as any)[Op.lte] = endDate;
    }
  }

  return GPSTrackingLog.findAll({
    where,
    order: [['trackedAt', 'DESC']],
    limit,
  });
}

/**
 * Creates geofence for location
 *
 * @param data - Geofence definition
 * @param transaction - Optional database transaction
 * @returns Created geofence
 *
 * @example
 * ```typescript
 * await createLocationGeofence({
 *   locationId: 'loc-123',
 *   geofenceName: 'Main Campus Perimeter',
 *   boundaryType: 'circle',
 *   centerPoint: { latitude: 40.7128, longitude: -74.0060 },
 *   radius: 500,
 *   radiusUnit: 'meters',
 *   alertOnExit: true
 * });
 * ```
 */
export async function createLocationGeofence(
  data: GeofenceDefinition,
  transaction?: Transaction,
): Promise<LocationGeofence> {
  const location = await AssetLocation.findByPk(data.locationId, { transaction });
  if (!location) {
    throw new NotFoundException(`Location ${data.locationId} not found`);
  }

  return LocationGeofence.create(
    {
      ...data,
      isActive: true,
    },
    { transaction },
  );
}

/**
 * Checks if coordinates are within geofence
 *
 * @param geofenceId - Geofence ID
 * @param coordinates - GPS coordinates to check
 * @returns Whether coordinates are within geofence
 *
 * @example
 * ```typescript
 * const isInside = await isWithinGeofence('geofence-123', {
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * });
 * ```
 */
export async function isWithinGeofence(
  geofenceId: string,
  coordinates: GPSCoordinates,
): Promise<boolean> {
  const geofence = await LocationGeofence.findByPk(geofenceId);
  if (!geofence || !geofence.isActive) {
    return false;
  }

  switch (geofence.boundaryType) {
    case 'circle':
      return isWithinCircle(
        coordinates,
        geofence.centerPoint!,
        geofence.radius!,
        geofence.radiusUnit as any,
      );

    case 'polygon':
      return isWithinPolygon(coordinates, geofence.polygonPoints!);

    case 'rectangle':
      return isWithinRectangle(coordinates, geofence.rectangleBounds!);

    default:
      return false;
  }
}

/**
 * Checks if point is within circle
 */
function isWithinCircle(
  point: GPSCoordinates,
  center: GPSCoordinates,
  radius: number,
  unit: 'meters' | 'feet' | 'kilometers' | 'miles',
): boolean {
  const distance = calculateDistance(point, center);
  const radiusInMeters = convertToMeters(radius, unit);
  return distance <= radiusInMeters;
}

/**
 * Checks if point is within polygon
 */
function isWithinPolygon(point: GPSCoordinates, polygon: GPSCoordinates[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;

    const intersect =
      yi > point.latitude !== yj > point.latitude &&
      point.longitude < ((xj - xi) * (point.latitude - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Checks if point is within rectangle
 */
function isWithinRectangle(
  point: GPSCoordinates,
  bounds: { northEast: GPSCoordinates; southWest: GPSCoordinates },
): boolean {
  return (
    point.latitude <= bounds.northEast.latitude &&
    point.latitude >= bounds.southWest.latitude &&
    point.longitude <= bounds.northEast.longitude &&
    point.longitude >= bounds.southWest.longitude
  );
}

/**
 * Calculates distance between two GPS coordinates in meters
 */
function calculateDistance(point1: GPSCoordinates, point2: GPSCoordinates): number {
  const R = 6371000; // Earth's radius in meters
  const lat1 = (point1.latitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;
  const deltaLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const deltaLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Converts distance to meters
 */
function convertToMeters(
  distance: number,
  unit: 'meters' | 'feet' | 'kilometers' | 'miles',
): number {
  switch (unit) {
    case 'meters':
      return distance;
    case 'feet':
      return distance * 0.3048;
    case 'kilometers':
      return distance * 1000;
    case 'miles':
      return distance * 1609.34;
    default:
      return distance;
  }
}

/**
 * Gets geofence violations for asset
 *
 * @param assetId - Asset ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Geofence violations
 *
 * @example
 * ```typescript
 * const violations = await getGeofenceViolations(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export async function getGeofenceViolations(
  assetId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<Array<{
  timestamp: Date;
  geofence: LocationGeofence;
  coordinates: GPSCoordinates;
  violationType: 'unauthorized_entry' | 'unauthorized_exit';
}>> {
  // Get GPS tracking history
  const trackingHistory = await getGPSTrackingHistory(assetId, startDate, endDate, 1000);

  // Get all active geofences
  const geofences = await LocationGeofence.findAll({
    where: { isActive: true },
  });

  const violations: Array<{
    timestamp: Date;
    geofence: LocationGeofence;
    coordinates: GPSCoordinates;
    violationType: 'unauthorized_entry' | 'unauthorized_exit';
  }> = [];

  // Check each tracking point against geofences
  for (let i = 1; i < trackingHistory.length; i++) {
    const current = trackingHistory[i];
    const previous = trackingHistory[i - 1];

    for (const geofence of geofences) {
      const wasInside = await isWithinGeofence(geofence.id, previous.coordinates);
      const isInside = await isWithinGeofence(geofence.id, current.coordinates);

      // Entry violation
      if (!wasInside && isInside && geofence.alertOnEntry) {
        violations.push({
          timestamp: current.trackedAt,
          geofence,
          coordinates: current.coordinates,
          violationType: 'unauthorized_entry',
        });
      }

      // Exit violation
      if (wasInside && !isInside && geofence.alertOnExit) {
        violations.push({
          timestamp: current.trackedAt,
          geofence,
          coordinates: current.coordinates,
          violationType: 'unauthorized_exit',
        });
      }
    }
  }

  return violations;
}

// ============================================================================
// REPORTING AND ANALYTICS
// ============================================================================

/**
 * Generates location utilization report
 *
 * @param locationId - Optional location ID (if not provided, reports all)
 * @returns Utilization report
 *
 * @example
 * ```typescript
 * const report = await generateLocationUtilizationReport();
 * ```
 */
export async function generateLocationUtilizationReport(
  locationId?: string,
): Promise<{
  totalLocations: number;
  byType: Record<LocationType, { count: number; avgUtilization: number }>;
  overUtilized: AssetLocation[];
  underUtilized: AssetLocation[];
  optimal: AssetLocation[];
}> {
  const where: WhereOptions = { isActive: true };
  if (locationId) {
    where.id = locationId;
  }

  const locations = await AssetLocation.findAll({ where });

  const byType: Record<string, { count: number; totalUtilization: number; avgUtilization: number }> = {};
  const overUtilized: AssetLocation[] = [];
  const underUtilized: AssetLocation[] = [];
  const optimal: AssetLocation[] = [];

  for (const location of locations) {
    // Initialize type stats
    if (!byType[location.locationType]) {
      byType[location.locationType] = { count: 0, totalUtilization: 0, avgUtilization: 0 };
    }

    const utilization = location.capacity
      ? (location.currentOccupancy / location.capacity) * 100
      : 0;

    byType[location.locationType].count++;
    byType[location.locationType].totalUtilization += utilization;

    // Categorize by utilization
    if (utilization >= 90) {
      overUtilized.push(location);
    } else if (utilization <= 30) {
      underUtilized.push(location);
    } else {
      optimal.push(location);
    }
  }

  // Calculate averages
  Object.keys(byType).forEach((type) => {
    byType[type].avgUtilization = byType[type].totalUtilization / byType[type].count;
  });

  return {
    totalLocations: locations.length,
    byType: byType as any,
    overUtilized,
    underUtilized,
    optimal,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  AssetLocation,
  AssetLocationHistory,
  LocationGeofence,
  GPSTrackingLog,

  // Location Management
  createLocation,
  updateLocation,
  getLocationById,
  getLocationHierarchy,
  getAllChildLocations,
  searchLocations,

  // Asset Location Assignment
  assignAssetToLocation,
  removeAssetFromLocation,
  getCurrentAssetLocation,
  getAssetLocationHistory,
  getAssetsInLocation,

  // Capacity and Utilization
  calculateLocationUtilization,
  findAvailableLocations,
  optimizeLocationUtilization,

  // GPS Tracking
  recordGPSTracking,
  getGPSTrackingHistory,

  // Geofencing
  createLocationGeofence,
  isWithinGeofence,
  getGeofenceViolations,

  // Reporting
  generateLocationUtilizationReport,
};
