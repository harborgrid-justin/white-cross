/**
 * @fileoverview Medication Schedule and Monitoring API
 *
 * Handles medication scheduling, reminders, statistics, alerts, and form
 * options for the medication management system.
 *
 * **Key Features:**
 * - Medication schedules and daily MAR (Medication Administration Record)
 * - Real-time reminders for upcoming administrations
 * - Statistics and metrics tracking
 * - Low stock, expiration, and compliance alerts
 * - Form options for dropdowns and validation
 *
 * @module services/modules/medications/scheduleApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import type {
  StudentMedication,
  MedicationReminder,
  MedicationStats,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationScheduleResponse
} from './types';

/**
 * Medication Schedule and Monitoring API Service
 *
 * Provides scheduling, monitoring, and utility operations for
 * medication management.
 */
export class MedicationScheduleApi {
  constructor(private client: ApiClient) {}

  /**
   * Get medication schedule for date range
   *
   * Retrieves scheduled medication administrations for specified date range.
   * Useful for generating daily medication administration records (MAR).
   *
   * @param {string} [startDate] - Start date (ISO 8601)
   * @param {string} [endDate] - End date (ISO 8601)
   * @param {string} [nurseId] - Filter by assigned nurse
   * @returns {Promise<StudentMedication[]>} Scheduled medications
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * // Get today's medication schedule
   * const today = new Date().toISOString().split('T')[0];
   * const schedule = await scheduleApi.getSchedule(today, today);
   * ```
   */
  async getSchedule(
    startDate?: string,
    endDate?: string,
    nurseId?: string
  ): Promise<StudentMedication[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (nurseId) params.append('nurseId', nurseId);

      const response = await this.client.get<ApiResponse<MedicationScheduleResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/schedule?${params.toString()}`
      );

      return response.data.data.schedule;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch schedule');
    }
  }

  /**
   * Get medication reminders for specific date
   *
   * Retrieves upcoming medication administration reminders.
   * Used for nurse dashboard and notification system.
   *
   * **Cache Strategy**: 30-second cache with frequent polling
   *
   * @param {string} [date] - Date for reminders (ISO 8601), defaults to today
   * @returns {Promise<MedicationReminder[]>} Medication reminders
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * // Get today's reminders
   * const reminders = await scheduleApi.getReminders();
   *
   * // Get reminders for specific date
   * const futureReminders = await scheduleApi.getReminders('2025-11-15');
   * ```
   */
  async getReminders(date?: string): Promise<MedicationReminder[]> {
    try {
      const params = date ? `?date=${date}` : '';

      const response = await this.client.get<ApiResponse<{ reminders: MedicationReminder[] }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/reminders${params}`
      );

      return response.data.data.reminders;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch reminders');
    }
  }

  /**
   * Get medication statistics
   *
   * Retrieves aggregated medication statistics including administration counts,
   * controlled substance tracking, and compliance metrics.
   *
   * @returns {Promise<MedicationStats>} Medication statistics
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const stats = await scheduleApi.getStats();
   * console.log(`Total administrations today: ${stats.administrationsToday}`);
   * console.log(`Compliance rate: ${stats.complianceRate}%`);
   * ```
   */
  async getStats(): Promise<MedicationStats> {
    try {
      const response = await this.client.get<ApiResponse<MedicationStats>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/stats`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch statistics');
    }
  }

  /**
   * Get medication alerts
   *
   * Retrieves system alerts including low inventory, expiring medications,
   * missing administrations, and compliance warnings.
   *
   * @returns {Promise<MedicationAlertsResponse>} Medication alerts
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const alerts = await scheduleApi.getAlerts();
   * const critical = alerts.alerts.filter(a => a.severity === 'CRITICAL');
   * console.log(`${critical.length} critical alerts require attention`);
   * ```
   */
  async getAlerts(): Promise<MedicationAlertsResponse> {
    try {
      const response = await this.client.get<ApiResponse<MedicationAlertsResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/alerts`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch alerts');
    }
  }

  /**
   * Get medication form options
   *
   * Retrieves dropdown options for medication forms, routes, frequencies, etc.
   * Used for populating form dropdowns and validation.
   *
   * @returns {Promise<MedicationFormOptions>} Form options
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const options = await scheduleApi.getFormOptions();
   * // Populate form dropdowns
   * const dosageFormSelect = options.dosageForms.map(form => ({
   *   value: form,
   *   label: form
   * }));
   * ```
   */
  async getFormOptions(): Promise<MedicationFormOptions> {
    try {
      const response = await this.client.get<ApiResponse<MedicationFormOptions>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/form-options`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch form options');
    }
  }
}

/**
 * Factory function for creating MedicationScheduleApi instances
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {MedicationScheduleApi} New instance
 */
export function createMedicationScheduleApi(client: ApiClient): MedicationScheduleApi {
  return new MedicationScheduleApi(client);
}
