/**
 * Medication Constants
 *
 * Constants related to medication management and inventory.
 */

/**
 * Date format options
 */
export const DATE_FORMATS = {
  display: 'display',
  input: 'input',
  datetime: 'datetime',
  time: 'time'
} as const

export type DateFormat = typeof DATE_FORMATS[keyof typeof DATE_FORMATS]

/**
 * Expiration warning thresholds (in days)
 */
export const EXPIRATION_WARNINGS = {
  critical: 7,    // Less than 7 days
  warning: 30,    // Less than 30 days
  notice: 90      // Less than 90 days
} as const

/**
 * Stock level thresholds
 */
export const STOCK_THRESHOLDS = {
  critical: 5,    // 5 or fewer units
  low: 20         // 20 or fewer units
} as const

/**
 * Severity levels for medications (with display colors)
 */
export const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-blue-600 bg-blue-100' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
  { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-100' }
] as const

export type SeverityLevel = typeof SEVERITY_LEVELS[number]['value']

/**
 * Medication status options
 */
export const MEDICATION_STATUSES = [
  { value: 'active', label: 'Active', color: 'text-green-600 bg-green-100' },
  { value: 'discontinued', label: 'Discontinued', color: 'text-red-600 bg-red-100' },
  { value: 'on_hold', label: 'On Hold', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'pending', label: 'Pending', color: 'text-blue-600 bg-blue-100' }
] as const

export type MedicationStatus = typeof MEDICATION_STATUSES[number]['value']

/**
 * Inventory status options
 */
export const INVENTORY_STATUSES = [
  { value: 'in_stock', label: 'In Stock', color: 'text-green-600 bg-green-100' },
  { value: 'low_stock', label: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'out_of_stock', label: 'Out of Stock', color: 'text-red-600 bg-red-100' },
  { value: 'expired', label: 'Expired', color: 'text-gray-600 bg-gray-100' }
] as const

export type InventoryStatus = typeof INVENTORY_STATUSES[number]['value']

/**
 * Dosage form options
 */
export const DOSAGE_FORMS = {
  TABLET: 'tablet',
  CAPSULE: 'capsule',
  LIQUID: 'liquid',
  INJECTION: 'injection',
  TOPICAL: 'topical',
  INHALER: 'inhaler',
  DROP: 'drop',
  PATCH: 'patch',
  OTHER: 'other'
} as const

export type DosageForm = typeof DOSAGE_FORMS[keyof typeof DOSAGE_FORMS]

/**
 * Medication route options
 */
export const MEDICATION_ROUTES = {
  ORAL: 'oral',
  TOPICAL: 'topical',
  INHALATION: 'inhalation',
  INJECTION: 'injection',
  SUBLINGUAL: 'sublingual',
  RECTAL: 'rectal',
  OPHTHALMIC: 'ophthalmic',
  OTIC: 'otic',
  NASAL: 'nasal',
  OTHER: 'other'
} as const

export type MedicationRoute = typeof MEDICATION_ROUTES[keyof typeof MEDICATION_ROUTES]
