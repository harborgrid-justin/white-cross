/**
 * Appointments Data Types and Utilities
 * 
 * Contains type definitions, interfaces, and data utilities for appointments functionality
 */

export interface Appointment {
  id: string;
  studentId: string;
  studentName?: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason?: string;
  nurseId?: string;
  nurseName?: string;
}

export interface AppointmentFilters {
  date?: string;
  status?: Appointment['status'];
  priority?: Appointment['priority'];
  studentId?: string;
  nurseId?: string;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

/**
 * Status color mappings for UI display
 */
export const appointmentStatusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-orange-100 text-orange-800',
} as const;

/**
 * Priority color mappings for UI display
 */
export const appointmentPriorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
} as const;

/**
 * Appointment type options
 */
export const appointmentTypes = [
  'Health Check',
  'Medication Administration',
  'Injury Assessment',
  'Immunization',
  'Vision/Hearing Screening',
  'Mental Health Consultation',
  'Chronic Condition Management',
  'Emergency Care',
  'Follow-up Visit',
  'Other',
] as const;

/**
 * Utility functions for appointment data
 */
export const appointmentUtils = {
  /**
   * Format appointment date and time for display
   */
  formatDateTime: (date: string, time: string): string => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${formattedDate} at ${time}`;
  },

  /**
   * Get status badge class
   */
  getStatusClass: (status: Appointment['status']): string => {
    return appointmentStatusColors[status] || appointmentStatusColors.scheduled;
  },

  /**
   * Get priority badge class
   */
  getPriorityClass: (priority: Appointment['priority']): string => {
    return appointmentPriorityColors[priority] || appointmentPriorityColors.medium;
  },

  /**
   * Check if appointment can be edited
   */
  canEdit: (status: Appointment['status']): boolean => {
    return status === 'scheduled' || status === 'confirmed';
  },

  /**
   * Check if appointment can be cancelled
   */
  canCancel: (status: Appointment['status']): boolean => {
    return status === 'scheduled' || status === 'confirmed';
  },

  /**
   * Sort appointments by date and time
   */
  sortByDateTime: (appointments: Appointment[]): Appointment[] => {
    return [...appointments].sort((a, b) => {
      const dateTimeA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
      const dateTimeB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });
  },

  /**
   * Filter appointments by today
   */
  filterToday: (appointments: Appointment[]): Appointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.scheduledDate === today);
  },

  /**
   * Filter appointments by upcoming (next 7 days, excluding today)
   */
  filterUpcoming: (appointments: Appointment[]): Appointment[] => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const todayStr = today.toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    return appointments.filter(apt => 
      apt.scheduledDate > todayStr && apt.scheduledDate <= nextWeekStr
    );
  },
};

/**
 * Default appointment form data
 */
export const defaultAppointment: Partial<Appointment> = {
  appointmentType: 'Health Check',
  duration: 30,
  status: 'scheduled',
  priority: 'medium',
};
