/**
 * @fileoverview Report Actions Component - Bulk operations and quick actions
 * @module app/(dashboard)/reports/_components/ReportActions
 * @category Reports - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Calendar,
  Download,
  Settings,
  Mail,
  Trash2
} from 'lucide-react';
import { pluralize } from './utils';
import type { ReportActionsProps } from './types';

/**
 * Quick Action Button Configuration
 */
interface QuickAction {
  label: string;
  icon: typeof Plus;
  variant: 'default' | 'outline';
  onClick?: () => void;
}

/**
 * ReportActions Component
 *
 * Provides quick actions and bulk operations for reports.
 *
 * Features:
 * - Quick action buttons (Create, Schedule, Export, Settings)
 * - Bulk operations (Download, Email, Delete)
 * - Conditional rendering based on selection
 * - Accessible button labels
 *
 * @example
 * ```tsx
 * <ReportActions
 *   selectedCount={3}
 *   onBulkDownload={() => console.log('Bulk download')}
 *   onBulkEmail={() => console.log('Email reports')}
 *   onBulkDelete={() => console.log('Delete reports')}
 * />
 * ```
 */
export function ReportActions({
  selectedCount,
  onBulkDownload,
  onBulkEmail,
  onBulkDelete
}: ReportActionsProps) {
  const quickActions: QuickAction[] = [
    {
      label: 'Create Report',
      icon: Plus,
      variant: 'default',
      onClick: () => console.log('Create report')
    },
    {
      label: 'Schedule Report',
      icon: Calendar,
      variant: 'outline',
      onClick: () => console.log('Schedule report')
    },
    {
      label: 'Bulk Export',
      icon: Download,
      variant: 'outline',
      onClick: () => console.log('Bulk export')
    },
    {
      label: 'Report Settings',
      icon: Settings,
      variant: 'outline',
      onClick: () => console.log('Settings')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  className="justify-start"
                  onClick={action.onClick}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Bulk Actions - Only show when reports are selected */}
      {selectedCount > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedCount} {pluralize(selectedCount, 'report')} selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDownload}
                  aria-label={`Download ${selectedCount} selected reports`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Bulk Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkEmail}
                  aria-label={`Email ${selectedCount} selected reports`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Reports
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDelete}
                  aria-label={`Delete ${selectedCount} selected reports`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
