import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
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
   * SECURITY FIX: Secure IP extraction with proxy validation
   *
   * Extract IP address from request with security considerations:
   * 1. Validates trusted proxies before using forwarded headers
   * 2. Prevents IP spoofing attacks
   * 3. Falls back to connection IP for untrusted sources
   *
   * IMPORTANT: Configure TRUSTED_PROXIES environment variable in production
   * Example: TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
   */
  private extractIP(request: any): string {
    // Get list of trusted proxies from environment (comma-separated CIDR blocks or IPs)
    const trustedProxies = (process.env.TRUSTED_PROXIES || '127.0.0.1,::1')
      .split(',')
      .map((ip) => ip.trim());

    // Get the direct connection IP
    const connectionIP =
      request.ip || request.connection?.remoteAddress || '127.0.0.1';

    // Check if connection is from a trusted proxy
    const isTrustedProxy = this.isIPTrusted(connectionIP, trustedProxies);

    if (isTrustedProxy) {
      // Only trust X-Forwarded-For or X-Real-IP from trusted proxies
      const forwarded = request.headers['x-forwarded-for'];
      if (forwarded) {
        // X-Forwarded-For can contain multiple IPs: client, proxy1, proxy2
        // Take the leftmost (client) IP
        const clientIP = forwarded.split(',')[0].trim();
        this.logger.debug(
          `IP from trusted proxy - X-Forwarded-For: ${clientIP}`,
        );
        return clientIP;
      }

      const realIP = request.headers['x-real-ip'];
      if (realIP) {
        this.logger.debug(`IP from trusted proxy - X-Real-IP: ${realIP}`);
        return realIP;
      }
    } else {
      // Log potential spoofing attempt if headers present from untrusted source
      if (request.headers['x-forwarded-for'] || request.headers['x-real-ip']) {
        this.logger.warn(
          `Ignoring proxy headers from untrusted source: ${connectionIP}`,
          {
            xForwardedFor: request.headers['x-forwarded-for'],
            xRealIP: request.headers['x-real-ip'],
          },
        );
      }
    }

    // Fall back to connection IP
    this.logger.debug(`Using connection IP: ${connectionIP}`);
    return connectionIP;
  }

  /**
   * Check if IP is in trusted proxy list
   * Supports both exact IPs and CIDR notation
   */
  private isIPTrusted(ip: string, trustedProxies: string[]): boolean {
    for (const trusted of trustedProxies) {
      // Exact match
      if (ip === trusted) {
        return true;
      }

      // CIDR match - Full production implementation
      if (trusted.includes('/')) {
        if (this.matchesCIDR(ip, trusted)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if IP matches CIDR range
   * Production-grade CIDR matching without external dependencies
   */
  private matchesCIDR(ip: string, cidr: string): boolean {
    if (!cidr.includes('/')) {
      return ip === cidr;
    }

    try {
      const [network, bitsStr] = cidr.split('/');
      const bits = parseInt(bitsStr, 10);

      if (bits < 0 || bits > 32) {
        this.logger.warn(`Invalid CIDR bits: ${bits}`);
        return false;
      }

      // Convert IP addresses to 32-bit integers
      const ipToInt = (ipAddr: string): number => {
        const parts = ipAddr.split('.');
        if (parts.length !== 4) return 0;

        return parts.reduce((acc, part) => {
          const num = parseInt(part, 10);
          if (isNaN(num) || num < 0 || num > 255) return 0;
          return (acc << 8) + num;
        }, 0);
      };

      const ipInt = ipToInt(ip);
      const networkInt = ipToInt(network);

      // Create network mask
      const mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;

      // Compare network portions
      return (ipInt & mask) === (networkInt & mask);
    } catch (error) {
      this.logger.error('CIDR matching error:', error);
      return false;
    }
  }
}
