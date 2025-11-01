'use client';

/**
 * WF-HOOK-001 | useStudentAllergies.ts - Student Allergies Data Hook
 * Purpose: Fetch and manage student allergy data for safety checks
 * Upstream: Student API | Dependencies: React Query
 * Downstream: AllergyAlertBanner, AdministrationForm
 * Related: useStudentPhoto, medication safety features
 * Exports: useStudentAllergies hook
 * Last Updated: 2025-10-27 | File Type: .ts
 */

import { useQuery } from '@tanstack/react-query';
import type { Allergy } from '@/components/medications/safety/AllergyAlertBanner';

interface UseStudentAllergiesOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export const useStudentAllergies = (
  studentId: string | undefined,
  options: UseStudentAllergiesOptions = {}
) => {
  const { enabled = true, refetchOnMount = true } = options;

  const query = useQuery<Allergy[], Error>({
    queryKey: ['student', studentId, 'allergies'],
    queryFn: async () => {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      // Fetch allergies from API
      const response = await fetch(`/api/students/${studentId}/allergies`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student allergies');
      }

      const data = await response.json();
      return data.allergies || [];
    },
    enabled: enabled && !!studentId,
    refetchOnMount,
    staleTime: 5 * 60 * 1000, // 5 minutes - allergies don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 2, // Retry twice on failure (critical data)
  });

  return {
    allergies: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || null,
    refetch: query.refetch,
    hasAllergies: (query.data?.length || 0) > 0,
    hasSevereAllergies:
      query.data?.some((a) => a.severity === 'severe') || false,
  };
};

export default useStudentAllergies;
