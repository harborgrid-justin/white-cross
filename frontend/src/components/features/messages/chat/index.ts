/**
 * Chat Components - Index Exports
 *
 * Central export point for all real-time messaging/chat components.
 * Organized by atomic design hierarchy: atoms, molecules, organisms, modals.
 *
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 * Last Updated: 2025-10-29
 */

// =============================================================================
// ATOMS - Basic building blocks
// =============================================================================

export { MessageTimestamp } from './atoms/MessageTimestamp';
export type { MessageTimestampProps } from './atoms/MessageTimestamp';

export { MessageStatus } from './atoms/MessageStatus';
export type { MessageStatusProps, MessageStatusType } from './atoms/MessageStatus';

export { EncryptionBadge } from './atoms/EncryptionBadge';
export type { EncryptionBadgeProps, EncryptionStatusType } from './atoms/EncryptionBadge';

export { TypingIndicator } from './atoms/TypingIndicator';
export type { TypingIndicatorProps } from './atoms/TypingIndicator';

// =============================================================================
// MOLECULES - Composite components
// =============================================================================

export { MessageItem } from './molecules/MessageItem';
export type {
  MessageItemProps,
  MessageAttachment,
  MessageReaction,
} from './molecules/MessageItem';

export { ConversationItem } from './molecules/ConversationItem';
export type { ConversationItemProps } from './molecules/ConversationItem';

export { ConversationHeader } from './molecules/ConversationHeader';
export type {
  ConversationHeaderProps,
  Participant,
} from './molecules/ConversationHeader';

// =============================================================================
// ORGANISMS - Complex components
// =============================================================================

export { ConversationList } from './organisms/ConversationList';
export type {
  ConversationListProps,
  Conversation,
  ConversationFilter,
} from './organisms/ConversationList';

export { MessageInput } from './organisms/MessageInput';
export type {
  MessageInputProps,
  AttachmentFile,
} from './organisms/MessageInput';

export { MessagingLayout } from './organisms/MessagingLayout';
export type {
  MessagingLayoutProps,
  Message,
  ActiveConversation,
} from './organisms/MessagingLayout';

// =============================================================================
// MODALS - Dialog components
// =============================================================================

export { NewConversationModal } from './modals/NewConversationModal';
export type {
  NewConversationModalProps,
  User,
} from './modals/NewConversationModal';
