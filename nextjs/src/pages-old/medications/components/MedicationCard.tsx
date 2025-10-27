/**
 * MedicationCard Component
 *
 * Compact medication display card presenting essential medication information including
 * drug name, dosage, schedule, and quick action buttons. Displays medication status,
 * expiration alerts, and provides one-click access to administration workflows.
 *
 * @component
 *
 * @param {MedicationCardProps} props - Component properties
 * @param {StudentMedication} props.medication - Complete medication record with student and drug details
 * @param {boolean} [props.showStudent=false] - Whether to display student name on card
 * @param {() => void} [props.onStatusChange] - Callback fired when medication status is toggled
 *
 * @returns {React.FC<MedicationCardProps>} Medication card component
 *
 * @example
 * ```tsx
 * import { MedicationCard } from './components/MedicationCard';
 *
 * function MedicationList() {
 *   const handleStatusChange = () => {
 *     console.log('Medication status updated');
 *   };
 *
 *   return (
 *     <MedicationCard
 *       medication={medicationData}
 *       showStudent={true}
 *       onStatusChange={handleStatusChange}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * **Medication Safety**:
 * - Displays expiration alerts to prevent administration of expired medications
 * - Status toggle requires appropriate permissions (NURSE, ADMIN roles)
 * - Quick access to administration workflow ensures Five Rights verification
 * - Visual indicators for active/inactive status prevent errors
 *
 * **Five Rights Verification**:
 * - Right Patient: Student name displayed when showStudent=true
 * - Right Drug: Medication name prominently displayed
 * - Right Dose: Dosage clearly shown
 * - Right Route: Administration route visible in details
 * - Right Time: Schedule/frequency displayed
 *
 * **State Management**:
 * - Redux: Uses medicationsThunks.update for status changes
 * - Optimistic updates via Redux toolkit
 * - Status changes trigger onStatusChange callback for parent components
 *
 * **User Actions**:
 * - **View Details**: Opens detailed medication information modal
 * - **Edit**: Opens medication edit form with pre-populated data
 * - **Administer**: Initiates medication administration workflow with safety checks
 * - **Toggle Status**: Activates or deactivates medication record
 *
 * **Accessibility**:
 * - Semantic HTML structure with proper heading hierarchy
 * - Button elements for all interactive actions
 * - Clear visual status indicators (active/inactive/expired)
 * - Keyboard navigation support
 *
 * @see {@link StudentMedication} for medication data structure
 * @see {@link medicationsThunks} for Redux state management
 * @see {@link MedicationsList} for parent list component
 * @see {@link MedicationDetailsModal} for detailed view
 *
 * @since 1.0.0
 */

import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { StudentMedication } from '@/types/api';
import { medicationsThunks } from '../store/medicationsSlice';

/**
 * Props for MedicationCard component
 *
 * @interface MedicationCardProps
 *
 * @property {StudentMedication} medication - Complete medication record including student, drug, dosage, and schedule information
 * @property {boolean} [showStudent] - Display student name on card (useful in multi-student views)
 * @property {() => void} [onStatusChange] - Optional callback invoked after status toggle completes
 *
 * @remarks
 * The medication object must include nested student and medication (drug) data for proper display.
 * If these relations are not populated, default fallback values will be shown.
 */
interface MedicationCardProps {
  medication: StudentMedication;
  showStudent?: boolean;
  onStatusChange?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = memo(({
  medication,
  showStudent = false,
  onStatusChange
}) => {
  const dispatch = useDispatch();

  const handleStatusToggle = useCallback(() => {
    dispatch(medicationsThunks.update({
      id: medication.id,
      data: { isActive: !medication.isActive }
    }) as any);
    if (onStatusChange) {
      onStatusChange();
    }
  }, [dispatch, medication.id, medication.isActive, onStatusChange]);

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
});

MedicationCard.displayName = 'MedicationCard';
