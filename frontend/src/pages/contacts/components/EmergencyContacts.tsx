/**
 * EmergencyContacts Component
 * 
 * Emergency Contacts for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface EmergencyContactsProps {
  className?: string;
}

/**
 * EmergencyContacts component - Emergency Contacts
 */
const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ className = '' }) => {
  return (
    <div className={`emergency-contacts ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Emergency Contacts functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
