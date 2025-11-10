/**
 * LOC: RTMON1234567
 * File: /reuse/command/real-time-monitoring-api.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable API utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Real-time monitoring services
 *   - WebSocket gateway implementations
 *   - Command center dashboards
 *   - Incident management systems
 */
import { Sequelize } from 'sequelize';
interface WebSocketConnection {
    id: string;
    userId: string;
    connectionTime: Date;
    lastHeartbeat: Date;
    subscriptions: string[];
    metadata: Record<string, any>;
}
interface IncidentStream {
    incidentId: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: string;
    location: LocationData;
    timestamp: Date;
    metadata: Record<string, any>;
}
interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    timestamp: Date;
}
interface UnitLocationUpdate {
    unitId: string;
    location: LocationData;
    status: string;
    assignedIncident?: string;
    updateType: 'gps' | 'manual' | 'beacon';
}
interface StatusUpdate {
    entityId: string;
    entityType: 'unit' | 'incident' | 'facility' | 'equipment';
    previousStatus: string;
    currentStatus: string;
    timestamp: Date;
    userId?: string;
    reason?: string;
}
interface EventNotification {
    eventId: string;
    type: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    source: string;
    timestamp: Date;
    recipients: string[];
    metadata: Record<string, any>;
}
interface MetricsSnapshot {
    metricType: string;
    value: number;
    unit: string;
    timestamp: Date;
    labels: Record<string, string>;
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
interface MapOverlay {
    overlayId: string;
    type: 'heatmap' | 'boundary' | 'route' | 'zone' | 'marker' | 'cluster';
    data: any;
    style: Record<string, any>;
    visibility: boolean;
    zIndex: number;
    updateFrequency?: number;
}
interface VideoFeedConfig {
    feedId: string;
    streamUrl: string;
    protocol: 'rtsp' | 'hls' | 'webrtc' | 'mjpeg';
    resolution: string;
    frameRate: number;
    location?: LocationData;
    active: boolean;
}
interface SensorData {
    sensorId: string;
    sensorType: string;
    readings: Array<{
        parameter: string;
        value: number;
        unit: string;
        timestamp: Date;
    }>;
    location?: LocationData;
    alertThresholds?: Record<string, {
        min?: number;
        max?: number;
    }>;
}
interface RealtimeFilter {
    entityTypes?: string[];
    priorities?: string[];
    locations?: {
        latitude: number;
        longitude: number;
        radiusKm: number;
    }[];
    timeRange?: {
        start: Date;
        end: Date;
    };
    statuses?: string[];
}
interface StreamAggregation {
    windowSize: number;
    aggregationType: 'count' | 'sum' | 'avg' | 'min' | 'max';
    groupBy?: string[];
}
interface BackpressureConfig {
    maxBufferSize: number;
    dropStrategy: 'oldest' | 'newest' | 'random';
    warningThreshold: number;
}
/**
 * Sequelize model for WebSocket connections with subscription tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebSocketConnection model
 *
 * @example
 * ```typescript
 * const WSConnection = createWebSocketConnectionModel(sequelize);
 * const conn = await WSConnection.create({
 *   id: 'ws_abc123',
 *   userId: 'user_456',
 *   subscriptions: ['incidents', 'unit_locations'],
 *   metadata: { device: 'mobile', appVersion: '2.1.0' }
 * });
 * ```
 */
export declare const createWebSocketConnectionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        userId: string;
        connectionTime: Date;
        lastHeartbeat: Date;
        subscriptions: string[];
        metadata: Record<string, any>;
        active: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for incident event streams.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IncidentStream model
 *
 * @example
 * ```typescript
 * const IncidentStream = createIncidentStreamModel(sequelize);
 * const event = await IncidentStream.create({
 *   incidentId: 'inc_789',
 *   type: 'structure_fire',
 *   priority: 'critical',
 *   status: 'active',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export declare const createIncidentStreamModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        incidentId: string;
        type: string;
        priority: string;
        status: string;
        location: LocationData;
        timestamp: Date;
        metadata: Record<string, any>;
        broadcasted: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for unit location tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} UnitLocationLog model
 *
 * @example
 * ```typescript
 * const UnitLocation = createUnitLocationModel(sequelize);
 * const update = await UnitLocation.create({
 *   unitId: 'unit_123',
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 10 },
 *   status: 'en_route',
 *   updateType: 'gps'
 * });
 * ```
 */
export declare const createUnitLocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        unitId: string;
        location: LocationData;
        status: string;
        assignedIncident: string | null;
        updateType: string;
        timestamp: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Establishes and registers a new WebSocket connection.
 *
 * @param {string} connectionId - Unique connection identifier
 * @param {string} userId - User ID
 * @param {Record<string, any>} metadata - Connection metadata
 * @param {Model} ConnectionModel - Sequelize model
 * @returns {Promise<WebSocketConnection>} Connection record
 *
 * @example
 * ```typescript
 * const connection = await registerWebSocketConnection(
 *   'ws_abc123',
 *   'user_456',
 *   { device: 'mobile', ip: '192.168.1.1' },
 *   WSConnectionModel
 * );
 * ```
 */
export declare const registerWebSocketConnection: (connectionId: string, userId: string, metadata: Record<string, any>, ConnectionModel: any) => Promise<WebSocketConnection>;
/**
 * Updates WebSocket connection heartbeat timestamp.
 *
 * @param {string} connectionId - Connection identifier
 * @param {Model} ConnectionModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const updated = await updateConnectionHeartbeat('ws_abc123', WSConnectionModel);
 * if (!updated) {
 *   console.log('Connection not found or inactive');
 * }
 * ```
 */
