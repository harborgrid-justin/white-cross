/**
 * Appointments Controller
 * Business logic for appointment scheduling, management, and calendar operations
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AppointmentService } from '../../../../services/appointment/AppointmentService';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  preparePayload
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

export class AppointmentsController {
  /**
   * Get all appointments with pagination and filters
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      nurseId: { type: 'string' },
      studentId: { type: 'string' },
      status: { type: 'string' },
      appointmentType: { type: 'string' },
      dateFrom: { type: 'string' },
      dateTo: { type: 'string' }
    });

    const result = await AppointmentService.getAppointments(page, limit, filters);

    return paginatedResponse(
      h,
      result.appointments,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get appointment by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const appointment = await AppointmentService.getAppointmentById(id);

    return successResponse(h, { appointment });
  }

  /**
   * Create new appointment
   * @param {AuthenticatedRequest} request - The authenticated request
   * @param {ResponseToolkit} h - The response toolkit
   * @returns {Promise<Response>} Created appointment response
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const appointmentData = preparePayload(request.payload, {
      dateFields: ['scheduledDate']
    });

    const appointment = await AppointmentService.createAppointment(appointmentData as any);

    return createdResponse(h, { appointment });
  }

  /**
   * Update appointment
   * @param {AuthenticatedRequest} request - The authenticated request
   * @param {ResponseToolkit} h - The response toolkit
   * @returns {Promise<Response>} Updated appointment response
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = preparePayload(request.payload, {
      dateFields: ['scheduledDate']
    });

    const appointment = await AppointmentService.updateAppointment(id, updateData);

    return successResponse(h, { appointment });
  }

  /**
   * Cancel appointment
   */
  static async cancel(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const payload = preparePayload(request.payload);
    const reason = payload.reason as string | undefined;

    const appointment = await AppointmentService.cancelAppointment(id, reason);

    return successResponse(h, { appointment });
  }

  /**
   * Mark appointment as no-show
   */
  static async markNoShow(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const appointment = await AppointmentService.markNoShow(id);

    return successResponse(h, { appointment });
  }

  /**
   * Start appointment (IN_PROGRESS status)
   */
  static async start(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const appointment = await AppointmentService.startAppointment(id);

    return successResponse(h, { appointment });
  }

  /**
   * Complete appointment
   */
  static async complete(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const completionData = preparePayload(request.payload);

    const appointment = await AppointmentService.completeAppointment(id, completionData as any);

    return successResponse(h, { appointment });
  }

  /**
   * Get available time slots for a nurse
   */
  static async getAvailableSlots(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { nurseId } = request.params;
    const { date, slotDuration } = request.query;

    const slots = await AppointmentService.getAvailableSlots(
      nurseId,
      new Date(date as string),
      slotDuration ? parseInt(slotDuration as string) : 30
    );

    return successResponse(h, { slots });
  }

  /**
   * Get upcoming appointments for a nurse
   */
  static async getUpcoming(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { nurseId } = request.params;
    const limit = request.query.limit ? parseInt(request.query.limit as string) : 10;

    const appointments = await AppointmentService.getUpcomingAppointments(nurseId, limit);

    return successResponse(h, { appointments });
  }

  /**
   * Get appointment statistics
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { nurseId, dateFrom, dateTo } = request.query;

    const stats = await AppointmentService.getAppointmentStatistics(
      nurseId as string | undefined,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    return successResponse(h, { stats });
  }

  /**
   * Create recurring appointments
   * @param {AuthenticatedRequest} request - The authenticated request
   * @param {ResponseToolkit} h - The response toolkit
   * @returns {Promise<Response>} Created recurring appointments response
   */
  static async createRecurring(request: AuthenticatedRequest, h: ResponseToolkit) {
    const payload = preparePayload(request.payload);
    const baseData = payload.baseData as any;
    const recurrencePattern = payload.recurrencePattern as any;

    const appointmentData = {
      ...baseData,
      scheduledDate: new Date(baseData.scheduledDate)
    };

    const appointments = await AppointmentService.createRecurringAppointments(
      appointmentData,
      recurrencePattern
    );

    return createdResponse(h, { appointments, count: appointments.length });
  }

  /**
   * Add student to appointment waitlist
   */
  static async addToWaitlist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const waitlistData = preparePayload(request.payload);
    const entry = await AppointmentService.addToWaitlist(waitlistData as any);

    return createdResponse(h, { entry });
  }

  /**
   * Get appointment waitlist
   */
  static async getWaitlist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const filters = buildFilters(request.query, {
      nurseId: { type: 'string' },
      status: { type: 'string' },
      priority: { type: 'string' }
    });

    const entries = await AppointmentService.getWaitlist(filters);

    return successResponse(h, { entries });
  }

  /**
   * Remove student from waitlist
   */
  /**
   * Remove from waitlist - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async removeFromWaitlist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const payload = preparePayload(request.payload);
    const reason = payload.reason as string | undefined;

    await AppointmentService.removeFromWaitlist(id, reason);

    return h.response().code(204);
  }

  /**
   * Generate calendar export (iCal format)
   */
  static async generateCalendar(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { nurseId } = request.params;
    const { dateFrom, dateTo } = request.query;

    const icalContent = await AppointmentService.generateCalendarExport(
      nurseId,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    return h.response(icalContent)
      .type('text/calendar')
      .header('Content-Disposition', `attachment; filename="appointments-${nurseId}.ics"`);
  }

  /**
   * Send appointment reminders
   */
  static async sendReminders(request: AuthenticatedRequest, h: ResponseToolkit) {
    const results = await AppointmentService.processPendingReminders();

    return successResponse(h, { results });
  }
}
