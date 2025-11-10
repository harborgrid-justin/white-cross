import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VaccinationService } from './vaccination.service';
import { VaccinationController } from './vaccination.controller';
import { Vaccination } from '../../database/models/vaccination.model';
import { Student } from '../../database/models/student.model';

@Module({
  imports: [SequelizeModule.forFeature([Vaccination, Student])],
  controllers: [VaccinationController],
  providers: [VaccinationService],
  exports: [VaccinationService],
})
export class VaccinationModule {}
