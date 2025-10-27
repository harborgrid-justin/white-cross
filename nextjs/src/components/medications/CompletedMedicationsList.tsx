'use client';

/**
 * CompletedMedicationsList Component
 */

import React from 'react';
import { AdministrationLog, type AdministrationRecord } from './administration/AdministrationLog';

export interface CompletedMedicationsListProps {
  completedRecords: AdministrationRecord[];
  isLoading?: boolean;
  onViewDetails?: (recordId: string) => void;
  dateRange?: { start: string; end: string };
}

export const CompletedMedicationsList: React.FC<CompletedMedicationsListProps> = ({
  completedRecords,
  isLoading,
  onViewDetails,
  dateRange,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900">Completed Administrations</h3>
        <p className="text-sm text-green-700 mt-1">
          {dateRange
            ? `${dateRange.start} to ${dateRange.end}`
            : 'Record of successfully administered medications'}
        </p>
      </div>

      <AdministrationLog
        records={completedRecords.filter((r) => !r.refusedByStudent)}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
        showStudent={true}
        showMedication={true}
      />
    </div>
  );
};

CompletedMedicationsList.displayName = 'CompletedMedicationsList';

export default CompletedMedicationsList;
