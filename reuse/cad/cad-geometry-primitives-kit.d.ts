/**
 * LOC: CAD-GEO-001
 * File: /reuse/cad/cad-geometry-primitives-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (foundational geometric utilities)
 *
 * DOWNSTREAM (imported by):
 *   - CAD drawing engines
 *   - Geometric calculation modules
 *   - Shape rendering services
 */
/**
 * File: /reuse/cad/cad-geometry-primitives-kit.ts
 * Locator: WC-CAD-GEO-001
 * Purpose: CAD Geometry Primitives - 2D/3D geometric primitive utilities for CAD operations
 *
 * Upstream: Independent geometric computation module
 * Downstream: CAD rendering, entity management, transformation services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 geometric primitive functions for points, lines, circles, arcs, polygons, and 3D shapes
 *
 * LLM Context: Production-grade CAD geometry primitives for White Cross CAD SaaS platform.
 * Provides comprehensive 2D/3D geometric computations including point operations, line calculations,
 * circle/arc utilities, polygon processing, bezier curves, and 3D solid geometry. Essential for
 * competing with AutoCAD's geometric foundation.
 */
/**
 * 2D Point interface
 */
export interface Point2D {
    x: number;
    y: number;
}
/**
 * 3D Point interface
 */
export interface Point3D {
    x: number;
    y: number;
    z: number;
}
/**
 * 2D Line segment
 */
export interface LineSegment2D {
    start: Point2D;
    end: Point2D;
}
/**
 * 3D Line segment
 */
export interface LineSegment3D {
    start: Point3D;
    end: Point3D;
}
/**
 * Circle definition
 */
export interface Circle {
    center: Point2D;
    radius: number;
}
/**
 * Arc definition
 */
export interface Arc {
    center: Point2D;
    radius: number;
    startAngle: number;
    endAngle: number;
}
/**
 * Rectangle definition
 */
export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Polygon definition
 */
export interface Polygon {
    vertices: Point2D[];
    closed?: boolean;
}
/**
 * Bounding box
 */
export interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
}
/**
 * 3D Bounding box
 */
export interface BoundingBox3D {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
}
/**
 * Vector 2D
 */
export interface Vector2D {
    x: number;
    y: number;
}
/**
 * Vector 3D
 */
export interface Vector3D {
    x: number;
    y: number;
    z: number;
}
/**
 * Creates a 2D point.
 *
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Point2D} 2D point
 *
 * @example
 * ```typescript
 * const point = createPoint2D(10, 20);
 * // { x: 10, y: 20 }
 * ```
 */
export declare function createPoint2D(x: number, y: number): Point2D;
/**
 * Creates a 3D point.
 *
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @returns {Point3D} 3D point
 *
 * @example
 * ```typescript
 * const point = createPoint3D(10, 20, 30);
 * // { x: 10, y: 20, z: 30 }
 * ```
 */
export declare function createPoint3D(x: number, y: number, z: number): Point3D;
/**
 * Calculates the distance between two 2D points.
 *
 * @param {Point2D} p1 - First point
 * @param {Point2D} p2 - Second point
 * @returns {number} Distance between points
 *
 * @example
 * ```typescript
 * const distance = calculateDistance2D({ x: 0, y: 0 }, { x: 3, y: 4 });
 * // 5
 * ```
 */
export declare function calculateDistance2D(p1: Point2D, p2: Point2D): number;
/**
 * Calculates the distance between two 3D points.
 *
 * @param {Point3D} p1 - First point
 * @param {Point3D} p2 - Second point
 * @returns {number} Distance between points
 *
 * @example
 * ```typescript
 * const distance = calculateDistance3D({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 2 });
 * // 3
 * ```
 */
export declare function calculateDistance3D(p1: Point3D, p2: Point3D): number;
/**
 * Calculates the midpoint between two 2D points.
 *
 * @param {Point2D} p1 - First point
 * @param {Point2D} p2 - Second point
 * @returns {Point2D} Midpoint
 *
 * @example
 * ```typescript
 * const mid = calculateMidpoint2D({ x: 0, y: 0 }, { x: 10, y: 10 });
 * // { x: 5, y: 5 }
 * ```
 */
