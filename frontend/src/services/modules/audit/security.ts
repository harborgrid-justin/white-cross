/**
 * @fileoverview Security Analysis and Anomaly Detection Operations
 * @module services/modules/audit/security
 * @category Services - Security Monitoring
 *
 * Security monitoring, anomaly detection, and threat analysis.
 * Provides real-time security incident detection, suspicious activity tracking,
 * and automated security recommendations.
 *
 * Security Monitoring Features:
 * - Real-time security incident detection
 * - Failed authentication attempt tracking
 * - Suspicious activity pattern recognition
 * - Privilege escalation detection
 * - Data exfiltration monitoring
 * - Geographic access anomaly detection
 *
 * Anomaly Detection:
 * - Unusual access patterns (time, volume, location)
 * - Unauthorized resource access attempts
 * - Privilege abuse detection
 * - Data download anomalies
 * - Session hijacking indicators
 * - Multi-severity classification (LOW, MEDIUM, HIGH, CRITICAL)
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import type { SecurityAnalysis, Anomaly } from './types';

/**
 * Security Analysis Service
 * Manages security monitoring and anomaly detection
 */
export class SecurityAnalysisService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get security analysis results
   * Retrieves latest security analysis with detected anomalies and recommendations
   *
   * @param params - Optional date range for analysis
   * @returns Security analysis results
   */
  async getSecurityAnalysis(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SecurityAnalysis> {
    const response = await this.client.get<ApiResponse<SecurityAnalysis>>(
      '/audit/security-analysis',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Run security analysis
   * Triggers a new security analysis on audit logs within the specified date range
   *
   * @param params - Optional date range for analysis
   * @returns Security analysis results
   */
  async runSecurityAnalysis(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SecurityAnalysis> {
    const response = await this.client.post<ApiResponse<SecurityAnalysis>>(
      '/audit/security-analysis/run',
      params
    );
    return response.data.data!;
  }

  /**
   * Get security anomalies
   * Retrieves detected security anomalies with optional filtering
   *
   * @param params - Optional filters for anomalies (resolved status, severity, date range)
   * @returns Array of security anomalies
   */
  async getAnomalies(params?: {
    resolved?: boolean;
    severity?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Anomaly[]> {
    const response = await this.client.get<ApiResponse<Anomaly[]>>(
      '/audit/anomalies',
      { params }
    );
    return response.data.data || [];
  }
}
