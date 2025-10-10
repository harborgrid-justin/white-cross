# White Cross Healthcare Platform - Data Fetching Strategy

## Executive Summary

This document outlines the comprehensive data fetching strategy for the White Cross healthcare platform, designed to replace all mock data with proper API integration using TanStack Query (React Query). The strategy follows enterprise React best practices, HIPAA compliance requirements, and healthcare-critical data handling standards.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Principles](#core-principles)
3. [Query Key Strategy](#query-key-strategy)
4. [Hook Organization Structure](#hook-organization-structure)
5. [Module-by-Module Implementation](#module-by-module-implementation)
6. [Caching Strategy](#caching-strategy)
7. [Error Handling & Retry Logic](#error-handling--retry-logic)
8. [Security & Audit Logging](#security--audit-logging)
9. [Migration Plan](#migration-plan)
10. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (React Components using domain-specific hooks)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    HOOK LAYER (Domain Hooks)                 │
│  • useStudents, useMedications, useAppointments              │
│  • Domain-specific business logic                            │
│  • TanStack Query integration                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   API SERVICE LAYER                          │
│  • BaseApiService (CRUD operations)                          │
│  • Module-specific API services                              │
│  • Type-safe HTTP client (Axios)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                         │
│  • Express.js REST endpoints                                 │
│  • Prisma ORM                                                │
│  • PostgreSQL database                                       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **State Management**: TanStack Query v5 (React Query)
- **HTTP Client**: Axios with interceptors
- **Validation**: Zod schemas
- **Type Safety**: TypeScript strict mode
- **Caching**: TanStack Query cache + Redis (server-side)

---

## Core Principles

### 1. Healthcare Data Safety First

**Critical Safety Rules:**
- **NO** optimistic updates for medication administration
- **NO** caching for safety-critical operations (Five Rights verification)
- **ALWAYS** server-side validation for healthcare data
- **MANDATORY** audit logging for all PHI access
- **IMMEDIATE** error surfacing for healthcare operations

### 2. HIPAA Compliance

- All PHI access must be logged with user ID, timestamp, and action
- Automatic session timeout after inactivity
- Encrypted data transmission (HTTPS only)
- Role-based access control (RBAC) enforcement
- Data retention policies in cache configuration

### 3. Performance Optimization

- Aggressive caching for static data (formulary, categories)
- Conservative caching for dynamic data (patient schedules)
- Prefetching for predictable user flows
- Pagination for large datasets
- Request deduplication via TanStack Query

### 4. Developer Experience

- Consistent naming conventions across all modules
- Comprehensive TypeScript types
- Reusable patterns via factory functions
- Clear error messages with actionable context
- Self-documenting code structure

---

## Query Key Strategy

### Standardized Query Key Structure

```typescript
// Pattern: [module, operation, ...identifiers, ...filters]

// Examples:
['students', 'list', { grade: '5', isActive: true }]
['students', 'detail', studentId]
['students', 'search', searchQuery]

['medications', 'list', { category: 'analgesic' }]
['medications', 'detail', medicationId]
['medications', 'formulary', 'search', query]

['appointments', 'list', { date: '2025-10-10', nurseId: 'nurse123' }]
['appointments', 'detail', appointmentId]
['appointments', 'availability', { date: '2025-10-10', nurseId: 'nurse123' }]

// Safety-critical - always fresh
['medication-administration', 'session', sessionId]
['medication-administration', 'today', nurseId]
['medication-administration', 'reminders', 'overdue']
```

### Query Key Factory Pattern

```typescript
// Each module exports a query key factory
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters?: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  search: (query: string) => [...studentKeys.all, 'search', query] as const,
  assigned: (nurseId: string) => [...studentKeys.all, 'assigned', nurseId] as const,
  byGrade: (grade: string) => [...studentKeys.all, 'grade', grade] as const,
} as const;
```

### Benefits

1. **Type Safety**: TypeScript enforces correct key structure
2. **Consistency**: Same pattern across all modules
3. **Maintainability**: Easy to update cache invalidation logic
4. **Debugging**: Clear query identification in DevTools

---

## Hook Organization Structure

### Directory Structure

```
frontend/src/
├── hooks/                          # Domain-specific hooks (legacy)
│   └── [migrating to services/modules/*/hooks/]
│
├── services/
│   ├── core/                       # Reusable core services
│   │   ├── ApiClient.ts            # Axios wrapper
│   │   ├── BaseApiService.ts       # CRUD base class
│   │   └── QueryHooksFactory.ts    # Hook generator
│   │
│   ├── modules/                    # Domain modules
│   │   ├── students/
│   │   │   ├── api/
│   │   │   │   ├── StudentsApi.ts
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useStudents.ts
│   │   │   │   ├── useStudentDetail.ts
│   │   │   │   ├── useStudentMutations.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── medication/             # Already implemented
│   │   │   ├── api/
│   │   │   │   ├── MedicationFormularyApi.ts
│   │   │   │   ├── AdministrationApi.ts
│   │   │   │   ├── PrescriptionApi.ts
│   │   │   │   └── index.ts
│   │   │   └── hooks/
│   │   │       ├── useMedicationFormulary.ts
│   │   │       ├── useMedicationAdministration.ts
│   │   │       ├── useOfflineQueue.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── appointments/
│   │   ├── health-records/
│   │   ├── emergency-contacts/
│   │   ├── incident-reports/
│   │   ├── inventory/
│   │   ├── compliance/
│   │   ├── communications/
│   │   ├── documents/
│   │   ├── reports/
│   │   └── access-control/
│   │
│   └── index.ts
```

---

## Module-by-Module Implementation

### 1. Student Management Module

#### Hook Structure

```typescript
// File: frontend/src/services/modules/students/hooks/useStudents.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api';
import { studentKeys } from '../queryKeys';
import type { Student, StudentFilters, CreateStudentDto, UpdateStudentDto } from '../types';

/**
 * Get paginated list of students with filtering
 *
 * Caching Strategy:
 * - staleTime: 5 minutes (student data changes moderately)
 * - gcTime: 10 minutes
 * - refetchOnWindowFocus: false (avoid unnecessary refetches)
 *
 * @example
 * const { data, isLoading, error } = useStudents({
 *   grade: '5',
 *   isActive: true
 * });
 */
export function useStudents(filters?: StudentFilters) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    select: (data) => ({
      students: data.data,
      pagination: data.pagination,
    }),
  });
}

/**
 * Get single student by ID with complete profile
 *
 * Caching Strategy:
 * - staleTime: 3 minutes (detailed data needs fresher updates)
 * - Prefetched from list views when possible
 *
 * Security:
 * - Logs access to student detail for audit trail
 */
export function useStudentDetail(id: string | undefined, options?: {
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: studentKeys.detail(id!),
    queryFn: async () => {
      const student = await studentsApi.getById(id!);

      // Audit log PHI access
      await auditApi.logAccess({
        resource: 'student',
        resourceId: id!,
        action: 'view_detail',
        timestamp: new Date().toISOString(),
      });

      return student;
    },
    enabled: !!id && (options?.enabled !== false),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Search students by name or student number
 *
 * Caching Strategy:
 * - Minimal caching (search results change frequently)
 * - Disabled until query is 2+ characters
 */
export function useStudentSearch(query: string) {
  return useQuery({
    queryKey: studentKeys.search(query),
    queryFn: () => studentsApi.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Get students assigned to current nurse
 *
 * Caching Strategy:
 * - Longer cache time (assignments change infrequently)
 * - Refetch on window focus for real-time updates
 */
export function useAssignedStudents() {
  return useQuery({
    queryKey: studentKeys.assigned('current'), // Uses current user context
    queryFn: () => studentsApi.getAssignedStudents(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
  });
}
```

#### Mutation Hooks

```typescript
// File: frontend/src/services/modules/students/hooks/useStudentMutations.ts

/**
 * Create new student with optimistic updates
 *
 * Security:
 * - Validates all required fields
 * - Audit logs student creation
 * - Invalidates student lists on success
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentsApi.create(data),
    onSuccess: (newStudent) => {
      // Invalidate all student lists
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Add to cache for instant access
      queryClient.setQueryData(
        studentKeys.detail(newStudent.id),
        newStudent
      );

      // Audit log
      auditApi.logAction({
        action: 'create_student',
        resourceId: newStudent.id,
        details: { studentNumber: newStudent.studentNumber },
      });
    },
    onError: (error: ApiClientError) => {
      // User-friendly error handling
      const message = error.code === 'DUPLICATE_STUDENT_NUMBER'
        ? 'Student number already exists'
        : 'Failed to create student. Please try again.';

      toast.error(message);
    },
  });
}

/**
 * Update student with optimistic updates
 *
 * Optimistic Updates:
 * - Enabled for non-critical fields
 * - Rollback on error
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
      studentsApi.update(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Optimistically update
      if (previous) {
        queryClient.setQueryData<Student>(
          studentKeys.detail(id),
          { ...previous, ...data }
        );
      }

      return { previous, id };
    },

    onSuccess: (updated, { id }) => {
      // Update cache with server response
      queryClient.setQueryData(studentKeys.detail(id), updated);

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      toast.success('Student updated successfully');
    },

    onError: (error, { id }, context) => {
      // Rollback optimistic update
      if (context?.previous) {
        queryClient.setQueryData(studentKeys.detail(id), context.previous);
      }

      toast.error('Failed to update student');
    },
  });
}

/**
 * Delete/deactivate student
 *
 * Safety:
 * - Confirmation required before deletion
 * - Soft delete (sets isActive = false)
 * - Comprehensive audit logging
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: studentKeys.detail(id) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      toast.success('Student deactivated successfully');
    },
  });
}

/**
 * Bulk import students from CSV/Excel
 *
 * Performance:
 * - No optimistic updates (too complex)
 * - Shows progress indicator
 * - Returns detailed error report
 */
export function useBulkImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (students: CreateStudentDto[]) =>
      studentsApi.bulkImport(students),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });

      toast.success(
        `Imported ${result.success} students. ${result.failed} failed.`
      );
    },
  });
}
```

---

### 2. Medication Management Module

**Already implemented** - Reference implementation in:
- `frontend/src/services/modules/medication/hooks/useMedicationFormulary.ts`
- `frontend/src/services/modules/medication/hooks/useMedicationAdministration.ts`

#### Key Features Demonstrated

1. **Safety-Critical Data Handling**
   - No caching for administration records
   - No optimistic updates for medication administration
   - Mandatory Five Rights verification
   - Comprehensive audit logging

2. **Offline Support**
   - Queued operations when offline
   - Automatic sync when connection restored
   - User feedback for queued operations

3. **Barcode Scanning Integration**
   - Real-time verification
   - LASA (Look-Alike, Sound-Alike) warnings
   - NDC code validation

---

### 3. Appointments Module

```typescript
// File: frontend/src/services/modules/appointments/hooks/useAppointments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api';
import { appointmentKeys } from '../queryKeys';

/**
 * Get appointments for a specific date/range
 *
 * Caching Strategy:
 * - staleTime: 2 minutes (schedules change frequently)
 * - Refetch on window focus (ensure schedule is current)
 * - Auto-refetch every 5 minutes
 */
export function useAppointments(filters: AppointmentFilters) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentsApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Get nurse availability for scheduling
 *
 * Caching Strategy:
 * - Very short cache (30 seconds)
 * - Critical for preventing double-booking
 */
export function useNurseAvailability(nurseId: string, date: string) {
  return useQuery({
    queryKey: appointmentKeys.availability(nurseId, date),
    queryFn: () => appointmentsApi.getAvailability(nurseId, date),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true, // Always fresh data for scheduling
  });
}

/**
 * Create appointment with conflict detection
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentDto) => {
      // Pre-flight conflict check
      const conflicts = await appointmentsApi.checkConflicts(data);

      if (conflicts.length > 0) {
        throw new AppointmentConflictError('Time slot already booked', conflicts);
      }

      return appointmentsApi.create(data);
    },

    onSuccess: (appointment) => {
      // Invalidate appointment lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });

      // Invalidate availability
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.availability(
          appointment.nurseId,
          appointment.date
        )
      });

      // Send confirmation notification
      notificationApi.send({
        type: 'appointment_scheduled',
        appointmentId: appointment.id,
      });

      toast.success('Appointment scheduled successfully');
    },
  });
}

/**
 * Recurring appointments hook
 */
export function useRecurringAppointments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecurringAppointmentDto) =>
      appointmentsApi.createRecurring(data),
    onSuccess: () => {
      // Invalidate all appointment queries (recurring affects multiple dates)
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });

      toast.success('Recurring appointments created');
    },
  });
}

/**
 * Cancel appointment with notification
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      appointmentsApi.cancel(id, reason),

    onSuccess: (_, { id }) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });

      // Send cancellation notification
      notificationApi.send({
        type: 'appointment_cancelled',
        appointmentId: id,
      });

      toast.success('Appointment cancelled');
    },
  });
}

/**
 * Appointment reminders (real-time updates)
 */
export function useAppointmentReminders(nurseId: string) {
  return useQuery({
    queryKey: appointmentKeys.reminders(nurseId),
    queryFn: () => appointmentsApi.getUpcomingReminders(nurseId, 60), // Next 60 minutes
    staleTime: 0, // Always fresh
    refetchInterval: 60 * 1000, // Refresh every minute
    refetchOnWindowFocus: true,
  });
}
```

---

### 4. Health Records Module

```typescript
// File: frontend/src/services/modules/health-records/hooks/useHealthRecords.ts

/**
 * Get health records for a student
 *
 * HIPAA Compliance:
 * - All access logged with audit trail
 * - Data encrypted in transit
 * - Cache cleared on session timeout
 */
export function useHealthRecords(studentId: string | undefined) {
  return useQuery({
    queryKey: healthRecordKeys.list(studentId!),
    queryFn: async () => {
      const records = await healthRecordsApi.getAll(studentId!);

      // Audit log PHI access
      await auditApi.logAccess({
        resource: 'health_records',
        resourceId: studentId!,
        action: 'view_list',
        recordCount: records.data.length,
      });

      return records;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Create health record with file attachments
 */
export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHealthRecordDto) => {
      // Upload attachments first
      let attachmentUrls: string[] = [];

      if (data.attachments && data.attachments.length > 0) {
        attachmentUrls = await Promise.all(
          data.attachments.map(file => documentApi.upload(file))
        );
      }

      return healthRecordsApi.create({
        ...data,
        attachmentUrls,
      });
    },

    onSuccess: (record) => {
      // Invalidate health record lists
      queryClient.invalidateQueries({
        queryKey: healthRecordKeys.list(record.studentId)
      });

      // Add to cache
      queryClient.setQueryData(
        healthRecordKeys.detail(record.id),
        record
      );

      toast.success('Health record created');
    },
  });
}

/**
 * Immunization records with compliance tracking
 */
export function useImmunizationRecords(studentId: string | undefined) {
  return useQuery({
    queryKey: healthRecordKeys.immunizations(studentId!),
    queryFn: () => healthRecordsApi.getImmunizations(studentId!),
    enabled: !!studentId,
    staleTime: 10 * 60 * 1000, // 10 minutes (changes infrequently)
    select: (data) => ({
      records: data,
      compliance: calculateComplianceStatus(data),
      missingRequired: getMissingRequiredImmunizations(data),
    }),
  });
}

/**
 * Growth charts (height/weight tracking)
 */
export function useGrowthChartData(studentId: string | undefined) {
  return useQuery({
    queryKey: healthRecordKeys.growthChart(studentId!),
    queryFn: () => healthRecordsApi.getGrowthData(studentId!),
    enabled: !!studentId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => ({
      raw: data,
      chartData: formatForChartLibrary(data),
      percentiles: calculatePercentiles(data),
    }),
  });
}
```

---

### 5. Emergency Contacts Module

```typescript
// File: frontend/src/services/modules/emergency-contacts/hooks/useEmergencyContacts.ts

/**
 * Get emergency contacts for a student
 *
 * Performance:
 * - Prefetch when viewing student details
 * - Long cache time (emergency contacts change rarely)
 */
export function useEmergencyContacts(studentId: string | undefined) {
  return useQuery({
    queryKey: emergencyContactKeys.list(studentId!),
    queryFn: () => emergencyContactsApi.getAll(studentId!),
    enabled: !!studentId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => ({
      contacts: data.data,
      primary: data.data.find(c => c.priority === 1),
      secondary: data.data.filter(c => c.priority > 1),
    }),
  });
}

/**
 * Update emergency contact with priority reordering
 */
export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmergencyContactDto }) =>
      emergencyContactsApi.update(id, data),

    onSuccess: (updated) => {
      // Invalidate contact list
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.list(updated.studentId)
      });

      // If priority changed, reorder all contacts
      if (updated.priorityChanged) {
        emergencyContactsApi.reorderPriorities(updated.studentId);
      }

      toast.success('Emergency contact updated');
    },
  });
}

/**
 * Verify contact information (phone/email validation)
 */
export function useVerifyEmergencyContact() {
  return useMutation({
    mutationFn: ({ id, method }: { id: string; method: 'phone' | 'email' }) =>
      emergencyContactsApi.sendVerification(id, method),

    onSuccess: (_, { method }) => {
      toast.success(`Verification ${method === 'phone' ? 'call' : 'email'} sent`);
    },
  });
}
```

---

### 6. Incident Reports Module

```typescript
// File: frontend/src/services/modules/incident-reports/hooks/useIncidentReports.ts

/**
 * Get incident reports with filtering
 */
export function useIncidentReports(filters?: IncidentReportFilters) {
  return useQuery({
    queryKey: incidentReportKeys.list(filters),
    queryFn: () => incidentReportsApi.getAll(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Create incident report with photo attachments
 */
export function useCreateIncidentReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIncidentReportDto) => {
      // Upload photos
      const photoUrls = await uploadPhotos(data.photos);

      // Create report
      const report = await incidentReportsApi.create({
        ...data,
        attachments: photoUrls,
      });

      // If severe, trigger notifications
      if (data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING') {
        await notificationApi.sendEmergencyAlert({
          type: 'incident',
          reportId: report.id,
          studentId: report.studentId,
          severity: report.severity,
        });
      }

      return report;
    },

    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: incidentReportKeys.lists() });

      toast.success('Incident report submitted');
    },
  });
}

/**
 * Follow-up on incident report
 */
export function useIncidentFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      incidentReportsApi.addFollowUp(id, notes),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: incidentReportKeys.detail(id) });
      toast.success('Follow-up added');
    },
  });
}
```

---

### 7. Inventory Management Module

```typescript
// File: frontend/src/services/modules/inventory/hooks/useInventory.ts

/**
 * Get inventory with low stock alerts
 */
export function useInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => inventoryApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      items: data.data,
      alerts: {
        lowStock: data.data.filter(item => item.quantity <= item.reorderLevel),
        expiringSoon: data.data.filter(item => isExpiringSoon(item.expirationDate)),
        expired: data.data.filter(item => isExpired(item.expirationDate)),
      },
    }),
  });
}

/**
 * Update inventory quantity with audit trail
 */
export function useUpdateInventoryQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
      reason
    }: {
      id: string;
      quantity: number;
      reason: string
    }) => inventoryApi.updateQuantity(id, quantity, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success('Inventory updated');
    },
  });
}

/**
 * Automated reorder suggestions
 */
export function useReorderSuggestions() {
  return useQuery({
    queryKey: inventoryKeys.reorderSuggestions(),
    queryFn: () => inventoryApi.getReorderSuggestions(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnMount: false, // Only fetch when explicitly needed
  });
}
```

---

### 8. Compliance & Regulatory Module

```typescript
// File: frontend/src/services/modules/compliance/hooks/useCompliance.ts

/**
 * Get compliance dashboard data
 */
export function useComplianceDashboard() {
  return useQuery({
    queryKey: complianceKeys.dashboard(),
    queryFn: () => complianceApi.getDashboard(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => ({
      overall: data.overallScore,
      byCategory: data.categoryScores,
      violations: data.violations,
      remediation: data.remediationPlan,
    }),
  });
}

/**
 * Get audit logs with filtering
 */
export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: complianceKeys.auditLogs(filters),
    queryFn: () => complianceApi.getAuditLogs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // Smooth pagination
  });
}

/**
 * Export compliance report
 */
export function useExportComplianceReport() {
  return useMutation({
    mutationFn: (params: ComplianceReportParams) =>
      complianceApi.generateReport(params),

    onSuccess: (blob, params) => {
      // Auto-download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${params.startDate}-${params.endDate}.pdf`;
      a.click();

      toast.success('Compliance report downloaded');
    },
  });
}
```

---

### 9. Communications Module

```typescript
// File: frontend/src/services/modules/communications/hooks/useCommunications.ts

/**
 * Get messages/announcements
 */
export function useMessages(filters?: MessageFilters) {
  return useQuery({
    queryKey: messageKeys.list(filters),
    queryFn: () => communicationsApi.getMessages(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });
}

/**
 * Send notification to parent/guardian
 */
export function useSendParentNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ParentNotificationDto) =>
      communicationsApi.sendToParent(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.sent() });
      toast.success('Notification sent to parent');
    },
  });
}

