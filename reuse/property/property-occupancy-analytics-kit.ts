/**
 * LOC: PROP-OA-001
 * File: /reuse/property/property-occupancy-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Space utilization systems
 *   - Occupancy monitoring modules
 */

/**
 * File: /reuse/property/property-occupancy-analytics-kit.ts
 * Locator: WC-PROP-OA-001
 * Purpose: Occupancy Analytics Kit - Comprehensive occupancy tracking, space utilization, and capacity planning
 *
 * Upstream: Independent utility module for property occupancy operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for occupancy tracking, analytics, forecasting, and optimization
 *
 * LLM Context: Enterprise-grade occupancy analytics utilities for property management systems.
 * Provides real-time occupancy tracking, space utilization analytics, trend analysis, peak identification,
 * sensor integration, badge swipe analytics, desk monitoring, density calculations, forecasting, and
 * capacity planning. Essential for optimizing space usage, improving workplace experience, reducing
 * real estate costs, and making data-driven space planning decisions.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface OccupancySensor {
  id: string;
  propertyId: string;
  spaceId: string;
  spaceName: string;
  sensorType: SensorType;
  location: string;
  installDate: Date;
  lastCalibration?: Date;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  batteryLevel?: number; // Percentage for wireless sensors
  signalStrength?: number; // -dBm for wireless sensors
  detectionRange: number; // meters
  accuracy: number; // percentage
  updateFrequency: number; // seconds
  metadata?: Record<string, unknown>;
}

type SensorType =
  | 'pir_motion'           // Passive Infrared
  | 'ultrasonic'           // Ultrasonic distance
  | 'thermal'              // Thermal imaging
  | 'co2'                  // CO2 levels (proxy for occupancy)
  | 'camera_ai'            // AI-powered camera
  | 'pressure_mat'         // Floor pressure
  | 'desk_sensor'          // Desk-mounted sensor
  | 'door_sensor'          // Door entry/exit
  | 'wifi_probe'           // WiFi device detection
  | 'bluetooth_beacon';    // Bluetooth presence

interface OccupancyReading {
  id: string;
  sensorId: string;
  spaceId: string;
  timestamp: Date;
  occupantCount: number;
  capacity: number;
  utilizationRate: number; // 0-100 percentage
  confidence: number; // 0-100 percentage
  rawValue?: number;
  isEstimated: boolean;
  anomalyDetected?: boolean;
  metadata?: Record<string, unknown>;
}

interface SpaceOccupancy {
  spaceId: string;
  spaceName: string;
  spaceType: SpaceType;
  floor: string;
  building: string;
  capacity: number;
  currentOccupancy: number;
  utilizationRate: number; // 0-100 percentage
  status: OccupancyStatus;
  lastUpdated: Date;
  sensors: string[]; // Sensor IDs
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  peakOccupancy?: {
    count: number;
    timestamp: Date;
  };
}

type SpaceType =
  | 'office'
  | 'desk'
  | 'meeting_room'
  | 'conference_room'
  | 'huddle_room'
  | 'collaboration_space'
  | 'cafeteria'
  | 'lobby'
  | 'common_area'
  | 'breakroom'
  | 'gym'
  | 'parking'
  | 'phone_booth'
  | 'focus_room';

type OccupancyStatus =
  | 'vacant'      // 0% occupied
  | 'low'         // 1-25%
  | 'moderate'    // 26-50%
  | 'high'        // 51-75%
  | 'near_full'   // 76-95%
  | 'full'        // 96-100%
  | 'over_capacity'; // >100%

interface BadgeSwipeEvent {
  id: string;
  badgeId: string;
  employeeId: string;
  employeeName?: string;
  department?: string;
  readerId: string;
  readerLocation: string;
  spaceId?: string;
  eventType: 'entry' | 'exit' | 'access_denied';
  timestamp: Date;
  direction?: 'in' | 'out';
  tailgatingDetected?: boolean;
  metadata?: Record<string, unknown>;
}

interface DeskOccupancy {
  deskId: string;
  deskName: string;
  floor: string;
  zone: string;
  neighborhood?: string;
  assignedTo?: string; // Employee ID for assigned desks
  currentOccupant?: string; // Employee ID
  status: 'vacant' | 'occupied' | 'reserved' | 'unavailable';
  lastOccupied?: Date;
  occupancyDuration?: number; // minutes
  utilizationToday: number; // minutes
  reservationId?: string;
  sensorId?: string;
  amenities?: string[];
}

interface OccupancyTrend {
  spaceId: string;
  spaceName: string;
  period: DateRange;
  dataPoints: Array<{
    timestamp: Date;
    averageOccupancy: number;
    peakOccupancy: number;
    utilizationRate: number;
  }>;
  averageUtilization: number;
  peakUtilization: number;
  trendLine: {
    slope: number;
    direction: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
  };
  patterns: OccupancyPattern[];
}

interface OccupancyPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  description: string;
  peakTimes: Array<{ time: string; dayOfWeek?: number; avgOccupancy: number }>;
  lowTimes: Array<{ time: string; dayOfWeek?: number; avgOccupancy: number }>;
  confidence: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

interface DensityMetrics {
  spaceId: string;
  spaceName: string;
  timestamp: Date;
  area: number; // square feet/meters
  occupantCount: number;
  density: number; // occupants per area unit
  densityRating: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high' | 'overcrowded';
  recommendedCapacity: number;
  currentCapacity: number;
  safetyCompliance: boolean;
  recommendations?: string[];
}

interface OccupancyForecast {
  spaceId: string;
  spaceName: string;
  forecastDate: Date;
  forecastPeriod: DateRange;
  predictions: Array<{
    timestamp: Date;
    predictedOccupancy: number;
    predictedUtilization: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
    confidence: number;
  }>;
  forecastModel: 'time_series' | 'machine_learning' | 'statistical' | 'hybrid';
  accuracy?: number; // Historical accuracy if available
  factors: string[]; // Factors considered (e.g., 'historical_patterns', 'events', 'seasonality')
}

interface CapacityPlan {
  id: string;
  propertyId: string;
  planName: string;
  effectiveDate: Date;
  currentState: {
    totalSpaces: number;
    totalCapacity: number;
    averageUtilization: number;
    underutilizedSpaces: number;
    overutilizedSpaces: number;
  };
  recommendations: Array<{
    type: CapacityAction;
    spaceId: string;
    spaceName: string;
    currentCapacity: number;
    recommendedCapacity: number;
    rationale: string;
    impact: {
      capacityChange: number;
      utilizationImprovement: number;
      costImplication?: number;
    };
    priority: 'critical' | 'high' | 'medium' | 'low';
    implementationEffort: 'easy' | 'moderate' | 'complex';
  }>;
  targetUtilization: number; // 0-100 percentage
  projectedSavings?: number;
}

type CapacityAction =
  | 'increase_capacity'
  | 'decrease_capacity'
  | 'repurpose_space'
  | 'consolidate_spaces'
  | 'add_flexible_seating'
  | 'convert_to_hotdesk'
  | 'create_collaboration_zone'
  | 'decommission_space';

interface OccupancyAlert {
  id: string;
  spaceId: string;
  spaceName: string;
  alertType: AlertType;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  currentValue: number;
  threshold: number;
  triggeredAt: Date;
  resolvedAt?: Date;
  isResolved: boolean;
  actionTaken?: string;
  notificationsSent?: string[];
}

type AlertType =
  | 'over_capacity'
  | 'near_capacity'
  | 'safety_violation'
  | 'sensor_malfunction'
  | 'unusual_pattern'
  | 'low_utilization'
  | 'high_density'
  | 'prolonged_vacancy';

interface UtilizationReport {
  reportId: string;
  propertyId: string;
  reportPeriod: DateRange;
  generatedAt: Date;
  summary: {
    totalSpaces: number;
    averageUtilization: number;
    peakUtilization: number;
    totalOccupancyHours: number;
    utilizationBySpaceType: Record<SpaceType, number>;
    utilizationByFloor: Record<string, number>;
  };
  topPerformers: Array<{ spaceId: string; spaceName: string; utilization: number }>;
  underperformers: Array<{ spaceId: string; spaceName: string; utilization: number }>;
  insights: string[];
  recommendations: string[];
}

interface PeakOccupancyAnalysis {
  spaceId: string;
  spaceName: string;
  analysisPeriod: DateRange;
  peakOccupancy: {
    count: number;
    timestamp: Date;
    utilizationRate: number;
  };
  peakPatterns: Array<{
    dayOfWeek: number; // 0-6
    timeRange: string; // e.g., "10:00-11:00"
    averagePeak: number;
    frequency: number; // How often this peak occurs
  }>;
  capacityAdequacy: 'insufficient' | 'adequate' | 'excessive';
  recommendations: string[];
}

interface OccupancyHeatmap {
  propertyId: string;
  floor?: string;
  timestamp: Date;
  timeRange: DateRange;
  resolution: 'hourly' | 'daily' | 'weekly';
  data: Array<{
    spaceId: string;
    spaceName: string;
    coordinates?: { x: number; y: number }; // For visual mapping
    utilizationByPeriod: Record<string, number>; // timestamp -> utilization
    averageUtilization: number;
    heatmapValue: number; // Normalized 0-100 for color coding
  }>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Registers a new occupancy sensor in the system.
 *
 * @param {Partial<OccupancySensor>} sensorData - Sensor configuration data
 * @returns {OccupancySensor} Registered sensor record
 *
 * @example
 * ```typescript
 * const sensor = registerOccupancySensor({
 *   propertyId: 'PROP-001',
 *   spaceId: 'SPACE-101',
 *   spaceName: 'Conference Room A',
 *   sensorType: 'pir_motion',
 *   location: 'Floor 3, East Wing',
 *   detectionRange: 8,
 *   accuracy: 95,
 *   updateFrequency: 60
 * });
 * ```
 */
