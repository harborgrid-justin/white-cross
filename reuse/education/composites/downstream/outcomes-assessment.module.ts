/**
 * LOC: EDU-DOWN-OUTCOMES-ASSESSMENT-MODULE
 * File: outcomes-assessment.module.ts
 * Purpose: Outcomes Assessment Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { OutcomesAssessmentController } from './outcomes-assessment-controller';
import { OutcomesAssessmentService } from './outcomes-assessment-service';

@Module({
  controllers: [OutcomesAssessmentController],
  providers: [
    OutcomesAssessmentService,
    Logger,
  ],
  exports: [OutcomesAssessmentService],
})
export class OutcomesAssessmentModule {}
