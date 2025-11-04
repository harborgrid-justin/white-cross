/**
 * @fileoverview Reports Content Component - Main coordinator for healthcare reporting
 * @module app/(dashboard)/reports/_components/ReportsContent
 * @category Reports - Components
 *
 * This is the refactored version with improved component composition.
 * Original file: 706 lines
 * Refactored: ~180 lines (main component)
 * Split into:
 * - types.ts: Shared TypeScript interfaces
 * - utils.ts: Helper functions and formatters
 * - hooks/useReportsList.ts: Data fetching hook
 * - ReportsSummary.tsx: Statistics cards
 * - ReportTemplates.tsx: Template selection
 * - ReportHistory.tsx: Reports list with actions
 * - ReportActions.tsx: Bulk operations
 */

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Search, Plus, FileText } from 'lucide-react';

// Import sub-components
import { ReportsSummary } from './ReportsSummary';
import { ReportTemplates } from './ReportTemplates';
import { ReportHistory } from './ReportHistory';
import { ReportActions } from './ReportActions';

// Import hooks and types
import { useReportsList } from './hooks/useReportsList';
import type { ReportsContentProps } from './types';

/**
 * ReportsContent Component
 *
 * Main coordinator component for the healthcare reports dashboard.
 * Manages state and coordinates sub-components for a cohesive reporting experience.
 *
 * Architecture:
 * - Uses custom hook for data fetching (useReportsList)
 * - Delegates rendering to specialized sub-components
 * - Manages selection state for bulk operations
 * - Coordinates refresh and user actions
 *
 * Component Breakdown:
 * 1. ReportsSummary: Displays statistics (156 lines)
 * 2. ReportTemplates: Popular templates with quick access (150 lines)
 * 3. ReportHistory: Reports list with metadata and actions (250 lines)
 * 4. ReportActions: Quick actions and bulk operations (130 lines)
 *
 * @example
 * ```tsx
 * <ReportsContent
 *   searchParams={{
 *     page: '1',
 *     category: 'HEALTH',
 *     status: 'COMPLETED'
 *   }}
 * />
 * ```
 */
export function ReportsContent({ searchParams }: ReportsContentProps) {
  // Fetch reports data using custom hook
  const { summary, reports, templates, loading, error, refetch } = useReportsList(searchParams);

  // Local state for bulk selection
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());

  /**
   * Toggle report selection for bulk operations
   */
  const toggleReportSelection = useCallback((reportId: string) => {
    setSelectedReports((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  }, []);

  /**
   * Handle bulk download action
   */
  const handleBulkDownload = useCallback(() => {
    console.log('Bulk download:', Array.from(selectedReports));
    // TODO: Implement bulk download logic
  }, [selectedReports]);

  /**
   * Handle bulk email action
   */
  const handleBulkEmail = useCallback(() => {
    console.log('Bulk email:', Array.from(selectedReports));
    // TODO: Implement bulk email logic
  }, [selectedReports]);

  /**
   * Handle bulk delete action
   */
  const handleBulkDelete = useCallback(() => {
    console.log('Bulk delete:', Array.from(selectedReports));
    // TODO: Implement bulk delete logic
    setSelectedReports(new Set());
  }, [selectedReports]);

  /**
   * Handle template selection
   */
  const handleTemplateSelect = useCallback((templateId: string) => {
    console.log('Template selected:', templateId);
    // TODO: Navigate to report builder with template
  }, []);

  /**
   * Handle refresh action
   */
  const handleRefresh = useCallback(() => {
    refetch();
    setSelectedReports(new Set());
  }, [refetch]);

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load reports data</p>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Healthcare Reports</h1>
          <p className="text-gray-600">Generate, schedule, and manage comprehensive healthcare reports</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      {summary && <ReportsSummary summary={summary} loading={loading} />}

      {/* Quick Actions & Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ReportActions
          selectedCount={selectedReports.size}
          onBulkDownload={handleBulkDownload}
          onBulkEmail={handleBulkEmail}
          onBulkDelete={handleBulkDelete}
        />
        <ReportTemplates
          templates={templates}
          loading={loading}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>

      {/* Reports History */}
      <ReportHistory
        reports={reports}
        loading={loading}
        selectedReports={selectedReports}
        onToggleSelection={toggleReportSelection}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
