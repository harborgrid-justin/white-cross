/**
 * LOC: SECMW001
 * File: security-middleware.ts
 * Purpose: Security middleware for authentication, authorization, and rate limiting
 */
import { Injectable, NestMiddleware, Logger, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SanitizationOperationsService } from "../sanitization-operations-kit";
import { ValidationOperationsService } from "../validation-operations-kit";

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);
  private readonly rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  
  constructor(
    private readonly sanitizationService: SanitizationOperationsService,
    private readonly validationService: ValidationOperationsService,
  ) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    // Rate limiting
    const clientId = req.ip || "unknown";
    if (!this.checkRateLimit(clientId)) {
      return res.status(429).json({ error: "Too many requests" });
    }
    
    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header required");
    }
    
    // Sanitize inputs
    if (req.body) {
      req.body = this.sanitizationService.sanitizeObject(req.body);
    }
    
    // Security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    
    next();
  }
  
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
      return false;
    }
    
    current.count++;
    return true;
  }
}

export { SecurityMiddleware };
