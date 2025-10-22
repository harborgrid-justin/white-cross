/**
 * MedicationCard Component
 * Purpose: Compact medication display card with drug name, dosage, and schedule
 * Features: Alerts, active/inactive status, quick actions
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { Medication } from '../../../types/medication.types';
import { toggleMedicationStatus } from '../store/medicationsSlice';

interface MedicationCardProps {
  medication: Medication;
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
    dispatch(toggleMedicationStatus(medication.id));
    if (onStatusChange) {
      onStatusChange();
    }
  };

  return (
    <div className="medication-card">
      <div className="card-header">
        <h3 className="medication-name">{medication.name}</h3>
        {showStudent && (
          <span className="student-name">{medication.studentName}</span>
        )}
      </div>

      <div className="card-body">
        <div className="dosage">
          <span className="dosage-label">Dosage:</span>
          <span className="dosage-value">{medication.dosage}</span>
        </div>

        <div className="schedule">
          <span className="schedule-label">Schedule:</span>
          <span className="schedule-value">{medication.schedule}</span>
        </div>

        <div className="alerts">
          {medication.alerts && (
            <span className="alert-badge">{medication.alerts}</span>
          )}
        </div>
      </div>

      <div className="card-footer">
        <button className="view-details-button">View Details</button>
        <button className="edit-button">Edit</button>
        <button className="administer-button">Administer</button>
        <button className="toggle-status-button" onClick={handleStatusToggle}>
          {medication.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
};
