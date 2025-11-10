/**
 * LOC: GUARD-JWT-001
 * File: /reuse/server/health/composites/shared/guards/jwt-auth.guard.ts
 * Purpose: JWT Authentication Guard for all protected healthcare endpoints
 *
 * @description
 * Validates JWT tokens and ensures user is authenticated before accessing any endpoint.
 * Integrates with Passport JWT strategy and extracts user information.
 *
 * @example
 * ```typescript
 * @Controller('patients')
 * @UseGuards(JwtAuthGuard)
 * export class PatientsController {
 *   @Get(':id')
 *   async getPatient(@Param('id') id: string, @CurrentUser() user: UserPayload) {
 *     // User is authenticated here
 *   }
 * }
 * ```
 */

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * User payload extracted from JWT token
 */
export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  facilityId?: string;
  providerId?: string;
  iat: number;
  exp: number;
}

/**
 * User roles in the healthcare system
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  PHYSICIAN = 'physician',
  NURSE = 'nurse',
  PHARMACIST = 'pharmacist',
  LAB_TECH = 'lab_tech',
  BILLING = 'billing',
  PATIENT = 'patient',
  CARE_COORDINATOR = 'care_coordinator',
  SOCIAL_WORKER = 'social_worker',
  RADIOLOGIST = 'radiologist',
  THERAPIST = 'therapist',
  EMERGENCY_RESPONDER = 'emergency_responder',
}

/**
 * Metadata key for marking routes as public (bypassing JWT auth)
 */
export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines if the route can be activated based on JWT authentication
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get request object
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;

    // Log authentication attempt
    this.logger.debug(`Auth attempt: ${method} ${url} from IP: ${ip}`);

    return super.canActivate(context);
  }

  /**
   * Handle authentication request errors
   */
  handleRequest<TUser = UserPayload>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;

    if (err || !user) {
      this.logger.warn(
        `Authentication failed: ${method} ${url} from IP: ${ip} - ${info?.message || 'No token provided'}`,
      );

      throw new UnauthorizedException(
        info?.message || 'You must be authenticated to access this resource',
      );
    }

    // Validate user object has required fields
    if (!user.id || !user.role) {
      this.logger.error('Invalid user payload in JWT token');
      throw new UnauthorizedException('Invalid token payload');
    }

    // Check if token is about to expire (within 5 minutes)
    const expiresIn = user.exp - Math.floor(Date.now() / 1000);
    if (expiresIn < 300) {
      this.logger.warn(
        `Token expiring soon for user ${user.id}: ${expiresIn} seconds remaining`,
      );
      // Add header to response suggesting token refresh
      const response = context.switchToHttp().getResponse();
      response.setHeader('X-Token-Expiring-Soon', 'true');
    }

    return user;
  }
}
