import { useState } from 'react'
import type {
  FormErrors,
  MedicationFormData,
  AdverseReactionFormData,
  InventoryFormData,
  UseFormValidationReturn
} from '../types/medications'

export const useMedicationFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<FormErrors>({})

  const validateMedicationForm = (data: MedicationFormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!data.name?.trim()) {
      newErrors.name = 'Medication name is required'
    }

    if (!data.dosageForm?.trim()) {
      newErrors.dosageForm = 'Dosage form is required'
    }

    if (!data.strength?.trim()) {
      newErrors.strength = 'Strength is required'
    }

    // Length validations
    if (data.name && data.name.length > 100) {
      newErrors.name = 'Medication name must be less than 100 characters'
    }

    if (data.genericName && data.genericName.length > 100) {
      newErrors.genericName = 'Generic name must be less than 100 characters'
    }

    if (data.manufacturer && data.manufacturer.length > 100) {
      newErrors.manufacturer = 'Manufacturer name must be less than 100 characters'
    }

    // Format validations
    if (data.strength && !/^[\d.]+\s*(mg|g|ml|mcg|units?|iu|%)$/i.test(data.strength.trim())) {
      newErrors.strength = 'Strength must include a valid unit (e.g., 500mg, 10ml, 1g)'
    }

    setErrors(newErrors)
    return newErrors
  }

  const validateAdverseReactionForm = (data: AdverseReactionFormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!data.studentId?.trim()) {
      newErrors.studentId = 'Student selection is required'
    }

    if (!data.medicationId?.trim()) {
      newErrors.medicationId = 'Medication selection is required'
    }

    if (!data.severity) {
      newErrors.severity = 'Severity level is required'
    }

    if (!data.description?.trim()) {
      newErrors.description = 'Reaction description is required'
    }

    if (!data.actionsTaken?.trim()) {
      newErrors.actionsTaken = 'Actions taken is required'
    }

    if (!data.occurredAt?.trim()) {
      newErrors.occurredAt = 'Occurrence date/time is required'
    }

    // Length validations
    if (data.description && data.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (data.description && data.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (data.actionsTaken && data.actionsTaken.length < 5) {
      newErrors.actionsTaken = 'Actions taken must be at least 5 characters'
    }

    if (data.actionsTaken && data.actionsTaken.length > 500) {
      newErrors.actionsTaken = 'Actions taken must be less than 500 characters'
    }

    // Date validation
    if (data.occurredAt) {
      const occurredDate = new Date(data.occurredAt)
      const now = new Date()
      
      if (isNaN(occurredDate.getTime())) {
        newErrors.occurredAt = 'Invalid date format'
      } else if (occurredDate > now) {
        newErrors.occurredAt = 'Occurrence date cannot be in the future'
      }
    }

    setErrors(newErrors)
    return newErrors
  }

  const validateInventoryForm = (data: InventoryFormData): FormErrors => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!data.medicationId?.trim()) {
      newErrors.medicationId = 'Medication selection is required'
    }

    if (!data.batchNumber?.trim()) {
      newErrors.batchNumber = 'Batch number is required'
    }

    if (data.quantity === undefined || data.quantity === null) {
      newErrors.quantity = 'Quantity is required'
    }

    if (data.reorderLevel === undefined || data.reorderLevel === null) {
      newErrors.reorderLevel = 'Reorder level is required'
    }

    if (!data.expirationDate?.trim()) {
      newErrors.expirationDate = 'Expiration date is required'
    }

    // Numeric validations
    if (data.quantity !== undefined && data.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative'
    }

    if (data.quantity !== undefined && data.quantity > 99999) {
      newErrors.quantity = 'Quantity cannot exceed 99,999'
    }

    if (data.reorderLevel !== undefined && data.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level cannot be negative'
    }

    if (data.reorderLevel !== undefined && data.reorderLevel > 999) {
      newErrors.reorderLevel = 'Reorder level cannot exceed 999'
    }

    if (data.quantity !== undefined && data.reorderLevel !== undefined && data.reorderLevel > data.quantity) {
      newErrors.reorderLevel = 'Reorder level cannot be greater than current quantity'
    }

    // Date validations
    if (data.expirationDate) {
      const expirationDate = new Date(data.expirationDate)
      const now = new Date()
      
      if (isNaN(expirationDate.getTime())) {
        newErrors.expirationDate = 'Invalid date format'
      } else if (expirationDate <= now) {
        newErrors.expirationDate = 'Expiration date must be in the future'
      }
    }

    // Format validations
    if (data.batchNumber && data.batchNumber.length > 50) {
      newErrors.batchNumber = 'Batch number must be less than 50 characters'
    }

    if (data.supplier && data.supplier.length > 100) {
      newErrors.supplier = 'Supplier name must be less than 100 characters'
    }

    setErrors(newErrors)
    return newErrors
  }

  const clearErrors = () => {
    setErrors({})
  }

  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const displayValidationErrors = (validationErrors: FormErrors, prefix = '') => {
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

  return {
    errors,
    validateMedicationForm,
    validateAdverseReactionForm,
    validateInventoryForm,
    clearErrors,
    setFieldError,
    displayValidationErrors
  }
}