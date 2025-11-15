/**
 * Diff Types
 *
 * This module defines types for comparing versions.
 *
 * @module gui-builder/versioning/diff
 */

import type { VersionId } from '../core';

/**
 * Diff operation.
 */
export enum DiffOperation {
  Add = 'add',
  Remove = 'remove',
  Replace = 'replace',
  Move = 'move',
}

/**
 * Diff entry.
 */
export interface DiffEntry {
  readonly operation: DiffOperation;
  readonly path: string;
  readonly oldValue?: unknown;
  readonly newValue?: unknown;
}

/**
 * Version comparison.
 */
export interface VersionDiff {
  readonly fromVersion: VersionId;
  readonly toVersion: VersionId;
  readonly diff: readonly DiffEntry[];
  readonly comparedAt: string;
}
