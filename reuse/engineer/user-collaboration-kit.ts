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

import { Op, Transaction, Sequelize, Model, literal, fn, col, where } from 'sequelize';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Redis } from 'ioredis';

// =====================================================
// TypeScript Interfaces and Types
// =====================================================

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
  cursorPosition?: { x: number; y: number };
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

// =====================================================
// Workspace Management Functions
// =====================================================

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
export async function createCollaborationWorkspace(
  workspaceData: Partial<CollaborationWorkspace>,
  transaction?: Transaction
): Promise<CollaborationWorkspace> {
  const Workspace = getWorkspaceModel();

  const workspace = await Workspace.create(
    {
      ...workspaceData,
      isActive: true,
      settings: workspaceData.settings || {},
      permissions: workspaceData.permissions || {
        visibility: 'private',
        allowComments: true,
        allowEditing: false,
        allowTaskCreation: false,
        requireApproval: false,
        allowedRoles: [],
        allowedUsers: []
      }
    },
    { transaction }
  );

  // Create initial activity
  await createActivityItem({
    workspaceId: workspace.id,
    userId: workspaceData.ownerId!,
    actionType: 'workspace_created',
    entityType: 'workspace',
    entityId: workspace.id,
    metadata: { name: workspace.name },
    visibility: 'public'
  }, transaction);

  return workspace.toJSON();
}

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
export async function getWorkspaceWithDetails(
  workspaceId: string,
  options: {
    includeMembers?: boolean;
    includeRecentActivity?: boolean;
    activityLimit?: number;
  } = {}
): Promise<any> {
  const Workspace = getWorkspaceModel();
  const User = getUserModel();
  const Activity = getActivityModel();
  const WorkspaceMember = getWorkspaceMemberModel();

  const include: any[] = [];

  if (options.includeMembers) {
    include.push({
      model: WorkspaceMember,
      as: 'members',
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
      }],
      attributes: ['userId', 'role', 'joinedAt', 'permissions']
    });
  }

  if (options.includeRecentActivity) {
    include.push({
      model: Activity,
      as: 'activities',
      limit: options.activityLimit || 20,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'avatar']
      }]
    });
  }

  const workspace = await Workspace.findByPk(workspaceId, {
    include,
    attributes: {
      include: [
        [
          literal(`(
            SELECT COUNT(*)
            FROM workspace_members
            WHERE workspace_members.workspace_id = Workspace.id
          )`),
          'memberCount'
        ],
        [
          literal(`(
            SELECT COUNT(*)
            FROM activities
            WHERE activities.workspace_id = Workspace.id
            AND activities.created_at > NOW() - INTERVAL '7 days'
          )`),
          'recentActivityCount'
        ]
      ]
    }
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return workspace.toJSON();
}

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
export async function addUserToWorkspace(
  workspaceId: string,
  userId: string,
  role: 'owner' | 'admin' | 'member' | 'viewer' = 'member',
  permissions?: Record<string, boolean>,
  transaction?: Transaction
): Promise<any> {
  const WorkspaceMember = getWorkspaceMemberModel();

  const membership = await WorkspaceMember.create(
    {
      workspaceId,
      userId,
      role,
      permissions: permissions || {},
      joinedAt: new Date()
    },
    { transaction }
  );

  // Create activity
  await createActivityItem({
    workspaceId,
    userId,
    actionType: 'user_joined',
    entityType: 'workspace',
    entityId: workspaceId,
    metadata: { role },
    visibility: 'team'
  }, transaction);

  return membership.toJSON();
}

/**
 * Update workspace permissions and settings
 *
 * @param workspaceId - Workspace identifier
 * @param updates - Permission and setting updates
 * @param transaction - Optional database transaction
 * @returns Updated workspace
 */
export async function updateWorkspacePermissions(
  workspaceId: string,
  updates: {
    permissions?: Partial<WorkspacePermissions>;
    settings?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<CollaborationWorkspace> {
  const Workspace = getWorkspaceModel();

  const workspace = await Workspace.findByPk(workspaceId, { transaction });
  if (!workspace) {
    throw new Error('Workspace not found');
  }

  const updateData: any = {};

  if (updates.permissions) {
    updateData.permissions = {
      ...workspace.permissions,
      ...updates.permissions
    };
  }

  if (updates.settings) {
    updateData.settings = {
      ...workspace.settings,
      ...updates.settings
    };
  }

  await workspace.update(updateData, { transaction });
  return workspace.toJSON();
}

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
export async function getUserWorkspaces(
  userId: string,
  options: CollaborationQueryOptions = {}
): Promise<any[]> {
  const Workspace = getWorkspaceModel();
  const WorkspaceMember = getWorkspaceMemberModel();
  const Activity = getActivityModel();

  const workspaces = await Workspace.findAll({
    include: [{
      model: WorkspaceMember,
      as: 'members',
      where: { userId },
      required: true,
      attributes: ['role', 'joinedAt']
    }],
    where: {
      ...(options.includeArchived ? {} : { isActive: true })
    },
    attributes: {
      include: [
        [
          literal(`(
            SELECT COUNT(*)
            FROM workspace_members wm
            WHERE wm.workspace_id = Workspace.id
          )`),
          'memberCount'
        ],
        [
          literal(`(
            SELECT COUNT(*)
            FROM activities a
            WHERE a.workspace_id = Workspace.id
            AND a.created_at > NOW() - INTERVAL '24 hours'
          )`),
          'recentActivityCount'
        ],
        [
          literal(`(
            SELECT MAX(a.created_at)
            FROM activities a
            WHERE a.workspace_id = Workspace.id
          )`),
          'lastActivityAt'
        ]
      ]
    },
    order: [
      [literal('lastActivityAt'), 'DESC NULLS LAST']
    ],
    limit: options.limit || 50,
    offset: options.offset || 0
  });

  return workspaces.map(ws => ws.toJSON());
}

// =====================================================
// User Presence Tracking Functions
// =====================================================

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
export async function updateUserPresence(
  presenceData: UserPresence,
  redis: Redis
): Promise<UserPresence> {
  const key = `presence:${presenceData.workspaceId}:${presenceData.userId}`;

  const presence: UserPresence = {
    ...presenceData,
    lastActivity: new Date()
  };

  // Store in Redis with 5-minute expiration
  await redis.setex(
    key,
    300,
    JSON.stringify(presence)
  );

  // Add to workspace presence set
  await redis.zadd(
    `workspace_presence:${presenceData.workspaceId}`,
    Date.now(),
    presenceData.userId
  );

  return presence;
}

/**
 * Get all active users in workspace from Redis
 *
 * @param workspaceId - Workspace identifier
 * @param redis - Redis client
 * @returns List of active users with presence data
 */
export async function getWorkspaceActiveUsers(
  workspaceId: string,
  redis: Redis
): Promise<UserPresence[]> {
  const now = Date.now();
  const fiveMinutesAgo = now - (5 * 60 * 1000);

  // Get active user IDs from sorted set
  const activeUserIds = await redis.zrangebyscore(
    `workspace_presence:${workspaceId}`,
    fiveMinutesAgo,
    now
  );

  if (activeUserIds.length === 0) {
    return [];
  }

  // Fetch presence data for all active users
  const pipeline = redis.pipeline();
  activeUserIds.forEach(userId => {
    pipeline.get(`presence:${workspaceId}:${userId}`);
  });

  const results = await pipeline.exec();

  const presenceList: UserPresence[] = [];
  results?.forEach(([err, result]) => {
    if (!err && result) {
      try {
        presenceList.push(JSON.parse(result as string));
      } catch (e) {
        // Skip invalid JSON
      }
    }
  });

  return presenceList;
}

/**
 * Remove user presence when disconnecting
 *
 * @param workspaceId - Workspace identifier
 * @param userId - User identifier
 * @param redis - Redis client
 */
export async function removeUserPresence(
  workspaceId: string,
  userId: string,
  redis: Redis
): Promise<void> {
  await redis.del(`presence:${workspaceId}:${userId}`);
  await redis.zrem(`workspace_presence:${workspaceId}`, userId);
}

/**
 * Get user's presence across all workspaces
 *
 * @param userId - User identifier
 * @param redis - Redis client
 * @returns Map of workspace IDs to presence data
 */
export async function getUserPresenceAcrossWorkspaces(
  userId: string,
  redis: Redis
): Promise<Map<string, UserPresence>> {
  const pattern = `presence:*:${userId}`;
  const keys = await redis.keys(pattern);

  if (keys.length === 0) {
    return new Map();
  }

  const pipeline = redis.pipeline();
  keys.forEach(key => pipeline.get(key));
  const results = await pipeline.exec();

  const presenceMap = new Map<string, UserPresence>();

  results?.forEach(([err, result], index) => {
    if (!err && result) {
      try {
        const presence = JSON.parse(result as string);
        const workspaceId = keys[index].split(':')[1];
        presenceMap.set(workspaceId, presence);
      } catch (e) {
        // Skip invalid JSON
      }
    }
  });

  return presenceMap;
}

// =====================================================
// Activity Feed Functions
// =====================================================

/**
 * Create activity item with mentions and notifications
 *
 * @param activityData - Activity information
 * @param transaction - Optional database transaction
 * @returns Created activity
 */
export async function createActivityItem(
  activityData: Partial<ActivityItem>,
  transaction?: Transaction
): Promise<ActivityItem> {
  const Activity = getActivityModel();

  const activity = await Activity.create(
    {
      ...activityData,
      createdAt: new Date()
    },
    { transaction }
  );

  // Process mentions and create notifications
  if (activityData.mentions && activityData.mentions.length > 0) {
    await Promise.all(
      activityData.mentions.map(userId =>
        createChangeNotification({
          userId,
          workspaceId: activityData.workspaceId!,
          sourceUserId: activityData.userId!,
          notificationType: 'mention',
          title: 'You were mentioned',
          message: `You were mentioned in ${activityData.actionType}`,
          actionUrl: `/workspace/${activityData.workspaceId}/activity/${activity.id}`,
          metadata: { activityId: activity.id },
          isRead: false
        }, transaction)
      )
    );
  }

  return activity.toJSON();
}

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
export async function getActivityFeed(
  workspaceId: string,
  options: {
    cursor?: string;
    limit?: number;
    actionTypes?: string[];
    entityTypes?: string[];
    userId?: string;
  } = {}
): Promise<{
  activities: any[];
  hasMore: boolean;
  nextCursor?: string;
}> {
  const Activity = getActivityModel();
  const User = getUserModel();

  const limit = options.limit || 20;
  const where: any = { workspaceId };

  if (options.cursor) {
    where.id = { [Op.lt]: options.cursor };
  }

  if (options.actionTypes && options.actionTypes.length > 0) {
    where.actionType = { [Op.in]: options.actionTypes };
  }

  if (options.entityTypes && options.entityTypes.length > 0) {
    where.entityType = { [Op.in]: options.entityTypes };
  }

  if (options.userId) {
    where.userId = options.userId;
  }

  const activities = await Activity.findAll({
    where,
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
    }],
    order: [['createdAt', 'DESC']],
    limit: limit + 1 // Fetch one extra to check for more
  });

  const hasMore = activities.length > limit;
  const results = hasMore ? activities.slice(0, -1) : activities;
  const nextCursor = hasMore ? activities[limit - 1].id : undefined;

  return {
    activities: results.map(a => a.toJSON()),
    hasMore,
    nextCursor
  };
}

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
export async function getActivityTimeline(
  workspaceId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
  } = {}
): Promise<any[]> {
  const Activity = getActivityModel();
  const sequelize = Activity.sequelize!;

  const groupBy = options.groupBy || 'day';
  const where: any = { workspaceId };

  if (options.startDate) {
    where.createdAt = { [Op.gte]: options.startDate };
  }

  if (options.endDate) {
    where.createdAt = {
      ...where.createdAt,
      [Op.lte]: options.endDate
    };
  }

  let dateFormat: string;
  switch (groupBy) {
    case 'hour':
      dateFormat = '%Y-%m-%d %H:00:00';
      break;
    case 'week':
      dateFormat = '%Y-%U';
      break;
    case 'month':
      dateFormat = '%Y-%m';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }

  const timeline = await Activity.findAll({
    where,
    attributes: [
      [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'period'],
      [fn('COUNT', col('id')), 'activityCount'],
      [fn('COUNT', fn('DISTINCT', col('userId'))), 'uniqueUsers'],
      'actionType'
    ],
    group: [
      literal(`DATE_FORMAT(created_at, '${dateFormat}')`),
      'actionType'
    ],
    order: [[literal('period'), 'ASC']],
    raw: true
  });

  return timeline;
}

