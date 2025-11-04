/**
 * @fileoverview Admin Quick Actions Component - Displays quick action buttons
 * @module app/(dashboard)/admin/_components/AdminQuickActions
 * @category Admin - Components
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserCheck,
  Settings,
  Monitor,
  FileText,
  Lock,
  Upload,
  Bell,
  BarChart3
} from 'lucide-react';

/**
 * Props for AdminQuickActions component
 */
interface AdminQuickActionsProps {
  /** Callback when managing users */
  onManageUsers?: () => void;
  /** Callback when opening system settings */
  onSystemSettings?: () => void;
  /** Callback when opening system monitor */
  onSystemMonitor?: () => void;
  /** Callback when viewing audit logs */
  onAuditLogs?: () => void;
  /** Callback when opening security center */
  onSecurityCenter?: () => void;
  /** Callback when importing data */
  onDataImport?: () => void;
  /** Callback when managing notifications */
  onNotifications?: () => void;
  /** Callback when viewing system reports */
  onSystemReports?: () => void;
  /** Optional: User permissions for permission-based rendering */
  permissions?: {
    canManageUsers?: boolean;
    canEditSettings?: boolean;
    canViewMonitor?: boolean;
    canViewAuditLogs?: boolean;
    canAccessSecurity?: boolean;
    canImportData?: boolean;
    canManageNotifications?: boolean;
    canViewReports?: boolean;
  };
}

/**
 * AdminQuickActions component
 *
 * Displays a grid of quick action buttons for common admin tasks.
 * Supports permission-based rendering to show only allowed actions.
 *
 * Future enhancements:
 * - Integrate with authentication/permission system
 * - Hide/disable buttons based on user role
 * - Add tooltips for disabled actions
 *
 * @example
 * ```tsx
 * <AdminQuickActions
 *   onManageUsers={() => console.log('Manage users')}
 *   onSystemSettings={() => console.log('Settings')}
 *   permissions={{ canManageUsers: true, canEditSettings: false }}
 * />
 * ```
 */
export const AdminQuickActions = React.memo<AdminQuickActionsProps>(({
  onManageUsers,
  onSystemSettings,
  onSystemMonitor,
  onAuditLogs,
  onSecurityCenter,
  onDataImport,
  onNotifications,
  onSystemReports,
  permissions = {}
}) => {
  // Default to showing all actions if no permissions provided
  const {
    canManageUsers = true,
    canEditSettings = true,
    canViewMonitor = true,
    canViewAuditLogs = true,
    canAccessSecurity = true,
    canImportData = true,
    canManageNotifications = true,
    canViewReports = true
  } = permissions;

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </div>
      <div className="p-6">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {canManageUsers && (
            <Button className="justify-start" onClick={onManageUsers}>
              <UserCheck className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          )}

          {canEditSettings && (
            <Button variant="outline" className="justify-start" onClick={onSystemSettings}>
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          )}

          {canViewMonitor && (
            <Button variant="outline" className="justify-start" onClick={onSystemMonitor}>
              <Monitor className="h-4 w-4 mr-2" />
              System Monitor
            </Button>
          )}

          {canViewAuditLogs && (
            <Button variant="outline" className="justify-start" onClick={onAuditLogs}>
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </Button>
          )}

          {canAccessSecurity && (
            <Button variant="outline" className="justify-start" onClick={onSecurityCenter}>
              <Lock className="h-4 w-4 mr-2" />
              Security Center
            </Button>
          )}

          {canImportData && (
            <Button variant="outline" className="justify-start" onClick={onDataImport}>
              <Upload className="h-4 w-4 mr-2" />
              Data Import
            </Button>
          )}

          {canManageNotifications && (
            <Button variant="outline" className="justify-start" onClick={onNotifications}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          )}

          {canViewReports && (
            <Button variant="outline" className="justify-start" onClick={onSystemReports}>
              <BarChart3 className="h-4 w-4 mr-2" />
              System Reports
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});

AdminQuickActions.displayName = 'AdminQuickActions';
