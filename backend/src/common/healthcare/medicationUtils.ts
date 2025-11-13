/**
 * LOC: DA37D39671
 * WC-GEN-312 | medicationUtils.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-312 | medicationUtils.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Medication calculation and management utilities
 *
 * These utilities provide standardized medication management functions
 * for dosage calculations, scheduling, and safety validations.
 */

export interface DosageSchedule {
  times: Date[];
  frequency: string;
  intervalHours: number;
  dailyCount: number;
}

export interface MedicationInfo {
  name: string;
  strength: string;
  dosageForm: string;
  maxDailyDose?: number;
  minDoseInterval?: number; // in hours
}

/**
 * Calculate dosage schedule based on frequency and date range
 *
 * @param frequency - Dosage frequency (e.g., "BID", "TID", "QID", "Q6H")
 * @param startDate - Start date for the medication
 * @param endDate - Optional end date for the medication
 * @returns DosageSchedule object with calculated times
 */
export function calculateDosageSchedule(
  frequency: string,
  startDate: Date,
  _endDate?: Date,
): DosageSchedule {
  const schedule: DosageSchedule = {
    times: [],
    frequency,
    intervalHours: 24,
    dailyCount: 1,
  };

  // Parse frequency to determine interval and daily count
  switch (frequency.toUpperCase()) {
    case 'QD':
    case 'DAILY':
      schedule.intervalHours = 24;
      schedule.dailyCount = 1;
      break;
    case 'BID':
    case 'Q12H':
      schedule.intervalHours = 12;
      schedule.dailyCount = 2;
      break;
    case 'TID':
    case 'Q8H':
      schedule.intervalHours = 8;
      schedule.dailyCount = 3;
      break;
    case 'QID':
    case 'Q6H':
      schedule.intervalHours = 6;
      schedule.dailyCount = 4;
      break;
    case 'Q4H':
      schedule.intervalHours = 4;
      schedule.dailyCount = 6;
      break;
    case 'Q3H':
      schedule.intervalHours = 3;
      schedule.dailyCount = 8;
      break;
    case 'Q2H':
      schedule.intervalHours = 2;
      schedule.dailyCount = 12;
      break;
    case 'PRN':
      // As needed - no fixed schedule
      return schedule;
    default:
      // Try to parse custom interval (e.g., "Q8H")
      const match = frequency.match(/Q(\d+)H/i);
      if (match && match[1]) {
        const hours = parseInt(match[1], 10);
        schedule.intervalHours = hours;
        schedule.dailyCount = Math.floor(24 / hours);
      }
  }

  // Generate times for the first day
  const baseTime = new Date(startDate);
  baseTime.setHours(8, 0, 0, 0); // Start at 8 AM by default

  for (let i = 0; i < schedule.dailyCount; i++) {
    const time = new Date(baseTime);
    time.setHours(baseTime.getHours() + i * schedule.intervalHours);
    schedule.times.push(time);
  }

  return schedule;
}

/**
 * Validate dosage amount against medication safety parameters
 *
 * @param dosage - Dosage string (e.g., "5mg", "1 tablet")
 * @param medication - Medication information object
 * @returns boolean indicating if dosage is valid
 */
export function validateDosageAmount(
  dosage: string,
  medication: MedicationInfo,
): boolean {
  if (!dosage || !medication) {
    return false;
  }

  // Extract numeric value from dosage string
  const numericMatch = dosage.match(/(\d+(?:\.\d+)?)/);
  if (!numericMatch || !numericMatch[1]) {
    return false;
  }

  const amount = parseFloat(numericMatch[1]);

  // Basic validation - amount should be positive
  if (amount <= 0) {
    return false;
  }

  // Check against maximum daily dose if available
  if (medication.maxDailyDose && amount > medication.maxDailyDose) {
    return false;
  }

  // Additional validation based on dosage form
  switch (medication.dosageForm.toLowerCase()) {
    case 'tablet':
    case 'capsule':
      // Tablets/capsules should typically be whole numbers or common fractions
      return (
        amount === Math.floor(amount) ||
        amount === 0.5 ||
        amount === 0.25 ||
        amount === 0.75
      );

    case 'liquid':
    case 'suspension':
    case 'solution':
      // Liquids can have decimal amounts
      return amount <= 50; // Reasonable upper limit for liquid doses in mL

    case 'injection':
      // Injections typically have smaller volumes
      return amount <= 10;

    default:
      return true; // Allow other forms without specific validation
  }
}

/**
 * Check if medication is expiring within buffer period
 *
 * @param expirationDate - Expiration date of the medication
 * @param bufferDays - Number of days before expiration to alert (default: 30)
 * @returns boolean indicating if medication is expiring soon
 */
export function calculateMedicationExpiry(
  expirationDate: Date,
  bufferDays: number = 30,
): boolean {
  const now = new Date();
  const bufferTime = bufferDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  const alertDate = new Date(expirationDate.getTime() - bufferTime);

  return now >= alertDate;
}

/**
 * Format medication name consistently across the application
 *
 * @param name - Medication name
 * @param strength - Medication strength (e.g., "5mg", "250mg/5ml")
 * @param form - Dosage form (e.g., "tablet", "liquid")
 * @returns Formatted medication name string
 */
export function formatMedicationName(
  name: string,
  strength?: string,
  form?: string,
): string {
  if (!name) {
    return '';
  }

  let formatted = name.trim();

  if (strength) {
    formatted += ` ${strength.trim()}`;
  }

  if (form && form.toLowerCase() !== 'tablet') {
    // Only include form if it's not the default tablet form
    formatted += ` ${form.trim().toLowerCase()}`;
  }

  return formatted;
}

/**
 * Calculate next dose time based on frequency and last dose
 *
 * @param lastDoseTime - Time of the last dose
 * @param frequency - Dosage frequency
 * @returns Date of next scheduled dose
 */
export function calculateNextDoseTime(
  lastDoseTime: Date,
  frequency: string,
): Date {
  const schedule = calculateDosageSchedule(frequency, lastDoseTime);
  const nextDose = new Date(lastDoseTime);
  nextDose.setHours(nextDose.getHours() + schedule.intervalHours);

  return nextDose;
}

/**
 * Check if it's time for the next dose
 *
 * @param lastDoseTime - Time of the last dose
 * @param frequency - Dosage frequency
 * @param bufferMinutes - Buffer time in minutes to allow early dosing (default: 15)
 * @returns boolean indicating if next dose is due
 */
export function isDoseTimeReached(
  lastDoseTime: Date,
  frequency: string,
  bufferMinutes: number = 15,
): boolean {
  const nextDoseTime = calculateNextDoseTime(lastDoseTime, frequency);
  const now = new Date();
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds

  return now >= new Date(nextDoseTime.getTime() - bufferTime);
}
