/**
 * Build Types
 *
 * This module defines types for build and deployment configuration.
 *
 * @module gui-builder/codegen/build
 */

/**
 * Build target.
 */
export enum BuildTarget {
  Development = 'development',
  Production = 'production',
  Preview = 'preview',
}

/**
 * Build configuration.
 */
export interface BuildConfig {
  readonly target: BuildTarget;
  readonly outputDir: string;
  readonly publicPath?: string;
  readonly minify?: boolean;
  readonly sourceMaps?: boolean;
}

/**
 * Build result.
 */
export interface BuildResult {
  readonly success: boolean;
  readonly files: readonly string[];
  readonly errors?: readonly string[];
  readonly warnings?: readonly string[];
  readonly buildTime: number; // milliseconds
}
