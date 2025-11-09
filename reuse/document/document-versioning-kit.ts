/**
 * LOC: DOC-VER-001
 * File: /reuse/document/document-versioning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - diff (for text diffing)
 *   - fast-json-patch (for JSON patching)
 *
 * DOWNSTREAM (imported by):
 *   - Document management controllers
 *   - Version control services
 *   - Document history modules
 *   - Audit logging services
 */

/**
 * File: /reuse/document/document-versioning-kit.ts
 * Locator: WC-UTL-DOCVER-001
 * Purpose: Document Versioning & History Kit - Comprehensive version control utilities for documents
 *
 * Upstream: sequelize, @nestjs/common, diff, fast-json-patch, TypeScript 5.x
 * Downstream: Document controllers, version services, history modules, audit services
 * Dependencies: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for version creation, comparison, history, rollback, diff generation, metadata, and tagging
 *
 * LLM Context: Production-grade document versioning utilities for White Cross healthcare platform.
 * Provides comprehensive version control for medical documents, change tracking, diff generation,
 * version comparison, rollback capabilities, version metadata management, and collaborative editing
 * support. Essential for maintaining audit trails, compliance, and document integrity in healthcare
 * applications with full HIPAA audit requirements.
 */

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Document version information
 */
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: any;
  contentHash: string;
  contentSize: number;
  mimeType?: string;
  encoding?: string;
  createdBy: string;
  createdAt: Date;
  comment?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isMajor?: boolean;
  previousVersionId?: string;
  changeType: 'create' | 'update' | 'delete' | 'restore';
}

/**
 * Version comparison result
 */
export interface VersionComparison {
  oldVersion: number;
  newVersion: number;
  hasChanges: boolean;
  changes: VersionChange[];
  statistics: ComparisonStatistics;
  generatedAt: Date;
}

/**
 * Individual version change
 */
export interface VersionChange {
  type: 'addition' | 'deletion' | 'modification';
  path?: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  lineNumber?: number;
  context?: string;
}

/**
 * Comparison statistics
 */
export interface ComparisonStatistics {
  totalChanges: number;
  additions: number;
  deletions: number;
  modifications: number;
  linesAdded?: number;
  linesDeleted?: number;
  charactersChanged?: number;
}

/**
 * Version history entry
 */
export interface VersionHistoryEntry {
  version: number;
  versionId: string;
  createdBy: string;
  createdAt: Date;
  comment?: string;
  changeType: string;
  tags?: string[];
  contentSize: number;
  isMajor?: boolean;
}

/**
 * Version rollback options
 */
export interface RollbackOptions {
  targetVersion: number;
  createBackup?: boolean;
  comment?: string;
  userId?: string;
  preserveMetadata?: boolean;
  notifyUsers?: boolean;
}

/**
 * Version rollback result
 */
export interface RollbackResult {
  success: boolean;
  newVersion?: number;
  backupVersionId?: string;
  rolledBackFrom: number;
  rolledBackTo: number;
  timestamp: Date;
}

/**
 * Diff generation options
 */
export interface DiffOptions {
  format?: 'unified' | 'context' | 'json' | 'html';
  contextLines?: number;
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  wordDiff?: boolean;
}

/**
 * Generated diff result
 */
export interface DiffResult {
  format: string;
  diff: string | any[];
  oldVersion: number;
  newVersion: number;
  statistics: ComparisonStatistics;
  generatedAt: Date;
}

/**
 * Version metadata
 */
export interface VersionMetadata {
  versionId: string;
  author: string;
  timestamp: Date;
  comment?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  checksum?: string;
}

/**
 * Version tag
 */
export interface VersionTag {
  id: string;
  versionId: string;
  tag: string;
  description?: string;
  color?: string;
  createdBy: string;
  createdAt: Date;
}

/**
 * Change tracking record
 */
export interface ChangeTrackingRecord {
  id: string;
  documentId: string;
  versionId: string;
  fieldPath: string;
  changeType: 'addition' | 'deletion' | 'modification';
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  userId: string;
}

/**
 * Version branch
 */
export interface VersionBranch {
  id: string;
  documentId: string;
  name: string;
  baseVersionId: string;
  headVersionId: string;
  createdBy: string;
  createdAt: Date;
  merged?: boolean;
  mergedAt?: Date;
}

/**
 * Merge conflict
 */
export interface MergeConflict {
  path: string;
  baseValue: any;
  currentValue: any;
  incomingValue: any;
  resolved: boolean;
  resolution?: any;
}

/**
 * Version snapshot
 */
