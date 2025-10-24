/**
 * Health Page Types
 *
 * Type definitions for health management functionality.
 * Supports appointments, medications, health records, and related features.
 *
 * @module pages/health/types
 */

// =====================
// VIEW MODE TYPES
// =====================

/**
 * View mode for displaying appointments
 */
export type ViewMode = 'list' | 'calendar' | 'grid';

/**
 * Tab selection for medications interface
 */
export type MedicationTab = 'overview' | 'medications' | 'inventory' | 'reminders' | 'adverse-reactions';

// =====================
// APPOINTMENT TYPES
// =====================

/**
 * Appointment filter configuration
 */
export interface AppointmentFilters {
  filterStatus?: 'all' | 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  filterType?: 'all' | string;
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
  nurseId?: string;
  search?: string;
}

/**
 * Sortable columns for appointments
 */
export type AppointmentSortColumn = 'scheduledAt' | 'type' | 'status' | 'studentName';

/**
 * Appointment statistics summary
 */
export interface AppointmentStatistics {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayAppointments: number;
  upcomingAppointments: number;
}

// =====================
// MEDICATION TYPES
// =====================

/**
 * Medication filter configuration
 */
export interface MedicationFilters {
  searchTerm?: string;
  dosageForm?: string;
  controlledStatus?: 'all' | 'controlled' | 'non-controlled';
  isActive?: boolean;
  manufacturer?: string;
  category?: string;
}

/**
 * Medication form data
 */
export interface MedicationFormData {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
  category?: string;
  description?: string;
}

/**
 * Medication form validation errors
 */
export interface MedicationFormErrors {
  name?: string;
  dosageForm?: string;
  strength?: string;
  ndc?: string;
  [key: string]: string | undefined;
}

/**
 * Medication entity
 */
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  category?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medication inventory item
 */
export interface MedicationInventoryItem {
  id: string;
  medicationId: string;
  medication?: Medication;
  quantityOnHand: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  expirationDate?: string;
  batchNumber?: string;
  lastUpdated: string;
}

/**
 * Medication reminder
 */
export interface MedicationReminder {
  id: string;
  studentId: string;
  studentName: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  dosage: string;
  status: 'pending' | 'completed' | 'missed';
  notes?: string;
}

/**
 * Adverse reaction report
 */
export interface AdverseReaction {
  id: string;
  studentId: string;
  studentName: string;
  medicationId: string;
  medicationName: string;
  reactionType: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  occurredAt: string;
  reportedBy: string;
  actionTaken?: string;
}

// =====================
// HEALTH RECORD TYPES
// =====================

/**
 * Health record filter configuration
 */
export interface HealthRecordFilters {
  studentId?: string;
  recordType?: 'all' | 'immunization' | 'allergy' | 'condition' | 'screening' | 'dental' | 'vision' | 'hearing';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Health record entity (base type)
 */
export interface HealthRecord {
  id: string;
  studentId: string;
  recordType: string;
  date: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// =====================
// HOOK RETURN TYPES
// =====================

/**
 * Return type for useAppointmentsData hook
 */
export interface UseAppointmentsDataReturn {
  appointments: any[];
  waitlist: any[];
  statistics: AppointmentStatistics;
  loading: boolean;
  error: any;
  loadData: () => Promise<void>;
}

/**
 * Return type for useMedicationsData hook
 */
export interface UseMedicationsDataReturn {
  medications: Medication[];
  medicationsLoading: boolean;
  medicationsFetching: boolean;
  inventory: MedicationInventoryItem[];
  inventoryLoading: boolean;
  reminders: MedicationReminder[];
  remindersLoading: boolean;
  adverseReactions: AdverseReaction[];
  adverseReactionsLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Return type for useHealthRecordsPageData hook
 */
export interface UseHealthRecordsPageDataReturn {
  records: HealthRecord[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}
