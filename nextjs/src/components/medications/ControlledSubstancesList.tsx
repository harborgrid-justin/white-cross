'use client';

/**
 * ControlledSubstancesList Component
 */

import React from 'react';
import { MedicationList, type Medication } from './core/MedicationList';

export interface ControlledSubstancesListProps {
  controlledSubstances: Medication[];
  isLoading?: boolean;
  onViewDetails?: (medication: Medication) => void;
  onEdit?: (medicationId: string) => void;
}

export const ControlledSubstancesList: React.FC<ControlledSubstancesListProps> = ({
  controlledSubstances,
  isLoading,
  onViewDetails,
  onEdit,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900">Controlled Substances</h3>
        <p className="text-sm text-orange-700 mt-1">
          DEA-regulated medications requiring special handling and documentation
        </p>
      </div>

      <MedicationList
        medications={controlledSubstances.filter((m) => m.isControlled)}
        isLoading={isLoading}
        onSelect={onViewDetails}
        onEdit={onEdit}
        showStudent={true}
        enableFiltering={true}
        enableSorting={true}
      />
    </div>
  );
};

ControlledSubstancesList.displayName = 'ControlledSubstancesList';

export default ControlledSubstancesList;
