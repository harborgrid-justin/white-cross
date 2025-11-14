/**
 * Barrel file for allergy module
 * Provides clean public API
 */

// Module files
export * from './allergy.controller';
export * from './allergy.module';
export * from './allergy.service';

// Submodules
export * from './dto';
export { Allergy } from '@/database/models';

