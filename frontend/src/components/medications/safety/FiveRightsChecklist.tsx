'use client';

/**
 * WF-SAFETY-001 | FiveRightsChecklist.tsx - Medication Five Rights Verification
 * Purpose: Ensure medication safety through pre-administration verification
 * Upstream: AdministrationForm | Dependencies: React, Modal, Checkbox
 * Downstream: Medication safety audit log
 * Related: AdministrationForm, MedicationSafetyLogger
 * Exports: FiveRightsChecklist component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface FiveRightsData {
  rightPatient: boolean;
  rightDrug: boolean;
  rightDose: boolean;
  rightRoute: boolean;
  rightTime: boolean;
}

export interface FiveRightsChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (verificationData: FiveRightsData) => void;
  studentName: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime?: string;
}

export const FiveRightsChecklist: React.FC<FiveRightsChecklistProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  medicationName,
  dosage,
  route,
  scheduledTime,
}) => {
  const [verification, setVerification] = useState<FiveRightsData>({
    rightPatient: false,
    rightDrug: false,
    rightDose: false,
    rightRoute: false,
    rightTime: false,
  });

  const allChecked = Object.values(verification).every((checked) => checked);

  const handleCheckboxChange = (field: keyof FiveRightsData) => {
    setVerification((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleConfirm = () => {
    if (allChecked) {
      onConfirm(verification);
      // Reset checkboxes after confirmation
      setVerification({
        rightPatient: false,
        rightDrug: false,
        rightDose: false,
        rightRoute: false,
        rightTime: false,
      });
    }
  };

  const handleCancel = () => {
    // Reset checkboxes on cancel
    setVerification({
      rightPatient: false,
      rightDrug: false,
      rightDose: false,
      rightRoute: false,
      rightTime: false,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Five Rights Verification
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verify all five rights before recording medication administration
            </p>
          </div>
        </div>

        {/* Information Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            Patient Safety Check: All five rights must be verified to proceed
          </p>
        </div>

        {/* Five Rights Checklist */}
        <div className="space-y-4 mb-6">
          {/* Right Patient */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              checked={verification.rightPatient}
              onChange={() => handleCheckboxChange('rightPatient')}
              id="right-patient"
              aria-label="Verify right patient"
            />
            <label
              htmlFor="right-patient"
              className="flex-1 cursor-pointer select-none"
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                1. Right Patient
                {verification.rightPatient && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified: <span className="font-medium">{studentName}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Confirm patient identity using photo, name, and/or ID
              </p>
            </label>
          </div>

          {/* Right Drug */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              checked={verification.rightDrug}
              onChange={() => handleCheckboxChange('rightDrug')}
              id="right-drug"
              aria-label="Verify right drug"
            />
            <label
              htmlFor="right-drug"
              className="flex-1 cursor-pointer select-none"
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                2. Right Drug
                {verification.rightDrug && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified: <span className="font-medium">{medicationName}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Confirm medication name matches prescription
              </p>
            </label>
          </div>

          {/* Right Dose */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              checked={verification.rightDose}
              onChange={() => handleCheckboxChange('rightDose')}
              id="right-dose"
              aria-label="Verify right dose"
            />
            <label
              htmlFor="right-dose"
              className="flex-1 cursor-pointer select-none"
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                3. Right Dose
                {verification.rightDose && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified: <span className="font-medium">{dosage}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Confirm dosage matches prescription
              </p>
            </label>
          </div>

          {/* Right Route */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              checked={verification.rightRoute}
              onChange={() => handleCheckboxChange('rightRoute')}
              id="right-route"
              aria-label="Verify right route"
            />
            <label
              htmlFor="right-route"
              className="flex-1 cursor-pointer select-none"
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                4. Right Route
                {verification.rightRoute && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified:{' '}
                <span className="font-medium capitalize">{route}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Confirm administration route matches prescription
              </p>
            </label>
          </div>

          {/* Right Time */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Checkbox
              checked={verification.rightTime}
              onChange={() => handleCheckboxChange('rightTime')}
              id="right-time"
              aria-label="Verify right time"
            />
            <label
              htmlFor="right-time"
              className="flex-1 cursor-pointer select-none"
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                5. Right Time
                {verification.rightTime && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {scheduledTime ? (
                  <>
                    Scheduled:{' '}
                    <span className="font-medium">{scheduledTime}</span>
                  </>
                ) : (
                  'Administering at current time'
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Confirm administration time is within scheduled window
              </p>
            </label>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Verification Progress</span>
            <span className="font-medium">
              {Object.values(verification).filter(Boolean).length} / 5
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.values(verification).filter(Boolean).length / 5) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={!allChecked}
            className={!allChecked ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {allChecked ? 'Confirm All Verified' : 'Verify All Rights'}
          </Button>
        </div>

        {/* Help Text */}
        {!allChecked && (
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-3">
            All five rights must be checked to proceed with administration
          </p>
        )}
      </div>
    </Modal>
  );
};

FiveRightsChecklist.displayName = 'FiveRightsChecklist';

export default FiveRightsChecklist;



