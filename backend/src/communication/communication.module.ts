import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from '../database/models/message.model';
import { MessageTemplate } from '../database/models/message-template.model';
import { MessageDelivery } from '../database/models/message-delivery.model';
import { MessageRead } from '../database/models/message-read.model';
import { MessageReaction } from '../database/models/message-reaction.model';
import { Conversation } from '../database/models/conversation.model';
import { ConversationParticipant } from '../database/models/conversation-participant.model';

// Infrastructure Modules
import { EncryptionModule } from '../infrastructure/encryption/encryption.module';
import { MessageQueueModule } from '../infrastructure/queue/message-queue.module';

// Controllers
import { MessageController } from './controllers/message.controller';
import { BroadcastController } from './controllers/broadcast.controller';
import { TemplateController } from './controllers/template.controller';
import { EnhancedMessageController } from './controllers/enhanced-message.controller';

// Services
import { MessageService } from './services/message.service';
import { BroadcastService } from './services/broadcast.service';
import { TemplateService } from './services/template.service';
import { CommunicationService } from './services/communication.service';
import { EnhancedMessageService } from './services/enhanced-message.service';
import { ConversationService } from './services/conversation.service';

// Helpers
import { QueueIntegrationHelper } from './helpers/queue-integration.helper';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      MessageTemplate,
      MessageDelivery,
      MessageRead,
      MessageReaction,
      Conversation,
      ConversationParticipant,
    ]),
    EncryptionModule,
    MessageQueueModule,
  ],
  controllers: [
    MessageController,
    BroadcastController,
    TemplateController,
    EnhancedMessageController,
  ],
  providers: [
    MessageService,
    BroadcastService,
    TemplateService,
    CommunicationService,
    EnhancedMessageService,
    ConversationService,
    QueueIntegrationHelper,
  ],
  exports: [
    MessageService,
    BroadcastService,
    TemplateService,
    CommunicationService,
    EnhancedMessageService,
    ConversationService,
  ],
})
export class CommunicationModule {}
