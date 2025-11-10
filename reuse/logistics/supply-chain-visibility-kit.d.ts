/**
 * LOC: SCM-VIS-001
 * File: /reuse/logistics/supply-chain-visibility-kit.ts
 *
 * UPSTREAM (imports from):
 *   - crypto
 *   - @nestjs/common
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Shipment services
 *   - Tracking controllers
 *   - Analytics engines
 *   - Real-time dashboards
 */
/**
 * Shipment status enumeration
 */
export declare enum ShipmentStatus {
    CREATED = "CREATED",
    PICKED = "PICKED",
    PACKED = "PACKED",
    SHIPPED = "SHIPPED",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    HELD = "HELD",
    EXCEPTION = "EXCEPTION",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED"
}
/**
 * Milestone type enumeration
 */
export declare enum MilestoneType {
    ORDER_PLACED = "ORDER_PLACED",
    PICK_INITIATED = "PICK_INITIATED",
    PICK_COMPLETED = "PICK_COMPLETED",
    PACK_INITIATED = "PACK_INITIATED",
    PACK_COMPLETED = "PACK_COMPLETED",
    LABEL_CREATED = "LABEL_CREATED",
    SHIPMENT_CREATED = "SHIPMENT_CREATED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERY_ATTEMPTED = "DELIVERY_ATTEMPTED",
    DELIVERED = "DELIVERED",
    EXCEPTION_OCCURRED = "EXCEPTION_OCCURRED",
    EXCEPTION_RESOLVED = "EXCEPTION_RESOLVED",
    RETURNED = "RETURNED"
}
/**
 * Exception type enumeration
 */
export declare enum ExceptionType {
    DELAY = "DELAY",
    LOST = "LOST",
    DAMAGED = "DAMAGED",
    CUSTOMS_HOLD = "CUSTOMS_HOLD",
    ADDRESS_ISSUE = "ADDRESS_ISSUE",
    WEATHER = "WEATHER",
    MECHANICAL = "MECHANICAL",
    DRIVER_UNAVAILABLE = "DRIVER_UNAVAILABLE",
    RECIPIENT_UNAVAILABLE = "RECIPIENT_UNAVAILABLE",
    RETURNED_TO_ORIGIN = "RETURNED_TO_ORIGIN",
    DOCUMENT_MISSING = "DOCUMENT_MISSING",
    DISCREPANCY = "DISCREPANCY"
}
/**
 * Location source enumeration
 */
export declare enum LocationSource {
    GPS = "GPS",
    CELL_TOWER = "CELL_TOWER",
    WIFI = "WIFI",
    GEOFENCE = "GEOFENCE",
    SCAN = "SCAN",
    MANUAL = "MANUAL",
    CARRIER_API = "CARRIER_API"
}
/**
 * Location coordinates with accuracy
 */
export interface GeoLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    timestamp: Date;
    source: LocationSource;
}
/**
 * Shipment milestone event
 */
export interface Milestone {
    milestoneId: string;
    shipmentId: string;
    type: MilestoneType;
    timestamp: Date;
    location?: GeoLocation;
    notes?: string;
    proofOfDelivery?: {
        signatureUrl?: string;
        photoUrl?: string;
        recipientName?: string;
    };
    metadata?: Record<string, any>;
}
/**
 * Real-time location update
 */
export interface LocationUpdate {
    locationUpdateId: string;
    shipmentId: string;
    location: GeoLocation;
    heading?: number;
    speed?: number;
    metadata?: Record<string, any>;
}
/**
 * Supply chain exception
 */
export interface Exception {
    exceptionId: string;
    shipmentId: string;
    type: ExceptionType;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    detectedAt: Date;
    detectedBy?: string;
    location?: GeoLocation;
    description: string;
    rootCause?: string;
    resolutionAction?: string;
    resolvedAt?: Date;
    estimatedImpact?: string;
    metadata?: Record<string, any>;
}
/**
 * Supply chain event for streaming
 */
export interface VisibilityEvent {
    eventId: string;
    eventType: 'MILESTONE' | 'LOCATION_UPDATE' | 'EXCEPTION' | 'METADATA_UPDATE';
    shipmentId: string;
    timestamp: Date;
    data: Milestone | LocationUpdate | Exception | Record<string, any>;
    processedAt?: Date;
    acknowledged?: boolean;
}
/**
 * Complete shipment object
 */
