/**
 * TransferList Component
 * 
 * Transfer List for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface TransferListProps {
  className?: string;
}

/**
 * TransferList component - Transfer List
 */
const TransferList: React.FC<TransferListProps> = ({ className = '' }) => {
  return (
    <div className={`transfer-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Transfer List functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default TransferList;
