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
import { Sequelize } from 'sequelize';
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
export declare const createDocumentVersionModel: (sequelize: Sequelize) => any;
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
export declare const createVersion: (documentId: string, content: any, userId: string, options?: Partial<DocumentVersion>) => Promise<DocumentVersion>;
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
export declare const createVersionWithAutoComment: (documentId: string, content: any, userId: string) => Promise<DocumentVersion>;
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
export declare const createMajorVersion: (documentId: string, content: any, userId: string, comment: string) => Promise<DocumentVersion>;
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
export declare const createVersionFromTemplate: (documentId: string, templateId: string, variables: Record<string, any>, userId: string) => Promise<DocumentVersion>;
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
export declare const duplicateVersion: (versionId: string, userId: string, comment?: string) => Promise<DocumentVersion>;
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
export declare const compareVersions: (versionId1: string, versionId2: string) => Promise<VersionComparison>;
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
export declare const compareVersionContent: (oldContent: any, newContent: any) => Promise<VersionChange[]>;
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
export declare const compareMultipleVersions: (versionIds: string[]) => Promise<VersionComparison[]>;
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
export declare const detectSemanticChanges: (versionId1: string, versionId2: string) => Promise<VersionChange[]>;
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
export declare const highlightTextDifferences: (oldText: string, newText: string, options?: DiffOptions) => string;
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
export declare const getVersionHistory: (documentId: string, options?: {
    limit?: number;
    offset?: number;
    order?: "ASC" | "DESC";
}) => Promise<VersionHistoryEntry[]>;
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
export declare const getLatestVersion: (documentId: string) => Promise<DocumentVersion | null>;
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
export declare const getVersionByNumber: (documentId: string, version: number) => Promise<DocumentVersion | null>;
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
export declare const getVersionById: (versionId: string) => Promise<DocumentVersion>;
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
export declare const getLatestVersionNumber: (documentId: string) => Promise<number>;
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
export declare const getMajorVersions: (documentId: string) => Promise<DocumentVersion[]>;
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
export declare const getVersionsByDateRange: (documentId: string, startDate: Date, endDate: Date) => Promise<DocumentVersion[]>;
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
export declare const getVersionsByAuthor: (documentId: string, userId: string) => Promise<DocumentVersion[]>;
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
export declare const searchVersionHistory: (documentId: string, searchTerm: string) => Promise<DocumentVersion[]>;
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
export declare const getVersionChangelog: (documentId: string, fromVersion: number, toVersion: number) => Promise<VersionHistoryEntry[]>;
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
export declare const rollbackToVersion: (documentId: string, targetVersion: number, options?: RollbackOptions) => Promise<RollbackResult>;
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
export declare const revertLastChanges: (documentId: string, changeCount: number, userId: string) => Promise<RollbackResult>;
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
export declare const undoLastChange: (documentId: string, userId: string) => Promise<DocumentVersion>;
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
export declare const validateRollbackSafety: (documentId: string, targetVersion: number) => Promise<{
    safe: boolean;
    warnings: string[];
}>;
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
export declare const createRestorePoint: (documentId: string, userId: string, description?: string) => Promise<DocumentVersion>;
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
export declare const generateUnifiedDiff: (versionId1: string, versionId2: string, options?: DiffOptions) => Promise<DiffResult>;
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
export declare const generateJsonPatch: (versionId1: string, versionId2: string) => Promise<DiffResult>;
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
export declare const generateHtmlDiff: (versionId1: string, versionId2: string) => Promise<string>;
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
export declare const generateSideBySideDiff: (versionId1: string, versionId2: string) => Promise<{
    left: string;
    right: string;
}>;
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
export declare const generateWordDiff: (text1: string, text2: string) => string;
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
export declare const updateVersionMetadata: (versionId: string, metadata: Partial<VersionMetadata>) => Promise<VersionMetadata>;
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
export declare const getVersionMetadata: (versionId: string) => Promise<VersionMetadata>;
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
export declare const addVersionMetadataField: (versionId: string, key: string, value: any) => Promise<void>;
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
export declare const calculateVersionStatistics: (versionId: string) => Promise<Record<string, any>>;
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
export declare const validateVersionIntegrity: (versionId: string) => Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare const addVersionTag: (versionId: string, tag: string, userId: string, description?: string) => Promise<VersionTag>;
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
export declare const removeVersionTag: (versionId: string, tag: string) => Promise<void>;
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
export declare const getVersionTags: (versionId: string) => Promise<VersionTag[]>;
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
export declare const findVersionsByTag: (documentId: string, tag: string) => Promise<DocumentVersion[]>;
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
export declare const getAllDocumentTags: (documentId: string) => Promise<string[]>;
declare const _default: {
    createDocumentVersionModel: (sequelize: Sequelize) => any;
    createVersion: (documentId: string, content: any, userId: string, options?: Partial<DocumentVersion>) => Promise<DocumentVersion>;
    createVersionWithAutoComment: (documentId: string, content: any, userId: string) => Promise<DocumentVersion>;
    createMajorVersion: (documentId: string, content: any, userId: string, comment: string) => Promise<DocumentVersion>;
    createVersionFromTemplate: (documentId: string, templateId: string, variables: Record<string, any>, userId: string) => Promise<DocumentVersion>;
    duplicateVersion: (versionId: string, userId: string, comment?: string) => Promise<DocumentVersion>;
    compareVersions: (versionId1: string, versionId2: string) => Promise<VersionComparison>;
    compareVersionContent: (oldContent: any, newContent: any) => Promise<VersionChange[]>;
    compareMultipleVersions: (versionIds: string[]) => Promise<VersionComparison[]>;
    detectSemanticChanges: (versionId1: string, versionId2: string) => Promise<VersionChange[]>;
    highlightTextDifferences: (oldText: string, newText: string, options?: DiffOptions) => string;
    getVersionHistory: (documentId: string, options?: {
        limit?: number;
        offset?: number;
        order?: "ASC" | "DESC";
    }) => Promise<VersionHistoryEntry[]>;
    getLatestVersion: (documentId: string) => Promise<DocumentVersion | null>;
    getVersionByNumber: (documentId: string, version: number) => Promise<DocumentVersion | null>;
    getVersionById: (versionId: string) => Promise<DocumentVersion>;
    getLatestVersionNumber: (documentId: string) => Promise<number>;
    getMajorVersions: (documentId: string) => Promise<DocumentVersion[]>;
    getVersionsByDateRange: (documentId: string, startDate: Date, endDate: Date) => Promise<DocumentVersion[]>;
    getVersionsByAuthor: (documentId: string, userId: string) => Promise<DocumentVersion[]>;
    searchVersionHistory: (documentId: string, searchTerm: string) => Promise<DocumentVersion[]>;
    getVersionChangelog: (documentId: string, fromVersion: number, toVersion: number) => Promise<VersionHistoryEntry[]>;
    rollbackToVersion: (documentId: string, targetVersion: number, options?: RollbackOptions) => Promise<RollbackResult>;
    revertLastChanges: (documentId: string, changeCount: number, userId: string) => Promise<RollbackResult>;
    undoLastChange: (documentId: string, userId: string) => Promise<DocumentVersion>;
    validateRollbackSafety: (documentId: string, targetVersion: number) => Promise<{
        safe: boolean;
        warnings: string[];
    }>;
    createRestorePoint: (documentId: string, userId: string, description?: string) => Promise<DocumentVersion>;
    generateUnifiedDiff: (versionId1: string, versionId2: string, options?: DiffOptions) => Promise<DiffResult>;
    generateJsonPatch: (versionId1: string, versionId2: string) => Promise<DiffResult>;
    generateHtmlDiff: (versionId1: string, versionId2: string) => Promise<string>;
    generateSideBySideDiff: (versionId1: string, versionId2: string) => Promise<{
        left: string;
        right: string;
    }>;
    generateWordDiff: (text1: string, text2: string) => string;
    updateVersionMetadata: (versionId: string, metadata: Partial<VersionMetadata>) => Promise<VersionMetadata>;
    getVersionMetadata: (versionId: string) => Promise<VersionMetadata>;
    addVersionMetadataField: (versionId: string, key: string, value: any) => Promise<void>;
    calculateVersionStatistics: (versionId: string) => Promise<Record<string, any>>;
    validateVersionIntegrity: (versionId: string) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    addVersionTag: (versionId: string, tag: string, userId: string, description?: string) => Promise<VersionTag>;
    removeVersionTag: (versionId: string, tag: string) => Promise<void>;
    getVersionTags: (versionId: string) => Promise<VersionTag[]>;
    findVersionsByTag: (documentId: string, tag: string) => Promise<DocumentVersion[]>;
    getAllDocumentTags: (documentId: string) => Promise<string[]>;
};
export default _default;
//# sourceMappingURL=document-versioning-kit.d.ts.map