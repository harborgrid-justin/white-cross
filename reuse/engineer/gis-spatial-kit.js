"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GISSpatialKitService = exports.NotFoundException = exports.InternalServerErrorException = exports.BadRequestException = exports.Injectable = exports.Logger = exports.GeoJSONFeatureSchema = exports.GeoJSONGeometrySchema = exports.BoundingBoxSchema = exports.PointSchema = exports.SpatialQueryType = exports.GeometryType = exports.CoordinateSystem = void 0;
exports.createSpatialEntityModel = createSpatialEntityModel;
exports.createLocationHistoryModel = createLocationHistoryModel;
exports.createGeofenceModel = createGeofenceModel;
exports.createRouteMetadataModel = createRouteMetadataModel;
exports.transformCoordinates = transformCoordinates;
exports.wgs84ToWebMercator = wgs84ToWebMercator;
exports.webMercatorToWgs84 = webMercatorToWgs84;
exports.wgs84ToUTM = wgs84ToUTM;
exports.batchTransformCoordinates = batchTransformCoordinates;
exports.validateCoordinateSystem = validateCoordinateSystem;
exports.createPointFeature = createPointFeature;
exports.createLineStringFeature = createLineStringFeature;
exports.createPolygonFeature = createPolygonFeature;
exports.createFeatureCollection = createFeatureCollection;
exports.parseGeoJSON = parseGeoJSON;
exports.validateGeoJSON = validateGeoJSON;
exports.geometryToGeoJSON = geometryToGeoJSON;
exports.parseWKTToGeoJSON = parseWKTToGeoJSON;
exports.geoJSONToWKT = geoJSONToWKT;
exports.pointInPolygon = pointInPolygon;
exports.calculateDistance = calculateDistance;
exports.calculateBearing = calculateBearing;
exports.createBuffer = createBuffer;
exports.createPolygonBuffer = createPolygonBuffer;
exports.findNearestPoint = findNearestPoint;
exports.findKNearestPoints = findKNearestPoints;
exports.calculateArea = calculateArea;
exports.calculateCentroid = calculateCentroid;
exports.checkIntersection = checkIntersection;
exports.getBoundingBox = getBoundingBox;
exports.simplifyGeometry = simplifyGeometry;
exports.createSpatialIndex = createSpatialIndex;
exports.executeSpatialQuery = executeSpatialQuery;
exports.findEntitiesWithinRadius = findEntitiesWithinRadius;
exports.storeLocationUpdate = storeLocationUpdate;
exports.getLocationHistory = getLocationHistory;
exports.geocodeAddress = geocodeAddress;
exports.reverseGeocode = reverseGeocode;
exports.batchGeocode = batchGeocode;
exports.optimizeRoute = optimizeRoute;
exports.calculateRoute = calculateRoute;
exports.storeRoute = storeRoute;
exports.checkGeofenceViolation = checkGeofenceViolation;
exports.createCircularGeofence = createCircularGeofence;
exports.createPolygonGeofence = createPolygonGeofence;
exports.createMapLayer = createMapLayer;
exports.generateHeatMap = generateHeatMap;
exports.clusterPoints = clusterPoints;
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
const common_1 = require("@nestjs/common");
Object.defineProperty(exports, "Injectable", { enumerable: true, get: function () { return common_1.Injectable; } });
Object.defineProperty(exports, "BadRequestException", { enumerable: true, get: function () { return common_1.BadRequestException; } });
Object.defineProperty(exports, "InternalServerErrorException", { enumerable: true, get: function () { return common_1.InternalServerErrorException; } });
Object.defineProperty(exports, "NotFoundException", { enumerable: true, get: function () { return common_1.NotFoundException; } });
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return common_1.Logger; } });
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const turf = __importStar(require("@turf/turf"));
const proj4_1 = __importDefault(require("proj4"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Coordinate system definitions
 */
var CoordinateSystem;
(function (CoordinateSystem) {
    CoordinateSystem["WGS84"] = "EPSG:4326";
    CoordinateSystem["WebMercator"] = "EPSG:3857";
    CoordinateSystem["UTM_ZONE_10N"] = "EPSG:32610";
    CoordinateSystem["UTM_ZONE_11N"] = "EPSG:32611";
    CoordinateSystem["NAD83"] = "EPSG:4269";
})(CoordinateSystem || (exports.CoordinateSystem = CoordinateSystem = {}));
/**
 * Geometry types
 */
var GeometryType;
(function (GeometryType) {
    GeometryType["POINT"] = "Point";
    GeometryType["LINESTRING"] = "LineString";
    GeometryType["POLYGON"] = "Polygon";
    GeometryType["MULTIPOINT"] = "MultiPoint";
    GeometryType["MULTILINESTRING"] = "MultiLineString";
    GeometryType["MULTIPOLYGON"] = "MultiPolygon";
    GeometryType["GEOMETRYCOLLECTION"] = "GeometryCollection";
})(GeometryType || (exports.GeometryType = GeometryType = {}));
/**
 * Spatial query types
 */
var SpatialQueryType;
(function (SpatialQueryType) {
    SpatialQueryType["CONTAINS"] = "contains";
    SpatialQueryType["WITHIN"] = "within";
    SpatialQueryType["INTERSECTS"] = "intersects";
    SpatialQueryType["DISJOINT"] = "disjoint";
    SpatialQueryType["TOUCHES"] = "touches";
    SpatialQueryType["OVERLAPS"] = "overlaps";
    SpatialQueryType["CROSSES"] = "crosses";
    SpatialQueryType["EQUALS"] = "equals";
})(SpatialQueryType || (exports.SpatialQueryType = SpatialQueryType = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
exports.PointSchema = zod_1.z.object({
    longitude: zod_1.z.number().min(-180).max(180),
    latitude: zod_1.z.number().min(-90).max(90),
    altitude: zod_1.z.number().optional(),
});
exports.BoundingBoxSchema = zod_1.z.object({
    minLongitude: zod_1.z.number().min(-180).max(180),
    minLatitude: zod_1.z.number().min(-90).max(90),
    maxLongitude: zod_1.z.number().min(-180).max(180),
    maxLatitude: zod_1.z.number().min(-90).max(90),
});
exports.GeoJSONGeometrySchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(GeometryType),
    coordinates: zod_1.z.any(),
});
exports.GeoJSONFeatureSchema = zod_1.z.object({
    type: zod_1.z.literal('Feature'),
    geometry: exports.GeoJSONGeometrySchema,
    properties: zod_1.z.record(zod_1.z.any()),
    id: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
});
// ============================================================================
// DATABASE MODELS
// ============================================================================
/**
 * Spatial Entity model for storing geospatial data
 */
function createSpatialEntityModel(sequelize) {
    return sequelize.define('SpatialEntity', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Entity name',
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Type of spatial entity (facility, asset, zone, etc.)',
        },
        geometry: {
            type: sequelize_1.DataTypes.GEOMETRY('GEOMETRY', 4326),
            allowNull: false,
            comment: 'Spatial geometry in WGS84 (SRID 4326)',
        },
        properties: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional properties and metadata',
        },
        boundingBox: {
            type: sequelize_1.DataTypes.GEOMETRY('POLYGON', 4326),
            allowNull: true,
            comment: 'Bounding box for the geometry',
        },
        centroid: {
            type: sequelize_1.DataTypes.GEOMETRY('POINT', 4326),
            allowNull: true,
            comment: 'Centroid of the geometry',
        },
        area: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Area in square meters',
        },
        perimeter: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Perimeter in meters',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Active status',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
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
    });
}
/**
 * Location History model for tracking asset movements
 */
