/**
 * LOC: DOC-COLLAB-001
 * File: /reuse/document/document-collaboration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - socket.io / websocket
 *   - redis / ioredis
 *   - @nestjs/common
 *   - nodemailer
 *   - pusher / ably (real-time)
 *
 * DOWNSTREAM (imported by):
 *   - Document collaboration controllers
 *   - Real-time collaboration services
 *   - Notification services
 *   - Review workflow modules
 *   - Permission management services
 */
/**
 * File: /reuse/document/document-collaboration-kit.ts
 * Locator: WC-UTL-DOCCOLLAB-001
 * Purpose: Document Collaboration & Review Kit - Comprehensive collaboration utilities
 *
 * Upstream: sequelize, socket.io, redis, @nestjs/common, nodemailer, pusher
 * Downstream: Collaboration controllers, real-time services, notifications, review workflows, permissions
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Socket.IO 4.x, Redis 4.x
 * Exports: 45 utility functions for real-time collaboration, presence, comments, mentions, annotations, reviews, permissions
 *
 * LLM Context: Production-grade document collaboration utilities for White Cross healthcare platform.
 * Provides real-time multi-user collaboration, presence tracking, threaded comments, @mentions,
 * notification system, shared annotations, review workflows, approval processes, version control,
 * permission management, access control, audit logging, and HIPAA-compliant collaboration features.
 * Essential for secure team-based medical document review and annotation.
 *
 * DATABASE SCHEMA DESIGN:
 *
 * Table: document_comments
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - parent_comment_id (UUID, FK -> document_comments.id, nullable, for threading)
 *   - page_number (INTEGER, indexed)
 *   - position_x (FLOAT, nullable)
 *   - position_y (FLOAT, nullable)
 *   - content (TEXT)
 *   - author_id (UUID, FK -> users.id, indexed)
 *   - status (ENUM: active, resolved, deleted, indexed)
 *   - is_edited (BOOLEAN, default false)
 *   - mentions (JSONB, array of user IDs)
 *   - attachments (JSONB)
 *   - created_at (TIMESTAMP, indexed)
 *   - updated_at (TIMESTAMP)
 *   - resolved_at (TIMESTAMP, nullable)
 *   - resolved_by (UUID, FK -> users.id, nullable)
 *
 * Table: document_annotations
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - page_number (INTEGER, indexed)
 *   - annotation_type (ENUM: highlight, underline, strikethrough, drawing, text, stamp)
 *   - coordinates (JSONB, position and size data)
 *   - color (VARCHAR(20))
 *   - content (TEXT, nullable)
 *   - author_id (UUID, FK -> users.id, indexed)
 *   - is_shared (BOOLEAN, default true)
 *   - metadata (JSONB)
 *   - created_at (TIMESTAMP)
 *   - updated_at (TIMESTAMP)
 *   - deleted_at (TIMESTAMP, nullable)
 *
 * Table: collaboration_sessions
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - session_id (VARCHAR(255), unique, indexed)
 *   - participants (JSONB, array of user objects)
 *   - active_users (JSONB, array of currently active user IDs)
 *   - started_at (TIMESTAMP)
 *   - last_activity_at (TIMESTAMP, indexed)
 *   - ended_at (TIMESTAMP, nullable)
 *   - metadata (JSONB)
 *
 * Table: user_presence
 *   - id (UUID, PK)
 *   - user_id (UUID, FK -> users.id, indexed)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - session_id (VARCHAR(255), indexed)
 *   - status (ENUM: active, idle, away, offline)
 *   - current_page (INTEGER, nullable)
 *   - cursor_position (JSONB, nullable)
 *   - last_seen_at (TIMESTAMP, indexed)
 *   - metadata (JSONB)
 *
 * Table: review_workflows
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - workflow_type (ENUM: sequential, parallel, custom)
 *   - status (ENUM: pending, in_progress, approved, rejected, completed, indexed)
 *   - current_stage (INTEGER, default 1)
 *   - total_stages (INTEGER)
 *   - created_by (UUID, FK -> users.id)
 *   - started_at (TIMESTAMP)
 *   - completed_at (TIMESTAMP, nullable)
 *   - deadline (TIMESTAMP, nullable, indexed)
 *   - metadata (JSONB)
 *   - created_at (TIMESTAMP)
 *
 * Table: review_approvals
 *   - id (UUID, PK)
 *   - workflow_id (UUID, FK -> review_workflows.id, indexed)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - reviewer_id (UUID, FK -> users.id, indexed)
 *   - stage (INTEGER)
 *   - status (ENUM: pending, approved, rejected, skipped, indexed)
 *   - decision (ENUM: approve, reject, request_changes, nullable)
 *   - comments (TEXT, nullable)
 *   - reviewed_at (TIMESTAMP, nullable)
 *   - deadline (TIMESTAMP, nullable)
 *   - created_at (TIMESTAMP)
 *
 * Table: document_notifications
 *   - id (UUID, PK)
 *   - user_id (UUID, FK -> users.id, indexed)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - notification_type (ENUM: mention, comment, annotation, review, approval, share)
 *   - title (VARCHAR(255))
 *   - message (TEXT)
 *   - reference_id (UUID, nullable, references comment/annotation/workflow)
 *   - is_read (BOOLEAN, default false, indexed)
 *   - is_sent (BOOLEAN, default false)
 *   - sent_at (TIMESTAMP, nullable)
 *   - read_at (TIMESTAMP, nullable)
 *   - created_at (TIMESTAMP, indexed)
 *   - metadata (JSONB)
 *
 * Table: document_permissions
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - user_id (UUID, FK -> users.id, nullable, indexed)
 *   - role_id (UUID, FK -> roles.id, nullable, indexed)
 *   - permission_type (ENUM: view, comment, annotate, edit, review, approve, admin)
 *   - granted_by (UUID, FK -> users.id)
 *   - granted_at (TIMESTAMP)
 *   - expires_at (TIMESTAMP, nullable, indexed)
 *   - revoked_at (TIMESTAMP, nullable)
 *   - metadata (JSONB)
 *
 * INDEXING STRATEGY:
 *   - Composite index: (document_id, status, created_at) for comment filtering
 *   - Composite index: (document_id, page_number, annotation_type) for annotation retrieval
 *   - Composite index: (user_id, is_read, created_at) for notification queries
 *   - Composite index: (document_id, user_id) for permission checks
 *   - Composite index: (session_id, last_activity_at) for presence cleanup
 *   - GIN index on mentions JSONB for efficient mention queries
 *   - GIN index on participants JSONB for session queries
 *   - Index on last_seen_at for stale presence cleanup
 *
 * PERFORMANCE OPTIMIZATION:
 *   - Redis pub/sub for real-time presence broadcasts
 *   - WebSocket connections for live collaboration
 *   - Redis cache for active collaboration sessions (TTL: 1 hour)
 *   - Background jobs for notification delivery
 *   - Denormalized active_users in collaboration_sessions for fast lookup
 *   - Partition notifications by created_at (monthly) for large datasets
 *   - Connection pooling for WebSocket scalability
 */
