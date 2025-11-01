/**
 * useSendMessage Hook
 *
 * React Query mutation hook for sending messages with optimistic updates
 * Handles message sending, rollback on error, and cache updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '@/services/messaging';
import { useMessageStore, useConversationStore } from '@/stores/messaging';
import { messageKeys } from './useMessages';
import { conversationKeys } from './useConversations';
import type { CreateMessageDto, MessageDto } from '@/services/messaging';
import { nanoid } from 'nanoid';

interface SendMessageVariables extends CreateMessageDto {
  optimistic?: boolean;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const addOptimisticMessage = useMessageStore((state) => state.addOptimisticMessage);
  const confirmOptimisticMessage = useMessageStore((state) => state.confirmOptimisticMessage);
  const rollbackOptimisticMessage = useMessageStore((state) => state.rollbackOptimisticMessage);
  const updateLastMessage = useConversationStore((state) => state.updateLastMessage);

  const mutation = useMutation({
    mutationFn: async (variables: SendMessageVariables) => {
      return await messageApi.create(variables);
    },

    onMutate: async (variables) => {
      const { conversationId, optimistic = true } = variables;

      if (!optimistic) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: messageKeys.list(conversationId),
      });

      // Create temporary message
      const tempId = `temp-${nanoid()}`;
      const optimisticMessage: MessageDto = {
        id: tempId,
        _tempId: tempId,
        _optimistic: true,
        conversationId: variables.conversationId,
        senderId: 'current-user', // Should be replaced with actual current user ID
        content: variables.content,
        type: variables.type || 'text',
        status: 'sending',
        metadata: variables.metadata,
        replyTo: variables.replyTo,
        createdAt: new Date().toISOString(),
      };

      // Add to Zustand store
      addOptimisticMessage(optimisticMessage);

      // Add to React Query cache
      queryClient.setQueryData(
        messageKeys.list(conversationId),
        (old: any) => {
          if (!old) return old;

          const firstPage = old.pages[0];
          if (!firstPage) return old;

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                messages: [...firstPage.messages, optimisticMessage],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      // Update last message in conversation cache
      updateLastMessage(conversationId, optimisticMessage);

      return { tempId, optimisticMessage };
    },

    onSuccess: (confirmedMessage, variables, context) => {
      const { conversationId } = variables;

      if (context?.tempId) {
        // Replace optimistic message with confirmed one
        confirmOptimisticMessage(context.tempId, confirmedMessage);

        // Update React Query cache
        queryClient.setQueryData(
          messageKeys.list(conversationId),
          (old: any) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                messages: page.messages.map((msg: MessageDto) =>
                  msg._tempId === context.tempId ? confirmedMessage : msg
                ),
              })),
            };
          }
        );
      }

      // Update last message in conversation
      updateLastMessage(conversationId, confirmedMessage);

      // Invalidate conversation cache to update unread counts
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },

    onError: (error, variables, context) => {
      if (context?.tempId) {
        // Rollback optimistic message
        rollbackOptimisticMessage(context.tempId);

        // Remove from React Query cache
        queryClient.setQueryData(
          messageKeys.list(variables.conversationId),
          (old: any) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                messages: page.messages.filter(
                  (msg: MessageDto) => msg._tempId !== context.tempId
                ),
              })),
            };
          }
        );
      }

      // Optionally refetch to sync state
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(variables.conversationId),
      });
    },
  });

  return mutation;
}

/**
 * Hook for marking messages as read
 */
export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      return await messageApi.markAsRead(messageId);
    },
    onSuccess: (data, messageId) => {
      // Update message in cache
      queryClient.setQueriesData(
        { queryKey: messageKeys.lists() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              messages: page.messages.map((msg: MessageDto) =>
                msg.id === messageId
                  ? { ...msg, status: 'read', readAt: new Date().toISOString() }
                  : msg
              ),
            })),
          };
        }
      );
    },
  });
}

/**
 * Hook for deleting messages
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const deleteMessage = useMessageStore((state) => state.deleteMessage);

  return useMutation({
    mutationFn: async ({
      messageId,
      forEveryone = false,
    }: {
      messageId: string;
      forEveryone?: boolean;
    }) => {
      if (forEveryone) {
        return await messageApi.deleteForEveryone(messageId);
      } else {
        return await messageApi.deleteForMe(messageId);
      }
    },
    onSuccess: (data, { messageId }) => {
      // Remove from Zustand store
      deleteMessage(messageId);

      // Remove from React Query cache
      queryClient.setQueriesData(
        { queryKey: messageKeys.lists() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              messages: page.messages.filter((msg: MessageDto) => msg.id !== messageId),
            })),
          };
        }
      );
    },
  });
}
