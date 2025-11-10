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
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Location types
 */
export declare enum LocationType {
    FACILITY = "facility",
    BUILDING = "building",
    FLOOR = "floor",
    WING = "wing",
    DEPARTMENT = "department",
    ROOM = "room",
    ZONE = "zone",
    STORAGE_AREA = "storage_area",
    WAREHOUSE = "warehouse",
    SHELF = "shelf",
    BIN = "bin",
    LOCKER = "locker",
    OUTDOOR_AREA = "outdoor_area",
    VEHICLE = "vehicle",
    MOBILE_UNIT = "mobile_unit"
}
/**
 * Location status
 */
export declare enum LocationStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    UNDER_CONSTRUCTION = "under_construction",
    UNDER_MAINTENANCE = "under_maintenance",
    DECOMMISSIONED = "decommissioned",
    TEMPORARY = "temporary"
}
/**
 * Access level
 */
export declare enum AccessLevel {
    PUBLIC = "public",
    RESTRICTED = "restricted",
    CONFIDENTIAL = "confidential",
    HIGHLY_RESTRICTED = "highly_restricted",
    SECURE = "secure"
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
/**
 * Location Model
 */
export declare class AssetLocation extends Model {
    id: string;
    locationCode: string;
    locationName: string;
    locationType: LocationType;
    parentLocationId?: string;
    status: LocationStatus;
    description?: string;
    hierarchyPath?: string;
    hierarchyLevel: number;
    address?: Record<string, any>;
    gpsCoordinates?: GPSCoordinates;
    dimensions?: LocationDimensions;
    capacity?: number;
    currentOccupancy: number;
    accessLevel?: AccessLevel;
    environmentalConditions?: EnvironmentalConditions;
    manager?: string;
    contactInfo?: Record<string, any>;
    operatingHours?: string;
    isActive: boolean;
    customFields?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parentLocation?: AssetLocation;
    childLocations?: AssetLocation[];
    locationHistory?: AssetLocationHistory[];
    geofences?: LocationGeofence[];
}
/**
 * Asset Location History Model
 */
export declare class AssetLocationHistory extends Model {
    id: string;
    assetId: string;
    locationId: string;
    subLocation?: string;
    position?: string;
    assignedBy: string;
    assignedDate: Date;
    removedDate?: Date;
    removalReason?: string;
    notes?: string;
    isCurrent: boolean;
    createdAt: Date;
    updatedAt: Date;
    location?: AssetLocation;
}
/**
 * Location Geofence Model
 */
export declare class LocationGeofence extends Model {
    id: string;
    locationId: string;
    geofenceName: string;
    boundaryType: 'circle' | 'polygon' | 'rectangle';
    centerPoint?: GPSCoordinates;
    radius?: number;
    radiusUnit?: string;
    polygonPoints?: GPSCoordinates[];
    rectangleBounds?: {
        northEast: GPSCoordinates;
        southWest: GPSCoordinates;
    };
    alertOnEntry: boolean;
    alertOnExit: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    location?: AssetLocation;
}
/**
 * GPS Tracking Log Model
 */
export declare class GPSTrackingLog extends Model {
    id: string;
    assetId: string;
    coordinates: GPSCoordinates;
    trackedAt: Date;
    speed?: number;
    heading?: number;
    batteryLevel?: number;
    signalStrength?: number;
    trackingSource?: string;
    createdAt: Date;
}
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
export declare function createLocation(data: LocationData, transaction?: Transaction): Promise<AssetLocation>;
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
export declare function updateLocation(locationId: string, updates: Partial<LocationData>, transaction?: Transaction): Promise<AssetLocation>;
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
export declare function getLocationById(locationId: string, includeChildren?: boolean): Promise<AssetLocation>;
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
export declare function getLocationHierarchy(rootLocationId?: string): Promise<AssetLocation[]>;
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
export declare function getAllChildLocations(parentLocationId: string): Promise<AssetLocation[]>;
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
export declare function searchLocations(filters: {
    locationType?: LocationType | LocationType[];
    status?: LocationStatus;
    parentLocationId?: string;
    accessLevel?: AccessLevel;
    minCapacity?: number;
    maxCapacity?: number;
    hasGPS?: boolean;
    searchTerm?: string;
}, options?: FindOptions): Promise<{
    locations: AssetLocation[];
    total: number;
}>;
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
export declare function assignAssetToLocation(data: AssetLocationAssignment, transaction?: Transaction): Promise<AssetLocationHistory>;
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
export declare function removeAssetFromLocation(assetId: string, removedBy: string, reason?: string, transaction?: Transaction): Promise<AssetLocationHistory | null>;
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
export declare function getCurrentAssetLocation(assetId: string): Promise<AssetLocation | null>;
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
export declare function getAssetLocationHistory(assetId: string, limit?: number): Promise<AssetLocationHistory[]>;
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
export declare function getAssetsInLocation(locationId: string, includeSublocations?: boolean): Promise<string[]>;
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
export declare function calculateLocationUtilization(locationId: string): Promise<LocationUtilization>;
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
export declare function findAvailableLocations(minCapacity: number, locationType?: LocationType): Promise<AssetLocation[]>;
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
export declare function optimizeLocationUtilization(locationIds: string[]): Promise<Array<{
    locationId: string;
    currentUtilization: number;
    recommendation: string;
    suggestedActions: string[];
}>>;
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
export declare function recordGPSTracking(assetId: string, coordinates: GPSCoordinates, additionalData?: {
    speed?: number;
    heading?: number;
    batteryLevel?: number;
    signalStrength?: number;
    trackingSource?: string;
}, transaction?: Transaction): Promise<GPSTrackingLog>;
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
export declare function getGPSTrackingHistory(assetId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<GPSTrackingLog[]>;
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
export declare function createLocationGeofence(data: GeofenceDefinition, transaction?: Transaction): Promise<LocationGeofence>;
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
export declare function isWithinGeofence(geofenceId: string, coordinates: GPSCoordinates): Promise<boolean>;
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
export declare function getGeofenceViolations(assetId: string, startDate?: Date, endDate?: Date): Promise<Array<{
    timestamp: Date;
    geofence: LocationGeofence;
    coordinates: GPSCoordinates;
    violationType: 'unauthorized_entry' | 'unauthorized_exit';
}>>;
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
export declare function generateLocationUtilizationReport(locationId?: string): Promise<{
    totalLocations: number;
    byType: Record<LocationType, {
        count: number;
        avgUtilization: number;
    }>;
    overUtilized: AssetLocation[];
    underUtilized: AssetLocation[];
    optimal: AssetLocation[];
}>;
declare const _default: {
    AssetLocation: typeof AssetLocation;
    AssetLocationHistory: typeof AssetLocationHistory;
    LocationGeofence: typeof LocationGeofence;
    GPSTrackingLog: typeof GPSTrackingLog;
    createLocation: typeof createLocation;
    updateLocation: typeof updateLocation;
    getLocationById: typeof getLocationById;
    getLocationHierarchy: typeof getLocationHierarchy;
    getAllChildLocations: typeof getAllChildLocations;
    searchLocations: typeof searchLocations;
    assignAssetToLocation: typeof assignAssetToLocation;
    removeAssetFromLocation: typeof removeAssetFromLocation;
    getCurrentAssetLocation: typeof getCurrentAssetLocation;
    getAssetLocationHistory: typeof getAssetLocationHistory;
    getAssetsInLocation: typeof getAssetsInLocation;
    calculateLocationUtilization: typeof calculateLocationUtilization;
    findAvailableLocations: typeof findAvailableLocations;
    optimizeLocationUtilization: typeof optimizeLocationUtilization;
    recordGPSTracking: typeof recordGPSTracking;
    getGPSTrackingHistory: typeof getGPSTrackingHistory;
    createLocationGeofence: typeof createLocationGeofence;
    isWithinGeofence: typeof isWithinGeofence;
    getGeofenceViolations: typeof getGeofenceViolations;
    generateLocationUtilizationReport: typeof generateLocationUtilizationReport;
};
export default _default;
//# sourceMappingURL=asset-location-commands.d.ts.map