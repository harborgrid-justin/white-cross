/**
 * WF-COMP-286 | useMedicationAdministration.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../api, ./useOfflineQueue, ./useMedicationSafety | Dependencies: react, @tanstack/react-query, ../api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces, classes | Key Features: useState, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Medication Administration Hook
 *
 * SAFETY-CRITICAL HOOK
 *
 * Purpose: Manages medication administration workflow with Five Rights verification
 *
 * CRITICAL SAFETY REQUIREMENTS:
 * - NO caching for administration records
 * - NO optimistic updates (too risky)
 * - Mandatory Five Rights verification
 * - All operations audited
 * - Offline queue support
 *
 * Five Rights:
 * 1. Right Patient
 * 2. Right Medication
 * 3. Right Dose
 * 4. Right Route
 * 5. Right Time
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationAdministrationApi as administrationApi } from '@/services';
import type {
  AdministrationSession,
  FiveRightsData,
  FiveRightsVerificationResult,
  AdministrationRecord,
  AdministrationLog,
  MedicationReminder,
  AdministrationHistoryFilters,
} from '@/services';
import { useOfflineQueue } from './useOfflineQueue';
import { useMedicationSafety } from './useMedicationSafety';

// Query Keys
export const administrationKeys = {
  all: ['medication-administration'] as const,
  sessions: () => [...administrationKeys.all, 'session'] as const,
  session: (id: string) => [...administrationKeys.sessions(), id] as const,
  history: () => [...administrationKeys.all, 'history'] as const,
  historyFiltered: (filters?: AdministrationHistoryFilters) =>
    [...administrationKeys.history(), filters] as const,
  today: (nurseId?: string) => [...administrationKeys.all, 'today', nurseId] as const,
  reminders: () => [...administrationKeys.all, 'reminders'] as const,
  upcoming: (nurseId?: string, hours?: number) =>
    [...administrationKeys.reminders(), 'upcoming', nurseId, hours] as const,
  overdue: () => [...administrationKeys.reminders(), 'overdue'] as const,
  schedule: (studentId: string, date?: string) =>
    [...administrationKeys.all, 'schedule', studentId, date] as const,
} as const;

// Custom Errors
export class MedicationSafetyError extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = 'MedicationSafetyError';
  }
}

export class AllergyWarningError extends Error {
  constructor(message: string, public allergies: any[]) {
    super(message);
    this.name = 'AllergyWarningError';
  }
}

// Hook Return Type
export interface UseMedicationAdministrationReturn {
  // Session management
  sessionData: AdministrationSession | null;
  initSession: ReturnType<typeof useMutation<AdministrationSession, Error, string>>;

  // Five Rights verification
  verifyFiveRights: (data: FiveRightsData) => FiveRightsVerificationResult;
  serverVerifyFiveRights: ReturnType<
    typeof useMutation<FiveRightsVerificationResult, Error, FiveRightsData>
  >;

  // Administration recording
  recordAdministration: ReturnType<typeof useMutation<AdministrationLog, Error, AdministrationRecord>>;
  recordRefusal: ReturnType<
    typeof useMutation<AdministrationLog, Error, { prescriptionId: string; scheduledTime: string; reason: string; notes?: string }>
  >;
  recordMissed: ReturnType<
    typeof useMutation<AdministrationLog, Error, { prescriptionId: string; scheduledTime: string; reason: string; notes?: string }>
  >;
  recordHeld: ReturnType<
    typeof useMutation<AdministrationLog, Error, { prescriptionId: string; scheduledTime: string; reason: string; clinicalRationale: string }>
  >;

  // Queries
  todayAdministrations: ReturnType<typeof useQuery<AdministrationLog[]>>;
  upcomingReminders: ReturnType<typeof useQuery<MedicationReminder[]>>;
  overdueAdministrations: ReturnType<typeof useQuery<MedicationReminder[]>>;

  // Helpers
  clearSession: () => void;
  isSessionActive: boolean;
}

/**
 * Medication Administration Hook
 */
