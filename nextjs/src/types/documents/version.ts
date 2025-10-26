/**
 * Document version control types
 *
 * @module types/documents/version
 * @description Defines types for document versioning and change tracking
 */

/**
 * Version change type
 */
export enum VersionChangeType {
  CREATED = 'created',
  UPDATED = 'updated',
  RENAMED = 'renamed',
  MOVED = 'moved',
  METADATA_CHANGED = 'metadata_changed',
  CONTENT_CHANGED = 'content_changed',
  RESTORED = 'restored',
  SIGNED = 'signed'
}

/**
 * Document version
 */
export interface DocumentVersion {
  /** Version ID */
  id: string;

  /** Document ID */
  documentId: string;

  /** Version number */
  versionNumber: number;

  /** Version label (optional, e.g., "1.0", "Draft", "Final") */
  label?: string;

  /** Change description */
  changeDescription?: string;

  /** Change type */
  changeType: VersionChangeType;

  /** File metadata for this version */
  file: {
    storagePath: string;
    downloadUrl?: string;
    size: number;
    checksum: string;
  };

  /** Document metadata snapshot */
  metadata: {
    title: string;
    description?: string;
    tags: string[];
    customFields: Record<string, unknown>;
  };

  /** Created by user ID */
  createdBy: string;

  /** Created by user name */
  createdByName: string;

  /** Created timestamp */
  createdAt: Date;

  /** Is current version */
  isCurrent: boolean;

  /** Parent version ID (for tracking lineage) */
  parentVersionId?: string;

  /** File differences from parent */
  diff?: VersionDiff;

  /** Size of this version in bytes */
  size: number;
}

/**
 * Version diff information
 */
export interface VersionDiff {
  /** Has content changes */
  hasContentChanges: boolean;

  /** Has metadata changes */
  hasMetadataChanges: boolean;

  /** Metadata changes */
  metadataChanges?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];

  /** Content change summary */
  contentChangeSummary?: {
    linesAdded: number;
    linesRemoved: number;
    linesModified: number;
    percentageChanged: number;
  };

  /** Detailed diff (for text files) */
  detailedDiff?: DiffBlock[];
}

/**
 * Diff block for text comparison
 */
export interface DiffBlock {
  /** Block type */
  type: 'added' | 'removed' | 'modified' | 'unchanged';

  /** Line number in old version */
  oldLineNumber?: number;

  /** Line number in new version */
  newLineNumber?: number;

  /** Content of the block */
  content: string;

  /** Number of lines in block */
  lineCount: number;
}

/**
 * Version comparison request
 */
export interface VersionComparison {
  /** Document ID */
  documentId: string;

  /** First version ID to compare */
  versionId1: string;

  /** Second version ID to compare */
  versionId2: string;

  /** Comparison result */
  diff: VersionDiff;

  /** Comparison timestamp */
  comparedAt: Date;

  /** Comparison performed by */
  comparedBy: string;
}

/**
 * Version restore information
 */
export interface VersionRestore {
  /** Restore ID */
  id: string;

  /** Document ID */
  documentId: string;

  /** Version being restored */
  restoredVersionId: string;

  /** Version number being restored */
  restoredVersionNumber: number;

  /** New version created from restore */
  newVersionId: string;

  /** Restore reason */
  reason?: string;

  /** Restored by user ID */
  restoredBy: string;

  /** Restored by user name */
  restoredByName: string;

  /** Restored timestamp */
  restoredAt: Date;
}

/**
 * Version retention policy
 */
export interface VersionRetentionPolicy {
  /** Policy ID */
  id: string;

  /** Policy name */
  name: string;

  /** Keep all versions for X days */
  keepAllVersionsDays?: number;

  /** Keep major versions only after X days */
  keepMajorVersionsAfterDays?: number;

  /** Maximum versions to keep */
  maxVersions?: number;

  /** Delete versions older than X days */
  deleteOlderThanDays?: number;

  /** Applied to document categories */
  appliesToCategories: string[];

  /** Policy active */
  isActive: boolean;

  /** Created by */
  createdBy: string;

  /** Created timestamp */
  createdAt: Date;
}

/**
 * Version history summary
 */
export interface VersionHistorySummary {
  /** Document ID */
  documentId: string;

  /** Total versions */
  totalVersions: number;

  /** Current version number */
  currentVersion: number;

  /** First version created */
  firstVersionAt: Date;

  /** Latest version created */
  latestVersionAt: Date;

  /** Total size of all versions */
  totalSize: number;

  /** Number of contributors */
  contributorCount: number;

  /** Most active contributor */
  mostActiveContributor?: {
    userId: string;
    userName: string;
    versionCount: number;
  };

  /** Recent versions (last 5) */
  recentVersions: DocumentVersion[];
}
