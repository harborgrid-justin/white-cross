import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrationController } from './administration.controller';

// Import all entities
import {
  District,
  School,
  License,
  SystemConfiguration,
  ConfigurationHistory,
  AuditLog,
  BackupLog,
  PerformanceMetric,
  TrainingModule,
} from './entities';

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
    TypeOrmModule.forFeature([
      District,
      School,
      License,
      SystemConfiguration,
      ConfigurationHistory,
      AuditLog,
      BackupLog,
      PerformanceMetric,
      TrainingModule,
    ]),
  ],
  controllers: [AdministrationController],
  providers: [AuditService, BackupService, ConfigurationService, DistrictService, SchoolService, LicenseService, PerformanceService, SettingsService, SystemHealthService, TrainingService, UserManagementService],
  exports: [AuditService, ConfigurationService, DistrictService, SchoolService, LicenseService],
})
export class AdministrationModule {}
