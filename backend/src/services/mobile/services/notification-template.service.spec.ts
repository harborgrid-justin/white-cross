import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationTemplateService } from './notification-template.service';
import { LoggerService } from '../../../common/logging/logger.service';
import {
  NotificationCategory,
  NotificationPlatform,
  NotificationPriority,
} from '../enums';

describe('NotificationTemplateService', () => {
  let service: NotificationTemplateService;
  let loggerService: jest.Mocked<LoggerService>;

  const mockLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationTemplateService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<NotificationTemplateService>(
      NotificationTemplateService,
    );
    loggerService = module.get(LoggerService);

    await service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize templates on module startup', async () => {
      const templates = service.getAllTemplates();
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should load default templates', async () => {
      const medicationTemplate = service.getTemplate('medication-reminder');
      expect(medicationTemplate).toBeDefined();
      expect(medicationTemplate.category).toBe(NotificationCategory.MEDICATION);
    });

    it('should handle initialization errors gracefully', async () => {
      const newService = new NotificationTemplateService(loggerService);

      await expect(newService.onModuleInit()).resolves.not.toThrow();
    });
  });

  describe('getTemplate', () => {
    it('should retrieve a template by id', () => {
      const template = service.getTemplate('medication-reminder');

      expect(template).toBeDefined();
      expect(template.id).toBe('medication-reminder');
      expect(template.category).toBe(NotificationCategory.MEDICATION);
      expect(template.title).toBe('Medication Reminder');
      expect(template.variables).toContain('medicationName');
      expect(template.variables).toContain('dosage');
    });

    it('should throw NotFoundException for non-existent template', () => {
      expect(() => service.getTemplate('non-existent')).toThrow(
        NotFoundException,
      );
      expect(() => service.getTemplate('non-existent')).toThrow(
        'Template not found: non-existent',
      );
    });

    it('should retrieve appointment template', () => {
      const template = service.getTemplate('appointment-reminder');

      expect(template.category).toBe(NotificationCategory.APPOINTMENT);
      expect(template.variables).toContain('providerName');
      expect(template.variables).toContain('time');
    });

    it('should retrieve incident template with critical priority', () => {
      const template = service.getTemplate('incident-alert');

      expect(template.category).toBe(NotificationCategory.INCIDENT);
      expect(template.priority).toBe(NotificationPriority.CRITICAL);
      expect(template.sound).toBe('emergency_alert.wav');
    });

    it('should handle empty template id', () => {
      expect(() => service.getTemplate('')).toThrow(NotFoundException);
    });
  });

  describe('getAllTemplates', () => {
    it('should return all loaded templates', () => {
      const templates = service.getAllTemplates();

      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.every((t) => t.id && t.category && t.title)).toBe(true);
    });

    it('should include all default templates', () => {
      const templates = service.getAllTemplates();
      const ids = templates.map((t) => t.id);

      expect(ids).toContain('medication-reminder');
      expect(ids).toContain('appointment-reminder');
      expect(ids).toContain('incident-alert');
      expect(ids).toContain('screening-due');
      expect(ids).toContain('immunization-reminder');
    });

    it('should return array even if templates are empty', () => {
      const newService = new NotificationTemplateService(loggerService);
      const templates = newService.getAllTemplates();

      expect(templates).toBeInstanceOf(Array);
      expect(templates).toHaveLength(0);
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should retrieve templates by medication category', () => {
      const templates = service.getTemplatesByCategory(
        NotificationCategory.MEDICATION,
      );

      expect(templates.length).toBeGreaterThan(0);
      expect(
        templates.every((t) => t.category === NotificationCategory.MEDICATION),
      ).toBe(true);
    });

    it('should retrieve templates by appointment category', () => {
      const templates = service.getTemplatesByCategory(
        NotificationCategory.APPOINTMENT,
      );

      expect(templates.length).toBeGreaterThan(0);
      expect(
        templates.every(
          (t) => t.category === NotificationCategory.APPOINTMENT,
        ),
      ).toBe(true);
    });

    it('should return empty array for category with no templates', () => {
      const templates = service.getTemplatesByCategory(
        'NON_EXISTENT' as NotificationCategory,
      );

      expect(templates).toEqual([]);
      expect(templates).toHaveLength(0);
    });

    it('should retrieve incident templates', () => {
      const templates = service.getTemplatesByCategory(
        NotificationCategory.INCIDENT,
      );

      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((t) => {
        expect(t.category).toBe(NotificationCategory.INCIDENT);
      });
    });
  });

  describe('renderTemplate', () => {
    it('should render template with variable substitution', () => {
      const { title, body } = service.renderTemplate('medication-reminder', {
        medicationName: 'Aspirin',
        dosage: '100mg',
      });

      expect(title).toBe('Medication Reminder');
      expect(body).toBe('Time to take Aspirin - 100mg');
    });

    it('should render appointment template', () => {
      const { title, body } = service.renderTemplate('appointment-reminder', {
        providerName: 'Dr. Smith',
        time: '2:00 PM',
      });

      expect(title).toBe('Appointment Reminder');
      expect(body).toBe('Your appointment with Dr. Smith is at 2:00 PM');
    });

    it('should handle multiple occurrences of same variable', () => {
      service.addTemplate({
        id: 'test-multi',
        category: NotificationCategory.MEDICATION,
        title: 'Test {{var}}',
        body: 'First {{var}}, second {{var}}, third {{var}}',
        variables: ['var'],
      });

      const { body } = service.renderTemplate('test-multi', { var: 'TEST' });

      expect(body).toBe('First TEST, second TEST, third TEST');
    });

    it('should handle missing variables gracefully', () => {
      const { title, body } = service.renderTemplate('medication-reminder', {
        medicationName: 'Aspirin',
      });

      expect(title).toBe('Medication Reminder');
      expect(body).toContain('Aspirin');
      expect(body).toContain('{{dosage}}');
    });

    it('should throw NotFoundException for invalid template id', () => {
      expect(() =>
        service.renderTemplate('non-existent', { test: 'value' }),
      ).toThrow(NotFoundException);
    });

    it('should handle empty variables object', () => {
      const { body } = service.renderTemplate('medication-reminder', {});

      expect(body).toContain('{{medicationName}}');
      expect(body).toContain('{{dosage}}');
    });

    it('should render incident alert template', () => {
      const { title, body } = service.renderTemplate('incident-alert', {
        incidentType: 'Fall',
        studentName: 'John Doe',
      });

      expect(title).toBe('Incident Alert');
      expect(body).toBe('New incident reported: Fall - John Doe');
    });
  });

  describe('validateTemplateVariables', () => {
    it('should validate complete set of variables', () => {
      const result = service.validateTemplateVariables('medication-reminder', {
        medicationName: 'Aspirin',
        dosage: '100mg',
      });

      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('should identify missing variables', () => {
      const result = service.validateTemplateVariables('medication-reminder', {
        medicationName: 'Aspirin',
      });

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('dosage');
      expect(result.missing).toHaveLength(1);
    });

    it('should identify all missing variables', () => {
      const result = service.validateTemplateVariables(
        'medication-reminder',
        {},
      );

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('medicationName');
      expect(result.missing).toContain('dosage');
      expect(result.missing).toHaveLength(2);
    });

    it('should handle extra variables gracefully', () => {
      const result = service.validateTemplateVariables('medication-reminder', {
        medicationName: 'Aspirin',
        dosage: '100mg',
        extraVar: 'extra',
      });

      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('should throw NotFoundException for invalid template', () => {
      expect(() =>
        service.validateTemplateVariables('non-existent', {}),
      ).toThrow(NotFoundException);
    });

    it('should handle empty string values as missing', () => {
      const result = service.validateTemplateVariables('medication-reminder', {
        medicationName: '',
        dosage: '100mg',
      });

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('medicationName');
    });
  });

  describe('addTemplate', () => {
    it('should add a new template', () => {
      const newTemplate = {
        id: 'custom-template',
        category: NotificationCategory.MEDICATION,
        title: 'Custom Template',
        body: 'This is a {{custom}} template',
        variables: ['custom'],
      };

      service.addTemplate(newTemplate);

      const retrieved = service.getTemplate('custom-template');
      expect(retrieved).toEqual(newTemplate);
    });

    it('should update an existing template', () => {
      const updatedTemplate = {
        id: 'medication-reminder',
        category: NotificationCategory.MEDICATION,
        title: 'Updated Title',
        body: 'Updated body with {{medicationName}}',
        variables: ['medicationName'],
      };

      service.addTemplate(updatedTemplate);

      const retrieved = service.getTemplate('medication-reminder');
      expect(retrieved.title).toBe('Updated Title');
      expect(retrieved.body).toBe('Updated body with {{medicationName}}');
    });

    it('should add template with platform and priority', () => {
      const template = {
        id: 'platform-specific',
        category: NotificationCategory.MEDICATION,
        title: 'Platform Template',
        body: 'Platform test',
        variables: [],
        platform: NotificationPlatform.FCM,
        priority: NotificationPriority.HIGH,
      };

      service.addTemplate(template);

      const retrieved = service.getTemplate('platform-specific');
      expect(retrieved.platform).toBe(NotificationPlatform.FCM);
      expect(retrieved.priority).toBe(NotificationPriority.HIGH);
    });
  });

  describe('removeTemplate', () => {
    it('should remove an existing template', () => {
      service.addTemplate({
        id: 'temp-template',
        category: NotificationCategory.MEDICATION,
        title: 'Temporary',
        body: 'Temporary template',
        variables: [],
      });

      const removed = service.removeTemplate('temp-template');

      expect(removed).toBe(true);
      expect(() => service.getTemplate('temp-template')).toThrow(
        NotFoundException,
      );
    });

    it('should return false for non-existent template', () => {
      const removed = service.removeTemplate('non-existent');

      expect(removed).toBe(false);
    });

    it('should not affect other templates when removing one', () => {
      const beforeCount = service.getAllTemplates().length;

      service.addTemplate({
        id: 'temp-template',
        category: NotificationCategory.MEDICATION,
        title: 'Temporary',
        body: 'Temporary template',
        variables: [],
      });

      service.removeTemplate('temp-template');

      const afterCount = service.getAllTemplates().length;
      expect(afterCount).toBe(beforeCount);
    });

    it('should allow re-adding a removed template', () => {
      const template = {
        id: 'removable',
        category: NotificationCategory.MEDICATION,
        title: 'Removable',
        body: 'Test',
        variables: [],
      };

      service.addTemplate(template);
      service.removeTemplate('removable');
      service.addTemplate(template);

      const retrieved = service.getTemplate('removable');
      expect(retrieved).toEqual(template);
    });
  });
});
