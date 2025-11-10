/**
 * LOC: INTMW001
 * File: integration-middleware.ts
 * Purpose: NestJS middleware for API integration validation and transformation
 */
import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ValidationOperationsService } from "../validation-operations-kit";
import { SanitizationOperationsService } from "../sanitization-operations-kit";

@Injectable()
export class IntegrationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IntegrationMiddleware.name);
  
  constructor(
    private readonly validationService: ValidationOperationsService,
    private readonly sanitizationService: SanitizationOperationsService,
  ) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Integration request: ${req.method} ${req.path}`);
    
    // Validate API key
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(401).json({ error: "API key required" });
    }
    
    // Sanitize request body
    if (req.body) {
      req.body = this.sanitizationService.sanitizeObject(req.body);
    }
    
    next();
  }
}

export { IntegrationMiddleware };
