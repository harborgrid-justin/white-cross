/**
 * @fileoverview Vaccinations Module
 * @module vaccinations/vaccinations.module
 * @description Module for root-level vaccinations endpoints
 */

import { Module } from '@nestjs/common';
import { VaccinationsController } from './vaccinations.controller';
import { VaccinationsService } from './vaccinations.service';
import { HealthRecordModule } from '../../health-record/health-record.module';

@Module({
  imports: [HealthRecordModule],
  controllers: [VaccinationsController],
  providers: [VaccinationsService],
  exports: [VaccinationsService],
})
export class VaccinationsModule {}