export declare function calculateMidpoint2D(p1: Point2D, p2: Point2D): Point2D;
/**
 * Calculates the midpoint between two 3D points.
 *
 * @param {Point3D} p1 - First point
 * @param {Point3D} p2 - Second point
 * @returns {Point3D} Midpoint
 *
 * @example
 * ```typescript
 * const mid = calculateMidpoint3D({ x: 0, y: 0, z: 0 }, { x: 10, y: 10, z: 10 });
 * // { x: 5, y: 5, z: 5 }
 * ```
 */
export declare function calculateMidpoint3D(p1: Point3D, p2: Point3D): Point3D;
/**
 * Checks if two 2D points are equal within tolerance.
 *
 * @param {Point2D} p1 - First point
 * @param {Point2D} p2 - Second point
 * @param {number} tolerance - Tolerance for comparison (default: 0.0001)
 * @returns {boolean} True if points are equal
 *
 * @example
 * ```typescript
 * const equal = arePointsEqual2D({ x: 1, y: 2 }, { x: 1.00001, y: 2.00001 }, 0.001);
 * // true
 * ```
 */
export declare function arePointsEqual2D(p1: Point2D, p2: Point2D, tolerance?: number): boolean;
/**
 * Interpolates between two 2D points.
 *
 * @param {Point2D} p1 - Start point
 * @param {Point2D} p2 - End point
 * @param {number} t - Interpolation factor (0-1)
 * @returns {Point2D} Interpolated point
 *
 * @example
 * ```typescript
 * const point = interpolatePoint2D({ x: 0, y: 0 }, { x: 10, y: 10 }, 0.5);
 * // { x: 5, y: 5 }
 * ```
 */
export declare function interpolatePoint2D(p1: Point2D, p2: Point2D, t: number): Point2D;
/**
 * Creates a 2D line segment.
 *
 * @param {Point2D} start - Start point
 * @param {Point2D} end - End point
 * @returns {LineSegment2D} Line segment
 *
 * @example
 * ```typescript
 * const line = createLineSegment2D({ x: 0, y: 0 }, { x: 10, y: 10 });
 * ```
 */
export declare function createLineSegment2D(start: Point2D, end: Point2D): LineSegment2D;
/**
 * Calculates the length of a 2D line segment.
 *
 * @param {LineSegment2D} line - Line segment
 * @returns {number} Length of line
 *
 * @example
 * ```typescript
 * const length = calculateLineLength2D({ start: { x: 0, y: 0 }, end: { x: 3, y: 4 } });
 * // 5
 * ```
 */
export declare function calculateLineLength2D(line: LineSegment2D): number;
/**
 * Calculates the angle of a 2D line segment in radians.
 *
 * @param {LineSegment2D} line - Line segment
 * @returns {number} Angle in radians
 *
 * @example
 * ```typescript
 * const angle = calculateLineAngle2D({ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } });
 * // Math.PI / 4 (45 degrees)
 * ```
 */
export declare function calculateLineAngle2D(line: LineSegment2D): number;
/**
 * Calculates the slope of a 2D line segment.
 *
 * @param {LineSegment2D} line - Line segment
 * @returns {number} Slope (Infinity for vertical lines)
 *
 * @example
 * ```typescript
 * const slope = calculateLineSlope2D({ start: { x: 0, y: 0 }, end: { x: 2, y: 4 } });
 * // 2
 * ```
 */
export declare function calculateLineSlope2D(line: LineSegment2D): number;
/**
 * Checks if a point lies on a line segment within tolerance.
 *
 * @param {Point2D} point - Point to check
 * @param {LineSegment2D} line - Line segment
 * @param {number} tolerance - Tolerance (default: 0.0001)
 * @returns {boolean} True if point is on line
 *
 * @example
 * ```typescript
 * const onLine = isPointOnLine2D({ x: 5, y: 5 }, { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } });
 * // true
 * ```
 */
export declare function isPointOnLine2D(point: Point2D, line: LineSegment2D, tolerance?: number): boolean;
/**
 * Finds the closest point on a line segment to a given point.
 *
 * @param {Point2D} point - Point
 * @param {LineSegment2D} line - Line segment
 * @returns {Point2D} Closest point on line
 *
 * @example
 * ```typescript
 * const closest = findClosestPointOnLine2D({ x: 5, y: 10 }, { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } });
 * // { x: 5, y: 0 }
 * ```
 */
