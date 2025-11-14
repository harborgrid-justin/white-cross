/**
 * @fileoverview Conversation Service Return Types
 * @module communication/types/conversation
 */

import { Conversation } from '@/database/models';
import { ConversationParticipant } from '@/database/models';

/**
 * Result of conversation creation
 */
export interface CreateConversationResult {
  conversation: ReturnType<Conversation['toJSON']>;
  participants: Array<ReturnType<ConversationParticipant['toJSON']>>;
}

/**
 * Result of getting conversation details
 */
export interface GetConversationResult extends ReturnType<Conversation['toJSON']> {
  unreadCount: number;
}

/**
 * Result of listing conversations
 */
export interface ListConversationsResult {
  conversations: Array<
    ReturnType<Conversation['toJSON']> & {
      userSettings: {
        isMuted: boolean;
        isPinned: boolean;
        lastReadAt?: Date;
      };
      unreadCount: number;
    }
  >;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Result of conversation update
 */
export interface UpdateConversationResult {
  conversation: ReturnType<Conversation['toJSON']>;
}

/**
 * Result of adding participant
 */
export interface AddParticipantResult {
  participant: ReturnType<ConversationParticipant['toJSON']>;
}

/**
 * Result of updating participant settings
 */
export interface UpdateParticipantResult {
  participant: ReturnType<ConversationParticipant['toJSON']>;
}

/**
 * Result of getting participants
 */
export interface GetParticipantsResult {
  participants: Array<ReturnType<ConversationParticipant['toJSON']>>;
  total: number;
}
