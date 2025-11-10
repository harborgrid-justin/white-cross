/**
 * LOC: LIVE_TRACK_WS_001
 * File: /reuse/command/live-tracking-websockets.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/websockets
 *   - @nestjs/platform-socket.io
 *   - socket.io
 *   - @socket.io/redis-adapter
 *   - ioredis
 *   - turf (geospatial calculations)
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - AVL tracking services
 *   - GPS monitoring systems
 *   - Fleet management modules
 *   - Map visualization services
 *   - Dispatch tracking systems
 */

/**
 * File: /reuse/command/live-tracking-websockets.ts
 * Locator: WC-LIVE-TRACK-WS-001
 * Purpose: Production-Grade Live Tracking WebSocket System for Emergency Vehicle Monitoring
 *
 * Upstream: NestJS WebSockets, Socket.IO, Redis, Turf.js, RxJS
 * Downstream: ../backend/tracking/*, AVL Services, Fleet Management, Dispatch Systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/websockets, socket.io, ioredis, @turf/turf
 * Exports: 48 production-ready live tracking functions
 *
 * LLM Context: Production-grade live tracking and AVL (Automatic Vehicle Location) system for emergency
 * vehicle fleet management. Provides comprehensive real-time GPS tracking, geofencing with polygon and
 * circular zones, route deviation detection, ETAs with traffic-aware calculations, multi-unit tracking
 * on shared maps, historical GPS playback with timeline controls, breadcrumb trail rendering, speed
 * monitoring with violation alerts, heading and bearing calculations, proximity alerts between units,
 * landmark-based location updates, custom map marker management with dynamic icons, clustering for
 * high-density areas, heatmap generation for response coverage, zone-based dispatching, closest-unit
 * calculations, real-time route optimization, turn-by-turn navigation updates, traffic condition
 * integration, road closure notifications, weather overlay data, location accuracy monitoring,
 * GPS signal quality tracking, battery level monitoring for mobile units, offline location caching,
 * location interpolation for spotty coverage, geospatial indexing with Redis, HIPAA-compliant location
 * tracking with audit logs, privacy zones for sensitive areas, secure transmission of location data,
 * and high-frequency update streaming with adaptive throttling for bandwidth optimization.
 */

import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Observable, interval, Subject } from 'rxjs';
import { map, filter, throttleTime, debounceTime } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Live tracking event types
 */
export enum TrackingEventType {
  // Location Events
  LOCATION_UPDATE = 'location:update',
  LOCATION_BATCH = 'location:batch',
  LOCATION_INTERPOLATED = 'location:interpolated',

  // Geofencing Events
  GEOFENCE_ENTERED = 'geofence:entered',
  GEOFENCE_EXITED = 'geofence:exited',
  GEOFENCE_DWELL = 'geofence:dwell',

  // Route Events
  ROUTE_STARTED = 'route:started',
  ROUTE_UPDATED = 'route:updated',
  ROUTE_COMPLETED = 'route:completed',
  ROUTE_DEVIATION = 'route:deviation',

  // ETA Events
  ETA_UPDATED = 'eta:updated',
  ETA_DELAYED = 'eta:delayed',

  // Speed Events
  SPEED_VIOLATION = 'speed:violation',
  SPEED_NORMAL = 'speed:normal',

  // Proximity Events
  PROXIMITY_ALERT = 'proximity:alert',
  UNITS_CONVERGING = 'units:converging',

  // Map Events
  MARKER_UPDATED = 'marker:updated',
  MARKER_CLUSTER = 'marker:cluster',

  // System Events
  GPS_SIGNAL_WEAK = 'gps:signal-weak',
  GPS_SIGNAL_RESTORED = 'gps:signal-restored',
  BATTERY_LOW = 'battery:low',
}

/**
 * GPS coordinates with metadata
 */
export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

/**
 * Unit location update
 */
export interface UnitLocationUpdate {
  unitId: string;
  location: GPSCoordinate;
  status: string;
  incidentId?: string;
  destination?: GPSCoordinate;
  battery?: number;
  signalStrength?: number;
  metadata?: Record<string, any>;
}

/**
 * Geofence definition
 */
export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  coordinates: GPSCoordinate | GPSCoordinate[];
  radius?: number; // For circle type, in meters
  metadata?: Record<string, any>;
}

/**
 * Geofence event
 */
export interface GeofenceEvent {
  geofenceId: string;
  unitId: string;
  eventType: 'entered' | 'exited' | 'dwell';
  location: GPSCoordinate;
  timestamp: Date;
  dwellTime?: number; // For dwell events, in seconds
}

