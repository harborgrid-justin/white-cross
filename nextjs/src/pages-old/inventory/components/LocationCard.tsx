/**
 * LocationCard Component
 * 
 * Location Card for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface LocationCardProps {
  className?: string;
}

/**
 * LocationCard component - Location Card
 */
const LocationCard: React.FC<LocationCardProps> = ({ className = '' }) => {
  return (
    <div className={`location-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Location Card functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
