/**
 * Health Management Domain Hooks
 *
 * Specialized hooks for health records, medications, and appointments.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';
import { useAppSelector } from './store-hooks-index';

import {
  healthRecordsActions,
  healthRecordsThunks,
  healthRecordsSelectors,
  selectHealthRecordsByStudent,
  selectHealthRecordsByType,
  selectRecentHealthRecords,
} from '../slices/healthRecordsSlice';

import {
  medicationsActions,
  medicationsThunks,
  medicationsSelectors,
  selectActiveMedications,
  selectMedicationsByStudent,
  selectMedicationsDueToday,
} from '../slices/medicationsSlice';

import {
  appointmentsActions,
  appointmentsThunks,
  appointmentsSelectors,
  selectUpcomingAppointments,
  selectAppointmentsByStudent,
} from '../slices/appointments';

// =====================
// HEALTH RECORDS HOOKS
// =====================

/**
 * Hook that provides all health records actions
 */
export const useHealthRecordsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(healthRecordsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(healthRecordsThunks.fetchById(id)),
    create: (data: any) => dispatch(healthRecordsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(healthRecordsThunks.update(params)),
    delete: (id: string) => dispatch(healthRecordsThunks.delete(id)),
  };
};

/**
 * Hook to get all health records
 */
export const useHealthRecords = () => useAppSelector((state) => healthRecordsSelectors.selectAll(state));

/**
 * Hook to get health records by student
 */
export const useHealthRecordsByStudent = (studentId: string) =>
  useAppSelector((state) => selectHealthRecordsByStudent(state, studentId));

// =====================
// MEDICATIONS HOOKS
// =====================

/**
 * Hook that provides all medication actions
 */
export const useMedicationsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(medicationsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(medicationsThunks.fetchById(id)),
    create: (data: any) => dispatch(medicationsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(medicationsThunks.update(params)),
    delete: (id: string) => dispatch(medicationsThunks.delete(id)),
  };
};

/**
 * Hook to get all medications
 */
export const useMedications = () => useAppSelector((state) => medicationsSelectors.selectAll(state));

/**
 * Hook to get active medications
 */
export const useActiveMedications = () => useAppSelector((state) => selectActiveMedications(state));

/**
 * Hook to get medications by student
 */
export const useMedicationsByStudent = (studentId: string) =>
  useAppSelector((state) => selectMedicationsByStudent(state, studentId));

/**
 * Hook to get medications due today
 */
export const useMedicationsDueToday = () => useAppSelector((state) => selectMedicationsDueToday(state));

// =====================
// APPOINTMENTS HOOKS
// =====================

/**
 * Hook that provides all appointment actions
 */
export const useAppointmentsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(appointmentsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(appointmentsThunks.fetchById(id)),
    create: (data: any) => dispatch(appointmentsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(appointmentsThunks.update(params)),
    delete: (id: string) => dispatch(appointmentsThunks.delete(id)),
  };
};

/**
 * Hook to get all appointments
 */
export const useAppointments = () => useAppSelector((state) => appointmentsSelectors.selectAll(state));

/**
 * Hook to get upcoming appointments
 */
export const useUpcomingAppointments = () => useAppSelector((state) => selectUpcomingAppointments(state));

/**
 * Hook to get appointments by student
 */
export const useAppointmentsByStudent = (studentId: string) =>
  useAppSelector((state) => selectAppointmentsByStudent(state, studentId));
