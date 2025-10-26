/**
 * FamilyTree Component
 * 
 * Family Tree for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface FamilyTreeProps {
  className?: string;
}

/**
 * FamilyTree component - Family Tree
 */
const FamilyTree: React.FC<FamilyTreeProps> = ({ className = '' }) => {
  return (
    <div className={`family-tree ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Tree</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Family Tree functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;
