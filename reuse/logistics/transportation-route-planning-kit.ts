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
 * File: /reuse/logistics/transportation-route-planning-kit.ts
 * Locator: WC-LOGISTICS-ROUTE-001
 * Purpose: Comprehensive Transportation Route Planning & Optimization - Advanced routing algorithms for logistics operations
 *
 * Upstream: Independent utility module for transportation route planning
 * Downstream: ../backend/logistics/*, Fleet management, Delivery planning, Route optimization services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 45 utility functions for route planning, stop management, distance calculations, optimization, geographic analysis
 *
 * LLM Context: Enterprise-grade transportation route planning utilities to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive route definition, multi-stop routing, distance/time calculations, optimization algorithms,
 * geographic constraint handling, vehicle routing problems (VRP), traveling salesman problem (TSP) solving,
 * real-time route adjustments, fuel optimization, traffic pattern integration, and delivery window management.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Route status enumeration
 */
export enum RouteStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
  FAILED = 'FAILED',
}

/**
 * Stop type enumeration
 */
export enum StopType {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
  BOTH = 'BOTH',
  SERVICE = 'SERVICE',
  WAYPOINT = 'WAYPOINT',
  DEPOT = 'DEPOT',
  REST = 'REST',
  FUEL = 'FUEL',
}

/**
 * Stop status enumeration
 */
export enum StopStatus {
  PENDING = 'PENDING',
  EN_ROUTE = 'EN_ROUTE',
  ARRIVED = 'ARRIVED',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
}

/**
 * Optimization strategy enumeration
 */
export enum OptimizationStrategy {
  SHORTEST_DISTANCE = 'SHORTEST_DISTANCE',
  SHORTEST_TIME = 'SHORTEST_TIME',
  FUEL_EFFICIENT = 'FUEL_EFFICIENT',
  BALANCED = 'BALANCED',
  PRIORITY_BASED = 'PRIORITY_BASED',
  CAPACITY_OPTIMIZED = 'CAPACITY_OPTIMIZED',
  TIME_WINDOW_OPTIMIZED = 'TIME_WINDOW_OPTIMIZED',
}

/**
 * Vehicle type enumeration
 */
export enum VehicleType {
  SEDAN = 'SEDAN',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  SEMI_TRUCK = 'SEMI_TRUCK',
  CARGO_VAN = 'CARGO_VAN',
  REFRIGERATED = 'REFRIGERATED',
  FLATBED = 'FLATBED',
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
  isStrict: boolean; // If true, must arrive within window; if false, preference
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
  serviceTime: number; // Minutes
  priority: number; // 1-10, 10 being highest
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
  weight: number; // kg
  volume: number; // cubic meters
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
  maxWeight: number; // kg
  maxVolume: number; // cubic meters
  maxStops: number;
  maxDistance: number; // km
  maxDuration: number; // hours
}

/**
 * Vehicle information
 */
export interface Vehicle {
  vehicleId: string;
  type: VehicleType;
  licensePlate: string;
  capacity: VehicleCapacity;
  fuelEfficiency: number; // km per liter
  averageSpeed: number; // km/h
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
  totalDistance: number; // km
  totalDuration: number; // minutes
  totalServiceTime: number; // minutes
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
  distance: number; // km
  duration: number; // minutes
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
    distanceSaved: number; // km
    timeSaved: number; // minutes
    fuelSaved: number; // liters
    costSaved: number;
  };
  strategy: OptimizationStrategy;
  iterations: number;
  computationTime: number; // milliseconds
}

/**
 * Geographic constraint
 */
export interface GeographicConstraint {
  type: 'AVOID_AREA' | 'PREFERRED_AREA' | 'RESTRICTED_ZONE' | 'TOLL_ROAD' | 'HIGHWAY';
  coordinates: Coordinates[];
  radius?: number; // meters
  active: boolean;
  timeRestrictions?: TimeWindow[];
}

/**
 * Traffic pattern data
 */
export interface TrafficPattern {
  routeSegmentId: string;
  dayOfWeek: number; // 0-6
  hourOfDay: number; // 0-23
  averageSpeed: number; // km/h
  congestionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
  reliability: number; // 0-1
}

/**
 * Route segment between two points
 */
