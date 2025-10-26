/**
 * MedicationCard Component
 * Purpose: Compact medication display card with drug name, dosage, and schedule
 * Features: Alerts, active/inactive status, quick actions
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { StudentMedication } from '@/types/api';
import { medicationsThunks } from '../store/medicationsSlice';

interface MedicationCardProps {
  medication: StudentMedication;
  showStudent?: boolean;
  onStatusChange?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  showStudent = false,
  onStatusChange
}) => {
  const dispatch = useDispatch();

  const handleStatusToggle = () => {
    dispatch(medicationsThunks.update({
      id: medication.id,
      data: { isActive: !medication.isActive }
    }) as any);
    if (onStatusChange) {
      onStatusChange();
    }
  };

  return (
    <div className="medication-card">
      <div className="card-header">
        <h3 className="medication-name">{medication.medication?.name || 'Unknown Medication'}</h3>
        {showStudent && medication.student && (
          <span className="student-name">{medication.student.firstName} {medication.student.lastName}</span>
        )}
      </div>

      <div className="card-body">
        <div className="dosage">
          <span className="dosage-label">Dosage:</span>
          <span className="dosage-value">{medication.dosage}</span>
        </div>

        <div className="schedule">
          <span className="schedule-label">Schedule:</span>
          <span className="schedule-value">{medication.frequency}</span>
        </div>

        <div className="alerts">
          {medication.endDate && new Date(medication.endDate) < new Date() && (
            <span className="alert-badge">Expired</span>
          )}
        </div>
      </div>

      <div className="card-footer">
        <button className="view-details-button">View Details</button>
        <button className="edit-button">Edit</button>
        <button className="administer-button">Administer</button>
        <button className="toggle-status-button" onClick={handleStatusToggle}>
          {medication.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
};
