/**
 * Custom hook for managing message actions (read, star, archive, etc.)
 */

import { Dispatch, SetStateAction, useCallback } from 'react';
import { HealthcareMessage, MessageStatus, BulkActionType } from '../types/message.types';

/**
 * Hook for managing message actions
 * @param setMessages - State setter for messages
 * @returns Action handler functions
 */
export const useMessageActions = (
  setMessages: Dispatch<SetStateAction<HealthcareMessage[]>>
) => {
  /**
   * Mark a message as read
   */
  const handleMarkAsRead = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: 'read' as MessageStatus, readAt: new Date() }
        : msg
    ));
  }, [setMessages]);

  /**
   * Toggle star status on a message
   */
  const handleStarMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            status: msg.status === 'starred' ? 'read' as MessageStatus : 'starred' as MessageStatus
          }
        : msg
    ));
  }, [setMessages]);

  /**
   * Archive a message
   */
  const handleArchiveMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: 'archived' as MessageStatus }
        : msg
    ));
  }, [setMessages]);

  /**
   * Acknowledge a message that requires acknowledgment
   */
  const handleAcknowledgeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, acknowledgedAt: new Date() }
        : msg
    ));
  }, [setMessages]);

  /**
   * Perform bulk action on multiple messages
   */
  const handleBulkAction = useCallback((
    action: BulkActionType,
    selectedMessages: Set<string>
  ) => {
    const messageIds = Array.from(selectedMessages);

    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${messageIds.length} messages?`)) {
      return false;
    }

    setMessages(prev => {
      let updated = prev.map(msg => {
        if (!messageIds.includes(msg.id)) return msg;

        switch (action) {
          case 'read':
            return { ...msg, status: 'read' as MessageStatus, readAt: new Date() };
          case 'unread':
            return { ...msg, status: 'unread' as MessageStatus, readAt: undefined };
          case 'archive':
            return { ...msg, status: 'archived' as MessageStatus };
          case 'star':
            return { ...msg, status: 'starred' as MessageStatus };
          default:
            return msg;
        }
      });

      if (action === 'delete') {
        updated = updated.filter(msg => !messageIds.includes(msg.id));
      }

      return updated;
    });

    return true;
  }, [setMessages]);

  return {
    handleMarkAsRead,
    handleStarMessage,
    handleArchiveMessage,
    handleAcknowledgeMessage,
    handleBulkAction
  };
};
