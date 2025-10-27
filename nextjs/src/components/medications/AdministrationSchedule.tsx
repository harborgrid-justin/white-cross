'use client';

/**
 * AdministrationSchedule Component
 */

import React from 'react';
import { MedicationSchedule, type ScheduledMedication } from './administration/MedicationSchedule';

export interface AdministrationScheduleProps {
  scheduledMedications: ScheduledMedication[];
  onAdminister?: (medicationId: string) => void;
  onSkip?: (medicationId: string) => void;
  title?: string;
  description?: string;
}

export const AdministrationSchedule: React.FC<AdministrationScheduleProps> = ({
  scheduledMedications,
  onAdminister,
  onSkip,
  title = 'Medication Administration Schedule',
  description,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>

      <MedicationSchedule
        scheduledMedications={scheduledMedications}
        onAdminister={onAdminister}
        onSkip={onSkip}
        showStudent={true}
      />
    </div>
  );
};

AdministrationSchedule.displayName = 'AdministrationSchedule';

export default AdministrationSchedule;
