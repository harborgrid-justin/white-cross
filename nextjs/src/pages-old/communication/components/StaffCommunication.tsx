/**
 * StaffCommunication Component
 * 
 * Staff Communication for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StaffCommunicationProps {
  className?: string;
}

/**
 * StaffCommunication component - Staff Communication
 */
const StaffCommunication: React.FC<StaffCommunicationProps> = ({ className = '' }) => {
  return (
    <div className={`staff-communication ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Communication</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Staff Communication functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StaffCommunication;
