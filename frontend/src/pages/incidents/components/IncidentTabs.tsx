/**
 * IncidentTabs Component
 * 
 * Incident Tabs for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentTabsProps {
  className?: string;
}

/**
 * IncidentTabs component - Incident Tabs
 */
const IncidentTabs: React.FC<IncidentTabsProps> = ({ className = '' }) => {
  return (
    <div className={`incident-tabs ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Tabs</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Tabs functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentTabs;