export declare const updateConnectionHeartbeat: (connectionId: string, ConnectionModel: any) => Promise<boolean>;
/**
 * Detects and cleans up stale WebSocket connections.
 *
 * @param {number} timeoutSeconds - Connection timeout in seconds
 * @param {Model} ConnectionModel - Sequelize model
 * @returns {Promise<string[]>} Array of stale connection IDs
 *
 * @example
 * ```typescript
 * const staleConnections = await detectStaleConnections(30, WSConnectionModel);
 * staleConnections.forEach(id => {
 *   console.log(`Closing stale connection: ${id}`);
 *   socketServer.close(id);
 * });
 * ```
 */
export declare const detectStaleConnections: (timeoutSeconds: number, ConnectionModel: any) => Promise<string[]>;
/**
 * Adds stream subscription to WebSocket connection.
 *
 * @param {string} connectionId - Connection identifier
 * @param {string} streamId - Stream to subscribe to
 * @param {Model} ConnectionModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await subscribeToStream('ws_abc123', 'incidents:critical', WSConnectionModel);
 * await subscribeToStream('ws_abc123', 'units:all:locations', WSConnectionModel);
 * ```
 */
export declare const subscribeToStream: (connectionId: string, streamId: string, ConnectionModel: any) => Promise<boolean>;
/**
 * Removes stream subscription from WebSocket connection.
 *
 * @param {string} connectionId - Connection identifier
 * @param {string} streamId - Stream to unsubscribe from
 * @param {Model} ConnectionModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await unsubscribeFromStream('ws_abc123', 'incidents:critical', WSConnectionModel);
 * ```
 */
export declare const unsubscribeFromStream: (connectionId: string, streamId: string, ConnectionModel: any) => Promise<boolean>;
/**
 * Publishes incident update to real-time stream.
 *
 * @param {IncidentStream} incident - Incident data
 * @param {Model} IncidentModel - Sequelize model
 * @returns {Promise<any>} Created stream event
 *
 * @example
 * ```typescript
 * const event = await publishIncidentUpdate({
 *   incidentId: 'inc_789',
 *   type: 'medical_emergency',
 *   priority: 'high',
 *   status: 'dispatched',
 *   location: { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   timestamp: new Date(),
 *   metadata: { responders: 2, eta: 300 }
 * }, IncidentStreamModel);
 * ```
 */
export declare const publishIncidentUpdate: (incident: IncidentStream, IncidentModel: any) => Promise<any>;
/**
 * Retrieves recent incident stream events with filtering.
 *
 * @param {RealtimeFilter} filters - Filter criteria
 * @param {number} limit - Maximum events to return
 * @param {Model} IncidentModel - Sequelize model
 * @returns {Promise<IncidentStream[]>} Filtered incidents
 *
 * @example
 * ```typescript
 * const incidents = await getIncidentStream({
 *   priorities: ['critical', 'high'],
 *   statuses: ['active', 'dispatched'],
 *   timeRange: { start: new Date(Date.now() - 3600000), end: new Date() }
 * }, 50, IncidentStreamModel);
 * ```
 */
