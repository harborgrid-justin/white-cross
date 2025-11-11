/**
 * Type definitions for appointment management system
 */

import type { Appointment, AppointmentStatus, AppointmentType } from '@/types/domain/appointments';

export type { Appointment, AppointmentStatus, AppointmentType };

export type ViewMode = 'calendar' | 'list' | 'agenda';

export interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedToday: number;
  cancelledToday: number;
  noShowRate: number;
  averageDuration: number;
}

export interface AppointmentsContentProps {
  initialAppointments?: Appointment[];
}

export interface AppointmentFiltersProps {
  statusFilter: AppointmentStatus | 'all';
  typeFilter: AppointmentType | 'all';
  dateFilter: 'today' | 'week' | 'month' | 'all';
  searchQuery: string;
  onStatusFilterChange: (status: AppointmentStatus | 'all') => void;
  onTypeFilterChange: (type: AppointmentType | 'all') => void;
  onDateFilterChange: (date: 'today' | 'week' | 'month' | 'all') => void;
  onSearchQueryChange: (query: string) => void;
}

export interface AppointmentStatsProps {
  stats: AppointmentStats;
}

export interface AppointmentListProps {
  appointments: Appointment[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onEdit: (appointmentId: string) => void;
  onView: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onDelete: (appointmentId: string) => void;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointmentId: string) => void;
  onView: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onDelete: (appointmentId: string) => void;
}
