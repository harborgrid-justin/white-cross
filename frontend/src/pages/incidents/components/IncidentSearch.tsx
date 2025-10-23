/**
 * IncidentSearch Component
 * 
 * Incident Search for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentSearchProps {
  className?: string;
}

/**
 * IncidentSearch component - Incident Search
 */
const IncidentSearch: React.FC<IncidentSearchProps> = ({ className = '' }) => {
  return (
    <div className={`incident-search ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Search</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Search functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentSearch;
