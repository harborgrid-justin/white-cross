import { Injectable, Logger } from '@nestjs/common';
import { BroadcastMessageDto } from '../dto/broadcast-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateMessageTemplateDto } from '../dto/create-message-template.dto';
import { EmergencyAlertDto } from '../dto/emergency-alert.dto';
import { MessageDeliveryStatusResult } from '../interfaces/index';

import { BaseService } from '@/common/base';
@Injectable()
export class CommunicationService extends BaseService {
  async createMessageTemplate(dto: CreateMessageTemplateDto): Promise<any> {
    this.logInfo('Creating message template');
    return { id: 'template-id', ...dto, createdAt: new Date() };
  }

  async sendMessage(dto: CreateMessageDto): Promise<{
    message: any;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo('Sending message');
    return { message: {}, deliveryStatuses: [] };
  }

  async sendBroadcastMessage(dto: BroadcastMessageDto): Promise<{
    message: any;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo('Sending broadcast message');
    return { message: {}, deliveryStatuses: [] };
  }

  async sendEmergencyAlert(dto: EmergencyAlertDto): Promise<{
    message: any;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo('Sending emergency alert');
    return { message: {}, deliveryStatuses: [] };
  }
}
