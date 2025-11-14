/**
 * Barrel file for incident-report module
 * Provides clean public API
 */

// Module files
export * from './incident-report.controller';
export * from './incident-report.module';

// Submodules
export * from './dto';
export { IncidentReport, FollowUpAction, WitnessStatement } from '@/database/models';
export * from './enums';
export * from './services';

