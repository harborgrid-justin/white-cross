/**
 * Composite Student Hooks
 * 
 * High-level hooks that combine multiple concerns for common use cases,
 * providing convenient interfaces for complex student management workflows.
 * 
 * @module hooks/students/composite
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useStudents, useStudentDetail, useInfiniteStudents } from './coreQueries';
import { useStudentMutations } from './mutations';
import { useStudentSearchAndFilter } from './searchAndFilter';
import { useDashboardMetrics, useEnrollmentStats, useHealthStats } from './statistics';
import { useCacheManager, usePHIHandler, useOptimisticUpdates } from './utils';
import { useStudentsWithRedux, useStudentSelection, useBulkOperations } from './redux';
import type { Student, StudentFilters } from '@/types/student.types';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Complete student management interface for full CRUD operations
 * 
 * @param options - Configuration options
 * @returns Complete student management interface
 * 
 * @example
 * ```tsx
 * const studentManager = useStudentManager({
 *   enableRedux: true,
 *   enablePHI: true,
 *   autoSave: true
 * });
 * 
 * return (
 *   <StudentManagementInterface
 *     {...studentManager}
 *   />
 * );
 * ```
 */
export const useStudentManager = (options?: {
  enableRedux?: boolean;
  enablePHI?: boolean;
  autoSave?: boolean;
  initialFilters?: Partial<StudentFilters>;
}) => {
  const {
    enableRedux = false,
    enablePHI = true,
    autoSave = false,
    initialFilters = {},
  } = options || {};

  // Core data hooks
  const searchAndFilter = useStudentSearchAndFilter({
    initialFilters,
    autoApply: true,
    enableSuggestions: true,
  });

  const mutations = useStudentMutations();
  const cacheManager = useCacheManager();
  const phiHandler = usePHIHandler({ 
    sanitize: enablePHI,
    logAccess: enablePHI,
  });
  const optimisticUpdates = useOptimisticUpdates();

  // Optional Redux integration
  const reduxIntegration = useStudentsWithRedux(
    enableRedux ? searchAndFilter.appliedFilters : undefined
  );

  // Determine which data source to use
  const students = enableRedux ? reduxIntegration.students : searchAndFilter.results;
  const isLoading = enableRedux ? reduxIntegration.isLoading : searchAndFilter.isLoading;
  const error = enableRedux ? reduxIntegration.error : searchAndFilter.error;

  // Enhanced CRUD operations with optimistic updates
  const enhancedOperations = useMemo(() => ({
    createStudent: async (data: any) => {
      const rollback = optimisticUpdates.performOptimisticUpdate(
        'create-student',
        'temp-id',
        data as Student
      );

      try {
        const result = await mutations.createStudent.mutateAsync(data);
        cacheManager.addStudentToCache(result);
        
        if (enablePHI) {
          phiHandler.logDataAccess('student-create', result.id);
        }
        
        return result;
      } catch (error) {
        rollback();
        throw error;
      }
    },

    updateStudent: async (id: string, data: Partial<Student>) => {
      const rollback = optimisticUpdates.performOptimisticUpdate(
        `update-student-${id}`,
        id,
        data
      );

      try {
        const result = await mutations.updateStudent.mutateAsync({ id, data });
        
        if (enablePHI) {
          phiHandler.logDataAccess('student-update', id, { fields: Object.keys(data) });
        }
        
        return result;
      } catch (error) {
        rollback();
        throw error;
      }
    },

    deleteStudent: async (id: string) => {
      if (enablePHI && !phiHandler.checkPHIPermission('delete', id)) {
        throw new Error('Insufficient permissions to delete student');
      }

      const result = await mutations.deactivateStudent.mutateAsync(id);
      cacheManager.removeStudentFromCache(id);
      
      if (enablePHI) {
        phiHandler.logDataAccess('student-delete', id);
      }
      
      return result;
    },

    bulkUpdate: async (ids: string[], data: Partial<Student>) => {
      const rollbacks = ids.map(id => 
        optimisticUpdates.performOptimisticUpdate(`bulk-update-${id}`, id, data)
      );

      try {
        const result = await mutations.bulkUpdateStudents.mutateAsync({ studentIds: ids, updates: data });
        
        if (enablePHI) {
          phiHandler.logDataAccess('student-bulk-update', undefined, { 
            studentIds: ids, 
            fields: Object.keys(data) 
          });
        }
        
        return result;
      } catch (error) {
        rollbacks.forEach(rollback => rollback());
        throw error;
      }
    },
  }), [mutations, optimisticUpdates, cacheManager, phiHandler, enablePHI]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      // Auto-save logic would go here
      // This might save draft changes, cache state, etc.
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoSave]);

  return {
    // Data
    students: enablePHI ? students.map(phiHandler.sanitizeData) : students,
    selectedStudents: enableRedux ? reduxIntegration.selectedStudents : [],
    
    // State
    isLoading,
    error: error as ApiError | null,
    hasData: students.length > 0,
    
    // Search and filtering
    search: {
      query: searchAndFilter.query,
      setQuery: searchAndFilter.setQuery,
      suggestions: searchAndFilter.suggestions,
      clearSearch: searchAndFilter.clearSearch,
    },
    
    filter: {
      filters: searchAndFilter.filters,
      updateFilter: searchAndFilter.updateFilter,
      clearFilters: searchAndFilter.clearFilters,
      activeCount: searchAndFilter.activeFilterCount,
    },
    
    sort: {
      sortBy: searchAndFilter.sortBy,
      updateSort: searchAndFilter.updateSort,
      options: searchAndFilter.sortOptions,
    },
    
    // Enhanced operations
    operations: enhancedOperations,
    
    // Selection (if Redux enabled)
    selection: enableRedux ? {
      selectedIds: reduxIntegration.selectedStudents.map(s => s.id),
      hasSelection: reduxIntegration.hasSelection,
      selectStudent: reduxIntegration.actions.selectStudent,
      clearSelection: reduxIntegration.actions.clearSelection,
    } : undefined,
    
    // Cache management
    cache: {
      invalidate: cacheManager.invalidatePattern,
      warm: cacheManager.prefetchData,
      stats: cacheManager.getCacheStats,
    },
    
    // Utility functions
    utils: {
      refetch: searchAndFilter.refetch,
      clearAll: searchAndFilter.clearAll,
      saveSearch: searchAndFilter.saveCurrentSearch,
    },
  };
};

