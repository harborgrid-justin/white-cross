'use client';

/**
 * PRNMedicationsList Component
 * Display PRN (as needed) medications
 */

import React from 'react';
import { MedicationList, type Medication } from './core/MedicationList';

export interface PRNMedicationsListProps {
  prnMedications: Medication[];
  isLoading?: boolean;
  onAdminister?: (medicationId: string) => void;
  onViewDetails?: (medication: Medication) => void;
}

export const PRNMedicationsList: React.FC<PRNMedicationsListProps> = ({
  prnMedications,
  isLoading,
  onAdminister,
  onViewDetails,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900">PRN (As Needed) Medications</h3>
        <p className="text-sm text-purple-700 mt-1">
          These medications are administered only when needed, not on a regular schedule
        </p>
      </div>

      <MedicationList
        medications={prnMedications}
        isLoading={isLoading}
        onSelect={onViewDetails}
        showStudent={true}
        enableFiltering={true}
        enableSorting={true}
      />
    </div>
  );
};

PRNMedicationsList.displayName = 'PRNMedicationsList';

export default PRNMedicationsList;
