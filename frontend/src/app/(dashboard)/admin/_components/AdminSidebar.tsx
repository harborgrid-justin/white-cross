/**
 * @fileoverview Admin Sidebar Component - Main layout wrapper for admin navigation
 * @module app/(dashboard)/admin/_components/AdminSidebar
 * @category Admin - Components
 *
 * @description
 * Refactored admin sidebar that composes smaller, focused components:
 * - AdminNavigationMenu: Primary navigation for admin modules
 * - QuickActionsPanel: Fast access to common tasks
 * - SystemStatusWidget: Real-time system metrics
 * - SystemAlertsPanel: Critical system alerts
 * - AdminActivityLog: Recent admin actions
 * - SystemToolsPanel: Administrative utilities
 *
 * @example
 * ```tsx
 * <AdminSidebar className="sticky top-0" />
 * ```
 */

'use client';

import { useRouter } from 'next/navigation';
import {
  AdminNavigationMenu,
  SystemStatusWidget,
  SystemAlertsPanel,
  AdminActivityLog,
  QuickActionsPanel,
  SystemToolsPanel,
  useAdminSidebar,
  adminModules,
  systemMetrics,
  quickActions,
  systemAlerts,
  recentActivity,
  systemTools,
} from './sidebar';
import type { QuickAction } from './sidebar';

interface AdminSidebarProps {
  /**
   * Additional CSS classes for the sidebar container
   */
  className?: string;
}

/**
 * Admin Sidebar Component
 *
 * Main sidebar layout for the admin dashboard that provides:
 * - Navigation to admin modules
 * - Quick access to common tasks
 * - Real-time system monitoring
 * - Alert notifications
 * - Activity tracking
 * - System tools
 *
 * The component uses the useAdminSidebar hook to manage section
 * expansion state across all sidebar sections.
 *
 * @component
 * @param props - Component props
 * @returns Rendered admin sidebar
 */
export function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const router = useRouter();
  const {
    isExpanded,
    toggleSection,
  } = useAdminSidebar();

  /**
   * Handle navigation from admin modules
   */
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  /**
   * Handle quick action clicks
   */
  const handleQuickAction = (action: QuickAction) => {
    if (action.href) {
      handleNavigation(action.href);
    } else if (action.action) {
      action.action();
    }
  };

  /**
   * Handle system metrics refresh
   */
  const handleMetricsRefresh = () => {
    // Refresh system metrics
    window.location.reload();
  };

  /**
   * Handle view all alerts
   */
  const handleViewAllAlerts = () => {
    handleNavigation('/admin/settings/configuration');
  };

  /**
   * Handle view activity log
   */
  const handleViewActivityLog = () => {
    handleNavigation('/admin/settings/audit-logs');
  };

  return (
    <div className={`w-80 flex-shrink-0 ${className}`}>
      <div className="space-y-6">
        {/* Primary Navigation */}
        <AdminNavigationMenu
          modules={adminModules}
          isExpanded={isExpanded('modules')}
          onToggle={() => toggleSection('modules')}
          onNavigate={handleNavigation}
        />

        {/* Quick Actions */}
        <QuickActionsPanel
          actions={quickActions}
          isExpanded={isExpanded('actions')}
          onToggle={() => toggleSection('actions')}
          onActionClick={handleQuickAction}
        />

        {/* System Metrics */}
        <SystemStatusWidget
          metrics={systemMetrics}
          isExpanded={isExpanded('metrics')}
          onToggle={() => toggleSection('metrics')}
          onRefresh={handleMetricsRefresh}
        />

        {/* System Alerts */}
        <SystemAlertsPanel
          alerts={systemAlerts}
          isExpanded={isExpanded('alerts')}
          onToggle={() => toggleSection('alerts')}
          onViewAll={handleViewAllAlerts}
        />

        {/* Recent Activity */}
        <AdminActivityLog
          activities={recentActivity}
          onViewAll={handleViewActivityLog}
        />

        {/* System Tools */}
        <SystemToolsPanel tools={systemTools} />
      </div>
    </div>
  );
}