export function useMedicationAdministration(nurseId?: string): UseMedicationAdministrationReturn {
  const queryClient = useQueryClient();
  const [sessionData, setSessionData] = useState<AdministrationSession | null>(null);
  const { addToQueue, isOnline } = useOfflineQueue();
  const { logAdministrationAttempt, logAdministrationSuccess, logAdministrationError } = useMedicationSafety();

  // Initialize administration session
  const initSession = useMutation({
    mutationFn: (prescriptionId: string) => {
      logAdministrationAttempt('init-session', { prescriptionId });
      return administrationApi.initiateAdministration(prescriptionId);
    },
    onSuccess: (session) => {
      setSessionData(session);

      // Pre-fetch safety data
      queryClient.prefetchQuery({
        queryKey: ['allergies', session.studentId],
        queryFn: () => administrationApi.checkAllergies(session.studentId, session.medicationId),
      });

      queryClient.prefetchQuery({
        queryKey: ['interactions', session.studentId, session.medicationId],
        queryFn: () => administrationApi.checkInteractions(session.studentId, session.medicationId),
      });

      // Store in session storage for recovery
      sessionStorage.setItem('current-administration-session', JSON.stringify(session));

      logAdministrationSuccess('init-session', { sessionId: session.sessionId });
    },
    onError: (error: Error) => {
      logAdministrationError('init-session', error);
      setSessionData(null);
    },
  });

  // Client-side Five Rights verification
  const verifyFiveRights = useCallback(
    (data: FiveRightsData): FiveRightsVerificationResult => {
      if (!sessionData) {
        return {
          valid: false,
          errors: ['No active session'],
          warnings: [],
          criticalWarnings: [],
          canProceed: false,
          requiresOverride: false,
        };
      }

      const errors: string[] = [];
      const warnings: string[] = [];
      const criticalWarnings: string[] = [];

      // Right Patient
      if (data.studentBarcode !== sessionData.studentBarcode) {
        errors.push('PATIENT VERIFICATION FAILED - Barcode mismatch');
        criticalWarnings.push('Wrong patient - Do not proceed');
      }

      if (!data.patientPhotoConfirmed) {
        errors.push('Patient photo verification required');
      }

      // Right Medication
      if (data.medicationNDC !== sessionData.prescriptionNDC) {
        errors.push('MEDICATION VERIFICATION FAILED - NDC mismatch');
        criticalWarnings.push('Wrong medication - Do not proceed');
      }

      if (!data.lasaConfirmed && sessionData.medication.name.match(/\b(look-alike|sound-alike)\b/i)) {
        warnings.push('LASA medication - Please confirm again');
      }

      // Right Dose
      if (!isValidDose(data.scannedDose, sessionData.prescribedDose)) {
        errors.push('DOSE VERIFICATION FAILED - Does not match prescription');
        warnings.push(`Prescribed: ${sessionData.prescribedDose}, Scanned: ${data.scannedDose}`);
      }

      // Right Route
      if (data.route !== sessionData.prescribedRoute) {
        errors.push('ROUTE VERIFICATION FAILED - Does not match prescription');
        criticalWarnings.push(`Prescribed route: ${sessionData.prescribedRoute}, Selected: ${data.route}`);
      }

      // Right Time
      if (!isWithinAdministrationWindow(data.administrationTime, sessionData.administrationWindow)) {
        warnings.push('Administration outside recommended time window');
        if (!data.timeOverrideReason) {
          errors.push('Time override reason required');
        }
      }

      // Allergy check
      if (sessionData.student.allergies && sessionData.student.allergies.length > 0) {
        if (!data.allergyAcknowledged) {
          errors.push('ALLERGY WARNING - Must be acknowledged');
          criticalWarnings.push('Patient has known allergies');
        }
      }

      const valid = errors.length === 0;
      const canProceed = valid || (errors.length === warnings.length && warnings.length > 0);

      return {
        valid,
        errors,
        warnings,
        criticalWarnings,
        canProceed,
        requiresOverride: !valid && errors.length > 0,
      };
    },
    [sessionData]
  );

  // Server-side Five Rights verification
  const serverVerifyFiveRights = useMutation({
    mutationFn: (data: FiveRightsData) => {
      if (!sessionData) throw new Error('No active session');
      return administrationApi.verifyFiveRights(sessionData, data);
    },
    onSuccess: (result) => {
      logAdministrationSuccess('five-rights-verification', {
        sessionId: sessionData?.sessionId,
        valid: result.valid,
      });
    },
    onError: (error: Error) => {
      logAdministrationError('five-rights-verification', error);
    },
  });

  // Record administration (NO OPTIMISTIC UPDATE)
  const recordAdministration = useMutation({
    mutationFn: async (data: AdministrationRecord) => {
      // Final server-side verification
      if (!sessionData) throw new Error('No active session');

      const verification = await administrationApi.verifyFiveRights(sessionData, data.fiveRightsData);

      if (!verification.valid) {
        throw new MedicationSafetyError('Five Rights verification failed', verification.errors);
      }

      // Check allergies one more time
      const allergies = await administrationApi.checkAllergies(data.studentId, data.medicationId);
      if (allergies.length > 0 && !data.fiveRightsData.allergyAcknowledged) {
        throw new AllergyWarningError('Allergy warning not acknowledged', allergies);
      }

      // If offline, queue for later
      if (!isOnline) {
        await addToQueue(data);
        throw new Error('Offline - Administration queued for sync');
      }

      // Record administration
      return administrationApi.recordAdministration(data);
    },
    onSuccess: (result) => {
      // Clear session
      setSessionData(null);
      sessionStorage.removeItem('current-administration-session');

      // Invalidate queries (NO optimistic update)
      queryClient.invalidateQueries({ queryKey: administrationKeys.today() });
      queryClient.invalidateQueries({ queryKey: administrationKeys.reminders() });
      queryClient.invalidateQueries({ queryKey: ['prescriptions', result.studentId] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });

      // Log success
      logAdministrationSuccess('record-administration', {
        administrationId: result.id,
        studentId: result.studentId,
        medicationId: result.medicationId,
      });
    },
    onError: (error: Error) => {
      logAdministrationError('record-administration', error, sessionData);

      // Keep session data for retry
      // Don't clear session on error - allow retry
    },
    // CRITICAL: No retry for administration
    retry: false,
  });

  // Record refusal
  const recordRefusal = useMutation({
    mutationFn: ({
      prescriptionId,
      scheduledTime,
      reason,
      notes,
    }: {
      prescriptionId: string;
      scheduledTime: string;
      reason: string;
      notes?: string;
    }) => administrationApi.recordRefusal(prescriptionId, scheduledTime, reason, notes),
    onSuccess: () => {
      setSessionData(null);
      sessionStorage.removeItem('current-administration-session');
      queryClient.invalidateQueries({ queryKey: administrationKeys.today() });
      queryClient.invalidateQueries({ queryKey: administrationKeys.reminders() });
    },
  });

  // Record missed dose
  const recordMissed = useMutation({
    mutationFn: ({
      prescriptionId,
      scheduledTime,
      reason,
      notes,
    }: {
      prescriptionId: string;
      scheduledTime: string;
      reason: string;
      notes?: string;
    }) => administrationApi.recordMissedDose(prescriptionId, scheduledTime, reason, notes),
    onSuccess: () => {
      setSessionData(null);
      sessionStorage.removeItem('current-administration-session');
      queryClient.invalidateQueries({ queryKey: administrationKeys.today() });
      queryClient.invalidateQueries({ queryKey: administrationKeys.reminders() });
    },
  });

  // Record held medication
  const recordHeld = useMutation({
    mutationFn: ({
      prescriptionId,
      scheduledTime,
      reason,
      clinicalRationale,
    }: {
      prescriptionId: string;
      scheduledTime: string;
      reason: string;
      clinicalRationale: string;
    }) => administrationApi.recordHeldMedication(prescriptionId, scheduledTime, reason, clinicalRationale),
    onSuccess: () => {
      setSessionData(null);
      sessionStorage.removeItem('current-administration-session');
      queryClient.invalidateQueries({ queryKey: administrationKeys.today() });
      queryClient.invalidateQueries({ queryKey: administrationKeys.reminders() });
    },
  });

  // Get today's administrations
  const todayAdministrations = useQuery({
    queryKey: administrationKeys.today(nurseId),
    queryFn: () => administrationApi.getTodayAdministrations(nurseId),
    staleTime: 0, // Always fresh
    refetchInterval: 60 * 1000, // Refresh every minute
    refetchOnWindowFocus: true,
  });

  // Get upcoming reminders
  const upcomingReminders = useQuery({
    queryKey: administrationKeys.upcoming(nurseId, 4),
    queryFn: () => administrationApi.getUpcomingReminders(nurseId, 4),
    staleTime: 0, // Always fresh
    refetchInterval: 60 * 1000, // Refresh every minute
    refetchOnWindowFocus: true,
  });

  // Get overdue administrations
  const overdueAdministrations = useQuery({
    queryKey: administrationKeys.overdue(),
    queryFn: () => administrationApi.getOverdueAdministrations(),
    staleTime: 0, // Always fresh
    refetchInterval: 60 * 1000, // Refresh every minute
    refetchOnWindowFocus: true,
  });

  // Clear session
  const clearSession = useCallback(() => {
    setSessionData(null);
    sessionStorage.removeItem('current-administration-session');
  }, []);

  return {
    sessionData,
    initSession,
    verifyFiveRights,
    serverVerifyFiveRights,
    recordAdministration,
    recordRefusal,
    recordMissed,
    recordHeld,
    todayAdministrations,
    upcomingReminders,
    overdueAdministrations,
    clearSession,
    isSessionActive: !!sessionData,
  };
}

// Helper functions
function isValidDose(scannedDose: string, prescribedDose: string): boolean {
  // Normalize doses for comparison
  const normalize = (dose: string) => dose.toLowerCase().replace(/\s+/g, '');
  return normalize(scannedDose) === normalize(prescribedDose);
}

function isWithinAdministrationWindow(
  time: string,
  window: { start: string; end: string }
): boolean {
  const administrationTime = new Date(time);
  const windowStart = new Date(window.start);
  const windowEnd = new Date(window.end);

  return administrationTime >= windowStart && administrationTime <= windowEnd;
}

/**
 * Get administration history hook
 */
export function useAdministrationHistory(filters?: AdministrationHistoryFilters) {
  return useQuery({
    queryKey: administrationKeys.historyFiltered(filters),
    queryFn: () => administrationApi.getAdministrationHistory(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get student schedule hook
 */
export function useStudentSchedule(studentId: string | undefined, date?: string) {
  return useQuery({
    queryKey: administrationKeys.schedule(studentId!, date),
    queryFn: () => administrationApi.getStudentSchedule(studentId!, date),
    enabled: !!studentId,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000,
  });
}
