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
