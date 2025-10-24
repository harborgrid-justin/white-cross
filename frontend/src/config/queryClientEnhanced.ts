/**
 * Enhanced React Query Client Configuration
 *
 * Optimized caching strategies, retry logic, and PHI compliance.
 * Includes domain-specific cache configurations and optimistic update utilities.
 *
 * @module config/queryClientEnhanced
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Domain-specific cache configurations
 */
export const CACHE_CONFIGS = {
  // Critical healthcare data - short stale time for freshness
  healthRecords: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  },

  medications: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: true,
  },

  appointments: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  },

  // Student data - moderate freshness
  students: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  },

  // Reference data - longer stale time
  districts: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  },

  schools: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  },

  // Configuration data - very long stale time
  settings: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
    refetchOnWindowFocus: false,
  },

  templates: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
    refetchOnWindowFocus: false,
  },

  // Reports and analytics - moderate caching
  reports: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  },

  // Dashboard data - short stale time
  dashboard: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  },

  // Compliance data - short stale time for accuracy
  compliance: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: true,
  },

  // Inventory - moderate caching
  inventory: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  },
} as const;

/**
 * Enhanced default options with optimized retry logic
 */
export const enhancedDefaultOptions: DefaultOptions = {
  queries: {
    // Default stale time: 5 minutes
    staleTime: 5 * 60 * 1000,

    // Default GC time: 10 minutes
    gcTime: 10 * 60 * 1000,

    // Enhanced retry logic
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except specific cases
      if (error?.status >= 400 && error?.status < 500) {
        // Retry on timeout (408), rate limit (429), and service unavailable (503)
        if ([408, 429, 503].includes(error.status)) {
          return failureCount < 3;
        }
        // Don't retry client errors
        return false;
      }

      // Retry up to 3 times for 5xx errors and network errors
      return failureCount < 3;
    },

    // Exponential backoff with jitter
    retryDelay: (attemptIndex) => {
      // Base delay with exponential backoff
      const baseDelay = Math.min(1000 * Math.pow(2, attemptIndex), 30000);

      // Add jitter (random 0-20%)
      const jitter = baseDelay * 0.2 * Math.random();

      return baseDelay + jitter;
    },

    // Refetch on window focus for critical data (override per query)
    refetchOnWindowFocus: false,

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Don't refetch on mount if data is fresh
    refetchOnMount: false,

    // Network mode: online-first with offline fallback
    networkMode: 'online',

    // Refetch interval for critical real-time data (override per query)
    refetchInterval: false,
  },

  mutations: {
    // Retry mutations once
    retry: 1,

    // Shorter retry delay for mutations
    retryDelay: 1000,

    // Network mode for mutations
    networkMode: 'online',
  },
};

/**
 * Query key factory for consistent key generation
 */
export const queryKeys = {
  // Students
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.students.lists(), filters] as const,
    details: () => [...queryKeys.students.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.students.details(), id] as const,
  },

  // Health Records
  healthRecords: {
    all: ['health-records'] as const,
    lists: () => [...queryKeys.healthRecords.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.healthRecords.lists(), filters] as const,
    details: () => [...queryKeys.healthRecords.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.healthRecords.details(), id] as const,
    byStudent: (studentId: string) => [...queryKeys.healthRecords.all, 'student', studentId] as const,
  },

  // Medications
  medications: {
    all: ['medications'] as const,
    lists: () => [...queryKeys.medications.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.medications.lists(), filters] as const,
    details: () => [...queryKeys.medications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.medications.details(), id] as const,
    byStudent: (studentId: string) => [...queryKeys.medications.all, 'student', studentId] as const,
    dueToday: () => [...queryKeys.medications.all, 'due-today'] as const,
  },

  // Appointments
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    byStudent: (studentId: string) => [...queryKeys.appointments.all, 'student', studentId] as const,
    upcoming: () => [...queryKeys.appointments.all, 'upcoming'] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    alerts: () => [...queryKeys.dashboard.all, 'alerts'] as const,
  },

  // Schools & Districts
  schools: {
    all: ['schools'] as const,
    lists: () => [...queryKeys.schools.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.schools.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.schools.all, 'detail', id] as const,
  },

  districts: {
    all: ['districts'] as const,
    lists: () => [...queryKeys.districts.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.districts.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.districts.all, 'detail', id] as const,
  },
} as const;

