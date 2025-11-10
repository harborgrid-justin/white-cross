/**
 * @fileoverview Appointment Service (Facade Pattern)
 * @module appointment/appointment.service
 * @description Main service facade that delegates to specialized services for appointment management
 *
 * REFACTORED: This service now acts as a facade, delegating to specialized services:
 * - AppointmentReadService: Read operations
 * - AppointmentWriteService: Write operations
 * - AppointmentStatusService: Status transitions
 * - AppointmentQueryService: Query operations
 * - AppointmentSchedulingService: Availability and scheduling
 * - AppointmentStatisticsService: Statistics and analytics
 * - AppointmentRecurringService: Recurring and bulk operations
 * - WaitlistService: Waitlist management
 * - ReminderService: Reminder management
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus, UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentFiltersDto } from './dto/appointment-filters.dto';
import { WaitlistFiltersDto, WaitlistPriority } from './dto/waitlist.dto';
import { CreateReminderDto, ReminderProcessingResultDto } from './dto/reminder.dto';
import {
  BulkCancelDto,
  DateRangeDto,
  SearchAppointmentsDto,
  StatisticsFiltersDto,
} from './dto/statistics.dto';
import { CreateRecurringAppointmentDto } from './dto/recurring.dto';
import { AppointmentEntity, AvailabilitySlot, PaginatedResponse } from './entities/appointment.entity';
import { AppointmentType as ModelAppointmentType } from '../database/models/appointment.model';

// Import all specialized services
import { AppointmentReadService } from './services/appointment-read.service';
import { AppointmentWriteService } from './services/appointment-write.service';
import { AppointmentStatusService } from './services/appointment-status.service';
import { AppointmentQueryService } from './services/appointment-query.service';
import { AppointmentSchedulingService } from './services/appointment-scheduling.service';
import { AppointmentStatisticsService } from './services/appointment-statistics.service';
import { AppointmentRecurringService } from './services/appointment-recurring.service';
import { WaitlistService } from './services/waitlist.service';
import { ReminderService } from './services/reminder.service';

/**
 * Appointment Service Facade
 *
 * Provides a unified interface for appointment management by delegating to specialized services.
 * This facade pattern improves maintainability by separating concerns while maintaining
 * backward compatibility with existing controllers and consumers.
 *
 * Benefits:
 * - Single Responsibility: Each specialized service handles one aspect
 * - Easier Testing: Smaller, focused services are easier to test
 * - Better Organization: Related functionality grouped together
 * - Reduced Complexity: Each service under 400 LOC
 * - Backward Compatible: Existing API remains unchanged
 */
