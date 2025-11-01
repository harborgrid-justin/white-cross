/**
 * Messaging API Types
 */

export interface MessageDto {
  id: string;
  _tempId?: string; // Temporary ID for optimistic updates before server response
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    encrypted?: boolean;
  };
  replyTo?: string;
  createdAt: string;
  updatedAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface CreateMessageDto {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  replyTo?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
  };
}

export interface UpdateMessageDto {
  content?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ConversationDto {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  }>;
  lastMessage?: MessageDto;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  metadata?: {
    description?: string;
    avatar?: string;
    encryptionEnabled?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participantIds: string[];
  metadata?: {
    description?: string;
    avatar?: string;
    encryptionEnabled?: boolean;
  };
}

export interface UpdateConversationDto {
  name?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  metadata?: {
    description?: string;
    avatar?: string;
  };
}

export interface MessageSearchParams {
  query: string;
  conversationId?: string;
  senderId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface EncryptionKeyDto {
  conversationId: string;
  publicKey: string;
  keyId: string;
  algorithm: string;
}

export interface ConversationFilters {
  type?: 'direct' | 'group' | 'channel';
  search?: string;
  showArchived?: boolean;
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  total: number;
  byConversation: Array<{
    conversationId: string;
    count: number;
  }>;
}
