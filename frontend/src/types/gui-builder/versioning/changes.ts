/**
 * Change Tracking Types
 *
 * This module defines types for tracking changes between versions.
 *
 * @module gui-builder/versioning/changes
 */

/**
 * Change type.
 */
export enum ChangeType {
  Added = 'added',
  Modified = 'modified',
  Deleted = 'deleted',
  Moved = 'moved',
}

/**
 * Change entry.
 */
export interface ChangeEntry {
  readonly type: ChangeType;
  readonly path: string;
  readonly timestamp: string;
  readonly userId?: string;
  readonly description?: string;
}

/**
 * Change set.
 */
export interface ChangeSet {
  readonly changes: readonly ChangeEntry[];
  readonly summary?: {
    readonly added: number;
    readonly modified: number;
    readonly deleted: number;
    readonly moved: number;
  };
}
