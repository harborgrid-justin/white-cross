/**
 * Medication Toast Notification Hook
 *
 * Provides standardized toast notification methods for medication-related operations.
 * Wraps Sonner toast library with medication-specific notification patterns.
 *
 * Use this hook for consistent user feedback across medication features including:
 * - Medication administration confirmations
 * - Validation errors
 * - Safety warnings
 * - Inventory alerts
 *
 * @module useMedicationToast
 *
 * @example
 * ```tsx
 * function MedicationForm() {
 *   const toast = useMedicationToast();
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await saveMedication();
 *       toast.showSuccess('Medication saved successfully');
 *     } catch (error) {
 *       toast.showError('Failed to save medication');
 *     }
 *   };
 * }
 * ```
 */

import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for medication toast notifications.
 *
 * @returns {Object} Toast notification methods
 * @returns {Function} showSuccess - Display success message (green)
 * @returns {Function} showError - Display error message (red)
 * @returns {Function} showInfo - Display info message (blue)
 * @returns {Function} showWarning - Display warning message (yellow)
 */
export const useMedicationToast = () => {
  /**
   * Displays a success toast notification.
   *
   * Use for successful operations like medication administration,
   * data saving, or workflow completion.
   *
   * @param {string} message - Success message to display
   *
   * @example
   * ```tsx
   * toast.showSuccess('Medication administered successfully');
   * toast.showSuccess('Inventory updated');
   * ```
   */
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  /**
   * Displays an error toast notification.
   *
   * Use for failed operations, validation errors, or system errors.
   * Error toasts are typically more persistent to ensure user sees them.
   *
   * @param {string} message - Error message to display
   *
   * @example
   * ```tsx
   * toast.showError('Failed to administer medication');
   * toast.showError('Dosage validation failed');
   * ```
   */
  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  /**
   * Displays an informational toast notification.
   *
   * Use for general information, status updates, or non-critical messages.
   *
   * @param {string} message - Info message to display
   *
   * @example
   * ```tsx
   * toast.showInfo('Medication schedule updated');
   * toast.showInfo('Reminder sent to nurse');
   * ```
   */
  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  /**
   * Displays a warning toast notification.
   *
   * Use for important but non-blocking warnings such as low inventory,
   * approaching deadlines, or potential safety concerns.
   *
   * @param {string} message - Warning message to display
   *
   * @safety Use warnings for safety-related notices that don't block operations
   * but require user attention (e.g., "Medication expiring soon", "Low stock level")
   *
   * @example
   * ```tsx
   * toast.showWarning('Medication expiring in 7 days');
   * toast.showWarning('Low inventory - reorder recommended');
   * toast.showWarning('Patient has known allergies');
   * ```
   */
  const showWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
