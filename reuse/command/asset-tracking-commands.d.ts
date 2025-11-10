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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Tracking Method
 */
export declare enum TrackingMethod {
    GPS = "gps",
    RFID = "rfid",
    BARCODE = "barcode",
    QR_CODE = "qr_code",
    BLE_BEACON = "ble_beacon",
    NFC = "nfc",
    WIFI = "wifi",
    MANUAL = "manual"
}
/**
 * Check-Out Status
 */
export declare enum CheckOutStatus {
    CHECKED_OUT = "checked_out",
    OVERDUE = "overdue",
    CHECKED_IN = "checked_in",
    LOST = "lost",
    DAMAGED = "damaged"
}
/**
 * Movement Type
 */
export declare enum MovementType {
    CHECK_OUT = "check_out",
    CHECK_IN = "check_in",
    TRANSFER = "transfer",
    RELOCATION = "relocation",
    SHIPMENT = "shipment",
    RETURN = "return",
    DISPOSAL = "disposal"
}
/**
 * Zone Type
 */
export declare enum ZoneType {
    WAREHOUSE = "warehouse",
    BUILDING = "building",
    FLOOR = "floor",
    ROOM = "room",
    YARD = "yard",
    SECURE_AREA = "secure_area",
    STORAGE = "storage",
    CUSTOM = "custom"
}
/**
 * Geofence Status
 */
export declare enum GeofenceStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    TRIGGERED = "triggered"
}
/**
 * Alert Type
 */
