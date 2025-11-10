/**
 * @fileoverview Enterprise Version Control Kit for React/Next.js
 * @module reuse/frontend/version-control-kit
 *
 * @description
 * Comprehensive content versioning system with Git-like capabilities for React applications.
 * Provides version history, branching, merging, diffing, conflict resolution, and restoration.
 *
 * @example
 * ```tsx
 * // Basic version management
 * const { versions, createVersion, restoreVersion } = useVersionHistory(contentId);
 *
 * // Create new version
 * await createVersion({
 *   content: editorContent,
 *   message: 'Updated introduction section',
 *   tags: ['draft', 'review-needed']
 * });
 *
 * // Compare versions
 * const { diff, changes } = useVersionCompare(version1, version2);
 *
 * // Auto-versioning
 * const { savePoint, autoSave } = useAutoVersioning({
 *   interval: 300000, // 5 minutes
 *   onSave: (version) => console.log('Auto-saved', version)
 * });
 * ```
 *
 * @author Enterprise Version Control Team
 * @copyright 2025 White Cross. All rights reserved.
 * @license MIT
 * @version 2.0.0
 */
/**
 * Version change type enumeration
 */
export type VersionChangeType = 'addition' | 'deletion' | 'modification' | 'move' | 'rename';
/**
 * Version status enumeration
 */
export type VersionStatus = 'draft' | 'published' | 'archived' | 'deleted';
/**
 * Merge conflict type enumeration
 */
export type ConflictType = 'content' | 'metadata' | 'structure' | 'permission';
/**
 * Version permission level enumeration
 */
export type VersionPermission = 'view' | 'edit' | 'restore' | 'delete' | 'admin';
/**
 * Represents a single content version
 */
export interface Version<T = any> {
    /** Unique version identifier */
    id: string;
    /** Content ID this version belongs to */
    contentId: string;
    /** Version number (incremental) */
    versionNumber: number;
    /** Branch name (default: 'main') */
    branch: string;
    /** Parent version ID */
    parentId: string | null;
    /** The actual content snapshot */
    content: T;
    /** Content hash for integrity */
    contentHash: string;
    /** Version commit message */
    message: string;
    /** Creator user ID */
    createdBy: string;
    /** Creator display name */
    createdByName: string;
    /** Creation timestamp */
    createdAt: Date;
    /** Version tags */
    tags: string[];
    /** Version metadata */
    metadata: Record<string, any>;
    /** Version status */
    status: VersionStatus;
    /** File size in bytes */
    size: number;
    /** Is this version locked */
    locked: boolean;
    /** Locked by user ID */
    lockedBy: string | null;
    /** Lock expiration */
    lockedUntil: Date | null;
}
/**
 * Represents a revision (lightweight version)
 */
export interface Revision {
    /** Revision ID */
    id: string;
    /** Version ID */
    versionId: string;
    /** Revision timestamp */
    timestamp: Date;
    /** Revision author */
    author: string;
    /** Brief description */
    description: string;
    /** Changed fields */
    changedFields: string[];
}
/**
 * Represents a diff between two versions
 */
export interface VersionDiff {
    /** Source version ID */
    sourceId: string;
    /** Target version ID */
    targetId: string;
    /** List of changes */
    changes: DiffChange[];
    /** Total additions */
    additions: number;
    /** Total deletions */
    deletions: number;
    /** Total modifications */
    modifications: number;
    /** Similarity percentage (0-100) */
    similarity: number;
    /** Generated timestamp */
    generatedAt: Date;
}
/**
 * Represents a single diff change
 */
export interface DiffChange {
    /** Change ID */
    id: string;
    /** Type of change */
    type: VersionChangeType;
    /** Field path (e.g., 'content.sections[0].title') */
    path: string;
    /** Old value */
    oldValue: any;
    /** New value */
    newValue: any;
    /** Line number (for text content) */
    lineNumber?: number;
    /** Character offset */
    offset?: number;
    /** Change length */
    length?: number;
}
/**
 * Version comparison result
 */
export interface VersionComparison {
    /** Base version */
    base: Version;
    /** Compare version */
    compare: Version;
    /** Diff details */
    diff: VersionDiff;
    /** Has conflicts */
    hasConflicts: boolean;
    /** Conflict details */
    conflicts: MergeConflict[];
}
/**
 * Merge conflict representation
 */
export interface MergeConflict {
    /** Conflict ID */
    id: string;
    /** Conflict type */
    type: ConflictType;
    /** Field path */
    path: string;
    /** Base version value */
    base: any;
    /** Source version value */
    source: any;
    /** Target version value */
    target: any;
    /** Resolution strategy */
    resolution?: 'use-source' | 'use-target' | 'merge' | 'manual';
    /** Resolved value */
    resolvedValue?: any;
    /** Is resolved */
    resolved: boolean;
}
/**
 * Branch representation
 */
