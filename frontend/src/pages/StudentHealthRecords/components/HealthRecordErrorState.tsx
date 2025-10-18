/**
 * WF-COMP-234 | HealthRecordErrorState.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
