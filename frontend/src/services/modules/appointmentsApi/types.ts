/**
 * Appointments API - Type Definitions
 * 
 * Comprehensive type definitions for appointment scheduling and management system.
 * Includes appointment entities, enums, filters, request/response types, and
 * healthcare-specific appointment types.
 * 
 * @module services/modules/appointmentsApi/types
 */

// ==========================================
// BASE TYPES
// ==========================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// APPOINTMENT ENUMS
// ==========================================

/**
 * Appointment Type Enum
 * Defines the various types of appointments that can be scheduled
 */
export enum AppointmentType {
  CHECKUP = 'CHECKUP',
  MEDICATION = 'MEDICATION',
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  VACCINATION = 'VACCINATION',
  SCREENING = 'SCREENING',
  EMERGENCY = 'EMERGENCY',
  FOLLOW_UP = 'FOLLOW_UP',
  COUNSELING = 'COUNSELING',
  OTHER = 'OTHER'
}

/**
 * Appointment Status Enum
 * Tracks the lifecycle status of an appointment
 */
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED'
}

/**
 * Appointment Priority Enum
 * Determines urgency and processing priority
 */
export enum AppointmentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY'
}

/**
 * Waitlist Priority Enum
 * Determines the priority level for students on the appointment waitlist
 */
export enum WaitlistPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

/**
 * Reminder Status Enum
 * Tracks the delivery status of appointment reminders
 */
export enum ReminderStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * Message Type Enum
 * Defines the communication channels for appointment reminders
 */
export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP'
}

/**
 * Recurrence Frequency Enum
 * Defines the frequency of recurring appointments
 */
export enum RecurrenceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

// ==========================================
// CORE APPOINTMENT ENTITIES
// ==========================================

/**
 * Appointment Entity
 * Represents a scheduled appointment between a student and nurse
 */
export interface Appointment extends BaseEntity {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  scheduledAt: string; // ISO 8601 datetime
  duration: number; // Duration in minutes
  reason?: string;
  notes?: string;
  outcomes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  parentNotified: boolean;
  reminderSent: boolean;
  
  // Populated relationships
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade: string;
    emergencyContacts?: Array<{
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    }>;
  };
  
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone?: string;
  };
  
  // Metadata
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  rescheduledFrom?: string;
  completedAt?: string;
}

/**
 * Appointment Reminder Entity
 * Represents scheduled reminders for appointments
 */
export interface AppointmentReminder extends BaseEntity {
  appointmentId: string;
  type: MessageType;
  status: ReminderStatus;
  scheduledFor: string; // ISO 8601 datetime
  sentAt?: string;
  message: string;
  recipient: string; // Email or phone number
  metadata?: Record<string, unknown>;
  
  // Populated associations
  appointment?: Appointment;
}

/**
 * Appointment Waitlist Entry
 * Represents students waiting for an available appointment slot
 */
export interface AppointmentWaitlist extends BaseEntity {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  priority: WaitlistPriority;
  reason: string;
  preferredDate?: string;
  duration: number;
  notes?: string;
  position: number;
  notifiedAt?: string;
  
  // Populated relationships
  student?: Appointment['student'];
  nurse?: Appointment['nurse'];
}

/**
 * Nurse Availability Entity
 * Defines when nurses are available for appointments
 */
export interface NurseAvailability extends BaseEntity {
  nurseId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  date?: string; // Specific date override (ISO 8601 date)
  isRecurring: boolean;
  maxAppointments?: number;
  slotDuration: number; // Default slot duration in minutes
  breakTime?: number; // Break between appointments in minutes
  isActive: boolean;
  
  // Populated relationships
  nurse?: Appointment['nurse'];
}

// ==========================================
// AVAILABILITY TYPES
// ==========================================

/**
 * Availability Slot
 * Represents an available time slot for appointment booking
 */
export interface AvailabilitySlot {
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  duration: number; // Available duration in minutes
  isAvailable: boolean;
  nurseId: string;
  nurseName?: string;
  conflictingAppointments?: string[]; // Array of appointment IDs
}