export declare function findClosestPointOnLine2D(point: Point2D, line: LineSegment2D): Point2D;
/**
 * Checks if two line segments intersect.
 *
 * @param {LineSegment2D} line1 - First line segment
 * @param {LineSegment2D} line2 - Second line segment
 * @returns {boolean} True if lines intersect
 *
 * @example
 * ```typescript
 * const intersect = doLinesIntersect2D(
 *   { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } },
 *   { start: { x: 0, y: 10 }, end: { x: 10, y: 0 } }
 * );
 * // true
 * ```
 */
export declare function doLinesIntersect2D(line1: LineSegment2D, line2: LineSegment2D): boolean;
/**
 * Calculates the intersection point of two line segments.
 *
 * @param {LineSegment2D} line1 - First line segment
 * @param {LineSegment2D} line2 - Second line segment
 * @returns {Point2D | null} Intersection point or null if no intersection
 *
 * @example
 * ```typescript
 * const point = calculateLineIntersection2D(
 *   { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } },
 *   { start: { x: 0, y: 10 }, end: { x: 10, y: 0 } }
 * );
 * // { x: 5, y: 5 }
 * ```
 */
export declare function calculateLineIntersection2D(line1: LineSegment2D, line2: LineSegment2D): Point2D | null;
/**
 * Creates a circle.
 *
 * @param {Point2D} center - Center point
 * @param {number} radius - Radius
 * @returns {Circle} Circle definition
 *
 * @example
 * ```typescript
 * const circle = createCircle({ x: 0, y: 0 }, 10);
 * ```
 */
export declare function createCircle(center: Point2D, radius: number): Circle;
/**
 * Calculates the circumference of a circle.
 *
 * @param {Circle} circle - Circle
 * @returns {number} Circumference
 *
 * @example
 * ```typescript
 * const circ = calculateCircleCircumference({ center: { x: 0, y: 0 }, radius: 5 });
 * // 31.41592...
 * ```
 */
export declare function calculateCircleCircumference(circle: Circle): number;
/**
 * Calculates the area of a circle.
 *
 * @param {Circle} circle - Circle
 * @returns {number} Area
 *
 * @example
 * ```typescript
 * const area = calculateCircleArea({ center: { x: 0, y: 0 }, radius: 5 });
 * // 78.53981...
 * ```
 */
export declare function calculateCircleArea(circle: Circle): number;
/**
 * Checks if a point is inside a circle.
 *
 * @param {Point2D} point - Point to check
 * @param {Circle} circle - Circle
 * @returns {boolean} True if point is inside circle
 *
 * @example
 * ```typescript
 * const inside = isPointInCircle({ x: 2, y: 2 }, { center: { x: 0, y: 0 }, radius: 5 });
 * // true
 * ```
 */
export declare function isPointInCircle(point: Point2D, circle: Circle): boolean;
/**
 * Finds the point on a circle at a given angle.
 *
 * @param {Circle} circle - Circle
 * @param {number} angle - Angle in radians
 * @returns {Point2D} Point on circle
 *
 * @example
 * ```typescript
 * const point = getPointOnCircle({ center: { x: 0, y: 0 }, radius: 10 }, Math.PI / 2);
 * // { x: 0, y: 10 }
 * ```
 */
export declare function getPointOnCircle(circle: Circle, angle: number): Point2D;
/**
 * Finds the tangent points from an external point to a circle.
 *
 * @param {Point2D} point - External point
 * @param {Circle} circle - Circle
 * @returns {Point2D[] | null} Array of tangent points or null if point is inside circle
 *
 * @example
 * ```typescript
 * const tangents = findCircleTangentPoints({ x: 10, y: 0 }, { center: { x: 0, y: 0 }, radius: 5 });
 * // [{ x: ..., y: ... }, { x: ..., y: ... }]
 * ```
 */
export declare function findCircleTangentPoints(point: Point2D, circle: Circle): Point2D[] | null;
/**
 * Creates an arc.
 *
 * @param {Point2D} center - Center point
 * @param {number} radius - Radius
 * @param {number} startAngle - Start angle in radians
 * @param {number} endAngle - End angle in radians
 * @returns {Arc} Arc definition
 *
 * @example
 * ```typescript
 * const arc = createArc({ x: 0, y: 0 }, 10, 0, Math.PI / 2);
 * ```
 */
