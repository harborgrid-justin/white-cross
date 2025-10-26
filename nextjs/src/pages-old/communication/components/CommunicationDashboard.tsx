/**
 * CommunicationDashboard Component
 * 
 * Communication Dashboard for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CommunicationDashboardProps {
  className?: string;
}

/**
 * CommunicationDashboard component - Communication Dashboard
 */
const CommunicationDashboard: React.FC<CommunicationDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`communication-dashboard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Dashboard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Communication Dashboard functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationDashboard;