/**
 * Conflict Check Result
 * Results from checking appointment conflicts
 */
export interface ConflictCheckResult {
  hasConflicts: boolean;
  conflicts: Array<{
    appointmentId: string;
    studentName: string;
    scheduledAt: string;
    duration: number;
    type: AppointmentType;
    reason: string;
  }>;
  suggestions?: Array<{
    startTime: string;
    endTime: string;
    duration: number;
    nurseName: string;
  }>;
}

// ==========================================
// REQUEST/RESPONSE TYPES
// ==========================================

/**
 * Create Appointment Request Data
 * Data required to create a new appointment
 */
export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 datetime
  duration?: number; // Default: 30 minutes
  reason?: string;
  priority?: AppointmentPriority; // Default: NORMAL
  notes?: string;
  parentNotificationRequired?: boolean;
  reminderEnabled?: boolean;
}

/**
 * Update Appointment Request Data
 * Data that can be updated for an existing appointment
 */
export interface UpdateAppointmentData {
  type?: AppointmentType;
  scheduledAt?: string;
  duration?: number;
  reason?: string;
  priority?: AppointmentPriority;
  notes?: string;
  outcomes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

/**
 * Nurse Availability Request Data
 * Data for setting nurse availability
 */
export interface NurseAvailabilityData {
  nurseId: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  date?: string; // For specific date availability
  isRecurring?: boolean;
  maxAppointments?: number;
  slotDuration?: number;
  breakTime?: number;
}

/**
 * Waitlist Entry Request Data
 * Data for adding a student to the appointment waitlist
 */
export interface WaitlistEntryData {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  reason: string;
  priority?: WaitlistPriority;
  preferredDate?: string;
  duration?: number;
  notes?: string;
}

/**
 * Reminder Request Data
 * Data for scheduling appointment reminders
 */
export interface ReminderData {
  appointmentId: string;
  type: MessageType;
  scheduledFor?: string; // Default: 24 hours before appointment
  message?: string; // Custom message
  recipient?: string; // Override default recipient
}

// ==========================================
// FILTER TYPES
// ==========================================

/**
 * Appointment Filter Criteria
 * Used for filtering and searching appointments
 */
export interface AppointmentFilters {
  startDate?: string; // ISO 8601 date
  endDate?: string; // ISO 8601 date
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  priority?: AppointmentPriority;
  search?: string; // Search in student name, reason, notes
  page?: number;
  limit?: number;
  sortBy?: 'scheduledAt' | 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Waitlist Filter Criteria
 * Used for filtering waitlist entries
 */
export interface WaitlistFilters {
  nurseId?: string;
  type?: AppointmentType;
  priority?: WaitlistPriority;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'position' | 'createdAt' | 'priority' | 'preferredDate';
  sortOrder?: 'asc' | 'desc';
}

// ==========================================
// RECURRING APPOINTMENT TYPES
// ==========================================

/**
 * Recurring Appointment Configuration
 * Defines the recurrence pattern for recurring appointments
 */
export interface RecurrenceConfiguration {
  frequency: RecurrenceFrequency;
  interval: number; // Every N periods (e.g., every 2 weeks)
  endDate?: string; // When to stop creating appointments
  maxOccurrences?: number; // Maximum number of appointments to create
  daysOfWeek?: number[]; // For weekly recurrence (0 = Sunday)
  dayOfMonth?: number; // For monthly recurrence
  exceptions?: string[]; // Dates to skip (ISO 8601 dates)
}

/**
 * Recurring Appointment Request Data
 * Data for creating recurring appointments
 */
export interface RecurringAppointmentData extends CreateAppointmentData {
  recurrence: RecurrenceConfiguration;
}

// ==========================================
// STATISTICS AND REPORTING TYPES
// ==========================================

/**
 * Appointment Statistics Response
 * Aggregated statistics about appointments
 */
export interface AppointmentStatistics {
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number; // Percentage
  noShowRate: number; // Percentage
  averageDuration: number; // Minutes
  
