/**
 * @fileoverview Legacy compatibility layer for CommunicationThreads component
 * @deprecated This file serves as a backward compatibility layer.
 * The actual implementation has been refactored into modular components
 * under ./CommunicationThreads/ directory for better maintainability.
 * 
 * New imports should use the modular structure directly:
 * - ./CommunicationThreads/ for the main component
 * - ./CommunicationThreads/types for type definitions
 * 
 * This file will be removed in a future version.
 */

// Re-export the main component from the new modular structure
export { CommunicationThreads, default } from './CommunicationThreads/index';

// Re-export types for backward compatibility
export type {
  ThreadMessage,
  CommunicationThread,
  ThreadParticipant,
  CommunicationThreadsProps,
  ThreadListProps,
  MessageInputProps,
  ChatAreaProps,
  ThreadInfoSidebarProps,
  MessageBubbleProps,
  PriorityLevel,
  ThreadStatus,
  DeliveryStatus,
  UseThreadsState,
  UseThreadsActions,
  UseThreadsReturn
} from './CommunicationThreads/types';
