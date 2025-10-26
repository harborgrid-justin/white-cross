/**
 * ReportCategories Component
 * 
 * Report Categories for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReportCategoriesProps {
  className?: string;
}

/**
 * ReportCategories component - Report Categories
 */
const ReportCategories: React.FC<ReportCategoriesProps> = ({ className = '' }) => {
  return (
    <div className={`report-categories ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Categories</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Report Categories functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReportCategories;
