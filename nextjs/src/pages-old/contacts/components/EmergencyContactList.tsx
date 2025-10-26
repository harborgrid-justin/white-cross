/**
 * EmergencyContactList Component
 * 
 * Emergency Contact List for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface EmergencyContactListProps {
  className?: string;
}

/**
 * EmergencyContactList component - Emergency Contact List
 */
const EmergencyContactList: React.FC<EmergencyContactListProps> = ({ className = '' }) => {
  return (
    <div className={`emergency-contact-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Emergency Contact List functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactList;
