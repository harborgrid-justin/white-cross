/**
 * Users and Students Domain Hooks
 *
 * Specialized hooks for user and student management.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';
import { useAppSelector } from './index';

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
