/**
 * @fileoverview SMS Template Service
 * @module infrastructure/s@/services/sms-template.service
 * @description Manages SMS templates with variable substitution
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSmsTemplateDto, SmsTemplateType } from '../dto/sms-template.dto';

import { BaseService } from '@/common/base';
/**
 * SMS Template interface
 */
interface SmsTemplate {
  templateId: string;
  type: SmsTemplateType;
  content: string;
  description?: string;
  requiredVariables: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SMS Template Service
 * Provides template management and variable substitution for SMS messages
 */
@Injectable()
export class SmsTemplateService extends BaseService {
  private readonly templates: Map<string, SmsTemplate> = new Map();

  constructor() {
    super('SmsTemplateService');
    // Initialize with default templates
    this.initializeDefaultTemplates();
  }

  /**
   * Create or update an SMS template
   *
   * @param dto - Template creation DTO
   * @returns Created template
   *
   * @example
   * ```typescript
   * await templateService.createTemplate({
   *   templateId: 'medication-reminder',
   *   type: SmsTemplateType.REMINDER,
   *   content: 'Hi {{studentName}}, time for {{medicationName}} at {{time}}',
   *   requiredVariables: ['studentName', 'medicationName', 'time']
   * });
   * ```
   */
  async createTemplate(dto: CreateSmsTemplateDto): Promise<SmsTemplate> {
    // Extract variables from template content
    const detectedVariables = this.extractVariables(dto.content);

    // Validate required variables match detected variables
    const requiredVars = dto.requiredVariables || detectedVariables;
    const missingVars = requiredVars.filter(
      (v) => !detectedVariables.includes(v),
    );

    if (missingVars.length > 0) {
      throw new BadRequestException(
        `Required variables not found in template content: ${missingVars.join(', ')}`,
      );
    }

    const template: SmsTemplate = {
      templateId: dto.templateId,
      type: dto.type,
      content: dto.content,
      description: dto.description,
      requiredVariables: requiredVars,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.templates.set(dto.templateId, template);
    this.logInfo(`Created SMS template: ${dto.templateId}`);

    return template;
  }

  /**
   * Get template by ID
   *
   * @param templateId - Unique template identifier
   * @returns Template or throws NotFoundException
   */
  async getTemplate(templateId: string): Promise<SmsTemplate> {
    const template = this.templates.get(templateId);

    if (!template) {
      throw new NotFoundException(`SMS template not found: ${templateId}`);
    }

    return template;
  }

  /**
   * Render template with variables
   *
   * @param templateId - Template identifier
   * @param variables - Variables to substitute
   * @returns Rendered SMS message
   * @throws NotFoundException if template not found
   * @throws BadRequestException if required variables missing
   *
   * @example
   * ```typescript
   * const message = await templateService.renderTemplate('medication-reminder', {
   *   studentName: 'John Doe',
   *   medicationName: 'Aspirin',
   *   time: '2:30 PM'
   * });
   * // Returns: 'Hi John Doe, time for Aspirin at 2:30 PM'
   * ```
   */
  async renderTemplate(
    templateId: string,
    variables: Record<string, unknown>,
  ): Promise<string> {
    const template = await this.getTemplate(templateId);

    // Validate all required variables are provided
    const missingVars = template.requiredVariables.filter(
      (varName) => !(varName in variables),
    );

    if (missingVars.length > 0) {
      throw new BadRequestException(
        `Missing required variables for template ${templateId}: ${missingVars.join(', ')}`,
      );
    }

    // Render template by replacing variables
    let rendered = template.content;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const stringValue = this.formatVariableValue(value);
      rendered = rendered.replace(new RegExp(placeholder, 'g'), stringValue);
    }

    // Check for unreplaced variables
    const unreplaced = this.extractVariables(rendered);
    if (unreplaced.length > 0) {
      this.logWarning(
        `Template ${templateId} has unreplaced variables: ${unreplaced.join(', ')}`,
      );
    }

    this.logDebug(`Rendered template ${templateId}: ${rendered}`);
    return rendered;
  }

  /**
   * List all templates
   *
   * @param type - Optional filter by template type
   * @returns Array of templates
   */
  async listTemplates(type?: SmsTemplateType): Promise<SmsTemplate[]> {
    const allTemplates = Array.from(this.templates.values());

    if (type) {
      return allTemplates.filter((t) => t.type === type);
    }

    return allTemplates;
  }

