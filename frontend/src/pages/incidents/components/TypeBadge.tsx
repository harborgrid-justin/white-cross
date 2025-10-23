/**
 * TypeBadge Component
 * 
 * Type Badge for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface TypeBadgeProps {
  className?: string;
}

/**
 * TypeBadge component - Type Badge
 */
const TypeBadge: React.FC<TypeBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`type-badge ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Type Badge</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Type Badge functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default TypeBadge;
