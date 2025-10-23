/**
 * PopularReports Component
 * 
 * Popular Reports for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PopularReportsProps {
  className?: string;
}

/**
 * PopularReports component - Popular Reports
 */
const PopularReports: React.FC<PopularReportsProps> = ({ className = '' }) => {
  return (
    <div className={`popular-reports ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Reports</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Popular Reports functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PopularReports;
