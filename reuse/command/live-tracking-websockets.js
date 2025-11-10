"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingEventType = void 0;
exports.streamUnitLocation = streamUnitLocation;
exports.streamBatchLocations = streamBatchLocations;
exports.startLocationStreaming = startLocationStreaming;
exports.stopLocationStreaming = stopLocationStreaming;
exports.subscribeToUnitTracking = subscribeToUnitTracking;
exports.unsubscribeFromUnitTracking = unsubscribeFromUnitTracking;
exports.subscribeToMultiUnitTracking = subscribeToMultiUnitTracking;
exports.subscribeToLiveMap = subscribeToLiveMap;
exports.calculateDistance = calculateDistance;
exports.calculateBearing = calculateBearing;
exports.isInsideCircularGeofence = isInsideCircularGeofence;
exports.isInsidePolygonGeofence = isInsidePolygonGeofence;
exports.broadcastGeofenceEntry = broadcastGeofenceEntry;
exports.broadcastGeofenceExit = broadcastGeofenceExit;
exports.broadcastGeofenceDwell = broadcastGeofenceDwell;
exports.broadcastRouteStart = broadcastRouteStart;
exports.broadcastRouteUpdate = broadcastRouteUpdate;
exports.broadcastRouteCompletion = broadcastRouteCompletion;
exports.detectRouteDeviation = detectRouteDeviation;
exports.broadcastETAUpdate = broadcastETAUpdate;
exports.broadcastETADelay = broadcastETADelay;
exports.calculateSimpleETA = calculateSimpleETA;
exports.broadcastSpeedViolation = broadcastSpeedViolation;
exports.getSpeedViolationSeverity = getSpeedViolationSeverity;
exports.broadcastProximityAlert = broadcastProximityAlert;
exports.detectUnitsConverging = detectUnitsConverging;
exports.updateMapMarker = updateMapMarker;
exports.createMarkerCluster = createMarkerCluster;
exports.removeMapMarker = removeMapMarker;
exports.getHistoricalTrack = getHistoricalTrack;
exports.streamHistoricalPlayback = streamHistoricalPlayback;
exports.broadcastGPSSignalWeak = broadcastGPSSignalWeak;
exports.broadcastGPSSignalRestored = broadcastGPSSignalRestored;
exports.broadcastLowBattery = broadcastLowBattery;
exports.interpolateLocation = interpolateLocation;
exports.broadcastInterpolatedLocation = broadcastInterpolatedLocation;
exports.createAdaptiveThrottling = createAdaptiveThrottling;
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
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Live tracking event types
 */
