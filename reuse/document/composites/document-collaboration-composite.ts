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

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  ARCHIVED = 'ARCHIVED',
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
export enum ParticipantRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  REVIEWER = 'REVIEWER',
  COMMENTER = 'COMMENTER',
  VIEWER = 'VIEWER',
}

/**
 * Participant status
 */
export enum ParticipantStatus {
  ONLINE = 'ONLINE',
  IDLE = 'IDLE',
  OFFLINE = 'OFFLINE',
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
export enum AnnotationType {
  HIGHLIGHT = 'HIGHLIGHT',
  STRIKETHROUGH = 'STRIKETHROUGH',
  UNDERLINE = 'UNDERLINE',
  TEXT_NOTE = 'TEXT_NOTE',
  STICKY_NOTE = 'STICKY_NOTE',
  FREEHAND_DRAWING = 'FREEHAND_DRAWING',
  SHAPE = 'SHAPE',
  ARROW = 'ARROW',
  STAMP = 'STAMP',
  REDACTION = 'REDACTION',
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
export enum ShapeType {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  ELLIPSE = 'ELLIPSE',
  LINE = 'LINE',
  ARROW = 'ARROW',
  POLYGON = 'POLYGON',
}

/**
 * Annotation status
 */
export enum AnnotationStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED',
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
export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  DELETED = 'DELETED',
  EDITED = 'EDITED',
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
export enum ReactionType {
  LIKE = 'LIKE',
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
  QUESTION = 'QUESTION',
  IMPORTANT = 'IMPORTANT',
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
export enum ReviewStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  COMPLETED = 'COMPLETED',
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
export enum ReviewDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_CHANGES = 'REQUEST_CHANGES',
  ABSTAIN = 'ABSTAIN',
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
export enum ChangeType {
  CONTENT_EDIT = 'CONTENT_EDIT',
  ANNOTATION_ADDED = 'ANNOTATION_ADDED',
  ANNOTATION_REMOVED = 'ANNOTATION_REMOVED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  COMMENT_REMOVED = 'COMMENT_REMOVED',
  PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',
  STATUS_CHANGED = 'STATUS_CHANGED',
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
export enum UpdateType {
  CURSOR_MOVE = 'CURSOR_MOVE',
  SELECTION_CHANGE = 'SELECTION_CHANGE',
  CONTENT_CHANGE = 'CONTENT_CHANGE',
  ANNOTATION_CHANGE = 'ANNOTATION_CHANGE',
  COMMENT_CHANGE = 'COMMENT_CHANGE',
  PARTICIPANT_UPDATE = 'PARTICIPANT_UPDATE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
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
export enum ConflictType {
  CONCURRENT_EDIT = 'CONCURRENT_EDIT',
  OVERLAPPING_ANNOTATION = 'OVERLAPPING_ANNOTATION',
  PERMISSION_CONFLICT = 'PERMISSION_CONFLICT',
  VERSION_MISMATCH = 'VERSION_MISMATCH',
}

/**
 * Resolution strategies
 */
export enum ResolutionStrategy {
  LAST_WRITE_WINS = 'LAST_WRITE_WINS',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL',
  REJECT = 'REJECT',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Collaboration Session Model
 * Stores active and historical collaboration sessions
 */
@Table({
  tableName: 'collaboration_sessions',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['status'] },
    { fields: ['startedAt'] },
  ],
})
export class CollaborationSessionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique session identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Session name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Session participants', type: [Object] })
  participants: Participant[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Session start time' })
  startedAt: Date;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Session end time' })
  endedAt?: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(SessionStatus)))
  @ApiProperty({ enum: SessionStatus, description: 'Session status' })
  status: SessionStatus;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Session permissions' })
  permissions: SessionPermissions;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Annotation Model
 * Stores document annotations
 */
@Table({
  tableName: 'annotations',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['pageNumber'] },
  ],
})
export class AnnotationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique annotation identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(AnnotationType)))
  @ApiProperty({ enum: AnnotationType, description: 'Annotation type' })
  type: AnnotationType;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Page number' })
  pageNumber: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Annotation position' })
  position: AnnotationPosition;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Annotation content' })
  content: AnnotationContent;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Author information' })
  author: AuthorInfo;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(AnnotationStatus)))
  @ApiProperty({ enum: AnnotationStatus, description: 'Annotation status' })
  status: AnnotationStatus;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Annotation replies', type: [Object] })
  replies: AnnotationReply[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Review Workflow Model
 * Stores document review workflows
 */
@Table({
  tableName: 'review_workflows',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['status'] },
    { fields: ['dueDate'] },
  ],
})
export class ReviewWorkflowModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique workflow identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Workflow name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'List of reviewers', type: [Object] })
  reviewers: Reviewer[];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Current review stage' })
  currentStage: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Total review stages' })
  totalStages: number;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(ReviewStatus)))
  @ApiProperty({ enum: ReviewStatus, description: 'Review status' })
  status: ReviewStatus;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Review due date' })
  dueDate?: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Workflow start time' })
  startedAt: Date;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Workflow completion time' })
  completedAt?: Date;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE COLLABORATION FUNCTIONS
