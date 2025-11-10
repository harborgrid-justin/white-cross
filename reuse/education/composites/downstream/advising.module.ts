/**
 * LOC: EDU-DOWN-ADVISING-MODULE
 * File: advising.module.ts
 * Purpose: Advising Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { AdvisingController } from './advising-controller';
import { AdvisingService } from './advising-service';

@Module({
  controllers: [AdvisingController],
  providers: [
    AdvisingService,
    Logger,
  ],
  exports: [AdvisingService],
})
@Injectable()
export class AdvisingModule {}