  /**
   * Delete template
   *
   * @param templateId - Template identifier
   * @returns True if deleted, false if not found
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    const deleted = this.templates.delete(templateId);

    if (deleted) {
      this.logInfo(`Deleted SMS template: ${templateId}`);
    }

    return deleted;
  }

  /**
   * Check if template exists
   *
   * @param templateId - Template identifier
   * @returns True if exists
   */
  async templateExists(templateId: string): Promise<boolean> {
    return this.templates.has(templateId);
  }

  /**
   * Validate template content
   *
   * @param content - Template content to validate
   * @returns Validation result with detected variables
   */
  async validateTemplateContent(content: string): Promise<{
    isValid: boolean;
    variables: string[];
    errors: string[];
  }> {
    const errors: string[] = [];
    const variables = this.extractVariables(content);

    // Check for malformed variables (e.g., unclosed braces)
    const openBraces = (content.match(/\{\{/g) || []).length;
    const closeBraces = (content.match(/\}\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push('Malformed template: mismatched variable braces');
    }

    // Check for empty template
    if (!content.trim()) {
      errors.push('Template content cannot be empty');
    }

    // Check for reasonable length (SMS limits)
    if (content.length > 1600) {
      errors.push(
        'Template content exceeds maximum SMS length (1600 characters)',
      );
    }

    return {
      isValid: errors.length === 0,
      variables,
      errors,
    };
  }

  // ==================== Private Helper Methods ====================

  /**
   * Extract variable names from template content
   *
   * @param content - Template content
   * @returns Array of variable names
   * @private
   */
  private extractVariables(content: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  /**
   * Format variable value for template substitution
   *
   * @param value - Variable value
   * @returns Formatted string value
   * @private
   */
  private formatVariableValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      // For dates, format nicely
      if (value instanceof Date) {
        return value.toLocaleString();
      }
      // For other objects, use JSON
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Initialize default SMS templates
   * These are commonly used templates available out-of-the-box
   *
   * @private
   */
  private initializeDefaultTemplates(): void {
    const defaultTemplates: CreateSmsTemplateDto[] = [
      {
        templateId: 'medication-reminder',
        type: SmsTemplateType.REMINDER,
        content:
          'Hi {{studentName}}, reminder: {{medicationName}} at {{time}}. - {{schoolName}}',
        description: 'Medication reminder for students',
        requiredVariables: [
          'studentName',
          'medicationName',
          'time',
          'schoolName',
        ],
      },
      {
        templateId: 'emergency-alert',
        type: SmsTemplateType.EMERGENCY,
        content:
          '[URGENT] {{studentName}} requires immediate attention: {{reason}}. Contact {{contactNumber}}',
        description: 'Emergency alert for critical situations',
        requiredVariables: ['studentName', 'reason', 'contactNumber'],
      },
      {
        templateId: 'appointment-reminder',
        type: SmsTemplateType.REMINDER,
        content:
          'Reminder: {{studentName}} has a {{appointmentType}} appointment on {{date}} at {{time}}',
        description: 'Appointment reminder',
        requiredVariables: ['studentName', 'appointmentType', 'date', 'time'],
      },
      {
        templateId: 'verification-code',
        type: SmsTemplateType.VERIFICATION,
        content:
          'Your White Cross verification code is: {{code}}. Valid for {{expiryMinutes}} minutes.',
        description: 'Verification code for authentication',
        requiredVariables: ['code', 'expiryMinutes'],
      },
      {
        templateId: 'illness-notification',
        type: SmsTemplateType.NOTIFICATION,
        content:
          '{{studentName}} visited the health office today for {{reason}}. {{action}} - {{schoolName}}',
        description: 'Illness notification to parents',
        requiredVariables: ['studentName', 'reason', 'action', 'schoolName'],
      },
      {
        templateId: 'consent-required',
        type: SmsTemplateType.NOTIFICATION,
        content:
          'Consent required for {{studentName}}: {{description}}. Please respond or visit {{portalUrl}}',
        description: 'Parent consent request',
        requiredVariables: ['studentName', 'description', 'portalUrl'],
      },
    ];

    defaultTemplates.forEach((dto) => {
      try {
        this.createTemplate(dto);
      } catch (error) {
        this.logError(
          `Failed to create default template ${dto.templateId}: ${error.message}`,
        );
      }
    });

    this.logInfo(
      `Initialized ${defaultTemplates.length} default SMS templates`,
    );
  }
}
