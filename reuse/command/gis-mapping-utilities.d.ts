/**
 * @fileoverview Advanced GIS and Mapping Utilities
 *
 * This module provides a comprehensive suite of production-grade Geographic Information System (GIS)
 * and mapping utilities for emergency response command and control systems. It implements advanced
 * geospatial algorithms, coordinate transformations, spatial analysis, and geographic data processing
 * capabilities optimized for real-time incident management and resource deployment.
 *
 * @module GISMappingUtilities
 * @category GIS
 * @subcategory Geospatial Operations
 *
 * @description
 * **Core Capabilities:**
 *
 * 1. **Coordinate Systems & Transformations:**
 *    - WGS84 (World Geodetic System 1984) - GPS standard
 *    - UTM (Universal Transverse Mercator) - metric grid system
 *    - Web Mercator (EPSG:3857) - web mapping standard
 *    - Lat/Lng decimal degrees and DMS (Degrees, Minutes, Seconds)
 *    - Datum transformations and ellipsoid calculations
 *
 * 2. **Distance & Bearing Calculations:**
 *    - Haversine formula - great-circle distance (accuracy: ±0.5%)
 *    - Vincenty formula - ellipsoidal distance (accuracy: ±0.5mm)
 *    - Rhumb line (loxodrome) calculations for constant bearing
 *    - Initial and final bearing computations
 *    - Azimuth calculations for directional analysis
 *
 * 3. **Geofencing & Spatial Analysis:**
 *    - Point-in-polygon using ray casting algorithm
 *    - Point-in-circle with geodetic corrections
 *    - Buffer zone generation with configurable precision
 *    - Polygon intersection and union operations
 *    - Coverage area calculations with projection handling
 *
 * 4. **Route Optimization:**
 *    - Nearest neighbor heuristic for TSP
 *    - 2-opt local search optimization
 *    - Distance matrix computation
 *    - Multi-waypoint route planning
 *    - Travel time estimation with traffic modeling
 *
 * 5. **Spatial Indexing:**
 *    - Quadtree spatial indexing for point data
 *    - Geohash encoding/decoding (base32)
 *    - S2 cell approximation for hierarchical indexing
 *    - R-tree bounding box optimization
 *
 * 6. **GeoJSON Processing:**
 *    - Type-safe GeoJSON validation and manipulation
 *    - Feature collection filtering and transformation
 *    - Geometry simplification (Douglas-Peucker)
 *    - Coordinate precision control
 *
 * 7. **Spatial Clustering:**
 *    - K-means clustering for geographic points
 *    - DBSCAN (Density-Based Spatial Clustering)
 *    - Heat map generation with kernel density estimation
 *    - Hotspot analysis for incident concentration
 *
 * 8. **Performance Optimizations:**
 *    - Lazy evaluation for expensive calculations
 *    - Memoization of frequently accessed computations
 *    - Spatial indexing for O(log n) query performance
 *    - Vectorized operations where applicable
 *    - PostGIS integration support for database-backed operations
 *
 * @author Emergency Response Platform - GIS Team
 * @version 2.0.0
 * @license MIT
 *
 * @see {@link https://proj.org/} PROJ coordinate transformation library
 * @see {@link https://postgis.net/} PostGIS spatial database extension
 * @see {@link https://tools.ietf.org/html/rfc7946} GeoJSON RFC 7946
 *
 * @example
 * // Calculate distance between two emergency incidents
 * const distance = calculateHaversineDistance(
 *   { lat: 40.7128, lng: -74.0060 }, // NYC
 *   { lat: 34.0522, lng: -118.2437 }  // LA
 * );
 * console.log(`Distance: ${distance.toFixed(2)} meters`);
 *
 * @example
 * // Check if incident is within response zone
 * const incidentPoint = { lat: 40.7580, lng: -73.9855 };
 * const responseZone = [
 *   { lat: 40.7489, lng: -73.9680 },
 *   { lat: 40.7589, lng: -73.9680 },
 *   { lat: 40.7589, lng: -73.9980 },
 *   { lat: 40.7489, lng: -73.9980 }
 * ];
 * const isInZone = isPointInPolygon(incidentPoint, responseZone);
 *
 * @example
 * // Optimize route for multiple incident visits
 * const incidents = [
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 40.7589, lng: -73.9851 },
 *   { lat: 40.7306, lng: -73.9352 }
 * ];
 * const optimizedRoute = optimizeRouteGreedy(incidents);
 */
