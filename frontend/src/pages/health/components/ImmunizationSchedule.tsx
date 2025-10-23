/**
 * ImmunizationSchedule Component
 * 
 * Immunization Schedule for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ImmunizationScheduleProps {
  className?: string;
}

/**
 * ImmunizationSchedule component - Immunization Schedule
 */
const ImmunizationSchedule: React.FC<ImmunizationScheduleProps> = ({ className = '' }) => {
  return (
    <div className={`immunization-schedule ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Immunization Schedule</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Immunization Schedule functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationSchedule;
