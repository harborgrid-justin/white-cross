/**
 * @fileoverview Rate Limiting Middleware for Authentication Protection
 * @module middleware/rateLimiter
 * @description Implements rate limiting to prevent brute force attacks,
 * credential stuffing, and account enumeration on authentication endpoints.
 *
 * SECURITY: Protects against brute force password attacks
 * SECURITY: Prevents account enumeration
 * SECURITY: Mitigates credential stuffing attacks
 * HIPAA: Implements access control requirements
 *
 * @security Rate limiting for authentication endpoints
 * @security Account lockout mechanism
 * @security Failed attempt tracking
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { RateLimitError } from '../errors/ServiceError';

/**
 * In-memory store for rate limiting
 * TODO: In production, use Redis for distributed rate limiting
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    blockedUntil?: number;
  };
}

const loginAttempts: RateLimitStore = {};
const ipAttempts: RateLimitStore = {};
const failedAttemptsByUser: Map<string, Array<{ timestamp: number; ip: string }>> = new Map();

/**
 * Configuration for rate limiting
 */
export const RATE_LIMIT_CONFIG = {
  // Login attempts per user
  MAX_LOGIN_ATTEMPTS_PER_USER: 5,
  USER_LOCKOUT_DURATION_MS: 30 * 60 * 1000, // 30 minutes
  USER_WINDOW_MS: 15 * 60 * 1000, // 15 minute window

  // Login attempts per IP
  MAX_LOGIN_ATTEMPTS_PER_IP: 10,
  IP_LOCKOUT_DURATION_MS: 60 * 60 * 1000, // 1 hour
  IP_WINDOW_MS: 15 * 60 * 1000, // 15 minute window

  // Exponential backoff
  ENABLE_EXPONENTIAL_BACKOFF: true,
  BASE_DELAY_MS: 1000, // 1 second
  MAX_DELAY_MS: 60000, // 1 minute
};

/**
 * Extract client IP address from request
 * Handles proxy headers (X-Forwarded-For, X-Real-IP)
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];

  if (typeof forwarded === 'string') {
    // X-Forwarded-For can contain multiple IPs, take the first
    return forwarded.split(',')[0].trim();
  }

  if (typeof realIP === 'string') {
    return realIP;
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Clean up expired entries from rate limit stores
 * Should be called periodically to prevent memory leaks
 */
function cleanupExpiredEntries(store: RateLimitStore, now: number): void {
  Object.keys(store).forEach(key => {
    const entry = store[key];
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      delete store[key];
    }
  });
}

/**
 * Calculate delay for exponential backoff based on attempt count
 */
function calculateBackoffDelay(attemptCount: number): number {
  if (!RATE_LIMIT_CONFIG.ENABLE_EXPONENTIAL_BACKOFF) {
    return 0;
  }

  const delay = RATE_LIMIT_CONFIG.BASE_DELAY_MS * Math.pow(2, attemptCount - 1);
  return Math.min(delay, RATE_LIMIT_CONFIG.MAX_DELAY_MS);
}

/**
 * Rate limiter middleware for login endpoints
 *
 * Tracks attempts by both user email and IP address
 * Implements account lockout and IP blocking
 * Logs all failed attempts for security monitoring
 *
 * @example
 * app.post('/api/auth/login', loginRateLimiter, loginHandler);
 */