/**
 * Get user's personalized activity feed with relevance scoring
 *
 * @param userId - User identifier
 * @param workspaceId - Workspace identifier
 * @param options - Feed options
 * @returns Personalized activity feed
 */
export async function getPersonalizedActivityFeed(
  userId: string,
  workspaceId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<any[]> {
  const Activity = getActivityModel();
  const User = getUserModel();
  const sequelize = Activity.sequelize!;

  const activities = await Activity.findAll({
    where: {
      workspaceId,
      [Op.or]: [
        { userId }, // User's own activities
        { mentions: { [Op.contains]: [userId] } }, // Mentioned
        { visibility: 'public' } // Public activities
      ]
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'avatar']
    }],
    attributes: {
      include: [
        [
          literal(`
            CASE
              WHEN user_id = '${userId}' THEN 10
              WHEN mentions @> '["${userId}"]' THEN 8
              WHEN action_type IN ('comment_created', 'task_assigned') THEN 5
              ELSE 1
            END
          `),
          'relevanceScore'
        ]
      ]
    },
    order: [
      [literal('relevanceScore'), 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit: options.limit || 50,
    offset: options.offset || 0
  });

  return activities.map(a => a.toJSON());
}

// =====================================================
// Comments and Mentions Functions
// =====================================================

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
export async function createComment(
  commentData: Partial<Comment>,
  transaction?: Transaction
): Promise<Comment> {
  const Comment = getCommentModel();

  // Extract @mentions from content
  const mentions = extractMentions(commentData.content || '');

  const comment = await Comment.create(
    {
      ...commentData,
      mentions,
      isResolved: false,
      metadata: commentData.metadata || {},
      createdAt: new Date()
    },
    { transaction }
  );

  // Create activity
  await createActivityItem({
    workspaceId: commentData.workspaceId!,
    userId: commentData.userId!,
    actionType: 'comment_created',
    entityType: commentData.entityType!,
    entityId: commentData.entityId!,
    metadata: {
      commentId: comment.id,
      preview: commentData.content?.substring(0, 100)
    },
    mentions,
    visibility: 'team'
  }, transaction);

  // Send notifications to mentioned users
  if (mentions.length > 0) {
    await Promise.all(
      mentions.map(mentionedUserId =>
        createChangeNotification({
          userId: mentionedUserId,
          workspaceId: commentData.workspaceId!,
          sourceUserId: commentData.userId!,
          notificationType: 'comment_mention',
          title: 'You were mentioned in a comment',
          message: commentData.content?.substring(0, 200) || '',
          actionUrl: `/workspace/${commentData.workspaceId}/${commentData.entityType}/${commentData.entityId}#comment-${comment.id}`,
          metadata: { commentId: comment.id },
          isRead: false
        }, transaction)
      )
    );
  }

  return comment.toJSON();
}

/**
 * Get comments for entity with threaded replies
 *
 * @param entityType - Entity type
 * @param entityId - Entity identifier
 * @param options - Query options
 * @returns Threaded comments
 */
export async function getCommentsForEntity(
  entityType: string,
  entityId: string,
  options: {
    includeResolved?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> {
  const Comment = getCommentModel();
  const User = getUserModel();

  const where: any = {
    entityType,
    entityId,
    parentId: null // Get only top-level comments
  };

  if (!options.includeResolved) {
    where.isResolved = false;
  }

  const comments = await Comment.findAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'avatar']
      },
      {
        model: Comment,
        as: 'replies',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }],
        order: [['createdAt', 'ASC']]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: options.limit || 50,
    offset: options.offset || 0
  });

  return comments.map(c => c.toJSON());
}

