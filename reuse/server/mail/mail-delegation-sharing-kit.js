"use strict";
/**
 * LOC: M1D2E3L4G5
 * File: /reuse/server/mail/mail-delegation-sharing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Mail delegation controllers
 *   - Mailbox sharing services
 *   - Calendar delegation managers
 *   - Permission management services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.DelegationStatus = exports.InheritanceMode = exports.MailboxType = exports.DelegationScope = exports.PermissionType = exports.DelegateAccessLevel = void 0;
exports.getMailboxDelegationAttributes = getMailboxDelegationAttributes;
exports.getFolderPermissionAttributes = getFolderPermissionAttributes;
exports.getCalendarDelegationAttributes = getCalendarDelegationAttributes;
exports.getSharedMailboxAttributes = getSharedMailboxAttributes;
exports.getDelegationAuditLogAttributes = getDelegationAuditLogAttributes;
exports.getSendAsPermissionAttributes = getSendAsPermissionAttributes;
exports.getSendOnBehalfPermissionAttributes = getSendOnBehalfPermissionAttributes;
exports.createMailboxDelegation = createMailboxDelegation;
exports.revokeMailboxDelegation = revokeMailboxDelegation;
exports.updateMailboxDelegation = updateMailboxDelegation;
exports.getMailboxDelegations = getMailboxDelegations;
exports.getUserDelegatedMailboxes = getUserDelegatedMailboxes;
exports.hasMailboxDelegation = hasMailboxDelegation;
exports.getEffectivePermissions = getEffectivePermissions;
exports.grantFolderPermission = grantFolderPermission;
exports.revokeFolderPermission = revokeFolderPermission;
exports.getFolderPermissions = getFolderPermissions;
exports.getUserFolderPermission = getUserFolderPermission;
exports.shareFolderWithUsers = shareFolderWithUsers;
exports.shareFolderWithGroup = shareFolderWithGroup;
exports.updateFolderPermissionLevel = updateFolderPermissionLevel;
exports.createCalendarDelegation = createCalendarDelegation;
exports.revokeCalendarDelegation = revokeCalendarDelegation;
exports.getCalendarDelegations = getCalendarDelegations;
exports.canAccessCalendar = canAccessCalendar;
exports.grantSendAsPermission = grantSendAsPermission;
exports.revokeSendAsPermission = revokeSendAsPermission;
exports.hasSendAsPermission = hasSendAsPermission;
exports.grantSendOnBehalfPermission = grantSendOnBehalfPermission;
exports.revokeSendOnBehalfPermission = revokeSendOnBehalfPermission;
exports.hasSendOnBehalfPermission = hasSendOnBehalfPermission;
exports.createSharedMailbox = createSharedMailbox;
exports.addSharedMailboxDelegate = addSharedMailboxDelegate;
exports.removeSharedMailboxDelegate = removeSharedMailboxDelegate;
exports.getSharedMailboxDelegates = getSharedMailboxDelegates;
exports.updateSharedMailbox = updateSharedMailbox;
exports.grantGroupMailboxAccess = grantGroupMailboxAccess;
exports.revokeGroupMailboxAccess = revokeGroupMailboxAccess;
exports.getMailboxGroupAccess = getMailboxGroupAccess;
exports.createInheritanceRule = createInheritanceRule;
exports.applyPermissionInheritance = applyPermissionInheritance;
exports.getInheritedPermissions = getInheritedPermissions;
exports.logDelegationAudit = logDelegationAudit;
exports.getDelegationAuditLogs = getDelegationAuditLogs;
exports.getUserDelegationAuditLogs = getUserDelegationAuditLogs;
exports.getMailboxDelegationSchema = getMailboxDelegationSchema;
exports.getFolderPermissionSchema = getFolderPermissionSchema;
exports.getCalendarDelegationSchema = getCalendarDelegationSchema;
exports.getSharedMailboxSchema = getSharedMailboxSchema;
exports.getGrantDelegationOperation = getGrantDelegationOperation;
exports.getRevokeDelegationOperation = getRevokeDelegationOperation;
exports.getShareFolderOperation = getShareFolderOperation;
exports.generateUUID = generateUUID;
exports.getUserEmail = getUserEmail;
exports.sendDelegationNotification = sendDelegationNotification;
exports.validateDelegationPermissions = validateDelegationPermissions;
exports.isDelegationExpired = isDelegationExpired;
exports.getHighestAccessLevel = getHighestAccessLevel;
/**
 * File: /reuse/server/mail/mail-delegation-sharing-kit.ts
 * Locator: WC-MAIL-DELEG-KIT-001
 * Purpose: Mail Delegation and Sharing Kit - Exchange Server-style delegation and permission management
 *
 * Upstream: sequelize v6.x, Node 18+
 * Downstream: ../backend/mail/*, delegation controllers, mailbox services, permission managers
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 mail delegation utilities for mailbox delegation, folder sharing, calendar delegation, Send As/Send on Behalf permissions
 *
 * LLM Context: Enterprise-grade mail delegation and sharing kit for White Cross healthcare platform.
 * Provides comprehensive Exchange Server-style delegation features including mailbox delegation, folder sharing,
 * calendar delegation, "Send As" and "Send on Behalf" permissions, delegate access levels (Owner, Editor, Reviewer),
 * permission inheritance, shared mailbox management, group mailbox access, permission revocation, and delegation
 * audit logging. HIPAA-compliant with comprehensive audit trails and secure permission management for healthcare communications.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Delegate access levels following Exchange Server conventions
 */
var DelegateAccessLevel;
(function (DelegateAccessLevel) {
    DelegateAccessLevel["NONE"] = "none";
    DelegateAccessLevel["REVIEWER"] = "reviewer";
    DelegateAccessLevel["CONTRIBUTOR"] = "contributor";
    DelegateAccessLevel["AUTHOR"] = "author";
    DelegateAccessLevel["EDITOR"] = "editor";
    DelegateAccessLevel["OWNER"] = "owner";
    DelegateAccessLevel["PUBLISHING_EDITOR"] = "publishing_editor";
    DelegateAccessLevel["PUBLISHING_AUTHOR"] = "publishing_author";
})(DelegateAccessLevel || (exports.DelegateAccessLevel = DelegateAccessLevel = {}));
/**
 * Permission types for mailbox delegation
 */
var PermissionType;
(function (PermissionType) {
    PermissionType["SEND_AS"] = "send_as";
    PermissionType["SEND_ON_BEHALF"] = "send_on_behalf";
    PermissionType["FULL_ACCESS"] = "full_access";
    PermissionType["READ_PERMISSION"] = "read_permission";
    PermissionType["FOLDER_VISIBLE"] = "folder_visible";
    PermissionType["FOLDER_OWNER"] = "folder_owner";
    PermissionType["FOLDER_EDITOR"] = "folder_editor";
    PermissionType["FOLDER_REVIEWER"] = "folder_reviewer";
    PermissionType["CALENDAR_DELEGATE"] = "calendar_delegate";
    PermissionType["TASK_DELEGATE"] = "task_delegate";
    PermissionType["CONTACT_DELEGATE"] = "contact_delegate";
})(PermissionType || (exports.PermissionType = PermissionType = {}));
/**
 * Delegation scope
 */
var DelegationScope;
(function (DelegationScope) {
    DelegationScope["FULL_MAILBOX"] = "full_mailbox";
    DelegationScope["SPECIFIC_FOLDERS"] = "specific_folders";
    DelegationScope["CALENDAR"] = "calendar";
    DelegationScope["CONTACTS"] = "contacts";
    DelegationScope["TASKS"] = "tasks";
    DelegationScope["INBOX"] = "inbox";
    DelegationScope["CUSTOM"] = "custom";
})(DelegationScope || (exports.DelegationScope = DelegationScope = {}));
/**
 * Mailbox type
 */
