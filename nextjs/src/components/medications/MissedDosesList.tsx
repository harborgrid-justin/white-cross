'use client';

/**
 * MissedDosesList Component
 */

import React from 'react';
import { MedicationSchedule, type ScheduledMedication } from './administration/MedicationSchedule';

export interface MissedDosesListProps {
  missedDoses: ScheduledMedication[];
  onViewDetails?: (medicationId: string) => void;
}

export const MissedDosesList: React.FC<MissedDosesListProps> = ({ missedDoses, onViewDetails }) => {
  const missedOnly = missedDoses.filter((m) => m.status === 'missed');

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900">Missed Doses: {missedOnly.length}</h3>
        <p className="text-sm text-yellow-700 mt-1">Documentation of missed medication doses</p>
      </div>

      <MedicationSchedule scheduledMedications={missedOnly} showStudent={true} />
    </div>
  );
};

MissedDosesList.displayName = 'MissedDosesList';

export default MissedDosesList;
