'use client';

/**
 * StudentMedicationsList Component
 * Display medications for a specific student
 */

import React from 'react';
import { MedicationList, type Medication } from './core/MedicationList';
import { Button } from '@/components/ui/button';

export interface StudentMedicationsListProps {
  studentId: string;
  studentName: string;
  medications: Medication[];
  isLoading?: boolean;
  onAddMedication?: () => void;
  onEditMedication?: (medicationId: string) => void;
  onViewMedication?: (medication: Medication) => void;
}

export const StudentMedicationsList: React.FC<StudentMedicationsListProps> = ({
  studentId,
  studentName,
  medications,
  isLoading,
  onAddMedication,
  onEditMedication,
  onViewMedication,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
          <p className="text-sm text-gray-600 mt-1">{studentName}</p>
        </div>
        {onAddMedication && (
          <Button variant="default" onClick={onAddMedication}>
            Add Medication
          </Button>
        )}
      </div>

      <MedicationList
        medications={medications}
        isLoading={isLoading}
        onSelect={onViewMedication}
        onEdit={onEditMedication}
        showStudent={false}
        enableFiltering={true}
        enableSorting={true}
      />
    </div>
  );
};

StudentMedicationsList.displayName = 'StudentMedicationsList';

export default StudentMedicationsList;



