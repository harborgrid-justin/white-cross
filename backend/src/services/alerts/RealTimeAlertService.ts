import AlertInstance, { AlertSeverity, AlertStatus, AlertCategory } from '@/database/models/alerts/AlertInstance';
import AlertDefinition from '@/database/models/alerts/AlertDefinition';
import AlertSubscription, { DeliveryChannel } from '@/database/models/alerts/AlertSubscription';
import AlertDeliveryLog from '@/database/models/alerts/AlertDeliveryLog';
import { Op } from 'sequelize';
import { WebSocketService } from '@/infrastructure/websocket/WebSocketService';
import { EmailService } from '@/infrastructure/email/EmailService';
import { SMSService } from '@/infrastructure/sms/SMSService';

export interface CreateAlertDTO {
  definitionId?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  studentId?: string;
  userId?: string;
  schoolId?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  autoEscalateAfter?: number;
  requiresAcknowledgment: boolean;
}

export interface AlertFilters {
  severity?: AlertSeverity[];
  category?: AlertCategory[];
  status?: AlertStatus[];
  studentId?: string;
  userId?: string;
  schoolId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface AlertStatistics {
  totalAlerts: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  averageAcknowledgmentTime: number;
  averageResolutionTime: number;
  unacknowledgedCritical: number;
  escalatedAlerts: number;
}

/**
 * Real-Time Alert Service
 * Feature 26: Real-Time Alerts System
 *
 * Manages WebSocket-based real-time alerting with multi-channel delivery
 */
export class RealTimeAlertService {
  private wsService: WebSocketService;
  private emailService: EmailService;
  private smsService: SMSService;

  constructor(
    wsService: WebSocketService,
    emailService: EmailService,
    smsService: SMSService
  ) {
    this.wsService = wsService;
    this.emailService = emailService;
    this.smsService = smsService;
  }

  /**
   * Create and broadcast a new alert
   */
  async createAlert(data: CreateAlertDTO, createdBy: string): Promise<AlertInstance> {
    // Create alert instance
    const alert = await AlertInstance.create({
      ...data,
      status: AlertStatus.ACTIVE,
      createdBy,
    });

    // Broadcast via WebSocket
    await this.broadcastAlert(alert);

    // Get subscribers and deliver via other channels
    const subscribers = await this.getSubscribers(alert);
    await this.deliverToSubscribers(alert, subscribers);

    // Schedule auto-escalation if configured
    if (data.autoEscalateAfter) {
      await this.scheduleAutoEscalation(alert.id, data.autoEscalateAfter);
    }

    return alert;
  }

  /**
   * Broadcast alert via WebSocket to relevant users
   */
  private async broadcastAlert(alert: AlertInstance): Promise<void> {
    const rooms: string[] = [];

    // Determine which rooms to broadcast to
    if (alert.schoolId) {
      rooms.push(`school:${alert.schoolId}`);
    }
    if (alert.userId) {
      rooms.push(`user:${alert.userId}`);
    }
    if (alert.studentId) {
      rooms.push(`student:${alert.studentId}`);
    }

    // Broadcast severity-based rooms
    if (alert.severity === AlertSeverity.EMERGENCY || alert.severity === AlertSeverity.CRITICAL) {
      rooms.push('alerts:critical');
    }

    // Broadcast to all relevant rooms
    for (const room of rooms) {
      await this.wsService.broadcastToRoom(room, 'alert:new', {
        id: alert.id,
        severity: alert.severity,
        category: alert.category,
        title: alert.title,
        message: alert.message,
        metadata: alert.metadata,
        createdAt: alert.createdAt,
      });
    }

    // Log WebSocket delivery
    await AlertDeliveryLog.create({
      alertId: alert.id,
      channel: DeliveryChannel.WEBSOCKET,
      recipientId: null,
      success: true,
      deliveredAt: new Date(),
    });
  }

  /**
   * Get subscribers for an alert
   */
  private async getSubscribers(alert: AlertInstance): Promise<AlertSubscription[]> {
    const where: any = {
      isActive: true,
    };

    // Filter by severity
    where.severityFilter = {
      [Op.contains]: [alert.severity],
    };

    // Filter by category
    where.categoryFilter = {
      [Op.contains]: [alert.category],
    };

    // Filter by scope
    if (alert.schoolId) {
      where.schoolId = alert.schoolId;
    }

    return AlertSubscription.findAll({
      where,
      include: ['user'],
    });
  }

