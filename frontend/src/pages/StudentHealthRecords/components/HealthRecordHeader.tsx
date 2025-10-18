/**
 * WF-COMP-235 | HealthRecordHeader.tsx - React component or utility module
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
 * Health Record Header Component
 *
 * Displays student health record header with navigation
 */

import React from 'react';

interface HealthRecordHeaderProps {
  studentName: string;
  studentId: string;
  onBack: () => void;
}

/**
 * Header component for health record pages
 */
export default function HealthRecordHeader({
  studentName,
  studentId,
  onBack,
}: HealthRecordHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Health Records - {studentName}
        </h1>
        <p className="text-gray-600">Student ID: {studentId}</p>
      </div>
      <button
        onClick={onBack}
        className="btn-secondary"
        data-testid="back-to-records-button"
      >
        Back to Records
      </button>
    </div>
  );
}
