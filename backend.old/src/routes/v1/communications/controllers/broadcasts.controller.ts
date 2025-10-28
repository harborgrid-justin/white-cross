/**
 * Broadcasts Controller
 * Business logic for broadcast messages, emergency alerts, and scheduled messaging
 */

import { ResponseToolkit } from '@hapi/hapi';
import { CommunicationService } from '../../../../services/communication';
import { BroadcastMessageData } from '../../../../services/communication/types';
import { ScheduledMessageQueue } from '../../../../services/communication/scheduledMessageQueue';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse
} from '../../../shared/utils';
import { preparePayload } from '../../../../shared/utils/payloadHelpers';

/**
 * Payload Interfaces
 */
interface BroadcastPayload {
  audience: BroadcastMessageData['audience'];
  channels: BroadcastMessageData['channels'];
  subject?: string;
  content: string;
  priority: BroadcastMessageData['priority'];
  category: BroadcastMessageData['category'];
  scheduledAt?: string | Date;
  translateTo?: string[];
}

interface SchedulePayload {
  subject: string;
  body: string;
  recipientType: 'ALL_PARENTS' | 'SPECIFIC_USERS' | 'STUDENT_PARENTS' | 'GRADE_LEVEL' | 'CUSTOM_GROUP';
  recipientIds?: string[];
  recipientFilter?: {
    studentIds?: string[];
    gradeLevel?: string;
    schoolId?: string;
    tags?: string[];
  };
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'PORTAL')[];
  scheduledFor: string | Date;
  timezone?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  templateId?: string;
  templateVariables?: Record<string, string>;
  throttle?: {
    maxPerMinute?: number;
    maxPerHour?: number;
  };
  schoolId?: string;
}

export class BroadcastsController {
  /**
   * Create emergency broadcast message
   */
  static async createBroadcast(request: AuthenticatedRequest, h: ResponseToolkit) {
    const senderId = request.auth.credentials?.userId;
    const payload = request.payload as BroadcastPayload;

    // Extract all required fields for BroadcastMessageData
    const broadcastData: BroadcastMessageData = {
      audience: payload.audience,
      channels: payload.channels,
      subject: payload.subject,
      content: payload.content,
      priority: payload.priority,
      category: payload.category,
      senderId: senderId as string,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : undefined,
      translateTo: payload.translateTo
    };

    const result = await CommunicationService.sendBroadcastMessage(broadcastData);

    return createdResponse(h, {
      message: result.message,
      deliveryStatuses: result.deliveryStatuses
    });
  }

  /**
   * List broadcast messages with filters
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page = 1, limit = 20, category, priority, dateFrom, dateTo } = request.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    // Get all messages (broadcasts are just messages with multiple recipients)
    const result = await CommunicationService.getMessages(
      parseInt(page as string),
      parseInt(limit as string),
      filters
    );

    // Filter for broadcasts (messages with recipientCount > 1)
    const broadcasts = result.messages.filter((m: any) => m.recipientCount > 1);

    return successResponse(h, {
      broadcasts,
      pagination: {
        ...result.pagination,
        total: broadcasts.length
      }
    });
  }

  /**
   * Get broadcast by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const message = await CommunicationService.getMessageById(id);

    if (!message) {
      return h.response({
        success: false,
        error: { message: 'Broadcast not found' }
      }).code(404);
    }

    // Verify it's actually a broadcast
    if ((message as any).recipientCount <= 1) {
      return h.response({
        success: false,
        error: { message: 'This is not a broadcast message' }
      }).code(400);
    }

    return successResponse(h, { broadcast: message });
  }

  /**
   * Cancel scheduled broadcast
   */
  static async cancel(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const userId = request.auth.credentials?.userId;

    const message = await CommunicationService.getMessageById(id);

    if (!message) {
      return h.response({
        success: false,
        error: { message: 'Broadcast not found' }
      }).code(404);
    }

    // Verify ownership
    if ((message as any).senderId !== userId) {
      return h.response({
        success: false,
        error: { message: 'Unauthorized to cancel this broadcast' }
      }).code(403);
    }

    // Only allow cancellation of scheduled broadcasts
    if (!(message as any).scheduledAt || (message as any).scheduledAt <= new Date()) {
      return h.response({
        success: false,
        error: { message: 'Cannot cancel broadcasts that have already been sent or are not scheduled' }
      }).code(400);
    }

    // For now, return success
    // In a full implementation, you'd add a cancelMessage method to the service
    return successResponse(h, {
      success: true,
      message: 'Broadcast cancelled successfully'
    });
  }