/**
 * Dashboard hook that combines all necessary data for student dashboard
 * 
 * @param timeRange - Time range for dashboard metrics
 * @returns Complete dashboard data
 * 
 * @example
 * ```tsx
 * const dashboard = useStudentDashboard('month');
 * 
 * if (dashboard.isLoading) return <DashboardSkeleton />;
 * 
 * return (
 *   <Dashboard
 *     metrics={dashboard.metrics}
 *     recentStudents={dashboard.recentStudents}
 *     alerts={dashboard.alerts}
 *     quickActions={dashboard.quickActions}
 *   />
 * );
 * ```
 */
export const useStudentDashboard = (timeRange: 'today' | 'week' | 'month' | 'year' = 'month') => {
  // Core dashboard data
  const dashboardMetrics = useDashboardMetrics(timeRange);
  const enrollmentStats = useEnrollmentStats(timeRange);
  const healthStats = useHealthStats(timeRange);
  
  // Recent students
  const recentStudentsQuery = useStudents({ 
    sortBy: 'updatedAt', 
    sortOrder: 'desc', 
    limit: 10 
  });

  // Quick stats
  const quickStats = useMemo(() => {
    if (!dashboardMetrics.metrics) return null;

    return {
      totalStudents: dashboardMetrics.metrics.enrollment.total,
      activeStudents: dashboardMetrics.metrics.enrollment.active,
      newThisMonth: dashboardMetrics.metrics.enrollment.newThisMonth,
      highRiskStudents: dashboardMetrics.metrics.risk.highRiskStudents,
      criticalAlerts: dashboardMetrics.metrics.risk.criticalAlerts,
      complianceScore: dashboardMetrics.metrics.compliance.auditReadiness,
    };
  }, [dashboardMetrics.metrics]);

  // Quick actions with analytics
  const quickActions = useMemo(() => [
    {
      id: 'add-student',
      label: 'Add New Student',
      icon: 'UserPlus',
      count: 0,
      priority: 'high' as const,
    },
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      icon: 'Clock',
      count: dashboardMetrics.metrics?.risk.studentsNeedingAttention || 0,
      priority: 'medium' as const,
    },
    {
      id: 'health-alerts',
      label: 'Health Alerts',
      icon: 'AlertTriangle',
      count: dashboardMetrics.metrics?.risk.criticalAlerts || 0,
      priority: 'high' as const,
    },
    {
      id: 'reports',
      label: 'Generate Reports',
      icon: 'FileText',
      count: 0,
      priority: 'low' as const,
    },
  ], [dashboardMetrics.metrics]);

  // Combined loading state
  const isLoading = 
    dashboardMetrics.isLoading || 
    enrollmentStats.isLoading || 
    healthStats.isLoading || 
    recentStudentsQuery.isLoading;

  // Combined error state
  const error = 
    dashboardMetrics.error || 
    enrollmentStats.error || 
    healthStats.error || 
    recentStudentsQuery.error;

  return {
    // Primary metrics
    metrics: dashboardMetrics.metrics,
    enrollment: enrollmentStats.data,
    health: healthStats.data,
    
    // Quick overview
    quickStats,
    quickActions,
    alerts: dashboardMetrics.metrics?.alerts || [],
    
    // Recent activity
    recentStudents: recentStudentsQuery.data?.students.slice(0, 5) || [],
    
    // State
    isLoading,
    error: error as ApiError | null,
    lastUpdated: dashboardMetrics.metrics?.lastUpdated,
    
    // Actions
    refetch: () => {
      dashboardMetrics.refetch();
      enrollmentStats.refetch();
      healthStats.refetch();
      recentStudentsQuery.refetch();
    },
  };
};

