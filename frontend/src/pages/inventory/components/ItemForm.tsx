/**
 * ItemForm Component
 * 
 * Item Form for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ItemFormProps {
  className?: string;
}

/**
 * ItemForm component - Item Form
 */
const ItemForm: React.FC<ItemFormProps> = ({ className = '' }) => {
  return (
    <div className={`item-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Item Form functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