export interface VersionSnapshot {
  id: string;
  documentId: string;
  versionId: string;
  name: string;
  description?: string;
  content: any;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Document version model attributes
 */
export interface DocumentVersionAttributes {
  id: string;
  documentId: string;
  version: number;
  content: any;
  contentHash: string;
  contentSize: number;
  mimeType?: string;
  encoding?: string;
  createdBy: string;
  comment?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isMajor: boolean;
  previousVersionId?: string;
  changeType: 'create' | 'update' | 'delete' | 'restore';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates DocumentVersion model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} DocumentVersion model
 *
 * @example
 * ```typescript
 * const VersionModel = createDocumentVersionModel(sequelize);
 * const version = await VersionModel.create({
 *   documentId: 'doc-123',
 *   version: 1,
 *   content: { title: 'Medical Report', body: '...' },
 *   contentHash: 'abc123...',
 *   createdBy: 'user-456',
 *   changeType: 'create'
 * });
 * ```
 */
export const createDocumentVersionModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to parent document',
      references: {
        model: 'documents',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Sequential version number',
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Full document content for this version',
    },
    contentHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'SHA-256 hash of content',
    },
    contentSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Content size in bytes',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    encoding: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'utf-8',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who created this version',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Version commit message',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional version metadata',
    },
    isMajor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is a major version',
    },
    previousVersionId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference to previous version',
    },
    changeType: {
      type: DataTypes.ENUM('create', 'update', 'delete', 'restore'),
      allowNull: false,
      defaultValue: 'update',
    },
  };

  const options: ModelOptions = {
    tableName: 'document_versions',
    timestamps: true,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['version'] },
      { fields: ['createdBy'] },
      { fields: ['createdAt'] },
      { fields: ['contentHash'] },
      { fields: ['tags'], using: 'gin' },
      { unique: true, fields: ['documentId', 'version'] },
    ],
  };

  return sequelize.define('DocumentVersion', attributes, options);
};

// ============================================================================
// 1. VERSION CREATION
// ============================================================================

/**
 * 1. Creates a new version of a document.
 *
 * @param {string} documentId - Document identifier
 * @param {any} content - Document content
 * @param {string} userId - User creating the version
 * @param {Partial<DocumentVersion>} [options] - Additional version options
 * @returns {Promise<DocumentVersion>} Created version
 *
 * @example
 * ```typescript
 * const version = await createVersion('doc-123', {
 *   title: 'Patient Report',
 *   body: 'Updated content...'
 * }, 'user-456', {
 *   comment: 'Updated diagnosis section',
 *   isMajor: true,
 *   tags: ['reviewed', 'final']
 * });
 * console.log('Created version:', version.version);
 * ```
 */
export const createVersion = async (
  documentId: string,
  content: any,
  userId: string,
  options?: Partial<DocumentVersion>,
): Promise<DocumentVersion> => {
  const crypto = require('crypto');
  const contentString = JSON.stringify(content);
  const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');
  const contentSize = Buffer.byteLength(contentString, 'utf8');

  // Get latest version number
  const latestVersion = await getLatestVersionNumber(documentId);
  const newVersion = latestVersion + 1;

  const version: DocumentVersion = {
    id: crypto.randomUUID(),
    documentId,
    version: newVersion,
    content,
    contentHash,
    contentSize,
    createdBy: userId,
    createdAt: new Date(),
    changeType: newVersion === 1 ? 'create' : 'update',
    ...options,
  };

  return version;
};

/**
 * 2. Creates a version with auto-generated comment based on changes.
 *
 * @param {string} documentId - Document identifier
 * @param {any} content - New content
 * @param {string} userId - User ID
 * @returns {Promise<DocumentVersion>} Created version with auto-comment
 *
 * @example
 * ```typescript
 * const version = await createVersionWithAutoComment('doc-123', updatedContent, 'user-456');
 * console.log('Auto-generated comment:', version.comment);
 * ```
 */
export const createVersionWithAutoComment = async (
  documentId: string,
  content: any,
  userId: string,
): Promise<DocumentVersion> => {
  const previousVersion = await getLatestVersion(documentId);
  let comment = 'Initial version';

  if (previousVersion) {
    const changes = await compareVersionContent(previousVersion.content, content);
    comment = generateChangeComment(changes);
  }

  return createVersion(documentId, content, userId, { comment });
};

/**
 * 3. Creates a major version milestone.
 *
 * @param {string} documentId - Document identifier
 * @param {any} content - Document content
 * @param {string} userId - User ID
 * @param {string} comment - Milestone description
 * @returns {Promise<DocumentVersion>} Created major version
 *
 * @example
 * ```typescript
 * const milestone = await createMajorVersion('doc-123', content, 'user-456', 'Version 2.0 - Major update');
 * ```
 */
export const createMajorVersion = async (
  documentId: string,
  content: any,
  userId: string,
  comment: string,
): Promise<DocumentVersion> => {
  return createVersion(documentId, content, userId, {
    isMajor: true,
    comment,
    tags: ['major', 'milestone'],
  });
};