export declare const getIncidentStream: (filters: RealtimeFilter, limit: number, IncidentModel: any) => Promise<IncidentStream[]>;
/**
 * Marks incident events as broadcasted to clients.
 *
 * @param {string[]} eventIds - Event IDs to mark
 * @param {Model} IncidentModel - Sequelize model
 * @returns {Promise<number>} Number of updated events
 *
 * @example
 * ```typescript
 * const updated = await markIncidentsAsBroadcasted(['1', '2', '3'], IncidentStreamModel);
 * console.log(`Broadcasted ${updated} incident events`);
 * ```
 */
export declare const markIncidentsAsBroadcasted: (eventIds: string[], IncidentModel: any) => Promise<number>;
/**
 * Retrieves incident events pending broadcast.
 *
 * @param {number} limit - Maximum events to retrieve
 * @param {Model} IncidentModel - Sequelize model
 * @returns {Promise<IncidentStream[]>} Pending incidents
 *
 * @example
 * ```typescript
 * const pending = await getPendingIncidentBroadcasts(100, IncidentStreamModel);
 * pending.forEach(incident => {
 *   socketServer.broadcast('incidents', incident);
 * });
 * ```
 */
export declare const getPendingIncidentBroadcasts: (limit: number, IncidentModel: any) => Promise<IncidentStream[]>;
/**
 * Filters incident stream by geographic proximity.
 *
 * @param {IncidentStream[]} incidents - Incidents to filter
 * @param {LocationData} centerPoint - Center point
 * @param {number} radiusKm - Radius in kilometers
 * @returns {IncidentStream[]} Filtered incidents
 *
 * @example
 * ```typescript
 * const nearby = filterIncidentsByLocation(
 *   allIncidents,
 *   { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   5 // 5km radius
 * );
 * ```
 */
export declare const filterIncidentsByLocation: (incidents: IncidentStream[], centerPoint: LocationData, radiusKm: number) => IncidentStream[];
/**
 * Publishes unit location update to stream.
 *
 * @param {UnitLocationUpdate} update - Location update data
 * @param {Model} LocationModel - Sequelize model
 * @returns {Promise<any>} Created location record
 *
 * @example
 * ```typescript
 * const update = await publishUnitLocationUpdate({
 *   unitId: 'unit_123',
 *   location: { latitude: 40.7128, longitude: -74.0060, accuracy: 10, timestamp: new Date() },
 *   status: 'en_route',
 *   assignedIncident: 'inc_789',
 *   updateType: 'gps'
 * }, UnitLocationModel);
 * ```
 */
export declare const publishUnitLocationUpdate: (update: UnitLocationUpdate, LocationModel: any) => Promise<any>;
/**
 * Retrieves latest location for each unit.
 *
 * @param {string[]} unitIds - Unit IDs to query
 * @param {Model} LocationModel - Sequelize model
 * @returns {Promise<Record<string, UnitLocationUpdate>>} Unit locations map
 *
 * @example
 * ```typescript
 * const locations = await getLatestUnitLocations(
 *   ['unit_123', 'unit_456', 'unit_789'],
 *   UnitLocationModel
 * );
 * console.log(locations['unit_123'].location);
 * ```
 */
export declare const getLatestUnitLocations: (unitIds: string[], LocationModel: any) => Promise<Record<string, UnitLocationUpdate>>;
/**
 * Retrieves location history for a unit within time range.
 *
 * @param {string} unitId - Unit identifier
 * @param {Date} startTime - Start of time range
 * @param {Date} endTime - End of time range
 * @param {Model} LocationModel - Sequelize model
 * @returns {Promise<UnitLocationUpdate[]>} Location history
 *
 * @example
 * ```typescript
 * const history = await getUnitLocationHistory(
 *   'unit_123',
 *   new Date(Date.now() - 3600000),
 *   new Date(),
 *   UnitLocationModel
 * );
 * // Returns all location updates in the last hour
 * ```
 */
