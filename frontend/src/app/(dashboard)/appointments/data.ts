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
 * Status Badge variant mappings for shadcn/ui Badge component
 */
export const appointmentStatusVariants = {
  scheduled: 'info',
  confirmed: 'success',
  'in-progress': 'warning',
  completed: 'secondary',
  cancelled: 'error',
  'no-show': 'error',
} as const;

/**
 * Priority Badge variant mappings for shadcn/ui Badge component
 */
export const appointmentPriorityVariants = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
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
   * Get status badge variant for shadcn/ui Badge component
   */
  getStatusVariant: (status: Appointment['status']): 'info' | 'success' | 'warning' | 'secondary' | 'error' | 'default' => {
    return appointmentStatusVariants[status] || appointmentStatusVariants.scheduled;
  },

  /**
   * Get priority badge variant for shadcn/ui Badge component
   */
  getPriorityVariant: (priority: Appointment['priority']): 'secondary' | 'info' | 'warning' | 'error' | 'default' => {
    return appointmentPriorityVariants[priority] || appointmentPriorityVariants.medium;
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
