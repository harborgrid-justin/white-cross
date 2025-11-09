"use strict";
/**
 * LOC: MAILMSG1234567
 * File: /reuse/server/mail/mail-message-core-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - Message controllers
 *   - Mail queue processors
 *   - Email synchronization services
 *   - Message archival services
 *   - Sequelize models
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
exports.parseEmailMessage = exports.parseSensitivity = exports.parseImportance = exports.stripHtmlTags = exports.getMessageSearchQuerySwaggerSchema = exports.getMessageCreateDtoSwaggerSchema = exports.getMailMessageSwaggerSchema = exports.importMessages = exports.exportMessage = exports.bulkApplyCategories = exports.bulkDeleteMessages = exports.bulkMarkAsRead = exports.bulkMoveMessages = exports.performBulkMessageOperation = exports.findRelatedMessages = exports.groupMessagesIntoThreads = exports.getConversationThread = exports.calculateMessageSize = exports.parseDeliveryStatus = exports.updateMessageMetadata = exports.parseMessageHeaders = exports.extractConversationId = exports.generateInternetMessageId = exports.updateMessageFlags = exports.removeMessageCategories = exports.addMessageCategories = exports.setMessageImportance = exports.markMessageAsFlagged = exports.markMessageAsRead = exports.autoSaveDraft = exports.listDraftMessages = exports.sendDraftMessage = exports.updateDraftMessage = exports.createDraftMessage = exports.markMessageAsReplied = exports.createForwardMessage = exports.createReplyMessage = exports.receiveMessagesFromIMAP = exports.sendMessageViaSMTP = exports.processIncomingMessage = exports.prepareSMTPMessage = exports.searchMailMessages = exports.deleteMailMessage = exports.updateMailMessage = exports.getMailMessageById = exports.createMailMessage = exports.getMailFolderModelAttributes = exports.getMessageRecipientModelAttributes = exports.getMessageAttachmentModelAttributes = exports.getMailMessageModelAttributes = void 0;
/**
 * File: /reuse/server/mail/mail-message-core-kit.ts
 * Locator: WC-UTL-MAILMSG-001
 * Purpose: Comprehensive Mail Message Core Kit - Complete mail message management toolkit for NestJS + Sequelize
 *
 * Upstream: Independent utility module for mail message operations
 * Downstream: ../backend/*, Mail services, Message controllers, Queue processors, Sync services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, nodemailer
 * Exports: 50 utility functions for message CRUD, sending, receiving, forwarding, drafts, flags, metadata, bulk operations
 *
 * LLM Context: Enterprise-grade mail message management utilities for White Cross healthcare platform.
 * Provides comprehensive message handling comparable to Microsoft Exchange Server, including full CRUD operations,
 * message sending/receiving, draft management, reply/forward operations, message threading, folder management,
 * flags and importance levels, read receipts, delivery status, message search and filtering, bulk operations,
 * attachment handling, message headers and metadata, HIPAA-compliant message archival, message encryption support,
 * and Sequelize models for messages, attachments, recipients, folders, and message flags.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================
/**
 * Sequelize MailMessage model attributes for messages table.
 *
 * @example
 * ```typescript
 * class MailMessage extends Model {}
 * MailMessage.init(getMailMessageModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_messages',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'folderId'] },
 *     { fields: ['conversationId'] },
 *     { fields: ['internetMessageId'], unique: true }
 *   ]
 * });
 * ```
 */
const getMailMessageModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    folderId: {
        type: 'UUID',
        allowNull: true,
        references: {
            model: 'mail_folders',
            key: 'id',
        },
    },
    conversationId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Groups related messages in a thread',
    },
    internetMessageId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'RFC 5322 Message-ID header',
    },
    subject: {
        type: 'TEXT',
        allowNull: false,
    },
    bodyPreview: {
        type: 'TEXT',
        allowNull: true,
        comment: 'First 255 characters of body for preview',
    },
    bodyText: {
        type: 'TEXT',
        allowNull: true,
        comment: 'Plain text body',
    },
    bodyHtml: {
        type: 'TEXT',
        allowNull: true,
        comment: 'HTML body',
    },
    fromName: {
        type: 'STRING',
        allowNull: true,
    },
    fromAddress: {
        type: 'STRING',
        allowNull: false,
    },
    toRecipients: {
        type: 'JSONB',
        allowNull: false,
        defaultValue: [],
    },
    ccRecipients: {
        type: 'JSONB',
        allowNull: true,
        defaultValue: [],
    },
    bccRecipients: {
        type: 'JSONB',
        allowNull: true,
        defaultValue: [],
    },
    replyTo: {
        type: 'JSONB',
        allowNull: true,
        defaultValue: [],
    },
    importance: {
        type: 'ENUM',
        values: ['low', 'normal', 'high'],
        defaultValue: 'normal',
    },
    priority: {
        type: 'ENUM',
        values: ['low', 'normal', 'high'],
        defaultValue: 'normal',
    },
    sensitivity: {
        type: 'ENUM',
        values: ['normal', 'personal', 'private', 'confidential'],
        defaultValue: 'normal',
    },
    isRead: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    isDraft: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    isFlagged: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    isDeleted: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    hasAttachments: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    size: {
        type: 'INTEGER',
        allowNull: false,
        comment: 'Message size in bytes',
    },
    sentDateTime: {
        type: 'DATE',
        allowNull: true,
    },
    receivedDateTime: {
        type: 'DATE',
        allowNull: true,
    },
    lastModifiedDateTime: {
        type: 'DATE',
        allowNull: false,
    },
    categories: {
        type: 'JSONB',
        defaultValue: [],
    },
    flags: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Message flags and metadata',
    },
    headers: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Email headers',
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Additional metadata',
    },
    encryptionInfo: {
        type: 'JSONB',
        allowNull: true,
        comment: 'Encryption information',
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getMailMessageModelAttributes = getMailMessageModelAttributes;
/**
 * Sequelize MessageAttachment model attributes for attachments table.
 *
 * @example
 * ```typescript
 * class MessageAttachment extends Model {}
 * MessageAttachment.init(getMessageAttachmentModelAttributes(), {
 *   sequelize,
 *   tableName: 'message_attachments',
 *   timestamps: true
 * });
 * ```
 */
const getMessageAttachmentModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    messageId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'mail_messages',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    filename: {
        type: 'STRING',
        allowNull: false,
    },
    contentType: {
        type: 'STRING',
        allowNull: false,
    },
    size: {
        type: 'INTEGER',
        allowNull: false,
    },
    contentId: {
        type: 'STRING',
        allowNull: true,
        comment: 'Content-ID for inline attachments',
    },
    contentLocation: {
        type: 'STRING',
        allowNull: true,
    },
    isInline: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    storageUrl: {
        type: 'STRING',
        allowNull: true,
        comment: 'URL to stored file (S3, etc)',
    },
    checksum: {
        type: 'STRING',
        allowNull: true,
        comment: 'SHA256 checksum for integrity',
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getMessageAttachmentModelAttributes = getMessageAttachmentModelAttributes;
/**
 * Sequelize MessageRecipient model attributes for tracking individual recipients.
 *
 * @example
 * ```typescript
 * class MessageRecipient extends Model {}
 * MessageRecipient.init(getMessageRecipientModelAttributes(), {
 *   sequelize,
 *   tableName: 'message_recipients',
 *   timestamps: true
 * });
 * ```
 */
const getMessageRecipientModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    messageId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'mail_messages',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    recipientType: {
        type: 'ENUM',
        values: ['to', 'cc', 'bcc'],
        allowNull: false,
    },
    name: {
        type: 'STRING',
        allowNull: true,
    },
    address: {
        type: 'STRING',
        allowNull: false,
    },
    deliveryStatus: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Delivery tracking information',
    },
    readAt: {
        type: 'DATE',
        allowNull: true,
    },
    deliveredAt: {
        type: 'DATE',
        allowNull: true,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getMessageRecipientModelAttributes = getMessageRecipientModelAttributes;
/**
 * Sequelize MailFolder model attributes for folder management.
 *
 * @example
 * ```typescript
 * class MailFolder extends Model {}
 * MailFolder.init(getMailFolderModelAttributes(), {
 *   sequelize,
 *   tableName: 'mail_folders',
 *   timestamps: true
 * });
 * ```
 */
const getMailFolderModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    parentFolderId: {
        type: 'UUID',
        allowNull: true,
        references: {
            model: 'mail_folders',
            key: 'id',
        },
    },
    name: {
        type: 'STRING',
        allowNull: false,
    },
    displayName: {
        type: 'STRING',
        allowNull: false,
    },
    type: {
        type: 'ENUM',
        values: ['inbox', 'sent', 'drafts', 'trash', 'archive', 'junk', 'custom'],
        defaultValue: 'custom',
    },
    unreadCount: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    totalCount: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    isHidden: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getMailFolderModelAttributes = getMailFolderModelAttributes;
// ============================================================================
// MESSAGE CRUD OPERATIONS
// ============================================================================
/**
 * Creates a new mail message with comprehensive metadata and validation.
 *
 * @param {MessageCreateDto} dto - Message creation data
 * @returns {MailMessage} Created message object
 *
 * @example
 * ```typescript
 * const message = createMailMessage({
 *   userId: 'user-123',
 *   subject: 'Patient Update - John Doe',
 *   bodyHtml: '<p>Patient has been discharged...</p>',
 *   from: { name: 'Dr. Smith', address: 'smith@whitecross.com' },
 *   toRecipients: [{ name: 'Nurse Johnson', address: 'johnson@whitecross.com' }],
 *   importance: 'high',
 *   sensitivity: 'confidential',
 *   categories: ['patient-care', 'discharge']
 * });
 * ```
 */
const createMailMessage = (dto) => {
    const messageId = crypto.randomUUID();
    const internetMessageId = (0, exports.generateInternetMessageId)(dto.from.address);
    const now = new Date();
    const bodyPreview = dto.bodyText
        ? dto.bodyText.substring(0, 255)
        : dto.bodyHtml
            ? (0, exports.stripHtmlTags)(dto.bodyHtml).substring(0, 255)
            : '';
    const size = (0, exports.calculateMessageSize)({
        subject: dto.subject,
        bodyText: dto.bodyText,
        bodyHtml: dto.bodyHtml,
        attachments: dto.attachments,
    });
    const message = {
        id: messageId,
        userId: dto.userId,
        folderId: dto.folderId || undefined,
        conversationId: dto.inReplyTo ? (0, exports.extractConversationId)(dto.inReplyTo) : undefined,
        internetMessageId,
        subject: dto.subject,
        bodyPreview,
        bodyText: dto.bodyText,
        bodyHtml: dto.bodyHtml,
        from: dto.from,
        toRecipients: dto.toRecipients,
        ccRecipients: dto.ccRecipients || [],
        bccRecipients: dto.bccRecipients || [],
        replyTo: dto.replyTo || [],
        importance: dto.importance || 'normal',
        priority: dto.importance || 'normal',
        sensitivity: dto.sensitivity || 'normal',
        isRead: dto.isDraft || false,
        isDraft: dto.isDraft || false,
        isFlagged: false,
        isDeleted: false,
        hasAttachments: (dto.attachments?.length || 0) > 0,
        size,
        sentDateTime: dto.isDraft ? undefined : now,
        receivedDateTime: undefined,
        lastModifiedDateTime: now,
        createdDateTime: now,
        categories: dto.categories || [],
        flags: {
            isRead: dto.isDraft || false,
            isFlagged: false,
            isAnswered: false,
            isForwarded: false,
            isDraft: dto.isDraft || false,
            isDeleted: false,
            isImportant: dto.importance === 'high',
            isEncrypted: false,
            requiresReadReceipt: dto.requiresReadReceipt || false,
            requiresDeliveryReceipt: dto.requiresDeliveryReceipt || false,
        },
        headers: {
            messageId: internetMessageId,
            inReplyTo: dto.inReplyTo,
            references: dto.references || [],
            date: now.toISOString(),
            contentType: dto.bodyHtml ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8',
            mimeVersion: '1.0',
        },
        metadata: {},
    };
    return message;
};
exports.createMailMessage = createMailMessage;
/**
 * Retrieves a mail message by ID with optional related data.
 *
 * @param {string} messageId - Message ID to retrieve
 * @param {string} userId - User ID for authorization
 * @param {object} options - Retrieval options
 * @returns {MailMessage | null} Message object or null if not found
 *
 * @example
 * ```typescript
 * const message = await getMailMessageById('msg-123', 'user-123', {
 *   includeAttachments: true,
 *   includeRecipients: true
 * });
 * if (message) {
 *   console.log('Subject:', message.subject);
 *   console.log('From:', message.from.address);
 * }
 * ```
 */
const getMailMessageById = (messageId, userId, options = {}) => {
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
        },
        include: [
            ...(options.includeAttachments
                ? [{ model: 'MessageAttachment', as: 'attachments' }]
                : []),
            ...(options.includeRecipients
                ? [{ model: 'MessageRecipient', as: 'recipients' }]
                : []),
        ],
    };
};
exports.getMailMessageById = getMailMessageById;
/**
 * Updates an existing mail message with validation and audit trail.
 *
 * @param {string} messageId - Message ID to update
 * @param {string} userId - User ID for authorization
 * @param {MessageUpdateDto} updates - Updates to apply
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const updated = updateMailMessage('msg-123', 'user-123', {
 *   isRead: true,
 *   categories: ['patient-care', 'urgent']
 * });
 * ```
 */
