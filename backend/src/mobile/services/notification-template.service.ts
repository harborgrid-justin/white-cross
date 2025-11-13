import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import {
  NotificationCategory,
  NotificationPlatform,
  NotificationPriority,
} from '../enums';

/**
 * Notification Template Interface
 */
export interface NotificationTemplate {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  variables: string[];
  platform?: NotificationPlatform;
  priority?: NotificationPriority;
  sound?: string;
  actions?: Array<{ label: string; action: string }>;
}

/**
 * Notification Template Service
 *
 * @description
 * Manages notification templates with variable substitution.
 * Templates support {{variable}} syntax for dynamic content replacement.
 *
 * This service provides:
 * - Template loading and caching
 * - Variable substitution
 * - Template validation
 * - Support for multiple notification categories
 *
 * @example
 * ```typescript
 * // Get a template
 * const template = templateService.getTemplate('medication-reminder');
 *
 * // Render with variables
 * const { title, body } = templateService.renderTemplate('medication-reminder', {
 *   medicationName: 'Aspirin',
 *   dosage: '100mg'
 * });
 * ```
 */
@Injectable()
export class NotificationTemplateService implements OnModuleInit {
  private readonly templates: Map<string, NotificationTemplate> = new Map();

  /**
   * Initialize templates on module startup
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.loadTemplates();
      this.logInfo('NotificationTemplateService initialized successfully');
    } catch (error) {
      this.logError('Failed to initialize NotificationTemplateService', error);
    }
  }

  /**
   * Load notification templates
   *
   * @description
   * Loads predefined notification templates for common scenarios.
   * Templates support variable substitution using {{variable}} syntax.
   */
  private async loadTemplates(): Promise<void> {
    // Define default templates
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'medication-reminder',
        category: NotificationCategory.MEDICATION,
        title: 'Medication Reminder',
        body: 'Time to take {{medicationName}} - {{dosage}}',
        variables: ['medicationName', 'dosage'],
        priority: NotificationPriority.HIGH,
        sound: 'medication_alert.wav',
      },
      {
        id: 'appointment-reminder',
        category: NotificationCategory.APPOINTMENT,
        title: 'Appointment Reminder',
        body: 'Your appointment with {{providerName}} is at {{time}}',
        variables: ['providerName', 'time'],
        priority: NotificationPriority.NORMAL,
      },
      {
        id: 'incident-alert',
        category: NotificationCategory.INCIDENT,
        title: 'Incident Alert',
        body: 'New incident reported: {{incidentType}} - {{studentName}}',
        variables: ['incidentType', 'studentName'],
        priority: NotificationPriority.CRITICAL,
        sound: 'emergency_alert.wav',
      },
      {
        id: 'screening-due',
        category: NotificationCategory.SCREENING,
        title: 'Health Screening Due',
        body: '{{screeningType}} screening is due for {{studentName}}',
        variables: ['screeningType', 'studentName'],
        priority: NotificationPriority.NORMAL,
      },
      {
        id: 'immunization-reminder',
        category: NotificationCategory.IMMUNIZATION,
        title: 'Immunization Reminder',
        body: '{{vaccineName}} immunization due on {{dueDate}}',
        variables: ['vaccineName', 'dueDate'],
        priority: NotificationPriority.HIGH,
      },
    ];

    for (const template of defaultTemplates) {
      this.templates.set(template.id, template);
    }

    this.logInfo(`Loaded ${defaultTemplates.length} notification templates`);
  }

  /**
   * Get a notification template by ID
   *
   * @param templateId - The template ID
   * @returns The notification template
   * @throws NotFoundException if template not found
   */
  getTemplate(templateId: string): NotificationTemplate {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new NotFoundException(`Template not found: ${templateId}`);
    }
    return template;
  }

  /**
   * Get all available templates
   *
   * @returns Array of all notification templates
   */
  getAllTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by category
   *
   * @param category - The notification category
   * @returns Array of templates for the specified category
   */
  getTemplatesByCategory(category: NotificationCategory): NotificationTemplate[] {
    return Array.from(this.templates.values()).filter(
      (template) => template.category === category,
    );
  }

  /**
   * Render a template with variables
   *
   * @param templateId - The template ID
   * @param variables - Variable values for substitution
   * @returns Rendered title and body
   *
   * @example
   * ```typescript
   * const { title, body } = templateService.renderTemplate('medication-reminder', {
   *   medicationName: 'Aspirin',
   *   dosage: '100mg'
   * });
   * // Result: title: 'Medication Reminder'
   * //         body: 'Time to take Aspirin - 100mg'
   * ```
   */
  renderTemplate(
    templateId: string,
    variables: Record<string, string>,
  ): { title: string; body: string } {
    const template = this.getTemplate(templateId);

    let title = template.title;
    let body = template.body;

    // Substitute variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    }

    return { title, body };
  }

  /**
   * Validate template variables
   *
   * @param templateId - The template ID
   * @param variables - Variable values to validate
   * @returns Object with validation result and missing variables
   */
  validateTemplateVariables(
    templateId: string,
    variables: Record<string, string>,
  ): { valid: boolean; missing: string[] } {
    const template = this.getTemplate(templateId);
    const missing: string[] = [];

    for (const requiredVar of template.variables) {
      if (!variables[requiredVar]) {
        missing.push(requiredVar);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Add or update a template
   *
   * @param template - The template to add or update
   */
  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template);
    this.logInfo(`Template added/updated: ${template.id}`);
  }

  /**
   * Remove a template
   *
   * @param templateId - The template ID to remove
   * @returns True if template was removed, false if not found
   */
  removeTemplate(templateId: string): boolean {
    const deleted = this.templates.delete(templateId);
    if (deleted) {
      this.logInfo(`Template removed: ${templateId}`);
    }
    return deleted;
  }
}
