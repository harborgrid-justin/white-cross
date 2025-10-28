import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmergencyBroadcastController } from './emergency-broadcast.controller';
import { EmergencyBroadcastService } from './emergency-broadcast.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmergencyBroadcastController],
  providers: [
    EmergencyBroadcastService
  ]
})
export class EmergencyBroadcastModule {}