  /**
   * Deliver alert to subscribers via their preferred channels
   */
  private async deliverToSubscribers(
    alert: AlertInstance,
    subscribers: AlertSubscription[]
  ): Promise<void> {
    for (const subscription of subscribers) {
      // Email delivery
      if (subscription.channels.includes(DeliveryChannel.EMAIL) && subscription.user.email) {
        try {
          await this.emailService.sendAlertEmail(subscription.user.email, {
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
            category: alert.category,
            alertId: alert.id,
          });

          await AlertDeliveryLog.create({
            alertId: alert.id,
            channel: DeliveryChannel.EMAIL,
            recipientId: subscription.userId,
            success: true,
            deliveredAt: new Date(),
          });
        } catch (error) {
          await AlertDeliveryLog.create({
            alertId: alert.id,
            channel: DeliveryChannel.EMAIL,
            recipientId: subscription.userId,
            success: false,
            errorMessage: error.message,
          });
        }
      }

      // SMS delivery
      if (subscription.channels.includes(DeliveryChannel.SMS) && subscription.user.phone) {
        try {
          await this.smsService.sendAlertSMS(subscription.user.phone, {
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
          });

          await AlertDeliveryLog.create({
            alertId: alert.id,
            channel: DeliveryChannel.SMS,
            recipientId: subscription.userId,
            success: true,
            deliveredAt: new Date(),
          });
        } catch (error) {
          await AlertDeliveryLog.create({
            alertId: alert.id,
            channel: DeliveryChannel.SMS,
            recipientId: subscription.userId,
            success: false,
            errorMessage: error.message,
          });
        }
      }

      // Push notification delivery
      if (subscription.channels.includes(DeliveryChannel.PUSH_NOTIFICATION)) {
        // Push notification implementation would go here
        // Skipping for now as it requires additional infrastructure
      }
    }
  }

  /**
   * Schedule auto-escalation for an alert
   */
  private async scheduleAutoEscalation(alertId: string, delayMinutes: number): Promise<void> {
    // This would integrate with the job queue system
    // For now, we'll just store the auto-escalation time
    const alert = await AlertInstance.findByPk(alertId);
    if (alert) {
      await alert.update({
        autoEscalateAfter: delayMinutes,
      });
    }
  }

  /**
   * Get alerts with filtering and pagination
   */
  async getAlerts(filters: AlertFilters): Promise<{ alerts: AlertInstance[]; total: number }> {
    const where: any = {};

    if (filters.severity && filters.severity.length > 0) {
      where.severity = { [Op.in]: filters.severity };
    }

    if (filters.category && filters.category.length > 0) {
      where.category = { [Op.in]: filters.category };
    }

    if (filters.status && filters.status.length > 0) {
      where.status = { [Op.in]: filters.status };
    }

    if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.schoolId) {
      where.schoolId = filters.schoolId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt[Op.lte] = filters.dateTo;
      }
    }

    const { rows, count } = await AlertInstance.findAndCountAll({
      where,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      order: [['createdAt', 'DESC']],
      include: ['creator', 'student', 'definition'],
    });

