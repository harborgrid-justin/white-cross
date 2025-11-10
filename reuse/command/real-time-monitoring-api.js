"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconnectWithBackoff = exports.compressStreamData = exports.handleStreamBackpressure = exports.detectSensorAnomalies = exports.aggregateSensorData = exports.checkSensorThresholds = exports.ingestSensorData = exports.createVideoSnapshot = exports.updateVideoFeedStatus = exports.getActiveVideoFeeds = exports.registerVideoFeed = exports.generateIncidentHeatmap = exports.removeMapOverlay = exports.updateMapOverlay = exports.createMapOverlay = exports.detectMetricAnomalies = exports.createMetricsTimeSeries = exports.aggregateMetricsWindow = exports.publishMetricSnapshot = exports.prioritizeEventNotifications = exports.createEventDigest = exports.filterEventsBySeverity = exports.publishEventNotification = exports.aggregateStatusStatistics = exports.getStatusUpdateTimeline = exports.createStatusUpdateRecord = exports.broadcastStatusUpdate = exports.calculateUnitETA = exports.findUnitsInArea = exports.getUnitLocationHistory = exports.getLatestUnitLocations = exports.publishUnitLocationUpdate = exports.filterIncidentsByLocation = exports.getPendingIncidentBroadcasts = exports.markIncidentsAsBroadcasted = exports.getIncidentStream = exports.publishIncidentUpdate = exports.unsubscribeFromStream = exports.subscribeToStream = exports.detectStaleConnections = exports.updateConnectionHeartbeat = exports.registerWebSocketConnection = exports.createUnitLocationModel = exports.createIncidentStreamModel = exports.createWebSocketConnectionModel = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
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
const createWebSocketConnectionModel = (sequelize) => {
    class WSConnection extends sequelize_1.Model {
    }
    WSConnection.init({
        id: {
            type: sequelize_1.DataTypes.STRING(100),
            primaryKey: true,
            comment: 'Unique WebSocket connection ID',
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User ID associated with connection',
        },
        connectionTime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Connection establishment time',
        },
        lastHeartbeat: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last heartbeat timestamp',
        },
        subscriptions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of stream subscriptions',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Connection metadata (device, IP, etc.)',
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether connection is active',
        },
    }, {
        sequelize,
        tableName: 'websocket_connections',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['active'] },
            { fields: ['lastHeartbeat'] },
        ],
    });
    return WSConnection;
};
exports.createWebSocketConnectionModel = createWebSocketConnectionModel;
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
const createIncidentStreamModel = (sequelize) => {
    class IncidentStreamModel extends sequelize_1.Model {
    }
    IncidentStreamModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        incidentId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Incident identifier',
        },
        type: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Incident type',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Incident priority level',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Current incident status',
        },
        location: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Incident location data',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Event timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional incident metadata',
        },
        broadcasted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether event was broadcasted',
        },
    }, {
        sequelize,
        tableName: 'incident_streams',
        timestamps: true,
        indexes: [
            { fields: ['incidentId'] },
            { fields: ['priority', 'status'] },
            { fields: ['timestamp'] },
            { fields: ['broadcasted'] },
        ],
    });
    return IncidentStreamModel;
};
exports.createIncidentStreamModel = createIncidentStreamModel;
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
const createUnitLocationModel = (sequelize) => {
    class UnitLocationLog extends sequelize_1.Model {
    }
    UnitLocationLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        unitId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Unit identifier',
        },
        location: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'GPS location data',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Current unit status',
        },
        assignedIncident: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Assigned incident ID',
        },
        updateType: {
            type: sequelize_1.DataTypes.ENUM('gps', 'manual', 'beacon'),
            allowNull: false,
            defaultValue: 'gps',
            comment: 'Type of location update',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Update timestamp',
        },
    }, {
        sequelize,
        tableName: 'unit_location_logs',
        timestamps: true,
        indexes: [
            { fields: ['unitId'] },
            { fields: ['timestamp'] },
            { fields: ['assignedIncident'] },
            { fields: ['status'] },
        ],
    });
    return UnitLocationLog;
};
exports.createUnitLocationModel = createUnitLocationModel;
// ============================================================================
// WEBSOCKET CONNECTION MANAGEMENT (4-8)
// ============================================================================
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
const registerWebSocketConnection = async (connectionId, userId, metadata, ConnectionModel) => {
    const connection = await ConnectionModel.create({
        id: connectionId,
        userId,
        connectionTime: new Date(),
        lastHeartbeat: new Date(),
        subscriptions: [],
        metadata,
        active: true,
    });
    return connection.toJSON();
};
exports.registerWebSocketConnection = registerWebSocketConnection;
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
const updateConnectionHeartbeat = async (connectionId, ConnectionModel) => {
    const [updated] = await ConnectionModel.update({ lastHeartbeat: new Date() }, {
        where: {
            id: connectionId,
            active: true,
        },
    });
    return updated > 0;
};
exports.updateConnectionHeartbeat = updateConnectionHeartbeat;
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
const detectStaleConnections = async (timeoutSeconds, ConnectionModel) => {
    const cutoffTime = new Date(Date.now() - timeoutSeconds * 1000);
    const staleConnections = await ConnectionModel.findAll({
        where: {
            lastHeartbeat: {
                [sequelize_1.Op.lt]: cutoffTime,
            },
            active: true,
        },
        attributes: ['id'],
    });
    // Mark as inactive
    await ConnectionModel.update({ active: false }, {
        where: {
            id: {
                [sequelize_1.Op.in]: staleConnections.map((c) => c.id),
            },
        },
    });
    return staleConnections.map((c) => c.id);
};
exports.detectStaleConnections = detectStaleConnections;
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
const subscribeToStream = async (connectionId, streamId, ConnectionModel) => {
    const connection = await ConnectionModel.findByPk(connectionId);
    if (!connection)
        return false;
    const subscriptions = connection.subscriptions || [];
    if (!subscriptions.includes(streamId)) {
        subscriptions.push(streamId);
        await connection.update({ subscriptions });
    }
    return true;
};
exports.subscribeToStream = subscribeToStream;
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
const unsubscribeFromStream = async (connectionId, streamId, ConnectionModel) => {
    const connection = await ConnectionModel.findByPk(connectionId);
    if (!connection)
        return false;
    const subscriptions = (connection.subscriptions || []).filter((sub) => sub !== streamId);
    await connection.update({ subscriptions });
    return true;
};
exports.unsubscribeFromStream = unsubscribeFromStream;
// ============================================================================
// INCIDENT STREAMING (9-13)
// ============================================================================
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
const publishIncidentUpdate = async (incident, IncidentModel) => {
    const event = await IncidentModel.create({
        incidentId: incident.incidentId,
        type: incident.type,
        priority: incident.priority,
        status: incident.status,
        location: incident.location,
        timestamp: incident.timestamp,
        metadata: incident.metadata,
        broadcasted: false,
    });
    return event;
};
exports.publishIncidentUpdate = publishIncidentUpdate;
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
const getIncidentStream = async (filters, limit, IncidentModel) => {
    const whereClause = {};
    if (filters.priorities && filters.priorities.length > 0) {
        whereClause.priority = { [sequelize_1.Op.in]: filters.priorities };
    }
    if (filters.statuses && filters.statuses.length > 0) {
        whereClause.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.timeRange) {
        whereClause.timestamp = {
            [sequelize_1.Op.between]: [filters.timeRange.start, filters.timeRange.end],
        };
    }
    const incidents = await IncidentModel.findAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
        limit,
    });
    return incidents.map((i) => i.toJSON());
};
exports.getIncidentStream = getIncidentStream;
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
const markIncidentsAsBroadcasted = async (eventIds, IncidentModel) => {
    const [updated] = await IncidentModel.update({ broadcasted: true }, {
        where: {
            id: { [sequelize_1.Op.in]: eventIds },
        },
    });
    return updated;
};
exports.markIncidentsAsBroadcasted = markIncidentsAsBroadcasted;
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
const getPendingIncidentBroadcasts = async (limit, IncidentModel) => {
    const pending = await IncidentModel.findAll({
        where: {
            broadcasted: false,
        },
        order: [['timestamp', 'ASC']],
        limit,
    });
    return pending.map((i) => i.toJSON());
};
exports.getPendingIncidentBroadcasts = getPendingIncidentBroadcasts;
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
const filterIncidentsByLocation = (incidents, centerPoint, radiusKm) => {
    return incidents.filter(incident => {
        const distance = calculateDistance(centerPoint.latitude, centerPoint.longitude, incident.location.latitude, incident.location.longitude);
        return distance <= radiusKm;
    });
};
exports.filterIncidentsByLocation = filterIncidentsByLocation;
// ============================================================================
// UNIT LOCATION TRACKING (14-18)
// ============================================================================
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
const publishUnitLocationUpdate = async (update, LocationModel) => {
    const record = await LocationModel.create({
        unitId: update.unitId,
        location: update.location,
        status: update.status,
        assignedIncident: update.assignedIncident,
        updateType: update.updateType,
        timestamp: new Date(),
    });
    return record;
};
exports.publishUnitLocationUpdate = publishUnitLocationUpdate;
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
const getLatestUnitLocations = async (unitIds, LocationModel) => {
    const latestLocations = {};
    for (const unitId of unitIds) {
        const latest = await LocationModel.findOne({
            where: { unitId },
            order: [['timestamp', 'DESC']],
        });
        if (latest) {
            latestLocations[unitId] = latest.toJSON();
        }
    }
    return latestLocations;
};
exports.getLatestUnitLocations = getLatestUnitLocations;
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
const getUnitLocationHistory = async (unitId, startTime, endTime, LocationModel) => {
    const history = await LocationModel.findAll({
        where: {
            unitId,
            timestamp: {
                [sequelize_1.Op.between]: [startTime, endTime],
            },
        },
        order: [['timestamp', 'ASC']],
    });
    return history.map((h) => h.toJSON());
};
exports.getUnitLocationHistory = getUnitLocationHistory;
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
const findUnitsInArea = async (centerPoint, radiusKm, LocationModel) => {
    // Get latest location for all units
    const latestLocations = await LocationModel.sequelize.query(`
    SELECT DISTINCT ON (unit_id)
      unit_id, location, status, timestamp
    FROM unit_location_logs
    ORDER BY unit_id, timestamp DESC
    `, { type: sequelize_1.Sequelize.QueryTypes.SELECT });
    const nearbyUnits = latestLocations
        .map((record) => {
        const distance = calculateDistance(centerPoint.latitude, centerPoint.longitude, record.location.latitude, record.location.longitude);
        return {
            unitId: record.unit_id,
            location: record.location,
            distance,
        };
    })
        .filter(unit => unit.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
    return nearbyUnits;
};
exports.findUnitsInArea = findUnitsInArea;
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
const calculateUnitETA = (unitLocation, destination, averageSpeedKmh = 60) => {
    const distanceKm = calculateDistance(unitLocation.location.latitude, unitLocation.location.longitude, destination.latitude, destination.longitude);
    const timeHours = distanceKm / averageSpeedKmh;
    return Math.round(timeHours * 3600); // Convert to seconds
};
exports.calculateUnitETA = calculateUnitETA;
// ============================================================================
// STATUS UPDATE STREAMING (19-22)
// ============================================================================
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
const broadcastStatusUpdate = async (update, broadcastFn) => {
    const channel = `status:${update.entityType}:${update.entityId}`;
    broadcastFn(channel, update);
    // Also broadcast to entity type channel
    broadcastFn(`status:${update.entityType}:all`, update);
};
exports.broadcastStatusUpdate = broadcastStatusUpdate;
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
const createStatusUpdateRecord = async (update, sequelize) => {
    const [record] = await sequelize.query(`
    INSERT INTO status_update_history
    (entity_id, entity_type, previous_status, current_status, timestamp, user_id, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `, {
        replacements: [
            update.entityId,
            update.entityType,
            update.previousStatus,
            update.currentStatus,
            update.timestamp,
            update.userId,
            update.reason,
        ],
        type: sequelize_1.Sequelize.QueryTypes.INSERT,
    });
    return record;
};
exports.createStatusUpdateRecord = createStatusUpdateRecord;
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
const getStatusUpdateTimeline = async (entityId, entityType, limit, sequelize) => {
    const timeline = await sequelize.query(`
    SELECT * FROM status_update_history
    WHERE entity_id = ? AND entity_type = ?
    ORDER BY timestamp DESC
    LIMIT ?
    `, {
        replacements: [entityId, entityType, limit],
        type: sequelize_1.Sequelize.QueryTypes.SELECT,
    });
    return timeline;
};
exports.getStatusUpdateTimeline = getStatusUpdateTimeline;
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
const aggregateStatusStatistics = async (entityType, startTime, endTime, sequelize) => {
    const results = await sequelize.query(`
    SELECT current_status, COUNT(*) as count
    FROM status_update_history
    WHERE entity_type = ?
      AND timestamp BETWEEN ? AND ?
    GROUP BY current_status
    `, {
        replacements: [entityType, startTime, endTime],
        type: sequelize_1.Sequelize.QueryTypes.SELECT,
    });
    const stats = {};
    results.forEach((row) => {
        stats[row.current_status] = parseInt(row.count);
    });
    return stats;
};
exports.aggregateStatusStatistics = aggregateStatusStatistics;
// ============================================================================
// EVENT NOTIFICATIONS (23-26)
// ============================================================================
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
const publishEventNotification = async (event, broadcastFn) => {
    // Broadcast to severity channel
    broadcastFn(`events:severity:${event.severity}`, event);
    // Broadcast to type channel
    broadcastFn(`events:type:${event.type}`, event);
    // Broadcast to specific recipients
    event.recipients.forEach(recipient => {
        broadcastFn(`events:recipient:${recipient}`, event);
    });
};
exports.publishEventNotification = publishEventNotification;
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
const filterEventsBySeverity = (events, severities, types) => {
    return events.filter(event => severities.includes(event.severity) && types.includes(event.type));
};
exports.filterEventsBySeverity = filterEventsBySeverity;
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
const createEventDigest = (events, periodMinutes) => {
    const cutoffTime = new Date(Date.now() - periodMinutes * 60000);
    const recentEvents = events.filter(e => e.timestamp >= cutoffTime);
    const bySeverity = {};
    const byType = {};
    recentEvents.forEach(event => {
        bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1;
        byType[event.type] = (byType[event.type] || 0) + 1;
    });
    return {
        total: recentEvents.length,
        periodMinutes,
        bySeverity,
        byType,
        latestEvent: recentEvents[recentEvents.length - 1],
    };
};
exports.createEventDigest = createEventDigest;
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
const prioritizeEventNotifications = (events) => {
    const severityOrder = {
        critical: 4,
        error: 3,
        warning: 2,
        info: 1,
    };
    return [...events].sort((a, b) => {
        const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
        if (severityDiff !== 0)
            return severityDiff;
        // If same severity, sort by timestamp (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime();
    });
};
exports.prioritizeEventNotifications = prioritizeEventNotifications;
// ============================================================================
// METRICS STREAMING (27-30)
// ============================================================================
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
const publishMetricSnapshot = async (metric, broadcastFn) => {
    const channel = `metrics:${metric.metricType}`;
    broadcastFn(channel, metric);
};
exports.publishMetricSnapshot = publishMetricSnapshot;
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
const aggregateMetricsWindow = (metrics, config) => {
    const windowStart = new Date(Date.now() - config.windowSize);
    const recentMetrics = metrics.filter(m => m.timestamp >= windowStart);
    if (config.groupBy && config.groupBy.length > 0) {
        const grouped = {};
        recentMetrics.forEach(metric => {
            const groupKey = config.groupBy
                .map(label => metric.labels[label])
                .join(':');
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(metric.value);
        });
        const result = {};
        Object.entries(grouped).forEach(([key, values]) => {
            result[key] = applyAggregation(values, config.aggregationType);
        });
        return result;
    }
    else {
        const values = recentMetrics.map(m => m.value);
        return {
            total: applyAggregation(values, config.aggregationType),
        };
    }
};
exports.aggregateMetricsWindow = aggregateMetricsWindow;
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
const createMetricsTimeSeries = (metrics, intervalSeconds) => {
    const buckets = {};
    metrics.forEach(metric => {
        const bucketTime = Math.floor(metric.timestamp.getTime() / 1000 / intervalSeconds) * intervalSeconds;
        if (!buckets[bucketTime]) {
            buckets[bucketTime] = [];
        }
        buckets[bucketTime].push(metric.value);
    });
    return Object.entries(buckets)
        .map(([timestamp, values]) => ({
        timestamp: new Date(parseInt(timestamp) * 1000),
        value: values.reduce((sum, val) => sum + val, 0) / values.length,
    }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};
exports.createMetricsTimeSeries = createMetricsTimeSeries;
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
const detectMetricAnomalies = (metrics, threshold, direction) => {
    return metrics.filter(metric => {
        if (direction === 'above') {
            return metric.value > threshold;
        }
        else if (direction === 'below') {
            return metric.value < threshold;
        }
        else {
            // For 'both', calculate deviation from mean
            const values = metrics.map(m => m.value);
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            return Math.abs(metric.value - mean) > threshold;
        }
    });
};
exports.detectMetricAnomalies = detectMetricAnomalies;
// ============================================================================
// MAP OVERLAY MANAGEMENT (31-34)
// ============================================================================
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
const createMapOverlay = async (overlay, broadcastFn) => {
    broadcastFn('map:overlay:create', overlay);
};
exports.createMapOverlay = createMapOverlay;
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
const updateMapOverlay = async (overlayId, updates, broadcastFn) => {
    broadcastFn('map:overlay:update', { overlayId, updates });
};
exports.updateMapOverlay = updateMapOverlay;
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
const removeMapOverlay = async (overlayId, broadcastFn) => {
    broadcastFn('map:overlay:remove', { overlayId });
};
exports.removeMapOverlay = removeMapOverlay;
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
const generateIncidentHeatmap = (incidents, radiusMeters) => {
    const heatmapData = incidents.map(incident => ({
        lat: incident.location.latitude,
        lng: incident.location.longitude,
        weight: incident.priority === 'critical' ? 4 : incident.priority === 'high' ? 3 : incident.priority === 'medium' ? 2 : 1,
    }));
    return {
        overlayId: `heatmap_${Date.now()}`,
        type: 'heatmap',
        data: heatmapData,
        style: {
            radius: radiusMeters,
            gradient: ['rgba(0,0,255,0)', 'blue', 'yellow', 'orange', 'red'],
            opacity: 0.6,
        },
        visibility: true,
        zIndex: 100,
        updateFrequency: 60000,
    };
};
exports.generateIncidentHeatmap = generateIncidentHeatmap;
// ============================================================================
// VIDEO FEED INTEGRATION (35-38)
// ============================================================================
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
const registerVideoFeed = async (feed, sequelize) => {
    const [record] = await sequelize.query(`
    INSERT INTO video_feeds
    (feed_id, stream_url, protocol, resolution, frame_rate, location, active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `, {
        replacements: [
            feed.feedId,
            feed.streamUrl,
            feed.protocol,
            feed.resolution,
            feed.frameRate,
            JSON.stringify(feed.location),
            feed.active,
        ],
        type: sequelize_1.Sequelize.QueryTypes.INSERT,
    });
    return record;
};
exports.registerVideoFeed = registerVideoFeed;
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
const getActiveVideoFeeds = async (centerPoint, radiusKm, sequelize) => {
    if (!sequelize)
        return [];
    const feeds = await sequelize.query(`SELECT * FROM video_feeds WHERE active = true`, { type: sequelize_1.Sequelize.QueryTypes.SELECT });
    if (centerPoint && radiusKm) {
        return feeds.filter((feed) => {
            if (!feed.location)
                return false;
            const distance = calculateDistance(centerPoint.latitude, centerPoint.longitude, feed.location.latitude, feed.location.longitude);
            return distance <= radiusKm;
        });
    }
    return feeds;
};
exports.getActiveVideoFeeds = getActiveVideoFeeds;
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
const updateVideoFeedStatus = async (feedId, active, sequelize) => {
    const [result] = await sequelize.query(`UPDATE video_feeds SET active = ? WHERE feed_id = ?`, {
        replacements: [active, feedId],
        type: sequelize_1.Sequelize.QueryTypes.UPDATE,
    });
    return result > 0;
};
exports.updateVideoFeedStatus = updateVideoFeedStatus;
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
const createVideoSnapshot = async (feedId, timestamp, snapshotUrl, sequelize) => {
    const [record] = await sequelize.query(`
    INSERT INTO video_snapshots (feed_id, timestamp, snapshot_url)
    VALUES (?, ?, ?)
    RETURNING *
    `, {
        replacements: [feedId, timestamp, snapshotUrl],
        type: sequelize_1.Sequelize.QueryTypes.INSERT,
    });
    return record;
};
exports.createVideoSnapshot = createVideoSnapshot;
// ============================================================================
// SENSOR DATA INGESTION (39-42)
// ============================================================================
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
const ingestSensorData = async (sensorData, broadcastFn) => {
    // Check for threshold violations
    const alerts = (0, exports.checkSensorThresholds)(sensorData);
    // Broadcast sensor data
    broadcastFn(`sensors:${sensorData.sensorId}`, sensorData);
    broadcastFn(`sensors:type:${sensorData.sensorType}`, sensorData);
    // Broadcast alerts if any thresholds exceeded
    if (alerts.length > 0) {
        alerts.forEach(alert => {
            broadcastFn('sensors:alerts', alert);
        });
    }
};
exports.ingestSensorData = ingestSensorData;
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
const checkSensorThresholds = (sensorData) => {
    const alerts = [];
    if (!sensorData.alertThresholds)
        return alerts;
    sensorData.readings.forEach(reading => {
        const threshold = sensorData.alertThresholds[reading.parameter];
        if (!threshold)
            return;
        if (threshold.max !== undefined && reading.value > threshold.max) {
            alerts.push({
                sensorId: sensorData.sensorId,
                parameter: reading.parameter,
                value: reading.value,
                threshold: threshold.max,
                violation: 'exceeds_max',
                timestamp: reading.timestamp,
            });
        }
        if (threshold.min !== undefined && reading.value < threshold.min) {
            alerts.push({
                sensorId: sensorData.sensorId,
                parameter: reading.parameter,
                value: reading.value,
                threshold: threshold.min,
                violation: 'below_min',
                timestamp: reading.timestamp,
            });
        }
    });
    return alerts;
};
exports.checkSensorThresholds = checkSensorThresholds;
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
const aggregateSensorData = (sensorDataArray, windowMinutes) => {
    const cutoffTime = new Date(Date.now() - windowMinutes * 60000);
    const recentData = sensorDataArray.filter(data => data.readings.some(r => r.timestamp >= cutoffTime));
    const aggregated = {};
    recentData.forEach(data => {
        data.readings.forEach(reading => {
            if (reading.timestamp < cutoffTime)
                return;
            if (!aggregated[reading.parameter]) {
                aggregated[reading.parameter] = {
                    values: [],
                    unit: reading.unit,
                };
            }
            aggregated[reading.parameter].values.push(reading.value);
        });
    });
    // Calculate statistics
    Object.keys(aggregated).forEach(param => {
        const values = aggregated[param].values;
        aggregated[param].avg =
            values.reduce((sum, v) => sum + v, 0) / values.length;
        aggregated[param].min = Math.min(...values);
        aggregated[param].max = Math.max(...values);
        aggregated[param].count = values.length;
        delete aggregated[param].values;
    });
    return aggregated;
};
exports.aggregateSensorData = aggregateSensorData;
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
const detectSensorAnomalies = (historicalData, currentReading, standardDeviations = 2) => {
    const allValues = {};
    // Collect historical values
    historicalData.forEach(data => {
        data.readings.forEach(reading => {
            if (!allValues[reading.parameter]) {
                allValues[reading.parameter] = [];
            }
            allValues[reading.parameter].push(reading.value);
        });
    });
    // Check current reading against historical statistics
    for (const reading of currentReading.readings) {
        const values = allValues[reading.parameter];
        if (!values || values.length < 10)
            continue; // Need sufficient history
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const deviation = Math.abs(reading.value - mean);
        if (deviation > stdDev * standardDeviations) {
            return true;
        }
    }
    return false;
};
exports.detectSensorAnomalies = detectSensorAnomalies;
// ============================================================================
// STREAM MANAGEMENT & BACKPRESSURE (43-45)
// ============================================================================
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
const handleStreamBackpressure = (buffer, config) => {
    if (buffer.length <= config.maxBufferSize) {
        if (buffer.length >= config.warningThreshold) {
            console.warn(`Stream buffer at ${buffer.length}/${config.maxBufferSize} (warning threshold: ${config.warningThreshold})`);
        }
        return buffer;
    }
    const excess = buffer.length - config.maxBufferSize;
    switch (config.dropStrategy) {
        case 'oldest':
            return buffer.slice(excess);
        case 'newest':
            return buffer.slice(0, config.maxBufferSize);
        case 'random': {
            const kept = [...buffer];
            for (let i = 0; i < excess; i++) {
                const randomIndex = Math.floor(Math.random() * kept.length);
                kept.splice(randomIndex, 1);
            }
            return kept;
        }
        default:
            return buffer.slice(excess);
    }
};
exports.handleStreamBackpressure = handleStreamBackpressure;
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
const compressStreamData = (data, compressionType) => {
    switch (compressionType) {
        case 'delta':
            // Send only changed fields (assumes previous state is known)
            return { type: 'delta', changes: data };
        case 'sampling':
            // Sample data points if array
            if (Array.isArray(data) && data.length > 100) {
                const step = Math.ceil(data.length / 100);
                return data.filter((_, i) => i % step === 0);
            }
            return data;
        case 'gzip':
            // In production, use actual gzip compression
            return { type: 'gzip', data: JSON.stringify(data) };
        default:
            return data;
    }
};
exports.compressStreamData = compressStreamData;
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
const reconnectWithBackoff = async (connectFn, maxRetries, baseDelayMs) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const connection = await connectFn();
            console.log('Connection established successfully');
            return connection;
        }
        catch (error) {
            retries++;
            const delay = baseDelayMs * Math.pow(2, retries - 1);
            console.log(`Connection failed (attempt ${retries}/${maxRetries}). Retrying in ${delay}ms...`);
            if (retries >= maxRetries) {
                throw new Error(`Failed to connect after ${maxRetries} attempts: ${error.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Reconnection failed');
};
exports.reconnectWithBackoff = reconnectWithBackoff;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Calculates distance between two geographic coordinates (Haversine formula).
 *
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
/**
 * Applies aggregation function to values.
 *
 * @param {number[]} values - Values to aggregate
 * @param {string} aggregationType - Aggregation type
 * @returns {number} Aggregated value
 */
const applyAggregation = (values, aggregationType) => {
    if (values.length === 0)
        return 0;
    switch (aggregationType) {
        case 'sum':
            return values.reduce((sum, val) => sum + val, 0);
        case 'avg':
            return values.reduce((sum, val) => sum + val, 0) / values.length;
        case 'min':
            return Math.min(...values);
        case 'max':
            return Math.max(...values);
        case 'count':
            return values.length;
        default:
            return 0;
    }
};
exports.default = {
    // Sequelize Models
    createWebSocketConnectionModel: exports.createWebSocketConnectionModel,
    createIncidentStreamModel: exports.createIncidentStreamModel,
    createUnitLocationModel: exports.createUnitLocationModel,
    // WebSocket Connection Management
    registerWebSocketConnection: exports.registerWebSocketConnection,
    updateConnectionHeartbeat: exports.updateConnectionHeartbeat,
    detectStaleConnections: exports.detectStaleConnections,
    subscribeToStream: exports.subscribeToStream,
    unsubscribeFromStream: exports.unsubscribeFromStream,
    // Incident Streaming
    publishIncidentUpdate: exports.publishIncidentUpdate,
    getIncidentStream: exports.getIncidentStream,
    markIncidentsAsBroadcasted: exports.markIncidentsAsBroadcasted,
    getPendingIncidentBroadcasts: exports.getPendingIncidentBroadcasts,
    filterIncidentsByLocation: exports.filterIncidentsByLocation,
    // Unit Location Tracking
    publishUnitLocationUpdate: exports.publishUnitLocationUpdate,
    getLatestUnitLocations: exports.getLatestUnitLocations,
    getUnitLocationHistory: exports.getUnitLocationHistory,
    findUnitsInArea: exports.findUnitsInArea,
    calculateUnitETA: exports.calculateUnitETA,
    // Status Update Streaming
    broadcastStatusUpdate: exports.broadcastStatusUpdate,
    createStatusUpdateRecord: exports.createStatusUpdateRecord,
    getStatusUpdateTimeline: exports.getStatusUpdateTimeline,
    aggregateStatusStatistics: exports.aggregateStatusStatistics,
    // Event Notifications
    publishEventNotification: exports.publishEventNotification,
    filterEventsBySeverity: exports.filterEventsBySeverity,
    createEventDigest: exports.createEventDigest,
    prioritizeEventNotifications: exports.prioritizeEventNotifications,
    // Metrics Streaming
    publishMetricSnapshot: exports.publishMetricSnapshot,
    aggregateMetricsWindow: exports.aggregateMetricsWindow,
    createMetricsTimeSeries: exports.createMetricsTimeSeries,
    detectMetricAnomalies: exports.detectMetricAnomalies,
    // Map Overlay Management
    createMapOverlay: exports.createMapOverlay,
    updateMapOverlay: exports.updateMapOverlay,
    removeMapOverlay: exports.removeMapOverlay,
    generateIncidentHeatmap: exports.generateIncidentHeatmap,
    // Video Feed Integration
    registerVideoFeed: exports.registerVideoFeed,
    getActiveVideoFeeds: exports.getActiveVideoFeeds,
    updateVideoFeedStatus: exports.updateVideoFeedStatus,
    createVideoSnapshot: exports.createVideoSnapshot,
    // Sensor Data Ingestion
    ingestSensorData: exports.ingestSensorData,
    checkSensorThresholds: exports.checkSensorThresholds,
    aggregateSensorData: exports.aggregateSensorData,
    detectSensorAnomalies: exports.detectSensorAnomalies,
    // Stream Management & Backpressure
    handleStreamBackpressure: exports.handleStreamBackpressure,
    compressStreamData: exports.compressStreamData,
    reconnectWithBackoff: exports.reconnectWithBackoff,
};
//# sourceMappingURL=real-time-monitoring-api.js.map