export declare function createArc(center: Point2D, radius: number, startAngle: number, endAngle: number): Arc;
/**
 * Calculates the length of an arc.
 *
 * @param {Arc} arc - Arc
 * @returns {number} Arc length
 *
 * @example
 * ```typescript
 * const length = calculateArcLength({ center: { x: 0, y: 0 }, radius: 10, startAngle: 0, endAngle: Math.PI });
 * // 31.41592... (half circle)
 * ```
 */
export declare function calculateArcLength(arc: Arc): number;
/**
 * Gets the start point of an arc.
 *
 * @param {Arc} arc - Arc
 * @returns {Point2D} Start point
 *
 * @example
 * ```typescript
 * const start = getArcStartPoint({ center: { x: 0, y: 0 }, radius: 10, startAngle: 0, endAngle: Math.PI / 2 });
 * // { x: 10, y: 0 }
 * ```
 */
export declare function getArcStartPoint(arc: Arc): Point2D;
/**
 * Gets the end point of an arc.
 *
 * @param {Arc} arc - Arc
 * @returns {Point2D} End point
 *
 * @example
 * ```typescript
 * const end = getArcEndPoint({ center: { x: 0, y: 0 }, radius: 10, startAngle: 0, endAngle: Math.PI / 2 });
 * // { x: 0, y: 10 }
 * ```
 */
export declare function getArcEndPoint(arc: Arc): Point2D;
/**
 * Samples points along an arc.
 *
 * @param {Arc} arc - Arc
 * @param {number} numPoints - Number of points to sample
 * @returns {Point2D[]} Array of points along arc
 *
 * @example
 * ```typescript
 * const points = sampleArcPoints({ center: { x: 0, y: 0 }, radius: 10, startAngle: 0, endAngle: Math.PI }, 5);
 * // [{ x: 10, y: 0 }, { x: ..., y: ... }, ...]
 * ```
 */
export declare function sampleArcPoints(arc: Arc, numPoints: number): Point2D[];
/**
 * Creates a polygon from vertices.
 *
 * @param {Point2D[]} vertices - Array of vertices
 * @param {boolean} closed - Whether polygon is closed (default: true)
 * @returns {Polygon} Polygon definition
 *
 * @example
 * ```typescript
 * const polygon = createPolygon([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }], true);
 * ```
 */
export declare function createPolygon(vertices: Point2D[], closed?: boolean): Polygon;
/**
 * Calculates the perimeter of a polygon.
 *
 * @param {Polygon} polygon - Polygon
 * @returns {number} Perimeter
 *
 * @example
 * ```typescript
 * const perimeter = calculatePolygonPerimeter({
 *   vertices: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }],
 *   closed: true
 * });
 * // 14
 * ```
 */
export declare function calculatePolygonPerimeter(polygon: Polygon): number;
/**
 * Calculates the area of a polygon using the shoelace formula.
 *
 * @param {Polygon} polygon - Polygon
 * @returns {number} Area (absolute value)
 *
 * @example
 * ```typescript
 * const area = calculatePolygonArea({
 *   vertices: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }],
 *   closed: true
 * });
 * // 12
 * ```
 */
export declare function calculatePolygonArea(polygon: Polygon): number;
/**
 * Calculates the centroid of a polygon.
 *
 * @param {Polygon} polygon - Polygon
 * @returns {Point2D} Centroid point
 *
 * @example
 * ```typescript
 * const centroid = calculatePolygonCentroid({
 *   vertices: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }],
 *   closed: true
 * });
 * // { x: 2, y: 1.5 }
 * ```
 */
export declare function calculatePolygonCentroid(polygon: Polygon): Point2D;
/**
 * Checks if a point is inside a polygon using ray casting algorithm.
 *
 * @param {Point2D} point - Point to check
 * @param {Polygon} polygon - Polygon
 * @returns {boolean} True if point is inside polygon
 *
 * @example
 * ```typescript
 * const inside = isPointInPolygon({ x: 2, y: 1 }, {
 *   vertices: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }],
 *   closed: true
 * });
 * // true
 * ```
 */
export declare function isPointInPolygon(point: Point2D, polygon: Polygon): boolean;
/**
 * Calculates the bounding box of a set of 2D points.
 *
 * @param {Point2D[]} points - Array of points
 * @returns {BoundingBox} Bounding box
 *
 * @example
 * ```typescript
 * const bbox = calculateBoundingBox([{ x: 1, y: 2 }, { x: 5, y: 8 }, { x: 3, y: 4 }]);
 * // { minX: 1, minY: 2, maxX: 5, maxY: 8, width: 4, height: 6 }
 * ```
 */
