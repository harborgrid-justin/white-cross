import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncidentReportController } from './incident-report.controller';
import { IncidentCoreController } from './controllers/incident-core.controller';
import { IncidentStatusController } from './controllers/incident-status.controller';
import { IncidentQueryController } from './controllers/incident-query.controller';
import {
  IncidentCoreService,
  IncidentFollowUpService,
  IncidentNotificationService,
  IncidentStatisticsService,
  IncidentValidationService,
  IncidentWitnessService,
  IncidentReadService,
  IncidentWriteService,
  IncidentStatusService,
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
  controllers: [
    IncidentReportController, // Keep original for backward compatibility
    IncidentCoreController,
    IncidentStatusController,
    IncidentQueryController,
  ],
  providers: [
    IncidentCoreService,
    IncidentValidationService,
    IncidentNotificationService,
    IncidentFollowUpService,
    IncidentWitnessService,
    IncidentStatisticsService,
    IncidentReadService,
    IncidentWriteService,
    IncidentStatusService,
  ],
  exports: [
    IncidentCoreService,
    IncidentValidationService,
    IncidentNotificationService,
    IncidentFollowUpService,
    IncidentWitnessService,
    IncidentStatisticsService,
    IncidentReadService,
    IncidentWriteService,
    IncidentStatusService,
  ],
})
export class IncidentReportModule {}
