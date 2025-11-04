/**
 * Type definitions for healthcare messaging system
 * Extracted from MessagesContent.tsx for better organization and reusability
 */

// Healthcare message types and priorities
export type MessageType =
  | 'general'
  | 'emergency'
  | 'medical'
  | 'appointment'
  | 'medication'
  | 'incident'
  | 'parent_communication'
  | 'staff_notification';

export type MessagePriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent'
  | 'emergency';

export type MessageStatus =
  | 'unread'
  | 'read'
  | 'replied'
  | 'forwarded'
  | 'archived'
  | 'deleted'
  | 'starred';

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  isEncrypted: boolean;
}

export interface HealthcareMessage {
  id: string;
  subject: string;
  content: string;
  type: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  from: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  to: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  cc?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  timestamp: Date;
  readAt?: Date;
  repliedAt?: Date;
  attachments: MessageAttachment[];
  isEncrypted: boolean;
  requiresAcknowledgment: boolean;
  acknowledgedAt?: Date;
  relatedStudent?: {
    id: string;
    name: string;
  };
  tags: string[];
  threadId?: string;
  parentMessageId?: string;
}

export interface MessageStats {
  unread: number;
  total: number;
  starred: number;
  archived: number;
  emergency: number;
  medical: number;
  appointments: number;
  parentCommunications: number;
  requiresAcknowledgment: number;
}

export interface MessagesContentProps {
  initialMessages?: HealthcareMessage[];
}

// Filter types
export type MessageFilterType = 'all' | 'unread' | 'starred' | 'archived' | 'emergency' | 'medical';

export type BulkActionType = 'read' | 'unread' | 'archive' | 'delete' | 'star';
