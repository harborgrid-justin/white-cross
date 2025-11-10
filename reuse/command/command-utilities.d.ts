/**
 * @fileoverview Advanced TypeScript Utilities for Command & Control Incident Management
 *
 * This module provides a comprehensive suite of production-ready utility functions for incident
 * management, resource optimization, and emergency response coordination. All functions leverage
 * advanced TypeScript type safety, including generics with constraints, branded types, and
 * discriminated unions from the incident-management-types module.
 *
 * **Functional Programming Principles:**
 * - Pure functions with no side effects for core logic
 * - Immutable data structures throughout
 * - Type-safe transformations and validations
 * - Compositional design for algorithm reuse
 * - Explicit error handling via Result types
 *
 * **Algorithmic Complexity:**
 * - Priority calculations: O(1) with weighted scoring
 * - Distance calculations: O(1) using haversine formula
 * - Routing algorithms: O(n log n) for optimal path finding
 * - Resource allocation: O(n) greedy algorithms with optimality proofs
 * - Capacity planning: O(n²) for constraint satisfaction
 *
 * **Performance Optimization:**
 * - Memoization for expensive calculations
 * - Lazy evaluation for deferred computation
 * - Minimal object allocation in hot paths
 * - Efficient data structures (Maps, Sets)
 * - No premature optimization without profiling
 *
 * **Type Safety Guarantees:**
 * - All inputs validated with type guards and assertions
 * - Branded types prevent primitive obsession
 * - Generic constraints ensure structural correctness
 * - Exhaustive pattern matching on discriminated unions
 * - No implicit `any` or type assertions
 *
 * @module command-utilities
 * @category Utilities
 * @since 1.0.0
 * @author TypeScript Architect
 */
import type { Incident, IncidentId, IncidentPriority, IncidentType, ResourceId, ResourceType, ResourceAllocation, GeoCoordinate, Timestamp, PriorityFactors, IncidentByType, ResponseProtocol } from './incident-management-types';
/**
 * Result type for functional error handling without exceptions.
 * Enables type-safe error propagation and composition.
 */
export type Result<T, E = Error> = {
    readonly success: true;
    readonly value: T;
} | {
    readonly success: false;
    readonly error: E;
};
/**
 * Creates a successful Result.
 */
export declare const Ok: <T>(value: T) => Result<T, never>;
/**
 * Creates a failed Result.
 */
export declare const Err: <E>(error: E) => Result<never, E>;
/**
 * Calculates weighted incident priority based on multiple factors.
 *
 * **Algorithm**: Multi-criteria decision analysis with configurable weights
 * **Complexity**: O(1)
 * **Type Safety**: Ensures all factor scores are within [0, 1] range
 *
 * @param factors - Priority calculation factors with weighted components
 * @param weights - Optional custom weights (default: equal weighting)
 * @returns Normalized priority score between 1 and 5
 *
 * @example
 * ```ts
 * const factors: PriorityFactors = {
 *   severityScore: 0.9,
 *   timeScore: 0.7,
 *   resourceAvailabilityScore: 0.5,
 *   populationAtRiskScore: 0.8,
 *   environmentalFactorScore: 0.3
 * };
 * const priority = calculateWeightedPriority(factors);
 * // Returns: 4 (based on weighted average)
 * ```
 */
export declare function calculateWeightedPriority(factors: PriorityFactors, weights?: Partial<Record<keyof PriorityFactors, number>>): 1 | 2 | 3 | 4 | 5;
/**
 * Calculates dynamic priority that adjusts based on elapsed time.
 *
 * **Algorithm**: Exponential time decay with configurable half-life
 * **Complexity**: O(1)
 *
 * @param initialPriority - Initial incident priority
 * @param elapsedMinutes - Time elapsed since incident reported
 * @param urgencyFactor - Urgency multiplier (default: 1.0)
 * @returns Updated priority level
 */
