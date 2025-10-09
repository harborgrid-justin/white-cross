export type AppointmentType =
  | 'ROUTINE_CHECKUP'
  | 'MEDICATION_ADMINISTRATION'
  | 'INJURY_ASSESSMENT'
  | 'ILLNESS_EVALUATION'
  | 'FOLLOW_UP'
  | 'SCREENING'
  | 'EMERGENCY';

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ReminderType = 'sms' | 'email' | 'voice';

export type WaitlistPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: Date;
  duration?: number; // minutes, defaults to 30
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  type?: AppointmentType;
  scheduledAt?: Date;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  nurseId?: string;
  studentId?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingAppointment?: {
    id: string;
    student: string;
    reason: string;
  };
}

export interface ReminderData {
  appointmentId: string;
  type: ReminderType;
  scheduleTime: Date; // When to send the reminder
  message?: string;
}

export interface NurseAvailabilityData {
  nurseId: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  specificDate?: Date;
  isAvailable?: boolean;
  reason?: string;
}

export interface WaitlistEntry {
  studentId: string;
  nurseId?: string;
  type: AppointmentType;
  preferredDate?: Date;
  duration?: number;
  priority?: WaitlistPriority;
  reason: string;
  notes?: string;
}

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number; // every N days/weeks/months
  endDate: Date;
  daysOfWeek?: number[]; // for weekly: 0=Sunday, 1=Monday, etc.
}
