/**
 * Multi-Factor Authentication Guard
 *
 * HIPAA Requirement: Person or Entity Authentication (§164.312(d))
 *
 * Enforces MFA verification for privileged operations and PHI access
 *
 * @module mfa.guard
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MFAService } from '../services/mfa.service';

// Decorator to require MFA verification
export const RequireMFA = () => SetMetadata('requireMFA', true);

// Decorator to skip MFA for specific routes
export const SkipMFA = () => SetMetadata('skipMFA', true);

function SetMetadata(key: string, value: boolean) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata(key, value, target, propertyKey);
    } else {
      Reflect.defineMetadata(key, value, target);
    }
  };
}

@Injectable()
export class MFAGuard implements CanActivate {
  private readonly logger = new Logger(MFAGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly mfaService: MFAService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check if MFA should be skipped for this route
    const skipMFA = this.reflector.getAllAndOverride<boolean>('skipMFA', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipMFA) {
      return true;
    }

    // Check if route requires MFA
    const requireMFA = this.reflector.getAllAndOverride<boolean>('requireMFA', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Get user from request (should be set by JWT auth guard)
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if user has MFA enabled
    const mfaStatus = await this.mfaService.getMFAStatus(user.id);

    // If MFA is required but not enabled, block access
    if (requireMFA && !mfaStatus.enabled) {
      this.logger.warn(`MFA required but not enabled for user: ${user.id}`);
      throw new UnauthorizedException('MFA is required for this operation. Please enable MFA.');
    }

    // If MFA is enabled, check if verified in current session
    const mfaVerified = request.session?.mfaVerified || false;

    if (mfaStatus.enabled && !mfaVerified) {
      // Check if device is trusted
      const deviceId = request.headers['x-device-id'];

      if (deviceId) {
        const isTrusted = await this.mfaService.isDeviceTrusted(user.id, deviceId);

        if (isTrusted) {
          // Allow access for trusted device
          this.logger.debug(`Access granted for trusted device: ${deviceId}`);
          return true;
        }
      }

      this.logger.warn(`MFA verification required for user: ${user.id}`);
      throw new UnauthorizedException('MFA verification required');
    }

    return true;
  }
}

/**
 * MFA Verification Interceptor
 * Tracks MFA challenges and successful verifications
 */
@Injectable()
export class MFAVerificationInterceptor {
  private readonly logger = new Logger(MFAVerificationInterceptor.name);

  constructor(private readonly mfaService: MFAService) {}

  async intercept(context: ExecutionContext, next: any): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && request.session) {
      // Log MFA challenge
      this.logger.debug(`MFA challenge for user: ${user.id}`);
    }

    return next.handle();
  }
}

export default {
  MFAGuard,
  RequireMFA,
  SkipMFA,
  MFAVerificationInterceptor,
};
