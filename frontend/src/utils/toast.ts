/**
 * @fileoverview Toast notification utility functions for user feedback
 * @module toast
 * @category Utils
 * 
 * This module provides wrapper functions around react-hot-toast for
 * consistent toast notifications across the application with test support.
 */

import toast from 'react-hot-toast'

/**
 * Displays a success toast notification with a green checkmark icon
 * 
 * Automatically adds data-testid attribute for Cypress/Vitest testing.
 * The toast appears in the top-right corner (configured in App.tsx)
 * and automatically dismisses after 3 seconds.
 * 
 * @param {string} message - Success message to display to the user
 * @returns {string} Toast ID that can be used to dismiss the toast programmatically
 * 
 * @example
 * ```typescript
 * // Simple success message
 * showSuccessToast('Student record updated successfully');
 * 
 * // Store toast ID for manual dismissal
 * const toastId = showSuccessToast('Processing...');
 * // Later: toast.dismiss(toastId);
 * ```
 */
export const showSuccessToast = (message: string) => {
  const toastId = toast.success(message)
  // Add data-testid after the toast is created
  setTimeout(() => {
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (toastElement) {
      toastElement.setAttribute('data-testid', 'success-toast')
    }
  }, 10)
  return toastId
}

/**
 * Displays an error toast notification with a red X icon
 * 
 * Automatically adds data-testid attribute for Cypress/Vitest testing.
 * The toast appears in the top-right corner (configured in App.tsx)
 * and automatically dismisses after 5 seconds (longer than success).
 * 
 * @param {string} message - Error message to display to the user
 * @returns {string} Toast ID that can be used to dismiss the toast programmatically
 * 
 * @example
 * ```typescript
 * // Simple error message
 * showErrorToast('Failed to load student data');
 * 
 * // Error from API with fallback
 * try {
 *   await api.updateStudent(data);
 *   showSuccessToast('Student updated');
 * } catch (error) {
 *   showErrorToast(error.message || 'An error occurred');
 * }
 * ```
 */
export const showErrorToast = (message: string) => {
  const toastId = toast.error(message)
  // Add data-testid after the toast is created
  setTimeout(() => {
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (toastElement) {
      toastElement.setAttribute('data-testid', 'error-toast')
    }
  }, 10)
  return toastId
}

/**
 * Re-export of the react-hot-toast library for advanced usage
 * 
 * Use this for:
 * - Custom toast configurations
 * - Programmatic toast dismissal: toast.dismiss(toastId)
 * - Loading toasts: toast.loading()
 * - Promise-based toasts: toast.promise()
 * 
 * @see {@link https://react-hot-toast.com/docs|React Hot Toast Documentation}
 * 
 * @example
 * ```typescript
 * // Loading toast
 * const loadingId = toast.loading('Loading...');
 * // Later: toast.dismiss(loadingId);
 * 
 * // Promise toast
 * toast.promise(
 *   fetchData(),
 *   {
 *     loading: 'Loading...',
 *     success: 'Data loaded!',
 *     error: 'Failed to load'
 *   }
 * );
 * ```
 */
export { toast }