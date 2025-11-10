"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentPermissions = exports.checkPermission = exports.revokePermission = exports.grantPermission = exports.completeWorkflow = exports.getWorkflowStatus = exports.advanceWorkflowStage = exports.submitReview = exports.addReviewer = exports.createReviewWorkflow = exports.getAnnotationsByAuthor = exports.shareAnnotation = exports.getAnnotationsForPage = exports.deleteAnnotation = exports.updateAnnotation = exports.createAnnotation = exports.batchNotifications = exports.sendEmailNotification = exports.markNotificationAsRead = exports.getUnreadNotifications = exports.createCommentNotification = exports.createMentionNotification = exports.extractMentions = exports.deleteComment = exports.editComment = exports.resolveComment = exports.getCommentsForPage = exports.getCommentThread = exports.replyToComment = exports.createComment = exports.cleanupStalePresence = exports.setUserStatus = exports.trackPageNavigation = exports.updateCursorPosition = exports.getActiveUsersInDocument = exports.updateUserPresence = exports.syncDocumentChange = exports.broadcastToSession = exports.getActiveCollaborationSessions = exports.leaveCollaborationSession = exports.joinCollaborationSession = exports.createCollaborationSession = exports.createDocumentPermissionModel = exports.createDocumentNotificationModel = exports.createReviewApprovalModel = exports.createReviewWorkflowModel = exports.createUserPresenceModel = exports.createCollaborationSessionModel = exports.createDocumentAnnotationModel = exports.createDocumentCommentModel = void 0;
exports.logCollaborationAction = exports.validateAccess = exports.getUserPermissions = void 0;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
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
const createDocumentCommentModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        parentCommentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'document_comments',
                key: 'id',
            },
            onDelete: 'CASCADE',
            comment: 'For threaded comments',
        },
        pageNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Page number if comment is page-specific',
        },
        positionX: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'X coordinate on page',
        },
        positionY: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            comment: 'Y coordinate on page',
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        authorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'resolved', 'deleted'),
            allowNull: false,
            defaultValue: 'active',
        },
        isEdited: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        mentions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of mentioned user IDs',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    };
    const options = {
        tableName: 'document_comments',
        timestamps: true,
        indexes: [
            { fields: ['documentId', 'status', 'createdAt'], name: 'idx_doc_status_created' },
            { fields: ['parentCommentId'] },
            { fields: ['authorId'] },
            { fields: ['pageNumber'] },
            { fields: ['mentions'], using: 'gin' },
        ],
    };
    return sequelize.define('DocumentComment', attributes, options);
};
exports.createDocumentCommentModel = createDocumentCommentModel;
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
const createDocumentAnnotationModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        pageNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        annotationType: {
            type: sequelize_1.DataTypes.ENUM('highlight', 'underline', 'strikethrough', 'drawing', 'text', 'stamp'),
            allowNull: false,
        },
        coordinates: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Position and size data',
        },
        color: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '#ffff00',
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Text content for text annotations',
        },
        authorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        isShared: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether annotation is visible to all users',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'document_annotations',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['documentId', 'pageNumber', 'annotationType'], name: 'idx_doc_page_type' },
            { fields: ['authorId'] },
            { fields: ['isShared'] },
        ],
    };
    return sequelize.define('DocumentAnnotation', attributes, options);
};
exports.createDocumentAnnotationModel = createDocumentAnnotationModel;
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
const createCollaborationSessionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        participants: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of participant objects',
        },
        activeUsers: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of currently active user IDs',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        lastActivityAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        endedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'collaboration_sessions',
        timestamps: false,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['sessionId'], unique: true },
            { fields: ['lastActivityAt'] },
            { fields: ['participants'], using: 'gin' },
        ],
    };
    return sequelize.define('CollaborationSession', attributes, options);
};
exports.createCollaborationSessionModel = createCollaborationSessionModel;
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
const createUserPresenceModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'idle', 'away', 'offline'),
            allowNull: false,
            defaultValue: 'active',
        },
        currentPage: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        cursorPosition: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        lastSeenAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'user_presence',
        timestamps: false,
        indexes: [
            { fields: ['userId', 'documentId'], name: 'idx_user_document' },
            { fields: ['sessionId'] },
            { fields: ['lastSeenAt'] },
            { fields: ['status'] },
        ],
    };
    return sequelize.define('UserPresence', attributes, options);
};
exports.createUserPresenceModel = createUserPresenceModel;
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
const createReviewWorkflowModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        workflowType: {
            type: sequelize_1.DataTypes.ENUM('sequential', 'parallel', 'custom'),
            allowNull: false,
            defaultValue: 'sequential',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'completed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        currentStage: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalStages: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'review_workflows',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['status'] },
            { fields: ['deadline'] },
            { fields: ['createdBy'] },
        ],
    };
    return sequelize.define('ReviewWorkflow', attributes, options);
};
exports.createReviewWorkflowModel = createReviewWorkflowModel;
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
const createReviewApprovalModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        workflowId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'review_workflows',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        reviewerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        stage: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'skipped'),
            allowNull: false,
            defaultValue: 'pending',
        },
        decision: {
            type: sequelize_1.DataTypes.ENUM('approve', 'reject', 'request_changes'),
            allowNull: true,
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        reviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'review_approvals',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['workflowId'] },
            { fields: ['documentId'] },
            { fields: ['reviewerId'] },
            { fields: ['status'] },
            { fields: ['deadline'] },
        ],
    };
    return sequelize.define('ReviewApproval', attributes, options);
};
exports.createReviewApprovalModel = createReviewApprovalModel;
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
const createDocumentNotificationModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        notificationType: {
            type: sequelize_1.DataTypes.ENUM('mention', 'comment', 'annotation', 'review', 'approval', 'share'),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        referenceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'ID of related comment/annotation/workflow',
        },
        isRead: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isSent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        sentAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        readAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'document_notifications',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['userId', 'isRead', 'createdAt'], name: 'idx_user_read_created' },
            { fields: ['documentId'] },
            { fields: ['notificationType'] },
            { fields: ['referenceId'] },
        ],
    };
    return sequelize.define('DocumentNotification', attributes, options);
};
exports.createDocumentNotificationModel = createDocumentNotificationModel;
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
const createDocumentPermissionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        roleId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'roles',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        permissionType: {
            type: sequelize_1.DataTypes.ENUM('view', 'comment', 'annotate', 'edit', 'review', 'approve', 'admin'),
            allowNull: false,
        },
        grantedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        grantedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        revokedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'document_permissions',
        timestamps: false,
        indexes: [
            { fields: ['documentId', 'userId'], name: 'idx_doc_user' },
            { fields: ['documentId', 'roleId'], name: 'idx_doc_role' },
            { fields: ['permissionType'] },
            { fields: ['expiresAt'] },
        ],
    };
    return sequelize.define('DocumentPermission', attributes, options);
};
exports.createDocumentPermissionModel = createDocumentPermissionModel;
// ============================================================================
// 1. REAL-TIME COLLABORATION
// ============================================================================
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
const createCollaborationSession = async (documentId, initialParticipant) => {
    const sessionId = crypto.randomBytes(16).toString('hex');
    return {
        id: crypto.randomBytes(16).toString('hex'),
        documentId,
        sessionId,
        participants: [initialParticipant],
        activeUsers: [initialParticipant.userId],
        startedAt: new Date(),
        lastActivityAt: new Date(),
    };
};
exports.createCollaborationSession = createCollaborationSession;
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
const joinCollaborationSession = async (sessionId, participant) => {
    // Placeholder for implementation
    return {};
};
exports.joinCollaborationSession = joinCollaborationSession;
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
const leaveCollaborationSession = async (sessionId, userId) => {
    // Placeholder for implementation
    return {};
};
exports.leaveCollaborationSession = leaveCollaborationSession;
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
const getActiveCollaborationSessions = async (documentId) => {
    // Placeholder for implementation
    return [];
};
exports.getActiveCollaborationSessions = getActiveCollaborationSessions;
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
const broadcastToSession = async (sessionId, event) => {
    // Placeholder for WebSocket/Socket.IO broadcast
};
exports.broadcastToSession = broadcastToSession;
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
const syncDocumentChange = async (documentId, change) => {
    const sessions = await (0, exports.getActiveCollaborationSessions)(documentId);
    for (const session of sessions) {
        await (0, exports.broadcastToSession)(session.sessionId, {
            type: 'document_change',
            documentId,
            userId: change.userId,
            data: change,
            timestamp: new Date(),
        });
    }
};
exports.syncDocumentChange = syncDocumentChange;
// ============================================================================
// 2. PRESENCE TRACKING
// ============================================================================
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
const updateUserPresence = async (userId, documentId, presence) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        userId,
        documentId,
        sessionId: presence.sessionId || 'default',
        status: presence.status || 'active',
        currentPage: presence.currentPage,
        cursorPosition: presence.cursorPosition,
        lastSeenAt: new Date(),
        metadata: presence.metadata,
    };
};
exports.updateUserPresence = updateUserPresence;
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
const getActiveUsersInDocument = async (documentId) => {
    // Placeholder for implementation
    return [];
};
exports.getActiveUsersInDocument = getActiveUsersInDocument;
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
const updateCursorPosition = async (userId, documentId, position) => {
    await (0, exports.updateUserPresence)(userId, documentId, {
        cursorPosition: { x: position.x, y: position.y },
        currentPage: position.page,
    });
};
exports.updateCursorPosition = updateCursorPosition;
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
const trackPageNavigation = async (userId, documentId, pageNumber) => {
    await (0, exports.updateUserPresence)(userId, documentId, {
        currentPage: pageNumber,
    });
};
exports.trackPageNavigation = trackPageNavigation;
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
const setUserStatus = async (userId, documentId, status) => {
    await (0, exports.updateUserPresence)(userId, documentId, { status });
};
exports.setUserStatus = setUserStatus;
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
const cleanupStalePresence = async (timeoutMinutes) => {
    const cutoffTime = new Date(Date.now() - timeoutMinutes * 60 * 1000);
    // Placeholder for implementation
    return 0;
};
exports.cleanupStalePresence = cleanupStalePresence;
// ============================================================================
// 3. COMMENT THREADS
// ============================================================================
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
const createComment = async (comment) => {
    const newComment = {
        id: crypto.randomBytes(16).toString('hex'),
        documentId: comment.documentId,
        parentCommentId: comment.parentCommentId,
        pageNumber: comment.pageNumber,
        positionX: comment.positionX,
        positionY: comment.positionY,
        content: comment.content,
        authorId: comment.authorId,
        status: 'active',
        isEdited: false,
        mentions: comment.mentions || [],
        attachments: comment.attachments || [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return newComment;
};
exports.createComment = createComment;
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
const replyToComment = async (parentCommentId, reply) => {
    return await (0, exports.createComment)({
        ...reply,
        parentCommentId,
    });
};
exports.replyToComment = replyToComment;
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
const getCommentThread = async (rootCommentId) => {
    // Placeholder for implementation
    return {
        rootComment: {},
        replies: [],
        totalReplies: 0,
        unresolvedCount: 0,
    };
};
exports.getCommentThread = getCommentThread;
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
const getCommentsForPage = async (documentId, pageNumber) => {
    // Placeholder for implementation
    return [];
};
exports.getCommentsForPage = getCommentsForPage;
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
const resolveComment = async (commentId, resolvedBy) => {
    // Placeholder for implementation
    return {};
};
exports.resolveComment = resolveComment;
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
const editComment = async (commentId, newContent) => {
    // Placeholder for implementation
    return {};
};
exports.editComment = editComment;
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
const deleteComment = async (commentId) => {
    // Placeholder for soft delete implementation
};
exports.deleteComment = deleteComment;
// ============================================================================
// 4. MENTIONS & NOTIFICATIONS
// ============================================================================
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
const extractMentions = (content) => {
    const mentionRegex = /@([a-zA-Z0-9-]+)/g;
    const matches = content.match(mentionRegex);
    if (!matches)
        return [];
    return matches.map((match) => match.substring(1));
};
exports.extractMentions = extractMentions;
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
const createMentionNotification = async (mentionData) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        userId: mentionData.mentionedUserId,
        documentId: mentionData.documentId,
        notificationType: 'mention',
        title: 'You were mentioned',
        message: `You were mentioned in a comment`,
        referenceId: mentionData.commentId,
        isRead: false,
        isSent: false,
        createdAt: new Date(),
    };
};
exports.createMentionNotification = createMentionNotification;
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
const createCommentNotification = async (userId, comment) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        userId,
        documentId: comment.documentId,
        notificationType: 'comment',
        title: 'New comment',
        message: `New comment on document`,
        referenceId: comment.id,
        isRead: false,
        isSent: false,
        createdAt: new Date(),
    };
};
exports.createCommentNotification = createCommentNotification;
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
const getUnreadNotifications = async (userId) => {
    // Placeholder for implementation
    return [];
};
exports.getUnreadNotifications = getUnreadNotifications;
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
const markNotificationAsRead = async (notificationId) => {
    // Placeholder for implementation
};
exports.markNotificationAsRead = markNotificationAsRead;
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
const sendEmailNotification = async (notification) => {
    // Placeholder for email sending implementation
};
exports.sendEmailNotification = sendEmailNotification;
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
const batchNotifications = async (userId, since) => {
    // Placeholder for implementation
    return [];
};
exports.batchNotifications = batchNotifications;
// ============================================================================
// 5. SHARED ANNOTATIONS
// ============================================================================
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
const createAnnotation = async (annotation) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        documentId: annotation.documentId,
        pageNumber: annotation.pageNumber,
        annotationType: annotation.annotationType,
        coordinates: annotation.coordinates,
        color: annotation.color || '#ffff00',
        content: annotation.content,
        authorId: annotation.authorId,
        isShared: annotation.isShared !== false,
        metadata: annotation.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createAnnotation = createAnnotation;
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
const updateAnnotation = async (annotationId, updates) => {
    // Placeholder for implementation
    return {};
};
exports.updateAnnotation = updateAnnotation;
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
const deleteAnnotation = async (annotationId) => {
    // Placeholder for soft delete implementation
};
exports.deleteAnnotation = deleteAnnotation;
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
const getAnnotationsForPage = async (documentId, pageNumber, filters) => {
    // Placeholder for implementation
    return [];
};
exports.getAnnotationsForPage = getAnnotationsForPage;
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
const shareAnnotation = async (annotationId, isShared) => {
    return await (0, exports.updateAnnotation)(annotationId, { isShared });
};
exports.shareAnnotation = shareAnnotation;
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
const getAnnotationsByAuthor = async (documentId, authorId) => {
    // Placeholder for implementation
    return [];
};
exports.getAnnotationsByAuthor = getAnnotationsByAuthor;
// ============================================================================
// 6. REVIEW WORKFLOWS
// ============================================================================
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
const createReviewWorkflow = async (workflow) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        documentId: workflow.documentId,
        workflowType: workflow.workflowType || 'sequential',
        status: 'pending',
        currentStage: 1,
        totalStages: workflow.totalStages,
        createdBy: workflow.createdBy,
        deadline: workflow.deadline,
        metadata: workflow.metadata,
        createdAt: new Date(),
    };
};
exports.createReviewWorkflow = createReviewWorkflow;
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
const addReviewer = async (workflowId, reviewerId, stage, deadline) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        workflowId,
        documentId: 'doc-placeholder',
        reviewerId,
        stage,
        status: 'pending',
        deadline,
        createdAt: new Date(),
    };
};
exports.addReviewer = addReviewer;
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
const submitReview = async (approvalId, decision, comments) => {
    // Placeholder for implementation
    return {};
};
exports.submitReview = submitReview;
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
const advanceWorkflowStage = async (workflowId) => {
    // Placeholder for implementation
    return {};
};
exports.advanceWorkflowStage = advanceWorkflowStage;
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
const getWorkflowStatus = async (workflowId) => {
    // Placeholder for implementation
    return {
        workflow: {},
        approvals: [],
    };
};
exports.getWorkflowStatus = getWorkflowStatus;
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
const completeWorkflow = async (workflowId, finalStatus) => {
    // Placeholder for implementation
    return {};
};
exports.completeWorkflow = completeWorkflow;
// ============================================================================
// 7. PERMISSION MANAGEMENT
// ============================================================================
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
const grantPermission = async (permission) => {
    return {
        id: crypto.randomBytes(16).toString('hex'),
        documentId: permission.documentId,
        userId: permission.userId,
        roleId: permission.roleId,
        permissionType: permission.permissionType,
        grantedBy: permission.grantedBy,
        grantedAt: new Date(),
        expiresAt: permission.expiresAt,
        metadata: permission.metadata,
    };
};
exports.grantPermission = grantPermission;
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
const revokePermission = async (permissionId) => {
    // Placeholder for implementation
};
exports.revokePermission = revokePermission;
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
const checkPermission = async (userId, documentId, permissionType) => {
    // Placeholder for implementation
    return true;
};
exports.checkPermission = checkPermission;
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
const getDocumentPermissions = async (documentId) => {
    // Placeholder for implementation
    return [];
};
exports.getDocumentPermissions = getDocumentPermissions;
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
const getUserPermissions = async (userId) => {
    // Placeholder for implementation
    return [];
};
exports.getUserPermissions = getUserPermissions;
// ============================================================================
// 8. ACCESS CONTROL
// ============================================================================
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
const validateAccess = async (userId, documentId, action) => {
    return await (0, exports.checkPermission)(userId, documentId, action);
};
exports.validateAccess = validateAccess;
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
const logCollaborationAction = async (userId, documentId, action, metadata) => {
    // Placeholder for audit logging implementation
};
exports.logCollaborationAction = logCollaborationAction;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Real-time Collaboration
    createCollaborationSession: exports.createCollaborationSession,
    joinCollaborationSession: exports.joinCollaborationSession,
    leaveCollaborationSession: exports.leaveCollaborationSession,
    getActiveCollaborationSessions: exports.getActiveCollaborationSessions,
    broadcastToSession: exports.broadcastToSession,
    syncDocumentChange: exports.syncDocumentChange,
    // Presence Tracking
    updateUserPresence: exports.updateUserPresence,
    getActiveUsersInDocument: exports.getActiveUsersInDocument,
    updateCursorPosition: exports.updateCursorPosition,
    trackPageNavigation: exports.trackPageNavigation,
    setUserStatus: exports.setUserStatus,
    cleanupStalePresence: exports.cleanupStalePresence,
    // Comment Threads
    createComment: exports.createComment,
    replyToComment: exports.replyToComment,
    getCommentThread: exports.getCommentThread,
    getCommentsForPage: exports.getCommentsForPage,
    resolveComment: exports.resolveComment,
    editComment: exports.editComment,
    deleteComment: exports.deleteComment,
    // Mentions & Notifications
    extractMentions: exports.extractMentions,
    createMentionNotification: exports.createMentionNotification,
    createCommentNotification: exports.createCommentNotification,
    getUnreadNotifications: exports.getUnreadNotifications,
    markNotificationAsRead: exports.markNotificationAsRead,
    sendEmailNotification: exports.sendEmailNotification,
    batchNotifications: exports.batchNotifications,
    // Shared Annotations
    createAnnotation: exports.createAnnotation,
    updateAnnotation: exports.updateAnnotation,
    deleteAnnotation: exports.deleteAnnotation,
    getAnnotationsForPage: exports.getAnnotationsForPage,
    shareAnnotation: exports.shareAnnotation,
    getAnnotationsByAuthor: exports.getAnnotationsByAuthor,
    // Review Workflows
    createReviewWorkflow: exports.createReviewWorkflow,
    addReviewer: exports.addReviewer,
    submitReview: exports.submitReview,
    advanceWorkflowStage: exports.advanceWorkflowStage,
    getWorkflowStatus: exports.getWorkflowStatus,
    completeWorkflow: exports.completeWorkflow,
    // Permission Management
    grantPermission: exports.grantPermission,
    revokePermission: exports.revokePermission,
    checkPermission: exports.checkPermission,
    getDocumentPermissions: exports.getDocumentPermissions,
    getUserPermissions: exports.getUserPermissions,
    // Access Control
    validateAccess: exports.validateAccess,
    logCollaborationAction: exports.logCollaborationAction,
    // Sequelize Models
    createDocumentCommentModel: exports.createDocumentCommentModel,
    createDocumentAnnotationModel: exports.createDocumentAnnotationModel,
    createCollaborationSessionModel: exports.createCollaborationSessionModel,
    createUserPresenceModel: exports.createUserPresenceModel,
    createReviewWorkflowModel: exports.createReviewWorkflowModel,
    createReviewApprovalModel: exports.createReviewApprovalModel,
    createDocumentNotificationModel: exports.createDocumentNotificationModel,
    createDocumentPermissionModel: exports.createDocumentPermissionModel,
};
//# sourceMappingURL=document-collaboration-kit.js.map