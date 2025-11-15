/**
 * Appointments API - Waitlist Management
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Handles appointment waitlist operations including adding students to waitlist,
 * managing waitlist priorities, processing waitlist entries, and converting
 * waitlist entries to appointments when slots become available.
 *
 * @module services/modules/appointmentsApi/waitlist
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  AppointmentWaitlist,
  WaitlistEntryData,
  WaitlistFilters,
  WaitlistPriority,
  AppointmentType,
  Appointment
} from './types';
import {
  waitlistEntrySchema,
  waitlistFiltersSchema,
  getValidationErrors
} from './validation';

/**
 * Waitlist Processing Result
 */
interface WaitlistProcessingResult {
  processed: number;
  converted: number;
  notified: number;
  failed: Array<{
    waitlistId: string;
    studentName: string;
    error: string;
  }>;
  summary: {
    totalProcessed: number;
    appointmentsCreated: number;
    studentsNotified: number;
    remainingInQueue: number;
  };
}

/**
 * Waitlist Statistics
 */
interface WaitlistStatistics {
  totalEntries: number;
  byPriority: Record<WaitlistPriority, number>;
  byType: Record<AppointmentType, number>;
  averageWaitTime: number; // in days
  conversionRate: number; // percentage
  dailyTrends: Array<{
    date: string;
    added: number;
    processed: number;
    converted: number;
  }>;
}

/**
 * Appointment Waitlist Service Class
 * 
 * Provides comprehensive waitlist management including entry creation,
 * priority management, processing, and conversion to appointments.
 */
export class WaitlistService {
  private readonly endpoint = '/api/waitlist';

  constructor(private readonly client: ApiClient) {}

  /**
   * Create standardized API error
   */
  private createError(message: string, code?: string, metadata?: unknown): Error {
    const error = new Error(message);
    (error as Error & { code?: string; metadata?: unknown }).code = code || 'API_ERROR';
    (error as Error & { code?: string; metadata?: unknown }).metadata = metadata;
    return error;
  }

  /**
   * Handle API errors with sanitization
   */
  private handleError(error: unknown, defaultMessage: string): void {
    console.error(defaultMessage, error);
    // Error handling would be expanded based on actual requirements
  }

  /**
   * Log activity for audit purposes
   */
  private logActivity(action: string, metadata: Record<string, unknown>): void {
    console.log(`Activity: ${action}`, metadata);
    // Activity logging would be expanded based on actual requirements
  }

  // ==========================================
  // WAITLIST ENTRY MANAGEMENT
  // ==========================================

  /**
   * Add student to appointment waitlist
   * 
   * @param data - Waitlist entry data
   * @returns Promise resolving to the created waitlist entry
   */
  async addToWaitlist(data: WaitlistEntryData): Promise<AppointmentWaitlist> {
    // Validate input data
    const validationResult = waitlistEntrySchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    try {
      // Check if student is already on waitlist for same type
      const existingEntry = await this.findExistingEntry(
        validatedData.studentId,
        validatedData.type,
        validatedData.nurseId
      );

      if (existingEntry) {
        throw this.createError(
          'Student is already on waitlist for this appointment type',
          'DUPLICATE_ENTRY_ERROR'
        );
      }

      const response = await this.client.post<{data: AppointmentWaitlist}>(this.endpoint, validatedData);
      const waitlistEntry = response.data.data;

      // Log waitlist addition for audit
      this.logActivity('waitlist_entry_created', {
        waitlistId: waitlistEntry.id,
        studentId: validatedData.studentId,
        type: validatedData.type,
        priority: validatedData.priority,
        position: waitlistEntry.position
      });

      return waitlistEntry;
    } catch (error) {
      this.handleError(error, 'Failed to add to waitlist');
      throw error;
    }
  }