export const registerOccupancySensor = (sensorData: Partial<OccupancySensor>): OccupancySensor => {
  return {
    id: sensorData.id || `SENSOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId: sensorData.propertyId!,
    spaceId: sensorData.spaceId!,
    spaceName: sensorData.spaceName!,
    sensorType: sensorData.sensorType!,
    location: sensorData.location!,
    installDate: sensorData.installDate || new Date(),
    lastCalibration: sensorData.lastCalibration,
    status: sensorData.status || 'active',
    batteryLevel: sensorData.batteryLevel,
    signalStrength: sensorData.signalStrength,
    detectionRange: sensorData.detectionRange || 5,
    accuracy: sensorData.accuracy || 90,
    updateFrequency: sensorData.updateFrequency || 60,
    metadata: sensorData.metadata || {},
  };
};

/**
 * Records an occupancy reading from a sensor.
 *
 * @param {string} sensorId - Sensor identifier
 * @param {string} spaceId - Space identifier
 * @param {number} occupantCount - Number of occupants detected
 * @param {number} capacity - Space capacity
 * @param {number} confidence - Confidence level (0-100)
 * @returns {OccupancyReading} Occupancy reading record
 *
 * @example
 * ```typescript
 * const reading = recordOccupancyReading(
 *   'SENSOR-123',
 *   'SPACE-101',
 *   8,
 *   12,
 *   95
 * );
 * // Returns: { occupantCount: 8, utilizationRate: 66.67, ... }
 * ```
 */
export const recordOccupancyReading = (
  sensorId: string,
  spaceId: string,
  occupantCount: number,
  capacity: number,
  confidence: number,
  isEstimated = false,
): OccupancyReading => {
  const utilizationRate = capacity > 0 ? (occupantCount / capacity) * 100 : 0;

  return {
    id: `READ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sensorId,
    spaceId,
    timestamp: new Date(),
    occupantCount: Math.max(0, Math.floor(occupantCount)),
    capacity,
    utilizationRate: Math.min(100, Math.round(utilizationRate * 100) / 100),
    confidence: Math.min(100, Math.max(0, confidence)),
    isEstimated,
    anomalyDetected: false,
  };
};

/**
 * Calculates current space occupancy status based on latest readings.
 *
 * @param {OccupancyReading[]} readings - Recent occupancy readings
 * @param {string} spaceId - Space identifier
 * @param {string} spaceName - Space name
 * @param {SpaceType} spaceType - Space type
 * @param {number} capacity - Space capacity
 * @returns {SpaceOccupancy} Current space occupancy status
 *
 * @example
 * ```typescript
 * const occupancy = calculateSpaceOccupancy(
 *   recentReadings,
 *   'SPACE-101',
 *   'Conference Room A',
 *   'meeting_room',
 *   12
 * );
 * // Returns: { currentOccupancy: 8, utilizationRate: 66.67, status: 'high', ... }
 * ```
 */
export const calculateSpaceOccupancy = (
  readings: OccupancyReading[],
  spaceId: string,
  spaceName: string,
  spaceType: SpaceType,
  capacity: number,
  floor = 'Unknown',
  building = 'Unknown',
): SpaceOccupancy => {
  if (readings.length === 0) {
    return {
      spaceId,
      spaceName,
      spaceType,
      floor,
      building,
      capacity,
      currentOccupancy: 0,
      utilizationRate: 0,
      status: 'vacant',
      lastUpdated: new Date(),
      sensors: [],
      trendDirection: 'stable',
    };
  }

  // Sort by timestamp, most recent first
  const sortedReadings = [...readings].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const latestReading = sortedReadings[0];
  const currentOccupancy = latestReading.occupantCount;
  const utilizationRate = (currentOccupancy / capacity) * 100;

  // Determine occupancy status
  let status: OccupancyStatus;
  if (utilizationRate === 0) status = 'vacant';
  else if (utilizationRate <= 25) status = 'low';
  else if (utilizationRate <= 50) status = 'moderate';
  else if (utilizationRate <= 75) status = 'high';
  else if (utilizationRate <= 95) status = 'near_full';
  else if (utilizationRate <= 100) status = 'full';
  else status = 'over_capacity';

  // Determine trend direction
  let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (sortedReadings.length >= 3) {
    const recent = sortedReadings.slice(0, 3).map(r => r.occupantCount);
    const avgChange = (recent[0] - recent[2]) / 2;
    if (avgChange > 1) trendDirection = 'increasing';
    else if (avgChange < -1) trendDirection = 'decreasing';
  }

  // Find peak occupancy
  const peakReading = sortedReadings.reduce((max, r) =>
    r.occupantCount > max.occupantCount ? r : max
  , sortedReadings[0]);

  const uniqueSensors = [...new Set(readings.map(r => r.sensorId))];

  return {
    spaceId,
    spaceName,
    spaceType,
    floor,
    building,
    capacity,
    currentOccupancy,
    utilizationRate: Math.round(utilizationRate * 100) / 100,
    status,
    lastUpdated: latestReading.timestamp,
    sensors: uniqueSensors,
    trendDirection,
    peakOccupancy: {
      count: peakReading.occupantCount,
      timestamp: peakReading.timestamp,
    },
  };
};

/**
 * Detects anomalies in occupancy readings.
 *
 * @param {OccupancyReading} reading - Current reading
 * @param {OccupancyReading[]} historicalReadings - Historical readings
 * @returns {object} Anomaly detection result
 *
 * @example
 * ```typescript
 * const anomaly = detectOccupancyAnomaly(currentReading, historicalData);
 * if (anomaly.isAnomaly) {
 *   console.log('Detected anomalies:', anomaly.anomalies);
 * }
 * ```
 */
export const detectOccupancyAnomaly = (
  reading: OccupancyReading,
  historicalReadings: OccupancyReading[],
): {
  isAnomaly: boolean;
  anomalies: string[];
  severity: 'low' | 'medium' | 'high';
  confidence: number;
} => {
  const anomalies: string[] = [];

  // Check for over-capacity
  if (reading.occupantCount > reading.capacity) {
    anomalies.push(`Over capacity: ${reading.occupantCount} occupants in ${reading.capacity} capacity space`);
  }

  // Check for extremely low confidence
  if (reading.confidence < 50) {
    anomalies.push(`Low confidence reading: ${reading.confidence}%`);
  }

  if (historicalReadings.length >= 10) {
    const avgOccupancy = historicalReadings.reduce((sum, r) => sum + r.occupantCount, 0) / historicalReadings.length;
    const stdDev = Math.sqrt(
      historicalReadings.reduce((sum, r) => sum + Math.pow(r.occupantCount - avgOccupancy, 2), 0) / historicalReadings.length
    );

    // Check for statistical outliers (>3 standard deviations)
    const zScore = Math.abs((reading.occupantCount - avgOccupancy) / stdDev);
    if (zScore > 3) {
      anomalies.push(`Statistical outlier: ${reading.occupantCount} occupants (${zScore.toFixed(2)} std dev from mean)`);
    }

    // Check for sudden spikes
    const recentAvg = historicalReadings.slice(-5).reduce((sum, r) => sum + r.occupantCount, 0) / 5;
    if (reading.occupantCount > recentAvg * 2) {
      anomalies.push(`Sudden spike: ${reading.occupantCount} vs recent average ${recentAvg.toFixed(1)}`);
    }
  }

  const isAnomaly = anomalies.length > 0;
  const severity: 'low' | 'medium' | 'high' =
    anomalies.length >= 3 ? 'high' : anomalies.length >= 2 ? 'medium' : 'low';

  return {
    isAnomaly,
    anomalies,
    severity,
    confidence: reading.confidence,
  };
};

