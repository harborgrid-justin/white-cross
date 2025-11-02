'use client';

/**
 * MedicationCategories Component
 */

import React from 'react';
import { Button } from '@/components/ui/button';

export interface MedicationCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
  color?: string;
}

export interface MedicationCategoriesProps {
  categories: MedicationCategory[];
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export const MedicationCategories: React.FC<MedicationCategoriesProps> = ({
  categories,
  onCategorySelect,
  selectedCategoryId,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Medication Categories</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className={`text-left border rounded-lg p-4 transition-all ${
              selectedCategoryId === category.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                {category.count}
              </span>
            </div>
            {category.description && (
              <p className="text-sm text-gray-600">{category.description}</p>
            )}
          </button>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No medication categories defined</p>
        </div>
      )}
    </div>
  );
};

MedicationCategories.displayName = 'MedicationCategories';

export default MedicationCategories;


