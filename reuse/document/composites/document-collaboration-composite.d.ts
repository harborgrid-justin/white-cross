/**
 * LOC: DOCCOLLAB001
 * File: /reuse/document/composites/document-collaboration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-collaboration-kit
 *   - ../document-annotation-kit
 *   - ../document-advanced-annotations-kit
 *   - ../document-realtime-collaboration-kit
 *   - ../document-workflow-kit
 *
 * DOWNSTREAM (imported by):
 *   - Real-time collaboration services
 *   - Annotation management modules
 *   - Review workflow engines
 *   - Comment tracking systems
 *   - Shared editing services
 *   - Healthcare document collaboration dashboards
 */
/**
 * File: /reuse/document/composites/document-collaboration-composite.ts
 * Locator: WC-DOC-COLLABORATION-001
 * Purpose: Comprehensive Document Collaboration Toolkit - Production-ready real-time collaboration and annotation
 *
 * Upstream: Composed from document-collaboration-kit, document-annotation-kit, document-advanced-annotations-kit, document-realtime-collaboration-kit, document-workflow-kit
 * Downstream: ../backend/*, Collaboration services, Annotation management, Review workflows, Comment tracking, Shared editing
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 46 utility functions for real-time collaboration, annotations, comments, review workflows, shared editing
 *
 * LLM Context: Enterprise-grade document collaboration toolkit for White Cross healthcare platform.
 * Provides comprehensive collaboration capabilities including real-time multi-user editing, annotation
 * management with markup tools, threaded commenting systems, review and approval workflows, version
 * tracking for collaborative edits, presence awareness, conflict resolution, and HIPAA-compliant audit
 * trails for all collaboration activities. Composes functions from multiple document kits to provide
 * unified collaboration operations for medical chart reviews, peer consultations, multi-disciplinary
 * team discussions, and clinical documentation workflows.
 */
import { Model } from 'sequelize-typescript';
/**
 * Collaboration session configuration
 */
export interface CollaborationSession {
    id: string;
    documentId: string;
    name: string;
    participants: Participant[];
    startedAt: Date;
    endedAt?: Date;
    status: SessionStatus;
    permissions: SessionPermissions;
    metadata?: Record<string, any>;
}
/**
 * Session status
 */
export declare enum SessionStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    ENDED = "ENDED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Participant information
 */
export interface Participant {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: ParticipantRole;
    permissions: ParticipantPermissions;
    joinedAt: Date;
    lastActiveAt: Date;
    status: ParticipantStatus;
    cursorPosition?: CursorPosition;
    metadata?: Record<string, any>;
}
/**
 * Participant roles
 */
export declare enum ParticipantRole {
    OWNER = "OWNER",
    EDITOR = "EDITOR",
    REVIEWER = "REVIEWER",
    COMMENTER = "COMMENTER",
    VIEWER = "VIEWER"
}
/**
 * Participant status
 */
export declare enum ParticipantStatus {
    ONLINE = "ONLINE",
    IDLE = "IDLE",
    OFFLINE = "OFFLINE"
}
/**
 * Cursor position for presence awareness
 */
export interface CursorPosition {
    pageNumber: number;
    x: number;
    y: number;
    timestamp: Date;
}
/**
 * Session permissions
 */
export interface SessionPermissions {
    allowEditing: boolean;
    allowAnnotations: boolean;
    allowComments: boolean;
    allowDownload: boolean;
    allowSharing: boolean;
    requireApproval: boolean;
}
/**
 * Participant permissions
 */
export interface ParticipantPermissions {
    canEdit: boolean;
    canAnnotate: boolean;
    canComment: boolean;
    canDelete: boolean;
    canShare: boolean;
    canApprove: boolean;
}
/**
 * Annotation definition
 */
export interface Annotation {
    id: string;
    documentId: string;
    type: AnnotationType;
    pageNumber: number;
    position: AnnotationPosition;
    content: AnnotationContent;
    author: AuthorInfo;
    createdAt: Date;
    updatedAt: Date;
    status: AnnotationStatus;
    replies: AnnotationReply[];
    metadata?: Record<string, any>;
}
/**
 * Annotation types
 */
