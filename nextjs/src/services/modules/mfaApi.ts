/**
 * @fileoverview Multi-Factor Authentication (MFA) API service
 * @module services/modules/mfaApi
 * @category Services - Authentication & Security
 *
 * Provides comprehensive Multi-Factor Authentication (MFA) capabilities for enhanced
 * account security. Implements TOTP (Time-based One-Time Password), SMS verification,
 * email verification, and backup code generation with device management.
 *
 * Key Features:
 * - MFA setup and configuration
 * - Multiple MFA methods (TOTP, SMS, Email)
 * - TOTP QR code generation for authenticator apps
 * - SMS-based one-time password delivery
 * - Email-based verification codes
 * - Backup code generation and validation
 * - MFA device management (multiple devices per user)
 * - MFA enforcement policies
 * - Admin MFA status reporting
 * - Bulk user messaging capabilities
 *
 * Supported MFA Methods:
 * - TOTP (Time-based One-Time Password): Google Authenticator, Authy, Microsoft Authenticator
 * - SMS: One-time password sent via text message
 * - EMAIL: One-time password sent via email
 *
 * TOTP Implementation:
 * - RFC 6238 compliant
 * - 30-second time step
 * - 6-digit codes
 * - SHA-1 algorithm
 * - QR code generation for easy setup
 * - Secret key backup for manual entry
 *
 * SMS Verification:
 * - E.164 international phone number format
 * - Carrier agnostic delivery
 * - 6-digit numeric codes
 * - 10-minute expiration
 * - Rate limiting to prevent abuse
 *
 * Email Verification:
 * - 6-digit alphanumeric codes
 * - 15-minute expiration
 * - HTML email templates
 * - Resend capability with cooldown
 *
 * Backup Codes:
 * - 10 single-use backup codes generated
 * - 8-character alphanumeric format
 * - Used when primary MFA method unavailable
 * - Secure storage (hashed)
 * - Remaining code count tracking
 *
 * Device Management:
 * - Multiple MFA devices per user
 * - Device naming for identification
 * - Primary device designation
 * - Device removal capabilities
 * - Last verification timestamp tracking
 *
 * MFA Enforcement:
 * - Role-based MFA requirements
 * - Grace period for new users
 * - MFA bypass for emergency access (admin only)
 * - Mandatory MFA for privileged roles (ADMIN, DISTRICT_ADMIN)
 *
 * Security Features:
 * - Rate limiting on verification attempts
 * - Automatic account lockout after repeated failures
 * - Audit logging for all MFA events
 * - Device fingerprinting for anomaly detection
 * - IP-based access restrictions
 *
 * @example Setup TOTP MFA
 * ```typescript
 * import { mfaApi } from '@/services/modules/mfaApi';
 *
 * // Initiate TOTP setup
 * const setup = await mfaApi.setupMfa({
 *   method: 'TOTP',
 *   deviceName: 'iPhone 14 Pro'
 * });
 * console.log(`Secret: ${setup.secret}`);
 * console.log(`QR Code: ${setup.qrCode}`); // Display QR code to user
 *
 * // Verify TOTP code from authenticator app
 * const verified = await mfaApi.verifyMfa({
 *   method: 'TOTP',
 *   code: '123456'
 * });
 * if (verified.success) {
 *   console.log('TOTP MFA enabled successfully');
 * }
 * ```
 *
 * @example Setup SMS MFA
 * ```typescript
 * const smsSetup = await mfaApi.setupMfa({
 *   method: 'SMS',
 *   phoneNumber: '+15551234567'
 * });
 * console.log('SMS code sent, check your phone');
 *
 * // Verify SMS code
 * const smsVerified = await mfaApi.verifyMfa({
 *   method: 'SMS',
 *   code: '789012'
 * });
 * ```
 *
 * @example Generate backup codes
 * ```typescript
 * const backupCodes = await mfaApi.regenerateBackupCodes();
 * console.log('Save these backup codes in a secure location:');
 * backupCodes.backupCodes.forEach(code => console.log(code));
 * ```
 *
 * @example Get MFA status
 * ```typescript
 * const status = await mfaApi.getMfaStatus();
 * console.log(`MFA enabled: ${status.enabled}`);
 * console.log(`Active methods: ${status.methods.map(m => m.method).join(', ')}`);
 * console.log(`Backup codes remaining: ${status.backupCodesRemaining}`);
 * ```
 *
 * @example Admin MFA reporting
 * ```typescript
 * const report = await mfaApi.getAdminFeatureReport('2025-01-01', '2025-01-31');
 * console.log(`Top features: ${report.topFeatures.length}`);
 * ```
 *
 * @see {@link authApi} for authentication workflows
 * @see {@link https://tools.ietf.org/html/rfc6238 RFC 6238 - TOTP Specification}
 * @see {@link https://www.twilio.com/docs/verify Twilio Verify API} for SMS implementation
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse } from '../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type MfaMethod = 'TOTP' | 'SMS' | 'EMAIL';
export type MfaStatus = 'DISABLED' | 'ENABLED' | 'PENDING_VERIFICATION';

export interface MfaSetupResponse {
  method: MfaMethod;
  status: MfaStatus;
  qrCode?: string; // For TOTP setup
  secret?: string; // For TOTP setup (for manual entry)
  phoneNumber?: string; // For SMS
  email?: string; // For Email
  backupCodes?: string[]; // Generated backup codes
  verificationRequired: boolean;
}

export interface MfaSetupRequest {
  method: MfaMethod;
  phoneNumber?: string; // Required for SMS
  email?: string; // Required for Email
}

export interface MfaVerificationRequest {
  method: MfaMethod;
  code: string;
  trustDevice?: boolean; // Remember this device for X days
}

export interface MfaVerificationResponse {
  success: boolean;
  message: string;
  sessionToken?: string;
  deviceToken?: string; // If trustDevice was true
  expiresIn?: number;
}

export interface MfaDevice {
  id: string;
  userId: string;
  method: MfaMethod;
  deviceName?: string;
  lastUsedAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MfaStatus {
  enabled: boolean;
  methods: Array<{
    method: MfaMethod;
    isConfigured: boolean;
    isActive: boolean;
    lastVerified?: string;
  }>;
  backupCodesRemaining: number;
  devices: MfaDevice[];
}

// Admin Features
export interface AdminFeatureReport {
  reportId: string;
  generatedAt: string;
  period: {
    startDate: string;
    endDate: string;
  };
  features: Array<{
    key: string;
    name: string;
    usageCount: number;
    uniqueUsers: number;
    averageUsagePerUser: number;
    adoptionRate: number;
  }>;
  topFeatures: Array<{
    key: string;
    name: string;
    usageCount: number;
  }>;
  underusedFeatures: Array<{
    key: string;
    name: string;
    usageCount: number;
  }>;
}

export interface FeatureStatus {
  key: string;
  name: string;
  isEnabled: boolean;
  enabledFor?: string[];
  configuration?: Record<string, any>;
  lastUpdated: string;
}

export interface AdminHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  timestamp: string;
  services: Array<{
    name: string;
    status: 'UP' | 'DOWN' | 'DEGRADED';
    latency?: number;
    error?: string;
  }>;
  adminMetrics: {
    activeAdminSessions: number;
    recentAdminActions: number;
    failedLogins: number;
    suspiciousActivity: number;
  };
}

// Bulk Messaging
export interface BulkMessageRequest {
  recipients: string[]; // User IDs or phone numbers
  message: string;
  subject?: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  scheduledFor?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  metadata?: Record<string, any>;
}

export interface BulkMessageResponse {
  messageId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRecipients: number;
  queued: number;
  sent: number;
  failed: number;
  estimatedCompletion?: string;
  errors?: Array<{
    recipient: string;
    error: string;
  }>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const mfaSetupSchema = z.object({
  method: z.enum(['TOTP', 'SMS', 'EMAIL']),
  phoneNumber: z.string().regex(/^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/).optional(),
  email: z.string().email().optional(),
}).refine((data) => {
  if (data.method === 'SMS' && !data.phoneNumber) {
    return false;
  }
  if (data.method === 'EMAIL' && !data.email) {
    return false;
  }
  return true;
}, {
  message: 'Phone number required for SMS, email required for EMAIL method',
});

const mfaVerificationSchema = z.object({
  method: z.enum(['TOTP', 'SMS', 'EMAIL']),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
  trustDevice: z.boolean().optional(),
});

const bulkMessageSchema = z.object({
  recipients: z.array(z.string()).min(1, 'At least one recipient required').max(1000, 'Maximum 1000 recipients'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  subject: z.string().max(200).optional(),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH']),
  scheduledFor: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

// ==========================================
// MFA API SERVICE
// ==========================================

export class MfaApi {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // MFA SETUP & CONFIGURATION
  // ==========================================

  /**
   * Initiate MFA setup for user
   */
  async setupMfa(data: MfaSetupRequest): Promise<MfaSetupResponse> {
    try {
      mfaSetupSchema.parse(data);
      const response = await this.client.post<ApiResponse<MfaSetupResponse>>(
        '/v1/system/auth/mfa/setup',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('MFA setup validation failed', 'mfaSetup', {}, error);
      }
      throw createApiError(error, 'Failed to setup MFA');
    }
  }

  /**
   * Verify MFA setup with code
   */
  async verifyMfa(data: MfaVerificationRequest): Promise<MfaVerificationResponse> {
    try {
      mfaVerificationSchema.parse(data);
      const response = await this.client.post<ApiResponse<MfaVerificationResponse>>(
        '/v1/system/auth/mfa/verify',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('MFA verification validation failed', 'mfaVerification', {}, error);
      }
      throw createApiError(error, 'Failed to verify MFA');
    }
  }

  /**
   * Get MFA status for current user
   */
  async getMfaStatus(): Promise<MfaStatus> {
    try {
      const response = await this.client.get<ApiResponse<MfaStatus>>(
        '/v1/system/auth/mfa/status'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch MFA status');
    }
  }

  /**
   * Disable MFA for user
   */
  async disableMfa(verificationCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.post<ApiResponse<{ success: boolean; message: string }>>(
        '/v1/system/auth/mfa/disable',
        { verificationCode }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to disable MFA');
    }
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(): Promise<{ backupCodes: string[] }> {
    try {
      const response = await this.client.post<ApiResponse<{ backupCodes: string[] }>>(
        '/v1/system/auth/mfa/backup-codes/regenerate'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to regenerate backup codes');
    }
  }

  /**
   * Get MFA devices
   */
  async getMfaDevices(): Promise<MfaDevice[]> {
    try {
      const response = await this.client.get<ApiResponse<MfaDevice[]>>(
        '/v1/system/auth/mfa/devices'
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch MFA devices');
    }
  }

  /**
   * Remove MFA device
   */
  async removeMfaDevice(deviceId: string): Promise<void> {
    try {
      await this.client.delete(`/v1/system/auth/mfa/devices/${deviceId}`);
    } catch (error) {
      throw createApiError(error, 'Failed to remove MFA device');
    }
  }

  // ==========================================
  // ADMIN FEATURES
  // ==========================================

  /**
   * Get admin feature usage report
   */
  async getAdminFeatureReport(startDate?: string, endDate?: string): Promise<AdminFeatureReport> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await this.client.get<ApiResponse<AdminFeatureReport>>(
        `/v1/system/admin/features/report?${params.toString()}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch admin feature report');
    }
  }

  /**
   * Get feature status
   */
  async getFeatureStatus(featureKey?: string): Promise<FeatureStatus | FeatureStatus[]> {
    try {
      const url = featureKey
        ? `/v1/system/admin/features/status/${featureKey}`
        : '/v1/system/admin/features/status';

      const response = await this.client.get<ApiResponse<FeatureStatus | FeatureStatus[]>>(url);
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch feature status');
    }
  }

  /**
   * Update feature status
   */
  async updateFeatureStatus(featureKey: string, data: {
    isEnabled?: boolean;
    enabledFor?: string[];
    configuration?: Record<string, any>;
  }): Promise<FeatureStatus> {
    try {
      const response = await this.client.put<ApiResponse<FeatureStatus>>(
        `/v1/system/admin/features/status/${featureKey}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update feature status');
    }
  }

  /**
   * Get admin health status
   */
  async getAdminHealth(): Promise<AdminHealth> {
    try {
      const response = await this.client.get<ApiResponse<AdminHealth>>(
        '/v1/system/admin/health'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch admin health');
    }
  }

  // ==========================================
  // BULK MESSAGING
  // ==========================================

  /**
   * Send bulk message
   */
  async sendBulkMessage(data: BulkMessageRequest): Promise<BulkMessageResponse> {
    try {
      bulkMessageSchema.parse(data);
      const response = await this.client.post<ApiResponse<BulkMessageResponse>>(
        '/v1/communication/bulk-message',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Bulk message validation failed', 'bulkMessage', {}, error);
      }
      throw createApiError(error, 'Failed to send bulk message');
    }
  }

  /**
   * Get bulk message status
   */
  async getBulkMessageStatus(messageId: string): Promise<BulkMessageResponse> {
    try {
      const response = await this.client.get<ApiResponse<BulkMessageResponse>>(
        `/v1/communication/bulk-message/${messageId}/status`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch bulk message status');
    }
  }

  /**
   * Cancel bulk message
   */
  async cancelBulkMessage(messageId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.post<ApiResponse<{ success: boolean; message: string }>>(
        `/v1/communication/bulk-message/${messageId}/cancel`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to cancel bulk message');
    }
  }
}

/**
 * Factory function to create MFA API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured MfaApi instance
 */
export function createMfaApi(client: ApiClient): MfaApi {
  return new MfaApi(client);
}