/**
 * Processes badge swipe event for occupancy tracking.
 *
 * @param {Partial<BadgeSwipeEvent>} eventData - Badge swipe event data
 * @returns {BadgeSwipeEvent} Processed badge swipe event
 *
 * @example
 * ```typescript
 * const swipeEvent = processBadgeSwipe({
 *   badgeId: 'BADGE-12345',
 *   employeeId: 'EMP-001',
 *   readerId: 'READER-FL3-EAST',
 *   readerLocation: 'Floor 3 East Entrance',
 *   eventType: 'entry',
 *   direction: 'in'
 * });
 * ```
 */
export const processBadgeSwipe = (eventData: Partial<BadgeSwipeEvent>): BadgeSwipeEvent => {
  return {
    id: eventData.id || `SWIPE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    badgeId: eventData.badgeId!,
    employeeId: eventData.employeeId!,
    employeeName: eventData.employeeName,
    department: eventData.department,
    readerId: eventData.readerId!,
    readerLocation: eventData.readerLocation!,
    spaceId: eventData.spaceId,
    eventType: eventData.eventType!,
    timestamp: eventData.timestamp || new Date(),
    direction: eventData.direction,
    tailgatingDetected: eventData.tailgatingDetected || false,
    metadata: eventData.metadata || {},
  };
};

/**
 * Aggregates badge swipe data to estimate occupancy.
 *
 * @param {BadgeSwipeEvent[]} swipeEvents - Badge swipe events
 * @param {string} spaceId - Space identifier
 * @param {DateRange} timeRange - Time range for analysis
 * @returns {object} Occupancy estimate from badge data
 *
 * @example
 * ```typescript
 * const estimate = aggregateBadgeOccupancy(
 *   swipeEvents,
 *   'SPACE-FL3',
 *   { start: new Date('2024-01-01T08:00'), end: new Date('2024-01-01T17:00') }
 * );
 * // Returns: { estimatedOccupancy: 45, entries: 52, exits: 48, ... }
 * ```
 */
export const aggregateBadgeOccupancy = (
  swipeEvents: BadgeSwipeEvent[],
  spaceId: string,
  timeRange: DateRange,
): {
  estimatedOccupancy: number;
  totalEntries: number;
  totalExits: number;
  uniqueVisitors: number;
  averageDwellTime?: number; // minutes
  peakOccupancy: number;
  peakTime?: Date;
} => {
  const relevantEvents = swipeEvents.filter(
    e => (!e.spaceId || e.spaceId === spaceId) &&
         e.timestamp >= timeRange.start &&
         e.timestamp <= timeRange.end &&
         e.eventType !== 'access_denied'
  );

  const entries = relevantEvents.filter(e => e.direction === 'in' || e.eventType === 'entry');
  const exits = relevantEvents.filter(e => e.direction === 'out' || e.eventType === 'exit');
  const uniqueVisitors = new Set(relevantEvents.map(e => e.employeeId)).size;

  // Calculate estimated current occupancy (entries - exits)
  const estimatedOccupancy = Math.max(0, entries.length - exits.length);

  // Calculate peak occupancy by replaying events chronologically
  const sortedEvents = [...relevantEvents].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  let currentCount = 0;
  let peakOccupancy = 0;
  let peakTime: Date | undefined;

  sortedEvents.forEach(event => {
    if (event.direction === 'in' || event.eventType === 'entry') {
      currentCount++;
    } else if (event.direction === 'out' || event.eventType === 'exit') {
      currentCount = Math.max(0, currentCount - 1);
    }

    if (currentCount > peakOccupancy) {
      peakOccupancy = currentCount;
      peakTime = event.timestamp;
    }
  });

  return {
    estimatedOccupancy,
    totalEntries: entries.length,
    totalExits: exits.length,
    uniqueVisitors,
    peakOccupancy,
    peakTime,
  };
};

/**
 * Updates desk occupancy status.
 *
 * @param {Partial<DeskOccupancy>} deskData - Desk occupancy data
 * @returns {DeskOccupancy} Desk occupancy record
 *
 * @example
 * ```typescript
 * const desk = updateDeskOccupancy({
 *   deskId: 'DESK-3E-042',
 *   deskName: 'Desk 42',
 *   floor: '3',
 *   zone: 'East',
 *   status: 'occupied',
 *   currentOccupant: 'EMP-123',
 *   utilizationToday: 240
 * });
 * ```
 */
export const updateDeskOccupancy = (deskData: Partial<DeskOccupancy>): DeskOccupancy => {
  return {
    deskId: deskData.deskId!,
    deskName: deskData.deskName!,
    floor: deskData.floor!,
    zone: deskData.zone!,
    neighborhood: deskData.neighborhood,
    assignedTo: deskData.assignedTo,
    currentOccupant: deskData.currentOccupant,
    status: deskData.status || 'vacant',
    lastOccupied: deskData.lastOccupied,
    occupancyDuration: deskData.occupancyDuration,
    utilizationToday: deskData.utilizationToday || 0,
    reservationId: deskData.reservationId,
    sensorId: deskData.sensorId,
    amenities: deskData.amenities || [],
  };
};

/**
 * Calculates desk utilization metrics for a set of desks.
 *
 * @param {DeskOccupancy[]} desks - Array of desk occupancy records
 * @param {DateRange} period - Time period for analysis
 * @returns {object} Desk utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateDeskUtilization(allDesks, { start, end });
 * // Returns: { totalDesks: 120, averageUtilization: 65.5, ... }
 * ```
 */
export const calculateDeskUtilization = (
  desks: DeskOccupancy[],
  period: DateRange,
): {
  totalDesks: number;
  occupiedDesks: number;
  vacantDesks: number;
  reservedDesks: number;
  averageUtilization: number; // percentage
  utilizationByZone: Record<string, number>;
  utilizationByFloor: Record<string, number>;
  hotelDesks: number;
  assignedDesks: number;
} => {
  const totalDesks = desks.length;
  const occupiedDesks = desks.filter(d => d.status === 'occupied').length;
  const vacantDesks = desks.filter(d => d.status === 'vacant').length;
  const reservedDesks = desks.filter(d => d.status === 'reserved').length;
  const hotelDesks = desks.filter(d => !d.assignedTo).length;
  const assignedDesks = desks.filter(d => d.assignedTo).length;

  // Calculate average utilization
  const totalUtilizationMinutes = desks.reduce((sum, d) => sum + d.utilizationToday, 0);
  const periodMinutes = (period.end.getTime() - period.start.getTime()) / (1000 * 60);
  const averageUtilization = totalDesks > 0
    ? (totalUtilizationMinutes / (totalDesks * periodMinutes)) * 100
    : 0;

  // Group by zone
  const utilizationByZone: Record<string, number> = {};
  const desksByZone: Record<string, DeskOccupancy[]> = {};
  desks.forEach(desk => {
    if (!desksByZone[desk.zone]) desksByZone[desk.zone] = [];
    desksByZone[desk.zone].push(desk);
  });
  Object.entries(desksByZone).forEach(([zone, zoneDesks]) => {
    const zoneUtilization = zoneDesks.reduce((sum, d) => sum + d.utilizationToday, 0);
    utilizationByZone[zone] = (zoneUtilization / (zoneDesks.length * periodMinutes)) * 100;
  });

  // Group by floor
  const utilizationByFloor: Record<string, number> = {};
  const desksByFloor: Record<string, DeskOccupancy[]> = {};
  desks.forEach(desk => {
    if (!desksByFloor[desk.floor]) desksByFloor[desk.floor] = [];
    desksByFloor[desk.floor].push(desk);
  });
  Object.entries(desksByFloor).forEach(([floor, floorDesks]) => {
    const floorUtilization = floorDesks.reduce((sum, d) => sum + d.utilizationToday, 0);
    utilizationByFloor[floor] = (floorUtilization / (floorDesks.length * periodMinutes)) * 100;
  });

  return {
    totalDesks,
    occupiedDesks,
    vacantDesks,
    reservedDesks,
    averageUtilization: Math.round(averageUtilization * 100) / 100,
    utilizationByZone,
    utilizationByFloor,
    hotelDesks,
    assignedDesks,
  };
};

/**
 * Calculates space density metrics.
 *
 * @param {string} spaceId - Space identifier
 * @param {string} spaceName - Space name
 * @param {number} area - Space area (sq ft or sq m)
 * @param {number} occupantCount - Current occupant count
 * @param {number} capacity - Space capacity
 * @returns {DensityMetrics} Density metrics and recommendations
 *
 * @example
 * ```typescript
 * const density = calculateSpaceDensity(
 *   'SPACE-101',
 *   'Open Office Area',
 *   5000,
 *   45,
 *   60
 * );
 * // Returns: { density: 0.009, densityRating: 'moderate', ... }
 * ```
 */
export const calculateSpaceDensity = (
  spaceId: string,
  spaceName: string,
  area: number,
  occupantCount: number,
  capacity: number,
): DensityMetrics => {
  const density = area > 0 ? occupantCount / area : 0;
  const sqFtPerPerson = occupantCount > 0 ? area / occupantCount : area;

  // Determine density rating based on square feet per person
  // Industry standards: <50 sqft = overcrowded, 50-100 = high, 100-150 = moderate, 150-200 = low, >200 = very low
  let densityRating: DensityMetrics['densityRating'];
  if (sqFtPerPerson < 50) densityRating = 'overcrowded';
  else if (sqFtPerPerson < 100) densityRating = 'very_high';
  else if (sqFtPerPerson < 150) densityRating = 'high';
  else if (sqFtPerPerson < 200) densityRating = 'moderate';
  else if (sqFtPerPerson < 300) densityRating = 'low';
  else densityRating = 'very_low';

  // Recommended capacity based on 100-150 sqft per person standard
  const recommendedCapacity = Math.floor(area / 125);

  // Safety compliance (assume minimum 100 sqft per person for safety)
  const safetyCompliance = sqFtPerPerson >= 100 || occupantCount === 0;

  const recommendations: string[] = [];
  if (!safetyCompliance) {
    recommendations.push('Current density exceeds safety standards. Consider reducing capacity or expanding space.');
  }
  if (densityRating === 'overcrowded' || densityRating === 'very_high') {
    recommendations.push(`High density detected (${sqFtPerPerson.toFixed(1)} sqft/person). Consider space optimization.`);
  }
  if (occupantCount > capacity) {
    recommendations.push('Space is over capacity. Immediate action required.');
  }
  if (densityRating === 'very_low') {
    recommendations.push('Space is underutilized. Consider consolidating or repurposing.');
  }

  return {
    spaceId,
    spaceName,
    timestamp: new Date(),
    area,
    occupantCount,
    density: Math.round(density * 10000) / 10000,
    densityRating,
    recommendedCapacity,
    currentCapacity: capacity,
    safetyCompliance,
    recommendations: recommendations.length > 0 ? recommendations : undefined,
  };
};

/**
 * Analyzes occupancy trends over a time period.
 *
 * @param {string} spaceId - Space identifier
 * @param {string} spaceName - Space name
 * @param {OccupancyReading[]} readings - Historical readings
 * @param {DateRange} period - Analysis period
 * @returns {OccupancyTrend} Trend analysis results
 *
 * @example
 * ```typescript
 * const trends = analyzeOccupancyTrends(
 *   'SPACE-101',
 *   'Conference Room A',
 *   historicalReadings,
 *   { start, end }
 * );
 * // Returns: { averageUtilization: 68.5, trendLine: { slope: 0.5, direction: 'increasing' }, ... }
 * ```
 */
export const analyzeOccupancyTrends = (
  spaceId: string,
  spaceName: string,
  readings: OccupancyReading[],
  period: DateRange,
): OccupancyTrend => {
  const filteredReadings = readings.filter(
    r => r.spaceId === spaceId && r.timestamp >= period.start && r.timestamp <= period.end
  );

  if (filteredReadings.length === 0) {
    return {
      spaceId,
      spaceName,
      period,
      dataPoints: [],
      averageUtilization: 0,
      peakUtilization: 0,
      trendLine: { slope: 0, direction: 'stable', confidence: 0 },
      patterns: [],
    };
  }

  // Group readings by hour for data points
  const dataPoints: OccupancyTrend['dataPoints'] = [];
  const hourlyGroups: Record<string, OccupancyReading[]> = {};

  filteredReadings.forEach(reading => {
    const hourKey = new Date(reading.timestamp).toISOString().substring(0, 13);
    if (!hourlyGroups[hourKey]) hourlyGroups[hourKey] = [];
    hourlyGroups[hourKey].push(reading);
  });

  Object.entries(hourlyGroups).forEach(([hourKey, hourReadings]) => {
    const avgOccupancy = hourReadings.reduce((sum, r) => sum + r.occupantCount, 0) / hourReadings.length;
    const peakOccupancy = Math.max(...hourReadings.map(r => r.occupantCount));
    const avgUtilization = hourReadings.reduce((sum, r) => sum + r.utilizationRate, 0) / hourReadings.length;

    dataPoints.push({
      timestamp: new Date(hourKey + ':00:00Z'),
      averageOccupancy: Math.round(avgOccupancy * 100) / 100,
      peakOccupancy,
      utilizationRate: Math.round(avgUtilization * 100) / 100,
    });
  });

  // Sort data points by timestamp
  dataPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Calculate average and peak utilization
  const averageUtilization = dataPoints.reduce((sum, dp) => sum + dp.utilizationRate, 0) / dataPoints.length;
  const peakUtilization = Math.max(...dataPoints.map(dp => dp.utilizationRate));

  // Calculate trend line using linear regression
  const n = dataPoints.length;
  const sumX = dataPoints.reduce((sum, _, i) => sum + i, 0);
  const sumY = dataPoints.reduce((sum, dp) => sum + dp.utilizationRate, 0);
  const sumXY = dataPoints.reduce((sum, dp, i) => sum + i * dp.utilizationRate, 0);
  const sumX2 = dataPoints.reduce((sum, _, i) => sum + i * i, 0);

  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;
  const direction: 'increasing' | 'decreasing' | 'stable' =
    slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable';

  // Calculate R-squared for confidence
  const meanY = sumY / n;
  const ssTotal = dataPoints.reduce((sum, dp) => sum + Math.pow(dp.utilizationRate - meanY, 2), 0);
  const predictedValues = dataPoints.map((_, i) => slope * i + (sumY - slope * sumX) / n);
  const ssResidual = dataPoints.reduce((sum, dp, i) =>
    sum + Math.pow(dp.utilizationRate - predictedValues[i], 2), 0
  );
  const rSquared = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;
  const confidence = Math.max(0, Math.min(100, rSquared * 100));

  // Identify patterns
  const patterns = identifyOccupancyPatterns(dataPoints);

  return {
    spaceId,
    spaceName,
    period,
    dataPoints,
    averageUtilization: Math.round(averageUtilization * 100) / 100,
    peakUtilization: Math.round(peakUtilization * 100) / 100,
    trendLine: {
      slope: Math.round(slope * 1000) / 1000,
      direction,
      confidence: Math.round(confidence * 100) / 100,
    },
    patterns,
  };
};

/**
 * Identifies occupancy patterns from data points.
 *
 * @param {Array} dataPoints - Occupancy data points
 * @returns {OccupancyPattern[]} Identified patterns
 *
 * @example
 * ```typescript
 * const patterns = identifyOccupancyPatterns(dataPoints);
 * // Returns: [{ type: 'daily', peakTimes: [...], lowTimes: [...] }]
 * ```
 */
export const identifyOccupancyPatterns = (
  dataPoints: Array<{ timestamp: Date; averageOccupancy: number; utilizationRate: number }>,
): OccupancyPattern[] => {
  const patterns: OccupancyPattern[] = [];

  if (dataPoints.length < 24) {
    return patterns; // Not enough data for pattern analysis
  }

  // Daily pattern analysis - group by hour of day
  const hourlyData: Record<number, number[]> = {};
  dataPoints.forEach(dp => {
    const hour = dp.timestamp.getHours();
    if (!hourlyData[hour]) hourlyData[hour] = [];
    hourlyData[hour].push(dp.utilizationRate);
  });

  const hourlyAverages = Object.entries(hourlyData).map(([hour, values]) => ({
    hour: parseInt(hour),
    avgUtilization: values.reduce((sum, v) => sum + v, 0) / values.length,
  }));

  // Find peak and low times
  hourlyAverages.sort((a, b) => b.avgUtilization - a.avgUtilization);
  const peakTimes = hourlyAverages.slice(0, 3).map(h => ({
    time: `${h.hour.toString().padStart(2, '0')}:00`,
    avgOccupancy: Math.round(h.avgUtilization * 100) / 100,
  }));

  const lowTimes = hourlyAverages.slice(-3).reverse().map(h => ({
    time: `${h.hour.toString().padStart(2, '0')}:00`,
    avgOccupancy: Math.round(h.avgUtilization * 100) / 100,
  }));

  patterns.push({
    type: 'daily',
    description: 'Daily occupancy pattern identified',
    peakTimes,
    lowTimes,
    confidence: 80,
  });

  // Weekly pattern analysis if we have enough data
  if (dataPoints.length >= 168) { // At least one week of hourly data
    const weeklyData: Record<number, number[]> = {};
    dataPoints.forEach(dp => {
      const dayOfWeek = dp.timestamp.getDay();
      if (!weeklyData[dayOfWeek]) weeklyData[dayOfWeek] = [];
      weeklyData[dayOfWeek].push(dp.utilizationRate);
    });

    const weeklyAverages = Object.entries(weeklyData).map(([day, values]) => ({
      dayOfWeek: parseInt(day),
      avgUtilization: values.reduce((sum, v) => sum + v, 0) / values.length,
    }));

    weeklyAverages.sort((a, b) => b.avgUtilization - a.avgUtilization);
    const peakDays = weeklyAverages.slice(0, 2).map(d => ({
      time: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.dayOfWeek],
      dayOfWeek: d.dayOfWeek,
      avgOccupancy: Math.round(d.avgUtilization * 100) / 100,
    }));

    const lowDays = weeklyAverages.slice(-2).reverse().map(d => ({
      time: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.dayOfWeek],
      dayOfWeek: d.dayOfWeek,
      avgOccupancy: Math.round(d.avgUtilization * 100) / 100,
    }));

    patterns.push({
      type: 'weekly',
      description: 'Weekly occupancy pattern identified',
      peakTimes: peakDays,
      lowTimes: lowDays,
      confidence: 75,
    });
  }

  return patterns;
};

