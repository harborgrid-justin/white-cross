/**
 * Message Store
 *
 * Zustand store for message cache, drafts, and UI state
 * Provides local state management for messages with optimistic updates
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Message, Draft, MessageDeliveryConfirmation } from './types';

interface MessageState {
  // Message cache by conversation ID
  messagesByConversation: Record<string, Message[]>;

  // Drafts by conversation ID
  drafts: Record<string, Draft>;

  // Currently selected message for reply/edit
  selectedMessage: Message | null;

  // UI state
  isLoadingMessages: Record<string, boolean>;

  // Optimistic message tracking
  optimisticMessages: Record<string, Message>;

  // Actions
  addMessage: (conversationId: string, message: Message) => void;
  addMessages: (conversationId: string, messages: Message[]) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;

  // Optimistic updates
  addOptimisticMessage: (message: Message) => void;
  confirmOptimisticMessage: (tempId: string, confirmedMessage: Message) => void;
  rollbackOptimisticMessage: (tempId: string) => void;

  // Delivery confirmations
  handleDeliveryConfirmation: (confirmation: MessageDeliveryConfirmation) => void;

  // Draft management
  saveDraft: (conversationId: string, content: string, replyTo?: string) => void;
  getDraft: (conversationId: string) => Draft | undefined;
  clearDraft: (conversationId: string) => void;

  // Message selection
  selectMessage: (message: Message | null) => void;

  // Loading state
  setLoadingMessages: (conversationId: string, isLoading: boolean) => void;

  // Cache management
  clearConversationMessages: (conversationId: string) => void;
  clearAllMessages: () => void;

  // Getters
  getMessages: (conversationId: string) => Message[];
  getMessage: (messageId: string) => Message | undefined;
}

export const useMessageStore = create<MessageState>()(
  devtools(
    persist(
      (set, get) => ({
        messagesByConversation: {},
        drafts: {},
        selectedMessage: null,
        isLoadingMessages: {},
        optimisticMessages: {},

        addMessage: (conversationId, message) =>
          set((state) => {
            const existing = state.messagesByConversation[conversationId] || [];

            // Prevent duplicates
            if (existing.some((m) => m.id === message.id)) {
              return state;
            }

            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: [...existing, message].sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ),
              },
            };
          }),

        addMessages: (conversationId, messages) =>
          set((state) => {
            const existing = state.messagesByConversation[conversationId] || [];
            const existingIds = new Set(existing.map((m) => m.id));

            // Filter out duplicates and merge
            const newMessages = messages.filter((m) => !existingIds.has(m.id));
            const merged = [...existing, ...newMessages].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            return {
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: merged,
              },
            };
          }),

        updateMessage: (messageId, updates) =>
          set((state) => {
            const newMessagesByConversation = { ...state.messagesByConversation };
            let updated = false;

            // Find and update the message
            Object.keys(newMessagesByConversation).forEach((conversationId) => {
              const messages = newMessagesByConversation[conversationId];
              const index = messages.findIndex((m) => m.id === messageId);

              if (index !== -1) {
                newMessagesByConversation[conversationId] = [
                  ...messages.slice(0, index),
                  { ...messages[index], ...updates },
                  ...messages.slice(index + 1),
                ];
                updated = true;
              }
            });

            return updated ? { messagesByConversation: newMessagesByConversation } : state;
          }),

        deleteMessage: (messageId) =>
          set((state) => {
            const newMessagesByConversation = { ...state.messagesByConversation };

            Object.keys(newMessagesByConversation).forEach((conversationId) => {
              newMessagesByConversation[conversationId] = newMessagesByConversation[
                conversationId
              ].filter((m) => m.id !== messageId);
            });

            return { messagesByConversation: newMessagesByConversation };
          }),

        addOptimisticMessage: (message) =>
          set((state) => {
            const tempId = message._tempId!;
            const conversationId = message.conversationId;
            const existing = state.messagesByConversation[conversationId] || [];

            return {
              optimisticMessages: {
                ...state.optimisticMessages,
                [tempId]: message,
              },
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: [...existing, message],
              },
            };
          }),

        confirmOptimisticMessage: (tempId, confirmedMessage) =>
          set((state) => {
            const optimistic = state.optimisticMessages[tempId];
            if (!optimistic) return state;

            const conversationId = optimistic.conversationId;
            const messages = state.messagesByConversation[conversationId] || [];

            // Replace optimistic message with confirmed one
            const updated = messages.map((m) =>
              m._tempId === tempId ? confirmedMessage : m
            );

            const { [tempId]: removed, ...remainingOptimistic } = state.optimisticMessages;

            return {
              optimisticMessages: remainingOptimistic,
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: updated,
              },
            };
          }),

        rollbackOptimisticMessage: (tempId) =>
          set((state) => {
            const optimistic = state.optimisticMessages[tempId];
            if (!optimistic) return state;

            const conversationId = optimistic.conversationId;
            const messages = state.messagesByConversation[conversationId] || [];

            // Remove the optimistic message
            const filtered = messages.filter((m) => m._tempId !== tempId);

            const { [tempId]: removed, ...remainingOptimistic } = state.optimisticMessages;

            return {
              optimisticMessages: remainingOptimistic,
              messagesByConversation: {
                ...state.messagesByConversation,
                [conversationId]: filtered,
              },
            };
          }),

        handleDeliveryConfirmation: (confirmation) =>
          set((state) => {
            const updates: Partial<Message> = {
              status: confirmation.status,
            };

            if (confirmation.status === 'delivered') {
              updates.deliveredAt = confirmation.timestamp;
            } else if (confirmation.status === 'read') {
              updates.readAt = confirmation.timestamp;
            }

            return get().updateMessage(confirmation.messageId, updates), state;
          }),

        saveDraft: (conversationId, content, replyTo) =>
          set((state) => ({
            drafts: {
              ...state.drafts,
              [conversationId]: {
                conversationId,
                content,
                replyTo,
                updatedAt: new Date().toISOString(),
              },
            },
          })),

        getDraft: (conversationId) => {
          return get().drafts[conversationId];
        },

        clearDraft: (conversationId) =>
          set((state) => {
            const { [conversationId]: removed, ...remainingDrafts } = state.drafts;
            return { drafts: remainingDrafts };
          }),

        selectMessage: (message) =>
          set({ selectedMessage: message }),

        setLoadingMessages: (conversationId, isLoading) =>
          set((state) => ({
            isLoadingMessages: {
              ...state.isLoadingMessages,
              [conversationId]: isLoading,
            },
          })),

        clearConversationMessages: (conversationId) =>
          set((state) => {
            const { [conversationId]: removed, ...remaining } = state.messagesByConversation;
            return { messagesByConversation: remaining };
          }),

        clearAllMessages: () =>
          set({
            messagesByConversation: {},
            optimisticMessages: {},
            selectedMessage: null,
          }),

        getMessages: (conversationId) => {
          return get().messagesByConversation[conversationId] || [];
        },

        getMessage: (messageId) => {
          const state = get();
          for (const messages of Object.values(state.messagesByConversation)) {
            const message = messages.find((m) => m.id === messageId);
            if (message) return message;
          }
          return undefined;
        },
      }),
      {
        name: 'message-store',
        partialize: (state) => ({
          drafts: state.drafts, // Only persist drafts
        }),
      }
    ),
    { name: 'MessageStore' }
  )
);
