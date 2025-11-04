/**
 * WF-COMP-131 | index.ts - Health records hooks barrel export
 * Purpose: Re-export all health records hooks for backward compatibility
 * Upstream: All health records hook modules | Dependencies: None
 * Downstream: Components, pages | Called by: Application code
 * Related: Health records hooks modules
 * Exports: All hooks from sub-modules | Key Features: Centralized exports
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import aggregation for health records hooks
 * LLM Context: Barrel export for backward compatibility after file breakdown
 */

// Export types and error classes
export * from './types';

// Export configuration and utilities
export { healthRecordKeys, STALE_TIME, CACHE_TIME, RETRY_CONFIG } from './healthRecordsConfig';
export { handleQueryError, shouldRetry } from './healthRecordsUtils';

// Export core health records query hooks
export {
  useHealthRecordsCleanup,
  useHealthRecords,
  useHealthRecordDetail,
  useHealthRecordTimeline,
  useHealthRecordSummary,
  useHealthRecordSearch,
  useHealthRecordsByType,
  useHealthSummary,
  useSearchHealthRecords,
  usePaginatedHealthRecords,
} from './useHealthRecordsQueries';

// Export core health records mutation hooks
export {
  useCreateHealthRecord,
  useUpdateHealthRecord,
  useDeleteHealthRecord,
  useExportHealthRecords,
  useImportHealthRecords,
  useExportHealthHistory,
} from './useHealthRecordsMutations';

// Export allergy hooks
export {
  useAllergies,
  useAllergyDetail,
  useCriticalAllergies,
  useAllergyContraindications,
  useAllergyStatistics,
  useCreateAllergy,
  useUpdateAllergy,
  useDeleteAllergy,
  useVerifyAllergy,
} from './useAllergies';

// Export chronic condition hooks
export {
  useChronicConditions,
  useConditionDetail,
  useActiveConditions,
  useConditionsNeedingReview,
  useConditionStatistics,
  useCreateCondition,
  useUpdateCondition,
  useDeleteCondition,
  useUpdateConditionStatus,
} from './useChronicConditions';

// Export vaccination hooks
export {
  useVaccinations,
  useVaccinationDetail,
  useVaccinationCompliance,
  useUpcomingVaccinations,
  useVaccinationReport,
  useVaccinationStatistics,
  useCreateVaccination,
  useUpdateVaccination,
  useDeleteVaccination,
} from './useVaccinations';

// Export screening hooks
export {
  useScreenings,
  useScreeningDetail,
  useScreeningsDue,
  useScreeningStatistics,
  useCreateScreening,
  useUpdateScreening,
  useDeleteScreening,
} from './useScreenings';

// Export growth measurement hooks
export {
  useGrowthMeasurements,
  useGrowthMeasurementDetail,
  useGrowthTrends,
  useGrowthConcerns,
  useGrowthPercentiles,
  useCreateGrowthMeasurement,
  useUpdateGrowthMeasurement,
  useDeleteGrowthMeasurement,
} from './useGrowthMeasurements';

// Export vital signs hooks
export {
  useVitalSigns,
  useLatestVitals,
  useVitalTrends,
  useCreateVitalSigns,
  useUpdateVitalSigns,
  useDeleteVitalSigns,
  useRecentVitals,
  useRecordVitals,
} from './useVitalSigns';
