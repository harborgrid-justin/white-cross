/**
 * Health Record Module
 *
 * Comprehensive HIPAA-compliant health management system providing unified access
 * to health records, allergies, vaccinations, chronic conditions, vital signs,
 * search, import/export, and statistics.
 *
 * HIPAA CRITICAL - This module manages Protected Health Information (PHI)
 *
 * @module HealthRecordModule
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecordService } from './health-record.service';
import { HealthRecordController } from './health-record.controller';
import { VaccinationModule } from './vaccination/vaccination.module';
import { VitalsModule } from './vitals/vitals.module';
import { SearchModule } from './search/search.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ImportExportModule } from './import-export/import-export.module';
import { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
import { ValidationModule } from './validation/validation.module';
import { AllergyModule } from './allergy/allergy.module';

// Entities
import { HealthRecord } from './entities/health-record.entity';
import { Allergy } from '../allergy/entities/allergy.entity';
import { Vaccination } from './vaccination/entities/vaccination.entity';
import { ChronicCondition } from '../chronic-condition/entities/chronic-condition.entity';
import { Student } from '../student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthRecord,
      Allergy,
      Vaccination,
      ChronicCondition,
      Student,
    ]),
    VaccinationModule,
    VitalsModule,
    SearchModule,
    StatisticsModule,
    ImportExportModule,
    ChronicConditionModule,
    ValidationModule,
    AllergyModule,
  ],
  providers: [HealthRecordService],
  controllers: [HealthRecordController],
  exports: [HealthRecordService],
})
export class HealthRecordModule {}