export interface RouteSegment {
  segmentId: string;
  from: Coordinates;
  to: Coordinates;
  distance: number; // km
  duration: number; // minutes
  trafficMultiplier: number; // 1.0 = normal, >1.0 = slower
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
  efficiency: number; // 0-1
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

// ============================================================================
// SECTION 1: ROUTE DEFINITION (Functions 1-9)
// ============================================================================

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
export function createRoute(config: Partial<Route>): Route {
  const routeId = generateRouteId();
  const routeNumber = generateRouteNumber();

  return {
    routeId,
    routeNumber,
    status: RouteStatus.DRAFT,
    vehicle: config.vehicle,
    driver: config.driver,
    stops: config.stops || [],
    startLocation: config.startLocation || { latitude: 0, longitude: 0 },
    endLocation: config.endLocation || { latitude: 0, longitude: 0 },
    totalDistance: 0,
    totalDuration: 0,
    totalServiceTime: 0,
    estimatedDeparture: config.estimatedDeparture || new Date(),
    estimatedArrival: config.estimatedArrival || new Date(),
    optimizationStrategy: config.optimizationStrategy,
    createdAt: new Date(),
    metadata: config.metadata || {},
  };
}

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
export function assignVehicleToRoute(route: Route, vehicle: Vehicle): Route {
  // Validate vehicle capacity against route requirements
  const validation = validateVehicleCapacity(route, vehicle);

  if (!validation.valid) {
    throw new Error(`Vehicle capacity insufficient: ${validation.issues.join(', ')}`);
  }

  return {
    ...route,
    vehicle,
    status: route.status === RouteStatus.DRAFT ? RouteStatus.PLANNED : route.status,
    updatedAt: new Date(),
  };
}

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
export function assignDriverToRoute(route: Route, driver: Driver): Route {
  // Validate driver availability and hours
  if (driver.currentHours >= driver.maxDrivingHours) {
    throw new Error('Driver has exceeded maximum driving hours');
  }

  const estimatedDrivingHours = route.totalDuration / 60;
  if (driver.currentHours + estimatedDrivingHours > driver.maxDrivingHours) {
    throw new Error('Route duration would exceed driver maximum hours');
  }

  return {
    ...route,
    driver,
    status: route.status === RouteStatus.DRAFT ? RouteStatus.PLANNED : route.status,
    updatedAt: new Date(),
  };
}

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
export function validateRoute(route: Route): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!route.stops || route.stops.length === 0) {
    errors.push('Route must have at least one stop');
  }

  if (!route.vehicle && route.status !== RouteStatus.DRAFT) {
    errors.push('Route must have assigned vehicle');
  }

  if (!route.driver && route.status !== RouteStatus.DRAFT) {
    warnings.push('Route does not have assigned driver');
  }

  // Validate stop sequences
  const sequences = route.stops.map(s => s.sequenceNumber).sort((a, b) => a - b);
  for (let i = 0; i < sequences.length; i++) {
    if (sequences[i] !== i + 1) {
      errors.push('Stop sequence numbers are not consecutive');
      break;
    }
  }

  // Validate time windows
  for (const stop of route.stops) {
    if (stop.timeWindow && stop.timeWindow.isStrict) {
      if (!stop.estimatedArrival) {
        warnings.push(`Stop ${stop.stopId} has strict time window but no estimated arrival`);
      } else if (
        stop.estimatedArrival < stop.timeWindow.start ||
        stop.estimatedArrival > stop.timeWindow.end
      ) {
        errors.push(`Stop ${stop.stopId} estimated arrival outside time window`);
      }
    }
  }

  // Validate vehicle capacity
  if (route.vehicle) {
    const capacityValidation = validateVehicleCapacity(route, route.vehicle);
    if (!capacityValidation.valid) {
      errors.push(...capacityValidation.issues);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

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
export function cloneRoute(route: Route): Route {
  const cloned = JSON.parse(JSON.stringify(route));
  cloned.routeId = generateRouteId();
  cloned.routeNumber = generateRouteNumber();
  cloned.status = RouteStatus.DRAFT;
  cloned.createdAt = new Date();
  return cloned;
}

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
export function updateRouteStatus(route: Route, status: RouteStatus): Route {
  const now = new Date();

  const updates: Partial<Route> = {
    status,
    updatedAt: now,
  };

  if (status === RouteStatus.IN_PROGRESS && !route.actualDeparture) {
    updates.actualDeparture = now;
  }

  if (status === RouteStatus.COMPLETED && !route.actualArrival) {
    updates.actualArrival = now;
  }

  return {
    ...route,
    ...updates,
  };
}

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
export function calculateRouteStatistics(route: Route): {
  totalStops: number;
  completedStops: number;
  pendingStops: number;
  totalDistance: number;
  totalDuration: number;
  averageStopTime: number;
  estimatedFuelCost: number;
  efficiency: number;
} {
  const completedStops = route.stops.filter(s => s.status === StopStatus.COMPLETED).length;
  const pendingStops = route.stops.filter(s => s.status === StopStatus.PENDING).length;
  const averageStopTime = route.stops.length > 0
    ? route.stops.reduce((sum, s) => sum + s.serviceTime, 0) / route.stops.length
    : 0;

  const fuelNeeded = route.vehicle
    ? route.totalDistance / route.vehicle.fuelEfficiency
    : 0;

  const estimatedFuelCost = fuelNeeded * 1.5; // $1.50 per liter default

  const efficiency = route.vehicle
    ? (route.stops.length / route.totalDistance) * 100
    : 0;

  return {
    totalStops: route.stops.length,
    completedStops,
    pendingStops,
    totalDistance: route.totalDistance,
    totalDuration: route.totalDuration,
    averageStopTime,
    estimatedFuelCost,
    efficiency,
  };
}

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
export function exportRoute(route: Route, format: 'JSON' | 'CSV' | 'GPX'): string {
  switch (format) {
    case 'JSON':
      return JSON.stringify(route, null, 2);

    case 'CSV':
      let csv = 'Sequence,Type,Status,Address,Lat,Lng,Time Window,Service Time,Priority\n';
      for (const stop of route.stops) {
        const timeWindow = stop.timeWindow
          ? `${stop.timeWindow.start.toISOString()}-${stop.timeWindow.end.toISOString()}`
          : '';
        csv += [
          stop.sequenceNumber,
          stop.type,
          stop.status,
          `"${stop.location.street}, ${stop.location.city}"`,
          stop.coordinates.latitude,
          stop.coordinates.longitude,
          timeWindow,
          stop.serviceTime,
          stop.priority,
        ].join(',') + '\n';
      }
      return csv;

    case 'GPX':
      // Simplified GPX format
      let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
      gpx += '<gpx version="1.1" creator="White Cross Logistics">\n';
      gpx += `  <metadata><name>${route.routeNumber}</name></metadata>\n`;
      gpx += '  <rte>\n';
      gpx += `    <name>${route.routeNumber}</name>\n`;
      for (const stop of route.stops) {
        gpx += `    <rtept lat="${stop.coordinates.latitude}" lon="${stop.coordinates.longitude}">\n`;
        gpx += `      <name>${stop.location.street}</name>\n`;
        gpx += `      <type>${stop.type}</type>\n`;
        gpx += `    </rtept>\n`;
      }
      gpx += '  </rte>\n';
      gpx += '</gpx>';
      return gpx;

    default:
      return JSON.stringify(route);
  }
}

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
export function importRoute(data: string, format: 'JSON' | 'CSV'): Route {
  if (format === 'JSON') {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      routeId: generateRouteId(),
      routeNumber: generateRouteNumber(),
      status: RouteStatus.DRAFT,
      createdAt: new Date(),
    };
  }

  if (format === 'CSV') {
    const lines = data.split('\n').slice(1); // Skip header
    const stops: RouteStop[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.split(',');
      stops.push({
        stopId: generateStopId(),
        sequenceNumber: parseInt(parts[0]),
        type: parts[1] as StopType,
        status: StopStatus.PENDING,
        location: {
          street: parts[3].replace(/"/g, ''),
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        coordinates: {
          latitude: parseFloat(parts[4]),
          longitude: parseFloat(parts[5]),
        },
        serviceTime: parseInt(parts[7]),
        priority: parseInt(parts[8]),
      });
    }

    return createRoute({ stops });
  }

  throw new Error(`Unsupported import format: ${format}`);
}

// ============================================================================
// SECTION 2: STOP MANAGEMENT (Functions 10-18)
// ============================================================================

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
export function addStopToRoute(route: Route, stop: Partial<RouteStop>): Route {
  const stopId = generateStopId();
  const sequenceNumber = route.stops.length + 1;

  const newStop: RouteStop = {
    stopId,
    sequenceNumber,
    type: stop.type || StopType.DELIVERY,
    status: StopStatus.PENDING,
    location: stop.location || { street: '', city: '', state: '', zipCode: '', country: '' },
    coordinates: stop.coordinates || { latitude: 0, longitude: 0 },
    timeWindow: stop.timeWindow,
    serviceTime: stop.serviceTime || 15,
    priority: stop.priority || 5,
    notes: stop.notes,
    contactName: stop.contactName,
    contactPhone: stop.contactPhone,
    deliveryItems: stop.deliveryItems || [],
    pickupItems: stop.pickupItems || [],
    requirements: stop.requirements || [],
    metadata: stop.metadata || {},
  };

  return {
    ...route,
    stops: [...route.stops, newStop],
    updatedAt: new Date(),
  };
}

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
export function removeStopFromRoute(route: Route, stopId: string): Route {
  const updatedStops = route.stops
    .filter(s => s.stopId !== stopId)
    .map((stop, index) => ({
      ...stop,
      sequenceNumber: index + 1,
    }));

  return {
    ...route,
    stops: updatedStops,
    updatedAt: new Date(),
  };
}

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
export function reorderStops(route: Route, stopIds: string[]): Route {
  const stopMap = new Map(route.stops.map(s => [s.stopId, s]));
  const reorderedStops: RouteStop[] = [];

  for (let i = 0; i < stopIds.length; i++) {
    const stop = stopMap.get(stopIds[i]);
    if (stop) {
      reorderedStops.push({
        ...stop,
        sequenceNumber: i + 1,
      });
    }
  }

  // Add any stops not in the reorder list
  for (const stop of route.stops) {
    if (!stopIds.includes(stop.stopId)) {
      reorderedStops.push({
        ...stop,
        sequenceNumber: reorderedStops.length + 1,
      });
    }
  }

  return {
    ...route,
    stops: reorderedStops,
    updatedAt: new Date(),
  };
}

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
export function updateStopStatus(
  route: Route,
  stopId: string,
  status: StopStatus
): Route {
  const now = new Date();

  const updatedStops = route.stops.map(stop => {
    if (stop.stopId === stopId) {
      const updates: Partial<RouteStop> = { status };

      if (status === StopStatus.ARRIVED && !stop.actualArrival) {
        updates.actualArrival = now;
      }

      if (status === StopStatus.COMPLETED && !stop.actualDeparture) {
        updates.actualDeparture = now;
      }

      return { ...stop, ...updates };
    }
    return stop;
  });

  return {
    ...route,
    stops: updatedStops,
    updatedAt: now,
  };
}

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
export function addDeliveryItems(
  route: Route,
  stopId: string,
  items: DeliveryItem[]
): Route {
  const updatedStops = route.stops.map(stop => {
    if (stop.stopId === stopId) {
      return {
        ...stop,
        deliveryItems: [...(stop.deliveryItems || []), ...items],
      };
    }
    return stop;
  });

  return {
    ...route,
    stops: updatedStops,
    updatedAt: new Date(),
  };
}

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
export function addPickupItems(
  route: Route,
  stopId: string,
  items: PickupItem[]
): Route {
  const updatedStops = route.stops.map(stop => {
    if (stop.stopId === stopId) {
      return {
        ...stop,
        pickupItems: [...(stop.pickupItems || []), ...items],
      };
    }
    return stop;
  });

  return {
    ...route,
    stops: updatedStops,
    updatedAt: new Date(),
  };
}

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
export function setStopTimeWindow(
  route: Route,
  stopId: string,
  timeWindow: TimeWindow
): Route {
  const updatedStops = route.stops.map(stop => {
    if (stop.stopId === stopId) {
      return { ...stop, timeWindow };
    }
    return stop;
  });

  return {
    ...route,
    stops: updatedStops,
    updatedAt: new Date(),
  };
}

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
export function findNextPendingStop(route: Route): RouteStop | null {
  const pendingStops = route.stops
    .filter(s => s.status === StopStatus.PENDING || s.status === StopStatus.EN_ROUTE)
    .sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  return pendingStops.length > 0 ? pendingStops[0] : null;
}

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
export function calculateRouteLoad(route: Route): {
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  itemCount: number;
  deliveryCount: number;
  pickupCount: number;
} {
  let totalWeight = 0;
  let totalVolume = 0;
  let totalValue = 0;
  let itemCount = 0;
  let deliveryCount = 0;
  let pickupCount = 0;

  for (const stop of route.stops) {
    if (stop.deliveryItems) {
      for (const item of stop.deliveryItems) {
        totalWeight += item.weight * item.quantity;
        totalVolume += item.volume * item.quantity;
        totalValue += item.value * item.quantity;
        itemCount += item.quantity;
        deliveryCount++;
      }
    }

    if (stop.pickupItems) {
      for (const item of stop.pickupItems) {
        totalWeight += item.weight * item.expectedQuantity;
        totalVolume += item.volume * item.expectedQuantity;
        totalValue += item.value * item.expectedQuantity;
        itemCount += item.expectedQuantity;
        pickupCount++;
      }
    }
  }

  return {
    totalWeight,
    totalVolume,
    totalValue,
    itemCount,
    deliveryCount,
    pickupCount,
  };
}

// ============================================================================
// SECTION 3: DISTANCE CALCULATIONS (Functions 19-27)
// ============================================================================

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
export function calculateHaversineDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
export function calculateManhattanDistance(from: Coordinates, to: Coordinates): number {
  const latDistance = calculateHaversineDistance(
    from,
    { latitude: to.latitude, longitude: from.longitude }
  );
  const lonDistance = calculateHaversineDistance(
    { latitude: to.latitude, longitude: from.longitude },
    to
  );
  return latDistance + lonDistance;
}

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
export function estimateTravelTime(
  from: Coordinates,
  to: Coordinates,
  averageSpeed: number
): DistanceResult {
  const distance = calculateHaversineDistance(from, to);
  const duration = (distance / averageSpeed) * 60; // Convert to minutes

  return {
    distance,
    duration,
    method: 'HAVERSINE',
  };
}

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
export function calculateTotalRouteDistance(route: Route): number {
  if (route.stops.length === 0) return 0;

  let totalDistance = 0;
  let previousCoords = route.startLocation;

  for (const stop of route.stops.sort((a, b) => a.sequenceNumber - b.sequenceNumber)) {
    totalDistance += calculateHaversineDistance(previousCoords, stop.coordinates);
    previousCoords = stop.coordinates;
  }

  // Add distance from last stop to end location
  totalDistance += calculateHaversineDistance(previousCoords, route.endLocation);

  return totalDistance;
}

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
export function calculateStopArrivalTimes(route: Route): Route {
  if (!route.vehicle) {
    throw new Error('Route must have assigned vehicle for time calculations');
  }

  const updatedStops: RouteStop[] = [];
  let currentTime = route.estimatedDeparture;
  let currentLocation = route.startLocation;

  for (const stop of route.stops.sort((a, b) => a.sequenceNumber - b.sequenceNumber)) {
    const travelTime = estimateTravelTime(
      currentLocation,
      stop.coordinates,
      route.vehicle.averageSpeed
    );

    currentTime = new Date(currentTime.getTime() + travelTime.duration * 60000);

    const estimatedDeparture = new Date(
      currentTime.getTime() + stop.serviceTime * 60000
    );

    updatedStops.push({
      ...stop,
      estimatedArrival: currentTime,
      estimatedDeparture,
    });

    currentTime = estimatedDeparture;
    currentLocation = stop.coordinates;
  }

  return {
    ...route,
    stops: updatedStops,
  };
}

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
export function calculateDistanceMatrix(locations: Coordinates[]): number[][] {
  const matrix: number[][] = [];

  for (let i = 0; i < locations.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < locations.length; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        matrix[i][j] = calculateHaversineDistance(locations[i], locations[j]);
      }
    }
  }

  return matrix;
}

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
export function findNearestNeighbor(
  location: Coordinates,
  candidates: Coordinates[]
): {
  index: number;
  distance: number;
  coordinates: Coordinates;
} {
  let minDistance = Infinity;
  let nearestIndex = -1;

  for (let i = 0; i < candidates.length; i++) {
    const distance = calculateHaversineDistance(location, candidates[i]);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return {
    index: nearestIndex,
    distance: minDistance,
    coordinates: candidates[nearestIndex],
  };
}

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
export function calculateRouteSegments(route: Route): RouteSegment[] {
  const segments: RouteSegment[] = [];
  const sortedStops = [...route.stops].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  let previousCoords = route.startLocation;

  for (const stop of sortedStops) {
    const distance = calculateHaversineDistance(previousCoords, stop.coordinates);
    const duration = route.vehicle
      ? (distance / route.vehicle.averageSpeed) * 60
      : (distance / 60) * 60; // Default 60 km/h

    segments.push({
      segmentId: generateSegmentId(),
      from: previousCoords,
      to: stop.coordinates,
      distance,
      duration,
      trafficMultiplier: 1.0,
      roadType: 'LOCAL',
    });

    previousCoords = stop.coordinates;
  }

  // Final segment to end location
  const finalDistance = calculateHaversineDistance(previousCoords, route.endLocation);
  const finalDuration = route.vehicle
    ? (finalDistance / route.vehicle.averageSpeed) * 60
    : (finalDistance / 60) * 60;

  segments.push({
    segmentId: generateSegmentId(),
    from: previousCoords,
    to: route.endLocation,
    distance: finalDistance,
    duration: finalDuration,
    trafficMultiplier: 1.0,
    roadType: 'LOCAL',
  });

  return segments;
}

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
export function applyTrafficPatterns(
  segments: RouteSegment[],
  patterns: TrafficPattern[]
): RouteSegment[] {
  return segments.map(segment => {
    // Find matching traffic pattern
    const pattern = patterns.find(p => p.routeSegmentId === segment.segmentId);

    if (pattern) {
      const multiplier = pattern.congestionLevel === 'LOW' ? 1.0
        : pattern.congestionLevel === 'MEDIUM' ? 1.3
        : pattern.congestionLevel === 'HIGH' ? 1.6
        : 2.0; // SEVERE

      return {
        ...segment,
        trafficMultiplier: multiplier,
        duration: segment.duration * multiplier,
      };
    }

    return segment;
  });
}

// ============================================================================
// SECTION 4: ROUTE OPTIMIZATION (Functions 28-36)
// ============================================================================

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
export function optimizeRouteNearestNeighbor(route: Route): Route {
  if (route.stops.length <= 1) return route;

  const unvisited = [...route.stops];
  const ordered: RouteStop[] = [];
  let currentLocation = route.startLocation;

  while (unvisited.length > 0) {
    const nearest = findNearestNeighbor(
      currentLocation,
      unvisited.map(s => s.coordinates)
    );

    const stop = unvisited[nearest.index];
    ordered.push({
      ...stop,
      sequenceNumber: ordered.length + 1,
    });

    currentLocation = stop.coordinates;
    unvisited.splice(nearest.index, 1);
  }

  const optimizedRoute = {
    ...route,
    stops: ordered,
    updatedAt: new Date(),
  };

  return recalculateRouteMetrics(optimizedRoute);
}

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
export function optimizeRoute2Opt(route: Route, maxIterations: number = 1000): Route {
  if (route.stops.length <= 2) return route;

  let currentRoute = { ...route };
  let currentDistance = calculateTotalRouteDistance(currentRoute);
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < currentRoute.stops.length - 1; i++) {
      for (let j = i + 1; j < currentRoute.stops.length; j++) {
        // Reverse segment between i and j
        const newStops = [
          ...currentRoute.stops.slice(0, i),
          ...currentRoute.stops.slice(i, j + 1).reverse(),
          ...currentRoute.stops.slice(j + 1),
        ].map((stop, index) => ({ ...stop, sequenceNumber: index + 1 }));

        const newRoute = { ...currentRoute, stops: newStops };
        const newDistance = calculateTotalRouteDistance(newRoute);

        if (newDistance < currentDistance) {
          currentRoute = newRoute;
          currentDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return recalculateRouteMetrics(currentRoute);
}

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
export function optimizeRouteWithTimeWindows(route: Route): Route {
  // Sort stops by time window start time
  const stopsWithWindows = route.stops.filter(s => s.timeWindow);
  const stopsWithoutWindows = route.stops.filter(s => !s.timeWindow);

  const sortedWithWindows = stopsWithWindows.sort((a, b) => {
    if (!a.timeWindow || !b.timeWindow) return 0;
    return a.timeWindow.start.getTime() - b.timeWindow.start.getTime();
  });

  // Optimize stops without time windows
  const optimizedWithout = optimizeRouteNearestNeighbor({
    ...route,
    stops: stopsWithoutWindows,
  });

  // Interleave time-windowed stops
  const finalStops: RouteStop[] = [];
  let withoutIndex = 0;

  for (const windowStop of sortedWithWindows) {
    // Add non-windowed stops that can fit before this windowed stop
    while (withoutIndex < optimizedWithout.stops.length) {
      finalStops.push(optimizedWithout.stops[withoutIndex]);
      withoutIndex++;
    }
    finalStops.push(windowStop);
  }

  // Add remaining non-windowed stops
  while (withoutIndex < optimizedWithout.stops.length) {
    finalStops.push(optimizedWithout.stops[withoutIndex]);
    withoutIndex++;
  }

  const resequenced = finalStops.map((stop, index) => ({
    ...stop,
    sequenceNumber: index + 1,
  }));

  return recalculateRouteMetrics({ ...route, stops: resequenced });
}

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
export function optimizeRouteFuelEfficiency(route: Route): Route {
  // Minimize total distance and avoid backtracking
  let optimized = optimizeRoute2Opt(route, 2000);

  // Further optimize by considering elevation changes if available
  if (route.stops.some(s => s.coordinates.altitude !== undefined)) {
    // Prefer routes with less elevation gain
    const stopsWithAltitude = optimized.stops.sort((a, b) => {
      const altA = a.coordinates.altitude || 0;
      const altB = b.coordinates.altitude || 0;
      return altA - altB; // Prefer downhill routes
    }).map((stop, index) => ({ ...stop, sequenceNumber: index + 1 }));

    optimized = { ...optimized, stops: stopsWithAltitude };
  }

  return recalculateRouteMetrics(optimized);
}

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
export function balanceMultipleRoutes(
  stops: RouteStop[],
  vehicles: Vehicle[]
): MultiRouteSolution {
  if (vehicles.length === 0) {
    throw new Error('No vehicles available for routing');
  }

  const routes: Route[] = [];
  const unassignedStops: RouteStop[] = [];
  const stopsPerVehicle = Math.ceil(stops.length / vehicles.length);

  // Simple balanced distribution
  for (let i = 0; i < vehicles.length; i++) {
    const vehicleStops = stops.slice(i * stopsPerVehicle, (i + 1) * stopsPerVehicle);

    if (vehicleStops.length > 0) {
      const route = createRoute({
        vehicle: vehicles[i],
        stops: vehicleStops.map((stop, index) => ({
          ...stop,
          sequenceNumber: index + 1,
        })),
        startLocation: vehicles[i].currentLocation || { latitude: 0, longitude: 0 },
        endLocation: vehicles[i].currentLocation || { latitude: 0, longitude: 0 },
      });

      const optimized = optimizeRouteNearestNeighbor(route);
      routes.push(optimized);
    }
  }

  const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
  const totalDuration = routes.reduce((sum, r) => sum + r.totalDuration, 0);

  return {
    solutionId: `SOL-${crypto.randomUUID()}`,
    routes,
    unassignedStops,
    totalDistance,
    totalDuration,
    totalVehicles: routes.length,
    efficiency: stops.length / routes.length,
    createdAt: new Date(),
  };
}

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
export function optimizeRoutePriority(route: Route): Route {
  // Sort by priority (descending), then optimize within priority groups
  const priorityGroups = new Map<number, RouteStop[]>();

  for (const stop of route.stops) {
    const priority = stop.priority || 5;
    if (!priorityGroups.has(priority)) {
      priorityGroups.set(priority, []);
    }
    priorityGroups.get(priority)!.push(stop);
  }

  const orderedStops: RouteStop[] = [];
  const priorities = Array.from(priorityGroups.keys()).sort((a, b) => b - a);

  for (const priority of priorities) {
    const groupStops = priorityGroups.get(priority)!;

    // Optimize within this priority group
    const tempRoute = createRoute({
      stops: groupStops,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
    });
    const optimized = optimizeRouteNearestNeighbor(tempRoute);

    orderedStops.push(...optimized.stops);
  }

  const resequenced = orderedStops.map((stop, index) => ({
    ...stop,
    sequenceNumber: index + 1,
  }));

  return recalculateRouteMetrics({ ...route, stops: resequenced });
}

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
export function calculateOptimizationImprovement(
  originalRoute: Route,
  optimizedRoute: Route
): OptimizationResult {
  const distanceSaved = originalRoute.totalDistance - optimizedRoute.totalDistance;
  const timeSaved = originalRoute.totalDuration - optimizedRoute.totalDuration;

  const fuelSaved = originalRoute.vehicle
    ? distanceSaved / originalRoute.vehicle.fuelEfficiency
    : 0;

  const costSaved = fuelSaved * 1.5 + (timeSaved / 60) * 25; // $1.50/L fuel, $25/hour labor

  return {
    originalRoute,
    optimizedRoute,
    improvement: {
      distanceSaved,
      timeSaved,
      fuelSaved,
      costSaved,
    },
    strategy: optimizedRoute.optimizationStrategy || OptimizationStrategy.BALANCED,
    iterations: 0,
    computationTime: 0,
  };
}

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
export function optimizeRouteCustom(
  route: Route,
  strategy: OptimizationStrategy
): Route {
  const startTime = Date.now();

  let optimized: Route;

  switch (strategy) {
    case OptimizationStrategy.SHORTEST_DISTANCE:
      optimized = optimizeRoute2Opt(route, 2000);
      break;

    case OptimizationStrategy.SHORTEST_TIME:
      optimized = optimizeRoute2Opt(route, 1500);
      optimized = calculateStopArrivalTimes(optimized);
      break;

    case OptimizationStrategy.FUEL_EFFICIENT:
      optimized = optimizeRouteFuelEfficiency(route);
      break;

    case OptimizationStrategy.PRIORITY_BASED:
      optimized = optimizeRoutePriority(route);
      break;

    case OptimizationStrategy.TIME_WINDOW_OPTIMIZED:
      optimized = optimizeRouteWithTimeWindows(route);
      break;

    case OptimizationStrategy.BALANCED:
    default:
      optimized = optimizeRouteNearestNeighbor(route);
      optimized = optimizeRoute2Opt(optimized, 1000);
      break;
  }

  optimized.optimizationStrategy = strategy;
  optimized.metadata = {
    ...optimized.metadata,
    optimizationTime: Date.now() - startTime,
  };

  return optimized;
}

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
export function validateOptimizationConstraints(route: Route): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check vehicle capacity
  if (route.vehicle) {
    const load = calculateRouteLoad(route);

    if (load.totalWeight > route.vehicle.capacity.maxWeight) {
      violations.push(`Weight ${load.totalWeight}kg exceeds capacity ${route.vehicle.capacity.maxWeight}kg`);
    }

    if (load.totalVolume > route.vehicle.capacity.maxVolume) {
      violations.push(`Volume ${load.totalVolume}m³ exceeds capacity ${route.vehicle.capacity.maxVolume}m³`);
    }

    if (route.stops.length > route.vehicle.capacity.maxStops) {
      violations.push(`${route.stops.length} stops exceeds max ${route.vehicle.capacity.maxStops}`);
    }

    if (route.totalDistance > route.vehicle.capacity.maxDistance) {
      violations.push(`Distance ${route.totalDistance}km exceeds max ${route.vehicle.capacity.maxDistance}km`);
    }

    if (route.totalDuration / 60 > route.vehicle.capacity.maxDuration) {
      violations.push(`Duration ${route.totalDuration / 60}h exceeds max ${route.vehicle.capacity.maxDuration}h`);
    }
  }

  // Check driver hours
  if (route.driver) {
    const drivingHours = route.totalDuration / 60;
    if (route.driver.currentHours + drivingHours > route.driver.maxDrivingHours) {
      violations.push(`Driving hours exceed driver limit`);
    }
  }

  // Check time windows
  for (const stop of route.stops) {
    if (stop.timeWindow && stop.timeWindow.isStrict && stop.estimatedArrival) {
      if (
        stop.estimatedArrival < stop.timeWindow.start ||
        stop.estimatedArrival > stop.timeWindow.end
      ) {
        violations.push(`Stop ${stop.stopId} arrival outside strict time window`);
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

// ============================================================================
// SECTION 5: GEOGRAPHIC ANALYSIS (Functions 37-45)
// ============================================================================

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
export function isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
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
export function calculateGeographicCenter(stops: RouteStop[]): Coordinates {
  if (stops.length === 0) {
    return { latitude: 0, longitude: 0 };
  }

  const sum = stops.reduce(
    (acc, stop) => ({
      latitude: acc.latitude + stop.coordinates.latitude,
      longitude: acc.longitude + stop.coordinates.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: sum.latitude / stops.length,
    longitude: sum.longitude / stops.length,
  };
}

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
export function clusterStopsByProximity(
  stops: RouteStop[],
  maxDistance: number
): RouteStop[][] {
  const clusters: RouteStop[][] = [];
  const unassigned = [...stops];

  while (unassigned.length > 0) {
    const cluster: RouteStop[] = [unassigned.shift()!];

    let added = true;
    while (added) {
      added = false;

      for (let i = unassigned.length - 1; i >= 0; i--) {
        const stop = unassigned[i];

        // Check if stop is close to any stop in cluster
        for (const clusterStop of cluster) {
          const distance = calculateHaversineDistance(
            stop.coordinates,
            clusterStop.coordinates
          );

          if (distance <= maxDistance) {
            cluster.push(stop);
            unassigned.splice(i, 1);
            added = true;
            break;
          }
        }
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

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
export function applyGeographicConstraints(
  route: Route,
  constraints: GeographicConstraint[]
): Route {
  const metadata = {
    ...route.metadata,
    appliedConstraints: constraints.filter(c => c.active).map(c => c.type),
  };

  // Filter out stops in restricted zones
  const validStops = route.stops.filter(stop => {
    for (const constraint of constraints) {
      if (!constraint.active) continue;

      if (constraint.type === 'RESTRICTED_ZONE' || constraint.type === 'AVOID_AREA') {
        if (isPointInPolygon(stop.coordinates, constraint.coordinates)) {
          return false;
        }
      }
    }
    return true;
  });

  return {
    ...route,
    stops: validStops.map((stop, index) => ({
      ...stop,
      sequenceNumber: index + 1,
    })),
    metadata,
    updatedAt: new Date(),
  };
}

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
export function calculateServiceArea(
  depot: Coordinates,
  maxRadius: number
): Coordinates[] {
  const boundary: Coordinates[] = [];
  const points = 36; // Number of points in circle

  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const point = calculateDestinationPoint(depot, maxRadius, angle);
    boundary.push(point);
  }

  return boundary;
}

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
export function findOptimalDepotLocation(stops: RouteStop[]): Coordinates {
  // Use geographic center as initial approximation
  const center = calculateGeographicCenter(stops);

  // Weighted center based on stop frequency/priority
  const weightedSum = stops.reduce(
    (acc, stop) => {
      const weight = stop.priority || 1;
      return {
        latitude: acc.latitude + stop.coordinates.latitude * weight,
        longitude: acc.longitude + stop.coordinates.longitude * weight,
        totalWeight: acc.totalWeight + weight,
      };
    },
    { latitude: 0, longitude: 0, totalWeight: 0 }
  );

  return {
    latitude: weightedSum.latitude / weightedSum.totalWeight,
    longitude: weightedSum.longitude / weightedSum.totalWeight,
  };
}

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
export function identifyDeliveryZones(
  stops: RouteStop[],
  maxZones: number
): {
  zones: Map<string, RouteStop[]>;
  centers: Coordinates[];
} {
  // Simple k-means clustering
  const centers: Coordinates[] = [];

  // Initialize random centers
  for (let i = 0; i < maxZones && i < stops.length; i++) {
    centers.push(stops[i].coordinates);
  }

  let assignments = new Map<string, RouteStop[]>();
  let converged = false;
  let iterations = 0;

  while (!converged && iterations < 100) {
    // Assign stops to nearest center
    const newAssignments = new Map<string, RouteStop[]>();

    for (const stop of stops) {
      const nearest = findNearestNeighbor(stop.coordinates, centers);
      const zoneId = `ZONE-${nearest.index}`;

      if (!newAssignments.has(zoneId)) {
        newAssignments.set(zoneId, []);
      }
      newAssignments.get(zoneId)!.push(stop);
    }

    // Recalculate centers
    const newCenters: Coordinates[] = [];
    for (let i = 0; i < maxZones; i++) {
      const zoneStops = newAssignments.get(`ZONE-${i}`) || [];
      if (zoneStops.length > 0) {
        newCenters.push(calculateGeographicCenter(zoneStops));
      } else {
        newCenters.push(centers[i]);
      }
    }

    // Check convergence
    converged = true;
    for (let i = 0; i < centers.length; i++) {
      const distance = calculateHaversineDistance(centers[i], newCenters[i]);
      if (distance > 0.1) {
        converged = false;
        break;
      }
    }

    centers.length = 0;
    centers.push(...newCenters);
    assignments = newAssignments;
    iterations++;
  }

  return { zones: assignments, centers };
}

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
export function calculateRouteDensity(route: Route): {
  stopsPerSqKm: number;
  stopsPerKm: number;
  averageStopDistance: number;
} {
  if (route.stops.length === 0) {
    return { stopsPerSqKm: 0, stopsPerKm: 0, averageStopDistance: 0 };
  }

  // Calculate bounding box area
  const lats = route.stops.map(s => s.coordinates.latitude);
  const lngs = route.stops.map(s => s.coordinates.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const height = calculateHaversineDistance(
    { latitude: minLat, longitude: minLng },
    { latitude: maxLat, longitude: minLng }
  );

  const width = calculateHaversineDistance(
    { latitude: minLat, longitude: minLng },
    { latitude: minLat, longitude: maxLng }
  );

  const area = height * width;
  const stopsPerSqKm = area > 0 ? route.stops.length / area : 0;
  const stopsPerKm = route.totalDistance > 0 ? route.stops.length / route.totalDistance : 0;
  const averageStopDistance = route.stops.length > 1
    ? route.totalDistance / (route.stops.length - 1)
    : 0;

  return {
    stopsPerSqKm,
    stopsPerKm,
    averageStopDistance,
  };
}

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
export function generateRouteHeatMap(
  routes: Route[],
  gridSize: number
): {
  grid: Map<string, number>;
  maxIntensity: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
} {
  const grid = new Map<string, number>();
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  // Process all stops from all routes
  for (const route of routes) {
    for (const stop of route.stops) {
      const lat = stop.coordinates.latitude;
      const lng = stop.coordinates.longitude;

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);

      // Calculate grid cell
      const cellLat = Math.floor(lat / gridSize) * gridSize;
      const cellLng = Math.floor(lng / gridSize) * gridSize;
      const cellKey = `${cellLat},${cellLng}`;

      grid.set(cellKey, (grid.get(cellKey) || 0) + 1);
    }
  }

  const maxIntensity = Math.max(...Array.from(grid.values()), 0);

  return {
    grid,
    maxIntensity,
    bounds: { minLat, maxLat, minLng, maxLng },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Converts degrees to radians.
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Helper: Converts radians to degrees.
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Helper: Calculates destination point given distance and bearing.
 */
function calculateDestinationPoint(
  start: Coordinates,
  distance: number,
  bearing: number
): Coordinates {
  const R = 6371; // Earth radius in km
  const lat1 = toRadians(start.latitude);
  const lon1 = toRadians(start.longitude);
  const brng = toRadians(bearing);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    latitude: toDegrees(lat2),
    longitude: toDegrees(lon2),
  };
}

/**
 * Helper: Generates unique route ID.
 */
function generateRouteId(): string {
  return `ROUTE-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates human-readable route number.
 */
function generateRouteNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.getTime().toString().slice(-4);
  return `RT-${dateStr}-${timeStr}`;
}

/**
 * Helper: Generates unique stop ID.
 */
function generateStopId(): string {
  return `STOP-${crypto.randomUUID()}`;
}

/**
 * Helper: Generates unique segment ID.
 */
function generateSegmentId(): string {
  return `SEG-${crypto.randomUUID()}`;
}

/**
 * Helper: Validates vehicle capacity against route requirements.
 */
function validateVehicleCapacity(
  route: Route,
  vehicle: Vehicle
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const load = calculateRouteLoad(route);

  if (load.totalWeight > vehicle.capacity.maxWeight) {
    issues.push('Total weight exceeds vehicle capacity');
  }

  if (load.totalVolume > vehicle.capacity.maxVolume) {
    issues.push('Total volume exceeds vehicle capacity');
  }

  if (route.stops.length > vehicle.capacity.maxStops) {
    issues.push('Number of stops exceeds vehicle capacity');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Helper: Recalculates all route metrics.
 */
function recalculateRouteMetrics(route: Route): Route {
  const totalDistance = calculateTotalRouteDistance(route);
  const totalServiceTime = route.stops.reduce((sum, s) => sum + s.serviceTime, 0);

  const totalDuration = route.vehicle
    ? (totalDistance / route.vehicle.averageSpeed) * 60 + totalServiceTime
    : (totalDistance / 60) * 60 + totalServiceTime; // Default 60 km/h

  const estimatedArrival = new Date(
    route.estimatedDeparture.getTime() + totalDuration * 60000
  );

  return {
    ...route,
    totalDistance,
    totalDuration,
    totalServiceTime,
    estimatedArrival,
    updatedAt: new Date(),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Route Definition
  createRoute,
  assignVehicleToRoute,
  assignDriverToRoute,
  validateRoute,
  cloneRoute,
  updateRouteStatus,
  calculateRouteStatistics,
  exportRoute,
  importRoute,

  // Stop Management
  addStopToRoute,
  removeStopFromRoute,
  reorderStops,
  updateStopStatus,
  addDeliveryItems,
  addPickupItems,
  setStopTimeWindow,
  findNextPendingStop,
  calculateRouteLoad,

  // Distance Calculations
  calculateHaversineDistance,
  calculateManhattanDistance,
  estimateTravelTime,
  calculateTotalRouteDistance,
  calculateStopArrivalTimes,
  calculateDistanceMatrix,
  findNearestNeighbor,
  calculateRouteSegments,
  applyTrafficPatterns,

  // Route Optimization
  optimizeRouteNearestNeighbor,
  optimizeRoute2Opt,
  optimizeRouteWithTimeWindows,
  optimizeRouteFuelEfficiency,
  balanceMultipleRoutes,
  optimizeRoutePriority,
  calculateOptimizationImprovement,
  optimizeRouteCustom,
  validateOptimizationConstraints,

  // Geographic Analysis
  isPointInPolygon,
  calculateGeographicCenter,
  clusterStopsByProximity,
  applyGeographicConstraints,
  calculateServiceArea,
  findOptimalDepotLocation,
  identifyDeliveryZones,
  calculateRouteDensity,
  generateRouteHeatMap,
};
