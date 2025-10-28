import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DrugCatalog } from './entities/drug-catalog.entity';
import { DrugInteraction } from './entities/drug-interaction.entity';
import { StudentDrugAllergy } from './entities/student-drug-allergy.entity';
import { ClinicVisit } from './entities/clinic-visit.entity';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { Prescription } from './entities/prescription.entity';
import { ClinicalProtocol } from './entities/clinical-protocol.entity';
import { ClinicalNote } from './entities/clinical-note.entity';
import { VitalSigns } from './entities/vital-signs.entity';
import { FollowUpAppointment } from './entities/follow-up-appointment.entity';

// Services
import { DrugInteractionService } from './services/drug-interaction.service';
import { ClinicVisitService } from './services/clinic-visit.service';
import { TreatmentPlanService } from './services/treatment-plan.service';
import { PrescriptionService } from './services/prescription.service';
import { ClinicalProtocolService } from './services/clinical-protocol.service';
import { ClinicalNoteService } from './services/clinical-note.service';
import { VitalSignsService } from './services/vital-signs.service';
import { FollowUpService } from './services/follow-up.service';

// Controllers
import { DrugInteractionController } from './controllers/drug-interaction.controller';
import { ClinicVisitController } from './controllers/clinic-visit.controller';
import { TreatmentPlanController } from './controllers/treatment-plan.controller';
import { PrescriptionController } from './controllers/prescription.controller';
import { ClinicalProtocolController } from './controllers/clinical-protocol.controller';
import { ClinicalNoteController } from './controllers/clinical-note.controller';
import { VitalSignsController } from './controllers/vital-signs.controller';
import { FollowUpController } from './controllers/follow-up.controller';

/**
 * Clinical Module
 *
 * Comprehensive clinical functionality for school health management:
 *
 * ## Features
 *
 * ### Feature 48: Drug Interaction Checker
 * - Drug catalog management
 * - Drug-drug interaction checking
 * - Student allergy tracking
 * - Clinical decision support
 *
 * ### Feature 17: Clinic Visit Tracking
 * - Check-in/check-out workflow
 * - Visit tracking and statistics
 * - Student visit history
 * - Frequent visitor analysis
 *
 * ### Treatment Plan Management
 * - Comprehensive treatment planning
 * - Goal setting and tracking
 * - Intervention management
 * - Plan lifecycle management
 *
 * ### Prescription Management
 * - Electronic prescribing
 * - Pharmacy workflow integration
 * - Refill management
 * - Medication tracking
 *
 * ### Clinical Protocols
 * - Standardized clinical protocols
 * - Evidence-based guidelines
 * - Decision support tools
 * - Protocol activation and versioning
 *
 * ### Clinical Notes
 * - SOAP note support
 * - Progress notes
 * - Discharge summaries
 * - Digital signatures
 *
 * ### Vital Signs
 * - Comprehensive vital tracking
 * - BMI calculation
 * - Vital trends analysis
 * - Abnormal flag detection
 *
 * ### Follow-up Management
 * - Appointment scheduling
 * - Reminder system
 * - Follow-up completion tracking
 * - Priority management
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Existing entities
      DrugCatalog,
      DrugInteraction,
      StudentDrugAllergy,
      ClinicVisit,
      // New entities
      TreatmentPlan,
      Prescription,
      ClinicalProtocol,
      ClinicalNote,
      VitalSigns,
      FollowUpAppointment,
    ]),
  ],
  controllers: [
    // Existing controllers
    DrugInteractionController,
    ClinicVisitController,
    // New controllers
    TreatmentPlanController,
    PrescriptionController,
    ClinicalProtocolController,
    ClinicalNoteController,
    VitalSignsController,
    FollowUpController,
  ],
  providers: [
    // Existing services
    DrugInteractionService,
    ClinicVisitService,
    // New services
    TreatmentPlanService,
    PrescriptionService,
    ClinicalProtocolService,
    ClinicalNoteService,
    VitalSignsService,
    FollowUpService,
  ],
  exports: [
    // Export all services for use in other modules
    DrugInteractionService,
    ClinicVisitService,
    TreatmentPlanService,
    PrescriptionService,
    ClinicalProtocolService,
    ClinicalNoteService,
    VitalSignsService,
    FollowUpService,
  ],
})
export class ClinicalModule {}
