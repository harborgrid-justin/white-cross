import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { DrugCatalog } from '@/database';
import { DrugInteraction } from '@/database';
import { StudentDrugAllergy } from '@/database';
import { TreatmentPlan } from '@/database';
import { VitalSigns } from '@/database';
import { ClinicVisit } from '@/database';
import { Prescription } from '@/database';
import { ClinicalProtocol } from '@/database';
import { ClinicalNote } from '@/database';
import { FollowUpAppointment } from '@/database';

// Services
import { DrugInteractionService } from '@/clinical/services';
import { ClinicVisitService } from '@/clinical/services';
import { TreatmentPlanService } from '@/clinical/services';
import { PrescriptionService } from '@/clinical/services';
import { ClinicalProtocolService } from '@/clinical/services';
import { ClinicalNoteService } from '@/clinical/services';
import { VitalSignsService } from '@/clinical/services';
import { FollowUpService } from '@/clinical/services';

// Controllers
import { DrugInteractionController } from '@/clinical/controllers';
import { ClinicVisitController } from '@/clinical/controllers';
import { TreatmentPlanController } from '@/clinical/controllers';
import { PrescriptionController } from '@/clinical/controllers';
import { ClinicalProtocolController } from '@/clinical/controllers';
import { ClinicalNoteController } from '@/clinical/controllers';
import { VitalSignsController } from '@/clinical/controllers';
import { FollowUpController } from '@/clinical/controllers';
import { MedicationAdministrationController } from '@/clinical/controllers';
import { PrescriptionAliasController } from '@/clinical/controllers';

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
    DrugInteractionController,
    ClinicVisitController,
    // New controllers
    TreatmentPlanController,
    PrescriptionController,
    ClinicalProtocolController,
    ClinicalNoteController,
    VitalSignsController,
    FollowUpController,
    // GAP-MED-002: Medication Administration Controller (14 endpoints)
    MedicationAdministrationController,
    // GAP-MED-001: Prescription path alias (/prescriptions -> /clinical/prescriptions)
    PrescriptionAliasController,
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
