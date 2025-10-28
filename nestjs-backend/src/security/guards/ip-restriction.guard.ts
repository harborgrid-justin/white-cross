import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { IpRestrictionService } from '../services/ip-restriction.service';

/**
 * IP Restriction Guard
 * Checks incoming requests against IP whitelist/blacklist rules
 */
@Injectable()
export class IpRestrictionGuard implements CanActivate {
  private readonly logger = new Logger(IpRestrictionGuard.name);

  constructor(private readonly ipRestrictionService: IpRestrictionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ipAddress = this.extractIP(request);
    const userId = request.user?.id; // Assumes auth middleware sets request.user

    try {
      const result = await this.ipRestrictionService.checkIPAccess(
        ipAddress,
        userId,
      );

      if (!result.allowed) {
        this.logger.warn('IP access denied', {
          ipAddress,
          userId,
          reason: result.reason,
        });

        throw new ForbiddenException(
          result.reason || 'Access denied from this IP address',
        );
      }

      // Log successful access
      await this.ipRestrictionService.logAccessAttempt(
        ipAddress,
        userId || null,
        true,
      );

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      this.logger.error('Error in IP restriction guard', { error, ipAddress });
      // Fail open - allow access if there's an error
      return true;
    }
  }

  /**
   * Extract IP address from request
   */
  private extractIP(request: any): string {
    // Check for proxy headers first
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers['x-real-ip'];
    if (realIP) {
      return realIP;
    }

    // Fall back to connection IP
    return request.ip || request.connection?.remoteAddress || '127.0.0.1';
  }
}
