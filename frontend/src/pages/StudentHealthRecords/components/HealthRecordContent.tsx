/**
 * Health Record Content Component
 *
 * Displays the main health record content
 */

import React from 'react';

interface HealthRecordContentProps {
  studentName: string;
  studentId: string;
}

/**
 * Content component displaying health record data
 */
export default function HealthRecordContent({
  studentName,
  studentId,
}: HealthRecordContentProps) {
  return (
    <div className="space-y-6" data-testid="health-record-content">
      <div className="card p-6">
        <p className="text-gray-600">Health records content would be displayed here.</p>
      </div>
    </div>
  );
}