export declare const getUnitLocationHistory: (unitId: string, startTime: Date, endTime: Date, LocationModel: any) => Promise<UnitLocationUpdate[]>;
/**
 * Finds units within geographic area.
 *
 * @param {LocationData} centerPoint - Center point
 * @param {number} radiusKm - Radius in kilometers
 * @param {Model} LocationModel - Sequelize model
 * @returns {Promise<Array<{ unitId: string; location: LocationData; distance: number }>>} Nearby units
 *
 * @example
 * ```typescript
 * const nearbyUnits = await findUnitsInArea(
 *   { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   10, // 10km radius
 *   UnitLocationModel
 * );
 * nearbyUnits.forEach(unit => {
 *   console.log(`${unit.unitId} is ${unit.distance.toFixed(2)}km away`);
 * });
 * ```
 */
export declare const findUnitsInArea: (centerPoint: LocationData, radiusKm: number, LocationModel: any) => Promise<Array<{
    unitId: string;
    location: LocationData;
    distance: number;
}>>;
/**
 * Calculates estimated time of arrival for unit to location.
 *
 * @param {UnitLocationUpdate} unitLocation - Unit's current location
 * @param {LocationData} destination - Destination location
 * @param {number} [averageSpeedKmh=60] - Average speed in km/h
 * @returns {number} Estimated time in seconds
 *
 * @example
 * ```typescript
 * const eta = calculateUnitETA(
 *   currentUnitLocation,
 *   { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   50 // 50 km/h average speed
 * );
 * console.log(`ETA: ${Math.round(eta / 60)} minutes`);
 * ```
 */
export declare const calculateUnitETA: (unitLocation: UnitLocationUpdate, destination: LocationData, averageSpeedKmh?: number) => number;
/**
 * Broadcasts status change event to subscribers.
 *
 * @param {StatusUpdate} update - Status update data
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await broadcastStatusUpdate({
 *   entityId: 'unit_123',
 *   entityType: 'unit',
 *   previousStatus: 'available',
 *   currentStatus: 'en_route',
 *   timestamp: new Date(),
 *   userId: 'dispatcher_456',
 *   reason: 'Dispatched to incident'
 * }, (channel, data) => socketServer.broadcast(channel, data));
 * ```
 */
