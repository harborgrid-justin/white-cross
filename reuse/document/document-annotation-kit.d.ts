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
import { Sequelize } from 'sequelize';
/**
 * Annotation types
 */
export type AnnotationType = 'comment' | 'highlight' | 'underline' | 'strikethrough' | 'sticky_note' | 'stamp' | 'drawing' | 'text' | 'arrow' | 'rectangle' | 'circle';
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
    dateRange?: {
        start: Date;
        end: Date;
    };
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
export declare const createAnnotationModel: (sequelize: Sequelize) => any;
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
export declare const createCommentThreadModel: (sequelize: Sequelize) => any;
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
export declare const createComment: (documentId: string, pageNumber: number, comment: {
    content: string;
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
}) => Promise<CommentAnnotation>;
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
export declare const updateComment: (commentId: string, updates: Partial<CommentAnnotation>) => Promise<CommentAnnotation>;
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
export declare const deleteComment: (commentId: string, softDelete?: boolean) => Promise<boolean>;
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
export declare const getCommentById: (commentId: string) => Promise<CommentAnnotation | null>;
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
export declare const listComments: (documentId: string, filters?: AnnotationFilterOptions) => Promise<CommentAnnotation[]>;
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
export declare const createCommentThread: (documentId: string, pageNumber: number, createdBy: string) => Promise<CommentThread>;
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
export declare const addReplyToThread: (threadId: string, parentCommentId: string, reply: {
    content: string;
    author: {
        userId: string;
        name: string;
        email?: string;
    };
}) => Promise<CommentAnnotation>;
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
export declare const getThreadReplies: (threadId: string) => Promise<CommentAnnotation[]>;
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
export declare const resolveThread: (threadId: string, resolvedBy: string) => Promise<CommentThread>;
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
export declare const reopenThread: (threadId: string) => Promise<CommentThread>;
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
export declare const addMentionToComment: (commentId: string, mention: Mention) => Promise<CommentAnnotation>;
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
export declare const extractMentions: (text: string) => Promise<Mention[]>;
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
export declare const sendMentionNotification: (commentId: string, userId: string) => Promise<ReplyNotification>;
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
export declare const getUserMentions: (userId: string, unreadOnly?: boolean) => Promise<CommentAnnotation[]>;
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
export declare const markMentionAsRead: (commentId: string, userId: string) => Promise<boolean>;
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
export declare const createHighlight: (documentId: string, pageNumber: number, highlight: {
    selectedText: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    color?: string;
    opacity?: number;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<HighlightAnnotation>;
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
export declare const createUnderline: (documentId: string, pageNumber: number, underline: {
    selectedText: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    color?: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<Annotation>;
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
export declare const createStrikethrough: (documentId: string, pageNumber: number, strikethrough: {
    selectedText: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    color?: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<Annotation>;
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
export declare const changeHighlightColor: (highlightId: string, color: string) => Promise<HighlightAnnotation>;
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
export declare const removeHighlight: (highlightId: string) => Promise<boolean>;
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
export declare const createStickyNote: (documentId: string, pageNumber: number, note: {
    content: string;
    position: {
        x: number;
        y: number;
    };
    color?: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<StickyNoteAnnotation>;
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
export declare const updateStickyNote: (noteId: string, content: string) => Promise<StickyNoteAnnotation>;
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
export declare const toggleStickyNoteMinimized: (noteId: string, minimized: boolean) => Promise<StickyNoteAnnotation>;
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
export declare const createStamp: (documentId: string, pageNumber: number, stamp: {
    stampType: "approved" | "reviewed" | "confidential" | "draft" | "final" | "custom";
    customText?: string;
    position: {
        x: number;
        y: number;
    };
    rotation?: number;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<StampAnnotation>;
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
export declare const getAvailableStamps: () => Promise<Array<{
    type: string;
    label: string;
    color: string;
}>>;
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
export declare const createDrawing: (documentId: string, pageNumber: number, drawing: {
    pathData: string;
    strokeWidth: number;
    strokeColor: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<DrawingAnnotation>;
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
export declare const createArrow: (documentId: string, pageNumber: number, arrow: {
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    };
    color?: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<Annotation>;
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
export declare const createRectangle: (documentId: string, pageNumber: number, rectangle: {
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    strokeColor?: string;
    fillColor?: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<Annotation>;
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
export declare const createCircle: (documentId: string, pageNumber: number, circle: {
    center: {
        x: number;
        y: number;
    };
    radius: number;
    strokeColor?: string;
    fillColor?: string;
    author: {
        userId: string;
        name: string;
    };
}) => Promise<Annotation>;
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
export declare const eraseDrawing: (drawingId: string) => Promise<boolean>;
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
export declare const setAnnotationPermissions: (annotationId: string, permissions: AnnotationPermissions) => Promise<AnnotationPermissions>;
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
export declare const checkAnnotationPermission: (annotationId: string, userId: string, permission: keyof AnnotationPermissions) => Promise<boolean>;
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
export declare const setAnnotationVisibility: (annotationId: string, visibility: AnnotationVisibility) => Promise<AnnotationVisibility>;
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
export declare const getVisibleAnnotations: (documentId: string, userId: string) => Promise<Annotation[]>;
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
export declare const makeAnnotationPrivate: (annotationId: string) => Promise<boolean>;
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
export declare const exportAnnotations: (documentId: string, format: AnnotationExportFormat) => Promise<string | Buffer>;
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
export declare const importAnnotations: (documentId: string, data: string | Buffer, format: AnnotationExportFormat) => Promise<Annotation[]>;
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
export declare const exportSingleAnnotation: (annotationId: string, format: AnnotationExportFormat) => Promise<string>;
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
export declare const mergeAnnotations: (documentId: string, annotationSets: Annotation[][]) => Promise<Annotation[]>;
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
export declare const archiveOldAnnotations: (documentId: string, olderThan: Date) => Promise<number>;
declare const _default: {
    createAnnotationModel: (sequelize: Sequelize) => any;
    createCommentThreadModel: (sequelize: Sequelize) => any;
    createComment: (documentId: string, pageNumber: number, comment: {
        content: string;
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
    }) => Promise<CommentAnnotation>;
    updateComment: (commentId: string, updates: Partial<CommentAnnotation>) => Promise<CommentAnnotation>;
    deleteComment: (commentId: string, softDelete?: boolean) => Promise<boolean>;
    getCommentById: (commentId: string) => Promise<CommentAnnotation | null>;
    listComments: (documentId: string, filters?: AnnotationFilterOptions) => Promise<CommentAnnotation[]>;
    createCommentThread: (documentId: string, pageNumber: number, createdBy: string) => Promise<CommentThread>;
    addReplyToThread: (threadId: string, parentCommentId: string, reply: {
        content: string;
        author: {
            userId: string;
            name: string;
            email?: string;
        };
    }) => Promise<CommentAnnotation>;
    getThreadReplies: (threadId: string) => Promise<CommentAnnotation[]>;
    resolveThread: (threadId: string, resolvedBy: string) => Promise<CommentThread>;
    reopenThread: (threadId: string) => Promise<CommentThread>;
    addMentionToComment: (commentId: string, mention: Mention) => Promise<CommentAnnotation>;
    extractMentions: (text: string) => Promise<Mention[]>;
    sendMentionNotification: (commentId: string, userId: string) => Promise<ReplyNotification>;
    getUserMentions: (userId: string, unreadOnly?: boolean) => Promise<CommentAnnotation[]>;
    markMentionAsRead: (commentId: string, userId: string) => Promise<boolean>;
    createHighlight: (documentId: string, pageNumber: number, highlight: {
        selectedText: string;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        color?: string;
        opacity?: number;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<HighlightAnnotation>;
    createUnderline: (documentId: string, pageNumber: number, underline: {
        selectedText: string;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        color?: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<Annotation>;
    createStrikethrough: (documentId: string, pageNumber: number, strikethrough: {
        selectedText: string;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        color?: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<Annotation>;
    changeHighlightColor: (highlightId: string, color: string) => Promise<HighlightAnnotation>;
    removeHighlight: (highlightId: string) => Promise<boolean>;
    createStickyNote: (documentId: string, pageNumber: number, note: {
        content: string;
        position: {
            x: number;
            y: number;
        };
        color?: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<StickyNoteAnnotation>;
    updateStickyNote: (noteId: string, content: string) => Promise<StickyNoteAnnotation>;
    toggleStickyNoteMinimized: (noteId: string, minimized: boolean) => Promise<StickyNoteAnnotation>;
    createStamp: (documentId: string, pageNumber: number, stamp: {
        stampType: "approved" | "reviewed" | "confidential" | "draft" | "final" | "custom";
        customText?: string;
        position: {
            x: number;
            y: number;
        };
        rotation?: number;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<StampAnnotation>;
    getAvailableStamps: () => Promise<Array<{
        type: string;
        label: string;
        color: string;
    }>>;
    createDrawing: (documentId: string, pageNumber: number, drawing: {
        pathData: string;
        strokeWidth: number;
        strokeColor: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<DrawingAnnotation>;
    createArrow: (documentId: string, pageNumber: number, arrow: {
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        color?: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<Annotation>;
    createRectangle: (documentId: string, pageNumber: number, rectangle: {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        strokeColor?: string;
        fillColor?: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<Annotation>;
    createCircle: (documentId: string, pageNumber: number, circle: {
        center: {
            x: number;
            y: number;
        };
        radius: number;
        strokeColor?: string;
        fillColor?: string;
        author: {
            userId: string;
            name: string;
        };
    }) => Promise<Annotation>;
    eraseDrawing: (drawingId: string) => Promise<boolean>;
    setAnnotationPermissions: (annotationId: string, permissions: AnnotationPermissions) => Promise<AnnotationPermissions>;
    checkAnnotationPermission: (annotationId: string, userId: string, permission: keyof AnnotationPermissions) => Promise<boolean>;
    setAnnotationVisibility: (annotationId: string, visibility: AnnotationVisibility) => Promise<AnnotationVisibility>;
    getVisibleAnnotations: (documentId: string, userId: string) => Promise<Annotation[]>;
    makeAnnotationPrivate: (annotationId: string) => Promise<boolean>;
    exportAnnotations: (documentId: string, format: AnnotationExportFormat) => Promise<string | Buffer>;
    importAnnotations: (documentId: string, data: string | Buffer, format: AnnotationExportFormat) => Promise<Annotation[]>;
    exportSingleAnnotation: (annotationId: string, format: AnnotationExportFormat) => Promise<string>;
    mergeAnnotations: (documentId: string, annotationSets: Annotation[][]) => Promise<Annotation[]>;
    archiveOldAnnotations: (documentId: string, olderThan: Date) => Promise<number>;
};
export default _default;
//# sourceMappingURL=document-annotation-kit.d.ts.map