export declare enum AnnotationType {
    HIGHLIGHT = "HIGHLIGHT",
    STRIKETHROUGH = "STRIKETHROUGH",
    UNDERLINE = "UNDERLINE",
    TEXT_NOTE = "TEXT_NOTE",
    STICKY_NOTE = "STICKY_NOTE",
    FREEHAND_DRAWING = "FREEHAND_DRAWING",
    SHAPE = "SHAPE",
    ARROW = "ARROW",
    STAMP = "STAMP",
    REDACTION = "REDACTION"
}
/**
 * Annotation position
 */
export interface AnnotationPosition {
    x: number;
    y: number;
    width: number;
    height: number;
    coordinates?: number[];
}
/**
 * Annotation content
 */
export interface AnnotationContent {
    text?: string;
    color: string;
    opacity: number;
    thickness?: number;
    fontFamily?: string;
    fontSize?: number;
    coordinates?: number[][];
    shapeType?: ShapeType;
}
/**
 * Shape types for annotations
 */
export declare enum ShapeType {
    RECTANGLE = "RECTANGLE",
    CIRCLE = "CIRCLE",
    ELLIPSE = "ELLIPSE",
    LINE = "LINE",
    ARROW = "ARROW",
    POLYGON = "POLYGON"
}
/**
 * Annotation status
 */
