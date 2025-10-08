import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../services/api';
import type { Student, StudentFilters } from '../services/modules/studentsApi';

export interface UseStudentsReturn {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching students data from the API
 * Provides students list with optional filtering
 */
export const useStudents = (filters?: StudentFilters): UseStudentsReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsApi.getAll(filters),
  });

  // Extract students from paginated response
  const students = data?.data || [];

  return {
    students,
    isLoading,
    error: error as Error | null,
  };
};

/**
 * Hook for searching students by query
 */
export const useStudentSearch = (query: string): UseStudentsReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['students-search', query],
    queryFn: () => studentsApi.search(query),
    enabled: query.trim().length > 0,
  });

  return {
    students: data || [],
    isLoading,
    error: error as Error | null,
  };
};
