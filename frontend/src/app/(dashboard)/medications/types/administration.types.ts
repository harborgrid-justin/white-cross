import { z } from 'zod';
import type { AdministrationRoute, MedicationFrequency, MedicationType } from './core.types';

/**
 * Administration outcome status
 */
export type AdministrationStatus = 'completed' | 'refused' | 'missed' | 'partial';

/**
 * Medication administration record
 *
 * @description Complete record of a medication administration event including verification and outcomes
 */
export interface MedicationAdministration {
  /** Unique administration record identifier */
  id: string;
  /** ID of the medication that was administered */
  medicationId: string;
  /** ID of the student who received the medication */
  studentId: string;

  // Administration Details
  /** ID of staff member who administered the medication */
  administeredBy: string;
  /** Date and time of administration */
  administeredDate: Date;
  /** Actual dosage administered */
  dosageGiven: string;
  /** Method of administration used */
  administrationRoute: AdministrationRoute;

  // Verification
  /** ID of witnessing staff member (if required) */
  witnessedBy?: string;
  /** Whether parent/guardian was notified */
  parentNotified?: boolean;

  // Outcome
  /** Result of the administration attempt */
  administrationStatus: AdministrationStatus;
  /** Reason for refusal (if status is 'refused') */
  refusalReason?: string;
  /** Whether any adverse reaction occurred */
  adverseReaction?: boolean;
  /** Description of adverse reaction (if applicable) */
  reactionDescription?: string;

  // Documentation
  /** Additional notes about this administration */
  notes?: string;
  /** Supporting documentation (e.g., photos, consent forms) */
  attachments?: string[];

  // Audit
  /** Record creation timestamp */
  createdAt: Date;
  /** Record last update timestamp */
  updatedAt: Date;
}

/**
 * Zod validation schema for MedicationAdministration
 */
export const MedicationAdministrationSchema = z.object({
  id: z.string().uuid(),
  medicationId: z.string().uuid(),
  studentId: z.string().uuid(),
  administeredBy: z.string().uuid(),
  administeredDate: z.date(),
  dosageGiven: z.string().min(1),
  administrationRoute: z.enum(['oral', 'injection', 'topical', 'inhaled', 'nasal', 'rectal', 'sublingual', 'transdermal']),
  administrationStatus: z.enum(['completed', 'refused', 'missed', 'partial']),
  adverseReaction: z.boolean().optional(),
});

/**
 * Administration utility functions
 *
 * @description Helper functions for scheduling, timing, and formatting administration data
 */
export const administrationUtils = {
  /**
   * Check if medication is currently due for administration
   *
   * @param nextDue - Next scheduled administration time
   * @returns True if current time is at or past the due time
   */
  isDue: (nextDue?: Date): boolean => {
    if (!nextDue) return false;
    return new Date() >= nextDue;
  },

  /**
   * Check if medication administration is overdue
   *
   * @param nextDue - Next scheduled administration time
   * @param hours - Number of hours past due to consider overdue (default: 2)
   * @returns True if administration is overdue by specified hours
   */
  isOverdue: (nextDue?: Date, hours: number = 2): boolean => {
    if (!nextDue) return false;
    const hoursOverdue = (new Date().getTime() - nextDue.getTime()) / (1000 * 60 * 60);
    return hoursOverdue > hours;
  },

  /**
   * Calculate next scheduled administration time based on frequency
   *
   * @param frequency - Administration frequency pattern
   * @param lastAdministered - Last administration timestamp
   * @returns Next scheduled administration time or null for as-needed medications
   */
  getNextDueTime: (frequency: MedicationFrequency, lastAdministered: Date): Date | null => {
    const baseTime = lastAdministered.getTime();

    switch (frequency) {
      case 'once_daily':
        return new Date(baseTime + 24 * 60 * 60 * 1000);
      case 'twice_daily':
        return new Date(baseTime + 12 * 60 * 60 * 1000);
      case 'three_times_daily':
        return new Date(baseTime + 8 * 60 * 60 * 1000);
      case 'four_times_daily':
        return new Date(baseTime + 6 * 60 * 60 * 1000);
      case 'every_4_hours':
        return new Date(baseTime + 4 * 60 * 60 * 1000);
      case 'every_6_hours':
        return new Date(baseTime + 6 * 60 * 60 * 1000);
      case 'every_8_hours':
        return new Date(baseTime + 8 * 60 * 60 * 1000);
      case 'every_12_hours':
        return new Date(baseTime + 12 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(baseTime + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(baseTime + 30 * 24 * 60 * 60 * 1000);
      default:
        return null; // For 'as_needed' and 'custom'
    }
  },

  /**
   * Format medication frequency for display
   *
   * @param frequency - Medication frequency enum
   * @returns Human-readable frequency string
   */
  formatFrequency: (frequency: MedicationFrequency): string => {
    const frequencyMap: Record<MedicationFrequency, string> = {
      as_needed: 'As Needed',
      once_daily: 'Once Daily',
      twice_daily: 'Twice Daily',
      three_times_daily: '3x Daily',
      four_times_daily: '4x Daily',
      every_4_hours: 'Every 4 Hours',
      every_6_hours: 'Every 6 Hours',
      every_8_hours: 'Every 8 Hours',
      every_12_hours: 'Every 12 Hours',
      weekly: 'Weekly',
      monthly: 'Monthly',
      custom: 'Custom Schedule',
    };
    return frequencyMap[frequency];
  },

  /**
   * Format administration route for display
   *
   * @param route - Administration route enum
   * @returns Human-readable route string
   */
  formatAdministrationRoute: (route: AdministrationRoute): string => {
    const routeMap: Record<AdministrationRoute, string> = {
      oral: 'Oral',
      injection: 'Injection',
      topical: 'Topical',
      inhaled: 'Inhaled',
      nasal: 'Nasal',
      rectal: 'Rectal',
      sublingual: 'Sublingual',
      transdermal: 'Transdermal',
    };
    return routeMap[route];
  },

  /**
   * Format date and time for display
   *
   * @param date - Date to format
   * @returns Formatted date-time string
   */
  formatDateTime: (date: Date): string =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),

  /**
   * Get administrations for today
   *
   * @param administrations - Array of administration records
   * @returns Administrations that occurred today
   */
  getAdministrationsToday: (administrations: MedicationAdministration[]): MedicationAdministration[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return administrations.filter(admin => {
      const adminDate = new Date(admin.administeredDate);
      return adminDate >= today && adminDate < tomorrow;
    });
  },

  /**
   * Count administrations by type for a given set
   *
   * @param administrations - Array of administration records
   * @param medications - Map of medication ID to Medication object
   * @returns Record of medication type to count
   */
  countByType: (
    administrations: MedicationAdministration[],
    medications: Map<string, { type: MedicationType }>
  ): Record<MedicationType, number> => {
    const counts: Partial<Record<MedicationType, number>> = {};

    administrations.forEach(admin => {
      const medication = medications.get(admin.medicationId);
      if (medication) {
        counts[medication.type] = (counts[medication.type] || 0) + 1;
      }
    });

    return counts as Record<MedicationType, number>;
  },
};
