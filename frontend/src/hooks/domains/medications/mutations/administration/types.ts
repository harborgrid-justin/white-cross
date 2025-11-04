/**
 * Medication Administration Types
 *
 * TypeScript types and interfaces for medication administration
 */

import type { useMutation, useQuery } from '@tanstack/react-query';
import type {
  AdministrationSession,
  FiveRightsData,
  FiveRightsVerificationResult,
  AdministrationRecord,
  AdministrationLog,
  MedicationReminder,
} from '@/services';

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
