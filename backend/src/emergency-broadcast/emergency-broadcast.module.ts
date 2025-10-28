import { Module } from '@nestjs/common';
import { EmergencyBroadcastController } from './emergency-broadcast.controller';
import { EmergencyBroadcastService } from './emergency-broadcast.service';

@Module({
  controllers: [EmergencyBroadcastController],
  providers: [EmergencyBroadcastService]
})
export class EmergencyBroadcastModule {}
