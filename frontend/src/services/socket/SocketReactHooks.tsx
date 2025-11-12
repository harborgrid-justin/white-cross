/**
 * Socket React Hooks
 *
 * Collection of React hooks for Socket.io integration.
 * Provides convenient ways to subscribe to socket events and manage real-time features.
 *
 * @module services/socket/SocketReactHooks
 */

import { useEffect, useState, useCallback } from 'react';
import { socketService } from './SocketService';
import { useSocket } from './SocketReactContext';
import {
  WebSocketEvent,
  type Message,
  type Notification,
  type TypingIndicator,
  type EventHandler,
} from './types';

/**
 * useSocketEvent hook - Subscribe to socket events
 *
 * Generic hook for subscribing to any socket event.
 * Automatically handles cleanup on unmount.
 *
 * @param event - Event name to subscribe to
 * @param handler - Handler function to call when event is received
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useSocketEvent('custom:event', (data) => {
 *     console.log('Custom event received:', data);
 *   });
 *
 *   return <div>Listening for events...</div>;
 * }
 * ```
 */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void
): void {
  useEffect(() => {
    const wrappedHandler: EventHandler = (data: unknown) => {
      handler(data as T);
    };

    socketService.on(event, wrappedHandler);

    return () => {
      socketService.off(event, wrappedHandler);
    };
  }, [event, handler]);
}

/**
 * useMessageListener hook - Listen for new messages
 *
 * Convenient hook for subscribing to new message events.
 *
 * @param handler - Handler function to call when a new message is received
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   useMessageListener((message) => {
 *     console.log('New message:', message);
 *     // Update UI with new message
 *   });
 *
 *   return <div>Chat messages...</div>;
 * }
 * ```
 */
export function useMessageListener(handler: (message: Message) => void): void {
  const { onMessage } = useSocket();

  useEffect(() => {
    const unsubscribe = onMessage(handler);
    return unsubscribe;
  }, [onMessage, handler]);
}

/**
 * useNotificationListener hook - Listen for new notifications
 *
 * Convenient hook for subscribing to new notification events.
 *
 * @param handler - Handler function to call when a new notification is received
 *
 * @example
 * ```tsx
 * function NotificationComponent() {
 *   useNotificationListener((notification) => {
 *     console.log('New notification:', notification);
 *     // Show notification to user
 *   });
 *
 *   return <div>Notifications...</div>;
 * }
 * ```
 */
export function useNotificationListener(handler: (notification: Notification) => void): void {
  const { onNotification } = useSocket();

  useEffect(() => {
    const unsubscribe = onNotification(handler);
    return unsubscribe;
  }, [onNotification, handler]);
}

/**
 * useTypingIndicator hook - Manage typing indicators
 *
 * Provides methods to start/stop typing indicators and track typing state.
 *
 * @param threadId - Optional thread/conversation ID
 * @param recipientIds - Optional array of recipient IDs
 * @returns Object with typing state and control methods
 *
 * @example
 * ```tsx
 * function ChatInput({ threadId }: { threadId: string }) {
 *   const { isTyping, startTyping, stopTyping } = useTypingIndicator(threadId);
 *
 *   return (
 *     <input
 *       onChange={startTyping}
 *       onBlur={stopTyping}
 *       placeholder="Type a message..."
 *     />
 *   );
 * }
 * ```
 */
export function useTypingIndicator(threadId?: string, recipientIds?: string[]) {
  const { sendTypingIndicator } = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    sendTypingIndicator(true, { threadId, recipientIds });
  }, [sendTypingIndicator, threadId, recipientIds]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    sendTypingIndicator(false, { threadId, recipientIds });
  }, [sendTypingIndicator, threadId, recipientIds]);

  return {
    isTyping,
    startTyping,
    stopTyping
  };
}

/**
 * useEmergencyAlerts hook - Listen for emergency alerts
 *
 * Healthcare-specific hook for subscribing to emergency alert events.
 *
 * @param handler - Handler function to call when an emergency alert is received
 *
 * @example
 * ```tsx
 * function EmergencyMonitor() {
 *   useEmergencyAlerts((alert) => {
 *     console.error('EMERGENCY ALERT:', alert);
 *     // Show critical alert to user
 *   });
 *
 *   return <div>Emergency monitoring active...</div>;
 * }
 * ```
 */
export function useEmergencyAlerts(handler: (alert: unknown) => void): void {
  useSocketEvent(WebSocketEvent.EMERGENCY_ALERT, handler);
}

/**
 * useHealthNotifications hook - Listen for health notifications
 *
 * Healthcare-specific hook for subscribing to general health notification events.
 *
 * @param handler - Handler function to call when a health notification is received
 *
 * @example
 * ```tsx
 * function HealthNotifications() {
 *   useHealthNotifications((notification) => {
 *     console.log('Health notification:', notification);
 *     // Display health notification
 *   });
 *
 *   return <div>Health notifications...</div>;
 * }
 * ```
 */
export function useHealthNotifications(handler: (notification: unknown) => void): void {
  useSocketEvent(WebSocketEvent.HEALTH_NOTIFICATION, handler);
}

/**
 * useStudentHealthAlerts hook - Listen for student health alerts
 *
 * Healthcare-specific hook for subscribing to student health alert events.
 *
 * @param handler - Handler function to call when a student health alert is received
 *
 * @example
 * ```tsx
 * function StudentHealthMonitor() {
 *   useStudentHealthAlerts((alert) => {
 *     console.warn('Student health alert:', alert);
 *     // Notify appropriate staff
 *   });
 *
 *   return <div>Student health monitoring...</div>;
 * }
 * ```
 */
export function useStudentHealthAlerts(handler: (alert: unknown) => void): void {
  useSocketEvent(WebSocketEvent.STUDENT_HEALTH_ALERT, handler);
}

/**
 * useMedicationReminders hook - Listen for medication reminders
 *
 * Healthcare-specific hook for subscribing to medication reminder events.
 *
 * @param handler - Handler function to call when a medication reminder is received
 *
 * @example
 * ```tsx
 * function MedicationReminders() {
 *   useMedicationReminders((reminder) => {
 *     console.log('Medication reminder:', reminder);
 *     // Show reminder notification
 *   });
 *
 *   return <div>Medication reminders active...</div>;
 * }
 * ```
 */
export function useMedicationReminders(handler: (reminder: unknown) => void): void {
  useSocketEvent(WebSocketEvent.MEDICATION_REMINDER, handler);
}

/**
 * useTypingListener hook - Listen for typing indicators from others
 *
 * Subscribe to typing indicator events to show when other users are typing.
 *
 * @param handler - Handler function to call when typing indicator is received
 *
 * @example
 * ```tsx
 * function TypingIndicator() {
 *   const [typingUsers, setTypingUsers] = useState<string[]>([]);
 *
 *   useTypingListener((indicator) => {
 *     if (indicator.isTyping) {
 *       setTypingUsers(prev => [...prev, indicator.userId]);
 *     } else {
 *       setTypingUsers(prev => prev.filter(id => id !== indicator.userId));
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       {typingUsers.length > 0 && `${typingUsers.length} user(s) typing...`}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTypingListener(handler: (indicator: TypingIndicator) => void): void {
  const { onTyping } = useSocket();

  useEffect(() => {
    const unsubscribe = onTyping(handler);
    return unsubscribe;
  }, [onTyping, handler]);
}
