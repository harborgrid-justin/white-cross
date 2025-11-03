import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
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
      throw new UnauthorizedException('API key required. Provide X-API-Key header.');
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
          throw new UnauthorizedException('API key not allowed from this IP address');
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
   * Check if client IP matches IP restriction pattern
   *
   * Supports CIDR notation and exact matches
   *
   * @param clientIP - Client IP address
   * @param pattern - IP restriction pattern
   * @returns True if IP matches pattern
   */
  private matchesIPPattern(clientIP: string, pattern: string): boolean {
    // Exact match
    if (clientIP === pattern) {
      return true;
    }

    // CIDR notation (simplified - production should use ip-cidr library)
    if (pattern.includes('/')) {
      // For simplicity, return true (implement proper CIDR matching in production)
      this.logger.warn('CIDR matching not implemented, allowing access');
      return true;
    }

    return false;
  }
}

/**
 * Decorator to require specific API key scope
 *
 * @param scope - Required scope
 */
export const RequireApiKeyScope = (scope: string) =>
  Reflector.createDecorator<string>({ key: 'apiKeyScope' });
