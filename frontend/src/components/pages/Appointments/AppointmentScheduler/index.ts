/**
 * AppointmentScheduler Module
 *
 * Exports the main scheduler component and related types/utilities.
 */

export { default } from './AppointmentScheduler';
export { default as AppointmentScheduler } from './AppointmentScheduler';
export { default as CalendarView } from './CalendarView';
export { default as TimeSlotPicker } from './TimeSlotPicker';
export { default as ProviderSelector } from './ProviderSelector';
export { default as PatientSelector } from './PatientSelector';
export { default as RoomBooking } from './RoomBooking';
export { default as SchedulerForm } from './SchedulerForm';

// Export types
export type {
  TimeSlot,
  Provider,
  Patient,
  Room,
  AppointmentSchedulerProps,
  Appointment,
  AppointmentType,
  AppointmentPriority
} from './types';

// Export utilities
export { formatDate, formatTime, getWeekDays, isToday, isPast } from './utils';

// Export hooks
export { useTimeSlots, useSearch, useSchedulerForm } from './hooks';