export interface VersionBranch {
    /** Branch name */
    name: string;
    /** Branch description */
    description: string;
    /** Base version ID */
    baseVersionId: string;
    /** Current HEAD version ID */
    headVersionId: string;
    /** Created by */
    createdBy: string;
    /** Created at */
    createdAt: Date;
    /** Last modified */
    lastModified: Date;
    /** Is protected */
    protected: boolean;
    /** Version count */
    versionCount: number;
}
/**
 * Version metadata
 */
export interface VersionMetadata {
    /** Custom fields */
    [key: string]: any;
    /** Editor info */
    editor?: string;
    /** Device info */
    device?: string;
    /** IP address */
    ip?: string;
    /** Geolocation */
    location?: string;
    /** Duration (editing time) */
    duration?: number;
    /** Word count */
    wordCount?: number;
    /** Character count */
    characterCount?: number;
}
/**
 * Version comment
 */
export interface VersionComment {
    /** Comment ID */
    id: string;
    /** Version ID */
    versionId: string;
    /** Author ID */
    authorId: string;
    /** Author name */
    authorName: string;
    /** Comment text */
    text: string;
    /** Created at */
    createdAt: Date;
    /** Updated at */
    updatedAt: Date;
    /** Parent comment ID (for threads) */
    parentId: string | null;
    /** Replies */
    replies: VersionComment[];
}
/**
 * Version tag
 */
export interface VersionTag {
    /** Tag ID */
    id: string;
    /** Tag name */
    name: string;
    /** Tag color */
    color: string;
    /** Tag description */
    description?: string;
    /** Created at */
    createdAt: Date;
}
/**
 * Version history options
 */
export interface VersionHistoryOptions {
    /** Content ID */
    contentId: string;
    /** Branch filter */
    branch?: string;
    /** Limit results */
    limit?: number;
    /** Include deleted */
    includeDeleted?: boolean;
    /** Sort order */
    sortOrder?: 'asc' | 'desc';
}
/**
 * Auto-versioning configuration
 */
export interface AutoVersioningConfig {
    /** Enable auto-versioning */
    enabled: boolean;
    /** Save interval in milliseconds */
    interval: number;
    /** Max versions to keep */
    maxVersions?: number;
    /** Include metadata */
    includeMetadata?: boolean;
    /** Callback on save */
    onSave?: (version: Version) => void;
    /** Callback on error */
    onError?: (error: Error) => void;
}
/**
 * Version restore options
 */
export interface RestoreOptions {
    /** Create new version or overwrite current */
    createNew?: boolean;
    /** Restore message */
    message?: string;
    /** Notify users */
    notify?: boolean;
    /** Callback on success */
    onSuccess?: (version: Version) => void;
    /** Callback on error */
    onError?: (error: Error) => void;
}
/**
 * Version lock info
 */
export interface VersionLock {
    /** Version ID */
    versionId: string;
    /** Locked by user ID */
    lockedBy: string;
    /** Locked by name */
    lockedByName: string;
    /** Lock acquired at */
    lockedAt: Date;
    /** Lock expires at */
    expiresAt: Date;
    /** Lock reason */
    reason?: string;
}
/**
 * Version permissions
 */
export interface VersionPermissions {
    /** User ID */
    userId: string;
    /** Version ID */
    versionId: string;
    /** Permission levels */
    permissions: VersionPermission[];
    /** Granted by */
    grantedBy: string;
    /** Granted at */
    grantedAt: Date;
    /** Expires at */
    expiresAt?: Date;
}
/**
 * Version export format
 */
export interface VersionExport {
    /** Version data */
    version: Version;
    /** Related versions */
    relatedVersions?: Version[];
    /** Comments */
    comments?: VersionComment[];
    /** Export format */
    format: 'json' | 'xml' | 'yaml' | 'markdown';
    /** Export timestamp */
    exportedAt: Date;
    /** Exported by */
    exportedBy: string;
}
/**
 * Generates a simple hash for content
 *
 * @param content - Content to hash
 * @returns Hash string
 *
 * @example
 * ```ts
 * const hash = generateContentHash({ title: 'Test' });
 * console.log(hash); // "a1b2c3d4..."
 * ```
 */
export declare function generateContentHash(content: any): string;
/**
 * Calculates content size in bytes
 *
 * @param content - Content to measure
 * @returns Size in bytes
 *
 * @example
 * ```ts
 * const size = calculateContentSize({ text: 'Hello' });
 * console.log(size); // 17
 * ```
 */
