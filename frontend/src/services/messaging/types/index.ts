/**
 * @fileoverview Messaging Type Definitions - Barrel Export
 * @module services/messaging/types
 * @category Services
 *
 * Centralized exports for all messaging-related type definitions.
 * Provides a single import point for message, conversation, and encryption types.
 *
 * @example
 * ```typescript
 * // Import all types from a single location
 * import type {
 *   MessageDto,
 *   ConversationDto,
 *   EncryptionKeyDto
 * } from '@/services/messaging/types';
 * ```
 */

// Message types
export type {
  MessageDto,
  CreateMessageDto,
  UpdateMessageDto,
  MessageSearchParams,
} from './message.types';

// Conversation types
export type {
  ConversationDto,
  CreateConversationDto,
  UpdateConversationDto,
  ConversationFilters,
  UnreadCountResponse,
} from './conversation.types';

// Encryption types
export type { EncryptionKeyDto } from './encryption.types';
