/**
 * Real-Time Admin Hooks
 *
 * React hooks for real-time admin dashboard functionality.
 * Integrates with AdminWebSocketGateway for live system monitoring,
 * alerts, and admin activity tracking.
 *
 * @module hooks/admin/useRealTimeAdmin
 * @category Admin Hooks
 * @requires useWebSocket
 * @since 2025-11-05
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/core/useWebSocket';
import { useToast } from '@/hooks/use-toast';

/**
 * System metrics interface
 */
export interface SystemMetrics {
  timestamp: string;
  system: {
    uptime: number;
    loadAverage: number[];
    platform: string;
    hostname: string;
    version: string;
  };
  cpu: {
    usage: number;
    cores: number;
    model: string;
    speed: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
  database: {
    connections: number;
    activeQueries: number;
    slowQueries: number;
    uptime: number;
  };
  websocket: {
    connectedClients: number;
    totalMessages: number;
    errors: number;
  };
}

/**
 * System alert interface
 */
export interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'system' | 'database' | 'websocket';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  details?: Record<string, any>;
}

/**
 * Admin activity interface
 */
export interface AdminActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details?: Record<string, any>;
}

/**
 * Performance trend data
 */
export interface PerformanceTrend {
  cpu: 'up' | 'down' | 'stable';
  memory: 'up' | 'down' | 'stable';
  disk: 'up' | 'down' | 'stable';
}

/**
 * Real-time admin state
 */
interface RealTimeAdminState {
  // Metrics
  currentMetrics: SystemMetrics | null;
  metricsHistory: SystemMetrics[];
  performanceTrend: PerformanceTrend | null;
  
  // Alerts
  activeAlerts: SystemAlert[];
  newAlertsCount: number;
  
  // Activity
  recentActivity: AdminActivity[];
  
  // System status
  systemStatus: 'healthy' | 'degraded' | 'critical';
  
  // Connection info
  connectedAdmins: Array<{
    clientId: string;
    userName: string;
    timestamp: string;
  }>;
  
  // Loading states
  isLoading: boolean;
  lastUpdate: string | null;
}

/**
 * Real-time admin hook return type
 */
interface UseRealTimeAdminReturn extends RealTimeAdminState {
  // Actions
  acknowledgeAlert: (alertId: string) => void;
  executeAdminTool: (toolId: string, params?: any) => Promise<any>;
  requestMetricsUpdate: () => void;
  subscribeToChannel: (channel: string) => void;
  unsubscribeFromChannel: (channel: string) => void;
  
