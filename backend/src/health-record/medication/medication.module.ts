import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthRecordMedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { Medication   } from "../../database/models";

@Module({
  imports: [SequelizeModule.forFeature([Medication])],
  controllers: [HealthRecordMedicationController],
  providers: [MedicationService],
  exports: [MedicationService],
})
export class MedicationModule {}