export interface Shipment {
    shipmentId: string;
    shipmentNumber: string;
    orderId: string;
    originWarehouseId: string;
    destinationFacilityId: string;
    status: ShipmentStatus;
    carrierId: string;
    carrierName: string;
    trackingNumber: string;
    estimatedDelivery: Date;
    actualDelivery?: Date;
    weight: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: 'cm' | 'in';
    };
    packageCount: number;
    currentLocation?: GeoLocation;
    milestones: Milestone[];
    locationHistory: LocationUpdate[];
    exceptions: Exception[];
    events: VisibilityEvent[];
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Event stream configuration
 */
export interface EventStreamConfig {
    shipmentId: string;
    eventTypes: string[];
    realtime: boolean;
    batchSize?: number;
    flushInterval?: number;
    includeHistory?: boolean;
}
/**
 * Visibility dashboard data
 */
export interface VisibilityDashboard {
    dashboardId: string;
    name: string;
    shipmentIds: string[];
    aggregateMetrics: {
        totalShipments: number;
        onTimeDeliveries: number;
        delayedShipments: number;
        exceptionCount: number;
        averageDeliveryTime: number;
        costPerUnit: number;
    };
    statusDistribution: Record<ShipmentStatus, number>;
    exceptionBreakdown: Record<ExceptionType, number>;
    carrierPerformance: Array<{
        carrierId: string;
        carrierName: string;
        onTimeRate: number;
        exceptionRate: number;
        averageDeliveryDays: number;
    }>;
    timeSeriesData?: Array<{
        timestamp: Date;
        metric: string;
        value: number;
    }>;
}
/**
 * Shipment tracking configuration
 */
export interface TrackingConfig {
    enableRealTimeUpdates: boolean;
    updateInterval: number;
    enableExceptionDetection: boolean;
    exceptionThresholds: {
        delayHours: number;
        minLocationUpdates: number;
    };
    enableGeofencing: boolean;
    geofenceRadius: number;
}
/**
 * Shipment search criteria
 */
export interface ShipmentSearchCriteria {
    shipmentId?: string;
    shipmentNumber?: string;
    orderId?: string;
    carrierId?: string;
    status?: ShipmentStatus[];
    createdFrom?: Date;
    createdTo?: Date;
    estimatedDeliveryFrom?: Date;
    estimatedDeliveryTo?: Date;
    hasExceptions?: boolean;
    minWeight?: number;
    maxWeight?: number;
}
/**
 * 1. Creates a new shipment with initial tracking information.
 *
 * @param {Partial<Shipment>} shipmentData - Shipment details
 * @returns {Shipment} New shipment object
 *
 * @example
 * ```typescript
 * const shipment = createShipment({
 *   orderId: 'ORD-123456',
 *   originWarehouseId: 'WH-001',
 *   destinationFacilityId: 'FD-045',
 *   carrierId: 'CARRIER-UPS',
 *   carrierName: 'United Parcel Service',
 *   weight: 2.5,
 *   packageCount: 1
 * });
 * ```
 */
export declare function createShipment(shipmentData: Partial<Shipment>): Shipment;
/**
 * 2. Updates shipment status with validation.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {ShipmentStatus} newStatus - New status
 * @param {string} reason - Status change reason
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const updated = updateShipmentStatus(
 *   shipment,
 *   ShipmentStatus.IN_TRANSIT,
 *   'Picked up by carrier'
 * );
 * ```
 */
export declare function updateShipmentStatus(shipment: Shipment, newStatus: ShipmentStatus, reason: string): Shipment;
/**
 * 3. Retrieves detailed tracking information for a shipment.
 *
 * @param {Shipment} shipment - Shipment to track
 * @returns {Object} Comprehensive tracking details
 *
 * @example
 * ```typescript
 * const trackingInfo = getTrackingDetails(shipment);
 * console.log(trackingInfo.status, trackingInfo.currentLocation);
 * ```
 */