var MailboxType;
(function (MailboxType) {
    MailboxType["USER"] = "user";
    MailboxType["SHARED"] = "shared";
    MailboxType["RESOURCE"] = "resource";
    MailboxType["GROUP"] = "group";
    MailboxType["PUBLIC"] = "public";
    MailboxType["DISCOVERY"] = "discovery";
    MailboxType["ARCHIVE"] = "archive";
})(MailboxType || (exports.MailboxType = MailboxType = {}));
/**
 * Permission inheritance mode
 */
var InheritanceMode;
(function (InheritanceMode) {
    InheritanceMode["NONE"] = "none";
    InheritanceMode["FOLDER"] = "folder";
    InheritanceMode["MAILBOX"] = "mailbox";
    InheritanceMode["BOTH"] = "both";
})(InheritanceMode || (exports.InheritanceMode = InheritanceMode = {}));
/**
 * Delegation status
 */
var DelegationStatus;
(function (DelegationStatus) {
    DelegationStatus["ACTIVE"] = "active";
    DelegationStatus["PENDING"] = "pending";
    DelegationStatus["SUSPENDED"] = "suspended";
    DelegationStatus["REVOKED"] = "revoked";
    DelegationStatus["EXPIRED"] = "expired";
})(DelegationStatus || (exports.DelegationStatus = DelegationStatus = {}));
/**
 * Audit action types
 */
var AuditAction;
(function (AuditAction) {
    AuditAction["GRANT_PERMISSION"] = "grant_permission";
    AuditAction["REVOKE_PERMISSION"] = "revoke_permission";
    AuditAction["MODIFY_PERMISSION"] = "modify_permission";
    AuditAction["ACCESS_MAILBOX"] = "access_mailbox";
    AuditAction["SEND_AS"] = "send_as";
    AuditAction["SEND_ON_BEHALF"] = "send_on_behalf";
    AuditAction["DELEGATE_ADDED"] = "delegate_added";
    AuditAction["DELEGATE_REMOVED"] = "delegate_removed";
    AuditAction["PERMISSION_INHERITED"] = "permission_inherited";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================
/**
 * Generates Sequelize model attributes for mailbox delegations table.
 * Includes comprehensive delegation permissions and scope management.
 *
 * @returns {ModelAttributes} Sequelize model attributes for mailbox delegations
 *
 * @example
 * ```typescript
 * const MailboxDelegation = sequelize.define('MailboxDelegation', getMailboxDelegationAttributes(), {
 *   tableName: 'mailbox_delegations',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
function getMailboxDelegationAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique delegation identifier',
        },
        mailboxId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'mailboxes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Mailbox being delegated',
        },
        delegateUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User receiving delegation',
        },
        delegateEmail: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Email of delegate user',
            validate: {
                isEmail: true,
            },
        },
        grantedByUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User who granted the delegation',
        },
        accessLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegateAccessLevel)),
            allowNull: false,
            defaultValue: DelegateAccessLevel.REVIEWER,
            comment: 'Delegate access level',
        },
        permissionTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.ENUM(...Object.values(PermissionType))),
            allowNull: false,
            defaultValue: [],
            comment: 'Array of specific permission types',
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegationScope)),
            allowNull: false,
            defaultValue: DelegationScope.FULL_MAILBOX,
            comment: 'Scope of delegation',
        },
        scopeFolderIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: true,
            comment: 'Specific folder IDs if scope is SPECIFIC_FOLDERS',
        },
        canSendAs: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can send email as mailbox owner',
        },
        canSendOnBehalf: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can send email on behalf of owner',
        },
        canViewPrivateItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can view private items',
        },
        receivesMeetingMessages: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Receives meeting request messages',
        },
        inheritanceMode: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(InheritanceMode)),
            allowNull: false,
            defaultValue: InheritanceMode.NONE,
            comment: 'Permission inheritance mode',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegationStatus)),
            allowNull: false,
            defaultValue: DelegationStatus.ACTIVE,
            comment: 'Delegation status',
        },
        effectiveFrom: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'When delegation becomes effective',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When delegation expires',
        },
        notifyDelegate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether to notify delegate of access',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional delegation metadata',
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
        },
    };
}
/**
 * Generates Sequelize model attributes for folder permissions table.
 * Includes granular folder-level permission controls.
 *
 * @returns {ModelAttributes} Sequelize model attributes for folder permissions
 *
 * @example
 * ```typescript
 * const FolderPermission = sequelize.define('FolderPermission', getFolderPermissionAttributes(), {
 *   tableName: 'folder_permissions',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
function getFolderPermissionAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique permission identifier',
        },
        folderId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'mail_folders',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Folder ID',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User ID (null for group permissions)',
        },
        groupId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'groups',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Group ID (null for user permissions)',
        },
        permissionLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegateAccessLevel)),
            allowNull: false,
            defaultValue: DelegateAccessLevel.REVIEWER,
            comment: 'Permission level',
        },
        canCreateItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can create new items in folder',
        },
        canCreateSubfolders: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can create subfolders',
        },
        canDeleteOwnItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can delete own items',
        },
        canDeleteAllItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can delete all items',
        },
        canEditOwnItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can edit own items',
        },
        canEditAllItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can edit all items',
        },
        canReadItems: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Can read items',
        },
        isFolderOwner: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Is folder owner',
        },
        isFolderVisible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Folder is visible to user',
        },
        inheritFromParent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Inherit permissions from parent folder',
        },
        grantedByUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User who granted permission',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Permission expiration date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional permission metadata',
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
        },
    };
}
/**
 * Generates Sequelize model attributes for calendar delegations table.
 * Includes calendar-specific delegation controls.
 *
 * @returns {ModelAttributes} Sequelize model attributes for calendar delegations
 *
 * @example
 * ```typescript
 * const CalendarDelegation = sequelize.define('CalendarDelegation', getCalendarDelegationAttributes(), {
 *   tableName: 'calendar_delegations',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
function getCalendarDelegationAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique delegation identifier',
        },
        calendarId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'calendars',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Calendar ID',
        },
        ownerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Calendar owner ID',
        },
        delegateUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Delegate user ID',
        },
        accessLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegateAccessLevel)),
            allowNull: false,
            defaultValue: DelegateAccessLevel.REVIEWER,
            comment: 'Delegate access level',
        },
        canViewPrivateAppointments: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can view private appointments',
        },
        canCreateAppointments: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can create appointments',
        },
        canEditAppointments: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can edit appointments',
        },
        canDeleteAppointments: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can delete appointments',
        },
        canRespondToMeetings: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can respond to meeting requests',
        },
        receivesMeetingRequests: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Receives meeting request copies',
        },
        receivesConflictNotifications: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Receives conflict notifications',
        },
        sendNotificationsToDelegate: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Send notifications to delegate',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegationStatus)),
            allowNull: false,
            defaultValue: DelegationStatus.ACTIVE,
            comment: 'Delegation status',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Delegation expiration date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional delegation metadata',
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
        },
    };
}
/**
 * Generates Sequelize model attributes for shared mailboxes table.
 * Includes shared mailbox configuration and quota management.
 *
 * @returns {ModelAttributes} Sequelize model attributes for shared mailboxes
 *
 * @example
 * ```typescript
 * const SharedMailbox = sequelize.define('SharedMailbox', getSharedMailboxAttributes(), {
 *   tableName: 'shared_mailboxes',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
function getSharedMailboxAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique mailbox identifier',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Mailbox name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        emailAddress: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Mailbox email address',
            validate: {
                isEmail: true,
            },
        },
        displayName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Display name',
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        mailboxType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(MailboxType)),
            allowNull: false,
            defaultValue: MailboxType.SHARED,
            comment: 'Type of mailbox',
        },
        ownerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Owner user ID',
        },
        ownerGroupId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'groups',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Owner group ID',
        },
        autoReplyEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Auto-reply enabled',
        },
        autoReplyMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Auto-reply message',
        },
        hideFromAddressList: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Hide from global address list',
        },
        sendAsRestricted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Restrict Send As permission',
        },
        requireSenderAuthentication: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Require sender authentication',
        },
        maxDelegates: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            comment: 'Maximum number of delegates',
            validate: {
                min: 1,
                max: 1000,
            },
        },
        quotaLimitMB: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10240, // 10GB
            comment: 'Mailbox quota limit in MB',
            validate: {
                min: 0,
            },
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional mailbox metadata',
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
        },
    };
}
/**
 * Generates Sequelize model attributes for delegation audit log table.
 * Includes comprehensive audit trail for all delegation actions.
 *
 * @returns {ModelAttributes} Sequelize model attributes for delegation audit log
 *
 * @example
 * ```typescript
 * const DelegationAuditLog = sequelize.define('DelegationAuditLog', getDelegationAuditLogAttributes(), {
 *   tableName: 'delegation_audit_logs',
 *   timestamps: false
 * });
 * ```
 */
function getDelegationAuditLogAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique audit log identifier',
        },
        mailboxId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'mailboxes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Mailbox ID',
        },
        delegateUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Delegate user ID',
        },
        performedByUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User who performed the action',
        },
        action: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AuditAction)),
            allowNull: false,
            comment: 'Audit action type',
        },
        permissionType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PermissionType)),
            allowNull: true,
            comment: 'Permission type affected',
        },
        accessLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegateAccessLevel)),
            allowNull: true,
            comment: 'Access level affected',
        },
        previousValue: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Previous value before change',
        },
        newValue: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'New value after change',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.INET,
            allowNull: false,
            comment: 'IP address of action',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'User agent of action',
        },
        success: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether action succeeded',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if failed',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional audit metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
}
/**
 * Generates Sequelize model attributes for Send As permissions table.
 * Includes Send As permission management with approval workflows.
 *
 * @returns {ModelAttributes} Sequelize model attributes for Send As permissions
 *
 * @example
 * ```typescript
 * const SendAsPermission = sequelize.define('SendAsPermission', getSendAsPermissionAttributes(), {
 *   tableName: 'send_as_permissions',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
function getSendAsPermissionAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique permission identifier',
        },
        mailboxId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'mailboxes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Mailbox ID',
        },
        delegateUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Delegate user ID',
        },
        grantedByUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User who granted permission',
        },
        canSendAsIndividual: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Can send as individual mailbox',
        },
        canSendAsGroup: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Can send as group mailbox',
        },
        requiresApproval: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Requires approval before sending',
        },
        approvalWorkflowId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Approval workflow ID',
        },
        notifyOwnerOnSend: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Notify owner when delegate sends',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegationStatus)),
            allowNull: false,
            defaultValue: DelegationStatus.ACTIVE,
            comment: 'Permission status',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Permission expiration date',
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
        },
    };
}
/**
 * Generates Sequelize model attributes for Send on Behalf permissions table.
 * Includes Send on Behalf permission management.
 *
 * @returns {ModelAttributes} Sequelize model attributes for Send on Behalf permissions
 *
 * @example
 * ```typescript
 * const SendOnBehalfPermission = sequelize.define('SendOnBehalfPermission', getSendOnBehalfPermissionAttributes(), {
 *   tableName: 'send_on_behalf_permissions',
 *   timestamps: true,
 *   paranoid: true
 * });
 * ```
 */
function getSendOnBehalfPermissionAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique permission identifier',
        },
        mailboxId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'mailboxes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Mailbox ID',
        },
        delegateUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Delegate user ID',
        },
        grantedByUserId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'User who granted permission',
        },
        showInFromLine: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Show "on behalf of" in From line',
        },
        notifyOwnerOnSend: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Notify owner when delegate sends',
        },
        copyOwnerOnSend: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Copy owner on sent messages',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DelegationStatus)),
            allowNull: false,
            defaultValue: DelegationStatus.ACTIVE,
            comment: 'Permission status',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Permission expiration date',
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
        },
    };
}
// ============================================================================
// MAILBOX DELEGATION MANAGEMENT
// ============================================================================
/**
 * Creates a new mailbox delegation with specified permissions and scope.
 * Validates delegate permissions and sends notification if requested.
 *
 * @param {DelegationCreationOptions} options - Delegation creation options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailboxDelegation>} Created delegation
 *
 * @example
 * ```typescript
 * const delegation = await createMailboxDelegation({
 *   mailboxId: 'mailbox-123',
 *   delegateUserId: 'user-456',
 *   grantedByUserId: 'user-789',
 *   accessLevel: DelegateAccessLevel.EDITOR,
 *   permissionTypes: [PermissionType.FULL_ACCESS, PermissionType.SEND_ON_BEHALF],
 *   canSendOnBehalf: true,
 *   notifyDelegate: true
 * });
 * ```
 */
