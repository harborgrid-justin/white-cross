/**
 * Socket.io Messaging Service
 *
 * Export all socket service components
 *
 * @module services/socket
 */

// Main service
export { socketService, SocketService } from './socket.service';

// Configuration
export { socketConfig, getSocketConfig } from './socket.config';
export type { SocketConfig } from './socket.config';

// Types
export {
  ConnectionState,
  SocketEvent
} from './socket.types';

export type {
  Message,
  MessageReceivedPayload,
  MessageDeliveredPayload,
  MessageReadPayload,
  TypingPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  ConnectionConfirmedPayload,
  ConnectionErrorPayload,
  PingPayload,
  PongPayload,
  SendMessagePayload,
  EventHandler,
  StateChangeListener,
  QueuedMessage,
  SocketError,
  ConnectionMetrics,
  SocketEventPayloadMap,
  SocketEventHandlers
} from './socket.types';

// Managers
export { SocketEventManager } from './socket-events';
export { SocketConnectionManager } from './socket-manager';
export { SocketMessageQueue } from './socket-queue';

// Default export
export default socketService;
