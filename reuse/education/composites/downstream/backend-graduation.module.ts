/**
 * LOC: EDU-DOWN-GRADUATION-MOD-003
 * Backend Graduation Module
 * Provides graduation management services and controllers
 */

import { Module } from '@nestjs/common';
import { BackendGraduationController } from './backend-graduation-controller';
import { BackendGraduationService } from './backend-graduation-service';

@Module({
  controllers: [BackendGraduationController],
  providers: [BackendGraduationService],
  exports: [BackendGraduationService],
})
export class BackendGraduationModule {}
