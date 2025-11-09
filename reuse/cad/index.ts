/**
 * CAD Reusable Functions Library - Main Index
 * 
 * This index provides convenient access to all 25 CAD utility kits
 * with 1,009+ functions for building professional CAD SaaS applications.
 * 
 * @module reuse/cad
 * @version 1.0.0
 */

// ============================================================================
// GEOMETRY & PRIMITIVES
// ============================================================================

export * from './cad-geometry-primitives-kit';
export * from './cad-transformation-matrix-kit';
export * from './cad-coordinate-systems-kit';

// ============================================================================
// DRAWING ORGANIZATION
// ============================================================================

export * from './cad-drawing-layers-kit';
export * from './cad-entity-management-kit';
export * from './cad-blocks-symbols-kit';
export * from './cad-sheet-layouts-kit';

// ============================================================================
// ANNOTATION & DOCUMENTATION
// ============================================================================

export * from './cad-annotation-dimensions-kit';
export * from './cad-attribute-properties-kit';

// ============================================================================
// VISUALIZATION & RENDERING
// ============================================================================

export * from './cad-rendering-display-kit';
export * from './cad-viewport-camera-kit';
export * from './cad-color-linetype-kit';
export * from './cad-hatching-patterns-kit';

// ============================================================================
// EDITING & MANIPULATION
// ============================================================================

export * from './cad-selection-filtering-kit';
export * from './cad-snapping-grid-kit';
export * from './cad-measurement-analysis-kit';

// ============================================================================
// PARAMETRIC & CONSTRAINTS
// ============================================================================

export * from './cad-constraints-relations-kit';
export * from './cad-parametric-modeling-kit';
export * from './cad-assembly-components-kit';

// ============================================================================
// FILE OPERATIONS
// ============================================================================

export * from './cad-file-import-export-kit';
export * from './cad-plotting-printing-kit';

// ============================================================================
// COLLABORATION & QUALITY
// ============================================================================

export * from './cad-collaboration-versioning-kit';
export * from './cad-realtime-sync-kit';
export * from './cad-validation-quality-kit';

// ============================================================================
// INTEGRATION & API
// ============================================================================

export * from './cad-api-integration-kit';

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * CAD library metadata
 */
export const CAD_LIBRARY_INFO = {
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
export function getCADLibraryInfo() {
  return CAD_LIBRARY_INFO;
}

/**
 * List all available CAD kits
 */
export function listCADKits(): string[] {
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
