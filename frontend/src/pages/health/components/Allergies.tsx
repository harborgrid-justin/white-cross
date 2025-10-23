/**
 * Allergies Component
 * 
 * Allergies for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AllergiesProps {
  className?: string;
}

/**
 * Allergies component - Allergies
 */
const Allergies: React.FC<AllergiesProps> = ({ className = '' }) => {
  return (
    <div className={`allergies ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Allergies functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default Allergies;
