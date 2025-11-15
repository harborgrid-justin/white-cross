/**
 * Version Metadata Types
 *
 * This module defines types for version metadata and tracking.
 *
 * @module gui-builder/versioning/metadata
 */

import type { VersionId } from '../core';

/**
 * Version metadata.
 */
export interface VersionMetadata {
  readonly id: VersionId;
  readonly version: string; // Semantic version (e.g., '1.0.0')
  readonly name?: string;
  readonly description?: string;
  readonly createdAt: string;
  readonly createdBy?: string;
  readonly tags?: readonly string[];
  readonly isPublished: boolean;
  readonly publishedAt?: string;
}