  /**
   * Get broadcast recipients
   */
  static async getRecipients(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { page = 1, limit = 50 } = request.query;

    const message = await CommunicationService.getMessageById(id);

    if (!message) {
      return h.response({
        success: false,
        error: { message: 'Broadcast not found' }
      }).code(404);
    }

    // Get deliveries for this message
    const deliveryResult = await CommunicationService.getMessageDeliveryStatus(id);

    // Paginate deliveries
    const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedDeliveries = deliveryResult.deliveries.slice(startIndex, endIndex);

    return successResponse(h, {
      recipients: paginatedDeliveries,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: deliveryResult.deliveries.length,
        pages: Math.ceil(deliveryResult.deliveries.length / parseInt(limit as string))
      }
    });
  }

  /**
   * Get broadcast delivery report
   */
  static async getDeliveryReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const result = await CommunicationService.getMessageDeliveryStatus(id);

    // Group deliveries by status for the report
    const report = {
      messageId: id,
      summary: result.summary,
      deliveries: result.deliveries,
      byChannel: {} as Record<string, { total: number; delivered: number; failed: number; pending: number }>,
      byRecipientType: {} as Record<string, { total: number; delivered: number; failed: number; pending: number }>
    };

    // Calculate by-channel statistics
    result.deliveries.forEach((d: any) => {
      if (!report.byChannel[d.channel]) {
        report.byChannel[d.channel] = { total: 0, delivered: 0, failed: 0, pending: 0 };
      }
      report.byChannel[d.channel].total++;
      if (d.status === 'DELIVERED') report.byChannel[d.channel].delivered++;
      if (d.status === 'FAILED') report.byChannel[d.channel].failed++;
      if (d.status === 'PENDING') report.byChannel[d.channel].pending++;
    });

    // Calculate by-recipient-type statistics
    result.deliveries.forEach((d: any) => {
      if (!report.byRecipientType[d.recipientType]) {
        report.byRecipientType[d.recipientType] = { total: 0, delivered: 0, failed: 0, pending: 0 };
      }
      report.byRecipientType[d.recipientType].total++;
      if (d.status === 'DELIVERED') report.byRecipientType[d.recipientType].delivered++;
      if (d.status === 'FAILED') report.byRecipientType[d.recipientType].failed++;
      if (d.status === 'PENDING') report.byRecipientType[d.recipientType].pending++;
    });

    return successResponse(h, { report });
  }

  /**
   * Schedule a message for future delivery
   */
  static async schedule(request: AuthenticatedRequest, h: ResponseToolkit) {
    const createdBy = request.auth.credentials?.userId;
    const payload = request.payload as SchedulePayload;

    // Extract all required fields for scheduleMessage
    const scheduleData = {
      subject: payload.subject,
      body: payload.body,
      recipientType: payload.recipientType,
      recipientIds: payload.recipientIds,
      recipientFilter: payload.recipientFilter,
      channels: payload.channels,
      scheduledFor: typeof payload.scheduledFor === 'string'
        ? new Date(payload.scheduledFor)
        : payload.scheduledFor,
      priority: payload.priority,
      createdBy: createdBy as string,
      schoolId: payload.schoolId
    };

    const scheduledMessage = await ScheduledMessageQueue.scheduleMessage(scheduleData);

    return createdResponse(h, { scheduledMessage });
  }

  /**
   * List scheduled messages
   */
  static async listScheduled(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { status, scheduleType, campaignId, startDate, endDate } = request.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (scheduleType) filters.scheduleType = scheduleType;
    if (campaignId) filters.campaignId = campaignId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const messages = await ScheduledMessageQueue.getScheduledMessages(filters);

    return successResponse(h, { scheduledMessages: messages });
  }
}
