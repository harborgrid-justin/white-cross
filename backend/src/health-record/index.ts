/**
 * Health Record Module Barrel Export
 * Provides centralized exports for the health record module
 */

// Module
export { HealthRecordModule } from './health-record.module';

// Service
export { HealthRecordService } from './health-record.service';

// Controller
export { HealthRecordController } from './health-record.controller';

// DTOs
export * from './dto';

// Services
export * from './services';

// Sub-modules
export { AllergyModule } from './allergy/allergy.module';
export { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
export { MedicationModule } from './medication/medication.module';
export { VitalsModule } from './vitals/vitals.module';
export { ImportExportModule } from './import-export/import-export.module';
export { SearchModule } from './search/search.module';
export { StatisticsModule } from './statistics/statistics.module';
export { ValidationModule } from './validation/validation.module';
export { VaccinationModule } from './vaccination/vaccination.module';
