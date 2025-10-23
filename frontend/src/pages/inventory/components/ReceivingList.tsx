/**
 * ReceivingList Component
 * 
 * Receiving List for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReceivingListProps {
  className?: string;
}

/**
 * ReceivingList component - Receiving List
 */
const ReceivingList: React.FC<ReceivingListProps> = ({ className = '' }) => {
  return (
    <div className={`receiving-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Receiving List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Receiving List functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReceivingList;
