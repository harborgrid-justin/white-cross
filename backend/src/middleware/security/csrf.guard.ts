/**
 * @fileoverview CSRF Protection Guard for Healthcare Applications (NestJS)
 * @module middleware/security/csrf
 * @description NestJS guard for CSRF token validation on state-changing requests.
 * Protects against Cross-Site Request Forgery attacks with healthcare-specific validation.
 *
 * Key Features:
 * - CSRF token generation and validation
 * - Automatic token attachment to responses
 * - Healthcare-compliant CSRF protection
 * - Configurable skip paths
 * - Comprehensive audit logging
 *
 * @security CSRF attack prevention
 * @compliance OWASP A01:2021 - Broken Access Control
 */

import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import * as crypto from 'crypto';
import { AppConfigService } from '../../config/app-config.service';

export interface CSRFConfig {
  cookieName: string;
  headerName: string;
  tokenLifetimeMs: number;
  skipPaths: Set<string>;
}

const DEFAULT_CSRF_CONFIG: CSRFConfig = {
  cookieName: 'XSRF-TOKEN',
  headerName: 'X-CSRF-Token',
  tokenLifetimeMs: 24 * 60 * 60 * 1000, // 24 hours
  skipPaths: new Set([
    '/api/auth/login',
    '/api/auth/logout',
    '/api/webhook',
    '/api/public',
  ]),
};

/**
 * CSRF token cache with expiration
 */
class CSRFTokenCache {
  private cache = new Map<
    string,
    { token: string; timestamp: number; sessionId: string }
  >();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours

  set(userId: string, sessionId: string, token: string): void {
    this.cache.set(userId, {
      token,
      timestamp: Date.now(),
      sessionId,
    });
    this.cleanup();
  }

  get(userId: string, sessionId: string): string | null {
    const entry = this.cache.get(userId);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(userId);
      return null;
    }

    if (entry.sessionId !== sessionId) {
      return null;
    }