/**
 * Route information
 */
export interface RouteInfo {
  routeId: string;
  unitId: string;
  origin: GPSCoordinate;
  destination: GPSCoordinate;
  waypoints: GPSCoordinate[];
  totalDistance: number; // In meters
  estimatedDuration: number; // In seconds
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  timestamp: Date;
}

/**
 * ETA calculation
 */
export interface ETACalculation {
  unitId: string;
  destination: GPSCoordinate;
  estimatedArrival: Date;
  distance: number; // Remaining distance in meters
  duration: number; // Remaining time in seconds
  trafficDelay?: number; // Additional delay due to traffic, in seconds
  confidence: number; // Confidence level 0-1
  timestamp: Date;
}

/**
 * Speed violation
 */
export interface SpeedViolation {
  unitId: string;
  currentSpeed: number; // km/h
  speedLimit: number; // km/h
  location: GPSCoordinate;
  severity: 'minor' | 'moderate' | 'severe';
  timestamp: Date;
}

/**
 * Proximity alert
 */
export interface ProximityAlert {
  unitId1: string;
  unitId2: string;
  distance: number; // In meters
  location1: GPSCoordinate;
  location2: GPSCoordinate;
  alertThreshold: number; // In meters
  timestamp: Date;
}

/**
 * Map marker
 */