/**
 * Reply to comment with threading
 *
 * @param parentCommentId - Parent comment ID
 * @param replyData - Reply data
 * @param transaction - Optional database transaction
 * @returns Created reply
 */
export async function replyToComment(
  parentCommentId: string,
  replyData: Partial<Comment>,
  transaction?: Transaction
): Promise<Comment> {
  const Comment = getCommentModel();

  const parentComment = await Comment.findByPk(parentCommentId, { transaction });
  if (!parentComment) {
    throw new Error('Parent comment not found');
  }

  const reply = await createComment(
    {
      ...replyData,
      parentId: parentCommentId,
      workspaceId: parentComment.workspaceId,
      entityType: parentComment.entityType,
      entityId: parentComment.entityId
    },
    transaction
  );

  // Notify parent comment author
  if (parentComment.userId !== replyData.userId) {
    await createChangeNotification({
      userId: parentComment.userId,
      workspaceId: parentComment.workspaceId,
      sourceUserId: replyData.userId!,
      notificationType: 'comment_reply',
      title: 'New reply to your comment',
      message: replyData.content?.substring(0, 200) || '',
      actionUrl: `/workspace/${parentComment.workspaceId}/${parentComment.entityType}/${parentComment.entityId}#comment-${reply.id}`,
      metadata: { commentId: reply.id, parentCommentId },
      isRead: false
    }, transaction);
  }

  return reply;
}

/**
 * Resolve/unresolve comment thread
 *
 * @param commentId - Comment identifier
 * @param isResolved - Resolution status
 * @param userId - User resolving the comment
 * @param transaction - Optional database transaction
 * @returns Updated comment
 */
export async function resolveComment(
  commentId: string,
  isResolved: boolean,
  userId: string,
  transaction?: Transaction
): Promise<Comment> {
  const Comment = getCommentModel();

  const comment = await Comment.findByPk(commentId, { transaction });
  if (!comment) {
    throw new Error('Comment not found');
  }

  await comment.update(
    {
      isResolved,
      metadata: {
        ...comment.metadata,
        resolvedBy: userId,
        resolvedAt: isResolved ? new Date() : null
      }
    },
    { transaction }
  );

  // Create activity
  await createActivityItem({
    workspaceId: comment.workspaceId,
    userId,
    actionType: isResolved ? 'comment_resolved' : 'comment_reopened',
    entityType: comment.entityType,
    entityId: comment.entityId,
    metadata: { commentId },
    visibility: 'team'
  }, transaction);

  return comment.toJSON();
}

/**
 * Get user mentions across workspace
 *
 * @param userId - User identifier
 * @param workspaceId - Workspace identifier
 * @param options - Query options
 * @returns Comments where user was mentioned
 */
export async function getUserMentions(
  userId: string,
  workspaceId: string,
  options: { includeRead?: boolean; limit?: number } = {}
): Promise<any[]> {
  const Comment = getCommentModel();
  const User = getUserModel();

  const comments = await Comment.findAll({
    where: {
      workspaceId,
      mentions: { [Op.contains]: [userId] }
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'avatar']
    }],
    order: [['createdAt', 'DESC']],
    limit: options.limit || 50
  });

  return comments.map(c => c.toJSON());
}

// =====================================================
// Task Assignment Functions
// =====================================================

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
export async function createTaskAssignment(
  assignmentData: Partial<TaskAssignment>,
  transaction?: Transaction
): Promise<TaskAssignment> {
  const TaskAssignment = getTaskAssignmentModel();

  const assignment = await TaskAssignment.create(
    {
      ...assignmentData,
      status: 'pending',
      metadata: assignmentData.metadata || {},
      createdAt: new Date()
    },
    { transaction }
  );

  // Create activity
  await createActivityItem({
    workspaceId: assignmentData.workspaceId!,
    userId: assignmentData.assignedBy!,
    actionType: 'task_assigned',
    entityType: 'task',
    entityId: assignmentData.taskId!,
    metadata: {
      assignmentId: assignment.id,
      assignedTo: assignmentData.assignedTo,
      priority: assignmentData.priority
    },
    mentions: [assignmentData.assignedTo!],
    visibility: 'team'
  }, transaction);

  // Notify assignee
  await createChangeNotification({
    userId: assignmentData.assignedTo!,
    workspaceId: assignmentData.workspaceId!,
    sourceUserId: assignmentData.assignedBy!,
    notificationType: 'task_assigned',
    title: 'New task assigned to you',
    message: `You have been assigned a ${assignmentData.priority} priority task`,
    actionUrl: `/workspace/${assignmentData.workspaceId}/task/${assignmentData.taskId}`,
    metadata: {
      assignmentId: assignment.id,
      taskId: assignmentData.taskId,
      priority: assignmentData.priority
    },
    isRead: false
  }, transaction);

  return assignment.toJSON();
}

