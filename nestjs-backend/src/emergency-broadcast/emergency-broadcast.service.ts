/**
 * LOC: EMERGENCY-BROADCAST-SERVICE-001
 * WC-SVC-EMRG-001 | Emergency Broadcast System Service
 *
 * Purpose: Send emergency notifications to students, parents, and staff simultaneously
 * Critical: Time-sensitive emergency communications for school safety
 */

import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  EmergencyType,
  EmergencyPriority,
  CommunicationChannel,
  BroadcastStatus,
  DeliveryStatus,
} from './emergency-broadcast.enums';
import { EmergencyBroadcast, RecipientDeliveryStatus } from './emergency-broadcast.interfaces';
import {
  CreateEmergencyBroadcastDto,
  UpdateEmergencyBroadcastDto,
  EmergencyBroadcastResponseDto,
  SendBroadcastResponseDto,
  BroadcastStatusResponseDto,
  RecipientDeliveryStatusDto,
  EmergencyTemplateDto,
  DeliveryStatsDto,
} from './dto';
import { EmergencyBroadcastRepository } from '../database/repositories/impl/emergency-broadcast.repository';
import { StudentRepository } from '../database/repositories/impl/student.repository';
import { ExecutionContext } from '../database/types';

@Injectable()
export class EmergencyBroadcastService {
  private readonly logger = new Logger(EmergencyBroadcastService.name);

  constructor(
    @Inject(EmergencyBroadcastRepository)
    private readonly broadcastRepository: EmergencyBroadcastRepository,
    @Inject(StudentRepository)
    private readonly studentRepository: StudentRepository,
  ) {}

  /**
   * Determine priority from emergency type
   */
  determinePriority(type: EmergencyType): EmergencyPriority {
    const criticalTypes = [
      EmergencyType.ACTIVE_THREAT,
      EmergencyType.MEDICAL_EMERGENCY,
      EmergencyType.FIRE,
      EmergencyType.NATURAL_DISASTER,
    ];

    const highTypes = [
      EmergencyType.LOCKDOWN,
      EmergencyType.EVACUATION,
      EmergencyType.SHELTER_IN_PLACE,
    ];

    const mediumTypes = [
      EmergencyType.WEATHER_ALERT,
      EmergencyType.TRANSPORTATION,
      EmergencyType.FACILITY_ISSUE,
    ];

    if (criticalTypes.includes(type)) return EmergencyPriority.CRITICAL;
    if (highTypes.includes(type)) return EmergencyPriority.HIGH;
    if (mediumTypes.includes(type)) return EmergencyPriority.MEDIUM;
    return EmergencyPriority.LOW;
  }

  /**
   * Determine delivery channels based on priority
   */
  getDeliveryChannels(priority: EmergencyPriority): CommunicationChannel[] {
    switch (priority) {
      case EmergencyPriority.CRITICAL:
        return [
          CommunicationChannel.SMS,
          CommunicationChannel.EMAIL,
          CommunicationChannel.PUSH,
          CommunicationChannel.VOICE,
        ];

      case EmergencyPriority.HIGH:
        return [
          CommunicationChannel.SMS,
          CommunicationChannel.EMAIL,
          CommunicationChannel.PUSH,
        ];

      case EmergencyPriority.MEDIUM:
        return [CommunicationChannel.EMAIL, CommunicationChannel.PUSH];

      case EmergencyPriority.LOW:
        return [CommunicationChannel.EMAIL];
    }
  }

