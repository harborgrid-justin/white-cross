'use client';

import React from 'react';
import { Download, Share2, Archive, Trash2 } from 'lucide-react';

/**
 * Props for ReportListBulkHeader component
 */
interface ReportListBulkHeaderProps {
  /** Total number of reports on current page */
  totalReports: number;
  /** Number of selected reports */
  selectedCount: number;
  /** Whether all reports are selected */
  allSelected: boolean;
  /** Whether user can manage reports */
  canManage: boolean;
  /** Select all handler */
  onSelectAll: (selected: boolean) => void;
  /** Bulk operation handler */
  onBulkOperation: (operation: 'export' | 'delete' | 'archive' | 'share', reportIds: string[]) => void;
  /** Selected report IDs */
  selectedReports: string[];
}

/**
 * Bulk selection header component for ReportList
 *
 * Displays bulk selection controls and action buttons when bulk selection is enabled
 * and provides options for exporting, sharing, archiving, and deleting multiple reports.
 *
 * @param props - ReportListBulkHeader component props
 * @returns JSX element representing the bulk selection header
 */
export const ReportListBulkHeader: React.FC<ReportListBulkHeaderProps> = ({
  totalReports,
  selectedCount,
  allSelected,
  canManage,
  onSelectAll,
  onBulkOperation,
  selectedReports
}) => {
  /**
   * Handles select all checkbox change
   */
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(e.target.checked);
  };

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-blue-900">
              Select All ({totalReports})
            </span>
          </label>

          {selectedCount > 0 && (
            <span className="text-sm text-blue-700">
              {selectedCount} selected
            </span>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBulkOperation('export', selectedReports)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700
                       bg-white border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={() => onBulkOperation('share', selectedReports)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700
                       bg-white border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
            {canManage && (
              <>
                <button
                  onClick={() => onBulkOperation('archive', selectedReports)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-700
                           bg-white border border-orange-300 rounded-md hover:bg-orange-50"
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </button>
                <button
                  onClick={() => onBulkOperation('delete', selectedReports)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700
                           bg-white border border-red-300 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportListBulkHeader;