export declare function calculateContentSize(content: any): number;
/**
 * Generates a unique version ID
 *
 * @returns Version ID
 *
 * @example
 * ```ts
 * const id = generateVersionId();
 * console.log(id); // "v_1699123456789_a1b2c3"
 * ```
 */
export declare function generateVersionId(): string;
/**
 * Validates version structure
 *
 * @param version - Version to validate
 * @returns Validation result
 *
 * @example
 * ```ts
 * const isValid = validateVersion(version);
 * if (!isValid) throw new Error('Invalid version');
 * ```
 */
export declare function validateVersion(version: Partial<Version>): boolean;
/**
 * Creates a new version of content
 *
 * @param options - Version creation options
 * @returns Created version
 *
 * @example
 * ```ts
 * const version = await createVersion({
 *   contentId: 'doc-123',
 *   content: { title: 'New Title', body: '...' },
 *   message: 'Updated title',
 *   createdBy: 'user-456',
 *   createdByName: 'John Doe',
 *   branch: 'main',
 *   tags: ['draft']
 * });
 * ```
 */
export declare function createVersion<T = any>(options: {
    contentId: string;
    content: T;
    message: string;
    createdBy: string;
    createdByName: string;
    branch?: string;
    parentId?: string | null;
    tags?: string[];
    metadata?: Record<string, any>;
    status?: VersionStatus;
}): Promise<Version<T>>;
/**
 * Saves a version to storage
 *
 * @param version - Version to save
 * @returns Save confirmation
 *
 * @example
 * ```ts
 * await saveVersion(version);
 * console.log('Version saved successfully');
 * ```
 */
export declare function saveVersion(version: Version): Promise<{
    success: boolean;
    versionId: string;
}>;
/**
 * Loads a version from storage
 *
 * @param versionId - Version ID to load
 * @returns Loaded version
 *
 * @example
 * ```ts
 * const version = await loadVersion('v_123');
 * console.log(version.content);
 * ```
 */
export declare function loadVersion<T = any>(versionId: string): Promise<Version<T>>;
/**
 * Deletes a version
 *
 * @param versionId - Version ID to delete
 * @param hard - Permanently delete (default: soft delete)
 * @returns Deletion confirmation
 *
 * @example
 * ```ts
 * await deleteVersion('v_123', false); // Soft delete
 * await deleteVersion('v_456', true);  // Hard delete
 * ```
 */
export declare function deleteVersion(versionId: string, hard?: boolean): Promise<{
    success: boolean;
    deletedAt: Date;
}>;
/**
 * Gets version history for content
 *
 * @param options - History query options
 * @returns Array of versions
 *
 * @example
 * ```ts
 * const versions = await getVersionHistory({
 *   contentId: 'doc-123',
 *   branch: 'main',
 *   limit: 10,
 *   sortOrder: 'desc'
 * });
 * ```
 */
export declare function getVersionHistory(options: VersionHistoryOptions): Promise<Version[]>;
/**
 * Gets the latest version for content
 *
 * @param contentId - Content ID
 * @param branch - Branch name (default: 'main')
 * @returns Latest version
 *
 * @example
 * ```ts
 * const latest = await getLatestVersion('doc-123', 'main');
 * console.log(latest.versionNumber);
 * ```
 */
export declare function getLatestVersion<T = any>(contentId: string, branch?: string): Promise<Version<T>>;
/**
 * Gets a specific version by number
 *
 * @param contentId - Content ID
 * @param versionNumber - Version number
 * @param branch - Branch name
 * @returns Version
 *
 * @example
 * ```ts
 * const v5 = await getVersionByNumber('doc-123', 5, 'main');
 * ```
 */
export declare function getVersionByNumber<T = any>(contentId: string, versionNumber: number, branch?: string): Promise<Version<T>>;
/**
 * Compares two versions and generates a diff
 *
 * @param sourceVersion - Source version
 * @param targetVersion - Target version
 * @returns Version comparison result
 *
 * @example
 * ```ts
 * const comparison = await compareVersions(v1, v2);
 * console.log(`${comparison.diff.additions} additions, ${comparison.diff.deletions} deletions`);
 * ```
 */
export declare function compareVersions(sourceVersion: Version, targetVersion: Version): Promise<VersionComparison>;
/**
 * Generates a detailed diff between two content objects
 *
 * @param source - Source content
 * @param target - Target content
 * @returns Version diff
 *
 * @example
 * ```ts
 * const diff = generateDiff(
 *   { title: 'Old Title' },
 *   { title: 'New Title' }
 * );
 * console.log(diff.changes); // [{ type: 'modification', path: 'title', ... }]
 * ```
 */
export declare function generateDiff(source: any, target: any): VersionDiff;
/**
 * Applies a diff to content
 *
 * @param content - Original content
 * @param diff - Diff to apply
 * @returns Modified content
 *
 * @example
 * ```ts
 * const updated = applyDiff(originalContent, diff);
 * ```
 */
