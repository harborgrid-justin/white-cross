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

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Shipment status enumeration
 */
export enum ShipmentStatus {
  CREATED = 'CREATED',
  PICKED = 'PICKED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  HELD = 'HELD',
  EXCEPTION = 'EXCEPTION',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

/**
 * Milestone type enumeration
 */
export enum MilestoneType {
  ORDER_PLACED = 'ORDER_PLACED',
  PICK_INITIATED = 'PICK_INITIATED',
  PICK_COMPLETED = 'PICK_COMPLETED',
  PACK_INITIATED = 'PACK_INITIATED',
  PACK_COMPLETED = 'PACK_COMPLETED',
  LABEL_CREATED = 'LABEL_CREATED',
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERY_ATTEMPTED = 'DELIVERY_ATTEMPTED',
  DELIVERED = 'DELIVERED',
  EXCEPTION_OCCURRED = 'EXCEPTION_OCCURRED',
  EXCEPTION_RESOLVED = 'EXCEPTION_RESOLVED',
  RETURNED = 'RETURNED',
}

/**
 * Exception type enumeration
 */
export enum ExceptionType {
  DELAY = 'DELAY',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED',
  CUSTOMS_HOLD = 'CUSTOMS_HOLD',
  ADDRESS_ISSUE = 'ADDRESS_ISSUE',
  WEATHER = 'WEATHER',
  MECHANICAL = 'MECHANICAL',
  DRIVER_UNAVAILABLE = 'DRIVER_UNAVAILABLE',
  RECIPIENT_UNAVAILABLE = 'RECIPIENT_UNAVAILABLE',
  RETURNED_TO_ORIGIN = 'RETURNED_TO_ORIGIN',
  DOCUMENT_MISSING = 'DOCUMENT_MISSING',
  DISCREPANCY = 'DISCREPANCY',
}

/**
 * Location source enumeration
 */
export enum LocationSource {
  GPS = 'GPS',
  CELL_TOWER = 'CELL_TOWER',
  WIFI = 'WIFI',
  GEOFENCE = 'GEOFENCE',
  SCAN = 'SCAN',
  MANUAL = 'MANUAL',
  CARRIER_API = 'CARRIER_API',
}

/**
 * Location coordinates with accuracy
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
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
  heading?: number; // degrees
  speed?: number; // km/h
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
  weight: number; // kg
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
  flushInterval?: number; // milliseconds
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
  updateInterval: number; // milliseconds
  enableExceptionDetection: boolean;
  exceptionThresholds: {
    delayHours: number;
    minLocationUpdates: number;
  };
  enableGeofencing: boolean;
  geofenceRadius: number; // meters
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
export function createShipment(shipmentData: Partial<Shipment>): Shipment {
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
export function updateShipmentStatus(
  shipment: Shipment,
  newStatus: ShipmentStatus,
  reason: string
): Shipment {
  const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
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
export function getTrackingDetails(shipment: Shipment): object {
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
export function addScanEvent(
  shipment: Shipment,
  scanCode: string,
  location: GeoLocation
): Shipment {
  const milestone: Milestone = {
    milestoneId: crypto.randomUUID(),
    shipmentId: shipment.shipmentId,
    type: MilestoneType.IN_TRANSIT,
    timestamp: location.timestamp,
    location,
    notes: `Scan event: ${scanCode}`,
  };

  const locationUpdate: LocationUpdate = {
    locationUpdateId: crypto.randomUUID(),
    shipmentId: shipment.shipmentId,
    location,
  };

  const event: VisibilityEvent = {
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
export function estimateDelivery(
  shipment: Shipment,
  avgDeliveryHours: number
): object {
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
export function findByTrackingNumber(
  shipments: Shipment[],
  trackingNumber: string
): Shipment | undefined {
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
export function validateShipment(shipment: Shipment): object {
  const errors: string[] = [];

  if (!shipment.shipmentId) errors.push('Missing shipmentId');
  if (!shipment.orderId) errors.push('Missing orderId');
  if (!shipment.originWarehouseId) errors.push('Missing originWarehouseId');
  if (!shipment.destinationFacilityId) errors.push('Missing destinationFacilityId');
  if (!shipment.carrierId) errors.push('Missing carrierId');
  if (shipment.weight <= 0) errors.push('Weight must be positive');
  if (shipment.packageCount <= 0) errors.push('Package count must be positive');
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
export function markAsDelivered(
  shipment: Shipment,
  recipientName: string,
  proof?: { signatureUrl?: string; photoUrl?: string }
): Shipment {
  const milestone: Milestone = {
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

  const event: VisibilityEvent = {
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
export function recordMilestone(
  shipment: Shipment,
  type: MilestoneType,
  data?: Partial<Milestone>
): Shipment {
  const milestone: Milestone = {
    milestoneId: crypto.randomUUID(),
    shipmentId: shipment.shipmentId,
    type,
    timestamp: data?.timestamp || new Date(),
    location: data?.location,
    notes: data?.notes,
    proofOfDelivery: data?.proofOfDelivery,
    metadata: data?.metadata,
  };

  const event: VisibilityEvent = {
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
export function getMilestonesByDateRange(
  shipment: Shipment,
  from: Date,
  to: Date
): Milestone[] {
  return shipment.milestones.filter(
    m => m.timestamp >= from && m.timestamp <= to
  );
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
export function getMilestonesByType(
  shipment: Shipment,
  type: MilestoneType
): Milestone[] {
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
export function calculateMilestoneDuration(
  milestones: Milestone[],
  from: MilestoneType,
  to: MilestoneType
): number {
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
export function validateMilestoneSequence(milestones: Milestone[]): object {
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

  const errors: string[] = [];
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
export function getLastMilestone(
  shipment: Shipment,
  type: MilestoneType
): Milestone | undefined {
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
export function getMilestoneSummary(shipment: Shipment): object {
  const milestoneTypeMap = new Map<MilestoneType, number>();

  for (const milestone of shipment.milestones) {
    milestoneTypeMap.set(
      milestone.type,
      (milestoneTypeMap.get(milestone.type) || 0) + 1
    );
  }

  const milestoneBreakdown: Record<string, number> = {};
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
export function acknowledgeMilestones(
  shipment: Shipment,
  milestoneIds: string[],
  acknowledged: boolean = true
): Shipment {
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
export function createException(
  shipment: Shipment,
  type: ExceptionType,
  data?: Partial<Exception>
): Shipment {
  const exception: Exception = {
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

  const event: VisibilityEvent = {
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
export function updateExceptionStatus(
  shipment: Shipment,
  exceptionId: string,
  newStatus: 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
  resolution?: string
): Shipment {
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
export function detectDelay(
  shipment: Shipment,
  delayThresholdHours: number
): object {
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
export function getOpenExceptions(shipment: Shipment): Exception[] {
  return shipment.exceptions.filter(
    e => e.status !== 'RESOLVED' && e.status !== 'CLOSED'
  );
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
export function hasCriticalExceptions(shipment: Shipment): boolean {
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
export function getExceptionReport(shipments: Shipment[]): object {
  const exceptionTypeMap = new Map<ExceptionType, number>();
  const severityMap = new Map<string, number>();
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
      } else {
        totalOpen++;
      }
    }
  }

  const byType: Record<string, number> = {};
  exceptionTypeMap.forEach((count, type) => {
    byType[type] = count;
  });

  const bySeverity: Record<string, number> = {};
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
export function escalateException(
  shipment: Shipment,
  exceptionId: string,
  escalationReason: string
): Shipment {
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
export function predictExceptionRisk(
  shipment: Shipment,
  historicalData?: { avgDelayHours: number; exceptionRate: number }
): object {
  let riskScore = 0;
  const likelyExceptions: ExceptionType[] = [];

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
export function updateLocation(
  shipment: Shipment,
  location: GeoLocation
): Shipment {
  const locationUpdate: LocationUpdate = {
    locationUpdateId: crypto.randomUUID(),
    shipmentId: shipment.shipmentId,
    location,
  };

  const event: VisibilityEvent = {
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
export function calculateDistanceTraveled(locationHistory: LocationUpdate[]): number {
  if (locationHistory.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 1; i < locationHistory.length; i++) {
    const prev = locationHistory[i - 1].location;
    const curr = locationHistory[i].location;

    totalDistance += calculateHaversineDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );
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
export function getLocationsByBounds(
  locationHistory: LocationUpdate[],
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number
): LocationUpdate[] {
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
export function checkGeofence(
  currentLocation: GeoLocation,
  geofenceCenter: GeoLocation,
  radiusKm: number
): object {
  const distance = calculateHaversineDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    geofenceCenter.latitude,
    geofenceCenter.longitude
  );

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
export function getAverageSpeed(shipment: Shipment): number {
  if (shipment.locationHistory.length < 2) {
    return 0;
  }

  const firstLocation = shipment.locationHistory[0].location;
  const lastLocation = shipment.locationHistory[shipment.locationHistory.length - 1].location;

  const distance = calculateHaversineDistance(
    firstLocation.latitude,
    firstLocation.longitude,
    lastLocation.latitude,
    lastLocation.longitude
  );

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
export function getLatestLocation(shipment: Shipment): object {
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
export function streamLocationUpdates(
  shipment: Shipment,
  config: EventStreamConfig
): VisibilityEvent[] {
  return shipment.events.filter(
    event => config.eventTypes.includes(event.eventType)
  );
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
export function detectLocationAnomalies(
  shipment: Shipment,
  maxSpeedKmh: number = 120
): object {
  const anomalies: Array<{ type: string; description: string; timestamp: Date }> = [];

  for (let i = 1; i < shipment.locationHistory.length; i++) {
    const prev = shipment.locationHistory[i - 1];
    const curr = shipment.locationHistory[i];

    const distance = calculateHaversineDistance(
      prev.location.latitude,
      prev.location.longitude,
      curr.location.latitude,
      curr.location.longitude
    );

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
export function createDashboard(
  shipmentIds: string[],
  shipments: Shipment[]
): VisibilityDashboard {
  const dashboardShipments = shipments.filter(s => shipmentIds.includes(s.shipmentId));

  const statusMap = new Map<ShipmentStatus, number>();
  const exceptionMap = new Map<ExceptionType, number>();
  const carrierMap = new Map<string, { onTime: number; total: number; deliveryDays: number[] }>();

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
      } else {
        totalDelayed++;
      }
    }

    // Carrier performance
    const carrierKey = `${shipment.carrierId}`;
    if (!carrierMap.has(carrierKey)) {
      carrierMap.set(carrierKey, { onTime: 0, total: 0, deliveryDays: [] });
    }
    const stats = carrierMap.get(carrierKey)!;
    stats.total++;
    if (shipment.actualDelivery && shipment.actualDelivery <= shipment.estimatedDelivery) {
      stats.onTime++;
    }
    if (shipment.actualDelivery) {
      stats.deliveryDays.push(calculateDaysDifference(shipment.createdAt, shipment.actualDelivery));
    }
  }

  const statusDistribution: Record<ShipmentStatus, number> = {} as Record<ShipmentStatus, number>;
  statusMap.forEach((count, status) => {
    statusDistribution[status] = count;
  });

  const exceptionBreakdown: Record<ExceptionType, number> = {} as Record<ExceptionType, number>;
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
export function getPerformanceMetrics(shipments: Shipment[]): object {
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
export function searchShipments(
  shipments: Shipment[],
  criteria: ShipmentSearchCriteria
): Shipment[] {
  return shipments.filter(shipment => {
    if (criteria.shipmentId && shipment.shipmentId !== criteria.shipmentId) return false;
    if (criteria.shipmentNumber && shipment.shipmentNumber !== criteria.shipmentNumber) return false;
    if (criteria.orderId && shipment.orderId !== criteria.orderId) return false;
    if (criteria.carrierId && shipment.carrierId !== criteria.carrierId) return false;
    if (criteria.status && !criteria.status.includes(shipment.status)) return false;
    if (criteria.createdFrom && shipment.createdAt < criteria.createdFrom) return false;
    if (criteria.createdTo && shipment.createdAt > criteria.createdTo) return false;
    if (criteria.estimatedDeliveryFrom && shipment.estimatedDelivery < criteria.estimatedDeliveryFrom) return false;
    if (criteria.estimatedDeliveryTo && shipment.estimatedDelivery > criteria.estimatedDeliveryTo) return false;
    if (criteria.hasExceptions !== undefined && (shipment.exceptions.length > 0) !== criteria.hasExceptions) return false;
    if (criteria.minWeight && shipment.weight < criteria.minWeight) return false;
    if (criteria.maxWeight && shipment.weight > criteria.maxWeight) return false;

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
export function getComplianceReport(shipments: Shipment[]): object {
  let totalShipments = 0;
  let shipmentsWithProof = 0;
  let shipmentsWithMilestones = 0;
  let shipmentsWithTracking = 0;
  let shipmentsWithValidation = 0;

  for (const shipment of shipments) {
    totalShipments++;

    const hasProof = shipment.milestones.some(m => m.proofOfDelivery);
    if (hasProof) shipmentsWithProof++;

    if (shipment.milestones.length > 0) shipmentsWithMilestones++;
    if (shipment.locationHistory.length > 0) shipmentsWithTracking++;

    const validation = validateShipment(shipment);
    if ((validation as any).isValid) shipmentsWithValidation++;
  }

  return {
    totalShipments,
    proofOfDeliveryRate: (shipmentsWithProof / totalShipments) * 100,
    milestoneCompleteness: (shipmentsWithMilestones / totalShipments) * 100,
    trackingCompleteness: (shipmentsWithTracking / totalShipments) * 100,
    validationRate: (shipmentsWithValidation / totalShipments) * 100,
    overallCompliance: (
      (shipmentsWithProof + shipmentsWithMilestones + shipmentsWithTracking + shipmentsWithValidation) /
      (totalShipments * 4)
    ) * 100,
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
export function exportAnalyticsData(shipments: Shipment[]): object[] {
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
export function predictShipmentStatus(shipment: Shipment): object {
  const elapsedHours = calculateHoursDifference(shipment.createdAt, new Date());
  const estimatedTotalHours = calculateHoursDifference(shipment.createdAt, shipment.estimatedDelivery);
  const progressPercent = (elapsedHours / estimatedTotalHours) * 100;

  let predictedStatus = ShipmentStatus.IN_TRANSIT;
  let confidence = 70;

  if (progressPercent < 20) {
    predictedStatus = ShipmentStatus.PICKED;
  } else if (progressPercent < 40) {
    predictedStatus = ShipmentStatus.SHIPPED;
  } else if (progressPercent < 80) {
    predictedStatus = ShipmentStatus.IN_TRANSIT;
  } else if (progressPercent < 95) {
    predictedStatus = ShipmentStatus.OUT_FOR_DELIVERY;
  } else {
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
export function analyzeCosts(
  shipments: Shipment[],
  costModel: { costPerKg?: number; costPerKm?: number; baseCost?: number }
): object {
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
export function getExecutiveSummary(shipments: Shipment[]): object {
  const performance = getPerformanceMetrics(shipments);
  const exceptions = getExceptionReport(shipments);
  const compliance = getComplianceReport(shipments);

  return {
    summary: {
      totalShipments: (performance as any).totalShipments,
      deliveryRate: (performance as any).deliveryRate,
      onTimeRate: (performance as any).onTimeDeliveryRate,
      exceptionRate: (performance as any).exceptionRate,
      complianceScore: (compliance as any).overallCompliance,
    },
    keyMetrics: {
      averageDeliveryDays: (performance as any).averageDeliveryDays,
      criticalExceptions: (exceptions as any).bySeverity?.['CRITICAL'] || 0,
      openExceptions: (exceptions as any).openExceptions,
    },
    recommendations: generateRecommendations(performance as any, exceptions as any, compliance as any),
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateShipmentNumber(): string {
  return `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateTrackingNumber(): string {
  return `TRK-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

function generateTransactionId(): string {
  return crypto.randomUUID();
}

function generateTransactionNumber(storeId: string, registerId: string): string {
  return `${storeId}-${registerId}-${Date.now()}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3600000);
}

function calculateDaysDifference(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function calculateHoursDifference(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (1000 * 60 * 60);
}

function calculateMinutesDifference(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (1000 * 60);
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function generateRecommendations(performance: any, exceptions: any, compliance: any): string[] {
  const recommendations: string[] = [];

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
