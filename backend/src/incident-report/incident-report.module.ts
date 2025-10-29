import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
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
} from '../../database/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
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
