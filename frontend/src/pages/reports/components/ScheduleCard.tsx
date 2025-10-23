/**
 * ScheduleCard Component
 * 
 * Schedule Card for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ScheduleCardProps {
  className?: string;
}

/**
 * ScheduleCard component - Schedule Card
 */
const ScheduleCard: React.FC<ScheduleCardProps> = ({ className = '' }) => {
  return (
    <div className={`schedule-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Schedule Card functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
