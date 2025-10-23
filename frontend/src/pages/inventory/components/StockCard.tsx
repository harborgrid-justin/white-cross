/**
 * StockCard Component
 * 
 * Stock Card for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StockCardProps {
  className?: string;
}

/**
 * StockCard component - Stock Card
 */
const StockCard: React.FC<StockCardProps> = ({ className = '' }) => {
  return (
    <div className={`stock-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Stock Card functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
