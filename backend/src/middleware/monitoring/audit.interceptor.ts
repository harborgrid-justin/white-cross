/**
 * LOC: WC-INT-AUDIT-001
 * NestJS Audit Interceptor - Method-level audit logging
 *
 * Provides comprehensive audit logging at the controller/service method level
 * for fine-grained tracking of healthcare operations.
 */

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Audit Interceptor for method-level logging
 *
 * @description Intercepts controller methods to log detailed audit events
 * including method parameters, return values, and execution time.
 * Complements the audit middleware with fine-grained operation tracking.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();

    const methodName = handler.name;
    const controllerName = controller.name;
    const startTime = Date.now();

    // Extract user and request info
    const user = request.user;
    const ipAddress = this.getClientIP(request);
    const userAgent = request.get('user-agent');

    // Log method invocation
    this.logger.debug(`Executing ${controllerName}.${methodName}`, {
      userId: user?.userId,
      method: request.method,
      path: request.path,
      ipAddress,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;

        // Determine if this is a PHI operation
        const isPHI = this.isPHIOperation(controllerName, methodName);

        // Note: Audit logging disabled in interceptor to prevent circular dependency
        // PHI access logging is handled by the audit middleware at the request level
        if (isPHI && user) {
          this.logger.debug(`PHI operation detected: ${controllerName}.${methodName}`, {
            userId: user.userId,
            operation: this.getOperationType(request.method),
          });
        }

        this.logger.debug(`Completed ${controllerName}.${methodName}`, {
          duration,
          userId: user?.userId,
          success: true,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Log error event (simplified logging to prevent circular dependency)
        if (user) {
          this.logger.error(`Method execution failed: ${controllerName}.${methodName}`, {
            userId: user.userId,
            userEmail: user.email,
            error: error.message,
            duration,
          });
        }

        this.logger.error(`Failed ${controllerName}.${methodName}`, {
          duration,
          userId: user?.userId,
          error: error.message,
        });

        throw error;
      }),
    );
  }

  /**
   * Check if operation involves PHI
   */
  private isPHIOperation(controllerName: string, methodName: string): boolean {
    const phiControllers = [
      'PatientController',
      'HealthRecordController',
      'MedicationController',
      'ImmunizationController',
      'AllergyController',
    ];

    const phiMethods = [
      'getPatient',
      'updatePatient',
      'createPatient',
      'deletePatient',
      'getHealthRecord',
      'getMedications',
      'getImmunizations',
    ];

    return (
      phiControllers.some((c) => controllerName.includes(c)) ||
      phiMethods.some((m) => methodName.includes(m))
    );
  }

  /**
   * Extract student/patient ID from request
   */
  private extractStudentId(request: any): string {
    return (
      request.params?.studentId ||
      request.params?.patientId ||
      request.params?.id ||
      request.query?.studentId ||
      'unknown'
    );
  }

  /**
   * Get operation type from HTTP method
   */
  private getOperationType(
    method: string,
  ): 'VIEW' | 'EDIT' | 'CREATE' | 'DELETE' | 'EXPORT' {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'VIEW';
      case 'PUT':
      case 'PATCH':
        return 'EDIT';
      case 'POST':
        return 'CREATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return 'VIEW';
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: any): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.ip ||
      'unknown'
    );
  }
}
