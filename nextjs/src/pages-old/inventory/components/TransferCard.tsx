/**
 * TransferCard Component
 * 
 * Transfer Card for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface TransferCardProps {
  className?: string;
}

/**
 * TransferCard component - Transfer Card
 */
const TransferCard: React.FC<TransferCardProps> = ({ className = '' }) => {
  return (
    <div className={`transfer-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Transfer Card functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default TransferCard;
