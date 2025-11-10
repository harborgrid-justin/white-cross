/**
 * LOC: EDU-DOWN-APPLICATION-MOD-009
 * Application Processing Module
 * Provides application processing services and controllers
 */

import { Module } from '@nestjs/common';
import { ApplicationProcessingController } from './application-processing-controller';
import { ApplicationProcessingService } from './application-processing-service';

@Module({
  controllers: [ApplicationProcessingController],
  providers: [ApplicationProcessingService],
  exports: [ApplicationProcessingService],
})
export class ApplicationProcessingModule {}
