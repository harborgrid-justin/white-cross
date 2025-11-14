import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '@/database/models';
import { EncryptionService } from '@/infrastructure/encryption/encryption.service';
import { EditMessageDto } from '../dto/edit-message.dto';
import { EditMessageResponse } from '../types/message-response.types';

import { BaseService } from '@/common/base';
/**
 * MessageManagementService
 *
 * Handles message management operations like editing and deleting.
 *
 * Responsibilities:
 * - Edit existing messages
 * - Delete messages (soft delete)
 * - Handle message encryption updates
 * - Track edit history
 */
@Injectable()
export class MessageManagementService extends BaseService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    private readonly encryptionService: EncryptionService,
  ) {
    super("MessageManagementService");
  }

  /**
   * Edit an existing message
   */
  async editMessage(
    messageId: string,
    dto: EditMessageDto,
    userId: string,
  ): Promise<EditMessageResponse> {
    this.logInfo(`Editing message ${messageId} by user ${userId}`);

    const message = await this.messageModel.findByPk(messageId);

    if (!message) {
      throw new BadRequestException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new BadRequestException('You can only edit your own messages');
    }

    // Update encrypted content if it was originally encrypted
    let encryptedContent: string | undefined;
    if (message.encryptedContent) {
      const encryptionResult = await this.encryptionService.encrypt(dto.content);
      if (encryptionResult.success) {
        encryptedContent = encryptionResult.data;
      } else {
        throw new BadRequestException(`Encryption failed: ${encryptionResult.message}`);
      }
    }

    // Update message
    await message.update({
      content: dto.content,
      encryptedContent,
      attachments: dto.attachments !== undefined ? dto.attachments : message.attachments,
      isEdited: true,
      editedAt: new Date(),
      metadata: {
        ...message.metadata,
        ...dto.metadata,
        editHistory: [
          {
            editedAt: new Date(),
            previousContent: message.content,
          },
        ],
      },
    });

    return { message };
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    this.logInfo(`Deleting message ${messageId} by user ${userId}`);

    const message = await this.messageModel.findByPk(messageId);

    if (!message) {
      throw new BadRequestException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new BadRequestException('You can only delete your own messages');
    }

    // Soft delete
    await message.destroy();
  }
}