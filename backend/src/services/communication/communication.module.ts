import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from '@/database/models';
import { MessageTemplate } from '@/database/models';
import { MessageDelivery } from '@/database/models';
import { MessageRead } from '@/database/models';
import { MessageReaction } from '@/database/models';
import { Conversation } from '@/database/models';
import { ConversationParticipant } from '@/database/models';

// Infrastructure Modules
import { EncryptionModule } from '../../infrastructure/encryption/encryption.module';
import { MessageQueueModule } from '../../infrastructure/queue/message-queue.module';

// Auth Module for JWT and token services
import { AuthModule } from '@/services/auth/auth.module';

// Controllers
import { MessageController } from './controllers/message.controller';
import { BroadcastController } from './controllers/broadcast.controller';
import { TemplateController } from './controllers/template.controller';
import { EnhancedMessageController } from './controllers/enhanced-message.controller';

// Services
import { MessageService } from '@/services/message.service';
import { BroadcastService } from '@/services/broadcast.service';
import { TemplateService } from '@/services/template.service';
import { CommunicationService } from '@/services/communication.service';
import { EnhancedMessageService } from '@/services/enhanced-message.service';
import { ConversationService } from '@/services/conversation.service';

// Helpers
import { QueueIntegrationHelper } from './helpers/queue-integration.helper';

// Gateways
import { CommunicationGateway } from './gateways/communication.gateway';

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
    AuthModule,
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
    CommunicationGateway,
  ],
  exports: [
    MessageService,
    BroadcastService,
    TemplateService,
    CommunicationService,
    EnhancedMessageService,
    ConversationService,
    CommunicationGateway,
  ],
})
export class CommunicationModule {}
