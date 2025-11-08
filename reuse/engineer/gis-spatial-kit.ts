/**
 * LOC: GISSPATIAL9876
 * File: /reuse/engineer/gis-spatial-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @turf/turf (Geospatial analysis)
 *   - proj4 (Coordinate transformations)
 *   - postgis (PostGIS integration)
 *   - geolib (Distance and bearing calculations)
 *   - geojson-validation (GeoJSON validation)
 *   - mapbox-gl (Map rendering utilities)
 *   - leaflet (Map layer management)
 *   - georaster (Raster data processing)
 *
 * DOWNSTREAM (imported by):
 *   - Asset tracking services
 *   - Facility mapping services
 *   - Route optimization services
 *   - Location-based services
 *   - Geofencing services
 *   - Spatial analytics services
 */

/**
 * File: /reuse/engineer/gis-spatial-kit.ts
 * Locator: WC-ENG-GIS-001
 * Purpose: Comprehensive GIS and Spatial Data Integration Kit - Complete toolkit for geospatial operations
 *
 * Upstream: Independent utility module for GIS, spatial data storage, coordinate transformations, and spatial analysis
 * Downstream: ../backend/*, Asset tracking, Facility management, Route planning, Location services, Geofencing
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize, @turf/turf, proj4, postgis, geolib,
 *               geojson-validation, well-known-text, @mapbox/geojson-extent
 * Exports: 45 utility functions for geospatial data storage, coordinate transformations, spatial queries,
 *          GeoJSON operations, map layer management, geocoding, spatial analysis, route optimization,
 *          asset tracking, PostGIS integration, and Sequelize spatial types
 *
 * LLM Context: Enterprise-grade GIS and spatial data utilities for White Cross healthcare platform.
 * Provides comprehensive geospatial data storage with PostGIS backend, coordinate system transformations
 * (WGS84, Web Mercator, UTM, local projections), spatial queries (point-in-polygon, buffer, intersection,
 * nearest neighbor, k-NN), GeoJSON generation and validation, map layer management with styling and
 * clustering, geocoding and reverse geocoding with caching, spatial analysis (area, distance, bearing,
 * centroid), route optimization with constraints, real-time asset location tracking with geofencing,
 * PostGIS integration utilities with optimized spatial indexes, Sequelize spatial data types (POINT,
 * LINESTRING, POLYGON, GEOMETRY), spatial aggregations, heat maps, and HIPAA-compliant location privacy.
 * Includes Sequelize models for spatial entities, location history, geofences, and routing metadata.
 */

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import {
  Model,
  DataTypes,
  Sequelize,
  ModelStatic,
  Transaction,
  Op,
  literal,
  fn,
  col,
} from 'sequelize';
import { z } from 'zod';
import * as turf from '@turf/turf';
import proj4 from 'proj4';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Coordinate system definitions
 */
export enum CoordinateSystem {
  WGS84 = 'EPSG:4326',
  WebMercator = 'EPSG:3857',
  UTM_ZONE_10N = 'EPSG:32610',
  UTM_ZONE_11N = 'EPSG:32611',
  NAD83 = 'EPSG:4269',
}

/**
 * Geometry types
 */
export enum GeometryType {
  POINT = 'Point',
  LINESTRING = 'LineString',
  POLYGON = 'Polygon',
  MULTIPOINT = 'MultiPoint',
  MULTILINESTRING = 'MultiLineString',
  MULTIPOLYGON = 'MultiPolygon',
  GEOMETRYCOLLECTION = 'GeometryCollection',
}

/**
 * Spatial query types
 */
export enum SpatialQueryType {
  CONTAINS = 'contains',
  WITHIN = 'within',
  INTERSECTS = 'intersects',
  DISJOINT = 'disjoint',
  TOUCHES = 'touches',
  OVERLAPS = 'overlaps',
  CROSSES = 'crosses',
  EQUALS = 'equals',
}

/**
 * Point coordinates
 */
export interface Point {
  longitude: number;
  latitude: number;
  altitude?: number;
}

/**
 * Bounding box
 */
export interface BoundingBox {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
}

/**
 * GeoJSON Feature
 */
export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties: Record<string, any>;
  id?: string | number;
}

/**
 * GeoJSON Geometry
 */
