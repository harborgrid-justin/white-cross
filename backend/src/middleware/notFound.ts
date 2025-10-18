/**
 * WC-MID-404-046 | Express 404 Not Found Handler & Route Fallback Middleware
 * Purpose: Handles unmatched routes with standardized 404 responses
 * Upstream: None (fallback middleware) | Dependencies: express
 * Downstream: None (terminal middleware) | Called by: Express.js route fallback
 * Related: middleware/errorHandler.ts, routes/*, Express.js routing system
 * Exports: notFound (default) | Key Services: 404 error standardization
 * Last Updated: 2025-10-18 | Dependencies: express
 * Critical Path: Unmatched route → 404 response → Request termination
 * LLM Context: Express.js fallback handler, ensures consistent API error format
 */

import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`
    }
  });
};