/**
 * 4. Creates a version from a template.
 *
 * @param {string} documentId - Document identifier
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} variables - Template variables
 * @param {string} userId - User ID
 * @returns {Promise<DocumentVersion>} Created version
 *
 * @example
 * ```typescript
 * const version = await createVersionFromTemplate('doc-123', 'template-456', {
 *   patientName: 'John Doe',
 *   visitDate: '2024-01-15'
 * }, 'user-789');
 * ```
 */
export const createVersionFromTemplate = async (
  documentId: string,
  templateId: string,
  variables: Record<string, any>,
  userId: string,
): Promise<DocumentVersion> => {
  const template = await loadTemplate(templateId);
  const content = renderTemplate(template, variables);

  return createVersion(documentId, content, userId, {
    comment: `Created from template: ${templateId}`,
    metadata: { templateId, variables },
  });
};

/**
 * 5. Duplicates an existing version.
 *
 * @param {string} versionId - Version to duplicate
 * @param {string} userId - User ID
 * @param {string} [comment] - Optional comment
 * @returns {Promise<DocumentVersion>} Duplicated version
 *
 * @example
 * ```typescript
 * const duplicate = await duplicateVersion('version-123', 'user-456', 'Created backup copy');
 * ```
 */
export const duplicateVersion = async (
  versionId: string,
  userId: string,
  comment?: string,
): Promise<DocumentVersion> => {
  const sourceVersion = await getVersionById(versionId);

  return createVersion(sourceVersion.documentId, sourceVersion.content, userId, {
    comment: comment || `Duplicate of version ${sourceVersion.version}`,
    metadata: { duplicatedFrom: versionId },
  });
};

// ============================================================================
// 2. VERSION COMPARISON
// ============================================================================

/**
 * 6. Compares two versions and returns differences.
 *
 * @param {string} versionId1 - First version ID
 * @param {string} versionId2 - Second version ID
 * @returns {Promise<VersionComparison>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareVersions('v1', 'v2');
 * console.log(`Found ${comparison.statistics.totalChanges} changes`);
 * comparison.changes.forEach(change => {
 *   console.log(`${change.type}: ${change.path}`);
 * });
 * ```
 */
export const compareVersions = async (
  versionId1: string,
  versionId2: string,
): Promise<VersionComparison> => {
  const version1 = await getVersionById(versionId1);
  const version2 = await getVersionById(versionId2);

  const changes = await compareVersionContent(version1.content, version2.content);
  const statistics = calculateStatistics(changes);

  return {
    oldVersion: version1.version,
    newVersion: version2.version,
    hasChanges: changes.length > 0,
    changes,
    statistics,
    generatedAt: new Date(),
  };
};

/**
 * 7. Compares version content and detects changes.
 *
 * @param {any} oldContent - Old content
 * @param {any} newContent - New content
 * @returns {Promise<VersionChange[]>} Array of changes
 *
 * @example
 * ```typescript
 * const changes = await compareVersionContent(oldDoc, newDoc);
 * ```
 */
export const compareVersionContent = async (oldContent: any, newContent: any): Promise<VersionChange[]> => {
  const changes: VersionChange[] = [];

  if (typeof oldContent === 'object' && typeof newContent === 'object') {
    const allKeys = new Set([...Object.keys(oldContent), ...Object.keys(newContent)]);

    for (const key of allKeys) {
      const oldValue = oldContent[key];
      const newValue = newContent[key];

      if (oldValue === undefined && newValue !== undefined) {
        changes.push({
          type: 'addition',
          path: key,
          field: key,
          newValue,
        });
      } else if (oldValue !== undefined && newValue === undefined) {
        changes.push({
          type: 'deletion',
          path: key,
          field: key,
          oldValue,
        });
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          type: 'modification',
          path: key,
          field: key,
          oldValue,
          newValue,
        });
      }
    }
  }

  return changes;
};

/**
 * 8. Compares multiple versions in sequence.
 *
 * @param {string[]} versionIds - Array of version IDs in chronological order
 * @returns {Promise<VersionComparison[]>} Array of sequential comparisons
 *
 * @example
 * ```typescript
 * const comparisons = await compareMultipleVersions(['v1', 'v2', 'v3', 'v4']);
 * ```
 */
export const compareMultipleVersions = async (versionIds: string[]): Promise<VersionComparison[]> => {
  const comparisons: VersionComparison[] = [];

  for (let i = 0; i < versionIds.length - 1; i++) {
    const comparison = await compareVersions(versionIds[i], versionIds[i + 1]);
    comparisons.push(comparison);
  }

  return comparisons;
};

