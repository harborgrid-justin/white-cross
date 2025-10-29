/**
 * Socket.io React Hooks
 *
 * Export all socket-related React hooks
 *
 * @module hooks/socket
 */

// Hooks
export { useSocket } from './useSocket';
export type { UseSocketOptions, UseSocketReturn } from './useSocket';

export { useSocketEvent } from './useSocketEvent';

export { useSocketConnection } from './useSocketConnection';
export type { UseSocketConnectionReturn } from './useSocketConnection';

// Re-export types for convenience
export {
  ConnectionState,
  SocketEvent
} from '@/services/socket/socket.types';

export type {
  Message,
  MessageReceivedPayload,
  MessageDeliveredPayload,
  MessageReadPayload,
  TypingPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  SendMessagePayload,
  ConnectionMetrics
} from '@/services/socket/socket.types';
