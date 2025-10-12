/**
 * Emergency Contacts Header Component
 *
 * Displays the page header with title and action button
 *
 * @module components/EmergencyContactsHeader
 */

import React from 'react';
import { Plus } from 'lucide-react';

interface EmergencyContactsHeaderProps {
  onAddContact: () => void;
}

/**
 * Header component for emergency contacts page
 */
export default function EmergencyContactsHeader({
  onAddContact,
}: EmergencyContactsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Contact System</h1>
        <p className="text-gray-600">Manage emergency contacts and multi-channel communication</p>
      </div>
      <button onClick={onAddContact} className="btn-primary flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Add Contact
      </button>
    </div>
  );
}