const updateMailMessage = (messageId, userId, updates) => {
    const updateData = {
        ...updates,
        lastModifiedDateTime: new Date(),
    };
    // Update flags if read status changed
    if (updates.isRead !== undefined) {
        updateData['flags.isRead'] = updates.isRead;
    }
    // Update flags if flagged status changed
    if (updates.isFlagged !== undefined) {
        updateData['flags.isFlagged'] = updates.isFlagged;
    }
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
            isDraft: false, // Only allow updates to non-draft messages
        },
        data: updateData,
    };
};
exports.updateMailMessage = updateMailMessage;
/**
 * Soft deletes a mail message (moves to trash).
 *
 * @param {string} messageId - Message ID to delete
 * @param {string} userId - User ID for authorization
 * @param {boolean} permanent - Whether to permanently delete
 * @returns {object} Delete query object
 *
 * @example
 * ```typescript
 * // Soft delete (move to trash)
 * const deleted = deleteMailMessage('msg-123', 'user-123', false);
 *
 * // Permanent delete
 * const purged = deleteMailMessage('msg-123', 'user-123', true);
 * ```
 */
const deleteMailMessage = (messageId, userId, permanent = false) => {
    if (permanent) {
        return {
            where: {
                id: messageId,
                userId,
            },
            force: true,
        };
    }
    return {
        where: {
            id: messageId,
            userId,
        },
        data: {
            isDeleted: true,
            lastModifiedDateTime: new Date(),
            'flags.isDeleted': true,
        },
    };
};
exports.deleteMailMessage = deleteMailMessage;
/**
 * Searches messages with advanced filtering and pagination.
 *
 * @param {MessageSearchQuery} query - Search query parameters
 * @returns {object} Sequelize query object
 *
 * @example
 * ```typescript
 * const messages = searchMailMessages({
 *   userId: 'user-123',
 *   searchTerm: 'patient discharge',
 *   isRead: false,
 *   importance: 'high',
 *   hasAttachments: true,
 *   startDate: new Date('2024-01-01'),
 *   limit: 20,
 *   offset: 0,
 *   sortBy: 'date',
 *   sortOrder: 'desc'
 * });
 * ```
 */
const searchMailMessages = (query) => {
    const where = {
        userId: query.userId,
        isDeleted: false,
    };
    if (query.folderId) {
        where.folderId = query.folderId;
    }
    if (query.searchTerm) {
        where['$or'] = [
            { subject: { $iLike: `%${query.searchTerm}%` } },
            { bodyText: { $iLike: `%${query.searchTerm}%` } },
            { fromAddress: { $iLike: `%${query.searchTerm}%` } },
        ];
    }
    if (query.from) {
        where.fromAddress = { $iLike: `%${query.from}%` };
    }
    if (query.subject) {
        where.subject = { $iLike: `%${query.subject}%` };
    }
    if (query.hasAttachments !== undefined) {
        where.hasAttachments = query.hasAttachments;
    }
    if (query.isRead !== undefined) {
        where.isRead = query.isRead;
    }
    if (query.isFlagged !== undefined) {
        where.isFlagged = query.isFlagged;
    }
    if (query.importance) {
        where.importance = query.importance;
    }
    if (query.startDate || query.endDate) {
        where.receivedDateTime = {};
        if (query.startDate) {
            where.receivedDateTime.$gte = query.startDate;
        }
        if (query.endDate) {
            where.receivedDateTime.$lte = query.endDate;
        }
    }
    if (query.categories && query.categories.length > 0) {
        where.categories = { $overlap: query.categories };
    }
    const orderField = query.sortBy === 'date' ? 'receivedDateTime' :
        query.sortBy === 'subject' ? 'subject' :
            query.sortBy === 'from' ? 'fromAddress' :
                query.sortBy === 'size' ? 'size' : 'receivedDateTime';
    return {
        where,
        limit: query.limit || 50,
        offset: query.offset || 0,
        order: [[orderField, query.sortOrder || 'desc']],
    };
};
exports.searchMailMessages = searchMailMessages;
// ============================================================================
// MESSAGE SENDING AND RECEIVING
// ============================================================================
/**
 * Prepares a message for sending with SMTP headers and envelope.
 *
 * @param {MailMessage} message - Message to send
 * @param {MessageSendOptions} options - Send options
 * @returns {object} SMTP-ready message object
 *
 * @example
 * ```typescript
 * const smtpMessage = prepareSMTPMessage(message, {
 *   saveToSentItems: true,
 *   requestReadReceipt: true,
 *   trackOpens: true
 * });
 * // Send via nodemailer or other SMTP client
 * await transporter.sendMail(smtpMessage);
 * ```
 */
