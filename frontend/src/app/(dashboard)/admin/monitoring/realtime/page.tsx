/**
 * Enhanced Real-Time Admin Dashboard Page
 *
 * Integrates real-time system monitoring, alerts, and metrics
 * with the existing admin infrastructure and WebSocket connectivity.
 *
 * @module app/(dashboard)/admin/monitoring/realtime/page
 * @category Admin Pages
 * @requires SystemHealthMetricsRealTime, RealTimeAlertsPanel
 * @since 2025-11-05
 */

import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SystemHealthMetricsRealTime } from '../../_components/SystemHealthMetricsRealTime';
import { RealTimeAlertsPanel } from '../../_components/RealTimeAlertsPanel';
import {
  Activity,
  Zap,
  Wifi,
  Clock,
} from 'lucide-react';

/**
 * Loading skeleton for real-time dashboard
 */
function RealTimeDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      {/* Alerts skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
}

/**
 * Real-time dashboard status indicators
 */
function RealTimeStatusIndicators() {
  return (
    <div className="flex items-center space-x-4">
      {/* Real-time connection status */}
      <Card className="p-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Wifi className="h-4 w-4 text-green-600" />
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-green-900">WebSocket Connected</div>
            <div className="text-green-700 text-xs">Real-time monitoring active</div>
          </div>
        </div>
      </Card>

      {/* System status */}
      <Card className="p-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <div className="text-sm">
            <div className="font-medium text-blue-900">System Healthy</div>
            <div className="text-blue-700 text-xs">All services operational</div>
          </div>
        </div>
      </Card>

      {/* Update frequency */}
      <Card className="p-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-purple-600" />
          <div className="text-sm">
            <div className="font-medium text-purple-900">5s Updates</div>
            <div className="text-purple-700 text-xs">Auto-refresh enabled</div>
          </div>
        </div>
      </Card>

      {/* Performance indicator */}
      <Card className="p-3">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-yellow-600" />
          <div className="text-sm">
            <div className="font-medium text-yellow-900">High Performance</div>
            <div className="text-yellow-700 text-xs">Low latency monitoring</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Real-time admin dashboard page metadata
 */
export const metadata = {
  title: 'Real-Time Admin Dashboard | White Cross',
  description: 'Live system monitoring, alerts, and performance metrics for administrators',
};

/**
 * Real-time admin dashboard page component
 */
export default function RealTimeAdminPage() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Page header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <span>Real-Time Admin Dashboard</span>
              <Badge variant="outline" className="ml-2">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Monitor system health, alerts, and performance metrics in real-time
            </p>
          </div>
          
          {/* Page actions could go here */}
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Status indicators */}
        <RealTimeStatusIndicators />
      </div>

      {/* Main content */}
      <Suspense fallback={<RealTimeDashboardSkeleton />}>
        <div className="space-y-8">
          {/* Real-time system health metrics */}
          <section>
            <SystemHealthMetricsRealTime 
              enableRealTime={true}
              refreshInterval={5000}
              className="w-full"
            />
          </section>

          {/* Dashboard layout */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Alerts panel - takes 2/3 width */}
            <section className="lg:col-span-2">
              <RealTimeAlertsPanel
                enableRealTime={true}
                maxAlerts={10}
                showDismissed={false}
                enableSound={true}
                className="w-full"
              />
            </section>

            {/* Sidebar content */}
            <section className="space-y-6">
              {/* Quick stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Quick Stats</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">WebSocket Connections</span>
                    <Badge variant="outline">47 active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Admin Sessions</span>
                    <Badge variant="outline">3 online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">System Uptime</span>
                    <Badge variant="outline">15d 7h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Sync Status</span>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
                      Synced
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* System overview */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">System Overview</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">CPU Usage</span>
                      <span className="font-medium">23.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${23.5}%` }} />
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className="font-medium">68.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full transition-all duration-300" style={{ width: `${68.2}%` }} />
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Disk Usage</span>
                      <span className="font-medium">45.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${45.8}%` }} />
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Network Load</span>
                      <span className="font-medium">12.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${12.3}%` }} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent activity preview */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">System backup completed</div>
                      <div className="text-gray-600 text-xs">2 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Database optimization finished</div>
                      <div className="text-gray-600 text-xs">15 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Memory usage spike detected</div>
                      <div className="text-gray-600 text-xs">1 hour ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Admin login: john@example.com</div>
                      <div className="text-gray-600 text-xs">2 hours ago</div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </Suspense>
    </div>
  );
}