export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  const clientIP = getClientIP(req);
  const email = req.body?.email?.toLowerCase();

  // Clean up old entries periodically (1% chance per request)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries(loginAttempts, now);
    cleanupExpiredEntries(ipAttempts, now);
  }

  // Check IP-based rate limit
  const ipKey = `ip:${clientIP}`;
  const ipLimit = ipAttempts[ipKey];

  if (ipLimit) {
    // Check if IP is blocked
    if (ipLimit.blockedUntil && ipLimit.blockedUntil > now) {
      const retryAfterSeconds = Math.ceil((ipLimit.blockedUntil - now) / 1000);

      logger.warn('IP blocked due to excessive login attempts', {
        ip: clientIP,
        blockedUntil: new Date(ipLimit.blockedUntil).toISOString(),
        retryAfterSeconds
      });

      throw new RateLimitError(
        'Too many login attempts from this IP address. Please try again later.',
        retryAfterSeconds
      );
    }

    // Check if within window and over limit
    if (ipLimit.resetTime > now && ipLimit.count >= RATE_LIMIT_CONFIG.MAX_LOGIN_ATTEMPTS_PER_IP) {
      // Block the IP
      ipLimit.blockedUntil = now + RATE_LIMIT_CONFIG.IP_LOCKOUT_DURATION_MS;
      const retryAfterSeconds = Math.ceil(RATE_LIMIT_CONFIG.IP_LOCKOUT_DURATION_MS / 1000);

      logger.warn('IP blocked - rate limit exceeded', {
        ip: clientIP,
        attempts: ipLimit.count,
        blockedUntil: new Date(ipLimit.blockedUntil).toISOString()
      });

      throw new RateLimitError(
        'Too many login attempts. Please try again later.',
        retryAfterSeconds
      );
    }

    // Reset if window expired
    if (ipLimit.resetTime < now) {
      ipLimit.count = 0;
      ipLimit.resetTime = now + RATE_LIMIT_CONFIG.IP_WINDOW_MS;
    }
  } else {
    // Initialize IP tracking
    ipAttempts[ipKey] = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.IP_WINDOW_MS
    };
  }

  // Check user-based rate limit (if email provided)
  if (email) {
    const userKey = `user:${email}`;
    const userLimit = loginAttempts[userKey];

    if (userLimit) {
      // Check if user account is locked
      if (userLimit.blockedUntil && userLimit.blockedUntil > now) {
        const retryAfterSeconds = Math.ceil((userLimit.blockedUntil - now) / 1000);
        const backoffDelay = calculateBackoffDelay(userLimit.count);

        logger.warn('User account temporarily locked', {
          email,
          ip: clientIP,
          attempts: userLimit.count,
          blockedUntil: new Date(userLimit.blockedUntil).toISOString(),
          retryAfterSeconds
        });

        // Apply exponential backoff delay
        if (backoffDelay > 0) {
          setTimeout(() => {
            throw new RateLimitError(
              'Account temporarily locked due to multiple failed login attempts. Please try again later.',
              retryAfterSeconds
            );
          }, backoffDelay);
          return;
        }

        throw new RateLimitError(
          'Account temporarily locked due to multiple failed login attempts. Please try again later.',
          retryAfterSeconds
        );
      }

      // Check if within window and over limit
      if (userLimit.resetTime > now && userLimit.count >= RATE_LIMIT_CONFIG.MAX_LOGIN_ATTEMPTS_PER_USER) {
        // Lock the account
        userLimit.blockedUntil = now + RATE_LIMIT_CONFIG.USER_LOCKOUT_DURATION_MS;
        const retryAfterSeconds = Math.ceil(RATE_LIMIT_CONFIG.USER_LOCKOUT_DURATION_MS / 1000);

        logger.warn('User account locked - rate limit exceeded', {
          email,
          ip: clientIP,
          attempts: userLimit.count,
          blockedUntil: new Date(userLimit.blockedUntil).toISOString()
        });

        throw new RateLimitError(
          'Too many failed login attempts. Account temporarily locked.',
          retryAfterSeconds
        );
      }

      // Reset if window expired
      if (userLimit.resetTime < now) {
        userLimit.count = 0;
        userLimit.resetTime = now + RATE_LIMIT_CONFIG.USER_WINDOW_MS;
      }
    } else {
      // Initialize user tracking
      loginAttempts[userKey] = {
        count: 0,
        resetTime: now + RATE_LIMIT_CONFIG.USER_WINDOW_MS
      };
    }
  }

  // Increment attempt counters
  ipAttempts[ipKey].count++;
  if (email) {
    loginAttempts[`user:${email}`].count++;
  }

  // Store original response.json to intercept login result
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    // If login was successful, reset counters
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (email) {
        const userKey = `user:${email}`;
        delete loginAttempts[userKey];

        // Clear failed attempt history
        failedAttemptsByUser.delete(email);

        logger.info('Successful login - counters reset', {
          email,
          ip: clientIP
        });
      }
    } else {
      // Login failed - track the failed attempt
      if (email) {
        if (!failedAttemptsByUser.has(email)) {
          failedAttemptsByUser.set(email, []);
        }

        const attempts = failedAttemptsByUser.get(email)!;
        attempts.push({ timestamp: now, ip: clientIP });

        // Keep only last 24 hours of attempts
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        failedAttemptsByUser.set(
          email,
          attempts.filter(a => a.timestamp > oneDayAgo)
        );

        logger.warn('Failed login attempt', {
          email,
          ip: clientIP,
          attemptCount: loginAttempts[`user:${email}`]?.count || 0,
          recentFailures: attempts.length
        });
      }
    }

    return originalJson(body);
  };

  next();
}

