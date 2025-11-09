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
import { ModelAttributes, Transaction } from 'sequelize';
/**
 * Delegate access levels following Exchange Server conventions
 */
export declare enum DelegateAccessLevel {
    NONE = "none",
    REVIEWER = "reviewer",// Can read items
    CONTRIBUTOR = "contributor",// Can create items
    AUTHOR = "author",// Can create and read own items
    EDITOR = "editor",// Can create, read, and modify items
    OWNER = "owner",// Full control including permissions
    PUBLISHING_EDITOR = "publishing_editor",// Can create, read, modify, and delete all items
    PUBLISHING_AUTHOR = "publishing_author"
}
/**
 * Permission types for mailbox delegation
 */
export declare enum PermissionType {
    SEND_AS = "send_as",// Send email as the mailbox owner
    SEND_ON_BEHALF = "send_on_behalf",// Send email on behalf of the mailbox owner
    FULL_ACCESS = "full_access",// Full mailbox access
    READ_PERMISSION = "read_permission",// Read-only access
    FOLDER_VISIBLE = "folder_visible",// Can see folder in hierarchy
    FOLDER_OWNER = "folder_owner",// Full folder control
    FOLDER_EDITOR = "folder_editor",// Can edit folder contents
    FOLDER_REVIEWER = "folder_reviewer",// Can read folder contents
    CALENDAR_DELEGATE = "calendar_delegate",// Calendar delegation
    TASK_DELEGATE = "task_delegate",// Task delegation
    CONTACT_DELEGATE = "contact_delegate"
}
/**
 * Delegation scope
 */
export declare enum DelegationScope {
    FULL_MAILBOX = "full_mailbox",// Entire mailbox
    SPECIFIC_FOLDERS = "specific_folders",// Only specified folders
    CALENDAR = "calendar",// Calendar only
    CONTACTS = "contacts",// Contacts only
    TASKS = "tasks",// Tasks only
    INBOX = "inbox",// Inbox only
    CUSTOM = "custom"
}
/**
 * Mailbox type
 */
export declare enum MailboxType {
    USER = "user",// Individual user mailbox
    SHARED = "shared",// Shared mailbox
    RESOURCE = "resource",// Resource mailbox (room, equipment)
    GROUP = "group",// Group mailbox
    PUBLIC = "public",// Public folder mailbox
    DISCOVERY = "discovery",// Discovery mailbox
    ARCHIVE = "archive"
}
/**
 * Permission inheritance mode
 */
export declare enum InheritanceMode {
    NONE = "none",// No inheritance
    FOLDER = "folder",// Inherit from parent folder
    MAILBOX = "mailbox",// Inherit from mailbox
    BOTH = "both"
}
/**
 * Delegation status
 */
export declare enum DelegationStatus {
    ACTIVE = "active",
    PENDING = "pending",
    SUSPENDED = "suspended",
    REVOKED = "revoked",
    EXPIRED = "expired"
}
/**
 * Audit action types
 */
export declare enum AuditAction {
    GRANT_PERMISSION = "grant_permission",
    REVOKE_PERMISSION = "revoke_permission",
    MODIFY_PERMISSION = "modify_permission",
    ACCESS_MAILBOX = "access_mailbox",
    SEND_AS = "send_as",
    SEND_ON_BEHALF = "send_on_behalf",
    DELEGATE_ADDED = "delegate_added",
    DELEGATE_REMOVED = "delegate_removed",
    PERMISSION_INHERITED = "permission_inherited"
}
/**
 * Mailbox delegation entry
 */
