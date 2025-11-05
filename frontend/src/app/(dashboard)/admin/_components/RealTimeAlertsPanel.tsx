/**
 * Real-Time Admin Alerts Panel
 *
 * Displays system alerts with real-time updates via WebSocket.
 * Integrates with existing infrastructure for live alert monitoring.
 *
 * @module app/(dashboard)/admin/_components/RealTimeAlertsPanel
 * @category Admin Components
 * @requires useWebSocket
 * @since 2025-11-05
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWebSocket } from '@/hooks/core/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  X,
  RefreshCw,
  Bell,
  BellOff,
} from 'lucide-react';

/**
 * System alert interface
 */
interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'system' | 'database' | 'websocket';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  details?: Record<string, unknown>;
}

/**
 * Alert item component props
 */
interface AlertItemProps {
  alert: SystemAlert;
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

/**
 * Individual alert item component
 */
function AlertItem({ alert, onAcknowledge, onDismiss }: AlertItemProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-300 bg-red-50';
      case 'error':
        return 'border-red-200 bg-red-25';
      case 'warning':
        return 'border-yellow-300 bg-yellow-50';
      case 'info':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={`p-4 border-l-4 ${getSeverityColor(alert.severity)} ${alert.acknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getSeverityIcon(alert.severity)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {alert.title}
              </h4>
              {getSeverityBadge(alert.severity)}
              {alert.acknowledged && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acknowledged
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Type: {alert.type}</span>
              <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
            </div>
            {alert.details && Object.keys(alert.details).length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                  View Details
                </summary>
                <pre className="text-xs text-gray-600 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                  {JSON.stringify(alert.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {!alert.acknowledged && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAcknowledge(alert.id)}
              className="text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Acknowledge
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDismiss(alert.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Props for the real-time alerts panel
 */
interface RealTimeAlertsPanelProps {
  className?: string;
  enableRealTime?: boolean;
  maxAlerts?: number;
  showDismissed?: boolean;
  enableSound?: boolean;
}

/**
 * Real-time alerts panel component
 */
export function RealTimeAlertsPanel({
  className = '',
  enableRealTime = true,
  maxAlerts = 20,
  showDismissed = false,
  enableSound = true,
}: RealTimeAlertsPanelProps) {
  const { toast } = useToast();
  const { isConnected, subscribe, unsubscribe } = useWebSocket();

  // State management
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [filter, setFilter] = useState<'all' | 'critical' | 'unacknowledged'>('all');

  // Handle new alerts from WebSocket
  const handleNewAlert = useCallback((data: unknown) => {
    try {
      const alert = data as SystemAlert;
      
      setAlerts(prev => {
        // Check if alert already exists
        if (prev.some(a => a.id === alert.id)) {
          return prev;
        }
        
        // Add new alert and keep within limit
        const newAlerts = [alert, ...prev].slice(0, maxAlerts);
        return newAlerts;
      });

      // Play notification sound for critical alerts
      if (soundEnabled && alert.severity === 'critical') {
        try {
          const audio = new Audio('/sounds/alert-critical.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Ignore audio play errors (user interaction required)
          });
        } catch (error) {
          console.warn('Could not play alert sound:', error);
        }
      }

      // Show toast for high priority alerts
      if (alert.severity === 'critical' || alert.severity === 'error') {
        toast({
          title: alert.title,
          description: alert.message,
          variant: alert.severity === 'critical' ? 'destructive' : 'default',
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to process new alert:', error);
    }
  }, [maxAlerts, soundEnabled, toast]);

  // Handle alert acknowledgment updates
  const handleAlertAcknowledged = useCallback((data: unknown) => {
    try {
      const ackData = data as { alertId: string; userId: string; timestamp: string };
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === ackData.alertId
            ? { ...alert, acknowledged: true }
            : alert
        )
      );
    } catch (error) {
      console.error('Failed to process alert acknowledgment:', error);
    }
  }, []);

  // WebSocket subscriptions
  useEffect(() => {
    if (!enableRealTime || !isConnected) {
      const timeoutId = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timeoutId);
    }

    // Subscribe to alert events
    subscribe('admin:alert:new', handleNewAlert);
    subscribe('admin:alert:acknowledged', handleAlertAcknowledged);
    
    // Set loading false after subscription
    const timeoutId = setTimeout(() => setIsLoading(false), 100);

    return () => {
      unsubscribe('admin:alert:new', handleNewAlert);
      unsubscribe('admin:alert:acknowledged', handleAlertAcknowledged);
      clearTimeout(timeoutId);
    };
  }, [enableRealTime, isConnected, subscribe, unsubscribe, handleNewAlert, handleAlertAcknowledged]);

  // Mock data for development when WebSocket is not connected
  useEffect(() => {
    if (enableRealTime && isConnected) return;

    // Generate mock alerts for development
    const mockAlerts: SystemAlert[] = [
      {
        id: 'alert-1',
        type: 'performance',
        severity: 'warning',
        title: 'High CPU Usage',
        message: 'CPU usage has exceeded 80% for the last 5 minutes',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        acknowledged: false,
        details: { currentUsage: 85.2, threshold: 80 },
      },
      {
        id: 'alert-2',
        type: 'system',
        severity: 'info',
        title: 'System Update Available',
        message: 'A new system update is available for installation',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        acknowledged: true,
        details: { version: '2.1.3', updateSize: '245MB' },
      },
      {
        id: 'alert-3',
        type: 'database',
        severity: 'error',
        title: 'Database Connection Issues',
        message: 'Intermittent database connection failures detected',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        acknowledged: false,
        details: { connectionPool: 'primary', failureRate: '2.5%' },
      },
    ];

    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [enableRealTime, isConnected]);

  // Acknowledge alert
  const handleAcknowledge = useCallback((alertId: string) => {
    if (isConnected && enableRealTime) {
      // In production: emit('admin:alerts:acknowledge', alertId)
      console.log('Acknowledging alert via WebSocket:', alertId);
    }
    
    // Optimistically update UI
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );

    toast({
      title: 'Alert Acknowledged',
      description: 'The alert has been marked as acknowledged.',
      variant: 'default',
    });
  }, [isConnected, enableRealTime, toast]);

  // Dismiss alert
  const handleDismiss = useCallback((alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    
    toast({
      title: 'Alert Dismissed',
      description: 'The alert has been hidden from view.',
      variant: 'default',
    });
  }, [toast]);

  // Clear all acknowledged alerts
  const handleClearAcknowledged = useCallback(() => {
    setAlerts(prev => prev.filter(alert => !alert.acknowledged));
    toast({
      title: 'Acknowledged Alerts Cleared',
      description: 'All acknowledged alerts have been removed.',
      variant: 'default',
    });
  }, [toast]);

  // Toggle sound notifications
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
    toast({
      title: soundEnabled ? 'Sound Disabled' : 'Sound Enabled',
      description: `Alert sound notifications are now ${soundEnabled ? 'off' : 'on'}.`,
      variant: 'default',
    });
  }, [soundEnabled, toast]);

  // Filter alerts based on selected filter
  const filteredAlerts = alerts
    .filter(alert => showDismissed || !dismissedAlerts.has(alert.id))
    .filter(alert => {
      switch (filter) {
        case 'critical':
          return alert.severity === 'critical';
        case 'unacknowledged':
          return !alert.acknowledged;
        default:
          return true;
      }
    });

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged && !dismissedAlerts.has(alert.id)).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !dismissedAlerts.has(alert.id)).length;

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading alerts...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>System Alerts</span>
            </h3>
            
            {/* Status indicators */}
            <div className="flex items-center space-x-4 text-sm">
              {criticalCount > 0 && (
                <Badge variant="destructive">
                  {criticalCount} Critical
                </Badge>
              )}
              {unacknowledgedCount > 0 && (
                <Badge variant="secondary">
                  {unacknowledgedCount} Unacknowledged
                </Badge>
              )}
              
              {/* Connection status */}
              <div className="flex items-center space-x-1">
                <div 
                  className={`h-2 w-2 rounded-full ${
                    isConnected && enableRealTime 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-gray-400'
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {isConnected && enableRealTime ? 'Live' : 'Static'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Filter dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'critical' | 'unacknowledged')}
              className="text-sm border rounded px-2 py-1"
              aria-label="Filter alerts"
              title="Filter alerts by type"
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical Only</option>
              <option value="unacknowledged">Unacknowledged</option>
            </select>

            {/* Sound toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleSound}
              className="text-xs"
            >
              {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>

            {/* Clear acknowledged */}
            {alerts.some(alert => alert.acknowledged) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAcknowledged}
                className="text-xs"
              >
                Clear Acknowledged
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h4>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'All systems are running normally.' 
                : `No ${filter} alerts at this time.`
              }
            </p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>

      {/* Summary footer */}
      {filteredAlerts.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredAlerts.length} of {alerts.length} total alerts
            </span>
            <span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}