  // Connection status
  isConnected: boolean;
  connectionState: string;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

/**
 * Real-time admin dashboard hook
 *
 * Provides real-time system monitoring, alerts, and admin activity tracking.
 * Automatically connects to admin WebSocket namespace and manages subscriptions.
 *
 * @returns Real-time admin data and actions
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const {
 *     currentMetrics,
 *     activeAlerts,
 *     systemStatus,
 *     acknowledgeAlert,
 *     executeAdminTool,
 *     isConnected
 *   } = useRealTimeAdmin();
 *
 *   if (!isConnected) {
 *     return <div>Connecting to real-time monitoring...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <SystemHealthCard metrics={currentMetrics} status={systemStatus} />
 *       <AlertsPanel alerts={activeAlerts} onAcknowledge={acknowledgeAlert} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useRealTimeAdmin(): UseRealTimeAdminReturn {
  const { toast } = useToast();
  const { isConnected, connectionState, subscribe, unsubscribe, emit } = useWebSocket({
    namespace: '/admin', // Connect to admin namespace
    autoConnect: true,
  });

  // State management
  const [state, setState] = useState<RealTimeAdminState>({
    currentMetrics: null,
    metricsHistory: [],
    performanceTrend: null,
    activeAlerts: [],
    newAlertsCount: 0,
    recentActivity: [],
    systemStatus: 'healthy',
    connectedAdmins: [],
    isLoading: true,
    lastUpdate: null,
  });

  const [error, setError] = useState<string | null>(null);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle metrics updates
  const handleMetricsUpdate = useCallback((data: {
    metrics: SystemMetrics;
    trend: PerformanceTrend;
    alerts: SystemAlert[];
  }) => {
    setState(prev => ({
      ...prev,
      currentMetrics: data.metrics,
      performanceTrend: data.trend,
      activeAlerts: data.alerts,
      isLoading: false,
      lastUpdate: new Date().toISOString(),
      metricsHistory: [
        ...prev.metricsHistory.slice(-19), // Keep last 19 + new one = 20 total
        data.metrics,
      ],
    }));
  }, []);

  // Handle new alerts
  const handleNewAlert = useCallback((alert: SystemAlert) => {
    setState(prev => ({
      ...prev,
      activeAlerts: [alert, ...prev.activeAlerts],
      newAlertsCount: prev.newAlertsCount + 1,
    }));

    // Show toast notification for critical alerts
    if (alert.severity === 'critical') {
      toast({
        title: alert.title,
        description: alert.message,
        variant: 'destructive',
      });
    } else if (alert.severity === 'warning') {
      toast({
        title: alert.title,
        description: alert.message,
        variant: 'default',
      });
    }
  }, [toast]);

  // Handle alert acknowledgment
  const handleAlertAcknowledged = useCallback((data: { 
    alertId: string; 
    userId: string; 
    timestamp: string;
  }) => {
    setState(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.map(alert =>
        alert.id === data.alertId
          ? { ...alert, acknowledged: true }
          : alert
      ),
    }));
  }, []);

  // Handle new admin activity
  const handleNewActivity = useCallback((activity: AdminActivity) => {
    setState(prev => ({
      ...prev,
      recentActivity: [activity, ...prev.recentActivity.slice(0, 49)], // Keep last 50
    }));
  }, []);

  // Handle admin client connections/disconnections
  const handleAdminClientConnected = useCallback((data: {
    clientId: string;
    userName: string;
    timestamp: string;
  }) => {
    setState(prev => ({
      ...prev,
      connectedAdmins: [data, ...prev.connectedAdmins],
    }));
  }, []);

  const handleAdminClientDisconnected = useCallback((data: {
    clientId: string;
    userName: string;
    timestamp: string;
  }) => {
    setState(prev => ({
      ...prev,
      connectedAdmins: prev.connectedAdmins.filter(
        admin => admin.clientId !== data.clientId
      ),
    }));
  }, []);

  // Handle system status updates
  const handleSystemStatusUpdate = useCallback((data: {
    status: 'healthy' | 'degraded' | 'critical';
    timestamp: string;
  }) => {
    setState(prev => ({
      ...prev,
      systemStatus: data.status,
    }));
  }, []);

  // Handle admin tool results
  const handleToolResult = useCallback((data: {
    toolId: string;
    result: any;
    timestamp: string;
  }) => {
    if (data.result.success) {
      toast({
        title: 'Tool Executed Successfully',
        description: data.result.message || `Tool ${data.toolId} completed`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Tool Execution Failed',
        description: data.result.error || `Tool ${data.toolId} failed`,
        variant: 'destructive',
      });
    }
  }, [toast]);

  // WebSocket event subscriptions
  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to all admin events
    const eventHandlers = [
      { event: 'admin:metrics:update', handler: handleMetricsUpdate },
      { event: 'admin:alert:new', handler: handleNewAlert },
      { event: 'admin:alert:acknowledged', handler: handleAlertAcknowledged },
      { event: 'admin:activity:new', handler: handleNewActivity },
      { event: 'admin:client:connected', handler: handleAdminClientConnected },
      { event: 'admin:client:disconnected', handler: handleAdminClientDisconnected },
      { event: 'admin:system:status', handler: handleSystemStatusUpdate },
      { event: 'admin:tools:result', handler: handleToolResult },
    ];

    eventHandlers.forEach(({ event, handler }) => {
      subscribe(event, handler);
    });

    // Request initial data
    emit('admin:metrics:request');
    emit('admin:activity:request', 50);

    // Auto-subscribe to essential channels
    const essentialChannels = ['metrics', 'alerts', 'activity', 'system-status'];
    essentialChannels.forEach(channel => {
      emit('admin:subscribe', channel);
      subscriptionsRef.current.add(channel);
    });

    // Cleanup function
    return () => {
      eventHandlers.forEach(({ event, handler }) => {
        unsubscribe(event, handler);
      });
    };
  }, [
    isConnected,
    subscribe,
    unsubscribe,
    emit,
    handleMetricsUpdate,
    handleNewAlert,
    handleAlertAcknowledged,
    handleNewActivity,
    handleAdminClientConnected,
    handleAdminClientDisconnected,
    handleSystemStatusUpdate,
    handleToolResult,
  ]);

  // Actions
  const acknowledgeAlert = useCallback((alertId: string) => {
    if (!isConnected) {
      setError('Not connected to admin WebSocket');
      return;
    }

    emit('admin:alerts:acknowledge', alertId);
    
    // Optimistically update UI
    setState(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true }
          : alert
      ),
      newAlertsCount: Math.max(0, prev.newAlertsCount - 1),
    }));
  }, [isConnected, emit]);

  const executeAdminTool = useCallback(async (toolId: string, params?: any): Promise<any> => {
    if (!isConnected) {
      setError('Not connected to admin WebSocket');
      throw new Error('Not connected to admin WebSocket');
    }

    return new Promise((resolve, reject) => {
      // Set up one-time listener for tool result
      const handleResult = (data: { toolId: string; result: any; timestamp: string }) => {
        if (data.toolId === toolId) {
          unsubscribe('admin:tools:result', handleResult);
          if (data.result.success) {
            resolve(data.result);
          } else {
            reject(new Error(data.result.error || 'Tool execution failed'));
          }
        }
      };

      subscribe('admin:tools:result', handleResult);
      emit('admin:tools:execute', { toolId, params });

      // Timeout after 30 seconds
      setTimeout(() => {
        unsubscribe('admin:tools:result', handleResult);
        reject(new Error('Tool execution timeout'));
      }, 30000);
    });
  }, [isConnected, emit, subscribe, unsubscribe]);

  const requestMetricsUpdate = useCallback(() => {
    if (!isConnected) {
      setError('Not connected to admin WebSocket');
      return;
    }
    emit('admin:metrics:request');
  }, [isConnected, emit]);

  const subscribeToChannel = useCallback((channel: string) => {
    if (!isConnected) {
      setError('Not connected to admin WebSocket');
      return;
    }
    
    if (!subscriptionsRef.current.has(channel)) {
      emit('admin:subscribe', channel);
      subscriptionsRef.current.add(channel);
    }
  }, [isConnected, emit]);

  const unsubscribeFromChannel = useCallback((channel: string) => {
    if (!isConnected) {
      setError('Not connected to admin WebSocket');
      return;
    }
    
    if (subscriptionsRef.current.has(channel)) {
      emit('admin:unsubscribe', channel);
      subscriptionsRef.current.delete(channel);
    }
  }, [isConnected, emit]);

  return {
    // State
    ...state,
    
    // Actions
    acknowledgeAlert,
    executeAdminTool,
    requestMetricsUpdate,
    subscribeToChannel,
    unsubscribeFromChannel,
    
    // Connection status
    isConnected,
    connectionState,
    
    // Error handling
    error,
    clearError,
  };
}

/**
 * Hook for real-time system metrics only
 *
 * Lighter weight hook that only subscribes to metrics updates.
 * Useful for components that only need system performance data.
 */
export function useRealTimeMetrics() {
  const {
    currentMetrics,
    metricsHistory,
    performanceTrend,
    systemStatus,
    isConnected,
    requestMetricsUpdate,
  } = useRealTimeAdmin();

  return {
    currentMetrics,
    metricsHistory,
    performanceTrend,
    systemStatus,
    isConnected,
    requestMetricsUpdate,
  };
}

/**
 * Hook for real-time alerts only
 *
 * Lighter weight hook that only subscribes to alert updates.
 * Useful for alert-specific components.
 */
export function useRealTimeAlerts() {
  const {
    activeAlerts,
    newAlertsCount,
    acknowledgeAlert,
    isConnected,
  } = useRealTimeAdmin();

  return {
    activeAlerts,
    newAlertsCount,
    acknowledgeAlert,
    isConnected,
  };
}

/**
 * Hook for real-time admin activity only
 *
 * Lighter weight hook that only subscribes to admin activity updates.
 * Useful for activity log components.
 */
export function useRealTimeActivity() {
  const {
    recentActivity,
    connectedAdmins,
    isConnected,
  } = useRealTimeAdmin();

  return {
    recentActivity,
    connectedAdmins,
    isConnected,
  };
}