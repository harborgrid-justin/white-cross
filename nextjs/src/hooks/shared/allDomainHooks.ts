/**
 * Comprehensive Domain-Specific Redux Hooks
 *
 * Specialized hooks for all domain slices in the application.
 * These hooks provide convenient access to domain-specific state and actions.
 *
 * @module allDomainHooks
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';
import { useAppSelector } from './index';

// Import all slice exports
import {
  usersActions,
  usersThunks,
  usersSelectors,
  selectUsersByRole,
  selectActiveUsers,
  selectUsersBySchool,
  selectUsersByDistrict,
} from '../slices/usersSlice';

import {
  studentsActions,
  studentsThunks,
  studentsSelectors,
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsByNurse,
  selectStudentsWithAllergies,
  selectStudentsWithMedications,
  selectStudentByNumber,
} from '../slices/studentsSlice';

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
  selectAppointmentsByDate,
} from '../slices/appointmentsSlice';

import {
  emergencyContactsActions,
  emergencyContactsThunks,
  emergencyContactsSelectors,
  selectContactsByStudent,
  selectPrimaryContacts,
} from '../slices/emergencyContactsSlice';

import {
  documentsActions,
  documentsThunks,
  documentsSelectors,
  selectDocumentsByStudent,
  selectDocumentsByType,
} from '../slices/documentsSlice';

import {
  communicationActions,
  communicationThunks,
  communicationSelectors,
  selectUnreadMessages,
  selectMessagesByThread,
} from '../slices/communicationSlice';

import {
  inventoryActions,
  inventoryThunks,
  inventorySelectors,
  selectLowStockItems,
  selectExpiredItems,
} from '../slices/inventorySlice';

import {
  reportsActions,
  reportsThunks,
  reportsSelectors,
  selectReportsByType,
  selectRecentReports,
} from '../slices/reportsSlice';

import {
  settingsActions,
  settingsThunks,
  settingsSelectors,
} from '../slices/settingsSlice';

import {
  districtsActions,
  districtsThunks,
  districtsSelectors,
  selectActiveDistricts,
} from '../slices/districtsSlice';

import {
  schoolsActions,
  schoolsThunks,
  schoolsSelectors,
  selectSchoolsByDistrict,
  selectActiveSchools,
} from '../slices/schoolsSlice';

// =====================
// USERS HOOKS
// =====================

/**
 * Hook that provides all user management actions
 */
export const useUsersActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(usersThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(usersThunks.fetchById(id)),
    create: (data: any) => dispatch(usersThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(usersThunks.update(params)),
    delete: (id: string) => dispatch(usersThunks.delete(id)),
    bulkDelete: (ids: string[]) => dispatch(usersActions.bulkDelete(ids)),
  };
};

/**
 * Hook to get all users from state
 */
export const useUsers = () => useAppSelector((state) => usersSelectors.selectAll(state));

/**
 * Hook to get user by ID
 */
export const useUserById = (id: string) => useAppSelector((state) => usersSelectors.selectById(state, id));

/**
 * Hook to get users by role
 */
export const useUsersByRole = (role: string) => useAppSelector((state) => selectUsersByRole(state, role));

/**
 * Hook to get active users
 */
export const useActiveUsers = () => useAppSelector((state) => selectActiveUsers(state));

// =====================
// STUDENTS HOOKS
// =====================

/**
 * Hook that provides all student management actions
 */
export const useStudentsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(studentsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(studentsThunks.fetchById(id)),
    create: (data: any) => dispatch(studentsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(studentsThunks.update(params)),
    delete: (id: string) => dispatch(studentsThunks.delete(id)),
    bulkDelete: (ids: string[]) => dispatch(studentsActions.bulkDelete(ids)),
  };
};

/**
 * Hook to get all students from state
 */
export const useStudents = () => useAppSelector((state) => studentsSelectors.selectAll(state));

/**
 * Hook to get student by ID
 */
export const useStudentById = (id: string) => useAppSelector((state) => studentsSelectors.selectById(state, id));

/**
 * Hook to get active students
 */
export const useActiveStudents = () => useAppSelector((state) => selectActiveStudents(state));

/**
 * Hook to get students by grade
 */
export const useStudentsByGrade = (grade: string) => useAppSelector((state) => selectStudentsByGrade(state, grade));

/**
 * Hook to get students with allergies
 */
export const useStudentsWithAllergies = () => useAppSelector((state) => selectStudentsWithAllergies(state));

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

// =====================
// EMERGENCY CONTACTS HOOKS
// =====================

/**
 * Hook that provides all emergency contacts actions
 */
export const useEmergencyContactsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(emergencyContactsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(emergencyContactsThunks.fetchById(id)),
    create: (data: any) => dispatch(emergencyContactsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(emergencyContactsThunks.update(params)),
    delete: (id: string) => dispatch(emergencyContactsThunks.delete(id)),
  };
};

