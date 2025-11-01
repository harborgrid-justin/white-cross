/**
 * @fileoverview React Hook for Connection Monitor
 * @module hooks/useConnectionMonitor
 *
 * Provides React integration for the connection monitor service.
 * Tracks online/offline status and connection quality in React components.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const {
 *     isOnline,
 *     isOffline,
 *     isSlow,
 *     state,
 *     quality,
 *     info
 *   } = useConnectionMonitor();
 *
 *   return (
 *     <div>
 *       {isOffline && <OfflineBanner />}
 *       {isSlow && <SlowConnectionWarning />}
 *       <ConnectionIndicator quality={quality} />
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import {
  connectionMonitor,
  ConnectionState,
  ConnectionQuality,
  ConnectionInfo,
  ConnectionEvent
} from '../services/offline/ConnectionMonitor';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface UseConnectionMonitorReturn {
  // State
  isOnline: boolean;
  isOffline: boolean;
  isSlow: boolean;
  state: ConnectionState;
  quality: ConnectionQuality;
  info: ConnectionInfo;
  history: ConnectionEvent[];

  // Operations
  forceCheck: () => Promise<void>;
  refresh: () => void;
}

// ==========================================
// HOOK IMPLEMENTATION
// ==========================================

export function useConnectionMonitor(): UseConnectionMonitorReturn {
  const [isOnline, setIsOnline] = useState(() => connectionMonitor.isOnline());
  const [isOffline, setIsOffline] = useState(() => connectionMonitor.isOffline());
  const [isSlow, setIsSlow] = useState(() => connectionMonitor.isSlow());
  const [state, setState] = useState(() => connectionMonitor.getState());
  const [quality, setQuality] = useState(() => connectionMonitor.getQuality());
  const [info, setInfo] = useState(() => connectionMonitor.getInfo());
  const [history, setHistory] = useState(() => connectionMonitor.getHistory());

  // ==========================================
  // STATE UPDATES
  // ==========================================

  const updateState = useCallback(() => {
    setIsOnline(connectionMonitor.isOnline());
    setIsOffline(connectionMonitor.isOffline());
    setIsSlow(connectionMonitor.isSlow());
    setState(connectionMonitor.getState());
    setQuality(connectionMonitor.getQuality());
    setInfo(connectionMonitor.getInfo());
    setHistory(connectionMonitor.getHistory());
  }, []);

  // ==========================================
  // EVENT LISTENER
  // ==========================================

  useEffect(() => {
    // Subscribe to state changes
    const handleStateChange = (newState: ConnectionState, newInfo: ConnectionInfo) => {
      setState(newState);
      setInfo(newInfo);
      setQuality(newInfo.quality);
      setIsOnline(connectionMonitor.isOnline());
      setIsOffline(connectionMonitor.isOffline());
      setIsSlow(connectionMonitor.isSlow());
      setHistory(connectionMonitor.getHistory());
    };

    connectionMonitor.onStateChange(handleStateChange);

    // Cleanup
    return () => {
      connectionMonitor.offStateChange(handleStateChange);
    };
  }, []);

  // ==========================================
  // OPERATIONS
  // ==========================================

  const forceCheck = useCallback(async (): Promise<void> => {
    await connectionMonitor.forceCheck();
  }, []);

  const refresh = useCallback((): void => {
    updateState();
  }, [updateState]);

  // ==========================================
  // RETURN
  // ==========================================

  return {
    isOnline,
    isOffline,
    isSlow,
    state,
    quality,
    info,
    history,
    forceCheck,
    refresh
  };
}

export default useConnectionMonitor;
