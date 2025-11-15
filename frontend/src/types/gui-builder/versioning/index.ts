/**
 * Versioning Module
 *
 * This module provides types for version control, change tracking,
 * and collaboration.
 *
 * @module gui-builder/versioning
 */

export type { VersionMetadata } from './metadata';
export type { ChangeEntry, ChangeSet } from './changes';
export { ChangeType } from './changes';
export type { DiffEntry, VersionDiff } from './diff';
export { DiffOperation } from './diff';
export type {
  UserPresence,
  LockInfo,
  CollaborationSession,
} from './collaboration';
