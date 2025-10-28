import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentReportController } from './incident-report.controller';
import {
  IncidentCoreService,
  IncidentValidationService,
  IncidentNotificationService,
  IncidentFollowUpService,
  IncidentWitnessService,
  IncidentStatisticsService,
} from './services';
import {
  IncidentReport,
  FollowUpAction,
  WitnessStatement,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IncidentReport,
      FollowUpAction,
      WitnessStatement,
    ]),
  ],
  controllers: [IncidentReportController],
  providers: [
    IncidentCoreService,
    IncidentValidationService,
    IncidentNotificationService,
    IncidentFollowUpService,
    IncidentWitnessService,
    IncidentStatisticsService,
  ],
  exports: [
    IncidentCoreService,
    IncidentValidationService,
    IncidentNotificationService,
    IncidentFollowUpService,
    IncidentWitnessService,
    IncidentStatisticsService,
  ],
})
export class IncidentReportModule {}
