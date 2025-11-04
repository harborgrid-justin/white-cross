/**
 * @fileoverview Bulk Action Bar Component
 * @module app/(dashboard)/students/_components/BulkActionBar
 * @category Students - Components
 *
 * Action bar component for bulk operations on selected students.
 * Displays selection count and provides action buttons like export.
 *
 * @example
 * ```tsx
 * <BulkActionBar
 *   selectedCount={5}
 *   onExport={handleExport}
 * />
 * ```
 */

'use client';

import { memo, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

/**
 * Props for the BulkActionBar component
 */
export interface BulkActionBarProps {
  /**
   * Number of students currently selected
   */
  selectedCount: number;

  /**
   * Callback when export button is clicked
   */
  onExport: () => void;
}

/**
 * BulkActionBar Component
 * Displays selection count and bulk action buttons
 *
 * RESPONSIVE DESIGN:
 * - Stacks on mobile, horizontal on desktop
 * - Icons with text on desktop, icons only on mobile
 *
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 * ACCESSIBILITY: Proper button labels and aria-labels
 */
const BulkActionBar: FC<BulkActionBarProps> = memo(({ selectedCount, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
      <h2 className="text-lg font-semibold text-gray-900">Students</h2>
      <div className="flex items-center gap-2 flex-wrap">
        {selectedCount > 0 && (
          <>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {selectedCount} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex-shrink-0"
              aria-label={`Export ${selectedCount} selected students`}
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </>
        )}
        <Button
          size="sm"
          onClick={() => window.location.href = '/students/new'}
          className="flex-shrink-0"
          aria-label="Add new student"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Student</span>
        </Button>
      </div>
    </div>
  );
});

BulkActionBar.displayName = 'BulkActionBar';

export { BulkActionBar };
