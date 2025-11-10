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
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { Sequelize, ModelStatic, Transaction } from 'sequelize';
/**
 * Coordinate system definitions
 */
export declare enum CoordinateSystem {
    WGS84 = "EPSG:4326",
    WebMercator = "EPSG:3857",
    UTM_ZONE_10N = "EPSG:32610",
    UTM_ZONE_11N = "EPSG:32611",
    NAD83 = "EPSG:4269"
}
/**
 * Geometry types
 */
export declare enum GeometryType {
    POINT = "Point",
    LINESTRING = "LineString",
    POLYGON = "Polygon",
    MULTIPOINT = "MultiPoint",
    MULTILINESTRING = "MultiLineString",
    MULTIPOLYGON = "MultiPolygon",
    GEOMETRYCOLLECTION = "GeometryCollection"
}
/**
 * Spatial query types
 */
export declare enum SpatialQueryType {
    CONTAINS = "contains",
    WITHIN = "within",
    INTERSECTS = "intersects",
    DISJOINT = "disjoint",
    TOUCHES = "touches",
    OVERLAPS = "overlaps",
    CROSSES = "crosses",
    EQUALS = "equals"
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
export declare const PointSchema: any;
export declare const BoundingBoxSchema: any;
export declare const GeoJSONGeometrySchema: any;
export declare const GeoJSONFeatureSchema: any;
/**
 * Spatial Entity model for storing geospatial data
 */
export declare function createSpatialEntityModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Location History model for tracking asset movements
 */
export declare function createLocationHistoryModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Geofence model for defining geographic boundaries
 */
export declare function createGeofenceModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Route metadata model for storing route information
 */
export declare function createRouteMetadataModel(sequelize: Sequelize): ModelStatic<any>;
/**
 * Transform coordinates from one coordinate system to another
 */
export declare function transformCoordinates(point: Point, fromCRS: CoordinateSystem, toCRS: CoordinateSystem): Point;
/**
 * Convert WGS84 to Web Mercator projection
 */
export declare function wgs84ToWebMercator(point: Point): Point;
/**
 * Convert Web Mercator to WGS84 projection
 */
export declare function webMercatorToWgs84(point: Point): Point;
/**
 * Convert Point to UTM zone automatically
 */
export declare function wgs84ToUTM(point: Point): {
    point: Point;
    zone: number;
    hemisphere: 'N' | 'S';
};
/**
 * Batch transform multiple coordinates
 */
export declare function batchTransformCoordinates(points: Point[], fromCRS: CoordinateSystem, toCRS: CoordinateSystem): Promise<Point[]>;
/**
 * Validate coordinate system
 */
export declare function validateCoordinateSystem(crs: string): boolean;
/**
 * Create GeoJSON Point feature
 */
export declare function createPointFeature(point: Point, properties?: Record<string, any>, id?: string | number): GeoJSONFeature;
/**
 * Create GeoJSON LineString feature
 */
export declare function createLineStringFeature(points: Point[], properties?: Record<string, any>, id?: string | number): GeoJSONFeature;
/**
 * Create GeoJSON Polygon feature
 */
export declare function createPolygonFeature(rings: Point[][], properties?: Record<string, any>, id?: string | number): GeoJSONFeature;
/**
 * Create GeoJSON FeatureCollection
 */
export declare function createFeatureCollection(features: GeoJSONFeature[]): GeoJSONFeatureCollection;
/**
 * Parse GeoJSON and validate
 */
export declare function parseGeoJSON(geojson: string): GeoJSONFeature | GeoJSONFeatureCollection;
/**
 * Validate GeoJSON structure
 */
export declare function validateGeoJSON(geojson: any): boolean;
/**
 * Convert geometry to GeoJSON
 */
export declare function geometryToGeoJSON(geometry: any): GeoJSONGeometry;
/**
 * Parse Well-Known Text (WKT) to GeoJSON
 */
export declare function parseWKTToGeoJSON(wkt: string): GeoJSONGeometry;
/**
 * Convert GeoJSON to Well-Known Text (WKT)
 */
export declare function geoJSONToWKT(geometry: GeoJSONGeometry): string;
/**
 * Check if point is within polygon
 */
export declare function pointInPolygon(point: Point, polygon: Point[]): boolean;
/**
 * Calculate distance between two points (in meters)
 */
export declare function calculateDistance(point1: Point, point2: Point): number;
/**
 * Calculate bearing between two points (in degrees)
 */
export declare function calculateBearing(point1: Point, point2: Point): number;
/**
 * Create buffer around point (in meters)
 */
export declare function createBuffer(point: Point, radiusMeters: number): GeoJSONFeature;
/**
 * Create buffer around polygon (in meters)
 */
export declare function createPolygonBuffer(polygon: Point[], radiusMeters: number): GeoJSONFeature;
/**
 * Find nearest point from a list
 */
export declare function findNearestPoint(targetPoint: Point, points: Point[]): {
    point: Point;
    distance: number;
    index: number;
};
/**
 * Find k nearest neighbors
 */
export declare function findKNearestPoints(targetPoint: Point, points: Point[], k: number): Array<{
    point: Point;
    distance: number;
    index: number;
}>;
/**
 * Calculate polygon area (in square meters)
 */
export declare function calculateArea(polygon: Point[]): number;
/**
 * Calculate polygon centroid
 */
export declare function calculateCentroid(polygon: Point[]): Point;
/**
 * Check if two geometries intersect
 */
export declare function checkIntersection(geom1: GeoJSONGeometry, geom2: GeoJSONGeometry): boolean;
/**
 * Get bounding box for geometry
 */
export declare function getBoundingBox(geometry: GeoJSONGeometry): BoundingBox;
/**
 * Simplify geometry (reduce points while preserving shape)
 */
export declare function simplifyGeometry(geometry: GeoJSONGeometry, tolerance?: number): GeoJSONGeometry;
/**
 * Create spatial index on table column
 */
export declare function createSpatialIndex(sequelize: Sequelize, config: SpatialIndexConfig, transaction?: Transaction): Promise<void>;
/**
 * Execute spatial query with PostGIS
 */
export declare function executeSpatialQuery(model: ModelStatic<any>, options: SpatialQueryOptions, transaction?: Transaction): Promise<any[]>;
/**
 * Find entities within radius
 */
export declare function findEntitiesWithinRadius(model: ModelStatic<any>, center: Point, radiusMeters: number, limit?: number, transaction?: Transaction): Promise<any[]>;
/**
 * Store location update with spatial indexing
 */
export declare function storeLocationUpdate(model: ModelStatic<any>, update: LocationUpdate, transaction?: Transaction): Promise<any>;
/**
 * Get location history for asset
 */
export declare function getLocationHistory(model: ModelStatic<any>, assetId: string, startTime: Date, endTime: Date, transaction?: Transaction): Promise<any[]>;
/**
 * Geocode address to coordinates (mock implementation - integrate with real service)
 */
export declare function geocodeAddress(address: string): Promise<GeocodingResult>;
/**
 * Reverse geocode coordinates to address (mock implementation)
 */
export declare function reverseGeocode(point: Point): Promise<GeocodingResult>;
/**
 * Batch geocode multiple addresses
 */
export declare function batchGeocode(addresses: string[]): Promise<GeocodingResult[]>;
/**
 * Optimize route waypoints using nearest neighbor heuristic
 */
export declare function optimizeRoute(waypoints: Waypoint[]): OptimizedRoute;
/**
 * Calculate route from waypoints
 */
export declare function calculateRoute(waypoints: Waypoint[]): OptimizedRoute;
/**
 * Store optimized route
 */
export declare function storeRoute(model: ModelStatic<any>, name: string, routeType: string, route: OptimizedRoute, transaction?: Transaction): Promise<any>;
/**
 * Check if location is within geofence
 */
export declare function checkGeofenceViolation(geofenceModel: ModelStatic<any>, location: Point, transaction?: Transaction): Promise<any[]>;
/**
 * Create circular geofence
 */
export declare function createCircularGeofence(model: ModelStatic<any>, name: string, center: Point, radiusMeters: number, type: 'include' | 'exclude', transaction?: Transaction): Promise<any>;
/**
 * Create polygon geofence
 */
export declare function createPolygonGeofence(model: ModelStatic<any>, name: string, polygon: Point[], type: 'include' | 'exclude', transaction?: Transaction): Promise<any>;
/**
 * Create map layer configuration
 */
export declare function createMapLayer(config: Partial<MapLayer>): MapLayer;
/**
 * Generate heat map from points
 */
export declare function generateHeatMap(points: Point[], intensity?: number): GeoJSONFeatureCollection;
/**
 * Cluster points by proximity
 */
export declare function clusterPoints(points: Point[], radiusMeters: number): Array<{
    centroid: Point;
    points: Point[];
    count: number;
}>;
export { Logger, Injectable, BadRequestException, InternalServerErrorException, NotFoundException, };
/**
 * GIS Spatial Kit Service
 */
export declare class GISSpatialKitService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Initialize spatial database extensions
     */
    initializeSpatialExtensions(): Promise<void>;
    /**
     * Get all exported functions
     */
    getAllFunctions(): {
        transformCoordinates: typeof transformCoordinates;
        wgs84ToWebMercator: typeof wgs84ToWebMercator;
        webMercatorToWgs84: typeof webMercatorToWgs84;
        wgs84ToUTM: typeof wgs84ToUTM;
        batchTransformCoordinates: typeof batchTransformCoordinates;
        validateCoordinateSystem: typeof validateCoordinateSystem;
        createPointFeature: typeof createPointFeature;
        createLineStringFeature: typeof createLineStringFeature;
        createPolygonFeature: typeof createPolygonFeature;
        createFeatureCollection: typeof createFeatureCollection;
        parseGeoJSON: typeof parseGeoJSON;
        validateGeoJSON: typeof validateGeoJSON;
        geometryToGeoJSON: typeof geometryToGeoJSON;
        parseWKTToGeoJSON: typeof parseWKTToGeoJSON;
        geoJSONToWKT: typeof geoJSONToWKT;
        pointInPolygon: typeof pointInPolygon;
        calculateDistance: typeof calculateDistance;
        calculateBearing: typeof calculateBearing;
        createBuffer: typeof createBuffer;
        createPolygonBuffer: typeof createPolygonBuffer;
        findNearestPoint: typeof findNearestPoint;
        findKNearestPoints: typeof findKNearestPoints;
        calculateArea: typeof calculateArea;
        calculateCentroid: typeof calculateCentroid;
        checkIntersection: typeof checkIntersection;
        getBoundingBox: typeof getBoundingBox;
        simplifyGeometry: typeof simplifyGeometry;
        createSpatialIndex: typeof createSpatialIndex;
        executeSpatialQuery: typeof executeSpatialQuery;
        findEntitiesWithinRadius: typeof findEntitiesWithinRadius;
        storeLocationUpdate: typeof storeLocationUpdate;
        getLocationHistory: typeof getLocationHistory;
        geocodeAddress: typeof geocodeAddress;
        reverseGeocode: typeof reverseGeocode;
        batchGeocode: typeof batchGeocode;
        optimizeRoute: typeof optimizeRoute;
        calculateRoute: typeof calculateRoute;
        storeRoute: typeof storeRoute;
        checkGeofenceViolation: typeof checkGeofenceViolation;
        createCircularGeofence: typeof createCircularGeofence;
        createPolygonGeofence: typeof createPolygonGeofence;
        createMapLayer: typeof createMapLayer;
        generateHeatMap: typeof generateHeatMap;
        clusterPoints: typeof clusterPoints;
        createSpatialEntityModel: typeof createSpatialEntityModel;
        createLocationHistoryModel: typeof createLocationHistoryModel;
        createGeofenceModel: typeof createGeofenceModel;
        createRouteMetadataModel: typeof createRouteMetadataModel;
    };
}
export default GISSpatialKitService;
//# sourceMappingURL=gis-spatial-kit.d.ts.map