/**
 * Geographic coordinate in WGS84 datum (latitude/longitude)
 *
 * @typedef {Object} Coordinate
 * @property {number} lat - Latitude in decimal degrees (-90 to 90)
 * @property {number} lng - Longitude in decimal degrees (-180 to 180)
 */
export interface Coordinate {
    lat: number;
    lng: number;
}
/**
 * UTM (Universal Transverse Mercator) coordinate
 *
 * @typedef {Object} UTMCoordinate
 * @property {number} easting - Easting in meters (false easting: 500,000m)
 * @property {number} northing - Northing in meters
 * @property {number} zone - UTM zone number (1-60)
 * @property {string} hemisphere - 'N' for northern, 'S' for southern hemisphere
 */
export interface UTMCoordinate {
    easting: number;
    northing: number;
    zone: number;
    hemisphere: 'N' | 'S';
}
/**
 * DMS (Degrees, Minutes, Seconds) coordinate representation
 *
 * @typedef {Object} DMSCoordinate
 */
export interface DMSCoordinate {
    latitude: {
        degrees: number;
        minutes: number;
        seconds: number;
        direction: 'N' | 'S';
    };
    longitude: {
        degrees: number;
        minutes: number;
        seconds: number;
        direction: 'E' | 'W';
    };
}
/**
 * Bounding box in geographic coordinates
 *
 * @typedef {Object} BoundingBox
 */
export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}
/**
 * GeoJSON Point geometry
 */
export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number];
}
/**
 * GeoJSON LineString geometry
 */
export interface GeoJSONLineString {
    type: 'LineString';
    coordinates: Array<[number, number]>;
}
/**
 * GeoJSON Polygon geometry
 */
export interface GeoJSONPolygon {
    type: 'Polygon';
    coordinates: Array<Array<[number, number]>>;
}
/**
 * GeoJSON geometry union type
 */
export type GeoJSONGeometry = GeoJSONPoint | GeoJSONLineString | GeoJSONPolygon;
/**
 * GeoJSON Feature with generic properties
 */
export interface GeoJSONFeature<P = Record<string, unknown>> {
    type: 'Feature';
    geometry: GeoJSONGeometry;
    properties: P;
    id?: string | number;
}
/**
 * GeoJSON Feature Collection
 */
export interface GeoJSONFeatureCollection<P = Record<string, unknown>> {
    type: 'FeatureCollection';
    features: Array<GeoJSONFeature<P>>;
}
/**
 * Spatial cluster result
 */
export interface Cluster {
    centroid: Coordinate;
    points: Coordinate[];
    id: number;
}
/**
 * Distance calculation result with metadata
 */
export interface DistanceResult {
    distance: number;
    unit: 'meters' | 'kilometers' | 'miles' | 'nautical_miles';
    method: 'haversine' | 'vincenty' | 'euclidean';
}
/**
 * Route optimization result
 */
export interface RouteOptimizationResult {
    route: Coordinate[];
    totalDistance: number;
    segmentDistances: number[];
    optimizationMethod: string;
}
/**
 * Heat map cell
 */
export interface HeatMapCell {
    coordinate: Coordinate;
    intensity: number;
    count: number;
}
/**
 * Geohash precision levels (characters)
 */
export type GeohashPrecision = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
/**
 * Travel mode for time estimation
 */
