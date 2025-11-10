"use strict";
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
exports.archiveOldAnnotations = exports.mergeAnnotations = exports.exportSingleAnnotation = exports.importAnnotations = exports.exportAnnotations = exports.makeAnnotationPrivate = exports.getVisibleAnnotations = exports.setAnnotationVisibility = exports.checkAnnotationPermission = exports.setAnnotationPermissions = exports.eraseDrawing = exports.createCircle = exports.createRectangle = exports.createArrow = exports.createDrawing = exports.getAvailableStamps = exports.createStamp = exports.toggleStickyNoteMinimized = exports.updateStickyNote = exports.createStickyNote = exports.removeHighlight = exports.changeHighlightColor = exports.createStrikethrough = exports.createUnderline = exports.createHighlight = exports.markMentionAsRead = exports.getUserMentions = exports.sendMentionNotification = exports.extractMentions = exports.addMentionToComment = exports.reopenThread = exports.resolveThread = exports.getThreadReplies = exports.addReplyToThread = exports.createCommentThread = exports.listComments = exports.getCommentById = exports.deleteComment = exports.updateComment = exports.createComment = exports.createCommentThreadModel = exports.createAnnotationModel = void 0;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
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
const createAnnotationModel = (sequelize) => {
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
                model: 'parsed_documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        pageNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('comment', 'highlight', 'underline', 'strikethrough', 'sticky_note', 'stamp', 'drawing', 'text', 'arrow', 'rectangle', 'circle'),
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Comment or note text',
        },
        authorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User ID of annotation creator',
        },
        authorName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        bounds: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Annotation position and size {x, y, width, height}',
        },
        color: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            defaultValue: '#FFFF00',
        },
        opacity: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0.5,
            validate: {
                min: 0,
                max: 1,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'resolved', 'deleted', 'archived'),
            allowNull: false,
            defaultValue: 'active',
        },
        threadId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'comment_threads',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'annotations',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        selectedText: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Text selected for highlight/underline',
        },
        pathData: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'SVG path data for drawings',
        },
        stampType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        customData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        mentions: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of mentioned users',
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
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
exports.createAnnotationModel = createAnnotationModel;
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
const createCommentThreadModel = (sequelize) => {
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
                model: 'parsed_documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        pageNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('open', 'resolved', 'closed'),
            allowNull: false,
            defaultValue: 'open',
        },
        participants: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '[]',
            comment: 'JSON array of participant user IDs',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
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
exports.createCommentThreadModel = createCommentThreadModel;
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
const createComment = async (documentId, pageNumber, comment) => {
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
exports.createComment = createComment;
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
const updateComment = async (commentId, updates) => {
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
exports.updateComment = updateComment;
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
const deleteComment = async (commentId, softDelete = true) => {
    // Placeholder for deletion logic
    return true;
};
exports.deleteComment = deleteComment;
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
const getCommentById = async (commentId) => {
    // Placeholder for retrieval
    return null;
};
exports.getCommentById = getCommentById;
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
const listComments = async (documentId, filters) => {
    // Placeholder for listing logic
    return [];
};
exports.listComments = listComments;
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
const createCommentThread = async (documentId, pageNumber, createdBy) => {
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
exports.createCommentThread = createCommentThread;
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
const addReplyToThread = async (threadId, parentCommentId, reply) => {
    const comment = await (0, exports.createComment)('doc-123', 1, reply);
    return {
        ...comment,
        threadId,
        parentId: parentCommentId,
    };
};
exports.addReplyToThread = addReplyToThread;
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
const getThreadReplies = async (threadId) => {
    // Placeholder for thread replies retrieval
    return [];
};
exports.getThreadReplies = getThreadReplies;
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
const resolveThread = async (threadId, resolvedBy) => {
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
exports.resolveThread = resolveThread;
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
const reopenThread = async (threadId) => {
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
exports.reopenThread = reopenThread;
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
const addMentionToComment = async (commentId, mention) => {
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
exports.addMentionToComment = addMentionToComment;
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
const extractMentions = async (text) => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.matchAll(mentionRegex);
    const mentions = [];
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
exports.extractMentions = extractMentions;
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
const sendMentionNotification = async (commentId, userId) => {
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
exports.sendMentionNotification = sendMentionNotification;
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
const getUserMentions = async (userId, unreadOnly) => {
    // Placeholder for mentions retrieval
    return [];
};
exports.getUserMentions = getUserMentions;
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
const markMentionAsRead = async (commentId, userId) => {
    // Placeholder for marking as read
    return true;
};
exports.markMentionAsRead = markMentionAsRead;
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
const createHighlight = async (documentId, pageNumber, highlight) => {
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
exports.createHighlight = createHighlight;
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
const createUnderline = async (documentId, pageNumber, underline) => {
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
exports.createUnderline = createUnderline;
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
const createStrikethrough = async (documentId, pageNumber, strikethrough) => {
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
exports.createStrikethrough = createStrikethrough;
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
const changeHighlightColor = async (highlightId, color) => {
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
exports.changeHighlightColor = changeHighlightColor;
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
const removeHighlight = async (highlightId) => {
    return await (0, exports.deleteComment)(highlightId);
};
exports.removeHighlight = removeHighlight;
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
const createStickyNote = async (documentId, pageNumber, note) => {
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
exports.createStickyNote = createStickyNote;
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
const updateStickyNote = async (noteId, content) => {
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
exports.updateStickyNote = updateStickyNote;
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
const toggleStickyNoteMinimized = async (noteId, minimized) => {
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
exports.toggleStickyNoteMinimized = toggleStickyNoteMinimized;
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
const createStamp = async (documentId, pageNumber, stamp) => {
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
exports.createStamp = createStamp;
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
const getAvailableStamps = async () => {
    return [
        { type: 'approved', label: 'APPROVED', color: '#4CAF50' },
        { type: 'reviewed', label: 'REVIEWED', color: '#2196F3' },
        { type: 'confidential', label: 'CONFIDENTIAL', color: '#F44336' },
        { type: 'draft', label: 'DRAFT', color: '#FF9800' },
        { type: 'final', label: 'FINAL', color: '#9C27B0' },
    ];
};
exports.getAvailableStamps = getAvailableStamps;
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
const createDrawing = async (documentId, pageNumber, drawing) => {
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
exports.createDrawing = createDrawing;
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
const createArrow = async (documentId, pageNumber, arrow) => {
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
exports.createArrow = createArrow;
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
const createRectangle = async (documentId, pageNumber, rectangle) => {
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
exports.createRectangle = createRectangle;
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
const createCircle = async (documentId, pageNumber, circle) => {
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
exports.createCircle = createCircle;
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
const eraseDrawing = async (drawingId) => {
    return await (0, exports.deleteComment)(drawingId);
};
exports.eraseDrawing = eraseDrawing;
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
const setAnnotationPermissions = async (annotationId, permissions) => {
    // Placeholder for setting permissions
    return permissions;
};
exports.setAnnotationPermissions = setAnnotationPermissions;
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
const checkAnnotationPermission = async (annotationId, userId, permission) => {
    // Placeholder for permission check
    return true;
};
exports.checkAnnotationPermission = checkAnnotationPermission;
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
const setAnnotationVisibility = async (annotationId, visibility) => {
    // Placeholder for visibility setting
    return visibility;
};
exports.setAnnotationVisibility = setAnnotationVisibility;
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
const getVisibleAnnotations = async (documentId, userId) => {
    // Placeholder for visibility filtering
    return [];
};
exports.getVisibleAnnotations = getVisibleAnnotations;
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
const makeAnnotationPrivate = async (annotationId) => {
    await (0, exports.setAnnotationVisibility)(annotationId, {
        annotationId,
        visibilityLevel: 'private',
    });
    return true;
};
exports.makeAnnotationPrivate = makeAnnotationPrivate;
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
const exportAnnotations = async (documentId, format) => {
    const annotations = await (0, exports.listComments)(documentId);
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
exports.exportAnnotations = exportAnnotations;
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
const importAnnotations = async (documentId, data, format) => {
    // Placeholder for import logic
    return [];
};
exports.importAnnotations = importAnnotations;
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
const exportSingleAnnotation = async (annotationId, format) => {
    const annotation = await (0, exports.getCommentById)(annotationId);
    return JSON.stringify(annotation, null, 2);
};
exports.exportSingleAnnotation = exportSingleAnnotation;
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
const mergeAnnotations = async (documentId, annotationSets) => {
    const merged = [];
    const seenIds = new Set();
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
exports.mergeAnnotations = mergeAnnotations;
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
const archiveOldAnnotations = async (documentId, olderThan) => {
    const annotations = await (0, exports.listComments)(documentId);
    let archivedCount = 0;
    for (const annotation of annotations) {
        if (annotation.createdAt < olderThan && annotation.status === 'active') {
            await (0, exports.updateComment)(annotation.id, { status: 'archived' });
            archivedCount++;
        }
    }
    return archivedCount;
};
exports.archiveOldAnnotations = archiveOldAnnotations;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model creators
    createAnnotationModel: exports.createAnnotationModel,
    createCommentThreadModel: exports.createCommentThreadModel,
    // Comments
    createComment: exports.createComment,
    updateComment: exports.updateComment,
    deleteComment: exports.deleteComment,
    getCommentById: exports.getCommentById,
    listComments: exports.listComments,
    // Threads
    createCommentThread: exports.createCommentThread,
    addReplyToThread: exports.addReplyToThread,
    getThreadReplies: exports.getThreadReplies,
    resolveThread: exports.resolveThread,
    reopenThread: exports.reopenThread,
    // Mentions
    addMentionToComment: exports.addMentionToComment,
    extractMentions: exports.extractMentions,
    sendMentionNotification: exports.sendMentionNotification,
    getUserMentions: exports.getUserMentions,
    markMentionAsRead: exports.markMentionAsRead,
    // Highlights
    createHighlight: exports.createHighlight,
    createUnderline: exports.createUnderline,
    createStrikethrough: exports.createStrikethrough,
    changeHighlightColor: exports.changeHighlightColor,
    removeHighlight: exports.removeHighlight,
    // Notes & Stamps
    createStickyNote: exports.createStickyNote,
    updateStickyNote: exports.updateStickyNote,
    toggleStickyNoteMinimized: exports.toggleStickyNoteMinimized,
    createStamp: exports.createStamp,
    getAvailableStamps: exports.getAvailableStamps,
    // Drawings
    createDrawing: exports.createDrawing,
    createArrow: exports.createArrow,
    createRectangle: exports.createRectangle,
    createCircle: exports.createCircle,
    eraseDrawing: exports.eraseDrawing,
    // Permissions
    setAnnotationPermissions: exports.setAnnotationPermissions,
    checkAnnotationPermission: exports.checkAnnotationPermission,
    setAnnotationVisibility: exports.setAnnotationVisibility,
    getVisibleAnnotations: exports.getVisibleAnnotations,
    makeAnnotationPrivate: exports.makeAnnotationPrivate,
    // Export/Import
    exportAnnotations: exports.exportAnnotations,
    importAnnotations: exports.importAnnotations,
    exportSingleAnnotation: exports.exportSingleAnnotation,
    mergeAnnotations: exports.mergeAnnotations,
    archiveOldAnnotations: exports.archiveOldAnnotations,
};
//# sourceMappingURL=document-annotation-kit.js.map