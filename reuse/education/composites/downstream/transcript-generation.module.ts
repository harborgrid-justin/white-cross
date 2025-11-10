/**
 * LOC: EDU-DOWN-TRANSCRIPT-MOD-004
 * Transcript Generation Module
 * Provides transcript generation services and controllers
 */

import { Module } from '@nestjs/common';
import { TranscriptGenerationController } from './transcript-generation-controller';
import { TranscriptGenerationService } from './transcript-generation-service';

@Module({
  controllers: [TranscriptGenerationController],
  providers: [TranscriptGenerationService],
  exports: [TranscriptGenerationService],
})
export class TranscriptGenerationModule {}
