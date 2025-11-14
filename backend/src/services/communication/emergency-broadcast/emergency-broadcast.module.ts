import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { CommunicationModule } from '../communication.module';
import { EmergencyBroadcastController } from './emergency-broadcast.controller';
import { EmergencyBroadcastService } from './emergency-broadcast.service';
import { BroadcastPriorityService } from './services/broadcast-priority.service';
import { BroadcastRecipientService } from './services/broadcast-recipient.service';
import { BroadcastDeliveryService } from './services/broadcast-delivery.service';
import { BroadcastManagementService } from './services/broadcast-management.service';
import { BroadcastTemplateService } from './services/broadcast-template.service';

@Module({
  imports: [DatabaseModule, CommunicationModule],
  controllers: [EmergencyBroadcastController],
  providers: [
    EmergencyBroadcastService,
    BroadcastPriorityService,
    BroadcastRecipientService,
    BroadcastDeliveryService,
    BroadcastManagementService,
    BroadcastTemplateService,
  ],
  exports: [EmergencyBroadcastService],
})
export class EmergencyBroadcastModule {}