/**
 * Update task assignment status
 *
 * @param assignmentId - Assignment identifier
 * @param status - New status
 * @param userId - User updating the status
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 */
export async function updateTaskAssignmentStatus(
  assignmentId: string,
  status: TaskAssignment['status'],
  userId: string,
  transaction?: Transaction
): Promise<TaskAssignment> {
  const TaskAssignment = getTaskAssignmentModel();

  const assignment = await TaskAssignment.findByPk(assignmentId, { transaction });
  if (!assignment) {
    throw new Error('Assignment not found');
  }

  const updates: any = { status };
  if (status === 'completed') {
    updates.completedAt = new Date();
  }

  await assignment.update(updates, { transaction });

  // Create activity
  await createActivityItem({
    workspaceId: assignment.workspaceId,
    userId,
    actionType: `task_${status}`,
    entityType: 'task',
    entityId: assignment.taskId,
    metadata: { assignmentId, previousStatus: assignment.status },
    visibility: 'team'
  }, transaction);

  // Notify assigner if completed or declined
  if ((status === 'completed' || status === 'declined') && assignment.assignedBy !== userId) {
    await createChangeNotification({
      userId: assignment.assignedBy,
      workspaceId: assignment.workspaceId,
      sourceUserId: userId,
      notificationType: `task_${status}`,
      title: `Task ${status}`,
      message: `A task you assigned was ${status}`,
      actionUrl: `/workspace/${assignment.workspaceId}/task/${assignment.taskId}`,
      metadata: { assignmentId, taskId: assignment.taskId },
      isRead: false
    }, transaction);
  }

  return assignment.toJSON();
}

/**
 * Get user's assigned tasks with filtering
 *
 * @param userId - User identifier
 * @param options - Filter options
 * @returns List of task assignments
 */
