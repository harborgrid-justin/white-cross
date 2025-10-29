'use client';

/**
 * StudentMedicationSchedule Component
 */

import React from 'react';
import { MedicationSchedule, type ScheduledMedication } from './administration/MedicationSchedule';

export interface StudentMedicationScheduleProps {
  studentId: string;
  studentName: string;
  scheduledMedications: ScheduledMedication[];
  onAdminister?: (medicationId: string) => void;
  onSkip?: (medicationId: string) => void;
}

export const StudentMedicationSchedule: React.FC<StudentMedicationScheduleProps> = ({
  studentId,
  studentName,
  scheduledMedications,
  onAdminister,
  onSkip,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Medication Schedule</h2>
        <p className="text-sm text-gray-600 mt-1">{studentName}</p>
      </div>

      <MedicationSchedule
        scheduledMedications={scheduledMedications}
        onAdminister={onAdminister}
        onSkip={onSkip}
        showStudent={false}
      />
    </div>
  );
};

StudentMedicationSchedule.displayName = 'StudentMedicationSchedule';

export default StudentMedicationSchedule;
