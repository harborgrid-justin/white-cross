import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { CommunicationModule } from '../communication.module';
import { EmergencyBroadcastController } from './emergency-broadcast.controller';
import { EmergencyBroadcastService } from './emergency-broadcast.service';

@Module({
  imports: [DatabaseModule, CommunicationModule],
  controllers: [EmergencyBroadcastController],
  providers: [EmergencyBroadcastService],
  exports: [EmergencyBroadcastService],
})
export class EmergencyBroadcastModule {}
