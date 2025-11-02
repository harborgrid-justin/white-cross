'use client';

/**
 * EmergencyMedicationsList Component
 */

import React from 'react';
import { MedicationList, type Medication } from './core/MedicationList';
import { Button } from '@/components/ui/button';

export interface EmergencyMedicationsListProps {
  emergencyMedications: Medication[];
  isLoading?: boolean;
  onAdminister?: (medicationId: string) => void;
  onViewDetails?: (medication: Medication) => void;
}

export const EmergencyMedicationsList: React.FC<EmergencyMedicationsListProps> = ({
  emergencyMedications,
  isLoading,
  onAdminister,
  onViewDetails,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-900">Emergency Medications</h3>
        <p className="text-sm text-red-700 mt-1">
          Life-saving medications for emergency situations (EpiPens, rescue inhalers, etc.)
        </p>
      </div>

      <MedicationList
        medications={emergencyMedications}
        isLoading={isLoading}
        onSelect={onViewDetails}
        showStudent={true}
        enableFiltering={true}
        enableSorting={true}
      />
    </div>
  );
};

EmergencyMedicationsList.displayName = 'EmergencyMedicationsList';

export default EmergencyMedicationsList;


