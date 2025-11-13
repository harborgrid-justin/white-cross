/**
 * @fileoverview Emergency Broadcast Delivery Service
 * @module emergency-broadcast/services
 * @description Handles message delivery through multiple communication channels with retry logic
 */

import { Injectable, Logger } from '@nestjs/common';
import { CommunicationChannel, DeliveryStatus } from '../emergency-broadcast.enums';
import { RecipientDeliveryStatus } from '../emergency-broadcast.interfaces';
import { CommunicationService } from '../../communication/services/communication.service';
import { BroadcastRecipient } from './broadcast-recipient.service';

import { BaseService } from '@/common/base';
interface DeliveryResult {
  success: boolean;
  error?: string;
}

@Injectable()
export class BroadcastDeliveryService extends BaseService {
  constructor(private readonly communicationService: CommunicationService) {}

  /**
   * Deliver messages to recipients via all specified channels
   *
   * Implements multi-channel delivery with retry logic:
   * - SMS: Immediate delivery for critical alerts
   * - Email: Detailed information delivery
   * - Push: Mobile app notifications
   * - Voice: Phone calls for critical emergencies
   *
   * Retry strategy:
   * - 3 attempts per channel with exponential backoff (1s, 2s, 4s)
   * - Failed deliveries are logged but don't block other channels
   * - Each channel delivery is independent
   */
  async deliverToRecipients(
    broadcastId: string,
    recipients: BroadcastRecipient[],
    channels: CommunicationChannel[],
    messageTitle: string,
    messageContent: string,
  ): Promise<RecipientDeliveryStatus[]> {
    const deliveryStatuses: RecipientDeliveryStatus[] = [];

    this.logInfo(
      `Delivering to ${recipients.length} recipients via channels: ${channels.join(', ')}`,
    );

    // Process each recipient
    for (const recipient of recipients) {
      // Deliver to each channel for this recipient
      for (const channel of channels) {
        const deliveryResult = await this.deliverToChannel(
          broadcastId,
          recipient,
          channel,
          messageTitle,
          messageContent,
        );

        deliveryStatuses.push(deliveryResult);
      }
    }

    return deliveryStatuses;
  }

  /**
   * Deliver message to a single recipient via specific channel
   * Implements retry logic with exponential backoff
   */
  async deliverToChannel(
    broadcastId: string,
    recipient: BroadcastRecipient,
    channel: CommunicationChannel,
    title: string,
    content: string,
  ): Promise<RecipientDeliveryStatus> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logDebug(`Delivery attempt ${attempt}/${maxRetries}`, {
          broadcastId,
          recipientId: recipient.id,
          channel,
        });

        // Format message based on channel
        const formattedMessage = this.formatMessageForChannel(channel, title, content);

        // Send via communication service
        await this.sendViaChannel(channel, recipient, formattedMessage);

        // Success - log and return
        this.logDebug('Message delivered successfully', {
          broadcastId,
          recipientId: recipient.id,
          channel,
          attempt,
        });

