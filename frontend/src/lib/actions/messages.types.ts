/**
 * @fileoverview Message Type Definitions
 * @module lib/actions/messages.types
 *
 * TypeScript types and interfaces for the messaging system.
 * Includes message models, filters, analytics, and cache configuration.
 */

// ==========================================
// CONFIGURATION CONSTANTS
// ==========================================

/**
 * Custom cache tags for messages
 */
export const MESSAGE_CACHE_TAGS = {
  MESSAGES: 'messages',
  THREADS: 'message-threads',
  CONVERSATIONS: 'conversations',
  ATTACHMENTS: 'message-attachments',
  TEMPLATES: 'message-templates',
} as const;

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  SESSION: 300,  // 5 minutes
  STATIC: 3600,  // 1 hour
  STATS: 180,    // 3 minutes
} as const;

// ==========================================
// CORE TYPE DEFINITIONS
// ==========================================

/**
 * Standard action result wrapper for server actions
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

/**
 * Message entity - represents a single message in the system
 */
export interface Message {
  id: string;
  threadId: string;
  parentId?: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: string;
  toUserIds: string[];
  toUserNames: string[];
  ccUserIds: string[];
  ccUserNames: string[];
  bccUserIds: string[];
  bccUserNames: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'medical' | 'administrative' | 'emergency' | 'notification' | 'announcement';
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'archived' | 'deleted';
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  attachments: MessageAttachment[];
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  archivedAt?: string;
  deletedAt?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new message
 */
export interface CreateMessageData {
  threadId?: string;
  parentId?: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  toUserIds: string[];
  ccUserIds?: string[];
  bccUserIds?: string[];
  priority?: Message['priority'];
  category?: Message['category'];
  scheduledAt?: string;
  tags?: string[];
  attachmentIds?: string[];
  templateId?: string;
  isDraft?: boolean;
}

/**
 * Data allowed for updating an existing message
 */
export interface UpdateMessageData {
  subject?: string;
  body?: string;
  bodyHtml?: string;
  priority?: Message['priority'];
  category?: Message['category'];
  status?: Message['status'];
  isStarred?: boolean;
  tags?: string[];
  scheduledAt?: string;
}

/**
 * Message thread - represents a conversation thread
 */
export interface MessageThread {
  id: string;
  subject: string;
  participantIds: string[];
  participantNames: string[];
  messageCount: number;
  unreadCount: number;
  lastMessageAt: string;
  lastMessagePreview: string;
  lastMessageFromId: string;
  lastMessageFromName: string;
  category: Message['category'];
  priority: Message['priority'];
  isArchived: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Message attachment metadata
 */
export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  isInline: boolean;
  contentId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

/**
 * Message template for common messages
 */
export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  category: Message['category'];
  variables: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new message template
 */
export interface CreateMessageTemplateData {
  name: string;
  description: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  category: Message['category'];
  variables?: string[];
  isActive?: boolean;
}

/**
 * Filters for querying messages
 */
export interface MessageFilters {
  threadId?: string;
  fromUserId?: string;
  toUserId?: string;
  category?: Message['category'];
  priority?: Message['priority'];
  status?: Message['status'];
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Message analytics data structure
 */
export interface MessageAnalytics {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  unreadMessages: number;
  averageResponseTime: number;
  categoryBreakdown: {
    category: Message['category'];
    count: number;
    percentage: number;
  }[];
  priorityBreakdown: {
    priority: Message['priority'];
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    sent: number;
    received: number;
  }[];
}