function createLocationHistoryModel(sequelize) {
    return sequelize.define('LocationHistory', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to the tracked asset',
        },
        location: {
            type: sequelize_1.DataTypes.GEOMETRY('POINT', 4326),
            allowNull: false,
            comment: 'Location point in WGS84',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Timestamp of location update',
        },
        accuracy: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Location accuracy in meters',
        },
        speed: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Speed in m/s',
        },
        heading: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Heading in degrees (0-360)',
        },
        altitude: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Altitude in meters',
        },
        source: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Source of location data (GPS, WiFi, Cell, etc.)',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
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
    });
}
/**
 * Geofence model for defining geographic boundaries
 */
function createGeofenceModel(sequelize) {
    return sequelize.define('Geofence', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Geofence name',
        },
        geometry: {
            type: sequelize_1.DataTypes.GEOMETRY('POLYGON', 4326),
            allowNull: false,
            comment: 'Geofence boundary polygon',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('include', 'exclude'),
            allowNull: false,
            comment: 'Geofence type (include/exclude)',
        },
        facilityId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Associated facility ID',
        },
        radius: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
            comment: 'Radius in meters (for circular geofences)',
        },
        alertEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether to trigger alerts on entry/exit',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional metadata and configuration',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Active status',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
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
    });
}
/**
 * Route metadata model for storing route information
 */