export declare function calculateTimeSensitivePriority(initialPriority: IncidentPriority, elapsedMinutes: number, urgencyFactor?: number): IncidentPriority;
/**
 * Compares two priorities and returns ordering.
 *
 * **Complexity**: O(1)
 *
 * @param a - First priority
 * @param b - Second priority
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export declare function comparePriorities(a: IncidentPriority, b: IncidentPriority): -1 | 0 | 1;
/**
 * Calculates priority adjustment recommendation based on incident evolution.
 *
 * @param currentIncident - Current incident state
 * @param resourcesOnScene - Number of resources currently committed
 * @param durationMinutes - Incident duration in minutes
 * @returns Recommended priority adjustment or null if no change needed
 */
export declare function calculatePriorityAdjustment(currentIncident: Incident, resourcesOnScene: number, durationMinutes: number): IncidentPriority | null;
/**
 * Batch priority calculation for multiple incidents with relative ranking.
 *
 * **Complexity**: O(n log n) for sorting
 *
 * @param incidents - Array of incidents to prioritize
 * @returns Sorted array of incidents by priority (highest first)
 */
export declare function batchPrioritize<T extends Incident>(incidents: ReadonlyArray<T>): ReadonlyArray<T>;
/**
 * Calculates estimated time of arrival (ETA) based on distance and conditions.
 *
 * **Algorithm**: Speed estimation with traffic and terrain factors
 * **Complexity**: O(1)
 *
 * @param distanceKm - Distance to incident in kilometers
 * @param trafficFactor - Traffic density factor (0.5 = light, 1.0 = normal, 1.5 = heavy)
 * @param emergencyMode - Whether using lights and sirens
 * @returns Estimated time in minutes
 */
export declare function calculateETA(distanceKm: number, trafficFactor?: number, emergencyMode?: boolean): number;
/**
 * Calculates response time metrics for incident analysis.
 *
 * @param reportedAt - Incident report timestamp
 * @param dispatchedAt - Dispatch timestamp
 * @param arrivedAt - On-scene arrival timestamp
 * @returns Response time breakdown in minutes
 */
export declare function calculateResponseMetrics(reportedAt: Timestamp, dispatchedAt: Timestamp, arrivedAt: Timestamp): {
    readonly processingTime: number;
    readonly travelTime: number;
    readonly totalResponseTime: number;
};
/**
 * Validates response time against performance benchmarks.
 *
 * @param responseTimeMinutes - Actual response time
 * @param incidentType - Type of incident
 * @param priority - Incident priority
 * @returns true if within benchmark, false otherwise
 */
export declare function validateResponseTimeBenchmark(responseTimeMinutes: number, incidentType: IncidentType, priority: IncidentPriority): boolean;
/**
 * Calculates percentile response time from historical data.
 *
 * **Complexity**: O(n log n)
 *
 * @param responseTimes - Array of historical response times
 * @param percentile - Desired percentile (e.g., 90 for 90th percentile)
 * @returns Response time at specified percentile
 */
export declare function calculateResponseTimePercentile(responseTimes: ReadonlyArray<number>, percentile: number): number;
/**
 * Predicts future response time based on current conditions.
 *
 * @param historicalAverage - Historical average response time
 * @param currentTrafficFactor - Current traffic conditions
 * @param resourceAvailability - Resource availability factor (0-1)
 * @returns Predicted response time in minutes
 */
export declare function predictResponseTime(historicalAverage: number, currentTrafficFactor: number, resourceAvailability: number): number;
/**
 * Selects optimal resource for incident using greedy algorithm.
 *
 * **Algorithm**: Greedy selection based on distance, capability, and availability
 * **Complexity**: O(n) where n is number of available resources
 * **Optimality**: Provides approximate solution; not globally optimal
 *
 * @param incident - Target incident
 * @param availableResources - Array of available resources with locations
 * @param maxDistanceKm - Maximum acceptable distance
 * @returns Optimal resource ID or null if none suitable
 */