import { Sequelize } from 'sequelize';
/**
 * Comment status
 */
export type CommentStatus = 'active' | 'resolved' | 'deleted';
/**
 * Annotation type
 */
export type AnnotationType = 'highlight' | 'underline' | 'strikethrough' | 'drawing' | 'text' | 'stamp';
/**
 * User presence status
 */
export type PresenceStatus = 'active' | 'idle' | 'away' | 'offline';
/**
 * Review workflow status
 */
export type WorkflowStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed';
/**
 * Approval decision
 */
export type ApprovalDecision = 'approve' | 'reject' | 'request_changes';
/**
 * Notification type
 */
export type NotificationType = 'mention' | 'comment' | 'annotation' | 'review' | 'approval' | 'share';
/**
 * Permission type
 */
export type PermissionType = 'view' | 'comment' | 'annotate' | 'edit' | 'review' | 'approve' | 'admin';
/**
 * Document comment
 */
export interface DocumentComment {
    id: string;
    documentId: string;
    parentCommentId?: string;
    pageNumber?: number;
    positionX?: number;
    positionY?: number;
    content: string;
    authorId: string;
    status: CommentStatus;
    isEdited: boolean;
    mentions?: string[];
    attachments?: any[];
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    resolvedBy?: string;
}
/**
 * Document annotation
 */
