/**
 * ImmunizationSettings Component
 * 
 * Immunization Settings for configuration module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ImmunizationSettingsProps {
  className?: string;
}

/**
 * ImmunizationSettings component - Immunization Settings
 */
const ImmunizationSettings: React.FC<ImmunizationSettingsProps> = ({ className = '' }) => {
  return (
    <div className={`immunization-settings ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Immunization Settings</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Immunization Settings functionality</p>
          <p className="text-sm mt-2">Connected to configuration Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationSettings;