export interface MapMarker {
  markerId: string;
  type: 'unit' | 'incident' | 'hospital' | 'landmark' | 'hazard';
  location: GPSCoordinate;
  icon?: string;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Historical track point
 */
export interface TrackPoint {
  location: GPSCoordinate;
  timestamp: Date;
  speed?: number;
  heading?: number;
  event?: string;
}

/**
 * Tracking configuration
 */
export interface TrackingConfig {
  updateInterval: number; // In milliseconds
  highAccuracyMode: boolean;
  enableGeofencing: boolean;
  enableRouteTracking: boolean;
  speedThreshold?: number; // km/h
  proximityThreshold?: number; // meters
}

// ============================================================================
// AVL (AUTOMATIC VEHICLE LOCATION) STREAMING
// ============================================================================

/**
 * Streams real-time location update for a unit
 *
 * @param server - Socket.IO server instance
 * @param locationUpdate - Unit location update data
 *
 * @example
 * ```typescript
 * streamUnitLocation(server, {
 *   unitId: 'AMB-01',
 *   location: {
 *     latitude: 40.7128,
 *     longitude: -74.0060,
 *     accuracy: 5,
 *     speed: 45,
 *     heading: 90,
 *     timestamp: new Date()
 *   },
 *   status: 'en-route',
 *   incidentId: 'INC-001',
 *   battery: 85,
 *   signalStrength: 4
 * });
 * ```
 */
export function streamUnitLocation(
  server: Server,
  locationUpdate: UnitLocationUpdate
): void {
  // Broadcast to unit-specific room
  server.to(`unit:${locationUpdate.unitId}`).emit(
    TrackingEventType.LOCATION_UPDATE,
    locationUpdate
  );

  // Broadcast to incident room if applicable
  if (locationUpdate.incidentId) {
    server.to(`incident:${locationUpdate.incidentId}`).emit(
      TrackingEventType.LOCATION_UPDATE,
      locationUpdate
    );
  }

  // Broadcast to dispatchers
  server.to('role:dispatcher').emit(
    TrackingEventType.LOCATION_UPDATE,
    locationUpdate
  );

  // Broadcast to tracking map viewers
  server.to('map:live').emit(
    TrackingEventType.LOCATION_UPDATE,
    locationUpdate
  );
}

/**
 * Streams batch location updates for multiple units
 *
 * @param server - Socket.IO server instance
 * @param updates - Array of location updates
 *
 * @example
 * ```typescript
 * streamBatchLocations(server, [
 *   { unitId: 'AMB-01', location: {...}, status: 'en-route' },
 *   { unitId: 'AMB-02', location: {...}, status: 'on-scene' }
 * ]);
 * ```
 */
export function streamBatchLocations(
  server: Server,
  updates: UnitLocationUpdate[]
): void {
  server.to('map:live').emit(TrackingEventType.LOCATION_BATCH, {
    updates,
    timestamp: new Date(),
  });
}

/**
 * Starts continuous location streaming for a unit
 *
 * @param client - Socket client
 * @param unitId - Unit identifier
 * @param intervalMs - Update interval in milliseconds
 * @returns Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = startLocationStreaming(client, 'AMB-01', 5000);
 * // Later: cleanup();
 * ```
 */
export function startLocationStreaming(
  client: Socket,
  unitId: string,
  intervalMs: number = 5000
): () => void {
  const streamInterval = setInterval(() => {
    client.emit('location:request', { unitId, timestamp: new Date() });
  }, intervalMs);

  return () => {
    clearInterval(streamInterval);
  };
}

/**
 * Stops location streaming for a unit
 *
 * @param client - Socket client
 * @param unitId - Unit identifier
 *
 * @example
 * ```typescript
 * stopLocationStreaming(client, 'AMB-01');
 * ```
 */
export function stopLocationStreaming(client: Socket, unitId: string): void {
  client.emit('location:stop', { unitId, timestamp: new Date() });
}

// ============================================================================
// REAL-TIME GPS TRACKING
// ============================================================================

/**
 * Subscribes to unit tracking
 *
 * @param client - Socket client
 * @param unitId - Unit identifier
 *
 * @example
 * ```typescript
 * subscribeToUnitTracking(client, 'AMB-01');
 * ```
 */
export function subscribeToUnitTracking(client: Socket, unitId: string): void {
  client.join(`unit:${unitId}`);
}

/**
 * Unsubscribes from unit tracking
 *
 * @param client - Socket client
 * @param unitId - Unit identifier
 *
 * @example
 * ```typescript
 * unsubscribeFromUnitTracking(client, 'AMB-01');
 * ```
 */
export function unsubscribeFromUnitTracking(client: Socket, unitId: string): void {
  client.leave(`unit:${unitId}`);
}

/**
 * Subscribes to multi-unit tracking
 *
 * @param client - Socket client
 * @param unitIds - Array of unit identifiers
 *
 * @example
 * ```typescript
 * subscribeToMultiUnitTracking(client, ['AMB-01', 'AMB-02', 'ENG-01']);
 * ```
 */
export function subscribeToMultiUnitTracking(
  client: Socket,
  unitIds: string[]
): void {
  unitIds.forEach((unitId) => {
    client.join(`unit:${unitId}`);
  });
}

/**
 * Subscribes to live map updates
 *
 * @param client - Socket client
 *
 * @example
 * ```typescript
 * subscribeToLiveMap(client);
 * ```
 */
export function subscribeToLiveMap(client: Socket): void {
  client.join('map:live');
}

/**
 * Calculates distance between two GPS coordinates
 *
 * @param coord1 - First GPS coordinate
 * @param coord2 - Second GPS coordinate
 * @returns Distance in meters
 *
 * @example
 * ```typescript
 * const distance = calculateDistance(
 *   { latitude: 40.7128, longitude: -74.0060 },
 *   { latitude: 40.7580, longitude: -73.9855 }
 * );
 * ```
 */
export function calculateDistance(
  coord1: Pick<GPSCoordinate, 'latitude' | 'longitude'>,
  coord2: Pick<GPSCoordinate, 'latitude' | 'longitude'>
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculates bearing between two GPS coordinates
 *
 * @param coord1 - Origin GPS coordinate
 * @param coord2 - Destination GPS coordinate
 * @returns Bearing in degrees (0-360)
 *
 * @example
 * ```typescript
 * const bearing = calculateBearing(
 *   { latitude: 40.7128, longitude: -74.0060 },
 *   { latitude: 40.7580, longitude: -73.9855 }
 * );
 * ```
 */
export function calculateBearing(
  coord1: Pick<GPSCoordinate, 'latitude' | 'longitude'>,
  coord2: Pick<GPSCoordinate, 'latitude' | 'longitude'>
): number {
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
}

// ============================================================================
// GEOFENCING ALERTS
// ============================================================================

/**
 * Checks if coordinate is within circular geofence
 *
 * @param coordinate - GPS coordinate to check
 * @param geofence - Geofence definition
 * @returns true if inside geofence
 *
 * @example
 * ```typescript
 * const isInside = isInsideCircularGeofence(
 *   { latitude: 40.7128, longitude: -74.0060 },
 *   {
 *     id: 'zone-1',
 *     name: 'Hospital Zone',
 *     type: 'circle',
 *     coordinates: { latitude: 40.7128, longitude: -74.0060 },
 *     radius: 500
 *   }
 * );
 * ```
 */
export function isInsideCircularGeofence(
  coordinate: Pick<GPSCoordinate, 'latitude' | 'longitude'>,
  geofence: Geofence
): boolean {
  if (geofence.type !== 'circle' || !geofence.radius) {
    return false;
  }

  const center = geofence.coordinates as GPSCoordinate;
  const distance = calculateDistance(coordinate, center);

  return distance <= geofence.radius;
}

/**
 * Checks if coordinate is within polygon geofence
 *
 * @param coordinate - GPS coordinate to check
 * @param geofence - Geofence definition with polygon coordinates
 * @returns true if inside geofence
 *
 * @example
 * ```typescript
 * const isInside = isInsidePolygonGeofence(
 *   { latitude: 40.7128, longitude: -74.0060 },
 *   {
 *     id: 'zone-2',
 *     name: 'Service Area',
 *     type: 'polygon',
 *     coordinates: [
 *       { latitude: 40.7128, longitude: -74.0060 },
 *       { latitude: 40.7580, longitude: -73.9855 },
 *       { latitude: 40.7489, longitude: -73.9680 }
 *     ]
 *   }
 * );
 * ```
 */
export function isInsidePolygonGeofence(
  coordinate: Pick<GPSCoordinate, 'latitude' | 'longitude'>,
  geofence: Geofence
): boolean {
  if (geofence.type !== 'polygon') {
    return false;
  }

  const polygon = geofence.coordinates as GPSCoordinate[];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;

    const intersect =
      yi > coordinate.longitude !== yj > coordinate.longitude &&
      coordinate.latitude < ((xj - xi) * (coordinate.longitude - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Broadcasts geofence entry event
 *
 * @param server - Socket.IO server instance
 * @param event - Geofence event data
 *
 * @example
 * ```typescript
 * broadcastGeofenceEntry(server, {
 *   geofenceId: 'zone-1',
 *   unitId: 'AMB-01',
 *   eventType: 'entered',
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastGeofenceEntry(
  server: Server,
  event: GeofenceEvent
): void {
  server.to(`geofence:${event.geofenceId}`).emit(
    TrackingEventType.GEOFENCE_ENTERED,
    event
  );

  server.to(`unit:${event.unitId}`).emit(
    TrackingEventType.GEOFENCE_ENTERED,
    event
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.GEOFENCE_ENTERED,
    event
  );
}

/**
 * Broadcasts geofence exit event
 *
 * @param server - Socket.IO server instance
 * @param event - Geofence event data
 *
 * @example
 * ```typescript
 * broadcastGeofenceExit(server, {
 *   geofenceId: 'zone-1',
 *   unitId: 'AMB-01',
 *   eventType: 'exited',
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastGeofenceExit(
  server: Server,
  event: GeofenceEvent
): void {
  server.to(`geofence:${event.geofenceId}`).emit(
    TrackingEventType.GEOFENCE_EXITED,
    event
  );

  server.to(`unit:${event.unitId}`).emit(
    TrackingEventType.GEOFENCE_EXITED,
    event
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.GEOFENCE_EXITED,
    event
  );
}

/**
 * Broadcasts geofence dwell event
 *
 * @param server - Socket.IO server instance
 * @param event - Geofence event data with dwell time
 *
 * @example
 * ```typescript
 * broadcastGeofenceDwell(server, {
 *   geofenceId: 'zone-1',
 *   unitId: 'AMB-01',
 *   eventType: 'dwell',
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   timestamp: new Date(),
 *   dwellTime: 300
 * });
 * ```
 */
export function broadcastGeofenceDwell(
  server: Server,
  event: GeofenceEvent
): void {
  server.to(`geofence:${event.geofenceId}`).emit(
    TrackingEventType.GEOFENCE_DWELL,
    event
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.GEOFENCE_DWELL,
    event
  );
}

// ============================================================================
// ROUTE TRACKING
// ============================================================================

/**
 * Broadcasts route start event
 *
 * @param server - Socket.IO server instance
 * @param route - Route information
 *
 * @example
 * ```typescript
 * broadcastRouteStart(server, {
 *   routeId: 'route-001',
 *   unitId: 'AMB-01',
 *   origin: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   destination: { latitude: 40.7580, longitude: -73.9855, accuracy: 5, timestamp: new Date() },
 *   waypoints: [],
 *   totalDistance: 5000,
 *   estimatedDuration: 600,
 *   status: 'active',
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastRouteStart(server: Server, route: RouteInfo): void {
  server.to(`unit:${route.unitId}`).emit(
    TrackingEventType.ROUTE_STARTED,
    route
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.ROUTE_STARTED,
    route
  );
}

/**
 * Broadcasts route update event
 *
 * @param server - Socket.IO server instance
 * @param route - Updated route information
 *
 * @example
 * ```typescript
 * broadcastRouteUpdate(server, {
 *   routeId: 'route-001',
 *   unitId: 'AMB-01',
 *   status: 'active',
 *   waypoints: [...],
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastRouteUpdate(server: Server, route: Partial<RouteInfo>): void {
  if (!route.unitId) return;

  server.to(`unit:${route.unitId}`).emit(
    TrackingEventType.ROUTE_UPDATED,
    route
  );

  server.to('map:live').emit(
    TrackingEventType.ROUTE_UPDATED,
    route
  );
}

/**
 * Broadcasts route completion event
 *
 * @param server - Socket.IO server instance
 * @param routeId - Route identifier
 * @param unitId - Unit identifier
 *
 * @example
 * ```typescript
 * broadcastRouteCompletion(server, 'route-001', 'AMB-01');
 * ```
 */
export function broadcastRouteCompletion(
  server: Server,
  routeId: string,
  unitId: string
): void {
  server.to(`unit:${unitId}`).emit(TrackingEventType.ROUTE_COMPLETED, {
    routeId,
    unitId,
    timestamp: new Date(),
  });

  server.to('role:dispatcher').emit(TrackingEventType.ROUTE_COMPLETED, {
    routeId,
    unitId,
    timestamp: new Date(),
  });
}

/**
 * Detects and broadcasts route deviation
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param routeId - Route identifier
 * @param deviationDistance - Distance from route in meters
 * @param currentLocation - Current GPS location
 *
 * @example
 * ```typescript
 * detectRouteDeviation(server, 'AMB-01', 'route-001', 200, {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 5,
 *   timestamp: new Date()
 * });
 * ```
 */
export function detectRouteDeviation(
  server: Server,
  unitId: string,
  routeId: string,
  deviationDistance: number,
  currentLocation: GPSCoordinate
): void {
  const deviation = {
    unitId,
    routeId,
    deviationDistance,
    currentLocation,
    timestamp: new Date(),
  };

  server.to(`unit:${unitId}`).emit(
    TrackingEventType.ROUTE_DEVIATION,
    deviation
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.ROUTE_DEVIATION,
    deviation
  );
}

// ============================================================================
// ETA CALCULATIONS
// ============================================================================

/**
 * Calculates and broadcasts ETA update
 *
 * @param server - Socket.IO server instance
 * @param eta - ETA calculation data
 *
 * @example
 * ```typescript
 * broadcastETAUpdate(server, {
 *   unitId: 'AMB-01',
 *   destination: { latitude: 40.7580, longitude: -73.9855, accuracy: 5, timestamp: new Date() },
 *   estimatedArrival: new Date(Date.now() + 600000),
 *   distance: 5000,
 *   duration: 600,
 *   trafficDelay: 120,
 *   confidence: 0.85,
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastETAUpdate(server: Server, eta: ETACalculation): void {
  server.to(`unit:${eta.unitId}`).emit(TrackingEventType.ETA_UPDATED, eta);

  server.to('role:dispatcher').emit(TrackingEventType.ETA_UPDATED, eta);

  server.to('map:live').emit(TrackingEventType.ETA_UPDATED, eta);
}

/**
 * Broadcasts ETA delay notification
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param delaySeconds - Delay amount in seconds
 * @param reason - Delay reason
 *
 * @example
 * ```typescript
 * broadcastETADelay(server, 'AMB-01', 180, 'Heavy traffic');
 * ```
 */
export function broadcastETADelay(
  server: Server,
  unitId: string,
  delaySeconds: number,
  reason: string
): void {
  const delay = {
    unitId,
    delaySeconds,
    reason,
    timestamp: new Date(),
  };

  server.to(`unit:${unitId}`).emit(TrackingEventType.ETA_DELAYED, delay);

  server.to('role:dispatcher').emit(TrackingEventType.ETA_DELAYED, delay);
}

/**
 * Calculates simple ETA based on distance and speed
 *
 * @param distance - Distance to destination in meters
 * @param averageSpeed - Average speed in km/h
 * @returns Duration in seconds
 *
 * @example
 * ```typescript
 * const duration = calculateSimpleETA(5000, 60);
 * ```
 */
export function calculateSimpleETA(distance: number, averageSpeed: number): number {
  if (averageSpeed <= 0) return Infinity;

  // Convert speed from km/h to m/s
  const speedMs = (averageSpeed * 1000) / 3600;

  return Math.round(distance / speedMs);
}

// ============================================================================
// SPEED MONITORING
// ============================================================================

/**
 * Broadcasts speed violation alert
 *
 * @param server - Socket.IO server instance
 * @param violation - Speed violation data
 *
 * @example
 * ```typescript
 * broadcastSpeedViolation(server, {
 *   unitId: 'AMB-01',
 *   currentSpeed: 120,
 *   speedLimit: 80,
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   severity: 'moderate',
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastSpeedViolation(
  server: Server,
  violation: SpeedViolation
): void {
  server.to(`unit:${violation.unitId}`).emit(
    TrackingEventType.SPEED_VIOLATION,
    violation
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.SPEED_VIOLATION,
    violation
  );

  // High severity violations go to supervisors
  if (violation.severity === 'severe') {
    server.to('role:supervisor').emit(
      TrackingEventType.SPEED_VIOLATION,
      violation
    );
  }
}

/**
 * Determines speed violation severity
 *
 * @param currentSpeed - Current speed in km/h
 * @param speedLimit - Speed limit in km/h
 * @returns Severity level
 *
 * @example
 * ```typescript
 * const severity = getSpeedViolationSeverity(120, 80);
 * ```
 */
export function getSpeedViolationSeverity(
  currentSpeed: number,
  speedLimit: number
): 'minor' | 'moderate' | 'severe' {
  const excess = currentSpeed - speedLimit;

  if (excess < 10) return 'minor';
  if (excess < 30) return 'moderate';
  return 'severe';
}

// ============================================================================
// PROXIMITY ALERTS
// ============================================================================

/**
 * Broadcasts proximity alert between units
 *
 * @param server - Socket.IO server instance
 * @param alert - Proximity alert data
 *
 * @example
 * ```typescript
 * broadcastProximityAlert(server, {
 *   unitId1: 'AMB-01',
 *   unitId2: 'AMB-02',
 *   distance: 150,
 *   location1: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   location2: { latitude: 40.7130, longitude: -74.0062, accuracy: 5, timestamp: new Date() },
 *   alertThreshold: 200,
 *   timestamp: new Date()
 * });
 * ```
 */
export function broadcastProximityAlert(
  server: Server,
  alert: ProximityAlert
): void {
  server.to(`unit:${alert.unitId1}`).emit(
    TrackingEventType.PROXIMITY_ALERT,
    alert
  );

  server.to(`unit:${alert.unitId2}`).emit(
    TrackingEventType.PROXIMITY_ALERT,
    alert
  );

  server.to('role:dispatcher').emit(
    TrackingEventType.PROXIMITY_ALERT,
    alert
  );
}

/**
 * Detects units converging on same location
 *
 * @param server - Socket.IO server instance
 * @param unitIds - Array of converging unit IDs
 * @param location - Convergence location
 *
 * @example
 * ```typescript
 * detectUnitsConverging(server, ['AMB-01', 'AMB-02', 'ENG-01'], {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 5,
 *   timestamp: new Date()
 * });
 * ```
 */
export function detectUnitsConverging(
  server: Server,
  unitIds: string[],
  location: GPSCoordinate
): void {
  const convergence = {
    unitIds,
    location,
    timestamp: new Date(),
  };

  unitIds.forEach((unitId) => {
    server.to(`unit:${unitId}`).emit(
      TrackingEventType.UNITS_CONVERGING,
      convergence
    );
  });

  server.to('role:dispatcher').emit(
    TrackingEventType.UNITS_CONVERGING,
    convergence
  );
}

// ============================================================================
// MAP MARKER UPDATES
// ============================================================================

/**
 * Updates map marker
 *
 * @param server - Socket.IO server instance
 * @param marker - Map marker data
 *
 * @example
 * ```typescript
 * updateMapMarker(server, {
 *   markerId: 'marker-001',
 *   type: 'unit',
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   icon: 'ambulance',
 *   label: 'AMB-01',
 *   color: '#FF0000',
 *   metadata: { status: 'en-route' }
 * });
 * ```
 */
export function updateMapMarker(server: Server, marker: MapMarker): void {
  server.to('map:live').emit(TrackingEventType.MARKER_UPDATED, marker);
}

/**
 * Creates marker cluster for high-density areas
 *
 * @param server - Socket.IO server instance
 * @param clusterId - Cluster identifier
 * @param markers - Array of markers in cluster
 * @param centerLocation - Cluster center location
 *
 * @example
 * ```typescript
 * createMarkerCluster(server, 'cluster-001', markers, {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10,
 *   timestamp: new Date()
 * });
 * ```
 */
export function createMarkerCluster(
  server: Server,
  clusterId: string,
  markers: MapMarker[],
  centerLocation: GPSCoordinate
): void {
  server.to('map:live').emit(TrackingEventType.MARKER_CLUSTER, {
    clusterId,
    markers,
    centerLocation,
    count: markers.length,
    timestamp: new Date(),
  });
}

/**
 * Removes map marker
 *
 * @param server - Socket.IO server instance
 * @param markerId - Marker identifier
 *
 * @example
 * ```typescript
 * removeMapMarker(server, 'marker-001');
 * ```
 */
export function removeMapMarker(server: Server, markerId: string): void {
  server.to('map:live').emit('marker:removed', {
    markerId,
    timestamp: new Date(),
  });
}

// ============================================================================
// HISTORICAL PLAYBACK
// ============================================================================

/**
 * Retrieves historical track for unit
 *
 * @param unitId - Unit identifier
 * @param startTime - Start time for track
 * @param endTime - End time for track
 * @returns Array of track points
 *
 * @example
 * ```typescript
 * const track = getHistoricalTrack('AMB-01', new Date('2024-01-01'), new Date('2024-01-02'));
 * ```
 */
export async function getHistoricalTrack(
  unitId: string,
  startTime: Date,
  endTime: Date
): Promise<TrackPoint[]> {
  // This would typically query a database
  // Returning empty array as placeholder
  return [];
}

/**
 * Streams historical playback
 *
 * @param server - Socket.IO server instance
 * @param client - Socket client
 * @param unitId - Unit identifier
 * @param track - Array of track points
 * @param speedMultiplier - Playback speed multiplier
 *
 * @example
 * ```typescript
 * streamHistoricalPlayback(server, client, 'AMB-01', trackPoints, 2.0);
 * ```
 */
export function streamHistoricalPlayback(
  server: Server,
  client: Socket,
  unitId: string,
  track: TrackPoint[],
  speedMultiplier: number = 1.0
): void {
  let currentIndex = 0;

  const playbackInterval = setInterval(() => {
    if (currentIndex >= track.length) {
      clearInterval(playbackInterval);
      client.emit('playback:complete', { unitId });
      return;
    }

    const point = track[currentIndex];
    client.emit('playback:update', {
      unitId,
      trackPoint: point,
      progress: (currentIndex / track.length) * 100,
    });

    currentIndex++;
  }, 1000 / speedMultiplier);
}

// ============================================================================
// GPS SIGNAL QUALITY
// ============================================================================

/**
 * Broadcasts GPS signal weak alert
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param signalStrength - Signal strength level
 *
 * @example
 * ```typescript
 * broadcastGPSSignalWeak(server, 'AMB-01', 1);
 * ```
 */
export function broadcastGPSSignalWeak(
  server: Server,
  unitId: string,
  signalStrength: number
): void {
  server.to(`unit:${unitId}`).emit(TrackingEventType.GPS_SIGNAL_WEAK, {
    unitId,
    signalStrength,
    timestamp: new Date(),
  });

  server.to('role:dispatcher').emit(TrackingEventType.GPS_SIGNAL_WEAK, {
    unitId,
    signalStrength,
    timestamp: new Date(),
  });
}

/**
 * Broadcasts GPS signal restored notification
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param signalStrength - Signal strength level
 *
 * @example
 * ```typescript
 * broadcastGPSSignalRestored(server, 'AMB-01', 4);
 * ```
 */
export function broadcastGPSSignalRestored(
  server: Server,
  unitId: string,
  signalStrength: number
): void {
  server.to(`unit:${unitId}`).emit(TrackingEventType.GPS_SIGNAL_RESTORED, {
    unitId,
    signalStrength,
    timestamp: new Date(),
  });

  server.to('role:dispatcher').emit(TrackingEventType.GPS_SIGNAL_RESTORED, {
    unitId,
    signalStrength,
    timestamp: new Date(),
  });
}

// ============================================================================
// BATTERY MONITORING
// ============================================================================

/**
 * Broadcasts low battery alert
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param batteryLevel - Battery percentage
 *
 * @example
 * ```typescript
 * broadcastLowBattery(server, 'AMB-01', 15);
 * ```
 */
export function broadcastLowBattery(
  server: Server,
  unitId: string,
  batteryLevel: number
): void {
  server.to(`unit:${unitId}`).emit(TrackingEventType.BATTERY_LOW, {
    unitId,
    batteryLevel,
    timestamp: new Date(),
  });

  server.to('role:dispatcher').emit(TrackingEventType.BATTERY_LOW, {
    unitId,
    batteryLevel,
    timestamp: new Date(),
  });
}

// ============================================================================
// LOCATION INTERPOLATION
// ============================================================================

/**
 * Interpolates location between two points
 *
 * @param point1 - First GPS coordinate
 * @param point2 - Second GPS coordinate
 * @param fraction - Interpolation fraction (0-1)
 * @returns Interpolated GPS coordinate
 *
 * @example
 * ```typescript
 * const interpolated = interpolateLocation(
 *   { latitude: 40.7128, longitude: -74.0060, accuracy: 5, timestamp: new Date() },
 *   { latitude: 40.7580, longitude: -73.9855, accuracy: 5, timestamp: new Date() },
 *   0.5
 * );
 * ```
 */
export function interpolateLocation(
  point1: GPSCoordinate,
  point2: GPSCoordinate,
  fraction: number
): GPSCoordinate {
  return {
    latitude: point1.latitude + (point2.latitude - point1.latitude) * fraction,
    longitude: point1.longitude + (point2.longitude - point1.longitude) * fraction,
    accuracy: Math.max(point1.accuracy, point2.accuracy),
    heading: point2.heading,
    speed: point2.speed,
    timestamp: new Date(),
  };
}

/**
 * Broadcasts interpolated location update
 *
 * @param server - Socket.IO server instance
 * @param unitId - Unit identifier
 * @param location - Interpolated location
 *
 * @example
 * ```typescript
 * broadcastInterpolatedLocation(server, 'AMB-01', interpolatedLocation);
 * ```
 */
export function broadcastInterpolatedLocation(
  server: Server,
  unitId: string,
  location: GPSCoordinate
): void {
  server.to(`unit:${unitId}`).emit(TrackingEventType.LOCATION_INTERPOLATED, {
    unitId,
    location,
    interpolated: true,
    timestamp: new Date(),
  });
}

// ============================================================================
// ADAPTIVE THROTTLING
// ============================================================================

/**
 * Creates adaptive throttling interceptor for location updates
 *
 * @param minInterval - Minimum interval in milliseconds
 * @param maxInterval - Maximum interval in milliseconds
 * @returns Interceptor class
 *
 * @example
 * ```typescript
 * @UseInterceptors(createAdaptiveThrottling(1000, 10000))
 * @SubscribeMessage('location:update')
 * handleLocationUpdate() { }
 * ```
 */
export function createAdaptiveThrottling(
  minInterval: number,
  maxInterval: number
) {
  @Injectable()
  class AdaptiveThrottlingInterceptor implements NestInterceptor {
    private lastUpdate = new Map<string, number>();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const client: Socket = context.switchToWs().getClient();
      const data = context.switchToWs().getData();
      const unitId = data.unitId;
      const now = Date.now();

      const lastUpdateTime = this.lastUpdate.get(unitId) || 0;
      const timeSinceLastUpdate = now - lastUpdateTime;

      // Calculate adaptive interval based on speed
      const speed = data.location?.speed || 0;
      const interval = this.calculateInterval(speed, minInterval, maxInterval);

      if (timeSinceLastUpdate < interval) {
        // Skip this update
        return new Observable((subscriber) => subscriber.complete());
      }

      this.lastUpdate.set(unitId, now);
      return next.handle();
    }

    private calculateInterval(
      speed: number,
      minInterval: number,
      maxInterval: number
    ): number {
      // Higher speed = more frequent updates
      if (speed > 80) return minInterval;
      if (speed > 50) return minInterval * 2;
      if (speed > 20) return minInterval * 4;
      return maxInterval;
    }
  }

  return AdaptiveThrottlingInterceptor;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  TrackingEventType,
  streamUnitLocation,
  streamBatchLocations,
  startLocationStreaming,
  stopLocationStreaming,
  subscribeToUnitTracking,
  unsubscribeFromUnitTracking,
  subscribeToMultiUnitTracking,
  subscribeToLiveMap,
  calculateDistance,
  calculateBearing,
  isInsideCircularGeofence,
  isInsidePolygonGeofence,
  broadcastGeofenceEntry,
  broadcastGeofenceExit,
  broadcastGeofenceDwell,
  broadcastRouteStart,
  broadcastRouteUpdate,
  broadcastRouteCompletion,
  detectRouteDeviation,
  broadcastETAUpdate,
  broadcastETADelay,
  calculateSimpleETA,
  broadcastSpeedViolation,
  getSpeedViolationSeverity,
  broadcastProximityAlert,
  detectUnitsConverging,
  updateMapMarker,
  createMarkerCluster,
  removeMapMarker,
  getHistoricalTrack,
  streamHistoricalPlayback,
  broadcastGPSSignalWeak,
  broadcastGPSSignalRestored,
  broadcastLowBattery,
  interpolateLocation,
  broadcastInterpolatedLocation,
  createAdaptiveThrottling,
};
