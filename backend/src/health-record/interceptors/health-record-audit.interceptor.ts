/**
 * @fileoverview Health Record Audit Interceptor
 * @module health-record/interceptors
 * @description HIPAA-compliant audit interceptor for health record operations
 *
 * HIPAA CRITICAL - This interceptor creates audit trails for all PHI operations
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance 45 CFR 164.308(a)(1)(ii)(D) - Information access management
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BaseInterceptor } from '../../common/interceptors/base.interceptor';
import { PHIAccessLogger } from '../services/phi-access-logger.service';
import { HealthRecordRequest } from '../interfaces/health-record-types';

export interface AuditTrailEntry {
  correlationId: string;
  timestamp: Date;
  userId?: string;
  userRole?: string;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  operation: string;
  resourceId?: string;
  studentId?: string;
  phiAccessed: boolean;
  dataTypes: string[];
  success: boolean;
  errorMessage?: string;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  sessionId?: string;
  complianceLevel: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI';
}

/**
 * Health Record Audit Interceptor
 *
 * Creates comprehensive audit trails for all health record operations
 * with HIPAA compliance and correlation ID tracking
 */
@Injectable()
export class HealthRecordAuditInterceptor extends BaseInterceptor implements NestInterceptor {
  constructor(private readonly phiAccessLogger: PHIAccessLogger) {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<HealthRecordRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Generate correlation ID for request tracking using base class
    const correlationId = this.getOrGenerateRequestId(request);
    request.headers['x-correlation-id'] = correlationId;
    this.setRequestIdHeader(response, correlationId);

    // Extract audit context
    const auditContext = this.extractAuditContext(request, correlationId);

    // Log request start using base class
    this.logRequest('info', `PHI Operation Started: ${auditContext.method} ${auditContext.endpoint}`, {
      correlationId,
      operation: auditContext.operation,
      phiAccessed: auditContext.phiAccessed,
      complianceLevel: auditContext.complianceLevel,
    });

    return next.handle().pipe(
      tap((responseData) => {
        const responseTime = Date.now() - startTime;
        const auditEntry = this.createSuccessAuditEntry(
          auditContext,
          responseData,
          responseTime,
          response,
        );

        this.logAuditEntry(auditEntry);
        this.logPHIAccess(auditEntry, responseData);
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const auditEntry = this.createErrorAuditEntry(
          auditContext,
          error,
          responseTime,
        );

        this.logAuditEntry(auditEntry);
        this.logSecurityIncident(auditEntry, error);

        // Report to Sentry for PHI-related errors using base class
        if (auditContext.phiAccessed) {
          this.reportToSentry(error, {
            correlationId,
            operation: auditContext.operation,
            complianceLevel: auditContext.complianceLevel,
            tags: {
              operation: auditContext.operation,
              complianceLevel: auditContext.complianceLevel,
            },
          });
        }

        throw error;
      }),
    );
  }

  /**
   * Extract audit context from request
   */
  private extractAuditContext(
    request: HealthRecordRequest,
    correlationId: string,
  ): Partial<AuditTrailEntry> {
    const studentId = this.extractStudentId(request);
    const resourceId = this.extractResourceId(request);
    const operation = this.determineOperation(request);
    const complianceLevel = this.determineComplianceLevel(request, operation);

    return {
      correlationId,
      timestamp: new Date(),
      userId: request.user?.id, // Assumes authentication middleware sets user
      userRole: request.user?.role,
      ipAddress: this.getClientIp(request),
      userAgent: request.get('user-agent') || 'Unknown',
      endpoint: request.originalUrl,
      method: request.method,
      operation,
      resourceId,
      studentId,
      sessionId: request.sessionID,
      requestSize: this.calculateRequestSize(request),
      complianceLevel,
      phiAccessed:
        complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI',
      dataTypes: this.identifyDataTypes(request, operation),
    };
  }

  /**
   * Create successful operation audit entry
   */
  private createSuccessAuditEntry(
    context: Partial<AuditTrailEntry>,
    responseData: any,
    responseTime: number,
    response: Response,
  ): AuditTrailEntry {
    return {
      ...context,
      success: true,
      responseTime,
      responseSize: this.calculateResponseSize(responseData),
    } as AuditTrailEntry;
  }