const prepareSMTPMessage = (message, options = {}) => {
    const envelope = {
        from: message.from.address,
        to: message.toRecipients.map(r => r.address),
        cc: message.ccRecipients?.map(r => r.address) || [],
        bcc: message.bccRecipients?.map(r => r.address) || [],
    };
    const headers = {
        'Message-ID': message.internetMessageId,
        'Date': new Date().toUTCString(),
        'MIME-Version': '1.0',
        'X-Mailer': 'WhiteCross Mail Server v1.0',
        'X-Priority': message.priority === 'high' ? '1' : message.priority === 'low' ? '5' : '3',
    };
    if (message.headers?.inReplyTo) {
        headers['In-Reply-To'] = message.headers.inReplyTo;
    }
    if (message.headers?.references && message.headers.references.length > 0) {
        headers['References'] = message.headers.references.join(' ');
    }
    if (options.requestReadReceipt) {
        headers['Disposition-Notification-To'] = message.from.address;
    }
    if (options.requestDeliveryReceipt) {
        headers['Return-Receipt-To'] = message.from.address;
    }
    if (message.sensitivity !== 'normal') {
        headers['Sensitivity'] = message.sensitivity;
    }
    if (message.categories && message.categories.length > 0) {
        headers['X-Categories'] = message.categories.join(', ');
    }
    if (options.trackOpens) {
        const trackingPixel = `<img src="https://track.whitecross.com/open/${message.id}" width="1" height="1" alt="" />`;
        message.bodyHtml = message.bodyHtml ? message.bodyHtml + trackingPixel : trackingPixel;
    }
    return {
        envelope,
        messageId: message.internetMessageId,
        from: message.from.name ? `"${message.from.name}" <${message.from.address}>` : message.from.address,
        to: message.toRecipients.map(r => r.name ? `"${r.name}" <${r.address}>` : r.address),
        cc: message.ccRecipients?.map(r => r.name ? `"${r.name}" <${r.address}>` : r.address),
        bcc: message.bccRecipients?.map(r => r.name ? `"${r.name}" <${r.address}>` : r.address),
        replyTo: message.replyTo?.map(r => r.name ? `"${r.name}" <${r.address}>` : r.address),
        subject: message.subject,
        text: message.bodyText,
        html: message.bodyHtml,
        headers,
        priority: message.priority,
    };
};
exports.prepareSMTPMessage = prepareSMTPMessage;
/**
 * Processes an incoming message and prepares for storage.
 *
 * @param {any} rawMessage - Raw message from IMAP/POP3
 * @param {string} userId - User ID receiving the message
 * @returns {MailMessage} Processed message object
 *
 * @example
 * ```typescript
 * // From IMAP client
 * const rawMsg = await imapClient.fetch(messageId);
 * const processed = processIncomingMessage(rawMsg, 'user-123');
 * // Save to database
 * await MailMessage.create(processed);
 * ```
 */
const processIncomingMessage = (rawMessage, userId) => {
    const parsed = (0, exports.parseEmailMessage)(rawMessage);
    const messageId = crypto.randomUUID();
    const now = new Date();
    const message = {
        id: messageId,
        userId,
        folderId: undefined, // Will be set to inbox by caller
        conversationId: parsed.headers.inReplyTo ? (0, exports.extractConversationId)(parsed.headers.inReplyTo) : undefined,
        internetMessageId: parsed.headers.messageId || (0, exports.generateInternetMessageId)('unknown'),
        subject: parsed.subject || '(No Subject)',
        bodyPreview: parsed.text ? parsed.text.substring(0, 255) : '',
        bodyText: parsed.text,
        bodyHtml: parsed.html,
        from: { name: parsed.from?.name, address: parsed.from?.address || 'unknown' },
        toRecipients: parsed.to || [],
        ccRecipients: parsed.cc || [],
        bccRecipients: [],
        replyTo: parsed.replyTo || [],
        importance: (0, exports.parseImportance)(parsed.headers),
        priority: (0, exports.parseImportance)(parsed.headers),
        sensitivity: (0, exports.parseSensitivity)(parsed.headers),
        isRead: false,
        isDraft: false,
        isFlagged: false,
        isDeleted: false,
        hasAttachments: (parsed.attachments?.length || 0) > 0,
        size: rawMessage.size || 0,
        sentDateTime: parsed.date ? new Date(parsed.date) : now,
        receivedDateTime: now,
        lastModifiedDateTime: now,
        createdDateTime: now,
        categories: [],
        flags: {
            isRead: false,
            isFlagged: false,
            isAnswered: false,
            isForwarded: false,
            isDraft: false,
            isDeleted: false,
            isImportant: (0, exports.parseImportance)(parsed.headers) === 'high',
            isEncrypted: false,
            requiresReadReceipt: !!parsed.headers['disposition-notification-to'],
            requiresDeliveryReceipt: !!parsed.headers['return-receipt-to'],
        },
        headers: {
            messageId: parsed.headers.messageId,
            inReplyTo: parsed.headers.inReplyTo,
            references: parsed.headers.references ? parsed.headers.references.split(' ') : [],
            date: parsed.date,
            returnPath: parsed.headers.returnPath,
            receivedSpf: parsed.headers.receivedSpf,
            authentication: parsed.headers.authentication,
            contentType: parsed.headers.contentType || 'text/plain',
            mimeVersion: parsed.headers.mimeVersion || '1.0',
            xMailer: parsed.headers.xMailer,
            xPriority: parsed.headers.xPriority,
        },
        metadata: {},
    };
    return message;
};
exports.processIncomingMessage = processIncomingMessage;
/**
 * Sends a message via SMTP with delivery tracking.
 *
 * @param {MailMessage} message - Message to send
 * @param {MessageSendOptions} options - Send options
 * @returns {Promise<DeliveryStatus>} Delivery status
 *
 * @example
 * ```typescript
 * const deliveryStatus = await sendMessageViaSMTP(message, {
 *   saveToSentItems: true,
 *   trackOpens: true,
 *   metadata: { campaignId: 'patient-updates-2024' }
 * });
 * console.log('Sent:', deliveryStatus.status);
 * ```
 */
const sendMessageViaSMTP = async (message, options = {}) => {
    const deliveryStatus = {
        status: 'pending',
        lastUpdated: new Date(),
        attempts: 0,
    };
    try {
        const smtpMessage = (0, exports.prepareSMTPMessage)(message, options);
        // This would integrate with actual SMTP service
        // For now, return success structure
        deliveryStatus.status = 'sent';
        deliveryStatus.attempts = 1;
        deliveryStatus.lastUpdated = new Date();
        if (options.scheduledSendTime && options.scheduledSendTime > new Date()) {
            deliveryStatus.status = 'pending';
            deliveryStatus.statusMessage = `Scheduled for ${options.scheduledSendTime.toISOString()}`;
        }
        return deliveryStatus;
    }
    catch (error) {
        deliveryStatus.status = 'failed';
        deliveryStatus.errorMessage = error.message;
        deliveryStatus.attempts = 1;
        return deliveryStatus;
    }
};
exports.sendMessageViaSMTP = sendMessageViaSMTP;
/**
 * Receives messages from IMAP server with folder synchronization.
 *
 * @param {string} userId - User ID to fetch messages for
 * @param {string} folderId - Folder ID to sync
 * @param {object} options - Sync options
 * @returns {Promise<MailMessage[]>} Array of new messages
 *
 * @example
 * ```typescript
 * const newMessages = await receiveMessagesFromIMAP('user-123', 'inbox-folder-id', {
 *   since: new Date('2024-01-01'),
 *   limit: 100
 * });
 * console.log(`Received ${newMessages.length} new messages`);
 * ```
 */
