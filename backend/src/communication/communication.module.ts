import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from '../database/models/message.model';
import { MessageTemplate } from '../database/models/message-template.model';
import { MessageDelivery } from '../database/models/message-delivery.model';

// Controllers
import { MessageController } from './controllers/message.controller';
import { BroadcastController } from './controllers/broadcast.controller';
import { TemplateController } from './controllers/template.controller';

// Services
import { MessageService } from './services/message.service';
import { BroadcastService } from './services/broadcast.service';
import { TemplateService } from './services/template.service';
import { CommunicationService } from './services/communication.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      MessageTemplate,
      MessageDelivery,
    ]),
  ],
  controllers: [
    MessageController,
    BroadcastController,
    TemplateController,
  ],
  providers: [
    MessageService,
    BroadcastService,
    TemplateService,
    CommunicationService,
  ],
  exports: [
    MessageService,
    BroadcastService,
    TemplateService,
    CommunicationService,
  ],
})
export class CommunicationModule {}
