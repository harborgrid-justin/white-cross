'use client';

/**
 * Main FormsContent component - Healthcare forms management dashboard
 *
 * This component serves as the main composition layer for the forms management
 * interface. It orchestrates custom hooks for data fetching, filtering, and
 * actions, and renders the UI using smaller, focused presentational components.
 *
 * Force dynamic rendering for real-time form data - healthcare forms require current state
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

// Import custom hooks
import { useFormsData } from './hooks/useFormsData';
import { useFormFilters } from './hooks/useFormFilters';
import { useFormActions } from './hooks/useFormActions';
import { useFormSelection } from './hooks/useFormSelection';

// Import presentational components
import { LoadingSkeleton } from './LoadingSkeleton';
import { FormStatisticsCards } from './FormStatisticsCards';
import { FormsToolbar } from './FormsToolbar';
import { FormsGrid } from './FormsGrid';
import { FormsList } from './FormsList';
import { FormDetailModal } from './FormDetailModal';

// Import types
import { FormsContentProps, HealthcareForm } from './types/formTypes';

/**
 * Main forms content component
 *
 * Manages the complete forms interface including statistics, filtering,
 * searching, and CRUD operations on healthcare forms.
 *
 * @param props - Component props
 * @returns JSX element with complete forms interface
 */
const FormsContent: React.FC<FormsContentProps> = ({ initialForms = [] }) => {
  // Data fetching hook
  const { forms, setForms, loading } = useFormsData(initialForms);

  // Filtering and sorting hook
  const {
    view,
    setView,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredForms,
    stats,
    resetFilters,
  } = useFormFilters(forms);

  // Selection management hook
  const { selectedForms, toggleSelection, clearSelection, isSelected } = useFormSelection();

  // Form actions hook
  const { handleDuplicateForm, handleToggleStatus, handleArchiveForm, handleBulkAction } =
    useFormActions(forms, setForms, clearSelection);

  // Local state for detail modal
  const [selectedForm, setSelectedForm] = useState<HealthcareForm | null>(null);

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Check if filters are active
  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Healthcare Form Statistics */}
      <FormStatisticsCards stats={stats} />

      {/* Form Management Actions and Filters */}
      <FormsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        view={view}
        onViewChange={setView}
        selectedCount={selectedForms.size}
        onBulkAction={(action) => handleBulkAction(action, Array.from(selectedForms))}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onResetFilters={resetFilters}
      />

      {/* Forms Display - Grid or List View */}
      <Card>
        <div className="p-6">
          {view === 'grid' ? (
            <FormsGrid
              forms={filteredForms}
              selectedForms={selectedForms}
              onSelectionChange={(formId, checked) => {
                if (checked) {
                  toggleSelection(formId);
                } else {
                  toggleSelection(formId);
                }
              }}
              onDuplicate={handleDuplicateForm}
              onToggleStatus={handleToggleStatus}
              onArchive={handleArchiveForm}
              hasActiveFilters={hasActiveFilters}
            />
          ) : (
            <FormsList
              forms={filteredForms}
              selectedForms={selectedForms}
              onSelectionChange={(formId, checked) => {
                if (checked) {
                  toggleSelection(formId);
                } else {
                  toggleSelection(formId);
                }
              }}
              onDuplicate={handleDuplicateForm}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>
      </Card>

      {/* Form Detail Modal */}
      <FormDetailModal
        form={selectedForm}
        onClose={() => setSelectedForm(null)}
        onDuplicate={handleDuplicateForm}
      />
    </div>
  );
};

export default FormsContent;
