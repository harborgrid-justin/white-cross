/**
 * LOC: SECMW001
 * File: security-middleware.ts
 * Purpose: Security middleware for authentication, authorization, and rate limiting
 *
 * SECURITY FIX: Added production-grade JWT validation with token verification,
 * expiration checks, signature validation, and user payload attachment.
 */
import { Injectable, NestMiddleware, Logger, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SanitizationOperationsService } from "../sanitization-operations-kit";
import { ValidationOperationsService } from "../validation-operations-kit";
import * as jwt from "jsonwebtoken";

/**
 * Extended Request interface with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    roles?: string[];
    permissions?: string[];
    tenantId?: string;
    sessionId?: string;
  };
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  sub: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  tenantId?: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
  jti?: string; // JWT ID for revocation
  issuer?: string;
  audience?: string;
}

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);
  private readonly rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  // JWT configuration
  private readonly jwtSecret: string = process.env.JWT_SECRET || "CHANGE_IN_PRODUCTION";
  private readonly jwtIssuer: string = process.env.JWT_ISSUER || "white-cross-healthcare";
  private readonly jwtAudience: string = process.env.JWT_AUDIENCE || "white-cross-api";

  // Public routes that don't require authentication
  private readonly publicRoutes: string[] = [
    "/health",
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh",
    "/api/v1/auth/forgot-password",
    "/api-docs",
    "/swagger",
  ];

  constructor(
    private readonly sanitizationService: SanitizationOperationsService,
    private readonly validationService: ValidationOperationsService,
  ) {
    // Warn if using default JWT secret
    if (this.jwtSecret === "CHANGE_IN_PRODUCTION") {
      this.logger.warn("⚠️  SECURITY WARNING: Using default JWT secret! Set JWT_SECRET environment variable in production.");
    }
  }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Rate limiting (still in-memory for now, will be replaced with Redis)
      const clientId = this.getClientIP(req) || "unknown";
      if (!this.checkRateLimit(clientId)) {
        return res.status(429).json({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: 60
        });
      }

      // Skip authentication for public routes
      if (this.isPublicRoute(req.path)) {
        this.logger.debug(`Public route accessed: ${req.path}`);

        // Still apply security headers and sanitization
        this.applySecurityHeaders(res);
        this.sanitizeRequest(req);

        return next();
      }

      // Authentication check - Extract and validate JWT token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedException("Invalid or missing Authorization header. Expected format: Bearer <token>");
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Validate JWT token
      try {
        const payload = jwt.verify(token, this.jwtSecret, {
          issuer: this.jwtIssuer,
          audience: this.jwtAudience,
          algorithms: ["HS256", "HS512"], // Only allow HMAC algorithms
        }) as JWTPayload;

        // Check token expiration (redundant but explicit)
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          throw new UnauthorizedException("Token has expired");
        }

        // TODO: Check token revocation in Redis
        // const isRevoked = await this.checkTokenRevocation(payload.jti);
        // if (isRevoked) {
        //   throw new UnauthorizedException("Token has been revoked");
        // }

        // Attach validated user to request
        req.user = {
          id: payload.sub,
          email: payload.email,
          roles: payload.roles || [],
          permissions: payload.permissions || [],
          tenantId: payload.tenantId,
          sessionId: payload.sessionId,
        };

        this.logger.debug(`User authenticated: ${payload.sub} (${payload.email})`);

      } catch (error) {
        // Handle specific JWT errors
        if (error instanceof jwt.TokenExpiredError) {
          this.logger.warn(`Token expired: ${error.message}`);
          throw new UnauthorizedException("Token has expired. Please refresh your session.");
        }

        if (error instanceof jwt.JsonWebTokenError) {
          this.logger.warn(`Invalid token signature: ${error.message}`);
          throw new UnauthorizedException("Invalid token signature. Authentication failed.");
        }

        if (error instanceof jwt.NotBeforeError) {
          this.logger.warn(`Token not yet valid: ${error.message}`);
          throw new UnauthorizedException("Token is not yet valid. Check system time.");
        }

        // Re-throw if already UnauthorizedException
        if (error instanceof UnauthorizedException) {
          throw error;
        }

        // Generic authentication failure
        this.logger.error(`Authentication failed: ${(error as Error).message}`);
        throw new UnauthorizedException("Authentication failed. Invalid token.");
      }

      // Sanitize inputs
      this.sanitizeRequest(req);

      // Apply security headers
      this.applySecurityHeaders(res);

      next();
    } catch (error) {
      // Pass errors to NestJS exception filters
      next(error);
    }
  }
  
  /**
   * Check if route is public (doesn't require authentication)
   */
  private isPublicRoute(path: string): boolean {
    return this.publicRoutes.some((route) => path.startsWith(route));
  }

  /**
   * Get client IP address from request headers or connection
   */
  private getClientIP(req: Request): string {
    return (
      (req.headers["cf-connecting-ip"] as string) || // Cloudflare
      (req.headers["x-real-ip"] as string) || // Nginx
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown"
    );
  }

  /**
   * Sanitize request body and query parameters
   */
  private sanitizeRequest(req: Request): void {
    if (req.body && typeof req.body === "object") {
      req.body = this.sanitizationService.sanitizeObject(req.body);
    }

    if (req.query && typeof req.query === "object") {
      req.query = this.sanitizationService.sanitizeObject(req.query as any);
    }
  }

  /**
   * Apply comprehensive security headers to response
   * TODO: Move to Helmet middleware for production
   */
  private applySecurityHeaders(res: Response): void {
    // Basic security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Additional security headers
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=()");

    // Disable caching for API responses
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // HIPAA compliance indicator
    res.setHeader("X-Healthcare-Data", "true");
  }

  /**
   * Check rate limit for client
   * TODO: Replace with Redis-based distributed rate limiting
   */
  private checkRateLimit(clientId: string): boolean {
    const limit = 100; // requests per minute
    const windowMs = 60000; // 1 minute
    const now = Date.now();

    const current = this.rateLimitMap.get(clientId);

    if (!current || now > current.resetTime) {
      this.rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= limit) {
      this.logger.warn(`Rate limit exceeded for client: ${clientId}`);
      return false;
    }

    current.count++;
    return true;
  }

  /**
   * Check if token has been revoked
   * TODO: Implement with Redis integration
   */
  private async checkTokenRevocation(jti?: string): Promise<boolean> {
    if (!jti) return false;

    // TODO: Check Redis for revoked token
    // const isRevoked = await this.redisService.exists(`revoked:${jti}`);
    // return isRevoked;

    return false;
  }
}

export { SecurityMiddleware };
