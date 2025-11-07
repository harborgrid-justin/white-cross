import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { Medication } from '../../database/models/medication.model';

@Module({
  imports: [SequelizeModule.forFeature([Medication])],
  controllers: [MedicationController],
  providers: [MedicationService],
  exports: [MedicationService],
})
export class MedicationModule {}
