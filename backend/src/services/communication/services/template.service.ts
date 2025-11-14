import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageTemplate } from '@/database/models';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/create-template.dto';

import { BaseService } from '@/common/base';

/**
 * Template rendering result interface
 */
interface RenderedTemplate {
  subject: string;
  content: string;
  renderedVariables: string[];
}

/**
 * Template validation result interface
 */
interface TemplateValidation {
  isValid: boolean;
  errors: string[];
  detectedVariables: string[];
}

@Injectable()
export class TemplateService extends BaseService {
  constructor(
    @InjectModel(MessageTemplate) private templateModel: typeof MessageTemplate,
  ) {
    super("TemplateService");
  }

  /**
   * Create a new message template with variable validation
   */
  async createTemplate(data: CreateTemplateDto & { createdById: string }) {
    this.logInfo(`Creating template: ${data.name}`);

    // Validate template content and extract variables
    const subjectValidation = this.validateTemplateContent(data.subject || '');
    const contentValidation = this.validateTemplateContent(data.content);

    if (!contentValidation.isValid) {
      throw new BadRequestException(`Invalid template content: ${contentValidation.errors.join(', ')}`);
    }

    // Combine detected variables from subject and content
    const allDetectedVariables = [
      ...new Set([...subjectValidation.detectedVariables, ...contentValidation.detectedVariables])
    ];

    // Use detected variables if not explicitly provided
    const variables = data.variables && data.variables.length > 0
      ? data.variables
      : allDetectedVariables;

    const template = await this.templateModel.create({
      name: data.name,
      subject: data.subject,
      content: data.content,
      type: data.type,
      category: data.category,
      variables,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdById: data.createdById,
    } as any);

    this.logInfo(`Template created with ${variables.length} variables: ${variables.join(', ')}`);

    return { template: template.toJSON() };
  }

  /**
   * Get templates with optional filtering
   */
  async getTemplates(type?: string, category?: string, isActive?: boolean) {
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;

    const templates = await this.templateModel.findAll({
      where,
      order: [['name', 'ASC']],
    });

    return {
      templates: templates.map((t) => t.toJSON()),
    };
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string) {
    const template = await this.templateModel.findByPk(id, {
      include: [{ all: true }],
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return { template: template.toJSON() };
  }

  /**
   * Update template with variable re-validation
   */
  async updateTemplate(id: string, data: UpdateTemplateDto) {
    const template = await this.templateModel.findByPk(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // If content is being updated, re-validate and extract variables
    if (data.content) {
      const validation = this.validateTemplateContent(data.content);
      if (!validation.isValid) {
        throw new BadRequestException(`Invalid template content: ${validation.errors.join(', ')}`);
      }

      // Update variables if not explicitly provided
      if (!data.variables) {
        (data as any).variables = validation.detectedVariables;
      }
    }

    await template.update(data as any);

    return { template: template.toJSON() };
  }

  /**
   * Delete (soft delete) template
   */
  async deleteTemplate(id: string) {
    const template = await this.templateModel.findByPk(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await template.destroy();
  }

  /**
   * Render template with provided variables
   * Supports {{variableName}} syntax for variable substitution
   */
  async renderTemplate(
    templateId: string,
    variables: Record<string, any>
  ): Promise<RenderedTemplate> {
    const { template } = await this.getTemplateById(templateId);

    if (!template.isActive) {
      throw new BadRequestException('Cannot render inactive template');
    }

    // Validate all required variables are provided
    const missingVariables = template.variables.filter(
      (varName: string) => !(varName in variables)
    );

    if (missingVariables.length > 0) {
      throw new BadRequestException(
        `Missing required variables: ${missingVariables.join(', ')}`
      );
    }

    // Render subject and content
    const renderedSubject = this.substituteVariables(template.subject || '', variables);
    const renderedContent = this.substituteVariables(template.content, variables);

    // Track which variables were actually used
    const renderedVariables = template.variables.filter((varName: string) =>
      variables.hasOwnProperty(varName)
    );

    this.logInfo(`Template ${template.name} rendered with variables: ${renderedVariables.join(', ')}`);

    return {
      subject: renderedSubject,
      content: renderedContent,
      renderedVariables,
    };
  }

  /**
   * Validate template content for proper syntax
   */
  private validateTemplateContent(content: string): TemplateValidation {
    const errors: string[] = [];
    const detectedVariables: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Template content cannot be empty');
      return { isValid: false, errors, detectedVariables };
    }

    // Check for malformed variable syntax
    const openBraces = (content.match(/\{\{/g) || []).length;
    const closeBraces = (content.match(/\}\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push('Mismatched braces in template variables');
    }

    // Extract variable names using regex
    const variablePattern = /\{\{(\s*[\w.]+\s*)\}\}/g;
    let match: RegExpExecArray | null;

    while ((match = variablePattern.exec(content)) !== null) {
      const varName = match[1].trim();

      // Validate variable name (alphanumeric, dots for nested properties)
      if (!/^[\w.]+$/.test(varName)) {
        errors.push(`Invalid variable name: ${varName}`);
      } else if (!detectedVariables.includes(varName)) {
        detectedVariables.push(varName);
      }
    }

    // Check for invalid variable syntax (single braces, etc.)
    const invalidSyntax = content.match(/\{(?!\{)[^}]*\}(?!\})/g);
    if (invalidSyntax && invalidSyntax.length > 0) {
      errors.push('Found single braces - use {{variableName}} syntax');
    }

    return {
      isValid: errors.length === 0,
      errors,
      detectedVariables,
    };
  }

  /**
   * Substitute variables in template string
   * Supports nested property access (e.g., {{user.firstName}})
   */
  private substituteVariables(
    template: string,
    variables: Record<string, any>
  ): string {
    return template.replace(/\{\{(\s*[\w.]+\s*)\}\}/g, (match, varPath) => {
      const trimmedPath = varPath.trim();

      // Support nested property access
      const value = this.getNestedProperty(variables, trimmedPath);

      if (value === undefined || value === null) {
        this.logWarning(`Variable ${trimmedPath} is null or undefined`);
        return ''; // Replace with empty string
      }

      return this.formatValue(value);
    });
  }

  /**
   * Get nested property from object using dot notation
   * Example: getNestedProperty({user: {name: 'John'}}, 'user.name') => 'John'
   */
  private getNestedProperty(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, prop) => {
      return current?.[prop];
    }, obj);
  }

  /**
   * Format value for template rendering
   */
  private formatValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Preview template rendering with sample data
   */
  async previewTemplate(
    templateId: string,
    sampleVariables: Record<string, any>
  ): Promise<RenderedTemplate> {
    const { template } = await this.getTemplateById(templateId);

    // Use sample data for any missing variables
    const variablesWithDefaults = { ...sampleVariables };
    template.variables.forEach((varName: string) => {
      if (!(varName in variablesWithDefaults)) {
        variablesWithDefaults[varName] = `[${varName}]`;
      }
    });

    return this.renderTemplate(templateId, variablesWithDefaults);
  }
}
