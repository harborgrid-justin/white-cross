/**
 * Configuration Module
 *
 * Comprehensive system configuration management with:
 * - Hierarchical scoping (system, district, school, user)
 * - Type-safe validation
 * - Complete audit trail via ConfigurationHistory
 * - Import/Export capabilities
 * - Statistics and monitoring
 *
 * @module ConfigurationModule
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Import database module for Sequelize instance access
import { DatabaseModule } from '../database/database.module';

// Import Sequelize models
import { SystemConfig } from '@/database/models';
import { ConfigurationHistory } from '@/database/models';

// Services
import { ConfigurationService } from './services/configuration.service';
import { ConfigCrudService } from './services/config-crud.service';
import { ConfigValidationService } from './services/config-validation.service';
import { ConfigHistoryService } from './services/config-history.service';
import { ConfigImportExportService } from './services/config-import-export.service';
import { ConfigStatisticsService } from './services/config-statistics.service';

// Controllers
import { ConfigurationController } from './configuration.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([SystemConfig, ConfigurationHistory]),
    DatabaseModule, // Import to access Sequelize instance
  ],
  controllers: [ConfigurationController],
  providers: [
    ConfigurationService,
    ConfigCrudService,
    ConfigValidationService,
    ConfigHistoryService,
    ConfigImportExportService,
    ConfigStatisticsService,
  ],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