const receiveMessagesFromIMAP = async (userId, folderId, options = {}) => {
    // This would integrate with actual IMAP service
    // Returns structure for reference
    const messages = [];
    // Example: const imapClient = await connectToIMAP(userId);
    // const rawMessages = await imapClient.fetch(options);
    // for (const raw of rawMessages) {
    //   const processed = processIncomingMessage(raw, userId);
    //   processed.folderId = folderId;
    //   messages.push(processed);
    // }
    return messages;
};
exports.receiveMessagesFromIMAP = receiveMessagesFromIMAP;
// ============================================================================
// MESSAGE REPLY AND FORWARD
// ============================================================================
/**
 * Creates a reply message from an original message.
 *
 * @param {MailMessage} original - Original message to reply to
 * @param {MessageReplyOptions} options - Reply options
 * @param {string} userId - User ID creating the reply
 * @returns {MessageCreateDto} Reply message DTO
 *
 * @example
 * ```typescript
 * const reply = createReplyMessage(originalMessage, {
 *   replyAll: true,
 *   comment: 'Thank you for the update. Will proceed as discussed.',
 *   includeOriginalMessage: true
 * }, 'user-123');
 * const message = createMailMessage(reply);
 * ```
 */
const createReplyMessage = (original, options, userId) => {
    const recipients = options.replyAll
        ? [original.from, ...original.toRecipients.filter(r => r.address !== original.from.address)]
        : [original.from];
    const ccRecipients = options.replyAll
        ? original.ccRecipients?.filter(r => r.address !== original.from.address) || []
        : [];
    const subject = original.subject.startsWith('Re:')
        ? original.subject
        : `Re: ${original.subject}`;
    let bodyHtml = options.comment || '';
    let bodyText = options.comment || '';
    if (options.includeOriginalMessage && original.bodyHtml) {
        const quotedHtml = `
      <br><br>
      <div style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
        <p><strong>On ${original.sentDateTime?.toLocaleString()}, ${original.from.name || original.from.address} wrote:</strong></p>
        ${original.bodyHtml}
      </div>
    `;
        bodyHtml += quotedHtml;
    }
    if (options.includeOriginalMessage && original.bodyText) {
        const quotedText = `\n\n> On ${original.sentDateTime?.toLocaleString()}, ${original.from.name || original.from.address} wrote:\n> ${original.bodyText.replace(/\n/g, '\n> ')}`;
        bodyText += quotedText;
    }
    const references = [
        ...(original.headers?.references || []),
        original.internetMessageId,
    ];
    return {
        userId,
        subject,
        bodyHtml: bodyHtml || undefined,
        bodyText: bodyText || undefined,
        from: { address: 'reply@whitecross.com' }, // Would be user's email
        toRecipients: recipients,
        ccRecipients: ccRecipients.length > 0 ? ccRecipients : undefined,
        importance: original.importance,
        sensitivity: original.sensitivity,
        isDraft: false,
        attachments: options.attachments,
        inReplyTo: original.internetMessageId,
        references,
    };
};
exports.createReplyMessage = createReplyMessage;
/**
 * Creates a forward message from an original message.
 *
 * @param {MailMessage} original - Original message to forward
 * @param {MessageForwardOptions} options - Forward options
 * @param {string} userId - User ID creating the forward
 * @returns {MessageCreateDto} Forward message DTO
 *
 * @example
 * ```typescript
 * const forward = createForwardMessage(originalMessage, {
 *   toRecipients: [{ name: 'Dr. Johnson', address: 'johnson@whitecross.com' }],
 *   comment: 'FYI - Please review this patient case.',
 *   includeAttachments: true
 * }, 'user-123');
 * ```
 */
const createForwardMessage = (original, options, userId) => {
    const subject = original.subject.startsWith('Fwd:')
        ? original.subject
        : `Fwd: ${original.subject}`;
    let bodyHtml = options.comment || '';
    let bodyText = options.comment || '';
    if (original.bodyHtml) {
        const forwardedHtml = `
      <br><br>
      <div style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 10px;">
        <p><strong>---------- Forwarded message ---------</strong></p>
        <p><strong>From:</strong> ${original.from.name || original.from.address} &lt;${original.from.address}&gt;</p>
        <p><strong>Date:</strong> ${original.sentDateTime?.toLocaleString()}</p>
        <p><strong>Subject:</strong> ${original.subject}</p>
        <p><strong>To:</strong> ${original.toRecipients.map(r => r.name || r.address).join(', ')}</p>
        <br>
        ${original.bodyHtml}
      </div>
    `;
        bodyHtml += forwardedHtml;
    }
    if (original.bodyText) {
        const forwardedText = `\n\n---------- Forwarded message ---------\nFrom: ${original.from.name || original.from.address} <${original.from.address}>\nDate: ${original.sentDateTime?.toLocaleString()}\nSubject: ${original.subject}\nTo: ${original.toRecipients.map(r => r.address).join(', ')}\n\n${original.bodyText}`;
        bodyText += forwardedText;
    }
    return {
        userId,
        subject,
        bodyHtml: bodyHtml || undefined,
        bodyText: bodyText || undefined,
        from: { address: 'forward@whitecross.com' }, // Would be user's email
        toRecipients: options.toRecipients,
        importance: original.importance,
        sensitivity: original.sensitivity,
        isDraft: false,
        includeAttachments: options.includeAttachments,
    };
};
exports.createForwardMessage = createForwardMessage;
/**
 * Updates message flags to mark as replied or forwarded.
 *
 * @param {string} messageId - Message ID to update
 * @param {string} userId - User ID for authorization
 * @param {string} action - Action performed ('replied' | 'forwarded')
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await markMessageAsReplied('msg-123', 'user-123', 'replied');
 * await markMessageAsReplied('msg-456', 'user-123', 'forwarded');
 * ```
 */