export type TravelMode = 'driving' | 'walking' | 'bicycling' | 'emergency_vehicle';
/**
 * Conditional type to extract geometry type from GeoJSON
 */
export type ExtractGeometry<T> = T extends GeoJSONFeature<infer _P> ? T['geometry'] : never;
/**
 * Mapped type for coordinate transformations
 */
export type CoordinateTransform<T extends Coordinate> = {
    [K in keyof T]: T[K] extends number ? number : T[K];
};
/**
 * Converts decimal degrees to radians
 *
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 *
 * @example
 * const radians = degreesToRadians(180); // π
 */
export declare function degreesToRadians(degrees: number): number;
/**
 * Converts radians to decimal degrees
 *
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 *
 * @example
 * const degrees = radiansToDegrees(Math.PI); // 180
 */
export declare function radiansToDegrees(radians: number): number;
/**
 * Converts decimal degrees coordinate to DMS (Degrees, Minutes, Seconds) format
 *
 * @param {Coordinate} coord - Coordinate in decimal degrees
 * @returns {DMSCoordinate} Coordinate in DMS format
 *
 * @example
 * const dms = coordinateToDMS({ lat: 40.7128, lng: -74.0060 });
 * // Result: 40°42'46"N, 74°0'22"W
 */
export declare function coordinateToDMS(coord: Coordinate): DMSCoordinate;
/**
 * Converts DMS (Degrees, Minutes, Seconds) to decimal degrees
 *
 * @param {DMSCoordinate} dms - Coordinate in DMS format
 * @returns {Coordinate} Coordinate in decimal degrees
 *
 * @example
 * const coord = dmsToCoordinate({
 *   latitude: { degrees: 40, minutes: 42, seconds: 46, direction: 'N' },
 *   longitude: { degrees: 74, minutes: 0, seconds: 22, direction: 'W' }
 * });
 */
export declare function dmsToCoordinate(dms: DMSCoordinate): Coordinate;
/**
 * Converts WGS84 coordinate to UTM (Universal Transverse Mercator)
 *
 * Uses the Transverse Mercator projection with Krueger's formulas for high accuracy.
 *
 * @param {Coordinate} coord - WGS84 coordinate
 * @returns {UTMCoordinate} UTM coordinate
 *
 * @example
 * const utm = coordinateToUTM({ lat: 40.7128, lng: -74.0060 });
 * // Zone 18N, Easting: ~583960m, Northing: ~4507523m
 */
export declare function coordinateToUTM(coord: Coordinate): UTMCoordinate;
/**
 * Converts UTM coordinate to WGS84 lat/lng
 *
 * @param {UTMCoordinate} utm - UTM coordinate
 * @returns {Coordinate} WGS84 coordinate
 *
 * @example
 * const coord = utmToCoordinate({
 *   easting: 583960,
 *   northing: 4507523,
 *   zone: 18,
 *   hemisphere: 'N'
 * });
 */
export declare function utmToCoordinate(utm: UTMCoordinate): Coordinate;
/**
 * Converts WGS84 to Web Mercator (EPSG:3857) projection
 *
 * Used by most web mapping libraries (Google Maps, OpenStreetMap, Mapbox)
 *
 * @param {Coordinate} coord - WGS84 coordinate
 * @returns {[number, number]} Web Mercator coordinates [x, y] in meters
 *
 * @example
 * const [x, y] = coordinateToWebMercator({ lat: 40.7128, lng: -74.0060 });
 */
export declare function coordinateToWebMercator(coord: Coordinate): [number, number];
/**
 * Converts Web Mercator (EPSG:3857) to WGS84
 *
 * @param {number} x - Web Mercator X coordinate (meters)
 * @param {number} y - Web Mercator Y coordinate (meters)
 * @returns {Coordinate} WGS84 coordinate
 *
 * @example
 * const coord = webMercatorToCoordinate(-8238310.938, 4970241.327);
 */
