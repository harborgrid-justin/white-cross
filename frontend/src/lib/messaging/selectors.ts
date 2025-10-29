/**
 * Messaging Selectors
 *
 * Memoized selectors and computed values for efficient data access
 * Provides utilities for filtering, sorting, and deriving state
 */

import {
  useMessageStore,
  useConversationStore,
  useTypingStore,
  usePresenceStore,
} from '@/stores/messaging';
import type { Message, Conversation, User } from '@/stores/messaging';

/**
 * Message Selectors
 */

export const useMessageSelectors = () => {
  const store = useMessageStore();

  return {
    /**
     * Get messages for a conversation
     */
    getMessages: (conversationId: string) => {
      return store.getMessages(conversationId);
    },

    /**
     * Get message by ID
     */
    getMessage: (messageId: string) => {
      return store.getMessage(messageId);
    },

    /**
     * Get draft for conversation
     */
    getDraft: (conversationId: string) => {
      return store.getDraft(conversationId);
    },

    /**
     * Check if conversation has draft
     */
    hasDraft: (conversationId: string) => {
      return !!store.getDraft(conversationId);
    },

    /**
     * Get loading state for conversation
     */
    isLoading: (conversationId: string) => {
      return store.isLoadingMessages[conversationId] || false;
    },

    /**
     * Get messages with status filter
     */
    getMessagesByStatus: (conversationId: string, status: Message['status']) => {
      const messages = store.getMessages(conversationId);
      return messages.filter((msg) => msg.status === status);
    },

    /**
     * Get unread messages for conversation
     */
    getUnreadMessages: (conversationId: string, currentUserId: string) => {
      const messages = store.getMessages(conversationId);
      return messages.filter(
        (msg) => msg.senderId !== currentUserId && msg.status !== 'read'
      );
    },

    /**
     * Get last message for conversation
     */
    getLastMessage: (conversationId: string) => {
      const messages = store.getMessages(conversationId);
      return messages[messages.length - 1];
    },
  };
};

/**
 * Conversation Selectors
 */

export const useConversationSelectors = () => {
  const store = useConversationStore();

  return {
    /**
     * Get current conversation
     */
    getCurrentConversation: () => {
      return store.getCurrentConversation();
    },

    /**
     * Find conversation by ID
     */
    findConversation: (id: string) => {
      return store.findConversation(id);
    },

    /**
     * Get filtered and sorted conversations
     */
    getFilteredConversations: () => {
      return store.getFilteredConversations();
    },

    /**
     * Get total unread count
     */
    getTotalUnread: () => {
      return store.getTotalUnread();
    },

    /**
     * Get pinned conversations
     */
    getPinnedConversations: () => {
      return store.conversations.filter((c) => c.isPinned && !c.isArchived);
    },

    /**
     * Get unread conversations
     */
    getUnreadConversations: () => {
      return store.conversations.filter((c) => c.unreadCount > 0 && !c.isArchived);
    },

    /**
     * Get archived conversations
     */
    getArchivedConversations: () => {
      return store.conversations.filter((c) => c.isArchived);
    },

    /**
     * Get direct conversations
     */
    getDirectConversations: () => {
      return store.conversations.filter((c) => c.type === 'direct' && !c.isArchived);
    },

    /**
     * Get group conversations
     */
    getGroupConversations: () => {
      return store.conversations.filter((c) => c.type === 'group' && !c.isArchived);
    },

    /**
     * Find conversation with user
     */
    findDirectConversationWithUser: (userId: string) => {
      return store.conversations.find(
        (c) =>
          c.type === 'direct' &&
          c.participants.some((p) => p.id === userId)
      );
    },

    /**
     * Get conversation display name
     */
    getConversationDisplayName: (conversation: Conversation, currentUserId: string) => {
      if (conversation.name) return conversation.name;

      if (conversation.type === 'direct') {
        const otherUser = conversation.participants.find((p) => p.id !== currentUserId);
        return otherUser?.name || 'Unknown User';
      }

      return conversation.participants.map((p) => p.name).join(', ');
    },
  };
};

/**
 * Typing Selectors
 */

