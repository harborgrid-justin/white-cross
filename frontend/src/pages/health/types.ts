/**
 * Health Page Types
 *
 * Comprehensive type definitions for health records management functionality in the
 * White Cross healthcare platform. Provides type safety for appointments, medications,
 * health records, screenings, immunizations, and related healthcare data.
 *
 * @module pages/health/types
 *
 * @remarks
 * HIPAA Compliance: Many types in this module contain PHI (Protected Health Information)
 * and require secure handling, audit logging, and proper access controls.
 *
 * Healthcare Standards: Types follow healthcare industry standards for immunizations,
 * screenings, and medical history documentation to ensure interoperability and compliance.
 *
 * @see {@link useHealthRecordsPageData} for hook-based data access
 * @see {@link HealthComponents} for UI components
 *
 * @since 1.0.0
 */

// =====================
// VIEW MODE TYPES
// =====================

/**
 * View mode for displaying appointments in different layouts.
 *
 * @typedef {string} ViewMode
 *
 * @property {string} list - List view for detailed appointment information
 * @property {string} calendar - Calendar view for scheduling visualization
 * @property {string} grid - Grid view for compact display
 *
 * @example
 * ```typescript
 * const [viewMode, setViewMode] = useState<ViewMode>('calendar');
 * ```
 */
export type ViewMode = 'list' | 'calendar' | 'grid';

/**
 * Tab selection for medications management interface.
 *
 * Defines the available tabs in the medications section of the health module.
 *
 * @typedef {string} MedicationTab
 *
 * @property {string} overview - Overview dashboard with statistics and alerts
 * @property {string} medications - Medication list and management
 * @property {string} inventory - Inventory tracking and stock management
 * @property {string} reminders - Upcoming medication reminders and due doses
 * @property {string} adverse-reactions - Adverse reaction reports and tracking
 *
 * @example
 * ```typescript
 * const [activeTab, setActiveTab] = useState<MedicationTab>('overview');
 * ```
 */
export type MedicationTab = 'overview' | 'medications' | 'inventory' | 'reminders' | 'adverse-reactions';

// =====================
// APPOINTMENT TYPES
// =====================

/**
 * Appointment filter configuration for querying and filtering appointments.
 *
 * Supports comprehensive filtering by status, type, date range, personnel,
 * and search terms.
 *
 * @interface AppointmentFilters
 *
 * @property {'all' | 'scheduled' | 'completed' | 'cancelled' | 'no-show'} [filterStatus] - Filter by appointment status
 * @property {'all' | string} [filterType] - Filter by appointment type (e.g., "Checkup", "Immunization", "Sick visit")
 * @property {string} [dateFrom] - Start date for date range filter (ISO format)
 * @property {string} [dateTo] - End date for date range filter (ISO format)
 * @property {string} [studentId] - Filter by specific student (PHI)
 * @property {string} [nurseId] - Filter by assigned nurse
 * @property {string} [search] - Search term for student name or appointment notes
 *
 * @example
 * ```typescript
 * const filters: AppointmentFilters = {
 *   filterStatus: 'scheduled',
 *   dateFrom: '2025-10-26',
 *   dateTo: '2025-10-31',
 *   nurseId: 'nurse-123'
 * };
 * ```
 *
 * @remarks
 * PHI Protection: Filters containing studentId involve PHI and should be logged
 * for audit purposes.
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
 * Sortable columns for appointment list sorting.
 *
 * @typedef {string} AppointmentSortColumn
 *
 * @property {string} scheduledAt - Sort by appointment date and time
 * @property {string} type - Sort by appointment type
 * @property {string} status - Sort by appointment status
 * @property {string} studentName - Sort by student name (alphabetically)
 */
export type AppointmentSortColumn = 'scheduledAt' | 'type' | 'status' | 'studentName';

/**
 * Appointment statistics summary for dashboard display.
 *
 * Provides aggregate counts and metrics for appointment management overview.
 *
 * @interface AppointmentStatistics
 *
 * @property {number} total - Total number of appointments in the system
 * @property {number} scheduled - Count of scheduled (upcoming) appointments
 * @property {number} completed - Count of completed appointments
 * @property {number} cancelled - Count of cancelled appointments
 * @property {number} noShow - Count of no-show appointments
 * @property {number} todayAppointments - Count of appointments scheduled for today
 * @property {number} upcomingAppointments - Count of appointments in next 7 days
 *
 * @example
 * ```typescript
 * const stats: AppointmentStatistics = {
 *   total: 150,
 *   scheduled: 45,
 *   completed: 85,
 *   cancelled: 15,
 *   noShow: 5,
 *   todayAppointments: 8,
 *   upcomingAppointments: 32
 * };
 * ```
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
