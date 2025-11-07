/**
 * Message Repository Interface
 * Defines data access operations for messages, deliveries, and templates
 */

import { MessageAttributes } from '../../models/message.model';
import { MessageTemplateAttributes } from '../../models/message-template.model';
import {
  MessageDeliveryAttributes,
  DeliveryStatus,
} from '../../models/message-delivery.model';
import { IRepository } from './repository.interface';

export interface CreateMessageDTO {
  subject?: string;
  content: string;
  priority: string;
  category: string;
  recipientCount?: number;
  scheduledAt?: Date;
  attachments?: string[];
  senderId: string;
  templateId?: string;
}

export interface UpdateMessageDTO {
  subject?: string;
  content?: string;
  priority?: string;
  category?: string;
  scheduledAt?: Date;
  attachments?: string[];
}

export interface CreateMessageTemplateDTO {
  name: string;
  subject?: string;
  content: string;
  type: string;
  category: string;
  variables?: string[];
  isActive?: boolean;
  createdById: string;
}

export interface UpdateMessageTemplateDTO {
  name?: string;
  subject?: string;
  content?: string;
  type?: string;
  category?: string;
  variables?: string[];
  isActive?: boolean;
}

export interface CreateMessageDeliveryDTO {
  recipientType: string;
  recipientId: string;
  channel: string;
  status: DeliveryStatus;
  contactInfo?: string;
  messageId: string;
}

export interface UpdateMessageDeliveryDTO {
  status?: DeliveryStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string;
}

export interface IMessageRepository
  extends IRepository<MessageAttributes, CreateMessageDTO, UpdateMessageDTO> {
  findByCategory(category: string): Promise<MessageAttributes[]>;
  findBySender(senderId: string): Promise<MessageAttributes[]>;
  findScheduled(): Promise<MessageAttributes[]>;
}

export interface IMessageTemplateRepository
  extends IRepository<
    MessageTemplateAttributes,
    CreateMessageTemplateDTO,
    UpdateMessageTemplateDTO
  > {
  findByType(type: string): Promise<MessageTemplateAttributes[]>;
  findByCategory(category: string): Promise<MessageTemplateAttributes[]>;
  findActive(): Promise<MessageTemplateAttributes[]>;
}

export interface IMessageDeliveryRepository
  extends IRepository<
    MessageDeliveryAttributes,
    CreateMessageDeliveryDTO,
    UpdateMessageDeliveryDTO
  > {
  findByMessage(messageId: string): Promise<MessageDeliveryAttributes[]>;
  findByRecipient(recipientId: string): Promise<MessageDeliveryAttributes[]>;
  findByStatus(status: DeliveryStatus): Promise<MessageDeliveryAttributes[]>;
}