/**
 * Hook to get all emergency contacts
 */
export const useEmergencyContacts = () => useAppSelector((state) => emergencyContactsSelectors.selectAll(state));

/**
 * Hook to get emergency contacts by student
 */
export const useContactsByStudent = (studentId: string) =>
  useAppSelector((state) => selectContactsByStudent(state, studentId));

// =====================
// DOCUMENTS HOOKS
// =====================

/**
 * Hook that provides all document actions
 */
export const useDocumentsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(documentsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(documentsThunks.fetchById(id)),
    create: (data: any) => dispatch(documentsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(documentsThunks.update(params)),
    delete: (id: string) => dispatch(documentsThunks.delete(id)),
  };
};

/**
 * Hook to get all documents
 */
export const useDocuments = () => useAppSelector((state) => documentsSelectors.selectAll(state));

/**
 * Hook to get documents by student
 */
export const useDocumentsByStudent = (studentId: string) =>
  useAppSelector((state) => selectDocumentsByStudent(state, studentId));

// =====================
// COMMUNICATION HOOKS
// =====================

/**
 * Hook that provides all communication actions
 */
export const useCommunicationActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(communicationThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(communicationThunks.fetchById(id)),
    create: (data: any) => dispatch(communicationThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(communicationThunks.update(params)),
    delete: (id: string) => dispatch(communicationThunks.delete(id)),
  };
};

/**
 * Hook to get all messages
 */
export const useMessages = () => useAppSelector((state) => communicationSelectors.selectAll(state));

/**
 * Hook to get unread messages
 */
export const useUnreadMessages = () => useAppSelector((state) => selectUnreadMessages(state));

// =====================
// INVENTORY HOOKS
// =====================

/**
 * Hook that provides all inventory actions
 */
export const useInventoryActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(inventoryThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(inventoryThunks.fetchById(id)),
    create: (data: any) => dispatch(inventoryThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(inventoryThunks.update(params)),
    delete: (id: string) => dispatch(inventoryThunks.delete(id)),
  };
};

/**
 * Hook to get all inventory items
 */
export const useInventoryItems = () => useAppSelector((state) => inventorySelectors.selectAll(state));

/**
 * Hook to get low stock items
 */
export const useLowStockItems = () => useAppSelector((state) => selectLowStockItems(state));

/**
 * Hook to get expired items
 */
export const useExpiredItems = () => useAppSelector((state) => selectExpiredItems(state));

// =====================
// REPORTS HOOKS
// =====================

/**
 * Hook that provides all reports actions
 */
export const useReportsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(reportsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(reportsThunks.fetchById(id)),
    create: (data: any) => dispatch(reportsThunks.create(data)),
  };
};

/**
 * Hook to get all reports
 */
export const useReports = () => useAppSelector((state) => reportsSelectors.selectAll(state));

// =====================
// SETTINGS HOOKS
// =====================

/**
 * Hook that provides all settings actions
 */
export const useSettingsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(settingsThunks.fetchAll(params)),
    update: (params: { id: string; data: any }) => dispatch(settingsThunks.update(params)),
  };
};

/**
 * Hook to get all settings
 */
export const useSettings = () => useAppSelector((state) => settingsSelectors.selectAll(state));

// =====================
// DISTRICTS HOOKS
// =====================

/**
 * Hook that provides all district actions
 */
export const useDistrictsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(districtsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(districtsThunks.fetchById(id)),
    create: (data: any) => dispatch(districtsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(districtsThunks.update(params)),
    delete: (id: string) => dispatch(districtsThunks.delete(id)),
  };
};

/**
 * Hook to get all districts
 */
export const useDistricts = () => useAppSelector((state) => districtsSelectors.selectAll(state));

/**
 * Hook to get active districts
 */
export const useActiveDistricts = () => useAppSelector((state) => selectActiveDistricts(state));

// =====================
// SCHOOLS HOOKS
// =====================

/**
 * Hook that provides all school actions
 */
export const useSchoolsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(schoolsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(schoolsThunks.fetchById(id)),
    create: (data: any) => dispatch(schoolsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(schoolsThunks.update(params)),
    delete: (id: string) => dispatch(schoolsThunks.delete(id)),
  };
};

/**
 * Hook to get all schools
 */
export const useSchools = () => useAppSelector((state) => schoolsSelectors.selectAll(state));

/**
 * Hook to get schools by district
 */
export const useSchoolsByDistrict = (districtId: string) =>
  useAppSelector((state) => selectSchoolsByDistrict(state, districtId));

/**
 * Hook to get active schools
 */
export const useActiveSchools = () => useAppSelector((state) => selectActiveSchools(state));