export declare function webMercatorToCoordinate(x: number, y: number): Coordinate;
/**
 * Calculates great-circle distance between two points using Haversine formula
 *
 * Accuracy: ±0.5% for most distances. Fast and suitable for most applications.
 * Time complexity: O(1)
 *
 * @param {Coordinate} point1 - First coordinate
 * @param {Coordinate} point2 - Second coordinate
 * @returns {number} Distance in meters
 *
 * @example
 * const distance = calculateHaversineDistance(
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 }
 * ); // ~3936 km
 */
export declare function calculateHaversineDistance(point1: Coordinate, point2: Coordinate): number;
/**
 * Calculates geodesic distance using Vincenty formula (ellipsoidal earth model)
 *
 * Accuracy: ±0.5mm. More accurate than Haversine but computationally expensive.
 * Best for high-precision applications. Iterative algorithm.
 *
 * @param {Coordinate} point1 - First coordinate
 * @param {Coordinate} point2 - Second coordinate
 * @param {number} [maxIterations=100] - Maximum iterations for convergence
 * @returns {number} Distance in meters
 *
 * @example
 * const distance = calculateVincentyDistance(
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 }
 * );
 */
export declare function calculateVincentyDistance(point1: Coordinate, point2: Coordinate, maxIterations?: number): number;
/**
 * Calculates rhumb line (loxodrome) distance - path of constant bearing
 *
 * Useful for navigation as it maintains constant compass bearing.
 *
 * @param {Coordinate} point1 - First coordinate
 * @param {Coordinate} point2 - Second coordinate
 * @returns {number} Distance in meters
 *
 * @example
 * const distance = calculateRhumbLineDistance(
 *   { lat: 50.3667, lng: -4.1333 },
 *   { lat: 42.3511, lng: -71.0406 }
 * );
 */
export declare function calculateRhumbLineDistance(point1: Coordinate, point2: Coordinate): number;
/**
 * Converts distance from meters to specified unit
 *
 * @param {number} meters - Distance in meters
 * @param {'km' | 'miles' | 'nautical_miles'} unit - Target unit
 * @returns {number} Distance in target unit
 */
export declare function convertDistance(meters: number, unit: 'km' | 'miles' | 'nautical_miles'): number;
/**
 * Calculates initial bearing (forward azimuth) from point1 to point2
 *
 * Returns bearing in degrees (0-360) where 0° is North, 90° is East.
 *
 * @param {Coordinate} point1 - Starting point
 * @param {Coordinate} point2 - Destination point
 * @returns {number} Initial bearing in degrees (0-360)
 *
 * @example
 * const bearing = calculateInitialBearing(
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 }
 * ); // ~256° (WSW)
 */
export declare function calculateInitialBearing(point1: Coordinate, point2: Coordinate): number;
/**
 * Calculates final bearing (back azimuth) when arriving at point2 from point1
 *
 * @param {Coordinate} point1 - Starting point
 * @param {Coordinate} point2 - Destination point
 * @returns {number} Final bearing in degrees (0-360)
 */
export declare function calculateFinalBearing(point1: Coordinate, point2: Coordinate): number;
/**
 * Calculates destination point given start point, bearing, and distance
 *
 * @param {Coordinate} start - Starting coordinate
 * @param {number} bearing - Bearing in degrees (0-360)
 * @param {number} distance - Distance in meters
 * @returns {Coordinate} Destination coordinate
 *
 * @example
 * const dest = calculateDestinationPoint(
 *   { lat: 40.7128, lng: -74.0060 },
 *   45, // Northeast
 *   10000 // 10km
 * );
 */
export declare function calculateDestinationPoint(start: Coordinate, bearing: number, distance: number): Coordinate;
/**
 * Calculates compass direction name from bearing
 *
 * @param {number} bearing - Bearing in degrees (0-360)
 * @param {boolean} [precise=false] - Use 16-point compass if true, 8-point if false
 * @returns {string} Compass direction (e.g., 'N', 'NE', 'E', 'NNE')
 */