export declare function getTrackingDetails(shipment: Shipment): object;
/**
 * 4. Adds a scan event to shipment tracking.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {string} scanCode - Barcode/QR code value
 * @param {GeoLocation} location - Scan location
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const updated = addScanEvent(shipment, 'SCAN-123456', {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 5,
 *   timestamp: new Date(),
 *   source: LocationSource.SCAN
 * });
 * ```
 */
export declare function addScanEvent(shipment: Shipment, scanCode: string, location: GeoLocation): Shipment;
/**
 * 5. Estimates delivery time based on current progress.
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @param {number} avgDeliveryHours - Historical average delivery hours
 * @returns {Object} Delivery estimate data
 *
 * @example
 * ```typescript
 * const estimate = estimateDelivery(shipment, 48);
 * console.log(estimate.revisedEstimate, estimate.confidence);
 * ```
 */
export declare function estimateDelivery(shipment: Shipment, avgDeliveryHours: number): object;
/**
 * 6. Retrieves shipment by tracking number.
 *
 * @param {Shipment[]} shipments - Array of shipments
 * @param {string} trackingNumber - Tracking number to find
 * @returns {Shipment | undefined} Found shipment or undefined
 *
 * @example
 * ```typescript
 * const shipment = findByTrackingNumber(shipments, '1Z999AA10123456784');
 * ```
 */
export declare function findByTrackingNumber(shipments: Shipment[], trackingNumber: string): Shipment | undefined;
/**
 * 7. Validates shipment data integrity.
 *
 * @param {Shipment} shipment - Shipment to validate
 * @returns {Object} Validation results
 *
 * @example
 * ```typescript
 * const validation = validateShipment(shipment);
 * if (!validation.isValid) console.log(validation.errors);
 * ```
 */
export declare function validateShipment(shipment: Shipment): object;
/**
 * 8. Marks shipment as delivered with proof.
 *
 * @param {Shipment} shipment - Shipment to mark delivered
 * @param {string} recipientName - Recipient name
 * @param {Object} proof - Delivery proof
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const delivered = markAsDelivered(shipment, 'John Doe', {
 *   signatureUrl: 'https://...',
 *   photoUrl: 'https://...'
 * });
 * ```
 */
export declare function markAsDelivered(shipment: Shipment, recipientName: string, proof?: {
    signatureUrl?: string;
    photoUrl?: string;
}): Shipment;
/**
 * 9. Records a milestone event in shipment lifecycle.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {MilestoneType} type - Milestone type
 * @param {Partial<Milestone>} data - Milestone details
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const updated = recordMilestone(shipment, MilestoneType.PICKED_UP, {
 *   location: geoLocation,
 *   notes: 'Picked up from warehouse'
 * });
 * ```
 */
export declare function recordMilestone(shipment: Shipment, type: MilestoneType, data?: Partial<Milestone>): Shipment;
/**
 * 10. Retrieves milestones within a time range.
 *
 * @param {Shipment} shipment - Shipment to query
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @returns {Milestone[]} Filtered milestones
 *
 * @example
 * ```typescript
 * const dayOneMilestones = getMilestonesByDateRange(
 *   shipment,
 *   startDate,
 *   addHours(startDate, 24)
 * );
 * ```
 */
export declare function getMilestonesByDateRange(shipment: Shipment, from: Date, to: Date): Milestone[];
/**
 * 11. Gets milestones of a specific type.
 *
 * @param {Shipment} shipment - Shipment to query
 * @param {MilestoneType} type - Milestone type to filter
 * @returns {Milestone[]} Matching milestones
 *
 * @example
 * ```typescript
 * const deliveryAttempts = getMilestonesByType(
 *   shipment,
 *   MilestoneType.DELIVERY_ATTEMPTED
 * );
 * ```
 */
export declare function getMilestonesByType(shipment: Shipment, type: MilestoneType): Milestone[];
/**
 * 12. Calculates milestone sequence duration.
 *
 * @param {Milestone[]} milestones - Array of milestones
 * @param {MilestoneType} from - Start milestone type
 * @param {MilestoneType} to - End milestone type
 * @returns {number} Duration in hours
 *
 * @example
 * ```typescript
 * const packDuration = calculateMilestoneDuration(
 *   shipment.milestones,
 *   MilestoneType.PACK_INITIATED,
 *   MilestoneType.PACK_COMPLETED
 * );
 * ```
 */
