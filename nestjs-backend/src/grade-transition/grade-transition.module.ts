import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeTransitionController } from './grade-transition.controller';
import { GradeTransitionService } from './grade-transition.service';
import { Student } from '../student/entities/student.entity';

/**
 * Grade Transition Module
 * Handles automated grade transitions at year-end
 */
@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [GradeTransitionController],
  providers: [GradeTransitionService],
  exports: [GradeTransitionService],
})
export class GradeTransitionModule {}