  // By type breakdown
  byType: Record<AppointmentType, {
    count: number;
    completionRate: number;
    averageDuration: number;
  }>;
  
  // By priority breakdown
  byPriority: Record<AppointmentPriority, {
    count: number;
    completionRate: number;
    averageWaitTime: number; // Minutes from scheduling to appointment
  }>;
  
  // Trend data
  dailyTrends: Array<{
    date: string;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  }>;
  
  // Peak times
  peakHours: Array<{
    hour: number; // 0-23
    appointmentCount: number;
    utilizationRate: number; // Percentage
  }>;
  
  // Waitlist statistics
  waitlistStats: {
    totalEntries: number;
    averageWaitTime: number; // Days
    fulfillmentRate: number; // Percentage converted to appointments
  };
}

/**
 * Reminder Processing Result
 * Result of processing appointment reminders
 */
export interface ReminderProcessingResult {
  processed: number;
  sent: number;
  failed: number;
  errors: Array<{
    reminderId: string;
    appointmentId: string;
    error: string;
    retryCount: number;
  }>;
  summary: {
    emailsSent: number;
    smsSent: number;
    pushNotificationsSent: number;
    inAppNotificationsSent: number;
  };
}

// ==========================================
// FORM AND UI TYPES
// ==========================================

/**
 * Appointment Form Data
 * Type-safe form data for appointment creation/editing
 */
export interface AppointmentFormData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledDate: string; // YYYY-MM-DD format
  scheduledTime: string; // HH:MM format
  duration: number;
  reason: string;
  priority: AppointmentPriority;
  notes?: string;
  parentNotificationRequired: boolean;
  reminderEnabled: boolean;
  reminderTime?: number; // Hours before appointment
}

/**
 * Appointment with Populated Relations
 * Fully populated appointment with all associations
 */
export interface AppointmentWithRelations extends Appointment {
  student: NonNullable<Appointment['student']>;
  nurse: NonNullable<Appointment['nurse']>;
  reminders?: AppointmentReminder[];
  conflicts?: ConflictCheckResult['conflicts'];
}

/**
 * Appointment Calendar Event
 * Formatted appointment data for calendar display
 */
export interface AppointmentCalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601 datetime
  end: string; // ISO 8601 datetime
  allDay: boolean;
  color: string; // Color based on type/priority
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  
  extendedProps: {
    appointment: Appointment;
    studentName: string;
    nurseName: string;
    type: AppointmentType;
    priority: AppointmentPriority;
    status: AppointmentStatus;
    reason?: string;
    notes?: string;
    canEdit: boolean;
    canCancel: boolean;
    canReschedule: boolean;
  };
}

/**
 * Appointment Notification Data
 * Data for sending appointment notifications
 */
export interface AppointmentNotification {
  appointmentId: string;
  recipientType: 'student' | 'parent' | 'nurse';
  recipient: string; // Email or phone
  type: MessageType;
  template: string;
  variables: Record<string, string>;
  priority: 'normal' | 'high' | 'urgent';
  scheduledFor?: string; // When to send (default: immediate)
}

// ==========================================
// VALIDATION CONSTANTS
// ==========================================

/**
 * Appointment Validation Rules
 * These constants match backend validation rules
 */
export const APPOINTMENT_VALIDATION = {
  MIN_DURATION: 15, // Minimum appointment duration in minutes
  MAX_DURATION: 240, // Maximum appointment duration in minutes (4 hours)
  DEFAULT_DURATION: 30, // Default appointment duration in minutes
  MIN_ADVANCE_BOOKING: 30, // Minimum minutes in advance to book
  MAX_ADVANCE_BOOKING: 365, // Maximum days in advance to book
  CANCELLATION_NOTICE: 2, // Minimum hours notice for cancellation
  REMINDER_ADVANCE: 24, // Default reminder time in hours
  MAX_DAILY_APPOINTMENTS: 20, // Maximum appointments per nurse per day
  SLOT_INTERVAL: 15, // Time slot intervals in minutes
  BREAK_TIME: 5, // Default break between appointments in minutes
} as const;

