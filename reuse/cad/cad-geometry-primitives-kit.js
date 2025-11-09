"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoint2D = createPoint2D;
exports.createPoint3D = createPoint3D;
exports.calculateDistance2D = calculateDistance2D;
exports.calculateDistance3D = calculateDistance3D;
exports.calculateMidpoint2D = calculateMidpoint2D;
exports.calculateMidpoint3D = calculateMidpoint3D;
exports.arePointsEqual2D = arePointsEqual2D;
exports.interpolatePoint2D = interpolatePoint2D;
exports.createLineSegment2D = createLineSegment2D;
exports.calculateLineLength2D = calculateLineLength2D;
exports.calculateLineAngle2D = calculateLineAngle2D;
exports.calculateLineSlope2D = calculateLineSlope2D;
exports.isPointOnLine2D = isPointOnLine2D;
exports.findClosestPointOnLine2D = findClosestPointOnLine2D;
exports.doLinesIntersect2D = doLinesIntersect2D;
exports.calculateLineIntersection2D = calculateLineIntersection2D;
exports.createCircle = createCircle;
exports.calculateCircleCircumference = calculateCircleCircumference;
exports.calculateCircleArea = calculateCircleArea;
exports.isPointInCircle = isPointInCircle;
exports.getPointOnCircle = getPointOnCircle;
exports.findCircleTangentPoints = findCircleTangentPoints;
exports.createArc = createArc;
exports.calculateArcLength = calculateArcLength;
exports.getArcStartPoint = getArcStartPoint;
exports.getArcEndPoint = getArcEndPoint;
exports.sampleArcPoints = sampleArcPoints;
exports.createPolygon = createPolygon;
exports.calculatePolygonPerimeter = calculatePolygonPerimeter;
exports.calculatePolygonArea = calculatePolygonArea;
exports.calculatePolygonCentroid = calculatePolygonCentroid;
exports.isPointInPolygon = isPointInPolygon;
exports.calculateBoundingBox = calculateBoundingBox;
exports.doBoundingBoxesIntersect = doBoundingBoxesIntersect;
exports.expandBoundingBox = expandBoundingBox;
exports.createVector2D = createVector2D;
exports.calculateVectorMagnitude2D = calculateVectorMagnitude2D;
exports.normalizeVector2D = normalizeVector2D;
exports.calculateVectorDotProduct2D = calculateVectorDotProduct2D;
exports.calculateVectorCrossProduct2D = calculateVectorCrossProduct2D;
exports.calculateVectorAngle2D = calculateVectorAngle2D;
// ============================================================================
// POINT OPERATIONS
// ============================================================================
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
function createPoint2D(x, y) {
    return { x, y };
}
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
function createPoint3D(x, y, z) {
    return { x, y, z };
}
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
function calculateDistance2D(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
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
function calculateDistance3D(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
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
function calculateMidpoint2D(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}
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
function calculateMidpoint3D(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        z: (p1.z + p2.z) / 2,
    };
}
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
function arePointsEqual2D(p1, p2, tolerance = 0.0001) {
    return Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance;
}
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
function interpolatePoint2D(p1, p2, t) {
    return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
    };
}
// ============================================================================
// LINE OPERATIONS
// ============================================================================
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
function createLineSegment2D(start, end) {
    return { start, end };
}
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
function calculateLineLength2D(line) {
    return calculateDistance2D(line.start, line.end);
}
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
function calculateLineAngle2D(line) {
    return Math.atan2(line.end.y - line.start.y, line.end.x - line.start.x);
}
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
function calculateLineSlope2D(line) {
    const dx = line.end.x - line.start.x;
    if (Math.abs(dx) < 0.0001)
        return Infinity;
    return (line.end.y - line.start.y) / dx;
}
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
function isPointOnLine2D(point, line, tolerance = 0.0001) {
    const d1 = calculateDistance2D(line.start, point);
    const d2 = calculateDistance2D(point, line.end);
    const lineLength = calculateLineLength2D(line);
    return Math.abs(d1 + d2 - lineLength) < tolerance;
}
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
function findClosestPointOnLine2D(point, line) {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0)
        return { ...line.start };
    let t = ((point.x - line.start.x) * dx + (point.y - line.start.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    return {
        x: line.start.x + t * dx,
        y: line.start.y + t * dy,
    };
}
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
function doLinesIntersect2D(line1, line2) {
    const intersection = calculateLineIntersection2D(line1, line2);
    return intersection !== null;
}
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
function calculateLineIntersection2D(line1, line2) {
    const x1 = line1.start.x, y1 = line1.start.y;
    const x2 = line1.end.x, y2 = line1.end.y;
    const x3 = line2.start.x, y3 = line2.start.y;
    const x4 = line2.end.x, y4 = line2.end.y;
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.0001)
        return null; // Parallel lines
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1),
        };
    }
    return null;
}
// ============================================================================
// CIRCLE OPERATIONS
// ============================================================================
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
function createCircle(center, radius) {
    return { center, radius };
}
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
function calculateCircleCircumference(circle) {
    return 2 * Math.PI * circle.radius;
}
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
function calculateCircleArea(circle) {
    return Math.PI * circle.radius * circle.radius;
}
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
function isPointInCircle(point, circle) {
    const distance = calculateDistance2D(point, circle.center);
    return distance <= circle.radius;
}
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
function getPointOnCircle(circle, angle) {
    return {
        x: circle.center.x + circle.radius * Math.cos(angle),
        y: circle.center.y + circle.radius * Math.sin(angle),
    };
}
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
function findCircleTangentPoints(point, circle) {
    const distance = calculateDistance2D(point, circle.center);
    if (distance <= circle.radius)
        return null; // Point inside or on circle
    const angle = Math.atan2(point.y - circle.center.y, point.x - circle.center.x);
    const tangentAngle = Math.asin(circle.radius / distance);
    return [
        getPointOnCircle(circle, angle + tangentAngle),
        getPointOnCircle(circle, angle - tangentAngle),
    ];
}
// ============================================================================
// ARC OPERATIONS
// ============================================================================
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
function createArc(center, radius, startAngle, endAngle) {
    return { center, radius, startAngle, endAngle };
}
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
function calculateArcLength(arc) {
    let angle = arc.endAngle - arc.startAngle;
    if (angle < 0)
        angle += 2 * Math.PI;
    return arc.radius * angle;
}
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
function getArcStartPoint(arc) {
    return getPointOnCircle({ center: arc.center, radius: arc.radius }, arc.startAngle);
}
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
function getArcEndPoint(arc) {
    return getPointOnCircle({ center: arc.center, radius: arc.radius }, arc.endAngle);
}
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
function sampleArcPoints(arc, numPoints) {
    const points = [];
    let angle = arc.endAngle - arc.startAngle;
    if (angle < 0)
        angle += 2 * Math.PI;
    for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const currentAngle = arc.startAngle + t * angle;
        points.push(getPointOnCircle({ center: arc.center, radius: arc.radius }, currentAngle));
    }
    return points;
}
// ============================================================================
// POLYGON OPERATIONS
// ============================================================================
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
function createPolygon(vertices, closed = true) {
    return { vertices, closed };
}
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
function calculatePolygonPerimeter(polygon) {
    let perimeter = 0;
    const vertices = polygon.vertices;
    for (let i = 0; i < vertices.length - 1; i++) {
        perimeter += calculateDistance2D(vertices[i], vertices[i + 1]);
    }
    if (polygon.closed && vertices.length > 0) {
        perimeter += calculateDistance2D(vertices[vertices.length - 1], vertices[0]);
    }
    return perimeter;
}
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
function calculatePolygonArea(polygon) {
    const vertices = polygon.vertices;
    if (vertices.length < 3)
        return 0;
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[j].x * vertices[i].y;
    }
    return Math.abs(area / 2);
}
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
function calculatePolygonCentroid(polygon) {
    const vertices = polygon.vertices;
    let cx = 0, cy = 0, area = 0;
    for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        const cross = vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
        area += cross;
        cx += (vertices[i].x + vertices[j].x) * cross;
        cy += (vertices[i].y + vertices[j].y) * cross;
    }
    area /= 2;
    const factor = 1 / (6 * area);
    return {
        x: cx * factor,
        y: cy * factor,
    };
}
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
function isPointInPolygon(point, polygon) {
    const vertices = polygon.vertices;
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
}
// ============================================================================
// BOUNDING BOX OPERATIONS
// ============================================================================
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
function calculateBoundingBox(points) {
    if (points.length === 0) {
        return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    }
    let minX = points[0].x, minY = points[0].y;
    let maxX = points[0].x, maxY = points[0].y;
    for (const point of points) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    }
    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
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
function doBoundingBoxesIntersect(box1, box2) {
    return !(box1.maxX < box2.minX || box1.minX > box2.maxX ||
        box1.maxY < box2.minY || box1.minY > box2.maxY);
}
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
function expandBoundingBox(box, margin) {
    return {
        minX: box.minX - margin,
        minY: box.minY - margin,
        maxX: box.maxX + margin,
        maxY: box.maxY + margin,
        width: box.width + 2 * margin,
        height: box.height + 2 * margin,
    };
}
// ============================================================================
// VECTOR OPERATIONS
// ============================================================================
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
function createVector2D(from, to) {
    return {
        x: to.x - from.x,
        y: to.y - from.y,
    };
}
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
function calculateVectorMagnitude2D(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
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
function normalizeVector2D(vector) {
    const magnitude = calculateVectorMagnitude2D(vector);
    if (magnitude === 0)
        return { x: 0, y: 0 };
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    };
}
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
function calculateVectorDotProduct2D(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}
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
function calculateVectorCrossProduct2D(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}
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
function calculateVectorAngle2D(v1, v2) {
    const dot = calculateVectorDotProduct2D(v1, v2);
    const mag1 = calculateVectorMagnitude2D(v1);
    const mag2 = calculateVectorMagnitude2D(v2);
    return Math.acos(dot / (mag1 * mag2));
}
//# sourceMappingURL=cad-geometry-primitives-kit.js.map