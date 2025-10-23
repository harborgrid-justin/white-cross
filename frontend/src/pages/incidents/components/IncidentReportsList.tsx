/**
 * IncidentReportsList Component
 * 
 * Incident Reports List for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentReportsListProps {
  className?: string;
}

/**
 * IncidentReportsList component - Incident Reports List
 */
const IncidentReportsList: React.FC<IncidentReportsListProps> = ({ className = '' }) => {
  return (
    <div className={`incident-reports-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Reports List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Reports List functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportsList;
