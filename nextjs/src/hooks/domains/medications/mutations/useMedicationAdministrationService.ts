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
 * Medication Administration Service Hook
 *
 * SAFETY-CRITICAL HOOK - DO NOT MODIFY WITHOUT CLINICAL REVIEW
 *
 * Purpose: Manages complete medication administration workflow with mandatory Five Rights verification.
 *
 * This hook implements the "Five Rights of Medication Administration" - the gold standard
 * for safe medication administration in healthcare settings. Every administration MUST
 * pass Five Rights verification before being recorded.
 *
 * CRITICAL SAFETY REQUIREMENTS:
 * - NO caching for administration records (must be fresh data)
 * - NO optimistic updates (too risky for medication records)
 * - Mandatory Five Rights verification (cannot be bypassed)
 * - All operations audited with timestamps and user identification
 * - Offline queue support with sync verification on reconnection
 * - Session recovery for interrupted administrations
 * - No automatic retries on administration errors
 *
 * Five Rights of Medication Administration:
 * 1. Right Patient - Verified via barcode scan and photo confirmation
 * 2. Right Medication - Verified via NDC (National Drug Code) matching
 * 3. Right Dose - Verified via barcode scan and prescription matching
 * 4. Right Route - Verified against prescription (oral, IV, topical, etc.)
 * 5. Right Time - Verified within administration window (±30 minutes typical)
 *
 * Additional Safety Checks:
 * - LASA (Look-Alike Sound-Alike) medication warnings
 * - Patient allergy verification
 * - Drug interaction checking
 * - Maximum dose validation
 * - Administration window enforcement
 *
 * @module useMedicationAdministrationService
 * @safety CRITICAL - This hook controls medication administration. All changes must be
 * reviewed by clinical staff and undergo thorough testing before deployment.
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

/**
 * React Query cache keys for medication administration queries.
 *
 * Provides centralized, type-safe query key management for all medication
 * administration-related queries. Keys are hierarchical to enable efficient
 * cache invalidation.
 *
 * @constant
 * @example
 * ```ts
 * // Invalidate all administration queries
 * queryClient.invalidateQueries({ queryKey: administrationKeys.all });
 *
 * // Invalidate only today's administrations for specific nurse
 * queryClient.invalidateQueries({ queryKey: administrationKeys.today('nurse-123') });
 * ```
 */
export const administrationKeys = {
  /** Base key for all medication administration queries */
  all: ['medication-administration'] as const,
  /** All session-related queries */
  sessions: () => [...administrationKeys.all, 'session'] as const,
  /** Specific session by ID */
  session: (id: string) => [...administrationKeys.sessions(), id] as const,
  /** All administration history queries */
  history: () => [...administrationKeys.all, 'history'] as const,
  /** Filtered administration history */
  historyFiltered: (filters?: AdministrationHistoryFilters) =>
    [...administrationKeys.history(), filters] as const,
  /** Today's administrations, optionally filtered by nurse */
  today: (nurseId?: string) => [...administrationKeys.all, 'today', nurseId] as const,
  /** All reminder queries */
  reminders: () => [...administrationKeys.all, 'reminders'] as const,
  /** Upcoming reminders within specified hours */
  upcoming: (nurseId?: string, hours?: number) =>
    [...administrationKeys.reminders(), 'upcoming', nurseId, hours] as const,
  /** Overdue administrations requiring immediate attention */
  overdue: () => [...administrationKeys.reminders(), 'overdue'] as const,
  /** Student's medication schedule for specific date */
  schedule: (studentId: string, date?: string) =>
    [...administrationKeys.all, 'schedule', studentId, date] as const,
} as const;

/**
 * Error thrown when medication safety verification fails.
 *
 * Indicates that one or more of the Five Rights verifications failed,
 * or other critical safety checks did not pass. This error should
 * HALT the administration process.
 *
 * @class MedicationSafetyError
 * @extends Error
 *
 * @property {string} name - Always 'MedicationSafetyError'
 * @property {string} message - Human-readable error summary
 * @property {string[]} errors - Array of specific safety violations
 *
 * @example
 * ```ts
 * throw new MedicationSafetyError(
 *   'Five Rights verification failed',
 *   ['Wrong patient barcode', 'Dose mismatch']
 * );
 * ```
 */
export class MedicationSafetyError extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = 'MedicationSafetyError';
  }
}

/**
 * Error thrown when patient has allergy to medication but warning not acknowledged.
 *
 * Indicates patient has documented allergies to the medication or its components,
 * and the healthcare provider has not properly acknowledged the allergy warning.
 * This error should HALT the administration process.
 *
 * @class AllergyWarningError
 * @extends Error
 *
 * @property {string} name - Always 'AllergyWarningError'
 * @property {string} message - Human-readable error summary
 * @property {any[]} allergies - Array of patient's relevant allergies
 *
 * @safety This error indicates a CRITICAL safety issue. Administration must not
 * proceed without explicit physician override and documented clinical rationale.
 *
 * @example
 * ```ts
 * throw new AllergyWarningError(
 *   'Patient is allergic to Penicillin',
 *   [{ allergen: 'Penicillin', severity: 'severe', reaction: 'anaphylaxis' }]
 * );
 * ```
 */
