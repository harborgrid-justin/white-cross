/**
 * Students Slice
 * 
 * Redux slice for managing student entities and UI state using the slice factory.
 * Handles CRUD operations for students with health records integration and UI concerns.
 */

import { createSlice, createEntitySlice, EntityApiService, PayloadAction } from '@reduxjs/toolkit';
import { Student, CreateStudentData, UpdateStudentData, StudentFilters } from '../../types/student.types';
import { studentsApi } from '../../services/api';

// UI State types
export interface StudentUIState {
  selectedIds: string[];
  viewMode: 'grid' | 'list' | 'table';
  filters: StudentFilters;
  sortBy: 'name' | 'grade' | 'enrollmentDate' | 'lastVisit';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  showInactive: boolean;
  bulkSelectMode: boolean;
  expandedCards: string[];
  pageSize: number;
  currentPage: number;
}

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

// Initial UI state
const initialUIState: StudentUIState = {
  selectedIds: [],
  viewMode: 'table',
  filters: {},
  sortBy: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  showInactive: false,
  bulkSelectMode: false,
  expandedCards: [],
  pageSize: 20,
  currentPage: 1,
};

// Create UI state slice
const studentUISlice = createSlice({
  name: 'studentUI',
  initialState: initialUIState,
  reducers: {
    // Selection management
    selectStudent: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },
    deselectStudent: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    selectMultipleStudents: (state, action: PayloadAction<string[]>) => {
      const newIds = action.payload.filter(id => !state.selectedIds.includes(id));
      state.selectedIds.push(...newIds);
    },
    selectAllStudents: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    toggleBulkSelectMode: (state) => {
      state.bulkSelectMode = !state.bulkSelectMode;
      if (!state.bulkSelectMode) {
        state.selectedIds = [];
      }
    },

    // View management
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'table'>) => {
      state.viewMode = action.payload;
    },
    toggleCardExpansion: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      if (state.expandedCards.includes(studentId)) {
        state.expandedCards = state.expandedCards.filter(id => id !== studentId);
      } else {
        state.expandedCards.push(studentId);
      }
    },
    collapseAllCards: (state) => {
      state.expandedCards = [];
    },

    // Filter management
    setFilters: (state, action: PayloadAction<Partial<StudentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    toggleShowInactive: (state) => {
      state.showInactive = !state.showInactive;
      state.currentPage = 1;
    },

    // Sorting
    setSorting: (state, action: PayloadAction<{ sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },

    // Reset all UI state
    resetUIState: () => initialUIState,
  },
});

// Combine entity slice and UI slice
const combinedStudentsSlice = createSlice({
  name: 'students',
  initialState: {
    ...studentsSliceFactory.slice.getInitialState(),
    ui: initialUIState,
  },
  reducers: {
    ...studentsSliceFactory.slice.actions,
    ...studentUISlice.actions,
  },
  extraReducers: (builder) => {
    // Copy all extra reducers from the entity slice
    const entitySliceReducers = studentsSliceFactory.slice.reducer;
    builder.addMatcher(
      (action) => action.type.startsWith('students/'),
      (state, action) => {
        const entityState = entitySliceReducers(
          { ...state, ui: undefined } as any,
          action
        );
        return {
          ...entityState,
          ui: state.ui,
        };
      }
    );
  },
});

// Export the slice and its components
export const studentsSlice = combinedStudentsSlice;
export const studentsReducer = combinedStudentsSlice.reducer;
export const studentsActions = {
  ...studentsSliceFactory.actions,
  ...studentUISlice.actions,
};
export const studentsSelectors = studentsSliceFactory.adapter.getSelectors((state: any) => state.students);
export const studentsThunks = studentsSliceFactory.thunks;

