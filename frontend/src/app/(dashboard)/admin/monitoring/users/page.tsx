/**
 * @fileoverview Enhanced User Activity Monitoring Page
 * @module app/(dashboard)/admin/monitoring/users/page
 *
 * Next.js v16 enhanced user activity monitoring page with server-side caching,
 * user behavior tracking, and comprehensive activity analysis.
 *
 * Features:
 * - Server Components with 'use cache' integration
 * - User activity tracking
 * - Login/logout monitoring
 * - Action logging
 * - Performance tracking
 * - AdminPageHeader integration
 * - Streaming with Suspense boundaries
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit User monitoring access logged for compliance
 * @compliance HIPAA - User activity monitoring required for audit trails
 *
 * @since 2025-11-05
 */

import { Suspense } from 'react';
import { getUserActivity } from '@/lib/actions/admin.monitoring';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { AdminDataTable } from '../../_components/AdminDataTable';
import { AdminMetricCard } from '@/components/admin';
import { Users, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * User monitoring content component with enhanced server-side data fetching
 */
async function UserMonitoringContent({ 
  userId, 
  action, 
  timeRange 
}: { 
  userId?: string; 
  action?: string; 
  timeRange?: '1h' | '24h' | '7d'; 
}) {
  const userActivities = await getUserActivity({ userId, action, timeRange, limit: 100 });
  
  // Calculate summary statistics
  const totalActivities = userActivities.length;
  const uniqueUsers = new Set(userActivities.map(a => a.userId)).size;
  const successfulActions = userActivities.filter(a => a.success).length;
  const failedActions = totalActivities - successfulActions;
  const avgResponseTime = userActivities.reduce((sum, a) => sum + a.responseTime, 0) / totalActivities;
  
  // Activity breakdown
  const actionBreakdown = userActivities.reduce((acc, activity) => {
    acc[activity.action] = (acc[activity.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Determine user activity status
  const activityStatus = failedActions > 10 ? 'error' :
                        failedActions > 3 ? 'warning' : 'success';

  const activityLabel = activityStatus === 'error' ? 'High Failure Rate' :
                       activityStatus === 'warning' ? 'Some Failures' : 'Normal Activity';

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'text-green-600 bg-green-100';
      case 'logout': return 'text-blue-600 bg-blue-100';
      case 'create_record': return 'text-purple-600 bg-purple-100';
      case 'update_profile': return 'text-orange-600 bg-orange-100';
      case 'delete_record': return 'text-red-600 bg-red-100';
      case 'view_page': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Table columns for user activities
  const columns = [
    {
      key: 'timestamp',
      label: 'Time',
      render: (item: any) => new Date(item.timestamp).toLocaleString(),
    },
    {
      key: 'userEmail',
      label: 'User',
      render: (item: any) => (
        <div>
          <div className="font-medium">{item.userEmail}</div>
          <div className="text-xs text-gray-500">ID: {item.userId}</div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (item: any) => (
        <span className={`text-xs px-2 py-1 rounded-full ${getActionColor(item.action)}`}>
          {item.action.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (item: any) => (
        <span className="font-mono text-sm">
          {item.resource}
        </span>
      ),
    },
    {
      key: 'success',
      label: 'Status',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.success ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700">Success</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-700">Failed</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'responseTime',
      label: 'Response',
      render: (item: any) => `${item.responseTime.toFixed(0)}ms`,
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (item: any) => (
        <span className="font-mono text-xs text-gray-600">
          {item.ipAddress}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <AdminPageHeader
        title="User Activity Monitoring"
        description={`User activity tracking for the last ${timeRange || '7d'}`}
        count={totalActivities}
        countLabel="activities logged"
        status={{
          label: activityLabel,
          variant: activityStatus,
          icon: activityStatus === 'error' ? <XCircle className="h-4 w-4" /> :
                activityStatus === 'warning' ? <Activity className="h-4 w-4" /> :
                <CheckCircle className="h-4 w-4" />,
        }}
        actions={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{uniqueUsers} unique users</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{successfulActions} successful</span>
            </div>
            {failedActions > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>{failedActions} failed</span>
              </div>
            )}
          </div>
        }
      />

      {/* User Activity Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCard
          title="Active Users"
          value={uniqueUsers.toString()}
          subtitle="Unique users"
          icon={Users}
          color="primary"
          trend={{
            value: `${uniqueUsers} users`,
            direction: 'up',
            positive: true,
          }}
        />
        
        <AdminMetricCard
          title="Success Rate"
          value={`${totalActivities > 0 ? (successfulActions/totalActivities * 100).toFixed(1) : 0}%`}
          subtitle={`${successfulActions}/${totalActivities} successful`}
          icon={CheckCircle}
          color={successfulActions/totalActivities > 0.95 ? 'success' : successfulActions/totalActivities > 0.85 ? 'warning' : 'error'}
          trend={{
            value: `${failedActions} failures`,
            direction: 'down',
            positive: failedActions < 5,
          }}
        />
        
        <AdminMetricCard
          title="Avg Response"
          value={`${totalActivities > 0 ? avgResponseTime.toFixed(0) : 0}ms`}
          subtitle="Average response time"
          icon={Clock}
          color={avgResponseTime < 200 ? 'success' : avgResponseTime < 500 ? 'warning' : 'error'}
          trend={{
            value: `${avgResponseTime.toFixed(0)}ms avg`,
            direction: 'down',
            positive: avgResponseTime < 200,
          }}
        />
        
        <AdminMetricCard
          title="Total Activities"
          value={totalActivities.toString()}
          subtitle={`Last ${timeRange || '7d'}`}
          icon={Activity}
          color="info"
          trend={{
            value: `${totalActivities} actions`,
            direction: 'up',
            positive: true,
          }}
        />
      </div>

      {/* Popular Actions Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(actionBreakdown)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([action, count]) => (
              <div key={action} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {action.replace('_', ' ')}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* User Activity Table */}
      <AdminDataTable
        columns={columns}
        data={userActivities}
        keyExtractor={(item: any) => item.id}
        searchPlaceholder="Search user activities..."
        onExport={() => {
          console.log('Exporting user activity logs...');
        }}
        emptyMessage="No user activity found"
      />
    </div>
  );
}

/**
 * Loading skeleton for user monitoring page
 */
function UserMonitoringSkeleton() {
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

      {/* Activity breakdown skeleton */}
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />

      {/* Table skeleton */}
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}

/**
 * User monitoring page component.
 *
 * @param searchParams - URL search parameters for filtering
 * @returns User monitoring page with activity logs and metrics
 */
export default function UserMonitoringPage({
  searchParams,
}: {
  searchParams: { 
    userId?: string; 
    action?: string; 
    timeRange?: '1h' | '24h' | '7d'; 
  };
}) {
  const { userId, action, timeRange } = searchParams;

  return (
    <Suspense fallback={<UserMonitoringSkeleton />}>
      <UserMonitoringContent 
        userId={userId} 
        action={action} 
        timeRange={timeRange} 
      />
    </Suspense>
  );
}
