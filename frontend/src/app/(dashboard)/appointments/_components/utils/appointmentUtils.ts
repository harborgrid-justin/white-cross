/**
 * Utility functions for appointment management
 */

import type { Appointment } from '../types/appointment.types';
import { AppointmentStatus, AppointmentType } from '@/types/domain/appointments';

/**
 * Format appointment time for display
 */
export const formatAppointmentTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);
};

/**
 * Format appointment date for display
 */
export const formatAppointmentDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'no_show':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'rescheduled':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get type badge color classes
 */
export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'health_screening':
      return 'bg-blue-100 text-blue-800';
    case 'vaccination':
      return 'bg-green-100 text-green-800';
    case 'medication_review':
      return 'bg-purple-100 text-purple-800';
    case 'follow_up':
      return 'bg-yellow-100 text-yellow-800';
    case 'emergency':
      return 'bg-red-100 text-red-800';
    case 'consultation':
      return 'bg-indigo-100 text-indigo-800';
    case 'physical_exam':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Check if appointment is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if appointment is upcoming (in the future)
 */
export const isUpcoming = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
};

/**
 * Calculate appointment duration in minutes
 */
export const calculateDuration = (startTime: Date | string, endTime: Date | string): number => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

/**
 * Format duration for display
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Filter appointments by status
 */
export const filterByStatus = (
  appointments: Appointment[],
  status: AppointmentStatus | 'all'
): Appointment[] => {
  if (status === 'all') return appointments;
  return appointments.filter(apt => apt.status === status);
};

/**
 * Filter appointments by type
 */
export const filterByType = (
  appointments: Appointment[],
  type: AppointmentType | 'all'
): Appointment[] => {
  if (type === 'all') return appointments;
  return appointments.filter(apt => apt.type === type);
};

/**
 * Filter appointments by date range
 */
export const filterByDateRange = (
  appointments: Appointment[],
  range: 'today' | 'week' | 'month' | 'all'
): Appointment[] => {
  if (range === 'all') return appointments;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return appointments.filter(apt => {
    const aptDate = new Date(apt.scheduledAt);
    
    switch (range) {
      case 'today':
        return isToday(aptDate);
      case 'week': {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        return aptDate >= today && aptDate < weekEnd;
      }
      case 'month': {
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() + 1);
        return aptDate >= today && aptDate < monthEnd;
      }
      default:
        return true;
    }
  });
};

/**
 * Search appointments by query
 */
export const searchAppointments = (
  appointments: Appointment[],
  query: string
): Appointment[] => {
  if (!query.trim()) return appointments;
  
  const lowerQuery = query.toLowerCase();
  return appointments.filter(apt =>
    apt.type.toLowerCase().includes(lowerQuery) ||
    apt.notes?.toLowerCase().includes(lowerQuery) ||
    apt.reason?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort appointments by date
 */
export const sortByDate = (
  appointments: Appointment[],
  order: 'asc' | 'desc' = 'asc'
): Appointment[] => {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(a.scheduledAt).getTime();
    const dateB = new Date(b.scheduledAt).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Group appointments by date
 */
export const groupByDate = (appointments: Appointment[]): Map<string, Appointment[]> => {
  const grouped = new Map<string, Appointment[]>();
  
  appointments.forEach(apt => {
    const dateKey = formatAppointmentDate(apt.scheduledAt);
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, apt]);
  });
  
  return grouped;
};

/**
 * Get appointment duration from appointment object
 */
export const getAppointmentDuration = (appointment: Appointment): string => {
  // If appointment has explicit duration
  if (appointment.duration) {
    return formatDuration(appointment.duration);
  }
  
  // Default duration
  return '30m';
};

/**
 * Filter appointments with multiple criteria
 */
export const filterAppointments = (
  appointments: Appointment[],
  filters: {
    searchQuery?: string;
    statusFilter?: AppointmentStatus | 'all';
    typeFilter?: AppointmentType | 'all';
    dateRange?: 'today' | 'week' | 'month' | 'all';
  }
): Appointment[] => {
  let filtered = [...appointments];
  
  // Apply search
  if (filters.searchQuery) {
    filtered = searchAppointments(filtered, filters.searchQuery);
  }
  
  // Apply status filter
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    filtered = filterByStatus(filtered, filters.statusFilter);
  }
  
  // Apply type filter
  if (filters.typeFilter && filters.typeFilter !== 'all') {
    filtered = filterByType(filtered, filters.typeFilter);
  }
  
  // Apply date range filter
  if (filters.dateRange) {
    filtered = filterByDateRange(filtered, filters.dateRange);
  }
  
  return filtered;
};

/**
 * Calculate appointment statistics
 */
export const calculateStats = (appointments: Appointment[]): {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedToday: number;
  cancelledToday: number;
  noShowRate: number;
  averageDuration: number;
} => {
  const todayAppointments = appointments.filter(apt => isToday(apt.scheduledAt));
  const upcomingAppointments = appointments.filter(apt => isUpcoming(apt.scheduledAt));
  
  const completedToday = todayAppointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length;
  const cancelledToday = todayAppointments.filter(apt => apt.status === AppointmentStatus.CANCELLED).length;
  
  // Calculate no-show rate
  const totalCompleted = appointments.filter(apt => 
    apt.status === AppointmentStatus.COMPLETED || apt.status === AppointmentStatus.NO_SHOW
  ).length;
  const noShows = appointments.filter(apt => apt.status === AppointmentStatus.NO_SHOW).length;
  const noShowRate = totalCompleted > 0 ? (noShows / totalCompleted) * 100 : 0;
  
  // Calculate average duration
  const durations = appointments
    .filter(apt => apt.duration)
    .map(apt => apt.duration || 30);
  const averageDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 30;
  
  return {
    totalAppointments: appointments.length,
    todayAppointments: todayAppointments.length,
    upcomingAppointments: upcomingAppointments.length,
    completedToday,
    cancelledToday,
    noShowRate: Math.round(noShowRate * 10) / 10,
    averageDuration
  };
};
