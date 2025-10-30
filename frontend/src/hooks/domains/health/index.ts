/**
 * Health Domain - Central Export Hub
 *
 * Enterprise-grade hook architecture for comprehensive health records and medical data management
 * with HIPAA compliance, PHI protection, and healthcare regulatory standards.
 *
 * This module provides a complete suite of React hooks for managing:
 * - Student health records (assessments, visits, incidents)
 * - Allergies and life-threatening conditions
 * - Chronic conditions and ongoing treatments
 * - Vaccination records and CDC compliance tracking
 * - Growth measurements and percentile calculations
 * - Health screenings (vision, hearing, scoliosis, dental)
 * - Vital signs monitoring
 * - HIPAA-compliant data cleanup and session management
 *
 * @module hooks/domains/health
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @example
 * ```typescript
 * // Import health record hooks
 * import { useHealthRecords, useAllergies, useVaccinations } from '@/hooks/domains/health';
 *
 * // Fetch student health data
 * function StudentHealthProfile({ studentId }: { studentId: string }) {
 *   const { data: records } = useHealthRecords(studentId);
 *   const { data: allergies } = useAllergies(studentId);
 *   const { data: vaccinations } = useVaccinations(studentId);
 *
 *   return (
 *     <div>
 *       <AllergiesAlert allergies={allergies} />
 *       <VaccinationStatus vaccinations={vaccinations} />
 *       <HealthRecordsTimeline records={records} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // HIPAA-compliant automatic cleanup
 * import { useHealthRecordsCleanup, SessionMonitor } from '@/hooks/domains/health';
 *
 * function HealthRecordsPage() {
 *   const queryClient = useQueryClient();
 *
 *   // Automatic cleanup on unmount and inactivity
 *   useHealthRecordsCleanup(currentStudentId);
 *
 *   // Manual session monitoring
 *   const monitor = new SessionMonitor({
 *     timeoutMs: 15 * 60 * 1000,
 *     onTimeout: () => {
 *       // Clear PHI and redirect to login
 *       clearAllPHI(queryClient);
 *       window.location.href = '/login';
 *     }
 *   });
 *
 *   return <HealthRecordsView />;
 * }
 * ```
 *
 * @remarks
 * HIPAA Compliance:
 * - All hooks implement PHI-safe error messages to prevent data leakage
 * - Automatic session timeout and data cleanup after 15 minutes of inactivity
 * - No localStorage caching for safety-critical data (allergies, vital signs)
 * - Comprehensive audit logging for all PHI access
 * - Query keys designed for precise cache invalidation
 *
 * TanStack Query Integration:
 * - All hooks use @tanstack/react-query for server state management
 * - Healthcare-appropriate cache strategies (NO cache for safety-critical data)
 * - NO optimistic updates for healthcare data (must be server-confirmed)
 * - Automatic retry logic with exponential backoff
 * - Stale-while-revalidate pattern for non-critical data
 *
 * CDC & Healthcare Standards:
 * - Immunization schedules follow CDC/ACIP guidelines
 * - Growth charts use CDC/WHO percentile calculations
 * - Vital signs monitoring with age-appropriate reference ranges
 * - ICD-10 coding for diagnoses
 * - CPT coding for procedures
 *
 * @see {@link https://www.hhs.gov/hipaa/index.html} HIPAA Regulations
 * @see {@link https://www.cdc.gov/vaccines/schedules/index.html} CDC Immunization Schedules
 * @see {@link https://www.cdc.gov/growthcharts/index.htm} CDC Growth Charts
 */

// ============================================================================
// Health Records Queries
// ============================================================================

/**
 * Comprehensive health records query hooks with enterprise patterns.
 *
 * Includes hooks for:
 * - Health records CRUD operations
 * - Allergies management (safety-critical, NO cache)
 * - Chronic conditions tracking
 * - Vaccination records and compliance
 * - Growth measurements and percentile calculations
 * - Health screenings (vision, hearing, scoliosis, dental)
 * - Vital signs monitoring (real-time critical, NO cache)
 * - Health summaries and timelines
 *
 * @see {@link module:hooks/domains/health/queries/useHealthRecords}
 */
export * from './queries/useHealthRecords';

/**
 * Data management hook for health records with local state and CRUD operations.
 *
 * Provides direct API integration for health records data fetching and mutations
 * with loading states and error handling.
 *
 * @see {@link module:hooks/domains/health/queries/useHealthRecordsData}
 */
export * from './queries/useHealthRecordsData';

// ============================================================================
// PHI and HIPAA Compliance Utilities
// ============================================================================

/**
 * HIPAA-compliant data cleanup utilities and session monitoring.
 *
 * Provides:
 * - Automatic PHI cleanup on component unmount
 * - Session timeout monitoring with configurable timeouts
 * - Secure data disposal and memory overwriting
 * - Audit logging for compliance tracking
 * - Page visibility change handlers
 *
 * @see {@link module:hooks/domains/health/healthRecordsCleanup}
 */
export * from './healthRecordsCleanup';
