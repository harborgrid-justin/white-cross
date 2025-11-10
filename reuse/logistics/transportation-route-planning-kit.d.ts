/**
 * LOC: LOGISTICS-ROUTE-001
 * File: /reuse/logistics/transportation-route-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Transportation controllers
 *   - Route optimization services
 *   - Fleet management modules
 *   - Delivery planning systems
 */
/**
 * Route status enumeration
 */
export declare enum RouteStatus {
    DRAFT = "DRAFT",
    PLANNED = "PLANNED",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    DELAYED = "DELAYED",
    FAILED = "FAILED"
}
/**
 * Stop type enumeration
 */
export declare enum StopType {
    PICKUP = "PICKUP",
    DELIVERY = "DELIVERY",
    BOTH = "BOTH",
    SERVICE = "SERVICE",
    WAYPOINT = "WAYPOINT",
    DEPOT = "DEPOT",
    REST = "REST",
    FUEL = "FUEL"
}
/**
 * Stop status enumeration
 */
export declare enum StopStatus {
    PENDING = "PENDING",
    EN_ROUTE = "EN_ROUTE",
    ARRIVED = "ARRIVED",
    IN_SERVICE = "IN_SERVICE",
    COMPLETED = "COMPLETED",
    SKIPPED = "SKIPPED",
    FAILED = "FAILED"
}
/**
 * Optimization strategy enumeration
 */
export declare enum OptimizationStrategy {
    SHORTEST_DISTANCE = "SHORTEST_DISTANCE",
    SHORTEST_TIME = "SHORTEST_TIME",
    FUEL_EFFICIENT = "FUEL_EFFICIENT",
    BALANCED = "BALANCED",
    PRIORITY_BASED = "PRIORITY_BASED",
    CAPACITY_OPTIMIZED = "CAPACITY_OPTIMIZED",
    TIME_WINDOW_OPTIMIZED = "TIME_WINDOW_OPTIMIZED"
}
/**
 * Vehicle type enumeration
 */
export declare enum VehicleType {
    SEDAN = "SEDAN",
    VAN = "VAN",
    TRUCK = "TRUCK",
    SEMI_TRUCK = "SEMI_TRUCK",
    CARGO_VAN = "CARGO_VAN",
    REFRIGERATED = "REFRIGERATED",
    FLATBED = "FLATBED"
}
/**
 * Geographic coordinates
 */
export interface Coordinates {
    latitude: number;
    longitude: number;
    altitude?: number;
}
/**
 * Address information
 */
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: Coordinates;
}
/**
 * Time window constraint
 */
export interface TimeWindow {
    start: Date;
    end: Date;
    isStrict: boolean;
}
/**
 * Route stop definition
 */
export interface RouteStop {
    stopId: string;
    sequenceNumber: number;
    type: StopType;
    status: StopStatus;
    location: Address;
    coordinates: Coordinates;
    timeWindow?: TimeWindow;
    estimatedArrival?: Date;
    actualArrival?: Date;
    estimatedDeparture?: Date;
    actualDeparture?: Date;
    serviceTime: number;
    priority: number;
    notes?: string;
    contactName?: string;
    contactPhone?: string;
    deliveryItems?: DeliveryItem[];
    pickupItems?: PickupItem[];
    requirements?: StopRequirement[];
    metadata?: Record<string, any>;
}
/**
 * Delivery item information
 */
export interface DeliveryItem {
    itemId: string;
    description: string;
    quantity: number;
    weight: number;
    volume: number;
    value: number;
    requiresSignature: boolean;
    isFragile: boolean;
    temperatureControlled?: boolean;
}
/**
 * Pickup item information
 */
export interface PickupItem {
    itemId: string;
    description: string;
    expectedQuantity: number;
    weight: number;
    volume: number;
    value: number;
}
/**
 * Stop requirement/constraint
 */
export interface StopRequirement {
    type: 'VEHICLE_TYPE' | 'CERTIFICATION' | 'EQUIPMENT' | 'ACCESS' | 'OTHER';
    description: string;
    mandatory: boolean;
}
/**
 * Vehicle capacity constraints
 */
export interface VehicleCapacity {
    maxWeight: number;
    maxVolume: number;
    maxStops: number;
    maxDistance: number;
    maxDuration: number;
}
/**
 * Vehicle information
 */