export declare function selectOptimalResource<T extends {
    id: ResourceId;
    location: GeoCoordinate;
    type: ResourceType;
}>(incident: Incident, availableResources: ReadonlyArray<T>, maxDistanceKm?: number): ResourceId | null;
/**
 * Allocates resources to multiple incidents using load balancing.
 *
 * **Algorithm**: Round-robin with priority weighting
 * **Complexity**: O(n * m) where n = incidents, m = resources
 *
 * @param incidents - Array of incidents requiring resources
 * @param resources - Available resources pool
 * @returns Map of incident ID to allocated resource IDs
 */
export declare function balanceResourceAllocation(incidents: ReadonlyArray<Incident>, resources: ReadonlyArray<{
    id: ResourceId;
    type: ResourceType;
}>): Map<IncidentId, ReadonlyArray<ResourceId>>;
/**
 * Optimizes resource repositioning for improved coverage.
 *
 * **Algorithm**: K-means clustering for coverage optimization
 * **Complexity**: O(n * k * iterations)
 *
 * @param resources - Current resource positions
 * @param coveragePoints - Points requiring coverage (e.g., population centers)
 * @param k - Number of coverage zones
 * @returns Recommended resource positions
 */
export declare function optimizeResourceCoverage(resources: ReadonlyArray<{
    id: ResourceId;
    location: GeoCoordinate;
}>, coveragePoints: ReadonlyArray<GeoCoordinate>, k?: number): ReadonlyArray<{
    resourceId: ResourceId;
    recommendedLocation: GeoCoordinate;
}>;
/**
 * Calculates resource utilization metrics.
 *
 * @param allocations - Current resource allocations
 * @param totalResources - Total available resources
 * @returns Utilization percentage and statistics
 */
export declare function calculateResourceUtilization(allocations: ReadonlyArray<ResourceAllocation>, totalResources: number): {
    readonly utilizationPercent: number;
    readonly committedCount: number;
    readonly availableCount: number;
};
/**
 * Identifies resource shortfalls and generates requests.
 *
 * @param incidents - Active incidents
 * @param allocations - Current allocations
 * @param protocols - Response protocols by incident type
 * @returns Array of resource request recommendations
 */
export declare function identifyResourceShortfalls<T extends IncidentType>(incidents: ReadonlyArray<IncidentByType<T>>, allocations: Map<IncidentId, ReadonlyArray<ResourceId>>, protocols: Map<T, ResponseProtocol<T>>): ReadonlyArray<{
    incidentId: IncidentId;
    shortfall: number;
    resourceType: ResourceType;
}>;
/**
 * Calculates great-circle distance between two points using Haversine formula.
 *
 * **Algorithm**: Haversine formula for spherical earth model
 * **Complexity**: O(1)
 * **Accuracy**: ±0.5% for distances < 1000km
 *
 * @param point1 - First coordinate
 * @param point2 - Second coordinate
 * @returns Distance in kilometers
 *
 * @example
 * ```ts
 * const distance = calculateHaversineDistance(
 *   { latitude: 40.7128 as Latitude, longitude: -74.0060 as Longitude },
 *   { latitude: 34.0522 as Latitude, longitude: -118.2437 as Longitude }
 * );
 * // Returns: ~3936 km (NYC to LA)
 * ```
 */
export declare function calculateHaversineDistance(point1: GeoCoordinate, point2: GeoCoordinate): number;
/**
 * Calculates Manhattan distance for grid-based routing.
 *
 * **Use Case**: Urban environments with grid street patterns
 * **Complexity**: O(1)
 *
 * @param point1 - First coordinate
 * @param point2 - Second coordinate
 * @returns Manhattan distance in kilometers
 */
export declare function calculateManhattanDistance(point1: GeoCoordinate, point2: GeoCoordinate): number;
/**
 * Calculates bearing (direction) from point1 to point2.
 *
 * @param point1 - Origin point
 * @param point2 - Destination point
 * @returns Bearing in degrees (0-360, where 0/360 is North)
 */
export declare function calculateBearing(point1: GeoCoordinate, point2: GeoCoordinate): number;
/**
 * Finds nearest location to a target point.
 *
 * **Complexity**: O(n)
 *
 * @param target - Target location
 * @param locations - Array of candidate locations
 * @returns Nearest location and distance
 */
