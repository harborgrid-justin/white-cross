import { RequestWithConnection } from '../types';

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from '../access-control.service';

/**
 * Guard to check if the request IP is restricted
 *
 * This guard checks if the request is coming from a blacklisted IP address.
 * Note: This guard runs early in the request pipeline and can block access
 * before authentication.
 */
@Injectable()
export class IpRestrictionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public (IP restrictions should still apply)
    // but we can skip for truly unrestricted routes if needed

    // Get request
    const request = context.switchToHttp().getRequest();

    // Extract IP address from request
    const ipAddress = this.extractIpAddress(request);

    if (!ipAddress) {
      // If we can't determine IP, allow access (or you could block it)
      return true;
    }

    // Check if IP is restricted
    const restrictionCheck =
      await this.accessControlService.checkIpRestriction(ipAddress);

    if (restrictionCheck.isRestricted) {
      throw new ForbiddenException(
        restrictionCheck.reason || 'Access from this IP address is restricted',
      );
    }

    return true;
  }

  /**
   * Extract IP address from request, handling proxies
   */
  private extractIpAddress(request: RequestWithConnection): string | null {
    // Check X-Forwarded-For header (for proxies/load balancers)
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      const ips = forwardedFor.split(',').map((ip: string) => ip.trim());
      return ips[0];
    }

    // Check X-Real-IP header
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return realIp;
    }

    // Fall back to connection remote address
    return (
      request.connection?.remoteAddress || request.socket?.remoteAddress || null
    );
  }
}
