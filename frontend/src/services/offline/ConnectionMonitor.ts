/**
 * @fileoverview Connection Monitor Service
 * @module services/offline/ConnectionMonitor
 *
 * Monitors network connectivity and provides connection state management.
 * Features:
 * - Online/offline detection
 * - Network quality monitoring
 * - Connection speed estimation
 * - Automatic state change notifications
 * - Connection history tracking
 *
 * @example
 * ```typescript
 * const monitor = ConnectionMonitor.getInstance();
 *
 * monitor.onStateChange((state) => {
 *   console.log('Connection state:', state);
 * });
 *
 * if (monitor.isOnline()) {
 *   // Proceed with network request
 * }
 * ```
 */

import { logger } from '../utils/logger';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export enum ConnectionState {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SLOW = 'slow',
  UNKNOWN = 'unknown'
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent', // < 100ms latency
  GOOD = 'good',           // 100-300ms latency
  FAIR = 'fair',           // 300-1000ms latency
  POOR = 'poor',           // > 1000ms latency
  OFFLINE = 'offline'
}

export interface ConnectionInfo {
  state: ConnectionState;
  quality: ConnectionQuality;
  effectiveType?: string; // 4g, 3g, 2g, slow-2g
  downlink?: number;      // Mbps
  rtt?: number;           // Round trip time in ms
  saveData?: boolean;     // User has data saver enabled
  timestamp: number;
}

export interface ConnectionEvent {
  previousState: ConnectionState;
  currentState: ConnectionState;
  timestamp: number;
}

type StateChangeListener = (state: ConnectionState, info: ConnectionInfo) => void;

// ==========================================
// CONNECTION MONITOR
// ==========================================

