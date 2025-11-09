/**
 * CAD Reusable Functions Library - Main Index
 *
 * This index provides convenient access to all 25 CAD utility kits
 * with 1,009+ functions for building professional CAD SaaS applications.
 *
 * @module reuse/cad
 * @version 1.0.0
 */
export * from './cad-geometry-primitives-kit';
export * from './cad-transformation-matrix-kit';
export * from './cad-coordinate-systems-kit';
export * from './cad-drawing-layers-kit';
export * from './cad-entity-management-kit';
export * from './cad-blocks-symbols-kit';
export * from './cad-sheet-layouts-kit';
export * from './cad-annotation-dimensions-kit';
export * from './cad-attribute-properties-kit';
export * from './cad-rendering-display-kit';
export * from './cad-viewport-camera-kit';
export * from './cad-color-linetype-kit';
export * from './cad-hatching-patterns-kit';
export * from './cad-selection-filtering-kit';
export * from './cad-snapping-grid-kit';
export * from './cad-measurement-analysis-kit';
export * from './cad-constraints-relations-kit';
export * from './cad-parametric-modeling-kit';
export * from './cad-assembly-components-kit';
export * from './cad-file-import-export-kit';
export * from './cad-plotting-printing-kit';
export * from './cad-collaboration-versioning-kit';
export * from './cad-realtime-sync-kit';
export * from './cad-validation-quality-kit';
export * from './cad-api-integration-kit';
/**
 * CAD library metadata
 */
export declare const CAD_LIBRARY_INFO: {
    version: string;
    totalKits: number;
    totalFunctions: number;
    releaseDate: string;
    description: string;
    technologies: string[];
    capabilities: string[];
};
/**
 * Get library information
 */
export declare function getCADLibraryInfo(): {
    version: string;
    totalKits: number;
    totalFunctions: number;
    releaseDate: string;
    description: string;
    technologies: string[];
    capabilities: string[];
};
/**
 * List all available CAD kits
 */
export declare function listCADKits(): string[];
//# sourceMappingURL=index.d.ts.map