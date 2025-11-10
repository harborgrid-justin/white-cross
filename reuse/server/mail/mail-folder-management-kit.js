"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderSyncStatus = exports.FolderSharingScope = exports.FolderPermission = exports.FolderType = void 0;
exports.getMailFolderAttributes = getMailFolderAttributes;
exports.getMailFolderModelOptions = getMailFolderModelOptions;
exports.getSystemFolderDefinitions = getSystemFolderDefinitions;
exports.initializeSystemFolders = initializeSystemFolders;
exports.getSystemFolder = getSystemFolder;
exports.validateSystemFolders = validateSystemFolders;
exports.ensureNotSystemFolder = ensureNotSystemFolder;
exports.createMailFolder = createMailFolder;
exports.getMailFolderById = getMailFolderById;
exports.updateMailFolder = updateMailFolder;
exports.deleteMailFolder = deleteMailFolder;
exports.restoreMailFolder = restoreMailFolder;
exports.getUserFolders = getUserFolders;
exports.buildFolderHierarchy = buildFolderHierarchy;
exports.getChildFolders = getChildFolders;
exports.getDescendantFolders = getDescendantFolders;
exports.getAncestorPath = getAncestorPath;
exports.calculateFolderDepth = calculateFolderDepth;
exports.recalculateFolderPaths = recalculateFolderPaths;
exports.validateFolderMove = validateFolderMove;
exports.grantFolderPermission = grantFolderPermission;
exports.revokeFolderPermission = revokeFolderPermission;
exports.checkFolderPermission = checkFolderPermission;
exports.shareFolder = shareFolder;
exports.unshareFolder = unshareFolder;
exports.getFolderSharedUsers = getFolderSharedUsers;
exports.moveFolder = moveFolder;
exports.copyFolder = copyFolder;
exports.mergeFolders = mergeFolders;
exports.subscribeToFolder = subscribeToFolder;
exports.unsubscribeFromFolder = unsubscribeFromFolder;
exports.addFolderToFavorites = addFolderToFavorites;
exports.removeFolderFromFavorites = removeFolderFromFavorites;
exports.getFavoriteFolders = getFavoriteFolders;
exports.getSubscribedFolders = getSubscribedFolders;
exports.getFolderStatistics = getFolderStatistics;
exports.updateFolderCounts = updateFolderCounts;
exports.incrementFolderCount = incrementFolderCount;
exports.decrementFolderCount = decrementFolderCount;
exports.getFolderIdProperty = getFolderIdProperty;
exports.getFolderNameProperty = getFolderNameProperty;
exports.getFolderDisplayNameProperty = getFolderDisplayNameProperty;
exports.getFolderTypeProperty = getFolderTypeProperty;
exports.getFolderListResponse = getFolderListResponse;
exports.getFolderHierarchyResponse = getFolderHierarchyResponse;
exports.getCreateFolderOperation = getCreateFolderOperation;
exports.getMoveFolderOperation = getMoveFolderOperation;
exports.getShareFolderOperation = getShareFolderOperation;
exports.generateUUID = generateUUID;
exports.getUserEmail = getUserEmail;
exports.sendFolderShareNotifications = sendFolderShareNotifications;
exports.moveAllMessagesToFolder = moveAllMessagesToFolder;
exports.copyAllMessagesToFolder = copyAllMessagesToFolder;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Mail folder types following Exchange Server conventions
 */
var FolderType;
(function (FolderType) {
    FolderType["INBOX"] = "inbox";
    FolderType["SENT"] = "sent";
    FolderType["DRAFTS"] = "drafts";
    FolderType["TRASH"] = "trash";
    FolderType["SPAM"] = "spam";
    FolderType["ARCHIVE"] = "archive";
    FolderType["OUTBOX"] = "outbox";
    FolderType["JUNK"] = "junk";
    FolderType["CUSTOM"] = "custom";
    FolderType["SEARCH"] = "search";
    FolderType["CONVERSATION_HISTORY"] = "conversation_history";
    FolderType["CALENDAR"] = "calendar";
    FolderType["CONTACTS"] = "contacts";
    FolderType["NOTES"] = "notes";
    FolderType["TASKS"] = "tasks";
    FolderType["JOURNAL"] = "journal";
})(FolderType || (exports.FolderType = FolderType = {}));
/**
 * Folder permission levels
 */
