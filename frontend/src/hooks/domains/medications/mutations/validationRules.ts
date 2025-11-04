/**
 * Medication Form Validation Rules
 *
 * Core validation logic for medication-related forms:
 * - Medication master data forms (drug information)
 * - Adverse reaction reporting forms
 * - Inventory management forms
 *
 * @module validationRules
 */

import type {
  MedicationFormData
} from '../types/api'
import type {
  FormErrors,
  InventoryFormData,
  AdverseReactionFormData
} from '../types/medications'

/**
 * Validates medication master data form.
 *
 * Validates drug information including name, dosage form, strength, and related fields.
 * Ensures data quality for medication database entries.
 *
 * @param {MedicationFormData} data - Medication form data to validate
 * @returns {FormErrors} Object mapping field names to error messages (empty if valid)
 *
 * @validates
 * - Required: name, dosageForm, strength
 * - Length: name ≤ 100, genericName ≤ 100, manufacturer ≤ 100
 * - Format: strength must include valid unit (mg, g, ml, mcg, units, iu, %)
 *
 * @example
 * ```ts
 * const errors = validateMedicationForm({
 *   name: 'Amoxicillin',
 *   dosageForm: 'Capsule',
 *   strength: '500mg', // Valid format
 *   genericName: 'Amoxicillin',
 *   manufacturer: 'Generic Pharma'
 * });
 * // errors = {} (no errors)
 *
 * const invalidErrors = validateMedicationForm({
 *   name: '',
 *   dosageForm: 'Tablet',
 *   strength: '500' // Missing unit - INVALID
 * });
 * // invalidErrors = { name: 'Medication name is required', strength: '...' }
 * ```
 *
 * @safety Strength validation ensures dosage units are always specified,
 * preventing ambiguous medication orders.
 */
export const validateMedicationForm = (data: MedicationFormData): FormErrors => {
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

  return newErrors
}

/**
 * Validates adverse reaction reporting form.
 *
 * Validates safety reporting data for documenting medication adverse reactions.
 * Ensures comprehensive documentation of patient safety incidents.
 *
 * @param {AdverseReactionFormData} data - Adverse reaction form data to validate
 * @returns {FormErrors} Object mapping field names to error messages (empty if valid)
 *
 * @validates
 * - Required: studentId, medicationId, severity, description, actionsTaken, occurredAt
 * - Length: description (10-1000 chars), actionsTaken (5-500 chars)
 * - Date: occurredAt must be valid date, not in future
 *
 * @safety This validation ensures complete documentation of adverse reactions,
 * which is critical for patient safety, regulatory compliance, and pharmacovigilance.
 *
 * @example
 * ```ts
 * const errors = validateAdverseReactionForm({
 *   studentId: 'student-123',
 *   medicationId: 'med-456',
 *   severity: 'moderate',
 *   description: 'Patient developed urticarial rash on torso and arms within 2 hours',
 *   actionsTaken: 'Medication discontinued immediately, antihistamine administered',
 *   occurredAt: '2025-10-24T14:30:00Z'
 * });
 * // errors = {} (valid)
 *
 * const invalidErrors = validateAdverseReactionForm({
 *   studentId: 'student-123',
 *   medicationId: 'med-456',
 *   severity: 'moderate',
 *   description: 'Rash', // Too short - INVALID
 *   actionsTaken: 'Stop', // Too short - INVALID
 *   occurredAt: '2026-01-01T00:00:00Z' // Future date - INVALID
 * });
 * ```
 *
 * @remarks Minimum lengths ensure sufficient detail for clinical review and
 * regulatory reporting requirements.
 */
export const validateAdverseReactionForm = (data: AdverseReactionFormData): FormErrors => {
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

  return newErrors
}

/**
 * Validates medication inventory form.
 *
 * Validates inventory management data including quantities, batch tracking,
 * expiration dates, and reorder levels. Ensures accurate medication stock tracking.
 *
 * @param {InventoryFormData} data - Inventory form data to validate
 * @returns {FormErrors} Object mapping field names to error messages (empty if valid)
 *
 * @validates
 * - Required: medicationId, batchNumber, quantity, reorderLevel, expirationDate
 * - Numeric: quantity (0-99,999), reorderLevel (0-999)
 * - Logical: reorderLevel ≤ quantity
 * - Date: expirationDate must be valid and in future
 * - Length: batchNumber ≤ 50, supplier ≤ 100
 *
 * @safety This validation helps prevent:
 * - Stock shortages (via reorder level validation)
 * - Dispensing expired medications (via expiration date validation)
 * - Inventory tracking errors (via batch number validation)
 *
 * @example
 * ```ts
 * const errors = validateInventoryForm({
 *   medicationId: 'med-789',
 *   batchNumber: 'BATCH-2025-001',
 *   quantity: 500,
 *   reorderLevel: 100,
 *   expirationDate: '2026-12-31',
 *   supplier: 'Generic Pharma Distributors'
 * });
 * // errors = {} (valid)
 *
 * const invalidErrors = validateInventoryForm({
 *   medicationId: 'med-789',
 *   batchNumber: 'BATCH-2025-001',
 *   quantity: 50,
 *   reorderLevel: 100, // Greater than quantity - INVALID
 *   expirationDate: '2024-01-01' // Past date - INVALID
 * });
 * ```
 *
 * @remarks Reorder level validation prevents illogical inventory configurations
 * that could lead to unnecessary reorder alerts.
 */
export const validateInventoryForm = (data: InventoryFormData): FormErrors => {
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

  return newErrors
}