export declare function bearingToCompassDirection(bearing: number, precise?: boolean): string;
/**
 * Determines if a point is inside a polygon using ray casting algorithm
 *
 * Time complexity: O(n) where n is number of polygon vertices
 *
 * @param {Coordinate} point - Point to test
 * @param {Coordinate[]} polygon - Polygon vertices (closed loop not required)
 * @returns {boolean} True if point is inside polygon
 *
 * @example
 * const isInside = isPointInPolygon(
 *   { lat: 40.7580, lng: -73.9855 },
 *   [
 *     { lat: 40.7489, lng: -73.9680 },
 *     { lat: 40.7589, lng: -73.9680 },
 *     { lat: 40.7589, lng: -73.9980 },
 *     { lat: 40.7489, lng: -73.9980 }
 *   ]
 * );
 */
export declare function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean;
/**
 * Checks if a point is within a circular geofence (geodetic circle)
 *
 * @param {Coordinate} point - Point to test
 * @param {Coordinate} center - Center of circle
 * @param {number} radius - Radius in meters
 * @returns {boolean} True if point is within radius
 *
 * @example
 * const isInCircle = isPointInCircle(
 *   { lat: 40.7580, lng: -73.9855 },
 *   { lat: 40.7489, lng: -73.9680 },
 *   5000 // 5km radius
 * );
 */
export declare function isPointInCircle(point: Coordinate, center: Coordinate, radius: number): boolean;
/**
 * Generates a circular buffer zone around a point
 *
 * @param {Coordinate} center - Center point
 * @param {number} radius - Radius in meters
 * @param {number} [segments=32] - Number of segments (higher = smoother circle)
 * @returns {Coordinate[]} Array of coordinates forming the circle
 *
 * @example
 * const buffer = generateCircularBuffer({ lat: 40.7128, lng: -74.0060 }, 1000, 64);
 */
export declare function generateCircularBuffer(center: Coordinate, radius: number, segments?: number): Coordinate[];
/**
 * Calculates the bounding box of a set of coordinates
 *
 * @param {Coordinate[]} coordinates - Array of coordinates
 * @returns {BoundingBox} Bounding box containing all coordinates
 *
 * @example
 * const bbox = calculateBoundingBox([
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 },
 *   { lat: 41.8781, lng: -87.6298 }
 * ]);
 */
export declare function calculateBoundingBox(coordinates: Coordinate[]): BoundingBox;
/**
 * Checks if two bounding boxes intersect
 *
 * @param {BoundingBox} bbox1 - First bounding box
 * @param {BoundingBox} bbox2 - Second bounding box
 * @returns {boolean} True if bounding boxes intersect
 */
export declare function doBoundingBoxesIntersect(bbox1: BoundingBox, bbox2: BoundingBox): boolean;
/**
 * Calculates the area of a polygon in square meters (spherical earth approximation)
 *
 * Uses the spherical excess method. For more accurate results with large polygons,
 * consider using PostGIS ST_Area with appropriate projection.
 *
 * @param {Coordinate[]} polygon - Polygon vertices
 * @returns {number} Area in square meters
 *
 * @example
 * const area = calculatePolygonArea([
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 40.7589, lng: -73.9851 },
 *   { lat: 40.7306, lng: -73.9352 }
 * ]);
 */
export declare function calculatePolygonArea(polygon: Coordinate[]): number;
/**
 * Optimizes route using greedy nearest neighbor algorithm
 *
 * Time complexity: O(n²)
 * Good for quick approximations. For optimal solutions, use 2-opt refinement.
 *
 * @param {Coordinate[]} waypoints - Unordered waypoints to visit
 * @param {Coordinate} [start] - Starting point (uses first waypoint if not provided)
 * @returns {RouteOptimizationResult} Optimized route
 *
 * @example
 * const route = optimizeRouteGreedy([
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 40.7589, lng: -73.9851 },
 *   { lat: 40.7306, lng: -73.9352 }
 * ]);
 */
