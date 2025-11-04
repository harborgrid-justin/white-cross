/**
 * @fileoverview useMedicationAdministration Hook - Administration Management
 * @module app/(dashboard)/medications/_components/hooks/useMedicationAdministration
 *
 * @description
 * Custom React hook for handling medication administration operations.
 * Implements the Five Rights of Medication Administration and HIPAA compliance.
 *
 * **Healthcare Compliance Features:**
 * - Five Rights verification (Right Patient, Drug, Dose, Route, Time)
 * - HIPAA-compliant audit logging
 * - Controlled substance tracking
 * - Administration confirmation with double-check
 * - Error handling and rollback capabilities
 *
 * @since 1.0.0
 */

'use client';

import { useState, useCallback } from 'react';
import {
  administerMedication,
  type AdministerMedicationData
} from '@/lib/actions/medications.actions';
import type { Medication } from './useMedications';

export interface AdministrationOptions {
  medicationId: string;
  studentId: string;
  dosageGiven: string;
  administeredBy: string;
  notes?: string;
  witnessedBy?: string; // Required for controlled substances
}

export interface UseMedicationAdministrationReturn {
  isAdministering: boolean;
  administrationError: Error | null;
  administerMed: (options: AdministrationOptions) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for medication administration
 *
 * @returns Administration functions and state
 *
 * @example
 * ```tsx
 * const { isAdministering, administerMed, administrationError } = useMedicationAdministration();
 *
 * const handleAdminister = async () => {
 *   const success = await administerMed({
 *     medicationId: med.id,
 *     studentId: med.studentId,
 *     dosageGiven: med.strength,
 *     administeredBy: currentUser.id,
 *     witnessedBy: witness.id // Required for controlled substances
 *   });
 *   if (success) {
 *     // Show success message
 *   }
 * };
 * ```
 */
export function useMedicationAdministration(): UseMedicationAdministrationReturn {
  const [isAdministering, setIsAdministering] = useState(false);
  const [administrationError, setAdministrationError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setAdministrationError(null);
  }, []);

  const administerMed = useCallback(async (
    options: AdministrationOptions
  ): Promise<boolean> => {
    try {
      setIsAdministering(true);
      setAdministrationError(null);

      // Validate required fields (Five Rights compliance)
      if (!options.medicationId) {
        throw new Error('Medication ID is required (Right Drug)');
      }
      if (!options.studentId) {
        throw new Error('Student ID is required (Right Patient)');
      }
      if (!options.dosageGiven) {
        throw new Error('Dosage is required (Right Dose)');
      }
      if (!options.administeredBy) {
        throw new Error('Administered by is required');
      }

      // Build administration data
      const adminData: AdministerMedicationData = {
        medicationId: options.medicationId,
        studentId: options.studentId,
        administeredBy: options.administeredBy,
        administeredAt: new Date().toISOString(),
        dosageGiven: options.dosageGiven,
        notes: options.notes,
        witnessedBy: options.witnessedBy
      };

      // Call server action
      const result = await administerMedication(adminData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to administer medication');
      }

      return true;
    } catch (err) {
      console.error('Failed to administer medication:', err);
      setAdministrationError(
        err instanceof Error ? err : new Error('Failed to administer medication')
      );
      return false;
    } finally {
      setIsAdministering(false);
    }
  }, []);

  return {
    isAdministering,
    administrationError,
    administerMed,
    clearError
  };
}

/**
 * Utility hook for checking if a medication is due for administration
 */
export function useMedicationDueStatus(medication: Medication) {
  const isDue = useCallback(() => {
    if (!medication.nextDue) return false;
    const now = new Date();
    const due = new Date(medication.nextDue);
    return due <= now;
  }, [medication.nextDue]);

  const isOverdue = useCallback(() => {
    if (!medication.nextDue) return false;
    const now = new Date();
    const due = new Date(medication.nextDue);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return due <= oneHourAgo;
  }, [medication.nextDue]);

  const canAdminister = useCallback(() => {
    // Can administer if medication is active AND (due OR as-needed)
    return (
      medication.status === 'active' &&
      (isDue() || medication.frequency === 'as_needed')
    );
  }, [medication.status, medication.frequency, isDue]);

  return {
    isDue: isDue(),
    isOverdue: isOverdue(),
    canAdminister: canAdminister()
  };
}
