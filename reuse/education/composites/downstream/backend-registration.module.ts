/**
 * LOC: EDU-DOWN-REGISTRATION-MOD-002
 * Backend Registration Module
 * Provides registration management services and controllers
 */

import { Module } from '@nestjs/common';
import { BackendRegistrationController } from './backend-registration-controller';
import { BackendRegistrationService } from './backend-registration-service';

@Module({
  controllers: [BackendRegistrationController],
  providers: [BackendRegistrationService],
  exports: [BackendRegistrationService],
})
export class BackendRegistrationModule {}
