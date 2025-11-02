'use client';

/**
 * MedicationsTab Component
 * Main medications tab interface with list and actions
 */

import React, { useState } from 'react';
import { MedicationList, type Medication } from '@/components/medications/core/MedicationList';
import { Button } from '@/components/ui/button';
import MedicationFormModal from '../modals/MedicationFormModal';
import MedicationDetailsModal from '../modals/MedicationDetailsModal';
import { type MedicationFormData } from '@/components/medications/forms/MedicationForm';
import { type MedicationDetailData } from '@/components/medications/core/MedicationDetails';

export interface MedicationsTabProps {
  studentId?: string;
  medications: Medication[];
  isLoading?: boolean;
  onAddMedication?: (data: MedicationFormData) => Promise<void>;
  onEditMedication?: (id: string, data: MedicationFormData) => Promise<void>;
  onDeleteMedication?: (id: string) => Promise<void>;
  onLoadMedicationDetails?: (id: string) => Promise<MedicationDetailData>;
  showStudent?: boolean;
}

/**
 * MedicationsTab - Complete medications management interface
 *
 * Provides full CRUD functionality for medications with modals
 *
 * @param props - Component props
 * @returns Medications tab interface
 */
const MedicationsTab: React.FC<MedicationsTabProps> = ({
  studentId,
  medications,
  isLoading = false,
  onAddMedication,
  onEditMedication,
  onDeleteMedication,
  onLoadMedicationDetails,
  showStudent = true,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<MedicationDetailData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddMedication = async (data: MedicationFormData) => {
    if (onAddMedication) {
      await onAddMedication(data);
      setIsAddModalOpen(false);
    }
  };

  const handleEditMedication = async (data: MedicationFormData) => {
    if (onEditMedication && selectedMedication) {
      await onEditMedication(selectedMedication.id, data);
      setIsEditMode(false);
      setIsDetailsModalOpen(false);
      setSelectedMedication(null);
    }
  };

  const handleDeleteMedication = async () => {
    if (onDeleteMedication && selectedMedication) {
      if (confirm(`Are you sure you want to delete ${selectedMedication.name}?`)) {
        await onDeleteMedication(selectedMedication.id);
        setIsDetailsModalOpen(false);
        setSelectedMedication(null);
      }
    }
  };

  const handleViewMedication = async (medication: Medication) => {
    if (onLoadMedicationDetails) {
      const details = await onLoadMedicationDetails(medication.id);
      setSelectedMedication(details);
      setIsDetailsModalOpen(true);
    } else {
      // Use basic medication data if no details loader provided
      setSelectedMedication(medication as MedicationDetailData);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage student medications and administration
          </p>
        </div>
        {onAddMedication && (
          <Button variant="default" onClick={() => setIsAddModalOpen(true)}>
            Add Medication
          </Button>
        )}
      </div>

      {/* Medications List */}
      <MedicationList
        medications={medications}
        isLoading={isLoading}
        onSelect={handleViewMedication}
        onEdit={(id) => {
          const med = medications.find((m) => m.id === id);
          if (med) handleViewMedication(med).then(() => setIsEditMode(true));
        }}
        showStudent={showStudent}
        enableFiltering={true}
        enableSorting={true}
      />

      {/* Add Medication Modal */}
      {onAddMedication && (
        <MedicationFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddMedication}
          mode="create"
          initialData={studentId ? { studentId } : undefined}
        />
      )}

      {/* Edit Medication Modal */}
      {onEditMedication && selectedMedication && (
        <MedicationFormModal
          isOpen={isEditMode}
          onClose={() => {
            setIsEditMode(false);
            setSelectedMedication(null);
          }}
          onSubmit={handleEditMedication}
          mode="edit"
          initialData={selectedMedication}
        />
      )}

      {/* Medication Details Modal */}
      <MedicationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedMedication(null);
        }}
        medication={selectedMedication}
        onEdit={onEditMedication ? handleEditClick : undefined}
        onDelete={onDeleteMedication ? handleDeleteMedication : undefined}
        showActions={true}
      />
    </div>
  );
};

MedicationsTab.displayName = 'MedicationsTab';

export default MedicationsTab;