export declare function calculateMilestoneDuration(milestones: Milestone[], from: MilestoneType, to: MilestoneType): number;
/**
 * 13. Checks if milestone sequence is valid.
 *
 * @param {Milestone[]} milestones - Array of milestones
 * @returns {Object} Validation results
 *
 * @example
 * ```typescript
 * const validation = validateMilestoneSequence(shipment.milestones);
 * ```
 */
export declare function validateMilestoneSequence(milestones: Milestone[]): object;
/**
 * 14. Retrieves the last milestone of a type.
 *
 * @param {Shipment} shipment - Shipment to query
 * @param {MilestoneType} type - Milestone type
 * @returns {Milestone | undefined} Last matching milestone
 *
 * @example
 * ```typescript
 * const lastUpdate = getLastMilestone(shipment, MilestoneType.IN_TRANSIT);
 * ```
 */
export declare function getLastMilestone(shipment: Shipment, type: MilestoneType): Milestone | undefined;
/**
 * 15. Generates milestone summary report.
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @returns {Object} Milestone summary
 *
 * @example
 * ```typescript
 * const summary = getMilestoneSummary(shipment);
 * ```
 */
export declare function getMilestoneSummary(shipment: Shipment): object;
/**
 * 16. Bulk updates milestones with status.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {string[]} milestoneIds - Milestone IDs to update
 * @param {boolean} acknowledged - Acknowledgment status
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const updated = acknowledgeMilestones(shipment, ['m1', 'm2']);
 * ```
 */
export declare function acknowledgeMilestones(shipment: Shipment, milestoneIds: string[], acknowledged?: boolean): Shipment;
/**
 * 17. Creates an exception record for a shipment.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {ExceptionType} type - Exception type
 * @param {Partial<Exception>} data - Exception details
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const updated = createException(shipment, ExceptionType.DELAY, {
 *   severity: 'HIGH',
 *   description: 'Shipment delayed by 6 hours',
 *   estimatedImpact: 'Delivery 1 day late'
 * });
 * ```
 */
export declare function createException(shipment: Shipment, type: ExceptionType, data?: Partial<Exception>): Shipment;
/**
 * 18. Updates exception status with resolution details.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {string} exceptionId - Exception ID to update
 * @param {string} newStatus - New exception status
 * @param {string} resolution - Resolution details
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const resolved = updateExceptionStatus(
 *   shipment,
 *   exceptionId,
 *   'RESOLVED',
 *   'Shipment rerouted via express delivery'
 * );
 * ```
 */
