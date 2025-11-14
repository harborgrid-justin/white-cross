/**
 * Budget Filters Component
 * Provides filtering and search for budgets
 */

'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { BudgetCategory, BudgetStatus } from './types/budget.types';

interface BudgetFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: BudgetCategory | 'all';
  onCategoryChange: (category: BudgetCategory | 'all') => void;
  statusFilter: BudgetStatus | 'all';
  onStatusChange: (status: BudgetStatus | 'all') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  onClearFilters: () => void;
}

export const BudgetFilters: React.FC<BudgetFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  onClearFilters
}) => {
  const categoryOptions: Array<{ value: BudgetCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'medical-supplies', label: 'Medical Supplies' },
    { value: 'medications', label: 'Medications' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'staffing', label: 'Staffing' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions: Array<{ value: BudgetStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'depleted', label: 'Depleted' },
    { value: 'overspent', label: 'Overspent' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search budgets..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onSearchChange(e.target.value)
            }
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-2" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value as BudgetCategory | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as BudgetStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
