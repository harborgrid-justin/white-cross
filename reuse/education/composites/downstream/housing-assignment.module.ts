/**
 * LOC: EDU-DOWN-HOUSING-ASSIGNMENT-MODULE
 * File: housing-assignment.module.ts
 * Purpose: Housing Assignment Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { HousingAssignmentController } from './housing-assignment-controller';
import { HousingAssignmentService } from './housing-assignment-service';

@Module({
  controllers: [HousingAssignmentController],
  providers: [
    HousingAssignmentService,
    Logger,
  ],
  exports: [HousingAssignmentService],
})
export class HousingAssignmentModule {}
