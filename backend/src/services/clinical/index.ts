/**
 * Clinical Module Barrel Export
 * Provides centralized exports for the clinical module
 */

// Module
export { ClinicalModule } from './clinical.module';

// DTOs
export * from './dto';

// Entities
export {
  ClinicVisit,
  ClinicalNote,
  ClinicalProtocol,
  DrugCatalog,
  DrugInteraction,
  FollowUpAppointment,
  Prescription,
  StudentDrugAllergy,
  TreatmentPlan,
  VitalSigns,
} from '@/database/models';

// Controllers
export * from './controllers';

// Services
export * from './services';
