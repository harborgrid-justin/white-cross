/**
 * Socket Synchronization
 *
 * Synchronizes WebSocket events with Zustand stores and React Query cache
 * Handles real-time message updates, typing indicators, and presence
 */

import { QueryClient } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import {
  useMessageStore,
  useConversationStore,
  useTypingStore,
  usePresenceStore,
} from '@/stores/messaging';
import { messageKeys } from '@/hooks/queries/useMessages';
import { conversationKeys } from '@/hooks/queries/useConversations';
import type {
  Message,
  MessageDeliveryConfirmation,
  TypingIndicator,
  UserPresence,
  Conversation,
} from '@/stores/messaging';

// Socket event types
interface SocketEvents {
  'message:new': (data: { message: Message }) => void;
  'message:updated': (data: { messageId: string; updates: Partial<Message> }) => void;
  'message:deleted': (data: { messageId: string; conversationId: string }) => void;
  'message:delivered': (data: MessageDeliveryConfirmation) => void;
  'message:read': (data: MessageDeliveryConfirmation) => void;
  'typing:start': (data: TypingIndicator) => void;
  'typing:stop': (data: { conversationId: string; userId: string }) => void;
  'presence:update': (data: UserPresence) => void;
  'presence:bulk': (data: { presences: UserPresence[] }) => void;
  'conversation:updated': (data: { conversationId: string; updates: Partial<Conversation> }) => void;
  'conversation:new': (data: { conversation: Conversation }) => void;
}

export class SocketSyncManager {
  private socket: Socket | null = null;
  private queryClient: QueryClient;
  private currentUserId: string | null = null;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Initialize socket synchronization
   */
  initialize(socket: Socket, currentUserId: string) {
    this.socket = socket;
    this.currentUserId = currentUserId;
    this.setupListeners();
  }

  /**
   * Cleanup socket listeners
   */
  cleanup() {
    if (this.socket) {
      this.socket.off('message:new');
      this.socket.off('message:updated');
      this.socket.off('message:deleted');
      this.socket.off('message:delivered');
      this.socket.off('message:read');
      this.socket.off('typing:start');
      this.socket.off('typing:stop');
      this.socket.off('presence:update');
      this.socket.off('presence:bulk');
      this.socket.off('conversation:updated');
      this.socket.off('conversation:new');
    }
    this.socket = null;
    this.currentUserId = null;
  }

  /**
   * Setup socket event listeners
   */
  private setupListeners() {
    if (!this.socket) return;

    // New message received
    this.socket.on('message:new', this.handleNewMessage.bind(this));

    // Message updated
    this.socket.on('message:updated', this.handleMessageUpdated.bind(this));

    // Message deleted
    this.socket.on('message:deleted', this.handleMessageDeleted.bind(this));

    // Message delivery confirmation
    this.socket.on('message:delivered', this.handleDeliveryConfirmation.bind(this));

    // Message read confirmation
    this.socket.on('message:read', this.handleReadConfirmation.bind(this));

    // Typing indicators
    this.socket.on('typing:start', this.handleTypingStart.bind(this));
    this.socket.on('typing:stop', this.handleTypingStop.bind(this));

    // Presence updates
    this.socket.on('presence:update', this.handlePresenceUpdate.bind(this));
    this.socket.on('presence:bulk', this.handlePresenceBulk.bind(this));

    // Conversation updates
    this.socket.on('conversation:updated', this.handleConversationUpdated.bind(this));
    this.socket.on('conversation:new', this.handleNewConversation.bind(this));
  }

  /**
   * Handle new message
   */
  private handleNewMessage(data: { message: Message }) {
    const { message } = data;
    const { conversationId } = message;

    // Add to Zustand store
    useMessageStore.getState().addMessage(conversationId, message);

    // Update React Query cache
    this.queryClient.setQueryData(
      messageKeys.list(conversationId),
      (old: any) => {
        if (!old) return old;

        const firstPage = old.pages[0];
        if (!firstPage) return old;

        // Check for duplicates
        if (firstPage.messages.some((m: Message) => m.id === message.id)) {
          return old;
        }

        return {
          ...old,
          pages: [
            {
              ...firstPage,
              messages: [...firstPage.messages, message],
            },
            ...old.pages.slice(1),
          ],
        };
      }
    );

    // Update last message in conversation
    useConversationStore.getState().updateLastMessage(conversationId, message);

    // Increment unread count if not from current user
    if (message.senderId !== this.currentUserId) {
      useConversationStore.getState().incrementUnread(conversationId);
    }

    // Invalidate unread count query
    this.queryClient.invalidateQueries({
      queryKey: conversationKeys.unreadCount(),
    });
  }

