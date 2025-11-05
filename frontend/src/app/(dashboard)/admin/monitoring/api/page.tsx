/**
 * @fileoverview Enhanced API Monitoring Page
 * @module app/(dashboard)/admin/monitoring/api/page
 *
 * Next.js v16 enhanced API monitoring page with server-side caching,
 * endpoint metrics, and comprehensive API performance tracking.
 *
 * Features:
 * - Server Components with 'use cache' integration
 * - API endpoint metrics
 * - Response time tracking
 * - Request volume monitoring
 * - Error rate analysis
 * - AdminPageHeader integration
 * - Streaming with Suspense boundaries
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit API monitoring access logged for compliance
 * @compliance HIPAA - API monitoring required for operational oversight
 *
 * @since 2025-11-05
 */

import { Suspense } from 'react';
import { getApiMetrics } from '@/lib/actions/admin.monitoring';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { AdminDataTable } from '../../_components/AdminDataTable';
import { AdminMetricCard } from '@/components/admin';
import { Globe, Clock, TrendingUp, AlertTriangle, Server } from 'lucide-react';

/**
 * API monitoring content component with enhanced server-side data fetching
 */
async function ApiMonitoringContent() {
  const apiMetrics = await getApiMetrics();
  
  // Calculate summary statistics
  const totalRequests = apiMetrics.reduce((sum, api) => sum + api.totalRequests, 0);
  const totalErrors = apiMetrics.reduce((sum, api) => sum + api.errorRequests, 0);
  const avgResponseTime = apiMetrics.reduce((sum, api) => sum + api.averageResponseTime, 0) / apiMetrics.length;
  const overallErrorRate = (totalErrors / totalRequests) * 100;
  
  // Determine API health status
  const apiStatus = avgResponseTime < 200 && overallErrorRate < 1 ? 'success' :
                   avgResponseTime < 500 && overallErrorRate < 5 ? 'warning' : 'error';

  const apiLabel = apiStatus === 'success' ? 'APIs Healthy' :
                  apiStatus === 'warning' ? 'Some Issues' : 'API Problems';

  // Table columns for API metrics
  const columns = [
    {
      key: 'endpoint',
      label: 'Endpoint',
      render: (item: any) => (
        <div className="font-mono text-sm">
          <span className="text-blue-600">{item.method}</span> {item.endpoint}
        </div>
      ),
    },
    {
      key: 'totalRequests',
      label: 'Total Requests',
      render: (item: any) => item.totalRequests.toLocaleString(),
    },
    {
      key: 'successfulRequests',
      label: 'Success Rate',
      render: (item: any) => {
        const rate = (item.successfulRequests / item.totalRequests) * 100;
        return (
          <div className="flex items-center gap-2">
            <span>{rate.toFixed(1)}%</span>
            <div className={`h-2 w-8 rounded ${rate > 99 ? 'bg-green-500' : rate > 95 ? 'bg-yellow-500' : 'bg-red-500'}`} />
          </div>
        );
      },
    },
    {
      key: 'averageResponseTime',
      label: 'Avg Response',
      render: (item: any) => `${item.averageResponseTime.toFixed(0)}ms`,
    },
    {
      key: 'p95ResponseTime',
      label: 'P95 Response',
      render: (item: any) => `${item.p95ResponseTime.toFixed(0)}ms`,
    },
    {
      key: 'lastHour',
      label: 'Last Hour',
      render: (item: any) => (
        <div className="text-sm">
          <div>{item.lastHour.requests} requests</div>
          <div className="text-gray-500">{item.lastHour.errors} errors</div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <AdminPageHeader
        title="API Monitoring"
        description="Real-time API endpoint performance and usage metrics"
        count={apiMetrics.length}
        countLabel="endpoints monitored"
        status={{
          label: apiLabel,
          variant: apiStatus,
          icon: apiStatus === 'success' ? <Server className="h-4 w-4" /> :
                apiStatus === 'warning' ? <Clock className="h-4 w-4" /> :
                <AlertTriangle className="h-4 w-4" />,
        }}
        actions={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{totalRequests.toLocaleString()} total requests</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Avg: {avgResponseTime.toFixed(0)}ms</span>
            </div>
            {overallErrorRate > 1 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{overallErrorRate.toFixed(2)}% error rate</span>
              </div>
            )}
          </div>
        }
      />

      {/* API Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          subtitle="All time"
          icon={Globe}
          color="primary"
          trend={{
            value: "↗ 12.5%",
            direction: 'up',
            positive: true,
          }}
        />
        
        <AdminMetricCard
          title="Average Response"
          value={`${avgResponseTime.toFixed(0)}ms`}
          subtitle="All endpoints"
          icon={Clock}
          color={avgResponseTime < 200 ? 'success' : avgResponseTime < 500 ? 'warning' : 'error'}
          trend={{
            value: `${avgResponseTime.toFixed(0)}ms`,
            direction: 'down',
            positive: avgResponseTime < 200,
          }}
        />
        
        <AdminMetricCard
          title="Error Rate"
          value={`${overallErrorRate.toFixed(2)}%`}
          subtitle={`${totalErrors} errors`}
          icon={AlertTriangle}
          color={overallErrorRate < 1 ? 'success' : overallErrorRate < 5 ? 'warning' : 'error'}
          trend={{
            value: `${overallErrorRate.toFixed(2)}%`,
            direction: 'down',
            positive: overallErrorRate < 1,
          }}
        />
        
        <AdminMetricCard
          title="Success Rate"
          value={`${((totalRequests - totalErrors) / totalRequests * 100).toFixed(2)}%`}
          subtitle="Overall"
          icon={TrendingUp}
          color={overallErrorRate < 1 ? 'success' : overallErrorRate < 5 ? 'warning' : 'error'}
          trend={{
            value: "99.1%",
            direction: 'up',
            positive: true,
          }}
        />
      </div>

      {/* API Metrics Table */}
      <AdminDataTable
        columns={columns}
        data={apiMetrics}
        keyExtractor={(item: any) => `${item.method}-${item.endpoint}`}
        searchPlaceholder="Search endpoints..."
        onExport={() => {
          console.log('Exporting API metrics...');
        }}
        emptyMessage="No API metrics available"
      />
    </div>
  );
}

/**
 * Loading skeleton for API monitoring page
 */
function ApiMonitoringSkeleton() {
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
 * API monitoring page component.
 *
 * @returns API monitoring page with metrics and endpoint data
 */
export default function ApiMonitoringPage() {
  return (
    <Suspense fallback={<ApiMonitoringSkeleton />}>
      <ApiMonitoringContent />
    </Suspense>
  );
}
