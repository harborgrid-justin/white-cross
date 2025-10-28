import { Module } from '@nestjs/common';
import { CommunicationService } from './services/communication.service';
import { ChannelService } from './services/channel.service';
import { CommunicationController } from './controllers/communication.controller';
import { CommunicationGateway } from './gateways/communication.gateway';

@Module({
  imports: [],
  controllers: [CommunicationController],
  providers: [
    CommunicationService,
    ChannelService,
    CommunicationGateway,
  ],
  exports: [CommunicationService, ChannelService],
})
export class CommunicationModule {}
