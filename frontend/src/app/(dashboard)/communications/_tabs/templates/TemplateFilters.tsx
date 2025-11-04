/**
 * WF-COMM-TEMPLATES-FILTERS | Template Filters Component
 * Purpose: Search and category filtering for templates
 * Upstream: CommunicationTemplatesTab | Dependencies: React, UI components
 * Downstream: Template filtering | Called by: CommunicationTemplatesTab
 * Related: Template search, template categorization
 * Exports: TemplateFilters component
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Template filtering controls
 * LLM Context: Filter card with search and category dropdown
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TemplateFilters as TemplateFiltersType, TEMPLATE_CATEGORIES } from './types';

interface TemplateFiltersProps {
  filters: TemplateFiltersType;
  onFiltersChange: (filters: TemplateFiltersType) => void;
  totalCount: number;
  filteredCount: number;
}

/**
 * Template Filters Component
 *
 * Provides search and category filtering controls for templates. Displays
 * filtered results count.
 *
 * **Features:**
 * - Search input with icon
 * - Category dropdown filter
 * - Results count display
 * - Responsive grid layout
 *
 * @component
 * @param {TemplateFiltersProps} props - Component props
 * @returns {JSX.Element} Rendered filter controls
 */
export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Search Templates"
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          placeholder="Search by name, subject, or content..."
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          iconPosition="left"
        />

        <Select
          label="Category"
          options={TEMPLATE_CATEGORIES}
          value={filters.category}
          onChange={(value) => onFiltersChange({ ...filters, category: value as string })}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCount} of {totalCount} templates
      </div>
    </Card>
  );
};