export declare function findNearestLocation<T extends {
    location: GeoCoordinate;
}>(target: GeoCoordinate, locations: ReadonlyArray<T>): {
    nearest: T;
    distance: number;
} | null;
/**
 * Calculates geographic centroid of multiple points.
 *
 * **Complexity**: O(n)
 *
 * @param points - Array of coordinates
 * @returns Centroid coordinate
 */
export declare function calculateCentroid(points: ReadonlyArray<GeoCoordinate>): GeoCoordinate;
/**
 * Determines if a point is within a circular radius.
 *
 * @param point - Point to check
 * @param center - Circle center
 * @param radiusKm - Radius in kilometers
 * @returns true if point is within radius
 */
export declare function isWithinRadius(point: GeoCoordinate, center: GeoCoordinate, radiusKm: number): boolean;
/**
 * Calculates optimal route for multiple waypoints (Traveling Salesman Problem approximation).
 *
 * **Algorithm**: Nearest neighbor heuristic
 * **Complexity**: O(n²)
 * **Optimality**: Approximation with 2-opt improvement
 *
 * @param start - Starting location
 * @param waypoints - Locations to visit
 * @param returnToStart - Whether to return to start
 * @returns Ordered array of waypoints
 */
export declare function calculateOptimalRoute(start: GeoCoordinate, waypoints: ReadonlyArray<GeoCoordinate>, returnToStart?: boolean): ReadonlyArray<GeoCoordinate>;
/**
 * Estimates total route distance for a sequence of waypoints.
 *
 * **Complexity**: O(n)
 *
 * @param waypoints - Ordered waypoints
 * @returns Total distance in kilometers
 */
export declare function calculateRouteDistance(waypoints: ReadonlyArray<GeoCoordinate>): number;
/**
 * Finds resources within a specified distance of an incident.
 *
 * @param incident - Target incident
 * @param resources - Available resources with locations
 * @param maxDistanceKm - Maximum distance threshold
 * @returns Resources within range, sorted by distance
 */
export declare function findResourcesInRange<T extends {
    id: ResourceId;
    location: GeoCoordinate;
}>(incident: Incident, resources: ReadonlyArray<T>, maxDistanceKm: number): ReadonlyArray<{
    resource: T;
    distance: number;
}>;
/**
 * Calculates coverage area for a resource deployment.
 *
 * @param resources - Deployed resources
 * @param effectiveRangeKm - Effective response range per resource
 * @returns Estimated coverage area in square kilometers
 */
export declare function calculateCoverageArea(resources: ReadonlyArray<{
    location: GeoCoordinate;
}>, effectiveRangeKm: number): number;
/**
 * Calculates required resource capacity for projected demand.
 *
 * **Algorithm**: Queuing theory (M/M/c model)
 * **Complexity**: O(1)
 *
 * @param averageIncidentsPerHour - Historical average incident rate
 * @param averageServiceTimeMinutes - Average time to resolve incident
 * @param targetUtilization - Target utilization rate (0-1)
 * @returns Required number of resources
 */
export declare function calculateRequiredCapacity(averageIncidentsPerHour: number, averageServiceTimeMinutes: number, targetUtilization?: number): number;
/**
 * Simulates resource demand under various scenarios.
 *
 * @param baselineIncidentsPerDay - Baseline incident rate
 * @param seasonalFactor - Seasonal multiplier
 * @param specialEventFactor - Special event multiplier
 * @returns Projected daily incident count
 */
export declare function projectResourceDemand(baselineIncidentsPerDay: number, seasonalFactor?: number, specialEventFactor?: number): number;
/**
 * Calculates resource surplus or deficit.
 *
 * @param available - Currently available resources
 * @param required - Required resources for demand
 * @returns Positive for surplus, negative for deficit
 */
export declare function calculateCapacityGap(available: number, required: number): number;
/**
 * Recommends resource level adjustments based on utilization trends.
 *
 * @param utilizationHistory - Historical utilization percentages
 * @param thresholdLow - Lower threshold for underutilization
 * @param thresholdHigh - Upper threshold for overutilization
 * @returns Recommendation: 'increase', 'decrease', or 'maintain'
 */