export async function getUserAssignedTasks(
  userId: string,
  options: {
    workspaceId?: string;
    status?: TaskAssignment['status'][];
    priority?: TaskAssignment['priority'][];
    overdue?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> {
  const TaskAssignment = getTaskAssignmentModel();
  const Task = getTaskModel();
  const User = getUserModel();

  const where: any = { assignedTo: userId };

  if (options.workspaceId) {
    where.workspaceId = options.workspaceId;
  }

  if (options.status && options.status.length > 0) {
    where.status = { [Op.in]: options.status };
  }

  if (options.priority && options.priority.length > 0) {
    where.priority = { [Op.in]: options.priority };
  }

  if (options.overdue) {
    where.dueDate = { [Op.lt]: new Date() };
    where.status = { [Op.notIn]: ['completed', 'declined'] };
  }

  const assignments = await TaskAssignment.findAll({
    where,
    include: [
      {
        model: Task,
        as: 'task',
        attributes: ['id', 'title', 'description', 'status']
      },
      {
        model: User,
        as: 'assigner',
        attributes: ['id', 'firstName', 'lastName', 'avatar']
      }
    ],
    order: [
      ['priority', 'DESC'],
      ['dueDate', 'ASC NULLS LAST']
    ],
    limit: options.limit || 50,
    offset: options.offset || 0
  });

  return assignments.map(a => a.toJSON());
}

/**
 * Delegate task to another user
 *
 * @param assignmentId - Current assignment identifier
 * @param newAssignee - New user to assign to
 * @param delegatedBy - User performing delegation
 * @param transaction - Optional database transaction
 * @returns New assignment
 */
export async function delegateTask(
  assignmentId: string,
  newAssignee: string,
  delegatedBy: string,
  transaction?: Transaction
): Promise<TaskAssignment> {
  const TaskAssignment = getTaskAssignmentModel();

  const originalAssignment = await TaskAssignment.findByPk(assignmentId, { transaction });
  if (!originalAssignment) {
    throw new Error('Assignment not found');
  }

  // Update original assignment
  await originalAssignment.update(
    {
      status: 'declined',
      metadata: {
        ...originalAssignment.metadata,
        delegatedTo: newAssignee,
        delegatedAt: new Date()
      }
    },
    { transaction }
  );

  // Create new assignment
  const newAssignment = await createTaskAssignment(
    {
      taskId: originalAssignment.taskId,
      assignedTo: newAssignee,
      assignedBy: delegatedBy,
      workspaceId: originalAssignment.workspaceId,
      priority: originalAssignment.priority,
      dueDate: originalAssignment.dueDate,
      metadata: {
        delegatedFrom: originalAssignment.assignedTo,
        originalAssignmentId: assignmentId
      }
    },
    transaction
  );

  return newAssignment;
}

/**
 * Get task assignment statistics for workspace
 *
 * @param workspaceId - Workspace identifier
 * @param options - Query options
 * @returns Assignment statistics
 */
export async function getTaskAssignmentStats(
  workspaceId: string,
  options: { startDate?: Date; endDate?: Date } = {}
): Promise<any> {
  const TaskAssignment = getTaskAssignmentModel();
  const sequelize = TaskAssignment.sequelize!;

  const where: any = { workspaceId };

  if (options.startDate) {
    where.createdAt = { [Op.gte]: options.startDate };
  }

  if (options.endDate) {
    where.createdAt = {
      ...where.createdAt,
      [Op.lte]: options.endDate
    };
  }

  const stats = await TaskAssignment.findAll({
    where,
    attributes: [
      'status',
      'priority',
      [fn('COUNT', col('id')), 'count'],
      [fn('AVG', fn('TIMESTAMPDIFF', literal('SECOND'), col('createdAt'), col('completedAt'))), 'avgCompletionTime']
    ],
    group: ['status', 'priority'],
    raw: true
  });

  return stats;
}

// =====================================================
// Collaborative Document Editing Functions
// =====================================================

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
export async function applyDocumentEdit(
  editData: Partial<DocumentEdit>,
  transaction?: Transaction
): Promise<DocumentEdit> {
  const DocumentEdit = getDocumentEditModel();
  const Document = getDocumentModel();

  // Get current document version
  const document = await Document.findByPk(editData.documentId, {
    transaction,
    lock: transaction?.LOCK.UPDATE
  });

  if (!document) {
    throw new Error('Document not found');
  }

  // Check for version conflicts
  if (editData.version !== undefined && editData.version < document.version) {
    throw new Error('Version conflict: Document has been modified');
  }

  const edit = await DocumentEdit.create(
    {
      ...editData,
      version: document.version + 1,
      timestamp: new Date()
    },
    { transaction }
  );

  // Update document version
  await document.update(
    { version: document.version + 1 },
    { transaction }
  );

  // Apply the edit to document content
  let newContent = document.content;
  switch (editData.operation) {
    case 'insert':
      newContent = newContent.slice(0, editData.position!) + editData.content + newContent.slice(editData.position!);
      break;
    case 'delete':
      newContent = newContent.slice(0, editData.position!) + newContent.slice(editData.position! + editData.length!);
      break;
    case 'update':
      newContent = newContent.slice(0, editData.position!) + editData.content + newContent.slice(editData.position! + editData.length!);
      break;
  }

  await document.update({ content: newContent }, { transaction });

  return edit.toJSON();
}

/**
 * Get document edit history with pagination
 *
 * @param documentId - Document identifier
 * @param options - Query options
 * @returns Edit history
 */
export async function getDocumentEditHistory(
  documentId: string,
  options: {
    fromVersion?: number;
    toVersion?: number;
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> {
  const DocumentEdit = getDocumentEditModel();
  const User = getUserModel();

  const where: any = { documentId };

  if (options.fromVersion !== undefined) {
    where.version = { [Op.gte]: options.fromVersion };
  }

  if (options.toVersion !== undefined) {
    where.version = {
      ...where.version,
      [Op.lte]: options.toVersion
    };
  }

  if (options.userId) {
    where.userId = options.userId;
  }

  const edits = await DocumentEdit.findAll({
    where,
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'avatar']
    }],
    order: [['version', 'DESC']],
    limit: options.limit || 100,
    offset: options.offset || 0
  });

  return edits.map(e => e.toJSON());
}

/**
 * Detect and resolve concurrent edit conflicts
 *
 * @param documentId - Document identifier
 * @param edit1 - First edit operation
 * @param edit2 - Second edit operation
 * @param transaction - Optional database transaction
 * @returns Conflict resolution
 */
export async function resolveEditConflict(
  documentId: string,
  edit1: DocumentEdit,
  edit2: DocumentEdit,
  transaction?: Transaction
): Promise<ConflictResolution> {
  let conflictType: ConflictResolution['conflictType'];
  let resolution: ConflictResolution['resolution'];

  // Determine conflict type
  if (edit1.version !== edit2.version) {
    conflictType = 'version_mismatch';
  } else if (isOverlappingEdit(edit1, edit2)) {
    conflictType = 'concurrent_edit';
  } else {
    conflictType = 'permission_conflict';
  }

  // Apply resolution strategy
  if (conflictType === 'concurrent_edit') {
    if (edit1.timestamp < edit2.timestamp) {
      resolution = 'accept_first';
    } else if (canMergeEdits(edit1, edit2)) {
      resolution = 'merge';
    } else {
      resolution = 'manual';
    }
  } else {
    resolution = 'accept_first';
  }

  const conflictResolution: ConflictResolution = {
    documentId,
    conflictType,
    userId1: edit1.userId,
    userId2: edit2.userId,
    edit1,
    edit2,
    resolution
  };

  // Log conflict for audit
  await createActivityItem({
    workspaceId: 'system', // System-level activity
    userId: 'system',
    actionType: 'conflict_resolved',
    entityType: 'document',
    entityId: documentId,
    metadata: {
      conflictType,
      resolution,
      users: [edit1.userId, edit2.userId]
    },
    visibility: 'private'
  }, transaction);

  return conflictResolution;
}

/**
 * Create document snapshot for version control
 *
 * @param documentId - Document identifier
 * @param userId - User creating snapshot
 * @param message - Snapshot description
 * @param transaction - Optional database transaction
 * @returns Created snapshot
 */
export async function createDocumentSnapshot(
  documentId: string,
  userId: string,
  message?: string,
  transaction?: Transaction
): Promise<any> {
  const Document = getDocumentModel();
  const DocumentSnapshot = getDocumentSnapshotModel();

  const document = await Document.findByPk(documentId, { transaction });
  if (!document) {
    throw new Error('Document not found');
  }

  const snapshot = await DocumentSnapshot.create(
    {
      documentId,
      userId,
      version: document.version,
      content: document.content,
      metadata: document.metadata,
      message: message || `Snapshot at version ${document.version}`,
      createdAt: new Date()
    },
    { transaction }
  );

  return snapshot.toJSON();
}

/**
 * Restore document from snapshot
 *
 * @param snapshotId - Snapshot identifier
 * @param userId - User performing restore
 * @param transaction - Optional database transaction
 * @returns Restored document
 */
export async function restoreDocumentFromSnapshot(
  snapshotId: string,
  userId: string,
  transaction?: Transaction
): Promise<any> {
  const Document = getDocumentModel();
  const DocumentSnapshot = getDocumentSnapshotModel();

  const snapshot = await DocumentSnapshot.findByPk(snapshotId, { transaction });
  if (!snapshot) {
    throw new Error('Snapshot not found');
  }

  const document = await Document.findByPk(snapshot.documentId, {
    transaction,
    lock: transaction?.LOCK.UPDATE
  });

  if (!document) {
    throw new Error('Document not found');
  }

  await document.update(
    {
      content: snapshot.content,
      metadata: {
        ...document.metadata,
        restoredFrom: snapshotId,
        restoredAt: new Date(),
        restoredBy: userId
      },
      version: document.version + 1
    },
    { transaction }
  );

  // Create activity
  await createActivityItem({
    workspaceId: document.workspaceId,
    userId,
    actionType: 'document_restored',
    entityType: 'document',
    entityId: document.id,
    metadata: {
      snapshotId,
      snapshotVersion: snapshot.version
    },
    visibility: 'team'
  }, transaction);

  return document.toJSON();
}

// =====================================================
// Change Notification Functions
// =====================================================

/**
 * Create change notification for user
 *
 * @param notificationData - Notification data
 * @param transaction - Optional database transaction
 * @returns Created notification
 */
export async function createChangeNotification(
  notificationData: Partial<ChangeNotification>,
  transaction?: Transaction
): Promise<ChangeNotification> {
  const Notification = getNotificationModel();

  const notification = await Notification.create(
    {
      ...notificationData,
      isRead: false,
      createdAt: new Date()
    },
    { transaction }
  );

  return notification.toJSON();
}

/**
 * Get user notifications with filtering
 *
 * @param userId - User identifier
 * @param options - Filter options
 * @returns List of notifications
 */
export async function getUserNotifications(
  userId: string,
  options: {
    unreadOnly?: boolean;
    notificationTypes?: string[];
    workspaceId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> {
  const Notification = getNotificationModel();
  const User = getUserModel();

  const where: any = { userId };

  if (options.unreadOnly) {
    where.isRead = false;
  }

  if (options.notificationTypes && options.notificationTypes.length > 0) {
    where.notificationType = { [Op.in]: options.notificationTypes };
  }

  if (options.workspaceId) {
    where.workspaceId = options.workspaceId;
  }

  const notifications = await Notification.findAll({
    where,
    include: [{
      model: User,
      as: 'sourceUser',
      attributes: ['id', 'firstName', 'lastName', 'avatar']
    }],
    order: [['createdAt', 'DESC']],
    limit: options.limit || 50,
    offset: options.offset || 0
  });

  return notifications.map(n => n.toJSON());
}

/**
 * Mark notifications as read
 *
 * @param notificationIds - Notification identifiers
 * @param userId - User identifier (for security)
 * @param transaction - Optional database transaction
 * @returns Number of updated notifications
 */
export async function markNotificationsAsRead(
  notificationIds: string[],
  userId: string,
  transaction?: Transaction
): Promise<number> {
  const Notification = getNotificationModel();

  const [affectedCount] = await Notification.update(
    {
      isRead: true,
      readAt: new Date()
    },
    {
      where: {
        id: { [Op.in]: notificationIds },
        userId // Security: Only mark user's own notifications
      },
      transaction
    }
  );

  return affectedCount;
}

/**
 * Get unread notification count by type
 *
 * @param userId - User identifier
 * @param workspaceId - Optional workspace filter
 * @returns Notification counts by type
 */
export async function getUnreadNotificationCounts(
  userId: string,
  workspaceId?: string
): Promise<Record<string, number>> {
  const Notification = getNotificationModel();

  const where: any = {
    userId,
    isRead: false
  };

  if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  const counts = await Notification.findAll({
    where,
    attributes: [
      'notificationType',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['notificationType'],
    raw: true
  });

  const result: Record<string, number> = {};
  counts.forEach((row: any) => {
    result[row.notificationType] = parseInt(row.count, 10);
  });

  return result;
}

/**
 * Bulk delete old notifications
 *
 * @param userId - User identifier
 * @param olderThan - Delete notifications older than this date
 * @param transaction - Optional database transaction
 * @returns Number of deleted notifications
 */
export async function deleteOldNotifications(
  userId: string,
  olderThan: Date,
  transaction?: Transaction
): Promise<number> {
  const Notification = getNotificationModel();

  const affectedCount = await Notification.destroy({
    where: {
      userId,
      createdAt: { [Op.lt]: olderThan },
      isRead: true // Only delete read notifications
    },
    transaction
  });

  return affectedCount;
}

// =====================================================
// Real-time WebSocket Functions
// =====================================================

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
export function initializeCollaborationWebSocket(
  io: SocketIOServer,
  redis: Redis
): void {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join workspace room
    socket.on('join_workspace', async (data: { workspaceId: string; userId: string }) => {
      const { workspaceId, userId } = data;

      // Join Socket.IO room
      socket.join(`workspace:${workspaceId}`);

      // Update presence in Redis
      await updateUserPresence({
        userId,
        workspaceId,
        status: 'online',
        lastActivity: new Date()
      }, redis);

      // Broadcast user joined
      socket.to(`workspace:${workspaceId}`).emit('user_joined', {
        userId,
        timestamp: new Date()
      });

      // Send current active users
      const activeUsers = await getWorkspaceActiveUsers(workspaceId, redis);
      socket.emit('active_users', activeUsers);
    });

    // Handle cursor position updates
    socket.on('cursor_update', async (data: {
      workspaceId: string;
      userId: string;
      position: { x: number; y: number };
      selectedElement?: string;
    }) => {
      await updateUserPresence({
        userId: data.userId,
        workspaceId: data.workspaceId,
        status: 'online',
        lastActivity: new Date(),
        cursorPosition: data.position,
        selectedElement: data.selectedElement
      }, redis);

      // Broadcast to others in workspace
      socket.to(`workspace:${data.workspaceId}`).emit('cursor_moved', {
        userId: data.userId,
        position: data.position,
        selectedElement: data.selectedElement
      });
    });

    // Handle document edits
    socket.on('document_edit', async (data: {
      documentId: string;
      workspaceId: string;
      edit: Partial<DocumentEdit>;
    }) => {
      try {
        // Apply edit (you would use applyDocumentEdit here with transaction)
        const appliedEdit = data.edit; // Simplified for example

        // Broadcast edit to others
        socket.to(`workspace:${data.workspaceId}`).emit('document_updated', {
          documentId: data.documentId,
          edit: appliedEdit,
          timestamp: new Date()
        });
      } catch (error: any) {
        socket.emit('edit_error', {
          message: error.message,
          documentId: data.documentId
        });
      }
    });

    // Handle comments
    socket.on('comment_created', (data: {
      workspaceId: string;
      comment: Comment;
    }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('new_comment', {
        comment: data.comment,
        timestamp: new Date()
      });
    });

    // Handle task updates
    socket.on('task_updated', (data: {
      workspaceId: string;
      taskId: string;
      update: any;
    }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('task_changed', {
        taskId: data.taskId,
        update: data.update,
        timestamp: new Date()
      });
    });

    // Handle typing indicators
    socket.on('typing_start', (data: {
      workspaceId: string;
      userId: string;
      location: string;
    }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('user_typing', {
        userId: data.userId,
        location: data.location,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data: {
      workspaceId: string;
      userId: string;
      location: string;
    }) => {
      socket.to(`workspace:${data.workspaceId}`).emit('user_typing', {
        userId: data.userId,
        location: data.location,
        isTyping: false
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);

      // You would need to track userId-socketId mapping to properly clean up
      // For simplicity, this is omitted in the example
    });

    // Leave workspace
    socket.on('leave_workspace', async (data: { workspaceId: string; userId: string }) => {
      const { workspaceId, userId } = data;

      socket.leave(`workspace:${workspaceId}`);

      await removeUserPresence(workspaceId, userId, redis);

      socket.to(`workspace:${workspaceId}`).emit('user_left', {
        userId,
        timestamp: new Date()
      });
    });
  });
}

/**
 * Broadcast real-time event to workspace
 *
 * @param io - Socket.IO server instance
 * @param event - Real-time event data
 */
export function broadcastWorkspaceEvent(
  io: SocketIOServer,
  event: RealtimeEvent
): void {
  io.to(`workspace:${event.workspaceId}`).emit(event.eventType, {
    ...event.data,
    userId: event.userId,
    timestamp: event.timestamp
  });
}

/**
 * Send notification to specific user
 *
 * @param io - Socket.IO server instance
 * @param userId - User identifier
 * @param notification - Notification data
 */
export function sendUserNotification(
  io: SocketIOServer,
  userId: string,
  notification: ChangeNotification
): void {
  io.to(`user:${userId}`).emit('notification', notification);
}

// =====================================================
// Collaboration Analytics Functions
// =====================================================

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
export async function calculateCollaborationMetrics(
  workspaceId: string,
  startDate: Date,
  endDate: Date
): Promise<CollaborationMetrics> {
  const Activity = getActivityModel();
  const Comment = getCommentModel();
  const TaskAssignment = getTaskAssignmentModel();
  const sequelize = Activity.sequelize!;

  const dateRange = { [Op.between]: [startDate, endDate] };

  // Get active users
  const activeUsersResult = await Activity.findAll({
    where: {
      workspaceId,
      createdAt: dateRange
    },
    attributes: [[fn('COUNT', fn('DISTINCT', col('userId'))), 'count']],
    raw: true
  });
  const activeUsers = parseInt((activeUsersResult[0] as any).count, 10);

  // Get total activities
  const totalActivities = await Activity.count({
    where: {
      workspaceId,
      createdAt: dateRange
    }
  });

  // Get total comments
  const totalComments = await Comment.count({
    where: {
      workspaceId,
      createdAt: dateRange
    }
  });

  // Get task statistics
  const taskStats = await TaskAssignment.findAll({
    where: {
      workspaceId,
      createdAt: dateRange
    },
    attributes: [
      [fn('COUNT', col('id')), 'total'],
      [fn('SUM', literal("CASE WHEN status = 'completed' THEN 1 ELSE 0 END")), 'completed']
    ],
    raw: true
  });

  const totalTasks = parseInt((taskStats[0] as any).total, 10) || 0;
  const completedTasks = parseInt((taskStats[0] as any).completed, 10) || 0;

  // Calculate average response time for comments
  const responseTimeResult = await sequelize.query(`
    SELECT AVG(TIMESTAMPDIFF(SECOND, c1.created_at, c2.created_at)) as avg_response_time
    FROM comments c1
    JOIN comments c2 ON c2.parent_id = c1.id
    WHERE c1.workspace_id = :workspaceId
      AND c1.created_at BETWEEN :startDate AND :endDate
      AND c2.created_at BETWEEN :startDate AND :endDate
  `, {
    replacements: { workspaceId, startDate, endDate },
    type: 'SELECT'
  });

  const averageResponseTime = (responseTimeResult[0] as any)?.avg_response_time || 0;

  // Calculate collaboration score (custom metric)
  const collaborationScore = calculateCollaborationScore({
    activeUsers,
    totalActivities,
    totalComments,
    completedTasks,
    totalTasks
  });

  // Calculate engagement rate
  const engagementRate = activeUsers > 0 ? (totalActivities / activeUsers) : 0;

  const period = `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;

  return {
    workspaceId,
    period,
    activeUsers,
    totalActivities,
    totalComments,
    totalTasks,
    completedTasks,
    averageResponseTime,
    collaborationScore,
    engagementRate
  };
}

/**
 * Get user collaboration activity breakdown
 *
 * @param userId - User identifier
 * @param workspaceId - Workspace identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns User activity breakdown
 */
export async function getUserActivityBreakdown(
  userId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date
): Promise<any> {
  const Activity = getActivityModel();
  const Comment = getCommentModel();
  const TaskAssignment = getTaskAssignmentModel();

  const dateRange = { [Op.between]: [startDate, endDate] };

  // Get activity by type
  const activityBreakdown = await Activity.findAll({
    where: {
      userId,
      workspaceId,
      createdAt: dateRange
    },
    attributes: [
      'actionType',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['actionType'],
    raw: true
  });

  // Get comment statistics
  const commentStats = await Comment.findAll({
    where: {
      userId,
      workspaceId,
      createdAt: dateRange
    },
    attributes: [
      [fn('COUNT', col('id')), 'totalComments'],
      [fn('COUNT', col('parentId')), 'replies'],
      [fn('SUM', literal("JSON_LENGTH(mentions)")), 'totalMentions']
    ],
    raw: true
  });

  // Get task statistics
  const taskStats = await TaskAssignment.findAll({
    where: {
      assignedTo: userId,
      workspaceId,
      createdAt: dateRange
    },
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['status'],
    raw: true
  });

  return {
    userId,
    workspaceId,
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    activityBreakdown,
    commentStats: commentStats[0],
    taskStats
  };
}

/**
 * Get workspace engagement leaderboard
 *
 * @param workspaceId - Workspace identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param limit - Number of top users to return
 * @returns Leaderboard of most engaged users
 */
export async function getWorkspaceEngagementLeaderboard(
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<any[]> {
  const Activity = getActivityModel();
  const User = getUserModel();
  const sequelize = Activity.sequelize!;

  const leaderboard = await Activity.findAll({
    where: {
      workspaceId,
      createdAt: { [Op.between]: [startDate, endDate] }
    },
    attributes: [
      'userId',
      [fn('COUNT', col('Activity.id')), 'activityCount'],
      [
        literal(`(
          SELECT COUNT(*)
          FROM comments
          WHERE comments.user_id = Activity.user_id
            AND comments.workspace_id = '${workspaceId}'
            AND comments.created_at BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
        )`),
        'commentCount'
      ],
      [
        literal(`(
          SELECT COUNT(*)
          FROM task_assignments
          WHERE task_assignments.assigned_to = Activity.user_id
            AND task_assignments.workspace_id = '${workspaceId}'
            AND task_assignments.status = 'completed'
            AND task_assignments.created_at BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
        )`),
        'completedTasks'
      ]
    ],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'avatar']
    }],
    group: ['userId', 'user.id'],
    order: [[literal('activityCount'), 'DESC']],
    limit,
    subQuery: false
  });

  return leaderboard.map(item => item.toJSON());
}

/**
 * Generate collaboration health report
 *
 * @param workspaceId - Workspace identifier
 * @param period - Report period in days
 * @returns Collaboration health report
 */
export async function generateCollaborationHealthReport(
  workspaceId: string,
  period: number = 30
): Promise<any> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  const metrics = await calculateCollaborationMetrics(workspaceId, startDate, endDate);
  const leaderboard = await getWorkspaceEngagementLeaderboard(workspaceId, startDate, endDate, 5);

  const Activity = getActivityModel();

  // Get activity trend
  const activityTrend = await Activity.findAll({
    where: {
      workspaceId,
      createdAt: { [Op.between]: [startDate, endDate] }
    },
    attributes: [
      [fn('DATE', col('createdAt')), 'date'],
      [fn('COUNT', col('id')), 'count']
    ],
    group: [literal('DATE(created_at)')],
    order: [[literal('date'), 'ASC']],
    raw: true
  });

  // Health score calculation
  const healthScore = calculateHealthScore(metrics);

  return {
    workspaceId,
    period: `Last ${period} days`,
    generatedAt: new Date(),
    metrics,
    healthScore,
    topContributors: leaderboard,
    activityTrend,
    recommendations: generateRecommendations(metrics, healthScore)
  };
}

// =====================================================
// Utility Functions
// =====================================================

/**
 * Extract @mentions from text content
 *
 * @param content - Text content
 * @returns Array of mentioned user IDs
 */
function extractMentions(content: string): string[] {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[2]); // Extract user ID from @[username](userId)
  }

  return mentions;
}

/**
 * Check if two edits overlap
 *
 * @param edit1 - First edit
 * @param edit2 - Second edit
 * @returns True if edits overlap
 */
function isOverlappingEdit(edit1: DocumentEdit, edit2: DocumentEdit): boolean {
  const end1 = edit1.position + (edit1.length || edit1.content?.length || 0);
  const end2 = edit2.position + (edit2.length || edit2.content?.length || 0);

  return !(end1 <= edit2.position || end2 <= edit1.position);
}

/**
 * Check if two edits can be merged
 *
 * @param edit1 - First edit
 * @param edit2 - Second edit
 * @returns True if edits can be merged
 */
function canMergeEdits(edit1: DocumentEdit, edit2: DocumentEdit): boolean {
  // Simple merge logic: edits are adjacent and of same type
  if (edit1.operation !== edit2.operation) {
    return false;
  }

  if (edit1.operation === 'insert' && edit2.operation === 'insert') {
    const end1 = edit1.position + (edit1.content?.length || 0);
    return end1 === edit2.position;
  }

  return false;
}

/**
 * Calculate collaboration score from metrics
 *
 * @param data - Metric data
 * @returns Collaboration score (0-100)
 */
function calculateCollaborationScore(data: {
  activeUsers: number;
  totalActivities: number;
  totalComments: number;
  completedTasks: number;
  totalTasks: number;
}): number {
  const userScore = Math.min(data.activeUsers * 5, 30);
  const activityScore = Math.min(data.totalActivities * 0.1, 25);
  const commentScore = Math.min(data.totalComments * 0.5, 20);
  const taskScore = data.totalTasks > 0 ? (data.completedTasks / data.totalTasks) * 25 : 0;

  return Math.round(userScore + activityScore + commentScore + taskScore);
}

/**
 * Calculate workspace health score
 *
 * @param metrics - Collaboration metrics
 * @returns Health score (0-100)
 */
function calculateHealthScore(metrics: CollaborationMetrics): number {
  let score = 0;

  // Active users contribute 30%
  score += Math.min(metrics.activeUsers * 3, 30);

  // Engagement rate contributes 25%
  score += Math.min(metrics.engagementRate * 2, 25);

  // Task completion rate contributes 25%
  const taskCompletionRate = metrics.totalTasks > 0
    ? (metrics.completedTasks / metrics.totalTasks) * 100
    : 0;
  score += taskCompletionRate * 0.25;

  // Response time contributes 20% (lower is better)
  const responseTimeScore = Math.max(20 - (metrics.averageResponseTime / 3600), 0);
  score += responseTimeScore;

  return Math.round(Math.min(score, 100));
}

/**
 * Generate recommendations based on metrics
 *
 * @param metrics - Collaboration metrics
 * @param healthScore - Current health score
 * @returns Array of recommendations
 */
function generateRecommendations(
  metrics: CollaborationMetrics,
  healthScore: number
): string[] {
  const recommendations: string[] = [];

  if (metrics.activeUsers < 5) {
    recommendations.push('Invite more team members to increase collaboration');
  }

  if (metrics.engagementRate < 10) {
    recommendations.push('Encourage team members to participate more actively');
  }

  const taskCompletionRate = metrics.totalTasks > 0
    ? (metrics.completedTasks / metrics.totalTasks) * 100
    : 0;

  if (taskCompletionRate < 50) {
    recommendations.push('Focus on completing pending tasks to improve productivity');
  }

  if (metrics.averageResponseTime > 86400) { // 24 hours
    recommendations.push('Improve response times to enhance team communication');
  }

  if (metrics.totalComments < metrics.totalActivities * 0.1) {
    recommendations.push('Encourage more discussions and feedback through comments');
  }

  if (healthScore < 50) {
    recommendations.push('Consider organizing team sync meetings to boost collaboration');
  }

  return recommendations;
}

// =====================================================
// Model Registry - Production Implementation
// =====================================================

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
 * Global model registry - must be initialized before using collaboration functions
 */
let modelRegistry: ModelRegistry = {};

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
export function initializeCollaborationModels(models: ModelRegistry): void {
  modelRegistry = { ...models };
}

/**
 * Get Workspace model from registry
 * @throws Error if model not initialized
 */
function getWorkspaceModel(): any {
  if (!modelRegistry.Workspace) {
    throw new Error(
      'Workspace model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.Workspace;
}

/**
 * Get User model from registry
 * @throws Error if model not initialized
 */
function getUserModel(): any {
  if (!modelRegistry.User) {
    throw new Error(
      'User model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.User;
}

/**
 * Get Activity model from registry
 * @throws Error if model not initialized
 */
function getActivityModel(): any {
  if (!modelRegistry.Activity) {
    throw new Error(
      'Activity model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.Activity;
}

/**
 * Get WorkspaceMember model from registry
 * @throws Error if model not initialized
 */
function getWorkspaceMemberModel(): any {
  if (!modelRegistry.WorkspaceMember) {
    throw new Error(
      'WorkspaceMember model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.WorkspaceMember;
}

/**
 * Get Comment model from registry
 * @throws Error if model not initialized
 */
function getCommentModel(): any {
  if (!modelRegistry.Comment) {
    throw new Error(
      'Comment model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.Comment;
}

/**
 * Get TaskAssignment model from registry
 * @throws Error if model not initialized
 */
function getTaskAssignmentModel(): any {
  if (!modelRegistry.TaskAssignment) {
    throw new Error(
      'TaskAssignment model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.TaskAssignment;
}

/**
 * Get Task model from registry
 * @throws Error if model not initialized
 */
function getTaskModel(): any {
  if (!modelRegistry.Task) {
    throw new Error(
      'Task model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.Task;
}

/**
 * Get DocumentEdit model from registry
 * @throws Error if model not initialized
 */
function getDocumentEditModel(): any {
  if (!modelRegistry.DocumentEdit) {
    throw new Error(
      'DocumentEdit model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.DocumentEdit;
}

/**
 * Get Document model from registry
 * @throws Error if model not initialized
 */
function getDocumentModel(): any {
  if (!modelRegistry.Document) {
    throw new Error(
      'Document model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.Document;
}

/**
 * Get DocumentSnapshot model from registry
 * @throws Error if model not initialized
 */
function getDocumentSnapshotModel(): any {
  if (!modelRegistry.DocumentSnapshot) {
    throw new Error(
      'DocumentSnapshot model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.DocumentSnapshot;
}

/**
 * Get Notification model from registry
 * @throws Error if model not initialized
 */
function getNotificationModel(): any {
  if (!modelRegistry.Notification) {
    throw new Error(
      'Notification model not initialized. Call initializeCollaborationModels() with your models first.'
    );
  }
  return modelRegistry.Notification;
}

// =====================================================
// Exports
// =====================================================

export default {
  // Model Initialization (must be called first)
  initializeCollaborationModels,

  // Workspace Management
  createCollaborationWorkspace,
  getWorkspaceWithDetails,
  addUserToWorkspace,
  updateWorkspacePermissions,
  getUserWorkspaces,

  // User Presence
  updateUserPresence,
  getWorkspaceActiveUsers,
  removeUserPresence,
  getUserPresenceAcrossWorkspaces,

  // Activity Feed
  createActivityItem,
  getActivityFeed,
  getActivityTimeline,
  getPersonalizedActivityFeed,

  // Comments and Mentions
  createComment,
  getCommentsForEntity,
  replyToComment,
  resolveComment,
  getUserMentions,

  // Task Assignment
  createTaskAssignment,
  updateTaskAssignmentStatus,
  getUserAssignedTasks,
  delegateTask,
  getTaskAssignmentStats,

  // Document Editing
  applyDocumentEdit,
  getDocumentEditHistory,
  resolveEditConflict,
  createDocumentSnapshot,
  restoreDocumentFromSnapshot,

  // Notifications
  createChangeNotification,
  getUserNotifications,
  markNotificationsAsRead,
  getUnreadNotificationCounts,
  deleteOldNotifications,

  // Real-time WebSocket
  initializeCollaborationWebSocket,
  broadcastWorkspaceEvent,
  sendUserNotification,

  // Analytics
  calculateCollaborationMetrics,
  getUserActivityBreakdown,
  getWorkspaceEngagementLeaderboard,
  generateCollaborationHealthReport,

  // Utilities
  extractMentions
};
