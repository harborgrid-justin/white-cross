/**
 * LOC: EDU-DOWN-CURRICULUM-MOD-007
 * Academic Curriculum Module
 * Provides curriculum management services and controllers
 */

import { Module } from '@nestjs/common';
import { AcademicCurriculumController } from './academic-curriculum-controller';
import { AcademicCurriculumService } from './academic-curriculum-service';

@Module({
  controllers: [AcademicCurriculumController],
  providers: [AcademicCurriculumService],
  exports: [AcademicCurriculumService],
})
export class AcademicCurriculumModule {}