export declare function applyDiff<T = any>(content: T, diff: VersionDiff): T;
/**
 * Calculates detailed changes between versions
 *
 * @param oldVersion - Old version
 * @param newVersion - New version
 * @returns Array of changes
 *
 * @example
 * ```ts
 * const changes = calculateChanges(v1, v2);
 * changes.forEach(c => console.log(`${c.type}: ${c.path}`));
 * ```
 */
export declare function calculateChanges(oldVersion: Version, newVersion: Version): DiffChange[];
/**
 * Detects merge conflicts between versions
 *
 * @param baseVersion - Base version
 * @param targetVersion - Target version
 * @returns Array of conflicts
 *
 * @example
 * ```ts
 * const conflicts = detectConflicts(base, target);
 * if (conflicts.length > 0) {
 *   console.log('Merge conflicts detected!');
 * }
 * ```
 */
export declare function detectConflicts(baseVersion: Version, targetVersion: Version): MergeConflict[];
/**
 * Creates a new branch from a version
 *
 * @param options - Branch creation options
 * @returns Created branch
 *
 * @example
 * ```ts
 * const branch = await createBranch({
 *   name: 'feature/new-layout',
 *   description: 'Redesigned layout',
 *   baseVersionId: 'v_123',
 *   createdBy: 'user-456'
 * });
 * ```
 */
export declare function createBranch(options: {
    name: string;
    description: string;
    baseVersionId: string;
    createdBy: string;
}): Promise<VersionBranch>;
/**
 * Merges a branch into another branch
 *
 * @param options - Merge options
 * @returns Merge result with new version
 *
 * @example
 * ```ts
 * const result = await mergeBranch({
 *   sourceBranch: 'feature/new-layout',
 *   targetBranch: 'main',
 *   strategy: 'auto',
 *   message: 'Merge feature branch'
 * });
 * ```
 */
export declare function mergeBranch(options: {
    sourceBranch: string;
    targetBranch: string;
    strategy?: 'auto' | 'manual';
    message: string;
    createdBy: string;
    createdByName: string;
}): Promise<{
    success: boolean;
    version?: Version;
    conflicts?: MergeConflict[];
}>;
/**
 * Resolves merge conflicts
 *
 * @param conflicts - Array of conflicts to resolve
 * @param resolutions - Resolution strategies
 * @returns Resolved conflicts
 *
 * @example
 * ```ts
 * const resolved = resolveMergeConflicts(conflicts, {
 *   'conflict_0': { resolution: 'use-target' },
 *   'conflict_1': { resolution: 'merge', resolvedValue: mergedValue }
 * });
 * ```
 */
export declare function resolveMergeConflicts(conflicts: MergeConflict[], resolutions: Record<string, {
    resolution: 'use-source' | 'use-target' | 'merge' | 'manual';
    resolvedValue?: any;
}>): MergeConflict[];
/**
 * Gets all branches for content
 *
 * @param contentId - Content ID
 * @returns Array of branches
 *
 * @example
 * ```ts
 * const branches = await getBranches('doc-123');
 * branches.forEach(b => console.log(b.name));
 * ```
 */
export declare function getBranches(contentId: string): Promise<VersionBranch[]>;
/**
 * Switches to a different branch
 *
 * @param contentId - Content ID
 * @param branchName - Target branch name
 * @returns Latest version on the branch
 *
 * @example
 * ```ts
 * const version = await switchBranch('doc-123', 'feature/new-layout');
 * ```
 */
export declare function switchBranch(contentId: string, branchName: string): Promise<Version>;
/**
 * Restores content to a specific version
 *
 * @param versionId - Version ID to restore
 * @param options - Restore options
 * @returns New version created from restoration
 *
 * @example
 * ```ts
 * const restored = await restoreVersion('v_123', {
 *   createNew: true,
 *   message: 'Restored to working version',
 *   notify: true
 * });
 * ```
 */
export declare function restoreVersion(versionId: string, options?: RestoreOptions): Promise<Version>;
/**
 * Rolls back to a specific version (destructive)
 *
 * @param versionId - Version ID to rollback to
 * @param deleteSubsequent - Delete all versions after rollback point
 * @returns Rollback confirmation
 *
 * @example
 * ```ts
 * await rollbackToVersion('v_123', true);
 * console.log('Rolled back successfully');
 * ```
 */
export declare function rollbackToVersion(versionId: string, deleteSubsequent?: boolean): Promise<{
    success: boolean;
    rolledBackTo: Version;
}>;
/**
 * Reverts specific changes from a version
 *
 * @param versionId - Version with changes to revert
 * @param changePaths - Specific change paths to revert
 * @returns New version with reverted changes
 *
 * @example
 * ```ts
 * const reverted = await revertChanges('v_123', ['content.title', 'content.author']);
 * ```
 */