export declare function updateExceptionStatus(shipment: Shipment, exceptionId: string, newStatus: 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED', resolution?: string): Shipment;
/**
 * 19. Detects delays based on estimated vs. current progress.
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @param {number} delayThresholdHours - Hours to consider as delay
 * @returns {Object} Delay detection result
 *
 * @example
 * ```typescript
 * const delay = detectDelay(shipment, 4);
 * if (delay.isDelayed) console.log(delay.delayHours);
 * ```
 */
export declare function detectDelay(shipment: Shipment, delayThresholdHours: number): object;
/**
 * 20. Gets all open exceptions for a shipment.
 *
 * @param {Shipment} shipment - Shipment to query
 * @returns {Exception[]} Open exceptions
 *
 * @example
 * ```typescript
 * const openIssues = getOpenExceptions(shipment);
 * ```
 */
export declare function getOpenExceptions(shipment: Shipment): Exception[];
/**
 * 21. Checks if shipment has critical exceptions.
 *
 * @param {Shipment} shipment - Shipment to check
 * @returns {boolean} Has critical exceptions
 *
 * @example
 * ```typescript
 * if (hasCriticalExceptions(shipment)) {
 *   console.log('Urgent action required');
 * }
 * ```
 */
export declare function hasCriticalExceptions(shipment: Shipment): boolean;
/**
 * 22. Generates exception report with analytics.
 *
 * @param {Shipment[]} shipments - Array of shipments
 * @returns {Object} Exception analytics
 *
 * @example
 * ```typescript
 * const report = getExceptionReport(shipments);
 * console.log(report.totalExceptions, report.byType);
 * ```
 */
export declare function getExceptionReport(shipments: Shipment[]): object;
/**
 * 23. Escalates exception to management.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {string} exceptionId - Exception ID
 * @param {string} escalationReason - Reason for escalation
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const escalated = escalateException(
 *   shipment,
 *   exceptionId,
 *   'Customer requiring urgent resolution'
 * );
 * ```
 */
export declare function escalateException(shipment: Shipment, exceptionId: string, escalationReason: string): Shipment;
/**
 * 24. Predicts exception likelihood based on patterns.
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @param {Object} historicalData - Historical shipment patterns
 * @returns {Object} Risk assessment
 *
 * @example
 * ```typescript
 * const risk = predictExceptionRisk(shipment, historicalPatterns);
 * console.log(risk.riskScore, risk.likelyExceptions);
 * ```
 */
export declare function predictExceptionRisk(shipment: Shipment, historicalData?: {
    avgDelayHours: number;
    exceptionRate: number;
}): object;
/**
 * 25. Records real-time location update for shipment.
 *
 * @param {Shipment} shipment - Shipment to update
 * @param {GeoLocation} location - Current location
 * @returns {Shipment} Updated shipment
 *
 * @example
 * ```typescript
 * const updated = updateLocation(shipment, {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 8,
 *   timestamp: new Date(),
 *   source: LocationSource.GPS
 * });
 * ```
 */
export declare function updateLocation(shipment: Shipment, location: GeoLocation): Shipment;
/**
 * 26. Calculates distance traveled by shipment.
 *
 * @param {LocationUpdate[]} locationHistory - Location history
 * @returns {number} Distance in kilometers
 *
 * @example
 * ```typescript
 * const distance = calculateDistanceTraveled(shipment.locationHistory);
 * console.log(distance, 'km');
 * ```
 */
export declare function calculateDistanceTraveled(locationHistory: LocationUpdate[]): number;
/**
 * 27. Gets location history within geographic bounds.
 *
 * @param {LocationUpdate[]} locationHistory - Location history
 * @param {number} minLat - Minimum latitude
 * @param {number} maxLat - Maximum latitude
 * @param {number} minLon - Minimum longitude
 * @param {number} maxLon - Maximum longitude
 * @returns {LocationUpdate[]} Filtered location updates
 *
 * @example
 * ```typescript
 * const stateUpdates = getLocationsByBounds(
 *   shipment.locationHistory,
 *   40, 41, -75, -74
 * );
 * ```
 */
export declare function getLocationsByBounds(locationHistory: LocationUpdate[], minLat: number, maxLat: number, minLon: number, maxLon: number): LocationUpdate[];
/**
 * 28. Creates geofence alert if location enters zone.
 *
 * @param {GeoLocation} currentLocation - Current location
 * @param {GeoLocation} geofenceCenter - Geofence center
 * @param {number} radiusKm - Geofence radius in km
 * @returns {Object} Geofence alert data
 *
 * @example
 * ```typescript
 * const alert = checkGeofence(location, deliveryZone, 1);
 * if (alert.inGeofence) console.log('Delivery imminent');
 * ```
 */
export declare function checkGeofence(currentLocation: GeoLocation, geofenceCenter: GeoLocation, radiusKm: number): object;
/**
 * 29. Calculates average speed from location history.
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @returns {number} Average speed in km/h
 *
 * @example
 * ```typescript
 * const avgSpeed = getAverageSpeed(shipment);
 * ```
 */
export declare function getAverageSpeed(shipment: Shipment): number;
/**
 * 30. Gets latest location with validation.
 *
 * @param {Shipment} shipment - Shipment to query
 * @returns {Object} Latest location details
 *
 * @example
 * ```typescript
 * const latestLoc = getLatestLocation(shipment);
 * console.log(latestLoc.location, latestLoc.age);
 * ```
 */
export declare function getLatestLocation(shipment: Shipment): object;
/**
 * 31. Streams location updates for real-time tracking.
 *
 * @param {Shipment} shipment - Shipment to track
 * @param {EventStreamConfig} config - Stream configuration
 * @returns {VisibilityEvent[]} Filtered events
 *
 * @example
 * ```typescript
 * const stream = streamLocationUpdates(shipment, {
 *   shipmentId: shipment.shipmentId,
 *   eventTypes: ['LOCATION_UPDATE'],
 *   realtime: true
 * });
 * ```
 */
export declare function streamLocationUpdates(shipment: Shipment, config: EventStreamConfig): VisibilityEvent[];
/**
 * 32. Detects location anomalies (teleportation, stationary too long).
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @param {number} maxSpeedKmh - Maximum realistic speed
 * @returns {Object} Anomaly detection results
 *
 * @example
 * ```typescript
 * const anomalies = detectLocationAnomalies(shipment, 120);
 * ```
 */
export declare function detectLocationAnomalies(shipment: Shipment, maxSpeedKmh?: number): object;
/**
 * 33. Creates visibility dashboard for shipment(s).
 *
 * @param {string[]} shipmentIds - Shipment IDs for dashboard
 * @param {Shipment[]} shipments - Available shipments
 * @returns {VisibilityDashboard} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = createDashboard(shipmentIds, shipments);
 * ```
 */
export declare function createDashboard(shipmentIds: string[], shipments: Shipment[]): VisibilityDashboard;
/**
 * 34. Generates performance metrics for shipments.
 *
 * @param {Shipment[]} shipments - Shipments to analyze
 * @returns {Object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = getPerformanceMetrics(shipments);
 * ```
 */
export declare function getPerformanceMetrics(shipments: Shipment[]): object;
/**
 * 35. Searches shipments by criteria.
 *
 * @param {Shipment[]} shipments - Shipments to search
 * @param {ShipmentSearchCriteria} criteria - Search criteria
 * @returns {Shipment[]} Matching shipments
 *
 * @example
 * ```typescript
 * const results = searchShipments(shipments, {
 *   status: [ShipmentStatus.IN_TRANSIT],
 *   hasExceptions: true
 * });
 * ```
 */
export declare function searchShipments(shipments: Shipment[], criteria: ShipmentSearchCriteria): Shipment[];
/**
 * 36. Generates compliance report for shipments.
 *
 * @param {Shipment[]} shipments - Shipments to analyze
 * @returns {Object} Compliance data
 *
 * @example
 * ```typescript
 * const compliance = getComplianceReport(shipments);
 * ```
 */
export declare function getComplianceReport(shipments: Shipment[]): object;
/**
 * 37. Exports shipment data in analytics format.
 *
 * @param {Shipment[]} shipments - Shipments to export
 * @returns {Object[]} Flattened shipment records
 *
 * @example
 * ```typescript
 * const records = exportAnalyticsData(shipments);
 * ```
 */
export declare function exportAnalyticsData(shipments: Shipment[]): object[];
/**
 * 38. Predicts future shipment status.
 *
 * @param {Shipment} shipment - Shipment to analyze
 * @returns {Object} Status prediction
 *
 * @example
 * ```typescript
 * const prediction = predictShipmentStatus(shipment);
 * ```
 */
export declare function predictShipmentStatus(shipment: Shipment): object;
/**
 * 39. Generates cost analysis for shipments.
 *
 * @param {Shipment[]} shipments - Shipments to analyze
 * @param {Object} costModel - Cost parameters
 * @returns {Object} Cost analysis
 *
 * @example
 * ```typescript
 * const costs = analyzeCosts(shipments, {
 *   costPerKg: 2.5,
 *   costPerKm: 0.5
 * });
 * ```
 */
export declare function analyzeCosts(shipments: Shipment[], costModel: {
    costPerKg?: number;
    costPerKm?: number;
    baseCost?: number;
}): object;
/**
 * 40. Generates executive summary for shipment operations.
 *
 * @param {Shipment[]} shipments - Shipments to summarize
 * @returns {Object} Executive summary
 *
 * @example
 * ```typescript
 * const summary = getExecutiveSummary(shipments);
 * ```
 */
export declare function getExecutiveSummary(shipments: Shipment[]): object;
//# sourceMappingURL=supply-chain-visibility-kit.d.ts.map