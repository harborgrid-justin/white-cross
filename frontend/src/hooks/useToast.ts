/**
 * Toast Notification Hook
 *
 * Provides standardized toast notification methods for user feedback across the application.
 * Wraps the Sonner toast library with healthcare-appropriate notification patterns.
 *
 * @module hooks/useToast
 *
 * @remarks
 * **HIPAA Compliance**: Never include PHI (Protected Health Information) in toast messages.
 * Use generic messages and patient identifiers only, never full names or sensitive data.
 *
 * **Accessibility**:
 * - Toast notifications are announced to screen readers via ARIA live regions
 * - Important error messages persist longer for users with cognitive disabilities
 * - Color alone is not used to convey information (icons and text included)
 *
 * **Best Practices**:
 * - Keep messages concise (under 80 characters)
 * - Use success for completed actions
 * - Use error for failures requiring user attention
 * - Use warning for important but non-blocking issues
 * - Use info for general status updates
 *
 * @example
 * ```typescript
 * import { useToast } from '@/hooks/useToast';
 *
 * function StudentForm() {
 *   const { showSuccess, showError, showWarning } = useToast();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await saveStudent(data);
 *       showSuccess('Student record saved successfully');
 *     } catch (error) {
 *       showError('Failed to save student record');
 *     }
 *   };
 *
 *   const checkMedicationExpiry = () => {
 *     if (isExpiringSoon) {
 *       showWarning('Medication expires in 7 days');
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 *
 * @see {@link useMedicationToast} for medication-specific toast patterns
 * @see {@link https://sonner.emilkowal.ski/ | Sonner Documentation}
 *
 * @since 1.0.0
 */

import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for displaying toast notifications throughout the application.
 *
 * @returns {Object} Toast notification methods
 * @returns {Function} returns.showSuccess - Display success notification (green, check icon)
 * @returns {Function} returns.showError - Display error notification (red, error icon)
 * @returns {Function} returns.showInfo - Display informational notification (blue, info icon)
 * @returns {Function} returns.showWarning - Display warning notification (yellow, warning icon)
 * @returns {Object} returns.toast - Raw Sonner toast object for advanced usage
 */
export const useToast = () => {
  /**
   * Displays a success toast notification.
   *
   * Use for completed actions like successful data saves, form submissions,
   * or workflow completions.
   *
   * @param {string} message - Success message to display (keep under 80 characters)
   *
   * @example
   * ```typescript
   * showSuccess('Student enrolled successfully');
   * showSuccess('Health record updated');
   * showSuccess('Appointment scheduled for tomorrow at 10:00 AM');
   * ```
   *
   * @remarks
   * Success toasts automatically dismiss after 4 seconds.
   * Users can manually dismiss by clicking or swiping.
   */
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  /**
   * Displays an error toast notification.
   *
   * Use for failed operations, validation errors, or system errors that
   * require user attention. Error toasts persist longer to ensure visibility.
   *
   * @param {string} message - Error message to display (be specific but concise)
   *
   * @example
   * ```typescript
   * showError('Failed to save health record');
   * showError('Invalid date of birth format');
   * showError('Network connection lost');
   * ```
   *
   * @remarks
   * **HIPAA Compliance**: Do NOT include PHI in error messages.
   * - Bad: "Failed to save record for John Doe"
   * - Good: "Failed to save student record"
   *
   * Error toasts persist longer (6 seconds) to ensure users see them.
   */
  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  /**
   * Displays an informational toast notification.
   *
   * Use for general information, status updates, or non-critical messages
   * that provide context to the user.
   *
   * @param {string} message - Info message to display
   *
   * @example
   * ```typescript
   * showInfo('Syncing data with server...');
   * showInfo('New features available in settings');
   * showInfo('Report will be emailed when ready');
   * ```
   *
   * @remarks
   * Info toasts dismiss after 4 seconds by default.
   */
  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  /**
   * Displays a warning toast notification.
   *
   * Use for important but non-blocking issues such as approaching deadlines,
   * low inventory, potential data loss, or configuration issues.
   *
   * @param {string} message - Warning message to display
   *
   * @example
   * ```typescript
   * showWarning('Unsaved changes will be lost');
   * showWarning('Low medication inventory - reorder soon');
   * showWarning('Student missing emergency contact');
   * showWarning('Immunization due for update');
   * ```
   *
   * @remarks
   * **When to Use**:
   * - Data might be lost if user continues
   * - Important deadlines approaching
   * - Missing or incomplete required information
   * - Potential compliance issues
   *
   * Warning toasts persist for 5 seconds to ensure visibility.
   */
  const showWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    /** Raw Sonner toast object for advanced usage (e.g., custom options, promise toasts) */
    toast,
  };
};

export default useToast;
