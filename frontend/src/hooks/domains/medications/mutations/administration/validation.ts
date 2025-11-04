/**
 * Medication Administration Validation
 *
 * Helper functions for validating medication administration data
 */

/**
 * Validates if scanned dose matches prescribed dose
 *
 * @param scannedDose - Dose scanned from medication barcode
 * @param prescribedDose - Dose from prescription
 * @returns True if doses match after normalization
 */
export function isValidDose(scannedDose: string, prescribedDose: string): boolean {
  // Normalize doses for comparison
  const normalize = (dose: string) => dose.toLowerCase().replace(/\s+/g, '');
  return normalize(scannedDose) === normalize(prescribedDose);
}

/**
 * Validates if administration time is within allowed window
 *
 * @param time - Proposed administration time (ISO string)
 * @param window - Administration time window with start and end times
 * @returns True if time is within window
 */
export function isWithinAdministrationWindow(
  time: string,
  window: { start: string; end: string }
): boolean {
  const administrationTime = new Date(time);
  const windowStart = new Date(window.start);
  const windowEnd = new Date(window.end);

  return administrationTime >= windowStart && administrationTime <= windowEnd;
}