export declare const broadcastStatusUpdate: (update: StatusUpdate, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Creates status update history record.
 *
 * @param {StatusUpdate} update - Status update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created record
 *
 * @example
 * ```typescript
 * const record = await createStatusUpdateRecord(statusUpdate, sequelize);
 * ```
 */
export declare const createStatusUpdateRecord: (update: StatusUpdate, sequelize: Sequelize) => Promise<any>;
/**
 * Retrieves status update timeline for entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {number} limit - Maximum records
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<StatusUpdate[]>} Status history
 *
 * @example
 * ```typescript
 * const timeline = await getStatusUpdateTimeline('unit_123', 'unit', 50, sequelize);
 * timeline.forEach(update => {
 *   console.log(`${update.timestamp}: ${update.previousStatus} -> ${update.currentStatus}`);
 * });
 * ```
 */
export declare const getStatusUpdateTimeline: (entityId: string, entityType: string, limit: number, sequelize: Sequelize) => Promise<StatusUpdate[]>;
/**
 * Aggregates status statistics for entity type.
 *
 * @param {string} entityType - Entity type
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, number>>} Status counts
 *
 * @example
 * ```typescript
 * const stats = await aggregateStatusStatistics(
 *   'unit',
 *   new Date(Date.now() - 86400000),
 *   new Date(),
 *   sequelize
 * );
 * console.log(`Available: ${stats.available}, En Route: ${stats.en_route}`);
 * ```
 */
export declare const aggregateStatusStatistics: (entityType: string, startTime: Date, endTime: Date, sequelize: Sequelize) => Promise<Record<string, number>>;
/**
 * Publishes real-time event notification.
 *
 * @param {EventNotification} event - Event notification data
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishEventNotification({
 *   eventId: 'evt_abc123',
 *   type: 'system_alert',
 *   severity: 'warning',
 *   title: 'High Call Volume',
 *   message: 'Call volume exceeds normal threshold by 40%',
 *   source: 'analytics_service',
 *   timestamp: new Date(),
 *   recipients: ['dispatcher_all'],
 *   metadata: { callCount: 450, threshold: 320 }
 * }, (channel, data) => socketServer.broadcast(channel, data));
 * ```
 */
export declare const publishEventNotification: (event: EventNotification, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Filters events by severity and type.
 *
 * @param {EventNotification[]} events - Events to filter
 * @param {string[]} severities - Severity levels to include
 * @param {string[]} types - Event types to include
 * @returns {EventNotification[]} Filtered events
 *
 * @example
 * ```typescript
 * const critical = filterEventsBySeverity(
 *   allEvents,
 *   ['critical', 'error'],
 *   ['system_alert', 'security_breach']
 * );
 * ```
 */
export declare const filterEventsBySeverity: (events: EventNotification[], severities: string[], types: string[]) => EventNotification[];
/**
 * Creates event notification digest for time period.
 *
 * @param {EventNotification[]} events - Events to digest
 * @param {number} periodMinutes - Time period in minutes
 * @returns {Record<string, any>} Digest summary
 *
 * @example
 * ```typescript
 * const digest = createEventDigest(recentEvents, 60);
 * console.log(`Last hour: ${digest.total} events, ${digest.critical} critical`);
 * ```
 */
export declare const createEventDigest: (events: EventNotification[], periodMinutes: number) => Record<string, any>;
/**
 * Prioritizes event notifications based on severity and type.
 *
 * @param {EventNotification[]} events - Events to prioritize
 * @returns {EventNotification[]} Sorted events
 *
 * @example
 * ```typescript
 * const sorted = prioritizeEventNotifications(events);
 * // Critical events first, then error, warning, info
 * ```
 */
export declare const prioritizeEventNotifications: (events: EventNotification[]) => EventNotification[];
/**
 * Publishes real-time metric snapshot.
 *
 * @param {MetricsSnapshot} metric - Metric data
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishMetricSnapshot({
 *   metricType: 'response_time',
 *   value: 245,
 *   unit: 'seconds',
 *   timestamp: new Date(),
 *   labels: { incident_type: 'fire', priority: 'high' },
 *   aggregation: 'avg'
 * }, (channel, data) => socketServer.broadcast(channel, data));
 * ```
 */
export declare const publishMetricSnapshot: (metric: MetricsSnapshot, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Aggregates metrics over time window.
 *
 * @param {MetricsSnapshot[]} metrics - Metrics to aggregate
 * @param {StreamAggregation} config - Aggregation configuration
 * @returns {Record<string, number>} Aggregated results
 *
 * @example
 * ```typescript
 * const aggregated = aggregateMetricsWindow(
 *   responseTimeMetrics,
 *   { windowSize: 300000, aggregationType: 'avg', groupBy: ['incident_type'] }
 * );
 * console.log(`Average fire response: ${aggregated.fire}s`);
 * ```
 */
export declare const aggregateMetricsWindow: (metrics: MetricsSnapshot[], config: StreamAggregation) => Record<string, number>;
/**
 * Creates metrics time series for visualization.
 *
 * @param {MetricsSnapshot[]} metrics - Metrics data
 * @param {number} intervalSeconds - Time interval bucket size
 * @returns {Array<{ timestamp: Date; value: number }>} Time series data
 *
 * @example
 * ```typescript
 * const timeSeries = createMetricsTimeSeries(callVolumeMetrics, 60);
 * // Returns per-minute call volume
 * ```
 */
export declare const createMetricsTimeSeries: (metrics: MetricsSnapshot[], intervalSeconds: number) => Array<{
    timestamp: Date;
    value: number;
}>;
/**
 * Detects metric anomalies using threshold-based detection.
 *
 * @param {MetricsSnapshot[]} metrics - Metrics to analyze
 * @param {number} threshold - Anomaly threshold
 * @param {string} direction - Detection direction ('above' | 'below' | 'both')
 * @returns {MetricsSnapshot[]} Anomalous metrics
 *
 * @example
 * ```typescript
 * const anomalies = detectMetricAnomalies(responseTimeMetrics, 600, 'above');
 * // Returns metrics where response time > 600 seconds
 * ```
 */
export declare const detectMetricAnomalies: (metrics: MetricsSnapshot[], threshold: number, direction: "above" | "below" | "both") => MetricsSnapshot[];
/**
 * Creates real-time map overlay configuration.
 *
 * @param {MapOverlay} overlay - Overlay configuration
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createMapOverlay({
 *   overlayId: 'heatmap_incidents',
 *   type: 'heatmap',
 *   data: incidentDensityData,
 *   style: { gradient: ['blue', 'yellow', 'red'], radius: 20 },
 *   visibility: true,
 *   zIndex: 100,
 *   updateFrequency: 30000
 * }, (channel, data) => socketServer.broadcast(channel, data));
 * ```
 */
export declare const createMapOverlay: (overlay: MapOverlay, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Updates existing map overlay data.
 *
 * @param {string} overlayId - Overlay identifier
 * @param {Partial<MapOverlay>} updates - Updates to apply
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateMapOverlay(
 *   'heatmap_incidents',
 *   { data: updatedIncidentData, visibility: true },
 *   (channel, data) => socketServer.broadcast(channel, data)
 * );
 * ```
 */
export declare const updateMapOverlay: (overlayId: string, updates: Partial<MapOverlay>, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Removes map overlay from real-time display.
 *
 * @param {string} overlayId - Overlay identifier
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeMapOverlay('heatmap_incidents', (channel, data) => socketServer.broadcast(channel, data));
 * ```
 */
export declare const removeMapOverlay: (overlayId: string, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Generates heatmap overlay from incident locations.
 *
 * @param {IncidentStream[]} incidents - Incidents with location data
 * @param {number} radiusMeters - Heatmap point radius
 * @returns {MapOverlay} Heatmap overlay configuration
 *
 * @example
 * ```typescript
 * const heatmap = generateIncidentHeatmap(recentIncidents, 500);
 * await createMapOverlay(heatmap, broadcastFn);
 * ```
 */
export declare const generateIncidentHeatmap: (incidents: IncidentStream[], radiusMeters: number) => MapOverlay;
/**
 * Registers video feed stream for real-time monitoring.
 *
 * @param {VideoFeedConfig} feed - Video feed configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created feed record
 *
 * @example
 * ```typescript
 * const feed = await registerVideoFeed({
 *   feedId: 'cam_001',
 *   streamUrl: 'rtsp://camera.example.com/stream',
 *   protocol: 'rtsp',
 *   resolution: '1920x1080',
 *   frameRate: 30,
 *   location: { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   active: true
 * }, sequelize);
 * ```
 */
export declare const registerVideoFeed: (feed: VideoFeedConfig, sequelize: Sequelize) => Promise<any>;
/**
 * Retrieves active video feeds with location filtering.
 *
 * @param {LocationData} [centerPoint] - Center point for proximity filter
 * @param {number} [radiusKm] - Radius in kilometers
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<VideoFeedConfig[]>} Active video feeds
 *
 * @example
 * ```typescript
 * const nearbyFeeds = await getActiveVideoFeeds(
 *   { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   5,
 *   sequelize
 * );
 * ```
 */
export declare const getActiveVideoFeeds: (centerPoint?: LocationData, radiusKm?: number, sequelize?: Sequelize) => Promise<VideoFeedConfig[]>;
/**
 * Updates video feed status (active/inactive).
 *
 * @param {string} feedId - Feed identifier
 * @param {boolean} active - Active status
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateVideoFeedStatus('cam_001', false, sequelize);
 * ```
 */
export declare const updateVideoFeedStatus: (feedId: string, active: boolean, sequelize: Sequelize) => Promise<boolean>;
/**
 * Creates video feed snapshot metadata for archiving.
 *
 * @param {string} feedId - Feed identifier
 * @param {Date} timestamp - Snapshot timestamp
 * @param {string} snapshotUrl - URL to snapshot image
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created snapshot record
 *
 * @example
 * ```typescript
 * const snapshot = await createVideoSnapshot(
 *   'cam_001',
 *   new Date(),
 *   's3://bucket/snapshots/cam_001_20250109.jpg',
 *   sequelize
 * );
 * ```
 */
export declare const createVideoSnapshot: (feedId: string, timestamp: Date, snapshotUrl: string, sequelize: Sequelize) => Promise<any>;
/**
 * Ingests real-time sensor data reading.
 *
 * @param {SensorData} sensorData - Sensor data
 * @param {Function} broadcastFn - Broadcast function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await ingestSensorData({
 *   sensorId: 'temp_sensor_01',
 *   sensorType: 'temperature',
 *   readings: [
 *     { parameter: 'temperature', value: 22.5, unit: 'celsius', timestamp: new Date() },
 *     { parameter: 'humidity', value: 45, unit: 'percent', timestamp: new Date() }
 *   ],
 *   location: { latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
 *   alertThresholds: { temperature: { max: 30 }, humidity: { max: 80 } }
 * }, (channel, data) => socketServer.broadcast(channel, data));
 * ```
 */
export declare const ingestSensorData: (sensorData: SensorData, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
/**
 * Checks sensor readings against alert thresholds.
 *
 * @param {SensorData} sensorData - Sensor data
 * @returns {Array<any>} Alert messages
 *
 * @example
 * ```typescript
 * const alerts = checkSensorThresholds(sensorData);
 * alerts.forEach(alert => {
 *   console.log(`ALERT: ${alert.parameter} ${alert.violation}`);
 * });
 * ```
 */
export declare const checkSensorThresholds: (sensorData: SensorData) => Array<any>;
/**
 * Aggregates sensor data over time window.
 *
 * @param {SensorData[]} sensorDataArray - Array of sensor readings
 * @param {number} windowMinutes - Aggregation window in minutes
 * @returns {Record<string, any>} Aggregated sensor statistics
 *
 * @example
 * ```typescript
 * const stats = aggregateSensorData(temperatureReadings, 60);
 * console.log(`Last hour avg temp: ${stats.temperature.avg}°C`);
 * ```
 */
export declare const aggregateSensorData: (sensorDataArray: SensorData[], windowMinutes: number) => Record<string, any>;
/**
 * Detects sensor data anomalies using statistical methods.
 *
 * @param {SensorData[]} historicalData - Historical sensor data
 * @param {SensorData} currentReading - Current reading to check
 * @param {number} [standardDeviations=2] - Number of standard deviations for anomaly
 * @returns {boolean} Whether reading is anomalous
 *
 * @example
 * ```typescript
 * const isAnomalous = detectSensorAnomalies(historicalData, currentReading, 3);
 * if (isAnomalous) {
 *   console.log('Anomalous sensor reading detected!');
 * }
 * ```
 */
export declare const detectSensorAnomalies: (historicalData: SensorData[], currentReading: SensorData, standardDeviations?: number) => boolean;
/**
 * Implements backpressure handling for high-volume streams.
 *
 * @param {any[]} buffer - Message buffer
 * @param {BackpressureConfig} config - Backpressure configuration
 * @returns {any[]} Adjusted buffer
 *
 * @example
 * ```typescript
 * const adjustedBuffer = handleStreamBackpressure(messageQueue, {
 *   maxBufferSize: 1000,
 *   dropStrategy: 'oldest',
 *   warningThreshold: 800
 * });
 * ```
 */
export declare const handleStreamBackpressure: (buffer: any[], config: BackpressureConfig) => any[];
/**
 * Creates stream compression for bandwidth optimization.
 *
 * @param {any} data - Data to compress
 * @param {string} compressionType - Compression type ('gzip' | 'delta' | 'sampling')
 * @returns {any} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = compressStreamData(locationUpdates, 'delta');
 * // Only sends changes from previous update
 * ```
 */
export declare const compressStreamData: (data: any, compressionType: string) => any;
/**
 * Implements stream reconnection with exponential backoff.
 *
 * @param {Function} connectFn - Connection function
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @returns {Promise<any>} Connection result
 *
 * @example
 * ```typescript
 * const connection = await reconnectWithBackoff(
 *   () => connectToWebSocket(url),
 *   5,
 *   1000
 * );
 * ```
 */
export declare const reconnectWithBackoff: (connectFn: () => Promise<any>, maxRetries: number, baseDelayMs: number) => Promise<any>;
declare const _default: {
    createWebSocketConnectionModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            userId: string;
            connectionTime: Date;
            lastHeartbeat: Date;
            subscriptions: string[];
            metadata: Record<string, any>;
            active: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createIncidentStreamModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            incidentId: string;
            type: string;
            priority: string;
            status: string;
            location: LocationData;
            timestamp: Date;
            metadata: Record<string, any>;
            broadcasted: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createUnitLocationModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            unitId: string;
            location: LocationData;
            status: string;
            assignedIncident: string | null;
            updateType: string;
            timestamp: Date;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    registerWebSocketConnection: (connectionId: string, userId: string, metadata: Record<string, any>, ConnectionModel: any) => Promise<WebSocketConnection>;
    updateConnectionHeartbeat: (connectionId: string, ConnectionModel: any) => Promise<boolean>;
    detectStaleConnections: (timeoutSeconds: number, ConnectionModel: any) => Promise<string[]>;
    subscribeToStream: (connectionId: string, streamId: string, ConnectionModel: any) => Promise<boolean>;
    unsubscribeFromStream: (connectionId: string, streamId: string, ConnectionModel: any) => Promise<boolean>;
    publishIncidentUpdate: (incident: IncidentStream, IncidentModel: any) => Promise<any>;
    getIncidentStream: (filters: RealtimeFilter, limit: number, IncidentModel: any) => Promise<IncidentStream[]>;
    markIncidentsAsBroadcasted: (eventIds: string[], IncidentModel: any) => Promise<number>;
    getPendingIncidentBroadcasts: (limit: number, IncidentModel: any) => Promise<IncidentStream[]>;
    filterIncidentsByLocation: (incidents: IncidentStream[], centerPoint: LocationData, radiusKm: number) => IncidentStream[];
    publishUnitLocationUpdate: (update: UnitLocationUpdate, LocationModel: any) => Promise<any>;
    getLatestUnitLocations: (unitIds: string[], LocationModel: any) => Promise<Record<string, UnitLocationUpdate>>;
    getUnitLocationHistory: (unitId: string, startTime: Date, endTime: Date, LocationModel: any) => Promise<UnitLocationUpdate[]>;
    findUnitsInArea: (centerPoint: LocationData, radiusKm: number, LocationModel: any) => Promise<Array<{
        unitId: string;
        location: LocationData;
        distance: number;
    }>>;
    calculateUnitETA: (unitLocation: UnitLocationUpdate, destination: LocationData, averageSpeedKmh?: number) => number;
    broadcastStatusUpdate: (update: StatusUpdate, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    createStatusUpdateRecord: (update: StatusUpdate, sequelize: Sequelize) => Promise<any>;
    getStatusUpdateTimeline: (entityId: string, entityType: string, limit: number, sequelize: Sequelize) => Promise<StatusUpdate[]>;
    aggregateStatusStatistics: (entityType: string, startTime: Date, endTime: Date, sequelize: Sequelize) => Promise<Record<string, number>>;
    publishEventNotification: (event: EventNotification, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    filterEventsBySeverity: (events: EventNotification[], severities: string[], types: string[]) => EventNotification[];
    createEventDigest: (events: EventNotification[], periodMinutes: number) => Record<string, any>;
    prioritizeEventNotifications: (events: EventNotification[]) => EventNotification[];
    publishMetricSnapshot: (metric: MetricsSnapshot, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    aggregateMetricsWindow: (metrics: MetricsSnapshot[], config: StreamAggregation) => Record<string, number>;
    createMetricsTimeSeries: (metrics: MetricsSnapshot[], intervalSeconds: number) => Array<{
        timestamp: Date;
        value: number;
    }>;
    detectMetricAnomalies: (metrics: MetricsSnapshot[], threshold: number, direction: "above" | "below" | "both") => MetricsSnapshot[];
    createMapOverlay: (overlay: MapOverlay, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    updateMapOverlay: (overlayId: string, updates: Partial<MapOverlay>, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    removeMapOverlay: (overlayId: string, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    generateIncidentHeatmap: (incidents: IncidentStream[], radiusMeters: number) => MapOverlay;
    registerVideoFeed: (feed: VideoFeedConfig, sequelize: Sequelize) => Promise<any>;
    getActiveVideoFeeds: (centerPoint?: LocationData, radiusKm?: number, sequelize?: Sequelize) => Promise<VideoFeedConfig[]>;
    updateVideoFeedStatus: (feedId: string, active: boolean, sequelize: Sequelize) => Promise<boolean>;
    createVideoSnapshot: (feedId: string, timestamp: Date, snapshotUrl: string, sequelize: Sequelize) => Promise<any>;
    ingestSensorData: (sensorData: SensorData, broadcastFn: (channel: string, data: any) => void) => Promise<void>;
    checkSensorThresholds: (sensorData: SensorData) => Array<any>;
    aggregateSensorData: (sensorDataArray: SensorData[], windowMinutes: number) => Record<string, any>;
    detectSensorAnomalies: (historicalData: SensorData[], currentReading: SensorData, standardDeviations?: number) => boolean;
    handleStreamBackpressure: (buffer: any[], config: BackpressureConfig) => any[];
    compressStreamData: (data: any, compressionType: string) => any;
    reconnectWithBackoff: (connectFn: () => Promise<any>, maxRetries: number, baseDelayMs: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=real-time-monitoring-api.d.ts.map