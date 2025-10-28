import { Module } from '@nestjs/common';
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

@Module({
  providers: [HealthRecordService],
  controllers: [HealthRecordController],
  imports: [VaccinationModule, VitalsModule, SearchModule, StatisticsModule, ImportExportModule, ChronicConditionModule, ValidationModule, AllergyModule]
})
export class HealthRecordModule {}
