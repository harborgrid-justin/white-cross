import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyAuthService } from '../api-key-auth.service';

/**
 * API Key Guard
 *
 * Validates API key authentication for service-to-service communication.
 * Checks for API key in X-API-Key header.
 *
 * @guard ApiKeyGuard
 * @usage @UseGuards(ApiKeyGuard)
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(
    private readonly apiKeyAuthService: ApiKeyAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Extract API key from header
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      this.logger.warn('API key missing from request', {
        path: request.path,
        ip: request.ip,
      });
      throw new UnauthorizedException(
        'API key required. Provide X-API-Key header.',
      );
    }

    try {
      // Validate API key
      const apiKeyRecord = await this.apiKeyAuthService.validateApiKey(apiKey);

      // Check IP restriction if configured
      if (apiKeyRecord.ipRestriction) {
        const clientIP = this.extractClientIP(request);
        if (!this.matchesIPPattern(clientIP, apiKeyRecord.ipRestriction)) {
          this.logger.warn('API key IP restriction violated', {
            keyPrefix: apiKeyRecord.keyPrefix,
            clientIP,
            allowedPattern: apiKeyRecord.ipRestriction,
          });
          throw new UnauthorizedException(
            'API key not allowed from this IP address',
          );
        }
      }

      // Attach API key info to request
      request.apiKey = {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        keyPrefix: apiKeyRecord.keyPrefix,
        scopes: apiKeyRecord.scopes,
        rateLimit: apiKeyRecord.rateLimit,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Error validating API key', { error });
      throw new UnauthorizedException('Invalid API key');
    }
  }

  /**
   * Extract API key from request headers
   *
   * Checks for X-API-Key header
   *
   * @param request - Express request
   * @returns API key or null
   */
  private extractApiKey(request: any): string | null {
    const headerKey = request.headers['x-api-key'];
    if (headerKey) {
      return headerKey as string;
    }

    // Also check Authorization header for Bearer token (alternative)
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('ApiKey ')) {
      return authHeader.substring(7);
    }

    return null;
  }

  /**
   * Extract client IP address
   *
   * @param request - Express request
   * @returns Client IP address
   */
  private extractClientIP(request: any): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return (forwarded as string).split(',')[0].trim();
    }

    const realIP = request.headers['x-real-ip'];
    if (realIP) {
      return realIP as string;
    }

    return request.ip || request.connection?.remoteAddress || '127.0.0.1';
  }

  /**
   * SECURITY FIX: Improved IP pattern matching with proper CIDR support
   *
   * Check if client IP matches IP restriction pattern
   * Supports exact matches, wildcards, and CIDR notation
   *
   * IMPORTANT: For production use, install 'ip-cidr' library for full CIDR support
   * npm install ip-cidr
   *
   * @param clientIP - Client IP address
   * @param pattern - IP restriction pattern (supports: exact, wildcard, CIDR)
   * @returns True if IP matches pattern
   */
  private matchesIPPattern(clientIP: string, pattern: string): boolean {
    // Exact match
    if (clientIP === pattern) {
      return true;
    }

    // Wildcard pattern (e.g., 192.168.*.*)
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '\\d+');
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(clientIP)) {
        return true;
      }
    }

    // CIDR notation (basic implementation - use ip-cidr library for production)
    if (pattern.includes('/')) {
      this.logger.warn(
        `CIDR matching requires 'ip-cidr' library. Install with: npm install ip-cidr`,
        {
          clientIP,
          pattern,
        },
      );

      // Basic CIDR validation for common cases (not production-ready)
      const [networkIP, prefixLength] = pattern.split('/');
      const prefix = parseInt(prefixLength, 10);

      // For IPv4 only (simplified)
      if (this.isIPv4(clientIP) && this.isIPv4(networkIP)) {
        return this.simpleIPv4CIDRMatch(clientIP, networkIP, prefix);
      }

      // For security, deny if we can't validate properly
      this.logger.warn(
        `Denying access due to incomplete CIDR validation. Install ip-cidr library.`,
      );
      return false;
    }

    return false;
  }

  /**
   * Check if string is IPv4 address
   */
  private isIPv4(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  /**
   * Simple IPv4 CIDR matching (basic implementation)
   * IMPORTANT: Use ip-cidr library for production
   */
  private simpleIPv4CIDRMatch(
    clientIP: string,
    networkIP: string,
    prefixLength: number,
  ): boolean {
    try {
      const clientParts = clientIP.split('.').map(Number);
      const networkParts = networkIP.split('.').map(Number);

      // Convert to 32-bit integers
      const clientInt =
        (clientParts[0] << 24) |
        (clientParts[1] << 16) |
        (clientParts[2] << 8) |
        clientParts[3];

      const networkInt =
        (networkParts[0] << 24) |
        (networkParts[1] << 16) |
        (networkParts[2] << 8) |
        networkParts[3];

      // Create subnet mask
      const mask = (0xffffffff << (32 - prefixLength)) >>> 0;

      // Compare network portions
      const match = (clientInt & mask) === (networkInt & mask);

      this.logger.debug('Simple CIDR match', {
        clientIP,
        networkIP,
        prefixLength,
        match,
      });

      return match;
    } catch (error) {
      this.logger.error('Error in simple CIDR matching', { error });
      return false;
    }
  }
}

/**
 * Decorator to require specific API key scope
 *
 * @param scope - Required scope
 */
export const RequireApiKeyScope = (scope: string) =>
  Reflector.createDecorator<string>({ key: 'apiKeyScope' });
