import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HealthDomainService } from './health-domain.service';
import { HealthDomainFacadeService } from '@/health-domain/services/health-domain-facade.service';
import { HealthDomainController } from './health-domain.controller';

// Import all health-record sub-modules
import { VaccinationModule } from '../health-record/vaccination/vaccination.module';
import { AllergyModule } from '../health-record/allergy/allergy.module';
import { ChronicConditionModule } from '../services/chronic-condition/chronic-condition.module';
import { VitalsModule } from '../health-record/vitals/vitals.module';
import { SearchModule } from '../health-record/search/search.module';
import { StatisticsModule } from '../health-record/statistics/statistics.module';
import { ImportExportModule } from '../health-record/import-export/import-export.module';
import { ValidationModule } from '../health-record/validation/validation.module';

/**
 * Health Domain Module
 *
 * Provides comprehensive health management endpoints including:
 *
 * **Immunizations:**
 * - Basic CRUD operations for vaccination records
 * - Exemption management (medical, religious, philosophical)
 * - CDC schedule integration (age-based, catch-up, school entry)
 * - Compliance reporting and analytics
 * - State registry export (HL7, CSV, XML)
 * - Contraindication checking
 *
 * **Health Records:**
 * - Complete health record management
 * - Allergies (food, medication, environmental)
 * - Chronic conditions tracking
 * - Vital signs recording and monitoring
 *
 * **Advanced Features:**
 * - Search across all health data
 * - Statistics and analytics
 * - Import/Export capabilities
 * - Data validation
 *
 * Architecture:
 * - Uses Facade pattern to avoid circular dependencies
 * - Event-driven architecture for loose coupling
 * - Lazy loading of services via ModuleRef
 *
 * Integrates with ALL health-record sub-modules for comprehensive health management.
 */
@Module({
  imports: [
    // Core health record modules - NO forwardRef needed with facade pattern
    VaccinationModule,
    AllergyModule,
    ChronicConditionModule,
    VitalsModule,

    // Feature modules
    SearchModule,
    StatisticsModule,
    ImportExportModule,
    ValidationModule,

    // Event emitter for decoupled architecture
    EventEmitterModule.forRoot(),
  ],
  providers: [HealthDomainService, HealthDomainFacadeService],
  controllers: [HealthDomainController],
  exports: [HealthDomainService, HealthDomainFacadeService],
})
export class HealthDomainModule {}
