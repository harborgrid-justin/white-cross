/**
 * @fileoverview WebSocket Types
 * @module infrastructure/websocket/types
 * @description Type definitions for WebSocket functionality
 */

export interface BroadcastMessageDto {
  data: Record<string, any>;
  timestamp: string;
  id?: string;
}

export interface MessageEventDto {
  messageId: string;
  senderId: string;
  conversationId: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;

  toPayload(): {
    messageId: string;
    senderId: string;
    conversationId: string;
    content: string;
    timestamp: string;
    metadata?: Record<string, any>;
  };
}

export interface MessageDeliveryDto {
  messageId: string;
  status: 'delivered' | 'failed' | 'pending';
  timestamp: string;
  recipientId?: string;

  toPayload(): {
    messageId: string;
    status: string;
    timestamp: string;
    recipientId?: string;
  };
}

export interface ReadReceiptDto {
  messageId: string;
  userId: string;
  timestamp: string;

  toPayload(): {
    messageId: string;
    userId: string;
    timestamp: string;
  };
}

export interface TypingIndicatorDto {
  userId: string;
  conversationId: string;
  isTyping: boolean;
  timestamp: string;

  toPayload(): {
    userId: string;
    conversationId: string;
    isTyping: boolean;
    timestamp: string;
  };
}

export interface AlertData {
  id?: string;
  message: string;
  severity?: string;
  timestamp?: string;
  studentId?: string;
  type?: string;
  medicationId?: string;
  [key: string]: any;
}

export interface NotificationData {
  id?: string;
  title?: string;
  message: string;
  type?: string;
  [key: string]: any;
}

export interface ReminderData {
  id?: string;
  message: string;
  dueDate?: string;
  medicationId?: string;
  studentId?: string;
  [key: string]: any;
}

export interface PresenceData {
  userId: string;
  status: 'online' | 'offline' | 'away';
  timestamp: string;
}

export interface UserPresence {
  status: string;
  lastSeen: string;
}
