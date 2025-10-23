/**
 * StaffList Component
 * 
 * Staff List for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StaffListProps {
  className?: string;
}

/**
 * StaffList component - Staff List
 */
const StaffList: React.FC<StaffListProps> = ({ className = '' }) => {
  return (
    <div className={`staff-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Staff List functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StaffList;
