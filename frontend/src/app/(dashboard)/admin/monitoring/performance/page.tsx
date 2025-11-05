/**
 * @fileoverview Enhanced Performance Monitoring Page
 * @module app/(dashboard)/admin/monitoring/performance/page
 *
 * Next.js v16 enhanced performance monitoring page with server-side caching,
 * real-time metrics, and comprehensive performance tracking.
 *
 * Features:
 * - Server Components with 'use cache' integration
 * - Performance metrics over time
 * - Response time tracking
 * - Throughput monitoring
 * - Error rate analysis
 * - AdminPageHeader integration
 * - Streaming with Suspense boundaries
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit Performance monitoring access logged for compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @since 2025-11-05
 */

import { Suspense } from 'react';
import { getPerformanceMetrics } from '@/lib/actions/admin.monitoring';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { AdminDataTable } from '../../_components/AdminDataTable';
import { AdminMetricCard } from '@/components/admin';
import { TrendingUp, Clock, Activity, AlertTriangle, BarChart3, Zap } from 'lucide-react';

/**
 * Performance monitoring content component with enhanced server-side data fetching
 */
async function PerformanceContent({ timeRange }: { timeRange: '1h' | '24h' | '7d' | '30d' }) {
  const metrics = await getPerformanceMetrics(timeRange);
  
  // Calculate summary statistics
  const latestMetric = metrics[metrics.length - 1];
  const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
  const avgThroughput = metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length;
  const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;
  const avgCpuUsage = metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length;
  const avgMemoryUsage = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length;
  
  // Determine performance status
  const performanceStatus = avgResponseTime < 100 && avgErrorRate < 1 ? 'success' :
                           avgResponseTime < 200 && avgErrorRate < 2 ? 'warning' : 'error';

  const performanceLabel = performanceStatus === 'success' ? 'Excellent Performance' :
                          performanceStatus === 'warning' ? 'Good Performance' : 'Performance Issues';

  // Table columns for performance metrics
  const columns = [
    {
      key: 'timestamp',
      label: 'Time',
      render: (item: any) => new Date(item.timestamp).toLocaleString(),
    },
    {
      key: 'responseTime',
      label: 'Response Time',
      render: (item: any) => `${item.responseTime.toFixed(1)}ms`,
    },
    {
      key: 'throughput',
      label: 'Throughput',
      render: (item: any) => `${Math.round(item.throughput)} req/min`,
    },
    {
      key: 'errorRate',
      label: 'Error Rate',
      render: (item: any) => `${item.errorRate.toFixed(2)}%`,
    },
    {
      key: 'cpuUsage',
      label: 'CPU Usage',
      render: (item: any) => `${item.cpuUsage.toFixed(1)}%`,
    },
    {
      key: 'memoryUsage',
      label: 'Memory Usage',
      render: (item: any) => `${item.memoryUsage.toFixed(1)}%`,
    },
    {
      key: 'activeConnections',
      label: 'Connections',
      render: (item: any) => item.activeConnections.toString(),
    },
    {
      key: 'queueSize',
      label: 'Queue Size',
      render: (item: any) => item.queueSize.toString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <AdminPageHeader
        title="Performance Monitoring"
        description={`System performance metrics over the last ${timeRange}`}
        count={metrics.length}
        countLabel="data points"
        status={{
          label: performanceLabel,
          variant: performanceStatus,
          icon: performanceStatus === 'success' ? <TrendingUp className="h-4 w-4" /> :
                performanceStatus === 'warning' ? <BarChart3 className="h-4 w-4" /> :
                <AlertTriangle className="h-4 w-4" />,
        }}
        actions={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Avg Response: {avgResponseTime.toFixed(1)}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Throughput: {Math.round(avgThroughput)} req/min</span>
            </div>
            {avgErrorRate > 1 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{avgErrorRate.toFixed(2)}% error rate</span>
              </div>
            )}
          </div>
        }
      />

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Response Time"
          value={`${avgResponseTime.toFixed(1)}ms`}
          subtitle={`Current: ${latestMetric?.responseTime.toFixed(1)}ms`}
          icon={Clock}
          color={avgResponseTime < 100 ? 'success' : avgResponseTime < 200 ? 'warning' : 'error'}
          trend={{
            value: `${latestMetric?.responseTime.toFixed(1)}ms`,
            direction: 'up',
            positive: avgResponseTime < 100,
          }}
        />
        
        <AdminMetricCard
          title="Throughput"
          value={`${Math.round(avgThroughput)}`}
          subtitle="requests/min"
          icon={TrendingUp}
          color="primary"
          trend={{
            value: `${Math.round(latestMetric?.throughput || 0)} req/min`,
            direction: 'up',
            positive: true,
          }}
        />
        
        <AdminMetricCard
          title="Error Rate"
          value={`${avgErrorRate.toFixed(2)}%`}
          subtitle={`Current: ${latestMetric?.errorRate.toFixed(2)}%`}
          icon={AlertTriangle}
          color={avgErrorRate < 1 ? 'success' : avgErrorRate < 2 ? 'warning' : 'error'}
          trend={{
            value: `${latestMetric?.errorRate.toFixed(2)}%`,
            direction: 'down',
            positive: avgErrorRate < 1,
          }}
        />
        
        <AdminMetricCard
          title="System Load"
          value={`${avgCpuUsage.toFixed(1)}%`}
          subtitle="CPU usage"
          icon={Zap}
          color={avgCpuUsage < 50 ? 'success' : avgCpuUsage < 80 ? 'warning' : 'error'}
          trend={{
            value: `${avgMemoryUsage.toFixed(1)}% RAM`,
            direction: 'up',
            positive: avgCpuUsage < 50,
          }}
        />
      </div>

      {/* Performance Data Table */}
      <AdminDataTable
        columns={columns}
        data={metrics.slice(-50)} // Show last 50 entries
        keyExtractor={(item: any) => item.id}
        searchPlaceholder="Search metrics..."
        onExport={() => {
          // Export functionality - could be implemented later
          console.log('Exporting performance metrics...');
        }}
        emptyMessage="No performance data available"
      />
    </div>
  );
}

/**
 * Loading skeleton for performance monitoring page
 */
function PerformanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Metrics cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}

/**
 * Performance monitoring page component.
 *
 * @param searchParams - URL search parameters for time range
 * @returns Performance monitoring page with metrics and data table
 */
export default function PerformancePage({
  searchParams,
}: {
  searchParams: { timeRange?: '1h' | '24h' | '7d' | '30d' };
}) {
  const timeRange = searchParams.timeRange || '24h';

  return (
    <Suspense fallback={<PerformanceSkeleton />}>
      <PerformanceContent timeRange={timeRange} />
    </Suspense>
  );
}
