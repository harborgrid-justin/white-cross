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

/**
 * Return type for useConnectionMonitor hook.
 *
 * Provides connection state information and operations for managing
 * network connectivity monitoring.
 *
 * @interface UseConnectionMonitorReturn
 *
 * @property {boolean} isOnline - Whether the device is currently online
 * @property {boolean} isOffline - Whether the device is currently offline
 * @property {boolean} isSlow - Whether the connection is considered slow (based on quality thresholds)
 * @property {ConnectionState} state - Current connection state enum value
 * @property {ConnectionQuality} quality - Current connection quality assessment
 * @property {ConnectionInfo} info - Detailed connection information including metrics
 * @property {ConnectionEvent[]} history - Array of recent connection state change events
 * @property {() => Promise<void>} forceCheck - Force immediate connection quality check
 * @property {() => void} refresh - Refresh all connection state from monitor service
 */
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

/**
 * Hook for monitoring network connection status and quality.
 *
 * Provides real-time monitoring of online/offline status and connection quality.
 * Automatically subscribes to connection state changes and updates component state
 * when network conditions change.
 *
 * @returns {UseConnectionMonitorReturn} Connection monitoring state and operations
 *
 * @example
 * ```typescript
 * function NetworkStatus() {
 *   const {
 *     isOnline,
 *     isOffline,
 *     isSlow,
 *     quality,
 *     forceCheck
 *   } = useConnectionMonitor();
 *
 *   return (
 *     <div>
 *       <ConnectionBadge online={isOnline} />
 *       {isSlow && <SlowConnectionWarning />}
 *       <QualityIndicator quality={quality} />
 *       <button onClick={forceCheck}>Check Connection</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Conditional rendering based on connection
 * function DataTable() {
 *   const { isOffline } = useConnectionMonitor();
 *
 *   if (isOffline) {
 *     return <OfflineMessage>You are currently offline</OfflineMessage>;
 *   }
 *
 *   return <DataTableContent />;
 * }
 * ```
 *
 * @remarks
 * - Automatically subscribes to connection monitor service events
 * - State updates trigger React re-renders
 * - Cleans up event listeners on unmount
 * - Provides both boolean flags and detailed connection info
 * - Connection quality is assessed based on RTT and downlink metrics
 *
 * @see {@link ConnectionMonitor} service for underlying implementation
 * @see {@link useOfflineQueue} for handling requests during offline periods
 */
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
