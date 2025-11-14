/**
 * Barrel file for medication-interaction module
 * Provides clean public API
 */

// Module files
export * from './medication-interaction.controller';
export * from './medication-interaction.module';
export * from './medication-interaction.service';

// Submodules
export * from './dto';
export { Medication, StudentMedication } from '@/database/models';

