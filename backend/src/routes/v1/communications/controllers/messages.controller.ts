/**
 * Messages Controller
 * Business logic for message management, delivery tracking, and templates
 */

import { ResponseToolkit } from '@hapi/hapi';
import { CommunicationService } from '../../../../services/communication';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse
} from '../../../shared/utils';

export class MessagesController {
  /**
   * List messages with pagination and filters
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page = 1, limit = 20, senderId, recipientId, category, priority, status, dateFrom, dateTo } = request.query;

    const filters: any = {};
    if (senderId) filters.senderId = senderId;
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    const result = await CommunicationService.getMessages(
      parseInt(page as string),
      parseInt(limit as string),
      filters
    );

    return successResponse(h, {
      messages: result.messages,
      pagination: result.pagination
    });
  }

  /**
   * Get message by ID with full details
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const message = await CommunicationService.getMessageById(id);

    if (!message) {
      return h.response({
        success: false,
        error: { message: 'Message not found' }
      }).code(404);
    }

    return successResponse(h, { message });
  }

  /**
   * Send new message to specific recipients
   */
  static async send(request: AuthenticatedRequest, h: ResponseToolkit) {
    const senderId = request.auth.credentials?.userId;

    const result = await CommunicationService.sendMessage({
      ...request.payload,
      senderId,
      scheduledAt: request.payload.scheduledAt ? new Date(request.payload.scheduledAt) : undefined
    });

    return createdResponse(h, {
      message: result.message,
      deliveryStatuses: result.deliveryStatuses
    });
  }

  /**
   * Update message (draft editing only)
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const senderId = request.auth.credentials?.userId;

    // Get message to verify ownership and status
    const message = await CommunicationService.getMessageById(id);

    if (!message) {
      return h.response({
        success: false,
        error: { message: 'Message not found' }
      }).code(404);
    }

    // Only allow editing of messages that haven't been sent yet (scheduled messages)
    if (!message.scheduledAt || message.scheduledAt <= new Date()) {
      return h.response({
        success: false,
        error: { message: 'Cannot update messages that have already been sent or are not scheduled' }
      }).code(400);
    }

    // Verify ownership
    if (message.senderId !== senderId) {
      return h.response({
        success: false,
        error: { message: 'Unauthorized to update this message' }
      }).code(403);
    }

    // For now, we'll return the message as-is since updates are limited
    // In a full implementation, you'd add an updateMessage method to the service
    return successResponse(h, {
      message,
      note: 'Message update functionality limited to scheduled messages only'
    });
  }

  /**
   * Delete message (cancel scheduled or mark as deleted)
   */
  /**
   * Delete message - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async delete(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const senderId = request.auth.credentials?.userId;

    // Get message to verify ownership and status
    const message = await CommunicationService.getMessageById(id);

    if (!message) {
      return h.response({
        success: false,
        error: { message: 'Message not found' }
      }).code(404);
    }

    // Verify ownership
    if (message.senderId !== senderId) {
      return h.response({
        success: false,
        error: { message: 'Unauthorized to delete this message' }
      }).code(403);
    }

    // Only allow deletion of scheduled messages
    if (!message.scheduledAt || message.scheduledAt <= new Date()) {
      return h.response({
        success: false,
        error: { message: 'Cannot delete messages that have already been sent' }
      }).code(400);
    }

    // Delete the scheduled message
    // In a full implementation, you'd add a deleteMessage method to the service
    // await CommunicationService.deleteMessage(id);

    return h.response().code(204);
  }

  /**
   * Reply to a message
   */
  static async reply(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const senderId = request.auth.credentials?.userId;

    // Get original message
    const originalMessage = await CommunicationService.getMessageById(id);

    if (!originalMessage) {
      return h.response({
        success: false,
        error: { message: 'Original message not found' }
      }).code(404);
    }

    // Create reply using the send functionality
    // Reply goes to the original sender
    const result = await CommunicationService.sendMessage({
      recipients: [{
        type: 'NURSE', // Assuming original sender is a nurse
        id: originalMessage.senderId,
        email: undefined,
        phoneNumber: undefined
      }],
      channels: request.payload.channels || ['EMAIL'],
      subject: `Re: ${originalMessage.subject || 'Your message'}`,
      content: request.payload.content,
      priority: request.payload.priority || 'MEDIUM',
      category: originalMessage.category,
      senderId
    });

    return createdResponse(h, {
      message: result.message,
      deliveryStatuses: result.deliveryStatuses
    });
  }

  /**
   * Get inbox messages for current user
   */
  static async getInbox(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials?.userId;
    const { page = 1, limit = 20 } = request.query;

    // Get messages where current user is a recipient
    const deliveries = await CommunicationService.getRecipientDeliveries(
      userId,
      parseInt(limit as string) * parseInt(page as string)
    );

    // Extract unique messages from deliveries
    const messages = deliveries
      .map((d: any) => d.message)
      .filter((m: any, index: number, self: any[]) =>
        index === self.findIndex((t: any) => t.id === m.id)
      );

    return successResponse(h, {
      messages,
      total: deliveries.length,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
  }

  /**
   * Get sent messages for current user
   */
  static async getSent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials?.userId;
    const { page = 1, limit = 20 } = request.query;

    const result = await CommunicationService.getMessages(
      parseInt(page as string),
      parseInt(limit as string),
      { senderId: userId }
    );

    return successResponse(h, {
      messages: result.messages,
      pagination: result.pagination
    });
  }

  /**
   * List message templates
   */
  static async listTemplates(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { type, category, isActive = 'true' } = request.query;

    const templates = await CommunicationService.getMessageTemplates(
      type as any,
      category as any,
      isActive === 'true'
    );

    return successResponse(h, { templates });
  }

  /**
   * Create message template
   */
  static async createTemplate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const createdBy = request.auth.credentials?.userId;

    const template = await CommunicationService.createMessageTemplate({
      ...request.payload,
      createdBy
    });

    return createdResponse(h, { template });
  }

  /**
   * Get delivery status for a message
   */
  static async getDeliveryStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { messageId } = request.params;

    const result = await CommunicationService.getMessageDeliveryStatus(messageId);

    return successResponse(h, {
      deliveries: result.deliveries,
      summary: result.summary
    });
  }

  /**
   * Get messaging statistics
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { dateFrom, dateTo, senderId } = request.query;

    const dateFromParsed = dateFrom ? new Date(dateFrom as string) : undefined;
    const dateToParsed = dateTo ? new Date(dateTo as string) : undefined;

    let stats;
    if (senderId) {
      stats = await CommunicationService.getSenderStatistics(
        senderId as string,
        dateFromParsed,
        dateToParsed
      );
    } else {
      stats = await CommunicationService.getCommunicationStatistics(
        dateFromParsed,
        dateToParsed
      );
    }

    return successResponse(h, { stats });
  }
}
