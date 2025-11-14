/**
 * AuditHeader Component
 *
 * Displays the header section for compliance audit management including
 * title, description, search, filters, and view mode controls.
 *
 * @module ComplianceAudit/AuditHeader
 */

'use client';

import React from 'react';
import {
  FileSearch,
  Search,
  Filter,
  ChevronDown,
  Plus,
  RefreshCw,
  BarChart3,
  FileText,
  Calendar
} from 'lucide-react';
import type { ViewMode } from './types';

/**
 * Props for the AuditHeader component
 */
export interface AuditHeaderProps {
  /** Current search term */
  searchTerm: string;
  /** Current view mode */
  viewMode: ViewMode;
  /** Whether filters panel is shown */
  showFilters: boolean;
  /** Called when search term changes */
  onSearchChange: (term: string) => void;
  /** Called when view mode changes */
  onViewModeChange: (mode: ViewMode) => void;
  /** Called when filters toggle is clicked */
  onFiltersToggle: () => void;
  /** Called when create audit button is clicked */
  onCreateAudit?: () => void;
  /** Called when refresh button is clicked */
  onRefresh?: () => void;
}

/**
 * AuditHeader Component
 *
 * Renders the complete header section including page title,
 * search bar, filter controls, and view mode toggle.
 *
 * @param props - AuditHeader component props
 * @returns JSX element representing the audit header
 */
export const AuditHeader: React.FC<AuditHeaderProps> = ({
  searchTerm,
  viewMode,
  showFilters,
  onSearchChange,
  onViewModeChange,
  onFiltersToggle,
  onCreateAudit,
  onRefresh
}) => {
  /**
   * Handles search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  /**
   * Handles refresh button click
   */
  const handleRefresh = () => {
    onRefresh?.();
  };

  /**
   * Handles create audit button click
   */
  const handleCreateAudit = () => {
    onCreateAudit?.();
  };

  /**
   * View mode configurations
   */
  const viewModes = [
    { mode: 'grid' as const, icon: BarChart3, label: 'Grid view' },
    { mode: 'list' as const, icon: FileText, label: 'List view' },
    { mode: 'calendar' as const, icon: Calendar, label: 'Calendar view' }
  ];

  return (
    <>
      {/* Title Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <FileSearch className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Audits</h1>
            <p className="text-gray-600">
              Track and manage compliance audits and findings
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                     bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            aria-label="Refresh audits"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>

          <button
            onClick={handleCreateAudit}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Audit
          </button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audits..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters Button */}
          <button
            onClick={onFiltersToggle}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                     bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-gray-300 rounded-md">
          {viewModes.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.mode}
                onClick={() => onViewModeChange(view.mode)}
                className={`p-2 text-sm font-medium border-r border-gray-300 last:border-r-0
                         hover:bg-gray-50 ${viewMode === view.mode
                           ? 'bg-blue-50 text-blue-700'
                           : 'text-gray-600'}`}
                aria-label={view.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AuditHeader;