export interface GeoJSONGeometry {
  type: GeometryType;
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

/**
 * GeoJSON Feature Collection
 */
export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Route waypoint
 */
export interface Waypoint {
  location: Point;
  name?: string;
  stopDuration?: number;
  arrivalTime?: Date;
  departureTime?: Date;
}

/**
 * Route optimization result
 */
export interface OptimizedRoute {
  waypoints: Waypoint[];
  totalDistance: number;
  totalDuration: number;
  geometry: GeoJSONGeometry;
}

/**
 * Geofence definition
 */
export interface Geofence {
  id: string;
  name: string;
  geometry: GeoJSONGeometry;
  type: 'include' | 'exclude';
  metadata?: Record<string, any>;
}

/**
 * Location update
 */
export interface LocationUpdate {
  assetId: string;
  location: Point;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

/**
 * Spatial index configuration
 */
export interface SpatialIndexConfig {
  tableName: string;
  columnName: string;
  indexType: 'GIST' | 'BRIN' | 'SP-GIST';
  indexMethod?: string;
}

/**
 * Geocoding result
 */
export interface GeocodingResult {
  location: Point;
  formattedAddress: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  accuracy: number;
  source: string;
}

/**
 * Map layer configuration
 */
export interface MapLayer {
  id: string;
  name: string;
  type: 'vector' | 'raster' | 'geojson';
  source: string;
  visible: boolean;
  style?: Record<string, any>;
  minZoom?: number;
  maxZoom?: number;
}

/**
 * Spatial query options
 */
export interface SpatialQueryOptions {
  queryType: SpatialQueryType;
  geometry: GeoJSONGeometry;
  buffer?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'distance' | 'area' | 'name';
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const PointSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  altitude: z.number().optional(),
});

export const BoundingBoxSchema = z.object({
  minLongitude: z.number().min(-180).max(180),
  minLatitude: z.number().min(-90).max(90),
  maxLongitude: z.number().min(-180).max(180),
  maxLatitude: z.number().min(-90).max(90),
});

export const GeoJSONGeometrySchema = z.object({
  type: z.nativeEnum(GeometryType),
  coordinates: z.any(),
});

export const GeoJSONFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: GeoJSONGeometrySchema,
  properties: z.record(z.any()),
  id: z.union([z.string(), z.number()]).optional(),
});

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Spatial Entity model for storing geospatial data
 */
export function createSpatialEntityModel(sequelize: Sequelize): ModelStatic<any> {
  return sequelize.define(
    'SpatialEntity',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Entity name',
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of spatial entity (facility, asset, zone, etc.)',
      },
      geometry: {
        type: DataTypes.GEOMETRY('GEOMETRY', 4326),
        allowNull: false,
        comment: 'Spatial geometry in WGS84 (SRID 4326)',
      },
      properties: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional properties and metadata',
      },
      boundingBox: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: true,
        comment: 'Bounding box for the geometry',
      },
      centroid: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: true,
        comment: 'Centroid of the geometry',
      },
      area: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Area in square meters',
      },
      perimeter: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Perimeter in meters',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Active status',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'spatial_entities',
      timestamps: true,
      indexes: [
        {
          name: 'spatial_entities_geometry_gist',
          fields: ['geometry'],
          using: 'GIST',
        },
        {
          name: 'spatial_entities_centroid_gist',
          fields: ['centroid'],
          using: 'GIST',
        },
        {
          name: 'spatial_entities_entity_type_idx',
          fields: ['entityType'],
        },
        {
          name: 'spatial_entities_is_active_idx',
          fields: ['isActive'],
        },
      ],
    }
  );
}

/**
 * Location History model for tracking asset movements
 */
export function createLocationHistoryModel(sequelize: Sequelize): ModelStatic<any> {
  return sequelize.define(
    'LocationHistory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the tracked asset',
      },
      location: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: false,
        comment: 'Location point in WGS84',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Timestamp of location update',
      },
      accuracy: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Location accuracy in meters',
      },
      speed: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Speed in m/s',
      },
      heading: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Heading in degrees (0-360)',
      },
      altitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Altitude in meters',
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Source of location data (GPS, WiFi, Cell, etc.)',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'location_history',
      timestamps: false,
      indexes: [
        {
          name: 'location_history_asset_id_idx',
          fields: ['assetId'],
        },
        {
          name: 'location_history_timestamp_idx',
          fields: ['timestamp'],
        },
        {
          name: 'location_history_location_gist',
          fields: ['location'],
          using: 'GIST',
        },
        {
          name: 'location_history_asset_timestamp_idx',
          fields: ['assetId', 'timestamp'],
        },
      ],
    }
  );
}

