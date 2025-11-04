/**
 * Students Domain - Central Export Hub
 *
 * Enterprise-grade React hooks for student data management with comprehensive
 * FERPA compliance, PHI handling, and educational data privacy protections.
 * Provides unified access to student queries, mutations, and composite hooks
 * with built-in caching, optimistic updates, and audit logging.
 *
 * @module hooks/domains/students
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Architecture Overview**:
 * The students domain is organized into four primary categories:
 * 1. **Configuration** - Domain settings, query keys, cache strategies
 * 2. **Queries** - Data fetching hooks with TanStack Query
 * 3. **Mutations** - Data modification hooks with optimistic updates
 * 4. **Composites** - High-level hooks combining multiple concerns
 *
 * **FERPA Compliance**:
 * All student data operations comply with the Family Educational Rights and
 * Privacy Act (FERPA). Access to student records is authenticated, authorized,
 * logged for audit trails, cached appropriately, and sanitized.
 *
 * **PHI Handling**:
 * Student health records are treated as Protected Health Information (PHI)
 * requiring dual compliance with both FERPA and HIPAA. Health data is NOT
 * cached, requires explicit permissions, and all access is audit-logged.
 *
 * **Data Sensitivity Levels**:
 * - **Public**: Directory information (names, grades, dates)
 * - **Internal**: Education records (enrollment, attendance, academics)
 * - **Confidential**: Sensitive records (contacts, disciplinary records)
 * - **PHI**: Health information (medical records, medications, allergies)
 * - **Critical**: Emergency data (safety alerts, critical medications)
 *
 * @see {@link file://./README.md | Complete Documentation and Examples}
 * @see {@link https://tanstack.com/query/latest/docs/react/overview | TanStack Query Docs}
 * @see {@link https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html | FERPA Guidance}
 * @see {@link https://www.hhs.gov/hipaa/index.html | HIPAA Compliance}
 */

// =====================
// Configuration Exports
// =====================

/**
 * Domain configuration, query keys, cache strategies, and constants.
 *
 * **Exports**:
 * - `studentQueryKeys` - TanStack Query key factory
 * - `STUDENT_DATA_SENSITIVITY` - Data sensitivity level mappings
 * - `STUDENT_OPERATIONS` - Audit operation type constants
 * - `STUDENT_CACHE_CONFIG` - Cache configuration by sensitivity
 *
 * @see {@link studentQueryKeys} for query key factory
 * @see {@link STUDENT_DATA_SENSITIVITY} for sensitivity mappings
 */
export * from './config';

// =====================
// Query Hook Exports
// =====================

/**
 * Data fetching hooks using TanStack Query with FERPA-compliant caching.
 *
 * **Primary Query Hooks**:
 * - `useStudents` - Paginated list with filters and Redux integration
 * - `useStudentDetail` - Individual student by ID
 * - `useStudentProfile` - Complete profile with related data
 * - `useInfiniteStudents` - Infinite scroll support
 * - `useAssignedStudents` - Students assigned to current nurse
 * - `useRecentStudents` - Recently enrolled students
 * - `useStudentsByGrade` - Filter by grade level
 *
 * **Search Hooks**:
 * - `useStudentSearch` - Real-time search with debouncing
 * - `useAdvancedFilters` - Multi-criteria filtering
 * - `useStudentSearchAndFilter` - Composite search/filter/sort
 *
 * **Statistics Hooks**:
 * - `useEnrollmentStats` - Enrollment trends and metrics
 * - `useHealthStats` - Health-related statistics
 * - `useActivityStats` - Activity and engagement metrics
 * - `useComplianceStats` - Compliance and regulatory metrics
 * - `useDashboardMetrics` - Comprehensive dashboard data
 *
 * @see {@link useStudents} for primary list query
 * @see {@link useStudentDetail} for detail query
 */

// Export all query hooks from the queries module
export * from './queries';

// =====================
// Mutation Hook Exports
// =====================

/**
 * Data modification hooks with optimistic updates and FERPA audit logging.
 *
 * **Standard Mutations** (Server confirmation before UI update):
 * - `useStudentMutations` - Complete CRUD operations
 * - `useCreateStudent` - Create new student record
 * - `useUpdateStudent` - Update student data
 * - `useDeleteStudent` - Deactivate student (soft delete)
 * - `useDeactivateStudent` - Deactivate student (soft delete)
 * - `useReactivateStudent` - Reactivate student
 *
 * **Transfer and Bulk Operations**:
 * - `useTransferStudent` - Transfer student to another nurse
 * - `useBulkUpdateStudents` - Bulk updates with validation
 * - `usePermanentDeleteStudent` - Permanent deletion (CAUTION)
 *
 * **Optimistic Mutations** (Immediate UI update with rollback on error):
 * - `useOptimisticStudents` - Optimistic CRUD operations
 * - `useOptimisticStudentCreate` - Optimistic enrollment
 * - `useOptimisticStudentUpdate` - Optimistic updates
 * - `useOptimisticStudentTransfer` - Optimistic nurse transfer
 * - `useOptimisticStudentDeactivate` - Optimistic deactivation
 *
 * **Management Operations**:
 * - `useStudentManagement` - High-level management workflows
 * - `useStudentMutationsComposite` - Composite mutation hook
 *
 * @see {@link useOptimisticStudents} for recommended mutation hook
 * @see {@link useStudentMutations} for standard mutations
 */

// Export all mutation hooks from the mutations module
export * from './mutations';

// =====================
// Composite Hook Exports
// =====================

/**
 * High-level composite hooks combining multiple concerns for common workflows.
 *
 * **Composite Hooks**:
 * - `useStudentManager` - Complete student management workflow
 * - `useStudentDashboard` - Dashboard data and metrics
 * - `useStudentProfile` - Comprehensive student profile
 * - `useBulkStudentOperations` - Bulk operations management
 *
 * @see {@link useStudentManager} for management workflows
 * @see {@link useStudentDashboard} for dashboard data
 */
export * from './composites';

// =====================
// Utility Hook Exports
// =====================

/**
 * Domain-specific utility hooks for student data handling.
 *
 * **Utility Hooks**:
 * - `useStudentAllergies` - Student allergy management
 * - `useStudentPhoto` - Student photo operations
 *
 * @see {@link useStudentAllergies} for allergy management
 * @see {@link useStudentPhoto} for photo operations
 */
export * from './utils';
