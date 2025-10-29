/**
 * useSocketEvent Hook
 *
 * React hook for subscribing to Socket.io events
 *
 * @module hooks/socket/useSocketEvent
 */

'use client';

import { useEffect, useRef } from 'react';
import { socketService } from '@/services/socket/socket.service';
import {
  SocketEvent,
  EventHandler,
  SocketEventPayloadMap
} from '@/services/socket/socket.types';

/**
 * Hook to subscribe to Socket.io events with automatic cleanup
 *
 * @example
 * ```tsx
 * function ChatMessages() {
 *   useSocketEvent(SocketEvent.MESSAGE_RECEIVED, (data) => {
 *     console.log('New message:', data.message);
 *     addMessageToUI(data.message);
 *   });
 *
 *   useSocketEvent(SocketEvent.MESSAGE_TYPING, (data) => {
 *     if (data.isTyping) {
 *       showTypingIndicator(data.userName);
 *     } else {
 *       hideTypingIndicator(data.userId);
 *     }
 *   });
 *
 *   return <div>Messages...</div>;
 * }
 * ```
 */
export function useSocketEvent<K extends keyof SocketEventPayloadMap>(
  event: K,
  handler: EventHandler<SocketEventPayloadMap[K]>,
  deps: React.DependencyList = []
): void;

export function useSocketEvent(
  event: string,
  handler: EventHandler,
  deps?: React.DependencyList
): void;

export function useSocketEvent(
  event: string,
  handler: EventHandler,
  deps: React.DependencyList = []
): void {
  // Use ref to store handler to avoid re-subscribing on every render
  const handlerRef = useRef(handler);

  // Update handler ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // Wrapper to call current handler
    const wrappedHandler: EventHandler = (payload) => {
      handlerRef.current(payload);
    };

    // Subscribe to event
    socketService.on(event, wrappedHandler);

    // Cleanup on unmount
    return () => {
      socketService.off(event, wrappedHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

export default useSocketEvent;
