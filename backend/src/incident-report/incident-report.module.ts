import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncidentReportController } from './incident-report.controller';
import {
  IncidentCoreService,
  IncidentFollowUpService,
  IncidentNotificationService,
  IncidentStatisticsService,
  IncidentValidationService,
  IncidentWitnessService,
} from './services';
import { IncidentReport } from '../database/models/incident-report.model';
import { FollowUpAction } from '../database/models/follow-up-action.model';
import { WitnessStatement } from '../database/models/witness-statement.model';
import { EmergencyContact } from '../database/models/emergency-contact.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      IncidentReport,
      FollowUpAction,
      WitnessStatement,
      EmergencyContact,
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
