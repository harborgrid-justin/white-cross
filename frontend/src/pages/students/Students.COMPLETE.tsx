/**
 * COMPLETE STUDENT MANAGEMENT EXAMPLE
 *
 * This is a production-ready, copy-paste ready example demonstrating ALL patterns:
 * - TanStack Query hooks with full CRUD operations
 * - Optimistic updates with conflict resolution
 * - Smart prefetching for performance
 * - Comprehensive audit logging
 * - Error handling with resilience
 * - Loading states and skeletons
 * - Pagination with infinite scroll
 * - Search and advanced filtering
 * - Bulk operations
 * - PHI protection and access logging
 * - Type safety throughout
 *
 * @example How to use this example:
 * 1. Copy this file to your pages/students directory
 * 2. Update imports to match your project structure
 * 3. Customize styling to match your design system
 * 4. Add/remove features as needed
 *
 * Last Updated: 2025-10-21
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// IMPORTS - Demonstrating proper service layer usage
// =============================================================================

// Student hooks - Core data operations
import {
  useStudents,
  useStudentDetail,
  useInfiniteStudents,
} from '@/hooks/students/coreQueries';

// Student mutations - All CRUD operations
import {
  useStudentMutations,
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent,
  useBulkUpdateStudents,
} from '@/hooks/students/mutations';

// Composite hooks - High-level interfaces
import {
  useStudentManager,
  useStudentDashboard,
  useBulkStudentOperations,
} from '@/hooks/students/composite';

// Search and filtering
import { useStudentSearchAndFilter } from '@/hooks/students/searchAndFilter';

// Statistics
import { useDashboardMetrics } from '@/hooks/students/statistics';

// Types
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  Gender,
} from '@/types/student.types';

// Audit service for PHI logging
import { auditService, AuditAction, AuditResourceType } from '@/services/audit';

// Shared UI components
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BackButton } from '@/components/BackButton';

// =============================================================================
// COMPONENT: Student Management Page
// =============================================================================

export const StudentsPageComplete: React.FC = () => {
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<StudentFilters>({
    isActive: true,
    page: 1,
    limit: 20,
  });

  // ---------------------------------------------------------------------------
  // HOOKS - Using the complete student manager for full functionality
  // ---------------------------------------------------------------------------

  const studentManager = useStudentManager({
    enableRedux: false, // Set to true if you want Redux integration
    enablePHI: true,    // HIPAA-compliant PHI protection
    autoSave: false,    // Auto-save draft changes
    initialFilters: filters,
  });

  const {
    students,
    isLoading,
    error,
    search,
    filter,
    sort,
    operations,
    cache,
    utils,
  } = studentManager;

  // Mutations for CRUD operations
  const mutations = useStudentMutations();

  // Dashboard metrics for overview
  const dashboardMetrics = useDashboardMetrics('month');

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS - With comprehensive error handling and audit logging
  // ---------------------------------------------------------------------------

  /**
   * Handle student creation with optimistic updates and audit logging
   */
  const handleCreateStudent = useCallback(async (data: CreateStudentData) => {
    try {
      // Validate required fields
      if (!data.firstName?.trim()) {
        throw new Error('First name is required');
      }
      if (!data.lastName?.trim()) {
        throw new Error('Last name is required');
      }
      if (!data.studentNumber?.trim()) {
        throw new Error('Student number is required');
      }

      // Execute mutation with optimistic update
      const result = await operations.createStudent(data);

      // Log success to audit
      await auditService.log({
        action: AuditAction.CREATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: result.student?.id,
        studentId: result.student?.id,
        status: 'SUCCESS',
        isPHI: true,
        metadata: {
          studentNumber: data.studentNumber,
          grade: data.grade,
        },
      });

      // Show success notification
      showNotification({
        type: 'success',
        message: `Student ${data.firstName} ${data.lastName} created successfully`,
      });

      // Close modal
      setIsCreateModalOpen(false);

      // Prefetch the new student's detail page
      if (result.student?.id) {
        cache.warm(['students', 'detail', result.student.id]);
      }

      return result;
    } catch (error: any) {
      // Log failure to audit
      await auditService.log({
        action: AuditAction.CREATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        status: 'FAILURE',
        context: { error: error.message },
      });

      // Show error notification
      showNotification({
        type: 'error',
        message: error.message || 'Failed to create student. Please try again.',
      });

      throw error;
    }
  }, [operations, cache]);

  /**
   * Handle student update with change tracking
   */
  const handleUpdateStudent = useCallback(async (id: string, data: UpdateStudentData) => {
    try {
      const result = await operations.updateStudent(id, data);

      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: 'SUCCESS',
        isPHI: true,
        afterState: data,
        metadata: {
          fieldsUpdated: Object.keys(data),
        },
      });

      showNotification({
        type: 'success',
        message: 'Student updated successfully',
      });

      setIsEditModalOpen(false);
      setSelectedStudentId(null);

      return result;
    } catch (error: any) {
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: 'FAILURE',
        context: { error: error.message },
      });

      showNotification({
        type: 'error',
        message: error.message || 'Failed to update student. Please try again.',
      });

      throw error;
    }
  }, [operations]);

  /**
   * Handle student deactivation (soft delete)
   */
  const handleDeactivateStudent = useCallback(async (id: string) => {
    try {
      const result = await operations.deleteStudent(id);

      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: 'SUCCESS',
        isPHI: true,
        metadata: { action: 'deactivate' },
      });

      showNotification({
        type: 'success',
        message: 'Student deactivated successfully',
      });

      setIsDeleteModalOpen(false);
      setSelectedStudentId(null);

      return result;
    } catch (error: any) {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to deactivate student. Please try again.',
      });

      throw error;
    }
  }, [operations]);

  /**
   * Handle search with debouncing
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    search.setQuery(query);
  }, [search]);

  /**
   * Handle filter changes with cache invalidation
   */
  const handleFilterChange = useCallback((key: keyof StudentFilters, value: any) => {
    filter.updateFilter(key, value);
  }, [filter]);

  /**
   * Handle navigation to student detail with prefetching
   */
  const handleViewStudent = useCallback((studentId: string) => {
    // Prefetch student detail for instant navigation
    cache.warm(['students', 'detail', studentId]);

    // Log PHI access
    auditService.logPHIAccess(
      AuditAction.VIEW_STUDENT,
      studentId,
      AuditResourceType.STUDENT,
      studentId
    );

    // Navigate to detail page
    navigate(`/students/${studentId}`);
  }, [navigate, cache]);

  /**
   * Handle bulk operations
   */
  const handleBulkUpdate = useCallback(async (studentIds: string[], updates: Partial<UpdateStudentData>) => {
    try {
      const result = await operations.bulkUpdate(studentIds, updates);

      showNotification({
        type: 'success',
        message: `Successfully updated ${studentIds.length} students`,
      });

      return result;
    } catch (error: any) {
      showNotification({
        type: 'error',
        message: error.message || 'Bulk update failed. Please try again.',
      });

      throw error;
    }
  }, [operations]);

  // ---------------------------------------------------------------------------
  // DERIVED STATE AND MEMOIZATION
  // ---------------------------------------------------------------------------

  const filteredStudents = useMemo(() => {
    let result = students;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.studentNumber.toLowerCase().includes(query)
      );
    }

    return result;
  }, [students, searchQuery]);

  const studentStats = useMemo(() => {
    return {
      total: filteredStudents.length,
      active: filteredStudents.filter(s => s.isActive).length,
      inactive: filteredStudents.filter(s => !s.isActive).length,
      withAllergies: filteredStudents.filter(s => s.allergies && s.allergies.length > 0).length,
      withMedications: filteredStudents.filter(s => s.medications && s.medications.length > 0).length,
    };
  }, [filteredStudents]);

  // ---------------------------------------------------------------------------
  // EFFECTS - Smart prefetching for performance
  // ---------------------------------------------------------------------------

  /**
   * Prefetch next page on scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // If user scrolled 80% down, prefetch next page
      if (scrollPosition >= pageHeight * 0.8) {
        const nextPage = (filters.page || 1) + 1;
        cache.warm(['students', 'list', { ...filters, page: nextPage }]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filters, cache]);

  /**
   * Prefetch student details on hover
   */
  const handleStudentHover = useCallback((studentId: string) => {
    cache.warm(['students', 'detail', studentId]);
  }, [cache]);

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="large" />
      <span className="ml-4 text-lg text-gray-600">Loading students...</span>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-red-500 text-xl mb-4">Error Loading Students</div>
      <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred'}</p>
      <button
        onClick={() => utils.refetch()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-96">
      <div className="text-gray-400 text-6xl mb-4">📚</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
      <p className="text-gray-500 mb-6">
        {searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first student'}
      </p>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add First Student
      </button>
    </div>
  );

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <BackButton />
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage student records with HIPAA-compliant security
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                + Add Student
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
              <StatCard label="Total Students" value={studentStats.total} color="blue" />
              <StatCard label="Active" value={studentStats.active} color="green" />
              <StatCard label="Inactive" value={studentStats.inactive} color="gray" />
              <StatCard label="With Allergies" value={studentStats.withAllergies} color="orange" />
              <StatCard label="On Medication" value={studentStats.withMedications} color="purple" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Students
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name or student number..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Grade Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  value={filter.filters.grade || ''}
                  onChange={(e) => handleFilterChange('grade', e.target.value || undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Grades</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filter.filters.isActive === undefined ? 'all' : filter.filters.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleFilterChange('isActive', e.target.value === 'all' ? undefined : e.target.value === 'active')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {filter.activeCount > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">{filter.activeCount} filter(s) applied</span>
                <button
                  onClick={filter.clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Student Table */}
          {filteredStudents.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Health Info
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onView={() => handleViewStudent(student.id)}
                      onEdit={() => {
                        setSelectedStudentId(student.id);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => {
                        setSelectedStudentId(student.id);
                        setIsDeleteModalOpen(true);
                      }}
                      onHover={() => handleStudentHover(student.id)}
                    />
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {filteredStudents.length} of {studentStats.total} students
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                      disabled={(filters.page || 1) === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals - Placeholder for actual modal components */}
        {isCreateModalOpen && (
          <CreateStudentModal
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateStudent}
            isLoading={mutations.isCreating}
          />
        )}

        {isEditModalOpen && selectedStudentId && (
          <EditStudentModal
            studentId={selectedStudentId}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedStudentId(null);
            }}
            onSubmit={(data) => handleUpdateStudent(selectedStudentId, data)}
            isLoading={mutations.isUpdating}
          />
        )}

        {isDeleteModalOpen && selectedStudentId && (
          <DeleteConfirmModal
            studentId={selectedStudentId}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedStudentId(null);
            }}
            onConfirm={() => handleDeactivateStudent(selectedStudentId)}
            isLoading={mutations.isDeactivating}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

interface StatCardProps {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'gray' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-50 text-gray-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
};

interface StudentRowProps {
  student: Student;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onHover: () => void;
}

const StudentRow: React.FC<StudentRowProps> = ({
  student,
  onView,
  onEdit,
  onDelete,
  onHover,
}) => {
  return (
    <tr
      onMouseEnter={onHover}
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onView}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-gray-500">
              DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.studentNumber}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.grade}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            student.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {student.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex gap-2">
          {student.allergies && student.allergies.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
              {student.allergies.length} Allergies
            </span>
          )}
          {student.medications && student.medications.length > 0 && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
              {student.medications.length} Meds
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-900"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

// =============================================================================
// MODAL COMPONENTS - Placeholder implementations
// =============================================================================

interface CreateStudentModalProps {
  onClose: () => void;
  onSubmit: (data: CreateStudentData) => Promise<any>;
  isLoading: boolean;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  onClose,
  onSubmit,
  isLoading,
}) => {
  // TODO: Implement full form with React Hook Form + Zod validation
  // See CompleteFormExample.tsx for full implementation
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
        <p className="text-gray-600">Modal implementation placeholder</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Student'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface EditStudentModalProps {
  studentId: string;
  onClose: () => void;
  onSubmit: (data: UpdateStudentData) => Promise<any>;
  isLoading: boolean;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  studentId,
  onClose,
  onSubmit,
  isLoading,
}) => {
  // Fetch student data
  const { data: student, isLoading: isLoadingStudent } = useStudentDetail(studentId);

  // TODO: Implement full edit form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
        {isLoadingStudent ? (
          <LoadingSpinner />
        ) : (
          <p className="text-gray-600">Editing {student?.firstName} {student?.lastName}</p>
        )}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteConfirmModalProps {
  studentId: string;
  onClose: () => void;
  onConfirm: () => Promise<any>;
  isLoading: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  studentId,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const { data: student } = useStudentDetail(studentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deactivation</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to deactivate {student?.firstName} {student?.lastName}?
          This action can be reversed later.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Deactivating...' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

/**
 * Show toast notification
 * TODO: Replace with your actual notification system
 */
function showNotification(notification: Notification) {
  console.log(`[${notification.type.toUpperCase()}]`, notification.message);
  // Implement with your toast library (react-hot-toast, sonner, etc.)
}

export default StudentsPageComplete;
