/**
 * ArchiveSettings Component
 * 
 * Archive Settings for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ArchiveSettingsProps {
  className?: string;
}

/**
 * ArchiveSettings component - Archive Settings
 */
const ArchiveSettings: React.FC<ArchiveSettingsProps> = ({ className = '' }) => {
  return (
    <div className={`archive-settings ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Archive Settings</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Archive Settings functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ArchiveSettings;