  /**
   * Get waitlist entry by ID
   * 
   * @param id - Waitlist entry ID
   * @returns Promise resolving to the waitlist entry
   */
  async getWaitlistEntry(id: string): Promise<AppointmentWaitlist> {
    if (!id?.trim()) {
      throw this.createError('Waitlist entry ID is required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.get<{data: AppointmentWaitlist}>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch waitlist entry');
      throw error;
    }
  }

  /**
   * Update waitlist entry
   * 
   * @param id - Waitlist entry ID
   * @param data - Update data
   * @returns Promise resolving to updated entry
   */
  async updateWaitlistEntry(id: string, data: Partial<WaitlistEntryData>): Promise<AppointmentWaitlist> {
    if (!id?.trim()) {
      throw this.createError('Waitlist entry ID is required', 'VALIDATION_ERROR');
    }

    // Validate input data
    const validationResult = waitlistEntrySchema.partial().safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.put<{data: AppointmentWaitlist}>(`${this.endpoint}/${id}`, validationResult.data);

      // Log waitlist update for audit
      this.logActivity('waitlist_entry_updated', {
        waitlistId: id,
        changes: validationResult.data
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update waitlist entry');
      throw error;
    }
  }

  /**
   * Remove student from waitlist
   * 
   * @param id - Waitlist entry ID
   * @param reason - Removal reason
   */
  async removeFromWaitlist(id: string, reason?: string): Promise<void> {
    if (!id?.trim()) {
      throw this.createError('Waitlist entry ID is required', 'VALIDATION_ERROR');
    }

    try {
      await this.client.delete(`${this.endpoint}/${id}`, { data: { reason } });

      // Log waitlist removal for audit
      this.logActivity('waitlist_entry_removed', {
        waitlistId: id,
        reason
      });
    } catch (error) {
      this.handleError(error, 'Failed to remove from waitlist');
      throw error;
    }
  }

  // ==========================================
  // WAITLIST QUERYING
  // ==========================================

  /**
   * Get waitlist entries with filtering and pagination
   * 
   * @param filters - Filter criteria
   * @returns Promise resolving to paginated waitlist entries
   */
  async getWaitlist(filters: WaitlistFilters = {}) {
    // Validate filters
    const validationResult = waitlistFiltersSchema.safeParse(filters);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Invalid filters', 'VALIDATION_ERROR', { errors });
    }

    const validatedFilters = validationResult.data;

    try {
      const queryParams = new URLSearchParams();
      Object.entries(validatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${this.endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.client.get<{
        data: AppointmentWaitlist[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        filters: WaitlistFilters;
      }>(url);

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch waitlist');
      throw error;
    }
  }

  /**
   * Get student's waitlist entries
   * 
   * @param studentId - Student ID
   * @returns Promise resolving to student's waitlist entries
   */
  async getStudentWaitlist(studentId: string): Promise<AppointmentWaitlist[]> {
    if (!studentId?.trim()) {
      throw this.createError('Student ID is required', 'VALIDATION_ERROR');
    }

    const filters: WaitlistFilters = {
      page: 1,
      limit: 100, // Get all entries for student
      sortBy: 'position',
      sortOrder: 'asc'
    };

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('studentId', studentId);
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const response = await this.client.get<{data: AppointmentWaitlist[]}>(`${this.endpoint}/student?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch student waitlist');
      throw error;
    }
  }

  /**
   * Get nurse's waitlist entries
   * 
   * @param nurseId - Nurse ID
   * @param filters - Additional filters
   * @returns Promise resolving to nurse's waitlist entries
   */
  async getNurseWaitlist(nurseId: string, filters: Omit<WaitlistFilters, 'nurseId'> = {}): Promise<AppointmentWaitlist[]> {
    if (!nurseId?.trim()) {
      throw this.createError('Nurse ID is required', 'VALIDATION_ERROR');
    }

    const fullFilters: WaitlistFilters = {
      ...filters,
      nurseId,
      sortBy: 'position',
      sortOrder: 'asc'
    };

    const result = await this.getWaitlist(fullFilters);
    return result.data;
  }

  // ==========================================
  // PRIORITY MANAGEMENT
  // ==========================================

  /**
   * Update waitlist entry priority
   * 
   * @param id - Waitlist entry ID
   * @param priority - New priority
   * @param reason - Reason for priority change
   * @returns Promise resolving to updated entry
   */
  async updatePriority(id: string, priority: WaitlistPriority, reason?: string): Promise<AppointmentWaitlist> {
    if (!id?.trim()) {
      throw this.createError('Waitlist entry ID is required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.put<{data: AppointmentWaitlist}>(`${this.endpoint}/${id}/priority`, {
        priority,
        reason
      });

      // Log priority update for audit
      this.logActivity('waitlist_priority_updated', {
        waitlistId: id,
        newPriority: priority,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update waitlist priority');
      throw error;
    }
  }

  /**
   * Move waitlist entry to specific position
   * 
   * @param id - Waitlist entry ID
   * @param newPosition - New position in queue
   * @param reason - Reason for position change
   * @returns Promise resolving to updated entry
   */
  async updatePosition(id: string, newPosition: number, reason?: string): Promise<AppointmentWaitlist> {
    if (!id?.trim()) {
      throw this.createError('Waitlist entry ID is required', 'VALIDATION_ERROR');
    }

    if (newPosition < 1) {
      throw this.createError('Position must be greater than 0', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.put<{data: AppointmentWaitlist}>(`${this.endpoint}/${id}/position`, {
        position: newPosition,
        reason
      });

      // Log position update for audit
      this.logActivity('waitlist_position_updated', {
        waitlistId: id,
        newPosition,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update waitlist position');
      throw error;
    }
  }

  // ==========================================
  // WAITLIST PROCESSING
  // ==========================================

  /**
   * Process waitlist entries when slots become available
   * 
   * @param nurseId - Nurse ID (optional, processes all nurses if not specified)
   * @param appointmentType - Appointment type filter (optional)
   * @param maxEntries - Maximum entries to process in one batch
   * @returns Promise resolving to processing results
   */
  async processWaitlist(
    nurseId?: string,
    appointmentType?: AppointmentType,
    maxEntries = 10
  ): Promise<WaitlistProcessingResult> {
    try {
      const response = await this.client.post<{data: WaitlistProcessingResult}>(`${this.endpoint}/process`, {
        nurseId,
        appointmentType,
        maxEntries
      });

      // Log waitlist processing for audit
      this.logActivity('waitlist_processed', {
        nurseId,
        appointmentType,
        processed: response.data.data.summary.totalProcessed,
        converted: response.data.data.summary.appointmentsCreated
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to process waitlist');
      throw error;
    }
  }

  /**
   * Convert waitlist entry to appointment
   * 
   * @param waitlistId - Waitlist entry ID
   * @param scheduledAt - Scheduled appointment time
   * @param duration - Appointment duration (optional)
   * @returns Promise resolving to created appointment
   */
  async convertToAppointment(
    waitlistId: string,
    scheduledAt: string,
    duration?: number
  ): Promise<Appointment> {
    if (!waitlistId?.trim() || !scheduledAt?.trim()) {
      throw this.createError('Waitlist ID and scheduled time are required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.post<{data: Appointment}>(`${this.endpoint}/${waitlistId}/convert`, {
        scheduledAt,
        duration
      });

      // Log conversion for audit
      this.logActivity('waitlist_converted_to_appointment', {
        waitlistId,
        appointmentId: response.data.data.id,
        scheduledAt
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to convert waitlist entry to appointment');
      throw error;
    }
  }

  /**
   * Notify students about available appointment slots
   * 
   * @param waitlistIds - Array of waitlist entry IDs to notify
   * @param availableSlots - Available time slots
   * @returns Promise resolving to notification results
   */
  async notifyStudents(
    waitlistIds: string[],
    availableSlots: Array<{
      startTime: string;
      endTime: string;
      nurseId: string;
    }>
  ) {
    if (!waitlistIds?.length || !availableSlots?.length) {
      throw this.createError('Waitlist IDs and available slots are required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.post<{data: {
        notified: number;
        failed: Array<{
          waitlistId: string;
          error: string;
        }>;
        expiresAt: string;
      }}>(`${this.endpoint}/notify`, {
        waitlistIds,
        availableSlots
      });

      // Log notifications for audit
      this.logActivity('waitlist_students_notified', {
        notified: response.data.data.notified,
        failed: response.data.data.failed.length,
        expiresAt: response.data.data.expiresAt
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to notify students');
      throw error;
    }
  }

  // ==========================================
  // STATISTICS AND REPORTING
  // ==========================================

  /**
   * Get waitlist statistics
   * 
   * @param startDate - Start date for statistics (optional)
   * @param endDate - End date for statistics (optional)
   * @returns Promise resolving to waitlist statistics
   */
  async getWaitlistStatistics(startDate?: string, endDate?: string): Promise<WaitlistStatistics> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const url = `${this.endpoint}/statistics${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.client.get<{data: WaitlistStatistics}>(url);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch waitlist statistics');
      throw error;
    }
  }

  /**
   * Get estimated wait time for new entry
   * 
   * @param appointmentType - Type of appointment
   * @param priority - Priority level
   * @param nurseId - Specific nurse (optional)
   * @returns Promise resolving to estimated wait time in days
   */
  async getEstimatedWaitTime(
    appointmentType: AppointmentType,
    priority: WaitlistPriority = WaitlistPriority.NORMAL,
    nurseId?: string
  ): Promise<{
    estimatedDays: number;
    currentPosition: number;
    averageProcessingTime: number;
    confidence: 'low' | 'medium' | 'high';
  }> {
    try {
      const queryParams = new URLSearchParams({
        appointmentType,
        priority,
        ...(nurseId && { nurseId })
      });

      const response = await this.client.get<{data: {
        estimatedDays: number;
        currentPosition: number;
        averageProcessingTime: number;
        confidence: 'low' | 'medium' | 'high';
      }}>(`${this.endpoint}/estimate-wait-time?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to get estimated wait time');
      throw error;
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Check if student already has waitlist entry for appointment type
   * 
   * @param studentId - Student ID
   * @param appointmentType - Appointment type
   * @param nurseId - Specific nurse (optional)
   * @returns Promise resolving to existing entry or null
   */
  private async findExistingEntry(
    studentId: string,
    appointmentType: AppointmentType,
    nurseId?: string
  ): Promise<AppointmentWaitlist | null> {
    try {
      const queryParams = new URLSearchParams({
        studentId,
        type: appointmentType,
        ...(nurseId && { nurseId })
      });

      const response = await this.client.get<{data: AppointmentWaitlist | null}>(`${this.endpoint}/check-existing?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      // If error occurs, assume no existing entry
      return null;
    }
  }

  /**
   * Get waitlist queue summary for display
   * 
   * @param appointmentType - Appointment type filter
   * @param nurseId - Nurse ID filter
   * @returns Promise resolving to queue summary
   */
  async getQueueSummary(appointmentType?: AppointmentType, nurseId?: string) {
    try {
      const queryParams = new URLSearchParams();
      if (appointmentType) queryParams.append('type', appointmentType);
      if (nurseId) queryParams.append('nurseId', nurseId);

      const response = await this.client.get<{data: {
        totalEntries: number;
        byPriority: Record<WaitlistPriority, number>;
        averageWaitTime: number;
        nextProcessingDate: string;
        recentActivity: Array<{
          action: string;
          count: number;
          date: string;
        }>;
      }}>(`${this.endpoint}/queue-summary${queryParams.toString() ? '?' + queryParams.toString() : ''}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch queue summary');
      throw error;
    }
  }
}

/**
 * Factory function to create WaitlistService
 */
export function createWaitlistService(client: ApiClient): WaitlistService {
  return new WaitlistService(client);
}
