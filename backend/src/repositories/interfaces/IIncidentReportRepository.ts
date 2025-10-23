/**
 * Incident Report Repository Interface
 * @description Repository interface for incident report entity operations
 * Extends base repository with incident report-specific methods
 */

import { IRepository } from './IRepository';

/**
 * Incident report entity type (matches database model)
 */
export interface IncidentReport {
  id: string;
  studentId: string;
  type: 'INJURY' | 'ILLNESS' | 'ALLERGIC_REACTION' | 'BEHAVIORAL' | 'ACCIDENT' | 'OTHER';
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  description: string;
  location: string;
  occurredAt: Date;
  reportedAt: Date;
  reportedById: string;
  witnessIds?: string[];
  actionsTaken: string;
  treatmentProvided?: string;
  parentNotified: boolean;
  parentNotificationDetails?: string;
  followUpRequired: boolean;
  followUpDetails?: string;
  followUpCompletedAt?: Date;
  attachments?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  resolvedById?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Incident report repository interface
 */
export interface IIncidentReportRepository extends IRepository<IncidentReport> {
  /**
   * Find all incident reports for a student
   * @param studentId - Student ID
   * @param options - Query options
   * @returns Promise resolving to student's incident reports
   */
  findByStudent(studentId: string, options?: IncidentReportQueryOptions): Promise<IncidentReport[]>;

  /**
   * Find incident reports by severity
   * @param severity - Severity level
   * @param filters - Additional filters
   * @returns Promise resolving to reports of specified severity
   */
  findBySeverity(severity: IncidentReport['severity'], filters?: IncidentReportFilters): Promise<IncidentReport[]>;

  /**
   * Find incident reports by type
   * @param type - Incident type
   * @param filters - Additional filters
   * @returns Promise resolving to reports of specified type
   */
  findByType(type: IncidentReport['type'], filters?: IncidentReportFilters): Promise<IncidentReport[]>;

  /**
   * Find incident reports by status
   * @param status - Report status
   * @param filters - Additional filters
   * @returns Promise resolving to reports with specified status
   */
  findByStatus(status: IncidentReport['status'], filters?: IncidentReportFilters): Promise<IncidentReport[]>;

  /**
   * Find incident reports requiring follow-up
   * @param beforeDate - Optional date cutoff
   * @returns Promise resolving to reports needing follow-up
   */
  findRequiringFollowUp(beforeDate?: Date): Promise<IncidentReport[]>;

  /**
   * Find incident reports by reporter
   * @param reporterId - Reporter user ID
   * @param options - Query options
   * @returns Promise resolving to reports created by user
   */
  findByReporter(reporterId: string, options?: IncidentReportQueryOptions): Promise<IncidentReport[]>;

  /**
   * Find incident reports by date range
   * @param startDate - Range start date
   * @param endDate - Range end date
   * @param filters - Additional filters
   * @returns Promise resolving to reports in range
   */
  findByDateRange(startDate: Date, endDate: Date, filters?: IncidentReportFilters): Promise<IncidentReport[]>;

  /**
   * Find recent incident reports
   * @param limit - Maximum number of reports
   * @param filters - Optional filters
   * @returns Promise resolving to recent reports
   */
  findRecent(limit?: number, filters?: IncidentReportFilters): Promise<IncidentReport[]>;

  /**
   * Find unresolved incident reports
   * @param filters - Optional filters
   * @returns Promise resolving to open/in-progress reports
   */
  findUnresolved(filters?: IncidentReportFilters): Promise<IncidentReport[]>;

  /**
   * Get incident statistics by type
   * @param startDate - Statistics start date
   * @param endDate - Statistics end date
   * @returns Promise resolving to statistics by type
   */
  getStatisticsByType(startDate: Date, endDate: Date): Promise<IncidentTypeStatistics[]>;

  /**
   * Get incident statistics by severity
   * @param startDate - Statistics start date
   * @param endDate - Statistics end date
   * @returns Promise resolving to statistics by severity
   */
  getStatisticsBySeverity(startDate: Date, endDate: Date): Promise<IncidentSeverityStatistics[]>;

  /**
   * Count incidents by student
   * @param studentId - Student ID
   * @returns Promise resolving to incident count
   */
  countByStudent(studentId: string): Promise<number>;

  /**
   * Find incidents at location
   * @param location - Location name or ID
   * @param filters - Optional filters
   * @returns Promise resolving to incidents at location
   */
  findByLocation(location: string, filters?: IncidentReportFilters): Promise<IncidentReport[]>;
}

/**
 * Filters for incident report queries
 */
export interface IncidentReportFilters {
  studentId?: string;
  type?: IncidentReport['type'] | IncidentReport['type'][];
  severity?: IncidentReport['severity'] | IncidentReport['severity'][];
  status?: IncidentReport['status'] | IncidentReport['status'][];
  reportedById?: string;
  occurredFrom?: Date;
  occurredTo?: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  location?: string;
}

/**
 * Query options for incident reports
 */
export interface IncidentReportQueryOptions {
  page?: number;
  limit?: number;
  includeStudent?: boolean;
  includeReporter?: boolean;
  includeWitnesses?: boolean;
  orderBy?: 'occurredAt' | 'reportedAt' | 'severity' | 'createdAt';
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Incident type statistics
 */
export interface IncidentTypeStatistics {
  type: IncidentReport['type'];
  count: number;
  percentage: number;
}

/**
 * Incident severity statistics
 */
export interface IncidentSeverityStatistics {
  severity: IncidentReport['severity'];
  count: number;
  percentage: number;
}

/**
 * Data for creating a new incident report
 */
export interface CreateIncidentReportData {
  studentId: string;
  type: IncidentReport['type'];
  severity: IncidentReport['severity'];
  description: string;
  location: string;
  occurredAt: Date;
  reportedById: string;
  witnessIds?: string[];
  actionsTaken: string;
  treatmentProvided?: string;
  parentNotified: boolean;
  parentNotificationDetails?: string;
  followUpRequired: boolean;
  followUpDetails?: string;
  attachments?: string[];
}

/**
 * Data for updating an incident report
 */
export interface UpdateIncidentReportData extends Partial<CreateIncidentReportData> {
  status?: IncidentReport['status'];
  resolution?: string;
  resolvedById?: string;
  resolvedAt?: Date;
  followUpCompletedAt?: Date;
}
