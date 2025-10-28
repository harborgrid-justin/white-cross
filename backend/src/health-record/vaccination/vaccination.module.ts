import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationService } from './vaccination.service';
import { VaccinationController } from './vaccination.controller';
import { Vaccination } from './entities/vaccination.entity';
import { Student } from '../../student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vaccination, Student]),
  ],
  controllers: [VaccinationController],
  providers: [VaccinationService],
  exports: [VaccinationService],
})
export class VaccinationModule {}
