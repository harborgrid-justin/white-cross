import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import {
  ClinicalNote,
  ClinicalProtocol,
  ClinicVisit,
  DrugCatalog,
  DrugInteraction,
  FollowUpAppointment,
  Prescription,
  StudentDrugAllergy,
  TreatmentPlan,
  VitalSigns,
} from '@/database';

// Services
import { AllergyManagementService } from '@/services/allergy-management.service';
import { ClinicalNoteService } from '@/services/clinical-note.service';
import { ClinicalProtocolService } from '@/services/clinical-protocol.service';
import { ClinicVisitBasicService } from '@/services/clinic-visit-basic.service';
import { ClinicVisitAnalyticsService } from '@/services/clinic-visit-analytics.service';
import { DrugCatalogService } from '@/services/drug-catalog.service';
import { DrugInteractionService } from '@/services/drug-interaction.service';
import { FollowUpService } from '@/services/follow-up.service';
import { InteractionCheckerService } from '@/services/interaction-checker.service';
import { PrescriptionService } from '@/services/prescription.service';
import { TreatmentPlanService } from '@/services/treatment-plan.service';
import { VitalSignsService } from '@/services/vital-signs.service';

// Controllers
import { ClinicalNoteController } from './controllers/clinical-note.controller';
import { ClinicalProtocolManagementController } from './controllers/clinical-protocol-management.controller';
import { ClinicalProtocolQueryController } from './controllers/clinical-protocol-query.controller';
import { ClinicVisitController } from './controllers/clinic-visit.controller';
import { DrugCatalogController } from './controllers/drug-catalog.controller';
import { DrugInteractionManagementController } from './controllers/drug-interaction-management.controller';
import { DrugAllergyController } from './controllers/drug-allergy.controller';
import { DrugSafetyController } from './controllers/drug-safety.controller';
import { FollowUpController } from './controllers/follow-up.controller';
import { MedicationAdministrationCoreController } from './controllers/medication-administration-core.controller';
import { MedicationAdministrationSchedulingController } from './controllers/medication-administration-scheduling.controller';
import { MedicationAdministrationSafetyController } from './controllers/medication-administration-safety.controller';
import { MedicationAdministrationReportingController } from './controllers/medication-administration-reporting.controller';
import { MedicationAdministrationSpecialController } from './controllers/medication-administration-special.controller';
import { PrescriptionAliasController } from './controllers/prescription-alias.controller';
import { PrescriptionController } from './controllers/prescription.controller';
import { TreatmentPlanController } from './controllers/treatment-plan.controller';
import { VitalSignsController } from './controllers/vital-signs.controller';

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
 * - LASA (Look-Alike Sound-Alike) warnings (GAP-MED-010)
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
 * - Path alias for frontend compatibility (GAP-MED-001)
 *
 * ### Medication Administration (GAP-MED-002)
 * - CRITICAL PATIENT SAFETY MODULE
 * - Five Rights verification workflow
 * - Administration recording with full audit trail
 * - Refusal and missed dose tracking
 * - Witness signatures for controlled substances
 * - Safety checks (allergies, drug interactions)
 * - Due/overdue medication tracking
 * - Comprehensive administration history
 * - Batch administration support
 * - Real-time administration statistics
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
 *
 * ## Gap Analysis Fixes
 *
 * This module addresses the following critical patient safety gaps from the
 * Backend-Frontend Gap Analysis (BACKEND_FRONTEND_GAP_ANALYSIS.md):
 *
 * - **GAP-MED-001**: Prescription path mismatch fixed with alias controller
 *   - Frontend calls: /prescriptions/*
 *   - Backend implements: /clinical/prescriptions/*
 *   - Solution: PrescriptionAliasController provides transparent forwarding
 *
 * - **GAP-MED-002**: Medication Administration Module (CRITICAL)
 *   - Complete 14-endpoint medication administration workflow
 *   - Five Rights verification (Right Patient, Medication, Dose, Route, Time)
 *   - Full audit trail for HIPAA compliance
 *   - Controlled substance witness signatures
 *   - Safety checks (allergies, interactions)
 *
 * - **GAP-MED-003**: Drug-Drug Interaction Checking (CRITICAL)
 *   - Enhanced interaction checking endpoint
 *   - Comprehensive safety analysis
 *   - Clinical recommendations
 *
 * - **GAP-MED-010**: LASA Warnings (CRITICAL SAFETY)
 *   - Look-Alike Sound-Alike medication warnings
 *   - Prevention strategies
 *   - Medication error prevention
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      // Converted models
      DrugCatalog,
      DrugInteraction,
      StudentDrugAllergy,
      TreatmentPlan,
      VitalSigns,
      ClinicVisit,
      Prescription,
      ClinicalProtocol,
      ClinicalNote,
      FollowUpAppointment,
    ]),
  ],
  controllers: [
    // Existing controllers
    DrugCatalogController,
    DrugInteractionManagementController,
    DrugAllergyController,
    DrugSafetyController,
    ClinicVisitController,
    // New controllers
    TreatmentPlanController,
    PrescriptionController,
    ClinicalProtocolManagementController,
    ClinicalProtocolQueryController,
    ClinicalNoteController,
    VitalSignsController,
    FollowUpController,
    // GAP-MED-002: Medication Administration Controllers (14 endpoints)
    MedicationAdministrationCoreController,
    MedicationAdministrationSchedulingController,
    MedicationAdministrationSafetyController,
    MedicationAdministrationReportingController,
    MedicationAdministrationSpecialController,
    // GAP-MED-001: Prescription path alias (/prescriptions -> /clinical/prescriptions)
    PrescriptionAliasController,
  ],
  providers: [
    // Existing services
    DrugInteractionService,
    ClinicVisitBasicService,
    ClinicVisitAnalyticsService,
    // New services
    AllergyManagementService,
    ClinicalNoteService,
    ClinicalProtocolService,
    DrugCatalogService,
    FollowUpService,
    InteractionCheckerService,
    PrescriptionService,
    TreatmentPlanService,
    VitalSignsService,
  ],
  exports: [
    // Export all services for use in other modules
    AllergyManagementService,
    ClinicalNoteService,
    ClinicalProtocolService,
    ClinicVisitBasicService,
    ClinicVisitAnalyticsService,
    DrugCatalogService,
    DrugInteractionService,
    FollowUpService,
    InteractionCheckerService,
    PrescriptionService,
    TreatmentPlanService,
    VitalSignsService,
  ],
})
export class ClinicalModule {}
