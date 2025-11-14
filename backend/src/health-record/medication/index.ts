/**
 * Barrel file for medication module
 * Provides clean public API
 */

// Module files
export * from './medication.controller';
export * from './medication.module';
export * from './medication.service';

// Submodules
export * from './dto';
export { Medication } from '@/database/models';