/**
 * Student profile hook that combines all data for a complete student profile
 * 
 * @param studentId - Student ID
 * @param options - Configuration options
 * @returns Complete student profile data
 * 
 * @example
 * ```tsx
 * const profile = useStudentProfile(studentId, {
 *   includeHealthRecords: true,
 *   includeMedications: true,
 *   enablePHI: true
 * });
 * 
 * return (
 *   <StudentProfilePage
 *     student={profile.student}
 *     healthData={profile.healthData}
 *     medications={profile.medications}
 *     timeline={profile.timeline}
 *   />
 * );
 * ```
 */
export const useStudentProfile = (
  studentId: string,
  options?: {
    includeHealthRecords?: boolean;
    includeMedications?: boolean;
    includeIncidents?: boolean;
    enablePHI?: boolean;
    enableOptimisticUpdates?: boolean;
  }
) => {
  const {
    includeHealthRecords = true,
    includeMedications = true,
    includeIncidents = true,
    enablePHI = true,
    enableOptimisticUpdates = true,
  } = options || {};

  // Core student data
  const studentQuery = useStudentDetail(studentId);
  const mutations = useStudentMutations();
  const phiHandler = usePHIHandler({ 
    sanitize: enablePHI,
    logAccess: enablePHI,
  });
  const optimisticUpdates = useOptimisticUpdates();

  // Log access for audit trail
  useEffect(() => {
    if (studentId && enablePHI) {
      phiHandler.logDataAccess('student-profile-view', studentId);
    }
  }, [studentId, enablePHI, phiHandler]);

  // Enhanced update function with optimistic updates
  const updateStudent = useCallback(async (updates: Partial<Student>) => {
    if (!studentId) return;

    let rollback: (() => void) | undefined;
    
    if (enableOptimisticUpdates) {
      rollback = optimisticUpdates.performOptimisticUpdate(
        `profile-update-${studentId}`,
        studentId,
        updates
      );
    }

    try {
      const result = await mutations.updateStudent.mutateAsync({
        id: studentId,
        data: updates,
      });
      
      if (enablePHI) {
        phiHandler.logDataAccess('student-profile-update', studentId, {
          fields: Object.keys(updates),
        });
      }
      
      return result;
    } catch (error) {
      if (rollback) rollback();
      throw error;
    }
  }, [studentId, mutations.updateStudent, optimisticUpdates, phiHandler, enablePHI, enableOptimisticUpdates]);

  // Derived data
  const student = studentQuery.data;
  const sanitizedStudent = enablePHI && student ? phiHandler.sanitizeData(student) : student;

  // Health data aggregation
  const healthData = useMemo(() => {
    if (!student) return null;

    return {
      allergies: student.allergies || [],
      chronicConditions: student.chronicConditions || [],
      medications: includeMedications ? (student.medications || []) : [],
      healthRecords: includeHealthRecords ? (student.healthRecords || []) : [],
      incidents: includeIncidents ? (student.incidentReports || []) : [],
      emergencyContacts: student.emergencyContacts || [],
    };
  }, [student, includeMedications, includeHealthRecords, includeIncidents]);

  // Activity timeline
  const timeline = useMemo(() => {
    if (!student) return [];

    const events = [];

    // Add enrollment
    if (student.enrollmentDate) {
      events.push({
        id: 'enrollment',
        type: 'enrollment',
        date: student.enrollmentDate,
        title: 'Student Enrolled',
        description: `Enrolled in grade ${student.grade}`,
      });
    }

    // Add health records
    if (student.healthRecords) {
      student.healthRecords.forEach(record => {
        events.push({
          id: `health-${record.id}`,
          type: 'health',
          date: record.date,
          title: 'Health Record',
          description: record.type || 'Health record entry',
        });
      });
    }

    // Add incidents
    if (student.incidentReports) {
      student.incidentReports.forEach(incident => {
        events.push({
          id: `incident-${incident.id}`,
          type: 'incident',
          date: incident.dateTime,
          title: 'Incident Report',
          description: incident.description || 'Incident occurred',
        });
      });
    }

    // Sort by date (newest first)
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [student]);

  return {
    // Core data
    student: sanitizedStudent,
    healthData,
    timeline,
    
    // State
    isLoading: studentQuery.isLoading,
    error: studentQuery.error as ApiError | null,
    isFound: !!student,
    
    // Actions
    updateStudent,
    refetch: studentQuery.refetch,
    
    // Mutations
    mutations: {
      isUpdating: mutations.updateStudent.isPending,
      isDeleting: mutations.deactivateStudent.isPending,
      delete: () => mutations.deactivateStudent.mutateAsync(studentId),
      reactivate: () => mutations.reactivateStudent.mutateAsync(studentId),
    },
  };
};

/**
 * Bulk operations hook for managing multiple students
 * 
 * @param options - Configuration options
 * @returns Bulk operations interface
 * 
 * @example
 * ```tsx
 * const bulk = useBulkStudentOperations({
 *   enableRedux: true,
 *   confirmationRequired: true
 * });
 * 
 * return (
 *   <BulkOperationsPanel
 *     selectedCount={bulk.selectedCount}
 *     operations={bulk.availableOperations}
 *     onExecute={bulk.executeOperation}
 *   />
 * );
 * ```
 */
export const useBulkStudentOperations = (options?: {
  enableRedux?: boolean;
  confirmationRequired?: boolean;
  maxBatchSize?: number;
}) => {
  const {
    enableRedux = true,
    confirmationRequired = true,
    maxBatchSize = 50,
  } = options || {};

  const mutations = useStudentMutations();
  const cacheManager = useCacheManager();
  const phiHandler = usePHIHandler({ logAccess: true });
  
  // Redux integration for selection
  const bulkOps = enableRedux ? useBulkOperations() : null;
  
  // Available operations
  const availableOperations = useMemo(() => [
    {
      id: 'bulk-update',
      label: 'Update Selected',
      icon: 'Edit',
      description: 'Update multiple students at once',
      requiresConfirmation: true,
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      icon: 'UserX',
      description: 'Deactivate multiple students',
      requiresConfirmation: true,
      destructive: true,
    },
    {
      id: 'bulk-reactivate',
      label: 'Reactivate Selected',
      icon: 'UserCheck',
      description: 'Reactivate multiple students',
      requiresConfirmation: true,
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: 'Download',
      description: 'Export student data',
      requiresConfirmation: false,
    },
    {
      id: 'bulk-assign-nurse',
      label: 'Assign Nurse',
      icon: 'UserCog',
      description: 'Assign a nurse to selected students',
      requiresConfirmation: true,
    },
  ], []);

  // Execute bulk operation
  const executeOperation = useCallback(async (
    operationId: string,
    data?: any,
    confirmation?: boolean
  ) => {
    if (!bulkOps) {
      throw new Error('Redux is required for bulk operations');
    }

    const { selectedForBulk } = bulkOps;
    
    if (selectedForBulk.length === 0) {
      throw new Error('No students selected');
    }

    if (selectedForBulk.length > maxBatchSize) {
      throw new Error(`Cannot process more than ${maxBatchSize} students at once`);
    }

    const operation = availableOperations.find(op => op.id === operationId);
    if (!operation) {
      throw new Error('Invalid operation');
    }

    if (operation.requiresConfirmation && !confirmation) {
      throw new Error('Confirmation required');
    }

    // Log bulk operation
    phiHandler.logDataAccess('bulk-operation', undefined, {
      operation: operationId,
      studentCount: selectedForBulk.length,
      studentIds: selectedForBulk,
    });

    let result;

    switch (operationId) {
      case 'bulk-update':
        result = await mutations.bulkUpdateStudents.mutateAsync({
          studentIds: selectedForBulk,
          updates: data,
        });
        break;

      case 'bulk-deactivate':
        result = await Promise.all(
          selectedForBulk.map(id => mutations.deactivateStudent.mutateAsync(id))
        );
        break;

      case 'bulk-reactivate':
        result = await Promise.all(
          selectedForBulk.map(id => mutations.reactivateStudent.mutateAsync(id))
        );
        break;

      case 'bulk-export':
        // Export functionality would be implemented here
        result = { exported: selectedForBulk.length };
        break;

      case 'bulk-assign-nurse':
        result = await mutations.bulkUpdateStudents.mutateAsync({
          studentIds: selectedForBulk,
          updates: { nurseId: data.nurseId },
        });
        break;

      default:
        throw new Error('Operation not implemented');
    }

    // Invalidate relevant caches
    await cacheManager.invalidatePattern('student-lists');
    await cacheManager.invalidatePattern('student-statistics');

    // Clear selection after successful operation
    bulkOps.clearBulkSelection();

    return result;
  }, [bulkOps, maxBatchSize, availableOperations, mutations, phiHandler, cacheManager]);

  return {
    // Selection state
    selectedCount: bulkOps?.selectedCount || 0,
    selectedStudents: bulkOps?.selectedStudents || [],
    hasSelection: (bulkOps?.selectedCount || 0) > 0,
    
    // Operations
    availableOperations,
    executeOperation,
    
    // State
    isExecuting: mutations.bulkUpdateStudents.isPending,
    
    // Selection controls
    selectAll: bulkOps?.selectAllForBulk,
    clearSelection: bulkOps?.clearBulkSelection,
    toggleSelection: bulkOps?.toggleBulkSelection,
    
    // Mode controls
    enterBulkMode: bulkOps?.enterBulkMode,
    exitBulkMode: bulkOps?.exitBulkMode,
    isBulkMode: bulkOps?.isBulkMode || false,
  };
};

/**
 * Export all composite hooks
 */
export default {
  useStudentManager,
  useStudentDashboard,
  useStudentProfile,
  useBulkStudentOperations,
};