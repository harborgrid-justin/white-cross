/**
 * IncidentsSidebar Component
 * 
 * Incidents Sidebar for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentsSidebarProps {
  className?: string;
}

/**
 * IncidentsSidebar component - Incidents Sidebar
 */
const IncidentsSidebar: React.FC<IncidentsSidebarProps> = ({ className = '' }) => {
  return (
    <div className={`incidents-sidebar ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents Sidebar</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incidents Sidebar functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentsSidebar;
