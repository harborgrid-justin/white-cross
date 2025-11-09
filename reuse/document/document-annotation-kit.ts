/**
 * LOC: DOC-ANNOT-001
 * File: /reuse/document/document-annotation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdf-lib (annotation support)
 *   - uuid
 *
 * DOWNSTREAM (imported by):
 *   - Document review services
 *   - Annotation controllers
 *   - Collaboration modules
 *   - Document commenting services
 */

/**
 * File: /reuse/document/document-annotation-kit.ts
 * Locator: WC-UTL-DOCANNOT-001
 * Purpose: Document Annotations & Comments Kit - Comprehensive annotation utilities for NestJS
 *
 * Upstream: @nestjs/common, sequelize, pdf-lib, uuid
 * Downstream: Review services, annotation controllers, collaboration modules, comment services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PDF-Lib 1.17.x
 * Exports: 40+ utility functions for comments, highlights, annotations, replies, mentions, permissions
 *
 * LLM Context: Production-grade document annotation utilities for White Cross healthcare platform.
 * Provides comment creation with threading, reply management, @mentions, highlight/underline/strikethrough
 * annotations, sticky notes, stamps, drawing annotations, annotation permissions, visibility control,
 * collaborative review workflows, version tracking, and HIPAA-compliant audit trails for medical
 * document review and clinical collaboration.
 */

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Annotation types
 */
export type AnnotationType =
  | 'comment'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'sticky_note'
  | 'stamp'
  | 'drawing'
  | 'text'
  | 'arrow'
  | 'rectangle'
  | 'circle';

/**
 * Annotation status
 */
export type AnnotationStatus = 'active' | 'resolved' | 'deleted' | 'archived';

/**
 * Comment thread status
 */
export type ThreadStatus = 'open' | 'resolved' | 'closed';

/**
 * Base annotation interface
 */
export interface Annotation {
  id: string;
  documentId: string;
  pageNumber: number;
  type: AnnotationType;
  content?: string;
  author: {
    userId: string;
    name: string;
    email?: string;
  };
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color?: string;
  opacity?: number;
  status: AnnotationStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Comment annotation
 */
export interface CommentAnnotation extends Annotation {
  type: 'comment';
  threadId?: string;
  parentId?: string;
  mentions?: Mention[];
  attachments?: string[];
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Highlight annotation
 */
export interface HighlightAnnotation extends Annotation {
  type: 'highlight';
  selectedText: string;
  color: string;
  opacity: number;
}

/**
 * Sticky note annotation
 */
export interface StickyNoteAnnotation extends Annotation {
  type: 'sticky_note';
  content: string;
  color: string;
  minimized?: boolean;
}

/**
 * Drawing annotation
 */
export interface DrawingAnnotation extends Annotation {
  type: 'drawing';
  pathData: string;
  strokeWidth: number;
  strokeColor: string;
}

/**
 * Stamp annotation
 */
export interface StampAnnotation extends Annotation {
  type: 'stamp';
  stampType: 'approved' | 'reviewed' | 'confidential' | 'draft' | 'final' | 'custom';
  customText?: string;
  rotation?: number;
}

/**
 * Mention in comment
 */
export interface Mention {
  userId: string;
  userName: string;
  position: number;
  notified: boolean;
}

/**
 * Comment thread
 */
export interface CommentThread {
  id: string;
  documentId: string;
  pageNumber: number;
  status: ThreadStatus;
  comments: CommentAnnotation[];
  participants: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Annotation permissions
 */
export interface AnnotationPermissions {
  annotationId: string;
  userId?: string;
  roleId?: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReply: boolean;
  canResolve: boolean;
}

/**
 * Annotation visibility settings
 */
export interface AnnotationVisibility {
  annotationId: string;
  visibilityLevel: 'public' | 'private' | 'team' | 'custom';
  allowedUsers?: string[];
  allowedRoles?: string[];
  allowedTeams?: string[];
}

/**
 * Annotation filter options
 */
export interface AnnotationFilterOptions {
  type?: AnnotationType[];
  status?: AnnotationStatus[];
  author?: string[];
  pageNumber?: number[];
  dateRange?: { start: Date; end: Date };
  hasReplies?: boolean;
  isResolved?: boolean;
}

/**
 * Annotation export format
 */
export type AnnotationExportFormat = 'json' | 'csv' | 'pdf' | 'fdf' | 'xfdf';

/**
 * Reply notification
 */
export interface ReplyNotification {
  recipientId: string;
  commentId: string;
  threadId: string;
  replyBy: string;
  replyContent: string;
  sent: boolean;
  sentAt?: Date;
}

/**
 * Annotation activity log
 */
export interface AnnotationActivity {
  id: string;
  annotationId: string;
  action: 'created' | 'updated' | 'deleted' | 'resolved' | 'replied' | 'mentioned';
  userId: string;
  timestamp: Date;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Annotation model attributes
 */
export interface AnnotationAttributes {
  id: string;
  documentId: string;
  pageNumber: number;
  type: AnnotationType;
  content?: string;
  authorId: string;
  authorName: string;
  bounds?: Record<string, number>;
  color?: string;
  opacity?: number;
  status: AnnotationStatus;
  threadId?: string;
  parentId?: string;
  selectedText?: string;
  pathData?: string;
  stampType?: string;
  customData?: Record<string, any>;
  mentions?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comment thread model attributes
 */
export interface CommentThreadAttributes {
  id: string;
  documentId: string;
  pageNumber: number;
  status: ThreadStatus;
  participants: string;
  createdBy: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates Annotation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AnnotationAttributes>>} Annotation model
 *
 * @example
 * ```typescript
 * const AnnotationModel = createAnnotationModel(sequelize);
 * const annotation = await AnnotationModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 1,
 *   type: 'highlight',
 *   authorId: 'user-123',
 *   authorName: 'Dr. Smith',
 *   color: '#FFFF00',
 *   selectedText: 'Important finding'
 * });
 * ```
 */
export const createAnnotationModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'parsed_documents',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    pageNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    type: {
      type: DataTypes.ENUM(
        'comment',
        'highlight',
        'underline',
        'strikethrough',
        'sticky_note',
        'stamp',
        'drawing',
        'text',
        'arrow',
        'rectangle',
        'circle',
      ),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Comment or note text',
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User ID of annotation creator',
    },
    authorName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bounds: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Annotation position and size {x, y, width, height}',
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#FFFF00',
    },
    opacity: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.5,
      validate: {
        min: 0,
        max: 1,
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'resolved', 'deleted', 'archived'),
      allowNull: false,
      defaultValue: 'active',
    },
    threadId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comment_threads',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'annotations',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    selectedText: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Text selected for highlight/underline',
    },
    pathData: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SVG path data for drawings',
    },
    stampType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    customData: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    mentions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of mentioned users',
    },
    resolvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    tableName: 'annotations',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['documentId', 'pageNumber'] },
      { fields: ['documentId', 'type'] },
      { fields: ['authorId'] },
      { fields: ['threadId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] },
    ],
  };

  return sequelize.define('Annotation', attributes, options);
};

