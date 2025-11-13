/**
 * @fileoverview Emergency Broadcast Management Service
 * @module emergency-broadcast/services
 * @description Handles CRUD operations and status management for emergency broadcasts
 */

import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BroadcastStatus } from '../emergency-broadcast.enums';
import { EmergencyBroadcast } from '../emergency-broadcast.interfaces';
import { UserRole } from '../../database/types/user-role.enum';
import {
  BroadcastStatusResponseDto,
  CreateEmergencyBroadcastDto,
  DeliveryStatsDto,
  EmergencyBroadcastResponseDto,
  RecipientDeliveryStatusDto,
  SendBroadcastResponseDto,
  UpdateEmergencyBroadcastDto,
} from '../dto';
import { EmergencyBroadcastRepository } from '../../database/repositories/impl/emergency-broadcast.repository';
import { ExecutionContext } from '../../database/types';
import { BroadcastPriorityService } from './broadcast-priority.service';
import { BroadcastRecipientService } from './broadcast-recipient.service';
import { BroadcastDeliveryService } from './broadcast-delivery.service';

import { BaseService } from '@/common/base';
@Injectable()
export class BroadcastManagementService extends BaseService {
  constructor(
    @Inject(EmergencyBroadcastRepository)
    private readonly broadcastRepository: EmergencyBroadcastRepository,
    private readonly priorityService: BroadcastPriorityService,
    private readonly recipientService: BroadcastRecipientService,
    private readonly deliveryService: BroadcastDeliveryService,
  ) {}

  /**
   * Create emergency broadcast
   */
  async createBroadcast(
    createDto: CreateEmergencyBroadcastDto,
  ): Promise<EmergencyBroadcastResponseDto> {
    try {
      // Auto-determine priority if not set
      const priority = createDto.priority || this.priorityService.determinePriority(createDto.type);

      // Auto-determine channels if not set
      const channels = createDto.channels || this.priorityService.getDeliveryChannels(priority);

      // Set default expiration based on priority
      let expiresAt = createDto.expiresAt;
      if (!expiresAt) {
        expiresAt = this.priorityService.getDefaultExpiration(priority);
      }

      // Create execution context for audit logging
      const context: ExecutionContext = {
        userId: createDto.sentBy,
        userRole: UserRole.ADMIN,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      const emergencyBroadcast: Partial<EmergencyBroadcast> = {
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
        emergencyBroadcast as EmergencyBroadcast,
        context,
      );

      this.logInfo('Emergency broadcast created', {
        id: savedBroadcast.id,
        type: createDto.type,
        priority,
        audience: createDto.audience,
      });

      return this.mapToResponseDto(savedBroadcast);
    } catch (error) {
      this.logError('Failed to create emergency broadcast', error);
      throw error;
    }
  }

  /**
   * Update emergency broadcast
   */
  async updateBroadcast(
    id: string,
    updateDto: UpdateEmergencyBroadcastDto,
    userId = 'system',
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
        userRole: UserRole.ADMIN,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      // Update broadcast with transaction
      const updatedBroadcast = await this.broadcastRepository.update(
        id,
        updateDto as Partial<EmergencyBroadcast>,
        context,
      );

      this.logInfo('Emergency broadcast updated', { id });

      return this.mapToResponseDto(updatedBroadcast);
    } catch (error) {
      this.logError('Failed to update emergency broadcast', error);
      throw error;
    }
  }

  /**
   * Send emergency broadcast
   */
  async sendBroadcast(broadcastId: string, userId = 'system'): Promise<SendBroadcastResponseDto> {
    try {
      // Retrieve broadcast from database
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      this.logInfo('Sending emergency broadcast', { broadcastId });

      // Create execution context
      const context: ExecutionContext = {
        userId,
        userRole: UserRole.ADMIN,
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        transactionId: uuidv4(),
      };

      // 1. Get recipients based on audience and filters
      const recipients = await this.recipientService.getRecipients(broadcastId);

      // 2. Update broadcast status to SENDING
      await this.broadcastRepository.update(
        broadcastId,
        {
          status: BroadcastStatus.SENDING,
          totalRecipients: recipients.length,
        } as Partial<EmergencyBroadcast>,
        context,
      );

      // 3. Send to all recipients via specified channels
      const deliveryResults = await this.deliveryService.deliverToRecipients(
        broadcastId,
        recipients,
        broadcast.channels,
        broadcast.title,
        broadcast.message,
      );

      // 4. Calculate statistics
      const stats = this.deliveryService.getDeliveryStats(deliveryResults);

      // 5. Update final status
      await this.broadcastRepository.update(
        broadcastId,
        {
          status: BroadcastStatus.SENT,
          deliveredCount: stats.delivered,
          failedCount: stats.failed,
        } as Partial<EmergencyBroadcast>,
        context,
      );

      this.logInfo('Emergency broadcast sent', {
        broadcastId,
        totalRecipients: recipients.length,
        sent: stats.delivered,
        failed: stats.failed,
      });

      return {
        success: true,
        totalRecipients: recipients.length,
        sent: stats.delivered,
        failed: stats.failed,
      };
    } catch (error) {
      this.logError('Failed to send emergency broadcast', error);
      throw error;
    }
  }

