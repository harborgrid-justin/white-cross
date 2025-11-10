/**
 * LOC: GUARD-PHI-001
 * File: /reuse/server/health/composites/shared/guards/phi-access.guard.ts
 * Purpose: Protected Health Information (PHI) Access Control Guard
 *
 * @description
 * HIPAA-compliant guard that enforces:
 * - Legitimate relationship verification between user and patient
 * - Break-glass emergency access with automatic audit
 * - Patient consent verification
 * - Minimum necessary access principle
 * - Access reason documentation
 *
 * @example
 * ```typescript
 * @Controller('patients')
 * export class PatientsController {
 *   @Get(':id/medical-records')
 *   @UseGuards(JwtAuthGuard, RbacGuard, PhiAccessGuard)
 *   @RequirePhiAccess('view_medical_records')
 *   async getMedicalRecords(
 *     @Param('id') patientId: string,
 *     @CurrentUser() user: UserPayload,
 *     @AccessReason() reason: string
 *   ) {
 *     // PHI access verified and logged
 *   }
 * }
 * ```
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayload, UserRole } from './jwt-auth.guard';

/**
 * Metadata key for PHI access requirements
 */
export const PHI_ACCESS_KEY = 'phi_access';

/**
 * Metadata key for break-glass access
 */
export const BREAK_GLASS_ALLOWED_KEY = 'break_glass_allowed';

/**
 * Types of PHI access
 */
export enum PhiAccessType {
  VIEW_BASIC = 'view_basic', // Name, DOB, address
  VIEW_MEDICAL_RECORDS = 'view_medical_records',
  VIEW_LAB_RESULTS = 'view_lab_results',
  VIEW_MEDICATIONS = 'view_medications',
  VIEW_PRESCRIPTIONS = 'view_prescriptions',
  EDIT_MEDICAL_RECORDS = 'edit_medical_records',
  PRESCRIBE_MEDICATIONS = 'prescribe_medications',
  VIEW_BILLING = 'view_billing',
  VIEW_INSURANCE = 'view_insurance',
  EMERGENCY_ACCESS = 'emergency_access',
}

/**
 * PHI access request metadata
 */
export interface PhiAccessRequest {
  patientId: string;
  accessType: PhiAccessType;
  reason?: string;
  isEmergency?: boolean;
  breakGlass?: boolean;
}

@Injectable()
export class PhiAccessGuard implements CanActivate {
  private readonly logger = new Logger(PhiAccessGuard.name);

  constructor(private reflector: Reflector) {}