export declare function revertChanges(versionId: string, changePaths: string[]): Promise<Version>;
/**
 * Sets permissions for a version
 *
 * @param versionId - Version ID
 * @param userId - User ID
 * @param permissions - Permission levels to grant
 * @param grantedBy - User ID granting permissions
 * @returns Permission record
 *
 * @example
 * ```ts
 * await setVersionPermissions('v_123', 'user-456', ['view', 'edit'], 'admin-789');
 * ```
 */
export declare function setVersionPermissions(versionId: string, userId: string, permissions: VersionPermission[], grantedBy: string): Promise<VersionPermissions>;
/**
 * Checks if user has specific permission on version
 *
 * @param versionId - Version ID
 * @param userId - User ID
 * @param permission - Permission to check
 * @returns Has permission
 *
 * @example
 * ```ts
 * const canEdit = await checkVersionPermission('v_123', 'user-456', 'edit');
 * if (canEdit) {
 *   // Allow editing
 * }
 * ```
 */
export declare function checkVersionPermission(versionId: string, userId: string, permission: VersionPermission): Promise<boolean>;
/**
 * Locks a version for exclusive editing
 *
 * @param versionId - Version ID to lock
 * @param userId - User ID acquiring lock
 * @param userName - User name
 * @param duration - Lock duration in milliseconds
 * @param reason - Lock reason
 * @returns Lock info
 *
 * @example
 * ```ts
 * const lock = await lockVersion('v_123', 'user-456', 'John Doe', 3600000, 'Editing');
 * console.log(`Locked until ${lock.expiresAt}`);
 * ```
 */
export declare function lockVersion(versionId: string, userId: string, userName: string, duration?: number, // 1 hour default
reason?: string): Promise<VersionLock>;
/**
 * Unlocks a version
 *
 * @param versionId - Version ID to unlock
 * @param userId - User ID releasing lock (must be lock owner or admin)
 * @returns Unlock confirmation
 *
 * @example
 * ```ts
 * await unlockVersion('v_123', 'user-456');
 * console.log('Version unlocked');
 * ```
 */
export declare function unlockVersion(versionId: string, userId: string): Promise<{
    success: boolean;
    unlockedAt: Date;
}>;
/**
 * Checks if version is locked
 *
 * @param versionId - Version ID
 * @returns Lock status
 *
 * @example
 * ```ts
 * const lockInfo = await isVersionLocked('v_123');
 * if (lockInfo.locked) {
 *   console.log(`Locked by ${lockInfo.lock.lockedByName}`);
 * }
 * ```
 */
export declare function isVersionLocked(versionId: string): Promise<{
    locked: boolean;
    lock?: VersionLock;
}>;
/**
 * Exports a version to specified format
 *
 * @param versionId - Version ID to export
 * @param format - Export format
 * @param options - Export options
 * @returns Export data
 *
 * @example
 * ```ts
 * const exported = await exportVersion('v_123', 'json', {
 *   includeComments: true,
 *   includeHistory: true
 * });
 *
 * // Download as file
 * const blob = new Blob([JSON.stringify(exported)], { type: 'application/json' });
 * ```
 */
export declare function exportVersion(versionId: string, format: "json" | "xml" | "yaml" | "markdown" | undefined, options: {
    includeComments?: boolean;
    includeHistory?: boolean;
    exportedBy: string;
}): Promise<VersionExport>;
/**
 * Imports a version from export data
 *
 * @param exportData - Export data to import
 * @param options - Import options
 * @returns Imported version
 *
 * @example
 * ```ts
 * const imported = await importVersion(exportData, {
 *   createNew: true,
 *   preserveIds: false
 * });
 * ```
 */
export declare function importVersion(exportData: VersionExport, options: {
    createNew?: boolean;
    preserveIds?: boolean;
    importedBy: string;
}): Promise<Version>;
/**
 * Exports version history for content
 *
 * @param contentId - Content ID
 * @param format - Export format
 * @returns Exported history
 *
 * @example
 * ```ts
 * const history = await exportVersionHistory('doc-123', 'json');
 * // Save to file or send to user
 * ```
 */
export declare function exportVersionHistory(contentId: string, format?: 'json' | 'csv' | 'xml'): Promise<string>;
/**
 * Purges old versions based on retention policy
 *
 * @param contentId - Content ID
 * @param policy - Retention policy
 * @returns Purge result
 *
 * @example
 * ```ts
 * const result = await purgeOldVersions('doc-123', {
 *   keepLast: 10,
 *   olderThanDays: 90,
 *   keepTagged: true
 * });
 * console.log(`Purged ${result.purgedCount} versions`);
 * ```
 */