/**
 * Bulk communications (school-wide announcements)
 */
export function useBulkAnnouncement() {
  return useMutation({
    mutationFn: (data: BulkAnnouncementDto) =>
      communicationsApi.sendBulkAnnouncement(data),

    onSuccess: (result) => {
      toast.success(`Announcement sent to ${result.recipientCount} recipients`);
    },
  });
}
```

---

### 10. Documents Module

```typescript
// File: frontend/src/services/modules/documents/hooks/useDocuments.ts

/**
 * Get documents for a student
 */
export function useStudentDocuments(studentId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.list(studentId!),
    queryFn: () => documentsApi.getAll(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      documents: data.data,
      byCategory: groupByCategory(data.data),
      requiresSignature: data.data.filter(d => d.requiresSignature && !d.signedAt),
    }),
  });
}

/**
 * Upload document with virus scanning
 */
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UploadDocumentDto) => {
      // Upload file
      const uploadedUrl = await documentsApi.upload(data.file);

      // Virus scan (async)
      const scanResult = await documentsApi.scanForVirus(uploadedUrl);

      if (!scanResult.clean) {
        throw new Error('File failed virus scan');
      }

      // Create document record
      return documentsApi.create({
        ...data,
        url: uploadedUrl,
        scanResult: scanResult.id,
      });
    },

    onSuccess: (document) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.list(document.studentId)
      });

      toast.success('Document uploaded successfully');
    },
  });
}

