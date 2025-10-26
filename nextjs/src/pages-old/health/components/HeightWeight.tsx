/**
 * HeightWeight Component
 * 
 * Height Weight for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HeightWeightProps {
  className?: string;
}

/**
 * HeightWeight component - Height Weight
 */
const HeightWeight: React.FC<HeightWeightProps> = ({ className = '' }) => {
  return (
    <div className={`height-weight ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Height Weight</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Height Weight functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HeightWeight;