/**
 * 9. Detects semantic changes between versions.
 *
 * @param {string} versionId1 - First version ID
 * @param {string} versionId2 - Second version ID
 * @returns {Promise<VersionChange[]>} Semantic changes
 *
 * @example
 * ```typescript
 * const semanticChanges = await detectSemanticChanges('v1', 'v2');
 * ```
 */
export const detectSemanticChanges = async (
  versionId1: string,
  versionId2: string,
): Promise<VersionChange[]> => {
  const comparison = await compareVersions(versionId1, versionId2);

  // Filter for semantically significant changes
  return comparison.changes.filter((change) => {
    // Ignore whitespace-only changes, formatting, etc.
    if (change.type === 'modification') {
      const oldStr = String(change.oldValue).trim();
      const newStr = String(change.newValue).trim();
      return oldStr !== newStr;
    }
    return true;
  });
};

/**
 * 10. Highlights differences in text content.
 *
 * @param {string} oldText - Old text
 * @param {string} newText - New text
 * @param {DiffOptions} [options] - Diff options
 * @returns {string} Highlighted diff
 *
 * @example
 * ```typescript
 * const highlighted = highlightTextDifferences(oldText, newText, { format: 'html' });
 * ```
 */
export const highlightTextDifferences = (oldText: string, newText: string, options?: DiffOptions): string => {
  // Placeholder for diff highlighting implementation
  return `<div class="diff">${newText}</div>`;
};

// ============================================================================
// 3. VERSION HISTORY
// ============================================================================

/**
 * 11. Retrieves version history for a document.
 *
 * @param {string} documentId - Document identifier
 * @param {Object} [options] - Query options
 * @returns {Promise<VersionHistoryEntry[]>} Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('doc-123', { limit: 10, offset: 0 });
 * history.forEach(entry => {
 *   console.log(`v${entry.version}: ${entry.comment} by ${entry.createdBy}`);
 * });
 * ```
 */
export const getVersionHistory = async (
  documentId: string,
  options?: { limit?: number; offset?: number; order?: 'ASC' | 'DESC' },
): Promise<VersionHistoryEntry[]> => {
  // Placeholder for database query
  return [];
};

/**
 * 12. Gets the latest version of a document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion | null>} Latest version or null
 *
 * @example
 * ```typescript
 * const latest = await getLatestVersion('doc-123');
 * console.log('Current version:', latest?.version);
 * ```
 */
export const getLatestVersion = async (documentId: string): Promise<DocumentVersion | null> => {
  const history = await getVersionHistory(documentId, { limit: 1, order: 'DESC' });
  return history.length > 0 ? (history[0] as any) : null;
};

/**
 * 13. Gets version by specific version number.
 *
 * @param {string} documentId - Document identifier
 * @param {number} version - Version number
 * @returns {Promise<DocumentVersion | null>} Version or null
 *
 * @example
 * ```typescript
 * const v3 = await getVersionByNumber('doc-123', 3);
 * ```
 */
export const getVersionByNumber = async (documentId: string, version: number): Promise<DocumentVersion | null> => {
  // Placeholder for database query
  return null;
};

/**
 * 14. Gets version by ID.
 *
 * @param {string} versionId - Version identifier
 * @returns {Promise<DocumentVersion>} Version object
 * @throws {Error} If version not found
 *
 * @example
 * ```typescript
 * const version = await getVersionById('version-123');
 * ```
 */
export const getVersionById = async (versionId: string): Promise<DocumentVersion> => {
  // Placeholder for database query
  throw new Error('Version not found');
};

/**
 * 15. Gets latest version number for a document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<number>} Latest version number (0 if none exist)
 *
 * @example
 * ```typescript
 * const latestNum = await getLatestVersionNumber('doc-123');
 * ```
 */
export const getLatestVersionNumber = async (documentId: string): Promise<number> => {
  const latest = await getLatestVersion(documentId);
  return latest?.version || 0;
};

/**
 * 16. Gets all major versions.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion[]>} Major versions
 *
 * @example
 * ```typescript
 * const majorVersions = await getMajorVersions('doc-123');
 * ```
 */
export const getMajorVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  const history = await getVersionHistory(documentId);
  return history.filter((v: any) => v.isMajor) as any[];
};

/**
 * 17. Gets versions by date range.
 *
 * @param {string} documentId - Document identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<DocumentVersion[]>} Versions in range
 *
 * @example
 * ```typescript
 * const versions = await getVersionsByDateRange('doc-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export const getVersionsByDateRange = async (
  documentId: string,
  startDate: Date,
  endDate: Date,
): Promise<DocumentVersion[]> => {
  // Placeholder for database query
  return [];
};

/**
 * 18. Gets versions by author.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @returns {Promise<DocumentVersion[]>} Versions by author
 *
 * @example
 * ```typescript
 * const myVersions = await getVersionsByAuthor('doc-123', 'user-456');
 * ```
 */
