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
import { SequelizeModule } from '@nestjs/sequelize';
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

// Models
import { HealthRecord } from '../database/models/health-record.model';
import { Allergy } from '../database/models/allergy.model';
import { Student } from '../database/models/student.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HealthRecord,
      Allergy,
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