  /**
   * Handle message updated
   */
  private handleMessageUpdated(data: { messageId: string; updates: Partial<Message> }) {
    const { messageId, updates } = data;

    // Update in Zustand store
    useMessageStore.getState().updateMessage(messageId, updates);

    // Update in React Query cache
    this.queryClient.setQueriesData(
      { queryKey: messageKeys.lists() },
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          })),
        };
      }
    );
  }

  /**
   * Handle message deleted
   */
  private handleMessageDeleted(data: { messageId: string; conversationId: string }) {
    const { messageId, conversationId } = data;

    // Remove from Zustand store
    useMessageStore.getState().deleteMessage(messageId);

    // Remove from React Query cache
    this.queryClient.setQueryData(
      messageKeys.list(conversationId),
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.filter((msg: Message) => msg.id !== messageId),
          })),
        };
      }
    );
  }

  /**
   * Handle delivery confirmation
   */
  private handleDeliveryConfirmation(data: MessageDeliveryConfirmation) {
    useMessageStore.getState().handleDeliveryConfirmation(data);

    // Update in React Query cache
    this.queryClient.setQueriesData(
      { queryKey: messageKeys.lists() },
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === data.messageId
                ? { ...msg, status: 'delivered', deliveredAt: data.timestamp }
                : msg
            ),
          })),
        };
      }
    );
  }

  /**
   * Handle read confirmation
   */
  private handleReadConfirmation(data: MessageDeliveryConfirmation) {
    useMessageStore.getState().handleDeliveryConfirmation(data);

    // Update in React Query cache
    this.queryClient.setQueriesData(
      { queryKey: messageKeys.lists() },
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === data.messageId
                ? { ...msg, status: 'read', readAt: data.timestamp }
                : msg
            ),
          })),
        };
      }
    );
  }

  /**
   * Handle typing start
   */
  private handleTypingStart(data: TypingIndicator) {
    useTypingStore.getState().addTypingIndicator(data);
  }

  /**
   * Handle typing stop
   */
  private handleTypingStop(data: { conversationId: string; userId: string }) {
    useTypingStore.getState().removeTypingIndicator(data.conversationId, data.userId);
  }

  /**
   * Handle presence update
   */
  private handlePresenceUpdate(data: UserPresence) {
    usePresenceStore.getState().setPresence(data.userId, data);
  }

  /**
   * Handle bulk presence update
   */
  private handlePresenceBulk(data: { presences: UserPresence[] }) {
    usePresenceStore.getState().setMultiplePresences(data.presences);
  }

  /**
   * Handle conversation updated
   */
  private handleConversationUpdated(data: {
    conversationId: string;
    updates: Partial<Conversation>;
  }) {
    const { conversationId, updates } = data;

    // Update in Zustand store
    useConversationStore.getState().updateConversation(conversationId, updates);

    // Update in React Query cache
    this.queryClient.setQueriesData(
      { queryKey: conversationKeys.lists() },
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          conversations: old.conversations.map((c: Conversation) =>
            c.id === conversationId ? { ...c, ...updates } : c
          ),
        };
      }
    );
  }

  /**
   * Handle new conversation
   */
  private handleNewConversation(data: { conversation: Conversation }) {
    const { conversation } = data;

    // Add to Zustand store
    useConversationStore.getState().addConversation(conversation);

    // Add to React Query cache
    this.queryClient.setQueriesData(
      { queryKey: conversationKeys.lists() },
      (old: any) => {
        if (!old) return old;

        // Check for duplicates
        if (old.conversations.some((c: Conversation) => c.id === conversation.id)) {
          return old;
        }

        return {
          ...old,
          conversations: [conversation, ...old.conversations],
          total: old.total + 1,
        };
      }
    );

    // Invalidate queries to refetch
    this.queryClient.invalidateQueries({
      queryKey: conversationKeys.lists(),
    });
  }

  /**
   * Emit typing indicator
   */
  emitTyping(conversationId: string, isTyping: boolean) {
    if (!this.socket) return;

    if (isTyping) {
      this.socket.emit('typing:start', { conversationId });
    } else {
      this.socket.emit('typing:stop', { conversationId });
    }
  }

  /**
   * Update presence status
   */
  updatePresence(status: UserPresence['status'], customStatus?: string) {
    if (!this.socket) return;

    this.socket.emit('presence:update', { status, customStatus });

    // Update local store
    usePresenceStore.getState().updateCurrentUserStatus(status, customStatus);
  }

  /**
   * Join conversation room
   */
  joinConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit('conversation:join', { conversationId });
  }

  /**
   * Leave conversation room
   */
  leaveConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit('conversation:leave', { conversationId });
  }
}

// Singleton instance
let syncManager: SocketSyncManager | null = null;

export function initializeSocketSync(queryClient: QueryClient, socket: Socket, userId: string) {
  if (!syncManager) {
    syncManager = new SocketSyncManager(queryClient);
  }
  syncManager.initialize(socket, userId);
  return syncManager;
}

export function getSocketSync() {
  return syncManager;
}

export function cleanupSocketSync() {
  if (syncManager) {
    syncManager.cleanup();
  }
}
