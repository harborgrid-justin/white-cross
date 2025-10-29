/**
 * useSocketConnection Hook
 *
 * React hook for monitoring Socket.io connection state
 *
 * @module hooks/socket/useSocketConnection
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { socketService } from '@/services/socket/socket.service';
import {
  ConnectionState,
  ConnectionMetrics
} from '@/services/socket/socket.types';

/**
 * Return type for useSocketConnection hook
 */
export interface UseSocketConnectionReturn {
  /** Current connection state */
  state: ConnectionState;
  /** Is connected */
  isConnected: boolean;
  /** Is connecting */
  isConnecting: boolean;
  /** Is reconnecting */
  isReconnecting: boolean;
  /** Is disconnected */
  isDisconnected: boolean;
  /** Has error */
  hasError: boolean;
  /** Socket ID */
  socketId: string | undefined;
  /** Connection metrics */
  metrics: ConnectionMetrics;
  /** Reconnect function */
  reconnect: () => void;
}

/**
 * Hook to monitor Socket.io connection state
 *
 * @example
 * ```tsx
 * function ConnectionStatus() {
 *   const {
 *     isConnected,
 *     isReconnecting,
 *     hasError,
 *     metrics,
 *     reconnect
 *   } = useSocketConnection();
 *
 *   if (hasError) {
 *     return (
 *       <div className="error">
 *         Connection error
 *         <button onClick={reconnect}>Retry</button>
 *       </div>
 *     );
 *   }
 *
 *   if (isReconnecting) {
 *     return <div>Reconnecting... (attempt {metrics.reconnectAttempts})</div>;
 *   }
 *
 *   return (
 *     <div className={isConnected ? 'connected' : 'disconnected'}>
 *       {isConnected ? 'Connected' : 'Disconnected'}
 *       {metrics.latency && <span>({metrics.latency}ms)</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSocketConnection(): UseSocketConnectionReturn {
  const [state, setState] = useState<ConnectionState>(socketService.getState());
  const [socketId, setSocketId] = useState<string | undefined>(socketService.getSocketId());
  const [metrics, setMetrics] = useState<ConnectionMetrics>(socketService.getMetrics());

  useEffect(() => {
    const handleStateChange = (newState: ConnectionState) => {
      setState(newState);
      setSocketId(socketService.getSocketId());
      setMetrics(socketService.getMetrics());
    };

    socketService.onStateChange(handleStateChange);

    return () => {
      socketService.offStateChange(handleStateChange);
    };
  }, []);

  const reconnect = useCallback(() => {
    socketService.reconnect();
  }, []);

  return {
    state,
    isConnected: state === ConnectionState.CONNECTED,
    isConnecting: state === ConnectionState.CONNECTING,
    isReconnecting: state === ConnectionState.RECONNECTING,
    isDisconnected: state === ConnectionState.DISCONNECTED,
    hasError: state === ConnectionState.ERROR,
    socketId,
    metrics,
    reconnect
  };
}

export default useSocketConnection;