export declare function calculateBoundingBox(points: Point2D[]): BoundingBox;
/**
 * Checks if two bounding boxes intersect.
 *
 * @param {BoundingBox} box1 - First bounding box
 * @param {BoundingBox} box2 - Second bounding box
 * @returns {boolean} True if boxes intersect
 *
 * @example
 * ```typescript
 * const intersect = doBoundingBoxesIntersect(
 *   { minX: 0, minY: 0, maxX: 5, maxY: 5, width: 5, height: 5 },
 *   { minX: 3, minY: 3, maxX: 8, maxY: 8, width: 5, height: 5 }
 * );
 * // true
 * ```
 */
export declare function doBoundingBoxesIntersect(box1: BoundingBox, box2: BoundingBox): boolean;
/**
 * Expands a bounding box by a margin.
 *
 * @param {BoundingBox} box - Bounding box
 * @param {number} margin - Margin to add on all sides
 * @returns {BoundingBox} Expanded bounding box
 *
 * @example
 * ```typescript
 * const expanded = expandBoundingBox({ minX: 0, minY: 0, maxX: 10, maxY: 10, width: 10, height: 10 }, 5);
 * // { minX: -5, minY: -5, maxX: 15, maxY: 15, width: 20, height: 20 }
 * ```
 */
export declare function expandBoundingBox(box: BoundingBox, margin: number): BoundingBox;
/**
 * Creates a 2D vector from two points.
 *
 * @param {Point2D} from - Start point
 * @param {Point2D} to - End point
 * @returns {Vector2D} Vector
 *
 * @example
 * ```typescript
 * const vector = createVector2D({ x: 0, y: 0 }, { x: 3, y: 4 });
 * // { x: 3, y: 4 }
 * ```
 */
export declare function createVector2D(from: Point2D, to: Point2D): Vector2D;
/**
 * Calculates the magnitude (length) of a 2D vector.
 *
 * @param {Vector2D} vector - Vector
 * @returns {number} Magnitude
 *
 * @example
 * ```typescript
 * const magnitude = calculateVectorMagnitude2D({ x: 3, y: 4 });
 * // 5
 * ```
 */
export declare function calculateVectorMagnitude2D(vector: Vector2D): number;
/**
 * Normalizes a 2D vector to unit length.
 *
 * @param {Vector2D} vector - Vector
 * @returns {Vector2D} Normalized vector
 *
 * @example
 * ```typescript
 * const normalized = normalizeVector2D({ x: 3, y: 4 });
 * // { x: 0.6, y: 0.8 }
 * ```
 */
export declare function normalizeVector2D(vector: Vector2D): Vector2D;
/**
 * Calculates the dot product of two 2D vectors.
 *
 * @param {Vector2D} v1 - First vector
 * @param {Vector2D} v2 - Second vector
 * @returns {number} Dot product
 *
 * @example
 * ```typescript
 * const dot = calculateVectorDotProduct2D({ x: 1, y: 2 }, { x: 3, y: 4 });
 * // 11
 * ```
 */
export declare function calculateVectorDotProduct2D(v1: Vector2D, v2: Vector2D): number;
/**
 * Calculates the cross product (z-component) of two 2D vectors.
 *
 * @param {Vector2D} v1 - First vector
 * @param {Vector2D} v2 - Second vector
 * @returns {number} Cross product z-component
 *
 * @example
 * ```typescript
 * const cross = calculateVectorCrossProduct2D({ x: 1, y: 2 }, { x: 3, y: 4 });
 * // -2
 * ```
 */
export declare function calculateVectorCrossProduct2D(v1: Vector2D, v2: Vector2D): number;
/**
 * Calculates the angle between two 2D vectors in radians.
 *
 * @param {Vector2D} v1 - First vector
 * @param {Vector2D} v2 - Second vector
 * @returns {number} Angle in radians
 *
 * @example
 * ```typescript
 * const angle = calculateVectorAngle2D({ x: 1, y: 0 }, { x: 0, y: 1 });
 * // Math.PI / 2 (90 degrees)
 * ```
 */
export declare function calculateVectorAngle2D(v1: Vector2D, v2: Vector2D): number;
//# sourceMappingURL=cad-geometry-primitives-kit.d.ts.map