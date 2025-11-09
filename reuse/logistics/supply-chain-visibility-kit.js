"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationSource = exports.ExceptionType = exports.MilestoneType = exports.ShipmentStatus = void 0;
exports.createShipment = createShipment;
exports.updateShipmentStatus = updateShipmentStatus;
exports.getTrackingDetails = getTrackingDetails;
exports.addScanEvent = addScanEvent;
exports.estimateDelivery = estimateDelivery;
exports.findByTrackingNumber = findByTrackingNumber;
exports.validateShipment = validateShipment;
exports.markAsDelivered = markAsDelivered;
exports.recordMilestone = recordMilestone;
exports.getMilestonesByDateRange = getMilestonesByDateRange;
exports.getMilestonesByType = getMilestonesByType;
exports.calculateMilestoneDuration = calculateMilestoneDuration;
exports.validateMilestoneSequence = validateMilestoneSequence;
exports.getLastMilestone = getLastMilestone;
exports.getMilestoneSummary = getMilestoneSummary;
exports.acknowledgeMilestones = acknowledgeMilestones;
exports.createException = createException;
exports.updateExceptionStatus = updateExceptionStatus;
exports.detectDelay = detectDelay;
exports.getOpenExceptions = getOpenExceptions;
exports.hasCriticalExceptions = hasCriticalExceptions;
exports.getExceptionReport = getExceptionReport;
exports.escalateException = escalateException;
exports.predictExceptionRisk = predictExceptionRisk;
exports.updateLocation = updateLocation;
exports.calculateDistanceTraveled = calculateDistanceTraveled;
exports.getLocationsByBounds = getLocationsByBounds;
exports.checkGeofence = checkGeofence;
exports.getAverageSpeed = getAverageSpeed;
exports.getLatestLocation = getLatestLocation;
exports.streamLocationUpdates = streamLocationUpdates;
exports.detectLocationAnomalies = detectLocationAnomalies;
exports.createDashboard = createDashboard;
exports.getPerformanceMetrics = getPerformanceMetrics;
exports.searchShipments = searchShipments;
exports.getComplianceReport = getComplianceReport;
exports.exportAnalyticsData = exportAnalyticsData;
exports.predictShipmentStatus = predictShipmentStatus;
exports.analyzeCosts = analyzeCosts;
exports.getExecutiveSummary = getExecutiveSummary;
/**
 * File: /reuse/logistics/supply-chain-visibility-kit.ts
 * Locator: WC-LOGISTICS-SCM-VIS-001
 * Purpose: Comprehensive Supply Chain Visibility - End-to-end shipment tracking, real-time location updates, exception detection
 *
 * Upstream: Independent utility module for supply chain visibility operations
 * Downstream: ../backend/logistics/*, Tracking services, Dashboard engines, Exception handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for shipment tracking, milestone management, exception detection, real-time updates, visibility analytics
 *
 * LLM Context: Enterprise-grade supply chain visibility utilities for logistics operations to compete with JD Edwards Supply Chain Management.
 * Provides end-to-end shipment tracking, real-time location updates, milestone management, exception detection,
 * event streaming, visibility dashboards, predictive analytics, and compliance reporting for multi-modal transportation.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Shipment status enumeration
 */
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["CREATED"] = "CREATED";
    ShipmentStatus["PICKED"] = "PICKED";
    ShipmentStatus["PACKED"] = "PACKED";
    ShipmentStatus["SHIPPED"] = "SHIPPED";
    ShipmentStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShipmentStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    ShipmentStatus["DELIVERED"] = "DELIVERED";
    ShipmentStatus["HELD"] = "HELD";
    ShipmentStatus["EXCEPTION"] = "EXCEPTION";
    ShipmentStatus["CANCELLED"] = "CANCELLED";
    ShipmentStatus["RETURNED"] = "RETURNED";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
/**
 * Milestone type enumeration
 */
var MilestoneType;
(function (MilestoneType) {
    MilestoneType["ORDER_PLACED"] = "ORDER_PLACED";
    MilestoneType["PICK_INITIATED"] = "PICK_INITIATED";
    MilestoneType["PICK_COMPLETED"] = "PICK_COMPLETED";
    MilestoneType["PACK_INITIATED"] = "PACK_INITIATED";
    MilestoneType["PACK_COMPLETED"] = "PACK_COMPLETED";
    MilestoneType["LABEL_CREATED"] = "LABEL_CREATED";
    MilestoneType["SHIPMENT_CREATED"] = "SHIPMENT_CREATED";
    MilestoneType["PICKED_UP"] = "PICKED_UP";
    MilestoneType["IN_TRANSIT"] = "IN_TRANSIT";
    MilestoneType["DELIVERY_ATTEMPTED"] = "DELIVERY_ATTEMPTED";
    MilestoneType["DELIVERED"] = "DELIVERED";
    MilestoneType["EXCEPTION_OCCURRED"] = "EXCEPTION_OCCURRED";
    MilestoneType["EXCEPTION_RESOLVED"] = "EXCEPTION_RESOLVED";
    MilestoneType["RETURNED"] = "RETURNED";
})(MilestoneType || (exports.MilestoneType = MilestoneType = {}));
/**
 * Exception type enumeration
 */
