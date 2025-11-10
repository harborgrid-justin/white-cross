/**
 * LOC: EDU-DOWN-GRADING-MODULE
 * File: grading.module.ts
 * Purpose: Grading Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { GradingController } from './grading-controller';
import { GradingService } from './grading-service';

@Module({
  controllers: [GradingController],
  providers: [
    GradingService,
    Logger,
  ],
  exports: [GradingService],
})
@Injectable()
export class GradingModule {}
