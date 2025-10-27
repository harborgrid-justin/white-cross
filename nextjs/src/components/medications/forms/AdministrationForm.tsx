'use client';

/**
 * WF-MED-FORM-002 | AdministrationForm.tsx - Medication Administration Form
 * Purpose: Record medication administration events with safety checks
 * Upstream: Administration API | Dependencies: React, Form inputs, Safety components
 * Downstream: Administration log, Audit trail | Called by: Medication administration flow
 * Related: AdministrationLog, MedicationSchedule, FiveRightsChecklist, AllergyAlertBanner
 * Exports: AdministrationForm component
 * Last Updated: 2025-10-27 | File Type: .tsx
 *
 * SAFETY FEATURES:
 * - Five Rights Verification Checklist (pre-submission)
 * - Inline Allergy Alerts
 * - Student Photo Verification
 * - Comprehensive Audit Logging
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { FiveRightsChecklist, FiveRightsData } from '@/components/medications/safety/FiveRightsChecklist';
import { AllergyAlertBanner } from '@/components/medications/safety/AllergyAlertBanner';
import { StudentPhotoVerification } from '@/components/medications/safety/StudentPhotoVerification';
import { useStudentAllergies } from '@/hooks/useStudentAllergies';
import { useStudentPhoto } from '@/hooks/useStudentPhoto';
import { logFiveRightsVerification, logAllergyCheck, logMedicationAdministration } from '@/lib/audit/medication-safety-logger';

export interface AdministrationFormData {
  medicationId: string;
  studentId: string;
  administeredAt: string;
  dosageGiven: string;
  administeredBy: string;
  route: string;
  site?: string;
  witnessedBy?: string;
  reactions?: string;
  notes?: string;
  refusedByStudent?: boolean;
  refusalReason?: string;
}

export interface AdministrationFormProps {
  medicationId: string;
  medicationName: string;
  studentId: string;
  studentName: string;
  scheduledDosage?: string;
  scheduledTime?: string;
  onSubmit: (data: AdministrationFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  enableSafetyChecks?: boolean; // Toggle for safety features (default: true)
}

export const AdministrationForm: React.FC<AdministrationFormProps> = ({
  medicationId,
  medicationName,
  studentId,
  studentName,
  scheduledDosage,
  scheduledTime,
  onSubmit,
  onCancel,
  isLoading = false,
  enableSafetyChecks = true,
}) => {
  const [formData, setFormData] = useState<Partial<AdministrationFormData>>({
    medicationId,
    studentId,
    administeredAt: new Date().toISOString().slice(0, 16),
    dosageGiven: scheduledDosage || '',
    route: 'oral',
    refusedByStudent: false,
  });

  const [showFiveRightsModal, setShowFiveRightsModal] = useState(false);
  const [fiveRightsVerified, setFiveRightsVerified] = useState(false);

  // Fetch student allergies and photo
  const {
    allergies,
    isLoading: allergiesLoading,
    error: allergiesError,
    hasAllergies,
    hasSevereAllergies,
  } = useStudentAllergies(studentId, { enabled: enableSafetyChecks });

  const {
    photoUrl,
    studentName: photoStudentName,
    dateOfBirth,
    studentIdNumber,
    isLoading: photoLoading,
  } = useStudentPhoto(studentId, { enabled: enableSafetyChecks });

  // Log allergy check when allergies are loaded
  useEffect(() => {
    if (enableSafetyChecks && !allergiesLoading && !allergiesError) {
      logAllergyCheck({
        timestamp: new Date().toISOString(),
        userId: 'current-user-id', // TODO: Get from auth context
        studentId,
        medicationId,
        allergiesChecked: true,
        allergiesPresent: hasAllergies,
        allergyCount: allergies.length,
        severeAllergies: hasSevereAllergies
          ? allergies.filter((a) => a.severity === 'severe').map((a) => a.allergen)
          : undefined,
      });
    }
  }, [
    allergiesLoading,
    allergiesError,
    hasAllergies,
    allergies,
    hasSevereAllergies,
    studentId,
    medicationId,
    enableSafetyChecks,
  ]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If safety checks are enabled, show Five Rights modal
    if (enableSafetyChecks && !fiveRightsVerified) {
      setShowFiveRightsModal(true);
      return;
    }

    // Submit the form
    await onSubmit(formData as AdministrationFormData);
  };

  const handleFiveRightsConfirm = async (verificationData: FiveRightsData) => {
    // Log Five Rights verification
    await logFiveRightsVerification({
      timestamp: new Date().toISOString(),
      userId: 'current-user-id', // TODO: Get from auth context
      studentId,
      medicationId,
      verification: verificationData,
      studentName: photoStudentName || studentName,
      medicationName,
      dosage: formData.dosageGiven || '',
      route: formData.route || '',
      scheduledTime,
    });

    // Log complete medication administration
    await logMedicationAdministration({
      userId: 'current-user-id', // TODO: Get from auth context
      studentId,
      medicationId,
      fiveRightsVerified: Object.values(verificationData).every(Boolean),
      allergiesChecked: true,
      photoVerified: !!photoUrl,
    });

    setFiveRightsVerified(true);
    setShowFiveRightsModal(false);

    // Submit the form
    await onSubmit(formData as AdministrationFormData);
  };

  const updateField = (field: keyof AdministrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Student Photo Verification - SAFETY FEATURE */}
        {enableSafetyChecks && (
          <StudentPhotoVerification
            studentId={studentId}
            studentName={photoStudentName || studentName}
            studentPhoto={photoUrl}
            dateOfBirth={dateOfBirth}
            studentIdNumber={studentIdNumber}
            size="md"
          />
        )}

        {/* Allergy Alert Banner - SAFETY FEATURE */}
        {enableSafetyChecks && (
          <AllergyAlertBanner
            allergies={allergies}
            isLoading={allergiesLoading}
            error={allergiesError}
          />
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100">
            Administration Details
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Medication: {medicationName}
          </p>
          {!enableSafetyChecks && (
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Student: {studentName}
            </p>
          )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Administered *</label>
          <Input
            type="datetime-local"
            value={formData.administeredAt}
            onChange={(e) => updateField('administeredAt', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Given *</label>
          <Input
            value={formData.dosageGiven}
            onChange={(e) => updateField('dosageGiven', e.target.value)}
            placeholder="e.g., 500mg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Route *</label>
          <Select value={formData.route} onChange={(e) => updateField('route', e.target.value)} required>
            <option value="oral">Oral</option>
            <option value="topical">Topical</option>
            <option value="inhaled">Inhaled</option>
            <option value="injection">Injection</option>
            <option value="sublingual">Sublingual</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Administration Site</label>
          <Input
            value={formData.site || ''}
            onChange={(e) => updateField('site', e.target.value)}
            placeholder="e.g., Left arm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Administered By *</label>
          <Input
            value={formData.administeredBy}
            onChange={(e) => updateField('administeredBy', e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Witnessed By</label>
          <Input
            value={formData.witnessedBy || ''}
            onChange={(e) => updateField('witnessedBy', e.target.value)}
            placeholder="Witness name"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={formData.refusedByStudent}
          onChange={(e) => updateField('refusedByStudent', e.target.checked)}
        />
        <label className="text-sm font-medium text-gray-700">Student refused medication</label>
      </div>

      {formData.refusedByStudent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Refusal Reason</label>
          <Textarea
            value={formData.refusalReason || ''}
            onChange={(e) => updateField('refusalReason', e.target.value)}
            placeholder="Reason for refusal..."
            rows={2}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reactions or Side Effects</label>
        <Textarea
          value={formData.reactions || ''}
          onChange={(e) => updateField('reactions', e.target.value)}
          placeholder="Any observed reactions..."
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isLoading}>
          {enableSafetyChecks ? 'Verify & Record Administration' : 'Record Administration'}
        </Button>
      </div>
    </form>

      {/* Five Rights Verification Modal - SAFETY FEATURE */}
      {enableSafetyChecks && (
        <FiveRightsChecklist
          isOpen={showFiveRightsModal}
          onClose={() => setShowFiveRightsModal(false)}
          onConfirm={handleFiveRightsConfirm}
          studentName={photoStudentName || studentName}
          medicationName={medicationName}
          dosage={formData.dosageGiven || ''}
          route={formData.route || ''}
          scheduledTime={scheduledTime}
        />
      )}
    </>
  );
};

AdministrationForm.displayName = 'AdministrationForm';

export default AdministrationForm;
