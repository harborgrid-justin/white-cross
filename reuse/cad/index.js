"use strict";
/**
 * CAD Reusable Functions Library - Main Index
 *
 * This index provides convenient access to all 25 CAD utility kits
 * with 1,009+ functions for building professional CAD SaaS applications.
 *
 * @module reuse/cad
 * @version 1.0.0
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAD_LIBRARY_INFO = void 0;
exports.getCADLibraryInfo = getCADLibraryInfo;
exports.listCADKits = listCADKits;
// ============================================================================
// GEOMETRY & PRIMITIVES
// ============================================================================
__exportStar(require("./cad-geometry-primitives-kit"), exports);
__exportStar(require("./cad-transformation-matrix-kit"), exports);
__exportStar(require("./cad-coordinate-systems-kit"), exports);
// ============================================================================
// DRAWING ORGANIZATION
// ============================================================================
__exportStar(require("./cad-drawing-layers-kit"), exports);
__exportStar(require("./cad-entity-management-kit"), exports);
__exportStar(require("./cad-blocks-symbols-kit"), exports);
__exportStar(require("./cad-sheet-layouts-kit"), exports);
// ============================================================================
// ANNOTATION & DOCUMENTATION
// ============================================================================
__exportStar(require("./cad-annotation-dimensions-kit"), exports);
__exportStar(require("./cad-attribute-properties-kit"), exports);
// ============================================================================
// VISUALIZATION & RENDERING
// ============================================================================
__exportStar(require("./cad-rendering-display-kit"), exports);
__exportStar(require("./cad-viewport-camera-kit"), exports);
__exportStar(require("./cad-color-linetype-kit"), exports);
__exportStar(require("./cad-hatching-patterns-kit"), exports);
// ============================================================================
// EDITING & MANIPULATION
// ============================================================================
__exportStar(require("./cad-selection-filtering-kit"), exports);
__exportStar(require("./cad-snapping-grid-kit"), exports);
__exportStar(require("./cad-measurement-analysis-kit"), exports);
// ============================================================================
// PARAMETRIC & CONSTRAINTS
// ============================================================================
__exportStar(require("./cad-constraints-relations-kit"), exports);
__exportStar(require("./cad-parametric-modeling-kit"), exports);
__exportStar(require("./cad-assembly-components-kit"), exports);
// ============================================================================
// FILE OPERATIONS
// ============================================================================
__exportStar(require("./cad-file-import-export-kit"), exports);
__exportStar(require("./cad-plotting-printing-kit"), exports);
// ============================================================================
// COLLABORATION & QUALITY
// ============================================================================
__exportStar(require("./cad-collaboration-versioning-kit"), exports);
__exportStar(require("./cad-realtime-sync-kit"), exports);
__exportStar(require("./cad-validation-quality-kit"), exports);
// ============================================================================
// INTEGRATION & API
// ============================================================================
__exportStar(require("./cad-api-integration-kit"), exports);
// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================
/**
 * CAD library metadata
 */
exports.CAD_LIBRARY_INFO = {
    version: '1.0.0',
    totalKits: 25,
    totalFunctions: 1009,
    releaseDate: '2025-11-09',
    description: 'Enterprise-grade CAD SaaS utilities for White Cross platform',
    technologies: ['TypeScript', 'NestJS', 'Sequelize', 'Swagger'],
    capabilities: [
        '2D/3D Geometry',
        'Layer Management',
        'Annotation & Dimensions',
        'File Import/Export (DWG, DXF, SVG, PDF)',
        'Real-time Collaboration',
        'Parametric Modeling',
        'Assembly Management',
        'Constraint-based Design',
        'Rendering & Visualization',
        'REST API Integration',
        'Version Control',
        'Quality Validation'
    ]
};
/**
 * Get library information
 */
function getCADLibraryInfo() {
    return exports.CAD_LIBRARY_INFO;
}
/**
 * List all available CAD kits
 */
function listCADKits() {
    return [
        'cad-geometry-primitives-kit',
        'cad-drawing-layers-kit',
        'cad-annotation-dimensions-kit',
        'cad-transformation-matrix-kit',
        'cad-rendering-display-kit',
        'cad-file-import-export-kit',
        'cad-entity-management-kit',
        'cad-snapping-grid-kit',
        'cad-selection-filtering-kit',
        'cad-measurement-analysis-kit',
        'cad-collaboration-versioning-kit',
        'cad-blocks-symbols-kit',
        'cad-hatching-patterns-kit',
        'cad-plotting-printing-kit',
        'cad-viewport-camera-kit',
        'cad-constraints-relations-kit',
        'cad-parametric-modeling-kit',
        'cad-assembly-components-kit',
        'cad-sheet-layouts-kit',
        'cad-attribute-properties-kit',
        'cad-color-linetype-kit',
        'cad-coordinate-systems-kit',
        'cad-validation-quality-kit',
        'cad-api-integration-kit',
        'cad-realtime-sync-kit'
    ];
}
//# sourceMappingURL=index.js.map