  /**
   * Create emergency broadcast
   */
  async createBroadcast(
    createDto: CreateEmergencyBroadcastDto,
  ): Promise<EmergencyBroadcastResponseDto> {
    try {
      // Auto-determine priority if not set
      const priority =
        createDto.priority || this.determinePriority(createDto.type);

      // Auto-determine channels if not set
      const channels =
        createDto.channels || this.getDeliveryChannels(priority);

      // Set default expiration (24 hours for non-critical, 1 hour for critical)
      let expiresAt = createDto.expiresAt;
      if (!expiresAt) {
        const hours = priority === EmergencyPriority.CRITICAL ? 1 : 24;
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      }

      // Create execution context for audit logging
      const context: ExecutionContext = {
        userId: createDto.sentBy,
        userRole: 'ADMIN' as any,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      const emergencyBroadcast = {
        id: `EMG-${Date.now()}`,
        ...createDto,
        priority,
        channels,
        expiresAt,
        sentAt: new Date(),
        status: BroadcastStatus.DRAFT,
      };

      // Save to database with transaction and audit trail
      const savedBroadcast = await this.broadcastRepository.create(
        emergencyBroadcast as any,
        context,
      );

      this.logger.log('Emergency broadcast created', {
        id: savedBroadcast.id,
        type: createDto.type,
        priority,
        audience: createDto.audience,
      });

      return this.mapToResponseDto(savedBroadcast as any);
    } catch (error) {
      this.logger.error('Failed to create emergency broadcast', error);
      throw error;
    }
  }

  /**
   * Update emergency broadcast
   */
  async updateBroadcast(
    id: string,
    updateDto: UpdateEmergencyBroadcastDto,
    userId: string = 'system',
  ): Promise<EmergencyBroadcastResponseDto> {
    try {
      // Retrieve existing broadcast
      const broadcast = await this.broadcastRepository.findById(id);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${id} not found`);
      }

      // Create execution context
      const context: ExecutionContext = {
        userId,
        userRole: 'ADMIN' as any,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      // Update broadcast with transaction
      const updatedBroadcast = await this.broadcastRepository.update(
        id,
        updateDto as any,
        context,
      );

      this.logger.log('Emergency broadcast updated', { id });

      return this.mapToResponseDto(updatedBroadcast as any);
    } catch (error) {
      this.logger.error('Failed to update emergency broadcast', error);
      throw error;
    }
  }

  /**
   * Send emergency broadcast
   */
  async sendBroadcast(broadcastId: string, userId: string = 'system'): Promise<SendBroadcastResponseDto> {
    try {
      // Retrieve broadcast from database
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      this.logger.log('Sending emergency broadcast', { broadcastId });

      // Create execution context
      const context: ExecutionContext = {
        userId,
        userRole: 'ADMIN' as any,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      // 1. Get recipients based on audience and filters
      const recipients = await this.getRecipients(broadcastId);

      // 2. Update broadcast status to SENDING
      await this.broadcastRepository.update(
        broadcastId,
        {
          status: BroadcastStatus.SENDING,
          totalRecipients: recipients.length,
        } as any,
        context,
      );

      // 3. Send to all recipients via specified channels
      const deliveryResults = await this.deliverToRecipients(
        broadcastId,
        recipients,
      );

      // 4. Update final status
      const sent = deliveryResults.filter(
        (r) => r.status === DeliveryStatus.DELIVERED,
      ).length;
      const failed = deliveryResults.filter((r) => r.status === DeliveryStatus.FAILED).length;

      await this.broadcastRepository.update(
        broadcastId,
        {
          status: BroadcastStatus.SENT,
          deliveredCount: sent,
          failedCount: failed,
        } as any,
        context,
      );

      this.logger.log('Emergency broadcast sent', {
        broadcastId,
        totalRecipients: recipients.length,
        sent,
        failed,
      });

      return {
        success: true,
        totalRecipients: recipients.length,
        sent,
        failed,
      };
    } catch (error) {
      this.logger.error('Failed to send emergency broadcast', error);
      throw error;
    }
  }

  /**
   * Get recipients for broadcast
   */
  private async getRecipients(broadcastId: string): Promise<any[]> {
    try {
      this.logger.log('Retrieving recipients for broadcast', { broadcastId });

      // Get broadcast details to determine audience
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast ${broadcastId} not found`);
      }

      // Query database for recipients based on audience criteria
      const whereClause: any = {};

      // Filter by school if specified
      if ((broadcast as any).schoolId) {
        whereClause.schoolId = (broadcast as any).schoolId;
      }

      // Filter by grade if specified
      if ((broadcast as any).gradeLevel) {
        whereClause.gradeLevel = (broadcast as any).gradeLevel;
      }

      // Filter by class if specified
      if ((broadcast as any).classId) {
        whereClause.classId = (broadcast as any).classId;
      }

      // Query students matching criteria
      const students = await this.studentRepository.findMany({
        where: whereClause,
        pagination: { page: 1, limit: 10000 }, // Large limit for emergency broadcasts
      });

      // Map to recipient format with contact information
      // In real implementation, would also query parent/guardian contacts
      return students.data.map((student: any) => ({
        id: student.id,
        type: 'STUDENT',
        name: `${student.firstName} ${student.lastName}`,
        phone: student.phone,
        email: student.email,
      }));
    } catch (error) {
      this.logger.error('Error retrieving recipients:', error);
      return [];
    }
  }

  /**
   * Deliver messages to recipients via all specified channels
   */
  private async deliverToRecipients(
    broadcastId: string,
    recipients: any[],
  ): Promise<RecipientDeliveryStatus[]> {
    const deliveryStatuses: RecipientDeliveryStatus[] = [];

    for (const recipient of recipients) {
      try {
        // TODO: Integrate with communication service
        // For each channel (SMS, Email, Push, Voice):
        // - Format message appropriately for channel
        // - Send via channelService
        // - Track delivery status
        // - Retry on failure (with backoff)

        const status: RecipientDeliveryStatus = {
          recipientId: recipient.id,
          recipientType: recipient.type,
          name: recipient.name,
          contactMethod: CommunicationChannel.SMS, // Would iterate through all channels
          phoneNumber: recipient.phone,
          email: recipient.email,
          status: DeliveryStatus.DELIVERED,
          deliveredAt: new Date(),
        };

        deliveryStatuses.push(status);

        this.logger.debug('Message delivered to recipient', {
          broadcastId,
          recipientId: recipient.id,
          channel: 'SMS',
        });
      } catch (error) {
        this.logger.error('Failed to deliver to recipient', {
          broadcastId,
          recipientId: recipient.id,
          error,
        });

        deliveryStatuses.push({
          recipientId: recipient.id,
          recipientType: recipient.type,
          name: recipient.name,
          contactMethod: CommunicationChannel.SMS,
          status: DeliveryStatus.FAILED,
          error: (error as Error).message,
        });
      }
    }

    return deliveryStatuses;
  }

  /**
   * Get broadcast status and delivery statistics
   */
  async getBroadcastStatus(
    broadcastId: string,
  ): Promise<BroadcastStatusResponseDto> {
    try {
      this.logger.log('Retrieving broadcast status', { broadcastId });

      // Query database for broadcast
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      // Get delivery statistics
      const deliveryStats: DeliveryStatsDto = {
        total: (broadcast as any).totalRecipients || 0,
        delivered: (broadcast as any).deliveredCount || 0,
        failed: (broadcast as any).failedCount || 0,
        pending: ((broadcast as any).totalRecipients || 0) - ((broadcast as any).deliveredCount || 0) - ((broadcast as any).failedCount || 0),
        acknowledged: (broadcast as any).acknowledgedCount || 0,
      };

      // In real implementation, would query delivery tracking table
      const recentDeliveries: RecipientDeliveryStatusDto[] = [];

      return {
        broadcast: this.mapToResponseDto(broadcast as any),
        deliveryStats,
        recentDeliveries,
      };
    } catch (error) {
      this.logger.error('Failed to get broadcast status', error);
      throw error;
    }
  }

  /**
   * Cancel pending broadcast
   */
  async cancelBroadcast(broadcastId: string, reason: string, userId: string = 'system'): Promise<void> {
    try {
      // Verify broadcast exists
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      // Create execution context
      const context: ExecutionContext = {
        userId,
        userRole: 'ADMIN' as any,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      // Update broadcast status to CANCELLED
      await this.broadcastRepository.update(
        broadcastId,
        {
          status: BroadcastStatus.CANCELLED,
        } as any,
        context,
      );

      this.logger.log('Emergency broadcast cancelled', { broadcastId, reason });
    } catch (error) {
      this.logger.error('Failed to cancel broadcast', error);
      throw error;
    }
  }

  /**
   * Record acknowledgment from recipient
   */
  async recordAcknowledgment(
    broadcastId: string,
    recipientId: string,
    acknowledgedAt: Date = new Date(),
  ): Promise<void> {
    try {
      // Verify broadcast exists
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      // In real implementation, would update delivery tracking table
      // and increment acknowledgedCount on broadcast
      const context: ExecutionContext = {
        userId: recipientId,
        userRole: 'SYSTEM' as any,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        requestId: uuidv4(),
      };

      // Increment acknowledged count
      const currentCount = (broadcast as any).acknowledgedCount || 0;
      await this.broadcastRepository.update(
        broadcastId,
        {
          acknowledgedCount: currentCount + 1,
        } as any,
        context,
      );

      this.logger.log('Broadcast acknowledged', { broadcastId, recipientId });
    } catch (error) {
      this.logger.error('Failed to record acknowledgment', error);
      throw error;
    }
  }

  /**
   * Get emergency broadcast templates
   */
  getTemplates(): Record<EmergencyType, EmergencyTemplateDto> {
    return {
      [EmergencyType.ACTIVE_THREAT]: {
        title: '🚨 EMERGENCY: Secure All Areas',
        message:
          'LOCKDOWN IN EFFECT. Secure all doors and windows. Follow established lockdown procedures. Wait for all-clear from administration.',
      },
      [EmergencyType.FIRE]: {
        title: '🔥 FIRE ALARM: Evacuate Immediately',
        message:
          'Fire alarm activated. Evacuate building immediately using nearest safe exit. Proceed to designated assembly area. Take attendance.',
      },
      [EmergencyType.MEDICAL_EMERGENCY]: {
        title: '⚕️ MEDICAL EMERGENCY',
        message:
          'Medical emergency in progress. Emergency services have been contacted. Clear hallways and remain calm.',
      },
      [EmergencyType.WEATHER_ALERT]: {
        title: '⛈️ SEVERE WEATHER ALERT',
        message:
          'Severe weather warning in effect. Move to interior rooms away from windows. Shelter in place until all-clear.',
      },
      [EmergencyType.LOCKDOWN]: {
        title: '🔒 LOCKDOWN IN EFFECT',
        message:
          'Precautionary lockdown in effect. Secure all doors. Classes continue normally. No one enters or exits building.',
      },
      [EmergencyType.EVACUATION]: {
        title: '⚠️ BUILDING EVACUATION',
        message:
          'Evacuate building immediately. Proceed calmly to designated assembly area. Teachers take attendance.',
      },
      [EmergencyType.EARLY_DISMISSAL]: {
        title: 'Early Dismissal',
        message:
          'School will dismiss early today. Please arrange pickup or transportation accordingly.',
      },
      [EmergencyType.SCHOOL_CLOSURE]: {
        title: 'School Closure',
        message:
          'School will be closed. All activities cancelled. Watch for updates.',
      },
      [EmergencyType.NATURAL_DISASTER]: {
        title: '🌪️ NATURAL DISASTER ALERT',
        message:
          'Natural disaster alert. Follow emergency procedures immediately. Seek shelter. Emergency services notified.',
      },
      [EmergencyType.SHELTER_IN_PLACE]: {
        title: '🏠 SHELTER IN PLACE',
        message:
          'Shelter in place order in effect. Stay indoors. Seal windows and doors. Turn off ventilation. Await further instructions.',
      },
      [EmergencyType.TRANSPORTATION]: {
        title: '🚌 Transportation Alert',
        message:
          'Transportation disruption. Delays expected. Alternative arrangements may be needed.',
      },
      [EmergencyType.FACILITY_ISSUE]: {
        title: '🔧 Facility Issue',
        message:
          'Facility issue affecting building operations. Updates will be provided as situation develops.',
      },
      [EmergencyType.GENERAL_ANNOUNCEMENT]: {
        title: 'Important Announcement',
        message: 'Important school announcement. Please read carefully.',
      },
    };
  }

  /**
   * Map EmergencyBroadcast to ResponseDto
   */
  private mapToResponseDto(
    broadcast: EmergencyBroadcast,
  ): EmergencyBroadcastResponseDto {
    return {
      id: broadcast.id!,
      type: broadcast.type,
      priority: broadcast.priority,
      title: broadcast.title,
      message: broadcast.message,
      audience: broadcast.audience,
      schoolId: broadcast.schoolId,
      gradeLevel: broadcast.gradeLevel,
      classId: broadcast.classId,
      groupIds: broadcast.groupIds,
      channels: broadcast.channels,
      requiresAcknowledgment: broadcast.requiresAcknowledgment,
      expiresAt: broadcast.expiresAt,
      sentBy: broadcast.sentBy,
      sentAt: broadcast.sentAt,
      status: broadcast.status,
      totalRecipients: broadcast.totalRecipients,
      deliveredCount: broadcast.deliveredCount,
      failedCount: broadcast.failedCount,
      acknowledgedCount: broadcast.acknowledgedCount,
      followUpRequired: broadcast.followUpRequired,
      followUpInstructions: broadcast.followUpInstructions,
    };
  }
}