export declare function optimizeRouteGreedy(waypoints: Coordinate[], start?: Coordinate): RouteOptimizationResult;
/**
 * Optimizes route using 2-opt local search algorithm
 *
 * Improves an existing route by iteratively removing crossing edges.
 * Time complexity: O(n²) per iteration, typically converges quickly.
 *
 * @param {Coordinate[]} route - Initial route to optimize
 * @param {number} [maxIterations=100] - Maximum optimization iterations
 * @returns {RouteOptimizationResult} Optimized route
 *
 * @example
 * const initial = optimizeRouteGreedy(waypoints);
 * const optimized = optimizeRoute2Opt(initial.route);
 */
export declare function optimizeRoute2Opt(route: Coordinate[], maxIterations?: number): RouteOptimizationResult;
/**
 * Calculates distance matrix for all pairs of points
 *
 * Useful for route optimization algorithms and clustering.
 * Time complexity: O(n²)
 *
 * @param {Coordinate[]} points - Array of coordinates
 * @returns {number[][]} Distance matrix where matrix[i][j] is distance from i to j
 *
 * @example
 * const matrix = calculateDistanceMatrix([
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 40.7589, lng: -73.9851 },
 *   { lat: 40.7306, lng: -73.9352 }
 * ]);
 */
export declare function calculateDistanceMatrix(points: Coordinate[]): number[][];
/**
 * Estimates travel time between two points
 *
 * Uses simplified model. For production, integrate with real routing APIs
 * (Google Maps, Mapbox, OSRM) for accurate traffic-aware estimates.
 *
 * @param {Coordinate} start - Start point
 * @param {Coordinate} end - End point
 * @param {TravelMode} mode - Travel mode
 * @returns {number} Estimated travel time in seconds
 *
 * @example
 * const travelTime = estimateTravelTime(
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 40.7589, lng: -73.9851 },
 *   'emergency_vehicle'
 * );
 */
export declare function estimateTravelTime(start: Coordinate, end: Coordinate, mode: TravelMode): number;
/**
 * Encodes a coordinate to geohash string
 *
 * Geohash is a hierarchical spatial index using base32 encoding.
 * Longer hashes = higher precision. 6 chars ≈ ±0.61km, 9 chars ≈ ±2.4m
 *
 * @param {Coordinate} coord - Coordinate to encode
 * @param {GeohashPrecision} [precision=9] - Number of characters (1-12)
 * @returns {string} Geohash string
 *
 * @example
 * const hash = encodeGeohash({ lat: 40.7128, lng: -74.0060 }, 9);
 * // Returns: "dr5regw3p"
 */
export declare function encodeGeohash(coord: Coordinate, precision?: GeohashPrecision): string;
/**
 * Decodes a geohash string to coordinate bounds
 *
 * @param {string} geohash - Geohash string
 * @returns {BoundingBox} Bounding box of the geohash cell
 *
 * @example
 * const bounds = decodeGeohash('dr5regw3p');
 */
export declare function decodeGeohash(geohash: string): BoundingBox;
/**
 * Finds neighboring geohash cells
 *
 * @param {string} geohash - Center geohash
 * @returns {Record<string, string>} Object with neighbor hashes (n, ne, e, se, s, sw, w, nw)
 *
 * @example
 * const neighbors = getGeohashNeighbors('dr5regw3p');
 * console.log(neighbors.n); // Northern neighbor
 */
export declare function getGeohashNeighbors(geohash: string): Record<string, string>;
/**
 * Validates GeoJSON geometry structure
 *
 * @param {unknown} geometry - Object to validate
 * @returns {boolean} True if valid GeoJSON geometry
 *
 * @example
 * const isValid = validateGeoJSONGeometry({
 *   type: 'Point',
 *   coordinates: [-74.0060, 40.7128]
 * });
 */
