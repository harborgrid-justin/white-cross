/**
 * StaffDetails Component
 * 
 * Staff Details for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StaffDetailsProps {
  className?: string;
}

/**
 * StaffDetails component - Staff Details
 */
const StaffDetails: React.FC<StaffDetailsProps> = ({ className = '' }) => {
  return (
    <div className={`staff-details ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Details</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Staff Details functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