/**
 * Appointment Status Transitions
 * Defines valid status transitions for appointment workflow
 */
export const APPOINTMENT_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  [AppointmentStatus.SCHEDULED]: [
    AppointmentStatus.IN_PROGRESS,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
    AppointmentStatus.RESCHEDULED
  ],
  [AppointmentStatus.IN_PROGRESS]: [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED
  ],
  [AppointmentStatus.COMPLETED]: [], // Terminal state
  [AppointmentStatus.CANCELLED]: [], // Terminal state
  [AppointmentStatus.NO_SHOW]: [], // Terminal state
  [AppointmentStatus.RESCHEDULED]: [] // Terminal state
};

// ==========================================
// TYPE GUARDS AND UTILITIES
// ==========================================

/**
 * Type guard to check if an appointment is upcoming
 */
export const isUpcomingAppointment = (appointment: Appointment): boolean => {
  return (
    appointment.status === AppointmentStatus.SCHEDULED &&
    new Date(appointment.scheduledAt) > new Date()
  );
};

/**
 * Type guard to check if an appointment can be cancelled
 */
export const isCancellable = (appointment: Appointment): boolean => {
  return (
    appointment.status === AppointmentStatus.SCHEDULED ||
    appointment.status === AppointmentStatus.IN_PROGRESS
  );
};

/**
 * Get appointment duration end time
 */
export const getAppointmentEndTime = (appointment: Appointment): Date => {
  const startTime = new Date(appointment.scheduledAt);
  return new Date(startTime.getTime() + appointment.duration * 60000);
};

/**
 * Format appointment type for display
 */
export const formatAppointmentType = (type: AppointmentType): string => {
  const typeLabels: Record<AppointmentType, string> = {
    [AppointmentType.CHECKUP]: 'Health Checkup',
    [AppointmentType.MEDICATION]: 'Medication Administration',
    [AppointmentType.INJURY]: 'Injury Assessment',
    [AppointmentType.ILLNESS]: 'Illness Evaluation',
    [AppointmentType.VACCINATION]: 'Vaccination',
    [AppointmentType.SCREENING]: 'Health Screening',
    [AppointmentType.EMERGENCY]: 'Emergency Care',
    [AppointmentType.FOLLOW_UP]: 'Follow-up Visit',
    [AppointmentType.COUNSELING]: 'Health Counseling',
    [AppointmentType.OTHER]: 'Other'
  };
  return typeLabels[type] || type;
};

/**
 * Get priority color for UI display
 */
export const getPriorityColor = (priority: AppointmentPriority): string => {
  const priorityColors: Record<AppointmentPriority, string> = {
    [AppointmentPriority.LOW]: '#6b7280', // Gray
    [AppointmentPriority.NORMAL]: '#3b82f6', // Blue
    [AppointmentPriority.HIGH]: '#f59e0b', // Yellow
    [AppointmentPriority.URGENT]: '#ef4444', // Red
    [AppointmentPriority.EMERGENCY]: '#dc2626' // Dark red
  };
  return priorityColors[priority] || priorityColors[AppointmentPriority.NORMAL];
};

/**
 * Get status color for UI display
 */
export const getStatusColor = (status: AppointmentStatus): string => {
  const statusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: '#3b82f6', // Blue
    [AppointmentStatus.IN_PROGRESS]: '#f59e0b', // Yellow
    [AppointmentStatus.COMPLETED]: '#10b981', // Green
    [AppointmentStatus.CANCELLED]: '#6b7280', // Gray
    [AppointmentStatus.NO_SHOW]: '#ef4444', // Red
    [AppointmentStatus.RESCHEDULED]: '#8b5cf6' // Purple
  };
  return statusColors[status] || statusColors[AppointmentStatus.SCHEDULED];
};
