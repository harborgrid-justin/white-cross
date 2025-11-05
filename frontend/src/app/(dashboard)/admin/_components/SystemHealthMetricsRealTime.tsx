/**
 * Enhanced Real-Time SystemHealthMetrics Component
 *
 * Integrates with existing WebSocket infrastructure to provide real-time
 * system health metrics updates for the admin dashboard.
 *
 * @module app/(dashboard)/admin/_components/SystemHealthMetricsRealTime
 * @category Admin Components
 * @requires useWebSocket
 * @since 2025-11-05
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/core/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  Users,
  HardDrive,
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

/**
 * Real-time system metrics interface
 */
interface RealTimeSystemMetrics {
  timestamp: string;
  cpu: {
    usage: number;
    cores: number;
    status: 'good' | 'warning' | 'critical';
  };
  memory: {
    total: number;
    used: number;
    percentage: number;
    status: 'good' | 'warning' | 'critical';
  };
  disk: {
    total: number;
    used: number;
    percentage: number;
    status: 'good' | 'warning' | 'critical';
  };
  network: {
    responseTime: number;
    status: 'good' | 'warning' | 'critical';
  };
  websocket: {
    connectedClients: number;
    status: 'good' | 'warning' | 'critical';
  };
  database: {
    connections: number;
    activeQueries: number;
    status: 'good' | 'warning' | 'critical';
  };
}

/**
 * Performance trend type
 */
type TrendDirection = 'up' | 'down' | 'stable';

/**
 * System alert interface
 */
interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'system';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

/**
 * Enhanced metric card props
 */
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'good' | 'warning' | 'critical';
  trend?: {
    direction: TrendDirection;
    value: string;
  };
  onClick?: () => void;
  isLive?: boolean;
  lastUpdate?: string;
}

/**
 * Enhanced metric card component with real-time capabilities
 */
function EnhancedMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status,
  trend,
  onClick,
  isLive = false,
  lastUpdate,
}: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      case 'stable':
        return <Minus className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTrendColor = (direction: TrendDirection, isPerformanceMetric = true) => {
    if (!isPerformanceMetric) return 'text-blue-600';
    
    switch (direction) {
      case 'up':
        return 'text-red-600'; // Up is bad for CPU/Memory usage
      case 'down':
        return 'text-green-600'; // Down is good for usage
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-200 border-2
        ${getStatusColor(status)}
        ${onClick ? 'hover:shadow-lg hover:scale-105' : ''}
        ${isLive ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-2 right-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className="h-6 w-6" />
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>
          {getStatusIcon(status)}
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600">{subtitle}</div>

          {/* Trend indicator */}
          {trend && (
            <div className={`flex items-center space-x-1 text-xs ${getTrendColor(trend.direction)}`}>
              {getTrendIcon(trend.direction)}
              <span>{trend.value}</span>
            </div>
          )}

          {/* Last update time */}
          {lastUpdate && (
            <div className="text-xs text-gray-500">
              Updated: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Props for the enhanced system health metrics component
 */
interface SystemHealthMetricsRealTimeProps {
  className?: string;
  enableRealTime?: boolean;
  refreshInterval?: number; // milliseconds
}

/**
 * Enhanced SystemHealthMetrics component with real-time updates
 */
export function SystemHealthMetricsRealTime({
  className = '',
  enableRealTime = true,
  refreshInterval = 5000,
}: SystemHealthMetricsRealTimeProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isConnected, subscribe, unsubscribe } = useWebSocket();

  // State management
  const [metrics, setMetrics] = useState<RealTimeSystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Format bytes to GB
  const formatBytes = useCallback((bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    return `${gb.toFixed(1)} GB`;
  }, []);

  // Calculate trend direction (for future use)
  // const calculateTrend = useCallback((current: number, previous: number): TrendDirection => {
  //   const diff = current - previous;
  //   if (Math.abs(diff) < 1) return 'stable';
  //   return diff > 0 ? 'up' : 'down';
  // }, []);

  // Handle real-time metrics updates
  const handleMetricsUpdate = useCallback((data: unknown) => {
    try {
      // Type guard - in production, use proper validation
      const metricsData = data as {
        metrics: RealTimeSystemMetrics;
        alerts: SystemAlert[];
        timestamp: string;
      };

      setMetrics(metricsData.metrics);
      setAlerts(metricsData.alerts);
      setLastUpdate(metricsData.timestamp);
      setIsLoading(false);
      setIsLive(true);

      // Reset live indicator after animation
      setTimeout(() => setIsLive(false), 1000);
    } catch (error) {
      console.error('Failed to process metrics update:', error);
    }
  }, []);

  // Handle new alerts
  const handleNewAlert = useCallback((data: unknown) => {
    try {
      const alert = data as SystemAlert;
      
      setAlerts(prev => {
        // Check if alert already exists
        if (prev.some(a => a.id === alert.id)) {
          return prev;
        }
        return [alert, ...prev.slice(0, 9)]; // Keep last 10 alerts
      });

      // Show critical alerts as toasts
      if (alert.severity === 'critical') {
        toast({
          title: alert.title,
          description: alert.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to process alert:', error);
    }
  }, [toast]);

  // WebSocket subscriptions
  useEffect(() => {
    if (!enableRealTime || !isConnected) return;

    // Subscribe to admin metrics updates
    subscribe('admin:metrics:update', handleMetricsUpdate);
    subscribe('admin:alert:new', handleNewAlert);

    return () => {
      unsubscribe('admin:metrics:update', handleMetricsUpdate);
      unsubscribe('admin:alert:new', handleNewAlert);
    };
  }, [enableRealTime, isConnected, subscribe, unsubscribe, handleMetricsUpdate, handleNewAlert]);

  // Fallback: Load initial data and set up polling if WebSocket not available
  useEffect(() => {
    if (!enableRealTime || isConnected) return;

    const loadMetrics = async () => {
      try {
        // Simulate loading metrics - integrate with your actual API
        const mockMetrics: RealTimeSystemMetrics = {
          timestamp: new Date().toISOString(),
          cpu: {
            usage: Math.random() * 100,
            cores: 8,
            status: 'good',
          },
          memory: {
            total: 16 * 1024 ** 3, // 16GB
            used: Math.random() * 12 * 1024 ** 3,
            percentage: Math.random() * 75,
            status: 'good',
          },
          disk: {
            total: 1024 * 1024 ** 3, // 1TB
            used: Math.random() * 500 * 1024 ** 3,
            percentage: Math.random() * 50,
            status: 'good',
          },
          network: {
            responseTime: Math.random() * 200 + 50,
            status: 'good',
          },
          websocket: {
            connectedClients: Math.floor(Math.random() * 50) + 10,
            status: 'good',
          },
          database: {
            connections: Math.floor(Math.random() * 20) + 5,
            activeQueries: Math.floor(Math.random() * 10),
            status: 'good',
          },
        };

        setMetrics(mockMetrics);
        setLastUpdate(mockMetrics.timestamp);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load metrics:', error);
        setIsLoading(false);
      }
    };

    // Load initial data
    loadMetrics();

    // Set up polling
    const interval = setInterval(loadMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [enableRealTime, isConnected, refreshInterval]);

  // Manual refresh
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    
    // Trigger metrics refresh via WebSocket if connected
    if (isConnected && enableRealTime) {
      // In production: emit('admin:metrics:request')
      console.log('Requesting metrics refresh via WebSocket');
    }
    
    setTimeout(() => setIsLoading(false), 1000);
  }, [isConnected, enableRealTime]);

  if (isLoading && !metrics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">System Health</h2>
          <div className="animate-spin">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Unable to load system metrics</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with real-time indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold">System Health</h2>
          
          {/* Connection status */}
          <div className="flex items-center space-x-2">
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

          {/* Active alerts badge */}
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
            </Badge>
          )}
        </div>

        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* System Health */}
        <EnhancedMetricCard
          title="System Health"
          value="Excellent"
          subtitle={`${metrics.cpu.cores} cores`}
          icon={Activity}
          status={metrics.cpu.status}
          trend={{
            direction: 'stable',
            value: `${metrics.cpu.usage.toFixed(1)}%`,
          }}
          onClick={() => router.push('/admin/monitoring/health')}
          isLive={isLive}
          lastUpdate={lastUpdate || undefined}
        />

        {/* Active Users */}
        <EnhancedMetricCard
          title="Active Users"
          value={metrics.websocket.connectedClients.toString()}
          subtitle="connected now"
          icon={Users}
          status={metrics.websocket.status}
          trend={{
            direction: 'up',
            value: '+12 today',
          }}
          onClick={() => router.push('/admin/settings/users')}
          isLive={isLive}
          lastUpdate={lastUpdate || undefined}
        />

        {/* Storage Usage */}
        <EnhancedMetricCard
          title="Storage Usage"
          value={formatBytes(metrics.disk.used)}
          subtitle={`of ${formatBytes(metrics.disk.total)}`}
          icon={HardDrive}
          status={metrics.disk.status}
          trend={{
            direction: 'up',
            value: `${metrics.disk.percentage.toFixed(1)}%`,
          }}
          onClick={() => router.push('/admin/settings/configuration')}
          isLive={isLive}
          lastUpdate={lastUpdate || undefined}
        />

        {/* Response Time */}
        <EnhancedMetricCard
          title="Response Time"
          value={`${metrics.network.responseTime.toFixed(0)}ms`}
          subtitle="avg response"
          icon={Zap}
          status={metrics.network.status}
          trend={{
            direction: 'down',
            value: '-23ms',
          }}
          onClick={() => router.push('/admin/monitoring/health')}
          isLive={isLive}
          lastUpdate={lastUpdate || undefined}
        />
      </div>

      {/* System overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Memory</h3>
          <div className="text-2xl font-bold">{formatBytes(metrics.memory.used)}</div>
          <div className="text-sm text-gray-600">
            {metrics.memory.percentage.toFixed(1)}% of {formatBytes(metrics.memory.total)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                metrics.memory.percentage > 80 ? 'bg-red-500' : 
                metrics.memory.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, metrics.memory.percentage)}%` }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Database</h3>
          <div className="text-2xl font-bold">{metrics.database.connections}</div>
          <div className="text-sm text-gray-600">
            active connections, {metrics.database.activeQueries} queries
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">WebSocket</h3>
          <div className="text-2xl font-bold">{metrics.websocket.connectedClients}</div>
          <div className="text-sm text-gray-600">
            connected clients
          </div>
        </Card>
      </div>
    </div>
  );
}