export class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private currentState: ConnectionState = ConnectionState.UNKNOWN;
  private currentInfo: ConnectionInfo;
  private stateChangeListeners: Set<StateChangeListener> = new Set();
  private connectionHistory: ConnectionEvent[] = [];
  private maxHistorySize = 100;
  private checkInterval: NodeJS.Timeout | null = null;
  private pingUrl = '/api/health'; // Lightweight health check endpoint

  private constructor() {
    this.currentInfo = this.detectConnectionInfo();
    this.initializeListeners();
    this.startMonitoring();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initialize browser event listeners
   */
  private initializeListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Listen for visibility change (page hidden/visible)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkConnection();
      }
    });

    // Listen for Network Information API changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', () => {
          this.updateConnectionInfo();
        });
      }
    }
  }

  /**
   * Start periodic connection monitoring
   */
  private startMonitoring(): void {
    // Check connection every 30 seconds
    this.checkInterval = setInterval(() => {
      if (document.hidden) return; // Skip if tab is hidden
      this.checkConnection();
    }, 30000);

    // Initial check
    this.checkConnection();
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // ==========================================
  // STATE DETECTION
  // ==========================================

  /**
   * Detect current connection info
   */
  private detectConnectionInfo(): ConnectionInfo {
    const state = navigator.onLine ? ConnectionState.ONLINE : ConnectionState.OFFLINE;

    const info: ConnectionInfo = {
      state,
      quality: ConnectionQuality.UNKNOWN,
      timestamp: Date.now()
    };

    // Use Network Information API if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        info.effectiveType = connection.effectiveType;
        info.downlink = connection.downlink;
        info.rtt = connection.rtt;
        info.saveData = connection.saveData;

        // Determine quality based on effective type
        info.quality = this.determineQuality(connection.effectiveType, connection.rtt);
      }
    }

    return info;
  }

  /**
   * Determine connection quality from effective type and RTT
   */
  private determineQuality(effectiveType?: string, rtt?: number): ConnectionQuality {
    if (!navigator.onLine) {
      return ConnectionQuality.OFFLINE;
    }

    if (rtt !== undefined) {
      if (rtt < 100) return ConnectionQuality.EXCELLENT;
      if (rtt < 300) return ConnectionQuality.GOOD;
      if (rtt < 1000) return ConnectionQuality.FAIR;
      return ConnectionQuality.POOR;
    }

    // Fallback to effective type
    switch (effectiveType) {
      case '4g':
        return ConnectionQuality.EXCELLENT;
      case '3g':
        return ConnectionQuality.GOOD;
      case '2g':
        return ConnectionQuality.FAIR;
      case 'slow-2g':
        return ConnectionQuality.POOR;
      default:
        return ConnectionQuality.GOOD;
    }
  }

  /**
   * Check connection by pinging server
   */
  private async checkConnection(): Promise<void> {
    if (!navigator.onLine) {
      this.updateState(ConnectionState.OFFLINE);
      return;
    }

    try {
      const startTime = performance.now();
      const response = await fetch(this.pingUrl, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = performance.now();
      const latency = endTime - startTime;

      if (response.ok) {
        const state = latency > 1000 ? ConnectionState.SLOW : ConnectionState.ONLINE;
        this.updateState(state);
      } else {
        this.updateState(ConnectionState.OFFLINE);
      }
    } catch (error) {
      // Network error
      this.updateState(ConnectionState.OFFLINE);
    }
  }

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  /**
   * Update connection state
   */
  private updateState(newState: ConnectionState): void {
    if (this.currentState !== newState) {
      const previousState = this.currentState;
      this.currentState = newState;

      // Update connection info
      this.currentInfo = this.detectConnectionInfo();
      this.currentInfo.state = newState;

      // Add to history
      this.connectionHistory.push({
        previousState,
        currentState: newState,
        timestamp: Date.now()
      });

      // Limit history size
      if (this.connectionHistory.length > this.maxHistorySize) {
        this.connectionHistory.shift();
      }

      // Notify listeners
      this.notifyListeners();

      logger.info('ConnectionMonitor: State changed', {
        from: previousState,
        to: newState,
        quality: this.currentInfo.quality
      });
    }
  }

  /**
   * Update connection info without state change
   */
  private updateConnectionInfo(): void {
    this.currentInfo = this.detectConnectionInfo();
    this.currentInfo.state = this.currentState;
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    logger.info('ConnectionMonitor: Browser reports online');
    this.checkConnection(); // Verify with actual request
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    logger.info('ConnectionMonitor: Browser reports offline');
    this.updateState(ConnectionState.OFFLINE);
  }

  // ==========================================
  // PUBLIC API
  // ==========================================

  /**
   * Check if currently online
   */
  public isOnline(): boolean {
    return this.currentState === ConnectionState.ONLINE ||
           this.currentState === ConnectionState.SLOW;
  }

  /**
   * Check if currently offline
   */
  public isOffline(): boolean {
    return this.currentState === ConnectionState.OFFLINE;
  }

  /**
   * Check if connection is slow
   */
  public isSlow(): boolean {
    return this.currentState === ConnectionState.SLOW ||
           this.currentInfo.quality === ConnectionQuality.POOR;
  }

  /**
   * Get current connection state
   */
  public getState(): ConnectionState {
    return this.currentState;
  }

  /**
   * Get current connection info
   */
  public getInfo(): ConnectionInfo {
    return { ...this.currentInfo };
  }

  /**
   * Get connection history
   */
  public getHistory(): ConnectionEvent[] {
    return [...this.connectionHistory];
  }

  /**
   * Get connection quality
   */
  public getQuality(): ConnectionQuality {
    return this.currentInfo.quality;
  }

  /**
   * Force connection check
   */
  public async forceCheck(): Promise<void> {
    await this.checkConnection();
  }

  // ==========================================
  // EVENT HANDLING
  // ==========================================

  /**
   * Subscribe to state changes
   */
  public onStateChange(listener: StateChangeListener): void {
    this.stateChangeListeners.add(listener);
  }

  /**
   * Unsubscribe from state changes
   */
  public offStateChange(listener: StateChangeListener): void {
    this.stateChangeListeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.stateChangeListeners.forEach(listener => {
      try {
        listener(this.currentState, this.currentInfo);
      } catch (error) {
        logger.error('ConnectionMonitor: Error in state change listener', error as Error);
      }
    });
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopMonitoring();
    this.stateChangeListeners.clear();
    this.connectionHistory = [];
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const connectionMonitor = ConnectionMonitor.getInstance();
export default connectionMonitor;
