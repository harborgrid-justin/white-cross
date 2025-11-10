/**
 * LOC: EDU-DOWN-ENROLLMENT-MOD-001
 * Backend Enrollment Module
 * Provides enrollment management services and controllers
 */

import { Module } from '@nestjs/common';
import { BackendEnrollmentController } from './backend-enrollment-controller';
import { BackendEnrollmentService } from './backend-enrollment-service';

@Module({
  controllers: [BackendEnrollmentController],
  providers: [BackendEnrollmentService],
  exports: [BackendEnrollmentService],
})
export class BackendEnrollmentModule {}