/**
 * E-signature for consent forms
 */
export function useSignDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, signature }: { id: string; signature: string }) =>
      documentsApi.sign(id, signature),

    onSuccess: (signed) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(signed.id)
      });

      toast.success('Document signed');
    },
  });
}
```

---

### 11. Reports & Analytics Module

```typescript
// File: frontend/src/services/modules/reports/hooks/useReports.ts

/**
 * Get dashboard analytics
 */
export function useDashboardAnalytics(dateRange: DateRange) {
  return useQuery({
    queryKey: reportKeys.dashboard(dateRange),
    queryFn: () => reportsApi.getDashboard(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      summary: data.summary,
      charts: prepareChartData(data),
      trends: calculateTrends(data),
    }),
  });
}

/**
 * Generate custom report
 */
export function useGenerateReport() {
  return useMutation({
    mutationFn: (params: ReportParams) => reportsApi.generate(params),

    onSuccess: (blob, params) => {
      downloadFile(blob, `report-${params.type}-${Date.now()}.pdf`);
      toast.success('Report generated');
    },
  });
}

/**
 * Medication administration report
 */
export function useMedicationAdministrationReport(filters: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.medicationAdministration(filters),
    queryFn: () => reportsApi.getMedicationAdministration(filters),
    staleTime: 10 * 60 * 1000,
    enabled: !!filters.startDate && !!filters.endDate,
  });
}
```

---

### 12. Access Control Module

```typescript
// File: frontend/src/services/modules/access-control/hooks/useAccessControl.ts