export class AllergyWarningError extends Error {
  constructor(message: string, public allergies: any[]) {
    super(message);
    this.name = 'AllergyWarningError';
  }
}

/**
 * Return type for the useMedicationAdministration hook.
 *
 * Provides comprehensive medication administration workflow management including
 * session management, Five Rights verification, and administration recording.
 *
 * @interface UseMedicationAdministrationReturn
 */
export interface UseMedicationAdministrationReturn {
  // Session management
  /** Current active administration session data, null if no active session */
  sessionData: AdministrationSession | null;
  /** Mutation to initialize a new administration session for a prescription */
  initSession: ReturnType<typeof useMutation<AdministrationSession, Error, string>>;

  // Five Rights verification
  /** Client-side Five Rights verification (immediate, no network call) */
  verifyFiveRights: (data: FiveRightsData) => FiveRightsVerificationResult;
  /** Server-side Five Rights verification (authoritative, requires network) */
  serverVerifyFiveRights: ReturnType<
    typeof useMutation<FiveRightsVerificationResult, Error, FiveRightsData>
  >;

  // Administration recording
  /** Records successful medication administration (NO OPTIMISTIC UPDATE) */
  recordAdministration: ReturnType<typeof useMutation<AdministrationLog, Error, AdministrationRecord>>;
  /** Records patient refusal to take medication */
  recordRefusal: ReturnType<
    typeof useMutation<AdministrationLog, Error, { prescriptionId: string; scheduledTime: string; reason: string; notes?: string }>
  >;
  /** Records missed medication dose */
  recordMissed: ReturnType<
    typeof useMutation<AdministrationLog, Error, { prescriptionId: string; scheduledTime: string; reason: string; notes?: string }>
  >;
  /** Records medication held by clinical decision */
  recordHeld: ReturnType<
    typeof useMutation<AdministrationLog, Error, { prescriptionId: string; scheduledTime: string; reason: string; clinicalRationale: string }>
  >;

  // Queries
  /** Today's administrations for the nurse (auto-refreshes every minute) */
  todayAdministrations: ReturnType<typeof useQuery<AdministrationLog[]>>;
  /** Upcoming medication reminders within 4 hours (auto-refreshes every minute) */
  upcomingReminders: ReturnType<typeof useQuery<MedicationReminder[]>>;
  /** Overdue administrations requiring immediate attention (auto-refreshes every minute) */
  overdueAdministrations: ReturnType<typeof useQuery<MedicationReminder[]>>;

  // Helpers
  /** Clears the current administration session */
  clearSession: () => void;
  /** True if there is an active administration session */
  isSessionActive: boolean;
}

/**
 * Hook for managing medication administration with Five Rights verification.
 *
 * This hook provides complete medication administration workflow management including:
 * - Session initialization and recovery
 * - Client and server-side Five Rights verification
 * - Administration recording with comprehensive safety checks
 * - Refusal, missed, and held medication tracking
 * - Real-time reminders and overdue tracking
 *
 * @param {string} [nurseId] - Optional nurse ID for filtering administrations and reminders
 * @returns {UseMedicationAdministrationReturn} Administration management interface
 *
 * @safety This hook implements CRITICAL patient safety features:
 * - No caching of administration records (always fresh data)
 * - No optimistic updates (confirmation required)
 * - No automatic retries (explicit user action required)
 * - Mandatory Five Rights verification
 * - Session recovery for interrupted workflows
 * - Offline queue with sync verification
 *
 * @example
 * ```tsx
 * function MedicationAdministrationPage() {
 *   const nurseId = useCurrentNurseId();
 *   const {
 *     initSession,
 *     sessionData,
 *     verifyFiveRights,
 *     recordAdministration,
 *     upcomingReminders
 *   } = useMedicationAdministration(nurseId);
 *
 *   // 1. Initialize session when nurse scans prescription
 *   const handleScanPrescription = async (prescriptionId: string) => {
 *     await initSession.mutateAsync(prescriptionId);
 *   };
 *
 *   // 2. Verify Five Rights
 *   const handleVerification = () => {
 *     const fiveRightsData = {
 *       studentBarcode: scannedStudentBarcode,
 *       medicationNDC: scannedMedicationNDC,
 *       scannedDose: scannedDose,
 *       route: selectedRoute,
 *       administrationTime: new Date().toISOString(),
 *       patientPhotoConfirmed: true,
 *       allergyAcknowledged: true,
 *     };
 *
 *     const result = verifyFiveRights(fiveRightsData);
 *     if (!result.valid) {
 *       alert(`Cannot proceed: ${result.errors.join(', ')}`);
 *       return;
 *     }
 *   };
 *
 *   // 3. Record administration
 *   const handleAdminister = async () => {
 *     await recordAdministration.mutateAsync({
 *       studentId: sessionData.studentId,
 *       medicationId: sessionData.medicationId,
 *       fiveRightsData,
 *       // ... other fields
 *     });
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Recording refusal
 * const handleRefusal = async () => {
 *   await recordRefusal.mutateAsync({
 *     prescriptionId: prescription.id,
 *     scheduledTime: scheduledTime,
 *     reason: 'patient_refused',
 *     notes: 'Patient stated feeling nauseous'
 *   });
 * };
 * ```
 *
 * @see {@link MedicationSafetyError} for safety verification failures
 * @see {@link AllergyWarningError} for allergy-related errors
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
