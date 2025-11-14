/**
 * Allergy Module Barrel Export
 * Provides centralized exports for the allergy module
 */

// Module
export { AllergyModule } from './allergy.module';

// Services
export * from './services';

// Controller
export { AllergyController } from './allergy.controller';

// Entities
export { Allergy, AllergyType, AllergySeverity } from '@/database/models';
