import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicationInteractionController } from './medication-interaction.controller';
import { MedicationInteractionService } from './medication-interaction.service';
import { Medication } from '../database/models/medication.model';
import { StudentMedication } from '../database/models/student-medication.model';

/**
 * MedicationInteractionModule
 *
 * Module for medication interaction checking with Sequelize integration.
 * Provides drug-drug interaction detection, safety scoring, and recommendations.
 *
 * Migrated from backend/src/services/medicationInteractionService.ts
 */
@Module({
  imports: [SequelizeModule.forFeature([Medication, StudentMedication])],
  controllers: [MedicationInteractionController],
  providers: [MedicationInteractionService],
  exports: [MedicationInteractionService],
})
export class MedicationInteractionModule {}
