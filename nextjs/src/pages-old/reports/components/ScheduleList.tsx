/**
 * ScheduleList Component
 * 
 * Schedule List for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ScheduleListProps {
  className?: string;
}

/**
 * ScheduleList component - Schedule List
 */
const ScheduleList: React.FC<ScheduleListProps> = ({ className = '' }) => {
  return (
    <div className={`schedule-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Schedule List functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
