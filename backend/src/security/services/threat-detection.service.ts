import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LoginAttemptEntity } from '../entities';
import { SecurityIncidentType, IncidentSeverity } from '../enums';

/**
 * Threat Detection Service
 * Detects various security threats including SQL injection, XSS, brute force, etc.
 */
@Injectable()
export class ThreatDetectionService {
  private readonly logger = new Logger(ThreatDetectionService.name);
  private readonly BRUTE_FORCE_THRESHOLD = 5; // Failed attempts
  private readonly BRUTE_FORCE_WINDOW = 300000; // 5 minutes in milliseconds

  constructor(
    @InjectModel(LoginAttemptEntity)
    private readonly loginAttemptModel: typeof LoginAttemptEntity,
  ) {}

  // Alias for backward compatibility
  private get loginAttemptRepo() {
    return this.loginAttemptModel;
  }

  /**
   * Detect brute force attacks
   */
  async detectBruteForce(
    userId: string,
    ipAddress: string,
  ): Promise<{ detected: boolean; failureCount?: number }> {
    try {
      const windowStart = new Date(Date.now() - this.BRUTE_FORCE_WINDOW);

      const recentFailures = await this.loginAttemptModel.count({
        where: {
          ipAddress,
          success: false,
          createdAt: {
            [Op.gt]: windowStart,
          },
        },
      });

      if (recentFailures >= this.BRUTE_FORCE_THRESHOLD) {
        this.logger.warn('Brute force attack detected', {
          ipAddress,
          userId,
          failureCount: recentFailures,
        });

        return {
          detected: true,
          failureCount: recentFailures,
        };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting brute force', {
        error,
        userId,
        ipAddress,
      });
      return { detected: false };
    }
  }

  /**
   * Detect SQL injection attempts
   */
  async detectSQLInjection(
    input: string,
    context?: { userId?: string; ipAddress?: string },
  ): Promise<{ detected: boolean; patterns?: string[] }> {
    try {
      const sqlPatterns = [
        { pattern: /(\bunion\b.*\bselect\b)/i, name: 'UNION SELECT' },
        { pattern: /(\bor\b.*=.*)/i, name: 'OR condition' },
        { pattern: /(';|";|--|\/\*|\*\/)/, name: 'SQL comment/terminator' },
        {
          pattern: /(\bdrop\b|\bdelete\b|\btruncate\b).*\btable\b/i,
          name: 'DROP/DELETE TABLE',
        },
        { pattern: /(\bexec\b|\bexecute\b).*\(/i, name: 'EXEC statement' },
        {
          pattern: /(\bselect\b.*\bfrom\b.*\bwhere\b)/i,
          name: 'SELECT statement',
        },
      ];

      const matchedPatterns: string[] = [];

      for (const { pattern, name } of sqlPatterns) {
        if (pattern.test(input)) {
          matchedPatterns.push(name);
        }
      }

      if (matchedPatterns.length > 0) {
        this.logger.warn('SQL injection attempt detected', {
          ...context,
          patterns: matchedPatterns,
          input: input.substring(0, 200),
        });

        return {
          detected: true,
          patterns: matchedPatterns,
        };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting SQL injection', { error });
      return { detected: false };
    }
  }

  /**
   * Detect XSS attempts
   */
  async detectXSS(
    input: string,
    context?: { userId?: string; ipAddress?: string },
  ): Promise<{ detected: boolean; patterns?: string[] }> {
    try {
      const xssPatterns = [
        { pattern: /<script\b[^>]*>/i, name: 'Script tag' },
        { pattern: /javascript:/i, name: 'JavaScript protocol' },
        { pattern: /on\w+\s*=\s*['"]/i, name: 'Event handler' },
        { pattern: /<iframe\b[^>]*>/i, name: 'Iframe tag' },
        { pattern: /<embed\b[^>]*>/i, name: 'Embed tag' },
        { pattern: /<object\b[^>]*>/i, name: 'Object tag' },
      ];

      const matchedPatterns: string[] = [];

      for (const { pattern, name } of xssPatterns) {
        if (pattern.test(input)) {
          matchedPatterns.push(name);
        }
      }

      if (matchedPatterns.length > 0) {
        this.logger.warn('XSS attempt detected', {
          ...context,
          patterns: matchedPatterns,
          input: input.substring(0, 200),
        });

        return {
          detected: true,
          patterns: matchedPatterns,
        };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting XSS', { error });
      return { detected: false };
    }
  }

  /**
   * Detect privilege escalation attempts
   */
  async detectPrivilegeEscalation(
    userId: string,
    attemptedAction: string,
    requiredRole: string,
    userRoles: string[],
  ): Promise<{ detected: boolean; reason?: string }> {
    try {
      const hasRequiredRole = userRoles.includes(requiredRole);

      if (!hasRequiredRole) {
        this.logger.warn('Privilege escalation attempt detected', {
          userId,
          attemptedAction,
          requiredRole,
          userRoles,
        });

        return {
          detected: true,
          reason: `User lacks required role: ${requiredRole}`,
        };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting privilege escalation', {
        error,
        userId,
      });
      return { detected: false };
    }
  }

  /**
   * Detect data breach attempts (unusual data access volume)
   */
  async detectDataBreachAttempt(
    userId: string,
    dataType: string,
    volume: number,
    ipAddress?: string,
  ): Promise<{ detected: boolean; threshold?: number }> {
    try {
      // Configurable thresholds by data type
      const thresholds: Record<string, number> = {
        patient_records: 100,
        user_data: 500,
        financial_data: 50,
        default: 1000,
      };

      const threshold = thresholds[dataType] || thresholds.default;

      if (volume > threshold) {
        this.logger.warn('Potential data breach attempt detected', {
          userId,
          ipAddress,
          dataType,
          volume,
          threshold,
        });

        return {
          detected: true,
          threshold,
        };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting data breach attempt', {
        error,
        userId,
      });
      return { detected: false };
    }
  }

  /**
   * Detect path traversal attempts
   */
  async detectPathTraversal(
    input: string,
    context?: { userId?: string; ipAddress?: string },
  ): Promise<{ detected: boolean }> {
    try {
      const pathTraversalPatterns = [
        /\.\.\//,
        /\.\.\\/,
        /%2e%2e%2f/i,
        /%2e%2e\\/i,
      ];

      const detected = pathTraversalPatterns.some((pattern) =>
        pattern.test(input),
      );

      if (detected) {
        this.logger.warn('Path traversal attempt detected', {
          ...context,
          input: input.substring(0, 200),
        });

        return { detected: true };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting path traversal', { error });
      return { detected: false };
    }
  }

  /**
   * Detect command injection attempts
   */
  async detectCommandInjection(
    input: string,
    context?: { userId?: string; ipAddress?: string },
  ): Promise<{ detected: boolean; patterns?: string[] }> {
    try {
      const commandPatterns = [
        {
          pattern: /;.*\b(rm|del|format|shutdown)\b/i,
          name: 'Dangerous command',
        },
        { pattern: /\|.*\b(cat|type|more|less)\b/i, name: 'Command piping' },
        { pattern: /`.*`/, name: 'Command substitution' },
        { pattern: /\$\(.*\)/, name: 'Command substitution' },
        { pattern: /&&|;;\|/, name: 'Command chaining' },
      ];

      const matchedPatterns: string[] = [];

      for (const { pattern, name } of commandPatterns) {
        if (pattern.test(input)) {
          matchedPatterns.push(name);
        }
      }

      if (matchedPatterns.length > 0) {
        this.logger.warn('Command injection attempt detected', {
          ...context,
          patterns: matchedPatterns,
          input: input.substring(0, 200),
        });

        return {
          detected: true,
          patterns: matchedPatterns,
        };
      }

      return { detected: false };
    } catch (error) {
      this.logger.error('Error detecting command injection', { error });
      return { detected: false };
    }
  }

  /**
   * Comprehensive threat scan on input
   */
  async scanInput(
    input: string,
    context?: { userId?: string; ipAddress?: string },
  ): Promise<{
    threats: Array<{ type: string; detected: boolean; details?: any }>;
    safe: boolean;
  }> {
    const threats: Array<{ type: string; detected: boolean; details?: any }> =
      [];

    // SQL Injection
    const sqlResult = await this.detectSQLInjection(input, context);
    threats.push({
      type: 'sql_injection',
      detected: sqlResult.detected,
      details: sqlResult.patterns,
    });

    // XSS
    const xssResult = await this.detectXSS(input, context);
    threats.push({
      type: 'xss',
      detected: xssResult.detected,
      details: xssResult.patterns,
    });

    // Path Traversal
    const pathResult = await this.detectPathTraversal(input, context);
    threats.push({
      type: 'path_traversal',
      detected: pathResult.detected,
    });

    // Command Injection
    const cmdResult = await this.detectCommandInjection(input, context);
    threats.push({
      type: 'command_injection',
      detected: cmdResult.detected,
      details: cmdResult.patterns,
    });

    const safe = !threats.some((t) => t.detected);

    return { threats, safe };
  }

  /**
   * Record login attempt
   */
  async recordLoginAttempt(data: {
    userId?: string;
    username?: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
    metadata?: Record<string, any>;
  }): Promise<LoginAttemptEntity> {
    try {
      const attempt = await this.loginAttemptModel.create(data);
      return attempt;
    } catch (error) {
      this.logger.error('Error recording login attempt', { error });
      throw error;
    }
  }

  /**
   * Get recent failed login attempts
   */
  async getRecentFailedAttempts(
    ipAddress: string,
    windowMs: number = this.BRUTE_FORCE_WINDOW,
  ): Promise<LoginAttemptEntity[]> {
    try {
      const windowStart = new Date(Date.now() - windowMs);

      return await this.loginAttemptModel.findAll({
        where: {
          ipAddress,
          success: false,
          createdAt: {
            [Op.gt]: windowStart,
          },
        },
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      this.logger.error('Error fetching failed attempts', { error, ipAddress });
      return [];
    }
  }
}
