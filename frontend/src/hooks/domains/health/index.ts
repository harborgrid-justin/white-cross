/**
 * Health Domain - Central Export Hub
 * 
 * Enterprise hook architecture for health records and medical data management
 * with HIPAA compliance and PHI protection.
 */

// Health Records Queries
export * from './queries/useHealthRecords';
export * from './queries/useHealthRecordsData';

// PHI and Cleanup Utilities
export * from './healthRecordsCleanup';