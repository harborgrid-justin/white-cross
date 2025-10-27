'use client';

/**
 * StudentMedicationDetail Component
 */

import React from 'react';
import { MedicationDetails, type MedicationDetailData } from './core/MedicationDetails';

export interface StudentMedicationDetailProps {
  medication: MedicationDetailData;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  onAdminister?: () => void;
}

export const StudentMedicationDetail: React.FC<StudentMedicationDetailProps> = ({
  medication,
  onEdit,
  onDelete,
  onClose,
  onAdminister,
}) => {
  return (
    <div className="space-y-6">
      {onAdminister && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <button
            onClick={onAdminister}
            className="w-full text-left font-medium text-blue-900 hover:text-blue-800"
          >
            Record Administration →
          </button>
        </div>
      )}

      <MedicationDetails
        medication={medication}
        onEdit={onEdit}
        onDelete={onDelete}
        onClose={onClose}
        showActions={true}
      />
    </div>
  );
};

StudentMedicationDetail.displayName = 'StudentMedicationDetail';

export default StudentMedicationDetail;
