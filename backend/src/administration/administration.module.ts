import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdministrationController } from './administration.controller';

// Import Sequelize models
import { District } from '../database/models/district.model';
import { School } from '../database/models/school.model';
import { License } from '../database/models/license.model';
import { SystemConfig } from '../database/models/system-config.model';
import { ConfigurationHistory } from '../database/models/configuration-history.model';
import { AuditLog } from '../database/models/audit-log.model';
import { BackupLog } from '../database/models/backup-log.model';
import { PerformanceMetric } from '../database/models/performance-metric.model';
import { TrainingModule } from '../database/models/training-module.model';

// Import all services
import { AuditService } from './services/audit.service';
import { BackupService } from './services/backup.service';
import { ConfigurationService } from './services/configuration.service';
import { DistrictService } from './services/district.service';
import { SchoolService } from './services/school.service';
import { LicenseService } from './services/license.service';
import { PerformanceService } from './services/performance.service';
import { SettingsService } from './services/settings.service';
import { SystemHealthService } from './services/system-health.service';
import { TrainingService } from './services/training.service';
import { UserManagementService } from './services/user-management.service';

/**
 * AdministrationModule
 *
 * Manages all administrative operations
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      District,
      School,
      License,
      SystemConfig,
      ConfigurationHistory,
      AuditLog,
      BackupLog,
      PerformanceMetric,
      TrainingModule,
    ]),
  ],
  controllers: [AdministrationController],
  providers: [
    AuditService,
    BackupService,
    ConfigurationService,
    DistrictService,
    SchoolService,
    LicenseService,
    PerformanceService,
    SettingsService,
    SystemHealthService,
    TrainingService,
    UserManagementService
  ],
  exports: [
    AuditService,
    ConfigurationService,
    DistrictService,
    SchoolService,
    LicenseService
  ],
})
export class AdministrationModule {}
