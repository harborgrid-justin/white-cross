/**
 * StaffCard Component
 * 
 * Staff Card for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StaffCardProps {
  className?: string;
}

/**
 * StaffCard component - Staff Card
 */
const StaffCard: React.FC<StaffCardProps> = ({ className = '' }) => {
  return (
    <div className={`staff-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Staff Card functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
