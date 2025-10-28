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
import { TypeOrmModule } from '@nestjs/typeorm';

// Reuse entities from administration module
import {
  SystemConfiguration,
  ConfigurationHistory
} from '../administration/entities';

// Services
import { ConfigurationService } from './services/configuration.service';

// Controllers
import { ConfigurationController } from './configuration.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemConfiguration,
      ConfigurationHistory,
    ]),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
