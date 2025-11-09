/**
 * LOC: M1F2O3L4D5
 * File: /reuse/server/mail/mail-folder-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail folder controllers
 *   - Mail folder services
 *   - Folder hierarchy managers
 *   - Mail synchronization services
 */
/**
 * File: /reuse/server/mail/mail-folder-management-kit.ts
 * Locator: WC-MAIL-FLD-KIT-001
 * Purpose: Mail Folder Management Kit - Exchange Server-style folder management with hierarchical structures
 *
 * Upstream: sequelize v6.x, Node 18+
 * Downstream: ../backend/mail/*, folder controllers, mail services, folder synchronization
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 mail folder utilities for folder CRUD, hierarchy, permissions, system folders, and Exchange Server features
 *
 * LLM Context: Enterprise-grade mail folder management kit for White Cross healthcare platform.
 * Provides comprehensive Exchange Server-style folder management including hierarchical folder structures,
 * system folders (Inbox, Sent, Drafts, Trash, Spam), custom folder creation, folder permissions and sharing,
 * folder subscriptions, favorites, move/copy operations, and Swagger documentation. HIPAA-compliant with
 * audit trails and secure folder access controls for healthcare communications.
 */
import { Sequelize, ModelAttributes, ModelOptions, Transaction } from 'sequelize';
/**
 * Mail folder types following Exchange Server conventions
 */
export declare enum FolderType {
    INBOX = "inbox",
    SENT = "sent",
    DRAFTS = "drafts",
    TRASH = "trash",
    SPAM = "spam",
    ARCHIVE = "archive",
    OUTBOX = "outbox",
    JUNK = "junk",
    CUSTOM = "custom",
    SEARCH = "search",
    CONVERSATION_HISTORY = "conversation_history",
    CALENDAR = "calendar",
    CONTACTS = "contacts",
    NOTES = "notes",
    TASKS = "tasks",
    JOURNAL = "journal"
}
/**
 * Folder permission levels
 */
export declare enum FolderPermission {
    OWNER = "owner",
    EDITOR = "editor",
    AUTHOR = "author",
    CONTRIBUTOR = "contributor",
    REVIEWER = "reviewer",
    NONE = "none"
}
/**
 * Folder sharing scope
 */
export declare enum FolderSharingScope {
    PRIVATE = "private",
    ORGANIZATION = "organization",
    PUBLIC = "public",
    SPECIFIC_USERS = "specific_users",
    DOMAIN = "domain"
}
/**
 * Folder synchronization status
 */
export declare enum FolderSyncStatus {
    SYNCED = "synced",
    SYNCING = "syncing",
    ERROR = "error",
    OFFLINE = "offline",
    PENDING = "pending"
}
/**
 * Mail folder interface
 */
