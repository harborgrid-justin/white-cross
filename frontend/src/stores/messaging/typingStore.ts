/**
 * Typing Store
 *
 * Zustand store for managing typing indicators
 * Automatically cleans up stale typing indicators after timeout
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TypingIndicator } from './types';

interface TypingState {
  // Typing indicators by conversation ID
  typingByConversation: Record<string, TypingIndicator[]>;

  // Timeout for clearing stale indicators (5 seconds)
  typingTimeout: number;

  // Actions
  addTypingIndicator: (indicator: TypingIndicator) => void;
  removeTypingIndicator: (conversationId: string, userId: string) => void;
  clearTypingIndicators: (conversationId: string) => void;
  cleanupStaleIndicators: () => void;

  // Getters
  getTypingUsers: (conversationId: string) => TypingIndicator[];
  isUserTyping: (conversationId: string, userId: string) => boolean;
  getTypingText: (conversationId: string, currentUserId: string) => string;
}

const TYPING_TIMEOUT = 5000; // 5 seconds

export const useTypingStore = create<TypingState>()(
  devtools(
    (set, get) => ({
      typingByConversation: {},
      typingTimeout: TYPING_TIMEOUT,

      addTypingIndicator: (indicator) =>
        set((state) => {
          const existing = state.typingByConversation[indicator.conversationId] || [];

          // Update if exists, add if new
          const index = existing.findIndex((t) => t.userId === indicator.userId);
          let updated: TypingIndicator[];

          if (index !== -1) {
            updated = [
              ...existing.slice(0, index),
              indicator,
              ...existing.slice(index + 1),
            ];
          } else {
            updated = [...existing, indicator];
          }

          return {
            typingByConversation: {
              ...state.typingByConversation,
              [indicator.conversationId]: updated,
            },
          };
        }),

      removeTypingIndicator: (conversationId, userId) =>
        set((state) => {
          const existing = state.typingByConversation[conversationId] || [];
          const filtered = existing.filter((t) => t.userId !== userId);

          if (filtered.length === 0) {
            const { [conversationId]: removed, ...remaining } = state.typingByConversation;
            return { typingByConversation: remaining };
          }

          return {
            typingByConversation: {
              ...state.typingByConversation,
              [conversationId]: filtered,
            },
          };
        }),

      clearTypingIndicators: (conversationId) =>
        set((state) => {
          const { [conversationId]: removed, ...remaining } = state.typingByConversation;
          return { typingByConversation: remaining };
        }),

      cleanupStaleIndicators: () =>
        set((state) => {
          const now = Date.now();
          const newTypingByConversation: Record<string, TypingIndicator[]> = {};

          Object.entries(state.typingByConversation).forEach(([conversationId, indicators]) => {
            const active = indicators.filter(
              (indicator) => now - indicator.timestamp < TYPING_TIMEOUT
            );

            if (active.length > 0) {
              newTypingByConversation[conversationId] = active;
            }
          });

          return { typingByConversation: newTypingByConversation };
        }),

      getTypingUsers: (conversationId) => {
        return get().typingByConversation[conversationId] || [];
      },

      isUserTyping: (conversationId, userId) => {
        const indicators = get().typingByConversation[conversationId] || [];
        return indicators.some((t) => t.userId === userId);
      },

      getTypingText: (conversationId, currentUserId) => {
        const indicators = (get().typingByConversation[conversationId] || []).filter(
          (t) => t.userId !== currentUserId
        );

        if (indicators.length === 0) return '';
        if (indicators.length === 1) return `${indicators[0].userName} is typing...`;
        if (indicators.length === 2) {
          return `${indicators[0].userName} and ${indicators[1].userName} are typing...`;
        }
        return `${indicators[0].userName} and ${indicators.length - 1} others are typing...`;
      },
    }),
    { name: 'TypingStore' }
  )
);

// Cleanup stale indicators every 2 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    useTypingStore.getState().cleanupStaleIndicators();
  }, 2000);
}