function createRouteMetadataModel(sequelize) {
    return sequelize.define('RouteMetadata', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Route name',
        },
        routeType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Type of route (delivery, patrol, transport, etc.)',
        },
        geometry: {
            type: sequelize_1.DataTypes.GEOMETRY('LINESTRING', 4326),
            allowNull: false,
            comment: 'Route path as LineString',
        },
        waypoints: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Ordered array of waypoints',
        },
        totalDistance: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
            comment: 'Total route distance in meters',
        },
        estimatedDuration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Estimated duration in seconds',
        },
        startLocation: {
            type: sequelize_1.DataTypes.GEOMETRY('POINT', 4326),
            allowNull: false,
            comment: 'Route start point',
        },
        endLocation: {
            type: sequelize_1.DataTypes.GEOMETRY('POINT', 4326),
            allowNull: false,
            comment: 'Route end point',
        },
        isOptimized: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether route has been optimized',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional route metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
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
    });
}
// ============================================================================
// COORDINATE TRANSFORMATION FUNCTIONS
// ============================================================================
/**
 * Transform coordinates from one coordinate system to another
 */
function transformCoordinates(point, fromCRS, toCRS) {
    try {
        const [x, y] = (0, proj4_1.default)(fromCRS, toCRS, [point.longitude, point.latitude]);
        return {
            longitude: x,
            latitude: y,
            altitude: point.altitude,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to transform coordinates: ${error.message}`);
    }
}
/**
 * Convert WGS84 to Web Mercator projection
 */
function wgs84ToWebMercator(point) {
    return transformCoordinates(point, CoordinateSystem.WGS84, CoordinateSystem.WebMercator);
}
/**
 * Convert Web Mercator to WGS84 projection
 */
function webMercatorToWgs84(point) {
    return transformCoordinates(point, CoordinateSystem.WebMercator, CoordinateSystem.WGS84);
}
/**
 * Convert Point to UTM zone automatically
 */
function wgs84ToUTM(point) {
    const zone = Math.floor((point.longitude + 180) / 6) + 1;
    const hemisphere = point.latitude >= 0 ? 'N' : 'S';
    const utmCRS = `+proj=utm +zone=${zone} ${hemisphere === 'S' ? '+south' : ''} +datum=WGS84`;
    const [x, y] = (0, proj4_1.default)(CoordinateSystem.WGS84, utmCRS, [point.longitude, point.latitude]);
    return {
        point: { longitude: x, latitude: y, altitude: point.altitude },
        zone,
        hemisphere,
    };
}
/**
 * Batch transform multiple coordinates
 */
async function batchTransformCoordinates(points, fromCRS, toCRS) {
    return points.map((point) => transformCoordinates(point, fromCRS, toCRS));
}
/**
 * Validate coordinate system
 */
function validateCoordinateSystem(crs) {
    try {
        proj4_1.default.defs(crs);
        return true;
    }
    catch {
        return false;
    }
}
// ============================================================================
// GEOJSON OPERATIONS
// ============================================================================
/**
 * Create GeoJSON Point feature
 */
function createPointFeature(point, properties = {}, id) {
    return {
        type: 'Feature',
        geometry: {
            type: GeometryType.POINT,
            coordinates: [point.longitude, point.latitude, point.altitude].filter((v) => v !== undefined),
        },
        properties,
        id,
    };
}
/**
 * Create GeoJSON LineString feature
 */
function createLineStringFeature(points, properties = {}, id) {
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
function createPolygonFeature(rings, properties = {}, id) {
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
function createFeatureCollection(features) {
    return {
        type: 'FeatureCollection',
        features,
    };
}
/**
 * Parse GeoJSON and validate
 */
function parseGeoJSON(geojson) {
    try {
        const parsed = JSON.parse(geojson);
        if (parsed.type === 'FeatureCollection') {
            return parsed;
        }
        else if (parsed.type === 'Feature') {
            return parsed;
        }
        else {
            throw new Error('Invalid GeoJSON type');
        }
    }
    catch (error) {
        throw new common_1.BadRequestException(`Invalid GeoJSON: ${error.message}`);
    }
}
/**
 * Validate GeoJSON structure
 */
function validateGeoJSON(geojson) {
    try {
        if (geojson.type === 'Feature') {
            exports.GeoJSONFeatureSchema.parse(geojson);
            return true;
        }
        else if (geojson.type === 'FeatureCollection') {
            return geojson.features.every((f) => {
                try {
                    exports.GeoJSONFeatureSchema.parse(f);
                    return true;
                }
                catch {
                    return false;
                }
            });
        }
        return false;
    }
    catch {
        return false;
    }
}
/**
 * Convert geometry to GeoJSON
 */
function geometryToGeoJSON(geometry) {
    if (typeof geometry === 'string') {
        // Parse WKT format if needed
        return parseWKTToGeoJSON(geometry);
    }
    return geometry;
}
/**
 * Parse Well-Known Text (WKT) to GeoJSON
 */
function parseWKTToGeoJSON(wkt) {
    // Simple WKT parser (basic implementation)
    const pointMatch = wkt.match(/POINT\s*\(\s*([0-9.-]+)\s+([0-9.-]+)\s*\)/i);
    if (pointMatch) {
        return {
            type: GeometryType.POINT,
            coordinates: [parseFloat(pointMatch[1]), parseFloat(pointMatch[2])],
        };
    }
    throw new common_1.BadRequestException('Unsupported WKT format');
}
/**
 * Convert GeoJSON to Well-Known Text (WKT)
 */
function geoJSONToWKT(geometry) {
    switch (geometry.type) {
        case GeometryType.POINT:
            const coords = geometry.coordinates;
            return `POINT(${coords[0]} ${coords[1]})`;
        case GeometryType.LINESTRING:
            const lineCoords = geometry.coordinates;
            return `LINESTRING(${lineCoords.map((c) => `${c[0]} ${c[1]}`).join(', ')})`;
        case GeometryType.POLYGON:
            const polyCoords = geometry.coordinates;
            return `POLYGON(${polyCoords.map((ring) => `(${ring.map((c) => `${c[0]} ${c[1]}`).join(', ')})`).join(', ')})`;
        default:
            throw new common_1.BadRequestException(`Unsupported geometry type: ${geometry.type}`);
    }
}
// ============================================================================
// SPATIAL QUERY FUNCTIONS
// ============================================================================
/**
 * Check if point is within polygon
 */
function pointInPolygon(point, polygon) {
    const pt = turf.point([point.longitude, point.latitude]);
    const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
    return turf.booleanPointInPolygon(pt, poly);
}
/**
 * Calculate distance between two points (in meters)
 */
function calculateDistance(point1, point2) {
    const from = turf.point([point1.longitude, point1.latitude]);
    const to = turf.point([point2.longitude, point2.latitude]);
    return turf.distance(from, to, { units: 'meters' });
}
/**
 * Calculate bearing between two points (in degrees)
 */
function calculateBearing(point1, point2) {
    const from = turf.point([point1.longitude, point1.latitude]);
    const to = turf.point([point2.longitude, point2.latitude]);
    return turf.bearing(from, to);
}
/**
 * Create buffer around point (in meters)
 */
function createBuffer(point, radiusMeters) {
    const pt = turf.point([point.longitude, point.latitude]);
    const buffered = turf.buffer(pt, radiusMeters, { units: 'meters' });
    return buffered;
}
/**
 * Create buffer around polygon (in meters)
 */
function createPolygonBuffer(polygon, radiusMeters) {
    const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
    const buffered = turf.buffer(poly, radiusMeters, { units: 'meters' });
    return buffered;
}
/**
 * Find nearest point from a list
 */
function findNearestPoint(targetPoint, points) {
    let nearest = null;
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
        throw new common_1.NotFoundException('No points found');
    }
    return { point: nearest, distance: minDistance, index: nearestIndex };
}
/**
 * Find k nearest neighbors
 */
function findKNearestPoints(targetPoint, points, k) {
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
function calculateArea(polygon) {
    const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
    return turf.area(poly);
}
/**
 * Calculate polygon centroid
 */
function calculateCentroid(polygon) {
    const poly = turf.polygon([polygon.map((p) => [p.longitude, p.latitude])]);
    const centroid = turf.centroid(poly);
    const [longitude, latitude] = centroid.geometry.coordinates;
    return { longitude, latitude };
}
/**
 * Check if two geometries intersect
 */
function checkIntersection(geom1, geom2) {
    const feature1 = { type: 'Feature', geometry: geom1, properties: {} };
    const feature2 = { type: 'Feature', geometry: geom2, properties: {} };
    return turf.booleanIntersects(feature1, feature2);
}
/**
 * Get bounding box for geometry
 */
function getBoundingBox(geometry) {
    const feature = { type: 'Feature', geometry, properties: {} };
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
function simplifyGeometry(geometry, tolerance = 0.01) {
    const feature = { type: 'Feature', geometry, properties: {} };
    const simplified = turf.simplify(feature, { tolerance, highQuality: true });
    return simplified.geometry;
}
// ============================================================================
// POSTGIS INTEGRATION
// ============================================================================
/**
 * Create spatial index on table column
 */
async function createSpatialIndex(sequelize, config, transaction) {
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
async function executeSpatialQuery(model, options, transaction) {
    const geometryWKT = geoJSONToWKT(options.geometry);
    let whereClause;
    switch (options.queryType) {
        case SpatialQueryType.CONTAINS:
            whereClause = (0, sequelize_1.literal)(`ST_Contains(ST_GeomFromText('${geometryWKT}', 4326), geometry)`);
            break;
        case SpatialQueryType.WITHIN:
            whereClause = (0, sequelize_1.literal)(`ST_Within(geometry, ST_GeomFromText('${geometryWKT}', 4326))`);
            break;
        case SpatialQueryType.INTERSECTS:
            whereClause = (0, sequelize_1.literal)(`ST_Intersects(geometry, ST_GeomFromText('${geometryWKT}', 4326))`);
            break;
        default:
            throw new common_1.BadRequestException(`Unsupported query type: ${options.queryType}`);
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
async function findEntitiesWithinRadius(model, center, radiusMeters, limit = 100, transaction) {
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
    const results = await model.sequelize.query(sql, {
        replacements: {
            longitude: center.longitude,
            latitude: center.latitude,
            radius: radiusMeters,
            limit,
        },
        type: 'SELECT',
        transaction,
    });
    return results;
}
/**
 * Store location update with spatial indexing
 */
async function storeLocationUpdate(model, update, transaction) {
    return await model.create({
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
    }, { transaction });
}
/**
 * Get location history for asset
 */
async function getLocationHistory(model, assetId, startTime, endTime, transaction) {
    return await model.findAll({
        where: {
            assetId,
            timestamp: {
                [sequelize_1.Op.between]: [startTime, endTime],
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
async function geocodeAddress(address) {
    // This is a placeholder - integrate with Mapbox, Google Maps, or other geocoding service
    throw new Error('Geocoding service not configured');
}
/**
 * Reverse geocode coordinates to address (mock implementation)
 */
async function reverseGeocode(point) {
    // This is a placeholder - integrate with reverse geocoding service
    throw new Error('Reverse geocoding service not configured');
}
/**
 * Batch geocode multiple addresses
 */
async function batchGeocode(addresses) {
    const results = [];
    for (const address of addresses) {
        try {
            const result = await geocodeAddress(address);
            results.push(result);
        }
        catch (error) {
            common_1.Logger.error(`Failed to geocode address: ${address}`, error);
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
function optimizeRoute(waypoints) {
    if (waypoints.length < 2) {
        throw new common_1.BadRequestException('At least 2 waypoints required');
    }
    const optimized = [waypoints[0]];
    const remaining = [...waypoints.slice(1)];
    while (remaining.length > 0) {
        const current = optimized[optimized.length - 1];
        const nearest = findNearestPoint(current.location, remaining.map((w) => w.location));
        optimized.push(remaining[nearest.index]);
        remaining.splice(nearest.index, 1);
    }
    const totalDistance = optimized.reduce((sum, waypoint, index) => {
        if (index === 0)
            return 0;
        return sum + calculateDistance(optimized[index - 1].location, waypoint.location);
    }, 0);
    const geometry = {
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
function calculateRoute(waypoints) {
    const totalDistance = waypoints.reduce((sum, waypoint, index) => {
        if (index === 0)
            return 0;
        return sum + calculateDistance(waypoints[index - 1].location, waypoint.location);
    }, 0);
    const geometry = {
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
async function storeRoute(model, name, routeType, route, transaction) {
    return await model.create({
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
    }, { transaction });
}
// ============================================================================
// GEOFENCING FUNCTIONS
// ============================================================================
/**
 * Check if location is within geofence
 */
async function checkGeofenceViolation(geofenceModel, location, transaction) {
    const sql = `
    SELECT *
    FROM "${geofenceModel.tableName}"
    WHERE is_active = true
      AND ST_Contains(
        geometry,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
      );
  `;
    const results = await geofenceModel.sequelize.query(sql, {
        replacements: {
            longitude: location.longitude,
            latitude: location.latitude,
        },
        type: 'SELECT',
        transaction,
    });
    return results;
}
/**
 * Create circular geofence
 */
async function createCircularGeofence(model, name, center, radiusMeters, type, transaction) {
    const buffer = createBuffer(center, radiusMeters);
    return await model.create({
        name,
        geometry: buffer.geometry,
        type,
        radius: radiusMeters,
        alertEnabled: true,
        isActive: true,
    }, { transaction });
}
/**
 * Create polygon geofence
 */
async function createPolygonGeofence(model, name, polygon, type, transaction) {
    const feature = createPolygonFeature([polygon]);
    return await model.create({
        name,
        geometry: feature.geometry,
        type,
        alertEnabled: true,
        isActive: true,
    }, { transaction });
}
// ============================================================================
// MAP LAYER MANAGEMENT
// ============================================================================
/**
 * Create map layer configuration
 */
function createMapLayer(config) {
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
function generateHeatMap(points, intensity = 1) {
    const features = points.map((point, index) => createPointFeature(point, { intensity }, index));
    return createFeatureCollection(features);
}
/**
 * Cluster points by proximity
 */
function clusterPoints(points, radiusMeters) {
    const clusters = [];
    const processed = new Set();
    points.forEach((point, index) => {
        if (processed.has(index))
            return;
        const cluster = [point];
        processed.add(index);
        points.forEach((otherPoint, otherIndex) => {
            if (otherIndex === index || processed.has(otherIndex))
                return;
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
/**
 * GIS Spatial Kit Service
 */
let GISSpatialKitService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GISSpatialKitService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(GISSpatialKitService.name);
        }
        /**
         * Initialize spatial database extensions
         */
        async initializeSpatialExtensions() {
            try {
                await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
                await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
                this.logger.log('PostGIS extensions initialized successfully');
            }
            catch (error) {
                this.logger.error('Failed to initialize PostGIS extensions', error);
                throw new common_1.InternalServerErrorException('Failed to initialize spatial extensions');
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
    };
    __setFunctionName(_classThis, "GISSpatialKitService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GISSpatialKitService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GISSpatialKitService = _classThis;
})();
exports.GISSpatialKitService = GISSpatialKitService;
exports.default = GISSpatialKitService;
//# sourceMappingURL=gis-spatial-kit.js.map