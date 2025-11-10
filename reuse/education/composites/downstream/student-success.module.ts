/**
 * LOC: EDU-DOWN-STUDENT-SUCCESS-MODULE
 * File: student-success.module.ts
 * Purpose: Student Success Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { StudentSuccessController } from './student-success-controller';
import { StudentSuccessService } from './student-success-service';

@Module({
  controllers: [StudentSuccessController],
  providers: [
    StudentSuccessService,
    Logger,
  ],
  exports: [StudentSuccessService],
})
export class StudentSuccessModule {}
