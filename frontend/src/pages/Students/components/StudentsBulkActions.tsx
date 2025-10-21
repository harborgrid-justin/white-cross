/**
 * WF-COMP-240 | StudentsBulkActions.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Students Bulk Actions Component
 *
 * Displays bulk action controls for selected students
 */

import React from 'react';

interface StudentsBulkActionsProps {
  selectedCount: number;
  showArchived: boolean;
  onExport: () => void;
  onBulkArchive: () => void;
}

/**
 * Bulk actions toolbar for student selection
 */
export default function StudentsBulkActions({
  selectedCount,
  showArchived,
  onExport,
  onBulkArchive,
}: StudentsBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600" data-testid="selected-count">
        {selectedCount} selected
      </span>
      <button
        className="btn-secondary text-sm"
        data-testid="bulk-export-button"
        onClick={onExport}
      >
        Export Selected
      </button>
      {!showArchived && (
        <button
          className="btn-secondary text-sm bg-red-50 text-red-700 hover:bg-red-100"
          data-testid="bulk-archive-button"
          onClick={onBulkArchive}
        >
          Archive Selected
        </button>
      )}
    </div>
  );
}
