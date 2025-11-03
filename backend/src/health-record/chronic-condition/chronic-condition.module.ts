import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChronicConditionController } from './chronic-condition.controller';
import { ChronicConditionService } from './chronic-condition.service';
import { ChronicCondition } from '../../database/models/chronic-condition.model';
import { Student } from '../../database/models/student.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ChronicCondition, Student]),
  ],
  controllers: [ChronicConditionController],
  providers: [ChronicConditionService],
  exports: [ChronicConditionService],
})
export class ChronicConditionModule {}
