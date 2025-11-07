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

// Import Sequelize models
import { SystemConfig } from '../database/models/system-config.model';
import { ConfigurationHistory } from '../database/models/configuration-history.model';

// Services
import { ConfigurationService } from './services/configuration.service';

// Controllers
import { ConfigurationController } from './configuration.controller';

@Module({
  imports: [SequelizeModule.forFeature([SystemConfig, ConfigurationHistory])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