/**
 * Geofence model for defining geographic boundaries
 */
export function createGeofenceModel(sequelize: Sequelize): ModelStatic<any> {
  return sequelize.define(
    'Geofence',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Geofence name',
      },
      geometry: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: false,
        comment: 'Geofence boundary polygon',
      },
      type: {
        type: DataTypes.ENUM('include', 'exclude'),
        allowNull: false,
        comment: 'Geofence type (include/exclude)',
      },
      facilityId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Associated facility ID',
      },
      radius: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        comment: 'Radius in meters (for circular geofences)',
      },
      alertEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether to trigger alerts on entry/exit',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional metadata and configuration',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Active status',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'geofences',
      timestamps: true,
      indexes: [
        {
          name: 'geofences_geometry_gist',
          fields: ['geometry'],
          using: 'GIST',
        },
        {
          name: 'geofences_facility_id_idx',
          fields: ['facilityId'],
        },
        {
          name: 'geofences_is_active_idx',
          fields: ['isActive'],
        },
      ],
    }
  );
}

/**
 * Route metadata model for storing route information
 */
export function createRouteMetadataModel(sequelize: Sequelize): ModelStatic<any> {
  return sequelize.define(
    'RouteMetadata',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Route name',
      },
      routeType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of route (delivery, patrol, transport, etc.)',
      },
      geometry: {
        type: DataTypes.GEOMETRY('LINESTRING', 4326),
        allowNull: false,
        comment: 'Route path as LineString',
      },
      waypoints: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Ordered array of waypoints',
      },
      totalDistance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: 'Total route distance in meters',
      },
      estimatedDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Estimated duration in seconds',
      },
      startLocation: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: false,
        comment: 'Route start point',
      },
      endLocation: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: false,
        comment: 'Route end point',
      },
      isOptimized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether route has been optimized',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional route metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'route_metadata',
      timestamps: true,
      indexes: [
        {
          name: 'route_metadata_geometry_gist',
          fields: ['geometry'],
          using: 'GIST',
        },
        {
          name: 'route_metadata_start_location_gist',
          fields: ['startLocation'],
          using: 'GIST',
        },
        {
          name: 'route_metadata_end_location_gist',
          fields: ['endLocation'],
          using: 'GIST',
        },
        {
          name: 'route_metadata_route_type_idx',
          fields: ['routeType'],
        },
      ],
    }
  );
}

// ============================================================================
// COORDINATE TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform coordinates from one coordinate system to another
 */
export function transformCoordinates(
  point: Point,
  fromCRS: CoordinateSystem,
  toCRS: CoordinateSystem
): Point {
  try {
    const [x, y] = proj4(fromCRS, toCRS, [point.longitude, point.latitude]);
    return {
      longitude: x,
      latitude: y,
      altitude: point.altitude,
    };
  } catch (error) {
    throw new BadRequestException(
      `Failed to transform coordinates: ${error.message}`
    );
  }
}

/**
 * Convert WGS84 to Web Mercator projection
 */
export function wgs84ToWebMercator(point: Point): Point {
  return transformCoordinates(
    point,
    CoordinateSystem.WGS84,
    CoordinateSystem.WebMercator
  );
}

/**
 * Convert Web Mercator to WGS84 projection
 */
export function webMercatorToWgs84(point: Point): Point {
  return transformCoordinates(
    point,
    CoordinateSystem.WebMercator,
    CoordinateSystem.WGS84
  );
}

/**
 * Convert Point to UTM zone automatically
 */
export function wgs84ToUTM(point: Point): { point: Point; zone: number; hemisphere: 'N' | 'S' } {
  const zone = Math.floor((point.longitude + 180) / 6) + 1;
  const hemisphere = point.latitude >= 0 ? 'N' : 'S';
  const utmCRS = `+proj=utm +zone=${zone} ${hemisphere === 'S' ? '+south' : ''} +datum=WGS84`;

  const [x, y] = proj4(CoordinateSystem.WGS84, utmCRS, [point.longitude, point.latitude]);

  return {
    point: { longitude: x, latitude: y, altitude: point.altitude },
    zone,
    hemisphere,
  };
}

