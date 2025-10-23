/**
 * StaffContacts Component
 * 
 * Staff Contacts for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StaffContactsProps {
  className?: string;
}

/**
 * StaffContacts component - Staff Contacts
 */
const StaffContacts: React.FC<StaffContactsProps> = ({ className = '' }) => {
  return (
    <div className={`staff-contacts ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Contacts</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Staff Contacts functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StaffContacts;
