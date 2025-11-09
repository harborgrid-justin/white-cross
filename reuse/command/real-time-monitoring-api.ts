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

/**
 * File: /reuse/command/real-time-monitoring-api.ts
 * Locator: WC-CMD-RTMON-001
 * Purpose: Comprehensive Real-Time Monitoring API - WebSocket streams, live dashboards, event feeds, metrics, map overlays
 *
 * Upstream: Independent utility module for real-time monitoring API implementation
 * Downstream: ../backend/*, WebSocket services, dashboard controllers, monitoring microservices
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Socket.IO 4.x, Sequelize 6.x
 * Exports: 45+ utility functions for real-time monitoring, live feeds, WebSocket management, event streaming, metrics
 *
 * LLM Context: Production-ready real-time monitoring API utilities for command and control systems.
 * Provides WebSocket connection management, live incident streaming, unit location tracking, status updates,
 * event notifications, metrics streaming, map overlays, video feed integration, and sensor data ingestion.
 * Essential for emergency response, security operations, and real-time situational awareness.
 */

import { Request, Response, NextFunction } from 'express';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WebSocketConnection {
  id: string;
  userId: string;
  connectionTime: Date;
  lastHeartbeat: Date;
  subscriptions: string[];
  metadata: Record<string, any>;
}

interface StreamSubscription {
  streamId: string;
  streamType: 'incident' | 'location' | 'status' | 'event' | 'metrics' | 'video' | 'sensor';
  filters?: Record<string, any>;
  userId: string;
  subscribedAt: Date;
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
  alertThresholds?: Record<string, { min?: number; max?: number }>;
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

interface HeartbeatConfig {
  interval: number;
  timeout: number;
  maxMissed: number;
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
export const createWebSocketConnectionModel = (sequelize: Sequelize) => {
  class WSConnection extends Model {
    public id!: string;
    public userId!: string;
    public connectionTime!: Date;
    public lastHeartbeat!: Date;
    public subscriptions!: string[];
    public metadata!: Record<string, any>;
    public active!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WSConnection.init(
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        comment: 'Unique WebSocket connection ID',
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User ID associated with connection',
      },
      connectionTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Connection establishment time',
      },
      lastHeartbeat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Last heartbeat timestamp',
      },
      subscriptions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of stream subscriptions',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Connection metadata (device, IP, etc.)',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether connection is active',
      },
    },
    {
      sequelize,
      tableName: 'websocket_connections',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['active'] },
        { fields: ['lastHeartbeat'] },
      ],
    },
  );

  return WSConnection;
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
export const createIncidentStreamModel = (sequelize: Sequelize) => {
  class IncidentStreamModel extends Model {
    public id!: number;
    public incidentId!: string;
    public type!: string;
    public priority!: string;
    public status!: string;
    public location!: LocationData;
    public timestamp!: Date;
    public metadata!: Record<string, any>;
    public broadcasted!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  IncidentStreamModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      incidentId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Incident identifier',
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Incident type',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Incident priority level',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Current incident status',
      },
      location: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Incident location data',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Event timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional incident metadata',
      },
      broadcasted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether event was broadcasted',
      },
    },
    {
      sequelize,
      tableName: 'incident_streams',
      timestamps: true,
      indexes: [
        { fields: ['incidentId'] },
        { fields: ['priority', 'status'] },
        { fields: ['timestamp'] },
        { fields: ['broadcasted'] },
      ],
    },
  );

  return IncidentStreamModel;
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
export const createUnitLocationModel = (sequelize: Sequelize) => {
  class UnitLocationLog extends Model {
    public id!: number;
    public unitId!: string;
    public location!: LocationData;
    public status!: string;
    public assignedIncident!: string | null;
    public updateType!: string;
    public timestamp!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  UnitLocationLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unitId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Unit identifier',
      },
      location: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'GPS location data',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Current unit status',
      },
      assignedIncident: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Assigned incident ID',
      },
      updateType: {
        type: DataTypes.ENUM('gps', 'manual', 'beacon'),
        allowNull: false,
        defaultValue: 'gps',
        comment: 'Type of location update',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Update timestamp',
      },
    },
    {
      sequelize,
      tableName: 'unit_location_logs',
      timestamps: true,
      indexes: [
        { fields: ['unitId'] },
        { fields: ['timestamp'] },
        { fields: ['assignedIncident'] },
        { fields: ['status'] },
      ],
    },
  );

  return UnitLocationLog;
};

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
export const registerWebSocketConnection = async (
  connectionId: string,
  userId: string,
  metadata: Record<string, any>,
  ConnectionModel: any,
): Promise<WebSocketConnection> => {
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
export const updateConnectionHeartbeat = async (
  connectionId: string,
  ConnectionModel: any,
): Promise<boolean> => {
  const [updated] = await ConnectionModel.update(
    { lastHeartbeat: new Date() },
    {
      where: {
        id: connectionId,
        active: true,
      },
    },
  );

  return updated > 0;
};

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
export const detectStaleConnections = async (
  timeoutSeconds: number,
  ConnectionModel: any,
): Promise<string[]> => {
  const cutoffTime = new Date(Date.now() - timeoutSeconds * 1000);

  const staleConnections = await ConnectionModel.findAll({
    where: {
      lastHeartbeat: {
        [Op.lt]: cutoffTime,
      },
      active: true,
    },
    attributes: ['id'],
  });

  // Mark as inactive
  await ConnectionModel.update(
    { active: false },
    {
      where: {
        id: {
          [Op.in]: staleConnections.map((c: any) => c.id),
        },
      },
    },
  );

  return staleConnections.map((c: any) => c.id);
};

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
export const subscribeToStream = async (
  connectionId: string,
  streamId: string,
  ConnectionModel: any,
): Promise<boolean> => {
  const connection = await ConnectionModel.findByPk(connectionId);
  if (!connection) return false;

  const subscriptions = connection.subscriptions || [];
  if (!subscriptions.includes(streamId)) {
    subscriptions.push(streamId);
    await connection.update({ subscriptions });
  }

  return true;
};

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
export const unsubscribeFromStream = async (
  connectionId: string,
  streamId: string,
  ConnectionModel: any,
): Promise<boolean> => {
  const connection = await ConnectionModel.findByPk(connectionId);
  if (!connection) return false;

  const subscriptions = (connection.subscriptions || []).filter(
    (sub: string) => sub !== streamId,
  );
  await connection.update({ subscriptions });

  return true;
};

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
export const publishIncidentUpdate = async (
  incident: IncidentStream,
  IncidentModel: any,
): Promise<any> => {
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
export const getIncidentStream = async (
  filters: RealtimeFilter,
  limit: number,
  IncidentModel: any,
): Promise<IncidentStream[]> => {
  const whereClause: any = {};

  if (filters.priorities && filters.priorities.length > 0) {
    whereClause.priority = { [Op.in]: filters.priorities };
  }

  if (filters.statuses && filters.statuses.length > 0) {
    whereClause.status = { [Op.in]: filters.statuses };
  }

  if (filters.timeRange) {
    whereClause.timestamp = {
      [Op.between]: [filters.timeRange.start, filters.timeRange.end],
    };
  }

  const incidents = await IncidentModel.findAll({
    where: whereClause,
    order: [['timestamp', 'DESC']],
    limit,
  });

  return incidents.map((i: any) => i.toJSON());
};

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
export const markIncidentsAsBroadcasted = async (
  eventIds: string[],
  IncidentModel: any,
): Promise<number> => {
  const [updated] = await IncidentModel.update(
    { broadcasted: true },
    {
      where: {
        id: { [Op.in]: eventIds },
      },
    },
  );

  return updated;
};

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
export const getPendingIncidentBroadcasts = async (
  limit: number,
  IncidentModel: any,
): Promise<IncidentStream[]> => {
  const pending = await IncidentModel.findAll({
    where: {
      broadcasted: false,
    },
    order: [['timestamp', 'ASC']],
    limit,
  });

  return pending.map((i: any) => i.toJSON());
};

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
export const filterIncidentsByLocation = (
  incidents: IncidentStream[],
  centerPoint: LocationData,
  radiusKm: number,
): IncidentStream[] => {
  return incidents.filter(incident => {
    const distance = calculateDistance(
      centerPoint.latitude,
      centerPoint.longitude,
      incident.location.latitude,
      incident.location.longitude,
    );
    return distance <= radiusKm;
  });
};

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
export const publishUnitLocationUpdate = async (
  update: UnitLocationUpdate,
  LocationModel: any,
): Promise<any> => {
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
export const getLatestUnitLocations = async (
  unitIds: string[],
  LocationModel: any,
): Promise<Record<string, UnitLocationUpdate>> => {
  const latestLocations: Record<string, UnitLocationUpdate> = {};

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
export const getUnitLocationHistory = async (
  unitId: string,
  startTime: Date,
  endTime: Date,
  LocationModel: any,
): Promise<UnitLocationUpdate[]> => {
  const history = await LocationModel.findAll({
    where: {
      unitId,
      timestamp: {
        [Op.between]: [startTime, endTime],
      },
    },
    order: [['timestamp', 'ASC']],
  });

  return history.map((h: any) => h.toJSON());
};

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
export const findUnitsInArea = async (
  centerPoint: LocationData,
  radiusKm: number,
  LocationModel: any,
): Promise<Array<{ unitId: string; location: LocationData; distance: number }>> => {
  // Get latest location for all units
  const latestLocations = await LocationModel.sequelize.query(
    `
    SELECT DISTINCT ON (unit_id)
      unit_id, location, status, timestamp
    FROM unit_location_logs
    ORDER BY unit_id, timestamp DESC
    `,
    { type: Sequelize.QueryTypes.SELECT },
  );

  const nearbyUnits = latestLocations
    .map((record: any) => {
      const distance = calculateDistance(
        centerPoint.latitude,
        centerPoint.longitude,
        record.location.latitude,
        record.location.longitude,
      );

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
export const calculateUnitETA = (
  unitLocation: UnitLocationUpdate,
  destination: LocationData,
  averageSpeedKmh = 60,
): number => {
  const distanceKm = calculateDistance(
    unitLocation.location.latitude,
    unitLocation.location.longitude,
    destination.latitude,
    destination.longitude,
  );

  const timeHours = distanceKm / averageSpeedKmh;
  return Math.round(timeHours * 3600); // Convert to seconds
};

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
export const broadcastStatusUpdate = async (
  update: StatusUpdate,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  const channel = `status:${update.entityType}:${update.entityId}`;
  broadcastFn(channel, update);

  // Also broadcast to entity type channel
  broadcastFn(`status:${update.entityType}:all`, update);
};

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
export const createStatusUpdateRecord = async (
  update: StatusUpdate,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO status_update_history
    (entity_id, entity_type, previous_status, current_status, timestamp, user_id, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [
        update.entityId,
        update.entityType,
        update.previousStatus,
        update.currentStatus,
        update.timestamp,
        update.userId,
        update.reason,
      ],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

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
export const getStatusUpdateTimeline = async (
  entityId: string,
  entityType: string,
  limit: number,
  sequelize: Sequelize,
): Promise<StatusUpdate[]> => {
  const timeline = await sequelize.query(
    `
    SELECT * FROM status_update_history
    WHERE entity_id = ? AND entity_type = ?
    ORDER BY timestamp DESC
    LIMIT ?
    `,
    {
      replacements: [entityId, entityType, limit],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  return timeline as StatusUpdate[];
};

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
export const aggregateStatusStatistics = async (
  entityType: string,
  startTime: Date,
  endTime: Date,
  sequelize: Sequelize,
): Promise<Record<string, number>> => {
  const results = await sequelize.query(
    `
    SELECT current_status, COUNT(*) as count
    FROM status_update_history
    WHERE entity_type = ?
      AND timestamp BETWEEN ? AND ?
    GROUP BY current_status
    `,
    {
      replacements: [entityType, startTime, endTime],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const stats: Record<string, number> = {};
  results.forEach((row: any) => {
    stats[row.current_status] = parseInt(row.count);
  });

  return stats;
};

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
export const publishEventNotification = async (
  event: EventNotification,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  // Broadcast to severity channel
  broadcastFn(`events:severity:${event.severity}`, event);

  // Broadcast to type channel
  broadcastFn(`events:type:${event.type}`, event);

  // Broadcast to specific recipients
  event.recipients.forEach(recipient => {
    broadcastFn(`events:recipient:${recipient}`, event);
  });
};

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
export const filterEventsBySeverity = (
  events: EventNotification[],
  severities: string[],
  types: string[],
): EventNotification[] => {
  return events.filter(
    event =>
      severities.includes(event.severity) && types.includes(event.type),
  );
};

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
export const createEventDigest = (
  events: EventNotification[],
  periodMinutes: number,
): Record<string, any> => {
  const cutoffTime = new Date(Date.now() - periodMinutes * 60000);
  const recentEvents = events.filter(e => e.timestamp >= cutoffTime);

  const bySeverity: Record<string, number> = {};
  const byType: Record<string, number> = {};

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
export const prioritizeEventNotifications = (
  events: EventNotification[],
): EventNotification[] => {
  const severityOrder: Record<string, number> = {
    critical: 4,
    error: 3,
    warning: 2,
    info: 1,
  };

  return [...events].sort((a, b) => {
    const severityDiff =
      (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    if (severityDiff !== 0) return severityDiff;

    // If same severity, sort by timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
};

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
export const publishMetricSnapshot = async (
  metric: MetricsSnapshot,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  const channel = `metrics:${metric.metricType}`;
  broadcastFn(channel, metric);
};

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
export const aggregateMetricsWindow = (
  metrics: MetricsSnapshot[],
  config: StreamAggregation,
): Record<string, number> => {
  const windowStart = new Date(Date.now() - config.windowSize);
  const recentMetrics = metrics.filter(m => m.timestamp >= windowStart);

  if (config.groupBy && config.groupBy.length > 0) {
    const grouped: Record<string, number[]> = {};

    recentMetrics.forEach(metric => {
      const groupKey = config.groupBy!
        .map(label => metric.labels[label])
        .join(':');

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(metric.value);
    });

    const result: Record<string, number> = {};
    Object.entries(grouped).forEach(([key, values]) => {
      result[key] = applyAggregation(values, config.aggregationType);
    });

    return result;
  } else {
    const values = recentMetrics.map(m => m.value);
    return {
      total: applyAggregation(values, config.aggregationType),
    };
  }
};

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
export const createMetricsTimeSeries = (
  metrics: MetricsSnapshot[],
  intervalSeconds: number,
): Array<{ timestamp: Date; value: number }> => {
  const buckets: Record<number, number[]> = {};

  metrics.forEach(metric => {
    const bucketTime = Math.floor(
      metric.timestamp.getTime() / 1000 / intervalSeconds,
    ) * intervalSeconds;

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
export const detectMetricAnomalies = (
  metrics: MetricsSnapshot[],
  threshold: number,
  direction: 'above' | 'below' | 'both',
): MetricsSnapshot[] => {
  return metrics.filter(metric => {
    if (direction === 'above') {
      return metric.value > threshold;
    } else if (direction === 'below') {
      return metric.value < threshold;
    } else {
      // For 'both', calculate deviation from mean
      const values = metrics.map(m => m.value);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      return Math.abs(metric.value - mean) > threshold;
    }
  });
};

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
export const createMapOverlay = async (
  overlay: MapOverlay,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  broadcastFn('map:overlay:create', overlay);
};

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
export const updateMapOverlay = async (
  overlayId: string,
  updates: Partial<MapOverlay>,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  broadcastFn('map:overlay:update', { overlayId, updates });
};

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
export const removeMapOverlay = async (
  overlayId: string,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  broadcastFn('map:overlay:remove', { overlayId });
};

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
export const generateIncidentHeatmap = (
  incidents: IncidentStream[],
  radiusMeters: number,
): MapOverlay => {
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
export const registerVideoFeed = async (
  feed: VideoFeedConfig,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO video_feeds
    (feed_id, stream_url, protocol, resolution, frame_rate, location, active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [
        feed.feedId,
        feed.streamUrl,
        feed.protocol,
        feed.resolution,
        feed.frameRate,
        JSON.stringify(feed.location),
        feed.active,
      ],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

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
export const getActiveVideoFeeds = async (
  centerPoint?: LocationData,
  radiusKm?: number,
  sequelize?: Sequelize,
): Promise<VideoFeedConfig[]> => {
  if (!sequelize) return [];

  const feeds = await sequelize.query(
    `SELECT * FROM video_feeds WHERE active = true`,
    { type: Sequelize.QueryTypes.SELECT },
  );

  if (centerPoint && radiusKm) {
    return feeds.filter((feed: any) => {
      if (!feed.location) return false;
      const distance = calculateDistance(
        centerPoint.latitude,
        centerPoint.longitude,
        feed.location.latitude,
        feed.location.longitude,
      );
      return distance <= radiusKm;
    }) as VideoFeedConfig[];
  }

  return feeds as VideoFeedConfig[];
};

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
export const updateVideoFeedStatus = async (
  feedId: string,
  active: boolean,
  sequelize: Sequelize,
): Promise<boolean> => {
  const [result] = await sequelize.query(
    `UPDATE video_feeds SET active = ? WHERE feed_id = ?`,
    {
      replacements: [active, feedId],
      type: Sequelize.QueryTypes.UPDATE,
    },
  );

  return result > 0;
};

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
export const createVideoSnapshot = async (
  feedId: string,
  timestamp: Date,
  snapshotUrl: string,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO video_snapshots (feed_id, timestamp, snapshot_url)
    VALUES (?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [feedId, timestamp, snapshotUrl],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

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
export const ingestSensorData = async (
  sensorData: SensorData,
  broadcastFn: (channel: string, data: any) => void,
): Promise<void> => {
  // Check for threshold violations
  const alerts = checkSensorThresholds(sensorData);

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
export const checkSensorThresholds = (sensorData: SensorData): Array<any> => {
  const alerts: Array<any> = [];

  if (!sensorData.alertThresholds) return alerts;

  sensorData.readings.forEach(reading => {
    const threshold = sensorData.alertThresholds![reading.parameter];
    if (!threshold) return;

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
export const aggregateSensorData = (
  sensorDataArray: SensorData[],
  windowMinutes: number,
): Record<string, any> => {
  const cutoffTime = new Date(Date.now() - windowMinutes * 60000);
  const recentData = sensorDataArray.filter(data =>
    data.readings.some(r => r.timestamp >= cutoffTime),
  );

  const aggregated: Record<string, any> = {};

  recentData.forEach(data => {
    data.readings.forEach(reading => {
      if (reading.timestamp < cutoffTime) return;

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
      values.reduce((sum: number, v: number) => sum + v, 0) / values.length;
    aggregated[param].min = Math.min(...values);
    aggregated[param].max = Math.max(...values);
    aggregated[param].count = values.length;
    delete aggregated[param].values;
  });

  return aggregated;
};

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
export const detectSensorAnomalies = (
  historicalData: SensorData[],
  currentReading: SensorData,
  standardDeviations = 2,
): boolean => {
  const allValues: Record<string, number[]> = {};

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
    if (!values || values.length < 10) continue; // Need sufficient history

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const deviation = Math.abs(reading.value - mean);
    if (deviation > stdDev * standardDeviations) {
      return true;
    }
  }

  return false;
};

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
export const handleStreamBackpressure = (
  buffer: any[],
  config: BackpressureConfig,
): any[] => {
  if (buffer.length <= config.maxBufferSize) {
    if (buffer.length >= config.warningThreshold) {
      console.warn(
        `Stream buffer at ${buffer.length}/${config.maxBufferSize} (warning threshold: ${config.warningThreshold})`,
      );
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
export const compressStreamData = (
  data: any,
  compressionType: string,
): any => {
  switch (compressionType) {
    case 'delta':
      // Send only changed fields (assumes previous state is known)
      return { type: 'delta', changes: data };

    case 'sampling':
      // Sample data points if array
      if (Array.isArray(data) && data.length > 100) {
        const step = Math.ceil(data.length / 100);
        return data.filter((_: any, i: number) => i % step === 0);
      }
      return data;

    case 'gzip':
      // In production, use actual gzip compression
      return { type: 'gzip', data: JSON.stringify(data) };

    default:
      return data;
  }
};

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
export const reconnectWithBackoff = async (
  connectFn: () => Promise<any>,
  maxRetries: number,
  baseDelayMs: number,
): Promise<any> => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const connection = await connectFn();
      console.log('Connection established successfully');
      return connection;
    } catch (error: any) {
      retries++;
      const delay = baseDelayMs * Math.pow(2, retries - 1);

      console.log(
        `Connection failed (attempt ${retries}/${maxRetries}). Retrying in ${delay}ms...`,
      );

      if (retries >= maxRetries) {
        throw new Error(
          `Failed to connect after ${maxRetries} attempts: ${error.message}`,
        );
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Reconnection failed');
};

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
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
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
const applyAggregation = (
  values: number[],
  aggregationType: string,
): number => {
  if (values.length === 0) return 0;

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

export default {
  // Sequelize Models
  createWebSocketConnectionModel,
  createIncidentStreamModel,
  createUnitLocationModel,

  // WebSocket Connection Management
  registerWebSocketConnection,
  updateConnectionHeartbeat,
  detectStaleConnections,
  subscribeToStream,
  unsubscribeFromStream,

  // Incident Streaming
  publishIncidentUpdate,
  getIncidentStream,
  markIncidentsAsBroadcasted,
  getPendingIncidentBroadcasts,
  filterIncidentsByLocation,

  // Unit Location Tracking
  publishUnitLocationUpdate,
  getLatestUnitLocations,
  getUnitLocationHistory,
  findUnitsInArea,
  calculateUnitETA,

  // Status Update Streaming
  broadcastStatusUpdate,
  createStatusUpdateRecord,
  getStatusUpdateTimeline,
  aggregateStatusStatistics,

  // Event Notifications
  publishEventNotification,
  filterEventsBySeverity,
  createEventDigest,
  prioritizeEventNotifications,

  // Metrics Streaming
  publishMetricSnapshot,
  aggregateMetricsWindow,
  createMetricsTimeSeries,
  detectMetricAnomalies,

  // Map Overlay Management
  createMapOverlay,
  updateMapOverlay,
  removeMapOverlay,
  generateIncidentHeatmap,

  // Video Feed Integration
  registerVideoFeed,
  getActiveVideoFeeds,
  updateVideoFeedStatus,
  createVideoSnapshot,

  // Sensor Data Ingestion
  ingestSensorData,
  checkSensorThresholds,
  aggregateSensorData,
  detectSensorAnomalies,

  // Stream Management & Backpressure
  handleStreamBackpressure,
  compressStreamData,
  reconnectWithBackoff,
};
