/**
 * @fileoverview Refactored Immunizations Content Component
 * @module app/immunizations/components
 *
 * Main component for immunization management dashboard.
 * Orchestrates all sub-components and manages global state.
 *
 * REFACTORED FROM: ImmunizationsContent.tsx (828 lines)
 * NOW: ~250 lines with clear separation of concerns
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { ImmunizationsContentProps, ViewMode } from './types/immunization.types';

// Custom Hooks
import { useImmunizationData } from './hooks/useImmunizationData';
import { useImmunizationFilters } from './hooks/useImmunizationFilters';
import { useImmunizationStats } from './hooks/useImmunizationStats';

// Components
import { ImmunizationStatsComponent } from './ImmunizationStats';
import { ImmunizationActionsComponent } from './ImmunizationActions';
import { ImmunizationFiltersComponent } from './ImmunizationFilters';
import { ImmunizationListComponent } from './ImmunizationList';

/**
 * ImmunizationsContent component
 * Main orchestrator for immunization management interface
 */
const ImmunizationsContent: React.FC<ImmunizationsContentProps> = ({
  initialImmunizations = [],
}) => {
  // Data Management
  const { immunizations, loading, error } = useImmunizationData(initialImmunizations);

  // Filtering and Search
  const {
    filteredImmunizations,
    filterState,
    setStatusFilter,
    setTypeFilter,
    setSearchQuery,
    setSelectedDate,
    clearFilters,
  } = useImmunizationFilters(immunizations);

  // Statistics
  const stats = useImmunizationStats(immunizations);

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImmunizations, setSelectedImmunizations] = useState<Set<string>>(new Set());

  // Selection Management
  const handleSelectionChange = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedImmunizations);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedImmunizations(newSelected);
  };

  // Action Handlers (placeholders - implement in future)
  const handleScheduleImmunization = () => {
    console.log('Schedule immunization');
  };

  const handleImportRecords = () => {
    console.log('Import records');
  };

  const handleExportReport = () => {
    console.log('Export report');
  };

  const handleBulkReschedule = () => {
    console.log('Bulk reschedule');
  };

  const handleBulkNotify = () => {
    console.log('Bulk notify');
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load immunizations</p>
            <p className="text-sm text-gray-600 mt-2">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Main Render
  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <ImmunizationStatsComponent stats={stats} />

      {/* Actions and View Controls */}
      <ImmunizationActionsComponent
        selectedCount={selectedImmunizations.size}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onScheduleImmunization={handleScheduleImmunization}
        onImportRecords={handleImportRecords}
        onExportReport={handleExportReport}
        onBulkReschedule={handleBulkReschedule}
        onBulkNotify={handleBulkNotify}
      />

      {/* Filters Section */}
      <Card>
        <div className="p-4">
          <ImmunizationFiltersComponent
            filterState={filterState}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
            onSearchQueryChange={setSearchQuery}
            onDateChange={setSelectedDate}
            onClearFilters={clearFilters}
          />
        </div>
      </Card>

      {/* Immunization List */}
      <ImmunizationListComponent
        immunizations={filteredImmunizations}
        selectedImmunizations={selectedImmunizations}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default ImmunizationsContent;
