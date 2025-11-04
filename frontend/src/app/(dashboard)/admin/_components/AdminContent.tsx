/**
 * @fileoverview Admin Content Component - Healthcare system administration dashboard
 * @module app/(dashboard)/admin/_components/AdminContent
 * @category Admin - Components
 */

'use client';

import { Shield, RefreshCw, Download, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AdminContentProps } from './admin-types';
import { useAdminData } from './hooks/useAdminData';
import { SystemHealthMetrics } from './SystemHealthMetrics';
import { AdminQuickActions } from './AdminQuickActions';
import { SystemAlerts } from './SystemAlerts';
import { UserSummary } from './UserSummary';
import { AdminActivityLog } from './AdminActivityLog';

/**
 * AdminContent component
 *
 * Main dashboard for system administration. Orchestrates sub-components
 * to display comprehensive admin information including:
 * - System health metrics
 * - Quick action buttons
 * - System alerts
 * - User summaries
 * - Activity audit log
 *
 * Refactored from 715 lines to ~150 lines by extracting focused sub-components.
 *
 * @param searchParams - URL search parameters for filtering and pagination
 */
export function AdminContent({ searchParams }: AdminContentProps) {
  const { data, loading, error, refresh } = useAdminData(searchParams);
  const { systemStats, adminActivity, systemAlerts, userSummary } = data;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {['admin-loading-card-1', 'admin-loading-card-2', 'admin-loading-card-3', 'admin-loading-card-4'].map((id) => (
            <Card key={id}>
              <div className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {['admin-loading-item-1', 'admin-loading-item-2', 'admin-loading-item-3'].map((id) => (
                  <div key={id} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 font-medium mb-2">Error loading admin dashboard</p>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <Button onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // No data state
  if (!systemStats) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load admin dashboard</p>
      </div>
    );
  }

  // Handler functions for child component actions
  const handleRefresh = () => {
    refresh();
  };

  const handleExportLogs = () => {
    console.log('Export logs');
    // TODO: Implement log export functionality
  };

  const handleAdminAction = () => {
    console.log('Admin action');
    // TODO: Implement admin action modal
  };

  const handleViewAlert = (alertId: string) => {
    console.log('View alert:', alertId);
    // TODO: Implement alert detail view
  };

  const handleViewAllAlerts = () => {
    console.log('View all alerts');
    // TODO: Navigate to alerts page
  };

  const handleManageUsers = () => {
    console.log('Manage users');
    // TODO: Navigate to user management page
  };

  const handleFilter = () => {
    console.log('Filter activities');
    // TODO: Implement filter modal
  };

  const handleSearch = () => {
    console.log('Search activities');
    // TODO: Implement search modal
  };

  const handleExportActivities = () => {
    console.log('Export activities');
    // TODO: Implement activity export
  };

  const handleViewAuditLog = () => {
    console.log('View full audit log');
    // TODO: Navigate to full audit log page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600">Healthcare platform management and monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
          <Button onClick={handleAdminAction}>
            <Plus className="h-4 w-4 mr-2" />
            Admin Action
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <SystemHealthMetrics systemStats={systemStats} />

      {/* Quick Actions */}
      <AdminQuickActions
        onManageUsers={handleManageUsers}
        onSystemSettings={() => console.log('System settings')}
        onSystemMonitor={() => console.log('System monitor')}
        onAuditLogs={handleViewAuditLog}
        onSecurityCenter={() => console.log('Security center')}
        onDataImport={() => console.log('Data import')}
        onNotifications={() => console.log('Notifications')}
        onSystemReports={() => console.log('System reports')}
      />

      {/* System Alerts and User Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <SystemAlerts
          systemAlerts={systemAlerts}
          onViewAlert={handleViewAlert}
          onViewAllAlerts={handleViewAllAlerts}
        />

        <UserSummary
          userSummary={userSummary}
          onManageUsers={handleManageUsers}
        />
      </div>

      {/* Recent Admin Activity */}
      <AdminActivityLog
        adminActivity={adminActivity}
        onFilter={handleFilter}
        onSearch={handleSearch}
        onExport={handleExportActivities}
        onViewAuditLog={handleViewAuditLog}
      />
    </div>
  );
}