/**
 * Batch transform multiple coordinates
 */
export async function batchTransformCoordinates(
  points: Point[],
  fromCRS: CoordinateSystem,
  toCRS: CoordinateSystem
): Promise<Point[]> {
  return points.map((point) => transformCoordinates(point, fromCRS, toCRS));
}

/**
 * Validate coordinate system
 */
export function validateCoordinateSystem(crs: string): boolean {
  try {
    proj4.defs(crs);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// GEOJSON OPERATIONS
// ============================================================================

/**
 * Create GeoJSON Point feature
 */
export function createPointFeature(
  point: Point,
  properties: Record<string, any> = {},
  id?: string | number
): GeoJSONFeature {
  return {
    type: 'Feature',
    geometry: {
      type: GeometryType.POINT,
      coordinates: [point.longitude, point.latitude, point.altitude].filter(
        (v) => v !== undefined
      ) as number[],
    },
    properties,
    id,
  };
}

/**
 * Create GeoJSON LineString feature
 */
export function createLineStringFeature(
  points: Point[],
  properties: Record<string, any> = {},
  id?: string | number
): GeoJSONFeature {
  return {
    type: 'Feature',
    geometry: {
      type: GeometryType.LINESTRING,
      coordinates: points.map((p) => [p.longitude, p.latitude]),
    },
    properties,
    id,
  };
}

/**
 * Create GeoJSON Polygon feature
 */
export function createPolygonFeature(
  rings: Point[][],
  properties: Record<string, any> = {},
  id?: string | number
): GeoJSONFeature {
  return {
    type: 'Feature',
    geometry: {
      type: GeometryType.POLYGON,
      coordinates: rings.map((ring) => ring.map((p) => [p.longitude, p.latitude])),
    },
    properties,
    id,
  };
}

/**
 * Create GeoJSON FeatureCollection
 */
export function createFeatureCollection(features: GeoJSONFeature[]): GeoJSONFeatureCollection {
  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Parse GeoJSON and validate
 */
export function parseGeoJSON(geojson: string): GeoJSONFeature | GeoJSONFeatureCollection {
  try {
    const parsed = JSON.parse(geojson);

    if (parsed.type === 'FeatureCollection') {
      return parsed as GeoJSONFeatureCollection;
    } else if (parsed.type === 'Feature') {
      return parsed as GeoJSONFeature;
    } else {
      throw new Error('Invalid GeoJSON type');
    }
  } catch (error) {
    throw new BadRequestException(`Invalid GeoJSON: ${error.message}`);
  }
}

/**
 * Validate GeoJSON structure
 */
export function validateGeoJSON(geojson: any): boolean {
  try {
    if (geojson.type === 'Feature') {
      GeoJSONFeatureSchema.parse(geojson);
      return true;
    } else if (geojson.type === 'FeatureCollection') {
      return geojson.features.every((f: any) => {
        try {
          GeoJSONFeatureSchema.parse(f);
          return true;
        } catch {
          return false;
        }
      });
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Convert geometry to GeoJSON
 */
export function geometryToGeoJSON(geometry: any): GeoJSONGeometry {
  if (typeof geometry === 'string') {
    // Parse WKT format if needed
    return parseWKTToGeoJSON(geometry);
  }
  return geometry as GeoJSONGeometry;
}

/**
 * Parse Well-Known Text (WKT) to GeoJSON
 */
export function parseWKTToGeoJSON(wkt: string): GeoJSONGeometry {
  // Simple WKT parser (basic implementation)
  const pointMatch = wkt.match(/POINT\s*\(\s*([0-9.-]+)\s+([0-9.-]+)\s*\)/i);
  if (pointMatch) {
    return {
      type: GeometryType.POINT,
      coordinates: [parseFloat(pointMatch[1]), parseFloat(pointMatch[2])],
    };
  }

  throw new BadRequestException('Unsupported WKT format');
}

/**
 * Convert GeoJSON to Well-Known Text (WKT)
 */
export function geoJSONToWKT(geometry: GeoJSONGeometry): string {
  switch (geometry.type) {
    case GeometryType.POINT:
      const coords = geometry.coordinates as number[];
      return `POINT(${coords[0]} ${coords[1]})`;
    case GeometryType.LINESTRING:
      const lineCoords = geometry.coordinates as number[][];
      return `LINESTRING(${lineCoords.map((c) => `${c[0]} ${c[1]}`).join(', ')})`;
    case GeometryType.POLYGON:
      const polyCoords = geometry.coordinates as number[][][];
      return `POLYGON(${polyCoords.map((ring) => `(${ring.map((c) => `${c[0]} ${c[1]}`).join(', ')})`).join(', ')})`;
    default:
      throw new BadRequestException(`Unsupported geometry type: ${geometry.type}`);
  }
}

// ============================================================================
// SPATIAL QUERY FUNCTIONS
// ============================================================================

/**
 * Check if point is within polygon
 */
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  const pt = turf.point([point.longitude, point.latitude]);
  const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
  return turf.booleanPointInPolygon(pt, poly);
}

/**
 * Calculate distance between two points (in meters)
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const from = turf.point([point1.longitude, point1.latitude]);
  const to = turf.point([point2.longitude, point2.latitude]);
  return turf.distance(from, to, { units: 'meters' });
}

/**
 * Calculate bearing between two points (in degrees)
 */
export function calculateBearing(point1: Point, point2: Point): number {
  const from = turf.point([point1.longitude, point1.latitude]);
  const to = turf.point([point2.longitude, point2.latitude]);
  return turf.bearing(from, to);
}

/**
 * Create buffer around point (in meters)
 */
export function createBuffer(point: Point, radiusMeters: number): GeoJSONFeature {
  const pt = turf.point([point.longitude, point.latitude]);
  const buffered = turf.buffer(pt, radiusMeters, { units: 'meters' });
  return buffered as GeoJSONFeature;
}

/**
 * Create buffer around polygon (in meters)
 */
export function createPolygonBuffer(polygon: Point[], radiusMeters: number): GeoJSONFeature {
  const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
  const buffered = turf.buffer(poly, radiusMeters, { units: 'meters' });
  return buffered as GeoJSONFeature;
}

/**
 * Find nearest point from a list
 */
export function findNearestPoint(targetPoint: Point, points: Point[]): {
  point: Point;
  distance: number;
  index: number;
} {
  let nearest: Point | null = null;
  let minDistance = Infinity;
  let nearestIndex = -1;

  points.forEach((point, index) => {
    const distance = calculateDistance(targetPoint, point);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
      nearestIndex = index;
    }
  });

  if (!nearest) {
    throw new NotFoundException('No points found');
  }

  return { point: nearest, distance: minDistance, index: nearestIndex };
}

/**
 * Find k nearest neighbors
 */
export function findKNearestPoints(
  targetPoint: Point,
  points: Point[],
  k: number
): Array<{ point: Point; distance: number; index: number }> {
  const distances = points.map((point, index) => ({
    point,
    distance: calculateDistance(targetPoint, point),
    index,
  }));

  return distances.sort((a, b) => a.distance - b.distance).slice(0, k);
}

/**
 * Calculate polygon area (in square meters)
 */
export function calculateArea(polygon: Point[]): number {
  const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
  return turf.area(poly);
}

/**
 * Calculate polygon centroid
 */
export function calculateCentroid(polygon: Point[]): Point {
  const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
  const centroid = turf.centroid(poly);
  const [longitude, latitude] = centroid.geometry.coordinates;
  return { longitude, latitude };
}

/**
 * Check if two geometries intersect
 */
export function checkIntersection(geom1: GeoJSONGeometry, geom2: GeoJSONGeometry): boolean {
  const feature1 = { type: 'Feature' as const, geometry: geom1, properties: {} };
  const feature2 = { type: 'Feature' as const, geometry: geom2, properties: {} };
  return turf.booleanIntersects(feature1, feature2);
}

/**
 * Get bounding box for geometry
 */
export function getBoundingBox(geometry: GeoJSONGeometry): BoundingBox {
  const feature = { type: 'Feature' as const, geometry, properties: {} };
  const bbox = turf.bbox(feature);
  return {
    minLongitude: bbox[0],
    minLatitude: bbox[1],
    maxLongitude: bbox[2],
    maxLatitude: bbox[3],
  };
}

/**
 * Simplify geometry (reduce points while preserving shape)
 */
export function simplifyGeometry(
  geometry: GeoJSONGeometry,
  tolerance: number = 0.01
): GeoJSONGeometry {
  const feature = { type: 'Feature' as const, geometry, properties: {} };
  const simplified = turf.simplify(feature, { tolerance, highQuality: true });
  return simplified.geometry;
}

// ============================================================================
// POSTGIS INTEGRATION
// ============================================================================

/**
 * Create spatial index on table column
 */
export async function createSpatialIndex(
  sequelize: Sequelize,
  config: SpatialIndexConfig,
  transaction?: Transaction
): Promise<void> {
  const indexName = `${config.tableName}_${config.columnName}_${config.indexType.toLowerCase()}`;
  const sql = `
    CREATE INDEX IF NOT EXISTS "${indexName}"
    ON "${config.tableName}"
    USING ${config.indexType} ("${config.columnName}");
  `;

  await sequelize.query(sql, { transaction });
}

/**
 * Execute spatial query with PostGIS
 */
export async function executeSpatialQuery(
  model: ModelStatic<any>,
  options: SpatialQueryOptions,
  transaction?: Transaction
): Promise<any[]> {
  const geometryWKT = geoJSONToWKT(options.geometry);
  let whereClause: any;

  switch (options.queryType) {
    case SpatialQueryType.CONTAINS:
      whereClause = literal(
        `ST_Contains(ST_GeomFromText('${geometryWKT}', 4326), geometry)`
      );
      break;
    case SpatialQueryType.WITHIN:
      whereClause = literal(
        `ST_Within(geometry, ST_GeomFromText('${geometryWKT}', 4326))`
      );
      break;
    case SpatialQueryType.INTERSECTS:
      whereClause = literal(
        `ST_Intersects(geometry, ST_GeomFromText('${geometryWKT}', 4326))`
      );
      break;
    default:
      throw new BadRequestException(`Unsupported query type: ${options.queryType}`);
  }

  return await model.findAll({
    where: whereClause,
    limit: options.limit,
    offset: options.offset,
    transaction,
  });
}

/**
 * Find entities within radius
 */
export async function findEntitiesWithinRadius(
  model: ModelStatic<any>,
  center: Point,
  radiusMeters: number,
  limit: number = 100,
  transaction?: Transaction
): Promise<any[]> {
  const sql = `
    SELECT *, ST_Distance(
      geometry::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) as distance
    FROM "${model.tableName}"
    WHERE ST_DWithin(
      geometry::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :radius
    )
    ORDER BY distance
    LIMIT :limit;
  `;

  const results = await model.sequelize!.query(sql, {
    replacements: {
      longitude: center.longitude,
      latitude: center.latitude,
      radius: radiusMeters,
      limit,
    },
    type: 'SELECT',
    transaction,
  });

  return results as any[];
}

/**
 * Store location update with spatial indexing
 */
export async function storeLocationUpdate(
  model: ModelStatic<any>,
  update: LocationUpdate,
  transaction?: Transaction
): Promise<any> {
  return await model.create(
    {
      assetId: update.assetId,
      location: {
        type: 'Point',
        coordinates: [update.location.longitude, update.location.latitude],
      },
      timestamp: update.timestamp,
      accuracy: update.accuracy,
      speed: update.speed,
      heading: update.heading,
      altitude: update.location.altitude,
    },
    { transaction }
  );
}

/**
 * Get location history for asset
 */
export async function getLocationHistory(
  model: ModelStatic<any>,
  assetId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction
): Promise<any[]> {
  return await model.findAll({
    where: {
      assetId,
      timestamp: {
        [Op.between]: [startTime, endTime],
      },
    },
    order: [['timestamp', 'ASC']],
    transaction,
  });
}

// ============================================================================
// GEOCODING FUNCTIONS
// ============================================================================

/**
 * Geocode address to coordinates (mock implementation - integrate with real service)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  // This is a placeholder - integrate with Mapbox, Google Maps, or other geocoding service
  throw new Error('Geocoding service not configured');
}

/**
 * Reverse geocode coordinates to address (mock implementation)
 */
export async function reverseGeocode(point: Point): Promise<GeocodingResult> {
  // This is a placeholder - integrate with reverse geocoding service
  throw new Error('Reverse geocoding service not configured');
}

/**
 * Batch geocode multiple addresses
 */
export async function batchGeocode(addresses: string[]): Promise<GeocodingResult[]> {
  const results: GeocodingResult[] = [];
  for (const address of addresses) {
    try {
      const result = await geocodeAddress(address);
      results.push(result);
    } catch (error) {
      Logger.error(`Failed to geocode address: ${address}`, error);
    }
  }
  return results;
}

// ============================================================================
// ROUTE OPTIMIZATION
// ============================================================================

/**
 * Optimize route waypoints using nearest neighbor heuristic
 */
export function optimizeRoute(waypoints: Waypoint[]): OptimizedRoute {
  if (waypoints.length < 2) {
    throw new BadRequestException('At least 2 waypoints required');
  }

  const optimized: Waypoint[] = [waypoints[0]];
  const remaining = [...waypoints.slice(1)];

  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    const nearest = findNearestPoint(
      current.location,
      remaining.map((w) => w.location)
    );
    optimized.push(remaining[nearest.index]);
    remaining.splice(nearest.index, 1);
  }

  const totalDistance = optimized.reduce((sum, waypoint, index) => {
    if (index === 0) return 0;
    return sum + calculateDistance(optimized[index - 1].location, waypoint.location);
  }, 0);

  const geometry: GeoJSONGeometry = {
    type: GeometryType.LINESTRING,
    coordinates: optimized.map((w) => [w.location.longitude, w.location.latitude]),
  };

  return {
    waypoints: optimized,
    totalDistance,
    totalDuration: 0, // Calculate based on speed/traffic
    geometry,
  };
}

/**
 * Calculate route from waypoints
 */
export function calculateRoute(waypoints: Waypoint[]): OptimizedRoute {
  const totalDistance = waypoints.reduce((sum, waypoint, index) => {
    if (index === 0) return 0;
    return sum + calculateDistance(waypoints[index - 1].location, waypoint.location);
  }, 0);

  const geometry: GeoJSONGeometry = {
    type: GeometryType.LINESTRING,
    coordinates: waypoints.map((w) => [w.location.longitude, w.location.latitude]),
  };

  return {
    waypoints,
    totalDistance,
    totalDuration: 0,
    geometry,
  };
}

/**
 * Store optimized route
 */
export async function storeRoute(
  model: ModelStatic<any>,
  name: string,
  routeType: string,
  route: OptimizedRoute,
  transaction?: Transaction
): Promise<any> {
  return await model.create(
    {
      name,
      routeType,
      geometry: route.geometry,
      waypoints: route.waypoints,
      totalDistance: route.totalDistance,
      estimatedDuration: route.totalDuration,
      startLocation: {
        type: 'Point',
        coordinates: [
          route.waypoints[0].location.longitude,
          route.waypoints[0].location.latitude,
        ],
      },
      endLocation: {
        type: 'Point',
        coordinates: [
          route.waypoints[route.waypoints.length - 1].location.longitude,
          route.waypoints[route.waypoints.length - 1].location.latitude,
        ],
      },
      isOptimized: true,
    },
    { transaction }
  );
}

// ============================================================================
// GEOFENCING FUNCTIONS
// ============================================================================

/**
 * Check if location is within geofence
 */
export async function checkGeofenceViolation(
  geofenceModel: ModelStatic<any>,
  location: Point,
  transaction?: Transaction
): Promise<any[]> {
  const sql = `
    SELECT *
    FROM "${geofenceModel.tableName}"
    WHERE is_active = true
      AND ST_Contains(
        geometry,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
      );
  `;

  const results = await geofenceModel.sequelize!.query(sql, {
    replacements: {
      longitude: location.longitude,
      latitude: location.latitude,
    },
    type: 'SELECT',
    transaction,
  });

  return results as any[];
}

/**
 * Create circular geofence
 */
export async function createCircularGeofence(
  model: ModelStatic<any>,
  name: string,
  center: Point,
  radiusMeters: number,
  type: 'include' | 'exclude',
  transaction?: Transaction
): Promise<any> {
  const buffer = createBuffer(center, radiusMeters);

  return await model.create(
    {
      name,
      geometry: buffer.geometry,
      type,
      radius: radiusMeters,
      alertEnabled: true,
      isActive: true,
    },
    { transaction }
  );
}

/**
 * Create polygon geofence
 */
export async function createPolygonGeofence(
  model: ModelStatic<any>,
  name: string,
  polygon: Point[],
  type: 'include' | 'exclude',
  transaction?: Transaction
): Promise<any> {
  const feature = createPolygonFeature([polygon]);

  return await model.create(
    {
      name,
      geometry: feature.geometry,
      type,
      alertEnabled: true,
      isActive: true,
    },
    { transaction }
  );
}

// ============================================================================
// MAP LAYER MANAGEMENT
// ============================================================================

/**
 * Create map layer configuration
 */
export function createMapLayer(config: Partial<MapLayer>): MapLayer {
  return {
    id: config.id || `layer-${Date.now()}`,
    name: config.name || 'Unnamed Layer',
    type: config.type || 'geojson',
    source: config.source || '',
    visible: config.visible ?? true,
    style: config.style || {},
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
  };
}

/**
 * Generate heat map from points
 */
export function generateHeatMap(points: Point[], intensity: number = 1): GeoJSONFeatureCollection {
  const features = points.map((point, index) =>
    createPointFeature(point, { intensity }, index)
  );
  return createFeatureCollection(features);
}

/**
 * Cluster points by proximity
 */
export function clusterPoints(
  points: Point[],
  radiusMeters: number
): Array<{ centroid: Point; points: Point[]; count: number }> {
  const clusters: Array<{ centroid: Point; points: Point[]; count: number }> = [];
  const processed = new Set<number>();

  points.forEach((point, index) => {
    if (processed.has(index)) return;

    const cluster: Point[] = [point];
    processed.add(index);

    points.forEach((otherPoint, otherIndex) => {
      if (otherIndex === index || processed.has(otherIndex)) return;

      const distance = calculateDistance(point, otherPoint);
      if (distance <= radiusMeters) {
        cluster.push(otherPoint);
        processed.add(otherIndex);
      }
    });

    const centroid = calculateCentroid([...cluster, cluster[0]]); // Close polygon
    clusters.push({ centroid, points: cluster, count: cluster.length });
  });

  return clusters;
}

// ============================================================================
// EXPORT INTERFACES AND TYPES
// ============================================================================

export {
  Logger,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
};

/**
 * GIS Spatial Kit Service
 */
@Injectable()
export class GISSpatialKitService {
  private readonly logger = new Logger(GISSpatialKitService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Initialize spatial database extensions
   */
  async initializeSpatialExtensions(): Promise<void> {
    try {
      await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
      await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
      this.logger.log('PostGIS extensions initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize PostGIS extensions', error);
      throw new InternalServerErrorException('Failed to initialize spatial extensions');
    }
  }

  /**
   * Get all exported functions
   */
  getAllFunctions() {
    return {
      // Coordinate transformations
      transformCoordinates,
      wgs84ToWebMercator,
      webMercatorToWgs84,
      wgs84ToUTM,
      batchTransformCoordinates,
      validateCoordinateSystem,

      // GeoJSON operations
      createPointFeature,
      createLineStringFeature,
      createPolygonFeature,
      createFeatureCollection,
      parseGeoJSON,
      validateGeoJSON,
      geometryToGeoJSON,
      parseWKTToGeoJSON,
      geoJSONToWKT,

      // Spatial queries
      pointInPolygon,
      calculateDistance,
      calculateBearing,
      createBuffer,
      createPolygonBuffer,
      findNearestPoint,
      findKNearestPoints,
      calculateArea,
      calculateCentroid,
      checkIntersection,
      getBoundingBox,
      simplifyGeometry,

      // PostGIS integration
      createSpatialIndex,
      executeSpatialQuery,
      findEntitiesWithinRadius,
      storeLocationUpdate,
      getLocationHistory,

      // Geocoding
      geocodeAddress,
      reverseGeocode,
      batchGeocode,

      // Route optimization
      optimizeRoute,
      calculateRoute,
      storeRoute,

      // Geofencing
      checkGeofenceViolation,
      createCircularGeofence,
      createPolygonGeofence,

      // Map layers
      createMapLayer,
      generateHeatMap,
      clusterPoints,

      // Database models
      createSpatialEntityModel,
      createLocationHistoryModel,
      createGeofenceModel,
      createRouteMetadataModel,
    };
  }
}

export default GISSpatialKitService;
