/**
 * LOC: EDU-DOWN-INTEGRATION-MODULE
 * File: integration.module.ts
 * Purpose: Integration Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { IntegrationController } from './integration-controller';
import { IntegrationService } from './integration-service';

@Module({
  controllers: [IntegrationController],
  providers: [
    IntegrationService,
    Logger,
  ],
  exports: [IntegrationService],
})
export class IntegrationModule {}
