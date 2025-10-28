import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChronicConditionService } from './chronic-condition.service';
import { ChronicConditionController } from './chronic-condition.controller';
import { ChronicCondition } from './entities/chronic-condition.entity';

/**
 * ChronicConditionModule
 *
 * Module for chronic condition management with TypeORM integration.
 * Provides comprehensive chronic disease tracking, care plan management,
 * IEP/504 accommodation coordination, and monitoring.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ChronicCondition])],
  providers: [ChronicConditionService],
  controllers: [ChronicConditionController],
  exports: [ChronicConditionService],
})
export class ChronicConditionModule {}