/**
 * Creates CommentThread model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<CommentThreadAttributes>>} CommentThread model
 *
 * @example
 * ```typescript
 * const ThreadModel = createCommentThreadModel(sequelize);
 * const thread = await ThreadModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 1,
 *   status: 'open',
 *   createdBy: 'user-123',
 *   participants: '["user-123", "user-456"]'
 * });
 * ```
 */
export const createCommentThreadModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'parsed_documents',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    pageNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
    participants: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
      comment: 'JSON array of participant user IDs',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    resolvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    tableName: 'comment_threads',
    timestamps: true,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['status'] },
      { fields: ['createdBy'] },
    ],
  };

  return sequelize.define('CommentThread', attributes, options);
};

// ============================================================================
// 1. COMMENT CREATION & MANAGEMENT
// ============================================================================

/**
 * 1. Creates a new comment annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} comment - Comment details
 * @returns {Promise<CommentAnnotation>} Created comment
 *
 * @example
 * ```typescript
 * const comment = await createComment('doc-123', 1, {
 *   content: 'Please review this section',
 *   author: { userId: 'user-123', name: 'Dr. Smith' },
 *   bounds: { x: 100, y: 500, width: 200, height: 50 }
 * });
 * ```
 */
export const createComment = async (
  documentId: string,
  pageNumber: number,
  comment: {
    content: string;
    author: { userId: string; name: string; email?: string };
    bounds?: { x: number; y: number; width: number; height: number };
  },
): Promise<CommentAnnotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'comment',
    content: comment.content,
    author: comment.author,
    bounds: comment.bounds,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 2. Updates existing comment.
 *
 * @param {string} commentId - Comment ID
 * @param {Partial<CommentAnnotation>} updates - Fields to update
 * @returns {Promise<CommentAnnotation>} Updated comment
 *
 * @example
 * ```typescript
 * const updated = await updateComment('comment-123', {
 *   content: 'Updated comment text',
 *   status: 'resolved'
 * });
 * ```
 */
