/**
 * Message Validation Schemas
 *
 * Zod schemas for message operations with HIPAA compliance
 */

import { z } from 'zod';

/**
 * Message priority levels
 */
export const MessagePrioritySchema = z.enum(['low', 'normal', 'high', 'urgent']);
export type MessagePriority = z.infer<typeof MessagePrioritySchema>;

/**
 * Message status
 */
export const MessageStatusSchema = z.enum([
  'draft',
  'sent',
  'delivered',
  'read',
  'archived',
  'deleted'
]);
export type MessageStatus = z.infer<typeof MessageStatusSchema>;

/**
 * Message type
 */
export const MessageTypeSchema = z.enum(['direct', 'group', 'system']);
export type MessageType = z.infer<typeof MessageTypeSchema>;

/**
 * Attachment schema
 */
export const AttachmentSchema = z.object({
  id: z.string().uuid().optional(),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024), // 10MB max
  fileType: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i),
  fileUrl: z.string().url().optional(),
  encryptionKey: z.string().optional(),
  uploadedAt: z.date().optional(),
  uploadedBy: z.string().uuid().optional()
});
export type Attachment = z.infer<typeof AttachmentSchema>;

/**
 * Read receipt schema
 */
export const ReadReceiptSchema = z.object({
  userId: z.string().uuid(),
  readAt: z.date(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional()
});
export type ReadReceipt = z.infer<typeof ReadReceiptSchema>;

/**
 * Message recipient schema
 */
export const MessageRecipientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
  avatarUrl: z.string().url().optional()
});
export type MessageRecipient = z.infer<typeof MessageRecipientSchema>;

/**
 * Create message schema
 */
export const CreateMessageSchema = z.object({
  recipientIds: z.array(z.string().uuid()).min(1).max(100),
  subject: z.string().min(1).max(255),
  body: z.string().min(1).max(50000),
  priority: MessagePrioritySchema.default('normal'),
  type: MessageTypeSchema.default('direct'),
  threadId: z.string().uuid().optional(),
  replyToId: z.string().uuid().optional(),
  attachments: z.array(AttachmentSchema).max(5).default([]),
  containsPhi: z.boolean().default(false),
  scheduled: z.boolean().default(false),
  sendAt: z.date().optional(),
  expiresAt: z.date().optional(),
  requireReadReceipt: z.boolean().default(false)
}).refine(
  (data) => {
    // If scheduled, sendAt must be provided and in the future
    if (data.scheduled) {
      return data.sendAt && data.sendAt > new Date();
    }
    return true;
  },
  {
    message: 'Scheduled messages must have a future sendAt date',
    path: ['sendAt']
  }
).refine(
  (data) => {
    // If expiresAt is provided, it must be after sendAt or now
    if (data.expiresAt) {
      const compareDate = data.sendAt || new Date();
      return data.expiresAt > compareDate;
    }
    return true;
  },
  {
    message: 'Expiration date must be after send date',
    path: ['expiresAt']
  }
);
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

/**
 * Update message schema (draft only)
 */
export const UpdateMessageSchema = z.object({
  id: z.string().uuid(),
  recipientIds: z.array(z.string().uuid()).min(1).max(100).optional(),
  subject: z.string().min(1).max(255).optional(),
  body: z.string().min(1).max(50000).optional(),
  priority: MessagePrioritySchema.optional(),
  attachments: z.array(AttachmentSchema).max(5).optional(),
  containsPhi: z.boolean().optional()
});
export type UpdateMessageInput = z.infer<typeof UpdateMessageSchema>;

/**
 * Message response schema
 */
export const MessageSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  senderName: z.string(),
  senderEmail: z.string().email(),
  senderAvatarUrl: z.string().url().optional(),
  recipientIds: z.array(z.string().uuid()),
  recipients: z.array(MessageRecipientSchema),
  subject: z.string(),
  body: z.string(),
  bodyPlainText: z.string().optional(),
  priority: MessagePrioritySchema,
  type: MessageTypeSchema,
  status: MessageStatusSchema,
  threadId: z.string().uuid().optional(),
  replyToId: z.string().uuid().optional(),
  attachments: z.array(AttachmentSchema),
  readReceipts: z.array(ReadReceiptSchema),
  containsPhi: z.boolean(),
  isEncrypted: z.boolean(),
  requireReadReceipt: z.boolean(),
  sentAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  readAt: z.date().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Message = z.infer<typeof MessageSchema>;

/**
 * Message thread schema
 */
export const MessageThreadSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  participantIds: z.array(z.string().uuid()),
  participants: z.array(MessageRecipientSchema),
  messageCount: z.number().int().nonnegative(),
  lastMessageAt: z.date().optional(),
  lastMessagePreview: z.string().optional(),
  hasUnread: z.boolean(),
  unreadCount: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type MessageThread = z.infer<typeof MessageThreadSchema>;

/**
 * Message filter schema
 */
export const MessageFilterSchema = z.object({
  status: MessageStatusSchema.optional(),
  type: MessageTypeSchema.optional(),
  priority: MessagePrioritySchema.optional(),
  senderId: z.string().uuid().optional(),
  recipientId: z.string().uuid().optional(),
  threadId: z.string().uuid().optional(),
  containsPhi: z.boolean().optional(),
  hasAttachments: z.boolean().optional(),
  unreadOnly: z.boolean().optional(),
  search: z.string().max(255).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['createdAt', 'sentAt', 'priority', 'subject']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});
export type MessageFilter = z.infer<typeof MessageFilterSchema>;

/**
 * Mark message as read schema
 */
export const MarkAsReadSchema = z.object({
  messageId: z.string().uuid(),
  threadId: z.string().uuid().optional()
});
export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;

/**
 * Archive message schema
 */
export const ArchiveMessageSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(1).max(100)
});
export type ArchiveMessageInput = z.infer<typeof ArchiveMessageSchema>;

/**
 * Delete message schema
 */
export const DeleteMessageSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(1).max(100),
  permanent: z.boolean().default(false)
});
export type DeleteMessageInput = z.infer<typeof DeleteMessageSchema>;

/**
 * Typing indicator schema
 */
export const TypingIndicatorSchema = z.object({
  userId: z.string().uuid(),
  threadId: z.string().uuid().optional(),
  recipientIds: z.array(z.string().uuid()).optional(),
  isTyping: z.boolean()
});
export type TypingIndicator = z.infer<typeof TypingIndicatorSchema>;

/**
 * File upload schema
 */
export const FileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'File size must be less than 10MB'
  ).refine(
    (file) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ];
      return allowedTypes.includes(file.type);
    },
    'File type not allowed'
  ),
  messageId: z.string().uuid().optional(),
  encrypt: z.boolean().default(true)
});
export type FileUploadInput = z.infer<typeof FileUploadSchema>;