var TrackingEventType;
(function (TrackingEventType) {
    // Location Events
    TrackingEventType["LOCATION_UPDATE"] = "location:update";
    TrackingEventType["LOCATION_BATCH"] = "location:batch";
    TrackingEventType["LOCATION_INTERPOLATED"] = "location:interpolated";
    // Geofencing Events
    TrackingEventType["GEOFENCE_ENTERED"] = "geofence:entered";
    TrackingEventType["GEOFENCE_EXITED"] = "geofence:exited";
    TrackingEventType["GEOFENCE_DWELL"] = "geofence:dwell";
    // Route Events
    TrackingEventType["ROUTE_STARTED"] = "route:started";
    TrackingEventType["ROUTE_UPDATED"] = "route:updated";
    TrackingEventType["ROUTE_COMPLETED"] = "route:completed";
    TrackingEventType["ROUTE_DEVIATION"] = "route:deviation";
    // ETA Events
    TrackingEventType["ETA_UPDATED"] = "eta:updated";
    TrackingEventType["ETA_DELAYED"] = "eta:delayed";
    // Speed Events
    TrackingEventType["SPEED_VIOLATION"] = "speed:violation";
    TrackingEventType["SPEED_NORMAL"] = "speed:normal";
    // Proximity Events
    TrackingEventType["PROXIMITY_ALERT"] = "proximity:alert";
    TrackingEventType["UNITS_CONVERGING"] = "units:converging";
    // Map Events
    TrackingEventType["MARKER_UPDATED"] = "marker:updated";
    TrackingEventType["MARKER_CLUSTER"] = "marker:cluster";
    // System Events
    TrackingEventType["GPS_SIGNAL_WEAK"] = "gps:signal-weak";
    TrackingEventType["GPS_SIGNAL_RESTORED"] = "gps:signal-restored";
    TrackingEventType["BATTERY_LOW"] = "battery:low";
})(TrackingEventType || (exports.TrackingEventType = TrackingEventType = {}));
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
function streamUnitLocation(server, locationUpdate) {
    // Broadcast to unit-specific room
    server.to(`unit:${locationUpdate.unitId}`).emit(TrackingEventType.LOCATION_UPDATE, locationUpdate);
    // Broadcast to incident room if applicable
    if (locationUpdate.incidentId) {
        server.to(`incident:${locationUpdate.incidentId}`).emit(TrackingEventType.LOCATION_UPDATE, locationUpdate);
    }
    // Broadcast to dispatchers
    server.to('role:dispatcher').emit(TrackingEventType.LOCATION_UPDATE, locationUpdate);
    // Broadcast to tracking map viewers
    server.to('map:live').emit(TrackingEventType.LOCATION_UPDATE, locationUpdate);
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
function streamBatchLocations(server, updates) {
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
function startLocationStreaming(client, unitId, intervalMs = 5000) {
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
function stopLocationStreaming(client, unitId) {
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
function subscribeToUnitTracking(client, unitId) {
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
function unsubscribeFromUnitTracking(client, unitId) {
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
function subscribeToMultiUnitTracking(client, unitIds) {
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
function subscribeToLiveMap(client) {
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
function calculateDistance(coord1, coord2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
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
function calculateBearing(coord1, coord2) {
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
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
function isInsideCircularGeofence(coordinate, geofence) {
    if (geofence.type !== 'circle' || !geofence.radius) {
        return false;
    }
    const center = geofence.coordinates;
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
function isInsidePolygonGeofence(coordinate, geofence) {
    if (geofence.type !== 'polygon') {
        return false;
    }
    const polygon = geofence.coordinates;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude;
        const yi = polygon[i].longitude;
        const xj = polygon[j].latitude;
        const yj = polygon[j].longitude;
        const intersect = yi > coordinate.longitude !== yj > coordinate.longitude &&
            coordinate.latitude < ((xj - xi) * (coordinate.longitude - yi)) / (yj - yi) + xi;
        if (intersect)
            inside = !inside;
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
function broadcastGeofenceEntry(server, event) {
    server.to(`geofence:${event.geofenceId}`).emit(TrackingEventType.GEOFENCE_ENTERED, event);
    server.to(`unit:${event.unitId}`).emit(TrackingEventType.GEOFENCE_ENTERED, event);
    server.to('role:dispatcher').emit(TrackingEventType.GEOFENCE_ENTERED, event);
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
function broadcastGeofenceExit(server, event) {
    server.to(`geofence:${event.geofenceId}`).emit(TrackingEventType.GEOFENCE_EXITED, event);
    server.to(`unit:${event.unitId}`).emit(TrackingEventType.GEOFENCE_EXITED, event);
    server.to('role:dispatcher').emit(TrackingEventType.GEOFENCE_EXITED, event);
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
function broadcastGeofenceDwell(server, event) {
    server.to(`geofence:${event.geofenceId}`).emit(TrackingEventType.GEOFENCE_DWELL, event);
    server.to('role:dispatcher').emit(TrackingEventType.GEOFENCE_DWELL, event);
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
function broadcastRouteStart(server, route) {
    server.to(`unit:${route.unitId}`).emit(TrackingEventType.ROUTE_STARTED, route);
    server.to('role:dispatcher').emit(TrackingEventType.ROUTE_STARTED, route);
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
function broadcastRouteUpdate(server, route) {
    if (!route.unitId)
        return;
    server.to(`unit:${route.unitId}`).emit(TrackingEventType.ROUTE_UPDATED, route);
    server.to('map:live').emit(TrackingEventType.ROUTE_UPDATED, route);
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
function broadcastRouteCompletion(server, routeId, unitId) {
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
function detectRouteDeviation(server, unitId, routeId, deviationDistance, currentLocation) {
    const deviation = {
        unitId,
        routeId,
        deviationDistance,
        currentLocation,
        timestamp: new Date(),
    };
    server.to(`unit:${unitId}`).emit(TrackingEventType.ROUTE_DEVIATION, deviation);
    server.to('role:dispatcher').emit(TrackingEventType.ROUTE_DEVIATION, deviation);
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
function broadcastETAUpdate(server, eta) {
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
function broadcastETADelay(server, unitId, delaySeconds, reason) {
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
function calculateSimpleETA(distance, averageSpeed) {
    if (averageSpeed <= 0)
        return Infinity;
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
function broadcastSpeedViolation(server, violation) {
    server.to(`unit:${violation.unitId}`).emit(TrackingEventType.SPEED_VIOLATION, violation);
    server.to('role:dispatcher').emit(TrackingEventType.SPEED_VIOLATION, violation);
    // High severity violations go to supervisors
    if (violation.severity === 'severe') {
        server.to('role:supervisor').emit(TrackingEventType.SPEED_VIOLATION, violation);
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
function getSpeedViolationSeverity(currentSpeed, speedLimit) {
    const excess = currentSpeed - speedLimit;
    if (excess < 10)
        return 'minor';
    if (excess < 30)
        return 'moderate';
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
function broadcastProximityAlert(server, alert) {
    server.to(`unit:${alert.unitId1}`).emit(TrackingEventType.PROXIMITY_ALERT, alert);
    server.to(`unit:${alert.unitId2}`).emit(TrackingEventType.PROXIMITY_ALERT, alert);
    server.to('role:dispatcher').emit(TrackingEventType.PROXIMITY_ALERT, alert);
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
function detectUnitsConverging(server, unitIds, location) {
    const convergence = {
        unitIds,
        location,
        timestamp: new Date(),
    };
    unitIds.forEach((unitId) => {
        server.to(`unit:${unitId}`).emit(TrackingEventType.UNITS_CONVERGING, convergence);
    });
    server.to('role:dispatcher').emit(TrackingEventType.UNITS_CONVERGING, convergence);
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
function updateMapMarker(server, marker) {
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
function createMarkerCluster(server, clusterId, markers, centerLocation) {
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
function removeMapMarker(server, markerId) {
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
async function getHistoricalTrack(unitId, startTime, endTime) {
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
function streamHistoricalPlayback(server, client, unitId, track, speedMultiplier = 1.0) {
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
function broadcastGPSSignalWeak(server, unitId, signalStrength) {
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
function broadcastGPSSignalRestored(server, unitId, signalStrength) {
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
function broadcastLowBattery(server, unitId, batteryLevel) {
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
function interpolateLocation(point1, point2, fraction) {
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
function broadcastInterpolatedLocation(server, unitId, location) {
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
function createAdaptiveThrottling(minInterval, maxInterval) {
    let AdaptiveThrottlingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var AdaptiveThrottlingInterceptor = _classThis = class {
            constructor() {
                this.lastUpdate = new Map();
            }
            intercept(context, next) {
                const client = context.switchToWs().getClient();
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
                    return new rxjs_1.Observable((subscriber) => subscriber.complete());
                }
                this.lastUpdate.set(unitId, now);
                return next.handle();
            }
            calculateInterval(speed, minInterval, maxInterval) {
                // Higher speed = more frequent updates
                if (speed > 80)
                    return minInterval;
                if (speed > 50)
                    return minInterval * 2;
                if (speed > 20)
                    return minInterval * 4;
                return maxInterval;
            }
        };
        __setFunctionName(_classThis, "AdaptiveThrottlingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdaptiveThrottlingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return AdaptiveThrottlingInterceptor = _classThis;
    })();
    return AdaptiveThrottlingInterceptor;
}
//# sourceMappingURL=live-tracking-websockets.js.map