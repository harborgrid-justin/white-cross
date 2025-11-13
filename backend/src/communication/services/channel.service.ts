import { Injectable, Logger } from '@nestjs/common';
import { MessageType } from '../enums/message-type.enum';
import { ChannelSendData, ChannelSendResult } from '../interfaces/index';

import { BaseService } from '@/common/base';
@Injectable()
export class ChannelService extends BaseService {
  async sendViaChannel(
    channel: MessageType,
    data: ChannelSendData,
  ): Promise<ChannelSendResult> {
    this.logInfo('Sending via channel: ' + channel);
    return { externalId: 'external-id-' + Date.now() };
  }

  async translateMessage(
    content: string,
    targetLanguage: string,
  ): Promise<string> {
    return content;
  }
}
