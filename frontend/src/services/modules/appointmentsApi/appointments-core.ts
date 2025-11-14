/**
 * Appointments API - Core CRUD Operations
 * 
 * Handles basic CRUD operations for appointments including creating, reading,
 * updating, and deleting appointments with validation and error handling.
 * 
 * @module services/modules/appointmentsApi/appointments-core
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentStatus,
  AppointmentPriority,
  APPOINTMENT_VALIDATION
} from './types';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentFiltersSchema,
  validateAppointmentBusinessRules,
  getValidationErrors
} from './validation';

/**
 * Core Appointments Service Class
 * 
 * Provides basic CRUD operations for appointment management with
 * comprehensive validation and error handling.
 */
export class AppointmentsCoreService {
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
  // CORE CRUD OPERATIONS
  // ==========================================

  /**
   * Create a new appointment
   * 
   * @param data - Appointment creation data
   * @returns Promise resolving to the created appointment
   * @throws ValidationError if data is invalid
   * @throws ConflictError if appointment conflicts exist
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    // Validate input data
    const validationResult = createAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    // Validate business rules
    const businessRules = validateAppointmentBusinessRules({
      scheduledAt: validatedData.scheduledAt,
      duration: validatedData.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION,
      type: validatedData.type,
      priority: validatedData.priority || AppointmentPriority.NORMAL
    });

    if (!businessRules.valid) {
      throw this.createError('Business rule validation failed', 'BUSINESS_RULE_ERROR', {
        errors: businessRules.errors
      });
    }

    try {
      const response = await this.client.post<{data: Appointment}>(this.endpoint, validatedData);
      const appointment = response.data.data;
      
      // Log appointment creation for audit
      this.logActivity('appointment_created', {
        appointmentId: appointment.id,
        studentId: validatedData.studentId,
        nurseId: validatedData.nurseId,
        type: validatedData.type,
        scheduledAt: validatedData.scheduledAt
      });

      return appointment;
    } catch (error) {
      this.handleError(error, 'Failed to create appointment');
      throw error;
    }
  }

  /**
   * Get appointment by ID with optional relation population
   * 
   * @param id - Appointment ID
   * @param includeRelations - Whether to include student/nurse details
   * @returns Promise resolving to the appointment
   */
  async getAppointment(id: string, includeRelations = false): Promise<AppointmentWithRelations> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const params = includeRelations ? { include: 'student,nurse,reminders' } : {};
      const queryParams = new URLSearchParams(params as Record<string, string>);
      const url = `${this.endpoint}/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.client.get<{data: AppointmentWithRelations}>(url);
      
      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointment');
      throw error;
    }
  }

  /**
   * Update an existing appointment
   * 
   * @param id - Appointment ID
   * @param data - Update data
   * @returns Promise resolving to the updated appointment
   */
  async updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    // Validate input data
    const validationResult = updateAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    try {
      // Get current appointment for validation
      const currentAppointment = await this.getAppointment(id);

      // Validate status transitions
      if (validatedData.scheduledAt && currentAppointment.status !== AppointmentStatus.SCHEDULED) {
        throw this.createError(
          'Cannot reschedule non-scheduled appointment',
          'BUSINESS_RULE_ERROR'
        );
      }

      const response = await this.client.put<{data: Appointment}>(`${this.endpoint}/${id}`, validatedData);
      
      // Log appointment update for audit
      this.logActivity('appointment_updated', {
        appointmentId: id,
        changes: validatedData,
        previousStatus: currentAppointment.status
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update appointment');
      throw error;
    }
  }

  /**
   * Delete an appointment (soft delete)
   * 
   * @param id - Appointment ID
   * @param reason - Cancellation reason
   */
  async deleteAppointment(id: string, reason?: string): Promise<void> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const currentAppointment = await this.getAppointment(id);

      // Validate that appointment can be cancelled
      if (![AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(currentAppointment.status)) {
        throw this.createError(
          'Cannot cancel appointment with current status',
          'BUSINESS_RULE_ERROR'
        );
      }

      await this.client.delete(`${this.endpoint}/${id}`, { data: { reason } });
      
      // Log appointment cancellation for audit
      this.logActivity('appointment_cancelled', {
        appointmentId: id,
        reason,
        originalStatus: currentAppointment.status
      });
    } catch (error) {
      this.handleError(error, 'Failed to cancel appointment');
      throw error;
    }
  }

  // ==========================================
  // APPOINTMENT LISTING AND FILTERING
  // ==========================================

  /**
   * Get appointments with filtering and pagination
   * 
   * @param filters - Filter criteria
   * @returns Promise resolving to paginated appointment list
   */
  async getAppointments(filters: AppointmentFilters = {}) {
    // Validate filters
    const validationResult = appointmentFiltersSchema.safeParse(filters);
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
        data: Appointment[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        filters: AppointmentFilters;
      }>(url);

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointments');
      throw error;
    }
  }

  /**
   * Get appointments for a specific date range
   * 
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param nurseId - Optional nurse filter
   * @returns Promise resolving to appointments in date range
   */
  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    nurseId?: string
  ): Promise<Appointment[]> {
    const filters: AppointmentFilters = {
      startDate,
      endDate,
      nurseId,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
      limit: 1000 // Large limit for calendar views
    };

    const result = await this.getAppointments(filters);
    return result.data;
  }

  /**
   * Get today's appointments for a nurse
   * 
   * @param nurseId - Nurse ID
   * @returns Promise resolving to today's appointments
   */
  async getTodaysAppointments(nurseId: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return this.getAppointmentsByDateRange(today, today, nurseId);
  }

  /**
   * Get upcoming appointments for a student
   * 
   * @param studentId - Student ID
   * @param limit - Number of appointments to return
   * @returns Promise resolving to upcoming appointments
   */
  async getUpcomingAppointments(studentId: string, limit = 5): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0];

    const filters: AppointmentFilters = {
      studentId,
      startDate: today,
      endDate,
      status: AppointmentStatus.SCHEDULED,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
      limit
    };

    const result = await this.getAppointments(filters);
    return result.data;
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Validate appointment data without creating
   * 
   * @param data - Appointment data to validate
   * @returns Validation result with errors if any
   */
  validateAppointmentData(data: CreateAppointmentData) {
    const schemaResult = createAppointmentSchema.safeParse(data);
    const businessRules = validateAppointmentBusinessRules({
      scheduledAt: data.scheduledAt,
      duration: data.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION,
      type: data.type,
      priority: data.priority || AppointmentPriority.NORMAL
    });

    return {
      valid: schemaResult.success && businessRules.valid,
      schemaErrors: schemaResult.success ? [] : getValidationErrors(schemaResult.error),
      businessErrors: businessRules.errors,
      allErrors: [
        ...(schemaResult.success ? [] : Object.values(getValidationErrors(schemaResult.error)).flat()),
        ...businessRules.errors
      ]
    };
  }

  /**
   * Check if appointment can be modified
   * 
   * @param appointment - Appointment to check
   * @returns Whether appointment can be modified
   */
  canModifyAppointment(appointment: Appointment): boolean {
    const modifiableStatuses = [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS];
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return modifiableStatuses.includes(appointment.status) && 
           minutesDiff >= APPOINTMENT_VALIDATION.CANCELLATION_NOTICE * 60;
  }
}

/**
 * Factory function to create AppointmentsCoreService
 */
export function createAppointmentsCoreService(client: ApiClient): AppointmentsCoreService {
  return new AppointmentsCoreService(client);
}
