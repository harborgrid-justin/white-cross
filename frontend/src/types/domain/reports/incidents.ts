/**
 * Incident Statistics Report Types
 * 
 * Type definitions for incident tracking and analysis including:
 * - Incident reports and details
 * - Statistical breakdowns by type and severity
 * - Safety analytics and trends
 * - Compliance tracking
 */

import type { BaseEntity } from '../../core/common';
import type { DateRangeFilter } from './filters';

/**
 * Incident statistics with comprehensive metrics
 */
export interface IncidentStatistics {
  totalIncidents: number;
  incidentsByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  incidentsBySeverity: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    count: number;
    type: string;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

/**
 * Student information for incident reports
 */
export interface IncidentStudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
}

/**
 * Incident report detail
 */
export interface IncidentReport extends BaseEntity {
  studentId: string;
  student?: IncidentStudentInfo;
  type: string;
  severity: string;
  occurredAt: Date | string;
  location?: string;
  description: string;
  actionTaken?: string;
  parentNotified: boolean;
  notificationMethod?: string;
  notificationTime?: Date | string;
  followUpRequired: boolean;
  followUpNotes?: string;
  legalComplianceStatus: string;
  reportedBy: string;
  reportedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  witnesses?: string[];
  injuries?: string[];
  medicalAttentionRequired: boolean;
  medicalAttentionDetails?: string;
}

/**
 * Incident count by type
 */
export interface IncidentByType {
  type: string;
  count: number;
  percentage?: number;
}

/**
 * Incident count by severity
 */
export interface IncidentBySeverity {
  severity: string;
  count: number;
  percentage?: number;
}

/**
 * Monthly incident trend
 */
export interface MonthlyIncidentTrend {
  month: Date | string;
  type: string;
  count: number;
  change?: number;
  changePercentage?: number;
}

/**
 * Injury statistics by type and severity
 */
export interface InjuryStatistics {
  type: string;
  severity: string;
  count: number;
  percentage?: number;
}

/**
 * Parent notification statistics
 */
export interface NotificationStatistics {
  parentNotified: boolean;
  count: number;
  percentage?: number;
}

/**
 * Compliance statistics
 */
export interface ComplianceStatistics {
  legalComplianceStatus: string;
  count: number;
  percentage?: number;
}

/**
 * Incident statistics report aggregate data
 */
export interface IncidentStatisticsReport {
  incidents: IncidentReport[];
  incidentsByType: IncidentByType[];
  incidentsBySeverity: IncidentBySeverity[];
  incidentsByMonth: MonthlyIncidentTrend[];
  injuryStats: InjuryStatistics[];
  notificationStats: NotificationStatistics[];
  complianceStats: ComplianceStatistics[];
  totalIncidents: number;
  criticalIncidents?: number;
  averageResponseTime?: number;
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}
