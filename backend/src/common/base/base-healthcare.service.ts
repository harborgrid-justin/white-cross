/**
 * Base Healthcare Service - HIPAA-compliant service operations
 * 
 * Extends BaseCrudService with healthcare-specific functionality including
 * PHI audit logging, compliance validation, and healthcare domain patterns.
 */
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Model } from 'sequelize';
import { BaseCrudService, CrudOperationResult } from './base-crud.service';

export interface PHIAccessContext {
  userId: string;
  userRole: string;
  accessReason: string;
  timestamp: Date;
}

export interface HealthcareValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

@Injectable()
export abstract class BaseHealthcareService<T extends Model> extends BaseCrudService<T> {
  protected readonly PHI_FIELDS = [
    'firstName', 'lastName', 'dateOfBirth', 'socialSecurityNumber',
    'medicalRecordNumber', 'diagnosis', 'medication', 'allergies',
    'address', 'phoneNumber', 'email', 'emergencyContact'
  ];

  constructor(context?: string) {
    super(context);
  }

  /**
   * Create healthcare entity with PHI audit logging
   */
  protected async createHealthcareEntity(
    data: Partial<T>,
    accessContext: PHIAccessContext,
    options: any = {}
  ): Promise<CrudOperationResult<T>> {
    return this.executeWithLogging(
      'create healthcare entity',
      async () => {
        // Validate healthcare data
        const validation = this.validateHealthcareData(data);
        if (!validation.isValid) {
          throw new ForbiddenException(`Healthcare validation failed: ${validation.errors.join(', ')}`);
        }

        // Log PHI access
        this.logPHIAccess('CREATE', accessContext, data);

        // Create entity
        const result = await this.createEntity(data, options);

        // Additional healthcare-specific logging
        this.logInfo(
          `PHI Created: Healthcare entity ${this.model.name} created by user ${accessContext.userId}`,
          'PHI_ACCESS'
        );

        return result;
      }
    );
  }

  /**
   * Find healthcare entity with PHI audit logging
   */
  protected async findHealthcareEntityById(
    id: string,
    accessContext: PHIAccessContext,
    options: any = {}
  ): Promise<CrudOperationResult<T>> {
    return this.executeWithLogging(
      'find healthcare entity',
      async () => {
        // Log PHI access
        this.logPHIAccess('READ', accessContext, { entityId: id });

        const result = await this.findEntityById(id, options);

        // Log successful PHI access
        if (result.success && result.data) {
          this.logInfo(
            `PHI Accessed: Healthcare entity ${this.model.name} ID ${id} accessed by user ${accessContext.userId}`,
            'PHI_ACCESS'
          );
        }

        return result;
      }
    );
  }

  /**
   * Update healthcare entity with PHI audit logging
   */
  protected async updateHealthcareEntity(
    id: string,
    updates: Partial<T>,
    accessContext: PHIAccessContext,
    options: any = {}
  ): Promise<CrudOperationResult<T>> {
    return this.executeWithLogging(
      'update healthcare entity',
      async () => {
        // Validate healthcare updates
        const validation = this.validateHealthcareData(updates);
        if (!validation.isValid) {
          throw new ForbiddenException(`Healthcare validation failed: ${validation.errors.join(', ')}`);
        }

        // Log PHI access
        this.logPHIAccess('UPDATE', accessContext, { entityId: id, updates });

        const result = await this.updateEntityById(id, updates, options);

        // Log successful PHI modification
        if (result.success) {
          this.logInfo(
            `PHI Modified: Healthcare entity ${this.model.name} ID ${id} updated by user ${accessContext.userId}`,
            'PHI_ACCESS'
          );
        }

        return result;
      }
    );
  }

  /**
   * Soft delete healthcare entity (HIPAA requires retention)
   */
  protected async deleteHealthcareEntity(
    id: string,
    accessContext: PHIAccessContext
  ): Promise<CrudOperationResult<null>> {
    return this.executeWithLogging(
      'delete healthcare entity',
      async () => {
        // Healthcare entities should always be soft-deleted for HIPAA compliance
        const result = await this.deleteEntityById(id, true);

        // Log PHI deletion
        if (result.success) {
          this.logPHIAccess('DELETE', accessContext, { entityId: id });
          this.logInfo(
            `PHI Deleted: Healthcare entity ${this.model.name} ID ${id} soft-deleted by user ${accessContext.userId}`,
            'PHI_ACCESS'
          );
        }

        return result;
      }
    );
  }

  /**
   * Validate healthcare-specific data
   */
  protected validateHealthcareData(data: Partial<T>): HealthcareValidationResult {
    const result: HealthcareValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check for required healthcare fields
    if (!data || typeof data !== 'object') {
      result.isValid = false;
      result.errors.push('Invalid healthcare data provided');
      return result;
    }

    // Validate date fields
    if ('dateOfBirth' in data && data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth as any);
      if (isNaN(dob.getTime()) || dob > new Date()) {
        result.errors.push('Invalid date of birth');
        result.isValid = false;
      }
    }

    // Validate phone numbers (basic)
    if ('phoneNumber' in data && data.phoneNumber) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(data.phoneNumber as string)) {
        result.warnings.push('Phone number format may be invalid');
      }
    }

    // Validate email addresses
    if ('email' in data && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email as string)) {
        result.errors.push('Invalid email address format');
        result.isValid = false;
      }
    }

    return result;
  }

  /**
   * Log PHI access for HIPAA compliance
   */
  protected logPHIAccess(
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    context: PHIAccessContext,
    data?: any
  ): void {
    // Sanitize data for logging (remove actual PHI values)
    const sanitizedData = this.sanitizePHIForLogging(data);
    
    this.logInfo(
      `PHI_AUDIT: ${action} ${this.model.name} by user ${context.userId} (${context.userRole}) - Reason: ${context.accessReason}`,
      'PHI_AUDIT'
    );
    
    // In production, this would also write to a separate HIPAA audit log
    this.logDebug(
      `PHI Access Details: ${JSON.stringify({
        action,
        entity: this.model.name,
        userId: context.userId,
        userRole: context.userRole,
        accessReason: context.accessReason,
        timestamp: context.timestamp,
        dataFields: sanitizedData ? Object.keys(sanitizedData) : [],
      })}`,
      'PHI_AUDIT'
    );
  }

  /**
   * Sanitize PHI data for logging (remove values, keep field names)
   */
  protected sanitizePHIForLogging(data: any): any {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const sanitized: any = {};
    
    Object.keys(data).forEach(key => {
      if (this.PHI_FIELDS.includes(key)) {
        sanitized[key] = '[PHI_REDACTED]';
      } else {
        sanitized[key] = data[key];
      }
    });

    return sanitized;
  }

  /**
   * Check if user has permission to access healthcare data
   */
  protected validateHealthcareAccess(
    context: PHIAccessContext,
    requiredRole?: string
  ): boolean {
    // Basic role validation - enhance based on specific requirements
    const allowedRoles = ['nurse', 'admin', 'healthcare_provider', requiredRole].filter(Boolean);
    
    if (!allowedRoles.includes(context.userRole.toLowerCase())) {
      throw new ForbiddenException(
        `User role ${context.userRole} does not have permission to access healthcare data`
      );
    }

    return true;
  }

  /**
   * Generate healthcare compliance metadata
   */
  protected generateComplianceMetadata(operation: string): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      operation,
      service: this.constructor.name,
      entity: this.model.name,
      complianceVersion: '1.0',
      hipaaCompliant: true
    };
  }
}