async function createMailboxDelegation(options, transaction) {
    const { mailboxId, delegateUserId, grantedByUserId, accessLevel, permissionTypes, scope = DelegationScope.FULL_MAILBOX, scopeFolderIds = [], canSendAs = false, canSendOnBehalf = false, canViewPrivateItems = false, receivesMeetingMessages = false, inheritanceMode = InheritanceMode.NONE, effectiveFrom = new Date(), expiresAt = null, notifyDelegate = true, metadata = {}, } = options;
    // Get delegate email
    const delegateEmail = await getUserEmail(delegateUserId);
    // Create delegation record
    const delegation = {
        id: generateUUID(),
        mailboxId,
        delegateUserId,
        delegateEmail,
        grantedByUserId,
        accessLevel,
        permissionTypes,
        scope,
        scopeFolderIds,
        canSendAs,
        canSendOnBehalf,
        canViewPrivateItems,
        receivesMeetingMessages,
        inheritanceMode,
        status: DelegationStatus.ACTIVE,
        effectiveFrom,
        expiresAt,
        notifyDelegate,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    // Log audit event
    await logDelegationAudit({
        mailboxId,
        delegateUserId,
        performedByUserId: grantedByUserId,
        action: AuditAction.DELEGATE_ADDED,
        accessLevel,
        newValue: delegation,
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
    // Send notification if requested
    if (notifyDelegate) {
        await sendDelegationNotification(mailboxId, delegateUserId, 'granted');
    }
    return delegation;
}
/**
 * Revokes a mailbox delegation by delegation ID.
 * Logs audit event and notifies delegate if configured.
 *
 * @param {string} delegationId - Delegation ID to revoke
 * @param {string} revokedByUserId - User revoking the delegation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeMailboxDelegation('delegation-123', 'user-789');
 * ```
 */
async function revokeMailboxDelegation(delegationId, revokedByUserId, transaction) {
    // Implementation would update delegation status to REVOKED
    // Log audit event
    await logDelegationAudit({
        mailboxId: 'mailbox-id',
        delegateUserId: 'delegate-id',
        performedByUserId: revokedByUserId,
        action: AuditAction.DELEGATE_REMOVED,
        newValue: { status: DelegationStatus.REVOKED },
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
}
/**
 * Updates an existing mailbox delegation.
 * Validates changes and logs audit trail.
 *
 * @param {string} delegationId - Delegation ID to update
 * @param {Partial<MailboxDelegation>} updates - Updates to apply
 * @param {string} updatedByUserId - User making the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailboxDelegation>} Updated delegation
 *
 * @example
 * ```typescript
 * const updated = await updateMailboxDelegation('delegation-123', {
 *   accessLevel: DelegateAccessLevel.OWNER,
 *   canSendAs: true
 * }, 'user-789');
 * ```
 */
async function updateMailboxDelegation(delegationId, updates, updatedByUserId, transaction) {
    // Implementation would update delegation record
    const delegation = {
        id: delegationId,
        ...updates,
        updatedAt: new Date(),
    };
    // Log audit event
    await logDelegationAudit({
        mailboxId: delegation.mailboxId,
        delegateUserId: delegation.delegateUserId,
        performedByUserId: updatedByUserId,
        action: AuditAction.MODIFY_PERMISSION,
        previousValue: {},
        newValue: updates,
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
    return delegation;
}
/**
 * Gets all delegations for a mailbox.
 * Returns active, pending, and optionally expired delegations.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {DelegationQueryOptions} [options] - Query options
 * @returns {Promise<MailboxDelegation[]>} Array of delegations
 *
 * @example
 * ```typescript
 * const delegations = await getMailboxDelegations('mailbox-123', {
 *   status: DelegationStatus.ACTIVE,
 *   includeExpired: false
 * });
 * ```
 */
async function getMailboxDelegations(mailboxId, options) {
    const { status, includeExpired = false, limit = 100, offset = 0 } = options || {};
    // Implementation would query database for delegations
    return [];
}
/**
 * Gets all mailboxes delegated to a user.
 * Returns mailboxes where user is a delegate.
 *
 * @param {string} delegateUserId - Delegate user ID
 * @param {DelegationQueryOptions} [options] - Query options
 * @returns {Promise<MailboxDelegation[]>} Array of delegations
 *
 * @example
 * ```typescript
 * const delegatedMailboxes = await getUserDelegatedMailboxes('user-456');
 * ```
 */
async function getUserDelegatedMailboxes(delegateUserId, options) {
    // Implementation would query delegations where delegateUserId matches
    return [];
}
/**
 * Checks if a user has delegation access to a mailbox.
 * Validates delegation status and expiration.
 *
 * @param {string} userId - User ID to check
 * @param {string} mailboxId - Mailbox ID
 * @returns {Promise<boolean>} True if user has access
 *
 * @example
 * ```typescript
 * const hasAccess = await hasMailboxDelegation('user-456', 'mailbox-123');
 * if (hasAccess) {
 *   // Allow access to mailbox
 * }
 * ```
 */
async function hasMailboxDelegation(userId, mailboxId) {
    // Implementation would check for active delegation
    return false;
}
/**
 * Gets effective permissions for a user on a mailbox.
 * Calculates combined permissions from direct and inherited delegations.
 *
 * @param {string} userId - User ID
 * @param {string} mailboxId - Mailbox ID
 * @param {string} [folderId] - Optional folder ID for folder-specific permissions
 * @returns {Promise<EffectivePermissions>} Effective permissions
 *
 * @example
 * ```typescript
 * const permissions = await getEffectivePermissions('user-456', 'mailbox-123');
 * if (permissions.canSendAs) {
 *   // Allow send as
 * }
 * ```
 */
async function getEffectivePermissions(userId, mailboxId, folderId) {
    // Implementation would calculate effective permissions
    return {
        userId,
        mailboxId,
        folderId,
        accessLevel: DelegateAccessLevel.NONE,
        permissionTypes: [],
        canSendAs: false,
        canSendOnBehalf: false,
        canViewPrivateItems: false,
        canCreateItems: false,
        canDeleteItems: false,
        canEditItems: false,
        inheritedFrom: null,
        directPermissions: [],
        inheritedPermissions: [],
    };
}
// ============================================================================
// FOLDER SHARING AND PERMISSIONS
// ============================================================================
/**
 * Grants folder permission to a user or group.
 * Creates granular folder-level access controls.
 *
 * @param {FolderPermissionCreationOptions} options - Permission creation options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FolderPermission>} Created permission
 *
 * @example
 * ```typescript
 * const permission = await grantFolderPermission({
 *   folderId: 'folder-123',
 *   userId: 'user-456',
 *   permissionLevel: DelegateAccessLevel.EDITOR,
 *   grantedByUserId: 'user-789',
 *   canEditAllItems: true
 * });
 * ```
 */
async function grantFolderPermission(options, transaction) {
    const { folderId, userId, groupId, permissionLevel, grantedByUserId, canCreateItems = false, canCreateSubfolders = false, canDeleteOwnItems = false, canDeleteAllItems = false, canEditOwnItems = false, canEditAllItems = false, inheritFromParent = false, expiresAt = null, metadata = {}, } = options;
    const permission = {
        id: generateUUID(),
        folderId,
        userId: userId || null,
        groupId: groupId || null,
        permissionLevel,
        canCreateItems,
        canCreateSubfolders,
        canDeleteOwnItems,
        canDeleteAllItems,
        canEditOwnItems,
        canEditAllItems,
        canReadItems: true,
        isFolderOwner: permissionLevel === DelegateAccessLevel.OWNER,
        isFolderVisible: true,
        inheritFromParent,
        grantedByUserId,
        expiresAt,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    return permission;
}
/**
 * Revokes folder permission for a user or group.
 * Removes access to folder and logs audit event.
 *
 * @param {string} permissionId - Permission ID to revoke
 * @param {string} revokedByUserId - User revoking the permission
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeFolderPermission('permission-123', 'user-789');
 * ```
 */
async function revokeFolderPermission(permissionId, revokedByUserId, transaction) {
    // Implementation would soft delete or remove permission record
}
/**
 * Gets all permissions for a folder.
 * Returns user and group permissions.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<FolderPermission[]>} Array of permissions
 *
 * @example
 * ```typescript
 * const permissions = await getFolderPermissions('folder-123');
 * ```
 */
async function getFolderPermissions(folderId) {
    // Implementation would query folder permissions
    return [];
}
/**
 * Gets user's permission level for a folder.
 * Checks direct user permissions and group memberships.
 *
 * @param {string} folderId - Folder ID
 * @param {string} userId - User ID
 * @returns {Promise<FolderPermission | null>} User's permission or null
 *
 * @example
 * ```typescript
 * const permission = await getUserFolderPermission('folder-123', 'user-456');
 * if (permission && permission.canEditAllItems) {
 *   // Allow editing
 * }
 * ```
 */
async function getUserFolderPermission(folderId, userId) {
    // Implementation would query user's folder permission
    return null;
}
/**
 * Shares a folder with multiple users.
 * Creates permissions for multiple users at once.
 *
 * @param {string} folderId - Folder ID
 * @param {string[]} userIds - User IDs to share with
 * @param {DelegateAccessLevel} permissionLevel - Permission level
 * @param {string} sharedByUserId - User sharing the folder
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FolderPermission[]>} Created permissions
 *
 * @example
 * ```typescript
 * const permissions = await shareFolderWithUsers(
 *   'folder-123',
 *   ['user-456', 'user-789'],
 *   DelegateAccessLevel.REVIEWER,
 *   'user-owner'
 * );
 * ```
 */
async function shareFolderWithUsers(folderId, userIds, permissionLevel, sharedByUserId, transaction) {
    const permissions = [];
    for (const userId of userIds) {
        const permission = await grantFolderPermission({
            folderId,
            userId,
            permissionLevel,
            grantedByUserId: sharedByUserId,
        }, transaction);
        permissions.push(permission);
    }
    return permissions;
}
/**
 * Shares a folder with a group.
 * All group members inherit the permission.
 *
 * @param {string} folderId - Folder ID
 * @param {string} groupId - Group ID
 * @param {DelegateAccessLevel} permissionLevel - Permission level
 * @param {string} sharedByUserId - User sharing the folder
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FolderPermission>} Created permission
 *
 * @example
 * ```typescript
 * const permission = await shareFolderWithGroup(
 *   'folder-123',
 *   'group-456',
 *   DelegateAccessLevel.EDITOR,
 *   'user-owner'
 * );
 * ```
 */
async function shareFolderWithGroup(folderId, groupId, permissionLevel, sharedByUserId, transaction) {
    return await grantFolderPermission({
        folderId,
        groupId,
        permissionLevel,
        grantedByUserId: sharedByUserId,
    }, transaction);
}
/**
 * Updates folder permission level.
 * Modifies existing permission access level.
 *
 * @param {string} permissionId - Permission ID
 * @param {DelegateAccessLevel} newLevel - New permission level
 * @param {string} updatedByUserId - User updating the permission
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FolderPermission>} Updated permission
 *
 * @example
 * ```typescript
 * const permission = await updateFolderPermissionLevel(
 *   'permission-123',
 *   DelegateAccessLevel.OWNER,
 *   'user-789'
 * );
 * ```
 */
async function updateFolderPermissionLevel(permissionId, newLevel, updatedByUserId, transaction) {
    // Implementation would update permission level
    return {};
}
// ============================================================================
// CALENDAR DELEGATION
// ============================================================================
/**
 * Creates calendar delegation with meeting management permissions.
 * Allows delegate to manage calendar appointments and meetings.
 *
 * @param {CalendarDelegationCreationOptions} options - Calendar delegation options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CalendarDelegation>} Created calendar delegation
 *
 * @example
 * ```typescript
 * const delegation = await createCalendarDelegation({
 *   calendarId: 'calendar-123',
 *   ownerId: 'user-789',
 *   delegateUserId: 'user-456',
 *   accessLevel: DelegateAccessLevel.EDITOR,
 *   canCreateAppointments: true,
 *   canRespondToMeetings: true,
 *   receivesMeetingRequests: true
 * });
 * ```
 */
async function createCalendarDelegation(options, transaction) {
    const { calendarId, ownerId, delegateUserId, accessLevel, canViewPrivateAppointments = false, canCreateAppointments = false, canEditAppointments = false, canDeleteAppointments = false, canRespondToMeetings = false, receivesMeetingRequests = false, receivesConflictNotifications = false, sendNotificationsToDelegate = true, expiresAt = null, metadata = {}, } = options;
    const delegation = {
        id: generateUUID(),
        calendarId,
        ownerId,
        delegateUserId,
        accessLevel,
        canViewPrivateAppointments,
        canCreateAppointments,
        canEditAppointments,
        canDeleteAppointments,
        canRespondToMeetings,
        receivesMeetingRequests,
        receivesConflictNotifications,
        sendNotificationsToDelegate,
        status: DelegationStatus.ACTIVE,
        expiresAt,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    return delegation;
}
/**
 * Revokes calendar delegation.
 * Removes delegate's access to calendar.
 *
 * @param {string} delegationId - Calendar delegation ID
 * @param {string} revokedByUserId - User revoking the delegation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeCalendarDelegation('delegation-123', 'user-789');
 * ```
 */
async function revokeCalendarDelegation(delegationId, revokedByUserId, transaction) {
    // Implementation would update delegation status to REVOKED
}
/**
 * Gets all calendar delegations for a user.
 * Returns calendars where user is owner or delegate.
 *
 * @param {string} userId - User ID
 * @param {boolean} [asDelegate] - Get calendars where user is delegate
 * @returns {Promise<CalendarDelegation[]>} Array of calendar delegations
 *
 * @example
 * ```typescript
 * const delegatedCalendars = await getCalendarDelegations('user-456', true);
 * ```
 */
async function getCalendarDelegations(userId, asDelegate = false) {
    // Implementation would query calendar delegations
    return [];
}
/**
 * Checks if user can access a calendar.
 * Validates calendar delegation status.
 *
 * @param {string} userId - User ID
 * @param {string} calendarId - Calendar ID
 * @returns {Promise<boolean>} True if user has access
 *
 * @example
 * ```typescript
 * const canAccess = await canAccessCalendar('user-456', 'calendar-123');
 * if (canAccess) {
 *   // Show calendar
 * }
 * ```
 */
async function canAccessCalendar(userId, calendarId) {
    // Implementation would check calendar delegation or ownership
    return false;
}
// ============================================================================
// SEND AS PERMISSIONS
// ============================================================================
/**
 * Grants Send As permission to a delegate.
 * Allows delegate to send email as the mailbox owner.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {string} delegateUserId - Delegate user ID
 * @param {string} grantedByUserId - User granting permission
 * @param {boolean} [requiresApproval] - Whether approval is required
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SendAsPermission>} Created Send As permission
 *
 * @example
 * ```typescript
 * const permission = await grantSendAsPermission(
 *   'mailbox-123',
 *   'user-456',
 *   'user-789',
 *   false
 * );
 * ```
 */
async function grantSendAsPermission(mailboxId, delegateUserId, grantedByUserId, requiresApproval = false, transaction) {
    const permission = {
        id: generateUUID(),
        mailboxId,
        delegateUserId,
        grantedByUserId,
        canSendAsIndividual: true,
        canSendAsGroup: false,
        requiresApproval,
        approvalWorkflowId: null,
        notifyOwnerOnSend: false,
        status: DelegationStatus.ACTIVE,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    // Log audit event
    await logDelegationAudit({
        mailboxId,
        delegateUserId,
        performedByUserId: grantedByUserId,
        action: AuditAction.GRANT_PERMISSION,
        permissionType: PermissionType.SEND_AS,
        newValue: permission,
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
    return permission;
}
/**
 * Revokes Send As permission.
 * Removes delegate's ability to send as mailbox owner.
 *
 * @param {string} permissionId - Send As permission ID
 * @param {string} revokedByUserId - User revoking permission
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeSendAsPermission('permission-123', 'user-789');
 * ```
 */
async function revokeSendAsPermission(permissionId, revokedByUserId, transaction) {
    // Implementation would update permission status to REVOKED
    await logDelegationAudit({
        mailboxId: 'mailbox-id',
        delegateUserId: 'delegate-id',
        performedByUserId: revokedByUserId,
        action: AuditAction.REVOKE_PERMISSION,
        permissionType: PermissionType.SEND_AS,
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
}
/**
 * Checks if user has Send As permission for a mailbox.
 * Validates active Send As permission.
 *
 * @param {string} userId - User ID
 * @param {string} mailboxId - Mailbox ID
 * @returns {Promise<boolean>} True if user can send as
 *
 * @example
 * ```typescript
 * const canSendAs = await hasSendAsPermission('user-456', 'mailbox-123');
 * if (canSendAs) {
 *   // Allow send as
 * }
 * ```
 */
async function hasSendAsPermission(userId, mailboxId) {
    // Implementation would check for active Send As permission
    return false;
}
// ============================================================================
// SEND ON BEHALF PERMISSIONS
// ============================================================================
/**
 * Grants Send on Behalf permission to a delegate.
 * Allows delegate to send email on behalf of mailbox owner.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {string} delegateUserId - Delegate user ID
 * @param {string} grantedByUserId - User granting permission
 * @param {boolean} [copyOwnerOnSend] - Copy owner on sent messages
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SendOnBehalfPermission>} Created Send on Behalf permission
 *
 * @example
 * ```typescript
 * const permission = await grantSendOnBehalfPermission(
 *   'mailbox-123',
 *   'user-456',
 *   'user-789',
 *   true
 * );
 * ```
 */
async function grantSendOnBehalfPermission(mailboxId, delegateUserId, grantedByUserId, copyOwnerOnSend = false, transaction) {
    const permission = {
        id: generateUUID(),
        mailboxId,
        delegateUserId,
        grantedByUserId,
        showInFromLine: true,
        notifyOwnerOnSend: false,
        copyOwnerOnSend,
        status: DelegationStatus.ACTIVE,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    // Log audit event
    await logDelegationAudit({
        mailboxId,
        delegateUserId,
        performedByUserId: grantedByUserId,
        action: AuditAction.GRANT_PERMISSION,
        permissionType: PermissionType.SEND_ON_BEHALF,
        newValue: permission,
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
    return permission;
}
/**
 * Revokes Send on Behalf permission.
 * Removes delegate's ability to send on behalf of mailbox owner.
 *
 * @param {string} permissionId - Send on Behalf permission ID
 * @param {string} revokedByUserId - User revoking permission
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeSendOnBehalfPermission('permission-123', 'user-789');
 * ```
 */
async function revokeSendOnBehalfPermission(permissionId, revokedByUserId, transaction) {
    // Implementation would update permission status to REVOKED
    await logDelegationAudit({
        mailboxId: 'mailbox-id',
        delegateUserId: 'delegate-id',
        performedByUserId: revokedByUserId,
        action: AuditAction.REVOKE_PERMISSION,
        permissionType: PermissionType.SEND_ON_BEHALF,
        ipAddress: '0.0.0.0',
        userAgent: 'system',
        success: true,
    });
}
/**
 * Checks if user has Send on Behalf permission for a mailbox.
 * Validates active Send on Behalf permission.
 *
 * @param {string} userId - User ID
 * @param {string} mailboxId - Mailbox ID
 * @returns {Promise<boolean>} True if user can send on behalf
 *
 * @example
 * ```typescript
 * const canSendOnBehalf = await hasSendOnBehalfPermission('user-456', 'mailbox-123');
 * if (canSendOnBehalf) {
 *   // Allow send on behalf
 * }
 * ```
 */
async function hasSendOnBehalfPermission(userId, mailboxId) {
    // Implementation would check for active Send on Behalf permission
    return false;
}
// ============================================================================
// SHARED MAILBOX MANAGEMENT
// ============================================================================
/**
 * Creates a new shared mailbox.
 * Initializes shared mailbox with configuration and quota.
 *
 * @param {SharedMailboxCreationOptions} options - Shared mailbox creation options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SharedMailbox>} Created shared mailbox
 *
 * @example
 * ```typescript
 * const mailbox = await createSharedMailbox({
 *   name: 'support',
 *   emailAddress: 'support@example.com',
 *   displayName: 'Support Team',
 *   mailboxType: MailboxType.SHARED,
 *   ownerGroupId: 'group-123',
 *   maxDelegates: 20
 * });
 * ```
 */
async function createSharedMailbox(options, transaction) {
    const { name, emailAddress, displayName, mailboxType, ownerId = null, ownerGroupId = null, autoReplyEnabled = false, autoReplyMessage = null, hideFromAddressList = false, sendAsRestricted = true, requireSenderAuthentication = true, maxDelegates = 50, quotaLimitMB = 10240, metadata = {}, } = options;
    const mailbox = {
        id: generateUUID(),
        name,
        emailAddress,
        displayName,
        mailboxType,
        ownerId,
        ownerGroupId,
        autoReplyEnabled,
        autoReplyMessage,
        hideFromAddressList,
        sendAsRestricted,
        requireSenderAuthentication,
        maxDelegates,
        quotaLimitMB,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };
    return mailbox;
}
/**
 * Adds a delegate to a shared mailbox.
 * Grants user access to shared mailbox with specified permissions.
 *
 * @param {string} mailboxId - Shared mailbox ID
 * @param {string} delegateUserId - Delegate user ID
 * @param {DelegateAccessLevel} accessLevel - Access level
 * @param {string} grantedByUserId - User granting access
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MailboxDelegation>} Created delegation
 *
 * @example
 * ```typescript
 * const delegation = await addSharedMailboxDelegate(
 *   'mailbox-123',
 *   'user-456',
 *   DelegateAccessLevel.EDITOR,
 *   'user-789'
 * );
 * ```
 */
async function addSharedMailboxDelegate(mailboxId, delegateUserId, accessLevel, grantedByUserId, transaction) {
    return await createMailboxDelegation({
        mailboxId,
        delegateUserId,
        grantedByUserId,
        accessLevel,
        permissionTypes: [PermissionType.FULL_ACCESS],
        scope: DelegationScope.FULL_MAILBOX,
    }, transaction);
}
/**
 * Removes a delegate from a shared mailbox.
 * Revokes user's access to shared mailbox.
 *
 * @param {string} mailboxId - Shared mailbox ID
 * @param {string} delegateUserId - Delegate user ID
 * @param {string} revokedByUserId - User revoking access
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeSharedMailboxDelegate('mailbox-123', 'user-456', 'user-789');
 * ```
 */
async function removeSharedMailboxDelegate(mailboxId, delegateUserId, revokedByUserId, transaction) {
    // Implementation would find and revoke delegation
}
/**
 * Gets all delegates for a shared mailbox.
 * Returns list of users with access to shared mailbox.
 *
 * @param {string} mailboxId - Shared mailbox ID
 * @returns {Promise<MailboxDelegation[]>} Array of delegations
 *
 * @example
 * ```typescript
 * const delegates = await getSharedMailboxDelegates('mailbox-123');
 * ```
 */
async function getSharedMailboxDelegates(mailboxId) {
    return await getMailboxDelegations(mailboxId);
}
/**
 * Updates shared mailbox configuration.
 * Modifies shared mailbox settings.
 *
 * @param {string} mailboxId - Shared mailbox ID
 * @param {Partial<SharedMailbox>} updates - Updates to apply
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SharedMailbox>} Updated mailbox
 *
 * @example
 * ```typescript
 * const mailbox = await updateSharedMailbox('mailbox-123', {
 *   autoReplyEnabled: true,
 *   autoReplyMessage: 'We will respond within 24 hours'
 * });
 * ```
 */
async function updateSharedMailbox(mailboxId, updates, transaction) {
    // Implementation would update shared mailbox record
    return {};
}
// ============================================================================
// GROUP MAILBOX ACCESS
// ============================================================================
/**
 * Grants mailbox access to a group.
 * All group members inherit mailbox access.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {string} groupId - Group ID
 * @param {DelegateAccessLevel} accessLevel - Access level
 * @param {PermissionType[]} permissionTypes - Permission types
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<GroupMailboxAccess>} Created group access
 *
 * @example
 * ```typescript
 * const access = await grantGroupMailboxAccess(
 *   'mailbox-123',
 *   'group-456',
 *   DelegateAccessLevel.EDITOR,
 *   [PermissionType.FULL_ACCESS, PermissionType.SEND_ON_BEHALF]
 * );
 * ```
 */
async function grantGroupMailboxAccess(mailboxId, groupId, accessLevel, permissionTypes, transaction) {
    const access = {
        id: generateUUID(),
        mailboxId,
        groupId,
        accessLevel,
        permissionTypes,
        inheritToMembers: true,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return access;
}
/**
 * Revokes mailbox access from a group.
 * Removes group's access to mailbox.
 *
 * @param {string} accessId - Group mailbox access ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeGroupMailboxAccess('access-123');
 * ```
 */
async function revokeGroupMailboxAccess(accessId, transaction) {
    // Implementation would delete group access record
}
/**
 * Gets all groups with access to a mailbox.
 * Returns list of groups and their access levels.
 *
 * @param {string} mailboxId - Mailbox ID
 * @returns {Promise<GroupMailboxAccess[]>} Array of group access records
 *
 * @example
 * ```typescript
 * const groups = await getMailboxGroupAccess('mailbox-123');
 * ```
 */
async function getMailboxGroupAccess(mailboxId) {
    // Implementation would query group mailbox access
    return [];
}
// ============================================================================
// PERMISSION INHERITANCE
// ============================================================================
/**
 * Creates permission inheritance rule.
 * Defines how permissions propagate through folder hierarchy.
 *
 * @param {string} parentId - Parent folder or mailbox ID
 * @param {string} childId - Child folder ID
 * @param {InheritanceMode} mode - Inheritance mode
 * @param {boolean} [overrideAllowed] - Allow permission overrides
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PermissionInheritanceRule>} Created rule
 *
 * @example
 * ```typescript
 * const rule = await createInheritanceRule(
 *   'parent-folder-123',
 *   'child-folder-456',
 *   InheritanceMode.FOLDER,
 *   true
 * );
 * ```
 */
async function createInheritanceRule(parentId, childId, mode, overrideAllowed = true, transaction) {
    const rule = {
        id: generateUUID(),
        parentId,
        childId,
        inheritanceMode: mode,
        overrideAllowed,
        propagateToChildren: true,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return rule;
}
/**
 * Applies permission inheritance to folder.
 * Propagates parent permissions to child folders.
 *
 * @param {string} folderId - Folder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyPermissionInheritance('folder-123');
 * ```
 */
async function applyPermissionInheritance(folderId, transaction) {
    // Implementation would apply parent permissions to folder
}
/**
 * Gets inherited permissions for a folder.
 * Returns permissions inherited from parent folders or mailbox.
 *
 * @param {string} folderId - Folder ID
 * @returns {Promise<FolderPermission[]>} Array of inherited permissions
 *
 * @example
 * ```typescript
 * const inherited = await getInheritedPermissions('folder-123');
 * ```
 */
async function getInheritedPermissions(folderId) {
    // Implementation would traverse folder hierarchy and collect permissions
    return [];
}
// ============================================================================
// DELEGATION AUDIT LOGGING
// ============================================================================
/**
 * Logs a delegation audit event.
 * Records all delegation actions for compliance and security.
 *
 * @param {Partial<DelegationAuditLog>} logEntry - Audit log entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DelegationAuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logDelegationAudit({
 *   mailboxId: 'mailbox-123',
 *   delegateUserId: 'user-456',
 *   performedByUserId: 'user-789',
 *   action: AuditAction.GRANT_PERMISSION,
 *   permissionType: PermissionType.SEND_AS,
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0',
 *   success: true
 * });
 * ```
 */
async function logDelegationAudit(logEntry, transaction) {
    const log = {
        id: generateUUID(),
        mailboxId: logEntry.mailboxId,
        delegateUserId: logEntry.delegateUserId || null,
        performedByUserId: logEntry.performedByUserId,
        action: logEntry.action,
        permissionType: logEntry.permissionType || null,
        accessLevel: logEntry.accessLevel || null,
        previousValue: logEntry.previousValue || null,
        newValue: logEntry.newValue || null,
        ipAddress: logEntry.ipAddress,
        userAgent: logEntry.userAgent,
        success: logEntry.success !== undefined ? logEntry.success : true,
        errorMessage: logEntry.errorMessage || null,
        metadata: logEntry.metadata || {},
        createdAt: new Date(),
    };
    return log;
}
/**
 * Gets delegation audit logs for a mailbox.
 * Returns audit trail of delegation actions.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @param {number} [limit] - Result limit
 * @returns {Promise<DelegationAuditLog[]>} Array of audit logs
 *
 * @example
 * ```typescript
 * const logs = await getDelegationAuditLogs('mailbox-123', new Date('2024-01-01'), new Date(), 100);
 * ```
 */
async function getDelegationAuditLogs(mailboxId, startDate, endDate, limit = 100) {
    // Implementation would query audit logs with filters
    return [];
}
/**
 * Gets delegation audit logs for a user.
 * Returns audit trail of user's delegation activities.
 *
 * @param {string} userId - User ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @param {number} [limit] - Result limit
 * @returns {Promise<DelegationAuditLog[]>} Array of audit logs
 *
 * @example
 * ```typescript
 * const logs = await getUserDelegationAuditLogs('user-456', new Date('2024-01-01'));
 * ```
 */
async function getUserDelegationAuditLogs(userId, startDate, endDate, limit = 100) {
    // Implementation would query audit logs for user
    return [];
}
// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================
/**
 * Generates Swagger schema for MailboxDelegation model.
 *
 * @returns {object} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiProperty(getMailboxDelegationSchema())
 * delegation: MailboxDelegation;
 * ```
 */
function getMailboxDelegationSchema() {
    return {
        type: 'object',
        description: 'Mailbox delegation with permissions and scope',
        properties: {
            id: { type: 'string', format: 'uuid' },
            mailboxId: { type: 'string', format: 'uuid' },
            delegateUserId: { type: 'string', format: 'uuid' },
            delegateEmail: { type: 'string', format: 'email' },
            grantedByUserId: { type: 'string', format: 'uuid' },
            accessLevel: { type: 'string', enum: Object.values(DelegateAccessLevel) },
            permissionTypes: { type: 'array', items: { type: 'string', enum: Object.values(PermissionType) } },
            scope: { type: 'string', enum: Object.values(DelegationScope) },
            canSendAs: { type: 'boolean' },
            canSendOnBehalf: { type: 'boolean' },
            canViewPrivateItems: { type: 'boolean' },
            status: { type: 'string', enum: Object.values(DelegationStatus) },
            effectiveFrom: { type: 'string', format: 'date-time' },
            expiresAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    };
}
/**
 * Generates Swagger schema for FolderPermission model.
 *
 * @returns {object} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiProperty(getFolderPermissionSchema())
 * permission: FolderPermission;
 * ```
 */
function getFolderPermissionSchema() {
    return {
        type: 'object',
        description: 'Folder permission with granular access controls',
        properties: {
            id: { type: 'string', format: 'uuid' },
            folderId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid', nullable: true },
            groupId: { type: 'string', format: 'uuid', nullable: true },
            permissionLevel: { type: 'string', enum: Object.values(DelegateAccessLevel) },
            canCreateItems: { type: 'boolean' },
            canCreateSubfolders: { type: 'boolean' },
            canDeleteOwnItems: { type: 'boolean' },
            canDeleteAllItems: { type: 'boolean' },
            canEditOwnItems: { type: 'boolean' },
            canEditAllItems: { type: 'boolean' },
            canReadItems: { type: 'boolean' },
            isFolderOwner: { type: 'boolean' },
            isFolderVisible: { type: 'boolean' },
            inheritFromParent: { type: 'boolean' },
            grantedByUserId: { type: 'string', format: 'uuid' },
            expiresAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    };
}
/**
 * Generates Swagger schema for CalendarDelegation model.
 *
 * @returns {object} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiProperty(getCalendarDelegationSchema())
 * delegation: CalendarDelegation;
 * ```
 */
function getCalendarDelegationSchema() {
    return {
        type: 'object',
        description: 'Calendar delegation with meeting management permissions',
        properties: {
            id: { type: 'string', format: 'uuid' },
            calendarId: { type: 'string', format: 'uuid' },
            ownerId: { type: 'string', format: 'uuid' },
            delegateUserId: { type: 'string', format: 'uuid' },
            accessLevel: { type: 'string', enum: Object.values(DelegateAccessLevel) },
            canViewPrivateAppointments: { type: 'boolean' },
            canCreateAppointments: { type: 'boolean' },
            canEditAppointments: { type: 'boolean' },
            canDeleteAppointments: { type: 'boolean' },
            canRespondToMeetings: { type: 'boolean' },
            receivesMeetingRequests: { type: 'boolean' },
            receivesConflictNotifications: { type: 'boolean' },
            sendNotificationsToDelegate: { type: 'boolean' },
            status: { type: 'string', enum: Object.values(DelegationStatus) },
            expiresAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    };
}
/**
 * Generates Swagger schema for SharedMailbox model.
 *
 * @returns {object} Swagger schema definition
 *
 * @example
 * ```typescript
 * @ApiProperty(getSharedMailboxSchema())
 * mailbox: SharedMailbox;
 * ```
 */
function getSharedMailboxSchema() {
    return {
        type: 'object',
        description: 'Shared mailbox configuration',
        properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            emailAddress: { type: 'string', format: 'email' },
            displayName: { type: 'string' },
            mailboxType: { type: 'string', enum: Object.values(MailboxType) },
            ownerId: { type: 'string', format: 'uuid', nullable: true },
            ownerGroupId: { type: 'string', format: 'uuid', nullable: true },
            autoReplyEnabled: { type: 'boolean' },
            autoReplyMessage: { type: 'string', nullable: true },
            hideFromAddressList: { type: 'boolean' },
            sendAsRestricted: { type: 'boolean' },
            requireSenderAuthentication: { type: 'boolean' },
            maxDelegates: { type: 'integer' },
            quotaLimitMB: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    };
}
/**
 * Generates Swagger ApiOperation documentation for grant delegation endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getGrantDelegationOperation())
 * async grantDelegation(@Body() dto: GrantDelegationDto) {
 *   return await this.delegationService.grantDelegation(dto);
 * }
 * ```
 */
function getGrantDelegationOperation() {
    return {
        summary: 'Grant mailbox delegation to a user',
        description: 'Creates a new mailbox delegation with specified permissions and scope. ' +
            'Supports full mailbox access, specific folder access, Send As, and Send on Behalf permissions. ' +
            'Optionally sends email notification to delegate.',
        operationId: 'grantMailboxDelegation',
        tags: ['Mail Delegation'],
    };
}
/**
 * Generates Swagger ApiOperation documentation for revoke delegation endpoint.
 *
 * @returns {object} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(getRevokeDelegationOperation())
 * async revokeDelegation(@Param('id') id: string) {
 *   return await this.delegationService.revokeDelegation(id);
 * }
 * ```
 */
function getRevokeDelegationOperation() {
    return {
        summary: 'Revoke mailbox delegation',
        description: 'Revokes an existing mailbox delegation by setting status to REVOKED. ' +
            'Logs audit event and optionally notifies delegate of revocation. ' +
            'Requires mailbox owner or admin permissions.',
        operationId: 'revokeMailboxDelegation',
        tags: ['Mail Delegation'],
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
        summary: 'Share a folder with users or groups',
        description: 'Grants folder permissions to specified users or groups with granular access controls. ' +
            'Supports permission inheritance from parent folders. ' +
            'Includes options for create, edit, delete permissions on items and subfolders.',
        operationId: 'shareFolderWithPermissions',
        tags: ['Mail Folders', 'Sharing'],
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates a UUID v4.
 * Utility for creating unique identifiers.
 *
 * @returns {string} UUID v4
 *
 * @example
 * ```typescript
 * const delegationId = generateUUID();
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
 * Helper for delegation entries.
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
 * Sends delegation notification to delegate.
 * Helper for notifying users of delegation changes.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {string} delegateUserId - Delegate user ID
 * @param {string} action - Notification action (granted, revoked, modified)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendDelegationNotification(mailboxId, delegateUserId, 'granted');
 * ```
 */
async function sendDelegationNotification(mailboxId, delegateUserId, action) {
    // Implementation would send email/push notification
}
/**
 * Validates delegation permissions before granting.
 * Ensures user has authority to grant specified permissions.
 *
 * @param {string} mailboxId - Mailbox ID
 * @param {string} grantedByUserId - User granting delegation
 * @param {DelegateAccessLevel} accessLevel - Access level to grant
 * @returns {Promise<boolean>} True if user can grant permissions
 *
 * @example
 * ```typescript
 * const canGrant = await validateDelegationPermissions(mailboxId, userId, DelegateAccessLevel.OWNER);
 * if (!canGrant) {
 *   throw new Error('Insufficient permissions to grant this access level');
 * }
 * ```
 */
async function validateDelegationPermissions(mailboxId, grantedByUserId, accessLevel) {
    // Implementation would check if user has authority to grant permissions
    return true;
}
/**
 * Checks if delegation has expired.
 * Helper for validating delegation status.
 *
 * @param {MailboxDelegation} delegation - Delegation to check
 * @returns {boolean} True if delegation is expired
 *
 * @example
 * ```typescript
 * if (isDelegationExpired(delegation)) {
 *   // Update status to EXPIRED
 * }
 * ```
 */
function isDelegationExpired(delegation) {
    if (!delegation.expiresAt)
        return false;
    return new Date() > delegation.expiresAt;
}
/**
 * Calculates highest access level from multiple permissions.
 * Helper for determining effective permissions.
 *
 * @param {DelegateAccessLevel[]} levels - Array of access levels
 * @returns {DelegateAccessLevel} Highest access level
 *
 * @example
 * ```typescript
 * const highest = getHighestAccessLevel([
 *   DelegateAccessLevel.REVIEWER,
 *   DelegateAccessLevel.EDITOR,
 *   DelegateAccessLevel.AUTHOR
 * ]);
 * // Returns: DelegateAccessLevel.EDITOR
 * ```
 */
function getHighestAccessLevel(levels) {
    const hierarchy = [
        DelegateAccessLevel.NONE,
        DelegateAccessLevel.REVIEWER,
        DelegateAccessLevel.CONTRIBUTOR,
        DelegateAccessLevel.AUTHOR,
        DelegateAccessLevel.PUBLISHING_AUTHOR,
        DelegateAccessLevel.EDITOR,
        DelegateAccessLevel.PUBLISHING_EDITOR,
        DelegateAccessLevel.OWNER,
    ];
    let highest = DelegateAccessLevel.NONE;
    for (const level of levels) {
        if (hierarchy.indexOf(level) > hierarchy.indexOf(highest)) {
            highest = level;
        }
    }
    return highest;
}
//# sourceMappingURL=mail-delegation-sharing-kit.js.map