/**
 * Student Allergies Hook
 * Provides student allergy data management
 */

'use client';

import { useQuery } from '@tanstack/react-query';

export interface StudentAllergy {
  id: string;
  studentId: string;
  allergen: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction?: string;
  treatment?: string;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export function useStudentAllergies(studentId: string) {
  return useQuery({
    queryKey: ['student-allergies', studentId],
    queryFn: async (): Promise<StudentAllergy[]> => {
      const response = await fetch(`/api/students/${studentId}/allergies`);
      if (!response.ok) throw new Error('Failed to fetch student allergies');
      return response.json();
    },
    enabled: !!studentId,
  });
}
