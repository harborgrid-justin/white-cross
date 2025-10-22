/**
 * Reports Domain Exports
 * 
 * Central export point for all reports-related hooks and utilities.
 * 
 * @module hooks/domains/reports
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Query hooks
export {
  useReportsList,
  useReportDetails,
  useReportGeneration,
  useReportTemplates,
} from './queries/useReportsQueries';

// Mutation hooks
export {
  useReportsMutations,
  useGenerateReport,
  useDeleteReport,
} from './mutations/useReportsMutations';

// Configuration
export * from './config';
