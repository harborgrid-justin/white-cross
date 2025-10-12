/**
 * Emergency Contacts Loading State Component
 *
 * Displays loading indicator
 *
 * @module components/EmergencyContactsLoadingState
 */

import React from 'react';

/**
 * Loading state component
 */
export default function EmergencyContactsLoadingState() {
  return (
    <div className="card p-12 text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      Loading contacts...
    </div>
  );
}
