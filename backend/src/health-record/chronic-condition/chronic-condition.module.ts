import { Module } from '@nestjs/common';
import { ChronicConditionService } from './chronic-condition.service';

@Module({
  providers: [ChronicConditionService]
})
export class ChronicConditionModule {}
