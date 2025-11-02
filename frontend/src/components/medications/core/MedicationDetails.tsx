'use client';

/**
 * WF-MED-002 | MedicationDetails.tsx - Medication Details Component
 * Purpose: Display comprehensive medication information
 * Upstream: Medication API | Dependencies: React, UI components
 * Downstream: Medication pages | Called by: Detail views, modals
 * Related: MedicationList, MedicationForm
 * Exports: MedicationDetails component | Key Features: Full medication data display
 * Last Updated: 2025-10-27 | File Type: .tsx
 * Critical Path: Medication selection → Detail display → User actions
 * LLM Context: Detailed medication view component for White Cross healthcare platform
 */

import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Medication detail data interface
 *
 * @interface MedicationDetailData
 */
export interface MedicationDetailData {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  dosage: string;
  frequency: string;
  route: string;
  prescriber: string;
  prescriberNPI?: string;
  pharmacy?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'discontinued' | 'pending';
  isControlled: boolean;
  controlledSubstanceSchedule?: string;
  instructions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  studentId?: string;
  studentName?: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  lastRefillDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * MedicationDetails component props
 *
 * @interface MedicationDetailsProps
 */
export interface MedicationDetailsProps {
  medication: MedicationDetailData;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  showActions?: boolean;
}

/**
 * MedicationDetails component for displaying comprehensive medication information
 *
 * Displays all medication details in an organized, readable format with sections
 * for basic info, administration details, safety information, and prescription details.
 *
 * **Features:**
 * - Organized information sections
 * - Status and controlled substance badges
 * - Safety information display
 * - Prescription and refill tracking
 * - Action buttons (edit, delete)
 * - HIPAA-compliant data presentation
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear labels and headings
 * - Keyboard accessible actions
 *
 * @component
 * @param {MedicationDetailsProps} props - Component props
 * @returns {JSX.Element} Rendered medication details
 *
 * @example
 * ```tsx
 * <MedicationDetails
 *   medication={medicationData}
 *   onEdit={() => setEditMode(true)}
 *   onDelete={() => handleDelete(medicationData.id)}
 *   showActions={true}
 * />
 * ```
 */
export const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  medication,
  onEdit,
  onDelete,
  onClose,
  showActions = true,
}) => {
  /**
   * Get status badge color
   */
  const getStatusColor = (status: MedicationDetailData['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || colors.inactive;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{medication.name}</h2>
          {medication.genericName && medication.brandName && (
            <p className="text-sm text-gray-600 mt-1">
              {medication.genericName} ({medication.brandName})
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                medication.status
              )}`}
            >
              {medication.status}
            </span>
            {medication.isControlled && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Controlled Substance
                {medication.controlledSubstanceSchedule && ` - Schedule ${medication.controlledSubstanceSchedule}`}
              </span>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete}>
                Delete
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Dosage</dt>
            <dd className="mt-1 text-sm text-gray-900">{medication.dosage}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Frequency</dt>
            <dd className="mt-1 text-sm text-gray-900">{medication.frequency}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Route</dt>
            <dd className="mt-1 text-sm text-gray-900">{medication.route}</dd>
          </div>
          {medication.studentName && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Student</dt>
              <dd className="mt-1 text-sm text-gray-900">{medication.studentName}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{medication.startDate}</dd>
          </div>
          {medication.endDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{medication.endDate}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Prescriber Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescriber Information</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Prescriber</dt>
            <dd className="mt-1 text-sm text-gray-900">{medication.prescriber}</dd>
          </div>
          {medication.prescriberNPI && (
            <div>
              <dt className="text-sm font-medium text-gray-500">NPI Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{medication.prescriberNPI}</dd>
            </div>
          )}
          {medication.pharmacy && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Pharmacy</dt>
              <dd className="mt-1 text-sm text-gray-900">{medication.pharmacy}</dd>
            </div>
          )}
          {medication.prescriptionNumber && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Prescription Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{medication.prescriptionNumber}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Administration Instructions */}
      {medication.instructions && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Administration Instructions</h3>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{medication.instructions}</p>
        </div>
      )}

      {/* Safety Information */}
      {(medication.sideEffects || medication.contraindications) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Information</h3>
          {medication.sideEffects && medication.sideEffects.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Potential Side Effects</h4>
              <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                {medication.sideEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
          {medication.contraindications && medication.contraindications.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Contraindications</h4>
              <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                {medication.contraindications.map((contra, index) => (
                  <li key={index}>{contra}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Refill Information */}
      {(medication.refillsRemaining !== undefined || medication.lastRefillDate) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Refill Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medication.refillsRemaining !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Refills Remaining</dt>
                <dd className="mt-1 text-sm text-gray-900">{medication.refillsRemaining}</dd>
              </div>
            )}
            {medication.lastRefillDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Refill Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{medication.lastRefillDate}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Notes */}
      {medication.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{medication.notes}</p>
        </div>
      )}

      {/* Metadata */}
      {(medication.createdAt || medication.updatedAt) && (
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
          {medication.createdAt && <p>Created: {medication.createdAt}</p>}
          {medication.updatedAt && <p>Last Updated: {medication.updatedAt}</p>}
        </div>
      )}
    </div>
  );
};

MedicationDetails.displayName = 'MedicationDetails';

export default MedicationDetails;


