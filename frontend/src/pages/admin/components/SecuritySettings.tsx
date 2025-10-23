/**
 * SecuritySettings Component
 * 
 * Security Settings for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SecuritySettingsProps {
  className?: string;
}

/**
 * SecuritySettings component - Security Settings
 */
const SecuritySettings: React.FC<SecuritySettingsProps> = ({ className = '' }) => {
  return (
    <div className={`security-settings ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Security Settings functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
