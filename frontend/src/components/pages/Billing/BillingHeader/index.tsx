'use client';

import React, { useState } from 'react';
import { DollarSign, Search, ChevronDown, BarChart3, FileText, Users, PieChart } from 'lucide-react';
import { BillingHeaderProps, BillingViewMode, BillingSortOption } from './types';
import { formatCurrency, getActiveFilterCount, createDefaultFilters } from './utils';
import BillingHeaderMetrics from './BillingHeaderMetrics';
import BillingHeaderActions from './BillingHeaderActions';
import BillingHeaderFilters from './BillingHeaderFilters';

/**
 * BillingHeader Component
 *
 * A comprehensive header component for billing management with financial metrics,
 * search, filtering, view controls, and billing-specific actions. Features revenue
 * tracking, payment analytics, and bulk operations support.
 *
 * This is the main orchestrator component that brings together:
 * - Financial metrics display
 * - Action buttons for common operations
 * - Search and filter controls
 * - View mode and sorting options
 *
 * @param props - BillingHeader component props
 * @returns JSX element representing the billing management header
 */
const BillingHeader: React.FC<BillingHeaderProps> = ({
  totalInvoices = 0,
  totalRevenue = 0,
  outstandingBalance = 0,
  paidInvoices = 0,
  overdueInvoices = 0,
  draftInvoices = 0,
  averagePaymentTime = 0,
  collectionRate = 0,
  searchTerm = '',
  filters = createDefaultFilters(),
  viewMode = 'grid',
  sortBy = 'date',
  sortDirection = 'desc',
  loading = false,
  className = '',
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  onSortChange,
  onCreateInvoice,
  onImportInvoices,
  onExportInvoices,
  onRefresh,
  onSettings,
  onSendStatements,
  onProcessPayments
}) => {
  // State management
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  /**
   * Handles filter clear action
   */
  const handleClearFilters = (): void => {
    onFilterChange?.(createDefaultFilters());
  };

  /**
   * Toggles filter panel visibility
   */
  const handleToggleFilters = (): void => {
    setShowFilters(!showFilters);
  };

  /**
   * Handles filter changes
   */
  const handleFilterChange = (newFilters: typeof filters): void => {
    onFilterChange?.(newFilters);
  };

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
                <p className="text-gray-600">Manage invoices, payments, and financial records</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <BillingHeaderActions
            loading={loading}
            onRefresh={onRefresh}
            onProcessPayments={onProcessPayments}
            onSendStatements={onSendStatements}
            onImportInvoices={onImportInvoices}
            onExportInvoices={onExportInvoices}
            onSettings={onSettings}
            onCreateInvoice={onCreateInvoice}
          />
        </div>

        {/* Financial Metrics Cards */}
        <BillingHeaderMetrics
          totalInvoices={totalInvoices}
          totalRevenue={totalRevenue}
          outstandingBalance={outstandingBalance}
          paidInvoices={paidInvoices}
          overdueInvoices={overdueInvoices}
          draftInvoices={draftInvoices}
          averagePaymentTime={averagePaymentTime}
          collectionRate={collectionRate}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Search and Controls */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices, patients, amounts..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Filters */}
            <BillingHeaderFilters
              filters={filters}
              showFilters={showFilters}
              activeFilterCount={activeFilterCount}
              onFilterChange={handleFilterChange}
              onToggleFilters={handleToggleFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Sort
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showSortMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {[
                      { value: 'date' as BillingSortOption, label: 'Invoice Date' },
                      { value: 'amount' as BillingSortOption, label: 'Amount' },
                      { value: 'status' as BillingSortOption, label: 'Status' },
                      { value: 'patient' as BillingSortOption, label: 'Patient Name' },
                      { value: 'dueDate' as BillingSortOption, label: 'Due Date' },
                      { value: 'updated' as BillingSortOption, label: 'Last Updated' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange?.(option.value, sortDirection);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === option.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="float-right">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-md">
              {[
                { mode: 'grid' as BillingViewMode, icon: BarChart3, label: 'Grid view' },
                { mode: 'list' as BillingViewMode, icon: FileText, label: 'List view' },
                { mode: 'table' as BillingViewMode, icon: Users, label: 'Table view' },
                { mode: 'chart' as BillingViewMode, icon: PieChart, label: 'Chart view' }
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.mode}
                    onClick={() => onViewModeChange?.(view.mode)}
                    className={`p-2 text-sm font-medium border-r border-gray-300 last:border-r-0
                             hover:bg-gray-50 ${
                               viewMode === view.mode ? 'bg-green-50 text-green-700' : 'text-gray-600'
                             }`}
                    aria-label={view.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHeader;