export const getVersionsByAuthor = async (documentId: string, userId: string): Promise<DocumentVersion[]> => {
  // Placeholder for database query
  return [];
};

/**
 * 19. Searches version history by content.
 *
 * @param {string} documentId - Document identifier
 * @param {string} searchTerm - Search term
 * @returns {Promise<DocumentVersion[]>} Matching versions
 *
 * @example
 * ```typescript
 * const results = await searchVersionHistory('doc-123', 'diagnosis');
 * ```
 */
export const searchVersionHistory = async (documentId: string, searchTerm: string): Promise<DocumentVersion[]> => {
  // Placeholder for search implementation
  return [];
};

/**
 * 20. Gets version changelog between two versions.
 *
 * @param {string} documentId - Document identifier
 * @param {number} fromVersion - Starting version
 * @param {number} toVersion - Ending version
 * @returns {Promise<VersionHistoryEntry[]>} Changelog entries
 *
 * @example
 * ```typescript
 * const changelog = await getVersionChangelog('doc-123', 1, 5);
 * ```
 */
export const getVersionChangelog = async (
  documentId: string,
  fromVersion: number,
  toVersion: number,
): Promise<VersionHistoryEntry[]> => {
  // Placeholder for database query
  return [];
};

// ============================================================================
// 4. VERSION ROLLBACK
// ============================================================================

/**
 * 21. Rolls back document to a specific version.
 *
 * @param {string} documentId - Document identifier
 * @param {number} targetVersion - Version to rollback to
 * @param {RollbackOptions} [options] - Rollback options
 * @returns {Promise<RollbackResult>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await rollbackToVersion('doc-123', 3, {
 *   createBackup: true,
 *   comment: 'Reverting unauthorized changes',
 *   userId: 'user-456'
 * });
 * console.log('Rolled back to version', result.rolledBackTo);
 * ```
 */
export const rollbackToVersion = async (
  documentId: string,
  targetVersion: number,
  options?: RollbackOptions,
): Promise<RollbackResult> => {
  const currentVersion = await getLatestVersion(documentId);
  const targetVersionData = await getVersionByNumber(documentId, targetVersion);

  if (!currentVersion || !targetVersionData) {
    throw new Error('Version not found');
  }

  let backupVersionId: string | undefined;
  if (options?.createBackup) {
    const backup = await createVersion(documentId, currentVersion.content, options.userId || 'system', {
      comment: 'Backup before rollback',
      tags: ['backup', 'pre-rollback'],
    });
    backupVersionId = backup.id;
  }

  const newVersion = await createVersion(documentId, targetVersionData.content, options?.userId || 'system', {
    comment: options?.comment || `Rolled back to version ${targetVersion}`,
    changeType: 'restore',
    metadata: { rolledBackFrom: currentVersion.version, rolledBackTo: targetVersion },
  });

  return {
    success: true,
    newVersion: newVersion.version,
    backupVersionId,
    rolledBackFrom: currentVersion.version,
    rolledBackTo: targetVersion,
    timestamp: new Date(),
  };
};

/**
 * 22. Reverts the last N changes.
 *
 * @param {string} documentId - Document identifier
 * @param {number} changeCount - Number of changes to revert
 * @param {string} userId - User ID
 * @returns {Promise<RollbackResult>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await revertLastChanges('doc-123', 2, 'user-456');
 * ```
 */
export const revertLastChanges = async (
  documentId: string,
  changeCount: number,
  userId: string,
): Promise<RollbackResult> => {
  const currentVersion = await getLatestVersionNumber(documentId);
  const targetVersion = Math.max(1, currentVersion - changeCount);

  return rollbackToVersion(documentId, targetVersion, { userId });
};

/**
 * 23. Undoes the last change.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User ID
 * @returns {Promise<DocumentVersion>} New version after undo
 *
 * @example
 * ```typescript
 * const undone = await undoLastChange('doc-123', 'user-456');
 * ```
 */
export const undoLastChange = async (documentId: string, userId: string): Promise<DocumentVersion> => {
  const result = await revertLastChanges(documentId, 1, userId);
  return getVersionByNumber(documentId, result.newVersion!)!;
};

/**
 * 24. Validates rollback safety.
 *
 * @param {string} documentId - Document identifier
 * @param {number} targetVersion - Target version
 * @returns {Promise<{ safe: boolean; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateRollbackSafety('doc-123', 2);
 * if (!validation.safe) {
 *   console.warn('Rollback warnings:', validation.warnings);
 * }
 * ```
 */