/**
 * Identifies peak occupancy periods.
 *
 * @param {OccupancyReading[]} readings - Occupancy readings
 * @param {DateRange} period - Analysis period
 * @param {string} spaceId - Space identifier
 * @param {string} spaceName - Space name
 * @param {number} capacity - Space capacity
 * @returns {PeakOccupancyAnalysis} Peak occupancy analysis
 *
 * @example
 * ```typescript
 * const peakAnalysis = identifyPeakOccupancy(
 *   readings,
 *   { start, end },
 *   'SPACE-101',
 *   'Conference Room A',
 *   12
 * );
 * ```
 */
export const identifyPeakOccupancy = (
  readings: OccupancyReading[],
  period: DateRange,
  spaceId: string,
  spaceName: string,
  capacity: number,
): PeakOccupancyAnalysis => {
  const filteredReadings = readings.filter(
    r => r.spaceId === spaceId && r.timestamp >= period.start && r.timestamp <= period.end
  );

  if (filteredReadings.length === 0) {
    return {
      spaceId,
      spaceName,
      analysisPeriod: period,
      peakOccupancy: { count: 0, timestamp: new Date(), utilizationRate: 0 },
      peakPatterns: [],
      capacityAdequacy: 'adequate',
      recommendations: ['Insufficient data for peak analysis'],
    };
  }

  // Find absolute peak
  const peakReading = filteredReadings.reduce((max, r) =>
    r.occupantCount > max.occupantCount ? r : max
  , filteredReadings[0]);

  // Group by day of week and hour
  const peaksByDayHour: Record<string, { count: number; occurrences: number }> = {};
  filteredReadings.forEach(reading => {
    const dayOfWeek = reading.timestamp.getDay();
    const hour = reading.timestamp.getHours();
    const key = `${dayOfWeek}-${hour}`;

    if (!peaksByDayHour[key]) {
      peaksByDayHour[key] = { count: 0, occurrences: 0 };
    }
    peaksByDayHour[key].count += reading.occupantCount;
    peaksByDayHour[key].occurrences++;
  });

  // Calculate average peaks and identify patterns
  const peakPatterns = Object.entries(peaksByDayHour)
    .map(([key, data]) => {
      const [dayOfWeek, hour] = key.split('-').map(Number);
      const averagePeak = data.count / data.occurrences;
      return {
        dayOfWeek,
        timeRange: `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`,
        averagePeak: Math.round(averagePeak * 100) / 100,
        frequency: data.occurrences,
      };
    })
    .filter(p => p.averagePeak > capacity * 0.7) // Only include high-utilization periods
    .sort((a, b) => b.averagePeak - a.averagePeak)
    .slice(0, 5);

  // Determine capacity adequacy
  const peakUtilization = (peakReading.occupantCount / capacity) * 100;
  let capacityAdequacy: PeakOccupancyAnalysis['capacityAdequacy'];
  if (peakUtilization > 100) capacityAdequacy = 'insufficient';
  else if (peakUtilization > 90) capacityAdequacy = 'adequate';
  else capacityAdequacy = 'excessive';

  // Generate recommendations
  const recommendations: string[] = [];
  if (capacityAdequacy === 'insufficient') {
    recommendations.push(`Space exceeded capacity (${peakReading.occupantCount}/${capacity}). Consider increasing capacity or implementing booking limits.`);
  }
  if (peakPatterns.length > 0) {
    const topPattern = peakPatterns[0];
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][topPattern.dayOfWeek];
    recommendations.push(`Peak usage typically occurs on ${dayName} during ${topPattern.timeRange}. Average: ${topPattern.averagePeak} occupants.`);
  }
  if (capacityAdequacy === 'excessive') {
    recommendations.push('Space capacity is significantly higher than peak usage. Consider downsizing or repurposing.');
  }

  return {
    spaceId,
    spaceName,
    analysisPeriod: period,
    peakOccupancy: {
      count: peakReading.occupantCount,
      timestamp: peakReading.timestamp,
      utilizationRate: Math.round(peakUtilization * 100) / 100,
    },
    peakPatterns,
    capacityAdequacy,
    recommendations,
  };
};

