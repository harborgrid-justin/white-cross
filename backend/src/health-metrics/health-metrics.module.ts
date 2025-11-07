import { Module } from '@nestjs/common';
import { HealthMetricsController } from './health-metrics.controller';
import { HealthMetricsService } from './health-metrics.service';

@Module({
  controllers: [HealthMetricsController],
  providers: [HealthMetricsService],
})
export class HealthMetricsModule {}