  /**
   * Create error operation audit entry
   */
  private createErrorAuditEntry(
    context: Partial<AuditTrailEntry>,
    error: any,
    responseTime: number,
  ): AuditTrailEntry {
    return {
      ...context,
      success: false,
      errorMessage: error.message || 'Unknown error',
      responseTime,
      responseSize: 0,
    } as AuditTrailEntry;
  }

  /**
   * Log comprehensive audit entry
   */
  private logAuditEntry(entry: AuditTrailEntry): void {
    const logLevel = entry.success ? 'log' : 'error';
    const prefix = entry.phiAccessed ? 'PHI_AUDIT' : 'AUDIT';

    this.logger[logLevel](
      `[${prefix}][${entry.correlationId}] ` +
        `${entry.operation} - User: ${entry.userId || 'Anonymous'} ` +
        `(${entry.userRole || 'Unknown'}) - IP: ${entry.ipAddress} - ` +
        `Student: ${entry.studentId || 'N/A'} - ` +
        `Success: ${entry.success} - ` +
        `Response Time: ${entry.responseTime}ms - ` +
        `Data Types: [${entry.dataTypes.join(', ')}] - ` +
        `Compliance: ${entry.complianceLevel}` +
        (entry.errorMessage ? ` - Error: ${entry.errorMessage}` : ''),
    );

    // Store structured audit entry for compliance reporting
    this.storeAuditEntry(entry);
  }

  /**
   * Log PHI access with enhanced details
   */
  private logPHIAccess(entry: AuditTrailEntry, responseData: any): void {
    if (!entry.phiAccessed) return;

    const phiDetails = this.extractPHIDetails(responseData, entry.operation);

    this.phiAccessLogger.logPHIAccess({
      correlationId: entry.correlationId,
      timestamp: entry.timestamp,
      userId: entry.userId,
      studentId: entry.studentId,
      operation: entry.operation,
      dataTypes: entry.dataTypes,
      recordCount: phiDetails.recordCount,
      sensitivityLevel: entry.complianceLevel,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      success: entry.success,
    });
  }

  /**
   * Log security incidents for failed PHI access
   */
  private logSecurityIncident(entry: AuditTrailEntry, error: any): void {
    if (!entry.phiAccessed) return;

    this.logger.warn(
      `[SECURITY_INCIDENT][${entry.correlationId}] ` +
        `Failed PHI access attempt - User: ${entry.userId || 'Anonymous'} ` +
        `- IP: ${entry.ipAddress} - Operation: ${entry.operation} ` +
        `- Student: ${entry.studentId || 'N/A'} ` +
        `- Error: ${error.message}`,
    );

    // Could integrate with security monitoring system here
    this.phiAccessLogger.logSecurityIncident({
      correlationId: entry.correlationId,
      timestamp: entry.timestamp,
      incidentType: 'FAILED_PHI_ACCESS',
      userId: entry.userId,
      ipAddress: entry.ipAddress,
      operation: entry.operation,
      errorMessage: error.message,
      severity: 'HIGH',
    });
  }

  /**
   * Extract student ID from request
   */
  private extractStudentId(request: HealthRecordRequest): string | undefined {
    return (
      request.params?.studentId ||
      request.body?.studentId ||
      (request.query?.studentId as string)
    );
  }

  /**
   * Extract resource ID from request
   */
  private extractResourceId(request: HealthRecordRequest): string | undefined {
    return request.params?.id || request.params?.recordId;
  }

  /**
   * Determine operation type from request
   */
  private determineOperation(request: HealthRecordRequest): string {
    const method = request.method;
    const path = request.route?.path || request.originalUrl;

    if (path.includes('/summary')) return 'GET_HEALTH_SUMMARY';
    if (path.includes('/export')) return 'EXPORT_HEALTH_DATA';
    if (path.includes('/import')) return 'IMPORT_HEALTH_DATA';
    if (path.includes('/search')) return 'SEARCH_HEALTH_RECORDS';
    if (path.includes('/allergies')) return `${method}_ALLERGY_DATA`;
    if (path.includes('/vaccinations')) return `${method}_VACCINATION_DATA`;
    if (path.includes('/conditions')) return `${method}_CHRONIC_CONDITION_DATA`;
    if (path.includes('/vitals')) return `${method}_VITAL_SIGNS_DATA`;

    switch (method) {
      case 'GET':
        return 'READ_HEALTH_RECORD';
      case 'POST':
        return 'CREATE_HEALTH_RECORD';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE_HEALTH_RECORD';
      case 'DELETE':
        return 'DELETE_HEALTH_RECORD';
      default:
        return 'UNKNOWN_OPERATION';
    }
  }