/**
 * Generates occupancy forecast using time series analysis.
 *
 * @param {string} spaceId - Space identifier
 * @param {string} spaceName - Space name
 * @param {OccupancyReading[]} historicalReadings - Historical data
 * @param {DateRange} forecastPeriod - Period to forecast
 * @param {number} capacity - Space capacity
 * @returns {OccupancyForecast} Occupancy forecast
 *
 * @example
 * ```typescript
 * const forecast = generateOccupancyForecast(
 *   'SPACE-101',
 *   'Conference Room A',
 *   historicalData,
 *   { start: tomorrow, end: nextWeek },
 *   12
 * );
 * ```
 */
export const generateOccupancyForecast = (
  spaceId: string,
  spaceName: string,
  historicalReadings: OccupancyReading[],
  forecastPeriod: DateRange,
  capacity: number,
): OccupancyForecast => {
  const filteredReadings = historicalReadings.filter(r => r.spaceId === spaceId);

  if (filteredReadings.length < 168) { // Less than 1 week of hourly data
    return {
      spaceId,
      spaceName,
      forecastDate: new Date(),
      forecastPeriod,
      predictions: [],
      forecastModel: 'statistical',
      factors: ['insufficient_data'],
    };
  }

  // Calculate hourly averages by day of week
  const hourlyPatterns: Record<string, number[]> = {};
  filteredReadings.forEach(reading => {
    const dayOfWeek = reading.timestamp.getDay();
    const hour = reading.timestamp.getHours();
    const key = `${dayOfWeek}-${hour}`;

    if (!hourlyPatterns[key]) hourlyPatterns[key] = [];
    hourlyPatterns[key].push(reading.occupantCount);
  });

  const hourlyAverages: Record<string, number> = {};
  Object.entries(hourlyPatterns).forEach(([key, values]) => {
    hourlyAverages[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
  });

  // Generate predictions for each hour in forecast period
  const predictions: OccupancyForecast['predictions'] = [];
  let currentTime = new Date(forecastPeriod.start);

  while (currentTime <= forecastPeriod.end) {
    const dayOfWeek = currentTime.getDay();
    const hour = currentTime.getHours();
    const key = `${dayOfWeek}-${hour}`;

    const baseOccupancy = hourlyAverages[key] || 0;

    // Calculate standard deviation for confidence interval
    const values = hourlyPatterns[key] || [baseOccupancy];
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    predictions.push({
      timestamp: new Date(currentTime),
      predictedOccupancy: Math.round(baseOccupancy * 100) / 100,
      predictedUtilization: Math.round((baseOccupancy / capacity) * 10000) / 100,
      confidenceInterval: {
        lower: Math.max(0, Math.round((baseOccupancy - 1.96 * stdDev) * 100) / 100),
        upper: Math.round((baseOccupancy + 1.96 * stdDev) * 100) / 100,
      },
      confidence: values.length >= 4 ? 85 : 70,
    });

    currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add 1 hour
  }

  return {
    spaceId,
    spaceName,
    forecastDate: new Date(),
    forecastPeriod,
    predictions,
    forecastModel: 'time_series',
    factors: ['historical_patterns', 'day_of_week', 'time_of_day'],
  };
};

/**
 * Creates a capacity planning recommendation.
 *
 * @param {string} propertyId - Property identifier
 * @param {string} planName - Plan name
 * @param {SpaceOccupancy[]} spaces - Current space occupancy data
 * @param {number} targetUtilization - Target utilization percentage
 * @returns {CapacityPlan} Capacity planning recommendations
 *
 * @example
 * ```typescript
 * const plan = createCapacityPlan(
 *   'PROP-001',
 *   'Q1 2024 Capacity Optimization',
 *   allSpaces,
 *   70
 * );
 * ```
 */
export const createCapacityPlan = (
  propertyId: string,
  planName: string,
  spaces: SpaceOccupancy[],
  targetUtilization: number,
): CapacityPlan => {
  const totalSpaces = spaces.length;
  const totalCapacity = spaces.reduce((sum, s) => sum + s.capacity, 0);
  const averageUtilization = spaces.reduce((sum, s) => sum + s.utilizationRate, 0) / totalSpaces;
  const underutilizedSpaces = spaces.filter(s => s.utilizationRate < targetUtilization * 0.7).length;
  const overutilizedSpaces = spaces.filter(s => s.utilizationRate > 95).length;

  const recommendations: CapacityPlan['recommendations'] = [];

  spaces.forEach(space => {
    // Overutilized spaces
    if (space.utilizationRate > 95) {
      const recommendedIncrease = Math.ceil(space.capacity * 0.2); // 20% increase
      recommendations.push({
        type: 'increase_capacity',
        spaceId: space.spaceId,
        spaceName: space.spaceName,
        currentCapacity: space.capacity,
        recommendedCapacity: space.capacity + recommendedIncrease,
        rationale: `Space is consistently at ${space.utilizationRate.toFixed(1)}% utilization. Increasing capacity will improve availability.`,
        impact: {
          capacityChange: recommendedIncrease,
          utilizationImprovement: -15,
        },
        priority: 'high',
        implementationEffort: 'moderate',
      });
    }

    // Significantly underutilized spaces
    if (space.utilizationRate < targetUtilization * 0.5 && space.utilizationRate < 30) {
      recommendations.push({
        type: 'repurpose_space',
        spaceId: space.spaceId,
        spaceName: space.spaceName,
        currentCapacity: space.capacity,
        recommendedCapacity: Math.ceil(space.capacity * 0.6),
        rationale: `Space utilization is only ${space.utilizationRate.toFixed(1)}%. Consider repurposing or consolidating.`,
        impact: {
          capacityChange: -Math.floor(space.capacity * 0.4),
          utilizationImprovement: 25,
        },
        priority: 'medium',
        implementationEffort: 'complex',
      });
    }

    // Moderately underutilized meeting rooms - convert to hotdesk
    if (space.spaceType === 'meeting_room' && space.utilizationRate < 40) {
      recommendations.push({
        type: 'convert_to_hotdesk',
        spaceId: space.spaceId,
        spaceName: space.spaceName,
        currentCapacity: space.capacity,
        recommendedCapacity: space.capacity,
        rationale: `Meeting room underutilized at ${space.utilizationRate.toFixed(1)}%. Consider converting to flex workspace.`,
        impact: {
          capacityChange: 0,
          utilizationImprovement: 30,
        },
        priority: 'low',
        implementationEffort: 'easy',
      });
    }
  });

  // Sort recommendations by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    id: `PLAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId,
    planName,
    effectiveDate: new Date(),
    currentState: {
      totalSpaces,
      totalCapacity,
      averageUtilization: Math.round(averageUtilization * 100) / 100,
      underutilizedSpaces,
      overutilizedSpaces,
    },
    recommendations,
    targetUtilization,
  };
};