@Injectable()
export class AppointmentService implements OnModuleDestroy {
  private readonly logger = new Logger(AppointmentService.name);
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    // Specialized services
    private readonly readService: AppointmentReadService,
    private readonly writeService: AppointmentWriteService,
    private readonly statusService: AppointmentStatusService,
    private readonly queryService: AppointmentQueryService,
    private readonly schedulingService: AppointmentSchedulingService,
    private readonly statisticsService: AppointmentStatisticsService,
    private readonly recurringService: AppointmentRecurringService,
    private readonly waitlistService: WaitlistService,
    private readonly reminderService: ReminderService,
    // Configuration
    private readonly config?: AppConfigService,
  ) {
    // Start periodic cleanup of expired waitlist entries
    if (this.config?.isProduction) {
      this.cleanupInterval = setInterval(
        () => this.waitlistService.cleanupExpiredEntries(),
        24 * 60 * 60 * 1000, // Daily cleanup
      );
      this.logger.log('Appointment service initialized with daily cleanup interval');
    }
  }

  /**
   * Cleanup resources on module destroy
   */
  async onModuleDestroy() {
    this.logger.log('AppointmentService shutting down - cleaning up resources');

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.logger.log('Cleanup interval cleared');
    }

    try {
      await this.reminderService.processPendingReminders();
      this.logger.log('Pending reminders processed before shutdown');
    } catch (error) {
      this.logger.warn(`Error processing pending reminders during shutdown: ${error.message}`);
    }

    this.logger.log('AppointmentService destroyed, resources cleaned up');
  }

  // ==================== CRUD Operations ====================

  /**
   * Get appointments with pagination and filtering
   */
  async getAppointments(
    filters: AppointmentFiltersDto = {},
  ): Promise<PaginatedResponse<AppointmentEntity>> {
    return this.readService.getAppointments(filters);
  }

  /**
   * Get a single appointment by ID
   */
  async getAppointmentById(id: string): Promise<AppointmentEntity> {
    return this.readService.getAppointmentById(id);
  }

  /**
   * Create a new appointment with comprehensive validation
   */
  async createAppointment(createDto: CreateAppointmentDto): Promise<AppointmentEntity> {
    return this.writeService.createAppointment(createDto);
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(
    id: string,
    updateDto: UpdateAppointmentDto,
  ): Promise<AppointmentEntity> {
    return this.writeService.updateAppointment(id, updateDto);
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(id: string, reason?: string): Promise<AppointmentEntity> {
    return this.writeService.cancelAppointment(id, reason);
  }

  // ==================== Status Operations ====================

  /**
   * Start an appointment (transition to IN_PROGRESS)
   */
  async startAppointment(id: string): Promise<AppointmentEntity> {
    return this.statusService.startAppointment(id);
  }

  /**
   * Complete an appointment
   */
  async completeAppointment(
    id: string,
    completionData?: {
      notes?: string;
      outcomes?: string;
      followUpRequired?: boolean;
      followUpDate?: Date;
    },
  ): Promise<AppointmentEntity> {
    return this.statusService.completeAppointment(id, completionData);
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string): Promise<AppointmentEntity> {
    return this.statusService.markNoShow(id);
  }

  // ==================== Query Operations ====================

  /**
   * Get upcoming appointments for a nurse
   */
  async getUpcomingAppointments(
    nurseId: string,
    limit: number = 10,
  ): Promise<AppointmentEntity[]> {
    return this.queryService.getUpcomingAppointments(nurseId, limit);
  }

  /**
   * Get appointments by a specific date
   */
  async getAppointmentsByDate(dateStr: string): Promise<{ data: AppointmentEntity[] }> {
    return this.queryService.getAppointmentsByDate(dateStr);
  }

  /**
   * Get upcoming appointments for the next N days
   */
  async getGeneralUpcomingAppointments(
    days: number = 7,
    limit: number = 50,
  ): Promise<{ data: AppointmentEntity[] }> {
    return this.queryService.getGeneralUpcomingAppointments(days, limit);
  }

  /**
   * Get appointment history for a student
   */
  async getAppointmentHistory(studentId: string, limit: number = 50): Promise<AppointmentEntity[]> {
    return this.queryService.getAppointmentHistory(studentId, limit);
  }

  /**
   * Get appointments by date range
   */
  async getAppointmentsByDateRange(
    dateRange: DateRangeDto,
  ): Promise<{ appointments: AppointmentEntity[] }> {
    return this.queryService.getAppointmentsByDateRange(dateRange);
  }

  /**
   * Get appointments for multiple students
   */
  async getAppointmentsForStudents(
    studentIds: string[],
    filters?: Partial<AppointmentFiltersDto>,
  ): Promise<{ appointments: AppointmentEntity[] }> {
    return this.queryService.getAppointmentsForStudents(studentIds, filters);
  }

  /**
   * Search appointments
   */
  async searchAppointments(
    searchDto: SearchAppointmentsDto,
  ): Promise<PaginatedResponse<AppointmentEntity>> {
    return this.queryService.searchAppointments(searchDto);
  }

  // ==================== Availability Operations ====================

  /**
   * Check availability for a time slot
   */
  async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<AppointmentEntity[]> {
    return this.schedulingService.checkAvailability(
      nurseId,
      startTime,
      duration,
      excludeAppointmentId,
    );
  }

  /**
   * Get available time slots for a nurse
   */
  async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30,
  ): Promise<AvailabilitySlot[]> {
    return this.schedulingService.getAvailableSlots(nurseId, date, slotDuration);
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<{
    hasConflict: boolean;
    conflicts: AppointmentEntity[];
    availableSlots: AvailabilitySlot[];
  }> {
    return this.schedulingService.checkConflicts(
      nurseId,
      startTime,
      duration,
      excludeAppointmentId,
    );
  }

  // ==================== Waitlist Operations ====================

  /**
   * Add student to waitlist
   */
  async addToWaitlist(data: {
    studentId: string;
    nurseId?: string;
    type: ModelAppointmentType;
    preferredDate?: Date;
    duration?: number;
    priority?: WaitlistPriority;
    reason: string;
    notes?: string;
  }): Promise<any> {
    return this.waitlistService.addToWaitlist(data);
  }

  /**
   * Get waitlist with filtering
   */
  async getWaitlist(filters: WaitlistFiltersDto = {}): Promise<{ waitlist: any[] }> {
    return this.waitlistService.getWaitlist(filters);
  }

  /**
   * Update waitlist entry priority
   */
  async updateWaitlistPriority(id: string, priority: WaitlistPriority): Promise<{ entry: any }> {
    return this.waitlistService.updateWaitlistPriority(id, priority);
  }

  /**
   * Get waitlist position
   */
  async getWaitlistPosition(id: string): Promise<{ position: number; total: number }> {
    return this.waitlistService.getWaitlistPosition(id);
  }

  /**
   * Notify waitlist entry
   */
  async notifyWaitlistEntry(
    id: string,
    message?: string,
  ): Promise<{ entry: any; notification: any }> {
    return this.waitlistService.notifyWaitlistEntry(id, message);
  }

  /**
   * Remove from waitlist
   */
  async removeFromWaitlist(id: string, reason?: string): Promise<{ entry: any }> {
    return this.waitlistService.removeFromWaitlist(id, reason);
  }

  // ==================== Reminder Operations ====================

  /**
   * Process pending reminders
   */
  async processPendingReminders(): Promise<ReminderProcessingResultDto> {
    return this.reminderService.processPendingReminders();
  }

  /**
   * Get appointment reminders
   */
  async getAppointmentReminders(appointmentId: string): Promise<{ reminders: any[] }> {
    return this.reminderService.getAppointmentReminders(appointmentId);
  }

  /**
   * Schedule reminder
   */
  async scheduleReminder(createDto: CreateReminderDto): Promise<{ reminder: any }> {
    return this.reminderService.scheduleReminder(createDto);
  }

  /**
   * Cancel reminder
   */
  async cancelReminder(reminderId: string): Promise<{ reminder: any }> {
    return this.reminderService.cancelReminder(reminderId);
  }

  // ==================== Statistics Operations ====================

  /**
   * Get appointment statistics
   */
  async getStatistics(filters: StatisticsFiltersDto = {}): Promise<any> {
    return this.statisticsService.getStatistics(filters);
  }

  /**
   * Get appointment trends
   */
  async getAppointmentTrends(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<{ trends: any[] }> {
    return this.statisticsService.getAppointmentTrends(dateFrom, dateTo, groupBy);
  }

  /**
   * Get no-show statistics
   */
  async getNoShowStats(nurseId?: string, dateFrom?: string, dateTo?: string): Promise<any> {
    return this.statisticsService.getNoShowStats(nurseId, dateFrom, dateTo);
  }

  /**
   * Get no-show count for a student
   */
  async getNoShowCount(studentId: string, daysBack: number = 90): Promise<number> {
    return this.statisticsService.getNoShowCount(studentId, daysBack);
  }

  /**
   * Get utilization statistics
   */
  async getUtilizationStats(nurseId: string, dateFrom: string, dateTo: string): Promise<any> {
    return this.statisticsService.getUtilizationStats(nurseId, dateFrom, dateTo);
  }

  /**
   * Export calendar
   */
  async exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<string> {
    return this.statisticsService.exportCalendar(nurseId, dateFrom, dateTo);
  }

  // ==================== Recurring Operations ====================

  /**
   * Create recurring appointments
   */
  async createRecurringAppointments(
    createDto: CreateRecurringAppointmentDto,
  ): Promise<{ appointments: AppointmentEntity[]; count: number }> {
    return this.recurringService.createRecurringAppointments(
      createDto,
      this.createAppointment.bind(this),
    );
  }

  /**
   * Bulk cancel appointments
   */
  async bulkCancelAppointments(
    bulkCancelDto: BulkCancelDto,
  ): Promise<{ cancelled: number; failed: number }> {
    return this.recurringService.bulkCancelAppointments(bulkCancelDto);
  }
}