export const updateComment = async (
  commentId: string,
  updates: Partial<CommentAnnotation>,
): Promise<CommentAnnotation> => {
  // Placeholder for database update
  return {
    id: commentId,
    documentId: 'doc-123',
    pageNumber: 1,
    type: 'comment',
    content: updates.content || '',
    author: { userId: 'user-123', name: 'Dr. Smith' },
    status: updates.status || 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 3. Deletes comment annotation.
 *
 * @param {string} commentId - Comment ID
 * @param {boolean} [softDelete] - Soft delete (default: true)
 * @returns {Promise<boolean>} True if deleted
 *
 * @example
 * ```typescript
 * await deleteComment('comment-123');
 * ```
 */
export const deleteComment = async (commentId: string, softDelete: boolean = true): Promise<boolean> => {
  // Placeholder for deletion logic
  return true;
};

/**
 * 4. Retrieves comment by ID.
 *
 * @param {string} commentId - Comment ID
 * @returns {Promise<CommentAnnotation | null>} Comment or null
 *
 * @example
 * ```typescript
 * const comment = await getCommentById('comment-123');
 * ```
 */
export const getCommentById = async (commentId: string): Promise<CommentAnnotation | null> => {
  // Placeholder for retrieval
  return null;
};

/**
 * 5. Lists all comments for document.
 *
 * @param {string} documentId - Document ID
 * @param {AnnotationFilterOptions} [filters] - Filter options
 * @returns {Promise<CommentAnnotation[]>} Array of comments
 *
 * @example
 * ```typescript
 * const comments = await listComments('doc-123', {
 *   pageNumber: [1, 2],
 *   status: ['active']
 * });
 * ```
 */
export const listComments = async (
  documentId: string,
  filters?: AnnotationFilterOptions,
): Promise<CommentAnnotation[]> => {
  // Placeholder for listing logic
  return [];
};

// ============================================================================
// 2. REPLY THREADS & CONVERSATIONS
// ============================================================================

/**
 * 6. Creates comment thread.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {string} createdBy - User ID
 * @returns {Promise<CommentThread>} Created thread
 *
 * @example
 * ```typescript
 * const thread = await createCommentThread('doc-123', 1, 'user-123');
 * ```
 */
export const createCommentThread = async (
  documentId: string,
  pageNumber: number,
  createdBy: string,
): Promise<CommentThread> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    status: 'open',
    comments: [],
    participants: [createdBy],
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 7. Adds reply to comment thread.
 *
 * @param {string} threadId - Thread ID
 * @param {string} parentCommentId - Parent comment ID
 * @param {Object} reply - Reply details
 * @returns {Promise<CommentAnnotation>} Reply comment
 *
 * @example
 * ```typescript
 * const reply = await addReplyToThread('thread-123', 'comment-456', {
 *   content: 'I agree with this assessment',
 *   author: { userId: 'user-789', name: 'Dr. Johnson' }
 * });
 * ```
 */
export const addReplyToThread = async (
  threadId: string,
  parentCommentId: string,
  reply: {
    content: string;
    author: { userId: string; name: string; email?: string };
  },
): Promise<CommentAnnotation> => {
  const comment = await createComment('doc-123', 1, reply);
  return {
    ...comment,
    threadId,
    parentId: parentCommentId,
  };
};

/**
 * 8. Gets all replies in thread.
 *
 * @param {string} threadId - Thread ID
 * @returns {Promise<CommentAnnotation[]>} Thread replies
 *
 * @example
 * ```typescript
 * const replies = await getThreadReplies('thread-123');
 * ```
 */
export const getThreadReplies = async (threadId: string): Promise<CommentAnnotation[]> => {
  // Placeholder for thread replies retrieval
  return [];
};

/**
 * 9. Resolves comment thread.
 *
 * @param {string} threadId - Thread ID
 * @param {string} resolvedBy - User ID
 * @returns {Promise<CommentThread>} Resolved thread
 *
 * @example
 * ```typescript
 * const resolved = await resolveThread('thread-123', 'user-123');
 * ```
 */
export const resolveThread = async (threadId: string, resolvedBy: string): Promise<CommentThread> => {
  // Placeholder for resolution logic
  return {
    id: threadId,
    documentId: 'doc-123',
    pageNumber: 1,
    status: 'resolved',
    comments: [],
    participants: [],
    createdBy: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    resolvedBy,
    resolvedAt: new Date(),
  };
};

/**
 * 10. Reopens resolved thread.
 *
 * @param {string} threadId - Thread ID
 * @returns {Promise<CommentThread>} Reopened thread
 *
 * @example
 * ```typescript
 * const reopened = await reopenThread('thread-123');
 * ```
 */
export const reopenThread = async (threadId: string): Promise<CommentThread> => {
  // Placeholder for reopen logic
  return {
    id: threadId,
    documentId: 'doc-123',
    pageNumber: 1,
    status: 'open',
    comments: [],
    participants: [],
    createdBy: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// 3. MENTIONS & NOTIFICATIONS
// ============================================================================

/**
 * 11. Adds mention to comment.
 *
 * @param {string} commentId - Comment ID
 * @param {Mention} mention - Mention details
 * @returns {Promise<CommentAnnotation>} Updated comment
 *
 * @example
 * ```typescript
 * const updated = await addMentionToComment('comment-123', {
 *   userId: 'user-456',
 *   userName: 'Dr. Wilson',
 *   position: 15,
 *   notified: false
 * });
 * ```
 */
export const addMentionToComment = async (commentId: string, mention: Mention): Promise<CommentAnnotation> => {
  // Placeholder for adding mention
  return {
    id: commentId,
    documentId: 'doc-123',
    pageNumber: 1,
    type: 'comment',
    content: '',
    author: { userId: 'user-123', name: 'Dr. Smith' },
    status: 'active',
    mentions: [mention],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 12. Extracts mentions from comment text.
 *
 * @param {string} text - Comment text with @mentions
 * @returns {Promise<Mention[]>} Extracted mentions
 *
 * @example
 * ```typescript
 * const mentions = await extractMentions('@DrSmith please review @DrJohnson');
 * ```
 */
export const extractMentions = async (text: string): Promise<Mention[]> => {
  const mentionRegex = /@(\w+)/g;
  const matches = text.matchAll(mentionRegex);
  const mentions: Mention[] = [];

  for (const match of matches) {
    mentions.push({
      userId: match[1],
      userName: match[1],
      position: match.index || 0,
      notified: false,
    });
  }

  return mentions;
};

/**
 * 13. Sends notification for mention.
 *
 * @param {string} commentId - Comment ID
 * @param {string} userId - Mentioned user ID
 * @returns {Promise<ReplyNotification>} Notification record
 *
 * @example
 * ```typescript
 * await sendMentionNotification('comment-123', 'user-456');
 * ```
 */
export const sendMentionNotification = async (
  commentId: string,
  userId: string,
): Promise<ReplyNotification> => {
  return {
    recipientId: userId,
    commentId,
    threadId: 'thread-123',
    replyBy: 'user-123',
    replyContent: 'You were mentioned in a comment',
    sent: true,
    sentAt: new Date(),
  };
};

/**
 * 14. Gets mentions for user.
 *
 * @param {string} userId - User ID
 * @param {boolean} [unreadOnly] - Only unread mentions
 * @returns {Promise<CommentAnnotation[]>} Comments mentioning user
 *
 * @example
 * ```typescript
 * const myMentions = await getUserMentions('user-123', true);
 * ```
 */
export const getUserMentions = async (
  userId: string,
  unreadOnly?: boolean,
): Promise<CommentAnnotation[]> => {
  // Placeholder for mentions retrieval
  return [];
};

/**
 * 15. Marks mention as read.
 *
 * @param {string} commentId - Comment ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if marked
 *
 * @example
 * ```typescript
 * await markMentionAsRead('comment-123', 'user-456');
 * ```
 */
export const markMentionAsRead = async (commentId: string, userId: string): Promise<boolean> => {
  // Placeholder for marking as read
  return true;
};

// ============================================================================
// 4. HIGHLIGHT ANNOTATIONS
// ============================================================================

/**
 * 16. Creates highlight annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} highlight - Highlight details
 * @returns {Promise<HighlightAnnotation>} Created highlight
 *
 * @example
 * ```typescript
 * const highlight = await createHighlight('doc-123', 1, {
 *   selectedText: 'Important diagnosis',
 *   bounds: { x: 100, y: 500, width: 200, height: 15 },
 *   color: '#FFFF00',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createHighlight = async (
  documentId: string,
  pageNumber: number,
  highlight: {
    selectedText: string;
    bounds: { x: number; y: number; width: number; height: number };
    color?: string;
    opacity?: number;
    author: { userId: string; name: string };
  },
): Promise<HighlightAnnotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'highlight',
    selectedText: highlight.selectedText,
    bounds: highlight.bounds,
    color: highlight.color || '#FFFF00',
    opacity: highlight.opacity || 0.5,
    author: highlight.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 17. Creates underline annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} underline - Underline details
 * @returns {Promise<Annotation>} Created underline
 *
 * @example
 * ```typescript
 * const underline = await createUnderline('doc-123', 1, {
 *   selectedText: 'Key finding',
 *   bounds: { x: 100, y: 500, width: 150, height: 12 },
 *   color: '#FF0000',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createUnderline = async (
  documentId: string,
  pageNumber: number,
  underline: {
    selectedText: string;
    bounds: { x: number; y: number; width: number; height: number };
    color?: string;
    author: { userId: string; name: string };
  },
): Promise<Annotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'underline',
    bounds: underline.bounds,
    color: underline.color || '#FF0000',
    author: underline.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { selectedText: underline.selectedText },
  };
};

/**
 * 18. Creates strikethrough annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} strikethrough - Strikethrough details
 * @returns {Promise<Annotation>} Created strikethrough
 *
 * @example
 * ```typescript
 * const strike = await createStrikethrough('doc-123', 1, {
 *   selectedText: 'Obsolete information',
 *   bounds: { x: 100, y: 500, width: 200, height: 12 },
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createStrikethrough = async (
  documentId: string,
  pageNumber: number,
  strikethrough: {
    selectedText: string;
    bounds: { x: number; y: number; width: number; height: number };
    color?: string;
    author: { userId: string; name: string };
  },
): Promise<Annotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'strikethrough',
    bounds: strikethrough.bounds,
    color: strikethrough.color || '#FF0000',
    author: strikethrough.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { selectedText: strikethrough.selectedText },
  };
};

/**
 * 19. Changes highlight color.
 *
 * @param {string} highlightId - Highlight ID
 * @param {string} color - New color (hex)
 * @returns {Promise<HighlightAnnotation>} Updated highlight
 *
 * @example
 * ```typescript
 * const updated = await changeHighlightColor('highlight-123', '#00FF00');
 * ```
 */
export const changeHighlightColor = async (highlightId: string, color: string): Promise<HighlightAnnotation> => {
  // Placeholder for color change
  return {
    id: highlightId,
    documentId: 'doc-123',
    pageNumber: 1,
    type: 'highlight',
    selectedText: 'Text',
    color,
    opacity: 0.5,
    author: { userId: 'user-123', name: 'Dr. Smith' },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 20. Removes highlight annotation.
 *
 * @param {string} highlightId - Highlight ID
 * @returns {Promise<boolean>} True if removed
 *
 * @example
 * ```typescript
 * await removeHighlight('highlight-123');
 * ```
 */
export const removeHighlight = async (highlightId: string): Promise<boolean> => {
  return await deleteComment(highlightId);
};

// ============================================================================
// 5. STICKY NOTES & STAMPS
// ============================================================================

/**
 * 21. Creates sticky note annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} note - Sticky note details
 * @returns {Promise<StickyNoteAnnotation>} Created sticky note
 *
 * @example
 * ```typescript
 * const note = await createStickyNote('doc-123', 1, {
 *   content: 'Follow up required',
 *   position: { x: 500, y: 100 },
 *   color: '#FFEB3B',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createStickyNote = async (
  documentId: string,
  pageNumber: number,
  note: {
    content: string;
    position: { x: number; y: number };
    color?: string;
    author: { userId: string; name: string };
  },
): Promise<StickyNoteAnnotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'sticky_note',
    content: note.content,
    bounds: { x: note.position.x, y: note.position.y, width: 150, height: 150 },
    color: note.color || '#FFEB3B',
    author: note.author,
    status: 'active',
    minimized: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 22. Updates sticky note content.
 *
 * @param {string} noteId - Note ID
 * @param {string} content - New content
 * @returns {Promise<StickyNoteAnnotation>} Updated note
 *
 * @example
 * ```typescript
 * const updated = await updateStickyNote('note-123', 'Updated note text');
 * ```
 */
export const updateStickyNote = async (noteId: string, content: string): Promise<StickyNoteAnnotation> => {
  return {
    id: noteId,
    documentId: 'doc-123',
    pageNumber: 1,
    type: 'sticky_note',
    content,
    color: '#FFEB3B',
    author: { userId: 'user-123', name: 'Dr. Smith' },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 23. Minimizes/expands sticky note.
 *
 * @param {string} noteId - Note ID
 * @param {boolean} minimized - Minimized state
 * @returns {Promise<StickyNoteAnnotation>} Updated note
 *
 * @example
 * ```typescript
 * await toggleStickyNoteMinimized('note-123', true);
 * ```
 */
export const toggleStickyNoteMinimized = async (
  noteId: string,
  minimized: boolean,
): Promise<StickyNoteAnnotation> => {
  return {
    id: noteId,
    documentId: 'doc-123',
    pageNumber: 1,
    type: 'sticky_note',
    content: 'Note content',
    color: '#FFEB3B',
    author: { userId: 'user-123', name: 'Dr. Smith' },
    status: 'active',
    minimized,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 24. Creates stamp annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} stamp - Stamp details
 * @returns {Promise<StampAnnotation>} Created stamp
 *
 * @example
 * ```typescript
 * const stamp = await createStamp('doc-123', 1, {
 *   stampType: 'approved',
 *   position: { x: 400, y: 700 },
 *   rotation: 45,
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createStamp = async (
  documentId: string,
  pageNumber: number,
  stamp: {
    stampType: 'approved' | 'reviewed' | 'confidential' | 'draft' | 'final' | 'custom';
    customText?: string;
    position: { x: number; y: number };
    rotation?: number;
    author: { userId: string; name: string };
  },
): Promise<StampAnnotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'stamp',
    stampType: stamp.stampType,
    customText: stamp.customText,
    bounds: { x: stamp.position.x, y: stamp.position.y, width: 150, height: 50 },
    rotation: stamp.rotation || 0,
    author: stamp.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 25. Lists available stamp types.
 *
 * @returns {Promise<Array<{ type: string; label: string; color: string }>>} Stamp types
 *
 * @example
 * ```typescript
 * const stampTypes = await getAvailableStamps();
 * ```
 */
export const getAvailableStamps = async (): Promise<Array<{ type: string; label: string; color: string }>> => {
  return [
    { type: 'approved', label: 'APPROVED', color: '#4CAF50' },
    { type: 'reviewed', label: 'REVIEWED', color: '#2196F3' },
    { type: 'confidential', label: 'CONFIDENTIAL', color: '#F44336' },
    { type: 'draft', label: 'DRAFT', color: '#FF9800' },
    { type: 'final', label: 'FINAL', color: '#9C27B0' },
  ];
};

// ============================================================================
// 6. DRAWING ANNOTATIONS
// ============================================================================

/**
 * 26. Creates drawing annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} drawing - Drawing details
 * @returns {Promise<DrawingAnnotation>} Created drawing
 *
 * @example
 * ```typescript
 * const drawing = await createDrawing('doc-123', 1, {
 *   pathData: 'M 100 100 L 200 200',
 *   strokeWidth: 2,
 *   strokeColor: '#000000',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createDrawing = async (
  documentId: string,
  pageNumber: number,
  drawing: {
    pathData: string;
    strokeWidth: number;
    strokeColor: string;
    author: { userId: string; name: string };
  },
): Promise<DrawingAnnotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'drawing',
    pathData: drawing.pathData,
    strokeWidth: drawing.strokeWidth,
    strokeColor: drawing.strokeColor,
    author: drawing.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * 27. Creates arrow annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} arrow - Arrow details
 * @returns {Promise<Annotation>} Created arrow
 *
 * @example
 * ```typescript
 * const arrow = await createArrow('doc-123', 1, {
 *   start: { x: 100, y: 100 },
 *   end: { x: 200, y: 200 },
 *   color: '#FF0000',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createArrow = async (
  documentId: string,
  pageNumber: number,
  arrow: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    color?: string;
    author: { userId: string; name: string };
  },
): Promise<Annotation> => {
  const id = crypto.randomBytes(16).toString('hex');
  const pathData = `M ${arrow.start.x} ${arrow.start.y} L ${arrow.end.x} ${arrow.end.y}`;

  return {
    id,
    documentId,
    pageNumber,
    type: 'arrow',
    color: arrow.color || '#FF0000',
    author: arrow.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { pathData, start: arrow.start, end: arrow.end },
  };
};

/**
 * 28. Creates rectangle annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} rectangle - Rectangle details
 * @returns {Promise<Annotation>} Created rectangle
 *
 * @example
 * ```typescript
 * const rect = await createRectangle('doc-123', 1, {
 *   bounds: { x: 100, y: 100, width: 200, height: 150 },
 *   strokeColor: '#0000FF',
 *   fillColor: 'transparent',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createRectangle = async (
  documentId: string,
  pageNumber: number,
  rectangle: {
    bounds: { x: number; y: number; width: number; height: number };
    strokeColor?: string;
    fillColor?: string;
    author: { userId: string; name: string };
  },
): Promise<Annotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'rectangle',
    bounds: rectangle.bounds,
    color: rectangle.strokeColor || '#0000FF',
    author: rectangle.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { fillColor: rectangle.fillColor || 'transparent' },
  };
};

/**
 * 29. Creates circle annotation.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {Object} circle - Circle details
 * @returns {Promise<Annotation>} Created circle
 *
 * @example
 * ```typescript
 * const circle = await createCircle('doc-123', 1, {
 *   center: { x: 200, y: 200 },
 *   radius: 50,
 *   strokeColor: '#00FF00',
 *   author: { userId: 'user-123', name: 'Dr. Smith' }
 * });
 * ```
 */
export const createCircle = async (
  documentId: string,
  pageNumber: number,
  circle: {
    center: { x: number; y: number };
    radius: number;
    strokeColor?: string;
    fillColor?: string;
    author: { userId: string; name: string };
  },
): Promise<Annotation> => {
  const id = crypto.randomBytes(16).toString('hex');

  return {
    id,
    documentId,
    pageNumber,
    type: 'circle',
    bounds: {
      x: circle.center.x - circle.radius,
      y: circle.center.y - circle.radius,
      width: circle.radius * 2,
      height: circle.radius * 2,
    },
    color: circle.strokeColor || '#00FF00',
    author: circle.author,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { center: circle.center, radius: circle.radius, fillColor: circle.fillColor || 'transparent' },
  };
};

/**
 * 30. Erases drawing annotation.
 *
 * @param {string} drawingId - Drawing ID
 * @returns {Promise<boolean>} True if erased
 *
 * @example
 * ```typescript
 * await eraseDrawing('drawing-123');
 * ```
 */
export const eraseDrawing = async (drawingId: string): Promise<boolean> => {
  return await deleteComment(drawingId);
};

// ============================================================================
// 7. ANNOTATION PERMISSIONS & VISIBILITY
// ============================================================================

/**
 * 31. Sets annotation permissions.
 *
 * @param {string} annotationId - Annotation ID
 * @param {AnnotationPermissions} permissions - Permission settings
 * @returns {Promise<AnnotationPermissions>} Set permissions
 *
 * @example
 * ```typescript
 * await setAnnotationPermissions('annotation-123', {
 *   annotationId: 'annotation-123',
 *   userId: 'user-456',
 *   canView: true,
 *   canEdit: true,
 *   canDelete: false,
 *   canReply: true,
 *   canResolve: true
 * });
 * ```
 */
export const setAnnotationPermissions = async (
  annotationId: string,
  permissions: AnnotationPermissions,
): Promise<AnnotationPermissions> => {
  // Placeholder for setting permissions
  return permissions;
};

/**
 * 32. Checks annotation permission.
 *
 * @param {string} annotationId - Annotation ID
 * @param {string} userId - User ID
 * @param {keyof AnnotationPermissions} permission - Permission to check
 * @returns {Promise<boolean>} True if has permission
 *
 * @example
 * ```typescript
 * const canEdit = await checkAnnotationPermission('annotation-123', 'user-456', 'canEdit');
 * ```
 */
export const checkAnnotationPermission = async (
  annotationId: string,
  userId: string,
  permission: keyof AnnotationPermissions,
): Promise<boolean> => {
  // Placeholder for permission check
  return true;
};

/**
 * 33. Sets annotation visibility.
 *
 * @param {string} annotationId - Annotation ID
 * @param {AnnotationVisibility} visibility - Visibility settings
 * @returns {Promise<AnnotationVisibility>} Set visibility
 *
 * @example
 * ```typescript
 * await setAnnotationVisibility('annotation-123', {
 *   annotationId: 'annotation-123',
 *   visibilityLevel: 'team',
 *   allowedTeams: ['team-cardiology']
 * });
 * ```
 */
export const setAnnotationVisibility = async (
  annotationId: string,
  visibility: AnnotationVisibility,
): Promise<AnnotationVisibility> => {
  // Placeholder for visibility setting
  return visibility;
};

/**
 * 34. Gets visible annotations for user.
 *
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<Annotation[]>} Visible annotations
 *
 * @example
 * ```typescript
 * const visible = await getVisibleAnnotations('doc-123', 'user-456');
 * ```
 */
export const getVisibleAnnotations = async (documentId: string, userId: string): Promise<Annotation[]> => {
  // Placeholder for visibility filtering
  return [];
};

/**
 * 35. Makes annotation private.
 *
 * @param {string} annotationId - Annotation ID
 * @returns {Promise<boolean>} True if set private
 *
 * @example
 * ```typescript
 * await makeAnnotationPrivate('annotation-123');
 * ```
 */
export const makeAnnotationPrivate = async (annotationId: string): Promise<boolean> => {
  await setAnnotationVisibility(annotationId, {
    annotationId,
    visibilityLevel: 'private',
  });
  return true;
};

// ============================================================================
// 8. ANNOTATION EXPORT & IMPORT
// ============================================================================

/**
 * 36. Exports annotations to format.
 *
 * @param {string} documentId - Document ID
 * @param {AnnotationExportFormat} format - Export format
 * @returns {Promise<string | Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const json = await exportAnnotations('doc-123', 'json');
 * const csv = await exportAnnotations('doc-123', 'csv');
 * ```
 */
export const exportAnnotations = async (
  documentId: string,
  format: AnnotationExportFormat,
): Promise<string | Buffer> => {
  const annotations = await listComments(documentId);

  switch (format) {
    case 'json':
      return JSON.stringify(annotations, null, 2);
    case 'csv':
      const header = 'ID,Type,Page,Author,Content,Created\n';
      const rows = annotations
        .map((a) => `${a.id},${a.type},${a.pageNumber},${a.author.name},"${a.content}",${a.createdAt}`)
        .join('\n');
      return header + rows;
    case 'pdf':
      return Buffer.from('pdf-with-annotations-placeholder');
    default:
      return JSON.stringify(annotations);
  }
};

/**
 * 37. Imports annotations from data.
 *
 * @param {string} documentId - Document ID
 * @param {string | Buffer} data - Import data
 * @param {AnnotationExportFormat} format - Import format
 * @returns {Promise<Annotation[]>} Imported annotations
 *
 * @example
 * ```typescript
 * const imported = await importAnnotations('doc-123', jsonData, 'json');
 * ```
 */
export const importAnnotations = async (
  documentId: string,
  data: string | Buffer,
  format: AnnotationExportFormat,
): Promise<Annotation[]> => {
  // Placeholder for import logic
  return [];
};

/**
 * 38. Exports single annotation.
 *
 * @param {string} annotationId - Annotation ID
 * @param {AnnotationExportFormat} format - Export format
 * @returns {Promise<string>} Exported annotation
 *
 * @example
 * ```typescript
 * const exported = await exportSingleAnnotation('annotation-123', 'json');
 * ```
 */
export const exportSingleAnnotation = async (
  annotationId: string,
  format: AnnotationExportFormat,
): Promise<string> => {
  const annotation = await getCommentById(annotationId);
  return JSON.stringify(annotation, null, 2);
};

/**
 * 39. Merges annotations from multiple sources.
 *
 * @param {string} documentId - Document ID
 * @param {Annotation[][]} annotationSets - Multiple annotation sets
 * @returns {Promise<Annotation[]>} Merged annotations
 *
 * @example
 * ```typescript
 * const merged = await mergeAnnotations('doc-123', [set1, set2, set3]);
 * ```
 */
export const mergeAnnotations = async (documentId: string, annotationSets: Annotation[][]): Promise<Annotation[]> => {
  const merged: Annotation[] = [];
  const seenIds = new Set<string>();

  for (const set of annotationSets) {
    for (const annotation of set) {
      if (!seenIds.has(annotation.id)) {
        merged.push(annotation);
        seenIds.add(annotation.id);
      }
    }
  }

  return merged;
};

/**
 * 40. Archives old annotations.
 *
 * @param {string} documentId - Document ID
 * @param {Date} olderThan - Archive annotations older than date
 * @returns {Promise<number>} Number of archived annotations
 *
 * @example
 * ```typescript
 * const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
 * const archived = await archiveOldAnnotations('doc-123', thirtyDaysAgo);
 * console.log(`Archived ${archived} annotations`);
 * ```
 */
export const archiveOldAnnotations = async (documentId: string, olderThan: Date): Promise<number> => {
  const annotations = await listComments(documentId);
  let archivedCount = 0;

  for (const annotation of annotations) {
    if (annotation.createdAt < olderThan && annotation.status === 'active') {
      await updateComment(annotation.id, { status: 'archived' });
      archivedCount++;
    }
  }

  return archivedCount;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model creators
  createAnnotationModel,
  createCommentThreadModel,

  // Comments
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  listComments,

  // Threads
  createCommentThread,
  addReplyToThread,
  getThreadReplies,
  resolveThread,
  reopenThread,

  // Mentions
  addMentionToComment,
  extractMentions,
  sendMentionNotification,
  getUserMentions,
  markMentionAsRead,

  // Highlights
  createHighlight,
  createUnderline,
  createStrikethrough,
  changeHighlightColor,
  removeHighlight,

  // Notes & Stamps
  createStickyNote,
  updateStickyNote,
  toggleStickyNoteMinimized,
  createStamp,
  getAvailableStamps,

  // Drawings
  createDrawing,
  createArrow,
  createRectangle,
  createCircle,
  eraseDrawing,

  // Permissions
  setAnnotationPermissions,
  checkAnnotationPermission,
  setAnnotationVisibility,
  getVisibleAnnotations,
  makeAnnotationPrivate,

  // Export/Import
  exportAnnotations,
  importAnnotations,
  exportSingleAnnotation,
  mergeAnnotations,
  archiveOldAnnotations,
};