/**
 * Generates an occupancy alert.
 *
 * @param {string} spaceId - Space identifier
 * @param {string} spaceName - Space name
 * @param {AlertType} alertType - Type of alert
 * @param {number} currentValue - Current value that triggered alert
 * @param {number} threshold - Alert threshold
 * @param {string} severity - Alert severity
 * @returns {OccupancyAlert} Occupancy alert
 *
 * @example
 * ```typescript
 * const alert = generateOccupancyAlert(
 *   'SPACE-101',
 *   'Conference Room A',
 *   'over_capacity',
 *   15,
 *   12,
 *   'critical'
 * );
 * ```
 */
export const generateOccupancyAlert = (
  spaceId: string,
  spaceName: string,
  alertType: AlertType,
  currentValue: number,
  threshold: number,
  severity: 'critical' | 'warning' | 'info',
): OccupancyAlert => {
  const messages: Record<AlertType, string> = {
    over_capacity: `Space is over capacity: ${currentValue} occupants exceeds ${threshold} capacity`,
    near_capacity: `Space is near capacity: ${currentValue} occupants approaching ${threshold} capacity`,
    safety_violation: `Safety violation detected: Density exceeds safe limits`,
    sensor_malfunction: `Sensor malfunction detected: Readings inconsistent or missing`,
    unusual_pattern: `Unusual occupancy pattern detected: ${currentValue} deviates from normal`,
    low_utilization: `Low utilization alert: Only ${currentValue}% utilization over ${threshold} day period`,
    high_density: `High density alert: ${currentValue} occupants per sq ft exceeds ${threshold} threshold`,
    prolonged_vacancy: `Prolonged vacancy: Space vacant for ${currentValue} hours exceeding ${threshold} hour threshold`,
  };

  return {
    id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    spaceId,
    spaceName,
    alertType,
    severity,
    message: messages[alertType],
    currentValue,
    threshold,
    triggeredAt: new Date(),
    isResolved: false,
  };
};

/**
 * Resolves an occupancy alert.
 *
 * @param {OccupancyAlert} alert - Alert to resolve
 * @param {string} actionTaken - Description of action taken
 * @returns {OccupancyAlert} Resolved alert
 *
 * @example
 * ```typescript
 * const resolved = resolveOccupancyAlert(
 *   alert,
 *   'Increased capacity and updated booking policies'
 * );
 * ```
 */
export const resolveOccupancyAlert = (
  alert: OccupancyAlert,
  actionTaken: string,
): OccupancyAlert => {
  return {
    ...alert,
    isResolved: true,
    resolvedAt: new Date(),
    actionTaken,
  };
};

/**
 * Generates a comprehensive utilization report.
 *
 * @param {string} propertyId - Property identifier
 * @param {SpaceOccupancy[]} spaces - Space occupancy data
 * @param {DateRange} reportPeriod - Report period
 * @returns {UtilizationReport} Utilization report
 *
 * @example
 * ```typescript
 * const report = generateUtilizationReport(
 *   'PROP-001',
 *   allSpaces,
 *   { start, end }
 * );
 * ```
 */
export const generateUtilizationReport = (
  propertyId: string,
  spaces: SpaceOccupancy[],
  reportPeriod: DateRange,
): UtilizationReport => {
  const totalSpaces = spaces.length;
  const averageUtilization = spaces.reduce((sum, s) => sum + s.utilizationRate, 0) / totalSpaces;
  const peakUtilization = Math.max(...spaces.map(s => s.utilizationRate));

  // Calculate total occupancy hours (simplified - would need actual time series data)
  const periodHours = (reportPeriod.end.getTime() - reportPeriod.start.getTime()) / (1000 * 60 * 60);
  const totalOccupancyHours = spaces.reduce((sum, s) =>
    sum + (s.utilizationRate / 100) * periodHours
  , 0);

  // Group by space type
  const utilizationBySpaceType: Record<SpaceType, number> = {} as Record<SpaceType, number>;
  const spacesByType: Record<SpaceType, SpaceOccupancy[]> = {} as Record<SpaceType, SpaceOccupancy[]>;
  spaces.forEach(space => {
    if (!spacesByType[space.spaceType]) spacesByType[space.spaceType] = [];
    spacesByType[space.spaceType].push(space);
  });
  Object.entries(spacesByType).forEach(([type, typeSpaces]) => {
    const avgUtil = typeSpaces.reduce((sum, s) => sum + s.utilizationRate, 0) / typeSpaces.length;
    utilizationBySpaceType[type as SpaceType] = Math.round(avgUtil * 100) / 100;
  });

  // Group by floor
  const utilizationByFloor: Record<string, number> = {};
  const spacesByFloor: Record<string, SpaceOccupancy[]> = {};
  spaces.forEach(space => {
    if (!spacesByFloor[space.floor]) spacesByFloor[space.floor] = [];
    spacesByFloor[space.floor].push(space);
  });
  Object.entries(spacesByFloor).forEach(([floor, floorSpaces]) => {
    const avgUtil = floorSpaces.reduce((sum, s) => sum + s.utilizationRate, 0) / floorSpaces.length;
    utilizationByFloor[floor] = Math.round(avgUtil * 100) / 100;
  });

  // Top performers and underperformers
  const sortedByUtilization = [...spaces].sort((a, b) => b.utilizationRate - a.utilizationRate);
  const topPerformers = sortedByUtilization.slice(0, 5).map(s => ({
    spaceId: s.spaceId,
    spaceName: s.spaceName,
    utilization: s.utilizationRate,
  }));
  const underperformers = sortedByUtilization.slice(-5).reverse().map(s => ({
    spaceId: s.spaceId,
    spaceName: s.spaceName,
    utilization: s.utilizationRate,
  }));

  // Generate insights
  const insights: string[] = [];
  if (averageUtilization < 50) {
    insights.push('Overall utilization is below 50%. Significant opportunity for space consolidation.');
  }
  if (averageUtilization > 85) {
    insights.push('High overall utilization indicates potential capacity constraints.');
  }
  const overutilized = spaces.filter(s => s.utilizationRate > 95).length;
  if (overutilized > 0) {
    insights.push(`${overutilized} spaces are operating above 95% capacity.`);
  }

  // Generate recommendations
  const recommendations: string[] = [];
  const underutilized = spaces.filter(s => s.utilizationRate < 30).length;
  if (underutilized > totalSpaces * 0.2) {
    recommendations.push(`${underutilized} spaces (${Math.round(underutilized/totalSpaces*100)}%) are underutilized. Consider consolidation or repurposing.`);
  }
  if (overutilized > 0) {
    recommendations.push('Implement booking systems or expand capacity for overutilized spaces.');
  }

  return {
    reportId: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId,
    reportPeriod,
    generatedAt: new Date(),
    summary: {
      totalSpaces,
      averageUtilization: Math.round(averageUtilization * 100) / 100,
      peakUtilization: Math.round(peakUtilization * 100) / 100,
      totalOccupancyHours: Math.round(totalOccupancyHours * 100) / 100,
      utilizationBySpaceType,
      utilizationByFloor,
    },
    topPerformers,
    underperformers,
    insights,
    recommendations,
  };
};

