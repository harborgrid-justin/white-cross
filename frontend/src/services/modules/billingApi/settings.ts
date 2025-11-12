/**
 * Settings & Notifications API
 *
 * Manages billing settings, configuration, and notification delivery.
 *
 * @module services/modules/billingApi/settings
 * @category API
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../types';
import { BillingSettings } from './types';
import { createApiError } from './schemas';
import { BILLING_ENDPOINTS } from './endpoints';

/**
 * Settings & Notifications API Client
 *
 * Provides functionality for managing billing system settings,
 * configuration, and sending notifications to patients.
 */
export class SettingsNotificationsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get billing settings
   *
   * @returns Current billing settings and configuration
   * @throws Error if the API request fails
   */
  async getBillingSettings(): Promise<BillingSettings> {
    try {
      const response = await this.client.get<ApiResponse<BillingSettings>>(
        BILLING_ENDPOINTS.SETTINGS
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingSettings;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch billing settings');
    }
  }

  /**
   * Update billing settings
   *
   * @param settings - Partial billing settings to update
   * @returns Updated billing settings
   * @throws Error if the API request fails
   */
  async updateBillingSettings(settings: Partial<BillingSettings>): Promise<BillingSettings> {
    try {
      const response = await this.client.put<ApiResponse<BillingSettings>>(
        BILLING_ENDPOINTS.SETTINGS,
        settings
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingSettings;
    } catch (error) {
      throw createApiError(error, 'Failed to update billing settings');
    }
  }

  /**
   * Send payment reminder
   *
   * @param invoiceId - Invoice ID for which to send reminder
   * @param message - Optional custom message to include in the reminder
   * @returns Success indicator
   * @throws Error if the API request fails
   */
  async sendPaymentReminder(invoiceId: string, message?: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.post<ApiResponse<{ success: boolean }>>(
        BILLING_ENDPOINTS.SEND_REMINDER,
        { invoiceId, message }
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as { success: boolean };
    } catch (error) {
      throw createApiError(error, 'Failed to send payment reminder');
    }
  }

  /**
   * Send billing statement
   *
   * @param patientId - Patient ID for whom to send statement
   * @param startDate - Optional start date for statement period
   * @param endDate - Optional end date for statement period
   * @returns Success indicator
   * @throws Error if the API request fails
   */
  async sendStatement(
    patientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await this.client.post<ApiResponse<{ success: boolean }>>(
        BILLING_ENDPOINTS.SEND_STATEMENT,
        { patientId, startDate, endDate }
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as { success: boolean };
    } catch (error) {
      throw createApiError(error, 'Failed to send statement');
    }
  }
}
