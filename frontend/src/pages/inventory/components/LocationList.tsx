/**
 * LocationList Component
 * 
 * Location List for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface LocationListProps {
  className?: string;
}

/**
 * LocationList component - Location List
 */
const LocationList: React.FC<LocationListProps> = ({ className = '' }) => {
  return (
    <div className={`location-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Location List functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default LocationList;