export declare function purgeOldVersions(contentId: string, policy: {
    keepLast?: number;
    olderThanDays?: number;
    keepTagged?: boolean;
    keepPublished?: boolean;
}): Promise<{
    purgedCount: number;
    purgedIds: string[];
}>;
/**
 * Cleans up orphaned versions
 *
 * @param contentId - Content ID
 * @returns Cleanup result
 *
 * @example
 * ```ts
 * const result = await cleanupOrphanedVersions('doc-123');
 * console.log(`Cleaned up ${result.cleanedCount} orphaned versions`);
 * ```
 */
export declare function cleanupOrphanedVersions(contentId: string): Promise<{
    cleanedCount: number;
    cleanedIds: string[];
}>;
/**
 * Optimizes version storage by deduplicating content
 *
 * @param contentId - Content ID
 * @returns Optimization result
 *
 * @example
 * ```ts
 * const result = await optimizeVersionStorage('doc-123');
 * console.log(`Saved ${result.spaceSaved} bytes`);
 * ```
 */
export declare function optimizeVersionStorage(contentId: string): Promise<{
    spaceSaved: number;
    optimizedCount: number;
}>;
/**
 * Adds a comment to a version
 *
 * @param versionId - Version ID
 * @param comment - Comment data
 * @returns Created comment
 *
 * @example
 * ```ts
 * const comment = await addVersionComment('v_123', {
 *   authorId: 'user-456',
 *   authorName: 'John Doe',
 *   text: 'Great work on this version!',
 *   parentId: null
 * });
 * ```
 */
export declare function addVersionComment(versionId: string, comment: {
    authorId: string;
    authorName: string;
    text: string;
    parentId?: string | null;
}): Promise<VersionComment>;
/**
 * Gets comments for a version
 *
 * @param versionId - Version ID
 * @returns Array of comments
 *
 * @example
 * ```ts
 * const comments = await getVersionComments('v_123');
 * comments.forEach(c => console.log(`${c.authorName}: ${c.text}`));
 * ```
 */
export declare function getVersionComments(versionId: string): Promise<VersionComment[]>;
/**
 * Adds or updates version metadata
 *
 * @param versionId - Version ID
 * @param metadata - Metadata to add/update
 * @returns Updated version
 *
 * @example
 * ```ts
 * await updateVersionMetadata('v_123', {
 *   editor: 'VSCode',
 *   wordCount: 1250,
 *   reviewStatus: 'pending'
 * });
 * ```
 */
export declare function updateVersionMetadata(versionId: string, metadata: Record<string, any>): Promise<Version>;
/**
 * Adds tags to a version
 *
 * @param versionId - Version ID
 * @param tags - Tags to add
 * @returns Updated version
 *
 * @example
 * ```ts
 * await addVersionTags('v_123', ['reviewed', 'approved', 'production']);
 * ```
 */
export declare function addVersionTags(versionId: string, tags: string[]): Promise<Version>;
/**
 * Removes tags from a version
 *
 * @param versionId - Version ID
 * @param tags - Tags to remove
 * @returns Updated version
 *
 * @example
 * ```ts
 * await removeVersionTags('v_123', ['draft', 'needs-review']);
 * ```
 */
export declare function removeVersionTags(versionId: string, tags: string[]): Promise<Version>;
/**
 * Searches versions by tags
 *
 * @param contentId - Content ID
 * @param tags - Tags to search for
 * @param matchAll - Match all tags (AND) or any tag (OR)
 * @returns Array of matching versions
 *
 * @example
 * ```ts
 * const versions = await searchVersionsByTags('doc-123', ['reviewed', 'approved'], true);
 * ```
 */
