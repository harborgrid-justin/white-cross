/**
 * ComplianceAudit Component
 *
 * A comprehensive audit management component for tracking compliance audits,
 * findings, and follow-up actions. Features filtering, search, multiple view modes,
 * and detailed audit tracking with findings management.
 *
 * @module ComplianceAudit
 */

'use client';

import React, { useState } from 'react';
import { FileSearch, Calendar, Plus } from 'lucide-react';
import AuditCard from './AuditCard';
import AuditStats from './AuditStats';
import AuditHeader from './AuditHeader';
import FilterPanel from './FilterPanel';
import type { ComplianceAuditProps, ComplianceAudit as ComplianceAuditType } from './types';

/**
 * ComplianceAudit Component
 *
 * Main component that orchestrates the audit management interface.
 * Displays statistics, search/filter controls, and audit cards in
 * various view modes (grid, list, calendar).
 *
 * @param props - ComplianceAudit component props
 * @returns JSX element representing the audit management interface
 */
const ComplianceAudit: React.FC<ComplianceAuditProps> = ({
  audits = [],
  auditors = [],
  departments = [],
  loading = false,
  viewMode = 'grid',
  searchTerm = '',
  activeFilters = {
    status: [],
    type: [],
    priority: [],
    auditor: [],
    department: []
  },
  className = '',
  onAuditClick,
  onCreateAudit,
  onEditAudit,
  onDeleteAudit,
  onViewDetails,
  onDownloadReport,
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  onUpdateFinding
}) => {
  // Local state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ComplianceAuditType | null>(null);

  /**
   * Handles audit card click
   */
  const handleAuditClick = (audit: ComplianceAuditType) => {
    setSelectedAudit(audit);
    onAuditClick?.(audit);
  };

  /**
   * Handles filter panel toggle
   */
  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  /**
   * Handles filter changes
   */
  const handleFilterApply = (filters: typeof activeFilters) => {
    onFilterChange?.(filters);
  };

  /**
   * Handles search change
   */
  const handleSearchChange = (term: string) => {
    onSearchChange?.(term);
  };

  /**
   * Handles view mode change
   */
  const handleViewModeChange = (mode: 'list' | 'grid' | 'calendar') => {
    onViewModeChange?.(mode);
  };

  /**
   * Handles refresh action
   */
  const handleRefresh = () => {
    // Refresh logic can be handled by parent component
    // or trigger a data refetch
  };

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <FileSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Audits Found</h3>
      <p className="text-gray-600 mb-4">
        {searchTerm
          ? 'No audits match your search criteria.'
          : 'Get started by creating your first compliance audit.'
        }
      </p>
      <button
        onClick={onCreateAudit}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600
                 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create First Audit
      </button>
    </div>
  );

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {audits.map(audit => (
        <AuditCard
          key={audit.id}
          audit={audit}
          onClick={handleAuditClick}
          onViewDetails={onViewDetails}
          onDownloadReport={onDownloadReport}
        />
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="space-y-4">
      {audits.map(audit => (
        <AuditCard
          key={audit.id}
          audit={audit}
          onClick={handleAuditClick}
          onViewDetails={onViewDetails}
          onDownloadReport={onDownloadReport}
        />
      ))}
    </div>
  );

  // Render calendar view
  const renderCalendarView = () => (
    <div className="text-center py-12">
      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
      <p className="text-gray-600">Calendar view coming soon.</p>
    </div>
  );

  // Render content based on view mode
  const renderContent = () => {
    if (audits.length === 0) {
      return renderEmptyState();
    }

    switch (viewMode) {
      case 'grid':
        return renderGridView();
      case 'list':
        return renderListView();
      case 'calendar':
        return renderCalendarView();
      default:
        return renderGridView();
    }
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header Section */}
      <div className="border-b border-gray-200 p-6">
        <AuditHeader
          searchTerm={searchTerm}
          viewMode={viewMode}
          showFilters={showFilters}
          onSearchChange={handleSearchChange}
          onViewModeChange={handleViewModeChange}
          onFiltersToggle={handleFiltersToggle}
          onCreateAudit={onCreateAudit}
          onRefresh={handleRefresh}
        />

        {/* Statistics Cards */}
        <div className="mt-6">
          <AuditStats audits={audits} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        show={showFilters}
        activeFilters={activeFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterApply}
        onClear={() => handleFilterApply({
          status: [],
          type: [],
          priority: [],
          auditor: [],
          department: []
        })}
      />
    </div>
  );
};

export default ComplianceAudit;
export { ComplianceAudit };
