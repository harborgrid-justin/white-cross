/**
 * Emergency Contact Service
 *
 * Main facade service that coordinates emergency contact operations by delegating
 * to specialized services. This service maintains the original public API while
 * implementing proper separation of concerns.
 *
 * Responsibilities:
 * - Public API facade for emergency contact operations
 * - Service coordination and dependency injection
 * - Backward compatibility with existing controllers
 *
 * The actual business logic is implemented in specialized services:
 * - ContactManagementService: CRUD operations and business rules
 * - ContactValidationService: Data validation
 * - NotificationOrchestrationService: Multi-contact/multi-channel notifications
 * - NotificationDeliveryService: SMS, email, voice delivery
 * - ContactVerificationService: Verification workflows
 * - ContactStatisticsService: Statistics and batch queries
 * - NotificationQueueService: Queue processing and lifecycle
 */
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EmergencyContact } from '../database/models/emergency-contact.model';
import { EmergencyContactCreateDto } from './dto/create-emergency-contact.dto';
import { EmergencyContactUpdateDto } from './dto/update-emergency-contact.dto';
import { NotificationDto } from './dto/notification.dto';
import { NotificationResultDto } from './dto/notification-result.dto';
import { ContactManagementService } from './services/contact-management.service';
import { ContactVerificationService } from './services/contact-verification.service';
import { ContactStatisticsService } from './services/contact-statistics.service';
import { NotificationOrchestrationService } from './services/notification-orchestration.service';
import { NotificationQueueService } from './services/notification-queue.service';

import { BaseService } from '../common/base';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class EmergencyContactService implements OnModuleDestroy {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly contactManagementService: ContactManagementService,
    private readonly contactVerificationService: ContactVerificationService,
    private readonly contactStatisticsService: ContactStatisticsService,
    private readonly notificationOrchestrationService: NotificationOrchestrationService,
    private readonly notificationQueueService: NotificationQueueService,
  ) {
    super({
      serviceName: 'EmergencyContactService',
      logger,
      enableAuditLogging: true,
    });

    this.logInfo('Emergency contact service initialized');
  }

  /**
   * Cleanup resources on module destroy
   * Delegates to NotificationQueueService for graceful shutdown
   */
  async onModuleDestroy() {
    this.logInfo('EmergencyContactService shutting down');
    await this.notificationQueueService.onModuleDestroy();
    this.logInfo('EmergencyContactService destroyed');
  }

  // ==================== Contact Management Operations ====================

  /**
   * Get emergency contacts for a student
   * @param studentId - Student identifier
   * @returns Array of active emergency contacts
   */
  async getStudentEmergencyContacts(
    studentId: string,
  ): Promise<EmergencyContact[]> {
    return this.contactManagementService.getStudentEmergencyContacts(
      studentId,
    );
  }

  /**
   * Get emergency contact by ID
   * @param id - Contact identifier
   * @returns Emergency contact
   */
  async getEmergencyContactById(id: string): Promise<EmergencyContact> {
    return this.contactManagementService.getEmergencyContactById(id);
  }

  /**
   * Create new emergency contact
   * @param data - Contact creation data
   * @returns Created emergency contact
   */
  async createEmergencyContact(
    data: EmergencyContactCreateDto,
  ): Promise<EmergencyContact> {
    return this.contactManagementService.createEmergencyContact(data);
  }

  /**
   * Update emergency contact
   * @param id - Contact identifier
   * @param data - Update data
   * @returns Updated emergency contact
   */
  async updateEmergencyContact(
    id: string,
    data: EmergencyContactUpdateDto,
  ): Promise<EmergencyContact> {
    return this.contactManagementService.updateEmergencyContact(id, data);
  }

  /**
   * Delete emergency contact (soft delete)
   * @param id - Contact identifier
   * @returns Success indicator
   */
  async deleteEmergencyContact(id: string): Promise<{ success: boolean }> {
    return this.contactManagementService.deleteEmergencyContact(id);
  }

  // ==================== Notification Operations ====================

  /**
   * Send emergency notification to all contacts for a student
   * @param studentId - Student identifier
   * @param notificationData - Notification content and configuration
   * @returns Array of notification results
   */
  async sendEmergencyNotification(
    studentId: string,
    notificationData: NotificationDto,
  ): Promise<NotificationResultDto[]> {
    return this.notificationOrchestrationService.sendEmergencyNotification(
      studentId,
      notificationData,
    );
  }

  /**
   * Send notification to specific contact
   * @param contactId - Contact identifier
   * @param notificationData - Notification content and configuration
   * @returns Notification result
   */
  async sendContactNotification(
    contactId: string,
    notificationData: NotificationDto,
  ): Promise<NotificationResultDto> {
    return this.notificationOrchestrationService.sendContactNotification(
      contactId,
      notificationData,
    );
  }

  // ==================== Verification Operations ====================

  /**
   * Verify emergency contact information
   * @param contactId - Contact identifier
   * @param verificationMethod - Verification channel (sms, email, voice)
   * @returns Verification result
   */
  async verifyContact(
    contactId: string,
    verificationMethod: 'sms' | 'email' | 'voice',
  ) {
    return this.contactVerificationService.verifyContact(
      contactId,
      verificationMethod,
    );
  }

  // ==================== Statistics and Reporting ====================

  /**
   * Get emergency contact statistics
   * @returns Contact statistics including totals and priority breakdown
   */
  async getContactStatistics() {
    return this.contactStatisticsService.getContactStatistics();
  }

  // ==================== Batch Query Methods (DataLoader Support) ====================

  /**
   * Batch find emergency contacts by IDs (for DataLoader)
   * @param ids - Array of contact identifiers
   * @returns Array of contacts in same order as input IDs
   */
  async findByIds(ids: string[]): Promise<(EmergencyContact | null)[]> {
    return this.contactStatisticsService.findByIds(ids);
  }

  /**
   * Batch find emergency contacts by student IDs (for DataLoader)
   * @param studentIds - Array of student identifiers
   * @returns Array of contact arrays for each student
   */
  async findByStudentIds(
    studentIds: string[],
  ): Promise<EmergencyContact[][]> {
    return this.contactStatisticsService.findByStudentIds(studentIds);
  }
}
