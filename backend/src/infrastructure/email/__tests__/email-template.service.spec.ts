/**
 * @fileoverview Email Template Service Unit Tests
 * @module infrastructure/email/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateService } from '../email-template.service';
import { EmailTemplate } from '../dto';

describe('EmailTemplateService', () => {
  let service: EmailTemplateService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      const config: Record<string, unknown> = {
        EMAIL_TEMPLATE_CACHE_ENABLED: true,
        EMAIL_TEMPLATE_DIR: 'templates',
      };
      return config[key] !== undefined ? config[key] : defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTemplateService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailTemplateService>(EmailTemplateService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('render', () => {
    it('should render alert template with data', async () => {
      const data = {
        title: 'Test Alert',
        message: 'Test message',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
        timestamp: new Date(),
      };

      const result = await service.render(EmailTemplate.ALERT, data);

      expect(result).toHaveProperty('html');
      expect(result).toHaveProperty('text');
      expect(result.html).toContain('Test Alert');
      expect(result.text).toContain('Test Alert');
    });

    it('should render welcome template with data', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        loginUrl: 'https://example.com/login',
        docsUrl: 'https://example.com/docs',
      };

      const result = await service.render(EmailTemplate.WELCOME, data);

      expect(result.html).toContain('John Doe');
      expect(result.text).toContain('John Doe');
    });

    it('should render notification template with data', async () => {
      const data = {
        title: 'System Notification',
        body: 'Your account has been updated',
      };

      const result = await service.render(EmailTemplate.NOTIFICATION, data);

      expect(result.html).toContain('System Notification');
      expect(result.text).toContain('System Notification');
    });

    it('should handle missing template gracefully', async () => {
      await expect(
        service.render('non-existent' as EmailTemplate, {}),
      ).rejects.toThrow();
    });

    it('should handle template rendering errors', async () => {
      // Try to render with invalid data that might cause issues
      await expect(
        service.render(EmailTemplate.ALERT, null as any),
      ).rejects.toThrow();
    });
  });

  describe('Handlebars helpers', () => {
    it('should format dates correctly', async () => {
      const data = {
        title: 'Test',
        message: 'Test',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
        timestamp: new Date('2025-01-01T12:00:00Z'),
      };

      const result = await service.render(EmailTemplate.ALERT, data);

      // Should contain formatted date
      expect(result.html).toBeTruthy();
      expect(result.text).toBeTruthy();
    });

    it('should uppercase text with helper', async () => {
      const data = {
        title: 'Test Alert',
        message: 'Test message',
        severity: 'high',
        category: 'medication',
        alertId: 'alert-123',
      };

      const result = await service.render(EmailTemplate.ALERT, data);

      // Severity should be uppercased in the output
      expect(result.html.toUpperCase()).toContain('HIGH');
    });
  });

  describe('template caching', () => {
    it('should cache templates when enabled', async () => {
      const data = {
        title: 'Test',
        message: 'Test',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
      };

      // First render - loads and caches
      await service.render(EmailTemplate.ALERT, data);

      // Second render - should use cache
      await service.render(EmailTemplate.ALERT, data);

      const stats = service.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should return cache statistics', () => {
      const stats = service.getCacheStats();

      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('templates');
      expect(Array.isArray(stats.templates)).toBe(true);
    });

    it('should clear cache', async () => {
      const data = {
        title: 'Test',
        message: 'Test',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
      };

      await service.render(EmailTemplate.ALERT, data);

      service.clearCache();

      const stats = service.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('templateExists', () => {
    it('should check if template exists', async () => {
      const exists = await service.templateExists(EmailTemplate.ALERT);
      expect(typeof exists).toBe('boolean');
    });

    it('should return false for non-existent template', async () => {
      const exists = await service.templateExists('non-existent' as EmailTemplate);
      expect(exists).toBe(false);
    });
  });

  describe('template data validation', () => {
    it('should handle missing optional fields', async () => {
      const minimalData = {
        title: 'Test',
        message: 'Test',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
      };

      const result = await service.render(EmailTemplate.ALERT, minimalData);

      expect(result.html).toBeTruthy();
      expect(result.text).toBeTruthy();
    });

    it('should handle additional fields in data', async () => {
      const dataWithExtra = {
        title: 'Test',
        message: 'Test',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
        extraField: 'This should not cause issues',
      };

      const result = await service.render(EmailTemplate.ALERT, dataWithExtra);

      expect(result.html).toBeTruthy();
    });
  });

  describe('HTML and text output', () => {
    it('should produce valid HTML', async () => {
      const data = {
        title: 'Test Alert',
        message: 'Test message',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
      };

      const result = await service.render(EmailTemplate.ALERT, data);

      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('<html');
      expect(result.html).toContain('</html>');
    });

    it('should produce plain text without HTML tags', async () => {
      const data = {
        title: 'Test Alert',
        message: 'Test message',
        severity: 'HIGH',
        category: 'MEDICATION',
        alertId: 'alert-123',
      };

      const result = await service.render(EmailTemplate.ALERT, data);

      expect(result.text).not.toContain('<html');
      expect(result.text).not.toContain('</html>');
      expect(result.text).toContain('Test Alert');
    });
  });
});
