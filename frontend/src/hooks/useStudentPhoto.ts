/**
 * Student Photo Hook
 * Provides student photo URL management
 */

'use client';

import { useQuery } from '@tanstack/react-query';

export interface StudentPhoto {
  studentId: string;
  photoUrl: string;
  uploadedAt: string;
}

export function useStudentPhoto(studentId: string) {
  return useQuery({
    queryKey: ['student-photo', studentId],
    queryFn: async (): Promise<StudentPhoto | null> => {
      const response = await fetch(`/api/students/${studentId}/photo`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch student photo');
      }
      return response.json();
    },
    enabled: !!studentId,
  });
}
