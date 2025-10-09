/**
 * Example: Students API Service using the new enterprise-grade patterns
 *
 * This example demonstrates how to:
 * 1. Create a type-safe API service
 * 2. Add validation schemas
 * 3. Create TanStack Query hooks
 * 4. Use the service in components
 */

import { z } from 'zod';
import { BaseApiService, createQueryHooks, apiClient } from '../core';
import { API_ENDPOINTS } from '../../constants/api';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  studentNumber: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  grade?: string;
  isActive?: boolean;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  studentNumber: z.string().min(1, 'Student number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  grade: z.string().min(1, 'Grade is required'),
  schoolId: z.string().min(1, 'School ID is required'),
});

const updateStudentSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  grade: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// API SERVICE
// ==========================================

class StudentsService extends BaseApiService<Student, CreateStudentDto, UpdateStudentDto> {
  constructor() {
    super(apiClient, API_ENDPOINTS.STUDENTS.BASE, {
      createSchema: createStudentSchema,
      updateSchema: updateStudentSchema,
    });
  }

  /**
   * Get students assigned to current nurse
   */
  async getAssignedStudents(): Promise<Student[]> {
    return this.get<Student[]>(this.buildEndpoint('/assigned'));
  }

  /**
   * Search students by name or student number
   */
  async searchStudents(query: string): Promise<Student[]> {
    return this.get<Student[]>(this.buildEndpoint('/search'), { q: query });
  }

  /**
   * Bulk assign students to nurse
   */
  async bulkAssign(studentIds: string[], nurseId: string): Promise<void> {
    await this.post(this.buildEndpoint('/bulk-assign'), { studentIds, nurseId });
  }
}

// Export singleton instance
export const studentsService = new StudentsService();

// ==========================================
// TANSTACK QUERY HOOKS
// ==========================================

export const studentsQueryHooks = createQueryHooks<Student, CreateStudentDto, UpdateStudentDto>(
  studentsService,
  {
    queryKey: ['students'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);

// ==========================================
// USAGE EXAMPLE IN COMPONENTS
// ==========================================

/**
 * Example 1: List Students Component
 *
 * ```tsx
 * import { studentsQueryHooks } from '@/services/examples/ExampleStudentsService';
 *
 * function StudentsList() {
 *   const { data, isLoading, error } = studentsQueryHooks.useList({
 *     filters: { page: 1, limit: 20, sort: 'lastName', order: 'asc' }
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {data?.data.map(student => (
 *         <div key={student.id}>
 *           {student.firstName} {student.lastName}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Example 2: Student Detail Component
 *
 * ```tsx
 * import { studentsQueryHooks } from '@/services/examples/ExampleStudentsService';
 *
 * function StudentDetail({ studentId }: { studentId: string }) {
 *   const { data: student, isLoading } = studentsQueryHooks.useDetail({ id: studentId });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!student) return <div>Student not found</div>;
 *
 *   return (
 *     <div>
 *       <h1>{student.firstName} {student.lastName}</h1>
 *       <p>Student Number: {student.studentNumber}</p>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Example 3: Create Student Form
 *
 * ```tsx
 * import { studentsQueryHooks } from '@/services/examples/ExampleStudentsService';
 * import { useForm } from 'react-hook-form';
 *
 * function CreateStudentForm() {
 *   const { register, handleSubmit } = useForm<CreateStudentDto>();
 *   const createMutation = studentsQueryHooks.useCreate({
 *     onSuccess: () => {
 *       alert('Student created successfully!');
 *     },
 *     onError: (error) => {
 *       alert(`Error: ${error.message}`);
 *     }
 *   });
 *
 *   const onSubmit = (data: CreateStudentDto) => {
 *     createMutation.mutate(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input {...register('firstName')} placeholder="First Name" />
 *       <input {...register('lastName')} placeholder="Last Name" />
 *       <button type="submit" disabled={createMutation.isPending}>
 *         {createMutation.isPending ? 'Creating...' : 'Create Student'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */

/**
 * Example 4: Update Student
 *
 * ```tsx
 * import { studentsQueryHooks } from '@/services/examples/ExampleStudentsService';
 *
 * function UpdateStudentButton({ studentId, updates }: { studentId: string; updates: UpdateStudentDto }) {
 *   const updateMutation = studentsQueryHooks.useUpdate({
 *     onSuccess: () => {
 *       console.log('Student updated!');
 *     }
 *   });
 *
 *   const handleUpdate = () => {
 *     updateMutation.mutate({ id: studentId, data: updates });
 *   };
 *
 *   return (
 *     <button onClick={handleUpdate} disabled={updateMutation.isPending}>
 *       Update Student
 *     </button>
 *   );
 * }
 * ```
 */

/**
 * Example 5: Delete Student
 *
 * ```tsx
 * import { studentsQueryHooks } from '@/services/examples/ExampleStudentsService';
 *
 * function DeleteStudentButton({ studentId }: { studentId: string }) {
 *   const deleteMutation = studentsQueryHooks.useDelete({
 *     onSuccess: () => {
 *       alert('Student deleted successfully!');
 *     }
 *   });
 *
 *   const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *       deleteMutation.mutate(studentId);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleDelete} disabled={deleteMutation.isPending}>
 *       Delete
 *     </button>
 *   );
 * }
 * ```
 */

/**
 * Example 6: Search with Debounce
 *
 * ```tsx
 * import { studentsQueryHooks } from '@/services/examples/ExampleStudentsService';
 * import { useState, useEffect } from 'react';
 *
 * function StudentSearch() {
 *   const [query, setQuery] = useState('');
 *   const [debouncedQuery, setDebouncedQuery] = useState('');
 *
 *   useEffect(() => {
 *     const timer = setTimeout(() => setDebouncedQuery(query), 300);
 *     return () => clearTimeout(timer);
 *   }, [query]);
 *
 *   const { data, isLoading } = studentsQueryHooks.useSearch(debouncedQuery);
 *
 *   return (
 *     <div>
 *       <input
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="Search students..."
 *       />
 *       {isLoading && <div>Searching...</div>}
 *       {data?.data.map(student => (
 *         <div key={student.id}>{student.firstName} {student.lastName}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