export declare enum AnnotationStatus {
    ACTIVE = "ACTIVE",
    RESOLVED = "RESOLVED",
    DELETED = "DELETED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Author information
 */
export interface AuthorInfo {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}
/**
 * Annotation reply
 */
export interface AnnotationReply {
    id: string;
    annotationId: string;
    author: AuthorInfo;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Comment definition
 */
export interface Comment {
    id: string;
    documentId: string;
    parentCommentId?: string;
    content: string;
    author: AuthorInfo;
    createdAt: Date;
    updatedAt?: Date;
    status: CommentStatus;
    mentions: string[];
    replies: Comment[];
    reactions: Reaction[];
    metadata?: Record<string, any>;
}
/**
 * Comment status
 */
export declare enum CommentStatus {
    ACTIVE = "ACTIVE",
    RESOLVED = "RESOLVED",
    DELETED = "DELETED",
    EDITED = "EDITED"
}
/**
 * Reaction to comments
 */
export interface Reaction {
    userId: string;
    type: ReactionType;
    timestamp: Date;
}
/**
 * Reaction types
 */
export declare enum ReactionType {
    LIKE = "LIKE",
    AGREE = "AGREE",
    DISAGREE = "DISAGREE",
    QUESTION = "QUESTION",
    IMPORTANT = "IMPORTANT"
}
/**
 * Review workflow definition
 */
export interface ReviewWorkflow {
    id: string;
    documentId: string;
    name: string;
    reviewers: Reviewer[];
    currentStage: number;
    totalStages: number;
    status: ReviewStatus;
    dueDate?: Date;
    startedAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Review status
 */
export declare enum ReviewStatus {
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CHANGES_REQUESTED = "CHANGES_REQUESTED",
    COMPLETED = "COMPLETED"
}
/**
 * Reviewer information
 */
export interface Reviewer {
    id: string;
    userId: string;
    name: string;
    email: string;
    stage: number;
    decision?: ReviewDecision;
    comments?: string;
    reviewedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Review decision
 */
export declare enum ReviewDecision {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    REQUEST_CHANGES = "REQUEST_CHANGES",
    ABSTAIN = "ABSTAIN"
}
/**
 * Change tracking entry
 */
export interface ChangeEntry {
    id: string;
    documentId: string;
    type: ChangeType;
    userId: string;
    userName: string;
    timestamp: Date;
    description: string;
    oldValue?: any;
    newValue?: any;
    metadata?: Record<string, any>;
}
/**
 * Change types
 */
export declare enum ChangeType {
    CONTENT_EDIT = "CONTENT_EDIT",
    ANNOTATION_ADDED = "ANNOTATION_ADDED",
    ANNOTATION_REMOVED = "ANNOTATION_REMOVED",
    COMMENT_ADDED = "COMMENT_ADDED",
    COMMENT_REMOVED = "COMMENT_REMOVED",
    PARTICIPANT_JOINED = "PARTICIPANT_JOINED",
    PARTICIPANT_LEFT = "PARTICIPANT_LEFT",
    PERMISSION_CHANGED = "PERMISSION_CHANGED",
    STATUS_CHANGED = "STATUS_CHANGED"
}
/**
 * Real-time update message
 */
export interface RealtimeUpdate {
    id: string;
    sessionId: string;
    type: UpdateType;
    userId: string;
    timestamp: Date;
    payload: any;
    metadata?: Record<string, any>;
}
/**
 * Update types for real-time synchronization
 */
export declare enum UpdateType {
    CURSOR_MOVE = "CURSOR_MOVE",
    SELECTION_CHANGE = "SELECTION_CHANGE",
    CONTENT_CHANGE = "CONTENT_CHANGE",
    ANNOTATION_CHANGE = "ANNOTATION_CHANGE",
    COMMENT_CHANGE = "COMMENT_CHANGE",
    PARTICIPANT_UPDATE = "PARTICIPANT_UPDATE",
    PRESENCE_UPDATE = "PRESENCE_UPDATE"
}
/**
 * Conflict resolution entry
 */
export interface ConflictResolution {
    id: string;
    documentId: string;
    conflictType: ConflictType;
    detectedAt: Date;
    resolvedAt?: Date;
    resolution: ResolutionStrategy;
    participants: string[];
    description: string;
    metadata?: Record<string, any>;
}
/**
 * Conflict types
 */
export declare enum ConflictType {
    CONCURRENT_EDIT = "CONCURRENT_EDIT",
    OVERLAPPING_ANNOTATION = "OVERLAPPING_ANNOTATION",
    PERMISSION_CONFLICT = "PERMISSION_CONFLICT",
    VERSION_MISMATCH = "VERSION_MISMATCH"
}
/**
 * Resolution strategies
 */
export declare enum ResolutionStrategy {
    LAST_WRITE_WINS = "LAST_WRITE_WINS",
    MERGE = "MERGE",
    MANUAL = "MANUAL",
    REJECT = "REJECT"
}
/**
 * Collaboration Session Model
 * Stores active and historical collaboration sessions
 */
export declare class CollaborationSessionModel extends Model {
    id: string;
    documentId: string;
    name: string;
    participants: Participant[];
    startedAt: Date;
    endedAt?: Date;
    status: SessionStatus;
    permissions: SessionPermissions;
    metadata?: Record<string, any>;
}
/**
 * Annotation Model
 * Stores document annotations
 */
export declare class AnnotationModel extends Model {
    id: string;
    documentId: string;
    type: AnnotationType;
    pageNumber: number;
    position: AnnotationPosition;
    content: AnnotationContent;
    author: AuthorInfo;
    status: AnnotationStatus;
    replies: AnnotationReply[];
    metadata?: Record<string, any>;
}
/**
 * Review Workflow Model
 * Stores document review workflows
 */
export declare class ReviewWorkflowModel extends Model {
    id: string;
    documentId: string;
    name: string;
    reviewers: Reviewer[];
    currentStage: number;
    totalStages: number;
    status: ReviewStatus;
    dueDate?: Date;
    startedAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Creates a new collaboration session.
 *
 * @param {string} documentId - Document identifier
 * @param {string} name - Session name
 * @param {Partial<CollaborationSession>} options - Additional options
 * @returns {CollaborationSession} Collaboration session
 *
 * @example
 * ```typescript
 * const session = createCollaborationSession('doc123', 'Medical Chart Review');
 * ```
 */
export declare const createCollaborationSession: (documentId: string, name: string, options?: Partial<CollaborationSession>) => CollaborationSession;
/**
 * Adds a participant to collaboration session.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {Participant} participant - Participant to add
 * @returns {CollaborationSession} Updated session
 *
 * @example
 * ```typescript
 * const updated = addParticipantToSession(session, participant);
 * ```
 */
export declare const addParticipantToSession: (session: CollaborationSession, participant: Participant) => CollaborationSession;
/**
 * Removes a participant from session.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {string} participantId - Participant ID to remove
 * @returns {CollaborationSession} Updated session
 *
 * @example
 * ```typescript
 * const updated = removeParticipantFromSession(session, 'participant123');
 * ```
 */
export declare const removeParticipantFromSession: (session: CollaborationSession, participantId: string) => CollaborationSession;
/**
 * Creates a participant for collaboration session.
 *
 * @param {string} userId - User identifier
 * @param {string} name - Participant name
 * @param {string} email - Participant email
 * @param {ParticipantRole} role - Participant role
 * @returns {Participant} Participant
 *
 * @example
 * ```typescript
 * const participant = createParticipant('user123', 'Dr. Smith', 'smith@example.com', ParticipantRole.EDITOR);
 * ```
 */
export declare const createParticipant: (userId: string, name: string, email: string, role: ParticipantRole) => Participant;
/**
 * Gets default permissions for a participant role.
 *
 * @param {ParticipantRole} role - Participant role
 * @returns {ParticipantPermissions} Permissions
 *
 * @example
 * ```typescript
 * const permissions = getPermissionsForRole(ParticipantRole.REVIEWER);
 * ```
 */
export declare const getPermissionsForRole: (role: ParticipantRole) => ParticipantPermissions;
/**
 * Updates participant status and activity.
 *
 * @param {Participant} participant - Participant to update
 * @param {ParticipantStatus} status - New status
 * @returns {Participant} Updated participant
 *
 * @example
 * ```typescript
 * const updated = updateParticipantStatus(participant, ParticipantStatus.IDLE);
 * ```
 */
export declare const updateParticipantStatus: (participant: Participant, status: ParticipantStatus) => Participant;
/**
 * Creates an annotation.
 *
 * @param {string} documentId - Document identifier
 * @param {AnnotationType} type - Annotation type
 * @param {number} pageNumber - Page number
 * @param {AnnotationPosition} position - Annotation position
 * @param {AnnotationContent} content - Annotation content
 * @param {AuthorInfo} author - Author information
 * @returns {Annotation} Annotation
 *
 * @example
 * ```typescript
 * const annotation = createAnnotation('doc123', AnnotationType.HIGHLIGHT, 1, position, content, author);
 * ```
 */
export declare const createAnnotation: (documentId: string, type: AnnotationType, pageNumber: number, position: AnnotationPosition, content: AnnotationContent, author: AuthorInfo) => Annotation;
/**
 * Adds a reply to an annotation.
 *
 * @param {Annotation} annotation - Annotation to reply to
 * @param {string} content - Reply content
 * @param {AuthorInfo} author - Reply author
 * @returns {Annotation} Updated annotation
 *
 * @example
 * ```typescript
 * const updated = addAnnotationReply(annotation, 'I agree with this note', author);
 * ```
 */
export declare const addAnnotationReply: (annotation: Annotation, content: string, author: AuthorInfo) => Annotation;
/**
 * Resolves an annotation.
 *
 * @param {Annotation} annotation - Annotation to resolve
 * @returns {Annotation} Resolved annotation
 *
 * @example
 * ```typescript
 * const resolved = resolveAnnotation(annotation);
 * ```
 */
export declare const resolveAnnotation: (annotation: Annotation) => Annotation;
/**
 * Deletes an annotation.
 *
 * @param {Annotation} annotation - Annotation to delete
 * @returns {Annotation} Deleted annotation
 *
 * @example
 * ```typescript
 * const deleted = deleteAnnotation(annotation);
 * ```
 */
export declare const deleteAnnotation: (annotation: Annotation) => Annotation;
/**
 * Creates a comment.
 *
 * @param {string} documentId - Document identifier
 * @param {string} content - Comment content
 * @param {AuthorInfo} author - Author information
 * @param {Partial<Comment>} options - Additional options
 * @returns {Comment} Comment
 *
 * @example
 * ```typescript
 * const comment = createComment('doc123', 'Please review this section', author);
 * ```
 */
export declare const createComment: (documentId: string, content: string, author: AuthorInfo, options?: Partial<Comment>) => Comment;
/**
 * Extracts mentions from comment content.
 *
 * @param {string} content - Comment content
 * @returns {Array<string>} Mentioned user IDs
 *
 * @example
 * ```typescript
 * const mentions = extractMentions('@user123 please review @user456');
 * ```
 */
export declare const extractMentions: (content: string) => string[];
/**
 * Adds a reply to a comment.
 *
 * @param {Comment} comment - Parent comment
 * @param {Comment} reply - Reply comment
 * @returns {Comment} Updated parent comment
 *
 * @example
 * ```typescript
 * const updated = addCommentReply(parentComment, replyComment);
 * ```
 */
export declare const addCommentReply: (comment: Comment, reply: Comment) => Comment;
/**
 * Adds a reaction to a comment.
 *
 * @param {Comment} comment - Comment to react to
 * @param {string} userId - User ID
 * @param {ReactionType} reactionType - Reaction type
 * @returns {Comment} Updated comment
 *
 * @example
 * ```typescript
 * const updated = addCommentReaction(comment, 'user123', ReactionType.AGREE);
 * ```
 */
export declare const addCommentReaction: (comment: Comment, userId: string, reactionType: ReactionType) => Comment;
/**
 * Resolves a comment.
 *
 * @param {Comment} comment - Comment to resolve
 * @returns {Comment} Resolved comment
 *
 * @example
 * ```typescript
 * const resolved = resolveComment(comment);
 * ```
 */
export declare const resolveComment: (comment: Comment) => Comment;
/**
 * Creates a review workflow.
 *
 * @param {string} documentId - Document identifier
 * @param {string} name - Workflow name
 * @param {Reviewer[]} reviewers - List of reviewers
 * @param {Partial<ReviewWorkflow>} options - Additional options
 * @returns {ReviewWorkflow} Review workflow
 *
 * @example
 * ```typescript
 * const workflow = createReviewWorkflow('doc123', 'Clinical Review', reviewers, {dueDate: new Date('2025-12-31')});
 * ```
 */
export declare const createReviewWorkflow: (documentId: string, name: string, reviewers: Reviewer[], options?: Partial<ReviewWorkflow>) => ReviewWorkflow;
/**
 * Creates a reviewer.
 *
 * @param {string} userId - User identifier
 * @param {string} name - Reviewer name
 * @param {string} email - Reviewer email
 * @param {number} stage - Review stage
 * @returns {Reviewer} Reviewer
 *
 * @example
 * ```typescript
 * const reviewer = createReviewer('user123', 'Dr. Johnson', 'johnson@example.com', 1);
 * ```
 */
export declare const createReviewer: (userId: string, name: string, email: string, stage: number) => Reviewer;
/**
 * Records a reviewer's decision.
 *
 * @param {Reviewer} reviewer - Reviewer
 * @param {ReviewDecision} decision - Review decision
 * @param {string} comments - Optional comments
 * @returns {Reviewer} Updated reviewer
 *
 * @example
 * ```typescript
 * const updated = recordReviewDecision(reviewer, ReviewDecision.APPROVE, 'Looks good');
 * ```
 */
export declare const recordReviewDecision: (reviewer: Reviewer, decision: ReviewDecision, comments?: string) => Reviewer;
/**
 * Advances review workflow to next stage.
 *
 * @param {ReviewWorkflow} workflow - Review workflow
 * @returns {ReviewWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const advanced = advanceReviewWorkflow(workflow);
 * ```
 */
export declare const advanceReviewWorkflow: (workflow: ReviewWorkflow) => ReviewWorkflow;
/**
 * Checks if all reviewers at current stage have completed review.
 *
 * @param {ReviewWorkflow} workflow - Review workflow
 * @returns {boolean} True if stage is complete
 *
 * @example
 * ```typescript
 * const isComplete = isCurrentStageComplete(workflow);
 * ```
 */
export declare const isCurrentStageComplete: (workflow: ReviewWorkflow) => boolean;
/**
 * Checks if workflow is approved by all reviewers.
 *
 * @param {ReviewWorkflow} workflow - Review workflow
 * @returns {boolean} True if fully approved
 *
 * @example
 * ```typescript
 * const isApproved = isWorkflowApproved(workflow);
 * ```
 */
export declare const isWorkflowApproved: (workflow: ReviewWorkflow) => boolean;
/**
 * Creates a change tracking entry.
 *
 * @param {string} documentId - Document identifier
 * @param {ChangeType} type - Change type
 * @param {string} userId - User identifier
 * @param {string} userName - User name
 * @param {string} description - Change description
 * @param {Partial<ChangeEntry>} options - Additional options
 * @returns {ChangeEntry} Change entry
 *
 * @example
 * ```typescript
 * const change = createChangeEntry('doc123', ChangeType.CONTENT_EDIT, 'user123', 'Dr. Smith', 'Updated diagnosis');
 * ```
 */
export declare const createChangeEntry: (documentId: string, type: ChangeType, userId: string, userName: string, description: string, options?: Partial<ChangeEntry>) => ChangeEntry;
/**
 * Creates a real-time update message.
 *
 * @param {string} sessionId - Session identifier
 * @param {UpdateType} type - Update type
 * @param {string} userId - User identifier
 * @param {any} payload - Update payload
 * @returns {RealtimeUpdate} Real-time update
 *
 * @example
 * ```typescript
 * const update = createRealtimeUpdate('session123', UpdateType.CURSOR_MOVE, 'user123', cursorData);
 * ```
 */
export declare const createRealtimeUpdate: (sessionId: string, type: UpdateType, userId: string, payload: any) => RealtimeUpdate;
/**
 * Updates participant cursor position.
 *
 * @param {Participant} participant - Participant
 * @param {CursorPosition} position - New cursor position
 * @returns {Participant} Updated participant
 *
 * @example
 * ```typescript
 * const updated = updateParticipantCursor(participant, {pageNumber: 2, x: 100, y: 200, timestamp: new Date()});
 * ```
 */
export declare const updateParticipantCursor: (participant: Participant, position: CursorPosition) => Participant;
/**
 * Detects collaboration conflicts.
 *
 * @param {ChangeEntry[]} recentChanges - Recent change entries
 * @param {number} timeWindowMs - Time window for conflict detection
 * @returns {ConflictResolution[]} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectCollaborationConflicts(changes, 5000);
 * ```
 */
export declare const detectCollaborationConflicts: (recentChanges: ChangeEntry[], timeWindowMs?: number) => ConflictResolution[];
/**
 * Resolves a collaboration conflict.
 *
 * @param {ConflictResolution} conflict - Conflict to resolve
 * @param {ResolutionStrategy} strategy - Resolution strategy
 * @returns {ConflictResolution} Resolved conflict
 *
 * @example
 * ```typescript
 * const resolved = resolveCollaborationConflict(conflict, ResolutionStrategy.MERGE);
 * ```
 */
export declare const resolveCollaborationConflict: (conflict: ConflictResolution, strategy: ResolutionStrategy) => ConflictResolution;
/**
 * Gets active participants in session.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @returns {Participant[]} Active participants
 *
 * @example
 * ```typescript
 * const active = getActiveParticipants(session);
 * ```
 */
export declare const getActiveParticipants: (session: CollaborationSession) => Participant[];
/**
 * Counts annotations by type.
 *
 * @param {Annotation[]} annotations - Annotations to count
 * @returns {Record<AnnotationType, number>} Count by type
 *
 * @example
 * ```typescript
 * const counts = countAnnotationsByType(annotations);
 * ```
 */
export declare const countAnnotationsByType: (annotations: Annotation[]) => Record<AnnotationType, number>;
/**
 * Filters annotations by page number.
 *
 * @param {Annotation[]} annotations - Annotations to filter
 * @param {number} pageNumber - Page number
 * @returns {Annotation[]} Filtered annotations
 *
 * @example
 * ```typescript
 * const pageAnnotations = filterAnnotationsByPage(annotations, 1);
 * ```
 */
export declare const filterAnnotationsByPage: (annotations: Annotation[], pageNumber: number) => Annotation[];
/**
 * Exports session activity log.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {ChangeEntry[]} changes - Change entries
 * @returns {Record<string, any>} Activity log
 *
 * @example
 * ```typescript
 * const log = exportSessionActivityLog(session, changes);
 * ```
 */
export declare const exportSessionActivityLog: (session: CollaborationSession, changes: ChangeEntry[]) => Record<string, any>;
/**
 * Calculates collaboration metrics.
 *
 * @param {CollaborationSession} session - Collaboration session
 * @param {Annotation[]} annotations - Annotations
 * @param {Comment[]} comments - Comments
 * @returns {Record<string, any>} Collaboration metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateCollaborationMetrics(session, annotations, comments);
 * ```
 */
export declare const calculateCollaborationMetrics: (session: CollaborationSession, annotations: Annotation[], comments: Comment[]) => Record<string, any>;
/**
 * Validates participant permissions for action.
 *
 * @param {Participant} participant - Participant
 * @param {string} action - Action to validate
 * @returns {boolean} True if permitted
 *
 * @example
 * ```typescript
 * const canEdit = validateParticipantPermission(participant, 'edit');
 * ```
 */
export declare const validateParticipantPermission: (participant: Participant, action: keyof ParticipantPermissions) => boolean;
/**
 * Ends a collaboration session.
 *
 * @param {CollaborationSession} session - Session to end
 * @returns {CollaborationSession} Ended session
 *
 * @example
 * ```typescript
 * const ended = endCollaborationSession(session);
 * ```
 */
export declare const endCollaborationSession: (session: CollaborationSession) => CollaborationSession;
/**
 * Document Collaboration Service
 * Production-ready NestJS service for document collaboration operations
 */
export declare class DocumentCollaborationService {
    /**
     * Initiates a new collaboration session
     */
    startCollaboration(documentId: string, sessionName: string, participants: Participant[]): Promise<CollaborationSession>;
    /**
     * Adds annotation to document
     */
    addAnnotation(documentId: string, type: AnnotationType, pageNumber: number, position: AnnotationPosition, content: AnnotationContent, author: AuthorInfo): Promise<Annotation>;
}
declare const _default: {
    CollaborationSessionModel: typeof CollaborationSessionModel;
    AnnotationModel: typeof AnnotationModel;
    ReviewWorkflowModel: typeof ReviewWorkflowModel;
    createCollaborationSession: (documentId: string, name: string, options?: Partial<CollaborationSession>) => CollaborationSession;
    addParticipantToSession: (session: CollaborationSession, participant: Participant) => CollaborationSession;
    removeParticipantFromSession: (session: CollaborationSession, participantId: string) => CollaborationSession;
    createParticipant: (userId: string, name: string, email: string, role: ParticipantRole) => Participant;
    getPermissionsForRole: (role: ParticipantRole) => ParticipantPermissions;
    updateParticipantStatus: (participant: Participant, status: ParticipantStatus) => Participant;
    createAnnotation: (documentId: string, type: AnnotationType, pageNumber: number, position: AnnotationPosition, content: AnnotationContent, author: AuthorInfo) => Annotation;
    addAnnotationReply: (annotation: Annotation, content: string, author: AuthorInfo) => Annotation;
    resolveAnnotation: (annotation: Annotation) => Annotation;
    deleteAnnotation: (annotation: Annotation) => Annotation;
    createComment: (documentId: string, content: string, author: AuthorInfo, options?: Partial<Comment>) => Comment;
    extractMentions: (content: string) => string[];
    addCommentReply: (comment: Comment, reply: Comment) => Comment;
    addCommentReaction: (comment: Comment, userId: string, reactionType: ReactionType) => Comment;
    resolveComment: (comment: Comment) => Comment;
    createReviewWorkflow: (documentId: string, name: string, reviewers: Reviewer[], options?: Partial<ReviewWorkflow>) => ReviewWorkflow;
    createReviewer: (userId: string, name: string, email: string, stage: number) => Reviewer;
    recordReviewDecision: (reviewer: Reviewer, decision: ReviewDecision, comments?: string) => Reviewer;
    advanceReviewWorkflow: (workflow: ReviewWorkflow) => ReviewWorkflow;
    isCurrentStageComplete: (workflow: ReviewWorkflow) => boolean;
    isWorkflowApproved: (workflow: ReviewWorkflow) => boolean;
    createChangeEntry: (documentId: string, type: ChangeType, userId: string, userName: string, description: string, options?: Partial<ChangeEntry>) => ChangeEntry;
    createRealtimeUpdate: (sessionId: string, type: UpdateType, userId: string, payload: any) => RealtimeUpdate;
    updateParticipantCursor: (participant: Participant, position: CursorPosition) => Participant;
    detectCollaborationConflicts: (recentChanges: ChangeEntry[], timeWindowMs?: number) => ConflictResolution[];
    resolveCollaborationConflict: (conflict: ConflictResolution, strategy: ResolutionStrategy) => ConflictResolution;
    getActiveParticipants: (session: CollaborationSession) => Participant[];
    countAnnotationsByType: (annotations: Annotation[]) => Record<AnnotationType, number>;
    filterAnnotationsByPage: (annotations: Annotation[], pageNumber: number) => Annotation[];
    exportSessionActivityLog: (session: CollaborationSession, changes: ChangeEntry[]) => Record<string, any>;
    calculateCollaborationMetrics: (session: CollaborationSession, annotations: Annotation[], comments: Comment[]) => Record<string, any>;
    validateParticipantPermission: (participant: Participant, action: keyof ParticipantPermissions) => boolean;
    endCollaborationSession: (session: CollaborationSession) => CollaborationSession;
    DocumentCollaborationService: typeof DocumentCollaborationService;
};
export default _default;
//# sourceMappingURL=document-collaboration-composite.d.ts.map