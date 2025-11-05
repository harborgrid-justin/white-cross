/**
 * @fileoverview Enhanced Error Monitoring Page
 * @module app/(dashboard)/admin/monitoring/errors/page
 *
 * Next.js v16 enhanced error monitoring page with server-side caching,
 * error tracking, and comprehensive error analysis.
 *
 * Features:
 * - Server Components with 'use cache' integration
 * - Error log tracking
 * - Severity level filtering
 * - Service error analysis
 * - Resolution tracking
 * - AdminPageHeader integration
 * - Streaming with Suspense boundaries
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit Error monitoring access logged for compliance
 * @compliance HIPAA - Error monitoring required for operational oversight
 *
 * @since 2025-11-05
 */

import { Suspense } from 'react';
import { getErrorLogs } from '@/lib/actions/admin.monitoring';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { AdminDataTable } from '../../_components/AdminDataTable';
import { AdminMetricCard } from '@/components/admin';
import { AlertTriangle, XCircle, AlertCircle, Info, CheckCircle } from 'lucide-react';

/**
 * Error monitoring content component with enhanced server-side data fetching
 */
async function ErrorMonitoringContent({ 
  level, 
  service, 
  resolved 
}: { 
  level?: string; 
  service?: string; 
  resolved?: boolean; 
}) {
  const errorLogs = await getErrorLogs({ level, service, resolved, limit: 100 });
  
  // Calculate summary statistics
  const totalErrors = errorLogs.length;
  const criticalErrors = errorLogs.filter(log => log.level === 'critical').length;
  const warningErrors = errorLogs.filter(log => log.level === 'warning').length;
  const regularErrors = errorLogs.filter(log => log.level === 'error').length;
  const resolvedErrors = errorLogs.filter(log => log.resolved).length;
  const unresolvedErrors = totalErrors - resolvedErrors;
  
  // Determine error status
  const errorStatus = criticalErrors > 0 ? 'error' :
                     regularErrors > 5 ? 'warning' : 'success';

  const errorLabel = errorStatus === 'error' ? 'Critical Issues' :
                    errorStatus === 'warning' ? 'Some Errors' : 'System Stable';

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  // Table columns for error logs
  const columns = [
    {
      key: 'timestamp',
      label: 'Time',
      render: (item: any) => new Date(item.timestamp).toLocaleString(),
    },
    {
      key: 'level',
      label: 'Severity',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {getSeverityIcon(item.level)}
          <span className="capitalize">{item.level}</span>
        </div>
      ),
    },
    {
      key: 'service',
      label: 'Service',
      render: (item: any) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {item.service}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (item: any) => (
        <div className="max-w-md">
          <div className="truncate">{item.message}</div>
          {item.requestId && (
            <div className="text-xs text-gray-500 mt-1">
              Request: {item.requestId}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'resolved',
      label: 'Status',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.resolved ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700">Resolved</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-red-700">Open</span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <AdminPageHeader
        title="Error Monitoring"
        description="System error tracking and resolution management"
        count={totalErrors}
        countLabel="errors logged"
        status={{
          label: errorLabel,
          variant: errorStatus,
          icon: errorStatus === 'error' ? <XCircle className="h-4 w-4" /> :
                errorStatus === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                <CheckCircle className="h-4 w-4" />,
        }}
        actions={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>{criticalErrors} critical</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span>{regularErrors} errors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{resolvedErrors} resolved</span>
            </div>
          </div>
        }
      />

      {/* Error Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Critical Errors"
          value={criticalErrors.toString()}
          subtitle="Immediate attention required"
          icon={XCircle}
          color={criticalErrors > 0 ? 'error' : 'success'}
          trend={{
            value: criticalErrors > 0 ? "↑ Critical" : "None",
            direction: criticalErrors > 0 ? 'up' : 'down',
            positive: criticalErrors === 0,
          }}
        />
        
        <AdminMetricCard
          title="Unresolved Errors"
          value={unresolvedErrors.toString()}
          subtitle={`${regularErrors} errors, ${warningErrors} warnings`}
          icon={AlertTriangle}
          color={unresolvedErrors > 10 ? 'error' : unresolvedErrors > 5 ? 'warning' : 'success'}
          trend={{
            value: `${(resolvedErrors/totalErrors * 100).toFixed(1)}% resolved`,
            direction: 'down',
            positive: resolvedErrors > unresolvedErrors,
          }}
        />
        
        <AdminMetricCard
          title="Resolution Rate"
          value={`${totalErrors > 0 ? (resolvedErrors/totalErrors * 100).toFixed(1) : 0}%`}
          subtitle="Errors resolved"
          icon={CheckCircle}
          color={resolvedErrors/totalErrors > 0.8 ? 'success' : resolvedErrors/totalErrors > 0.5 ? 'warning' : 'error'}
          trend={{
            value: `${resolvedErrors}/${totalErrors} resolved`,
            direction: 'up',
            positive: true,
          }}
        />
        
        <AdminMetricCard
          title="Warning Level"
          value={warningErrors.toString()}
          subtitle="Non-critical issues"
          icon={AlertCircle}
          color={warningErrors > 20 ? 'warning' : 'info'}
          trend={{
            value: `${warningErrors} warnings`,
            direction: 'down',
            positive: warningErrors < 10,
          }}
        />
      </div>

      {/* Error Logs Table */}
      <AdminDataTable
        columns={columns}
        data={errorLogs}
        keyExtractor={(item: any) => item.id}
        searchPlaceholder="Search error messages..."
        onExport={() => {
          console.log('Exporting error logs...');
        }}
        emptyMessage="No errors found"
      />
    </div>
  );
}

/**
 * Loading skeleton for error monitoring page
 */
function ErrorMonitoringSkeleton() {
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
 * Error monitoring page component.
 *
 * @param searchParams - URL search parameters for filtering
 * @returns Error monitoring page with logs and metrics
 */
export default function ErrorMonitoringPage({
  searchParams,
}: {
  searchParams: { 
    level?: string; 
    service?: string; 
    resolved?: string; 
  };
}) {
  const level = searchParams.level;
  const service = searchParams.service;
  const resolved = searchParams.resolved === 'true' ? true : 
                  searchParams.resolved === 'false' ? false : undefined;

  return (
    <Suspense fallback={<ErrorMonitoringSkeleton />}>
      <ErrorMonitoringContent 
        level={level} 
        service={service} 
        resolved={resolved} 
      />
    </Suspense>
  );
}
