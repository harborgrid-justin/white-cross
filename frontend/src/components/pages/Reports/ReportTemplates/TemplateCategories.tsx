/**
 * TemplateCategories Component
 *
 * Provides category navigation and filtering for report templates.
 */

import React from 'react';
import { Filter } from 'lucide-react';
import { TemplateCategory, TemplateComplexity } from './types';

/**
 * Props for the TemplateCategories component
 */
export interface TemplateCategoriesProps {
  /** Current category filter */
  categoryFilter: TemplateCategory | 'all';
  /** Category filter change handler */
  onCategoryChange: (category: TemplateCategory | 'all') => void;
  /** Current complexity filter */
  complexityFilter: TemplateComplexity | 'all';
  /** Complexity filter change handler */
  onComplexityChange: (complexity: TemplateComplexity | 'all') => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TemplateCategories Component
 *
 * Renders category and complexity filter controls for browsing templates.
 *
 * @param props - TemplateCategories component props
 * @returns JSX element representing the category filters
 */
export const TemplateCategories: React.FC<TemplateCategoriesProps> = ({
  categoryFilter,
  onCategoryChange,
  complexityFilter,
  onComplexityChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Filter className="w-4 h-4 text-gray-400" />

      {/* Category Filter */}
      <select
        value={categoryFilter}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onCategoryChange(e.target.value as TemplateCategory | 'all')
        }
        className="border border-gray-300 rounded-md px-3 py-2 text-sm
                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        <option value="clinical">Clinical</option>
        <option value="financial">Financial</option>
        <option value="operational">Operational</option>
        <option value="compliance">Compliance</option>
        <option value="patient-satisfaction">Patient Satisfaction</option>
        <option value="custom">Custom</option>
      </select>

      {/* Complexity Filter */}
      <select
        value={complexityFilter}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onComplexityChange(e.target.value as TemplateComplexity | 'all')
        }
        className="border border-gray-300 rounded-md px-3 py-2 text-sm
                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Filter by complexity"
      >
        <option value="all">All Levels</option>
        <option value="simple">Simple</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
  );
};

export default TemplateCategories;
