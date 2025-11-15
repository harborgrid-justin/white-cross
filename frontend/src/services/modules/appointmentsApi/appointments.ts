/**
 * Appointments API - Unified Service
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Migration example:
 * ```typescript
 * // OLD:
 * import { AppointmentsService } from '@/services/modules/appointmentsApi/appointments';
 * const service = new AppointmentsService(client);
 * const appointment = await service.getAppointment(id);
 *
 * // NEW (Server Component):
 * import { getAppointment } from '@/lib/actions/appointments.actions';
 * const appointment = await getAppointment(id);
 *
 * // NEW (Client Component with React Query):
 * import { useQuery } from '@tanstack/react-query';
 * import { getAppointment } from '@/lib/actions/appointments.actions';
 * const { data: appointment } = useQuery({
 *   queryKey: ['appointment', id],
 *   queryFn: () => getAppointment(id)
 * });
 * ```
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Main appointments service that composes all appointment-related functionality
 * from specialized service modules. Provides a single, cohesive interface for
 * appointment management operations.
 *
 * @module services/modules/appointmentsApi/appointments
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentStatus,
  RecurringAppointmentData,
  AppointmentCalendarEvent,
  AppointmentType,
  APPOINTMENT_VALIDATION
} from './types';
import { AppointmentsCrudService } from './appointments-crud';
import { AppointmentsQueryService } from './appointments-queries';
import { AppointmentsConflictService } from './appointments-conflict';
import { AppointmentsOperationsService } from './appointments-operations';
import { AppointmentsUtils } from './appointments-utils';
import type { StatusUpdateData, BulkOperationResult } from './appointments-shared';

/**
 * Unified Appointments Service
 *
 * Provides comprehensive appointment management capabilities by composing
 * specialized service modules for CRUD operations, querying, conflict detection,
 * and advanced operations.
 */
export class AppointmentsService {
  private readonly crud: AppointmentsCrudService;
  private readonly query: AppointmentsQueryService;
  private readonly conflict: AppointmentsConflictService;
  private readonly operations: AppointmentsOperationsService;

  constructor(private readonly client: ApiClient) {
    // Initialize service modules
    this.crud = new AppointmentsCrudService(client);
    this.query = new AppointmentsQueryService(client);
    this.conflict = new AppointmentsConflictService(client);
    this.operations = new AppointmentsOperationsService(client);

    // Wire up dependencies
    this.crud.setConflictChecker(this.conflict.checkConflicts.bind(this.conflict));
  }

  // ==========================================
  // CRUD OPERATIONS (delegated to crud service)
  // ==========================================

  /**
   * Create a new appointment
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    return this.crud.createAppointment(data);
  }

  /**
   * Get appointment by ID with optional relation population
   */
  async getAppointment(
    id: string,
    includeRelations = false
  ): Promise<AppointmentWithRelations> {
    return this.crud.getAppointment(id, includeRelations);
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(
    id: string,
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    return this.crud.updateAppointment(id, data);
  }

  /**
   * Delete an appointment (soft delete)
   */
  async deleteAppointment(id: string, reason?: string): Promise<void> {
    return this.crud.deleteAppointment(id, reason);
  }

  // ==========================================
  // QUERY OPERATIONS (delegated to query service)
  // ==========================================

  /**
   * Get appointments with filtering and pagination
   */
  async getAppointments(filters: AppointmentFilters = {}) {
    return this.query.getAppointments(filters);
  }

  /**
   * Get appointments for a specific date range
   */
  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    nurseId?: string
  ): Promise<Appointment[]> {
    return this.query.getAppointmentsByDateRange(startDate, endDate, nurseId);
  }

  /**
   * Get today's appointments for a nurse
   */
  async getTodaysAppointments(nurseId: string): Promise<Appointment[]> {
    return this.query.getTodaysAppointments(nurseId);
  }

  /**
   * Get upcoming appointments for a student
   */
  async getUpcomingAppointments(
    studentId: string,
    limit = 5
  ): Promise<Appointment[]> {
    return this.query.getUpcomingAppointments(studentId, limit);
  }

