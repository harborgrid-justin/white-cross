import { Injectable, Logger } from '@nestjs/common';
import { MessageType } from '../enums/message-type.enum';
import { ChannelSendData, ChannelSendResult } from '../interfaces/index';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  async sendViaChannel(
    channel: MessageType,
    data: ChannelSendData,
  ): Promise<ChannelSendResult> {
    this.logger.log('Sending via channel: ' + channel);
    return { externalId: 'external-id-' + Date.now() };
  }

  async translateMessage(
    content: string,
    targetLanguage: string,
  ): Promise<string> {
    return content;
  }
}
