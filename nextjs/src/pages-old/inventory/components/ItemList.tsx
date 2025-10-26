/**
 * ItemList Component
 * 
 * Item List for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ItemListProps {
  className?: string;
}

/**
 * ItemList component - Item List
 */
const ItemList: React.FC<ItemListProps> = ({ className = '' }) => {
  return (
    <div className={`item-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Item List functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