export interface MailFolder {
    id: string;
    userId: string;
    parentId: string | null;
    name: string;
    displayName: string;
    folderType: FolderType;
    isSystemFolder: boolean;
    isShared: boolean;
    sharingScope: FolderSharingScope;
    path: string;
    depth: number;
    messageCount: number;
    unreadCount: number;
    sizeBytes: number;
    order: number;
    color: string | null;
    icon: string | null;
    isFavorite: boolean;
    isSubscribed: boolean;
    isHidden: boolean;
    isArchived: boolean;
    syncStatus: FolderSyncStatus;
    lastSyncAt: Date | null;
    metadata: Record<string, any>;
    permissions: FolderPermissionEntry[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Folder permission entry
 */
export interface FolderPermissionEntry {
    userId: string;
    userEmail: string;
    permission: FolderPermission;
    grantedAt: Date;
    grantedBy: string;
    expiresAt: Date | null;
}
/**
 * Folder hierarchy node
 */
export interface FolderHierarchyNode extends MailFolder {
    children: FolderHierarchyNode[];
    parent: FolderHierarchyNode | null;
    level: number;
    hasChildren: boolean;
}
/**
 * Folder creation options
 */
export interface FolderCreationOptions {
    userId: string;
    name: string;
    displayName?: string;
    parentId?: string | null;
    folderType?: FolderType;
    color?: string;
    icon?: string;
    order?: number;
    isShared?: boolean;
    sharingScope?: FolderSharingScope;
    metadata?: Record<string, any>;
}
/**
 * Folder update options
 */
export interface FolderUpdateOptions {
    name?: string;
    displayName?: string;
    parentId?: string | null;
    color?: string;
    icon?: string;
    order?: number;
    isFavorite?: boolean;
    isSubscribed?: boolean;
    isHidden?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Folder move options
 */
export interface FolderMoveOptions {
    folderId: string;
    targetParentId: string | null;
    preserveHierarchy?: boolean;
    updatePaths?: boolean;
    transaction?: Transaction;
}
/**
 * Folder copy options
 */
export interface FolderCopyOptions {
    folderId: string;
    targetParentId: string | null;
    newName?: string;
    copyMessages?: boolean;
    copyPermissions?: boolean;
    copyMetadata?: boolean;
    transaction?: Transaction;
}
/**
 * Folder sharing options
 */
export interface FolderSharingOptions {
    folderId: string;
    targetUserIds: string[];
    permission: FolderPermission;
    expiresAt?: Date;
    notifyUsers?: boolean;
    message?: string;
}
/**
 * Folder search options
 */
export interface FolderSearchOptions {
    userId: string;
    query?: string;
    folderType?: FolderType;
    isShared?: boolean;
    isFavorite?: boolean;
    parentId?: string;
    includeHidden?: boolean;
    limit?: number;
    offset?: number;
}
/**
 * Folder statistics
 */
export interface FolderStatistics {
    folderId: string;
    totalMessages: number;
    unreadMessages: number;
    totalSizeBytes: number;
    lastMessageAt: Date | null;
    oldestMessageAt: Date | null;
    averageMessageSize: number;
    messagesByDay: Record<string, number>;
}
/**
 * Generates Sequelize model attributes for mail folders table.
 * Includes hierarchical structure with parent-child relationships.
 *
 * @returns {ModelAttributes} Sequelize model attributes for folders
 *
 * @example
 * ```typescript
 * const MailFolder = sequelize.define('MailFolder', getMailFolderAttributes(), {
 *   tableName: 'mail_folders',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
export declare function getMailFolderAttributes(): ModelAttributes;
/**
 * Generates Sequelize model options for mail folders.
 * Includes indexes, scopes, and hooks for hierarchy management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelOptions} Sequelize model options
 *
 * @example
 * ```typescript
 * const MailFolder = sequelize.define(
 *   'MailFolder',
 *   getMailFolderAttributes(),
 *   getMailFolderModelOptions(sequelize)
 * );
 * ```
 */
export declare function getMailFolderModelOptions(sequelize: Sequelize): Partial<ModelOptions>;
/**
 * Gets system folder definitions following Exchange Server conventions.
 * Returns standard folder configurations for initialization.
 *
 * @param {string} userId - User ID for folder ownership
 * @returns {FolderCreationOptions[]} System folder definitions
 *
 * @example
 * ```typescript
 * const systemFolders = getSystemFolderDefinitions(userId);
 * await Promise.all(systemFolders.map(folder => createMailFolder(folder)));
 * ```
 */
export declare function getSystemFolderDefinitions(userId: string): FolderCreationOptions[];
/**
 * Initializes system folders for a new user.
 * Creates all standard Exchange Server-style folders.
 *
 * @param {string} userId - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailFolder[]>} Created system folders
 *
 * @example
 * ```typescript
 * const folders = await initializeSystemFolders(userId);
 * console.log(`Created ${folders.length} system folders`);
 * ```
 */
export declare function initializeSystemFolders(userId: string, transaction?: Transaction): Promise<MailFolder[]>;
/**
 * Gets a system folder by type for a specific user.
 * Returns the standard folder (e.g., Inbox, Sent, etc.).
 *
 * @param {string} userId - User ID
 * @param {FolderType} folderType - Type of system folder
 * @returns {Promise<MailFolder | null>} System folder or null
 *
 * @example
 * ```typescript
 * const inbox = await getSystemFolder(userId, FolderType.INBOX);
 * if (inbox) {
 *   console.log(`Inbox has ${inbox.unreadCount} unread messages`);
 * }
 * ```
 */
export declare function getSystemFolder(userId: string, folderType: FolderType): Promise<MailFolder | null>;
/**
 * Validates that all required system folders exist for a user.
 * Returns missing folder types that need to be created.
 *
 * @param {string} userId - User ID
 * @returns {Promise<FolderType[]>} Array of missing system folder types
 *
 * @example
 * ```typescript
 * const missing = await validateSystemFolders(userId);
 * if (missing.length > 0) {
 *   console.log(`Missing folders: ${missing.join(', ')}`);
 *   await createMissingSystemFolders(userId, missing);
 * }
 * ```
 */
export declare function validateSystemFolders(userId: string): Promise<FolderType[]>;
/**
 * Prevents modification or deletion of system folders.
 * Throws error if attempting to modify protected folders.
 *
 * @param {string} folderId - Folder ID to check
 * @returns {Promise<void>}
 * @throws {Error} If folder is a system folder
 *
 * @example
 * ```typescript
 * try {
 *   await ensureNotSystemFolder(folderId);
 *   await deleteFolder(folderId);
 * } catch (error) {
 *   console.error('Cannot delete system folder');
 * }
 * ```
 */
export declare function ensureNotSystemFolder(folderId: string): Promise<void>;
/**
 * Creates a new mail folder with hierarchical path calculation.
 * Automatically computes depth and path based on parent.
 *
 * @param {FolderCreationOptions} options - Folder creation options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailFolder>} Created folder
 *
 * @example
 * ```typescript
 * const folder = await createMailFolder({
 *   userId: 'user-123',
 *   name: 'work',
 *   displayName: 'Work',
 *   parentId: inboxId,
 *   color: '#FF5722'
 * });
 * ```
 */
export declare function createMailFolder(options: FolderCreationOptions, transaction?: Transaction): Promise<MailFolder>;
/**
 * Gets a mail folder by ID with optional permission check.
 * Returns folder if user has access.
 *
 * @param {string} folderId - Folder ID
 * @param {string} [userId] - Optional user ID for permission check
 * @returns {Promise<MailFolder | null>} Folder or null
 *
 * @example
 * ```typescript
 * const folder = await getMailFolderById(folderId, userId);
 * if (!folder) {
 *   throw new Error('Folder not found or access denied');
 * }
 * ```
 */
export declare function getMailFolderById(folderId: string, userId?: string): Promise<MailFolder | null>;
/**
 * Updates a mail folder with validation.
 * Recalculates paths if parent changes.
 *
 * @param {string} folderId - Folder ID to update
 * @param {FolderUpdateOptions} updates - Update options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailFolder>} Updated folder
 *
 * @example
 * ```typescript
 * const updated = await updateMailFolder(folderId, {
 *   displayName: 'Important Work',
 *   color: '#4CAF50',
 *   isFavorite: true
 * });
 * ```
 */
export declare function updateMailFolder(folderId: string, updates: FolderUpdateOptions, transaction?: Transaction): Promise<MailFolder>;
/**
 * Deletes a mail folder (soft delete).
 * Optionally moves messages to trash or another folder.
 *
 * @param {string} folderId - Folder ID to delete
 * @param {object} options - Delete options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteMailFolder(folderId, {
 *   moveMessagesTo: trashFolderId,
 *   recursive: true
 * });
 * ```
 */
export declare function deleteMailFolder(folderId: string, options?: {
    moveMessagesTo?: string;
    recursive?: boolean;
}, transaction?: Transaction): Promise<void>;
/**
 * Restores a soft-deleted mail folder.
 * Validates parent still exists and restores hierarchy.
 *
 * @param {string} folderId - Folder ID to restore
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailFolder>} Restored folder
 *
 * @example
 * ```typescript
 * const restored = await restoreMailFolder(folderId);
 * console.log(`Restored folder: ${restored.displayName}`);
 * ```
 */
export declare function restoreMailFolder(folderId: string, transaction?: Transaction): Promise<MailFolder>;
/**
 * Gets all folders for a user with optional filtering.
 * Returns folders matching criteria.
 *
 * @param {FolderSearchOptions} options - Search options
 * @returns {Promise<MailFolder[]>} Matching folders
 *
 * @example
 * ```typescript
 * const folders = await getUserFolders({
 *   userId: 'user-123',
 *   isFavorite: true,
 *   includeHidden: false
 * });
 * ```
 */
export declare function getUserFolders(options: FolderSearchOptions): Promise<MailFolder[]>;
/**
 * Builds a hierarchical tree structure from flat folder list.
 * Returns folders organized in parent-child relationships.
 *
 * @param {MailFolder[]} folders - Flat list of folders
 * @param {string | null} [rootParentId] - Root parent ID (null for top-level)
 * @returns {FolderHierarchyNode[]} Hierarchical folder tree
 *
 * @example
 * ```typescript
 * const folders = await getUserFolders({ userId });
 * const tree = buildFolderHierarchy(folders);
 * console.log(`Root folders: ${tree.length}`);
 * ```
 */
export declare function buildFolderHierarchy(folders: MailFolder[], rootParentId?: string | null): FolderHierarchyNode[];
/**
 * Gets all child folders (direct children only).
 * Returns immediate descendants of specified folder.
 *
 * @param {string} parentId - Parent folder ID
 * @param {boolean} [includeDeleted] - Include soft-deleted folders
 * @returns {Promise<MailFolder[]>} Child folders
 *
 * @example
 * ```typescript
 * const children = await getChildFolders(inboxId);
 * console.log(`Inbox has ${children.length} subfolders`);
 * ```
 */
export declare function getChildFolders(parentId: string, includeDeleted?: boolean): Promise<MailFolder[]>;
/**
 * Gets all descendant folders recursively.
 * Returns entire subtree of folders.
 *
 * @param {string} parentId - Parent folder ID
 * @param {boolean} [includeDeleted] - Include soft-deleted folders
 * @returns {Promise<MailFolder[]>} All descendant folders
 *
 * @example
 * ```typescript
 * const descendants = await getDescendantFolders(workFolderId);
 * console.log(`Total subfolders: ${descendants.length}`);
 * ```
 */
export declare function getDescendantFolders(parentId: string, includeDeleted?: boolean): Promise<MailFolder[]>;
/**
 * Gets the full path of ancestor folders.
 * Returns array from root to current folder.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<MailFolder[]>} Ancestor folders from root to folder
 *
 * @example
 * ```typescript
 * const path = await getAncestorPath(projectFolderId);
 * const pathString = path.map(f => f.displayName).join(' > ');
 * // Output: "Inbox > Work > Projects"
 * ```
 */
export declare function getAncestorPath(folderId: string): Promise<MailFolder[]>;
/**
 * Calculates the depth of a folder in the hierarchy.
 * Returns number of levels from root.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<number>} Depth level (0 = root)
 *
 * @example
 * ```typescript
 * const depth = await calculateFolderDepth(folderId);
 * if (depth > 5) {
 *   console.warn('Folder hierarchy is very deep');
 * }
 * ```
 */
export declare function calculateFolderDepth(folderId: string): Promise<number>;
/**
 * Recalculates paths for folder and all descendants.
 * Updates path strings after hierarchy changes.
 *
 * @param {string} folderId - Folder ID to recalculate
 * @param {string | null} newParentId - New parent ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recalculateFolderPaths(folderId, newParentId);
 * ```
 */
export declare function recalculateFolderPaths(folderId: string, newParentId: string | null, transaction?: Transaction): Promise<void>;
/**
 * Validates that a folder move operation is valid.
 * Prevents circular references and validates constraints.
 *
 * @param {string} folderId - Folder to move
 * @param {string | null} targetParentId - Target parent folder ID
 * @returns {Promise<void>}
 * @throws {Error} If move is invalid
 *
 * @example
 * ```typescript
 * try {
 *   await validateFolderMove(folderId, targetParentId);
 *   await moveFolder({ folderId, targetParentId });
 * } catch (error) {
 *   console.error('Invalid move:', error.message);
 * }
 * ```
 */
export declare function validateFolderMove(folderId: string, targetParentId: string | null): Promise<void>;
/**
 * Grants permission to access a folder.
 * Adds user to folder's permission list.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID to grant access
 * @param {FolderPermission} permission - Permission level
 * @param {object} [options] - Grant options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await grantFolderPermission(folderId, userId, FolderPermission.REVIEWER, {
 *   grantedBy: currentUserId,
 *   expiresAt: new Date('2024-12-31')
 * });
 * ```
 */
export declare function grantFolderPermission(folderId: string, userId: string, permission: FolderPermission, options?: {
    grantedBy?: string;
    expiresAt?: Date | null;
}): Promise<void>;
/**
 * Revokes permission to access a folder.
 * Removes user from folder's permission list.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID to revoke access
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeFolderPermission(folderId, userId);
 * ```
 */
export declare function revokeFolderPermission(folderId: string, userId: string): Promise<void>;
/**
 * Checks if user has specific permission for a folder.
 * Returns true if user has required permission level or higher.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID to check
 * @param {FolderPermission} requiredPermission - Required permission level
 * @returns {Promise<boolean>} Whether user has permission
 *
 * @example
 * ```typescript
 * const canEdit = await checkFolderPermission(
 *   folderId,
 *   userId,
 *   FolderPermission.EDITOR
 * );
 * if (!canEdit) {
 *   throw new Error('Insufficient permissions');
 * }
 * ```
 */
export declare function checkFolderPermission(folderId: string, userId: string, requiredPermission: FolderPermission): Promise<boolean>;
/**
 * Shares a folder with multiple users.
 * Grants permissions and optionally sends notifications.
 *
 * @param {FolderSharingOptions} options - Sharing options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await shareFolder({
 *   folderId,
 *   targetUserIds: ['user1', 'user2'],
 *   permission: FolderPermission.REVIEWER,
 *   notifyUsers: true,
 *   message: 'Shared project folder with you'
 * });
 * ```
 */
export declare function shareFolder(options: FolderSharingOptions): Promise<void>;
/**
 * Unshares a folder (removes all shared permissions).
 * Reverts folder to private.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unshareFolder(folderId);
 * ```
 */
export declare function unshareFolder(folderId: string): Promise<void>;
/**
 * Gets all users who have access to a folder.
 * Returns list of users with their permission levels.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<FolderPermissionEntry[]>} User permissions
 *
 * @example
 * ```typescript
 * const users = await getFolderSharedUsers(folderId);
 * users.forEach(user => {
 *   console.log(`${user.userEmail}: ${user.permission}`);
 * });
 * ```
 */
export declare function getFolderSharedUsers(folderId: string): Promise<FolderPermissionEntry[]>;
/**
 * Moves a folder to a new parent.
 * Updates hierarchy and recalculates paths.
 *
 * @param {FolderMoveOptions} options - Move options
 * @returns {Promise<MailFolder>} Moved folder
 *
 * @example
 * ```typescript
 * const moved = await moveFolder({
 *   folderId,
 *   targetParentId: workFolderId,
 *   preserveHierarchy: true,
 *   updatePaths: true
 * });
 * ```
 */
export declare function moveFolder(options: FolderMoveOptions): Promise<MailFolder>;
/**
 * Copies a folder to a new parent.
 * Creates duplicate with optional message and metadata copying.
 *
 * @param {FolderCopyOptions} options - Copy options
 * @returns {Promise<MailFolder>} Copied folder
 *
 * @example
 * ```typescript
 * const copy = await copyFolder({
 *   folderId,
 *   targetParentId: archiveFolderId,
 *   newName: 'project-backup',
 *   copyMessages: true,
 *   copyPermissions: false
 * });
 * ```
 */
export declare function copyFolder(options: FolderCopyOptions): Promise<MailFolder>;
/**
 * Merges two folders.
 * Moves all messages from source to target and deletes source.
 *
 * @param {string} sourceFolderId - Source folder ID
 * @param {string} targetFolderId - Target folder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailFolder>} Target folder with merged content
 *
 * @example
 * ```typescript
 * const merged = await mergeFolders(oldProjectId, newProjectId);
 * console.log(`Merged ${merged.messageCount} messages`);
 * ```
 */
export declare function mergeFolders(sourceFolderId: string, targetFolderId: string, transaction?: Transaction): Promise<MailFolder>;
/**
 * Subscribes user to a folder.
 * Enables folder synchronization and notifications.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await subscribeToFolder(sharedFolderId, userId);
 * ```
 */
export declare function subscribeToFolder(folderId: string, userId: string): Promise<void>;
/**
 * Unsubscribes user from a folder.
 * Disables folder synchronization and notifications.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unsubscribeFromFolder(folderId, userId);
 * ```
 */
export declare function unsubscribeFromFolder(folderId: string, userId: string): Promise<void>;
/**
 * Adds a folder to user's favorites.
 * Marks folder for quick access.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addFolderToFavorites(folderId, userId);
 * ```
 */
export declare function addFolderToFavorites(folderId: string, userId: string): Promise<void>;
/**
 * Removes a folder from user's favorites.
 * Unmarks folder from quick access.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeFolderFromFavorites(folderId, userId);
 * ```
 */
export declare function removeFolderFromFavorites(folderId: string, userId: string): Promise<void>;
/**
 * Gets all favorite folders for a user.
 * Returns folders marked as favorites.
 *
 * @param {string} userId - User ID
 * @returns {Promise<MailFolder[]>} Favorite folders
 *
 * @example
 * ```typescript
 * const favorites = await getFavoriteFolders(userId);
 * console.log(`User has ${favorites.length} favorite folders`);
 * ```
 */
export declare function getFavoriteFolders(userId: string): Promise<MailFolder[]>;
/**
 * Gets all subscribed folders for a user.
 * Returns folders user is actively syncing.
 *
 * @param {string} userId - User ID
 * @returns {Promise<MailFolder[]>} Subscribed folders
 *
 * @example
 * ```typescript
 * const subscribed = await getSubscribedFolders(userId);
 * await syncFolders(subscribed);
 * ```
 */
export declare function getSubscribedFolders(userId: string): Promise<MailFolder[]>;
/**
 * Gets comprehensive statistics for a folder.
 * Returns message counts, sizes, and time-based metrics.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<FolderStatistics>} Folder statistics
 *
 * @example
 * ```typescript
 * const stats = await getFolderStatistics(folderId);
 * console.log(`Total: ${stats.totalMessages}, Unread: ${stats.unreadMessages}`);
 * console.log(`Average size: ${stats.averageMessageSize} bytes`);
 * ```
 */
export declare function getFolderStatistics(folderId: string): Promise<FolderStatistics>;
/**
 * Updates folder message counts.
 * Recalculates total and unread message counts.
 *
 * @param {string} folderId - Folder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateFolderCounts(folderId);
 * ```
 */
export declare function updateFolderCounts(folderId: string, transaction?: Transaction): Promise<void>;
/**
 * Increments folder message count.
 * Optimized for adding messages without full recount.
 *
 * @param {string} folderId - Folder ID
 * @param {number} [increment] - Amount to increment (default: 1)
 * @param {boolean} [isUnread] - Whether message is unread
 * @param {number} [sizeBytes] - Message size in bytes
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await incrementFolderCount(folderId, 1, true, 1024);
 * ```
 */
export declare function incrementFolderCount(folderId: string, increment?: number, isUnread?: boolean, sizeBytes?: number): Promise<void>;
/**
 * Decrements folder message count.
 * Optimized for removing messages without full recount.
 *
 * @param {string} folderId - Folder ID
 * @param {number} [decrement] - Amount to decrement (default: 1)
 * @param {boolean} [isUnread] - Whether message was unread
 * @param {number} [sizeBytes] - Message size in bytes
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await decrementFolderCount(folderId, 1, false, 1024);
 * ```
 */
export declare function decrementFolderCount(folderId: string, decrement?: number, isUnread?: boolean, sizeBytes?: number): Promise<void>;
/**
 * Generates Swagger ApiProperty configuration for folder ID.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class FolderDto {
 *   @ApiProperty(getFolderIdProperty())
 *   id: string;
 * }
 * ```
 */
export declare function getFolderIdProperty(): object;
/**
 * Generates Swagger ApiProperty configuration for folder name.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class FolderDto {
 *   @ApiProperty(getFolderNameProperty())
 *   name: string;
 * }
 * ```
 */
export declare function getFolderNameProperty(): object;
/**
 * Generates Swagger ApiProperty configuration for folder display name.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class FolderDto {
 *   @ApiProperty(getFolderDisplayNameProperty())
 *   displayName: string;
 * }
 * ```
 */
export declare function getFolderDisplayNameProperty(): object;
/**
 * Generates Swagger ApiProperty configuration for folder type.
 *
 * @returns {object} ApiProperty configuration
 *
 * @example
 * ```typescript
 * class FolderDto {
 *   @ApiProperty(getFolderTypeProperty())
 *   folderType: FolderType;
 * }
 * ```
 */
export declare function getFolderTypeProperty(): object;
/**
 * Generates Swagger ApiResponse for folder list endpoint.
 *
 * @returns {object} ApiResponse configuration
 *
 * @example
 * ```typescript
 * @ApiResponse(getFolderListResponse())
 * async getFolders() {
 *   return await this.folderService.getUserFolders(userId);
 * }
 * ```
 */
export declare function getFolderListResponse(): object;
/**
 * Generates Swagger ApiResponse for folder hierarchy endpoint.
 *
 * @returns {object} ApiResponse configuration
 *
 * @example
 * ```typescript
 * @ApiResponse(getFolderHierarchyResponse())
 * async getFolderTree() {
 *   return await this.folderService.getFolderHierarchy(userId);
 * }
 * ```
 */
export declare function getFolderHierarchyResponse(): object;
/**
 * Generates Swagger ApiOperation documentation for create folder endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getCreateFolderOperation())
 * async createFolder(@Body() dto: CreateFolderDto) {
 *   return await this.folderService.createFolder(dto);
 * }
 * ```
 */
export declare function getCreateFolderOperation(): object;
/**
 * Generates Swagger ApiOperation documentation for move folder endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getMoveFolderOperation())
 * async moveFolder(@Body() dto: MoveFolderDto) {
 *   return await this.folderService.moveFolder(dto);
 * }
 * ```
 */
export declare function getMoveFolderOperation(): object;
/**
 * Generates Swagger ApiOperation documentation for share folder endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getShareFolderOperation())
 * async shareFolder(@Body() dto: ShareFolderDto) {
 *   return await this.folderService.shareFolder(dto);
 * }
 * ```
 */
export declare function getShareFolderOperation(): object;
/**
 * Generates a UUID v4.
 * Utility for creating unique folder identifiers.
 *
 * @returns {string} UUID v4
 *
 * @example
 * ```typescript
 * const folderId = generateUUID();
 * ```
 */
export declare function generateUUID(): string;
/**
 * Gets user email by user ID.
 * Helper for permission entries.
 *
 * @param {string} userId - User ID
 * @returns {Promise<string>} User email
 *
 * @example
 * ```typescript
 * const email = await getUserEmail(userId);
 * ```
 */
export declare function getUserEmail(userId: string): Promise<string>;
/**
 * Sends folder sharing notifications to users.
 * Helper for notifying users of shared folder access.
 *
 * @param {string} folderId - Folder ID
 * @param {string[]} userIds - User IDs to notify
 * @param {string} [message] - Optional message
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendFolderShareNotifications(folderId, [userId1, userId2], 'Check out this folder');
 * ```
 */
export declare function sendFolderShareNotifications(folderId: string, userIds: string[], message?: string): Promise<void>;
/**
 * Moves all messages from one folder to another.
 * Helper for folder merge and delete operations.
 *
 * @param {string} sourceFolderId - Source folder ID
 * @param {string} targetFolderId - Target folder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await moveAllMessagesToFolder(oldFolderId, newFolderId);
 * ```
 */
export declare function moveAllMessagesToFolder(sourceFolderId: string, targetFolderId: string, transaction?: Transaction): Promise<void>;
/**
 * Copies all messages from one folder to another.
 * Helper for folder copy operations.
 *
 * @param {string} sourceFolderId - Source folder ID
 * @param {string} targetFolderId - Target folder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await copyAllMessagesToFolder(sourceFolderId, copyFolderId);
 * ```
 */
export declare function copyAllMessagesToFolder(sourceFolderId: string, targetFolderId: string, transaction?: Transaction): Promise<void>;
//# sourceMappingURL=mail-folder-management-kit.d.ts.map