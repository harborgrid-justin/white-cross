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
    batteryLevel?: number;
    signalStrength?: number;
    detectionRange: number;
    accuracy: number;
    updateFrequency: number;
    metadata?: Record<string, unknown>;
}
type SensorType = 'pir_motion' | 'ultrasonic' | 'thermal' | 'co2' | 'camera_ai' | 'pressure_mat' | 'desk_sensor' | 'door_sensor' | 'wifi_probe' | 'bluetooth_beacon';
interface OccupancyReading {
    id: string;
    sensorId: string;
    spaceId: string;
    timestamp: Date;
    occupantCount: number;
    capacity: number;
    utilizationRate: number;
    confidence: number;
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
    utilizationRate: number;
    status: OccupancyStatus;
    lastUpdated: Date;
    sensors: string[];
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    peakOccupancy?: {
        count: number;
        timestamp: Date;
    };
}
type SpaceType = 'office' | 'desk' | 'meeting_room' | 'conference_room' | 'huddle_room' | 'collaboration_space' | 'cafeteria' | 'lobby' | 'common_area' | 'breakroom' | 'gym' | 'parking' | 'phone_booth' | 'focus_room';
type OccupancyStatus = 'vacant' | 'low' | 'moderate' | 'high' | 'near_full' | 'full' | 'over_capacity';
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
    assignedTo?: string;
    currentOccupant?: string;
    status: 'vacant' | 'occupied' | 'reserved' | 'unavailable';
    lastOccupied?: Date;
    occupancyDuration?: number;
    utilizationToday: number;
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
    peakTimes: Array<{
        time: string;
        dayOfWeek?: number;
        avgOccupancy: number;
    }>;
    lowTimes: Array<{
        time: string;
        dayOfWeek?: number;
        avgOccupancy: number;
    }>;
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
    area: number;
    occupantCount: number;
    density: number;
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
    accuracy?: number;
    factors: string[];
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
    targetUtilization: number;
    projectedSavings?: number;
}
type CapacityAction = 'increase_capacity' | 'decrease_capacity' | 'repurpose_space' | 'consolidate_spaces' | 'add_flexible_seating' | 'convert_to_hotdesk' | 'create_collaboration_zone' | 'decommission_space';
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
type AlertType = 'over_capacity' | 'near_capacity' | 'safety_violation' | 'sensor_malfunction' | 'unusual_pattern' | 'low_utilization' | 'high_density' | 'prolonged_vacancy';
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
    topPerformers: Array<{
        spaceId: string;
        spaceName: string;
        utilization: number;
    }>;
    underperformers: Array<{
        spaceId: string;
        spaceName: string;
        utilization: number;
    }>;
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
        dayOfWeek: number;
        timeRange: string;
        averagePeak: number;
        frequency: number;
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
        coordinates?: {
            x: number;
            y: number;
        };
        utilizationByPeriod: Record<string, number>;
        averageUtilization: number;
        heatmapValue: number;
    }>;
}
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
export declare const registerOccupancySensor: (sensorData: Partial<OccupancySensor>) => OccupancySensor;
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
export declare const recordOccupancyReading: (sensorId: string, spaceId: string, occupantCount: number, capacity: number, confidence: number, isEstimated?: boolean) => OccupancyReading;
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
export declare const calculateSpaceOccupancy: (readings: OccupancyReading[], spaceId: string, spaceName: string, spaceType: SpaceType, capacity: number, floor?: string, building?: string) => SpaceOccupancy;
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
export declare const detectOccupancyAnomaly: (reading: OccupancyReading, historicalReadings: OccupancyReading[]) => {
    isAnomaly: boolean;
    anomalies: string[];
    severity: "low" | "medium" | "high";
    confidence: number;
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
export declare const processBadgeSwipe: (eventData: Partial<BadgeSwipeEvent>) => BadgeSwipeEvent;
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
export declare const aggregateBadgeOccupancy: (swipeEvents: BadgeSwipeEvent[], spaceId: string, timeRange: DateRange) => {
    estimatedOccupancy: number;
    totalEntries: number;
    totalExits: number;
    uniqueVisitors: number;
    averageDwellTime?: number;
    peakOccupancy: number;
    peakTime?: Date;
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
export declare const updateDeskOccupancy: (deskData: Partial<DeskOccupancy>) => DeskOccupancy;
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
export declare const calculateDeskUtilization: (desks: DeskOccupancy[], period: DateRange) => {
    totalDesks: number;
    occupiedDesks: number;
    vacantDesks: number;
    reservedDesks: number;
    averageUtilization: number;
    utilizationByZone: Record<string, number>;
    utilizationByFloor: Record<string, number>;
    hotelDesks: number;
    assignedDesks: number;
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
export declare const calculateSpaceDensity: (spaceId: string, spaceName: string, area: number, occupantCount: number, capacity: number) => DensityMetrics;
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
export declare const analyzeOccupancyTrends: (spaceId: string, spaceName: string, readings: OccupancyReading[], period: DateRange) => OccupancyTrend;
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
export declare const identifyOccupancyPatterns: (dataPoints: Array<{
    timestamp: Date;
    averageOccupancy: number;
    utilizationRate: number;
}>) => OccupancyPattern[];
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
export declare const identifyPeakOccupancy: (readings: OccupancyReading[], period: DateRange, spaceId: string, spaceName: string, capacity: number) => PeakOccupancyAnalysis;
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
export declare const generateOccupancyForecast: (spaceId: string, spaceName: string, historicalReadings: OccupancyReading[], forecastPeriod: DateRange, capacity: number) => OccupancyForecast;
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
export declare const createCapacityPlan: (propertyId: string, planName: string, spaces: SpaceOccupancy[], targetUtilization: number) => CapacityPlan;
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
export declare const generateOccupancyAlert: (spaceId: string, spaceName: string, alertType: AlertType, currentValue: number, threshold: number, severity: "critical" | "warning" | "info") => OccupancyAlert;
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
export declare const resolveOccupancyAlert: (alert: OccupancyAlert, actionTaken: string) => OccupancyAlert;
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
export declare const generateUtilizationReport: (propertyId: string, spaces: SpaceOccupancy[], reportPeriod: DateRange) => UtilizationReport;
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
export declare const aggregateMultiSensorReadings: (readings: OccupancyReading[], spaceId: string) => OccupancyReading;
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
export declare const calculateRealtimeOccupancy: (sensors: OccupancySensor[], recentReadings: OccupancyReading[]) => {
    totalOccupancy: number;
    totalCapacity: number;
    overallUtilization: number;
    spaceBreakdown: Record<string, {
        occupancy: number;
        capacity: number;
        utilization: number;
    }>;
    activeSensors: number;
    inactiveSensors: number;
    lastUpdate: Date;
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
export declare const validateSensorHealth: (sensor: OccupancySensor, recentReadings: OccupancyReading[]) => {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
    healthScore: number;
    lastReading?: Date;
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
export declare const generateOccupancyHeatmap: (propertyId: string, spaces: SpaceOccupancy[], timeRange: DateRange, resolution: "hourly" | "daily" | "weekly", floor?: string) => OccupancyHeatmap;
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
export declare const compareOccupancyMetrics: (spaces: SpaceOccupancy[], metric: "utilizationRate" | "currentOccupancy" | "capacity") => {
    highest: {
        space: SpaceOccupancy;
        value: number;
    };
    lowest: {
        space: SpaceOccupancy;
        value: number;
    };
    average: number;
    median: number;
    standardDeviation: number;
    ranking: Array<{
        spaceId: string;
        spaceName: string;
        value: number;
        rank: number;
    }>;
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
export declare const exportOccupancyData: (spaces: SpaceOccupancy[], format: "csv" | "json" | "summary") => string;
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
export declare const calculateSpaceTurnover: (swipeEvents: BadgeSwipeEvent[], spaceId: string, period: DateRange) => {
    totalVisits: number;
    uniqueVisitors: number;
    averageVisitsPerPerson: number;
    turnoverRate: number;
    peakTurnoverTime?: {
        time: Date;
        visits: number;
    };
    averageDwellTime?: number;
};
export {};
//# sourceMappingURL=property-occupancy-analytics-kit.d.ts.map