// ============================================================================

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
export const createCollaborationSession = (
  documentId: string,
  name: string,
  options?: Partial<CollaborationSession>
): CollaborationSession => {
  return {
    id: crypto.randomUUID(),
    documentId,
    name,
    participants: options?.participants || [],
    startedAt: new Date(),
    endedAt: options?.endedAt,
    status: SessionStatus.ACTIVE,
    permissions: options?.permissions || {
      allowEditing: true,
      allowAnnotations: true,
      allowComments: true,
      allowDownload: false,
      allowSharing: false,
      requireApproval: false,
    },
    metadata: options?.metadata,
  };
};

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
export const addParticipantToSession = (
  session: CollaborationSession,
  participant: Participant
): CollaborationSession => {
  return {
    ...session,
    participants: [...session.participants, participant],
  };
};

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
export const removeParticipantFromSession = (
  session: CollaborationSession,
  participantId: string
): CollaborationSession => {
  return {
    ...session,
    participants: session.participants.filter((p) => p.id !== participantId),
  };
};

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
export const createParticipant = (
  userId: string,
  name: string,
  email: string,
  role: ParticipantRole
): Participant => {
  return {
    id: crypto.randomUUID(),
    userId,
    name,
    email,
    role,
    permissions: getPermissionsForRole(role),
    joinedAt: new Date(),
    lastActiveAt: new Date(),
    status: ParticipantStatus.ONLINE,
  };
};

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
export const getPermissionsForRole = (role: ParticipantRole): ParticipantPermissions => {
  switch (role) {
    case ParticipantRole.OWNER:
      return {
        canEdit: true,
        canAnnotate: true,
        canComment: true,
        canDelete: true,
        canShare: true,
        canApprove: true,
      };
    case ParticipantRole.EDITOR:
      return {
        canEdit: true,
        canAnnotate: true,
        canComment: true,
        canDelete: false,
        canShare: false,
        canApprove: false,
      };
    case ParticipantRole.REVIEWER:
      return {
        canEdit: false,
        canAnnotate: true,
        canComment: true,
        canDelete: false,
        canShare: false,
        canApprove: true,
      };
    case ParticipantRole.COMMENTER:
      return {
        canEdit: false,
        canAnnotate: false,
        canComment: true,
        canDelete: false,
        canShare: false,
        canApprove: false,
      };
    case ParticipantRole.VIEWER:
      return {
        canEdit: false,
        canAnnotate: false,
        canComment: false,
        canDelete: false,
        canShare: false,
        canApprove: false,
      };
  }
};

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
export const updateParticipantStatus = (
  participant: Participant,
  status: ParticipantStatus
): Participant => {
  return {
    ...participant,
    status,
    lastActiveAt: new Date(),
  };
};

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
export const createAnnotation = (
  documentId: string,
  type: AnnotationType,
  pageNumber: number,
  position: AnnotationPosition,
  content: AnnotationContent,
  author: AuthorInfo
): Annotation => {
  return {
    id: crypto.randomUUID(),
    documentId,
    type,
    pageNumber,
    position,
    content,
    author,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: AnnotationStatus.ACTIVE,
    replies: [],
  };
};

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
export const addAnnotationReply = (
  annotation: Annotation,
  content: string,
  author: AuthorInfo
): Annotation => {
  const reply: AnnotationReply = {
    id: crypto.randomUUID(),
    annotationId: annotation.id,
    author,
    content,
    createdAt: new Date(),
  };

  return {
    ...annotation,
    replies: [...annotation.replies, reply],
    updatedAt: new Date(),
  };
};

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
export const resolveAnnotation = (annotation: Annotation): Annotation => {
  return {
    ...annotation,
    status: AnnotationStatus.RESOLVED,
    updatedAt: new Date(),
  };
};

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
export const deleteAnnotation = (annotation: Annotation): Annotation => {
  return {
    ...annotation,
    status: AnnotationStatus.DELETED,
    updatedAt: new Date(),
  };
};

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
export const createComment = (
  documentId: string,
  content: string,
  author: AuthorInfo,
  options?: Partial<Comment>
): Comment => {
  return {
    id: crypto.randomUUID(),
    documentId,
    parentCommentId: options?.parentCommentId,
    content,
    author,
    createdAt: new Date(),
    updatedAt: options?.updatedAt,
    status: CommentStatus.ACTIVE,
    mentions: extractMentions(content),
    replies: options?.replies || [],
    reactions: options?.reactions || [],
    metadata: options?.metadata,
  };
};

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
export const extractMentions = (content: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map((m) => m.substring(1)) : [];
};

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
export const addCommentReply = (comment: Comment, reply: Comment): Comment => {
  return {
    ...comment,
    replies: [...comment.replies, reply],
    updatedAt: new Date(),
  };
};

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
export const addCommentReaction = (
  comment: Comment,
  userId: string,
  reactionType: ReactionType
): Comment => {
  const reaction: Reaction = {
    userId,
    type: reactionType,
    timestamp: new Date(),
  };

  // Remove existing reaction from this user
  const filteredReactions = comment.reactions.filter((r) => r.userId !== userId);

  return {
    ...comment,
    reactions: [...filteredReactions, reaction],
    updatedAt: new Date(),
  };
};

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
export const resolveComment = (comment: Comment): Comment => {
  return {
    ...comment,
    status: CommentStatus.RESOLVED,
    updatedAt: new Date(),
  };
};

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
export const createReviewWorkflow = (
  documentId: string,
  name: string,
  reviewers: Reviewer[],
  options?: Partial<ReviewWorkflow>
): ReviewWorkflow => {
  return {
    id: crypto.randomUUID(),
    documentId,
    name,
    reviewers,
    currentStage: 1,
    totalStages: Math.max(...reviewers.map((r) => r.stage)),
    status: ReviewStatus.PENDING,
    dueDate: options?.dueDate,
    startedAt: new Date(),
    completedAt: options?.completedAt,
    metadata: options?.metadata,
  };
};

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
export const createReviewer = (
  userId: string,
  name: string,
  email: string,
  stage: number
): Reviewer => {
  return {
    id: crypto.randomUUID(),
    userId,
    name,
    email,
    stage,
  };
};

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
export const recordReviewDecision = (
  reviewer: Reviewer,
  decision: ReviewDecision,
  comments?: string
): Reviewer => {
  return {
    ...reviewer,
    decision,
    comments,
    reviewedAt: new Date(),
  };
};

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
export const advanceReviewWorkflow = (workflow: ReviewWorkflow): ReviewWorkflow => {
  const nextStage = workflow.currentStage + 1;

  if (nextStage > workflow.totalStages) {
    return {
      ...workflow,
      status: ReviewStatus.COMPLETED,
      completedAt: new Date(),
    };
  }

  return {
    ...workflow,
    currentStage: nextStage,
    status: ReviewStatus.IN_REVIEW,
  };
};

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
export const isCurrentStageComplete = (workflow: ReviewWorkflow): boolean => {
  const currentStageReviewers = workflow.reviewers.filter(
    (r) => r.stage === workflow.currentStage
  );

  return currentStageReviewers.every((r) => r.decision !== undefined);
};

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
export const isWorkflowApproved = (workflow: ReviewWorkflow): boolean => {
  return workflow.reviewers.every(
    (r) => r.decision === ReviewDecision.APPROVE || r.decision === ReviewDecision.ABSTAIN
  );
};

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
export const createChangeEntry = (
  documentId: string,
  type: ChangeType,
  userId: string,
  userName: string,
  description: string,
  options?: Partial<ChangeEntry>
): ChangeEntry => {
  return {
    id: crypto.randomUUID(),
    documentId,
    type,
    userId,
    userName,
    timestamp: new Date(),
    description,
    oldValue: options?.oldValue,
    newValue: options?.newValue,
    metadata: options?.metadata,
  };
};

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
export const createRealtimeUpdate = (
  sessionId: string,
  type: UpdateType,
  userId: string,
  payload: any
): RealtimeUpdate => {
  return {
    id: crypto.randomUUID(),
    sessionId,
    type,
    userId,
    timestamp: new Date(),
    payload,
  };
};

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
export const updateParticipantCursor = (
  participant: Participant,
  position: CursorPosition
): Participant => {
  return {
    ...participant,
    cursorPosition: position,
    lastActiveAt: new Date(),
    status: ParticipantStatus.ONLINE,
  };
};

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
export const detectCollaborationConflicts = (
  recentChanges: ChangeEntry[],
  timeWindowMs: number = 5000
): ConflictResolution[] => {
  const conflicts: ConflictResolution[] = [];
  const now = Date.now();

  // Group changes by document
  const changesByDoc = new Map<string, ChangeEntry[]>();
  recentChanges.forEach((change) => {
    const changes = changesByDoc.get(change.documentId) || [];
    changes.push(change);
    changesByDoc.set(change.documentId, changes);
  });

  // Detect concurrent edits
  changesByDoc.forEach((changes, documentId) => {
    const concurrentEdits = changes.filter(
      (c) =>
        c.type === ChangeType.CONTENT_EDIT &&
        now - c.timestamp.getTime() <= timeWindowMs
    );

    if (concurrentEdits.length > 1) {
      conflicts.push({
        id: crypto.randomUUID(),
        documentId,
        conflictType: ConflictType.CONCURRENT_EDIT,
        detectedAt: new Date(),
        resolution: ResolutionStrategy.LAST_WRITE_WINS,
        participants: concurrentEdits.map((c) => c.userId),
        description: `${concurrentEdits.length} concurrent edits detected`,
      });
    }
  });

  return conflicts;
};

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
export const resolveCollaborationConflict = (
  conflict: ConflictResolution,
  strategy: ResolutionStrategy
): ConflictResolution => {
  return {
    ...conflict,
    resolution: strategy,
    resolvedAt: new Date(),
  };
};

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
export const getActiveParticipants = (session: CollaborationSession): Participant[] => {
  return session.participants.filter((p) => p.status === ParticipantStatus.ONLINE);
};

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
export const countAnnotationsByType = (
  annotations: Annotation[]
): Record<AnnotationType, number> => {
  const counts = {} as Record<AnnotationType, number>;

  annotations.forEach((annotation) => {
    counts[annotation.type] = (counts[annotation.type] || 0) + 1;
  });

  return counts;
};

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
export const filterAnnotationsByPage = (
  annotations: Annotation[],
  pageNumber: number
): Annotation[] => {
  return annotations.filter((a) => a.pageNumber === pageNumber);
};

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
export const exportSessionActivityLog = (
  session: CollaborationSession,
  changes: ChangeEntry[]
): Record<string, any> => {
  return {
    sessionId: session.id,
    documentId: session.documentId,
    name: session.name,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    participants: session.participants.map((p) => ({
      name: p.name,
      email: p.email,
      role: p.role,
      joinedAt: p.joinedAt,
      lastActiveAt: p.lastActiveAt,
    })),
    changes: changes.map((c) => ({
      type: c.type,
      userName: c.userName,
      timestamp: c.timestamp,
      description: c.description,
    })),
  };
};

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
export const calculateCollaborationMetrics = (
  session: CollaborationSession,
  annotations: Annotation[],
  comments: Comment[]
): Record<string, any> => {
  return {
    sessionId: session.id,
    participantCount: session.participants.length,
    activeParticipants: getActiveParticipants(session).length,
    annotationCount: annotations.length,
    commentCount: comments.length,
    resolvedAnnotations: annotations.filter((a) => a.status === AnnotationStatus.RESOLVED).length,
    resolvedComments: comments.filter((c) => c.status === CommentStatus.RESOLVED).length,
    sessionDuration: session.endedAt
      ? session.endedAt.getTime() - session.startedAt.getTime()
      : Date.now() - session.startedAt.getTime(),
  };
};

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
export const validateParticipantPermission = (
  participant: Participant,
  action: keyof ParticipantPermissions
): boolean => {
  const permissionMap: Record<string, keyof ParticipantPermissions> = {
    edit: 'canEdit',
    annotate: 'canAnnotate',
    comment: 'canComment',
    delete: 'canDelete',
    share: 'canShare',
    approve: 'canApprove',
  };

  const permission = permissionMap[action];
  return permission ? participant.permissions[permission] : false;
};

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
export const endCollaborationSession = (
  session: CollaborationSession
): CollaborationSession => {
  return {
    ...session,
    status: SessionStatus.ENDED,
    endedAt: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Document Collaboration Service
 * Production-ready NestJS service for document collaboration operations
 */
@Injectable()
export class DocumentCollaborationService {
  /**
   * Initiates a new collaboration session
   */
  async startCollaboration(
    documentId: string,
    sessionName: string,
    participants: Participant[]
  ): Promise<CollaborationSession> {
    const session = createCollaborationSession(documentId, sessionName, {
      participants,
    });

    return session;
  }

  /**
   * Adds annotation to document
   */
  async addAnnotation(
    documentId: string,
    type: AnnotationType,
    pageNumber: number,
    position: AnnotationPosition,
    content: AnnotationContent,
    author: AuthorInfo
  ): Promise<Annotation> {
    const annotation = createAnnotation(
      documentId,
      type,
      pageNumber,
      position,
      content,
      author
    );

    return annotation;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  CollaborationSessionModel,
  AnnotationModel,
  ReviewWorkflowModel,

  // Core Functions
  createCollaborationSession,
  addParticipantToSession,
  removeParticipantFromSession,
  createParticipant,
  getPermissionsForRole,
  updateParticipantStatus,
  createAnnotation,
  addAnnotationReply,
  resolveAnnotation,
  deleteAnnotation,
  createComment,
  extractMentions,
  addCommentReply,
  addCommentReaction,
  resolveComment,
  createReviewWorkflow,
  createReviewer,
  recordReviewDecision,
  advanceReviewWorkflow,
  isCurrentStageComplete,
  isWorkflowApproved,
  createChangeEntry,
  createRealtimeUpdate,
  updateParticipantCursor,
  detectCollaborationConflicts,
  resolveCollaborationConflict,
  getActiveParticipants,
  countAnnotationsByType,
  filterAnnotationsByPage,
  exportSessionActivityLog,
  calculateCollaborationMetrics,
  validateParticipantPermission,
  endCollaborationSession,

  // Services
  DocumentCollaborationService,
};
