/**
 * Students Slice
 * 
 * Redux slice for managing student entities using the slice factory.
 * Handles CRUD operations for students with health records integration.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { Student, CreateStudentData, UpdateStudentData, StudentFilters } from '../../types/student.types';
import { studentsApi } from '../../services/api';

// Create API service adapter for students
const studentsApiService: EntityApiService<Student, CreateStudentData, UpdateStudentData> = {
  async getAll(params?: StudentFilters) {
    const response = await studentsApi.getAll(params);
    return {
      data: response.data?.students || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await studentsApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateStudentData) {
    const response = await studentsApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateStudentData) {
    const response = await studentsApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await studentsApi.delete(id);
    return { success: true };
  },
};

// Create the students slice using the factory
const studentsSliceFactory = createEntitySlice<Student, CreateStudentData, UpdateStudentData>(
  'students',
  studentsApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const studentsSlice = studentsSliceFactory.slice;
export const studentsReducer = studentsSlice.reducer;
export const studentsActions = studentsSliceFactory.actions;
export const studentsSelectors = studentsSliceFactory.adapter.getSelectors((state: any) => state.students);
export const studentsThunks = studentsSliceFactory.thunks;

// Export custom selectors
export const selectActiveStudents = (state: any): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.isActive);
};

export const selectStudentsByGrade = (state: any, grade: string): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.grade === grade);
};

export const selectStudentsByNurse = (state: any, nurseId: string): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.nurseId === nurseId);
};

export const selectStudentsWithAllergies = (state: any): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.allergies && student.allergies.length > 0);
};

export const selectStudentsWithMedications = (state: any): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.medications && student.medications.length > 0);
};

export const selectStudentByNumber = (state: any, studentNumber: string): Student | undefined => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.find(student => student.studentNumber === studentNumber);
};
