/**
 * Conversation Store
 *
 * Zustand store for conversation list management and current conversation state
 * Handles conversation filtering, sorting, and unread count tracking
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Conversation, ConversationFilter } from './types';

interface ConversationState {
  // Conversation data
  conversations: Conversation[];
  currentConversationId: string | null;

  // Filter and sort state
  filter: ConversationFilter;
  sortBy: 'recent' | 'unread' | 'name';

  // Loading and error state
  isLoading: boolean;
  error: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;

  // Current conversation
  setCurrentConversation: (id: string | null) => void;
  getCurrentConversation: () => Conversation | undefined;

  // Unread management
  incrementUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
  getTotalUnread: () => number;

  // Conversation actions
  pinConversation: (id: string) => void;
  unpinConversation: (id: string) => void;
  muteConversation: (id: string) => void;
  unmuteConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  unarchiveConversation: (id: string) => void;

  // Last message update
  updateLastMessage: (conversationId: string, message: any) => void;

  // Filter and sort
  setFilter: (filter: ConversationFilter) => void;
  setSortBy: (sortBy: 'recent' | 'unread' | 'name') => void;
  getFilteredConversations: () => Conversation[];

  // Loading and error
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilities
  findConversation: (id: string) => Conversation | undefined;
  clearAll: () => void;
}

export const useConversationStore = create<ConversationState>()(
  devtools(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      filter: {},
      sortBy: 'recent',
      isLoading: false,
      error: null,

      setConversations: (conversations) =>
        set({ conversations }),

      addConversation: (conversation) =>
        set((state) => {
          // Prevent duplicates
          if (state.conversations.some((c) => c.id === conversation.id)) {
            return state;
          }
          return { conversations: [...state.conversations, conversation] };
        }),

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),

      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        })),

      setCurrentConversation: (id) =>
        set({ currentConversationId: id }),

      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.currentConversationId);
      },

      incrementUnread: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c
          ),
        })),

      clearUnread: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
        })),

      getTotalUnread: () => {
        const state = get();
        return state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      },

      pinConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isPinned: true } : c
          ),
        })),

      unpinConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isPinned: false } : c
          ),
        })),

      muteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isMuted: true } : c
          ),
        })),

      unmuteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isMuted: false } : c
          ),
        })),

      archiveConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isArchived: true } : c
          ),
        })),

      unarchiveConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, isArchived: false } : c
          ),
        })),

      updateLastMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
              : c
          ),
        })),

      setFilter: (filter) =>
        set({ filter }),

      setSortBy: (sortBy) =>
        set({ sortBy }),

      getFilteredConversations: () => {
        const state = get();
        let filtered = [...state.conversations];

        // Apply filters
        const { query, type, showArchived, showMuted } = state.filter;

        if (!showArchived) {
          filtered = filtered.filter((c) => !c.isArchived);
        }

        if (!showMuted) {
          filtered = filtered.filter((c) => !c.isMuted);
        }

        if (type) {
          filtered = filtered.filter((c) => c.type === type);
        }

        if (query && query.trim()) {
          const lowerQuery = query.toLowerCase();
          filtered = filtered.filter((c) => {
            const name = c.name?.toLowerCase() || '';
            const participantNames = c.participants
              .map((p) => p.name.toLowerCase())
              .join(' ');
            return name.includes(lowerQuery) || participantNames.includes(lowerQuery);
          });
        }

        // Apply sorting
        filtered.sort((a, b) => {
          // Pinned conversations always come first
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;

          switch (state.sortBy) {
            case 'recent':
              return (
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              );
            case 'unread':
              if (b.unreadCount !== a.unreadCount) {
                return b.unreadCount - a.unreadCount;
              }
              return (
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              );
            case 'name':
              const aName = a.name || a.participants[0]?.name || '';
              const bName = b.name || b.participants[0]?.name || '';
              return aName.localeCompare(bName);
            default:
              return 0;
          }
        });

        return filtered;
      },

      setLoading: (isLoading) =>
        set({ isLoading }),

      setError: (error) =>
        set({ error }),

      findConversation: (id) => {
        return get().conversations.find((c) => c.id === id);
      },

      clearAll: () =>
        set({
          conversations: [],
          currentConversationId: null,
          filter: {},
          error: null,
        }),
    }),
    { name: 'ConversationStore' }
  )
);
