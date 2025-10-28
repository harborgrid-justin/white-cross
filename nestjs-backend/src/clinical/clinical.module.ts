import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DrugCatalog } from './entities/drug-catalog.entity';
import { DrugInteraction } from './entities/drug-interaction.entity';
import { StudentDrugAllergy } from './entities/student-drug-allergy.entity';
import { ClinicVisit } from './entities/clinic-visit.entity';

// Services
import { DrugInteractionService } from './services/drug-interaction.service';
import { ClinicVisitService } from './services/clinic-visit.service';

// Controllers
import { DrugInteractionController } from './controllers/drug-interaction.controller';
import { ClinicVisitController } from './controllers/clinic-visit.controller';

/**
 * Clinical Module
 *
 * Provides comprehensive clinical functionality:
 * - Feature 48: Drug Interaction Checker
 *   - Drug catalog management
 *   - Drug-drug interaction checking
 *   - Student allergy tracking
 *   - Clinical decision support
 *
 * - Feature 17: Clinic Visit Tracking
 *   - Check-in/check-out workflow
 *   - Visit tracking and statistics
 *   - Student visit history
 *   - Frequent visitor analysis
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DrugCatalog,
      DrugInteraction,
      StudentDrugAllergy,
      ClinicVisit,
    ]),
  ],
  controllers: [DrugInteractionController, ClinicVisitController],
  providers: [DrugInteractionService, ClinicVisitService],
  exports: [DrugInteractionService, ClinicVisitService],
})
export class ClinicalModule {}