  // ==========================================
  // STATUS MANAGEMENT (implemented here with dependencies)
  // ==========================================

  /**
   * Update appointment status
   */
  async updateStatus(id: string, statusData: StatusUpdateData): Promise<Appointment> {
    // This would be implemented here or delegated to a status service
    // For now, implementing inline to maintain backward compatibility
    return this.client.put<{ data: Appointment }>(
      `/api/appointments/${id}/status`,
      statusData
    ).then((response) => response.data.data);
  }

  /**
   * Mark appointment as completed
   */
  async completeAppointment(
    id: string,
    outcomes?: string,
    followUpRequired = false,
    followUpDate?: string
  ): Promise<Appointment> {
    const updateData: UpdateAppointmentData = {
      outcomes,
      followUpRequired,
      ...(followUpDate && { followUpDate })
    };

    await this.updateAppointment(id, updateData);

    return this.updateStatus(id, {
      status: AppointmentStatus.COMPLETED,
      outcomes
    });
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string, reason?: string): Promise<Appointment> {
    return this.updateStatus(id, {
      status: AppointmentStatus.NO_SHOW,
      reason
    });
  }

  // ==========================================
  // CONFLICT DETECTION (delegated to conflict service)
  // ==========================================

  /**
   * Check for appointment conflicts
   */
  async checkConflicts(conflictData: {
    nurseId: string;
    startTime: string;
    duration: number;
    excludeAppointmentId?: string;
  }) {
    return this.conflict.checkConflicts(conflictData);
  }

  /**
   * Find available time slots for appointment scheduling
   */
  async findAvailableSlots(
    nurseId: string,
    date: string,
    duration: number = APPOINTMENT_VALIDATION.DEFAULT_DURATION
  ) {
    return this.conflict.findAvailableSlots(nurseId, date, duration);
  }

  /**
   * Get next available appointment slot
   */
  async getNextAvailableSlot(
    nurseId: string,
    preferredDate?: string,
    duration = APPOINTMENT_VALIDATION.DEFAULT_DURATION
  ) {
    return this.conflict.getNextAvailableSlot(nurseId, preferredDate, duration);
  }

  // ==========================================
  // ADVANCED OPERATIONS (delegated to operations service)
  // ==========================================

  /**
   * Create recurring appointments
   */
  async createRecurringAppointments(
    data: RecurringAppointmentData
  ): Promise<Appointment[]> {
    return this.operations.createRecurringAppointments(data);
  }

  /**
   * Cancel multiple appointments
   */
  async bulkCancel(
    appointmentIds: string[],
    reason?: string
  ): Promise<BulkOperationResult> {
    return this.operations.bulkCancel(appointmentIds, reason);
  }

  /**
   * Reschedule multiple appointments
   */
  async bulkReschedule(
    rescheduleData: Array<{
      appointmentId: string;
      newDateTime: string;
      reason?: string;
    }>
  ): Promise<BulkOperationResult> {
    return this.operations.bulkReschedule(rescheduleData);
  }

  /**
   * Get appointments formatted for calendar display
   */
  async getCalendarEvents(filters: {
    startDate: string;
    endDate: string;
    nurseIds?: string[];
    types?: AppointmentType[];
  }): Promise<AppointmentCalendarEvent[]> {
    return this.operations.getCalendarEvents(filters);
  }

  // ==========================================
  // UTILITY METHODS (delegated to utils)
  // ==========================================

  /**
   * Validate appointment data without creating
   */
  validateAppointmentData(data: CreateAppointmentData) {
    return AppointmentsUtils.validateAppointmentData(data);
  }

  /**
   * Check if appointment can be modified
   */
  canModifyAppointment(appointment: Appointment): boolean {
    return AppointmentsUtils.canModifyAppointment(appointment);
  }
}

/**
 * Factory function to create AppointmentsService
 */
export function createAppointmentsService(client: ApiClient): AppointmentsService {
  return new AppointmentsService(client);
}