/**
 * Aggregates multiple sensors for a single space.
 *
 * @param {OccupancyReading[]} readings - Readings from multiple sensors
 * @param {string} spaceId - Space identifier
 * @returns {OccupancyReading} Aggregated reading
 *
 * @example
 * ```typescript
 * const aggregated = aggregateMultiSensorReadings(
 *   [sensor1Reading, sensor2Reading, sensor3Reading],
 *   'SPACE-101'
 * );
 * ```
 */
export const aggregateMultiSensorReadings = (
  readings: OccupancyReading[],
  spaceId: string,
): OccupancyReading => {
  if (readings.length === 0) {
    throw new Error('No readings provided for aggregation');
  }

  if (readings.length === 1) {
    return readings[0];
  }

  // Use weighted average based on confidence
  const totalConfidence = readings.reduce((sum, r) => sum + r.confidence, 0);
  const weightedOccupancy = readings.reduce((sum, r) =>
    sum + (r.occupantCount * r.confidence / totalConfidence)
  , 0);

  const avgConfidence = totalConfidence / readings.length;
  const capacity = readings[0].capacity;

  return {
    id: `AGG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sensorId: `multi-sensor-${spaceId}`,
    spaceId,
    timestamp: new Date(),
    occupantCount: Math.round(weightedOccupancy),
    capacity,
    utilizationRate: Math.round((weightedOccupancy / capacity) * 10000) / 100,
    confidence: Math.round(avgConfidence * 100) / 100,
    isEstimated: true,
    anomalyDetected: false,
  };
};

/**
 * Calculates real-time occupancy from sensor network.
 *
 * @param {OccupancySensor[]} sensors - Active sensors
 * @param {OccupancyReading[]} recentReadings - Recent readings
 * @returns {object} Real-time occupancy summary
 *
 * @example
 * ```typescript
 * const realtime = calculateRealtimeOccupancy(activeSensors, last5Minutes);
 * // Returns: { totalOccupancy: 245, spaceBreakdown: {...}, ... }
 * ```
 */
export const calculateRealtimeOccupancy = (
  sensors: OccupancySensor[],
  recentReadings: OccupancyReading[],
): {
  totalOccupancy: number;
  totalCapacity: number;
  overallUtilization: number;
  spaceBreakdown: Record<string, { occupancy: number; capacity: number; utilization: number }>;
  activeSensors: number;
  inactiveSensors: number;
  lastUpdate: Date;
} => {
  const activeSensors = sensors.filter(s => s.status === 'active').length;
  const inactiveSensors = sensors.length - activeSensors;

  // Group readings by space
  const readingsBySpace: Record<string, OccupancyReading[]> = {};
  recentReadings.forEach(reading => {
    if (!readingsBySpace[reading.spaceId]) readingsBySpace[reading.spaceId] = [];
    readingsBySpace[reading.spaceId].push(reading);
  });

  const spaceBreakdown: Record<string, { occupancy: number; capacity: number; utilization: number }> = {};
  let totalOccupancy = 0;
  let totalCapacity = 0;

  Object.entries(readingsBySpace).forEach(([spaceId, readings]) => {
    // Get most recent reading for each space
    const latestReading = readings.reduce((latest, r) =>
      r.timestamp > latest.timestamp ? r : latest
    , readings[0]);

    spaceBreakdown[spaceId] = {
      occupancy: latestReading.occupantCount,
      capacity: latestReading.capacity,
      utilization: latestReading.utilizationRate,
    };

    totalOccupancy += latestReading.occupantCount;
    totalCapacity += latestReading.capacity;
  });

  const overallUtilization = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
  const lastUpdate = recentReadings.length > 0
    ? recentReadings.reduce((latest, r) => r.timestamp > latest ? r.timestamp : latest, recentReadings[0].timestamp)
    : new Date();

  return {
    totalOccupancy,
    totalCapacity,
    overallUtilization: Math.round(overallUtilization * 100) / 100,
    spaceBreakdown,
    activeSensors,
    inactiveSensors,
    lastUpdate,
  };
};

/**
 * Validates sensor health and performance.
 *
 * @param {OccupancySensor} sensor - Sensor to validate
 * @param {OccupancyReading[]} recentReadings - Recent readings from sensor
 * @returns {object} Sensor health report
 *
 * @example
 * ```typescript
 * const health = validateSensorHealth(sensor, last24Hours);
 * if (!health.isHealthy) {
 *   console.log('Issues:', health.issues);
 * }
 * ```
 */
export const validateSensorHealth = (
  sensor: OccupancySensor,
  recentReadings: OccupancyReading[],
): {
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
  healthScore: number; // 0-100
  lastReading?: Date;
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let healthScore = 100;

  // Check sensor status
  if (sensor.status !== 'active') {
    issues.push(`Sensor status is ${sensor.status}`);
    healthScore -= 50;
  }

  // Check battery level (for wireless sensors)
  if (sensor.batteryLevel !== undefined) {
    if (sensor.batteryLevel < 10) {
      issues.push(`Critical battery level: ${sensor.batteryLevel}%`);
      healthScore -= 30;
      recommendations.push('Replace battery immediately');
    } else if (sensor.batteryLevel < 20) {
      issues.push(`Low battery level: ${sensor.batteryLevel}%`);
      healthScore -= 15;
      recommendations.push('Schedule battery replacement soon');
    }
  }

  // Check signal strength (for wireless sensors)
  if (sensor.signalStrength !== undefined) {
    if (sensor.signalStrength < -90) {
      issues.push(`Weak signal strength: ${sensor.signalStrength} dBm`);
      healthScore -= 20;
      recommendations.push('Check sensor positioning or add repeater');
    }
  }

  // Check calibration
  if (sensor.lastCalibration) {
    const daysSinceCalibration = (Date.now() - sensor.lastCalibration.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCalibration > 180) { // 6 months
      issues.push(`Sensor not calibrated in ${Math.floor(daysSinceCalibration)} days`);
      healthScore -= 10;
      recommendations.push('Schedule sensor calibration');
    }
  }

  // Check reading frequency
  const sensorReadings = recentReadings.filter(r => r.sensorId === sensor.id);
  if (sensorReadings.length > 0) {
    const lastReading = sensorReadings.reduce((latest, r) =>
      r.timestamp > latest.timestamp ? r : latest
    , sensorReadings[0]);

    const minutesSinceLastReading = (Date.now() - lastReading.timestamp.getTime()) / (1000 * 60);
    const expectedFrequency = sensor.updateFrequency / 60; // Convert to minutes

    if (minutesSinceLastReading > expectedFrequency * 3) {
      issues.push(`No readings for ${Math.floor(minutesSinceLastReading)} minutes (expected every ${expectedFrequency} min)`);
      healthScore -= 25;
      recommendations.push('Check sensor connectivity and power');
    }

    // Check for anomalies in recent readings
    const anomalousReadings = sensorReadings.filter(r => r.anomalyDetected);
    if (anomalousReadings.length > sensorReadings.length * 0.2) {
      issues.push(`High anomaly rate: ${anomalousReadings.length}/${sensorReadings.length} readings flagged`);
      healthScore -= 15;
      recommendations.push('Investigate sensor accuracy and recalibrate');
    }
  } else {
    issues.push('No recent readings available');
    healthScore -= 40;
    recommendations.push('Check sensor connectivity and configuration');
  }

  const isHealthy = issues.length === 0 && healthScore >= 80;
  const lastReading = sensorReadings.length > 0
    ? sensorReadings.reduce((latest, r) => r.timestamp > latest.timestamp ? r : latest, sensorReadings[0]).timestamp
    : undefined;

  return {
    isHealthy,
    issues,
    recommendations,
    healthScore: Math.max(0, healthScore),
    lastReading,
  };
};

/**
 * Generates occupancy heatmap data for visualization.
 *
 * @param {string} propertyId - Property identifier
 * @param {SpaceOccupancy[]} spaces - Space occupancy data
 * @param {DateRange} timeRange - Time range for heatmap
 * @param {string} resolution - Data resolution
 * @returns {OccupancyHeatmap} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateOccupancyHeatmap(
 *   'PROP-001',
 *   allSpaces,
 *   { start, end },
 *   'hourly'
 * );
 * ```
 */
export const generateOccupancyHeatmap = (
  propertyId: string,
  spaces: SpaceOccupancy[],
  timeRange: DateRange,
  resolution: 'hourly' | 'daily' | 'weekly',
  floor?: string,
): OccupancyHeatmap => {
  const filteredSpaces = floor ? spaces.filter(s => s.floor === floor) : spaces;

  const data: OccupancyHeatmap['data'] = filteredSpaces.map(space => {
    // In a real implementation, this would aggregate historical data by time period
    // For now, we'll use current utilization as a simplified example
    const utilizationByPeriod: Record<string, number> = {};
    utilizationByPeriod[timeRange.start.toISOString()] = space.utilizationRate;

    return {
      spaceId: space.spaceId,
      spaceName: space.spaceName,
      utilizationByPeriod,
      averageUtilization: space.utilizationRate,
      heatmapValue: space.utilizationRate, // Normalized 0-100
    };
  });

  return {
    propertyId,
    floor,
    timestamp: new Date(),
    timeRange,
    resolution,
    data,
  };
};

/**
 * Compares occupancy across multiple properties or spaces.
 *
 * @param {SpaceOccupancy[]} spaces - Spaces to compare
 * @param {string} metric - Metric to compare
 * @returns {object} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = compareOccupancyMetrics(
 *   [space1, space2, space3],
 *   'utilizationRate'
 * );
 * ```
 */
export const compareOccupancyMetrics = (
  spaces: SpaceOccupancy[],
  metric: 'utilizationRate' | 'currentOccupancy' | 'capacity',
): {
  highest: { space: SpaceOccupancy; value: number };
  lowest: { space: SpaceOccupancy; value: number };
  average: number;
  median: number;
  standardDeviation: number;
  ranking: Array<{ spaceId: string; spaceName: string; value: number; rank: number }>;
} => {
  if (spaces.length === 0) {
    throw new Error('No spaces provided for comparison');
  }

  const values = spaces.map(s => s[metric]);
  const sorted = [...values].sort((a, b) => b - a);

  const highest = { space: spaces[values.indexOf(sorted[0])], value: sorted[0] };
  const lowest = { space: spaces[values.indexOf(sorted[sorted.length - 1])], value: sorted[sorted.length - 1] };

  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const variance = values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);

  const ranking = spaces
    .map((space, index) => ({
      spaceId: space.spaceId,
      spaceName: space.spaceName,
      value: values[index],
      rank: 0,
    }))
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return {
    highest,
    lowest,
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    ranking,
  };
};

/**
 * Exports occupancy data in various formats.
 *
 * @param {SpaceOccupancy[]} spaces - Spaces to export
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const csvData = exportOccupancyData(allSpaces, 'csv');
 * const jsonData = exportOccupancyData(allSpaces, 'json');
 * ```
 */
export const exportOccupancyData = (
  spaces: SpaceOccupancy[],
  format: 'csv' | 'json' | 'summary',
): string => {
  if (format === 'json') {
    return JSON.stringify(spaces, null, 2);
  }

  if (format === 'csv') {
    const headers = [
      'Space ID',
      'Space Name',
      'Type',
      'Floor',
      'Building',
      'Capacity',
      'Current Occupancy',
      'Utilization %',
      'Status',
      'Last Updated',
    ].join(',');

    const rows = spaces.map(s => [
      s.spaceId,
      s.spaceName,
      s.spaceType,
      s.floor,
      s.building,
      s.capacity,
      s.currentOccupancy,
      s.utilizationRate.toFixed(2),
      s.status,
      s.lastUpdated.toISOString(),
    ].join(','));

    return [headers, ...rows].join('\n');
  }

  if (format === 'summary') {
    const totalSpaces = spaces.length;
    const avgUtilization = spaces.reduce((sum, s) => sum + s.utilizationRate, 0) / totalSpaces;
    const totalCapacity = spaces.reduce((sum, s) => sum + s.capacity, 0);
    const totalOccupancy = spaces.reduce((sum, s) => sum + s.currentOccupancy, 0);

    return `Occupancy Summary Report
Generated: ${new Date().toISOString()}
Total Spaces: ${totalSpaces}
Total Capacity: ${totalCapacity}
Total Current Occupancy: ${totalOccupancy}
Average Utilization: ${avgUtilization.toFixed(2)}%

Status Breakdown:
- Vacant: ${spaces.filter(s => s.status === 'vacant').length}
- Low: ${spaces.filter(s => s.status === 'low').length}
- Moderate: ${spaces.filter(s => s.status === 'moderate').length}
- High: ${spaces.filter(s => s.status === 'high').length}
- Near Full: ${spaces.filter(s => s.status === 'near_full').length}
- Full: ${spaces.filter(s => s.status === 'full').length}
- Over Capacity: ${spaces.filter(s => s.status === 'over_capacity').length}`;
  }

  throw new Error(`Unsupported export format: ${format}`);
};

/**
 * Calculates space turnover rate (how frequently occupants change).
 *
 * @param {BadgeSwipeEvent[]} swipeEvents - Badge swipe events
 * @param {string} spaceId - Space identifier
 * @param {DateRange} period - Analysis period
 * @returns {object} Turnover metrics
 *
 * @example
 * ```typescript
 * const turnover = calculateSpaceTurnover(
 *   badgeEvents,
 *   'SPACE-101',
 *   { start, end }
 * );
 * ```
 */
export const calculateSpaceTurnover = (
  swipeEvents: BadgeSwipeEvent[],
  spaceId: string,
  period: DateRange,
): {
  totalVisits: number;
  uniqueVisitors: number;
  averageVisitsPerPerson: number;
  turnoverRate: number; // visits per hour
  peakTurnoverTime?: { time: Date; visits: number };
  averageDwellTime?: number; // minutes
} => {
  const relevantEvents = swipeEvents.filter(
    e => (!e.spaceId || e.spaceId === spaceId) &&
         e.timestamp >= period.start &&
         e.timestamp <= period.end &&
         e.eventType !== 'access_denied'
  );

  const entries = relevantEvents.filter(e => e.direction === 'in' || e.eventType === 'entry');
  const uniqueVisitors = new Set(entries.map(e => e.employeeId)).size;
  const totalVisits = entries.length;
  const averageVisitsPerPerson = uniqueVisitors > 0 ? totalVisits / uniqueVisitors : 0;

  const periodHours = (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60);
  const turnoverRate = periodHours > 0 ? totalVisits / periodHours : 0;

  // Find peak turnover time (hour with most entries)
  const entriesByHour: Record<string, number> = {};
  entries.forEach(entry => {
    const hourKey = entry.timestamp.toISOString().substring(0, 13);
    entriesByHour[hourKey] = (entriesByHour[hourKey] || 0) + 1;
  });

  let peakTurnoverTime: { time: Date; visits: number } | undefined;
  Object.entries(entriesByHour).forEach(([hourKey, visits]) => {
    if (!peakTurnoverTime || visits > peakTurnoverTime.visits) {
      peakTurnoverTime = { time: new Date(hourKey + ':00:00Z'), visits };
    }
  });

  return {
    totalVisits,
    uniqueVisitors,
    averageVisitsPerPerson: Math.round(averageVisitsPerPerson * 100) / 100,
    turnoverRate: Math.round(turnoverRate * 100) / 100,
    peakTurnoverTime,
  };
};
