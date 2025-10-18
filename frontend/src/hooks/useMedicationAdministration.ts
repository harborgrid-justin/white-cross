/**
 * WF-COMP-135 | useMedicationAdministration.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/api, ./useMedicationToast | Dependencies: @tanstack/react-query, ../services/api, ./useMedicationToast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '../services/api';
import { useMedicationToast } from './useMedicationToast';
import { z } from 'zod';

// Validation schema
const administrationSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  medicationId: z.string().min(1, 'Medication ID is required'),
  dosage: z.string().min(1, 'Dosage is required').regex(
    /^[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp)$/i,
    'Invalid dosage format. Examples: 5mg, 2 tablets, 1 puff'
  ),
  administrationTime: z.string().min(1, 'Administration time is required'),
  notes: z.string().optional(),
});

export interface AdministrationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  administrationTime: string;
  notes?: string;
}

export interface UseMedicationAdministrationReturn {
  administerMedication: (data: AdministrationData) => Promise<void>;
  isAdministering: boolean;
  validateAdministration: (data: AdministrationData) => { isValid: boolean; errors: Record<string, string> };
}

/**
 * Hook for handling medication administration
 * Includes validation and API integration
 */
export const useMedicationAdministration = (): UseMedicationAdministrationReturn => {
  const queryClient = useQueryClient();
  const toast = useMedicationToast();

  const validateAdministration = (data: AdministrationData): { isValid: boolean; errors: Record<string, string> } => {
    try {
      administrationSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation error' } };
    }
  };

  const administerMutation = useMutation({
    mutationFn: async (data: AdministrationData) => {
      // Validate before sending
      const validation = validateAdministration(data);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Call the API to log medication administration
      const response = await medicationsApi.logAdministration({
        studentMedicationId: `${data.studentId}-${data.medicationId}`, // This should be the actual student medication ID
        scheduledTime: data.administrationTime,
        dosage: data.dosage,
        status: 'administered',
        notes: data.notes,
      });

      return response;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medication-schedule'] });
      toast.showSuccess('Medication administered successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to administer medication';
      toast.showError(message);
      throw error;
    },
  });

  const administerMedication = async (data: AdministrationData): Promise<void> => {
    await administerMutation.mutateAsync(data);
  };

  return {
    administerMedication,
    isAdministering: administerMutation.isPending,
    validateAdministration,
  };
};
