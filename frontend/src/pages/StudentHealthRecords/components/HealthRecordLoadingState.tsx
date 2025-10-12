/**
 * Health Record Loading State Component
 *
 * Displays loading indicator while validating access
 */

import React from 'react';

/**
 * Loading state component for health records
 */
export default function HealthRecordLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Validating route parameters...</span>
    </div>
  );
}