export declare function validateGeoJSONGeometry(geometry: unknown): geometry is GeoJSONGeometry;
/**
 * Converts Coordinate to GeoJSON Point
 *
 * @param {Coordinate} coord - Coordinate
 * @returns {GeoJSONPoint} GeoJSON Point geometry
 *
 * @example
 * const point = coordinateToGeoJSONPoint({ lat: 40.7128, lng: -74.0060 });
 */
export declare function coordinateToGeoJSONPoint(coord: Coordinate): GeoJSONPoint;
/**
 * Converts Coordinate array to GeoJSON LineString
 *
 * @param {Coordinate[]} coords - Array of coordinates
 * @returns {GeoJSONLineString} GeoJSON LineString geometry
 */
export declare function coordinatesToGeoJSONLineString(coords: Coordinate[]): GeoJSONLineString;
/**
 * Converts Coordinate array to GeoJSON Polygon
 *
 * @param {Coordinate[]} coords - Array of coordinates (automatically closed)
 * @returns {GeoJSONPolygon} GeoJSON Polygon geometry
 */
export declare function coordinatesToGeoJSONPolygon(coords: Coordinate[]): GeoJSONPolygon;
/**
 * Simplifies a line using Douglas-Peucker algorithm
 *
 * Reduces number of points while preserving shape.
 * Time complexity: O(n log n) average, O(n²) worst case
 *
 * @param {Coordinate[]} line - Original line coordinates
 * @param {number} tolerance - Tolerance in meters
 * @returns {Coordinate[]} Simplified line
 *
 * @example
 * const simplified = simplifyLine(trackingPoints, 50); // 50m tolerance
 */
export declare function simplifyLine(line: Coordinate[], tolerance: number): Coordinate[];
/**
 * Performs K-means clustering on geographic points
 *
 * Time complexity: O(k * n * i) where k=clusters, n=points, i=iterations
 *
 * @param {Coordinate[]} points - Points to cluster
 * @param {number} k - Number of clusters
 * @param {number} [maxIterations=100] - Maximum iterations
 * @returns {Cluster[]} Array of clusters
 *
 * @example
 * const clusters = kMeansClustering(incidentLocations, 5);
 * console.log(clusters[0].centroid); // Center of first cluster
 */
export declare function kMeansClustering(points: Coordinate[], k: number, maxIterations?: number): Cluster[];
/**
 * Calculates the geographic centroid of a set of points
 *
 * Uses cartesian averaging in 3D space for accuracy.
 *
 * @param {Coordinate[]} points - Array of coordinates
 * @returns {Coordinate} Centroid coordinate
 *
 * @example
 * const center = calculateCentroid(incidentLocations);
 */
export declare function calculateCentroid(points: Coordinate[]): Coordinate;
/**
 * Performs DBSCAN (Density-Based Spatial Clustering) on geographic points
 *
 * Better than K-means for finding clusters of arbitrary shape and handling noise.
 * Time complexity: O(n²) with naive implementation, O(n log n) with spatial index
 *
 * @param {Coordinate[]} points - Points to cluster
 * @param {number} epsilon - Maximum distance in meters for neighborhood
 * @param {number} minPoints - Minimum points to form a dense region
 * @returns {Cluster[]} Array of clusters (noise points excluded)
 *
 * @example
 * const clusters = dbscanClustering(incidentLocations, 500, 3);
 * // Clusters incidents within 500m with at least 3 incidents
 */