export const useTypingSelectors = () => {
  const store = useTypingStore();

  return {
    /**
     * Get typing users for conversation
     */
    getTypingUsers: (conversationId: string) => {
      return store.getTypingUsers(conversationId);
    },

    /**
     * Check if user is typing
     */
    isUserTyping: (conversationId: string, userId: string) => {
      return store.isUserTyping(conversationId, userId);
    },

    /**
     * Get typing indicator text
     */
    getTypingText: (conversationId: string, currentUserId: string) => {
      return store.getTypingText(conversationId, currentUserId);
    },

    /**
     * Check if anyone is typing
     */
    isAnyoneTyping: (conversationId: string, currentUserId: string) => {
      const users = store.getTypingUsers(conversationId);
      return users.some((u) => u.userId !== currentUserId);
    },
  };
};

/**
 * Presence Selectors
 */

export const usePresenceSelectors = () => {
  const store = usePresenceStore();

  return {
    /**
     * Get user presence
     */
    getPresence: (userId: string) => {
      return store.getPresence(userId);
    },

    /**
     * Check if user is online
     */
    isOnline: (userId: string) => {
      return store.isOnline(userId);
    },

    /**
     * Get online users
     */
    getOnlineUsers: () => {
      return store.getOnlineUsers();
    },

    /**
     * Get offline users
     */
    getOfflineUsers: () => {
      return store.getOfflineUsers();
    },

    /**
     * Get online participants in conversation
     */
    getOnlineParticipants: (participants: User[]) => {
      return participants.filter((p) => store.isOnline(p.id));
    },

    /**
     * Get user status display
     */
    getUserStatusDisplay: (userId: string) => {
      const presence = store.getPresence(userId);
      if (!presence) return 'Unknown';

      if (presence.customStatus) return presence.customStatus;

      switch (presence.status) {
        case 'online':
          return 'Online';
        case 'away':
          return 'Away';
        case 'busy':
          return 'Busy';
        case 'offline':
          return presence.lastSeen
            ? `Last seen ${new Date(presence.lastSeen).toLocaleString()}`
            : 'Offline';
        default:
          return 'Unknown';
      }
    },
  };
};

/**
 * Combined selectors for complex queries
 */

export const useCombinedSelectors = () => {
  const messageSelectors = useMessageSelectors();
  const conversationSelectors = useConversationSelectors();
  const typingSelectors = useTypingSelectors();
  const presenceSelectors = usePresenceSelectors();

  return {
    /**
     * Get conversation with enriched data
     */
    getEnrichedConversation: (conversationId: string, currentUserId: string) => {
      const conversation = conversationSelectors.findConversation(conversationId);
      if (!conversation) return null;

      return {
        ...conversation,
        displayName: conversationSelectors.getConversationDisplayName(conversation, currentUserId),
        onlineParticipants: presenceSelectors.getOnlineParticipants(conversation.participants),
        typingUsers: typingSelectors.getTypingUsers(conversationId),
        isAnyoneTyping: typingSelectors.isAnyoneTyping(conversationId, currentUserId),
        typingText: typingSelectors.getTypingText(conversationId, currentUserId),
        lastMessage: messageSelectors.getLastMessage(conversationId),
        hasDraft: messageSelectors.hasDraft(conversationId),
      };
    },

    /**
     * Get conversation summary list
     */
    getConversationSummaries: (currentUserId: string) => {
      const conversations = conversationSelectors.getFilteredConversations();

      return conversations.map((conversation) => ({
        id: conversation.id,
        displayName: conversationSelectors.getConversationDisplayName(conversation, currentUserId),
        lastMessage: messageSelectors.getLastMessage(conversation.id),
        unreadCount: conversation.unreadCount,
        isPinned: conversation.isPinned,
        isMuted: conversation.isMuted,
        isOnline: conversation.type === 'direct'
          ? presenceSelectors.isOnline(
              conversation.participants.find((p) => p.id !== currentUserId)?.id || ''
            )
          : false,
        typingText: typingSelectors.getTypingText(conversation.id, currentUserId),
        updatedAt: conversation.updatedAt,
      }));
    },
  };
};
