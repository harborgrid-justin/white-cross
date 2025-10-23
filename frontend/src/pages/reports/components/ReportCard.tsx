/**
 * ReportCard Component
 * 
 * Report Card for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReportCardProps {
  className?: string;
}

/**
 * ReportCard component - Report Card
 */
const ReportCard: React.FC<ReportCardProps> = ({ className = '' }) => {
  return (
    <div className={`report-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Report Card functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
