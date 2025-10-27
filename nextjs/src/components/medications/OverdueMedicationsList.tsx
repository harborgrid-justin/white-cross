'use client';

/**
 * OverdueMedicationsList Component
 */

import React from 'react';
import { MedicationSchedule, type ScheduledMedication } from './administration/MedicationSchedule';

export interface OverdueMedicationsListProps {
  overdueMedications: ScheduledMedication[];
  onAdminister?: (medicationId: string) => void;
}

export const OverdueMedicationsList: React.FC<OverdueMedicationsListProps> = ({
  overdueMedications,
  onAdminister,
}) => {
  const overdueOnly = overdueMedications.filter((m) => m.status === 'overdue');

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900">Overdue Medications: {overdueOnly.length}</h3>
        <p className="text-sm text-orange-700 mt-1">These medications are past their scheduled administration time</p>
      </div>

      <MedicationSchedule scheduledMedications={overdueOnly} onAdminister={onAdminister} showStudent={true} />
    </div>
  );
};

OverdueMedicationsList.displayName = 'OverdueMedicationsList';

export default OverdueMedicationsList;