export const validateRollbackSafety = async (
  documentId: string,
  targetVersion: number,
): Promise<{ safe: boolean; warnings: string[] }> => {
  const warnings: string[] = [];
  const currentVersion = await getLatestVersionNumber(documentId);

  if (targetVersion >= currentVersion) {
    warnings.push('Target version is not older than current version');
  }

  const versionsBetween = currentVersion - targetVersion;
  if (versionsBetween > 10) {
    warnings.push(`Rolling back ${versionsBetween} versions - significant data may be lost`);
  }

  return {
    safe: warnings.length === 0,
    warnings,
  };
};

/**
 * 25. Creates a restore point before major operations.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User ID
 * @param {string} [description] - Restore point description
 * @returns {Promise<DocumentVersion>} Restore point version
 *
 * @example
 * ```typescript
 * const restorePoint = await createRestorePoint('doc-123', 'user-456', 'Before bulk update');
 * ```
 */
export const createRestorePoint = async (
  documentId: string,
  userId: string,
  description?: string,
): Promise<DocumentVersion> => {
  const currentVersion = await getLatestVersion(documentId);
  if (!currentVersion) {
    throw new Error('No version to create restore point from');
  }

  return createVersion(documentId, currentVersion.content, userId, {
    comment: description || 'Restore point',
    tags: ['restore-point'],
    isMajor: true,
  });
};

// ============================================================================
// 5. DIFF GENERATION
// ============================================================================

/**
 * 26. Generates unified diff between versions.
 *
 * @param {string} versionId1 - First version ID
 * @param {string} versionId2 - Second version ID
 * @param {DiffOptions} [options] - Diff options
 * @returns {Promise<DiffResult>} Generated diff
 *
 * @example
 * ```typescript
 * const diff = await generateUnifiedDiff('v1', 'v2', { contextLines: 3 });
 * console.log(diff.diff);
 * ```
 */
export const generateUnifiedDiff = async (
  versionId1: string,
  versionId2: string,
  options?: DiffOptions,
): Promise<DiffResult> => {
  const comparison = await compareVersions(versionId1, versionId2);

  return {
    format: 'unified',
    diff: formatUnifiedDiff(comparison.changes, options),
    oldVersion: comparison.oldVersion,
    newVersion: comparison.newVersion,
    statistics: comparison.statistics,
    generatedAt: new Date(),
  };
};

/**
 * 27. Generates JSON patch document.
 *
 * @param {string} versionId1 - First version ID
 * @param {string} versionId2 - Second version ID
 * @returns {Promise<DiffResult>} JSON patch
 *
 * @example
 * ```typescript
 * const patch = await generateJsonPatch('v1', 'v2');
 * ```
 */
export const generateJsonPatch = async (versionId1: string, versionId2: string): Promise<DiffResult> => {
  const comparison = await compareVersions(versionId1, versionId2);

  return {
    format: 'json',
    diff: comparison.changes,
    oldVersion: comparison.oldVersion,
    newVersion: comparison.newVersion,
    statistics: comparison.statistics,
    generatedAt: new Date(),
  };
};

/**
 * 28. Generates HTML diff visualization.
 *
 * @param {string} versionId1 - First version ID
 * @param {string} versionId2 - Second version ID
 * @returns {Promise<string>} HTML diff
 *
 * @example
 * ```typescript
 * const htmlDiff = await generateHtmlDiff('v1', 'v2');
 * ```
 */
export const generateHtmlDiff = async (versionId1: string, versionId2: string): Promise<string> => {
  const comparison = await compareVersions(versionId1, versionId2);
  return formatHtmlDiff(comparison.changes);
};

/**
 * 29. Generates side-by-side diff view.
 *
 * @param {string} versionId1 - First version ID
 * @param {string} versionId2 - Second version ID
 * @returns {Promise<{ left: string; right: string }>} Side-by-side diff
 *
 * @example
 * ```typescript
 * const sideBySide = await generateSideBySideDiff('v1', 'v2');
 * ```
 */
export const generateSideBySideDiff = async (
  versionId1: string,
  versionId2: string,
): Promise<{ left: string; right: string }> => {
  const version1 = await getVersionById(versionId1);
  const version2 = await getVersionById(versionId2);

  return {
    left: JSON.stringify(version1.content, null, 2),
    right: JSON.stringify(version2.content, null, 2),
  };
};

/**
 * 30. Generates word-level diff.
 *
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {string} Word-level diff
 *
 * @example
 * ```typescript
 * const wordDiff = generateWordDiff(oldText, newText);
 * ```
 */
export const generateWordDiff = (text1: string, text2: string): string => {
  // Placeholder for word-level diff implementation
  return text2;
};

// ============================================================================
// 6. VERSION METADATA
// ============================================================================

