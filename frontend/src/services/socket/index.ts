/**
 * Socket.io Service Module
 *
 * Export all socket service components including:
 * - Core service class and singleton
 * - React Context and Provider
 * - React hooks for socket integration
 * - Configuration and types
 *
 * @module services/socket
 */

// ==========================================
// CORE SERVICE
// ==========================================

export { SocketServiceBase } from './SocketServiceBase';
export { SocketService, socketService } from './SocketService';

// ==========================================
// REACT INTEGRATION
// ==========================================

// Context and Provider
export { SocketProvider, useSocket } from './SocketReactContext';

// React Hooks
export {
  useSocketEvent,
  useMessageListener,
  useNotificationListener,
  useTypingIndicator,
  useTypingListener,
  useEmergencyAlerts,
  useHealthNotifications,
  useStudentHealthAlerts,
  useMedicationReminders
} from './SocketReactHooks';

// ==========================================
// CONFIGURATION
// ==========================================

export { socketConfig, getSocketConfig } from './socket.config';
export type { SocketConfig } from './socket.config';

// ==========================================
// TYPES AND ENUMS
// ==========================================

export {
  ConnectionState,
  WebSocketEvent
} from './types';

export type {
  Message,
  Notification,
  TypingIndicator,
  ReadReceipt,
  SendMessagePayload,
  ConnectionMetrics,
  EventHandler,
  StateChangeListener,
  SocketContextValue,
  SocketProviderProps,
  ConnectionEvent
} from './types';

// ==========================================
// MODULAR MANAGERS
// ==========================================

export { EventManager } from './EventManager';
export { ConnectionManager } from './ConnectionManager';
export { MessageQueue } from './MessageQueue';

// ==========================================
// LEGACY EXPORTS (from socket.types)
// ==========================================

// Re-export socket.types for backward compatibility
export type {
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
  QueuedMessage,
  SocketError,
  SocketEventPayloadMap,
  SocketEventHandlers
} from './socket.types';

export { SocketEvent } from './socket.types';

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default socketService;
