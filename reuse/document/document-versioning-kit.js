"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDocumentTags = exports.findVersionsByTag = exports.getVersionTags = exports.removeVersionTag = exports.addVersionTag = exports.validateVersionIntegrity = exports.calculateVersionStatistics = exports.addVersionMetadataField = exports.getVersionMetadata = exports.updateVersionMetadata = exports.generateWordDiff = exports.generateSideBySideDiff = exports.generateHtmlDiff = exports.generateJsonPatch = exports.generateUnifiedDiff = exports.createRestorePoint = exports.validateRollbackSafety = exports.undoLastChange = exports.revertLastChanges = exports.rollbackToVersion = exports.getVersionChangelog = exports.searchVersionHistory = exports.getVersionsByAuthor = exports.getVersionsByDateRange = exports.getMajorVersions = exports.getLatestVersionNumber = exports.getVersionById = exports.getVersionByNumber = exports.getLatestVersion = exports.getVersionHistory = exports.highlightTextDifferences = exports.detectSemanticChanges = exports.compareMultipleVersions = exports.compareVersionContent = exports.compareVersions = exports.duplicateVersion = exports.createVersionFromTemplate = exports.createMajorVersion = exports.createVersionWithAutoComment = exports.createVersion = exports.createDocumentVersionModel = void 0;
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
const sequelize_1 = require("sequelize");
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
const createDocumentVersionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to parent document',
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Sequential version number',
        },
        content: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Full document content for this version',
        },
        contentHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            comment: 'SHA-256 hash of content',
        },
        contentSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Content size in bytes',
        },
        mimeType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        encoding: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'utf-8',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who created this version',
        },
        comment: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Version commit message',
        },
        tags: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional version metadata',
        },
        isMajor: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is a major version',
        },
        previousVersionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Reference to previous version',
        },
        changeType: {
            type: sequelize_1.DataTypes.ENUM('create', 'update', 'delete', 'restore'),
            allowNull: false,
            defaultValue: 'update',
        },
    };
    const options = {
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
exports.createDocumentVersionModel = createDocumentVersionModel;
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
const createVersion = async (documentId, content, userId, options) => {
    const crypto = require('crypto');
    const contentString = JSON.stringify(content);
    const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');
    const contentSize = Buffer.byteLength(contentString, 'utf8');
    // Get latest version number
    const latestVersion = await (0, exports.getLatestVersionNumber)(documentId);
    const newVersion = latestVersion + 1;
    const version = {
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
exports.createVersion = createVersion;
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
const createVersionWithAutoComment = async (documentId, content, userId) => {
    const previousVersion = await (0, exports.getLatestVersion)(documentId);
    let comment = 'Initial version';
    if (previousVersion) {
        const changes = await (0, exports.compareVersionContent)(previousVersion.content, content);
        comment = generateChangeComment(changes);
    }
    return (0, exports.createVersion)(documentId, content, userId, { comment });
};
exports.createVersionWithAutoComment = createVersionWithAutoComment;
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
const createMajorVersion = async (documentId, content, userId, comment) => {
    return (0, exports.createVersion)(documentId, content, userId, {
        isMajor: true,
        comment,
        tags: ['major', 'milestone'],
    });
};
exports.createMajorVersion = createMajorVersion;
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
const createVersionFromTemplate = async (documentId, templateId, variables, userId) => {
    const template = await loadTemplate(templateId);
    const content = renderTemplate(template, variables);
    return (0, exports.createVersion)(documentId, content, userId, {
        comment: `Created from template: ${templateId}`,
        metadata: { templateId, variables },
    });
};
exports.createVersionFromTemplate = createVersionFromTemplate;
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
const duplicateVersion = async (versionId, userId, comment) => {
    const sourceVersion = await (0, exports.getVersionById)(versionId);
    return (0, exports.createVersion)(sourceVersion.documentId, sourceVersion.content, userId, {
        comment: comment || `Duplicate of version ${sourceVersion.version}`,
        metadata: { duplicatedFrom: versionId },
    });
};
exports.duplicateVersion = duplicateVersion;
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
const compareVersions = async (versionId1, versionId2) => {
    const version1 = await (0, exports.getVersionById)(versionId1);
    const version2 = await (0, exports.getVersionById)(versionId2);
    const changes = await (0, exports.compareVersionContent)(version1.content, version2.content);
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
exports.compareVersions = compareVersions;
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
const compareVersionContent = async (oldContent, newContent) => {
    const changes = [];
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
            }
            else if (oldValue !== undefined && newValue === undefined) {
                changes.push({
                    type: 'deletion',
                    path: key,
                    field: key,
                    oldValue,
                });
            }
            else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
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
exports.compareVersionContent = compareVersionContent;
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
const compareMultipleVersions = async (versionIds) => {
    const comparisons = [];
    for (let i = 0; i < versionIds.length - 1; i++) {
        const comparison = await (0, exports.compareVersions)(versionIds[i], versionIds[i + 1]);
        comparisons.push(comparison);
    }
    return comparisons;
};
exports.compareMultipleVersions = compareMultipleVersions;
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
const detectSemanticChanges = async (versionId1, versionId2) => {
    const comparison = await (0, exports.compareVersions)(versionId1, versionId2);
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
exports.detectSemanticChanges = detectSemanticChanges;
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
const highlightTextDifferences = (oldText, newText, options) => {
    // Placeholder for diff highlighting implementation
    return `<div class="diff">${newText}</div>`;
};
exports.highlightTextDifferences = highlightTextDifferences;
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
const getVersionHistory = async (documentId, options) => {
    // Placeholder for database query
    return [];
};
exports.getVersionHistory = getVersionHistory;
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
const getLatestVersion = async (documentId) => {
    const history = await (0, exports.getVersionHistory)(documentId, { limit: 1, order: 'DESC' });
    return history.length > 0 ? history[0] : null;
};
exports.getLatestVersion = getLatestVersion;
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
const getVersionByNumber = async (documentId, version) => {
    // Placeholder for database query
    return null;
};
exports.getVersionByNumber = getVersionByNumber;
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
const getVersionById = async (versionId) => {
    // Placeholder for database query
    throw new Error('Version not found');
};
exports.getVersionById = getVersionById;
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
const getLatestVersionNumber = async (documentId) => {
    const latest = await (0, exports.getLatestVersion)(documentId);
    return latest?.version || 0;
};
exports.getLatestVersionNumber = getLatestVersionNumber;
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
const getMajorVersions = async (documentId) => {
    const history = await (0, exports.getVersionHistory)(documentId);
    return history.filter((v) => v.isMajor);
};
exports.getMajorVersions = getMajorVersions;
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
const getVersionsByDateRange = async (documentId, startDate, endDate) => {
    // Placeholder for database query
    return [];
};
exports.getVersionsByDateRange = getVersionsByDateRange;
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
const getVersionsByAuthor = async (documentId, userId) => {
    // Placeholder for database query
    return [];
};
exports.getVersionsByAuthor = getVersionsByAuthor;
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
const searchVersionHistory = async (documentId, searchTerm) => {
    // Placeholder for search implementation
    return [];
};
exports.searchVersionHistory = searchVersionHistory;
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
const getVersionChangelog = async (documentId, fromVersion, toVersion) => {
    // Placeholder for database query
    return [];
};
exports.getVersionChangelog = getVersionChangelog;
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
const rollbackToVersion = async (documentId, targetVersion, options) => {
    const currentVersion = await (0, exports.getLatestVersion)(documentId);
    const targetVersionData = await (0, exports.getVersionByNumber)(documentId, targetVersion);
    if (!currentVersion || !targetVersionData) {
        throw new Error('Version not found');
    }
    let backupVersionId;
    if (options?.createBackup) {
        const backup = await (0, exports.createVersion)(documentId, currentVersion.content, options.userId || 'system', {
            comment: 'Backup before rollback',
            tags: ['backup', 'pre-rollback'],
        });
        backupVersionId = backup.id;
    }
    const newVersion = await (0, exports.createVersion)(documentId, targetVersionData.content, options?.userId || 'system', {
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
exports.rollbackToVersion = rollbackToVersion;
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
const revertLastChanges = async (documentId, changeCount, userId) => {
    const currentVersion = await (0, exports.getLatestVersionNumber)(documentId);
    const targetVersion = Math.max(1, currentVersion - changeCount);
    return (0, exports.rollbackToVersion)(documentId, targetVersion, { userId });
};
exports.revertLastChanges = revertLastChanges;
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
const undoLastChange = async (documentId, userId) => {
    const result = await (0, exports.revertLastChanges)(documentId, 1, userId);
    return (0, exports.getVersionByNumber)(documentId, result.newVersion);
};
exports.undoLastChange = undoLastChange;
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
const validateRollbackSafety = async (documentId, targetVersion) => {
    const warnings = [];
    const currentVersion = await (0, exports.getLatestVersionNumber)(documentId);
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
exports.validateRollbackSafety = validateRollbackSafety;
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
const createRestorePoint = async (documentId, userId, description) => {
    const currentVersion = await (0, exports.getLatestVersion)(documentId);
    if (!currentVersion) {
        throw new Error('No version to create restore point from');
    }
    return (0, exports.createVersion)(documentId, currentVersion.content, userId, {
        comment: description || 'Restore point',
        tags: ['restore-point'],
        isMajor: true,
    });
};
exports.createRestorePoint = createRestorePoint;
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
const generateUnifiedDiff = async (versionId1, versionId2, options) => {
    const comparison = await (0, exports.compareVersions)(versionId1, versionId2);
    return {
        format: 'unified',
        diff: formatUnifiedDiff(comparison.changes, options),
        oldVersion: comparison.oldVersion,
        newVersion: comparison.newVersion,
        statistics: comparison.statistics,
        generatedAt: new Date(),
    };
};
exports.generateUnifiedDiff = generateUnifiedDiff;
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
const generateJsonPatch = async (versionId1, versionId2) => {
    const comparison = await (0, exports.compareVersions)(versionId1, versionId2);
    return {
        format: 'json',
        diff: comparison.changes,
        oldVersion: comparison.oldVersion,
        newVersion: comparison.newVersion,
        statistics: comparison.statistics,
        generatedAt: new Date(),
    };
};
exports.generateJsonPatch = generateJsonPatch;
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
const generateHtmlDiff = async (versionId1, versionId2) => {
    const comparison = await (0, exports.compareVersions)(versionId1, versionId2);
    return formatHtmlDiff(comparison.changes);
};
exports.generateHtmlDiff = generateHtmlDiff;
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
const generateSideBySideDiff = async (versionId1, versionId2) => {
    const version1 = await (0, exports.getVersionById)(versionId1);
    const version2 = await (0, exports.getVersionById)(versionId2);
    return {
        left: JSON.stringify(version1.content, null, 2),
        right: JSON.stringify(version2.content, null, 2),
    };
};
exports.generateSideBySideDiff = generateSideBySideDiff;
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
const generateWordDiff = (text1, text2) => {
    // Placeholder for word-level diff implementation
    return text2;
};
exports.generateWordDiff = generateWordDiff;
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
const updateVersionMetadata = async (versionId, metadata) => {
    // Placeholder for metadata update
    return metadata;
};
exports.updateVersionMetadata = updateVersionMetadata;
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
const getVersionMetadata = async (versionId) => {
    const version = await (0, exports.getVersionById)(versionId);
    return {
        versionId: version.id,
        author: version.createdBy,
        timestamp: version.createdAt,
        comment: version.comment,
        tags: version.tags,
        customFields: version.metadata,
    };
};
exports.getVersionMetadata = getVersionMetadata;
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
const addVersionMetadataField = async (versionId, key, value) => {
    const metadata = await (0, exports.getVersionMetadata)(versionId);
    metadata.customFields = metadata.customFields || {};
    metadata.customFields[key] = value;
    await (0, exports.updateVersionMetadata)(versionId, metadata);
};
exports.addVersionMetadataField = addVersionMetadataField;
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
const calculateVersionStatistics = async (versionId) => {
    const version = await (0, exports.getVersionById)(versionId);
    return {
        contentSize: version.contentSize,
        contentHash: version.contentHash,
        fieldCount: Object.keys(version.content).length,
        version: version.version,
    };
};
exports.calculateVersionStatistics = calculateVersionStatistics;
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
const validateVersionIntegrity = async (versionId) => {
    const errors = [];
    const version = await (0, exports.getVersionById)(versionId);
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
exports.validateVersionIntegrity = validateVersionIntegrity;
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
const addVersionTag = async (versionId, tag, userId, description) => {
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
exports.addVersionTag = addVersionTag;
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
const removeVersionTag = async (versionId, tag) => {
    // Placeholder for tag removal
};
exports.removeVersionTag = removeVersionTag;
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
const getVersionTags = async (versionId) => {
    // Placeholder for tag retrieval
    return [];
};
exports.getVersionTags = getVersionTags;
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
const findVersionsByTag = async (documentId, tag) => {
    // Placeholder for tag search
    return [];
};
exports.findVersionsByTag = findVersionsByTag;
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
const getAllDocumentTags = async (documentId) => {
    const history = await (0, exports.getVersionHistory)(documentId);
    const allTags = new Set();
    history.forEach((version) => {
        if (version.tags) {
            version.tags.forEach((tag) => allTags.add(tag));
        }
    });
    return Array.from(allTags);
};
exports.getAllDocumentTags = getAllDocumentTags;
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
const generateChangeComment = (changes) => {
    const stats = calculateStatistics(changes);
    const parts = [];
    if (stats.additions > 0)
        parts.push(`${stats.additions} addition(s)`);
    if (stats.deletions > 0)
        parts.push(`${stats.deletions} deletion(s)`);
    if (stats.modifications > 0)
        parts.push(`${stats.modifications} modification(s)`);
    return parts.length > 0 ? parts.join(', ') : 'No changes';
};
/**
 * Calculates statistics from changes.
 *
 * @param {VersionChange[]} changes - Array of changes
 * @returns {ComparisonStatistics} Statistics
 * @internal
 */
const calculateStatistics = (changes) => {
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
const formatUnifiedDiff = (changes, options) => {
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
const formatHtmlDiff = (changes) => {
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
const loadTemplate = async (templateId) => {
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
const renderTemplate = (template, variables) => {
    // Placeholder for template rendering
    return { ...template, ...variables };
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model
    createDocumentVersionModel: exports.createDocumentVersionModel,
    // Version Creation
    createVersion: exports.createVersion,
    createVersionWithAutoComment: exports.createVersionWithAutoComment,
    createMajorVersion: exports.createMajorVersion,
    createVersionFromTemplate: exports.createVersionFromTemplate,
    duplicateVersion: exports.duplicateVersion,
    // Version Comparison
    compareVersions: exports.compareVersions,
    compareVersionContent: exports.compareVersionContent,
    compareMultipleVersions: exports.compareMultipleVersions,
    detectSemanticChanges: exports.detectSemanticChanges,
    highlightTextDifferences: exports.highlightTextDifferences,
    // Version History
    getVersionHistory: exports.getVersionHistory,
    getLatestVersion: exports.getLatestVersion,
    getVersionByNumber: exports.getVersionByNumber,
    getVersionById: exports.getVersionById,
    getLatestVersionNumber: exports.getLatestVersionNumber,
    getMajorVersions: exports.getMajorVersions,
    getVersionsByDateRange: exports.getVersionsByDateRange,
    getVersionsByAuthor: exports.getVersionsByAuthor,
    searchVersionHistory: exports.searchVersionHistory,
    getVersionChangelog: exports.getVersionChangelog,
    // Version Rollback
    rollbackToVersion: exports.rollbackToVersion,
    revertLastChanges: exports.revertLastChanges,
    undoLastChange: exports.undoLastChange,
    validateRollbackSafety: exports.validateRollbackSafety,
    createRestorePoint: exports.createRestorePoint,
    // Diff Generation
    generateUnifiedDiff: exports.generateUnifiedDiff,
    generateJsonPatch: exports.generateJsonPatch,
    generateHtmlDiff: exports.generateHtmlDiff,
    generateSideBySideDiff: exports.generateSideBySideDiff,
    generateWordDiff: exports.generateWordDiff,
    // Version Metadata
    updateVersionMetadata: exports.updateVersionMetadata,
    getVersionMetadata: exports.getVersionMetadata,
    addVersionMetadataField: exports.addVersionMetadataField,
    calculateVersionStatistics: exports.calculateVersionStatistics,
    validateVersionIntegrity: exports.validateVersionIntegrity,
    // Version Tagging
    addVersionTag: exports.addVersionTag,
    removeVersionTag: exports.removeVersionTag,
    getVersionTags: exports.getVersionTags,
    findVersionsByTag: exports.findVersionsByTag,
    getAllDocumentTags: exports.getAllDocumentTags,
};
//# sourceMappingURL=document-versioning-kit.js.map