/**
 * Get user permissions
 */
export function useUserPermissions() {
  return useQuery({
    queryKey: accessControlKeys.permissions(),
    queryFn: () => accessControlApi.getMyPermissions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
}

/**
 * Check specific permission
 */
export function useHasPermission(permission: string) {
  const { data: permissions } = useUserPermissions();

  return useMemo(() =>
    permissions?.includes(permission) ?? false,
    [permissions, permission]
  );
}

/**
 * Manage user roles
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      accessControlApi.assignRole(userId, roleId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.all });
      toast.success('User role updated');
    },
  });
}
```

---

## Caching Strategy

### Data Classification & Cache Times

| Data Type | Example | staleTime | gcTime | Rationale |
|-----------|---------|-----------|--------|-----------|
| **Static Reference** | Drug formulary, medication categories | 24 hours | 7 days | Changes very rarely |
| **Semi-Static** | Student roster, emergency contacts | 10 minutes | 30 minutes | Changes infrequently |
| **Dynamic** | Appointment schedules, medication logs | 2-5 minutes | 10 minutes | Changes moderately |
| **Real-Time** | Medication reminders, nurse availability | 0-30 seconds | 2 minutes | Needs immediate updates |
| **Safety-Critical** | Medication administration, Five Rights | 0 (no cache) | 0 | Cannot risk stale data |

### Cache Invalidation Patterns

#### 1. Hierarchical Invalidation

```typescript
// When updating a student, invalidate:
// - Student detail
// - Student list queries
// - Related health records
// - Related appointments

queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
queryClient.invalidateQueries({ queryKey: healthRecordKeys.list(id) });
queryClient.invalidateQueries({ queryKey: appointmentKeys.byStudent(id) });
```

#### 2. Related Entity Invalidation

```typescript
// When creating medication administration log:
// - Invalidate medication logs
// - Invalidate inventory (quantity decreased)
// - Invalidate student medication schedule
// - Invalidate reminders

queryClient.invalidateQueries({ queryKey: medicationLogKeys.list() });
queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
queryClient.invalidateQueries({ queryKey: administrationKeys.schedule() });
queryClient.invalidateQueries({ queryKey: administrationKeys.reminders() });
```

#### 3. Prefetching Strategy

```typescript
// When loading student list, prefetch common details
const studentList = useStudents();

useEffect(() => {
  if (studentList.data) {
    studentList.data.students.forEach(student => {
      // Prefetch student details
      queryClient.prefetchQuery({
        queryKey: studentKeys.detail(student.id),
        queryFn: () => studentsApi.getById(student.id),
      });
    });
  }
}, [studentList.data]);
```

---

## Error Handling & Retry Logic

### Error Classification

```typescript
// File: frontend/src/services/core/ErrorClassification.ts

export enum ErrorSeverity {
  LOW = 'low',           // Recoverable, can retry
  MEDIUM = 'medium',     // Requires user action
  HIGH = 'high',         // Data integrity issue
  CRITICAL = 'critical', // System failure, healthcare safety risk
}

export interface ClassifiedError {
  severity: ErrorSeverity;
  code: string;
  message: string;
  userMessage: string;
  action: ErrorAction;
  shouldRetry: boolean;
  retryStrategy?: RetryStrategy;
}

export function classifyError(error: ApiClientError): ClassifiedError {
  // Network errors
  if (error.code === 'NETWORK_ERROR') {
    return {
      severity: ErrorSeverity.MEDIUM,
      code: 'NETWORK_ERROR',
      message: error.message,
      userMessage: 'Network connection lost. Please check your internet connection.',
      action: ErrorAction.RETRY,
      shouldRetry: true,
      retryStrategy: { count: 3, delay: 2000, backoff: 'exponential' },
    };
  }

  // Authentication errors
  if (error.status === 401) {
    return {
      severity: ErrorSeverity.HIGH,
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      userMessage: 'Your session has expired. Please log in again.',
      action: ErrorAction.REDIRECT_TO_LOGIN,
      shouldRetry: false,
    };
  }

  // Validation errors
  if (error.status === 400) {
    return {
      severity: ErrorSeverity.MEDIUM,
      code: 'VALIDATION_ERROR',
      message: error.message,
      userMessage: error.message, // Show validation message directly
      action: ErrorAction.SHOW_FORM_ERRORS,
      shouldRetry: false,
    };
  }

  // Healthcare safety errors (medication administration)
  if (error.code === 'FIVE_RIGHTS_FAILED') {
    return {
      severity: ErrorSeverity.CRITICAL,
      code: 'FIVE_RIGHTS_FAILED',
      message: error.message,
      userMessage: 'MEDICATION SAFETY ALERT: Five Rights verification failed. Do NOT proceed.',
      action: ErrorAction.ALERT_AND_BLOCK,
      shouldRetry: false,
    };
  }

  // Server errors
  if (error.status >= 500) {
    return {
      severity: ErrorSeverity.HIGH,
      code: 'SERVER_ERROR',
      message: error.message,
      userMessage: 'A server error occurred. Our team has been notified. Please try again later.',
      action: ErrorAction.SHOW_ERROR_PAGE,
      shouldRetry: true,
      retryStrategy: { count: 2, delay: 5000, backoff: 'linear' },
    };
  }

  // Default
  return {
    severity: ErrorSeverity.MEDIUM,
    code: 'UNKNOWN_ERROR',
    message: error.message,
    userMessage: 'An unexpected error occurred. Please try again.',
    action: ErrorAction.SHOW_TOAST,
    shouldRetry: false,
  };
}
```

### Retry Strategies

```typescript
// File: frontend/src/services/core/RetryStrategy.ts

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Global retry configuration for TanStack Query
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  retryableErrors: [
    'NETWORK_ERROR',
    'TIMEOUT',
    'SERVICE_UNAVAILABLE',
  ],
};

/**
 * Custom retry logic for TanStack Query
 */
export function shouldRetry(
  failureCount: number,
  error: ApiClientError
): boolean {
  // Never retry healthcare safety errors
  if (error.code?.startsWith('MEDICATION_SAFETY_')) {
    return false;
  }

  // Never retry authentication errors
  if (error.status === 401) {
    return false;
  }

  // Never retry validation errors
  if (error.status === 400) {
    return false;
  }

  // Retry network errors up to 3 times
  if (error.code === 'NETWORK_ERROR' && failureCount < 3) {
    return true;
  }

  // Retry server errors up to 2 times
  if (error.status >= 500 && failureCount < 2) {
    return true;
  }

  return false;
}

/**
 * Exponential backoff retry delay
 */
export function retryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30 seconds
}
```

### Error Boundary Integration

```typescript
// File: frontend/src/components/ErrorBoundary.tsx

export function DataFetchingErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorFallback
              error={classifyError(error)}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

---

## Security & Audit Logging

### Automatic Audit Logging

```typescript
// File: frontend/src/services/core/AuditMiddleware.ts

/**
 * Axios interceptor for automatic audit logging
 */
export function setupAuditLogging(client: AxiosInstance) {
  // Request interceptor - log outgoing PHI access
  client.interceptors.request.use((config) => {
    // Identify PHI endpoints
    const phiEndpoints = [
      '/students',
      '/health-records',
      '/medications',
      '/incident-reports',
    ];

    const isPhiAccess = phiEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (isPhiAccess) {
      // Add audit metadata to request
      config.headers['X-Audit-Action'] = getActionFromMethod(config.method);
      config.headers['X-Audit-Resource'] = getResourceFromUrl(config.url);
      config.headers['X-Audit-Timestamp'] = new Date().toISOString();
    }

    return config;
  });

  // Response interceptor - log completed PHI access
  client.interceptors.response.use(
    (response) => {
      if (response.config.headers['X-Audit-Action']) {
        // Send audit log to backend
        auditApi.log({
          action: response.config.headers['X-Audit-Action'],
          resource: response.config.headers['X-Audit-Resource'],
          timestamp: response.config.headers['X-Audit-Timestamp'],
          status: 'success',
          recordCount: Array.isArray(response.data?.data)
            ? response.data.data.length
            : 1,
        });
      }

      return response;
    },
    (error) => {
      if (error.config?.headers['X-Audit-Action']) {
        // Log failed access attempt
        auditApi.log({
          action: error.config.headers['X-Audit-Action'],
          resource: error.config.headers['X-Audit-Resource'],
          timestamp: error.config.headers['X-Audit-Timestamp'],
          status: 'failed',
          error: error.message,
        });
      }

      return Promise.reject(error);
    }
  );
}
```

### Role-Based Access Control

```typescript
// File: frontend/src/services/core/RBACHook.ts

/**
 * Hook to enforce RBAC on queries
 */
export function useSecureQuery<TData>(
  options: UseQueryOptions<TData>,
  requiredPermission: string
) {
  const { data: permissions } = useUserPermissions();

  const hasPermission = permissions?.includes(requiredPermission);

  return useQuery({
    ...options,
    enabled: hasPermission && (options.enabled !== false),
    onError: (error) => {
      if (!hasPermission) {
        toast.error('You do not have permission to access this data');
        // Log unauthorized access attempt
        auditApi.logUnauthorizedAccess({
          resource: options.queryKey,
          requiredPermission,
        });
      }

      options.onError?.(error);
    },
  });
}

// Usage example
const students = useSecureQuery(
  {
    queryKey: studentKeys.list(),
    queryFn: () => studentsApi.getAll(),
  },
  'students:read'
);
```

---

## Migration Plan

### Phase 1: Foundation (Week 1-2)

**Objective**: Establish core infrastructure and patterns

1. **Core Services Setup**
   - ✅ ApiClient configuration (already exists)
   - ✅ BaseApiService (already exists)
   - ✅ QueryHooksFactory (already exists)
   - ☐ Audit logging middleware
   - ☐ Error classification system
   - ☐ RBAC hooks

2. **Type Definitions**
   - ☐ Standardize all DTO types
   - ☐ Create shared type library
   - ☐ Zod validation schemas

3. **Testing Infrastructure**
   - ☐ Mock service worker setup
   - ☐ TanStack Query testing utilities
   - ☐ Integration test patterns

**Deliverables:**
- Core services fully tested
- Type library documented
- Testing patterns established

---

### Phase 2: High-Priority Modules (Week 3-4)

**Objective**: Migrate safety-critical and high-traffic modules

#### 2.1 Medication Module Enhancement
- ✅ Formulary hooks (already implemented)
- ✅ Administration hooks (already implemented)
- ☐ Inventory integration
- ☐ Prescription management

#### 2.2 Student Management
- ☐ Student list with filters
- ☐ Student detail with prefetching
- ☐ Student search
- ☐ CRUD operations
- ☐ Bulk import

#### 2.3 Appointments
- ☐ Appointment scheduling
- ☐ Availability checking
- ☐ Recurring appointments
- ☐ Reminders system

**Deliverables:**
- Medication module 100% complete
- Student module functional
- Appointments module functional

---

### Phase 3: Health Data Modules (Week 5-6)

**Objective**: Migrate health records and related modules

#### 3.1 Health Records
- ☐ Health record CRUD
- ☐ Immunization tracking
- ☐ Growth charts
- ☐ File attachments

#### 3.2 Emergency Contacts
- ☐ Contact management
- ☐ Priority ordering
- ☐ Verification system

#### 3.3 Incident Reports
- ☐ Incident reporting
- ☐ Photo uploads
- ☐ Follow-up tracking
- ☐ Severity-based notifications

**Deliverables:**
- Health data modules complete
- Emergency workflow tested
- Incident reporting functional

---

### Phase 4: Administrative Modules (Week 7-8)

**Objective**: Complete administrative and support modules

#### 4.1 Inventory Management
- ☐ Inventory tracking
- ☐ Low stock alerts
- ☐ Expiration warnings
- ☐ Reorder automation

#### 4.2 Compliance & Audit
- ☐ Compliance dashboard
- ☐ Audit log viewer
- ☐ Report generation
- ☐ Export functionality

#### 4.3 Communications
- ☐ Message center
- ☐ Parent notifications
- ☐ Bulk announcements
- ☐ Email templates

#### 4.4 Documents
- ☐ Document upload
- ☐ Virus scanning
- ☐ E-signatures
- ☐ Version control

**Deliverables:**
- Administrative modules complete
- Compliance system functional
- Communication features working

---

### Phase 5: Reports & Analytics (Week 9-10)

**Objective**: Implement reporting and analytics

#### 5.1 Dashboard Analytics
- ☐ Summary statistics
- ☐ Trend analysis
- ☐ Chart data preparation
- ☐ Real-time updates

#### 5.2 Custom Reports
- ☐ Report builder
- ☐ PDF generation
- ☐ Excel export
- ☐ Scheduled reports

#### 5.3 Medication Reports
- ☐ Administration logs
- ☐ Compliance tracking
- ☐ Adverse reactions
- ☐ Inventory reports

**Deliverables:**
- Analytics dashboard live
- Report generation working
- Export functionality complete

---

### Phase 6: Testing & Optimization (Week 11-12)

**Objective**: Comprehensive testing and performance optimization

#### 6.1 Integration Testing
- ☐ End-to-end workflows
- ☐ Cross-module integration
- ☐ Error scenarios
- ☐ Edge cases

#### 6.2 Performance Optimization
- ☐ Bundle size analysis
- ☐ Query performance tuning
- ☐ Cache optimization
- ☐ Prefetching strategy

#### 6.3 Security Audit
- ☐ RBAC verification
- ☐ Audit log completeness
- ☐ HIPAA compliance check
- ☐ Penetration testing

#### 6.4 Documentation
- ☐ API documentation
- ☐ Hook usage examples
- ☐ Migration guide
- ☐ Troubleshooting guide

**Deliverables:**
- Full test coverage
- Performance benchmarks
- Security certification
- Complete documentation

---

### Migration Checklist Template

For each module, follow this checklist:

```markdown
## [Module Name] Migration Checklist

### API Layer
- [ ] Create API service class (extends BaseApiService)
- [ ] Define TypeScript interfaces
- [ ] Create Zod validation schemas
- [ ] Implement CRUD operations
- [ ] Add specialized endpoints
- [ ] Write API unit tests

### Hook Layer
- [ ] Define query key factory
- [ ] Create list hook (useModuleName)
- [ ] Create detail hook (useModuleNameDetail)
- [ ] Create search hook (if applicable)
- [ ] Create mutation hooks (create, update, delete)
- [ ] Add error handling
- [ ] Configure cache strategy
- [ ] Write hook integration tests

### Component Integration
- [ ] Update components to use new hooks
- [ ] Remove mock data imports
- [ ] Add loading states
- [ ] Add error states
- [ ] Update prop types
- [ ] Test user flows

### Testing
- [ ] Unit tests for API service
- [ ] Integration tests for hooks
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing

### Documentation
- [ ] API documentation
- [ ] Hook documentation
- [ ] Usage examples
- [ ] Migration notes
```

---

## Testing Strategy

### 1. Unit Testing - API Services

```typescript
// File: frontend/src/services/modules/students/__tests__/StudentsApi.test.ts

import { describe, it, expect, vi } from 'vitest';
import { studentsApi } from '../api';
import { mockApiClient } from '@/test-utils/mockApiClient';

describe('StudentsApi', () => {
  it('should fetch all students with filters', async () => {
    const mockResponse = {
      data: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    };

    mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

    const result = await studentsApi.getAll({ grade: '5' });

    expect(result).toEqual(mockResponse);
    expect(mockApiClient.get).toHaveBeenCalledWith(
      expect.stringContaining('grade=5')
    );
  });

  it('should handle API errors gracefully', async () => {
    mockApiClient.get.mockRejectedValue(new Error('Network error'));

    await expect(studentsApi.getAll()).rejects.toThrow('Failed to fetch students');
  });
});
```

### 2. Integration Testing - Hooks

```typescript
// File: frontend/src/services/modules/students/__tests__/useStudents.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents } from '../hooks/useStudents';
import { studentsApi } from '../api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useStudents', () => {
  it('should fetch students successfully', async () => {
    const mockStudents = [
      { id: '1', firstName: 'John', lastName: 'Doe' },
    ];

    vi.spyOn(studentsApi, 'getAll').mockResolvedValue({
      data: mockStudents,
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    });

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.students).toEqual(mockStudents);
  });

  it('should handle errors', async () => {
    vi.spyOn(studentsApi, 'getAll').mockRejectedValue(
      new Error('API error')
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toBeUndefined();
  });
});
```

### 3. E2E Testing - Cypress

```typescript
// File: frontend/cypress/e2e/students/student-management.cy.ts

describe('Student Management', () => {
  beforeEach(() => {
    cy.login(); // Custom command
    cy.visit('/students');
  });

  it('should display student list', () => {
    cy.get('[data-testid="student-list"]').should('exist');
    cy.get('[data-testid="student-row"]').should('have.length.greaterThan', 0);
  });

  it('should filter students by grade', () => {
    cy.get('[data-testid="grade-filter"]').select('5');

    cy.wait('@getStudents'); // Intercept

    cy.get('[data-testid="student-row"]').each(($row) => {
      cy.wrap($row).should('contain', 'Grade 5');
    });
  });

  it('should create new student', () => {
    cy.get('[data-testid="add-student-btn"]').click();

    cy.get('[name="firstName"]').type('Jane');
    cy.get('[name="lastName"]').type('Smith');
    cy.get('[name="dateOfBirth"]').type('2015-05-15');
    cy.get('[name="grade"]').select('5');

    cy.get('[data-testid="submit-btn"]').click();

    cy.get('[data-testid="toast-success"]').should('contain', 'Student created');
    cy.get('[data-testid="student-list"]').should('contain', 'Jane Smith');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('POST', '/api/students', {
      statusCode: 400,
      body: { message: 'Student number already exists' },
    }).as('createStudentError');

    cy.get('[data-testid="add-student-btn"]').click();
    // Fill form...
    cy.get('[data-testid="submit-btn"]').click();

    cy.wait('@createStudentError');

    cy.get('[data-testid="toast-error"]').should(
      'contain',
      'Student number already exists'
    );
  });
});
```

### 4. Performance Testing

```typescript
// File: frontend/src/services/modules/__tests__/performance.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { useStudents } from '../students/hooks/useStudents';

describe('Performance Tests', () => {
  it('should load student list within acceptable time', async () => {
    const startTime = performance.now();

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // Should load within 500ms
    expect(loadTime).toBeLessThan(500);
  });

  it('should cache repeated queries', async () => {
    const { result: result1 } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    const apiCallCount = vi.mocked(studentsApi.getAll).mock.calls.length;

    // Second render should use cache
    const { result: result2 } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    expect(result2.current.isLoading).toBe(false); // Instant from cache
    expect(vi.mocked(studentsApi.getAll).mock.calls.length).toBe(apiCallCount); // No new API call
  });
});
```

---

## Naming Conventions

### 1. Hook Names

```typescript
// List queries: use[ModuleName]
export function useStudents() { }
export function useMedications() { }
export function useAppointments() { }

// Detail queries: use[ModuleName]Detail
export function useStudentDetail(id: string) { }
export function useMedicationDetail(id: string) { }

// Search queries: use[ModuleName]Search
export function useStudentSearch(query: string) { }
export function useMedicationSearch(query: string) { }

// Create mutations: useCreate[ModuleName]
export function useCreateStudent() { }
export function useCreateAppointment() { }

// Update mutations: useUpdate[ModuleName]
export function useUpdateStudent() { }
export function useUpdateMedication() { }

// Delete mutations: useDelete[ModuleName]
export function useDeleteStudent() { }
export function useDeleteIncidentReport() { }

// Specialized operations: use[Action][ModuleName]
export function useAssignStudentToNurse() { }
export function useTransferStudent() { }
export function useBulkImportStudents() { }
```

### 2. Query Key Names

```typescript
// Module keys: [moduleName]Keys
export const studentKeys = { }
export const medicationKeys = { }
export const appointmentKeys = { }

// Operation keys: lowercase with underscores
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  assigned_students: (nurseId: string) => [...studentKeys.all, 'assigned', nurseId] as const,
}
```

### 3. API Service Names

```typescript
// Class names: [ModuleName]Api
export class StudentsApi { }
export class MedicationsApi { }
export class AppointmentsApi { }

// Instance names: [moduleName]Api
export const studentsApi = new StudentsApi();
export const medicationsApi = new MedicationsApi();
export const appointmentsApi = new AppointmentsApi();
```

### 4. Type Names

```typescript
// Entity types: [ModuleName] (singular)
export interface Student { }
export interface Medication { }
export interface Appointment { }

// Filter types: [ModuleName]Filters
export interface StudentFilters { }
export interface AppointmentFilters { }

// DTO types: Create[ModuleName]Dto, Update[ModuleName]Dto
export interface CreateStudentDto { }
export interface UpdateStudentDto { }
```

---

## Best Practices Summary

### 1. Always Use Type-Safe Hooks

```typescript
// ❌ Bad: Direct API calls in components
const [students, setStudents] = useState([]);
useEffect(() => {
  studentsApi.getAll().then(setStudents);
}, []);

// ✅ Good: Use custom hooks
const { data: students, isLoading, error } = useStudents();
```

### 2. Handle Loading and Error States

```typescript
// ✅ Always handle all states
function StudentList() {
  const { data, isLoading, error } = useStudents();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.students.length) return <EmptyState />;

  return <StudentTable students={data.students} />;
}
```

### 3. Use Optimistic Updates Carefully

```typescript
// ❌ Never for healthcare-critical data
const { mutate } = useRecordMedicationAdministration({
  optimistic: true, // DANGEROUS!
});

// ✅ Only for non-critical updates
const { mutate } = useUpdateStudentPhoto({
  optimistic: true, // Safe - just a photo
});
```

### 4. Prefetch Predictable Navigation

```typescript
// ✅ Prefetch on hover
function StudentRow({ student }: { student: Student }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: studentKeys.detail(student.id),
      queryFn: () => studentsApi.getById(student.id),
    });
  };

  return (
    <tr onMouseEnter={handleMouseEnter}>
      {/* ... */}
    </tr>
  );
}
```

### 5. Implement Proper Audit Logging

```typescript
// ✅ Always log PHI access
export function useHealthRecords(studentId: string) {
  return useQuery({
    queryKey: healthRecordKeys.list(studentId),
    queryFn: async () => {
      const records = await healthRecordsApi.getAll(studentId);

      // Audit log
      await auditApi.logAccess({
        resource: 'health_records',
        resourceId: studentId,
        action: 'view',
        timestamp: new Date().toISOString(),
      });

      return records;
    },
  });
}
```

---

## Conclusion

This comprehensive data fetching strategy provides:

1. **Consistency**: Standardized patterns across all 15 modules
2. **Safety**: Healthcare-critical data handling with proper safeguards
3. **Performance**: Optimized caching and prefetching strategies
4. **Security**: HIPAA compliance with audit logging and RBAC
5. **Maintainability**: Clear structure and naming conventions
6. **Scalability**: Reusable patterns via factory functions
7. **Developer Experience**: Type safety and comprehensive documentation

By following this strategy, the White Cross platform will have enterprise-grade data fetching that meets healthcare regulatory standards while providing an excellent user experience.

---

## Appendix

### A. Quick Reference - Common Patterns

#### Fetch List with Filters
```typescript
const { data, isLoading } = useStudents({ grade: '5', isActive: true });
```

#### Fetch Single Item
```typescript
const { data: student } = useStudentDetail(studentId);
```

#### Create Item
```typescript
const createStudent = useCreateStudent();
createStudent.mutate({ firstName: 'John', lastName: 'Doe' });
```

#### Update Item
```typescript
const updateStudent = useUpdateStudent();
updateStudent.mutate({ id: '123', data: { grade: '6' } });
```

#### Delete Item
```typescript
const deleteStudent = useDeleteStudent();
deleteStudent.mutate('123');
```

#### Search
```typescript
const { data: results } = useStudentSearch(searchQuery);
```

### B. TanStack Query Configuration

```typescript
// File: frontend/src/config/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: shouldRetry,
      retryDelay: retryDelay,
    },
    mutations: {
      retry: false, // Never retry mutations by default
      onError: (error) => {
        const classified = classifyError(error as ApiClientError);

        if (classified.severity === ErrorSeverity.CRITICAL) {
          // Show modal for critical errors
          showCriticalErrorModal(classified);
        } else {
          // Show toast for other errors
          toast.error(classified.userMessage);
        }
      },
    },
  },
});
```

### C. Useful Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/index.html)
- [Enterprise React Patterns](https://www.patterns.dev/)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-10
**Author**: Enterprise React Team
**Status**: Ready for Implementation
