import { Module } from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { HealthRecordController } from './health-record.controller';

@Module({
  providers: [HealthRecordService],
  controllers: [HealthRecordController]
})
export class HealthRecordModule {}