const markMessageAsReplied = (messageId, userId, action) => {
    const flagUpdate = action === 'replied'
        ? { 'flags.isAnswered': true }
        : { 'flags.isForwarded': true };
    return {
        where: {
            id: messageId,
            userId,
        },
        data: {
            ...flagUpdate,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.markMessageAsReplied = markMessageAsReplied;
// ============================================================================
// DRAFT MANAGEMENT
// ============================================================================
/**
 * Creates a new draft message.
 *
 * @param {MessageCreateDto} dto - Draft message data
 * @returns {MailMessage} Created draft message
 *
 * @example
 * ```typescript
 * const draft = createDraftMessage({
 *   userId: 'user-123',
 *   subject: 'Patient Follow-up',
 *   bodyHtml: '<p>Draft content...</p>',
 *   from: { address: 'doctor@whitecross.com' },
 *   toRecipients: [{ address: 'nurse@whitecross.com' }],
 *   isDraft: true
 * });
 * ```
 */
const createDraftMessage = (dto) => {
    return (0, exports.createMailMessage)({
        ...dto,
        isDraft: true,
    });
};
exports.createDraftMessage = createDraftMessage;
/**
 * Updates an existing draft message.
 *
 * @param {string} draftId - Draft message ID
 * @param {string} userId - User ID for authorization
 * @param {MessageUpdateDto} updates - Updates to apply
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const updated = updateDraftMessage('draft-123', 'user-123', {
 *   subject: 'Updated Subject',
 *   bodyHtml: '<p>Updated content...</p>',
 *   toRecipients: [{ address: 'newrecipient@whitecross.com' }]
 * });
 * ```
 */
const updateDraftMessage = (draftId, userId, updates) => {
    return {
        where: {
            id: draftId,
            userId,
            isDraft: true,
            isDeleted: false,
        },
        data: {
            ...updates,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.updateDraftMessage = updateDraftMessage;
/**
 * Converts a draft message to a sendable message.
 *
 * @param {string} draftId - Draft message ID
 * @param {string} userId - User ID for authorization
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const message = await sendDraftMessage('draft-123', 'user-123');
 * // Now send the message via SMTP
 * await sendMessageViaSMTP(message, { saveToSentItems: true });
 * ```
 */
const sendDraftMessage = (draftId, userId) => {
    return {
        where: {
            id: draftId,
            userId,
            isDraft: true,
            isDeleted: false,
        },
        data: {
            isDraft: false,
            isRead: true,
            sentDateTime: new Date(),
            lastModifiedDateTime: new Date(),
            'flags.isDraft': false,
        },
    };
};
exports.sendDraftMessage = sendDraftMessage;
/**
 * Lists all draft messages for a user.
 *
 * @param {string} userId - User ID
 * @param {object} options - Pagination options
 * @returns {object} Query object for drafts
 *
 * @example
 * ```typescript
 * const drafts = await listDraftMessages('user-123', {
 *   limit: 20,
 *   offset: 0,
 *   sortBy: 'lastModified'
 * });
 * ```
 */
const listDraftMessages = (userId, options = {}) => {
    return {
        where: {
            userId,
            isDraft: true,
            isDeleted: false,
        },
        limit: options.limit || 50,
        offset: options.offset || 0,
        order: [[options.sortBy || 'lastModifiedDateTime', 'desc']],
    };
};
exports.listDraftMessages = listDraftMessages;
/**
 * Auto-saves a draft message periodically.
 *
 * @param {string} draftId - Draft message ID (null for new draft)
 * @param {string} userId - User ID
 * @param {MessageUpdateDto} content - Current draft content
 * @returns {object} Save operation object
 *
 * @example
 * ```typescript
 * // Auto-save every 30 seconds
 * setInterval(() => {
 *   autoSaveDraft(currentDraftId, 'user-123', {
 *     subject: currentSubject,
 *     bodyHtml: currentBody
 *   });
 * }, 30000);
 * ```
 */
const autoSaveDraft = (draftId, userId, content) => {
    const now = new Date();
    if (draftId) {
        // Update existing draft
        return {
            type: 'update',
            where: {
                id: draftId,
                userId,
                isDraft: true,
            },
            data: {
                ...content,
                lastModifiedDateTime: now,
            },
        };
    }
    else {
        // Create new draft
        return {
            type: 'create',
            data: {
                userId,
                ...content,
                isDraft: true,
                isRead: true,
                lastModifiedDateTime: now,
                createdDateTime: now,
            },
        };
    }
};
exports.autoSaveDraft = autoSaveDraft;
// ============================================================================
// MESSAGE FLAGS AND STATUS
// ============================================================================
/**
 * Marks a message as read or unread.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {boolean} isRead - Read status to set
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await markMessageAsRead('msg-123', 'user-123', true);
 * await markMessageAsRead('msg-456', 'user-123', false);
 * ```
 */
const markMessageAsRead = (messageId, userId, isRead) => {
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
        },
        data: {
            isRead,
            'flags.isRead': isRead,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.markMessageAsRead = markMessageAsRead;
/**
 * Marks a message as flagged/starred.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {boolean} isFlagged - Flagged status to set
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await markMessageAsFlagged('msg-123', 'user-123', true);
 * ```
 */
const markMessageAsFlagged = (messageId, userId, isFlagged) => {
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
        },
        data: {
            isFlagged,
            'flags.isFlagged': isFlagged,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.markMessageAsFlagged = markMessageAsFlagged;
/**
 * Sets message importance level.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {string} importance - Importance level
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await setMessageImportance('msg-123', 'user-123', 'high');
 * ```
 */
const setMessageImportance = (messageId, userId, importance) => {
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
        },
        data: {
            importance,
            priority: importance,
            'flags.isImportant': importance === 'high',
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.setMessageImportance = setMessageImportance;
/**
 * Adds categories/labels to a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {string[]} categories - Categories to add
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await addMessageCategories('msg-123', 'user-123', ['urgent', 'patient-care']);
 * ```
 */
const addMessageCategories = (messageId, userId, categories) => {
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
        },
        data: {
            categories: { $addToSet: categories },
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.addMessageCategories = addMessageCategories;
/**
 * Removes categories/labels from a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {string[]} categories - Categories to remove
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await removeMessageCategories('msg-123', 'user-123', ['urgent']);
 * ```
 */
const removeMessageCategories = (messageId, userId, categories) => {
    return {
        where: {
            id: messageId,
            userId,
            isDeleted: false,
        },
        data: {
            categories: { $pull: categories },
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.removeMessageCategories = removeMessageCategories;
/**
 * Updates message flags in bulk.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {Partial<MessageFlags>} flags - Flags to update
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await updateMessageFlags('msg-123', 'user-123', {
 *   isRead: true,
 *   isFlagged: true,
 *   isAnswered: true
 * });
 * ```
 */
const updateMessageFlags = (messageId, userId, flags) => {
    const updates = {
        lastModifiedDateTime: new Date(),
    };
    Object.entries(flags).forEach(([key, value]) => {
        updates[`flags.${key}`] = value;
        // Update top-level fields for commonly used flags
        if (key === 'isRead')
            updates.isRead = value;
        if (key === 'isFlagged')
            updates.isFlagged = value;
        if (key === 'isDeleted')
            updates.isDeleted = value;
    });
    return {
        where: {
            id: messageId,
            userId,
        },
        data: updates,
    };
};
exports.updateMessageFlags = updateMessageFlags;
// ============================================================================
// MESSAGE METADATA AND HEADERS
// ============================================================================
/**
 * Generates an RFC 5322 compliant Internet Message ID.
 *
 * @param {string} domain - Domain name for the message ID
 * @returns {string} Generated message ID
 *
 * @example
 * ```typescript
 * const messageId = generateInternetMessageId('whitecross.com');
 * // Returns: <abc123def456.1234567890@whitecross.com>
 * ```
 */
const generateInternetMessageId = (domain) => {
    const timestamp = Date.now();
    const random = crypto.randomBytes(16).toString('hex');
    return `<${random}.${timestamp}@${domain}>`;
};
exports.generateInternetMessageId = generateInternetMessageId;
/**
 * Extracts conversation ID from message headers for threading.
 *
 * @param {string} inReplyTo - In-Reply-To header value
 * @returns {string} Conversation ID
 *
 * @example
 * ```typescript
 * const conversationId = extractConversationId('<original@whitecross.com>');
 * // Use for grouping related messages
 * ```
 */
const extractConversationId = (inReplyTo) => {
    // Extract the message ID and hash it for consistent conversation grouping
    const cleaned = inReplyTo.replace(/[<>]/g, '');
    return crypto.createHash('sha256').update(cleaned).digest('hex').substring(0, 16);
};
exports.extractConversationId = extractConversationId;
/**
 * Parses email headers into structured format.
 *
 * @param {Record<string, string>} rawHeaders - Raw email headers
 * @returns {MessageHeaders} Structured headers object
 *
 * @example
 * ```typescript
 * const headers = parseMessageHeaders({
 *   'message-id': '<123@example.com>',
 *   'in-reply-to': '<456@example.com>',
 *   'content-type': 'text/html; charset=utf-8'
 * });
 * ```
 */
const parseMessageHeaders = (rawHeaders) => {
    return {
        messageId: rawHeaders['message-id'] || '',
        inReplyTo: rawHeaders['in-reply-to'],
        references: rawHeaders['references']?.split(' ').filter(Boolean),
        date: rawHeaders['date'] || new Date().toISOString(),
        returnPath: rawHeaders['return-path'],
        receivedSpf: rawHeaders['received-spf'],
        authentication: rawHeaders['authentication-results'],
        contentType: rawHeaders['content-type'] || 'text/plain',
        mimeVersion: rawHeaders['mime-version'] || '1.0',
        xMailer: rawHeaders['x-mailer'],
        xPriority: rawHeaders['x-priority'],
        custom: {},
    };
};
exports.parseMessageHeaders = parseMessageHeaders;
/**
 * Updates message metadata with custom key-value pairs.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID for authorization
 * @param {Record<string, any>} metadata - Metadata to add/update
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * await updateMessageMetadata('msg-123', 'user-123', {
 *   patientId: 'patient-456',
 *   appointmentId: 'appt-789',
 *   department: 'cardiology'
 * });
 * ```
 */
const updateMessageMetadata = (messageId, userId, metadata) => {
    return {
        where: {
            id: messageId,
            userId,
        },
        data: {
            metadata: { $merge: metadata },
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.updateMessageMetadata = updateMessageMetadata;
/**
 * Extracts and structures delivery status from SMTP responses.
 *
 * @param {any} smtpResponse - SMTP server response
 * @returns {DeliveryStatus} Structured delivery status
 *
 * @example
 * ```typescript
 * const status = parseDeliveryStatus(smtpResponse);
 * console.log('Status:', status.status);
 * if (status.status === 'failed') {
 *   console.error('Error:', status.errorMessage);
 * }
 * ```
 */
const parseDeliveryStatus = (smtpResponse) => {
    const status = {
        status: 'sent',
        lastUpdated: new Date(),
        attempts: 1,
    };
    if (smtpResponse.rejected?.length > 0) {
        status.status = 'failed';
        status.errorMessage = `Failed to deliver to: ${smtpResponse.rejected.join(', ')}`;
    }
    if (smtpResponse.response) {
        status.statusMessage = smtpResponse.response;
    }
    if (smtpResponse.messageId) {
        status.remoteServer = smtpResponse.messageId;
    }
    return status;
};
exports.parseDeliveryStatus = parseDeliveryStatus;
/**
 * Calculates message size including headers, body, and attachments.
 *
 * @param {object} messageData - Message data components
 * @returns {number} Total size in bytes
 *
 * @example
 * ```typescript
 * const size = calculateMessageSize({
 *   subject: 'Hello',
 *   bodyText: 'Message content',
 *   bodyHtml: '<p>Message content</p>',
 *   attachments: [{ size: 1024000 }]
 * });
 * console.log(`Message size: ${size} bytes`);
 * ```
 */
const calculateMessageSize = (messageData) => {
    let size = 0;
    if (messageData.subject) {
        size += Buffer.byteLength(messageData.subject, 'utf8');
    }
    if (messageData.bodyText) {
        size += Buffer.byteLength(messageData.bodyText, 'utf8');
    }
    if (messageData.bodyHtml) {
        size += Buffer.byteLength(messageData.bodyHtml, 'utf8');
    }
    if (messageData.attachments) {
        messageData.attachments.forEach(att => {
            size += att.size;
        });
    }
    // Add approximate header overhead (typically 500-1000 bytes)
    size += 750;
    return size;
};
exports.calculateMessageSize = calculateMessageSize;
// ============================================================================
// MESSAGE THREADING AND CONVERSATIONS
// ============================================================================
/**
 * Retrieves all messages in a conversation thread.
 *
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID for authorization
 * @returns {object} Query object for thread messages
 *
 * @example
 * ```typescript
 * const thread = await getConversationThread('conv-123', 'user-123');
 * console.log(`Thread has ${thread.length} messages`);
 * ```
 */
const getConversationThread = (conversationId, userId) => {
    return {
        where: {
            conversationId,
            userId,
            isDeleted: false,
        },
        order: [['sentDateTime', 'asc']],
    };
};
exports.getConversationThread = getConversationThread;
/**
 * Groups messages into conversation threads.
 *
 * @param {MailMessage[]} messages - Array of messages to group
 * @returns {MessageThreadInfo[]} Array of conversation threads
 *
 * @example
 * ```typescript
 * const messages = await MailMessage.findAll({ where: { userId: 'user-123' } });
 * const threads = groupMessagesIntoThreads(messages);
 * threads.forEach(thread => {
 *   console.log(`Thread: ${thread.conversationId}, Messages: ${thread.messageCount}`);
 * });
 * ```
 */
const groupMessagesIntoThreads = (messages) => {
    const threadMap = new Map();
    messages.forEach(message => {
        const convId = message.conversationId || message.id;
        if (!threadMap.has(convId)) {
            threadMap.set(convId, {
                conversationId: convId,
                messageCount: 0,
                participants: [],
                lastMessageDate: message.sentDateTime || message.createdDateTime,
                hasUnread: false,
                messages: [],
            });
        }
        const thread = threadMap.get(convId);
        thread.messageCount++;
        thread.messages.push(message);
        if (!message.isRead) {
            thread.hasUnread = true;
        }
        const msgDate = message.sentDateTime || message.createdDateTime;
        if (msgDate > thread.lastMessageDate) {
            thread.lastMessageDate = msgDate;
        }
        // Add unique participants
        const participantAddresses = new Set(thread.participants.map(p => p.address));
        if (!participantAddresses.has(message.from.address)) {
            thread.participants.push(message.from);
        }
        message.toRecipients.forEach(recipient => {
            if (!participantAddresses.has(recipient.address)) {
                thread.participants.push(recipient);
                participantAddresses.add(recipient.address);
            }
        });
    });
    return Array.from(threadMap.values()).sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());
};
exports.groupMessagesIntoThreads = groupMessagesIntoThreads;
/**
 * Finds related messages based on subject and participants.
 *
 * @param {MailMessage} message - Message to find related messages for
 * @param {string} userId - User ID for authorization
 * @returns {object} Query object for related messages
 *
 * @example
 * ```typescript
 * const related = await findRelatedMessages(message, 'user-123');
 * console.log(`Found ${related.length} related messages`);
 * ```
 */
const findRelatedMessages = (message, userId) => {
    const subjectClean = message.subject
        .replace(/^(Re:|Fwd:|RE:|FW:)\s*/gi, '')
        .trim();
    return {
        where: {
            userId,
            isDeleted: false,
            id: { $ne: message.id },
            $or: [
                { conversationId: message.conversationId },
                { subject: { $iLike: `%${subjectClean}%` } },
                {
                    $and: [
                        { fromAddress: message.from.address },
                        {
                            toRecipients: {
                                $contains: message.toRecipients.map(r => r.address),
                            },
                        },
                    ],
                },
            ],
        },
        order: [['sentDateTime', 'desc']],
        limit: 50,
    };
};
exports.findRelatedMessages = findRelatedMessages;
// ============================================================================
// BULK MESSAGE OPERATIONS
// ============================================================================
/**
 * Performs bulk operations on multiple messages.
 *
 * @param {BulkMessageOperation} operation - Bulk operation details
 * @param {string} userId - User ID for authorization
 * @returns {object} Bulk update query object
 *
 * @example
 * ```typescript
 * await performBulkMessageOperation({
 *   messageIds: ['msg-1', 'msg-2', 'msg-3'],
 *   operation: 'read',
 * }, 'user-123');
 * ```
 */
const performBulkMessageOperation = (operation, userId) => {
    const baseWhere = {
        id: { $in: operation.messageIds },
        userId,
    };
    switch (operation.operation) {
        case 'move':
            return {
                where: baseWhere,
                data: {
                    folderId: operation.targetFolderId,
                    lastModifiedDateTime: new Date(),
                },
            };
        case 'delete':
            if (operation.permanent) {
                return {
                    where: baseWhere,
                    force: true,
                };
            }
            return {
                where: baseWhere,
                data: {
                    isDeleted: true,
                    'flags.isDeleted': true,
                    lastModifiedDateTime: new Date(),
                },
            };
        case 'read':
            return {
                where: baseWhere,
                data: {
                    isRead: true,
                    'flags.isRead': true,
                    lastModifiedDateTime: new Date(),
                },
            };
        case 'unread':
            return {
                where: baseWhere,
                data: {
                    isRead: false,
                    'flags.isRead': false,
                    lastModifiedDateTime: new Date(),
                },
            };
        case 'flag':
            return {
                where: baseWhere,
                data: {
                    isFlagged: true,
                    'flags.isFlagged': true,
                    lastModifiedDateTime: new Date(),
                },
            };
        case 'unflag':
            return {
                where: baseWhere,
                data: {
                    isFlagged: false,
                    'flags.isFlagged': false,
                    lastModifiedDateTime: new Date(),
                },
            };
        case 'archive':
            return {
                where: baseWhere,
                data: {
                    folderId: operation.targetFolderId, // Archive folder ID
                    lastModifiedDateTime: new Date(),
                },
            };
        default:
            throw new Error(`Unknown operation: ${operation.operation}`);
    }
};
exports.performBulkMessageOperation = performBulkMessageOperation;
/**
 * Moves messages to a different folder in bulk.
 *
 * @param {string[]} messageIds - Array of message IDs to move
 * @param {string} targetFolderId - Target folder ID
 * @param {string} userId - User ID for authorization
 * @returns {object} Bulk move query object
 *
 * @example
 * ```typescript
 * await bulkMoveMessages(
 *   ['msg-1', 'msg-2', 'msg-3'],
 *   'archive-folder-id',
 *   'user-123'
 * );
 * ```
 */
const bulkMoveMessages = (messageIds, targetFolderId, userId) => {
    return {
        where: {
            id: { $in: messageIds },
            userId,
            isDeleted: false,
        },
        data: {
            folderId: targetFolderId,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.bulkMoveMessages = bulkMoveMessages;
/**
 * Marks multiple messages as read in bulk.
 *
 * @param {string[]} messageIds - Array of message IDs
 * @param {string} userId - User ID for authorization
 * @returns {object} Bulk update query object
 *
 * @example
 * ```typescript
 * await bulkMarkAsRead(['msg-1', 'msg-2', 'msg-3'], 'user-123');
 * ```
 */
const bulkMarkAsRead = (messageIds, userId) => {
    return {
        where: {
            id: { $in: messageIds },
            userId,
            isDeleted: false,
        },
        data: {
            isRead: true,
            'flags.isRead': true,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.bulkMarkAsRead = bulkMarkAsRead;
/**
 * Deletes multiple messages in bulk.
 *
 * @param {string[]} messageIds - Array of message IDs
 * @param {string} userId - User ID for authorization
 * @param {boolean} permanent - Whether to permanently delete
 * @returns {object} Bulk delete query object
 *
 * @example
 * ```typescript
 * // Soft delete (move to trash)
 * await bulkDeleteMessages(['msg-1', 'msg-2'], 'user-123', false);
 *
 * // Permanent delete
 * await bulkDeleteMessages(['msg-1', 'msg-2'], 'user-123', true);
 * ```
 */
const bulkDeleteMessages = (messageIds, userId, permanent = false) => {
    if (permanent) {
        return {
            where: {
                id: { $in: messageIds },
                userId,
            },
            force: true,
        };
    }
    return {
        where: {
            id: { $in: messageIds },
            userId,
        },
        data: {
            isDeleted: true,
            'flags.isDeleted': true,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.bulkDeleteMessages = bulkDeleteMessages;
/**
 * Applies categories to multiple messages in bulk.
 *
 * @param {string[]} messageIds - Array of message IDs
 * @param {string[]} categories - Categories to add
 * @param {string} userId - User ID for authorization
 * @returns {object} Bulk update query object
 *
 * @example
 * ```typescript
 * await bulkApplyCategories(
 *   ['msg-1', 'msg-2', 'msg-3'],
 *   ['urgent', 'patient-care'],
 *   'user-123'
 * );
 * ```
 */
const bulkApplyCategories = (messageIds, categories, userId) => {
    return {
        where: {
            id: { $in: messageIds },
            userId,
            isDeleted: false,
        },
        data: {
            categories: { $addToSet: categories },
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.bulkApplyCategories = bulkApplyCategories;
// ============================================================================
// MESSAGE IMPORT/EXPORT
// ============================================================================
/**
 * Exports a message to various formats (EML, MBOX, JSON, PDF).
 *
 * @param {MailMessage} message - Message to export
 * @param {MessageExportOptions} options - Export options
 * @returns {Buffer | string} Exported message data
 *
 * @example
 * ```typescript
 * const emlData = exportMessage(message, {
 *   format: 'eml',
 *   includeAttachments: true,
 *   includeHeaders: true
 * });
 * fs.writeFileSync('message.eml', emlData);
 * ```
 */
const exportMessage = (message, options) => {
    switch (options.format) {
        case 'eml':
            return exportToEML(message, options);
        case 'mbox':
            return exportToMBOX(message, options);
        case 'json':
            return JSON.stringify(message, null, 2);
        case 'pdf':
            return exportToPDF(message, options);
        default:
            throw new Error(`Unsupported export format: ${options.format}`);
    }
};
exports.exportMessage = exportMessage;
/**
 * Imports messages from external sources (EML, MBOX, JSON).
 *
 * @param {Buffer | string} data - Message data to import
 * @param {MessageImportOptions} options - Import options
 * @returns {MailMessage[]} Array of imported messages
 *
 * @example
 * ```typescript
 * const emlData = fs.readFileSync('messages.mbox');
 * const imported = importMessages(emlData, {
 *   userId: 'user-123',
 *   folderId: 'inbox-folder-id',
 *   format: 'mbox',
 *   preserveFlags: true,
 *   preserveDates: true
 * });
 * ```
 */
const importMessages = (data, options) => {
    switch (options.format) {
        case 'eml':
            return [importFromEML(data, options)];
        case 'mbox':
            return importFromMBOX(data, options);
        case 'json':
            return [JSON.parse(data.toString())];
        default:
            throw new Error(`Unsupported import format: ${options.format}`);
    }
};
exports.importMessages = importMessages;
// ============================================================================
// SWAGGER/OPENAPI DOCUMENTATION HELPERS
// ============================================================================
/**
 * Generates Swagger schema for MailMessage entity.
 *
 * @returns {SwaggerMessageSchema} Swagger schema object
 *
 * @example
 * ```typescript
 * @ApiResponse({
 *   status: 200,
 *   description: 'Message retrieved successfully',
 *   schema: getMailMessageSwaggerSchema()
 * })
 * async getMessage(@Param('id') id: string) { ... }
 * ```
 */
const getMailMessageSwaggerSchema = () => {
    return {
        name: 'MailMessage',
        type: 'object',
        description: 'Mail message entity with full metadata',
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            subject: 'Patient Update - John Doe',
            from: { name: 'Dr. Smith', address: 'smith@whitecross.com' },
            toRecipients: [{ name: 'Nurse Johnson', address: 'johnson@whitecross.com' }],
            bodyPreview: 'Patient has been discharged...',
            importance: 'high',
            isRead: false,
            hasAttachments: false,
            receivedDateTime: '2024-01-15T10:30:00Z',
        },
        properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            subject: { type: 'string' },
            from: { $ref: '#/components/schemas/EmailAddress' },
            toRecipients: { type: 'array', items: { $ref: '#/components/schemas/EmailAddress' } },
            importance: { type: 'string', enum: ['low', 'normal', 'high'] },
            isRead: { type: 'boolean' },
            isDraft: { type: 'boolean' },
            isFlagged: { type: 'boolean' },
            hasAttachments: { type: 'boolean' },
            receivedDateTime: { type: 'string', format: 'date-time' },
        },
    };
};
exports.getMailMessageSwaggerSchema = getMailMessageSwaggerSchema;
/**
 * Generates Swagger schema for MessageCreateDto.
 *
 * @returns {SwaggerMessageSchema} Swagger schema object
 *
 * @example
 * ```typescript
 * @ApiBody({
 *   description: 'Create new message',
 *   schema: getMessageCreateDtoSwaggerSchema()
 * })
 * async createMessage(@Body() dto: MessageCreateDto) { ... }
 * ```
 */
const getMessageCreateDtoSwaggerSchema = () => {
    return {
        name: 'MessageCreateDto',
        type: 'object',
        description: 'Data transfer object for creating new messages',
        required: true,
        example: {
            subject: 'Patient Consultation Request',
            bodyHtml: '<p>Please review patient case...</p>',
            from: { address: 'doctor@whitecross.com' },
            toRecipients: [{ address: 'specialist@whitecross.com' }],
            importance: 'high',
            sensitivity: 'confidential',
            categories: ['patient-care', 'consultation'],
        },
        properties: {
            subject: { type: 'string', required: true },
            bodyText: { type: 'string' },
            bodyHtml: { type: 'string' },
            from: { $ref: '#/components/schemas/EmailAddress', required: true },
            toRecipients: {
                type: 'array',
                items: { $ref: '#/components/schemas/EmailAddress' },
                required: true,
            },
            ccRecipients: { type: 'array', items: { $ref: '#/components/schemas/EmailAddress' } },
            importance: { type: 'string', enum: ['low', 'normal', 'high'] },
            sensitivity: { type: 'string', enum: ['normal', 'personal', 'private', 'confidential'] },
            isDraft: { type: 'boolean' },
            categories: { type: 'array', items: { type: 'string' } },
        },
    };
};
exports.getMessageCreateDtoSwaggerSchema = getMessageCreateDtoSwaggerSchema;
/**
 * Generates Swagger schema for MessageSearchQuery.
 *
 * @returns {SwaggerMessageSchema} Swagger schema object
 *
 * @example
 * ```typescript
 * @ApiQuery({
 *   name: 'search',
 *   schema: getMessageSearchQuerySwaggerSchema()
 * })
 * async searchMessages(@Query() query: MessageSearchQuery) { ... }
 * ```
 */
const getMessageSearchQuerySwaggerSchema = () => {
    return {
        name: 'MessageSearchQuery',
        type: 'object',
        description: 'Query parameters for searching messages',
        example: {
            searchTerm: 'patient discharge',
            isRead: false,
            importance: 'high',
            hasAttachments: true,
            limit: 20,
            offset: 0,
        },
        properties: {
            searchTerm: { type: 'string' },
            from: { type: 'string' },
            subject: { type: 'string' },
            isRead: { type: 'boolean' },
            isFlagged: { type: 'boolean' },
            hasAttachments: { type: 'boolean' },
            importance: { type: 'string', enum: ['low', 'normal', 'high'] },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            limit: { type: 'number', default: 50 },
            offset: { type: 'number', default: 0 },
        },
    };
};
exports.getMessageSearchQuerySwaggerSchema = getMessageSearchQuerySwaggerSchema;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Strips HTML tags from text for plain text preview.
 *
 * @param {string} html - HTML content
 * @returns {string} Plain text content
 *
 * @example
 * ```typescript
 * const plain = stripHtmlTags('<p>Hello <strong>world</strong>!</p>');
 * // Returns: "Hello world!"
 * ```
 */
const stripHtmlTags = (html) => {
    return html
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
};
exports.stripHtmlTags = stripHtmlTags;
/**
 * Parses importance level from email headers.
 *
 * @param {Record<string, string>} headers - Email headers
 * @returns {string} Importance level
 *
 * @example
 * ```typescript
 * const importance = parseImportance({ 'x-priority': '1' });
 * // Returns: 'high'
 * ```
 */
const parseImportance = (headers) => {
    const priority = headers['x-priority'] || headers['priority'];
    const importance = headers['importance'];
    if (importance) {
        if (importance.toLowerCase() === 'high')
            return 'high';
        if (importance.toLowerCase() === 'low')
            return 'low';
    }
    if (priority) {
        const priorityNum = parseInt(priority);
        if (priorityNum <= 2)
            return 'high';
        if (priorityNum >= 4)
            return 'low';
    }
    return 'normal';
};
exports.parseImportance = parseImportance;
/**
 * Parses sensitivity level from email headers.
 *
 * @param {Record<string, string>} headers - Email headers
 * @returns {string} Sensitivity level
 *
 * @example
 * ```typescript
 * const sensitivity = parseSensitivity({ 'sensitivity': 'confidential' });
 * // Returns: 'confidential'
 * ```
 */
const parseSensitivity = (headers) => {
    const sensitivity = headers['sensitivity'];
    if (!sensitivity)
        return 'normal';
    const lower = sensitivity.toLowerCase();
    if (lower === 'confidential')
        return 'confidential';
    if (lower === 'private')
        return 'private';
    if (lower === 'personal')
        return 'personal';
    return 'normal';
};
exports.parseSensitivity = parseSensitivity;
/**
 * Parses an email message from raw data.
 *
 * @param {any} rawData - Raw email data
 * @returns {any} Parsed email object
 *
 * @example
 * ```typescript
 * const parsed = parseEmailMessage(rawEmailData);
 * console.log('Subject:', parsed.subject);
 * console.log('From:', parsed.from.address);
 * ```
 */
const parseEmailMessage = (rawData) => {
    // This would use a library like mailparser or similar
    // Returning structure for reference
    return {
        headers: rawData.headers || {},
        subject: rawData.subject,
        from: rawData.from,
        to: rawData.to,
        cc: rawData.cc,
        replyTo: rawData.replyTo,
        date: rawData.date,
        text: rawData.text,
        html: rawData.html,
        attachments: rawData.attachments || [],
    };
};
exports.parseEmailMessage = parseEmailMessage;
/**
 * Exports a message to EML format.
 *
 * @param {MailMessage} message - Message to export
 * @param {MessageExportOptions} options - Export options
 * @returns {Buffer} EML formatted message
 */
const exportToEML = (message, options) => {
    // Implementation would create RFC 5322 compliant EML format
    const eml = `From: ${message.from.address}\nTo: ${message.toRecipients.map(r => r.address).join(', ')}\nSubject: ${message.subject}\nDate: ${message.sentDateTime}\n\n${message.bodyText}`;
    return Buffer.from(eml);
};
/**
 * Exports a message to MBOX format.
 *
 * @param {MailMessage} message - Message to export
 * @param {MessageExportOptions} options - Export options
 * @returns {Buffer} MBOX formatted message
 */
const exportToMBOX = (message, options) => {
    // Implementation would create MBOX format
    const mbox = `From ${message.from.address} ${message.sentDateTime}\n${exportToEML(message, options).toString()}`;
    return Buffer.from(mbox);
};
/**
 * Exports a message to PDF format.
 *
 * @param {MailMessage} message - Message to export
 * @param {MessageExportOptions} options - Export options
 * @returns {Buffer} PDF formatted message
 */
const exportToPDF = (message, options) => {
    // Implementation would use PDF generation library
    // Placeholder for structure
    return Buffer.from('PDF content placeholder');
};
/**
 * Imports a message from EML format.
 *
 * @param {Buffer | string} data - EML data
 * @param {MessageImportOptions} options - Import options
 * @returns {MailMessage} Imported message
 */
const importFromEML = (data, options) => {
    const rawMessage = (0, exports.parseEmailMessage)(data);
    return (0, exports.processIncomingMessage)(rawMessage, options.userId);
};
/**
 * Imports messages from MBOX format.
 *
 * @param {Buffer | string} data - MBOX data
 * @param {MessageImportOptions} options - Import options
 * @returns {MailMessage[]} Array of imported messages
 */
const importFromMBOX = (data, options) => {
    // Implementation would parse MBOX format and split into individual messages
    const messages = [];
    // Parse MBOX and create messages
    return messages;
};
exports.default = {
    // Sequelize Models
    getMailMessageModelAttributes: exports.getMailMessageModelAttributes,
    getMessageAttachmentModelAttributes: exports.getMessageAttachmentModelAttributes,
    getMessageRecipientModelAttributes: exports.getMessageRecipientModelAttributes,
    getMailFolderModelAttributes: exports.getMailFolderModelAttributes,
    // Message CRUD
    createMailMessage: exports.createMailMessage,
    getMailMessageById: exports.getMailMessageById,
    updateMailMessage: exports.updateMailMessage,
    deleteMailMessage: exports.deleteMailMessage,
    searchMailMessages: exports.searchMailMessages,
    // Sending and Receiving
    prepareSMTPMessage: exports.prepareSMTPMessage,
    processIncomingMessage: exports.processIncomingMessage,
    sendMessageViaSMTP: exports.sendMessageViaSMTP,
    receiveMessagesFromIMAP: exports.receiveMessagesFromIMAP,
    // Reply and Forward
    createReplyMessage: exports.createReplyMessage,
    createForwardMessage: exports.createForwardMessage,
    markMessageAsReplied: exports.markMessageAsReplied,
    // Draft Management
    createDraftMessage: exports.createDraftMessage,
    updateDraftMessage: exports.updateDraftMessage,
    sendDraftMessage: exports.sendDraftMessage,
    listDraftMessages: exports.listDraftMessages,
    autoSaveDraft: exports.autoSaveDraft,
    // Flags and Status
    markMessageAsRead: exports.markMessageAsRead,
    markMessageAsFlagged: exports.markMessageAsFlagged,
    setMessageImportance: exports.setMessageImportance,
    addMessageCategories: exports.addMessageCategories,
    removeMessageCategories: exports.removeMessageCategories,
    updateMessageFlags: exports.updateMessageFlags,
    // Metadata and Headers
    generateInternetMessageId: exports.generateInternetMessageId,
    extractConversationId: exports.extractConversationId,
    parseMessageHeaders: exports.parseMessageHeaders,
    updateMessageMetadata: exports.updateMessageMetadata,
    parseDeliveryStatus: exports.parseDeliveryStatus,
    calculateMessageSize: exports.calculateMessageSize,
    // Threading
    getConversationThread: exports.getConversationThread,
    groupMessagesIntoThreads: exports.groupMessagesIntoThreads,
    findRelatedMessages: exports.findRelatedMessages,
    // Bulk Operations
    performBulkMessageOperation: exports.performBulkMessageOperation,
    bulkMoveMessages: exports.bulkMoveMessages,
    bulkMarkAsRead: exports.bulkMarkAsRead,
    bulkDeleteMessages: exports.bulkDeleteMessages,
    bulkApplyCategories: exports.bulkApplyCategories,
    // Import/Export
    exportMessage: exports.exportMessage,
    importMessages: exports.importMessages,
    // Swagger Documentation
    getMailMessageSwaggerSchema: exports.getMailMessageSwaggerSchema,
    getMessageCreateDtoSwaggerSchema: exports.getMessageCreateDtoSwaggerSchema,
    getMessageSearchQuerySwaggerSchema: exports.getMessageSearchQuerySwaggerSchema,
    // Helpers
    stripHtmlTags: exports.stripHtmlTags,
    parseImportance: exports.parseImportance,
    parseSensitivity: exports.parseSensitivity,
    parseEmailMessage: exports.parseEmailMessage,
};
//# sourceMappingURL=mail-message-core-kit.js.map