    return entry.token;
  }

  validate(userId: string, sessionId: string, token: string): boolean {
    const cachedToken = this.get(userId, sessionId);
    if (!cachedToken) return false;
    return cachedToken === token;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * CSRF Protection Guard for NestJS
 *
 * @class CsrfGuard
 * @implements {CanActivate}
 * @description NestJS guard for validating CSRF tokens on state-changing requests.
 * For safe methods (GET, HEAD, OPTIONS), generates and attaches CSRF token to response.
 * For unsafe methods (POST, PUT, DELETE, PATCH), validates CSRF token.
 *
 * @example
 * // Apply globally
 * app.useGlobalGuards(new CsrfGuard(reflector));
 *
 * @example
 * // Skip CSRF for specific route
 * @SkipCsrf()
 * @Post('webhook')
 * handleWebhook() {}
 *
 * @example
 * // Require CSRF for specific route
 * @UseGuards(CsrfGuard)
 * @Post('data')
 * createData() {}
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly logger = new Logger(CsrfGuard.name);
  private readonly config: CSRFConfig;
  private readonly tokenCache: CSRFTokenCache;
  private readonly CSRF_PROTECTED_METHODS = new Set([
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
  ]);

  constructor(
    private reflector: Reflector,
    private configService: AppConfigService,
  ) {
    // Use configuration from AppConfigService instead of DEFAULT_CSRF_CONFIG
    this.config = {
      cookieName: this.configService.security.csrf.cookieName,
      headerName: this.configService.security.csrf.headerName,
      tokenLifetimeMs: this.configService.security.csrf.tokenLifetimeMs,
      skipPaths: DEFAULT_CSRF_CONFIG.skipPaths, // Keep default skip paths
    };
    this.tokenCache = new CSRFTokenCache();

    this.logger.log('CSRF Guard initialized', {
      enabled: this.configService.security.csrf.enabled,
      environment: this.configService.environment,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if CSRF should be skipped for this route
    const skipCsrf = this.reflector.get<boolean>(
      'skipCsrf',
      context.getHandler(),
    );
    if (skipCsrf) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const method = request.method.toUpperCase();

    // Skip CSRF for certain paths
    if (this.shouldSkipCSRF(request.path)) {
      return true;
    }

    // Safe methods: Generate and attach token
    if (!this.CSRF_PROTECTED_METHODS.has(method)) {
      this.handleSafeMethod(request, response);
      return true;
    }

    // Unsafe methods: Validate token
    return this.handleUnsafeMethod(request, response);
  }

  private shouldSkipCSRF(path: string): boolean {
    // Check exact matches
    if (this.config.skipPaths.has(path)) {
      return true;
    }

    // Check path prefixes
    for (const skipPath of this.config.skipPaths) {
      if (path.startsWith(skipPath)) {
        return true;
      }
    }

    return false;
  }

  private handleSafeMethod(req: Request, res: Response): void {
    const user = (req as any).user;

    // Only generate token for authenticated users
    if (!user || !user.id) {
      return;
    }

    const userId = user.id;
    const sessionId = (req as any).session?.id || 'no-session';

    // Generate CSRF token
    const csrfToken = this.generateCSRFToken(userId, sessionId);

    // Store token in cache
    this.tokenCache.set(userId, sessionId, csrfToken);

    // Set as cookie (HttpOnly, SameSite for security)
    res.cookie(this.config.cookieName, csrfToken, {
      httpOnly: true,
      secure: this.configService.isProduction,
      sameSite: 'strict',
      maxAge: this.config.tokenLifetimeMs,
    });

    // Also set as response header for SPA convenience
    res.setHeader(this.config.headerName, csrfToken);

    // Make token available to templates
    res.locals.csrfToken = csrfToken;
  }

  private handleUnsafeMethod(req: Request, res: Response): boolean {
    const user = (req as any).user;

    // Require authentication for CSRF-protected operations
    if (!user || !user.id) {
      this.logger.warn(
        'CSRF: Unauthenticated request to CSRF-protected endpoint',
        {
          path: req.path,
          method: req.method,
          ip: req.ip,
        },
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Authentication Required',
          message: 'Authentication required for this operation',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userId = user.id;
    const sessionId = (req as any).session?.id || 'no-session';

    // Get CSRF token from request
    const token = this.getCSRFTokenFromRequest(req);

    if (!token) {
      this.logger.warn('CSRF: Token missing', {
        userId,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          error: 'CSRF Validation Failed',
          message:
            'CSRF token required. Please include X-CSRF-Token header or _csrf form field.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Validate token
    const isValid = this.validateCSRFToken(token, userId, sessionId);

    if (!isValid) {
      this.logger.warn('CSRF: Token validation failed', {
        userId,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          error: 'CSRF Validation Failed',
          message: 'Invalid or expired CSRF token',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Token is valid
    this.logger.debug('CSRF: Token validated successfully', {
      userId,
      path: req.path,
      method: req.method,
    });

    return true;
  }

  private generateCSRFToken(userId: string, sessionId: string): string {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const payload = `${userId}:${sessionId}:${timestamp}:${randomBytes}`;
    const secret = this.configService.csrfSecret;

    if (!secret) {
      throw new Error(
        'CRITICAL SECURITY ERROR: CSRF_SECRET not configured. ' +
          'Please set CSRF_SECRET in your .env file.',
      );
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const signature = hmac.digest('hex');

    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  private validateCSRFToken(
    token: string,
    userId: string,
    sessionId: string,
  ): boolean {
    try {
      // Check cache first
      if (this.tokenCache.validate(userId, sessionId, token)) {
        return true;
      }

      // Decode and validate token structure
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parts = decoded.split(':');

      if (parts.length !== 5) {
        return false;
      }

      const [tokenUserId, tokenSessionId, timestamp, randomBytes, signature] =
        parts;

      if (!tokenUserId || !tokenSessionId || !timestamp || !randomBytes || !signature) {
        return false;
      }

      // Validate user and session match
      if (tokenUserId !== userId || tokenSessionId !== sessionId) {
        return false;
      }

      // Check if token is expired
      const tokenAge = Date.now() - parseInt(timestamp, 10);
      if (tokenAge > this.config.tokenLifetimeMs) {
        return false;
      }

      // Verify signature
      const payload = `${tokenUserId}:${tokenSessionId}:${timestamp}:${randomBytes}`;
      const secret = this.configService.csrfSecret;

      if (!secret) {
        this.logger.error('CSRF_SECRET not configured');
        return false;
      }

      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        return false;
      }

      // Cache the valid token
      this.tokenCache.set(userId, sessionId, token);

      return true;
    } catch (error) {
      this.logger.error('CSRF token validation error', error);
      return false;
    }
  }

  private getCSRFTokenFromRequest(req: Request): string | null {
    // Check header
    const headerToken = req.headers[this.config.headerName.toLowerCase()] as
      | string
      | undefined;
    if (headerToken) {
      return headerToken;
    }

    // Check body
    const bodyToken = req.body?._csrf;
    if (bodyToken) {
      return bodyToken;
    }

    // Check query
    const queryToken = (req.query as any)?._csrf;
    if (queryToken) {
      return queryToken;
    }

    // Check cookie
    const cookieToken = req.cookies?.[this.config.cookieName];
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }
}

// Custom decorator to skip CSRF validation
export const SkipCsrf = () =>
  Reflector.createDecorator<boolean>({ key: 'skipCsrf' });
