/**
 * SchoolProfile Component
 * 
 * School Profile for configuration module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SchoolProfileProps {
  className?: string;
}

/**
 * SchoolProfile component - School Profile
 */
const SchoolProfile: React.FC<SchoolProfileProps> = ({ className = '' }) => {
  return (
    <div className={`school-profile ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Profile</h3>
        <div className="text-center text-gray-500 py-8">
          <p>School Profile functionality</p>
          <p className="text-sm mt-2">Connected to configuration Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;
