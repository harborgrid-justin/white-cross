/**
 * Validation Helper Functions
 *
 * Utility functions for error management and DOM manipulation
 * for medication form validation.
 *
 * @module validationHelpers
 */

import type { FormErrors } from '../types/medications'

/**
 * Creates a function to clear all validation errors.
 *
 * @param {React.Dispatch<React.SetStateAction<FormErrors>>} setErrors - State setter for errors
 * @returns {() => void} Function that clears all errors
 *
 * @example
 * ```tsx
 * const clearErrors = createClearErrors(setErrors);
 * clearErrors(); // Resets errors to {}
 * ```
 */
export const createClearErrors = (
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  return () => {
    setErrors({})
  }
}

/**
 * Creates a function to set error message for a specific field.
 *
 * @param {React.Dispatch<React.SetStateAction<FormErrors>>} setErrors - State setter for errors
 * @returns {(field: string, error: string) => void} Function to set field error
 *
 * @example
 * ```tsx
 * const setFieldError = createSetFieldError(setErrors);
 * setFieldError('ndc', 'This NDC is already registered');
 * ```
 */
export const createSetFieldError = (
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  return (field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }
}

/**
 * Displays validation errors in DOM elements.
 *
 * Automatically finds and updates DOM elements with matching data-testid attributes.
 * Shows errors by removing 'hidden' class and setting textContent.
 * Hides errors no longer present by adding 'hidden' class.
 *
 * @param {FormErrors} validationErrors - Errors to display
 * @param {string} [prefix=''] - Prefix for data-testid attributes (e.g., 'medication-')
 *
 * @remarks This function directly manipulates the DOM. It expects elements with
 * data-testid attributes in format: `${prefix}${fieldName}-error`
 *
 * @example
 * ```tsx
 * displayValidationErrors(errors, 'medication-');
 *
 * // In JSX, error elements should have:
 * // <span data-testid="medication-name-error" className="hidden text-red-500"></span>
 * ```
 */
export const displayValidationErrors = (validationErrors: FormErrors, prefix = '') => {
  // Display errors in DOM elements with data-testid attributes
  Object.keys(validationErrors).forEach(key => {
    const errorElement = document.querySelector(`[data-testid="${prefix}${key}-error"]`)
    if (errorElement) {
      errorElement.classList.remove('hidden')
      errorElement.textContent = validationErrors[key]
    }
  })

  // Hide errors that are no longer present
  const currentErrorKeys = Object.keys(validationErrors)
  const allErrorElements = document.querySelectorAll(`[data-testid*="${prefix}"][data-testid*="-error"]`)

  allErrorElements.forEach(element => {
    const testId = element.getAttribute('data-testid') || ''
    const fieldKey = testId.replace(prefix, '').replace('-error', '')

    if (!currentErrorKeys.includes(fieldKey)) {
      element.classList.add('hidden')
      element.textContent = ''
    }
  })
}
