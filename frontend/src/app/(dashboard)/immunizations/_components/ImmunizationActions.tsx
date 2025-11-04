/**
 * @fileoverview Immunization Actions Component
 * @module app/immunizations/components
 *
 * Provides action buttons and controls for immunization management.
 * Includes bulk actions, view mode switching, and primary actions.
 */

'use client';

import React from 'react';
import {
  Plus,
  Upload,
  Download,
  Calendar,
  Bell,
  List,
  Grid3x3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ViewMode } from './types/immunization.types';

interface ImmunizationActionsProps {
  selectedCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onScheduleImmunization?: () => void;
  onImportRecords?: () => void;
  onExportReport?: () => void;
  onBulkReschedule?: () => void;
  onBulkNotify?: () => void;
}

/**
 * ImmunizationActions component
 * Renders primary actions, bulk actions, and view mode controls
 */
export const ImmunizationActionsComponent: React.FC<ImmunizationActionsProps> = ({
  selectedCount,
  viewMode,
  onViewModeChange,
  onScheduleImmunization,
  onImportRecords,
  onExportReport,
  onBulkReschedule,
  onBulkNotify,
}) => {
  return (
    <Card>
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Primary Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="default" onClick={onScheduleImmunization}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Immunization
            </Button>

            <Button variant="outline" onClick={onImportRecords}>
              <Upload className="h-4 w-4 mr-2" />
              Import Records
            </Button>

            <Button variant="outline" onClick={onExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            {/* Bulk Actions (shown when items are selected) */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <span className="text-sm text-gray-600">{selectedCount} selected</span>
                <Button variant="outline" size="sm" onClick={onBulkReschedule}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Reschedule
                </Button>
                <Button variant="outline" size="sm" onClick={onBulkNotify}>
                  <Bell className="h-4 w-4 mr-1" />
                  Notify
                </Button>
              </div>
            )}
          </div>

          {/* View Mode Controls */}
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List view"
              aria-label="Switch to list view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('calendar')}
              className={`px-3 py-2 text-sm border-l border-gray-300 ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Calendar view"
              aria-label="Switch to calendar view"
              aria-pressed={viewMode === 'calendar'}
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('schedule')}
              className={`px-3 py-2 text-sm border-l border-gray-300 ${
                viewMode === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Schedule view"
              aria-label="Switch to schedule view"
              aria-pressed={viewMode === 'schedule'}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
