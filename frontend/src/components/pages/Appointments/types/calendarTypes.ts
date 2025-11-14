/**
 * Calendar Types and Interfaces
 *
 * Type definitions for the AppointmentCalendar component and related sub-components.
 */

import type { Appointment, AppointmentStatus } from '../AppointmentCard';

/**
 * Calendar view types
 */
export type CalendarView = 'month' | 'week' | 'day';

/**
 * Calendar cell data
 */
export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  appointments: Appointment[];
}

/**
 * Calendar filter options
 */
export interface CalendarFilters {
  status?: AppointmentStatus[];
  providers?: string[];
  types?: string[];
  search?: string;
}

/**
 * Working hours configuration
 */
export interface WorkingHours {
  start: string;
  end: string;
}

/**
 * Props for the AppointmentCalendar component
 */
export interface AppointmentCalendarProps {
  /** Appointments to display in calendar */
  appointments?: Appointment[];
  /** Default calendar view */
  defaultView?: CalendarView;
  /** Default selected date */
  defaultDate?: Date;
  /** Whether to show filters */
  showFilters?: boolean;
  /** Whether to show toolbar */
  showToolbar?: boolean;
  /** Whether to show appointment count per day */
  showAppointmentCount?: boolean;
  /** Whether appointments are editable */
  editable?: boolean;
  /** Whether to highlight weekends */
  highlightWeekends?: boolean;
  /** Working hours for calendar display */
  workingHours?: WorkingHours;
  /** Custom CSS classes */
  className?: string;
  /** Date change handler */
  onDateChange?: (date: Date) => void;
  /** View change handler */
  onViewChange?: (view: CalendarView) => void;
  /** Appointment click handler */
  onAppointmentClick?: (appointment: Appointment) => void;
  /** Create appointment handler */
  onCreateAppointment?: (date: Date, time?: string) => void;
  /** Edit appointment handler */
  onEditAppointment?: (appointment: Appointment) => void;
  /** Delete appointment handler */
  onDeleteAppointment?: (appointmentId: string) => void;
  /** Export calendar handler */
  onExportCalendar?: (format: 'pdf' | 'ical' | 'csv') => void;
  /** Import calendar handler */
  onImportCalendar?: (file: File) => void;
  /** Refresh appointments handler */
  onRefresh?: () => void;
  /** Filter change handler */
  onFilterChange?: (filters: CalendarFilters) => void;
}

/**
 * Props for Calendar Toolbar component
 */
export interface CalendarToolbarProps {
  currentDate: Date;
  currentView: CalendarView;
  selectedDate: Date | null;
  filters: CalendarFilters;
  showFilterMenu: boolean;
  showFilters: boolean;
  editable: boolean;
  loading: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
  onViewChange: (view: CalendarView) => void;
  onTodayClick: () => void;
  onFilterMenuToggle: () => void;
  onFilterChange: (filters: CalendarFilters) => void;
  onRefresh: () => void;
  onCreateAppointment: () => void;
}

/**
 * Props for Calendar Month View component
 */
export interface CalendarMonthViewProps {
  cells: CalendarCell[];
  highlightWeekends: boolean;
  showAppointmentCount: boolean;
  onDateSelect: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  getAppointmentStatusColor: (status: AppointmentStatus) => string;
}

/**
 * Props for Calendar Week View component
 */
export interface CalendarWeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onDateSelect?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onCreateAppointment?: (date: Date, time?: string) => void;
  getAppointmentStatusColor: (status: AppointmentStatus) => string;
}

/**
 * Props for Calendar Day View component
 */
export interface CalendarDayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  editable: boolean;
  onAppointmentClick?: (appointment: Appointment) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
  onCreateAppointment?: (date: Date, time?: string) => void;
  getAppointmentStatusColor: (status: AppointmentStatus) => string;
}