export declare enum AlertType {
    GEOFENCE_ENTRY = "geofence_entry",
    GEOFENCE_EXIT = "geofence_exit",
    ASSET_MOVED = "asset_moved",
    UNAUTHORIZED_MOVEMENT = "unauthorized_movement",
    OVERDUE_RETURN = "overdue_return",
    BATTERY_LOW = "battery_low",
    TAG_REMOVED = "tag_removed"
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
    polygon?: Array<{
        latitude: number;
        longitude: number;
    }>;
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
/**
 * Asset Location Model
 */
export declare class AssetLocation extends Model {
    id: string;
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
    timestamp: Date;
    isCurrent: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    zone?: Zone;
}
/**
 * Asset Check-Out Model
 */
export declare class AssetCheckOut extends Model {
    id: string;
    assetId: string;
    checkedOutBy: string;
    checkOutDate: Date;
    checkOutLocation?: string;
    checkOutZoneId?: string;
    purpose?: string;
    expectedReturnDate?: Date;
    approvedBy?: string;
    status: CheckOutStatus;
    checkedInBy?: string;
    checkInDate?: Date;
    checkInLocation?: string;
    checkInZoneId?: string;
    condition?: string;
    damageNotes?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    checkOutZone?: Zone;
    checkInZone?: Zone;
}
/**
 * Geofence Model
 */
export declare class Geofence extends Model {
    id: string;
    name: string;
    description?: string;
    centerLatitude: number;
    centerLongitude: number;
    radiusMeters?: number;
    polygon?: Array<{
        latitude: number;
        longitude: number;
    }>;
    status: GeofenceStatus;
    alertOnEntry: boolean;
    alertOnExit: boolean;
    allowedAssets?: string[];
    notifications?: string[];
    isActive: boolean;
    triggerCount: number;
    lastTriggered?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    events?: GeofenceEvent[];
}
/**
 * Geofence Event Model
 */
export declare class GeofenceEvent extends Model {
    id: string;
    geofenceId: string;
    assetId: string;
    eventType: string;
    triggeredAt: Date;
    latitude?: number;
    longitude?: number;
    alertSent: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    geofence?: Geofence;
}
/**
 * Zone Model
 */
export declare class Zone extends Model {
    id: string;
    name: string;
    zoneType: ZoneType;
    description?: string;
    parentZoneId?: string;
    buildingId?: string;
    floor?: string;
    capacity?: number;
    currentOccupancy: number;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parentZone?: Zone;
    childZones?: Zone[];
    assetLocations?: AssetLocation[];
}
/**
 * RFID Tag Model
 */
export declare class RFIDTag extends Model {
    id: string;
    assetId: string;
    tagId: string;
    epcCode?: string;
    technology?: string;
    frequency?: string;
    batteryLevel?: number;
    isActive: boolean;
    activatedDate?: Date;
    lastReadTime?: Date;
    readCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * BLE Beacon Model
 */
export declare class BLEBeacon extends Model {
    id: string;
    beaconId: string;
    name: string;
    uuid: string;
    major: number;
    minor: number;
    zoneId?: string;
    latitude?: number;
    longitude?: number;
    batteryLevel?: number;
    isActive: boolean;
    lastDetected?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    zone?: Zone;
}
/**
 * Movement History Model
 */
export declare class MovementHistory extends Model {
    id: string;
    assetId: string;
    movementType: MovementType;
    fromLocation?: string;
    toLocation?: string;
    fromZoneId?: string;
    toZoneId?: string;
    movedBy: string;
    movementDate: Date;
    reason?: string;
    notes?: string;
    distanceMeters?: number;
    createdAt: Date;
    updatedAt: Date;
    fromZone?: Zone;
    toZone?: Zone;
}
/**
 * Tracking Alert Model
 */
export declare class TrackingAlert extends Model {
    id: string;
    assetId: string;
    alertType: AlertType;
    severity: string;
    message: string;
    triggeredAt: Date;
    location?: Record<string, any>;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    resolutionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare function trackAssetLocation(data: LocationTrackingData, transaction?: Transaction): Promise<AssetLocation>;
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
export declare function getCurrentAssetLocation(assetId: string): Promise<AssetLocation | null>;
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
export declare function getLocationHistory(assetId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<AssetLocation[]>;
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
export declare function getAssetsInZone(zoneId: string): Promise<AssetLocation[]>;
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
export declare function checkOutAsset(data: CheckOutData, transaction?: Transaction): Promise<AssetCheckOut>;
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
export declare function checkInAsset(data: CheckInData, transaction?: Transaction): Promise<AssetCheckOut>;
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
export declare function getActiveCheckOuts(userId?: string): Promise<AssetCheckOut[]>;
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
export declare function getOverdueCheckOuts(): Promise<AssetCheckOut[]>;
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
export declare function createGeofence(data: GeofenceData, transaction?: Transaction): Promise<Geofence>;
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
export declare function checkGeofences(assetId: string, latitude: number, longitude: number, transaction?: Transaction): Promise<GeofenceEvent[]>;
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
export declare function getGeofenceEvents(geofenceId: string, limit?: number): Promise<GeofenceEvent[]>;
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
export declare function createZone(data: ZoneData, transaction?: Transaction): Promise<Zone>;
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
export declare function getZoneHierarchy(zoneId: string): Promise<Zone | null>;
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
export declare function updateZoneOccupancy(zoneId: string, change: number, transaction?: Transaction): Promise<Zone>;
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
export declare function registerRFIDTag(data: RFIDTagData, transaction?: Transaction): Promise<RFIDTag>;
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
export declare function recordRFIDRead(tagId: string, transaction?: Transaction): Promise<RFIDTag>;
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
export declare function registerBLEBeacon(data: BeaconData, transaction?: Transaction): Promise<BLEBeacon>;
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
export declare function recordMovement(data: MovementHistoryData, transaction?: Transaction): Promise<MovementHistory>;
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
export declare function getMovementHistory(assetId: string, limit?: number): Promise<MovementHistory[]>;
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
export declare function createTrackingAlert(data: {
    assetId: string;
    alertType: AlertType;
    severity: string;
    message: string;
    location?: Record<string, any>;
}, transaction?: Transaction): Promise<TrackingAlert>;
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
export declare function acknowledgeAlert(alertId: string, userId: string, notes?: string, transaction?: Transaction): Promise<TrackingAlert>;
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
export declare function getUnacknowledgedAlerts(assetId?: string): Promise<TrackingAlert[]>;
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
export declare function getTrackingAnalytics(startDate: Date, endDate: Date): Promise<Record<string, any>>;
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
export declare function getAssetMovementSummary(assetId: string, period?: number): Promise<Record<string, any>>;
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
export declare function findNearbyAssets(assetId: string, radiusMeters: number): Promise<Record<string, any>[]>;
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
export declare function trackAssetProximity(assetId1: string, assetId2: string, transaction?: Transaction): Promise<Record<string, any>>;
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
export declare function createTrackingAlertRule(assetId: string, alertType: string, conditions: Record<string, any>, transaction?: Transaction): Promise<TrackingAlert>;
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
export declare function evaluateTrackingAlerts(assetId: string, transaction?: Transaction): Promise<TrackingAlert[]>;
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
export declare function getCustodyChain(assetId: string): Promise<Record<string, any>[]>;
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
export declare function verifyCustodyChain(assetId: string): Promise<boolean>;
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
export declare function recordAssetRoute(assetId: string, waypoints: Array<{
    latitude: number;
    longitude: number;
    timestamp: Date;
}>, transaction?: Transaction): Promise<Record<string, any>>;
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
export declare function getAssetRoutes(assetId: string, startDate: Date, endDate: Date): Promise<Record<string, any>[]>;
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
export declare function markAssetLost(assetId: string, reportedBy: string, details: string, transaction?: Transaction): Promise<boolean>;
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
export declare function markAssetRecovered(assetId: string, recoveredBy: string, recoveryLocation: Record<string, any>, transaction?: Transaction): Promise<boolean>;
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
export declare function getLostStolenReports(status?: string): Promise<Record<string, any>[]>;
declare const _default: {
    AssetLocation: typeof AssetLocation;
    AssetCheckOut: typeof AssetCheckOut;
    Geofence: typeof Geofence;
    GeofenceEvent: typeof GeofenceEvent;
    Zone: typeof Zone;
    RFIDTag: typeof RFIDTag;
    BLEBeacon: typeof BLEBeacon;
    MovementHistory: typeof MovementHistory;
    TrackingAlert: typeof TrackingAlert;
    trackAssetLocation: typeof trackAssetLocation;
    getCurrentAssetLocation: typeof getCurrentAssetLocation;
    getLocationHistory: typeof getLocationHistory;
    getAssetsInZone: typeof getAssetsInZone;
    checkOutAsset: typeof checkOutAsset;
    checkInAsset: typeof checkInAsset;
    getActiveCheckOuts: typeof getActiveCheckOuts;
    getOverdueCheckOuts: typeof getOverdueCheckOuts;
    createGeofence: typeof createGeofence;
    checkGeofences: typeof checkGeofences;
    getGeofenceEvents: typeof getGeofenceEvents;
    createZone: typeof createZone;
    getZoneHierarchy: typeof getZoneHierarchy;
    updateZoneOccupancy: typeof updateZoneOccupancy;
    registerRFIDTag: typeof registerRFIDTag;
    recordRFIDRead: typeof recordRFIDRead;
    registerBLEBeacon: typeof registerBLEBeacon;
    recordMovement: typeof recordMovement;
    getMovementHistory: typeof getMovementHistory;
    createTrackingAlert: typeof createTrackingAlert;
    acknowledgeAlert: typeof acknowledgeAlert;
    getUnacknowledgedAlerts: typeof getUnacknowledgedAlerts;
    getTrackingAnalytics: typeof getTrackingAnalytics;
    getAssetMovementSummary: typeof getAssetMovementSummary;
    findNearbyAssets: typeof findNearbyAssets;
    trackAssetProximity: typeof trackAssetProximity;
    createTrackingAlertRule: typeof createTrackingAlertRule;
    evaluateTrackingAlerts: typeof evaluateTrackingAlerts;
    getCustodyChain: typeof getCustodyChain;
    verifyCustodyChain: typeof verifyCustodyChain;
    recordAssetRoute: typeof recordAssetRoute;
    getAssetRoutes: typeof getAssetRoutes;
    markAssetLost: typeof markAssetLost;
    markAssetRecovered: typeof markAssetRecovered;
    getLostStolenReports: typeof getLostStolenReports;
};
export default _default;
//# sourceMappingURL=asset-tracking-commands.d.ts.map