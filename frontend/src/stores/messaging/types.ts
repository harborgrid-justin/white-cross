/**
 * Messaging State Types
 *
 * Shared type definitions for messaging state management
 */

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Message {
  id: string;
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
  // Optimistic update tracking
  _optimistic?: boolean;
  _tempId?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participants: User[];
  lastMessage?: Message;
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

export interface Draft {
  conversationId: string;
  content: string;
  replyTo?: string;
  updatedAt: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  customStatus?: string;
}

export interface MessageDeliveryConfirmation {
  messageId: string;
  conversationId: string;
  status: 'delivered' | 'read';
  userId: string;
  timestamp: string;
}

export interface ConversationFilter {
  query?: string;
  type?: Conversation['type'];
  showArchived?: boolean;
  showMuted?: boolean;
}
