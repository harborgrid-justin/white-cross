/**
 * Medication Management Module
 * 
 * Comprehensive medication management with HIPAA compliance, DEA controlled
 * substance tracking, FDA MedWatch adverse event reporting, and Five Rights
 * of Medication Administration.
 * 
 * @module MedicationModule
 * @compliance HIPAA, DEA Schedule II-V, FDA MedWatch
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Medication } from './entities/medication.entity';
import { StudentMedication } from './entities/student-medication.entity';
import { MedicationLog } from './entities/medication-log.entity';
import { MedicationInventory } from './entities/medication-inventory.entity';
import { ControlledSubstanceLog } from './entities/controlled-substance-log.entity';
import { SideEffectReport } from './entities/side-effect-report.entity';

// Services
import { MedicationCrudService } from './services/medication-crud.service';
import { AdministrationService } from './services/administration.service';
import { InventoryService } from './services/inventory.service';
import { AdverseReactionService } from './services/adverse-reaction.service';
import { ControlledSubstanceService } from './services/controlled-substance.service';
import { SideEffectMonitorService } from './services/side-effect-monitor.service';
import { ScheduleService } from './services/schedule.service';
import { StudentMedicationService } from './services/student-medication.service';
import { AnalyticsService } from './services/analytics.service';
import { DrugInteractionService } from './services/drug-interaction.service';

// Controllers
import { MedicationController } from './controllers/medication.controller';
import { AdministrationController } from './controllers/administration.controller';
import { InventoryController } from './controllers/inventory.controller';
import { AdverseReactionController } from './controllers/adverse-reaction.controller';
import { ControlledSubstanceController } from './controllers/controlled-substance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medication,
      StudentMedication,
      MedicationLog,
      MedicationInventory,
      ControlledSubstanceLog,
      SideEffectReport,
    ]),
  ],
  controllers: [
    MedicationController,
    AdministrationController,
    InventoryController,
    AdverseReactionController,
    ControlledSubstanceController,
  ],
  providers: [
    // Core Services
    MedicationCrudService,
    AdministrationService,
    InventoryService,
    AdverseReactionService,
    ControlledSubstanceService,
    SideEffectMonitorService,
    ScheduleService,
    StudentMedicationService,
    AnalyticsService,
    
    // Safety Services
    DrugInteractionService,
  ],
  exports: [
    // Export services for use in other modules
    MedicationCrudService,
    AdministrationService,
    InventoryService,
    DrugInteractionService,
  ],
})
export class MedicationModule {}
