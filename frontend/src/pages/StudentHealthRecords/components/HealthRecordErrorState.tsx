/**
 * Health Record Error State Component
 *
 * Displays error state for invalid student IDs or validation errors
 */

import React from 'react';

interface HealthRecordErrorStateProps {
  errorMessage: string;
  onBack: () => void;
}

/**
 * Error state component for health record validation failures
 */
export default function HealthRecordErrorState({
  errorMessage,
  onBack,
}: HealthRecordErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Student ID</h2>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Health Records
        </button>
      </div>
    </div>
  );
}