export declare function dbscanClustering(points: Coordinate[], epsilon: number, minPoints: number): Cluster[];
/**
 * Generates heat map from point data using kernel density estimation
 *
 * @param {Coordinate[]} points - Input points
 * @param {BoundingBox} bounds - Area to generate heat map for
 * @param {number} gridSize - Number of cells per side (e.g., 50 = 50x50 grid)
 * @param {number} [bandwidth=1000] - Kernel bandwidth in meters
 * @returns {HeatMapCell[]} Array of heat map cells with intensity values
 *
 * @example
 * const heatmap = generateHeatMap(
 *   incidentLocations,
 *   calculateBoundingBox(incidentLocations),
 *   50,
 *   2000 // 2km bandwidth
 * );
 */
export declare function generateHeatMap(points: Coordinate[], bounds: BoundingBox, gridSize: number, bandwidth?: number): HeatMapCell[];
/**
 * Validates if latitude is within valid range
 *
 * @param {number} lat - Latitude to validate
 * @returns {boolean} True if valid
 */
export declare function isValidLatitude(lat: number): boolean;
/**
 * Validates if longitude is within valid range
 *
 * @param {number} lng - Longitude to validate
 * @returns {boolean} True if valid
 */
export declare function isValidLongitude(lng: number): boolean;
/**
 * Validates coordinate object
 *
 * @param {unknown} coord - Object to validate
 * @returns {coord is Coordinate} Type predicate
 *
 * @example
 * if (isValidCoordinate(userInput)) {
 *   const distance = calculateHaversineDistance(userInput, reference);
 * }
 */
export declare function isValidCoordinate(coord: unknown): coord is Coordinate;
/**
 * Normalizes longitude to -180 to 180 range
 *
 * @param {number} lng - Longitude to normalize
 * @returns {number} Normalized longitude
 */
export declare function normalizeLongitude(lng: number): number;
/**
 * Clamps latitude to valid range (-90 to 90)
 *
 * @param {number} lat - Latitude to clamp
 * @returns {number} Clamped latitude
 */
export declare function clampLatitude(lat: number): number;
/**
 * Type guard for GeoJSON Feature with specific property type
 *
 * @template P Property type
 * @param {unknown} obj - Object to validate
 * @returns {obj is GeoJSONFeature<P>} Type predicate
 */
export declare function isGeoJSONFeature<P = Record<string, unknown>>(obj: unknown): obj is GeoJSONFeature<P>;
/**
 * Advanced type-safe distance calculation with automatic method selection
 *
 * Selects optimal algorithm based on distance and accuracy requirements.
 *
 * @param {Coordinate} point1 - First point
 * @param {Coordinate} point2 - Second point
 * @param {boolean} [highPrecision=false] - Use Vincenty for high precision
 * @returns {DistanceResult} Distance result with metadata
 */
export declare function calculateDistance(point1: Coordinate, point2: Coordinate, highPrecision?: boolean): DistanceResult;
/**
 * PostGIS-compatible ST_Distance equivalent (2D distance in degrees)
 *
 * For actual PostGIS integration, use ST_Distance with geography type in database.
 * This is a simplified version for in-memory calculations.
 *
 * @param {Coordinate} point1 - First point
 * @param {Coordinate} point2 - Second point
 * @returns {number} Distance in meters (using Haversine)
 */
export declare function stDistance(point1: Coordinate, point2: Coordinate): number;
/**
 * PostGIS-compatible ST_DWithin equivalent
 *
 * @param {Coordinate} point1 - First point
 * @param {Coordinate} point2 - Second point
 * @param {number} distance - Distance threshold in meters
 * @returns {boolean} True if points are within distance
 */
export declare function stDWithin(point1: Coordinate, point2: Coordinate, distance: number): boolean;
/**
 * PostGIS-compatible ST_Contains equivalent for point-in-polygon
 *
 * @param {Coordinate[]} polygon - Polygon boundary
 * @param {Coordinate} point - Point to test
 * @returns {boolean} True if polygon contains point
 */
export declare function stContains(polygon: Coordinate[], point: Coordinate): boolean;
//# sourceMappingURL=gis-mapping-utilities.d.ts.map