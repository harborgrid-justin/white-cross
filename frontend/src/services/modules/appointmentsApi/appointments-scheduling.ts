/**
 * Appointments API - Scheduling and Conflict Management
 * 
 * Handles appointment scheduling operations including conflict detection,
 * time slot management, recurring appointments, and availability checking.
 * 
 * @module services/modules/appointmentsApi/appointments-scheduling
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  ConflictCheckResult,
  RecurringAppointmentData,
  APPOINTMENT_VALIDATION
} from './types';
import {
  recurringAppointmentSchema,
  conflictCheckSchema,
  getValidationErrors
} from './validation';

/**
 * Appointments Scheduling Service Class
 * 
 * Provides scheduling operations including conflict detection,
 * slot management, and recurring appointment creation.
 */
export class AppointmentsSchedulingService {
  private readonly endpoint = '/api/appointments';

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
  // CONFLICT DETECTION
  // ==========================================

  /**
   * Check for appointment conflicts
   * 
   * @param conflictData - Conflict check parameters
   * @returns Promise resolving to conflict check result
   */
  async checkConflicts(conflictData: {
    nurseId: string;
    startTime: string;
    duration: number;
    excludeAppointmentId?: string;
  }): Promise<ConflictCheckResult> {
    // Validate input
    const validationResult = conflictCheckSchema.safeParse(conflictData);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Invalid conflict check data', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{data: ConflictCheckResult}>(
        `${this.endpoint}/conflicts/check`,
        validationResult.data
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to check conflicts');
      throw error;
    }
  }

  /**
   * Check conflicts for multiple time slots
   * 
   * @param conflictChecks - Array of conflict check requests
   * @returns Promise resolving to conflict results for each slot
   */
  async checkMultipleConflicts(conflictChecks: Array<{
    nurseId: string;
    startTime: string;
    duration: number;
    excludeAppointmentId?: string;
  }>): Promise<ConflictCheckResult[]> {
    try {
      const response = await this.client.post<{data: ConflictCheckResult[]}>(
        `${this.endpoint}/conflicts/batch`,
        { checks: conflictChecks }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to check multiple conflicts');
      throw error;
    }
  }

  // ==========================================
  // TIME SLOT MANAGEMENT
  // ==========================================

  /**
   * Find available time slots for appointment scheduling
   * 
   * @param nurseId - Nurse ID
   * @param date - Date to check (YYYY-MM-DD)
   * @param duration - Appointment duration in minutes
   * @returns Promise resolving to available time slots
   */
  async findAvailableSlots(nurseId: string, date: string, duration: number = APPOINTMENT_VALIDATION.DEFAULT_DURATION) {
    if (!nurseId?.trim() || !date?.trim()) {
      throw this.createError('Nurse ID and date are required', 'VALIDATION_ERROR');
    }

    try {
      const queryParams = new URLSearchParams({
        nurseId,
        date,
        duration: duration.toString()
      });
      
      const response = await this.client.get<{data: {
        date: string;
        nurseId: string;
        duration: number;
        slots: Array<{
          startTime: string;
          endTime: string;
          available: boolean;
        }>;
      }}>(`${this.endpoint}/availability/slots?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find available slots');
      throw error;
    }
  }

  /**
   * Get next available appointment slot
   * 
   * @param nurseId - Nurse ID
   * @param preferredDate - Preferred date (optional)
   * @param duration - Appointment duration
   * @returns Promise resolving to next available slot
   */
  async getNextAvailableSlot(nurseId: string, preferredDate?: string, duration = APPOINTMENT_VALIDATION.DEFAULT_DURATION) {
    const startDate = preferredDate || new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Search within next 30 days
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('nurseId', nurseId);
      queryParams.append('startDate', startDate);
      queryParams.append('endDate', endDate.toISOString().split('T')[0]);
      queryParams.append('duration', duration.toString());
      
      const response = await this.client.get<{data: {
        startTime: string;
        endTime: string;
        date: string;
        nurseName: string;
      } | null}>(`${this.endpoint}/availability/next?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find next available slot');
      throw error;
    }
  }

  /**
   * Find alternative time slots when conflicts exist
   * 
   * @param nurseId - Nurse ID
   * @param requestedStartTime - Originally requested time
   * @param duration - Appointment duration
   * @param maxAlternatives - Maximum number of alternatives to return
   * @returns Promise resolving to alternative time slots
   */
  async findAlternativeSlots(
    nurseId: string, 
    requestedStartTime: string, 
    duration: number,
    maxAlternatives = 5
  ) {
    try {
      const response = await this.client.post<{data: Array<{
        startTime: string;
        endTime: string;
        date: string;
        score: number; // Closeness to requested time (0-100)
        reason: string;
      }>}>(
        `${this.endpoint}/availability/alternatives`,
        {
          nurseId,
          requestedStartTime,
          duration,
          maxAlternatives
        }
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find alternative slots');
      throw error;
    }
  }

  // ==========================================
  // RECURRING APPOINTMENTS
  // ==========================================

  /**
   * Create recurring appointments
   * 
   * @param data - Recurring appointment data
   * @returns Promise resolving to created appointments
   */
  async createRecurringAppointments(data: RecurringAppointmentData): Promise<Appointment[]> {
    // Validate input data
    const validationResult = recurringAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{data: {
        appointments: Appointment[];
        summary: {
          requested: number;
          created: number;
          skipped: number;
          conflicts: string[];
        };
      }}>(`${this.endpoint}/recurring`, validationResult.data);

      // Log recurring appointment creation
      this.logActivity('recurring_appointments_created', {
        studentId: data.studentId,
        nurseId: data.nurseId,
        frequency: data.recurrence.frequency,
        created: response.data.data.summary.created,
        conflicts: response.data.data.summary.conflicts.length
      });

      return response.data.data.appointments;
    } catch (error) {
      this.handleError(error, 'Failed to create recurring appointments');
      throw error;
    }
  }

  /**
   * Preview recurring appointments before creation
   * 
   * @param data - Recurring appointment data
   * @returns Promise resolving to preview of appointments that would be created
   */
  async previewRecurringAppointments(data: RecurringAppointmentData) {
    // Validate input data
    const validationResult = recurringAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{data: {
        appointments: Array<{
          scheduledAt: string;
          duration: number;
          hasConflicts: boolean;
          conflicts?: Array<{
            appointmentId: string;
            studentName: string;
            conflictType: string;
          }>;
        }>;
        summary: {
          totalSlots: number;
          availableSlots: number;
          conflictingSlots: number;
          recommendations?: string[];
        };
      }}>(`${this.endpoint}/recurring/preview`, validationResult.data);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to preview recurring appointments');
      throw error;
    }
  }

  /**
   * Update recurring appointment series
   * 
   * @param seriesId - Recurring series ID
   * @param updateData - Update data to apply to series
   * @param updateScope - Scope of update ('current', 'future', 'all')
   * @returns Promise resolving to update result
   */
  async updateRecurringSeries(
    seriesId: string, 
    updateData: Partial<RecurringAppointmentData>,
    updateScope: 'current' | 'future' | 'all' = 'future'
  ) {
    try {
      const response = await this.client.put<{data: {
        updated: number;
        conflicts: Array<{
          appointmentId: string;
          reason: string;
        }>;
        skipped: string[];
      }}>(`${this.endpoint}/recurring/${seriesId}`, {
        updateData,
        scope: updateScope
      });

      this.logActivity('recurring_series_updated', {
        seriesId,
        scope: updateScope,
        updated: response.data.data.updated,
        conflicts: response.data.data.conflicts.length
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update recurring series');
      throw error;
    }
  }

  /**
   * Cancel recurring appointment series
   * 
   * @param seriesId - Recurring series ID
   * @param cancelScope - Scope of cancellation ('current', 'future', 'all')
   * @param reason - Cancellation reason
   * @returns Promise resolving to cancellation result
   */
  async cancelRecurringSeries(
    seriesId: string, 
    cancelScope: 'current' | 'future' | 'all' = 'future',
    reason?: string
  ) {
    try {
      const response = await this.client.delete<{data: {
        cancelled: number;
        failed: Array<{
          appointmentId: string;
          reason: string;
        }>;
      }}>(`${this.endpoint}/recurring/${seriesId}`, {
        data: {
          scope: cancelScope,
          reason
        }
      });

      this.logActivity('recurring_series_cancelled', {
        seriesId,
        scope: cancelScope,
        cancelled: response.data.data.cancelled,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to cancel recurring series');
      throw error;
    }
  }

  // ==========================================
  // SCHEDULING OPTIMIZATION
  // ==========================================

  /**
   * Get optimal scheduling recommendations
   * 
   * @param requirements - Scheduling requirements
   * @returns Promise resolving to scheduling recommendations
   */
  async getSchedulingRecommendations(requirements: {
    nurseIds?: string[];
    appointmentType: string;
    duration: number;
    preferredDates?: string[];
    preferredTimes?: Array<{
      start: string;
      end: string;
    }>;
    studentPreferences?: {
      morningPreferred?: boolean;
      afternoonPreferred?: boolean;
      daysToAvoid?: number[];
    };
  }) {
    try {
      const response = await this.client.post<{data: {
        recommendations: Array<{
          nurseId: string;
          nurseName: string;
          availableSlots: Array<{
            startTime: string;
            endTime: string;
            score: number;
            reasons: string[];
          }>;
          utilization: number;
          nextAvailable: string;
        }>;
        summary: {
          totalRecommendations: number;
          averageWaitTime: number;
          bestMatch?: {
            nurseId: string;
            startTime: string;
            score: number;
          };
        };
      }}>(`${this.endpoint}/scheduling/recommendations`, requirements);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to get scheduling recommendations');
      throw error;
    }
  }

  /**
   * Optimize appointment schedule for a nurse
   * 
   * @param nurseId - Nurse ID
   * @param date - Date to optimize
   * @param optimizationGoals - Goals for optimization
   * @returns Promise resolving to optimization suggestions
   */
  async optimizeSchedule(
    nurseId: string, 
    date: string,
    optimizationGoals: {
      minimizeGaps?: boolean;
      balanceWorkload?: boolean;
      prioritizeUrgent?: boolean;
      maximizeUtilization?: boolean;
    } = {}
  ) {
    try {
      const response = await this.client.post<{data: {
        currentSchedule: Array<{
          appointmentId: string;
          startTime: string;
          endTime: string;
          type: string;
          priority: string;
        }>;
        optimizedSchedule: Array<{
          appointmentId: string;
          currentStartTime: string;
          suggestedStartTime: string;
          reason: string;
          impact: {
            timesSaved: number;
            utilizationImprovement: number;
          };
        }>;
        summary: {
          totalTimeSaved: number;
          gapsReduced: number;
          utilizationImprovement: number;
          feasibilityScore: number;
        };
      }}>(`${this.endpoint}/scheduling/optimize`, {
        nurseId,
        date,
        goals: optimizationGoals
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to optimize schedule');
      throw error;
    }
  }

  // ==========================================
  // CAPACITY MANAGEMENT
  // ==========================================

  /**
   * Get scheduling capacity for date range
   * 
   * @param startDate - Start date
   * @param endDate - End date
   * @param nurseIds - Optional nurse filter
   * @returns Promise resolving to capacity information
   */
  async getSchedulingCapacity(startDate: string, endDate: string, nurseIds?: string[]) {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ...(nurseIds && { nurseIds: nurseIds.join(',') })
      });

      const response = await this.client.get<{data: {
        totalCapacity: number;
        utilizedCapacity: number;
        availableCapacity: number;
        utilizationRate: number;
        dailyBreakdown: Array<{
          date: string;
          totalSlots: number;
          bookedSlots: number;
          availableSlots: number;
          utilization: number;
        }>;
        nurseBreakdown: Array<{
          nurseId: string;
          nurseName: string;
          totalSlots: number;
          bookedSlots: number;
          utilization: number;
        }>;
      }}>(`${this.endpoint}/capacity?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to get scheduling capacity');
      throw error;
    }
  }

  /**
   * Get peak scheduling times analysis
   * 
   * @param analysisType - Type of analysis ('daily', 'weekly', 'monthly')
   * @param startDate - Analysis start date
   * @param endDate - Analysis end date
   * @returns Promise resolving to peak times analysis
   */
  async getPeakTimesAnalysis(
    analysisType: 'daily' | 'weekly' | 'monthly' = 'weekly',
    startDate?: string,
    endDate?: string
  ) {
    try {
      const queryParams = new URLSearchParams({
        type: analysisType,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const response = await this.client.get<{data: {
        peakHours: Array<{
          hour: number;
          averageBookings: number;
          utilization: number;
          waitTime: number;
        }>;
        peakDays: Array<{
          dayOfWeek: number;
          averageBookings: number;
          utilization: number;
        }>;
        recommendations: Array<{
          suggestion: string;
          impact: string;
          difficulty: 'low' | 'medium' | 'high';
        }>;
      }}>(`${this.endpoint}/analytics/peak-times?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to get peak times analysis');
      throw error;
    }
  }
}

/**
 * Factory function to create AppointmentsSchedulingService
 */
export function createAppointmentsSchedulingService(client: ApiClient): AppointmentsSchedulingService {
  return new AppointmentsSchedulingService(client);
}
