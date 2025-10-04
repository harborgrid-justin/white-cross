import type {
  MedicationTab,
  DosageForm
} from '../types/medications'
import type { Priority } from '../types/api'

// Tab configuration
export const MEDICATION_TABS: { value: MedicationTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'medications', label: 'Medications' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'reminders', label: 'Reminders' },
  { value: 'adverse-reactions', label: 'Adverse Reactions' }
]

// Dosage forms
export const DOSAGE_FORMS: { value: DosageForm; label: string }[] = [
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Capsule', label: 'Capsule' },
  { value: 'Liquid', label: 'Liquid' },
  { value: 'Injection', label: 'Injection' },
  { value: 'Cream', label: 'Cream' },
  { value: 'Ointment', label: 'Ointment' },
  { value: 'Inhaler', label: 'Inhaler' }
]

// Administration routes (string constants for now)
export const ADMINISTRATION_ROUTES: { value: string; label: string }[] = [
  { value: 'oral', label: 'Oral' },
  { value: 'topical', label: 'Topical' },
  { value: 'intravenous', label: 'Intravenous (IV)' },
  { value: 'intramuscular', label: 'Intramuscular (IM)' },
  { value: 'subcutaneous', label: 'Subcutaneous' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'nasal', label: 'Nasal' },
  { value: 'ocular', label: 'Ocular (Eye)' },
  { value: 'otic', label: 'Otic (Ear)' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'transdermal', label: 'Transdermal' }
]

// Severity levels
export const SEVERITY_LEVELS: { value: Priority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Low', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-orange-600 bg-orange-100' },
  { value: 'HIGH', label: 'High', color: 'text-red-600 bg-red-100' },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-700 bg-red-150' },
  { value: 'CRITICAL', label: 'Critical', color: 'text-red-800 bg-red-200' }
]

// Medication statuses (string constants for now)
export const MEDICATION_STATUSES: { value: string; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'text-green-600 bg-green-100' },
  { value: 'inactive', label: 'Inactive', color: 'text-gray-600 bg-gray-100' },
  { value: 'discontinued', label: 'Discontinued', color: 'text-red-600 bg-red-100' },
  { value: 'pending', label: 'Pending', color: 'text-blue-600 bg-blue-100' }
]

// Inventory statuses (string constants for now)
export const INVENTORY_STATUSES: { value: string; label: string; color: string }[] = [
  { value: 'in-stock', label: 'In Stock', color: 'text-green-600 bg-green-100' },
  { value: 'low-stock', label: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'out-of-stock', label: 'Out of Stock', color: 'text-red-600 bg-red-100' },
  { value: 'expired', label: 'Expired', color: 'text-gray-600 bg-gray-100' },
  { value: 'recalled', label: 'Recalled', color: 'text-purple-600 bg-purple-100' }
]

// Time intervals for reminders
export const REMINDER_INTERVALS = [
  { value: '1', label: 'Every hour' },
  { value: '2', label: 'Every 2 hours' },
  { value: '4', label: 'Every 4 hours' },
  { value: '6', label: 'Every 6 hours' },
  { value: '8', label: 'Every 8 hours' },
  { value: '12', label: 'Every 12 hours' },
  { value: '24', label: 'Once daily' },
  { value: '48', label: 'Every 2 days' },
  { value: '72', label: 'Every 3 days' },
  { value: '168', label: 'Weekly' }
]

// Common medication units
export const MEDICATION_UNITS = [
  'mg', 'g', 'mcg', 'ml', 'l', 'units', 'IU', 'mEq', '%', 'drops', 'tablets', 'capsules'
]

// Priority levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-blue-600 bg-blue-100' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' }
]

// Storage conditions
export const STORAGE_CONDITIONS = [
  'Room temperature',
  'Refrigerated (2-8°C)',
  'Frozen (-20°C)',
  'Cool, dry place',
  'Protected from light',
  'Controlled substance safe'
]

// Common allergies/contraindications
export const COMMON_ALLERGIES = [
  'Penicillin',
  'Sulfa drugs',
  'Aspirin',
  'NSAIDs',
  'Latex',
  'Iodine',
  'Shellfish',
  'Tree nuts',
  'Eggs',
  'Dairy'
]

// Age groups for dosing
export const AGE_GROUPS = [
  { value: 'infant', label: 'Infant (0-12 months)', minAge: 0, maxAge: 1 },
  { value: 'toddler', label: 'Toddler (1-3 years)', minAge: 1, maxAge: 3 },
  { value: 'preschool', label: 'Preschool (3-5 years)', minAge: 3, maxAge: 5 },
  { value: 'school-age', label: 'School Age (6-12 years)', minAge: 6, maxAge: 12 },
  { value: 'adolescent', label: 'Adolescent (13-18 years)', minAge: 13, maxAge: 18 },
  { value: 'adult', label: 'Adult (18+ years)', minAge: 18, maxAge: 999 }
]

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100]
}

// Search configuration
export const SEARCH_CONFIG = {
  minSearchLength: 2,
  searchDelay: 300, // ms
  maxResults: 100
}

// Date format constants
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  datetime: 'MMM dd, yyyy HH:mm',
  time: 'HH:mm'
}

// Stock level thresholds
export const STOCK_THRESHOLDS = {
  critical: 5,
  low: 20,
  reorder: 50
}

// Expiration warning periods (in days)
export const EXPIRATION_WARNINGS = {
  critical: 7,    // Red alert - expires within 7 days
  warning: 30,    // Yellow alert - expires within 30 days
  notice: 90      // Blue notice - expires within 90 days
}