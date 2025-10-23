/**
 * LocationForm Component
 * 
 * Location Form for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface LocationFormProps {
  className?: string;
}

/**
 * LocationForm component - Location Form
 */
const LocationForm: React.FC<LocationFormProps> = ({ className = '' }) => {
  return (
    <div className={`location-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Location Form functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
