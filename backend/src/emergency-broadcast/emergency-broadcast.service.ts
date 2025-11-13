/**
 * LOC: EMERGENCY-BROADCAST-SERVICE-001
 * WC-SVC-EMRG-001 | Emergency Broadcast System Service
 *
 * Purpose: Send emergency notifications to students, parents, and staff simultaneously
 * Critical: Time-sensitive emergency communications for school safety
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CommunicationChannel,
  EmergencyPriority,
  EmergencyType,
} from './emergency-broadcast.enums';
import { EmergencyBroadcast } from './emergency-broadcast.interfaces';
import {
  BroadcastStatusResponseDto,
  CreateEmergencyBroadcastDto,
  EmergencyBroadcastResponseDto,
  EmergencyTemplateDto,
  SendBroadcastResponseDto,
  UpdateEmergencyBroadcastDto,
} from './dto';
import { EmergencyBroadcastRepository } from '../database/repositories/impl/emergency-broadcast.repository';
import { StudentRepository } from '../database/repositories/impl/student.repository';
import { CommunicationService } from '../communication/services/communication.service';
import { BroadcastPriorityService } from './services/broadcast-priority.service';
import { BroadcastRecipientService } from './services/broadcast-recipient.service';
import { BroadcastDeliveryService } from './services/broadcast-delivery.service';
import { BroadcastManagementService } from './services/broadcast-management.service';
import { BroadcastTemplateService } from './services/broadcast-template.service';

import { BaseService } from '../../common/base';
@Injectable()
export class EmergencyBroadcastService extends BaseService {
  constructor(
    @Inject(EmergencyBroadcastRepository)
    private readonly broadcastRepository: EmergencyBroadcastRepository,
    @Inject(StudentRepository)
    private readonly studentRepository: StudentRepository,
    private readonly communicationService: CommunicationService,
    private readonly priorityService: BroadcastPriorityService,
    private readonly recipientService: BroadcastRecipientService,
    private readonly deliveryService: BroadcastDeliveryService,
    private readonly managementService: BroadcastManagementService,
    private readonly templateService: BroadcastTemplateService,
  ) {}

  /**
   * Determine priority from emergency type
   */
  determinePriority(type: EmergencyType): EmergencyPriority {
    return this.priorityService.determinePriority(type);
  }

  /**
   * Determine delivery channels based on priority
   */
  getDeliveryChannels(priority: EmergencyPriority): CommunicationChannel[] {
    return this.priorityService.getDeliveryChannels(priority);
  }

  /**
   * Create emergency broadcast
   */
  async createBroadcast(
    createDto: CreateEmergencyBroadcastDto,
  ): Promise<EmergencyBroadcastResponseDto> {
    return this.managementService.createBroadcast(createDto);
  }

  /**
   * Update emergency broadcast
   */
  async updateBroadcast(
    id: string,
    updateDto: UpdateEmergencyBroadcastDto,
    userId: string = 'system',
  ): Promise<EmergencyBroadcastResponseDto> {
    return this.managementService.updateBroadcast(id, updateDto, userId);
  }

  /**
   * Send emergency broadcast
   */
  async sendBroadcast(
    broadcastId: string,
    userId: string = 'system',
  ): Promise<SendBroadcastResponseDto> {
    return this.managementService.sendBroadcast(broadcastId, userId);
  }


  /**
   * Get broadcast status and delivery statistics
   */
  async getBroadcastStatus(
    broadcastId: string,
  ): Promise<BroadcastStatusResponseDto> {
    return this.managementService.getBroadcastStatus(broadcastId);
  }

  /**
   * Cancel pending broadcast
   */
  async cancelBroadcast(
    broadcastId: string,
    reason: string,
    userId: string = 'system',
  ): Promise<void> {
    return this.managementService.cancelBroadcast(broadcastId, reason, userId);
  }

  /**
   * Record acknowledgment from recipient
   */
  async recordAcknowledgment(
    broadcastId: string,
    recipientId: string,
    acknowledgedAt: Date = new Date(),
  ): Promise<void> {
    return this.managementService.recordAcknowledgment(broadcastId, recipientId, acknowledgedAt);
  }

  /**
   * Get emergency broadcast templates
   */
  getTemplates(): Record<EmergencyType, EmergencyTemplateDto> {
    return this.templateService.getTemplates();
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
