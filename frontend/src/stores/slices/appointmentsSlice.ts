/**
 * Appointments Slice
 * Manages appointments state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Appointment {
  id: string;
  studentId: string;
  type: string;
  date: string;
  time: string;
  provider: string;
  notes?: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: [],
  isLoading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export { appointmentsSlice };
export const appointmentsActions = appointmentsSlice.actions;
export const appointmentsThunks = {};
export const appointmentsSelectors = {
  selectAll: (state: any) => state.appointments.appointments,
  selectLoading: (state: any) => state.appointments.isLoading,
  selectError: (state: any) => state.appointments.error,
};

export const selectUpcomingAppointments = (state: any) =>
  state.appointments.appointments.filter((a: Appointment) => new Date(a.date) >= new Date());

export const selectAppointmentsByStudent = (studentId: string) => (state: any) =>
  state.appointments.appointments.filter((a: Appointment) => a.studentId === studentId);

export const selectAppointmentsByDate = (date: string) => (state: any) =>
  state.appointments.appointments.filter((a: Appointment) => a.date === date);

export default appointmentsSlice.reducer;