export interface DocumentAnnotation {
    id: string;
    documentId: string;
    pageNumber: number;
    annotationType: AnnotationType;
    coordinates: {
        x: number;
        y: number;
        width?: number;
        height?: number;
        points?: number[][];
    };
    color: string;
    content?: string;
    authorId: string;
    isShared: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Collaboration session
 */
export interface CollaborationSession {
    id: string;
    documentId: string;
    sessionId: string;
    participants: UserParticipant[];
    activeUsers: string[];
    startedAt: Date;
    lastActivityAt: Date;
    endedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * User participant
 */
export interface UserParticipant {
    userId: string;
    userName: string;
    userEmail?: string;
    userAvatar?: string;
    joinedAt: Date;
    role?: string;
}
/**
 * User presence
 */
export interface UserPresence {
    id: string;
    userId: string;
    documentId: string;
    sessionId: string;
    status: PresenceStatus;
    currentPage?: number;
    cursorPosition?: {
        x: number;
        y: number;
    };
    lastSeenAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Review workflow
 */
export interface ReviewWorkflow {
    id: string;
    documentId: string;
    workflowType: 'sequential' | 'parallel' | 'custom';
    status: WorkflowStatus;
    currentStage: number;
    totalStages: number;
    createdBy: string;
    startedAt?: Date;
    completedAt?: Date;
    deadline?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Review approval
 */
export interface ReviewApproval {
    id: string;
    workflowId: string;
    documentId: string;
    reviewerId: string;
    stage: number;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    decision?: ApprovalDecision;
    comments?: string;
    reviewedAt?: Date;
    deadline?: Date;
    createdAt: Date;
}
/**
 * Document notification
 */
export interface DocumentNotification {
    id: string;
    userId: string;
    documentId: string;
    notificationType: NotificationType;
    title: string;
    message: string;
    referenceId?: string;
    isRead: boolean;
    isSent: boolean;
    sentAt?: Date;
    readAt?: Date;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Document permission
 */
export interface DocumentPermission {
    id: string;
    documentId: string;
    userId?: string;
    roleId?: string;
    permissionType: PermissionType;
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    revokedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Comment thread
 */
export interface CommentThread {
    rootComment: DocumentComment;
    replies: DocumentComment[];
    totalReplies: number;
    unresolvedCount: number;
}
/**
 * Mention notification data
 */
export interface MentionData {
    mentionedUserId: string;
    mentionerUserId: string;
    commentId: string;
    commentContent: string;
    documentId: string;
    pageNumber?: number;
}
/**
 * Real-time event
 */
export interface RealtimeEvent {
    type: string;
    documentId: string;
    userId: string;
    data: any;
    timestamp: Date;
}
/**
 * Creates DocumentComment model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentComment>>} DocumentComment model
 *
 * @example
 * ```typescript
 * const CommentModel = createDocumentCommentModel(sequelize);
 * const comment = await CommentModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 5,
 *   positionX: 100.5,
 *   positionY: 200.3,
 *   content: 'This section needs clarification',
 *   authorId: 'user-uuid',
 *   status: 'active',
 *   mentions: ['user-123', 'user-456']
 * });
 * ```
 */
export declare const createDocumentCommentModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentAnnotation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentAnnotation>>} DocumentAnnotation model
 *
 * @example
 * ```typescript
 * const AnnotationModel = createDocumentAnnotationModel(sequelize);
 * const annotation = await AnnotationModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 3,
 *   annotationType: 'highlight',
 *   coordinates: { x: 100, y: 200, width: 300, height: 50 },
 *   color: '#ffff00',
 *   authorId: 'user-uuid',
 *   isShared: true
 * });
 * ```
 */
export declare const createDocumentAnnotationModel: (sequelize: Sequelize) => any;
/**
 * Creates CollaborationSession model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<CollaborationSession>>} CollaborationSession model
 *
 * @example
 * ```typescript
 * const SessionModel = createCollaborationSessionModel(sequelize);
 * const session = await SessionModel.create({
 *   documentId: 'doc-uuid',
 *   sessionId: 'session-123',
 *   participants: [
 *     { userId: 'user-1', userName: 'Dr. Smith', joinedAt: new Date() }
 *   ],
 *   activeUsers: ['user-1'],
 *   startedAt: new Date(),
 *   lastActivityAt: new Date()
 * });
 * ```
 */
export declare const createCollaborationSessionModel: (sequelize: Sequelize) => any;
/**
 * Creates UserPresence model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<UserPresence>>} UserPresence model
 *
 * @example
 * ```typescript
 * const PresenceModel = createUserPresenceModel(sequelize);
 * const presence = await PresenceModel.create({
 *   userId: 'user-uuid',
 *   documentId: 'doc-uuid',
 *   sessionId: 'session-123',
 *   status: 'active',
 *   currentPage: 5,
 *   cursorPosition: { x: 500, y: 300 },
 *   lastSeenAt: new Date()
 * });
 * ```
 */
export declare const createUserPresenceModel: (sequelize: Sequelize) => any;
/**
 * Creates ReviewWorkflow model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReviewWorkflow>>} ReviewWorkflow model
 *
 * @example
 * ```typescript
 * const WorkflowModel = createReviewWorkflowModel(sequelize);
 * const workflow = await WorkflowModel.create({
 *   documentId: 'doc-uuid',
 *   workflowType: 'sequential',
 *   status: 'pending',
 *   currentStage: 1,
 *   totalStages: 3,
 *   createdBy: 'user-uuid',
 *   deadline: new Date('2024-12-31')
 * });
 * ```
 */
export declare const createReviewWorkflowModel: (sequelize: Sequelize) => any;
/**
 * Creates ReviewApproval model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReviewApproval>>} ReviewApproval model
 *
 * @example
 * ```typescript
 * const ApprovalModel = createReviewApprovalModel(sequelize);
 * const approval = await ApprovalModel.create({
 *   workflowId: 'workflow-uuid',
 *   documentId: 'doc-uuid',
 *   reviewerId: 'user-uuid',
 *   stage: 1,
 *   status: 'pending',
 *   deadline: new Date('2024-12-15')
 * });
 * ```
 */
export declare const createReviewApprovalModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentNotification model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentNotification>>} DocumentNotification model
 *
 * @example
 * ```typescript
 * const NotificationModel = createDocumentNotificationModel(sequelize);
 * const notification = await NotificationModel.create({
 *   userId: 'user-uuid',
 *   documentId: 'doc-uuid',
 *   notificationType: 'mention',
 *   title: 'You were mentioned',
 *   message: 'Dr. Smith mentioned you in a comment',
 *   referenceId: 'comment-uuid',
 *   isRead: false,
 *   isSent: false
 * });
 * ```
 */
export declare const createDocumentNotificationModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentPermission model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentPermission>>} DocumentPermission model
 *
 * @example
 * ```typescript
 * const PermissionModel = createDocumentPermissionModel(sequelize);
 * const permission = await PermissionModel.create({
 *   documentId: 'doc-uuid',
 *   userId: 'user-uuid',
 *   permissionType: 'comment',
 *   grantedBy: 'admin-uuid',
 *   grantedAt: new Date(),
 *   expiresAt: new Date('2024-12-31')
 * });
 * ```
 */
export declare const createDocumentPermissionModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates collaboration session for document.
 *
 * @param {string} documentId - Document ID
 * @param {UserParticipant} initialParticipant - Initial participant
 * @returns {Promise<CollaborationSession>} Created session
 *
 * @example
 * ```typescript
 * const session = await createCollaborationSession('doc-123', {
 *   userId: 'user-456',
 *   userName: 'Dr. Smith',
 *   userEmail: 'smith@example.com',
 *   joinedAt: new Date(),
 *   role: 'reviewer'
 * });
 * ```
 */
export declare const createCollaborationSession: (documentId: string, initialParticipant: UserParticipant) => Promise<CollaborationSession>;
/**
 * 2. Joins user to collaboration session.
 *
 * @param {string} sessionId - Session ID
 * @param {UserParticipant} participant - User joining session
 * @returns {Promise<CollaborationSession>} Updated session
 *
 * @example
 * ```typescript
 * const session = await joinCollaborationSession('session-123', {
 *   userId: 'user-789',
 *   userName: 'Dr. Johnson',
 *   joinedAt: new Date()
 * });
 * ```
 */
export declare const joinCollaborationSession: (sessionId: string, participant: UserParticipant) => Promise<CollaborationSession>;
/**
 * 3. Removes user from collaboration session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID to remove
 * @returns {Promise<CollaborationSession>} Updated session
 *
 * @example
 * ```typescript
 * await leaveCollaborationSession('session-123', 'user-456');
 * ```
 */
export declare const leaveCollaborationSession: (sessionId: string, userId: string) => Promise<CollaborationSession>;
/**
 * 4. Gets active collaboration sessions for document.
 *
 * @param {string} documentId - Document ID
 * @returns {Promise<CollaborationSession[]>} Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getActiveCollaborationSessions('doc-123');
 * console.log(`${sessions.length} active sessions`);
 * ```
 */
export declare const getActiveCollaborationSessions: (documentId: string) => Promise<CollaborationSession[]>;
/**
 * 5. Broadcasts event to all session participants.
 *
 * @param {string} sessionId - Session ID
 * @param {RealtimeEvent} event - Event to broadcast
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await broadcastToSession('session-123', {
 *   type: 'comment_added',
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   data: { commentId: 'comment-789' },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const broadcastToSession: (sessionId: string, event: RealtimeEvent) => Promise<void>;
/**
 * 6. Syncs document changes across all sessions.
 *
 * @param {string} documentId - Document ID
 * @param {Object} change - Change data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await syncDocumentChange('doc-123', {
 *   type: 'annotation_added',
 *   annotationId: 'anno-456',
 *   userId: 'user-789'
 * });
 * ```
 */
export declare const syncDocumentChange: (documentId: string, change: any) => Promise<void>;
/**
 * 7. Updates user presence in document.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {Partial<UserPresence>} presence - Presence data
 * @returns {Promise<UserPresence>} Updated presence
 *
 * @example
 * ```typescript
 * const presence = await updateUserPresence('user-123', 'doc-456', {
 *   status: 'active',
 *   currentPage: 5,
 *   cursorPosition: { x: 500, y: 300 }
 * });
 * ```
 */
export declare const updateUserPresence: (userId: string, documentId: string, presence: Partial<UserPresence>) => Promise<UserPresence>;
/**
 * 8. Gets all active users in document.
 *
 * @param {string} documentId - Document ID
 * @returns {Promise<UserPresence[]>} Active users
 *
 * @example
 * ```typescript
 * const activeUsers = await getActiveUsersInDocument('doc-123');
 * console.log(`${activeUsers.length} users currently viewing`);
 * ```
 */
export declare const getActiveUsersInDocument: (documentId: string) => Promise<UserPresence[]>;
/**
 * 9. Updates user cursor position.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {Object} position - Cursor position
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCursorPosition('user-123', 'doc-456', {
 *   x: 750,
 *   y: 450,
 *   page: 3
 * });
 * ```
 */
export declare const updateCursorPosition: (userId: string, documentId: string, position: {
    x: number;
    y: number;
    page?: number;
}) => Promise<void>;
/**
 * 10. Tracks user page navigation.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - New page number
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackPageNavigation('user-123', 'doc-456', 7);
 * ```
 */
export declare const trackPageNavigation: (userId: string, documentId: string, pageNumber: number) => Promise<void>;
/**
 * 11. Sets user status (active, idle, away).
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {PresenceStatus} status - Presence status
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setUserStatus('user-123', 'doc-456', 'idle');
 * ```
 */
export declare const setUserStatus: (userId: string, documentId: string, status: PresenceStatus) => Promise<void>;
/**
 * 12. Cleans up stale presence records.
 *
 * @param {number} timeoutMinutes - Timeout in minutes
 * @returns {Promise<number>} Number of records cleaned
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupStalePresence(15);
 * console.log(`Removed ${cleaned} stale presence records`);
 * ```
 */
export declare const cleanupStalePresence: (timeoutMinutes: number) => Promise<number>;
/**
 * 13. Creates new comment on document.
 *
 * @param {Partial<DocumentComment>} comment - Comment data
 * @returns {Promise<DocumentComment>} Created comment
 *
 * @example
 * ```typescript
 * const comment = await createComment({
 *   documentId: 'doc-123',
 *   pageNumber: 5,
 *   positionX: 100,
 *   positionY: 200,
 *   content: 'Please clarify this section',
 *   authorId: 'user-456',
 *   mentions: ['user-789']
 * });
 * ```
 */
export declare const createComment: (comment: Partial<DocumentComment>) => Promise<DocumentComment>;
/**
 * 14. Replies to existing comment.
 *
 * @param {string} parentCommentId - Parent comment ID
 * @param {Partial<DocumentComment>} reply - Reply data
 * @returns {Promise<DocumentComment>} Created reply
 *
 * @example
 * ```typescript
 * const reply = await replyToComment('comment-123', {
 *   documentId: 'doc-456',
 *   content: 'I agree with this assessment',
 *   authorId: 'user-789'
 * });
 * ```
 */
export declare const replyToComment: (parentCommentId: string, reply: Partial<DocumentComment>) => Promise<DocumentComment>;
/**
 * 15. Gets comment thread with all replies.
 *
 * @param {string} rootCommentId - Root comment ID
 * @returns {Promise<CommentThread>} Comment thread
 *
 * @example
 * ```typescript
 * const thread = await getCommentThread('comment-123');
 * console.log(`${thread.totalReplies} replies`);
 * ```
 */
export declare const getCommentThread: (rootCommentId: string) => Promise<CommentThread>;
/**
 * 16. Gets all comments for document page.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @returns {Promise<DocumentComment[]>} Comments on page
 *
 * @example
 * ```typescript
 * const comments = await getCommentsForPage('doc-123', 5);
 * ```
 */
export declare const getCommentsForPage: (documentId: string, pageNumber: number) => Promise<DocumentComment[]>;
/**
 * 17. Resolves comment thread.
 *
 * @param {string} commentId - Comment ID
 * @param {string} resolvedBy - User ID resolving comment
 * @returns {Promise<DocumentComment>} Updated comment
 *
 * @example
 * ```typescript
 * await resolveComment('comment-123', 'user-456');
 * ```
 */
export declare const resolveComment: (commentId: string, resolvedBy: string) => Promise<DocumentComment>;
/**
 * 18. Edits existing comment.
 *
 * @param {string} commentId - Comment ID
 * @param {string} newContent - Updated content
 * @returns {Promise<DocumentComment>} Updated comment
 *
 * @example
 * ```typescript
 * const updated = await editComment('comment-123', 'Updated comment text');
 * ```
 */
export declare const editComment: (commentId: string, newContent: string) => Promise<DocumentComment>;
/**
 * 19. Deletes comment (soft delete).
 *
 * @param {string} commentId - Comment ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteComment('comment-123');
 * ```
 */
export declare const deleteComment: (commentId: string) => Promise<void>;
/**
 * 20. Extracts mentions from comment content.
 *
 * @param {string} content - Comment content
 * @returns {string[]} Array of mentioned user IDs
 *
 * @example
 * ```typescript
 * const mentions = extractMentions('@user-123 please review @user-456');
 * // Returns ['user-123', 'user-456']
 * ```
 */
export declare const extractMentions: (content: string) => string[];
/**
 * 21. Creates mention notification.
 *
 * @param {MentionData} mentionData - Mention data
 * @returns {Promise<DocumentNotification>} Created notification
 *
 * @example
 * ```typescript
 * await createMentionNotification({
 *   mentionedUserId: 'user-123',
 *   mentionerUserId: 'user-456',
 *   commentId: 'comment-789',
 *   commentContent: 'Review this please',
 *   documentId: 'doc-abc',
 *   pageNumber: 5
 * });
 * ```
 */
export declare const createMentionNotification: (mentionData: MentionData) => Promise<DocumentNotification>;
/**
 * 22. Creates comment notification.
 *
 * @param {string} userId - User to notify
 * @param {DocumentComment} comment - Comment data
 * @returns {Promise<DocumentNotification>} Created notification
 *
 * @example
 * ```typescript
 * await createCommentNotification('user-123', comment);
 * ```
 */
export declare const createCommentNotification: (userId: string, comment: DocumentComment) => Promise<DocumentNotification>;
/**
 * 23. Gets unread notifications for user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<DocumentNotification[]>} Unread notifications
 *
 * @example
 * ```typescript
 * const unread = await getUnreadNotifications('user-123');
 * console.log(`${unread.length} unread notifications`);
 * ```
 */
export declare const getUnreadNotifications: (userId: string) => Promise<DocumentNotification[]>;
/**
 * 24. Marks notification as read.
 *
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markNotificationAsRead('notification-123');
 * ```
 */
export declare const markNotificationAsRead: (notificationId: string) => Promise<void>;
/**
 * 25. Sends email notification.
 *
 * @param {DocumentNotification} notification - Notification to send
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendEmailNotification(notification);
 * ```
 */
export declare const sendEmailNotification: (notification: DocumentNotification) => Promise<void>;
/**
 * 26. Batches notifications for digest email.
 *
 * @param {string} userId - User ID
 * @param {Date} since - Notifications since this date
 * @returns {Promise<DocumentNotification[]>} Batched notifications
 *
 * @example
 * ```typescript
 * const notifications = await batchNotifications('user-123', new Date('2024-01-01'));
 * ```
 */
export declare const batchNotifications: (userId: string, since: Date) => Promise<DocumentNotification[]>;
/**
 * 27. Creates annotation on document.
 *
 * @param {Partial<DocumentAnnotation>} annotation - Annotation data
 * @returns {Promise<DocumentAnnotation>} Created annotation
 *
 * @example
 * ```typescript
 * const annotation = await createAnnotation({
 *   documentId: 'doc-123',
 *   pageNumber: 5,
 *   annotationType: 'highlight',
 *   coordinates: { x: 100, y: 200, width: 300, height: 50 },
 *   color: '#ffff00',
 *   authorId: 'user-456',
 *   isShared: true
 * });
 * ```
 */
export declare const createAnnotation: (annotation: Partial<DocumentAnnotation>) => Promise<DocumentAnnotation>;
/**
 * 28. Updates existing annotation.
 *
 * @param {string} annotationId - Annotation ID
 * @param {Partial<DocumentAnnotation>} updates - Updates to apply
 * @returns {Promise<DocumentAnnotation>} Updated annotation
 *
 * @example
 * ```typescript
 * await updateAnnotation('anno-123', {
 *   color: '#ff0000',
 *   content: 'Updated note'
 * });
 * ```
 */
export declare const updateAnnotation: (annotationId: string, updates: Partial<DocumentAnnotation>) => Promise<DocumentAnnotation>;
/**
 * 29. Deletes annotation.
 *
 * @param {string} annotationId - Annotation ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteAnnotation('anno-123');
 * ```
 */
export declare const deleteAnnotation: (annotationId: string) => Promise<void>;
/**
 * 30. Gets all annotations for page.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} [filters] - Optional filters
 * @returns {Promise<DocumentAnnotation[]>} Annotations on page
 *
 * @example
 * ```typescript
 * const annotations = await getAnnotationsForPage('doc-123', 5, {
 *   authorId: 'user-456',
 *   type: 'highlight'
 * });
 * ```
 */
export declare const getAnnotationsForPage: (documentId: string, pageNumber: number, filters?: {
    authorId?: string;
    type?: AnnotationType;
}) => Promise<DocumentAnnotation[]>;
/**
 * 31. Shares annotation with other users.
 *
 * @param {string} annotationId - Annotation ID
 * @param {boolean} isShared - Whether to share
 * @returns {Promise<DocumentAnnotation>} Updated annotation
 *
 * @example
 * ```typescript
 * await shareAnnotation('anno-123', true);
 * ```
 */
export declare const shareAnnotation: (annotationId: string, isShared: boolean) => Promise<DocumentAnnotation>;
/**
 * 32. Filters annotations by author.
 *
 * @param {string} documentId - Document ID
 * @param {string} authorId - Author user ID
 * @returns {Promise<DocumentAnnotation[]>} Author's annotations
 *
 * @example
 * ```typescript
 * const myAnnotations = await getAnnotationsByAuthor('doc-123', 'user-456');
 * ```
 */
export declare const getAnnotationsByAuthor: (documentId: string, authorId: string) => Promise<DocumentAnnotation[]>;
/**
 * 33. Creates review workflow for document.
 *
 * @param {Partial<ReviewWorkflow>} workflow - Workflow data
 * @returns {Promise<ReviewWorkflow>} Created workflow
 *
 * @example
 * ```typescript
 * const workflow = await createReviewWorkflow({
 *   documentId: 'doc-123',
 *   workflowType: 'sequential',
 *   totalStages: 3,
 *   createdBy: 'user-456',
 *   deadline: new Date('2024-12-31')
 * });
 * ```
 */
export declare const createReviewWorkflow: (workflow: Partial<ReviewWorkflow>) => Promise<ReviewWorkflow>;
/**
 * 34. Adds reviewer to workflow stage.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} reviewerId - Reviewer user ID
 * @param {number} stage - Stage number
 * @param {Date} [deadline] - Review deadline
 * @returns {Promise<ReviewApproval>} Created approval
 *
 * @example
 * ```typescript
 * await addReviewer('workflow-123', 'user-456', 1, new Date('2024-12-15'));
 * ```
 */
export declare const addReviewer: (workflowId: string, reviewerId: string, stage: number, deadline?: Date) => Promise<ReviewApproval>;
/**
 * 35. Submits review approval/rejection.
 *
 * @param {string} approvalId - Approval ID
 * @param {ApprovalDecision} decision - Approval decision
 * @param {string} [comments] - Review comments
 * @returns {Promise<ReviewApproval>} Updated approval
 *
 * @example
 * ```typescript
 * await submitReview('approval-123', 'approve', 'Looks good to me');
 * ```
 */
export declare const submitReview: (approvalId: string, decision: ApprovalDecision, comments?: string) => Promise<ReviewApproval>;
/**
 * 36. Advances workflow to next stage.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<ReviewWorkflow>} Updated workflow
 *
 * @example
 * ```typescript
 * await advanceWorkflowStage('workflow-123');
 * ```
 */
export declare const advanceWorkflowStage: (workflowId: string) => Promise<ReviewWorkflow>;
/**
 * 37. Gets workflow status and progress.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<{ workflow: ReviewWorkflow; approvals: ReviewApproval[] }>} Workflow details
 *
 * @example
 * ```typescript
 * const { workflow, approvals } = await getWorkflowStatus('workflow-123');
 * console.log(`Stage ${workflow.currentStage}/${workflow.totalStages}`);
 * ```
 */
export declare const getWorkflowStatus: (workflowId: string) => Promise<{
    workflow: ReviewWorkflow;
    approvals: ReviewApproval[];
}>;
/**
 * 38. Completes review workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {WorkflowStatus} finalStatus - Final workflow status
 * @returns {Promise<ReviewWorkflow>} Completed workflow
 *
 * @example
 * ```typescript
 * await completeWorkflow('workflow-123', 'approved');
 * ```
 */
export declare const completeWorkflow: (workflowId: string, finalStatus: WorkflowStatus) => Promise<ReviewWorkflow>;
/**
 * 39. Grants permission to user for document.
 *
 * @param {Partial<DocumentPermission>} permission - Permission data
 * @returns {Promise<DocumentPermission>} Created permission
 *
 * @example
 * ```typescript
 * await grantPermission({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   permissionType: 'comment',
 *   grantedBy: 'admin-789',
 *   expiresAt: new Date('2024-12-31')
 * });
 * ```
 */
export declare const grantPermission: (permission: Partial<DocumentPermission>) => Promise<DocumentPermission>;
/**
 * 40. Revokes permission from user.
 *
 * @param {string} permissionId - Permission ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokePermission('permission-123');
 * ```
 */
export declare const revokePermission: (permissionId: string) => Promise<void>;
/**
 * 41. Checks if user has specific permission.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {PermissionType} permissionType - Permission to check
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canComment = await checkPermission('user-123', 'doc-456', 'comment');
 * if (!canComment) throw new Error('Insufficient permissions');
 * ```
 */
export declare const checkPermission: (userId: string, documentId: string, permissionType: PermissionType) => Promise<boolean>;
/**
 * 42. Gets all permissions for document.
 *
 * @param {string} documentId - Document ID
 * @returns {Promise<DocumentPermission[]>} Document permissions
 *
 * @example
 * ```typescript
 * const permissions = await getDocumentPermissions('doc-123');
 * ```
 */
export declare const getDocumentPermissions: (documentId: string) => Promise<DocumentPermission[]>;
/**
 * 43. Gets user's permissions across documents.
 *
 * @param {string} userId - User ID
 * @returns {Promise<DocumentPermission[]>} User's permissions
 *
 * @example
 * ```typescript
 * const myPermissions = await getUserPermissions('user-123');
 * ```
 */
export declare const getUserPermissions: (userId: string) => Promise<DocumentPermission[]>;
/**
 * 44. Validates access to document.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {PermissionType} action - Action to perform
 * @returns {Promise<boolean>} True if access granted
 *
 * @example
 * ```typescript
 * const hasAccess = await validateAccess('user-123', 'doc-456', 'view');
 * if (!hasAccess) throw new UnauthorizedError();
 * ```
 */
export declare const validateAccess: (userId: string, documentId: string, action: PermissionType) => Promise<boolean>;
/**
 * 45. Creates audit log for collaboration action.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {string} action - Action performed
 * @param {Object} [metadata] - Additional metadata
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logCollaborationAction('user-123', 'doc-456', 'comment_created', {
 *   commentId: 'comment-789',
 *   pageNumber: 5
 * });
 * ```
 */
export declare const logCollaborationAction: (userId: string, documentId: string, action: string, metadata?: Record<string, any>) => Promise<void>;
declare const _default: {
    createCollaborationSession: (documentId: string, initialParticipant: UserParticipant) => Promise<CollaborationSession>;
    joinCollaborationSession: (sessionId: string, participant: UserParticipant) => Promise<CollaborationSession>;
    leaveCollaborationSession: (sessionId: string, userId: string) => Promise<CollaborationSession>;
    getActiveCollaborationSessions: (documentId: string) => Promise<CollaborationSession[]>;
    broadcastToSession: (sessionId: string, event: RealtimeEvent) => Promise<void>;
    syncDocumentChange: (documentId: string, change: any) => Promise<void>;
    updateUserPresence: (userId: string, documentId: string, presence: Partial<UserPresence>) => Promise<UserPresence>;
    getActiveUsersInDocument: (documentId: string) => Promise<UserPresence[]>;
    updateCursorPosition: (userId: string, documentId: string, position: {
        x: number;
        y: number;
        page?: number;
    }) => Promise<void>;
    trackPageNavigation: (userId: string, documentId: string, pageNumber: number) => Promise<void>;
    setUserStatus: (userId: string, documentId: string, status: PresenceStatus) => Promise<void>;
    cleanupStalePresence: (timeoutMinutes: number) => Promise<number>;
    createComment: (comment: Partial<DocumentComment>) => Promise<DocumentComment>;
    replyToComment: (parentCommentId: string, reply: Partial<DocumentComment>) => Promise<DocumentComment>;
    getCommentThread: (rootCommentId: string) => Promise<CommentThread>;
    getCommentsForPage: (documentId: string, pageNumber: number) => Promise<DocumentComment[]>;
    resolveComment: (commentId: string, resolvedBy: string) => Promise<DocumentComment>;
    editComment: (commentId: string, newContent: string) => Promise<DocumentComment>;
    deleteComment: (commentId: string) => Promise<void>;
    extractMentions: (content: string) => string[];
    createMentionNotification: (mentionData: MentionData) => Promise<DocumentNotification>;
    createCommentNotification: (userId: string, comment: DocumentComment) => Promise<DocumentNotification>;
    getUnreadNotifications: (userId: string) => Promise<DocumentNotification[]>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    sendEmailNotification: (notification: DocumentNotification) => Promise<void>;
    batchNotifications: (userId: string, since: Date) => Promise<DocumentNotification[]>;
    createAnnotation: (annotation: Partial<DocumentAnnotation>) => Promise<DocumentAnnotation>;
    updateAnnotation: (annotationId: string, updates: Partial<DocumentAnnotation>) => Promise<DocumentAnnotation>;
    deleteAnnotation: (annotationId: string) => Promise<void>;
    getAnnotationsForPage: (documentId: string, pageNumber: number, filters?: {
        authorId?: string;
        type?: AnnotationType;
    }) => Promise<DocumentAnnotation[]>;
    shareAnnotation: (annotationId: string, isShared: boolean) => Promise<DocumentAnnotation>;
    getAnnotationsByAuthor: (documentId: string, authorId: string) => Promise<DocumentAnnotation[]>;
    createReviewWorkflow: (workflow: Partial<ReviewWorkflow>) => Promise<ReviewWorkflow>;
    addReviewer: (workflowId: string, reviewerId: string, stage: number, deadline?: Date) => Promise<ReviewApproval>;
    submitReview: (approvalId: string, decision: ApprovalDecision, comments?: string) => Promise<ReviewApproval>;
    advanceWorkflowStage: (workflowId: string) => Promise<ReviewWorkflow>;
    getWorkflowStatus: (workflowId: string) => Promise<{
        workflow: ReviewWorkflow;
        approvals: ReviewApproval[];
    }>;
    completeWorkflow: (workflowId: string, finalStatus: WorkflowStatus) => Promise<ReviewWorkflow>;
    grantPermission: (permission: Partial<DocumentPermission>) => Promise<DocumentPermission>;
    revokePermission: (permissionId: string) => Promise<void>;
    checkPermission: (userId: string, documentId: string, permissionType: PermissionType) => Promise<boolean>;
    getDocumentPermissions: (documentId: string) => Promise<DocumentPermission[]>;
    getUserPermissions: (userId: string) => Promise<DocumentPermission[]>;
    validateAccess: (userId: string, documentId: string, action: PermissionType) => Promise<boolean>;
    logCollaborationAction: (userId: string, documentId: string, action: string, metadata?: Record<string, any>) => Promise<void>;
    createDocumentCommentModel: (sequelize: Sequelize) => any;
    createDocumentAnnotationModel: (sequelize: Sequelize) => any;
    createCollaborationSessionModel: (sequelize: Sequelize) => any;
    createUserPresenceModel: (sequelize: Sequelize) => any;
    createReviewWorkflowModel: (sequelize: Sequelize) => any;
    createReviewApprovalModel: (sequelize: Sequelize) => any;
    createDocumentNotificationModel: (sequelize: Sequelize) => any;
    createDocumentPermissionModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-collaboration-kit.d.ts.map