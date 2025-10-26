/**
 * SchoolYearSettings Component
 * 
 * School Year Settings for configuration module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SchoolYearSettingsProps {
  className?: string;
}

/**
 * SchoolYearSettings component - School Year Settings
 */
const SchoolYearSettings: React.FC<SchoolYearSettingsProps> = ({ className = '' }) => {
  return (
    <div className={`school-year-settings ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Year Settings</h3>
        <div className="text-center text-gray-500 py-8">
          <p>School Year Settings functionality</p>
          <p className="text-sm mt-2">Connected to configuration Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolYearSettings;