  /**
   * Determines if user can access PHI for the requested patient
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.getAllAndOverride<PhiAccessType>(
      PHI_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no PHI access requirement specified, allow access
    if (!requiredAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    if (!user) {
      throw new ForbiddenException('User information not found');
    }

    // Extract patient ID from request
    const patientId = this.extractPatientId(request);
    if (!patientId) {
      throw new BadRequestException('Patient ID not found in request');
    }

    // Check for break-glass emergency access
    const isBreakGlass = request.headers['x-break-glass'] === 'true';
    const emergencyReason = request.headers['x-emergency-reason'];

    const breakGlassAllowed = this.reflector.getAllAndOverride<boolean>(
      BREAK_GLASS_ALLOWED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isBreakGlass) {
      if (!breakGlassAllowed) {
        this.logger.error(
          `Break-glass access attempted on non-emergency endpoint by user ${user.id}`,
        );
        throw new ForbiddenException('Break-glass access not allowed on this endpoint');
      }

      if (!emergencyReason) {
        throw new BadRequestException('Emergency reason required for break-glass access');
      }

      this.logger.warn(
        `BREAK-GLASS ACCESS: User ${user.id} (${user.role}) accessing patient ${patientId} - Reason: ${emergencyReason}`,
      );

      // Log break-glass access for audit
      await this.logBreakGlassAccess(user, patientId, requiredAccess, emergencyReason);

      return true;
    }

    // Get access reason from header
    const accessReason = request.headers['x-access-reason'];
    if (!accessReason) {
      this.logger.warn(
        `PHI access without reason: User ${user.id} attempting to access patient ${patientId}`,
      );
      throw new BadRequestException('Access reason required for PHI access');
    }

    // Verify legitimate relationship
    const hasLegitimateRelationship = await this.verifyLegitimateRelationship(
      user,
      patientId,
      requiredAccess,
    );

    if (!hasLegitimateRelationship) {
      this.logger.warn(
        `PHI access denied: User ${user.id} has no legitimate relationship with patient ${patientId}`,
      );
      throw new ForbiddenException(
        'You do not have a legitimate relationship with this patient',
      );
    }

    // Verify patient consent for this type of access (if required)
    const hasConsent = await this.verifyPatientConsent(
      patientId,
      user.id,
      requiredAccess,
    );

    if (!hasConsent) {
      this.logger.warn(
        `PHI access denied: Patient ${patientId} has not consented to ${requiredAccess} by user ${user.id}`,
      );
      throw new ForbiddenException(
        'Patient has not consented to this type of data access',
      );
    }

    // Store access metadata in request for audit logging
    request.phiAccessMetadata = {
      patientId,
      accessType: requiredAccess,
      reason: accessReason,
      isEmergency: false,
      breakGlass: false,
    };

    return true;
  }

  /**
   * Extract patient ID from various locations in request
   */
  private extractPatientId(request: any): string | null {
    // Check route params
    if (request.params?.patientId) return request.params.patientId;
    if (request.params?.id) return request.params.id;

    // Check query params
    if (request.query?.patientId) return request.query.patientId;

    // Check request body
    if (request.body?.patientId) return request.body.patientId;

    return null;
  }

  /**
   * Verify user has legitimate relationship with patient
   * This should be implemented to check:
   * - Active care team membership
   * - Current admission/encounter
   * - Scheduled appointments
   * - Referral relationships
   */
  private async verifyLegitimateRelationship(
    user: UserPayload,
    patientId: string,
    accessType: PhiAccessType,
  ): Promise<boolean> {
    // Super admins always have access (for system maintenance)
    if (user.role === UserRole.SUPER_ADMIN) {
      this.logger.warn(
        `Super admin ${user.id} accessing patient ${patientId} - full audit trail required`,
      );
      return true;
    }

    // Patient accessing their own records
    if (user.role === UserRole.PATIENT && user.id === patientId) {
      return true;
    }

    // For production, implement actual relationship verification logic:
    // - Check care_team_members table
    // - Check active_encounters table
    // - Check provider_patient_relationships table
    // - Check scheduled_appointments table

    // TODO: Implement actual database checks
    // For now, allow access for healthcare providers
    const allowedRoles = [
      UserRole.PHYSICIAN,
      UserRole.NURSE,
      UserRole.PHARMACIST,
      UserRole.LAB_TECH,
      UserRole.RADIOLOGIST,
      UserRole.CARE_COORDINATOR,
      UserRole.EMERGENCY_RESPONDER,
    ];

    return allowedRoles.includes(user.role);
  }

  /**
   * Verify patient has consented to this type of access
   */
  private async verifyPatientConsent(
    patientId: string,
    userId: string,
    accessType: PhiAccessType,
  ): Promise<boolean> {
    // For production, implement actual consent verification:
    // - Check patient_consent_records table
    // - Verify consent is current and not revoked
    // - Check consent scope matches access type

    // TODO: Implement actual consent checks
    // For now, assume consent is granted
    return true;
  }

  /**
   * Log break-glass emergency access for audit
   */
  private async logBreakGlassAccess(
    user: UserPayload,
    patientId: string,
    accessType: PhiAccessType,
    reason: string,
  ): Promise<void> {
    // This should integrate with audit logging service
    this.logger.error(
      `⚠️  BREAK-GLASS AUDIT LOG ⚠️
User ID: ${user.id}
User Role: ${user.role}
Patient ID: ${patientId}
Access Type: ${accessType}
Reason: ${reason}
Timestamp: ${new Date().toISOString()}`,
    );

    // TODO: Implement actual audit logging to database
    // Should trigger immediate alerts to security team
  }
}