        return {
          recipientId: recipient.id,
          recipientType: recipient.type,
          name: recipient.name,
          contactMethod: channel,
          phoneNumber: recipient.phone,
          email: recipient.email,
          status: DeliveryStatus.DELIVERED,
          deliveredAt: new Date(),
          attemptCount: attempt,
        };
      } catch (error) {
        this.logWarning(`Delivery attempt ${attempt} failed`, {
          broadcastId,
          recipientId: recipient.id,
          channel,
          error: (error as Error).message,
        });

        // If not the last attempt, wait with exponential backoff
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        } else {
          // All retries exhausted - mark as failed
          this.logError('All delivery attempts failed', {
            broadcastId,
            recipientId: recipient.id,
            channel,
            attempts: maxRetries,
          });

          return {
            recipientId: recipient.id,
            recipientType: recipient.type,
            name: recipient.name,
            contactMethod: channel,
            phoneNumber: recipient.phone,
            email: recipient.email,
            status: DeliveryStatus.FAILED,
            error: `Failed after ${maxRetries} attempts: ${(error as Error).message}`,
            attemptCount: maxRetries,
          };
        }
      }
    }

    // Fallback (should never reach here, but TypeScript needs it)
    return {
      recipientId: recipient.id,
      recipientType: recipient.type,
      name: recipient.name,
      contactMethod: channel,
      status: DeliveryStatus.FAILED,
      error: 'Unknown error',
    };
  }

  /**
   * Format message content appropriately for each channel type
   */
  formatMessageForChannel(channel: CommunicationChannel, title: string, content: string): string {
    switch (channel) {
      case CommunicationChannel.SMS: {
        // SMS: Keep it short (160 chars max), remove formatting
        const smsMessage = `${title}: ${content}`;
        return smsMessage.length > 160 ? smsMessage.substring(0, 157) + '...' : smsMessage;
      }

      case CommunicationChannel.EMAIL:
        // Email: Full HTML formatting with title and content
        return `
          <html>
            <body>
              <h2>${title}</h2>
              <p>${content}</p>
              <hr>
              <p><small>This is an emergency notification from White Cross School System.</small></p>
            </body>
          </html>
        `;

      case CommunicationChannel.PUSH:
        // Push: Title and body for mobile notification
        return JSON.stringify({
          title,
          body: content,
          priority: 'high',
          sound: 'emergency_alert',
        });

      case CommunicationChannel.VOICE:
        // Voice: Clean text for text-to-speech
        return `${title}. ${content}. I repeat. ${title}. ${content}.`;

      default:
        return `${title}: ${content}`;
    }
  }

  /**
   * Send message via specific communication channel
   */
  private async sendViaChannel(
    channel: CommunicationChannel,
    recipient: BroadcastRecipient,
    message: string,
  ): Promise<DeliveryResult> {
    // Prepare message DTO for communication service
    const messageDto: Record<string, unknown> = {
      recipientId: recipient.id,
      recipientType: recipient.type,
      subject: 'Emergency Alert',
      content: message,
      priority: 'high',
      channel: this.mapChannelToServiceChannel(channel),
    };

    // Route to appropriate communication service method based on channel
    switch (channel) {
      case CommunicationChannel.SMS:
        if (!recipient.phone) {
          throw new Error('Recipient has no phone number for SMS delivery');
        }
        messageDto.phoneNumber = recipient.phone;
        break;

      case CommunicationChannel.EMAIL:
        if (!recipient.email) {
          throw new Error('Recipient has no email for email delivery');
        }
        messageDto.email = recipient.email;
        break;

      case CommunicationChannel.PUSH:
        // Push requires device tokens (would be fetched from user profile)
        messageDto.deviceTokens = []; // In real implementation, fetch from DB
        break;

      case CommunicationChannel.VOICE:
        if (!recipient.phone) {
          throw new Error('Recipient has no phone number for voice call');
        }
        messageDto.phoneNumber = recipient.phone;
        break;
    }

    // Call communication service
    const result = await this.communicationService.sendMessage(messageDto as any);
    return { success: true, messageId: result?.id || 'unknown' };
  }

  /**
   * Map emergency broadcast channel to communication service channel format
   */
  private mapChannelToServiceChannel(channel: CommunicationChannel): string {
    const channelMap = {
      [CommunicationChannel.SMS]: 'sms',
      [CommunicationChannel.EMAIL]: 'email',
      [CommunicationChannel.PUSH]: 'push',
      [CommunicationChannel.VOICE]: 'voice',
    };
    return channelMap[channel] || 'email';
  }

  /**
   * Sleep utility for retry backoff
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Validate recipient has required contact info for channel
   */
  validateRecipientForChannel(
    recipient: BroadcastRecipient,
    channel: CommunicationChannel,
  ): { isValid: boolean; reason?: string } {
    switch (channel) {
      case CommunicationChannel.SMS:
      case CommunicationChannel.VOICE:
        return {
          isValid: !!recipient.phone,
          reason: !recipient.phone ? 'Missing phone number' : undefined,
        };

      case CommunicationChannel.EMAIL:
        return {
          isValid: !!recipient.email,
          reason: !recipient.email ? 'Missing email address' : undefined,
        };

      case CommunicationChannel.PUSH:
        // In real implementation, would check for device tokens
        return { isValid: true };

      default:
        return { isValid: false, reason: 'Unknown channel' };
    }
  }

  /**
   * Get delivery statistics from results
   */
  getDeliveryStats(results: RecipientDeliveryStatus[]): {
    total: number;
    delivered: number;
    failed: number;
    pending: number;
    byChannel: Record<string, { delivered: number; failed: number }>;
  } {
    const stats = {
      total: results.length,
      delivered: 0,
      failed: 0,
      pending: 0,
      byChannel: {} as Record<string, { delivered: number; failed: number }>,
    };

    for (const result of results) {
      const channelKey = result.contactMethod || 'unknown';

      // Initialize channel stats if not exists
      if (!stats.byChannel[channelKey]) {
        stats.byChannel[channelKey] = { delivered: 0, failed: 0 };
      }

      // Count by status
      switch (result.status) {
        case DeliveryStatus.DELIVERED:
          stats.delivered++;
          stats.byChannel[channelKey].delivered++;
          break;
        case DeliveryStatus.FAILED:
          stats.failed++;
          stats.byChannel[channelKey].failed++;
          break;
        case DeliveryStatus.QUEUED:
          stats.pending++;
          break;
      }
    }

    return stats;
  }
}
