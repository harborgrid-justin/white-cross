import { Module } from '@nestjs/common';
import { HealthCalculationsService } from './health-calculations.service';

@Module({
  providers: [HealthCalculationsService],
  exports: [HealthCalculationsService],
})
export class WorkersModule {}
