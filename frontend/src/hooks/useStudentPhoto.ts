'use client';

/**
 * WF-HOOK-002 | useStudentPhoto.ts - Student Photo Data Hook
 * Purpose: Fetch student photo for patient verification
 * Upstream: Student API | Dependencies: React Query
 * Downstream: StudentPhotoVerification, AdministrationForm
 * Related: useStudentAllergies, medication safety features
 * Exports: useStudentPhoto hook
 * Last Updated: 2025-10-27 | File Type: .ts
 */

import { useQuery } from '@tanstack/react-query';

interface StudentPhotoData {
  studentId: string;
  photoUrl: string | null;
  name: string;
  dateOfBirth: string;
  studentIdNumber?: string;
}

interface UseStudentPhotoOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export const useStudentPhoto = (
  studentId: string | undefined,
  options: UseStudentPhotoOptions = {}
) => {
  const { enabled = true, refetchOnMount = false } = options;

  const query = useQuery<StudentPhotoData, Error>({
    queryKey: ['student', studentId, 'photo'],
    queryFn: async () => {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      // Fetch student photo and basic info from API
      const response = await fetch(`/api/students/${studentId}/photo`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student photo');
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!studentId,
    refetchOnMount,
    staleTime: 30 * 60 * 1000, // 30 minutes - photos don't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour cache
    retry: 1, // Retry once (non-critical data - can use fallback)
  });

  return {
    photoUrl: query.data?.photoUrl || null,
    studentName: query.data?.name || '',
    dateOfBirth: query.data?.dateOfBirth || '',
    studentIdNumber: query.data?.studentIdNumber,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
    hasPhoto: !!query.data?.photoUrl,
  };
};

export default useStudentPhoto;