    return { alerts: rows, total: count };
  }

  /**
   * Get alert by ID
   */
  async getAlertById(id: string): Promise<AlertInstance | null> {
    return AlertInstance.findByPk(id, {
      include: ['creator', 'student', 'definition', 'deliveryLogs'],
    });
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(
    id: string,
    userId: string,
    notes?: string
  ): Promise<AlertInstance> {
    const alert = await AlertInstance.findByPk(id);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.status !== AlertStatus.ACTIVE) {
      throw new Error('Only active alerts can be acknowledged');
    }

    await alert.acknowledge(userId);

    if (notes) {
      await alert.update({
        notes: notes ? `${alert.notes || ''}\n\nAcknowledged: ${notes}` : alert.notes,
      });
    }

    // Broadcast acknowledgment
    await this.wsService.broadcastToRoom(`school:${alert.schoolId}`, 'alert:acknowledged', {
      id: alert.id,
      acknowledgedBy: userId,
      acknowledgedAt: alert.acknowledgedAt,
    });

    return alert;
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(
    id: string,
    userId: string,
    resolution: string
  ): Promise<AlertInstance> {
    const alert = await AlertInstance.findByPk(id);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.status === AlertStatus.RESOLVED) {
      throw new Error('Alert is already resolved');
    }

    await alert.resolve(userId, resolution);

    // Broadcast resolution
    await this.wsService.broadcastToRoom(`school:${alert.schoolId}`, 'alert:resolved', {
      id: alert.id,
      resolvedBy: userId,
      resolvedAt: alert.resolvedAt,
    });

    return alert;
  }

  /**
   * Escalate an alert
   */
  async escalateAlert(
    id: string,
    userId: string,
    escalationReason: string,
    escalationLevel: number
  ): Promise<AlertInstance> {
    const alert = await AlertInstance.findByPk(id);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (alert.status !== AlertStatus.ACTIVE && alert.status !== AlertStatus.ACKNOWLEDGED) {
      throw new Error('Only active or acknowledged alerts can be escalated');
    }

    await alert.escalate(escalationLevel, escalationReason);

    // Broadcast escalation
    await this.wsService.broadcastToRoom(`school:${alert.schoolId}`, 'alert:escalated', {
      id: alert.id,
      escalationLevel: alert.escalationLevel,
      escalationReason: alert.escalationReason,
    });

    // Re-deliver to subscribers with escalation priority
    const subscribers = await this.getSubscribers(alert);
    await this.deliverToSubscribers(alert, subscribers);

    return alert;
  }

  /**
   * Dismiss an alert
   */
  async dismissAlert(
    id: string,
    userId: string,
    dismissalReason: string
  ): Promise<AlertInstance> {
    const alert = await AlertInstance.findByPk(id);
    if (!alert) {
      throw new Error('Alert not found');
    }

    await alert.update({
      status: AlertStatus.DISMISSED,
      notes: `${alert.notes || ''}\n\nDismissed by ${userId}: ${dismissalReason}`,
    });

    // Broadcast dismissal
    await this.wsService.broadcastToRoom(`school:${alert.schoolId}`, 'alert:dismissed', {
      id: alert.id,
      dismissedBy: userId,
    });

    return alert;
  }

  /**
   * Get critical unacknowledged alerts
   */
  async getCriticalUnacknowledged(): Promise<AlertInstance[]> {
    return AlertInstance.findCriticalUnacknowledged();
  }

  /**
   * Get active alerts for a user
   */
  async getActiveAlertsForUser(userId: string): Promise<AlertInstance[]> {
    return AlertInstance.findActiveAlertsForUser(userId);
  }

  /**
   * Get alerts expiring soon
   */
  async getExpiringAlerts(hours: number = 1): Promise<AlertInstance[]> {
    return AlertInstance.findExpiringSoon(hours);
  }

  /**
   * Create or update alert subscription
   */
  async manageSubscription(
    userId: string,
    schoolId: string,
    channels: DeliveryChannel[],
    severityFilter: AlertSeverity[],
    categoryFilter: AlertCategory[],
    quietHoursStart?: string,
    quietHoursEnd?: string
  ): Promise<AlertSubscription> {
    // Check if subscription exists
    const existing = await AlertSubscription.findOne({
      where: { userId, schoolId },
    });

    if (existing) {
      // Update existing subscription
      return existing.update({
        channels,
        severityFilter,
        categoryFilter,
        quietHoursStart,
        quietHoursEnd,
        isActive: true,
      });
    } else {
      // Create new subscription
      return AlertSubscription.create({
        userId,
        schoolId,
        channels,
        severityFilter,
        categoryFilter,
        quietHoursStart,
        quietHoursEnd,
        isActive: true,
      });
    }
  }

  /**
   * Get alert statistics
   */
  async getStatistics(schoolId: string, startDate: Date, endDate: Date): Promise<AlertStatistics> {
    const alerts = await AlertInstance.findAll({
      where: {
        schoolId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const stats: AlertStatistics = {
      totalAlerts: alerts.length,
      bySeverity: {},
      byCategory: {},
      byStatus: {},
      averageAcknowledgmentTime: 0,
      averageResolutionTime: 0,
      unacknowledgedCritical: 0,
      escalatedAlerts: 0,
    };

    let totalAckTime = 0;
    let ackCount = 0;
    let totalResolutionTime = 0;
    let resolutionCount = 0;

    for (const alert of alerts) {
      // Count by severity
      stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;

      // Count by category
      stats.byCategory[alert.category] = (stats.byCategory[alert.category] || 0) + 1;

      // Count by status
      stats.byStatus[alert.status] = (stats.byStatus[alert.status] || 0) + 1;

      // Calculate acknowledgment time
      if (alert.acknowledgedAt) {
        const ackTime = alert.acknowledgedAt.getTime() - alert.createdAt.getTime();
        totalAckTime += ackTime;
        ackCount++;
      }

      // Calculate resolution time
      if (alert.resolvedAt) {
        const resolutionTime = alert.resolvedAt.getTime() - alert.createdAt.getTime();
        totalResolutionTime += resolutionTime;
        resolutionCount++;
      }

      // Count unacknowledged critical
      if (
        !alert.acknowledgedAt &&
        (alert.severity === AlertSeverity.CRITICAL || alert.severity === AlertSeverity.EMERGENCY)
      ) {
        stats.unacknowledgedCritical++;
      }

      // Count escalated
      if (alert.escalationLevel && alert.escalationLevel > 0) {
        stats.escalatedAlerts++;
      }
    }

    // Calculate averages (in minutes)
    stats.averageAcknowledgmentTime = ackCount > 0 ? totalAckTime / ackCount / 60000 : 0;
    stats.averageResolutionTime = resolutionCount > 0 ? totalResolutionTime / resolutionCount / 60000 : 0;

    return stats;
  }

  /**
   * Get delivery statistics
   */
  async getDeliveryStatistics(
    alertId: string
  ): Promise<{
    total: number;
    byChannel: Record<string, { success: number; failed: number }>;
  }> {
    const logs = await AlertDeliveryLog.findAll({
      where: { alertId },
    });

    const stats = {
      total: logs.length,
      byChannel: {} as Record<string, { success: number; failed: number }>,
    };

    for (const log of logs) {
      if (!stats.byChannel[log.channel]) {
        stats.byChannel[log.channel] = { success: 0, failed: 0 };
      }

      if (log.success) {
        stats.byChannel[log.channel].success++;
      } else {
        stats.byChannel[log.channel].failed++;
      }
    }

    return stats;
  }
}

export default RealTimeAlertService;
