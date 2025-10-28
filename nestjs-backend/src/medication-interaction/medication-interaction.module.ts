import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationInteractionController } from './medication-interaction.controller';
import { MedicationInteractionService } from './medication-interaction.service';
import { Medication, StudentMedication } from './entities';

/**
 * MedicationInteractionModule
 *
 * Module for medication interaction checking with TypeORM integration.
 * Provides drug-drug interaction detection, safety scoring, and recommendations.
 *
 * Migrated from backend/src/services/medicationInteractionService.ts
 */
@Module({
  imports: [TypeOrmModule.forFeature([Medication, StudentMedication])],
  controllers: [MedicationInteractionController],
  providers: [MedicationInteractionService],
  exports: [MedicationInteractionService],
})
export class MedicationInteractionModule {}