/**
 * Get failed login attempt history for a user
 * Used for security monitoring and alerts
 */
export function getFailedAttempts(email: string): Array<{ timestamp: number; ip: string }> {
  return failedAttemptsByUser.get(email.toLowerCase()) || [];
}

/**
 * Manually clear rate limit for a user (admin function)
 * Use case: Admin unlocks a legitimately locked account
 */
export function clearUserRateLimit(email: string): void {
  const userKey = `user:${email.toLowerCase()}`;
  delete loginAttempts[userKey];
  failedAttemptsByUser.delete(email.toLowerCase());

  logger.info('User rate limit manually cleared', { email });
}

/**
 * Manually clear rate limit for an IP (admin function)
 * Use case: Admin unlocks a legitimate IP that was blocked
 */
export function clearIPRateLimit(ip: string): void {
  const ipKey = `ip:${ip}`;
  delete ipAttempts[ipKey];

  logger.info('IP rate limit manually cleared', { ip });
}

/**
 * Get rate limit status for monitoring
 */
export function getRateLimitStats(): {
  totalLockedUsers: number;
  totalBlockedIPs: number;
  recentFailedAttempts: number;
} {
  const now = Date.now();

  const lockedUsers = Object.values(loginAttempts).filter(
    entry => entry.blockedUntil && entry.blockedUntil > now
  ).length;

  const blockedIPs = Object.values(ipAttempts).filter(
    entry => entry.blockedUntil && entry.blockedUntil > now
  ).length;

  const recentFailures = Array.from(failedAttemptsByUser.values()).reduce(
    (total, attempts) => total + attempts.length,
    0
  );

  return {
    totalLockedUsers: lockedUsers,
    totalBlockedIPs: blockedIPs,
    recentFailedAttempts: recentFailures
  };
}

/**
 * Simplified rate limiter for general API endpoints
 * Less strict than login rate limiter
 */
export function apiRateLimiter(
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
) {
  const requests: RateLimitStore = {};

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const clientIP = getClientIP(req);
    const key = `api:${clientIP}`;

    // Clean up periodically
    if (Math.random() < 0.01) {
      cleanupExpiredEntries(requests, now);
    }

    const limit = requests[key];

    if (limit) {
      // Reset if window expired
      if (limit.resetTime < now) {
        limit.count = 1;
        limit.resetTime = now + windowMs;
      } else if (limit.count >= maxRequests) {
        const retryAfterSeconds = Math.ceil((limit.resetTime - now) / 1000);

        logger.warn('API rate limit exceeded', {
          ip: clientIP,
          path: req.path,
          method: req.method,
          attempts: limit.count
        });

        throw new RateLimitError(
          'Too many requests. Please try again later.',
          retryAfterSeconds
        );
      } else {
        limit.count++;
      }
    } else {
      requests[key] = {
        count: 1,
        resetTime: now + windowMs
      };
    }

    next();
  };
}
