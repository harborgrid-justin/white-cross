/**
 * DocumentsSidebar Component (Refactored)
 * Main sidebar layout wrapper that composes individual sidebar section components
 *
 * This component serves as a layout wrapper for the document sidebar,
 * coordinating data fetching and composition of specialized sub-components:
 * - QuickStatsCard: Statistics overview
 * - DocumentAlertsCard: Alert notifications
 * - RecentDocumentsCard: Recently uploaded/modified documents
 * - RecentActivityCard: Activity feed
 * - QuickActionsCard: Common action buttons
 */

'use client';

import React from 'react';
import { QuickStatsCard } from './QuickStatsCard';
import { DocumentAlertsCard } from './DocumentAlertsCard';
import { RecentDocumentsCard } from './RecentDocumentsCard';
import { RecentActivityCard } from './RecentActivityCard';
import { QuickActionsCard } from './QuickActionsCard';
import { useSidebarData } from './useSidebarData';

interface DocumentsSidebarProps {
  className?: string;
  onUploadDocument?: () => void;
  onFilter?: () => void;
  onViewAllAlerts?: () => void;
  onViewActivityLog?: () => void;
  onRefreshDocuments?: () => void;
  onCreateTemplate?: () => void;
  onBulkExport?: () => void;
  onArchiveDocuments?: () => void;
  onReviewPermissions?: () => void;
  onScheduleCleanup?: () => void;
}

export const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({
  className = '',
  onUploadDocument,
  onFilter,
  onViewAllAlerts,
  onViewActivityLog,
  onRefreshDocuments,
  onCreateTemplate,
  onBulkExport,
  onArchiveDocuments,
  onReviewPermissions,
  onScheduleCleanup
}) => {
  // Fetch sidebar data using custom hook
  const { recentDocuments, recentActivity, documentAlerts, quickStats } = useSidebarData();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Statistics */}
      <QuickStatsCard stats={quickStats} />

      {/* Document Alerts */}
      <DocumentAlertsCard
        alerts={documentAlerts}
        onViewAllAlerts={onViewAllAlerts}
      />

      {/* Recent Documents */}
      <RecentDocumentsCard
        documents={recentDocuments}
        maxDisplay={8}
        onRefresh={onRefreshDocuments}
        onUpload={onUploadDocument}
        onFilter={onFilter}
      />

      {/* Recent Activity */}
      <RecentActivityCard
        activities={recentActivity}
        onViewActivityLog={onViewActivityLog}
      />

      {/* Quick Actions */}
      <QuickActionsCard
        onUploadDocument={onUploadDocument}
        onCreateTemplate={onCreateTemplate}
        onBulkExport={onBulkExport}
        onArchiveDocuments={onArchiveDocuments}
        onReviewPermissions={onReviewPermissions}
        onScheduleCleanup={onScheduleCleanup}
      />
    </div>
  );
};
