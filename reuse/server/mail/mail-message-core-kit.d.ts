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
interface MailMessage {
    id: string;
    userId: string;
    folderId?: string;
    conversationId?: string;
    internetMessageId: string;
    subject: string;
    bodyPreview?: string;
    bodyText?: string;
    bodyHtml?: string;
    from: EmailAddress;
    toRecipients: EmailAddress[];
    ccRecipients?: EmailAddress[];
    bccRecipients?: EmailAddress[];
    replyTo?: EmailAddress[];
    sender?: EmailAddress;
    importance: 'low' | 'normal' | 'high';
    priority: 'low' | 'normal' | 'high';
    sensitivity: 'normal' | 'personal' | 'private' | 'confidential';
    isRead: boolean;
    isDraft: boolean;
    isFlagged: boolean;
    isDeleted: boolean;
    hasAttachments: boolean;
    size: number;
    sentDateTime?: Date;
    receivedDateTime?: Date;
    lastModifiedDateTime: Date;
    createdDateTime: Date;
    categories?: string[];
    flags?: MessageFlags;
    headers?: MessageHeaders;
    metadata?: Record<string, any>;
    encryptionInfo?: EncryptionInfo;
}
interface EmailAddress {
    name?: string;
    address: string;
}
interface MessageFlags {
    isRead: boolean;
    isFlagged: boolean;
    isAnswered: boolean;
    isForwarded: boolean;
    isDraft: boolean;
    isDeleted: boolean;
    isImportant: boolean;
    isEncrypted: boolean;
    requiresReadReceipt: boolean;
    requiresDeliveryReceipt: boolean;
}
interface MessageHeaders {
    messageId: string;
    inReplyTo?: string;
    references?: string[];
    date: string;
    returnPath?: string;
    receivedSpf?: string;
    authentication?: string;
    contentType: string;
    mimeVersion: string;
    xMailer?: string;
    xPriority?: string;
    custom?: Record<string, string>;
}
interface EncryptionInfo {
    isEncrypted: boolean;
    algorithm?: string;
    encryptedBy?: string;
    encryptedAt?: Date;
    keyId?: string;
}
interface DeliveryStatus {
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'read';
    statusMessage?: string;
    lastUpdated: Date;
    errorCode?: string;
    errorMessage?: string;
    remoteServer?: string;
    attempts: number;
}
interface MessageSearchQuery {
    userId: string;
    folderId?: string;
    searchTerm?: string;
    from?: string;
    to?: string;
    subject?: string;
    hasAttachments?: boolean;
    isRead?: boolean;
    isFlagged?: boolean;
    importance?: 'low' | 'normal' | 'high';
    startDate?: Date;
    endDate?: Date;
    categories?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'date' | 'subject' | 'from' | 'size';
    sortOrder?: 'asc' | 'desc';
}
interface MessageCreateDto {
    userId: string;
    folderId?: string;
    subject: string;
    bodyText?: string;
    bodyHtml?: string;
    from: EmailAddress;
    toRecipients: EmailAddress[];
    ccRecipients?: EmailAddress[];
    bccRecipients?: EmailAddress[];
    replyTo?: EmailAddress[];
    importance?: 'low' | 'normal' | 'high';
    sensitivity?: 'normal' | 'personal' | 'private' | 'confidential';
    isDraft?: boolean;
    requiresReadReceipt?: boolean;
    requiresDeliveryReceipt?: boolean;
    categories?: string[];
    attachments?: MessageAttachmentDto[];
    inReplyTo?: string;
    references?: string[];
}
interface MessageAttachmentDto {
    filename: string;
    contentType: string;
    size: number;
    data: Buffer;
    isInline?: boolean;
    contentId?: string;
}
interface MessageUpdateDto {
    subject?: string;
    bodyText?: string;
    bodyHtml?: string;
    toRecipients?: EmailAddress[];
    ccRecipients?: EmailAddress[];
    bccRecipients?: EmailAddress[];
    importance?: 'low' | 'normal' | 'high';
    sensitivity?: 'normal' | 'personal' | 'private' | 'confidential';
    categories?: string[];
    isRead?: boolean;
    isFlagged?: boolean;
}
interface MessageSendOptions {
    saveToSentItems?: boolean;
    requestReadReceipt?: boolean;
    requestDeliveryReceipt?: boolean;
    scheduledSendTime?: Date;
    expiryTime?: Date;
    trackOpens?: boolean;
    trackClicks?: boolean;
    metadata?: Record<string, any>;
}
interface MessageForwardOptions {
    toRecipients: EmailAddress[];
    comment?: string;
    includeAttachments?: boolean;
}
interface MessageReplyOptions {
    replyAll?: boolean;
    comment?: string;
    includeOriginalMessage?: boolean;
    attachments?: MessageAttachmentDto[];
}
interface BulkMessageOperation {
    messageIds: string[];
    operation: 'move' | 'delete' | 'read' | 'unread' | 'flag' | 'unflag' | 'archive';
    targetFolderId?: string;
    permanent?: boolean;
}
interface MessageThreadInfo {
    conversationId: string;
    messageCount: number;
    participants: EmailAddress[];
    lastMessageDate: Date;
    hasUnread: boolean;
    messages: MailMessage[];
}
interface MessageExportOptions {
    format: 'eml' | 'mbox' | 'json' | 'pdf';
    includeAttachments?: boolean;
    includeHeaders?: boolean;
    encryption?: {
        enabled: boolean;
        algorithm?: string;
        publicKey?: string;
    };
}
interface MessageImportOptions {
    userId: string;
    folderId?: string;
    format: 'eml' | 'mbox' | 'json';
    preserveFlags?: boolean;
    preserveDates?: boolean;
}
interface SwaggerMessageSchema {
    name: string;
    type: string;
    description: string;
    example: any;
    required?: boolean;
    properties?: Record<string, any>;
}
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
export declare const getMailMessageModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    folderId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    conversationId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    internetMessageId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    subject: {
        type: string;
        allowNull: boolean;
    };
    bodyPreview: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    bodyText: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    bodyHtml: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    fromName: {
        type: string;
        allowNull: boolean;
    };
    fromAddress: {
        type: string;
        allowNull: boolean;
    };
    toRecipients: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    ccRecipients: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    bccRecipients: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    replyTo: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    importance: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    priority: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    sensitivity: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    isRead: {
        type: string;
        defaultValue: boolean;
    };
    isDraft: {
        type: string;
        defaultValue: boolean;
    };
    isFlagged: {
        type: string;
        defaultValue: boolean;
    };
    isDeleted: {
        type: string;
        defaultValue: boolean;
    };
    hasAttachments: {
        type: string;
        defaultValue: boolean;
    };
    size: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    sentDateTime: {
        type: string;
        allowNull: boolean;
    };
    receivedDateTime: {
        type: string;
        allowNull: boolean;
    };
    lastModifiedDateTime: {
        type: string;
        allowNull: boolean;
    };
    categories: {
        type: string;
        defaultValue: never[];
    };
    flags: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    headers: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    encryptionInfo: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getMessageAttachmentModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    filename: {
        type: string;
        allowNull: boolean;
    };
    contentType: {
        type: string;
        allowNull: boolean;
    };
    size: {
        type: string;
        allowNull: boolean;
    };
    contentId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    contentLocation: {
        type: string;
        allowNull: boolean;
    };
    isInline: {
        type: string;
        defaultValue: boolean;
    };
    storageUrl: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    checksum: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getMessageRecipientModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
        onDelete: string;
    };
    recipientType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    address: {
        type: string;
        allowNull: boolean;
    };
    deliveryStatus: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    readAt: {
        type: string;
        allowNull: boolean;
    };
    deliveredAt: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getMailFolderModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    parentFolderId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    displayName: {
        type: string;
        allowNull: boolean;
    };
    type: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    unreadCount: {
        type: string;
        defaultValue: number;
    };
    totalCount: {
        type: string;
        defaultValue: number;
    };
    isHidden: {
        type: string;
        defaultValue: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const createMailMessage: (dto: MessageCreateDto) => MailMessage;
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
export declare const getMailMessageById: (messageId: string, userId: string, options?: {
    includeAttachments?: boolean;
    includeRecipients?: boolean;
}) => Record<string, any>;
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
export declare const updateMailMessage: (messageId: string, userId: string, updates: MessageUpdateDto) => Record<string, any>;
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
export declare const deleteMailMessage: (messageId: string, userId: string, permanent?: boolean) => Record<string, any>;
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
export declare const searchMailMessages: (query: MessageSearchQuery) => Record<string, any>;
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
export declare const prepareSMTPMessage: (message: MailMessage, options?: MessageSendOptions) => Record<string, any>;
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
export declare const processIncomingMessage: (rawMessage: any, userId: string) => MailMessage;
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
export declare const sendMessageViaSMTP: (message: MailMessage, options?: MessageSendOptions) => Promise<DeliveryStatus>;
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
export declare const receiveMessagesFromIMAP: (userId: string, folderId: string, options?: {
    since?: Date;
    limit?: number;
}) => Promise<MailMessage[]>;
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
export declare const createReplyMessage: (original: MailMessage, options: MessageReplyOptions, userId: string) => MessageCreateDto;
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
export declare const createForwardMessage: (original: MailMessage, options: MessageForwardOptions, userId: string) => MessageCreateDto;
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
export declare const markMessageAsReplied: (messageId: string, userId: string, action: "replied" | "forwarded") => Record<string, any>;
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
export declare const createDraftMessage: (dto: MessageCreateDto) => MailMessage;
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
export declare const updateDraftMessage: (draftId: string, userId: string, updates: MessageUpdateDto) => Record<string, any>;
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
export declare const sendDraftMessage: (draftId: string, userId: string) => Record<string, any>;
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
export declare const listDraftMessages: (userId: string, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
}) => Record<string, any>;
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
export declare const autoSaveDraft: (draftId: string | null, userId: string, content: MessageUpdateDto) => Record<string, any>;
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
export declare const markMessageAsRead: (messageId: string, userId: string, isRead: boolean) => Record<string, any>;
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
export declare const markMessageAsFlagged: (messageId: string, userId: string, isFlagged: boolean) => Record<string, any>;
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
export declare const setMessageImportance: (messageId: string, userId: string, importance: "low" | "normal" | "high") => Record<string, any>;
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
export declare const addMessageCategories: (messageId: string, userId: string, categories: string[]) => Record<string, any>;
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
export declare const removeMessageCategories: (messageId: string, userId: string, categories: string[]) => Record<string, any>;
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
export declare const updateMessageFlags: (messageId: string, userId: string, flags: Partial<MessageFlags>) => Record<string, any>;
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
export declare const generateInternetMessageId: (domain: string) => string;
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
export declare const extractConversationId: (inReplyTo: string) => string;
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
export declare const parseMessageHeaders: (rawHeaders: Record<string, string>) => MessageHeaders;
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
export declare const updateMessageMetadata: (messageId: string, userId: string, metadata: Record<string, any>) => Record<string, any>;
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
export declare const parseDeliveryStatus: (smtpResponse: any) => DeliveryStatus;
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
export declare const calculateMessageSize: (messageData: {
    subject?: string;
    bodyText?: string;
    bodyHtml?: string;
    attachments?: MessageAttachmentDto[];
}) => number;
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
export declare const getConversationThread: (conversationId: string, userId: string) => Record<string, any>;
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
export declare const groupMessagesIntoThreads: (messages: MailMessage[]) => MessageThreadInfo[];
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
export declare const findRelatedMessages: (message: MailMessage, userId: string) => Record<string, any>;
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
export declare const performBulkMessageOperation: (operation: BulkMessageOperation, userId: string) => Record<string, any>;
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
export declare const bulkMoveMessages: (messageIds: string[], targetFolderId: string, userId: string) => Record<string, any>;
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
export declare const bulkMarkAsRead: (messageIds: string[], userId: string) => Record<string, any>;
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
export declare const bulkDeleteMessages: (messageIds: string[], userId: string, permanent?: boolean) => Record<string, any>;
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
export declare const bulkApplyCategories: (messageIds: string[], categories: string[], userId: string) => Record<string, any>;
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
export declare const exportMessage: (message: MailMessage, options: MessageExportOptions) => Buffer | string;
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
export declare const importMessages: (data: Buffer | string, options: MessageImportOptions) => MailMessage[];
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
export declare const getMailMessageSwaggerSchema: () => SwaggerMessageSchema;
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
export declare const getMessageCreateDtoSwaggerSchema: () => SwaggerMessageSchema;
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
export declare const getMessageSearchQuerySwaggerSchema: () => SwaggerMessageSchema;
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
export declare const stripHtmlTags: (html: string) => string;
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
export declare const parseImportance: (headers: Record<string, string>) => "low" | "normal" | "high";
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
export declare const parseSensitivity: (headers: Record<string, string>) => "normal" | "personal" | "private" | "confidential";
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
export declare const parseEmailMessage: (rawData: any) => any;
declare const _default: {
    getMailMessageModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        folderId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        conversationId: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        internetMessageId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            comment: string;
        };
        subject: {
            type: string;
            allowNull: boolean;
        };
        bodyPreview: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        bodyText: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        bodyHtml: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        fromName: {
            type: string;
            allowNull: boolean;
        };
        fromAddress: {
            type: string;
            allowNull: boolean;
        };
        toRecipients: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        ccRecipients: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        bccRecipients: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        replyTo: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        importance: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        priority: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        sensitivity: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        isRead: {
            type: string;
            defaultValue: boolean;
        };
        isDraft: {
            type: string;
            defaultValue: boolean;
        };
        isFlagged: {
            type: string;
            defaultValue: boolean;
        };
        isDeleted: {
            type: string;
            defaultValue: boolean;
        };
        hasAttachments: {
            type: string;
            defaultValue: boolean;
        };
        size: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        sentDateTime: {
            type: string;
            allowNull: boolean;
        };
        receivedDateTime: {
            type: string;
            allowNull: boolean;
        };
        lastModifiedDateTime: {
            type: string;
            allowNull: boolean;
        };
        categories: {
            type: string;
            defaultValue: never[];
        };
        flags: {
            type: string;
            defaultValue: {};
            comment: string;
        };
        headers: {
            type: string;
            defaultValue: {};
            comment: string;
        };
        metadata: {
            type: string;
            defaultValue: {};
            comment: string;
        };
        encryptionInfo: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getMessageAttachmentModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        messageId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        filename: {
            type: string;
            allowNull: boolean;
        };
        contentType: {
            type: string;
            allowNull: boolean;
        };
        size: {
            type: string;
            allowNull: boolean;
        };
        contentId: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        contentLocation: {
            type: string;
            allowNull: boolean;
        };
        isInline: {
            type: string;
            defaultValue: boolean;
        };
        storageUrl: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        checksum: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getMessageRecipientModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        messageId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
            onDelete: string;
        };
        recipientType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        address: {
            type: string;
            allowNull: boolean;
        };
        deliveryStatus: {
            type: string;
            defaultValue: {};
            comment: string;
        };
        readAt: {
            type: string;
            allowNull: boolean;
        };
        deliveredAt: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getMailFolderModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        parentFolderId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        displayName: {
            type: string;
            allowNull: boolean;
        };
        type: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        unreadCount: {
            type: string;
            defaultValue: number;
        };
        totalCount: {
            type: string;
            defaultValue: number;
        };
        isHidden: {
            type: string;
            defaultValue: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    createMailMessage: (dto: MessageCreateDto) => MailMessage;
    getMailMessageById: (messageId: string, userId: string, options?: {
        includeAttachments?: boolean;
        includeRecipients?: boolean;
    }) => Record<string, any>;
    updateMailMessage: (messageId: string, userId: string, updates: MessageUpdateDto) => Record<string, any>;
    deleteMailMessage: (messageId: string, userId: string, permanent?: boolean) => Record<string, any>;
    searchMailMessages: (query: MessageSearchQuery) => Record<string, any>;
    prepareSMTPMessage: (message: MailMessage, options?: MessageSendOptions) => Record<string, any>;
    processIncomingMessage: (rawMessage: any, userId: string) => MailMessage;
    sendMessageViaSMTP: (message: MailMessage, options?: MessageSendOptions) => Promise<DeliveryStatus>;
    receiveMessagesFromIMAP: (userId: string, folderId: string, options?: {
        since?: Date;
        limit?: number;
    }) => Promise<MailMessage[]>;
    createReplyMessage: (original: MailMessage, options: MessageReplyOptions, userId: string) => MessageCreateDto;
    createForwardMessage: (original: MailMessage, options: MessageForwardOptions, userId: string) => MessageCreateDto;
    markMessageAsReplied: (messageId: string, userId: string, action: "replied" | "forwarded") => Record<string, any>;
    createDraftMessage: (dto: MessageCreateDto) => MailMessage;
    updateDraftMessage: (draftId: string, userId: string, updates: MessageUpdateDto) => Record<string, any>;
    sendDraftMessage: (draftId: string, userId: string) => Record<string, any>;
    listDraftMessages: (userId: string, options?: {
        limit?: number;
        offset?: number;
        sortBy?: string;
    }) => Record<string, any>;
    autoSaveDraft: (draftId: string | null, userId: string, content: MessageUpdateDto) => Record<string, any>;
    markMessageAsRead: (messageId: string, userId: string, isRead: boolean) => Record<string, any>;
    markMessageAsFlagged: (messageId: string, userId: string, isFlagged: boolean) => Record<string, any>;
    setMessageImportance: (messageId: string, userId: string, importance: "low" | "normal" | "high") => Record<string, any>;
    addMessageCategories: (messageId: string, userId: string, categories: string[]) => Record<string, any>;
    removeMessageCategories: (messageId: string, userId: string, categories: string[]) => Record<string, any>;
    updateMessageFlags: (messageId: string, userId: string, flags: Partial<MessageFlags>) => Record<string, any>;
    generateInternetMessageId: (domain: string) => string;
    extractConversationId: (inReplyTo: string) => string;
    parseMessageHeaders: (rawHeaders: Record<string, string>) => MessageHeaders;
    updateMessageMetadata: (messageId: string, userId: string, metadata: Record<string, any>) => Record<string, any>;
    parseDeliveryStatus: (smtpResponse: any) => DeliveryStatus;
    calculateMessageSize: (messageData: {
        subject?: string;
        bodyText?: string;
        bodyHtml?: string;
        attachments?: MessageAttachmentDto[];
    }) => number;
    getConversationThread: (conversationId: string, userId: string) => Record<string, any>;
    groupMessagesIntoThreads: (messages: MailMessage[]) => MessageThreadInfo[];
    findRelatedMessages: (message: MailMessage, userId: string) => Record<string, any>;
    performBulkMessageOperation: (operation: BulkMessageOperation, userId: string) => Record<string, any>;
    bulkMoveMessages: (messageIds: string[], targetFolderId: string, userId: string) => Record<string, any>;
    bulkMarkAsRead: (messageIds: string[], userId: string) => Record<string, any>;
    bulkDeleteMessages: (messageIds: string[], userId: string, permanent?: boolean) => Record<string, any>;
    bulkApplyCategories: (messageIds: string[], categories: string[], userId: string) => Record<string, any>;
    exportMessage: (message: MailMessage, options: MessageExportOptions) => Buffer | string;
    importMessages: (data: Buffer | string, options: MessageImportOptions) => MailMessage[];
    getMailMessageSwaggerSchema: () => SwaggerMessageSchema;
    getMessageCreateDtoSwaggerSchema: () => SwaggerMessageSchema;
    getMessageSearchQuerySwaggerSchema: () => SwaggerMessageSchema;
    stripHtmlTags: (html: string) => string;
    parseImportance: (headers: Record<string, string>) => "low" | "normal" | "high";
    parseSensitivity: (headers: Record<string, string>) => "normal" | "personal" | "private" | "confidential";
    parseEmailMessage: (rawData: any) => any;
};
export default _default;
//# sourceMappingURL=mail-message-core-kit.d.ts.map