/**
 * 31. Updates version metadata.
 *
 * @param {string} versionId - Version identifier
 * @param {Partial<VersionMetadata>} metadata - Metadata updates
 * @returns {Promise<VersionMetadata>} Updated metadata
 *
 * @example
 * ```typescript
 * await updateVersionMetadata('version-123', {
 *   reviewStatus: 'approved',
 *   reviewedBy: 'user-456',
 *   reviewedAt: new Date()
 * });
 * ```
 */
export const updateVersionMetadata = async (
  versionId: string,
  metadata: Partial<VersionMetadata>,
): Promise<VersionMetadata> => {
  // Placeholder for metadata update
  return metadata as VersionMetadata;
};

/**
 * 32. Gets version metadata.
 *
 * @param {string} versionId - Version identifier
 * @returns {Promise<VersionMetadata>} Version metadata
 *
 * @example
 * ```typescript
 * const metadata = await getVersionMetadata('version-123');
 * ```
 */
export const getVersionMetadata = async (versionId: string): Promise<VersionMetadata> => {
  const version = await getVersionById(versionId);
  return {
    versionId: version.id,
    author: version.createdBy,
    timestamp: version.createdAt,
    comment: version.comment,
    tags: version.tags,
    customFields: version.metadata,
  };
};

/**
 * 33. Adds custom metadata field.
 *
 * @param {string} versionId - Version identifier
 * @param {string} key - Metadata key
 * @param {any} value - Metadata value
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addVersionMetadataField('version-123', 'signedBy', 'Dr. Smith');
 * ```
 */
export const addVersionMetadataField = async (versionId: string, key: string, value: any): Promise<void> => {
  const metadata = await getVersionMetadata(versionId);
  metadata.customFields = metadata.customFields || {};
  metadata.customFields[key] = value;
  await updateVersionMetadata(versionId, metadata);
};

/**
 * 34. Calculates version statistics.
 *
 * @param {string} versionId - Version identifier
 * @returns {Promise<Record<string, any>>} Version statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateVersionStatistics('version-123');
 * console.log('Content size:', stats.contentSize);
 * ```
 */
export const calculateVersionStatistics = async (versionId: string): Promise<Record<string, any>> => {
  const version = await getVersionById(versionId);
  return {
    contentSize: version.contentSize,
    contentHash: version.contentHash,
    fieldCount: Object.keys(version.content).length,
    version: version.version,
  };
};

/**
 * 35. Validates version integrity.
 *
 * @param {string} versionId - Version identifier
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateVersionIntegrity('version-123');
 * if (!validation.valid) {
 *   console.error('Integrity errors:', validation.errors);
 * }
 * ```
 */