  /**
   * Get broadcast status and delivery statistics
   */
  async getBroadcastStatus(broadcastId: string): Promise<BroadcastStatusResponseDto> {
    try {
      this.logInfo('Retrieving broadcast status', { broadcastId });

      // Query database for broadcast
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      // Get delivery statistics
      const deliveryStats: DeliveryStatsDto = {
        total: broadcast.totalRecipients || 0,
        delivered: broadcast.deliveredCount || 0,
        failed: broadcast.failedCount || 0,
        pending:
          (broadcast.totalRecipients || 0) -
          (broadcast.deliveredCount || 0) -
          (broadcast.failedCount || 0),
        acknowledged: broadcast.acknowledgedCount || 0,
      };

      // In real implementation, would query delivery tracking table
      const recentDeliveries: RecipientDeliveryStatusDto[] = [];

      return {
        broadcast: this.mapToResponseDto(broadcast),
        deliveryStats,
        recentDeliveries,
      };
    } catch (error) {
      this.logError('Failed to get broadcast status', error);
      throw error;
    }
  }

  /**
   * Cancel pending broadcast
   */
  async cancelBroadcast(broadcastId: string, reason: string, userId = 'system'): Promise<void> {
    try {
      // Verify broadcast exists
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      // Create execution context
      const context: ExecutionContext = {
        userId,
        userRole: UserRole.ADMIN,
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
        } as Partial<EmergencyBroadcast>,
        context,
      );

      this.logInfo('Emergency broadcast cancelled', { broadcastId, reason });
    } catch (error) {
      this.logError('Failed to cancel broadcast', error);
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
        userRole: 'SYSTEM',
        ipAddress: 'system',
        userAgent: 'emergency-broadcast-service',
        timestamp: new Date(),
        requestId: uuidv4(),
      };

      // Increment acknowledged count
      const currentCount = broadcast.acknowledgedCount || 0;
      await this.broadcastRepository.update(
        broadcastId,
        {
          acknowledgedCount: currentCount + 1,
        },
        context,
      );

      this.logInfo('Broadcast acknowledged', { broadcastId, recipientId, acknowledgedAt });
    } catch (error) {
      this.logError('Failed to record acknowledgment', error);
      throw error;
    }
  }

  /**
   * Get broadcast by ID
   */
  async getBroadcastById(broadcastId: string): Promise<EmergencyBroadcastResponseDto> {
    try {
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast with ID ${broadcastId} not found`);
      }

      return this.mapToResponseDto(broadcast);
    } catch (error) {
      this.logError('Failed to get broadcast by ID', error);
      throw error;
    }
  }

  /**
   * List broadcasts with filtering and pagination
   */
  async listBroadcasts(filters: {
    status?: BroadcastStatus;
    type?: string;
    sentBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    broadcasts: EmergencyBroadcastResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { page = 1, limit = 20, ...otherFilters } = filters;

      // Build where clause from filters
      const whereClause: Record<string, unknown> = {};
      if (otherFilters.status) whereClause.status = otherFilters.status;
      if (otherFilters.type) whereClause.type = otherFilters.type;
      if (otherFilters.sentBy) whereClause.sentBy = otherFilters.sentBy;
      if (otherFilters.dateFrom || otherFilters.dateTo) {
        whereClause.sentAt = {};
        if (otherFilters.dateFrom) whereClause.sentAt.gte = otherFilters.dateFrom;
        if (otherFilters.dateTo) whereClause.sentAt.lte = otherFilters.dateTo;
      }

      const result = await this.broadcastRepository.findMany({
        where: whereClause,
        pagination: { page, limit },
        orderBy: { sentAt: 'desc' },
      });

      return {
        broadcasts: result.data.map((broadcast) => this.mapToResponseDto(broadcast)),
        total: result.total,
        page,
        limit,
      };
    } catch (error) {
      this.logError('Failed to list broadcasts', error);
      throw error;
    }
  }

  /**
   * Map EmergencyBroadcast to ResponseDto
   */
  private mapToResponseDto(broadcast: EmergencyBroadcast): EmergencyBroadcastResponseDto {
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