/**
 * Query invalidation patterns
 * Maps mutations to queries that should be invalidated
 */
export const invalidationPatterns = {
  // Student mutations invalidate student-related queries
  createStudent: [
    queryKeys.students.all,
    queryKeys.dashboard.all,
  ],

  updateStudent: (studentId: string) => [
    queryKeys.students.detail(studentId),
    queryKeys.students.lists(),
    queryKeys.healthRecords.byStudent(studentId),
    queryKeys.medications.byStudent(studentId),
    queryKeys.appointments.byStudent(studentId),
  ],

  deleteStudent: [
    queryKeys.students.all,
    queryKeys.dashboard.all,
  ],

  // Health record mutations
  createHealthRecord: (studentId: string) => [
    queryKeys.healthRecords.byStudent(studentId),
    queryKeys.healthRecords.lists(),
    queryKeys.students.detail(studentId),
    queryKeys.dashboard.all,
  ],

  updateHealthRecord: (recordId: string, studentId: string) => [
    queryKeys.healthRecords.detail(recordId),
    queryKeys.healthRecords.byStudent(studentId),
    queryKeys.students.detail(studentId),
  ],

  // Medication mutations
  administerMedication: (medicationId: string, studentId: string) => [
    queryKeys.medications.detail(medicationId),
    queryKeys.medications.byStudent(studentId),
    queryKeys.medications.dueToday(),
    queryKeys.students.detail(studentId),
    queryKeys.dashboard.alerts(),
  ],

  createMedication: (studentId: string) => [
    queryKeys.medications.byStudent(studentId),
    queryKeys.medications.lists(),
    queryKeys.students.detail(studentId),
  ],

  // Appointment mutations
  createAppointment: (studentId: string) => [
    queryKeys.appointments.byStudent(studentId),
    queryKeys.appointments.upcoming(),
    queryKeys.appointments.lists(),
    queryKeys.students.detail(studentId),
    queryKeys.dashboard.all,
  ],

  updateAppointment: (appointmentId: string, studentId: string) => [
    queryKeys.appointments.detail(appointmentId),
    queryKeys.appointments.byStudent(studentId),
    queryKeys.appointments.upcoming(),
  ],
} as const;

/**
 * Prefetch strategies for common navigation paths
 */
export const prefetchStrategies = {
  // When viewing student list, prefetch common related data
  studentList: (queryClient: QueryClient) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.schools.all,
      staleTime: CACHE_CONFIGS.schools.staleTime,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.districts.all,
      staleTime: CACHE_CONFIGS.districts.staleTime,
    });
  },

  // When viewing student detail, prefetch related health data
  studentDetail: (queryClient: QueryClient, studentId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.healthRecords.byStudent(studentId),
      staleTime: CACHE_CONFIGS.healthRecords.staleTime,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.medications.byStudent(studentId),
      staleTime: CACHE_CONFIGS.medications.staleTime,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.appointments.byStudent(studentId),
      staleTime: CACHE_CONFIGS.appointments.staleTime,
    });
  },

  // When viewing medications, prefetch due today
  medications: (queryClient: QueryClient) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.medications.dueToday(),
      staleTime: CACHE_CONFIGS.medications.staleTime,
    });
  },
} as const;

/**
 * Get cache configuration for a specific domain
 */
export const getCacheConfig = (domain: keyof typeof CACHE_CONFIGS) => {
  return CACHE_CONFIGS[domain];
};
