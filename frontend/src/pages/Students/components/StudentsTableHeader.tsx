/**
 * Students Table Header Component
 *
 * Displays table header with student count and selection controls
 */

import React from 'react';
import StudentsBulkActions from './StudentsBulkActions';

interface StudentsTableHeaderProps {
  showArchived: boolean;
  totalCount: number;
  selectedCount: number;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onExport: () => void;
  onBulkArchive: () => void;
}

/**
 * Header component for students table with bulk actions
 */
export default function StudentsTableHeader({
  showArchived,
  totalCount,
  selectedCount,
  allSelected,
  onSelectAll,
  onExport,
  onBulkArchive,
}: StudentsTableHeaderProps) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {showArchived ? 'Archived Students' : 'Students'}{' '}
        <span data-testid={showArchived ? 'archived-count' : 'student-count'}>
          ({totalCount} {totalCount === 1 ? 'student' : 'students'})
        </span>
      </h3>
      <div className="flex items-center space-x-4">
        <StudentsBulkActions
          selectedCount={selectedCount}
          showArchived={showArchived}
          onExport={onExport}
          onBulkArchive={onBulkArchive}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            data-testid="select-all-checkbox"
            className="rounded"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <span className="text-sm text-gray-600">Select All</span>
        </div>
      </div>
    </div>
  );
}
