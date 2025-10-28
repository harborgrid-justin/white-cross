import { Module } from '@nestjs/common';
import { WorkerPoolService } from './worker-pool.service';
import { HealthCalculationsService } from './health-calculations.service';

@Module({
  providers: [WorkerPoolService, HealthCalculationsService],
  exports: [WorkerPoolService, HealthCalculationsService],
})
export class WorkersModule {}
