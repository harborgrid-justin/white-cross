/**
 * ItemCard Component
 * 
 * Item Card for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ItemCardProps {
  className?: string;
}

/**
 * ItemCard component - Item Card
 */
const ItemCard: React.FC<ItemCardProps> = ({ className = '' }) => {
  return (
    <div className={`item-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Item Card functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