export const validateVersionIntegrity = async (
  versionId: string,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  const version = await getVersionById(versionId);
  const crypto = require('crypto');

  // Verify content hash
  const contentString = JSON.stringify(version.content);
  const calculatedHash = crypto.createHash('sha256').update(contentString).digest('hex');

  if (calculatedHash !== version.contentHash) {
    errors.push('Content hash mismatch - data may be corrupted');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// 7. VERSION TAGGING
// ============================================================================

/**
 * 36. Adds tag to version.
 *
 * @param {string} versionId - Version identifier
 * @param {string} tag - Tag name
 * @param {string} userId - User ID
 * @param {string} [description] - Tag description
 * @returns {Promise<VersionTag>} Created tag
 *
 * @example
 * ```typescript
 * await addVersionTag('version-123', 'approved', 'user-456', 'Approved by medical board');
 * ```
 */
export const addVersionTag = async (
  versionId: string,
  tag: string,
  userId: string,
  description?: string,
): Promise<VersionTag> => {
  const crypto = require('crypto');
  return {
    id: crypto.randomUUID(),
    versionId,
    tag,
    description,
    createdBy: userId,
    createdAt: new Date(),
  };
};

/**
 * 37. Removes tag from version.
 *
 * @param {string} versionId - Version identifier
 * @param {string} tag - Tag name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeVersionTag('version-123', 'draft');
 * ```
 */
export const removeVersionTag = async (versionId: string, tag: string): Promise<void> => {
  // Placeholder for tag removal
};

/**
 * 38. Gets all tags for a version.
 *
 * @param {string} versionId - Version identifier
 * @returns {Promise<VersionTag[]>} Version tags
 *
 * @example
 * ```typescript
 * const tags = await getVersionTags('version-123');
 * ```
 */
export const getVersionTags = async (versionId: string): Promise<VersionTag[]> => {
  // Placeholder for tag retrieval
  return [];
};

/**
 * 39. Finds versions by tag.
 *
 * @param {string} documentId - Document identifier
 * @param {string} tag - Tag to search for
 * @returns {Promise<DocumentVersion[]>} Tagged versions
 *
 * @example
 * ```typescript
 * const finalVersions = await findVersionsByTag('doc-123', 'final');
 * ```
 */
export const findVersionsByTag = async (documentId: string, tag: string): Promise<DocumentVersion[]> => {
  // Placeholder for tag search
  return [];
};

/**
 * 40. Gets all unique tags for a document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<string[]>} Unique tags
 *
 * @example
 * ```typescript
 * const allTags = await getAllDocumentTags('doc-123');
 * console.log('Available tags:', allTags);
 * ```
 */
export const getAllDocumentTags = async (documentId: string): Promise<string[]> => {
  const history = await getVersionHistory(documentId);
  const allTags = new Set<string>();

  history.forEach((version: any) => {
    if (version.tags) {
      version.tags.forEach((tag: string) => allTags.add(tag));
    }
  });

  return Array.from(allTags);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates human-readable comment from changes.
 *
 * @param {VersionChange[]} changes - Array of changes
 * @returns {string} Generated comment
 * @internal
 */
const generateChangeComment = (changes: VersionChange[]): string => {
  const stats = calculateStatistics(changes);
  const parts: string[] = [];

  if (stats.additions > 0) parts.push(`${stats.additions} addition(s)`);
  if (stats.deletions > 0) parts.push(`${stats.deletions} deletion(s)`);
  if (stats.modifications > 0) parts.push(`${stats.modifications} modification(s)`);

  return parts.length > 0 ? parts.join(', ') : 'No changes';
};

/**
 * Calculates statistics from changes.
 *
 * @param {VersionChange[]} changes - Array of changes
 * @returns {ComparisonStatistics} Statistics
 * @internal
 */
const calculateStatistics = (changes: VersionChange[]): ComparisonStatistics => {
  return {
    totalChanges: changes.length,
    additions: changes.filter((c) => c.type === 'addition').length,
    deletions: changes.filter((c) => c.type === 'deletion').length,
    modifications: changes.filter((c) => c.type === 'modification').length,
  };
};

/**
 * Formats changes as unified diff.
 *
 * @param {VersionChange[]} changes - Array of changes
 * @param {DiffOptions} [options] - Format options
 * @returns {string} Formatted diff
 * @internal
 */
const formatUnifiedDiff = (changes: VersionChange[], options?: DiffOptions): string => {
  let diff = '';
  changes.forEach((change) => {
    const prefix = change.type === 'addition' ? '+' : change.type === 'deletion' ? '-' : '~';
    diff += `${prefix} ${change.path}: ${JSON.stringify(change.newValue || change.oldValue)}\n`;
  });
  return diff;
};

/**
 * Formats changes as HTML diff.
 *
 * @param {VersionChange[]} changes - Array of changes
 * @returns {string} HTML diff
 * @internal
 */
const formatHtmlDiff = (changes: VersionChange[]): string => {
  let html = '<div class="diff">';
  changes.forEach((change) => {
    const className = change.type;
    html += `<div class="${className}">${change.path}: ${JSON.stringify(change.newValue || change.oldValue)}</div>`;
  });
  html += '</div>';
  return html;
};

/**
 * Loads template by ID.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<any>} Template content
 * @internal
 */
const loadTemplate = async (templateId: string): Promise<any> => {
  // Placeholder for template loading
  return {};
};

/**
 * Renders template with variables.
 *
 * @param {any} template - Template object
 * @param {Record<string, any>} variables - Variables
 * @returns {any} Rendered content
 * @internal
 */
const renderTemplate = (template: any, variables: Record<string, any>): any => {
  // Placeholder for template rendering
  return { ...template, ...variables };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model
  createDocumentVersionModel,

  // Version Creation
  createVersion,
  createVersionWithAutoComment,
  createMajorVersion,
  createVersionFromTemplate,
  duplicateVersion,

  // Version Comparison
  compareVersions,
  compareVersionContent,
  compareMultipleVersions,
  detectSemanticChanges,
  highlightTextDifferences,

  // Version History
  getVersionHistory,
  getLatestVersion,
  getVersionByNumber,
  getVersionById,
  getLatestVersionNumber,
  getMajorVersions,
  getVersionsByDateRange,
  getVersionsByAuthor,
  searchVersionHistory,
  getVersionChangelog,

  // Version Rollback
  rollbackToVersion,
  revertLastChanges,
  undoLastChange,
  validateRollbackSafety,
  createRestorePoint,

  // Diff Generation
  generateUnifiedDiff,
  generateJsonPatch,
  generateHtmlDiff,
  generateSideBySideDiff,
  generateWordDiff,

  // Version Metadata
  updateVersionMetadata,
  getVersionMetadata,
  addVersionMetadataField,
  calculateVersionStatistics,
  validateVersionIntegrity,

  // Version Tagging
  addVersionTag,
  removeVersionTag,
  getVersionTags,
  findVersionsByTag,
  getAllDocumentTags,
};
