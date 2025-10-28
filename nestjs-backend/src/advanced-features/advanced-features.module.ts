/**
 * @fileoverview Advanced Features Module
 * @module advanced-features/advanced-features.module
 * @description Module for advanced healthcare features including:
 * - Health screenings
 * - Growth tracking
 * - Immunization forecasting
 * - Emergency notifications
 * - Barcode scanning
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdvancedFeaturesController } from './advanced-features.controller';
import { AdvancedFeaturesService } from './advanced-features.service';

@Module({
  imports: [ConfigModule],
  controllers: [AdvancedFeaturesController],
  providers: [AdvancedFeaturesService],
  exports: [AdvancedFeaturesService],
})
export class AdvancedFeaturesModule {}
