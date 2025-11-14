import { Injectable, Logger } from '@nestjs/common';
import { BroadcastMessageDto } from '../dto/broadcast-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateMessageTemplateDto } from '../dto/create-message-template.dto';
import { EmergencyAlertDto } from '../dto/emergency-alert.dto';
import { MessageDeliveryStatusResult } from '../interfaces/index';
import { MessageService } from './message.service';
import { TemplateService } from './template.service';
import { BroadcastService } from './broadcast.service';

import { BaseService } from '@/common/base';

/**
 * CommunicationService
 *
 * Orchestration service that coordinates between different communication services.
 * Provides a unified interface for:
 * - Template-based messaging
 * - Broadcast messages
 * - Emergency alerts
 * - Direct message sending
 */
@Injectable()
export class CommunicationService extends BaseService {
  constructor(
    private readonly messageService: MessageService,
    private readonly templateService: TemplateService,
    private readonly broadcastService: BroadcastService,
  ) {
    super('CommunicationService');
  }

  /**
   * Create a message template
   */
  async createMessageTemplate(
    dto: CreateMessageTemplateDto & { createdById: string }
  ): Promise<any> {
    this.logInfo(`Creating message template: ${dto.name}`);

    const template = await this.templateService.createTemplate(dto);

    this.logInfo(`Template created successfully: ${dto.name}`);

    return {
      id: template.template.id,
      name: template.template.name,
      createdAt: template.template.createdAt,
    };
  }

  /**
   * Send a direct message (with optional template rendering)
   */
  async sendMessage(dto: CreateMessageDto & { senderId: string }): Promise<{
    message: any;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo(`Sending message to ${dto.recipients.length} recipients`);

    let subject = dto.subject;
    let content = dto.content;

    // If using a template, render it first
    if (dto.templateId) {
      this.logInfo(`Rendering template: ${dto.templateId}`);

      const rendered = await this.templateService.renderTemplate(
        dto.templateId,
        dto.templateVariables || {}
      );

      subject = rendered.subject;
      content = rendered.content;

      this.logInfo(`Template rendered: ${rendered.renderedVariables.join(', ')}`);
    }

    // Send the message
    const result = await this.messageService.sendMessage({
      ...dto,
      subject,
      content,
    });

    this.logInfo(`Message sent successfully. Message ID: ${result.message.id}`);

    return result;
  }

  /**
   * Send a broadcast message to multiple recipients
   */
  async sendBroadcastMessage(dto: BroadcastMessageDto & { senderId: string }): Promise<{
    message: any;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo(`Sending broadcast message: ${dto.subject}`);

    let subject = dto.subject;
    let content = dto.content;

    // If using a template, render it first
    if (dto.templateId) {
      this.logInfo(`Rendering broadcast template: ${dto.templateId}`);

      const rendered = await this.templateService.renderTemplate(
        dto.templateId,
        dto.templateVariables || {}
      );

      subject = rendered.subject;
      content = rendered.content;
    }

    // Build recipient list based on audience criteria
    const recipients = this.buildRecipientList(dto);

    // Send via broadcast service
    const result = await this.broadcastService.createBroadcast({
      subject,
      content,
      priority: dto.priority || 'MEDIUM',
      category: dto.category || 'GENERAL',
      channels: dto.channels || ['EMAIL'],
      scheduledAt: dto.scheduledAt,
      senderId: dto.senderId,
      audience: dto.audience,
      recipients,
    });

    this.logInfo(`Broadcast message created. ID: ${result.message.id}`);

    return {
      message: result.message,
      deliveryStatuses: result.deliveryStatuses,
    };
  }

  /**
   * Send an emergency alert with high priority
   */
  async sendEmergencyAlert(dto: EmergencyAlertDto & { senderId: string }): Promise<{
    message: any;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo(`Sending EMERGENCY alert: ${dto.subject}`);

    // Emergency alerts always use highest priority and all channels
    const channels = dto.channels || ['EMAIL', 'SMS', 'PUSH'];

    // Build recipient list based on scope
    const recipients = this.buildEmergencyRecipientList(dto);

    this.logInfo(`Emergency alert will be sent to ${recipients.length} recipients via ${channels.join(', ')}`);

    // Send emergency broadcast
    const result = await this.broadcastService.createBroadcast({
      subject: `[EMERGENCY] ${dto.subject}`,
      content: dto.content,
      priority: 'HIGH',
      category: 'EMERGENCY',
      channels,
      senderId: dto.senderId,
      audience: dto.scope,
      recipients,
    });

    this.logInfo(`Emergency alert sent. Message ID: ${result.message.id}`);

    return {
      message: result.message,
      deliveryStatuses: result.deliveryStatuses,
    };
  }