export interface MailboxDelegation {
    id: string;
    mailboxId: string;
    delegateUserId: string;
    delegateEmail: string;
    grantedByUserId: string;
    accessLevel: DelegateAccessLevel;
    permissionTypes: PermissionType[];
    scope: DelegationScope;
    scopeFolderIds?: string[];
    canSendAs: boolean;
    canSendOnBehalf: boolean;
    canViewPrivateItems: boolean;
    receivesMeetingMessages: boolean;
    inheritanceMode: InheritanceMode;
    status: DelegationStatus;
    effectiveFrom: Date;
    expiresAt: Date | null;
    notifyDelegate: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Folder permission entry
 */
export interface FolderPermission {
    id: string;
    folderId: string;
    userId: string | null;
    groupId: string | null;
    permissionLevel: DelegateAccessLevel;
    canCreateItems: boolean;
    canCreateSubfolders: boolean;
    canDeleteOwnItems: boolean;
    canDeleteAllItems: boolean;
    canEditOwnItems: boolean;
    canEditAllItems: boolean;
    canReadItems: boolean;
    isFolderOwner: boolean;
    isFolderVisible: boolean;
    inheritFromParent: boolean;
    grantedByUserId: string;
    expiresAt: Date | null;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Calendar delegation entry
 */
export interface CalendarDelegation {
    id: string;
    calendarId: string;
    ownerId: string;
    delegateUserId: string;
    accessLevel: DelegateAccessLevel;
    canViewPrivateAppointments: boolean;
    canCreateAppointments: boolean;
    canEditAppointments: boolean;
    canDeleteAppointments: boolean;
    canRespondToMeetings: boolean;
    receivesMeetingRequests: boolean;
    receivesConflictNotifications: boolean;
    sendNotificationsToDelegate: boolean;
    status: DelegationStatus;
    expiresAt: Date | null;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Shared mailbox configuration
 */
export interface SharedMailbox {
    id: string;
    name: string;
    emailAddress: string;
    displayName: string;
    mailboxType: MailboxType;
    ownerId: string | null;
    ownerGroupId: string | null;
    autoReplyEnabled: boolean;
    autoReplyMessage: string | null;
    hideFromAddressList: boolean;
    sendAsRestricted: boolean;
    requireSenderAuthentication: boolean;
    maxDelegates: number;
    quotaLimitMB: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Delegation audit log entry
 */
export interface DelegationAuditLog {
    id: string;
    mailboxId: string;
    delegateUserId: string | null;
    performedByUserId: string;
    action: AuditAction;
    permissionType: PermissionType | null;
    accessLevel: DelegateAccessLevel | null;
    previousValue: any;
    newValue: any;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    errorMessage: string | null;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Send As permission entry
 */
export interface SendAsPermission {
    id: string;
    mailboxId: string;
    delegateUserId: string;
    grantedByUserId: string;
    canSendAsIndividual: boolean;
    canSendAsGroup: boolean;
    requiresApproval: boolean;
    approvalWorkflowId: string | null;
    notifyOwnerOnSend: boolean;
    status: DelegationStatus;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Send on Behalf permission entry
 */
export interface SendOnBehalfPermission {
    id: string;
    mailboxId: string;
    delegateUserId: string;
    grantedByUserId: string;
    showInFromLine: boolean;
    notifyOwnerOnSend: boolean;
    copyOwnerOnSend: boolean;
    status: DelegationStatus;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
/**
 * Group mailbox access entry
 */
export interface GroupMailboxAccess {
    id: string;
    mailboxId: string;
    groupId: string;
    accessLevel: DelegateAccessLevel;
    permissionTypes: PermissionType[];
    inheritToMembers: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Permission inheritance rule
 */
export interface PermissionInheritanceRule {
    id: string;
    parentId: string;
    childId: string;
    inheritanceMode: InheritanceMode;
    overrideAllowed: boolean;
    propagateToChildren: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Mailbox delegation creation options
 */
export interface DelegationCreationOptions {
    mailboxId: string;
    delegateUserId: string;
    grantedByUserId: string;
    accessLevel: DelegateAccessLevel;
    permissionTypes: PermissionType[];
    scope?: DelegationScope;
    scopeFolderIds?: string[];
    canSendAs?: boolean;
    canSendOnBehalf?: boolean;
    canViewPrivateItems?: boolean;
    receivesMeetingMessages?: boolean;
    inheritanceMode?: InheritanceMode;
    effectiveFrom?: Date;
    expiresAt?: Date | null;
    notifyDelegate?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Folder permission creation options
 */
export interface FolderPermissionCreationOptions {
    folderId: string;
    userId?: string;
    groupId?: string;
    permissionLevel: DelegateAccessLevel;
    grantedByUserId: string;
    canCreateItems?: boolean;
    canCreateSubfolders?: boolean;
    canDeleteOwnItems?: boolean;
    canDeleteAllItems?: boolean;
    canEditOwnItems?: boolean;
    canEditAllItems?: boolean;
    inheritFromParent?: boolean;
    expiresAt?: Date | null;
    metadata?: Record<string, any>;
}
/**
 * Calendar delegation creation options
 */
export interface CalendarDelegationCreationOptions {
    calendarId: string;
    ownerId: string;
    delegateUserId: string;
    accessLevel: DelegateAccessLevel;
    canViewPrivateAppointments?: boolean;
    canCreateAppointments?: boolean;
    canEditAppointments?: boolean;
    canDeleteAppointments?: boolean;
    canRespondToMeetings?: boolean;
    receivesMeetingRequests?: boolean;
    receivesConflictNotifications?: boolean;
    sendNotificationsToDelegate?: boolean;
    expiresAt?: Date | null;
    metadata?: Record<string, any>;
}
/**
 * Shared mailbox creation options
 */
export interface SharedMailboxCreationOptions {
    name: string;
    emailAddress: string;
    displayName: string;
    mailboxType: MailboxType;
    ownerId?: string;
    ownerGroupId?: string;
    autoReplyEnabled?: boolean;
    autoReplyMessage?: string;
    hideFromAddressList?: boolean;
    sendAsRestricted?: boolean;
    requireSenderAuthentication?: boolean;
    maxDelegates?: number;
    quotaLimitMB?: number;
    metadata?: Record<string, any>;
}
/**
 * Delegation query options
 */
export interface DelegationQueryOptions {
    mailboxId?: string;
    delegateUserId?: string;
    accessLevel?: DelegateAccessLevel;
    permissionType?: PermissionType;
    status?: DelegationStatus;
    scope?: DelegationScope;
    includeExpired?: boolean;
    limit?: number;
    offset?: number;
}
/**
 * Effective permissions result
 */
export interface EffectivePermissions {
    userId: string;
    mailboxId: string;
    folderId?: string;
    accessLevel: DelegateAccessLevel;
    permissionTypes: PermissionType[];
    canSendAs: boolean;
    canSendOnBehalf: boolean;
    canViewPrivateItems: boolean;
    canCreateItems: boolean;
    canDeleteItems: boolean;
    canEditItems: boolean;
    inheritedFrom: string | null;
    directPermissions: MailboxDelegation[];
    inheritedPermissions: MailboxDelegation[];
}
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
export declare function getMailboxDelegationAttributes(): ModelAttributes;
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
export declare function getFolderPermissionAttributes(): ModelAttributes;
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
export declare function getCalendarDelegationAttributes(): ModelAttributes;
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
export declare function getSharedMailboxAttributes(): ModelAttributes;
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
export declare function getDelegationAuditLogAttributes(): ModelAttributes;
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
export declare function getSendAsPermissionAttributes(): ModelAttributes;
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
export declare function getSendOnBehalfPermissionAttributes(): ModelAttributes;
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
export declare function createMailboxDelegation(options: DelegationCreationOptions, transaction?: Transaction): Promise<MailboxDelegation>;
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
export declare function revokeMailboxDelegation(delegationId: string, revokedByUserId: string, transaction?: Transaction): Promise<void>;
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
export declare function updateMailboxDelegation(delegationId: string, updates: Partial<MailboxDelegation>, updatedByUserId: string, transaction?: Transaction): Promise<MailboxDelegation>;
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
export declare function getMailboxDelegations(mailboxId: string, options?: DelegationQueryOptions): Promise<MailboxDelegation[]>;
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
export declare function getUserDelegatedMailboxes(delegateUserId: string, options?: DelegationQueryOptions): Promise<MailboxDelegation[]>;
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
export declare function hasMailboxDelegation(userId: string, mailboxId: string): Promise<boolean>;
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
export declare function getEffectivePermissions(userId: string, mailboxId: string, folderId?: string): Promise<EffectivePermissions>;
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
export declare function grantFolderPermission(options: FolderPermissionCreationOptions, transaction?: Transaction): Promise<FolderPermission>;
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
export declare function revokeFolderPermission(permissionId: string, revokedByUserId: string, transaction?: Transaction): Promise<void>;
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
export declare function getFolderPermissions(folderId: string): Promise<FolderPermission[]>;
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
export declare function getUserFolderPermission(folderId: string, userId: string): Promise<FolderPermission | null>;
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
export declare function shareFolderWithUsers(folderId: string, userIds: string[], permissionLevel: DelegateAccessLevel, sharedByUserId: string, transaction?: Transaction): Promise<FolderPermission[]>;
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
export declare function shareFolderWithGroup(folderId: string, groupId: string, permissionLevel: DelegateAccessLevel, sharedByUserId: string, transaction?: Transaction): Promise<FolderPermission>;
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
export declare function updateFolderPermissionLevel(permissionId: string, newLevel: DelegateAccessLevel, updatedByUserId: string, transaction?: Transaction): Promise<FolderPermission>;
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
export declare function createCalendarDelegation(options: CalendarDelegationCreationOptions, transaction?: Transaction): Promise<CalendarDelegation>;
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
export declare function revokeCalendarDelegation(delegationId: string, revokedByUserId: string, transaction?: Transaction): Promise<void>;
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
export declare function getCalendarDelegations(userId: string, asDelegate?: boolean): Promise<CalendarDelegation[]>;
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
export declare function canAccessCalendar(userId: string, calendarId: string): Promise<boolean>;
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
export declare function grantSendAsPermission(mailboxId: string, delegateUserId: string, grantedByUserId: string, requiresApproval?: boolean, transaction?: Transaction): Promise<SendAsPermission>;
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
export declare function revokeSendAsPermission(permissionId: string, revokedByUserId: string, transaction?: Transaction): Promise<void>;
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
export declare function hasSendAsPermission(userId: string, mailboxId: string): Promise<boolean>;
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
export declare function grantSendOnBehalfPermission(mailboxId: string, delegateUserId: string, grantedByUserId: string, copyOwnerOnSend?: boolean, transaction?: Transaction): Promise<SendOnBehalfPermission>;
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
export declare function revokeSendOnBehalfPermission(permissionId: string, revokedByUserId: string, transaction?: Transaction): Promise<void>;
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
export declare function hasSendOnBehalfPermission(userId: string, mailboxId: string): Promise<boolean>;
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
export declare function createSharedMailbox(options: SharedMailboxCreationOptions, transaction?: Transaction): Promise<SharedMailbox>;
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
export declare function addSharedMailboxDelegate(mailboxId: string, delegateUserId: string, accessLevel: DelegateAccessLevel, grantedByUserId: string, transaction?: Transaction): Promise<MailboxDelegation>;
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
export declare function removeSharedMailboxDelegate(mailboxId: string, delegateUserId: string, revokedByUserId: string, transaction?: Transaction): Promise<void>;
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
export declare function getSharedMailboxDelegates(mailboxId: string): Promise<MailboxDelegation[]>;
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
export declare function updateSharedMailbox(mailboxId: string, updates: Partial<SharedMailbox>, transaction?: Transaction): Promise<SharedMailbox>;
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
export declare function grantGroupMailboxAccess(mailboxId: string, groupId: string, accessLevel: DelegateAccessLevel, permissionTypes: PermissionType[], transaction?: Transaction): Promise<GroupMailboxAccess>;
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
export declare function revokeGroupMailboxAccess(accessId: string, transaction?: Transaction): Promise<void>;
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
export declare function getMailboxGroupAccess(mailboxId: string): Promise<GroupMailboxAccess[]>;
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
export declare function createInheritanceRule(parentId: string, childId: string, mode: InheritanceMode, overrideAllowed?: boolean, transaction?: Transaction): Promise<PermissionInheritanceRule>;
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
export declare function applyPermissionInheritance(folderId: string, transaction?: Transaction): Promise<void>;
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
export declare function getInheritedPermissions(folderId: string): Promise<FolderPermission[]>;
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
export declare function logDelegationAudit(logEntry: Partial<DelegationAuditLog>, transaction?: Transaction): Promise<DelegationAuditLog>;
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
export declare function getDelegationAuditLogs(mailboxId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<DelegationAuditLog[]>;
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
export declare function getUserDelegationAuditLogs(userId: string, startDate?: Date, endDate?: Date, limit?: number): Promise<DelegationAuditLog[]>;
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
export declare function getMailboxDelegationSchema(): object;
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
export declare function getFolderPermissionSchema(): object;
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
export declare function getCalendarDelegationSchema(): object;
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
export declare function getSharedMailboxSchema(): object;
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
export declare function getGrantDelegationOperation(): object;
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
export declare function getRevokeDelegationOperation(): object;
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
 * Utility for creating unique identifiers.
 *
 * @returns {string} UUID v4
 *
 * @example
 * ```typescript
 * const delegationId = generateUUID();
 * ```
 */
export declare function generateUUID(): string;
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
export declare function getUserEmail(userId: string): Promise<string>;
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
export declare function sendDelegationNotification(mailboxId: string, delegateUserId: string, action: string): Promise<void>;
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
export declare function validateDelegationPermissions(mailboxId: string, grantedByUserId: string, accessLevel: DelegateAccessLevel): Promise<boolean>;
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
export declare function isDelegationExpired(delegation: MailboxDelegation): boolean;
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
export declare function getHighestAccessLevel(levels: DelegateAccessLevel[]): DelegateAccessLevel;
//# sourceMappingURL=mail-delegation-sharing-kit.d.ts.map