export interface Vehicle {
    vehicleId: string;
    type: VehicleType;
    licensePlate: string;
    capacity: VehicleCapacity;
    fuelEfficiency: number;
    averageSpeed: number;
    currentLocation?: Coordinates;
    availableFrom?: Date;
    availableUntil?: Date;
    features?: string[];
    metadata?: Record<string, any>;
}
/**
 * Route definition
 */
export interface Route {
    routeId: string;
    routeNumber: string;
    status: RouteStatus;
    vehicle?: Vehicle;
    driver?: Driver;
    stops: RouteStop[];
    startLocation: Coordinates;
    endLocation: Coordinates;
    totalDistance: number;
    totalDuration: number;
    totalServiceTime: number;
    estimatedDeparture: Date;
    estimatedArrival: Date;
    actualDeparture?: Date;
    actualArrival?: Date;
    optimizationStrategy?: OptimizationStrategy;
    createdAt: Date;
    updatedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Driver information
 */
export interface Driver {
    driverId: string;
    name: string;
    phone: string;
    licenseNumber: string;
    certifications: string[];
    maxDrivingHours: number;
    currentHours: number;
    availableFrom?: Date;
    availableUntil?: Date;
}
/**
 * Distance calculation result
 */
export interface DistanceResult {
    distance: number;
    duration: number;
    path?: Coordinates[];
    method: 'HAVERSINE' | 'MANHATTAN' | 'ACTUAL_ROAD' | 'ESTIMATED';
}
/**
 * Route optimization result
 */
export interface OptimizationResult {
    originalRoute: Route;
    optimizedRoute: Route;
    improvement: {
        distanceSaved: number;
        timeSaved: number;
        fuelSaved: number;
        costSaved: number;
    };
    strategy: OptimizationStrategy;
    iterations: number;
    computationTime: number;
}
/**
 * Geographic constraint
 */
export interface GeographicConstraint {
    type: 'AVOID_AREA' | 'PREFERRED_AREA' | 'RESTRICTED_ZONE' | 'TOLL_ROAD' | 'HIGHWAY';
    coordinates: Coordinates[];
    radius?: number;
    active: boolean;
    timeRestrictions?: TimeWindow[];
}
/**
 * Traffic pattern data
 */
export interface TrafficPattern {
    routeSegmentId: string;
    dayOfWeek: number;
    hourOfDay: number;
    averageSpeed: number;
    congestionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
    reliability: number;
}
/**
 * Route segment between two points
 */
export interface RouteSegment {
    segmentId: string;
    from: Coordinates;
    to: Coordinates;
    distance: number;
    duration: number;
    trafficMultiplier: number;
    roadType: 'HIGHWAY' | 'ARTERIAL' | 'LOCAL' | 'RESIDENTIAL';
}
/**
 * Multi-route solution for fleet optimization
 */
export interface MultiRouteSolution {
    solutionId: string;
    routes: Route[];
    unassignedStops: RouteStop[];
    totalDistance: number;
    totalDuration: number;
    totalVehicles: number;
    efficiency: number;
    createdAt: Date;
}
/**
 * Route planning configuration
 */
export interface RoutePlanningConfig {
    optimizationStrategy: OptimizationStrategy;
    considerTraffic: boolean;
    considerTimeWindows: boolean;
    allowPartialLoads: boolean;
    maxIterations: number;
    timeoutSeconds: number;
    fuelCostPerLiter: number;
    laborCostPerHour: number;
}
/**
 * 1. Creates a new route instance.
 *
 * @param {Partial<Route>} config - Route configuration
 * @returns {Route} New route object
 *
 * @example
 * ```typescript
 * const route = createRoute({
 *   startLocation: { latitude: 40.7128, longitude: -74.0060 },
 *   endLocation: { latitude: 40.7589, longitude: -73.9851 },
 *   estimatedDeparture: new Date('2024-01-15T08:00:00')
 * });
 * ```
 */
export declare function createRoute(config: Partial<Route>): Route;
/**
 * 2. Assigns vehicle to route.
 *
 * @param {Route} route - Route to update
 * @param {Vehicle} vehicle - Vehicle to assign
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = assignVehicleToRoute(route, {
 *   vehicleId: 'VEH-001',
 *   type: VehicleType.VAN,
 *   licensePlate: 'ABC-123',
 *   capacity: { maxWeight: 1000, maxVolume: 10, maxStops: 20, maxDistance: 300, maxDuration: 10 },
 *   fuelEfficiency: 12,
 *   averageSpeed: 60
 * });
 * ```
 */
export declare function assignVehicleToRoute(route: Route, vehicle: Vehicle): Route;
/**
 * 3. Assigns driver to route.
 *
 * @param {Route} route - Route to update
 * @param {Driver} driver - Driver to assign
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = assignDriverToRoute(route, {
 *   driverId: 'DRV-001',
 *   name: 'John Smith',
 *   phone: '555-0123',
 *   licenseNumber: 'D1234567',
 *   certifications: ['CDL-A', 'HAZMAT'],
 *   maxDrivingHours: 11,
 *   currentHours: 0
 * });
 * ```
 */
export declare function assignDriverToRoute(route: Route, driver: Driver): Route;
/**
 * 4. Validates route configuration.
 *
 * @param {Route} route - Route to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRoute(route);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateRoute(route: Route): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 5. Clones route for modification.
 *
 * @param {Route} route - Route to clone
 * @returns {Route} Cloned route
 *
 * @example
 * ```typescript
 * const clone = cloneRoute(originalRoute);
 * ```
 */
export declare function cloneRoute(route: Route): Route;
/**
 * 6. Updates route status.
 *
 * @param {Route} route - Route to update
 * @param {RouteStatus} status - New status
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = updateRouteStatus(route, RouteStatus.IN_PROGRESS);
 * ```
 */
export declare function updateRouteStatus(route: Route, status: RouteStatus): Route;
/**
 * 7. Calculates route summary statistics.
 *
 * @param {Route} route - Route to analyze
 * @returns {object} Route statistics
 *
 * @example
 * ```typescript
 * const stats = calculateRouteStatistics(route);
 * console.log(`Total stops: ${stats.totalStops}, Distance: ${stats.totalDistance}km`);
 * ```
 */
export declare function calculateRouteStatistics(route: Route): {
    totalStops: number;
    completedStops: number;
    pendingStops: number;
    totalDistance: number;
    totalDuration: number;
    averageStopTime: number;
    estimatedFuelCost: number;
    efficiency: number;
};
/**
 * 8. Exports route to external format.
 *
 * @param {Route} route - Route to export
 * @param {string} format - Export format ('JSON' | 'CSV' | 'GPX')
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const json = exportRoute(route, 'JSON');
 * const csv = exportRoute(route, 'CSV');
 * ```
 */
export declare function exportRoute(route: Route, format: 'JSON' | 'CSV' | 'GPX'): string;
/**
 * 9. Imports route from external format.
 *
 * @param {string} data - Import data
 * @param {string} format - Import format
 * @returns {Route} Imported route
 *
 * @example
 * ```typescript
 * const route = importRoute(jsonData, 'JSON');
 * ```
 */
export declare function importRoute(data: string, format: 'JSON' | 'CSV'): Route;
/**
 * 10. Adds stop to route.
 *
 * @param {Route} route - Route to update
 * @param {Partial<RouteStop>} stop - Stop to add
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = addStopToRoute(route, {
 *   type: StopType.DELIVERY,
 *   location: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
 *   coordinates: { latitude: 40.7128, longitude: -74.0060 },
 *   serviceTime: 15,
 *   priority: 5
 * });
 * ```
 */
export declare function addStopToRoute(route: Route, stop: Partial<RouteStop>): Route;
/**
 * 11. Removes stop from route.
 *
 * @param {Route} route - Route to update
 * @param {string} stopId - Stop ID to remove
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = removeStopFromRoute(route, 'STOP-123');
 * ```
 */
export declare function removeStopFromRoute(route: Route, stopId: string): Route;
/**
 * 12. Reorders stops in route.
 *
 * @param {Route} route - Route to update
 * @param {string[]} stopIds - Ordered array of stop IDs
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = reorderStops(route, ['STOP-002', 'STOP-001', 'STOP-003']);
 * ```
 */
export declare function reorderStops(route: Route, stopIds: string[]): Route;
/**
 * 13. Updates stop status.
 *
 * @param {Route} route - Route to update
 * @param {string} stopId - Stop ID
 * @param {StopStatus} status - New status
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = updateStopStatus(route, 'STOP-123', StopStatus.COMPLETED);
 * ```
 */
export declare function updateStopStatus(route: Route, stopId: string, status: StopStatus): Route;
/**
 * 14. Adds delivery items to stop.
 *
 * @param {Route} route - Route to update
 * @param {string} stopId - Stop ID
 * @param {DeliveryItem[]} items - Delivery items
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = addDeliveryItems(route, 'STOP-123', [{
 *   itemId: 'ITEM-001',
 *   description: 'Package',
 *   quantity: 2,
 *   weight: 10,
 *   volume: 0.5,
 *   value: 100,
 *   requiresSignature: true,
 *   isFragile: false
 * }]);
 * ```
 */
export declare function addDeliveryItems(route: Route, stopId: string, items: DeliveryItem[]): Route;
/**
 * 15. Adds pickup items to stop.
 *
 * @param {Route} route - Route to update
 * @param {string} stopId - Stop ID
 * @param {PickupItem[]} items - Pickup items
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = addPickupItems(route, 'STOP-123', [{
 *   itemId: 'ITEM-002',
 *   description: 'Return package',
 *   expectedQuantity: 1,
 *   weight: 5,
 *   volume: 0.3,
 *   value: 50
 * }]);
 * ```
 */
export declare function addPickupItems(route: Route, stopId: string, items: PickupItem[]): Route;
/**
 * 16. Sets time window for stop.
 *
 * @param {Route} route - Route to update
 * @param {string} stopId - Stop ID
 * @param {TimeWindow} timeWindow - Time window constraint
 * @returns {Route} Updated route
 *
 * @example
 * ```typescript
 * const updated = setStopTimeWindow(route, 'STOP-123', {
 *   start: new Date('2024-01-15T09:00:00'),
 *   end: new Date('2024-01-15T11:00:00'),
 *   isStrict: true
 * });
 * ```
 */
export declare function setStopTimeWindow(route: Route, stopId: string, timeWindow: TimeWindow): Route;
/**
 * 17. Finds next pending stop in route.
 *
 * @param {Route} route - Route to search
 * @returns {RouteStop | null} Next pending stop
 *
 * @example
 * ```typescript
 * const nextStop = findNextPendingStop(route);
 * if (nextStop) {
 *   console.log(`Next stop: ${nextStop.location.street}`);
 * }
 * ```
 */
export declare function findNextPendingStop(route: Route): RouteStop | null;
/**
 * 18. Calculates total load for route.
 *
 * @param {Route} route - Route to analyze
 * @returns {object} Load summary
 *
 * @example
 * ```typescript
 * const load = calculateRouteLoad(route);
 * console.log(`Total weight: ${load.totalWeight}kg, Volume: ${load.totalVolume}m³`);
 * ```
 */
export declare function calculateRouteLoad(route: Route): {
    totalWeight: number;
    totalVolume: number;
    totalValue: number;
    itemCount: number;
    deliveryCount: number;
    pickupCount: number;
};
/**
 * 19. Calculates distance between two coordinates using Haversine formula.
 *
 * @param {Coordinates} from - Starting coordinates
 * @param {Coordinates} to - Ending coordinates
 * @returns {number} Distance in kilometers
 *
 * @example
 * ```typescript
 * const distance = calculateHaversineDistance(
 *   { latitude: 40.7128, longitude: -74.0060 },
 *   { latitude: 40.7589, longitude: -73.9851 }
 * );
 * // Returns: ~5.8 km
 * ```
 */
export declare function calculateHaversineDistance(from: Coordinates, to: Coordinates): number;
/**
 * 20. Calculates Manhattan distance (grid-based).
 *
 * @param {Coordinates} from - Starting coordinates
 * @param {Coordinates} to - Ending coordinates
 * @returns {number} Distance in kilometers
 *
 * @example
 * ```typescript
 * const distance = calculateManhattanDistance(coord1, coord2);
 * ```
 */
export declare function calculateManhattanDistance(from: Coordinates, to: Coordinates): number;
/**
 * 21. Estimates travel time between coordinates.
 *
 * @param {Coordinates} from - Starting coordinates
 * @param {Coordinates} to - Ending coordinates
 * @param {number} averageSpeed - Average speed in km/h
 * @returns {DistanceResult} Distance and time
 *
 * @example
 * ```typescript
 * const result = estimateTravelTime(coord1, coord2, 60);
 * console.log(`Distance: ${result.distance}km, Time: ${result.duration} minutes`);
 * ```
 */
export declare function estimateTravelTime(from: Coordinates, to: Coordinates, averageSpeed: number): DistanceResult;
/**
 * 22. Calculates total route distance.
 *
 * @param {Route} route - Route to analyze
 * @returns {number} Total distance in kilometers
 *
 * @example
 * ```typescript
 * const totalDistance = calculateTotalRouteDistance(route);
 * ```
 */
export declare function calculateTotalRouteDistance(route: Route): number;
/**
 * 23. Calculates estimated arrival times for all stops.
 *
 * @param {Route} route - Route to analyze
 * @returns {Route} Route with updated arrival times
 *
 * @example
 * ```typescript
 * const updated = calculateStopArrivalTimes(route);
 * ```
 */
export declare function calculateStopArrivalTimes(route: Route): Route;
/**
 * 24. Calculates distance matrix for multiple locations.
 *
 * @param {Coordinates[]} locations - Array of locations
 * @returns {number[][]} Distance matrix
 *
 * @example
 * ```typescript
 * const matrix = calculateDistanceMatrix([coord1, coord2, coord3]);
 * // Returns: [[0, 5.2, 8.1], [5.2, 0, 3.4], [8.1, 3.4, 0]]
 * ```
 */
export declare function calculateDistanceMatrix(locations: Coordinates[]): number[][];
/**
 * 25. Finds nearest neighbor to a location.
 *
 * @param {Coordinates} location - Reference location
 * @param {Coordinates[]} candidates - Candidate locations
 * @returns {object} Nearest neighbor info
 *
 * @example
 * ```typescript
 * const nearest = findNearestNeighbor(currentLocation, stops.map(s => s.coordinates));
 * console.log(`Nearest stop is ${nearest.distance}km away at index ${nearest.index}`);
 * ```
 */
export declare function findNearestNeighbor(location: Coordinates, candidates: Coordinates[]): {
    index: number;
    distance: number;
    coordinates: Coordinates;
};
/**
 * 26. Calculates route segment distances.
 *
 * @param {Route} route - Route to analyze
 * @returns {RouteSegment[]} Array of route segments
 *
 * @example
 * ```typescript
 * const segments = calculateRouteSegments(route);
 * ```
 */
export declare function calculateRouteSegments(route: Route): RouteSegment[];
/**
 * 27. Applies traffic multiplier to route segments.
 *
 * @param {RouteSegment[]} segments - Route segments
 * @param {TrafficPattern[]} patterns - Traffic patterns
 * @returns {RouteSegment[]} Updated segments
 *
 * @example
 * ```typescript
 * const updated = applyTrafficPatterns(segments, trafficPatterns);
 * ```
 */
export declare function applyTrafficPatterns(segments: RouteSegment[], patterns: TrafficPattern[]): RouteSegment[];
/**
 * 28. Optimizes route using nearest neighbor algorithm.
 *
 * @param {Route} route - Route to optimize
 * @returns {Route} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeRouteNearestNeighbor(route);
 * ```
 */
export declare function optimizeRouteNearestNeighbor(route: Route): Route;
/**
 * 29. Optimizes route using 2-opt algorithm.
 *
 * @param {Route} route - Route to optimize
 * @param {number} maxIterations - Maximum iterations
 * @returns {Route} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeRoute2Opt(route, 1000);
 * ```
 */
export declare function optimizeRoute2Opt(route: Route, maxIterations?: number): Route;
/**
 * 30. Optimizes route considering time windows.
 *
 * @param {Route} route - Route to optimize
 * @returns {Route} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeRouteWithTimeWindows(route);
 * ```
 */
export declare function optimizeRouteWithTimeWindows(route: Route): Route;
/**
 * 31. Optimizes route for fuel efficiency.
 *
 * @param {Route} route - Route to optimize
 * @returns {Route} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeRouteFuelEfficiency(route);
 * ```
 */
export declare function optimizeRouteFuelEfficiency(route: Route): Route;
/**
 * 32. Balances routes across multiple vehicles.
 *
 * @param {RouteStop[]} stops - All stops to route
 * @param {Vehicle[]} vehicles - Available vehicles
 * @returns {MultiRouteSolution} Multi-route solution
 *
 * @example
 * ```typescript
 * const solution = balanceMultipleRoutes(allStops, availableVehicles);
 * ```
 */
export declare function balanceMultipleRoutes(stops: RouteStop[], vehicles: Vehicle[]): MultiRouteSolution;
/**
 * 33. Optimizes route considering priority stops.
 *
 * @param {Route} route - Route to optimize
 * @returns {Route} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeRoutePriority(route);
 * ```
 */
export declare function optimizeRoutePriority(route: Route): Route;
/**
 * 34. Calculates optimization improvement metrics.
 *
 * @param {Route} originalRoute - Original route
 * @param {Route} optimizedRoute - Optimized route
 * @returns {OptimizationResult} Optimization results
 *
 * @example
 * ```typescript
 * const results = calculateOptimizationImprovement(original, optimized);
 * console.log(`Saved ${results.improvement.distanceSaved}km`);
 * ```
 */
export declare function calculateOptimizationImprovement(originalRoute: Route, optimizedRoute: Route): OptimizationResult;
/**
 * 35. Optimizes route with custom strategy.
 *
 * @param {Route} route - Route to optimize
 * @param {OptimizationStrategy} strategy - Optimization strategy
 * @returns {Route} Optimized route
 *
 * @example
 * ```typescript
 * const optimized = optimizeRouteCustom(route, OptimizationStrategy.SHORTEST_TIME);
 * ```
 */
export declare function optimizeRouteCustom(route: Route, strategy: OptimizationStrategy): Route;
/**
 * 36. Validates optimization constraints.
 *
 * @param {Route} route - Route to validate
 * @returns {object} Constraint validation
 *
 * @example
 * ```typescript
 * const validation = validateOptimizationConstraints(route);
 * if (!validation.valid) {
 *   console.error('Constraint violations:', validation.violations);
 * }
 * ```
 */
export declare function validateOptimizationConstraints(route: Route): {
    valid: boolean;
    violations: string[];
};
/**
 * 37. Checks if coordinate is within geographic area.
 *
 * @param {Coordinates} point - Point to check
 * @param {Coordinates[]} polygon - Polygon vertices
 * @returns {boolean} True if point is inside polygon
 *
 * @example
 * ```typescript
 * const isInside = isPointInPolygon(deliveryLocation, serviceAreaBoundary);
 * ```
 */
export declare function isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean;
/**
 * 38. Calculates geographic center (centroid) of stops.
 *
 * @param {RouteStop[]} stops - Stops to analyze
 * @returns {Coordinates} Geographic center
 *
 * @example
 * ```typescript
 * const center = calculateGeographicCenter(route.stops);
 * console.log(`Center: ${center.latitude}, ${center.longitude}`);
 * ```
 */
export declare function calculateGeographicCenter(stops: RouteStop[]): Coordinates;
/**
 * 39. Clusters stops by geographic proximity.
 *
 * @param {RouteStop[]} stops - Stops to cluster
 * @param {number} maxDistance - Maximum distance for same cluster (km)
 * @returns {RouteStop[][]} Clustered stops
 *
 * @example
 * ```typescript
 * const clusters = clusterStopsByProximity(allStops, 10);
 * console.log(`Created ${clusters.length} delivery zones`);
 * ```
 */
export declare function clusterStopsByProximity(stops: RouteStop[], maxDistance: number): RouteStop[][];
/**
 * 40. Applies geographic constraints to route.
 *
 * @param {Route} route - Route to constrain
 * @param {GeographicConstraint[]} constraints - Geographic constraints
 * @returns {Route} Constrained route
 *
 * @example
 * ```typescript
 * const constrained = applyGeographicConstraints(route, [avoidAreaConstraint]);
 * ```
 */
export declare function applyGeographicConstraints(route: Route, constraints: GeographicConstraint[]): Route;
/**
 * 41. Calculates service area coverage.
 *
 * @param {Coordinates} depot - Depot location
 * @param {number} maxRadius - Maximum service radius (km)
 * @returns {Coordinates[]} Service area boundary
 *
 * @example
 * ```typescript
 * const boundary = calculateServiceArea(depotLocation, 50);
 * ```
 */
export declare function calculateServiceArea(depot: Coordinates, maxRadius: number): Coordinates[];
/**
 * 42. Finds optimal depot location for stops.
 *
 * @param {RouteStop[]} stops - Stops to service
 * @returns {Coordinates} Optimal depot location
 *
 * @example
 * ```typescript
 * const optimalDepot = findOptimalDepotLocation(customerStops);
 * ```
 */
export declare function findOptimalDepotLocation(stops: RouteStop[]): Coordinates;
/**
 * 43. Identifies delivery zones from stops.
 *
 * @param {RouteStop[]} stops - All stops
 * @param {number} maxZones - Maximum number of zones
 * @returns {object} Zone assignments
 *
 * @example
 * ```typescript
 * const zones = identifyDeliveryZones(allStops, 5);
 * ```
 */
export declare function identifyDeliveryZones(stops: RouteStop[], maxZones: number): {
    zones: Map<string, RouteStop[]>;
    centers: Coordinates[];
};
/**
 * 44. Calculates route density (stops per area).
 *
 * @param {Route} route - Route to analyze
 * @returns {object} Density metrics
 *
 * @example
 * ```typescript
 * const density = calculateRouteDensity(route);
 * console.log(`${density.stopsPerSqKm} stops per km²`);
 * ```
 */
export declare function calculateRouteDensity(route: Route): {
    stopsPerSqKm: number;
    stopsPerKm: number;
    averageStopDistance: number;
};
/**
 * 45. Generates geographic heat map data for routes.
 *
 * @param {Route[]} routes - Routes to analyze
 * @param {number} gridSize - Grid size for heat map
 * @returns {object} Heat map data
 *
 * @example
 * ```typescript
 * const heatMap = generateRouteHeatMap(allRoutes, 0.1);
 * ```
 */
export declare function generateRouteHeatMap(routes: Route[], gridSize: number): {
    grid: Map<string, number>;
    maxIntensity: number;
    bounds: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
    };
};
declare const _default: {
    createRoute: typeof createRoute;
    assignVehicleToRoute: typeof assignVehicleToRoute;
    assignDriverToRoute: typeof assignDriverToRoute;
    validateRoute: typeof validateRoute;
    cloneRoute: typeof cloneRoute;
    updateRouteStatus: typeof updateRouteStatus;
    calculateRouteStatistics: typeof calculateRouteStatistics;
    exportRoute: typeof exportRoute;
    importRoute: typeof importRoute;
    addStopToRoute: typeof addStopToRoute;
    removeStopFromRoute: typeof removeStopFromRoute;
    reorderStops: typeof reorderStops;
    updateStopStatus: typeof updateStopStatus;
    addDeliveryItems: typeof addDeliveryItems;
    addPickupItems: typeof addPickupItems;
    setStopTimeWindow: typeof setStopTimeWindow;
    findNextPendingStop: typeof findNextPendingStop;
    calculateRouteLoad: typeof calculateRouteLoad;
    calculateHaversineDistance: typeof calculateHaversineDistance;
    calculateManhattanDistance: typeof calculateManhattanDistance;
    estimateTravelTime: typeof estimateTravelTime;
    calculateTotalRouteDistance: typeof calculateTotalRouteDistance;
    calculateStopArrivalTimes: typeof calculateStopArrivalTimes;
    calculateDistanceMatrix: typeof calculateDistanceMatrix;
    findNearestNeighbor: typeof findNearestNeighbor;
    calculateRouteSegments: typeof calculateRouteSegments;
    applyTrafficPatterns: typeof applyTrafficPatterns;
    optimizeRouteNearestNeighbor: typeof optimizeRouteNearestNeighbor;
    optimizeRoute2Opt: typeof optimizeRoute2Opt;
    optimizeRouteWithTimeWindows: typeof optimizeRouteWithTimeWindows;
    optimizeRouteFuelEfficiency: typeof optimizeRouteFuelEfficiency;
    balanceMultipleRoutes: typeof balanceMultipleRoutes;
    optimizeRoutePriority: typeof optimizeRoutePriority;
    calculateOptimizationImprovement: typeof calculateOptimizationImprovement;
    optimizeRouteCustom: typeof optimizeRouteCustom;
    validateOptimizationConstraints: typeof validateOptimizationConstraints;
    isPointInPolygon: typeof isPointInPolygon;
    calculateGeographicCenter: typeof calculateGeographicCenter;
    clusterStopsByProximity: typeof clusterStopsByProximity;
    applyGeographicConstraints: typeof applyGeographicConstraints;
    calculateServiceArea: typeof calculateServiceArea;
    findOptimalDepotLocation: typeof findOptimalDepotLocation;
    identifyDeliveryZones: typeof identifyDeliveryZones;
    calculateRouteDensity: typeof calculateRouteDensity;
    generateRouteHeatMap: typeof generateRouteHeatMap;
};
export default _default;
//# sourceMappingURL=transportation-route-planning-kit.d.ts.map