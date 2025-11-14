/**
 * Medication Module Barrel Export
 * Provides centralized exports for the medication module
 */

// Module
export { MedicationModule } from './medication.module';

// DTOs
export * from './dto';

// Entities
export {
  Medication,
  Medication as MedicationEntity,
  StudentMedication,
  MedicationWithStudentContext,
  PaginatedMedicationResponse,
} from '@/database/models';

// Services
export * from './services';

export * from './medication.controller';
export * from './medication.repository';