export declare function searchVersionsByTags(contentId: string, tags: string[], matchAll?: boolean): Promise<Version[]>;
/**
 * React hook for managing version history
 *
 * @param contentId - Content ID
 * @param options - Hook options
 * @returns Version history state and actions
 *
 * @example
 * ```tsx
 * function DocumentEditor({ contentId }) {
 *   const {
 *     versions,
 *     loading,
 *     createVersion,
 *     restoreVersion,
 *     deleteVersion
 *   } = useVersionHistory(contentId);
 *
 *   return (
 *     <div>
 *       <h3>Version History ({versions.length})</h3>
 *       {versions.map(v => (
 *         <div key={v.id}>
 *           <span>v{v.versionNumber}: {v.message}</span>
 *           <button onClick={() => restoreVersion(v.id)}>Restore</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useVersionHistory(contentId: string, options?: {
    branch?: string;
    limit?: number;
    autoRefresh?: boolean;
    refreshInterval?: number;
}): {
    versions: any;
    loading: any;
    error: any;
    refresh: any;
    createVersion: any;
    restoreVersion: any;
    deleteVersion: any;
};
/**
 * React hook for comparing versions
 *
 * @param sourceVersionId - Source version ID
 * @param targetVersionId - Target version ID
 * @returns Comparison state and data
 *
 * @example
 * ```tsx
 * function VersionCompare({ sourceId, targetId }) {
 *   const { comparison, diff, loading } = useVersionCompare(sourceId, targetId);
 *
 *   if (loading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <h3>Changes: {diff.changes.length}</h3>
 *       <p>Similarity: {diff.similarity}%</p>
 *       <ul>
 *         {diff.changes.map(change => (
 *           <li key={change.id}>
 *             {change.type}: {change.path}
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useVersionCompare(sourceVersionId: string | null, targetVersionId: string | null): {
    comparison: any;
    diff: any;
    hasConflicts: any;
    conflicts: any;
    loading: any;
    error: any;
};
/**
 * React hook for auto-versioning content
 *
 * @param config - Auto-versioning configuration
 * @returns Auto-save state and controls
 *
 * @example
 * ```tsx
 * function Editor({ contentId }) {
 *   const [content, setContent] = useState('');
 *   const { savePoint, autoSave, pause, resume } = useAutoVersioning({
 *     enabled: true,
 *     interval: 300000, // 5 minutes
 *     onSave: (version) => {
 *       toast.success(`Auto-saved v${version.versionNumber}`);
 *     }
 *   });
 *
 *   useEffect(() => {
 *     if (content) {
 *       savePoint(content);
 *     }
 *   }, [content, savePoint]);
 *
 *   return (
 *     <div>
 *       <textarea value={content} onChange={e => setContent(e.target.value)} />
 *       <button onClick={pause}>Pause Auto-save</button>
 *       <button onClick={resume}>Resume Auto-save</button>
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useAutoVersioning(config: AutoVersioningConfig): {
    savePoint: any;
    autoSave: any;
    pause: any;
    resume: any;
    isPaused: any;
    lastSaved: any;
};
/**
 * React hook for version restoration
 *
 * @returns Restore state and function
 *
 * @example
 * ```tsx
 * function RestoreButton({ versionId }) {
 *   const { restore, restoring, success, error } = useVersionRestore();
 *
 *   return (
 *     <button
 *       onClick={() => restore(versionId, {
 *         message: 'Restored working version',
 *         notify: true
 *       })}
 *       disabled={restoring}
 *     >
 *       {restoring ? 'Restoring...' : 'Restore Version'}
 *     </button>
 *   );
 * }
 * ```
 */
export declare function useVersionRestore(): {
    restore: any;
    restoring: any;
    success: any;
    error: any;
    restoredVersion: any;
};
/**
 * React hook for version locking
 *
 * @param versionId - Version ID to manage lock for
 * @returns Lock state and controls
 *
 * @example
 * ```tsx
 * function VersionEditor({ versionId, userId, userName }) {
 *   const { locked, lockInfo, acquireLock, releaseLock } = useVersionLock(versionId);
 *
 *   useEffect(() => {
 *     acquireLock(userId, userName, 3600000); // 1 hour
 *     return () => releaseLock(userId);
 *   }, []);
 *
 *   if (locked && lockInfo?.lockedBy !== userId) {
 *     return <div>Locked by {lockInfo.lockedByName}</div>;
 *   }
 *
 *   return <div>Edit mode</div>;
 * }
 * ```
 */
export declare function useVersionLock(versionId: string): {
    locked: any;
    lockInfo: any;
    loading: any;
    acquireLock: any;
    releaseLock: any;
    refresh: any;
};
/**
 * Version Timeline Component
 * Displays versions in a timeline format
 *
 * @example
 * ```tsx
 * <VersionTimeline
 *   versions={versions}
 *   onVersionClick={(version) => console.log(version)}
 *   onRestore={(versionId) => restoreVersion(versionId)}
 *   highlightCurrent={true}
 * />
 * ```
 */
export declare function VersionTimeline(props: {
    versions: Version[];
    currentVersionId?: string;
    onVersionClick?: (version: Version) => void;
    onRestore?: (versionId: string) => void;
    highlightCurrent?: boolean;
    className?: string;
}): any;
/**
 * Version List Component
 * Displays versions in a list format
 *
 * @example
 * ```tsx
 * <VersionList
 *   versions={versions}
 *   selectedVersionId={selectedId}
 *   onSelect={(version) => setSelectedId(version.id)}
 *   showActions={true}
 * />
 * ```
 */