var ExceptionType;
(function (ExceptionType) {
    ExceptionType["DELAY"] = "DELAY";
    ExceptionType["LOST"] = "LOST";
    ExceptionType["DAMAGED"] = "DAMAGED";
    ExceptionType["CUSTOMS_HOLD"] = "CUSTOMS_HOLD";
    ExceptionType["ADDRESS_ISSUE"] = "ADDRESS_ISSUE";
    ExceptionType["WEATHER"] = "WEATHER";
    ExceptionType["MECHANICAL"] = "MECHANICAL";
    ExceptionType["DRIVER_UNAVAILABLE"] = "DRIVER_UNAVAILABLE";
    ExceptionType["RECIPIENT_UNAVAILABLE"] = "RECIPIENT_UNAVAILABLE";
    ExceptionType["RETURNED_TO_ORIGIN"] = "RETURNED_TO_ORIGIN";
    ExceptionType["DOCUMENT_MISSING"] = "DOCUMENT_MISSING";
    ExceptionType["DISCREPANCY"] = "DISCREPANCY";
})(ExceptionType || (exports.ExceptionType = ExceptionType = {}));
/**
 * Location source enumeration
 */
var LocationSource;
(function (LocationSource) {
    LocationSource["GPS"] = "GPS";
    LocationSource["CELL_TOWER"] = "CELL_TOWER";
    LocationSource["WIFI"] = "WIFI";
    LocationSource["GEOFENCE"] = "GEOFENCE";
    LocationSource["SCAN"] = "SCAN";
    LocationSource["MANUAL"] = "MANUAL";
    LocationSource["CARRIER_API"] = "CARRIER_API";
})(LocationSource || (exports.LocationSource = LocationSource = {}));
// ============================================================================
// SECTION 1: SHIPMENT TRACKING (Functions 1-8)
// ============================================================================
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
function createShipment(shipmentData) {
    const shipmentId = crypto.randomUUID();
    const shipmentNumber = generateShipmentNumber();
    return {
        shipmentId,
        shipmentNumber,
        orderId: shipmentData.orderId || '',
        originWarehouseId: shipmentData.originWarehouseId || '',
        destinationFacilityId: shipmentData.destinationFacilityId || '',
        status: ShipmentStatus.CREATED,
        carrierId: shipmentData.carrierId || '',
        carrierName: shipmentData.carrierName || '',
        trackingNumber: generateTrackingNumber(),
        estimatedDelivery: shipmentData.estimatedDelivery || addDays(new Date(), 3),
        weight: shipmentData.weight || 0,
        dimensions: shipmentData.dimensions,
        packageCount: shipmentData.packageCount || 1,
        milestones: [],
        locationHistory: [],
        exceptions: [],
        events: [],
        createdAt: new Date(),
        metadata: shipmentData.metadata,
    };
}
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
function updateShipmentStatus(shipment, newStatus, reason) {
    const validTransitions = {
        [ShipmentStatus.CREATED]: [ShipmentStatus.PICKED, ShipmentStatus.CANCELLED],
        [ShipmentStatus.PICKED]: [ShipmentStatus.PACKED, ShipmentStatus.CANCELLED],
        [ShipmentStatus.PACKED]: [ShipmentStatus.SHIPPED, ShipmentStatus.CANCELLED],
        [ShipmentStatus.SHIPPED]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.EXCEPTION],
        [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.HELD, ShipmentStatus.EXCEPTION],
        [ShipmentStatus.OUT_FOR_DELIVERY]: [ShipmentStatus.DELIVERED, ShipmentStatus.HELD, ShipmentStatus.EXCEPTION],
        [ShipmentStatus.HELD]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.EXCEPTION],
        [ShipmentStatus.EXCEPTION]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.DELIVERED, ShipmentStatus.RETURNED],
        [ShipmentStatus.DELIVERED]: [ShipmentStatus.RETURNED],
        [ShipmentStatus.CANCELLED]: [],
        [ShipmentStatus.RETURNED]: [],
    };
    if (!validTransitions[shipment.status]?.includes(newStatus)) {
        throw new Error(`Invalid status transition: ${shipment.status} -> ${newStatus}`);
    }
    return {
        ...shipment,
        status: newStatus,
    };
}
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
function getTrackingDetails(shipment) {
    const lastMilestone = shipment.milestones[shipment.milestones.length - 1];
    const lastLocation = shipment.locationHistory[shipment.locationHistory.length - 1];
    const openExceptions = shipment.exceptions.filter(e => e.status !== 'RESOLVED' && e.status !== 'CLOSED');
    return {
        shipmentId: shipment.shipmentId,
        shipmentNumber: shipment.shipmentNumber,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        currentLocation: lastLocation?.location,
        lastMilestoneType: lastMilestone?.type,
        lastMilestoneTime: lastMilestone?.timestamp,
        milestoneCount: shipment.milestones.length,
        exceptionCount: openExceptions.length,
        locationUpdatesCount: shipment.locationHistory.length,
        daysInTransit: calculateDaysDifference(shipment.createdAt, new Date()),
    };
}
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
function addScanEvent(shipment, scanCode, location) {
    const milestone = {
        milestoneId: crypto.randomUUID(),
        shipmentId: shipment.shipmentId,
        type: MilestoneType.IN_TRANSIT,
        timestamp: location.timestamp,
        location,
        notes: `Scan event: ${scanCode}`,
    };
    const locationUpdate = {
        locationUpdateId: crypto.randomUUID(),
        shipmentId: shipment.shipmentId,
        location,
    };
    const event = {
        eventId: crypto.randomUUID(),
        eventType: 'MILESTONE',
        shipmentId: shipment.shipmentId,
        timestamp: new Date(),
        data: milestone,
    };
    return {
        ...shipment,
        currentLocation: location,
        milestones: [...shipment.milestones, milestone],
        locationHistory: [...shipment.locationHistory, locationUpdate],
        events: [...shipment.events, event],
    };
}
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
function estimateDelivery(shipment, avgDeliveryHours) {
    const elapsedHours = calculateHoursDifference(shipment.createdAt, new Date());
    const remainingHours = avgDeliveryHours - elapsedHours;
    const revisedEstimate = new Date(Date.now() + remainingHours * 3600000);
    const confidence = Math.max(0, Math.min(100, (elapsedHours / avgDeliveryHours) * 100));
    return {
        originalEstimate: shipment.estimatedDelivery,
        revisedEstimate,
        elapsedHours,
        estimatedRemainingHours: Math.max(0, remainingHours),
        confidence,
        onTrack: remainingHours > 0,
    };
}
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
function findByTrackingNumber(shipments, trackingNumber) {
    return shipments.find(s => s.trackingNumber === trackingNumber);
}
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
function validateShipment(shipment) {
    const errors = [];
    if (!shipment.shipmentId)
        errors.push('Missing shipmentId');
    if (!shipment.orderId)
        errors.push('Missing orderId');
    if (!shipment.originWarehouseId)
        errors.push('Missing originWarehouseId');
    if (!shipment.destinationFacilityId)
        errors.push('Missing destinationFacilityId');
    if (!shipment.carrierId)
        errors.push('Missing carrierId');
    if (shipment.weight <= 0)
        errors.push('Weight must be positive');
    if (shipment.packageCount <= 0)
        errors.push('Package count must be positive');
    if (shipment.estimatedDelivery <= shipment.createdAt) {
        errors.push('Estimated delivery must be after creation date');
    }
    return {
        isValid: errors.length === 0,
        errors,
        timestamp: new Date(),
    };
}
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
function markAsDelivered(shipment, recipientName, proof) {
    const milestone = {
        milestoneId: crypto.randomUUID(),
        shipmentId: shipment.shipmentId,
        type: MilestoneType.DELIVERED,
        timestamp: new Date(),
        proofOfDelivery: {
            recipientName,
            signatureUrl: proof?.signatureUrl,
            photoUrl: proof?.photoUrl,
        },
    };
    const event = {
        eventId: crypto.randomUUID(),
        eventType: 'MILESTONE',
        shipmentId: shipment.shipmentId,
        timestamp: new Date(),
        data: milestone,
    };
    return {
        ...shipment,
        status: ShipmentStatus.DELIVERED,
        actualDelivery: new Date(),
        milestones: [...shipment.milestones, milestone],
        events: [...shipment.events, event],
    };
}
// ============================================================================
// SECTION 2: MILESTONE MANAGEMENT (Functions 9-16)
// ============================================================================
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
function recordMilestone(shipment, type, data) {
    const milestone = {
        milestoneId: crypto.randomUUID(),
        shipmentId: shipment.shipmentId,
        type,
        timestamp: data?.timestamp || new Date(),
        location: data?.location,
        notes: data?.notes,
        proofOfDelivery: data?.proofOfDelivery,
        metadata: data?.metadata,
    };
    const event = {
        eventId: crypto.randomUUID(),
        eventType: 'MILESTONE',
        shipmentId: shipment.shipmentId,
        timestamp: new Date(),
        data: milestone,
    };
    return {
        ...shipment,
        milestones: [...shipment.milestones, milestone],
        events: [...shipment.events, event],
    };
}
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
function getMilestonesByDateRange(shipment, from, to) {
    return shipment.milestones.filter(m => m.timestamp >= from && m.timestamp <= to);
}
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
function getMilestonesByType(shipment, type) {
    return shipment.milestones.filter(m => m.type === type);
}
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
function calculateMilestoneDuration(milestones, from, to) {
    const startMilestone = milestones.find(m => m.type === from);
    const endMilestone = milestones.find(m => m.type === to);
    if (!startMilestone || !endMilestone) {
        return 0;
    }
    return calculateHoursDifference(startMilestone.timestamp, endMilestone.timestamp);
}
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
function validateMilestoneSequence(milestones) {
    const milestoneTypeOrder = [
        MilestoneType.ORDER_PLACED,
        MilestoneType.PICK_INITIATED,
        MilestoneType.PACK_INITIATED,
        MilestoneType.SHIPMENT_CREATED,
        MilestoneType.PICKED_UP,
        MilestoneType.IN_TRANSIT,
        MilestoneType.OUT_FOR_DELIVERY,
        MilestoneType.DELIVERED,
    ];
    const errors = [];
    let lastIndex = -1;
    for (const milestone of milestones) {
        const currentIndex = milestoneTypeOrder.indexOf(milestone.type);
        if (currentIndex !== -1 && currentIndex < lastIndex) {
            errors.push(`Out-of-order milestone: ${milestone.type}`);
        }
        if (currentIndex !== -1) {
            lastIndex = currentIndex;
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        totalMilestones: milestones.length,
    };
}
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
function getLastMilestone(shipment, type) {
    const matching = shipment.milestones.filter(m => m.type === type);
    return matching[matching.length - 1];
}
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
function getMilestoneSummary(shipment) {
    const milestoneTypeMap = new Map();
    for (const milestone of shipment.milestones) {
        milestoneTypeMap.set(milestone.type, (milestoneTypeMap.get(milestone.type) || 0) + 1);
    }
    const milestoneBreakdown = {};
    milestoneTypeMap.forEach((count, type) => {
        milestoneBreakdown[type] = count;
    });
    return {
        totalMilestones: shipment.milestones.length,
        firstMilestone: shipment.milestones[0]?.timestamp,
        lastMilestone: shipment.milestones[shipment.milestones.length - 1]?.timestamp,
        milestoneBreakdown,
        uniqueLocations: new Set(shipment.milestones.filter(m => m.location).map(m => `${m.location?.latitude},${m.location?.longitude}`)).size,
    };
}
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
function acknowledgeMilestones(shipment, milestoneIds, acknowledged = true) {
    const idSet = new Set(milestoneIds);
    const updatedEvents = shipment.events.map(event => ({
        ...event,
        acknowledged: idSet.has(event.eventId) ? acknowledged : event.acknowledged,
    }));
    return {
        ...shipment,
        events: updatedEvents,
    };
}
// ============================================================================
// SECTION 3: EXCEPTION DETECTION (Functions 17-24)
// ============================================================================
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
function createException(shipment, type, data) {
    const exception = {
        exceptionId: crypto.randomUUID(),
        shipmentId: shipment.shipmentId,
        type,
        severity: data?.severity || 'MEDIUM',
        status: 'OPEN',
        detectedAt: data?.detectedAt || new Date(),
        detectedBy: data?.detectedBy,
        location: data?.location,
        description: data?.description || `${type} exception detected`,
        rootCause: data?.rootCause,
        resolutionAction: data?.resolutionAction,
        estimatedImpact: data?.estimatedImpact,
        metadata: data?.metadata,
    };
    const event = {
        eventId: crypto.randomUUID(),
        eventType: 'EXCEPTION',
        shipmentId: shipment.shipmentId,
        timestamp: new Date(),
        data: exception,
    };
    return {
        ...shipment,
        status: ShipmentStatus.EXCEPTION,
        exceptions: [...shipment.exceptions, exception],
        events: [...shipment.events, event],
    };
}
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
function updateExceptionStatus(shipment, exceptionId, newStatus, resolution) {
    const updatedExceptions = shipment.exceptions.map(exc => {
        if (exc.exceptionId === exceptionId) {
            return {
                ...exc,
                status: newStatus,
                resolutionAction: resolution || exc.resolutionAction,
                resolvedAt: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? new Date() : exc.resolvedAt,
            };
        }
        return exc;
    });
    return {
        ...shipment,
        exceptions: updatedExceptions,
    };
}
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
function detectDelay(shipment, delayThresholdHours) {
    const elapsedHours = calculateHoursDifference(shipment.createdAt, new Date());
    const expectedHours = calculateHoursDifference(shipment.createdAt, shipment.estimatedDelivery);
    const delayHours = Math.max(0, elapsedHours - expectedHours);
    return {
        isDelayed: delayHours > delayThresholdHours,
        delayHours,
        delayPercentage: (delayHours / expectedHours) * 100,
        threshold: delayThresholdHours,
        elapsedHours,
        expectedHours,
    };
}
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
function getOpenExceptions(shipment) {
    return shipment.exceptions.filter(e => e.status !== 'RESOLVED' && e.status !== 'CLOSED');
}
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
function hasCriticalExceptions(shipment) {
    return getOpenExceptions(shipment).some(e => e.severity === 'CRITICAL');
}
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
function getExceptionReport(shipments) {
    const exceptionTypeMap = new Map();
    const severityMap = new Map();
    let totalOpen = 0;
    let totalResolved = 0;
    for (const shipment of shipments) {
        for (const exception of shipment.exceptions) {
            const type = exception.type;
            exceptionTypeMap.set(type, (exceptionTypeMap.get(type) || 0) + 1);
            const severity = exception.severity;
            severityMap.set(severity, (severityMap.get(severity) || 0) + 1);
            if (exception.status === 'RESOLVED' || exception.status === 'CLOSED') {
                totalResolved++;
            }
            else {
                totalOpen++;
            }
        }
    }
    const byType = {};
    exceptionTypeMap.forEach((count, type) => {
        byType[type] = count;
    });
    const bySeverity = {};
    severityMap.forEach((count, severity) => {
        bySeverity[severity] = count;
    });
    return {
        totalExceptions: totalOpen + totalResolved,
        openExceptions: totalOpen,
        resolvedExceptions: totalResolved,
        resolutionRate: totalOpen + totalResolved > 0 ? (totalResolved / (totalOpen + totalResolved)) * 100 : 0,
        byType,
        bySeverity,
    };
}
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
function escalateException(shipment, exceptionId, escalationReason) {
    const updatedExceptions = shipment.exceptions.map(exc => {
        if (exc.exceptionId === exceptionId) {
            return {
                ...exc,
                status: 'IN_PROGRESS',
                severity: exc.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
                metadata: {
                    ...exc.metadata,
                    escalationReason,
                    escalatedAt: new Date().toISOString(),
                },
            };
        }
        return exc;
    });
    return {
        ...shipment,
        exceptions: updatedExceptions,
    };
}
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
function predictExceptionRisk(shipment, historicalData) {
    let riskScore = 0;
    const likelyExceptions = [];
    // Factor in current exceptions
    if (shipment.exceptions.length > 0) {
        riskScore += 30;
    }
    // Factor in carrier
    if (historicalData?.exceptionRate && historicalData.exceptionRate > 0.1) {
        riskScore += 20;
    }
    // Factor in delay
    const elapsedHours = calculateHoursDifference(shipment.createdAt, new Date());
    const expectedHours = calculateHoursDifference(shipment.createdAt, shipment.estimatedDelivery);
    if (elapsedHours > expectedHours * 0.8) {
        riskScore += 25;
        likelyExceptions.push(ExceptionType.DELAY);
    }
    // Factor in weight/size
    if (shipment.weight > 30) {
        riskScore += 10;
        likelyExceptions.push(ExceptionType.DAMAGED);
    }
    return {
        riskScore: Math.min(100, riskScore),
        riskLevel: riskScore < 20 ? 'LOW' : riskScore < 50 ? 'MEDIUM' : 'HIGH',
        likelyExceptions,
        recommendedActions: riskScore > 50 ? ['Monitor closely', 'Prepare contingency'] : [],
    };
}
// ============================================================================
// SECTION 4: REAL-TIME UPDATES (Functions 25-32)
// ============================================================================
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
function updateLocation(shipment, location) {
    const locationUpdate = {
        locationUpdateId: crypto.randomUUID(),
        shipmentId: shipment.shipmentId,
        location,
    };
    const event = {
        eventId: crypto.randomUUID(),
        eventType: 'LOCATION_UPDATE',
        shipmentId: shipment.shipmentId,
        timestamp: new Date(),
        data: locationUpdate,
    };
    return {
        ...shipment,
        currentLocation: location,
        locationHistory: [...shipment.locationHistory, locationUpdate],
        events: [...shipment.events, event],
    };
}
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
function calculateDistanceTraveled(locationHistory) {
    if (locationHistory.length < 2) {
        return 0;
    }
    let totalDistance = 0;
    for (let i = 1; i < locationHistory.length; i++) {
        const prev = locationHistory[i - 1].location;
        const curr = locationHistory[i].location;
        totalDistance += calculateHaversineDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    }
    return totalDistance;
}
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
function getLocationsByBounds(locationHistory, minLat, maxLat, minLon, maxLon) {
    return locationHistory.filter(update => {
        const loc = update.location;
        return loc.latitude >= minLat &&
            loc.latitude <= maxLat &&
            loc.longitude >= minLon &&
            loc.longitude <= maxLon;
    });
}
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
function checkGeofence(currentLocation, geofenceCenter, radiusKm) {
    const distance = calculateHaversineDistance(currentLocation.latitude, currentLocation.longitude, geofenceCenter.latitude, geofenceCenter.longitude);
    return {
        inGeofence: distance <= radiusKm,
        distance,
        radius: radiusKm,
        timeToArrival: distance > 0 ? Math.round((distance / 60) * 60) : 0, // minutes at 60 km/h
    };
}
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
function getAverageSpeed(shipment) {
    if (shipment.locationHistory.length < 2) {
        return 0;
    }
    const firstLocation = shipment.locationHistory[0].location;
    const lastLocation = shipment.locationHistory[shipment.locationHistory.length - 1].location;
    const distance = calculateHaversineDistance(firstLocation.latitude, firstLocation.longitude, lastLocation.latitude, lastLocation.longitude);
    const hours = calculateHoursDifference(firstLocation.timestamp, lastLocation.timestamp);
    return hours > 0 ? distance / hours : 0;
}
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
function getLatestLocation(shipment) {
    const latest = shipment.locationHistory[shipment.locationHistory.length - 1];
    if (!latest) {
        return { location: null, age: null, isStale: true };
    }
    const ageMinutes = calculateMinutesDifference(latest.location.timestamp, new Date());
    return {
        location: latest.location,
        age: ageMinutes,
        ageMinutes,
        isStale: ageMinutes > 30,
        source: latest.location.source,
        accuracy: latest.location.accuracy,
    };
}
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
function streamLocationUpdates(shipment, config) {
    return shipment.events.filter(event => config.eventTypes.includes(event.eventType));
}
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
function detectLocationAnomalies(shipment, maxSpeedKmh = 120) {
    const anomalies = [];
    for (let i = 1; i < shipment.locationHistory.length; i++) {
        const prev = shipment.locationHistory[i - 1];
        const curr = shipment.locationHistory[i];
        const distance = calculateHaversineDistance(prev.location.latitude, prev.location.longitude, curr.location.latitude, curr.location.longitude);
        const hours = calculateHoursDifference(prev.location.timestamp, curr.location.timestamp);
        if (hours > 0) {
            const speed = distance / hours;
            if (speed > maxSpeedKmh) {
                anomalies.push({
                    type: 'SPEED_ANOMALY',
                    description: `Excessive speed: ${Math.round(speed)} km/h`,
                    timestamp: curr.location.timestamp,
                });
            }
        }
        // Check for stationary periods > 24 hours
        const stationaryHours = calculateHoursDifference(prev.location.timestamp, curr.location.timestamp);
        if (distance < 0.5 && stationaryHours > 24) {
            anomalies.push({
                type: 'STATIONARY',
                description: `Stationary for ${Math.round(stationaryHours)} hours`,
                timestamp: curr.location.timestamp,
            });
        }
    }
    return {
        hasAnomalies: anomalies.length > 0,
        anomalyCount: anomalies.length,
        anomalies,
    };
}
// ============================================================================
// SECTION 5: VISIBILITY ANALYTICS (Functions 33-40)
// ============================================================================
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
function createDashboard(shipmentIds, shipments) {
    const dashboardShipments = shipments.filter(s => shipmentIds.includes(s.shipmentId));
    const statusMap = new Map();
    const exceptionMap = new Map();
    const carrierMap = new Map();
    let totalOnTime = 0;
    let totalDelayed = 0;
    let totalExceptions = 0;
    let totalDeliveryDays = 0;
    let deliveryCount = 0;
    for (const shipment of dashboardShipments) {
        // Status distribution
        statusMap.set(shipment.status, (statusMap.get(shipment.status) || 0) + 1);
        // Exception breakdown
        for (const exception of shipment.exceptions) {
            exceptionMap.set(exception.type, (exceptionMap.get(exception.type) || 0) + 1);
            totalExceptions++;
        }
        // Delivery analysis
        if (shipment.actualDelivery) {
            deliveryCount++;
            const deliveryDays = calculateDaysDifference(shipment.createdAt, shipment.actualDelivery);
            totalDeliveryDays += deliveryDays;
            if (shipment.actualDelivery <= shipment.estimatedDelivery) {
                totalOnTime++;
            }
            else {
                totalDelayed++;
            }
        }
        // Carrier performance
        const carrierKey = `${shipment.carrierId}`;
        if (!carrierMap.has(carrierKey)) {
            carrierMap.set(carrierKey, { onTime: 0, total: 0, deliveryDays: [] });
        }
        const stats = carrierMap.get(carrierKey);
        stats.total++;
        if (shipment.actualDelivery && shipment.actualDelivery <= shipment.estimatedDelivery) {
            stats.onTime++;
        }
        if (shipment.actualDelivery) {
            stats.deliveryDays.push(calculateDaysDifference(shipment.createdAt, shipment.actualDelivery));
        }
    }
    const statusDistribution = {};
    statusMap.forEach((count, status) => {
        statusDistribution[status] = count;
    });
    const exceptionBreakdown = {};
    exceptionMap.forEach((count, type) => {
        exceptionBreakdown[type] = count;
    });
    const carrierPerformance = Array.from(carrierMap.entries()).map(([carrierId, stats]) => {
        const avgDeliveryDays = stats.deliveryDays.length > 0
            ? stats.deliveryDays.reduce((a, b) => a + b, 0) / stats.deliveryDays.length
            : 0;
        return {
            carrierId,
            carrierName: carrierId,
            onTimeRate: (stats.onTime / stats.total) * 100,
            exceptionRate: (totalExceptions / stats.total) * 100,
            averageDeliveryDays: avgDeliveryDays,
        };
    });
    return {
        dashboardId: crypto.randomUUID(),
        name: `Dashboard-${new Date().toISOString()}`,
        shipmentIds,
        aggregateMetrics: {
            totalShipments: dashboardShipments.length,
            onTimeDeliveries: totalOnTime,
            delayedShipments: totalDelayed,
            exceptionCount: totalExceptions,
            averageDeliveryTime: deliveryCount > 0 ? totalDeliveryDays / deliveryCount : 0,
            costPerUnit: 0,
        },
        statusDistribution,
        exceptionBreakdown,
        carrierPerformance,
    };
}
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
function getPerformanceMetrics(shipments) {
    let totalShipments = 0;
    let deliveredShipments = 0;
    let onTimeDeliveries = 0;
    let totalDeliveryDays = 0;
    let totalExceptions = 0;
    for (const shipment of shipments) {
        totalShipments++;
        if (shipment.status === ShipmentStatus.DELIVERED || shipment.actualDelivery) {
            deliveredShipments++;
            if (shipment.actualDelivery) {
                const days = calculateDaysDifference(shipment.createdAt, shipment.actualDelivery);
                totalDeliveryDays += days;
                if (shipment.actualDelivery <= shipment.estimatedDelivery) {
                    onTimeDeliveries++;
                }
            }
        }
        totalExceptions += shipment.exceptions.length;
    }
    return {
        totalShipments,
        deliveredShipments,
        deliveryRate: (deliveredShipments / totalShipments) * 100,
        onTimeDeliveryRate: deliveredShipments > 0 ? (onTimeDeliveries / deliveredShipments) * 100 : 0,
        averageDeliveryDays: deliveredShipments > 0 ? totalDeliveryDays / deliveredShipments : 0,
        totalExceptions,
        exceptionRate: (totalExceptions / totalShipments) * 100,
        averageExceptionsPerShipment: totalShipments > 0 ? totalExceptions / totalShipments : 0,
    };
}
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
function searchShipments(shipments, criteria) {
    return shipments.filter(shipment => {
        if (criteria.shipmentId && shipment.shipmentId !== criteria.shipmentId)
            return false;
        if (criteria.shipmentNumber && shipment.shipmentNumber !== criteria.shipmentNumber)
            return false;
        if (criteria.orderId && shipment.orderId !== criteria.orderId)
            return false;
        if (criteria.carrierId && shipment.carrierId !== criteria.carrierId)
            return false;
        if (criteria.status && !criteria.status.includes(shipment.status))
            return false;
        if (criteria.createdFrom && shipment.createdAt < criteria.createdFrom)
            return false;
        if (criteria.createdTo && shipment.createdAt > criteria.createdTo)
            return false;
        if (criteria.estimatedDeliveryFrom && shipment.estimatedDelivery < criteria.estimatedDeliveryFrom)
            return false;
        if (criteria.estimatedDeliveryTo && shipment.estimatedDelivery > criteria.estimatedDeliveryTo)
            return false;
        if (criteria.hasExceptions !== undefined && (shipment.exceptions.length > 0) !== criteria.hasExceptions)
            return false;
        if (criteria.minWeight && shipment.weight < criteria.minWeight)
            return false;
        if (criteria.maxWeight && shipment.weight > criteria.maxWeight)
            return false;
        return true;
    });
}
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
function getComplianceReport(shipments) {
    let totalShipments = 0;
    let shipmentsWithProof = 0;
    let shipmentsWithMilestones = 0;
    let shipmentsWithTracking = 0;
    let shipmentsWithValidation = 0;
    for (const shipment of shipments) {
        totalShipments++;
        const hasProof = shipment.milestones.some(m => m.proofOfDelivery);
        if (hasProof)
            shipmentsWithProof++;
        if (shipment.milestones.length > 0)
            shipmentsWithMilestones++;
        if (shipment.locationHistory.length > 0)
            shipmentsWithTracking++;
        const validation = validateShipment(shipment);
        if (validation.isValid)
            shipmentsWithValidation++;
    }
    return {
        totalShipments,
        proofOfDeliveryRate: (shipmentsWithProof / totalShipments) * 100,
        milestoneCompleteness: (shipmentsWithMilestones / totalShipments) * 100,
        trackingCompleteness: (shipmentsWithTracking / totalShipments) * 100,
        validationRate: (shipmentsWithValidation / totalShipments) * 100,
        overallCompliance: ((shipmentsWithProof + shipmentsWithMilestones + shipmentsWithTracking + shipmentsWithValidation) /
            (totalShipments * 4)) * 100,
    };
}
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
function exportAnalyticsData(shipments) {
    return shipments.map(shipment => {
        const lastMilestone = shipment.milestones[shipment.milestones.length - 1];
        const lastLocation = shipment.locationHistory[shipment.locationHistory.length - 1];
        return {
            shipmentId: shipment.shipmentId,
            shipmentNumber: shipment.shipmentNumber,
            orderId: shipment.orderId,
            carrierId: shipment.carrierId,
            status: shipment.status,
            createdAt: shipment.createdAt,
            estimatedDelivery: shipment.estimatedDelivery,
            actualDelivery: shipment.actualDelivery,
            weight: shipment.weight,
            packageCount: shipment.packageCount,
            deliveryDays: shipment.actualDelivery
                ? calculateDaysDifference(shipment.createdAt, shipment.actualDelivery)
                : null,
            onTime: shipment.actualDelivery ? shipment.actualDelivery <= shipment.estimatedDelivery : null,
            milestoneCount: shipment.milestones.length,
            lastMilestoneType: lastMilestone?.type,
            lastMilestoneTime: lastMilestone?.timestamp,
            exceptionCount: shipment.exceptions.length,
            openExceptionCount: shipment.exceptions.filter(e => e.status !== 'RESOLVED' && e.status !== 'CLOSED').length,
            locationUpdates: shipment.locationHistory.length,
            currentLat: lastLocation?.location.latitude,
            currentLon: lastLocation?.location.longitude,
            distanceTraveled: calculateDistanceTraveled(shipment.locationHistory),
        };
    });
}
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
function predictShipmentStatus(shipment) {
    const elapsedHours = calculateHoursDifference(shipment.createdAt, new Date());
    const estimatedTotalHours = calculateHoursDifference(shipment.createdAt, shipment.estimatedDelivery);
    const progressPercent = (elapsedHours / estimatedTotalHours) * 100;
    let predictedStatus = ShipmentStatus.IN_TRANSIT;
    let confidence = 70;
    if (progressPercent < 20) {
        predictedStatus = ShipmentStatus.PICKED;
    }
    else if (progressPercent < 40) {
        predictedStatus = ShipmentStatus.SHIPPED;
    }
    else if (progressPercent < 80) {
        predictedStatus = ShipmentStatus.IN_TRANSIT;
    }
    else if (progressPercent < 95) {
        predictedStatus = ShipmentStatus.OUT_FOR_DELIVERY;
    }
    else {
        predictedStatus = ShipmentStatus.DELIVERED;
        confidence = 85;
    }
    // Adjust confidence based on exceptions
    if (shipment.exceptions.length > 0) {
        confidence -= 10;
    }
    return {
        currentStatus: shipment.status,
        predictedStatus,
        progressPercent: Math.min(100, progressPercent),
        confidence: Math.max(0, Math.min(100, confidence)),
        expectedDelivery: shipment.estimatedDelivery,
    };
}
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
function analyzeCosts(shipments, costModel) {
    let totalCost = 0;
    let totalWeight = 0;
    let totalDistance = 0;
    for (const shipment of shipments) {
        const baseCost = costModel.baseCost || 5;
        let shipmentCost = baseCost;
        if (costModel.costPerKg && shipment.weight) {
            shipmentCost += shipment.weight * costModel.costPerKg;
        }
        const distance = calculateDistanceTraveled(shipment.locationHistory);
        if (costModel.costPerKm && distance > 0) {
            shipmentCost += distance * costModel.costPerKm;
        }
        totalCost += shipmentCost;
        totalWeight += shipment.weight;
        totalDistance += distance;
    }
    return {
        totalCost,
        averageCostPerShipment: shipments.length > 0 ? totalCost / shipments.length : 0,
        costPerKg: totalWeight > 0 ? totalCost / totalWeight : 0,
        costPerKm: totalDistance > 0 ? totalCost / totalDistance : 0,
        totalWeightShipped: totalWeight,
        totalDistanceCovered: totalDistance,
    };
}
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
function getExecutiveSummary(shipments) {
    const performance = getPerformanceMetrics(shipments);
    const exceptions = getExceptionReport(shipments);
    const compliance = getComplianceReport(shipments);
    return {
        summary: {
            totalShipments: performance.totalShipments,
            deliveryRate: performance.deliveryRate,
            onTimeRate: performance.onTimeDeliveryRate,
            exceptionRate: performance.exceptionRate,
            complianceScore: compliance.overallCompliance,
        },
        keyMetrics: {
            averageDeliveryDays: performance.averageDeliveryDays,
            criticalExceptions: exceptions.bySeverity?.['CRITICAL'] || 0,
            openExceptions: exceptions.openExceptions,
        },
        recommendations: generateRecommendations(performance, exceptions, compliance),
        generatedAt: new Date().toISOString(),
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateShipmentNumber() {
    return `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
function generateTrackingNumber() {
    return `TRK-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}
function generateTransactionId() {
    return crypto.randomUUID();
}
function generateTransactionNumber(storeId, registerId) {
    return `${storeId}-${registerId}-${Date.now()}`;
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 3600000);
}
function calculateDaysDifference(from, to) {
    return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}
function calculateHoursDifference(from, to) {
    return (to.getTime() - from.getTime()) / (1000 * 60 * 60);
}
function calculateMinutesDifference(from, to) {
    return (to.getTime() - from.getTime()) / (1000 * 60);
}
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function generateRecommendations(performance, exceptions, compliance) {
    const recommendations = [];
    if (performance.deliveryRate < 90) {
        recommendations.push('Improve delivery rate - currently below target of 90%');
    }
    if (performance.onTimeDeliveryRate < 85) {
        recommendations.push('Address on-time delivery issues - implement carrier performance review');
    }
    if (performance.exceptionRate > 5) {
        recommendations.push('Reduce exception rate - conduct root cause analysis on top exception types');
    }
    if ((exceptions.bySeverity?.['CRITICAL'] || 0) > 0) {
        recommendations.push('Address critical exceptions immediately - risk to customer satisfaction');
    }
    if (compliance.overallCompliance < 95) {
        recommendations.push('Improve compliance metrics - ensure all shipments have complete documentation');
    }
    return recommendations.length > 0 ? recommendations : ['Operations performing within targets'];
}
//# sourceMappingURL=supply-chain-visibility-kit.js.map