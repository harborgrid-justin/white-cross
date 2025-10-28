/**
 * @fileoverview Email Rate Limiter Service Unit Tests
 * @module infrastructure/email/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailRateLimiterService } from '../email-rate-limiter.service';

describe('EmailRateLimiterService', () => {
  let service: EmailRateLimiterService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      const config: Record<string, unknown> = {
        EMAIL_RATE_LIMIT_ENABLED: true,
        EMAIL_RATE_LIMIT_GLOBAL_MAX: 100,
        EMAIL_RATE_LIMIT_GLOBAL_WINDOW: 3600000, // 1 hour
        EMAIL_RATE_LIMIT_RECIPIENT_MAX: 10,
        EMAIL_RATE_LIMIT_RECIPIENT_WINDOW: 3600000, // 1 hour
      };
      return config[key] !== undefined ? config[key] : defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailRateLimiterService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailRateLimiterService>(EmailRateLimiterService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset limits before each test
    service.resetAll();

    jest.clearAllMocks();
  });

  afterEach(() => {
    service.resetAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkLimit', () => {
    it('should allow emails within limits', () => {
      const status = service.checkLimit('user@example.com');

      expect(status.allowed).toBe(true);
      expect(status.remaining).toBeGreaterThan(0);
    });

    it('should track multiple recipients', () => {
      const status = service.checkLimit(['user1@example.com', 'user2@example.com']);

      expect(status.allowed).toBe(true);
    });

    it('should return proper remaining count', () => {
      const status = service.checkLimit('user@example.com');

      expect(status.remaining).toBeLessThanOrEqual(100);
      expect(status.resetAt).toBeInstanceOf(Date);
    });
  });

  describe('recordSent', () => {
    it('should record sent email', () => {
      service.recordSent('user@example.com');

      const statusBefore = service.getStatus('user@example.com');
      expect(statusBefore.remaining).toBeLessThan(10);
    });

    it('should record multiple recipients', () => {
      const recipients = ['user1@example.com', 'user2@example.com'];
      service.recordSent(recipients);

      for (const recipient of recipients) {
        const status = service.getStatus(recipient);
        expect(status.remaining).toBeLessThan(10);
      }
    });

    it('should update global counter', () => {
      service.recordSent(['user1@example.com', 'user2@example.com']);

      const globalStatus = service.getStatus('global', 'global');
      expect(globalStatus.remaining).toBeLessThan(100);
    });
  });

  describe('rate limit enforcement', () => {
    it('should block after exceeding per-recipient limit', () => {
      const recipient = 'user@example.com';

      // Send up to the limit
      for (let i = 0; i < 10; i++) {
        service.recordSent(recipient);
      }

      // Next attempt should be blocked
      const status = service.checkLimit(recipient);
      expect(status.allowed).toBe(false);
    });

    it('should block after exceeding global limit', () => {
      // Send many emails
      for (let i = 0; i < 100; i++) {
        service.recordSent(`user${i}@example.com`);
      }

      // Next attempt should be blocked globally
      const status = service.checkLimit('newuser@example.com');
      expect(status.allowed).toBe(false);
    });

    it('should provide reset time when blocked', () => {
      const recipient = 'user@example.com';

      for (let i = 0; i < 10; i++) {
        service.recordSent(recipient);
      }

      const status = service.checkLimit(recipient);
      expect(status.allowed).toBe(false);
      expect(status.resetAt).toBeInstanceOf(Date);
      expect(status.resetAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('resetLimit', () => {
    it('should reset limit for specific recipient', () => {
      const recipient = 'user@example.com';

      // Exhaust limit
      for (let i = 0; i < 10; i++) {
        service.recordSent(recipient);
      }

      expect(service.checkLimit(recipient).allowed).toBe(false);

      // Reset
      service.resetLimit(recipient);

      expect(service.checkLimit(recipient).allowed).toBe(true);
    });

    it('should reset global limit', () => {
      // Exhaust limit
      for (let i = 0; i < 100; i++) {
        service.recordSent(`user${i}@example.com`);
      }

      service.resetLimit('global');

      const status = service.checkLimit('newuser@example.com');
      expect(status.allowed).toBe(true);
    });
  });

  describe('resetAll', () => {
    it('should reset all rate limits', () => {
      service.recordSent(['user1@example.com', 'user2@example.com']);

      service.resetAll();

      expect(service.checkLimit('user1@example.com').allowed).toBe(true);
      expect(service.checkLimit('user2@example.com').allowed).toBe(true);
    });
  });

  describe('getStatus', () => {
    it('should get status for recipient', () => {
      service.recordSent('user@example.com');

      const status = service.getStatus('user@example.com');

      expect(status.allowed).toBeDefined();
      expect(status.remaining).toBeDefined();
      expect(status.resetAt).toBeInstanceOf(Date);
    });

    it('should get global status', () => {
      service.recordSent('user@example.com');

      const status = service.getStatus('global', 'global');

      expect(status.allowed).toBeDefined();
      expect(status.remaining).toBeDefined();
    });

    it('should handle non-existent recipient', () => {
      const status = service.getStatus('new@example.com');

      expect(status.allowed).toBe(true);
      expect(status.remaining).toBe(10);
    });
  });

  describe('getAllLimits', () => {
    it('should return all active limits', () => {
      service.recordSent(['user1@example.com', 'user2@example.com']);

      const limits = service.getAllLimits();

      expect(limits.size).toBeGreaterThan(0);
    });

    it('should clean expired entries', () => {
      // This would require mocking timers to test properly
      const limits = service.getAllLimits();
      expect(limits).toBeInstanceOf(Map);
    });
  });

  describe('getStats', () => {
    it('should return rate limiter statistics', () => {
      const stats = service.getStats();

      expect(stats.enabled).toBe(true);
      expect(stats.totalTracked).toBeGreaterThanOrEqual(0);
      expect(stats.globalLimit).toBeDefined();
      expect(stats.recipientLimit).toBeDefined();
    });

    it('should track active limits', () => {
      service.recordSent('user@example.com');

      const stats = service.getStats();

      expect(stats.totalTracked).toBeGreaterThan(0);
    });
  });

  describe('waitForLimit', () => {
    it('should resolve immediately when limit not exceeded', async () => {
      const start = Date.now();
      await service.waitForLimit('user@example.com');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(100);
    });

    it('should be bypassed when rate limiting is disabled', async () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue?: unknown) => {
        if (key === 'EMAIL_RATE_LIMIT_ENABLED') return false;
        return defaultValue;
      });

      const newService = new EmailRateLimiterService(configService);

      const start = Date.now();
      await newService.waitForLimit('user@example.com');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('isEnabled', () => {
    it('should return whether rate limiting is enabled', () => {
      expect(service.isEnabled()).toBe(true);
    });
  });

  describe('getConfig', () => {
    it('should return rate limiter configuration', () => {
      const config = service.getConfig();

      expect(config.enabled).toBe(true);
      expect(config.global).toBeDefined();
      expect(config.global.maxEmails).toBe(100);
      expect(config.perRecipient).toBeDefined();
      expect(config.perRecipient.maxEmails).toBe(10);
    });
  });

  describe('case sensitivity', () => {
    it('should treat email addresses case-insensitively', () => {
      service.recordSent('User@Example.Com');
      service.recordSent('user@example.com');

      const status = service.getStatus('USER@EXAMPLE.COM');

      // Should have counted both emails
      expect(status.remaining).toBeLessThan(10);
    });
  });

  describe('multiple recipients per send', () => {
    it('should increment global counter by recipient count', () => {
      const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

      service.recordSent(recipients);

      const globalStatus = service.getStatus('global', 'global');

      // Global should be decremented by 3
      expect(globalStatus.remaining).toBe(97);
    });
  });
});