export declare function VersionList(props: {
    versions: Version[];
    selectedVersionId?: string;
    onSelect?: (version: Version) => void;
    onDelete?: (versionId: string) => void;
    showActions?: boolean;
    className?: string;
}): any;
/**
 * Version Viewer Component
 * Displays version content and metadata
 *
 * @example
 * ```tsx
 * <VersionViewer
 *   version={selectedVersion}
 *   showMetadata={true}
 *   showComments={true}
 * />
 * ```
 */
export declare function VersionViewer(props: {
    version: Version | null;
    showMetadata?: boolean;
    showComments?: boolean;
    renderContent?: (content: any) => React.ReactNode;
    className?: string;
}): any;
/**
 * Diff Viewer Component
 * Displays differences between versions
 *
 * @example
 * ```tsx
 * <DiffViewer
 *   diff={diff}
 *   viewMode="split"
 *   highlightChanges={true}
 * />
 * ```
 */
export declare function DiffViewer(props: {
    diff: VersionDiff | null;
    viewMode?: 'unified' | 'split';
    highlightChanges?: boolean;
    className?: string;
}): any;
/**
 * Side-by-Side Compare Component
 * Displays two versions side by side
 *
 * @example
 * ```tsx
 * <SideBySideCompare
 *   leftVersion={v1}
 *   rightVersion={v2}
 *   highlightDifferences={true}
 * />
 * ```
 */
export declare function SideBySideCompare(props: {
    leftVersion: Version | null;
    rightVersion: Version | null;
    highlightDifferences?: boolean;
    renderContent?: (content: any) => React.ReactNode;
    className?: string;
}): any;
/**
 * Changes Highlighter Component
 * Highlights changes in content
 *
 * @example
 * ```tsx
 * <ChangesHighlighter
 *   content={content}
 *   changes={diff.changes}
 *   highlightColor="yellow"
 * />
 * ```
 */
export declare function ChangesHighlighter(props: {
    content: any;
    changes: DiffChange[];
    highlightColor?: string;
    className?: string;
}): any;
declare const _default: {
    generateContentHash: typeof generateContentHash;
    calculateContentSize: typeof calculateContentSize;
    generateVersionId: typeof generateVersionId;
    validateVersion: typeof validateVersion;
    createVersion: typeof createVersion;
    saveVersion: typeof saveVersion;
    loadVersion: typeof loadVersion;
    deleteVersion: typeof deleteVersion;
    getVersionHistory: typeof getVersionHistory;
    getLatestVersion: typeof getLatestVersion;
    getVersionByNumber: typeof getVersionByNumber;
    compareVersions: typeof compareVersions;
    generateDiff: typeof generateDiff;
    applyDiff: typeof applyDiff;
    calculateChanges: typeof calculateChanges;
    detectConflicts: typeof detectConflicts;
    createBranch: typeof createBranch;
    mergeBranch: typeof mergeBranch;
    resolveMergeConflicts: typeof resolveMergeConflicts;
    getBranches: typeof getBranches;
    switchBranch: typeof switchBranch;
    restoreVersion: typeof restoreVersion;
    rollbackToVersion: typeof rollbackToVersion;
    revertChanges: typeof revertChanges;
    setVersionPermissions: typeof setVersionPermissions;
    checkVersionPermission: typeof checkVersionPermission;
    lockVersion: typeof lockVersion;
    unlockVersion: typeof unlockVersion;
    isVersionLocked: typeof isVersionLocked;
    exportVersion: typeof exportVersion;
    importVersion: typeof importVersion;
    exportVersionHistory: typeof exportVersionHistory;
    purgeOldVersions: typeof purgeOldVersions;
    cleanupOrphanedVersions: typeof cleanupOrphanedVersions;
    optimizeVersionStorage: typeof optimizeVersionStorage;
    addVersionComment: typeof addVersionComment;
    getVersionComments: typeof getVersionComments;
    updateVersionMetadata: typeof updateVersionMetadata;
    addVersionTags: typeof addVersionTags;
    removeVersionTags: typeof removeVersionTags;
    searchVersionsByTags: typeof searchVersionsByTags;
    useVersionHistory: typeof useVersionHistory;
    useVersionCompare: typeof useVersionCompare;
    useAutoVersioning: typeof useAutoVersioning;
    useVersionRestore: typeof useVersionRestore;
    useVersionLock: typeof useVersionLock;
    VersionTimeline: typeof VersionTimeline;
    VersionList: typeof VersionList;
    VersionViewer: typeof VersionViewer;
    DiffViewer: typeof DiffViewer;
    SideBySideCompare: typeof SideBySideCompare;
    ChangesHighlighter: typeof ChangesHighlighter;
};
export default _default;
//# sourceMappingURL=version-control-kit.d.ts.map