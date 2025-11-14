import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradeTransitionController } from './grade-transition.controller';
import { GradeTransitionService } from './grade-transition.service';
import { Student } from '@/database/models';

/**
 * Grade Transition Module
 * Handles automated grade transitions at year-end
 */
@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [GradeTransitionController],
  providers: [GradeTransitionService],
  exports: [GradeTransitionService],
})
export class GradeTransitionModule {}