  /**
   * Determine HIPAA compliance level
   */
  private determineComplianceLevel(
    request: HealthRecordRequest,
    operation: string,
  ): AuditTrailEntry['complianceLevel'] {
    // Public endpoints (no PHI)
    if (request.originalUrl.includes('/public')) return 'PUBLIC';

    // Sensitive PHI operations
    const sensitivePHIOperations = [
      'EXPORT_HEALTH_DATA',
      'GET_HEALTH_SUMMARY',
      'SEARCH_HEALTH_RECORDS',
    ];

    if (sensitivePHIOperations.includes(operation)) return 'SENSITIVE_PHI';

    // Regular PHI operations
    const phiOperations = [
      'READ_HEALTH_RECORD',
      'CREATE_HEALTH_RECORD',
      'UPDATE_HEALTH_RECORD',
      'DELETE_HEALTH_RECORD',
      'GET_ALLERGY_DATA',
      'POST_ALLERGY_DATA',
      'GET_VACCINATION_DATA',
      'POST_VACCINATION_DATA',
    ];

    if (phiOperations.includes(operation)) return 'PHI';

    return 'INTERNAL';
  }

  /**
   * Identify data types being accessed
   */
  private identifyDataTypes(
    request: HealthRecordRequest,
    operation: string,
  ): string[] {
    const dataTypes: string[] = [];
    const path = request.originalUrl.toLowerCase();

    if (path.includes('health-record') || operation.includes('HEALTH_RECORD')) {
      dataTypes.push('HEALTH_RECORDS');
    }
    if (path.includes('allerg') || operation.includes('ALLERGY')) {
      dataTypes.push('ALLERGIES');
    }
    if (path.includes('vaccination') || operation.includes('VACCINATION')) {
      dataTypes.push('VACCINATIONS');
    }
    if (path.includes('condition') || operation.includes('CONDITION')) {
      dataTypes.push('CHRONIC_CONDITIONS');
    }
    if (path.includes('vitals') || operation.includes('VITAL')) {
      dataTypes.push('VITAL_SIGNS');
    }
    if (path.includes('summary')) {
      dataTypes.push('COMPREHENSIVE_SUMMARY');
    }

    return dataTypes.length > 0 ? dataTypes : ['GENERAL_PHI'];
  }

  /**
   * Extract PHI details from response
   */
  private extractPHIDetails(
    responseData: any,
    operation: string,
  ): {
    recordCount: number;
    hasAllergies: boolean;
    hasVaccinations: boolean;
    hasConditions: boolean;
  } {
    if (!responseData)
      return {
        recordCount: 0,
        hasAllergies: false,
        hasVaccinations: false,
        hasConditions: false,
      };

    let recordCount = 0;
    let hasAllergies = false;
    let hasVaccinations = false;
    let hasConditions = false;

    // Handle different response structures
    if (Array.isArray(responseData)) {
      recordCount = responseData.length;
    } else if (responseData.records && Array.isArray(responseData.records)) {
      recordCount = responseData.records.length;
    } else if (responseData.pagination) {
      recordCount = responseData.pagination.total || 0;
    } else if (responseData) {
      recordCount = 1;
    }

    // Check for specific data types
    if (responseData.allergies) hasAllergies = true;
    if (responseData.vaccinations || responseData.recentVaccinations)
      hasVaccinations = true;
    if (responseData.chronicConditions || responseData.conditions)
      hasConditions = true;

    return { recordCount, hasAllergies, hasVaccinations, hasConditions };
  }

  /**
   * Store audit entry for compliance reporting
   */
  private storeAuditEntry(entry: AuditTrailEntry): void {
    // In a real implementation, this would store to a secure audit database
    // with encryption and tamper protection
    this.logger.debug(
      `[AUDIT_STORE][${entry.correlationId}] Storing audit entry for compliance reporting`,
    );

    // Could integrate with:
    // - Dedicated audit database
    // - SIEM system
    // - Compliance reporting system
    // - Blockchain for tamper-proof audit trails
  }
}