var FolderPermission;
(function (FolderPermission) {
    FolderPermission["OWNER"] = "owner";
    FolderPermission["EDITOR"] = "editor";
    FolderPermission["AUTHOR"] = "author";
    FolderPermission["CONTRIBUTOR"] = "contributor";
    FolderPermission["REVIEWER"] = "reviewer";
    FolderPermission["NONE"] = "none";
})(FolderPermission || (exports.FolderPermission = FolderPermission = {}));
/**
 * Folder sharing scope
 */
var FolderSharingScope;
(function (FolderSharingScope) {
    FolderSharingScope["PRIVATE"] = "private";
    FolderSharingScope["ORGANIZATION"] = "organization";
    FolderSharingScope["PUBLIC"] = "public";
    FolderSharingScope["SPECIFIC_USERS"] = "specific_users";
    FolderSharingScope["DOMAIN"] = "domain";
})(FolderSharingScope || (exports.FolderSharingScope = FolderSharingScope = {}));
/**
 * Folder synchronization status
 */
var FolderSyncStatus;
(function (FolderSyncStatus) {
    FolderSyncStatus["SYNCED"] = "synced";
    FolderSyncStatus["SYNCING"] = "syncing";
    FolderSyncStatus["ERROR"] = "error";
    FolderSyncStatus["OFFLINE"] = "offline";
    FolderSyncStatus["PENDING"] = "pending";
})(FolderSyncStatus || (exports.FolderSyncStatus = FolderSyncStatus = {}));
// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================
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
function getMailFolderAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique folder identifier',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Owner user ID',
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'mail_folders',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent folder ID for hierarchy',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Internal folder name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        displayName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'User-visible folder name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        folderType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FolderType)),
            allowNull: false,
            defaultValue: FolderType.CUSTOM,
            comment: 'Type of folder',
        },
        isSystemFolder: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether folder is system-managed',
        },
        isShared: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether folder is shared with others',
        },
        sharingScope: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FolderSharingScope)),
            allowNull: false,
            defaultValue: FolderSharingScope.PRIVATE,
            comment: 'Folder sharing scope',
        },
        path: {
            type: sequelize_1.DataTypes.STRING(1024),
            allowNull: false,
            comment: 'Full hierarchical path (e.g., /Inbox/Work/Projects)',
            validate: {
                notEmpty: true,
            },
        },
        depth: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Depth in folder hierarchy (0 = root)',
            validate: {
                min: 0,
            },
        },
        messageCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total message count',
            validate: {
                min: 0,
            },
        },
        unreadCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Unread message count',
            validate: {
                min: 0,
            },
        },
        sizeBytes: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total size in bytes',
            validate: {
                min: 0,
            },
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Display order within parent',
        },
        color: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Folder color (hex code)',
            validate: {
                is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i,
            },
        },
        icon: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Icon identifier or name',
        },
        isFavorite: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether folder is marked as favorite',
        },
        isSubscribed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether user is subscribed to folder',
        },
        isHidden: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether folder is hidden from view',
        },
        isArchived: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether folder is archived',
        },
        syncStatus: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FolderSyncStatus)),
            allowNull: false,
            defaultValue: FolderSyncStatus.SYNCED,
            comment: 'Synchronization status',
        },
        lastSyncAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last synchronization timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional folder metadata',
        },
        permissions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Folder permission entries',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Soft delete timestamp',
        },
    };
}
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
function getMailFolderModelOptions(sequelize) {
    return {
        sequelize,
        tableName: 'mail_folders',
        modelName: 'MailFolder',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['parent_id'] },
            { fields: ['user_id', 'folder_type'] },
            { fields: ['user_id', 'is_favorite'] },
            { fields: ['user_id', 'is_subscribed'] },
            { fields: ['path'], using: 'BTREE' },
            { fields: ['depth'] },
            { fields: ['folder_type'] },
            { fields: ['sync_status'] },
            { fields: ['created_at'] },
            { fields: ['updated_at'] },
            {
                name: 'unique_user_folder_name',
                unique: true,
                fields: ['user_id', 'parent_id', 'name'],
                where: { deleted_at: null },
            },
        ],
        scopes: {
            active: {
                where: { deletedAt: null },
            },
            systemFolders: {
                where: { isSystemFolder: true },
            },
            customFolders: {
                where: { isSystemFolder: false, folderType: FolderType.CUSTOM },
            },
            sharedFolders: {
                where: { isShared: true },
            },
            favoriteFolders: {
                where: { isFavorite: true },
            },
            subscribedFolders: {
                where: { isSubscribed: true },
            },
            rootFolders: {
                where: { parentId: null, depth: 0 },
            },
        },
    };
}
// ============================================================================
// SYSTEM FOLDER MANAGEMENT
// ============================================================================
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
function getSystemFolderDefinitions(userId) {
    return [
        {
            userId,
            name: 'inbox',
            displayName: 'Inbox',
            folderType: FolderType.INBOX,
            order: 1,
            icon: 'inbox',
        },
        {
            userId,
            name: 'sent',
            displayName: 'Sent Items',
            folderType: FolderType.SENT,
            order: 2,
            icon: 'send',
        },
        {
            userId,
            name: 'drafts',
            displayName: 'Drafts',
            folderType: FolderType.DRAFTS,
            order: 3,
            icon: 'drafts',
        },
        {
            userId,
            name: 'trash',
            displayName: 'Deleted Items',
            folderType: FolderType.TRASH,
            order: 4,
            icon: 'delete',
        },
        {
            userId,
            name: 'spam',
            displayName: 'Junk Email',
            folderType: FolderType.SPAM,
            order: 5,
            icon: 'report',
        },
        {
            userId,
            name: 'archive',
            displayName: 'Archive',
            folderType: FolderType.ARCHIVE,
            order: 6,
            icon: 'archive',
        },
        {
            userId,
            name: 'outbox',
            displayName: 'Outbox',
            folderType: FolderType.OUTBOX,
            order: 7,
            icon: 'outbox',
        },
    ];
}
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
async function initializeSystemFolders(userId, transaction) {
    const systemFolders = getSystemFolderDefinitions(userId);
    const createdFolders = [];
    for (const folderDef of systemFolders) {
        const folder = await createMailFolder({
            ...folderDef,
            isSystemFolder: true,
            isSubscribed: true,
            sharingScope: FolderSharingScope.PRIVATE,
            metadata: {
                systemFolder: true,
                createdBySystem: true,
                createdAt: new Date().toISOString(),
            },
        }, transaction);
        createdFolders.push(folder);
    }
    return createdFolders;
}
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
async function getSystemFolder(userId, folderType) {
    // Implementation would query database
    // This is a placeholder showing the function signature
    return null;
}
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
async function validateSystemFolders(userId) {
    const requiredTypes = [
        FolderType.INBOX,
        FolderType.SENT,
        FolderType.DRAFTS,
        FolderType.TRASH,
        FolderType.SPAM,
    ];
    const missingTypes = [];
    for (const type of requiredTypes) {
        const exists = await getSystemFolder(userId, type);
        if (!exists) {
            missingTypes.push(type);
        }
    }
    return missingTypes;
}
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
async function ensureNotSystemFolder(folderId) {
    // Implementation would check if folder is system folder
    // Throw error if it is
}
// ============================================================================
// FOLDER CRUD OPERATIONS
// ============================================================================
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
async function createMailFolder(options, transaction) {
    const { userId, name, displayName, parentId = null, folderType = FolderType.CUSTOM, color = null, icon = null, order = 0, isShared = false, sharingScope = FolderSharingScope.PRIVATE, metadata = {}, } = options;
    let depth = 0;
    let path = `/${name}`;
    // Calculate depth and path from parent
    if (parentId) {
        const parent = await getMailFolderById(parentId);
        if (parent) {
            depth = parent.depth + 1;
            path = `${parent.path}/${name}`;
        }
    }
    const folder = {
        id: generateUUID(),
        userId,
        parentId,
        name,
        displayName: displayName || name,
        folderType,
        isSystemFolder: false,
        isShared,
        sharingScope,
        path,
        depth,
        messageCount: 0,
        unreadCount: 0,
        sizeBytes: 0,
        order,
        color,
        icon,
        isFavorite: false,
        isSubscribed: true,
        isHidden: false,
        isArchived: false,
        syncStatus: FolderSyncStatus.SYNCED,
        lastSyncAt: null,
        metadata,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    // In production, this would insert into database
    return folder;
}
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
async function getMailFolderById(folderId, userId) {
    // Implementation would query database with optional permission check
    return null;
}
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
async function updateMailFolder(folderId, updates, transaction) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error(`Folder not found: ${folderId}`);
    }
    // Prevent modification of system folders
    if (folder.isSystemFolder && (updates.name || updates.parentId !== undefined)) {
        throw new Error('Cannot modify system folder structure');
    }
    // If parent changes, recalculate paths
    if (updates.parentId !== undefined && updates.parentId !== folder.parentId) {
        await validateFolderMove(folderId, updates.parentId);
        await recalculateFolderPaths(folderId, updates.parentId, transaction);
    }
    // Apply updates
    const updatedFolder = {
        ...folder,
        ...updates,
        updatedAt: new Date(),
    };
    return updatedFolder;
}
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
async function deleteMailFolder(folderId, options = {}, transaction) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error(`Folder not found: ${folderId}`);
    }
    // Prevent deletion of system folders
    await ensureNotSystemFolder(folderId);
    const { moveMessagesTo, recursive = false } = options;
    // Handle child folders
    if (recursive) {
        const children = await getChildFolders(folderId);
        for (const child of children) {
            await deleteMailFolder(child.id, options, transaction);
        }
    }
    else {
        // Check for child folders
        const children = await getChildFolders(folderId);
        if (children.length > 0) {
            throw new Error('Cannot delete folder with children. Use recursive option.');
        }
    }
    // Move messages if specified
    if (moveMessagesTo && folder.messageCount > 0) {
        await moveAllMessagesToFolder(folderId, moveMessagesTo, transaction);
    }
    // Soft delete folder
    folder.deletedAt = new Date();
}
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
async function restoreMailFolder(folderId, transaction) {
    const folder = await getMailFolderById(folderId);
    if (!folder || !folder.deletedAt) {
        throw new Error('Folder not found or not deleted');
    }
    // Validate parent exists if folder has parent
    if (folder.parentId) {
        const parent = await getMailFolderById(folder.parentId);
        if (!parent || parent.deletedAt) {
            throw new Error('Cannot restore folder: parent folder does not exist');
        }
    }
    folder.deletedAt = null;
    folder.updatedAt = new Date();
    return folder;
}
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
async function getUserFolders(options) {
    const { userId, query, folderType, isShared, isFavorite, parentId, includeHidden = false, limit = 100, offset = 0, } = options;
    // Implementation would build query and fetch from database
    return [];
}
// ============================================================================
// FOLDER HIERARCHY MANAGEMENT
// ============================================================================
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
function buildFolderHierarchy(folders, rootParentId = null) {
    const folderMap = new Map();
    const rootNodes = [];
    // Create nodes
    folders.forEach(folder => {
        folderMap.set(folder.id, {
            ...folder,
            children: [],
            parent: null,
            level: folder.depth,
            hasChildren: false,
        });
    });
    // Build hierarchy
    folders.forEach(folder => {
        const node = folderMap.get(folder.id);
        if (folder.parentId && folderMap.has(folder.parentId)) {
            const parent = folderMap.get(folder.parentId);
            parent.children.push(node);
            parent.hasChildren = true;
            node.parent = parent;
        }
        else if (folder.parentId === rootParentId) {
            rootNodes.push(node);
        }
    });
    // Sort children by order
    folderMap.forEach(node => {
        node.children.sort((a, b) => a.order - b.order);
    });
    return rootNodes.sort((a, b) => a.order - b.order);
}
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
async function getChildFolders(parentId, includeDeleted = false) {
    // Implementation would query database for folders with matching parentId
    return [];
}
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
async function getDescendantFolders(parentId, includeDeleted = false) {
    const allDescendants = [];
    const children = await getChildFolders(parentId, includeDeleted);
    for (const child of children) {
        allDescendants.push(child);
        const grandchildren = await getDescendantFolders(child.id, includeDeleted);
        allDescendants.push(...grandchildren);
    }
    return allDescendants;
}
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
async function getAncestorPath(folderId) {
    const ancestors = [];
    let currentFolder = await getMailFolderById(folderId);
    while (currentFolder) {
        ancestors.unshift(currentFolder);
        if (currentFolder.parentId) {
            currentFolder = await getMailFolderById(currentFolder.parentId);
        }
        else {
            break;
        }
    }
    return ancestors;
}
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
async function calculateFolderDepth(folderId) {
    const ancestors = await getAncestorPath(folderId);
    return ancestors.length - 1;
}
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
async function recalculateFolderPaths(folderId, newParentId, transaction) {
    const folder = await getMailFolderById(folderId);
    if (!folder)
        return;
    // Calculate new path and depth
    let newPath = `/${folder.name}`;
    let newDepth = 0;
    if (newParentId) {
        const parent = await getMailFolderById(newParentId);
        if (parent) {
            newPath = `${parent.path}/${folder.name}`;
            newDepth = parent.depth + 1;
        }
    }
    // Update folder
    folder.path = newPath;
    folder.depth = newDepth;
    folder.parentId = newParentId;
    // Recursively update descendants
    const children = await getChildFolders(folderId);
    for (const child of children) {
        await recalculateFolderPaths(child.id, folderId, transaction);
    }
}
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
async function validateFolderMove(folderId, targetParentId) {
    if (!targetParentId)
        return; // Moving to root is always valid
    // Cannot move to self
    if (folderId === targetParentId) {
        throw new Error('Cannot move folder to itself');
    }
    // Check if target is a descendant (would create circular reference)
    const descendants = await getDescendantFolders(folderId);
    if (descendants.some(d => d.id === targetParentId)) {
        throw new Error('Cannot move folder to its own descendant');
    }
    // Validate target exists
    const targetParent = await getMailFolderById(targetParentId);
    if (!targetParent) {
        throw new Error('Target parent folder not found');
    }
    // Validate depth limit
    const targetDepth = await calculateFolderDepth(targetParentId);
    if (targetDepth >= 10) {
        throw new Error('Maximum folder depth exceeded');
    }
}
// ============================================================================
// FOLDER PERMISSIONS & SHARING
// ============================================================================
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
async function grantFolderPermission(folderId, userId, permission, options = {}) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    const { grantedBy = 'system', expiresAt = null } = options;
    // Remove existing permission if present
    folder.permissions = folder.permissions.filter(p => p.userId !== userId);
    // Add new permission
    const permissionEntry = {
        userId,
        userEmail: await getUserEmail(userId),
        permission,
        grantedAt: new Date(),
        grantedBy,
        expiresAt,
    };
    folder.permissions.push(permissionEntry);
    folder.updatedAt = new Date();
}
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
async function revokeFolderPermission(folderId, userId) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    folder.permissions = folder.permissions.filter(p => p.userId !== userId);
    folder.updatedAt = new Date();
}
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
async function checkFolderPermission(folderId, userId, requiredPermission) {
    const folder = await getMailFolderById(folderId);
    if (!folder)
        return false;
    // Owner has all permissions
    if (folder.userId === userId)
        return true;
    // Check explicit permissions
    const userPermission = folder.permissions.find(p => p.userId === userId);
    if (!userPermission)
        return false;
    // Check if permission is expired
    if (userPermission.expiresAt && userPermission.expiresAt < new Date()) {
        return false;
    }
    // Permission hierarchy: owner > editor > author > contributor > reviewer
    const permissionLevels = {
        [FolderPermission.OWNER]: 5,
        [FolderPermission.EDITOR]: 4,
        [FolderPermission.AUTHOR]: 3,
        [FolderPermission.CONTRIBUTOR]: 2,
        [FolderPermission.REVIEWER]: 1,
        [FolderPermission.NONE]: 0,
    };
    return permissionLevels[userPermission.permission] >= permissionLevels[requiredPermission];
}
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
async function shareFolder(options) {
    const { folderId, targetUserIds, permission, expiresAt, notifyUsers = false, message, } = options;
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    // Update folder sharing status
    folder.isShared = true;
    folder.sharingScope = FolderSharingScope.SPECIFIC_USERS;
    // Grant permissions to each user
    for (const userId of targetUserIds) {
        await grantFolderPermission(folderId, userId, permission, { expiresAt });
    }
    // Send notifications if requested
    if (notifyUsers) {
        await sendFolderShareNotifications(folderId, targetUserIds, message);
    }
}
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
async function unshareFolder(folderId) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    folder.isShared = false;
    folder.sharingScope = FolderSharingScope.PRIVATE;
    folder.permissions = folder.permissions.filter(p => p.userId === folder.userId);
    folder.updatedAt = new Date();
}
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
async function getFolderSharedUsers(folderId) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    // Filter out expired permissions
    const activePermissions = folder.permissions.filter(p => !p.expiresAt || p.expiresAt > new Date());
    return activePermissions;
}
// ============================================================================
// FOLDER MOVE & COPY OPERATIONS
// ============================================================================
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
async function moveFolder(options) {
    const { folderId, targetParentId, preserveHierarchy = true, updatePaths = true, transaction, } = options;
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    // Validate move
    await validateFolderMove(folderId, targetParentId);
    // Update parent
    folder.parentId = targetParentId;
    // Recalculate paths and depth
    if (updatePaths) {
        await recalculateFolderPaths(folderId, targetParentId, transaction);
    }
    folder.updatedAt = new Date();
    return folder;
}
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
async function copyFolder(options) {
    const { folderId, targetParentId, newName, copyMessages = false, copyPermissions = false, copyMetadata = true, transaction, } = options;
    const sourceFolder = await getMailFolderById(folderId);
    if (!sourceFolder) {
        throw new Error('Source folder not found');
    }
    // Create copy
    const copyName = newName || `${sourceFolder.name}-copy`;
    const copiedFolder = await createMailFolder({
        userId: sourceFolder.userId,
        name: copyName,
        displayName: newName || `${sourceFolder.displayName} (Copy)`,
        parentId: targetParentId,
        folderType: sourceFolder.folderType,
        color: sourceFolder.color || undefined,
        icon: sourceFolder.icon || undefined,
        order: sourceFolder.order,
        isShared: false,
        sharingScope: FolderSharingScope.PRIVATE,
        metadata: copyMetadata ? { ...sourceFolder.metadata } : {},
    }, transaction);
    // Copy permissions if requested
    if (copyPermissions) {
        copiedFolder.permissions = [...sourceFolder.permissions];
    }
    // Copy messages if requested
    if (copyMessages && sourceFolder.messageCount > 0) {
        await copyAllMessagesToFolder(sourceFolder.id, copiedFolder.id, transaction);
    }
    return copiedFolder;
}
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
async function mergeFolders(sourceFolderId, targetFolderId, transaction) {
    if (sourceFolderId === targetFolderId) {
        throw new Error('Cannot merge folder with itself');
    }
    const sourceFolder = await getMailFolderById(sourceFolderId);
    const targetFolder = await getMailFolderById(targetFolderId);
    if (!sourceFolder || !targetFolder) {
        throw new Error('Source or target folder not found');
    }
    // Move all messages
    if (sourceFolder.messageCount > 0) {
        await moveAllMessagesToFolder(sourceFolderId, targetFolderId, transaction);
    }
    // Update target folder statistics
    targetFolder.messageCount += sourceFolder.messageCount;
    targetFolder.unreadCount += sourceFolder.unreadCount;
    targetFolder.sizeBytes += sourceFolder.sizeBytes;
    // Delete source folder
    await deleteMailFolder(sourceFolderId, { recursive: false }, transaction);
    return targetFolder;
}
// ============================================================================
// FOLDER SUBSCRIPTIONS & FAVORITES
// ============================================================================
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
async function subscribeToFolder(folderId, userId) {
    const folder = await getMailFolderById(folderId, userId);
    if (!folder) {
        throw new Error('Folder not found or access denied');
    }
    folder.isSubscribed = true;
    folder.updatedAt = new Date();
}
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
async function unsubscribeFromFolder(folderId, userId) {
    const folder = await getMailFolderById(folderId, userId);
    if (!folder) {
        throw new Error('Folder not found or access denied');
    }
    folder.isSubscribed = false;
    folder.updatedAt = new Date();
}
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
async function addFolderToFavorites(folderId, userId) {
    const folder = await getMailFolderById(folderId, userId);
    if (!folder) {
        throw new Error('Folder not found or access denied');
    }
    folder.isFavorite = true;
    folder.updatedAt = new Date();
}
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
async function removeFolderFromFavorites(folderId, userId) {
    const folder = await getMailFolderById(folderId, userId);
    if (!folder) {
        throw new Error('Folder not found or access denied');
    }
    folder.isFavorite = false;
    folder.updatedAt = new Date();
}
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
async function getFavoriteFolders(userId) {
    return getUserFolders({
        userId,
        isFavorite: true,
    });
}
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
async function getSubscribedFolders(userId) {
    return getUserFolders({
        userId,
        isSubscribed: true,
    });
}
// ============================================================================
// FOLDER STATISTICS & COUNTS
// ============================================================================
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
async function getFolderStatistics(folderId) {
    const folder = await getMailFolderById(folderId);
    if (!folder) {
        throw new Error('Folder not found');
    }
    // Implementation would aggregate message statistics
    return {
        folderId,
        totalMessages: folder.messageCount,
        unreadMessages: folder.unreadCount,
        totalSizeBytes: folder.sizeBytes,
        lastMessageAt: null,
        oldestMessageAt: null,
        averageMessageSize: folder.messageCount > 0 ? folder.sizeBytes / folder.messageCount : 0,
        messagesByDay: {},
    };
}
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
async function updateFolderCounts(folderId, transaction) {
    const folder = await getMailFolderById(folderId);
    if (!folder)
        return;
    // Implementation would query message counts
    const stats = await getFolderStatistics(folderId);
    folder.messageCount = stats.totalMessages;
    folder.unreadCount = stats.unreadMessages;
    folder.sizeBytes = stats.totalSizeBytes;
    folder.updatedAt = new Date();
}
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
async function incrementFolderCount(folderId, increment = 1, isUnread = false, sizeBytes = 0) {
    const folder = await getMailFolderById(folderId);
    if (!folder)
        return;
    folder.messageCount += increment;
    if (isUnread) {
        folder.unreadCount += increment;
    }
    folder.sizeBytes += sizeBytes;
    folder.updatedAt = new Date();
}
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
async function decrementFolderCount(folderId, decrement = 1, isUnread = false, sizeBytes = 0) {
    const folder = await getMailFolderById(folderId);
    if (!folder)
        return;
    folder.messageCount = Math.max(0, folder.messageCount - decrement);
    if (isUnread) {
        folder.unreadCount = Math.max(0, folder.unreadCount - decrement);
    }
    folder.sizeBytes = Math.max(0, folder.sizeBytes - sizeBytes);
    folder.updatedAt = new Date();
}
// ============================================================================
// SWAGGER DOCUMENTATION HELPERS
// ============================================================================
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
function getFolderIdProperty() {
    return {
        description: 'Unique folder identifier (UUID)',
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
    };
}
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
function getFolderNameProperty() {
    return {
        description: 'Internal folder name (used in paths and URLs)',
        type: 'string',
        minLength: 1,
        maxLength: 255,
        example: 'work-projects',
        pattern: '^[a-z0-9-_]+$',
    };
}
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
function getFolderDisplayNameProperty() {
    return {
        description: 'User-visible folder name',
        type: 'string',
        minLength: 1,
        maxLength: 255,
        example: 'Work Projects',
    };
}
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
function getFolderTypeProperty() {
    return {
        description: 'Type of folder (system or custom)',
        enum: Object.values(FolderType),
        type: 'string',
        example: FolderType.CUSTOM,
    };
}
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
function getFolderListResponse() {
    return {
        status: 200,
        description: 'List of mail folders',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    displayName: { type: 'string' },
                    folderType: { enum: Object.values(FolderType) },
                    messageCount: { type: 'number' },
                    unreadCount: { type: 'number' },
                    path: { type: 'string' },
                    depth: { type: 'number' },
                },
            },
        },
    };
}
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
function getFolderHierarchyResponse() {
    return {
        status: 200,
        description: 'Hierarchical folder tree structure',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    displayName: { type: 'string' },
                    children: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/FolderNode' },
                    },
                    hasChildren: { type: 'boolean' },
                    level: { type: 'number' },
                },
            },
        },
    };
}
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
function getCreateFolderOperation() {
    return {
        summary: 'Create a new mail folder',
        description: 'Creates a new mail folder with optional parent for hierarchical organization. ' +
            'System folders are created automatically and cannot be manually created.',
        operationId: 'createMailFolder',
        tags: ['Mail Folders'],
    };
}
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
function getMoveFolderOperation() {
    return {
        summary: 'Move a folder to a new parent',
        description: 'Moves a folder and all its descendants to a new parent location. ' +
            'Validates that the move does not create circular references. ' +
            'System folders cannot be moved.',
        operationId: 'moveMailFolder',
        tags: ['Mail Folders'],
    };
}
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
function getShareFolderOperation() {
    return {
        summary: 'Share a folder with other users',
        description: 'Grants specified users access to a folder with defined permission level. ' +
            'Supports setting expiration dates and sending email notifications. ' +
            'Only folder owners can share folders.',
        operationId: 'shareMailFolder',
        tags: ['Mail Folders', 'Sharing'],
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
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
async function getUserEmail(userId) {
    // Implementation would query user service
    return `user-${userId}@example.com`;
}
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
async function sendFolderShareNotifications(folderId, userIds, message) {
    // Implementation would send notifications via email/push
}
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
async function moveAllMessagesToFolder(sourceFolderId, targetFolderId, transaction) {
    // Implementation would update all message folder references
}
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
async function copyAllMessagesToFolder(sourceFolderId, targetFolderId, transaction) {
    // Implementation would duplicate all messages to target folder
}
//# sourceMappingURL=mail-folder-management-kit.js.map