  /**
   * Send notification via specific channel
   */
  async sendNotification(params: {
    recipientId: string;
    recipientType: string;
    subject: string;
    content: string;
    channel: 'EMAIL' | 'SMS' | 'PUSH';
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  }): Promise<{ success: boolean; messageId?: string }> {
    this.logInfo(`Sending ${params.channel} notification to ${params.recipientId}`);

    const result = await this.messageService.sendMessage({
      recipients: [
        {
          type: params.recipientType as any,
          id: params.recipientId,
          email: undefined, // Will be resolved from user profile
        },
      ],
      channels: [params.channel],
      subject: params.subject,
      content: params.content,
      priority: params.priority || 'MEDIUM',
      category: 'NOTIFICATION',
      senderId: 'system',
    });

    return {
      success: true,
      messageId: result.message.id,
    };
  }

  /**
   * Build recipient list from broadcast criteria
   */
  private buildRecipientList(dto: BroadcastMessageDto): Array<{
    type: string;
    id: string;
    email?: string;
    phoneNumber?: string;
  }> {
    const recipients: Array<{ type: string; id: string; email?: string; phoneNumber?: string }> = [];

    // Parse audience criteria
    if (dto.audience) {
      // Example audience formats:
      // - "ALL_STUDENTS"
      // - "GRADE_9"
      // - "SCHOOL_123"
      // - "ROLE_NURSE"

      this.logInfo(`Building recipient list for audience: ${dto.audience}`);

      // TODO: Integrate with user/student service to fetch recipients
      // For now, return empty array - will be populated by actual service integration
      this.logWarning('Recipient list building not fully implemented - integrate with user service');
    }

    return recipients;
  }

  /**
   * Build emergency recipient list
   */
  private buildEmergencyRecipientList(dto: EmergencyAlertDto): Array<{
    type: string;
    id: string;
    email?: string;
    phoneNumber?: string;
  }> {
    const recipients: Array<{ type: string; id: string; email?: string; phoneNumber?: string }> = [];

    // Emergency scope examples:
    // - "ALL" - everyone in the system
    // - "SCHOOL_123" - all users in a specific school
    // - "STAFF" - all staff members
    // - "EMERGENCY_CONTACTS" - all emergency contacts

    this.logInfo(`Building emergency recipient list for scope: ${dto.scope}`);

    // TODO: Integrate with user/student service to fetch emergency recipients
    // This should prioritize:
    // 1. Verified emergency contacts
    // 2. Staff with emergency response roles
    // 3. Administration
    this.logWarning('Emergency recipient list building not fully implemented - integrate with user service');

    return recipients;
  }

  /**
   * Get message delivery statistics
   */
  async getDeliveryStatistics(messageId: string): Promise<{
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
  }> {
    const status = await this.messageService.getMessageDeliveryStatus(messageId);

    return {
      total: status.summary.total,
      sent: status.summary.sent,
      delivered: status.summary.delivered,
      failed: status.summary.failed,
      pending: status.summary.pending,
    };
  }

  /**
   * Retry failed message deliveries
   */
  async retryFailedDeliveries(messageId: string): Promise<{
    retriedCount: number;
    newDeliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    this.logInfo(`Retrying failed deliveries for message ${messageId}`);

    const status = await this.messageService.getMessageDeliveryStatus(messageId);

    // Find failed deliveries
    const failedDeliveries = status.deliveries.filter(
      (d) => d.status === 'FAILED' || d.status === 'BOUNCED'
    );

    if (failedDeliveries.length === 0) {
      this.logInfo('No failed deliveries to retry');
      return { retriedCount: 0, newDeliveryStatuses: [] };
    }

    this.logInfo(`Retrying ${failedDeliveries.length} failed deliveries`);

    // TODO: Implement actual retry logic
    // This should re-queue the failed deliveries for processing

    return {
      retriedCount: failedDeliveries.length,
      newDeliveryStatuses: [],
    };
  }
}