export declare function recommendCapacityAdjustment(utilizationHistory: ReadonlyArray<number>, thresholdLow?: number, thresholdHigh?: number): 'increase' | 'decrease' | 'maintain';
/**
 * Calculates average response time with confidence interval.
 *
 * **Statistics**: Mean and 95% confidence interval
 * **Complexity**: O(n)
 *
 * @param responseTimes - Array of response times in minutes
 * @returns Mean and confidence interval
 */
export declare function calculateAverageResponseTime(responseTimes: ReadonlyArray<number>): {
    mean: number;
    confidenceInterval: [number, number];
};
/**
 * Calculates incident clearance rate.
 *
 * @param resolved - Number of resolved incidents
 * @param total - Total incidents in period
 * @returns Clearance rate as percentage
 */
export declare function calculateClearanceRate(resolved: number, total: number): number;
/**
 * Calculates first-call resolution rate.
 *
 * @param resolvedFirstCall - Incidents resolved without escalation
 * @param total - Total incidents
 * @returns First-call resolution rate as percentage
 */
export declare function calculateFirstCallResolution(resolvedFirstCall: number, total: number): number;
/**
 * Calculates resource productivity score.
 *
 * @param incidentsHandled - Number of incidents handled
 * @param hoursAvailable - Total hours resource was available
 * @returns Incidents per hour productivity metric
 */
export declare function calculateProductivityScore(incidentsHandled: number, hoursAvailable: number): number;
/**
 * Calculates performance trend using linear regression.
 *
 * **Algorithm**: Ordinary least squares regression
 * **Complexity**: O(n)
 *
 * @param timeSeriesData - Array of performance metrics over time
 * @returns Slope (positive = improving, negative = declining)
 */
export declare function calculatePerformanceTrend(timeSeriesData: ReadonlyArray<number>): number;
/**
 * Evaluates if response time exceeds threshold.
 *
 * @param responseTime - Actual response time
 * @param threshold - Configured threshold
 * @returns true if threshold exceeded
 */
export declare function evaluateResponseTimeThreshold(responseTime: number, threshold: number): boolean;
/**
 * Evaluates resource utilization against thresholds.
 *
 * @param utilization - Current utilization percentage
 * @param criticalThreshold - Critical level threshold
 * @returns Alert level: 'normal', 'warning', or 'critical'
 */
export declare function evaluateUtilizationThreshold(utilization: number, criticalThreshold?: number): 'normal' | 'warning' | 'critical';
/**
 * Evaluates if incident duration exceeds expected timeframe.
 *
 * @param durationMinutes - Current incident duration
 * @param incidentType - Type of incident
 * @param priority - Incident priority
 * @returns true if duration exceeds expected timeframe
 */
export declare function evaluateDurationThreshold(durationMinutes: number, incidentType: IncidentType, priority: IncidentPriority): boolean;
/**
 * Evaluates multiple thresholds and returns composite alert status.
 *
 * @param metrics - Object containing various performance metrics
 * @param thresholds - Configured threshold values
 * @returns Highest alert level detected
 */
export declare function evaluateCompositeThresholds(metrics: {
    readonly responseTime?: number;
    readonly utilization?: number;
    readonly incidentDuration?: number;
}, thresholds: {
    readonly responseTimeThreshold?: number;
    readonly utilizationCritical?: number;
    readonly durationThreshold?: number;
}): 'normal' | 'warning' | 'critical';
/**
 * Generates alert recommendations based on threshold violations.
 *
 * @param violations - Array of detected threshold violations
 * @returns Prioritized array of recommended actions
 */
export declare function generateAlertRecommendations(violations: ReadonlyArray<{
    type: string;
    severity: 'warning' | 'critical';
}>): ReadonlyArray<{
    action: string;
    priority: number;
}>;
//# sourceMappingURL=command-utilities.d.ts.map