// Export UI state selectors
export const selectStudentUIState = (state: any): StudentUIState => state.students.ui;
export const selectSelectedStudentIds = (state: any): string[] => state.students.ui.selectedIds;
export const selectStudentViewMode = (state: any): StudentUIState['viewMode'] => state.students.ui.viewMode;
export const selectStudentFilters = (state: any): StudentFilters => state.students.ui.filters;
export const selectStudentSort = (state: any) => ({
  sortBy: state.students.ui.sortBy,
  sortOrder: state.students.ui.sortOrder,
});
export const selectStudentPagination = (state: any) => ({
  currentPage: state.students.ui.currentPage,
  pageSize: state.students.ui.pageSize,
});
export const selectStudentSearchQuery = (state: any): string => state.students.ui.searchQuery;
export const selectShowInactiveStudents = (state: any): boolean => state.students.ui.showInactive;
export const selectIsBulkSelectMode = (state: any): boolean => state.students.ui.bulkSelectMode;
export const selectExpandedStudentCards = (state: any): string[] => state.students.ui.expandedCards;

// Export enhanced selectors that combine entity and UI state
export const selectFilteredAndSortedStudents = (state: any): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  const { filters, searchQuery, showInactive, sortBy, sortOrder } = state.students.ui;
  
  let filteredStudents = allStudents;

  // Apply activity filter
  if (!showInactive) {
    filteredStudents = filteredStudents.filter(student => student.isActive);
  }

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredStudents = filteredStudents.filter(student => 
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      student.studentNumber.toLowerCase().includes(query) ||
      student.grade.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.grade) {
    filteredStudents = filteredStudents.filter(student => student.grade === filters.grade);
  }
  if (filters.nurseId) {
    filteredStudents = filteredStudents.filter(student => student.nurseId === filters.nurseId);
  }
  if (filters.hasAllergies !== undefined) {
    filteredStudents = filteredStudents.filter(student => 
      filters.hasAllergies ? (student.allergies && student.allergies.length > 0) : 
                            !(student.allergies && student.allergies.length > 0)
    );
  }
  if (filters.hasMedications !== undefined) {
    filteredStudents = filteredStudents.filter(student => 
      filters.hasMedications ? (student.medications && student.medications.length > 0) : 
                              !(student.medications && student.medications.length > 0)
    );
  }

  // Apply sorting
  filteredStudents.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = `${a.lastName}, ${a.firstName}`;
        bValue = `${b.lastName}, ${b.firstName}`;
        break;
      case 'grade':
        aValue = a.grade;
        bValue = b.grade;
        break;
      case 'enrollmentDate':
        aValue = new Date(a.enrollmentDate);
        bValue = new Date(b.enrollmentDate);
        break;
      case 'lastVisit':
        // Get most recent appointment date as last visit
        aValue = a.appointments && a.appointments.length > 0 
          ? new Date(Math.max(...a.appointments.map(apt => new Date(apt.scheduledAt).getTime())))
          : new Date(0);
        bValue = b.appointments && b.appointments.length > 0 
          ? new Date(Math.max(...b.appointments.map(apt => new Date(apt.scheduledAt).getTime())))
          : new Date(0);
        break;
      default:
        aValue = a.lastName;
        bValue = b.lastName;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filteredStudents;
};

export const selectPaginatedStudents = (state: any): Student[] => {
  const filteredStudents = selectFilteredAndSortedStudents(state);
  const { currentPage, pageSize } = state.students.ui;
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return filteredStudents.slice(startIndex, endIndex);
};

export const selectStudentPaginationInfo = (state: any) => {
  const totalStudents = selectFilteredAndSortedStudents(state).length;
  const { currentPage, pageSize } = state.students.ui;
  
  return {
    totalStudents,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalStudents / pageSize),
    hasNextPage: currentPage * pageSize < totalStudents,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, totalStudents),
  };
};

export const selectSelectedStudents = (state: any): Student[] => {
  const selectedIds = state.students.ui.selectedIds;
  return selectedIds.map((id: string) => studentsSelectors.selectById(state, id)).filter(Boolean);
};

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
