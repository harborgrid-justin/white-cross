/**
 * @fileoverview Production-Grade Error Handling Framework
 * @module backend/src/common/errors/production-error-handler
 * @description Enterprise error handling with structured error types, recovery mechanisms,
 * error aggregation, reporting, and comprehensive error context tracking
 *
 * Integrated from: reuse/data/production-error-handling.ts
 * Healthcare Context: Medical data requires robust error handling for patient safety
 */

import {
  Injectable,
  Logger,
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as winston from 'winston';

// ============================================================================
// HEALTHCARE-SPECIFIC ERROR TYPES
// ============================================================================

/**
 * Base error class with comprehensive healthcare context
 */
export abstract class HealthcareError extends Error {
  public readonly timestamp: Date;
  public readonly errorId: string;
  public readonly context: HealthcareErrorContext;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly retryable: boolean;
  public readonly patientImpact: PatientImpactLevel;

  constructor(
    message: string,
    context: Partial<HealthcareErrorContext> = {},
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    category: ErrorCategory = ErrorCategory.APPLICATION,
    retryable: boolean = false,
    patientImpact: PatientImpactLevel = PatientImpactLevel.NONE,
  ) {
    super(message);
    this.name = (this.constructor as any).name;
    this.timestamp = new Date();
    this.errorId = this.generateErrorId();
    this.context = { ...this.getDefaultContext(), ...context };
    this.severity = severity;
    this.category = category;
    this.retryable = retryable;
    this.patientImpact = patientImpact;

    // Maintain stack trace
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private getDefaultContext(): HealthcareErrorContext {
    return {
      service: 'white-cross-backend',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeId: process.env.NODE_ID || 'unknown',
      facilityId: 'default',
    };
  }

  /**
   * Converts error to structured log format with healthcare context
   */
  toLogFormat(): HealthcareErrorLogEntry {
    return {
      errorId: this.errorId,
      timestamp: this.timestamp,
      name: this.name,
      message: this.message,
      stack: this.stack,
      context: this.context,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      patientImpact: this.patientImpact,
    };
  }

  /**
   * Converts error to API response format (sanitized for patient data)
   */
  toApiFormat(includeStack: boolean = false): HealthcareApiErrorResponse {
    return {
      error: {
        id: this.errorId,
        type: this.name,
        message: this.message,
        code: this.getErrorCode(),
        timestamp: this.timestamp.toISOString(),
        context: this.sanitizeContext(),
        patientImpact: this.patientImpact,
        ...(includeStack && { stack: this.stack }),
      },
    };
  }

  protected abstract getErrorCode(): string;

  private sanitizeContext(): Partial<HealthcareErrorContext> {
    const { patientId, sensitiveData, ...safeContext } = this.context;
    // Only include patient ID if explicitly allowed
    if (process.env.NODE_ENV === 'development') {
      safeContext.patientId = patientId;
    }
    return safeContext;
  }
}

/**
 * Medical data validation errors
 */
export class MedicalDataError extends HealthcareError {
  public readonly dataType: string;
  public readonly validationRule: string;

  constructor(
    message: string,
    dataType: string,
    validationRule: string,
    context: Partial<HealthcareErrorContext> = {},
    patientImpact: PatientImpactLevel = PatientImpactLevel.LOW,
  ) {
    super(message, context, ErrorSeverity.ERROR, ErrorCategory.MEDICAL_DATA, false, patientImpact);
    this.dataType = dataType;
    this.validationRule = validationRule;
  }

  protected getErrorCode(): string {
    return 'MEDICAL_DATA_ERROR';
  }
}

/**
 * Patient safety critical errors
 */
export class PatientSafetyError extends HealthcareError {
  public readonly safetyRule: string;
  public readonly alertRequired: boolean;

  constructor(
    message: string,
    safetyRule: string,
    context: Partial<HealthcareErrorContext> = {},
    alertRequired: boolean = true,
  ) {
    super(
      message,
      context,
      ErrorSeverity.CRITICAL,
      ErrorCategory.PATIENT_SAFETY,
      false,
      PatientImpactLevel.HIGH,
    );
    this.safetyRule = safetyRule;
    this.alertRequired = alertRequired;
  }

  protected getErrorCode(): string {
    return 'PATIENT_SAFETY_ERROR';
  }
}

/**
 * HIPAA compliance errors
 */
export class HIPAAComplianceError extends HealthcareError {
  public readonly complianceRule: string;
  public readonly auditRequired: boolean;

  constructor(
    message: string,
    complianceRule: string,
    context: Partial<HealthcareErrorContext> = {},
    auditRequired: boolean = true,
  ) {
    super(
      message,
      context,
      ErrorSeverity.CRITICAL,
      ErrorCategory.COMPLIANCE,
      false,
      PatientImpactLevel.MEDIUM,
    );
    this.complianceRule = complianceRule;
    this.auditRequired = auditRequired;
  }

  protected getErrorCode(): string {
    return 'HIPAA_COMPLIANCE_ERROR';
  }
}

/**
 * Clinical workflow errors
 */
export class ClinicalWorkflowError extends HealthcareError {
  public readonly workflowStage: string;
  public readonly blockingOperation: boolean;

  constructor(
    message: string,
    workflowStage: string,
    context: Partial<HealthcareErrorContext> = {},
    blockingOperation: boolean = false,
  ) {
    super(
      message,
      context,
      blockingOperation ? ErrorSeverity.CRITICAL : ErrorSeverity.ERROR,
      ErrorCategory.CLINICAL_WORKFLOW,
      true,
      blockingOperation ? PatientImpactLevel.HIGH : PatientImpactLevel.LOW,
    );
    this.workflowStage = workflowStage;
    this.blockingOperation = blockingOperation;
  }

  protected getErrorCode(): string {
    return 'CLINICAL_WORKFLOW_ERROR';
  }
}

/**
 * Integration errors with healthcare systems
 */
export class HealthcareIntegrationError extends HealthcareError {
  public readonly system: string;
  public readonly endpoint?: string;
  public readonly httpStatus?: number;

  constructor(
    message: string,
    system: string,
    context: Partial<HealthcareErrorContext> & { endpoint?: string; httpStatus?: number } = {},
    patientImpact: PatientImpactLevel = PatientImpactLevel.MEDIUM,
  ) {
    super(
      message,
      context,
      ErrorSeverity.ERROR,
      ErrorCategory.HEALTHCARE_INTEGRATION,
      true,
      patientImpact,
    );
    this.system = system;
    this.endpoint = context.endpoint;
    this.httpStatus = context.httpStatus;
  }

  protected getErrorCode(): string {
    return 'HEALTHCARE_INTEGRATION_ERROR';
  }
}

// ============================================================================
// INTERFACES AND ENUMS
// ============================================================================

export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  FATAL = 'fatal',
}

export enum ErrorCategory {
  APPLICATION = 'application',
  MEDICAL_DATA = 'medical_data',
  PATIENT_SAFETY = 'patient_safety',
  COMPLIANCE = 'compliance',
  CLINICAL_WORKFLOW = 'clinical_workflow',
  HEALTHCARE_INTEGRATION = 'healthcare_integration',
  DATABASE = 'database',
  VALIDATION = 'validation',
  SECURITY = 'security',
  CONFIGURATION = 'configuration',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

export enum PatientImpactLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface HealthcareErrorContext {
  userId?: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  appointmentId?: string;
  medicalRecordId?: string;
  requestId?: string;
  traceId?: string;
  service?: string;
  version?: string;
  environment?: string;
  nodeId?: string;
  operation?: string;
  resource?: string;
  clinicalContext?: {
    department?: string;
    specialty?: string;
    urgencyLevel?: 'routine' | 'urgent' | 'emergency';
  };
  additionalData?: Record<string, any>;
  sensitiveData?: Record<string, any>;
}

export interface HealthcareErrorLogEntry {
  errorId: string;
  timestamp: Date;
  name: string;
  message: string;
  stack?: string;
  context: HealthcareErrorContext;
  severity: ErrorSeverity;
  category: ErrorCategory;
  retryable: boolean;
  patientImpact: PatientImpactLevel;
}

export interface HealthcareApiErrorResponse {
  error: {
    id: string;
    type: string;
    message: string;
    code: string;
    timestamp: string;
    context: Partial<HealthcareErrorContext>;
    patientImpact: PatientImpactLevel;
    stack?: string;
  };
}

// ============================================================================
// ERROR RECOVERY MECHANISMS
// ============================================================================

/**
 * Healthcare-specific recovery strategy for clinical systems
 */
@Injectable()
export class ClinicalSystemRecoveryStrategy {
  private readonly logger = new Logger('ClinicalSystemRecoveryStrategy');

  canRecover(error: HealthcareError): boolean {
    // Never retry patient safety or compliance errors
    if (
      error.category === ErrorCategory.PATIENT_SAFETY ||
      error.category === ErrorCategory.COMPLIANCE
    ) {
      return false;
    }

    return error.retryable && error.patientImpact !== PatientImpactLevel.CRITICAL;
  }

  async recover(error: HealthcareError): Promise<void> {
    this.logger.warn(`Attempting clinical system recovery for error: ${error.errorId}`);

    if (error instanceof HealthcareIntegrationError) {
      await this.recoverIntegrationConnection(error.system);
    }

    if (error instanceof ClinicalWorkflowError && !error.blockingOperation) {
      await this.resumeWorkflow(error.workflowStage);
    }
  }

  private async recoverIntegrationConnection(system: string): Promise<void> {
    this.logger.log(`Attempting to recover connection to ${system}`);
    // Implementation would handle system-specific recovery
  }

  private async resumeWorkflow(workflowStage: string): Promise<void> {
    this.logger.log(`Attempting to resume workflow at stage: ${workflowStage}`);
    // Implementation would handle workflow resumption
  }
}

// ============================================================================
// HEALTHCARE ERROR AGGREGATION
// ============================================================================

@Injectable()
export class HealthcareErrorAggregationService {
  private readonly logger = new Logger('HealthcareErrorAggregationService');
  private readonly errorsByPatient = new Map<string, HealthcareErrorLogEntry[]>();
  private readonly errorsByProvider = new Map<string, HealthcareErrorLogEntry[]>();
  private readonly criticalErrors: HealthcareErrorLogEntry[] = [];

  recordError(error: HealthcareError): void {
    const logEntry = error.toLogFormat();

    // Track by patient if patient context exists
    if (logEntry.context.patientId) {
      this.addToPatientErrors(logEntry.context.patientId, logEntry);
    }

    // Track by provider if provider context exists
    if (logEntry.context.providerId) {
      this.addToProviderErrors(logEntry.context.providerId, logEntry);
    }

    // Track critical errors
    if (
      logEntry.patientImpact === PatientImpactLevel.HIGH ||
      logEntry.patientImpact === PatientImpactLevel.CRITICAL
    ) {
      this.criticalErrors.push(logEntry);
      this.alertClinicalStaff(logEntry);
    }

    // Check for patient safety patterns
    this.analyzePatientSafetyPatterns(logEntry);
  }

  private addToPatientErrors(patientId: string, error: HealthcareErrorLogEntry): void {
    if (!this.errorsByPatient.has(patientId)) {
      this.errorsByPatient.set(patientId, []);
    }
    this.errorsByPatient.get(patientId).push(error);
  }

  private addToProviderErrors(providerId: string, error: HealthcareErrorLogEntry): void {
    if (!this.errorsByProvider.has(providerId)) {
      this.errorsByProvider.set(providerId, []);
    }
    this.errorsByProvider.get(providerId).push(error);
  }

  private alertClinicalStaff(error: HealthcareErrorLogEntry): void {
    this.logger.error(`CRITICAL HEALTHCARE ERROR - Patient Impact: ${error.patientImpact}`, {
      errorId: error.errorId,
      patientId: error.context.patientId,
    });
    // Implementation would send alerts to clinical staff
  }

  private analyzePatientSafetyPatterns(error: HealthcareErrorLogEntry): void {
    if (error.context.patientId) {
      const patientErrors = this.errorsByPatient.get(error.context.patientId) || [];

      // Check for multiple errors for same patient
      if (patientErrors.length > 3) {
        this.logger.warn(`Multiple errors detected for patient ${error.context.patientId}`, {
          errorCount: patientErrors.length,
        });
      }
    }
  }

  getCriticalErrors(): HealthcareErrorLogEntry[] {
    return [...this.criticalErrors];
  }

  getPatientErrors(patientId: string): HealthcareErrorLogEntry[] {
    return this.errorsByPatient.get(patientId) || [];
  }
}

// ============================================================================
// MAIN HEALTHCARE ERROR HANDLER
// ============================================================================

@Injectable()
export class HealthcareErrorHandler {
  private readonly logger = new Logger('HealthcareErrorHandler');
  private readonly winstonLogger: winston.Logger;

  constructor(
    private readonly aggregationService: HealthcareErrorAggregationService,
    private readonly recoveryStrategy: ClinicalSystemRecoveryStrategy,
  ) {
    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'healthcare-errors.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'patient-safety-errors.log',
          level: 'error',
          // Only log patient safety errors
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format((info) => {
              return info.category === ErrorCategory.PATIENT_SAFETY ? info : false;
            })(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  async handleError(
    error: Error | HealthcareError,
    context: Partial<HealthcareErrorContext> = {},
  ): Promise<void> {
    const startTime = Date.now();
    const structuredError = this.ensureHealthcareError(error, context);

    try {
      // Log the error with healthcare context
      this.logHealthcareError(structuredError);

      // Record for aggregation and analysis
      this.aggregationService.recordError(structuredError);

      // Attempt recovery if safe and appropriate
      const recoveryAttempted = await this.attemptRecovery(structuredError);

      // Handle compliance requirements
      await this.handleComplianceRequirements(structuredError);

      const duration = Date.now() - startTime;
      this.logger.debug(`Error handling completed in ${duration}ms`);
    } catch (handlingError) {
      this.logger.error(
        `Error occurred while handling healthcare error ${structuredError.errorId}`,
        handlingError,
      );
    }
  }

  private ensureHealthcareError(
    error: Error | HealthcareError,
    context: Partial<HealthcareErrorContext> = {},
  ): HealthcareError {
    if (error instanceof HealthcareError) {
      return error;
    }

    // Convert standard errors to healthcare errors based on context
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return new MedicalDataError(
        error.message,
        'unknown',
        'general_validation',
        context,
        PatientImpactLevel.LOW,
      );
    }

    // Default to clinical workflow error
    return new ClinicalWorkflowError(error.message, 'unknown_stage', context, false);
  }

  private logHealthcareError(error: HealthcareError): void {
    const logEntry = error.toLogFormat();

    // Use appropriate log level based on patient impact
    switch (error.patientImpact) {
      case PatientImpactLevel.CRITICAL:
      case PatientImpactLevel.HIGH:
        this.winstonLogger.error(logEntry);
        break;
      case PatientImpactLevel.MEDIUM:
        this.winstonLogger.warn(logEntry);
        break;
      default:
        this.winstonLogger.info(logEntry);
    }
  }

  private async attemptRecovery(error: HealthcareError): Promise<boolean> {
    if (!this.recoveryStrategy.canRecover(error)) {
      return false;
    }

    try {
      await this.recoveryStrategy.recover(error);
      this.logger.log(`Recovery successful for error: ${error.errorId}`);
      return true;
    } catch (recoveryError) {
      this.logger.error(`Recovery failed for error: ${error.errorId}`, recoveryError);
      return false;
    }
  }

  private async handleComplianceRequirements(error: HealthcareError): Promise<void> {
    if (error instanceof HIPAAComplianceError && error.auditRequired) {
      // Log to compliance audit trail
      this.winstonLogger.error('HIPAA_COMPLIANCE_VIOLATION', error.toLogFormat());
    }

    if (error instanceof PatientSafetyError && error.alertRequired) {
      // Trigger immediate patient safety alerts
      this.logger.error('PATIENT_SAFETY_ALERT', {
        errorId: error.errorId,
        safetyRule: error.safetyRule,
      });
    }
  }

  createSafeApiResponse(error: Error | HealthcareError): HealthcareApiErrorResponse {
    const healthcareError = this.ensureHealthcareError(error);
    return healthcareError.toApiFormat(process.env.NODE_ENV === 'development');
  }
}

// ============================================================================
// NESTJS EXCEPTION FILTER
// ============================================================================

@Catch()
export class HealthcareExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorHandler: HealthcareErrorHandler) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception instanceof Error ? exception : new Error(String(exception));
    const context: HealthcareErrorContext = {
      requestId: request.headers['x-request-id'] as string,
      userId: (request as any).user?.id,
      patientId: (request as any).patientId || request.params?.patientId,
      providerId: (request as any).user?.providerId,
      facilityId: (request as any).user?.facilityId || 'default',
      operation: `${request.method} ${request.path}`,
      clinicalContext: {
        department: request.headers['x-department'] as string,
        specialty: request.headers['x-specialty'] as string,
        urgencyLevel: (request.headers['x-urgency'] as any) || 'routine',
      },
      additionalData: {
        userAgent: request.headers['user-agent'],
        ip: request.ip,
        query: request.query,
      },
    };

    await this.errorHandler.handleError(error, context);

    const apiResponse = this.errorHandler.createSafeApiResponse(error);
    const statusCode = this.getHttpStatusCode(exception);

    response.status(statusCode).json(apiResponse);
  }

  private getHttpStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (exception instanceof MedicalDataError) {
      return HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof PatientSafetyError) {
      return HttpStatus.FORBIDDEN;
    }

    if (exception instanceof HIPAAComplianceError) {
      return HttpStatus.FORBIDDEN;
    }

    if (exception instanceof HealthcareIntegrationError) {
      return HttpStatus.BAD_GATEWAY;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

// ============================================================================
// FACTORY AND HELPERS
// ============================================================================

export function createHealthcareErrorHandler(): HealthcareErrorHandler {
  const aggregationService = new HealthcareErrorAggregationService();
  const recoveryStrategy = new ClinicalSystemRecoveryStrategy();
  return new HealthcareErrorHandler(aggregationService, recoveryStrategy);
}

export function HandleHealthcareErrors(context?: Partial<HealthcareErrorContext>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const errorHandler = createHealthcareErrorHandler();

      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        await errorHandler.handleError(error as Error, {
          ...context,
          operation: `${target.constructor.name}.${propertyKey}`,
        });
        throw error;
      }
    };

    return descriptor;
  };
}
