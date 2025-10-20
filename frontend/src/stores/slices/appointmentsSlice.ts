/**
 * Appointments Slice
 * 
 * Redux slice for managing student appointments using the slice factory.
 * Handles CRUD operations for appointment scheduling and management.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { Appointment } from '../../types/student.types';
import { appointmentsApi } from '../../services/api';

// Appointment creation data
interface CreateAppointmentData {
  studentId: string;
  nurseId: string;
  scheduledAt: string;
  duration: number;
  type: string;
  reason?: string;
  notes?: string;
}

// Appointment update data
interface UpdateAppointmentData {
  scheduledAt?: string;
  duration?: number;
  type?: string;
  reason?: string;
  status?: string;
  notes?: string;
}

// Appointment filters
interface AppointmentFilters {
  studentId?: string;
  nurseId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Create API service adapter for appointments
const appointmentsApiService: EntityApiService<Appointment, CreateAppointmentData, UpdateAppointmentData> = {
  async getAll(params?: AppointmentFilters) {
    const response = await appointmentsApi.getAll(params);
    return {
      data: response.data?.appointments || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await appointmentsApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateAppointmentData) {
    const response = await appointmentsApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateAppointmentData) {
    const response = await appointmentsApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await appointmentsApi.delete(id);
    return { success: true };
  },
};

// Create the appointments slice using the entity factory
const appointmentsSliceFactory = createEntitySlice<Appointment, CreateAppointmentData, UpdateAppointmentData>(
  'appointments',
  appointmentsApiService,
  {
    enableBulkOperations: false,
  }
);

// Export the slice and its components
export const appointmentsSlice = appointmentsSliceFactory.slice;
export const appointmentsReducer = appointmentsSlice.reducer;
export const appointmentsActions = appointmentsSliceFactory.actions;
export const appointmentsSelectors = appointmentsSliceFactory.adapter.getSelectors((state: any) => state.appointments);
export const appointmentsThunks = appointmentsSliceFactory.thunks;

// Export custom selectors
export const selectAppointmentsByStudent = (state: any, studentId: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.studentId === studentId);
};

export const selectAppointmentsByNurse = (state: any, nurseId: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.nurseId === nurseId);
};

export const selectAppointmentsByStatus = (state: any, status: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.status === status);
};

export const selectTodaysAppointments = (state: any): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  return allAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduledAt);
    return appointmentDate >= todayStart && appointmentDate < todayEnd;
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
};

export const selectUpcomingAppointments = (state: any, days: number = 7): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return allAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduledAt);
    return appointmentDate >= now && appointmentDate <= futureDate;
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
};

export const selectAppointmentsByType = (state: any, type: string): Appointment[] => {
  const allAppointments = appointmentsSelectors.selectAll(state) as Appointment[];
  return allAppointments.filter(appointment => appointment.type === type);
};
