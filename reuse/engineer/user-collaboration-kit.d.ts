/**
 * User Collaboration Kit
 *
 * Enterprise-grade user collaboration system with real-time features, activity tracking,
 * comments, mentions, task assignment, and comprehensive Sequelize query optimization.
 *
 * Features:
 * - Real-time collaborative editing with conflict resolution
 * - User presence tracking and awareness
 * - Activity feeds and timelines with efficient pagination
 * - Comments and mentions system with notifications
 * - Task assignment and delegation workflows
 * - Team workspace management
 * - Collaborative document editing with version control
 * - Change notifications and real-time updates
 * - User @mentions and tagging
 * - Activity history and audit trails
 * - Collaboration permissions and access control
 * - Advanced Sequelize query optimization
 * - N+1 query prevention strategies
 * - Complex join optimization
 * - Collaboration analytics and KPIs
 * - WebSocket integration for real-time features
 *
 * @module UserCollaborationKit
 * @version 1.0.0
 */
import { Transaction } from 'sequelize';
import { Server as SocketIOServer } from 'socket.io';
import { Redis } from 'ioredis';
/**
 * Collaboration workspace interface
 */
export interface CollaborationWorkspace {
    id: string;
    name: string;
    description?: string;
    type: 'project' | 'document' | 'board' | 'meeting' | 'task_list';
    ownerId: string;
    teamId?: string;
    settings: Record<string, any>;
    permissions: WorkspacePermissions;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Workspace permissions configuration
 */
export interface WorkspacePermissions {
    visibility: 'public' | 'private' | 'team' | 'restricted';
    allowComments: boolean;
    allowEditing: boolean;
    allowTaskCreation: boolean;
    requireApproval: boolean;
    allowedRoles: string[];
    allowedUsers: string[];
}
/**
 * User presence data
 */
export interface UserPresence {
    userId: string;
    workspaceId: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastActivity: Date;
    currentLocation?: string;
    deviceInfo?: Record<string, any>;
    cursorPosition?: {
        x: number;
        y: number;
    };
    selectedElement?: string;
}
/**
 * Activity feed item
 */
export interface ActivityItem {
    id: string;
    workspaceId: string;
    userId: string;
    actionType: string;
    entityType: string;
    entityId: string;
    metadata: Record<string, any>;
    mentions?: string[];
    visibility: 'public' | 'private' | 'team';
    createdAt: Date;
}
/**
 * Comment with mentions
 */
export interface Comment {
    id: string;
    workspaceId: string;
    entityType: string;
    entityId: string;
    userId: string;
    content: string;
    mentions: string[];
    parentId?: string;
    isResolved: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Task assignment
 */
export interface TaskAssignment {
    id: string;
    taskId: string;
    assignedTo: string;
    assignedBy: string;
    workspaceId: string;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    completedAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Collaborative document edit
 */
export interface DocumentEdit {
    id: string;
    documentId: string;
    userId: string;
    operation: 'insert' | 'delete' | 'update' | 'format';
    position: number;
    content?: string;
    length?: number;
    attributes?: Record<string, any>;
    version: number;
    timestamp: Date;
}
/**
 * Change notification
 */
export interface ChangeNotification {
    id: string;
    userId: string;
    workspaceId: string;
    sourceUserId: string;
    notificationType: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata: Record<string, any>;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}
/**
 * Collaboration metrics
 */
export interface CollaborationMetrics {
    workspaceId: string;
    period: string;
    activeUsers: number;
    totalActivities: number;
    totalComments: number;
    totalTasks: number;
    completedTasks: number;
    averageResponseTime: number;
    collaborationScore: number;
    engagementRate: number;
}
/**
 * Query options for collaboration features
 */
export interface CollaborationQueryOptions {
    workspaceId?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
    includeArchived?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Real-time event data
 */
export interface RealtimeEvent {
    eventType: string;
    workspaceId: string;
    userId: string;
    data: Record<string, any>;
    timestamp: Date;
}
/**
 * Conflict resolution data
 */
export interface ConflictResolution {
    documentId: string;
    conflictType: 'concurrent_edit' | 'version_mismatch' | 'permission_conflict';
    userId1: string;
    userId2: string;
    edit1: DocumentEdit;
    edit2: DocumentEdit;
    resolution: 'accept_first' | 'accept_second' | 'merge' | 'manual';
    resolvedBy?: string;
    resolvedAt?: Date;
}
/**
 * Create a new collaboration workspace with optimized settings
 *
 * @param workspaceData - Workspace configuration
 * @param transaction - Optional database transaction
 * @returns Created workspace
 *
 * @example
 * ```typescript
 * const workspace = await createCollaborationWorkspace({
 *   name: 'Product Roadmap 2024',
 *   type: 'project',
 *   ownerId: 'user-123',
 *   teamId: 'team-456',
 *   permissions: {
 *     visibility: 'team',
 *     allowComments: true,
 *     allowEditing: true,
 *     allowTaskCreation: true,
 *     requireApproval: false,
 *     allowedRoles: ['admin', 'member'],
 *     allowedUsers: []
 *   }
 * });
 * ```
 */
export declare function createCollaborationWorkspace(workspaceData: Partial<CollaborationWorkspace>, transaction?: Transaction): Promise<CollaborationWorkspace>;
/**
 * Get workspace with members, activities, and optimized eager loading
 *
 * @param workspaceId - Workspace identifier
 * @param options - Query options
 * @returns Workspace with related data
 *
 * @example
 * ```typescript
 * const workspace = await getWorkspaceWithDetails('ws-123', {
 *   includeMembers: true,
 *   includeRecentActivity: true,
 *   activityLimit: 50
 * });
 * ```
 */
export declare function getWorkspaceWithDetails(workspaceId: string, options?: {
    includeMembers?: boolean;
    includeRecentActivity?: boolean;
    activityLimit?: number;
}): Promise<any>;
/**
 * Add user to workspace with role and permissions
 *
 * @param workspaceId - Workspace identifier
 * @param userId - User identifier
 * @param role - User role in workspace
 * @param permissions - Custom permissions
 * @param transaction - Optional database transaction
 * @returns Workspace membership
 */
export declare function addUserToWorkspace(workspaceId: string, userId: string, role?: 'owner' | 'admin' | 'member' | 'viewer', permissions?: Record<string, boolean>, transaction?: Transaction): Promise<any>;
/**
 * Update workspace permissions and settings
 *
 * @param workspaceId - Workspace identifier
 * @param updates - Permission and setting updates
 * @param transaction - Optional database transaction
 * @returns Updated workspace
 */
export declare function updateWorkspacePermissions(workspaceId: string, updates: {
    permissions?: Partial<WorkspacePermissions>;
    settings?: Record<string, any>;
}, transaction?: Transaction): Promise<CollaborationWorkspace>;
/**
 * Get user's workspaces with activity statistics
 *
 * @param userId - User identifier
 * @param options - Query options
 * @returns List of workspaces with stats
 *
 * @example
 * ```typescript
 * const workspaces = await getUserWorkspaces('user-123', {
 *   includeArchived: false,
 *   sortBy: 'lastActivity',
 *   limit: 20
 * });
 * ```
 */
export declare function getUserWorkspaces(userId: string, options?: CollaborationQueryOptions): Promise<any[]>;
/**
 * Update user presence in workspace with Redis caching
 *
 * @param presenceData - User presence information
 * @param redis - Redis client for real-time presence
 * @returns Updated presence
 *
 * @example
 * ```typescript
 * await updateUserPresence({
 *   userId: 'user-123',
 *   workspaceId: 'ws-456',
 *   status: 'online',
 *   currentLocation: '/document/doc-789',
 *   cursorPosition: { x: 100, y: 200 }
 * }, redisClient);
 * ```
 */
export declare function updateUserPresence(presenceData: UserPresence, redis: Redis): Promise<UserPresence>;
/**
 * Get all active users in workspace from Redis
 *
 * @param workspaceId - Workspace identifier
 * @param redis - Redis client
 * @returns List of active users with presence data
 */
export declare function getWorkspaceActiveUsers(workspaceId: string, redis: Redis): Promise<UserPresence[]>;
/**
 * Remove user presence when disconnecting
 *
 * @param workspaceId - Workspace identifier
 * @param userId - User identifier
 * @param redis - Redis client
 */
export declare function removeUserPresence(workspaceId: string, userId: string, redis: Redis): Promise<void>;
/**
 * Get user's presence across all workspaces
 *
 * @param userId - User identifier
 * @param redis - Redis client
 * @returns Map of workspace IDs to presence data
 */
export declare function getUserPresenceAcrossWorkspaces(userId: string, redis: Redis): Promise<Map<string, UserPresence>>;
/**
 * Create activity item with mentions and notifications
 *
 * @param activityData - Activity information
 * @param transaction - Optional database transaction
 * @returns Created activity
 */
export declare function createActivityItem(activityData: Partial<ActivityItem>, transaction?: Transaction): Promise<ActivityItem>;
/**
 * Get activity feed with cursor-based pagination and optimized queries
 *
 * @param workspaceId - Workspace identifier
 * @param options - Pagination and filter options
 * @returns Activity feed with pagination metadata
 *
 * @example
 * ```typescript
 * const feed = await getActivityFeed('ws-123', {
 *   cursor: lastActivityId,
 *   limit: 20,
 *   actionTypes: ['comment_created', 'task_assigned']
 * });
 * ```
 */
export declare function getActivityFeed(workspaceId: string, options?: {
    cursor?: string;
    limit?: number;
    actionTypes?: string[];
    entityTypes?: string[];
    userId?: string;
}): Promise<{
    activities: any[];
    hasMore: boolean;
    nextCursor?: string;
}>;
/**
 * Get aggregated activity timeline with grouping
 *
 * @param workspaceId - Workspace identifier
 * @param options - Timeline options
 * @returns Grouped activity timeline
 *
 * @example
 * ```typescript
 * const timeline = await getActivityTimeline('ws-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   groupBy: 'day'
 * });
 * ```
 */
export declare function getActivityTimeline(workspaceId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
}): Promise<any[]>;
/**
 * Get user's personalized activity feed with relevance scoring
 *
 * @param userId - User identifier
 * @param workspaceId - Workspace identifier
 * @param options - Feed options
 * @returns Personalized activity feed
 */
export declare function getPersonalizedActivityFeed(userId: string, workspaceId: string, options?: {
    limit?: number;
    offset?: number;
}): Promise<any[]>;
/**
 * Create comment with @mentions extraction and notifications
 *
 * @param commentData - Comment data
 * @param transaction - Optional database transaction
 * @returns Created comment
 *
 * @example
 * ```typescript
 * const comment = await createComment({
 *   workspaceId: 'ws-123',
 *   entityType: 'task',
 *   entityId: 'task-456',
 *   userId: 'user-789',
 *   content: 'Great work @john! Can you review @mary?'
 * });
 * ```
 */
export declare function createComment(commentData: Partial<Comment>, transaction?: Transaction): Promise<Comment>;
/**
 * Get comments for entity with threaded replies
 *
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @param options - Query options
 * @returns Threaded comments
 */
export declare function getCommentsForEntity(entityType: string, entityId: string, options?: {
    includeResolved?: boolean;
    limit?: number;
    offset?: number;
}): Promise<any[]>;
/**
 * Reply to comment with threading
 *
 * @param parentCommentId - Parent comment ID
 * @param replyData - Reply data
 * @param transaction - Optional database transaction
 * @returns Created reply
 */
export declare function replyToComment(parentCommentId: string, replyData: Partial<Comment>, transaction?: Transaction): Promise<Comment>;
/**
 * Resolve/unresolve comment thread
 *
 * @param commentId - Comment identifier
 * @param isResolved - Resolution status
 * @param userId - User resolving the comment
 * @param transaction - Optional database transaction
 * @returns Updated comment
 */
export declare function resolveComment(commentId: string, isResolved: boolean, userId: string, transaction?: Transaction): Promise<Comment>;
/**
 * Get user mentions across workspace
 *
 * @param userId - User identifier
 * @param workspaceId - Workspace identifier
 * @param options - Query options
 * @returns Comments where user was mentioned
 */
export declare function getUserMentions(userId: string, workspaceId: string, options?: {
    includeRead?: boolean;
    limit?: number;
}): Promise<any[]>;
/**
 * Create task assignment with notification
 *
 * @param assignmentData - Task assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await createTaskAssignment({
 *   taskId: 'task-123',
 *   assignedTo: 'user-456',
 *   assignedBy: 'user-789',
 *   workspaceId: 'ws-abc',
 *   priority: 'high',
 *   dueDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare function createTaskAssignment(assignmentData: Partial<TaskAssignment>, transaction?: Transaction): Promise<TaskAssignment>;
/**
 * Update task assignment status
 *
 * @param assignmentId - Assignment identifier
 * @param status - New status
 * @param userId - User updating the status
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 */
export declare function updateTaskAssignmentStatus(assignmentId: string, status: TaskAssignment['status'], userId: string, transaction?: Transaction): Promise<TaskAssignment>;
/**
 * Get user's assigned tasks with filtering
 *
 * @param userId - User identifier
 * @param options - Filter options
 * @returns List of task assignments
 */
export declare function getUserAssignedTasks(userId: string, options?: {
    workspaceId?: string;
    status?: TaskAssignment['status'][];
    priority?: TaskAssignment['priority'][];
    overdue?: boolean;
    limit?: number;
    offset?: number;
}): Promise<any[]>;
/**
 * Delegate task to another user
 *
 * @param assignmentId - Current assignment identifier
 * @param newAssignee - New user to assign to
 * @param delegatedBy - User performing delegation
 * @param transaction - Optional database transaction
 * @returns New assignment
 */
export declare function delegateTask(assignmentId: string, newAssignee: string, delegatedBy: string, transaction?: Transaction): Promise<TaskAssignment>;
/**
 * Get task assignment statistics for workspace
 *
 * @param workspaceId - Workspace identifier
 * @param options - Query options
 * @returns Assignment statistics
 */
export declare function getTaskAssignmentStats(workspaceId: string, options?: {
    startDate?: Date;
    endDate?: Date;
}): Promise<any>;
/**
 * Apply document edit operation with operational transformation
 *
 * @param editData - Document edit operation
 * @param transaction - Optional database transaction
 * @returns Applied edit
 *
 * @example
 * ```typescript
 * const edit = await applyDocumentEdit({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   operation: 'insert',
 *   position: 100,
 *   content: 'Hello, world!',
 *   version: 5
 * });
 * ```
 */
export declare function applyDocumentEdit(editData: Partial<DocumentEdit>, transaction?: Transaction): Promise<DocumentEdit>;
/**
 * Get document edit history with pagination
 *
 * @param documentId - Document identifier
 * @param options - Query options
 * @returns Edit history
 */
export declare function getDocumentEditHistory(documentId: string, options?: {
    fromVersion?: number;
    toVersion?: number;
    userId?: string;
    limit?: number;
    offset?: number;
}): Promise<any[]>;
/**
 * Detect and resolve concurrent edit conflicts
 *
 * @param documentId - Document identifier
 * @param edit1 - First edit operation
 * @param edit2 - Second edit operation
 * @param transaction - Optional database transaction
 * @returns Conflict resolution
 */
export declare function resolveEditConflict(documentId: string, edit1: DocumentEdit, edit2: DocumentEdit, transaction?: Transaction): Promise<ConflictResolution>;
/**
 * Create document snapshot for version control
 *
 * @param documentId - Document identifier
 * @param userId - User creating snapshot
 * @param message - Snapshot description
 * @param transaction - Optional database transaction
 * @returns Created snapshot
 */
export declare function createDocumentSnapshot(documentId: string, userId: string, message?: string, transaction?: Transaction): Promise<any>;
/**
 * Restore document from snapshot
 *
 * @param snapshotId - Snapshot identifier
 * @param userId - User performing restore
 * @param transaction - Optional database transaction
 * @returns Restored document
 */
export declare function restoreDocumentFromSnapshot(snapshotId: string, userId: string, transaction?: Transaction): Promise<any>;
/**
 * Create change notification for user
 *
 * @param notificationData - Notification data
 * @param transaction - Optional database transaction
 * @returns Created notification
 */
export declare function createChangeNotification(notificationData: Partial<ChangeNotification>, transaction?: Transaction): Promise<ChangeNotification>;
/**
 * Get user notifications with filtering
 *
 * @param userId - User identifier
 * @param options - Filter options
 * @returns List of notifications
 */
export declare function getUserNotifications(userId: string, options?: {
    unreadOnly?: boolean;
    notificationTypes?: string[];
    workspaceId?: string;
    limit?: number;
    offset?: number;
}): Promise<any[]>;
/**
 * Mark notifications as read
 *
 * @param notificationIds - Notification identifiers
 * @param userId - User identifier (for security)
 * @param transaction - Optional database transaction
 * @returns Number of updated notifications
 */
export declare function markNotificationsAsRead(notificationIds: string[], userId: string, transaction?: Transaction): Promise<number>;
/**
 * Get unread notification count by type
 *
 * @param userId - User identifier
 * @param workspaceId - Optional workspace filter
 * @returns Notification counts by type
 */
export declare function getUnreadNotificationCounts(userId: string, workspaceId?: string): Promise<Record<string, number>>;
/**
 * Bulk delete old notifications
 *
 * @param userId - User identifier
 * @param olderThan - Delete notifications older than this date
 * @param transaction - Optional database transaction
 * @returns Number of deleted notifications
 */
export declare function deleteOldNotifications(userId: string, olderThan: Date, transaction?: Transaction): Promise<number>;
/**
 * Initialize WebSocket server for real-time collaboration
 *
 * @param io - Socket.IO server instance
 * @param redis - Redis client for presence
 *
 * @example
 * ```typescript
 * const io = new SocketIOServer(server);
 * const redis = new Redis();
 * initializeCollaborationWebSocket(io, redis);
 * ```
 */
export declare function initializeCollaborationWebSocket(io: SocketIOServer, redis: Redis): void;
/**
 * Broadcast real-time event to workspace
 *
 * @param io - Socket.IO server instance
 * @param event - Real-time event data
 */
export declare function broadcastWorkspaceEvent(io: SocketIOServer, event: RealtimeEvent): void;
/**
 * Send notification to specific user
 *
 * @param io - Socket.IO server instance
 * @param userId - User identifier
 * @param notification - Notification data
 */
export declare function sendUserNotification(io: SocketIOServer, userId: string, notification: ChangeNotification): void;
/**
 * Calculate collaboration metrics for workspace
 *
 * @param workspaceId - Workspace identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Collaboration metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateCollaborationMetrics(
 *   'ws-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function calculateCollaborationMetrics(workspaceId: string, startDate: Date, endDate: Date): Promise<CollaborationMetrics>;
/**
 * Get user collaboration activity breakdown
 *
 * @param userId - User identifier
 * @param workspaceId - Workspace identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns User activity breakdown
 */
export declare function getUserActivityBreakdown(userId: string, workspaceId: string, startDate: Date, endDate: Date): Promise<any>;
/**
 * Get workspace engagement leaderboard
 *
 * @param workspaceId - Workspace identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param limit - Number of top users to return
 * @returns Leaderboard of most engaged users
 */
export declare function getWorkspaceEngagementLeaderboard(workspaceId: string, startDate: Date, endDate: Date, limit?: number): Promise<any[]>;
/**
 * Generate collaboration health report
 *
 * @param workspaceId - Workspace identifier
 * @param period - Report period in days
 * @returns Collaboration health report
 */
export declare function generateCollaborationHealthReport(workspaceId: string, period?: number): Promise<any>;
/**
 * Extract @mentions from text content
 *
 * @param content - Text content
 * @returns Array of mentioned user IDs
 */
declare function extractMentions(content: string): string[];
/**
 * Model registry for lazy initialization and dependency injection
 * This allows the kit to work with any Sequelize model setup
 */
interface ModelRegistry {
    Workspace?: any;
    User?: any;
    Activity?: any;
    WorkspaceMember?: any;
    Comment?: any;
    TaskAssignment?: any;
    Task?: any;
    DocumentEdit?: any;
    Document?: any;
    DocumentSnapshot?: any;
    Notification?: any;
}
/**
 * Initialize the model registry with your Sequelize models
 *
 * @param models - Object containing all required Sequelize models
 *
 * @example
 * ```typescript
 * import { initializeCollaborationModels } from './user-collaboration-kit';
 * import { Workspace, User, Activity, ... } from './models';
 *
 * initializeCollaborationModels({
 *   Workspace,
 *   User,
 *   Activity,
 *   WorkspaceMember,
 *   Comment,
 *   TaskAssignment,
 *   Task,
 *   DocumentEdit,
 *   Document,
 *   DocumentSnapshot,
 *   Notification
 * });
 * ```
 */
export declare function initializeCollaborationModels(models: ModelRegistry): void;
declare const _default: {
    initializeCollaborationModels: typeof initializeCollaborationModels;
    createCollaborationWorkspace: typeof createCollaborationWorkspace;
    getWorkspaceWithDetails: typeof getWorkspaceWithDetails;
    addUserToWorkspace: typeof addUserToWorkspace;
    updateWorkspacePermissions: typeof updateWorkspacePermissions;
    getUserWorkspaces: typeof getUserWorkspaces;
    updateUserPresence: typeof updateUserPresence;
    getWorkspaceActiveUsers: typeof getWorkspaceActiveUsers;
    removeUserPresence: typeof removeUserPresence;
    getUserPresenceAcrossWorkspaces: typeof getUserPresenceAcrossWorkspaces;
    createActivityItem: typeof createActivityItem;
    getActivityFeed: typeof getActivityFeed;
    getActivityTimeline: typeof getActivityTimeline;
    getPersonalizedActivityFeed: typeof getPersonalizedActivityFeed;
    createComment: typeof createComment;
    getCommentsForEntity: typeof getCommentsForEntity;
    replyToComment: typeof replyToComment;
    resolveComment: typeof resolveComment;
    getUserMentions: typeof getUserMentions;
    createTaskAssignment: typeof createTaskAssignment;
    updateTaskAssignmentStatus: typeof updateTaskAssignmentStatus;
    getUserAssignedTasks: typeof getUserAssignedTasks;
    delegateTask: typeof delegateTask;
    getTaskAssignmentStats: typeof getTaskAssignmentStats;
    applyDocumentEdit: typeof applyDocumentEdit;
    getDocumentEditHistory: typeof getDocumentEditHistory;
    resolveEditConflict: typeof resolveEditConflict;
    createDocumentSnapshot: typeof createDocumentSnapshot;
    restoreDocumentFromSnapshot: typeof restoreDocumentFromSnapshot;
    createChangeNotification: typeof createChangeNotification;
    getUserNotifications: typeof getUserNotifications;
    markNotificationsAsRead: typeof markNotificationsAsRead;
    getUnreadNotificationCounts: typeof getUnreadNotificationCounts;
    deleteOldNotifications: typeof deleteOldNotifications;
    initializeCollaborationWebSocket: typeof initializeCollaborationWebSocket;
    broadcastWorkspaceEvent: typeof broadcastWorkspaceEvent;
    sendUserNotification: typeof sendUserNotification;
    calculateCollaborationMetrics: typeof calculateCollaborationMetrics;
    getUserActivityBreakdown: typeof getUserActivityBreakdown;
    getWorkspaceEngagementLeaderboard: typeof getWorkspaceEngagementLeaderboard;
    generateCollaborationHealthReport: typeof generateCollaborationHealthReport;
    extractMentions: typeof extractMentions;
};
export default _default;
//# sourceMappingURL=user-collaboration-kit.d.ts.map