import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageTemplate } from './enterprise-features-interfaces';

@Injectable()
export class MessageTemplateLibraryService {
  private readonly logger = new Logger(MessageTemplateLibraryService.name);
  private messageTemplates: MessageTemplate[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Create a new message template
   */
  createMessageTemplate(
    name: string,
    category: string,
    subject: string,
    body: string,
    variables: string[],
    language: string,
    createdBy: string,
  ): MessageTemplate {
    try {
      this.validateTemplateParameters(name, category, subject, body, variables, language);

      const template: MessageTemplate = {
        id: `MT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        category,
        subject,
        body,
        variables,
        language,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy,
        usageCount: 0,
      };

      this.messageTemplates.push(template);

      this.eventEmitter.emit('message.template.created', {
        templateId: template.id,
        name,
        category,
        createdBy,
        timestamp: new Date(),
      });

      this.logger.log('Message template created', {
        templateId: template.id,
        name,
        category,
        createdBy,
      });
      return template;
    } catch (error) {
      this.logger.error('Error creating message template', {
        error: error instanceof Error ? error.message : String(error),
        name,
        category,
      });
      throw error;
    }
  }

  /**
   * Update an existing message template
   */
  updateMessageTemplate(
    templateId: string,
    updates: Partial<
      Pick<
        MessageTemplate,
        'name' | 'category' | 'subject' | 'body' | 'variables' | 'language' | 'isActive'
      >
    >,
    updatedBy: string,
  ): MessageTemplate {
    try {
      this.validateUpdateParameters(templateId, updates, updatedBy);

      const template = this.messageTemplates.find((t) => t.id === templateId);
      if (!template) {
        throw new Error(`Message template not found: ${templateId}`);
      }

      const updatedTemplate: MessageTemplate = {
        ...template,
        ...updates,
        updatedAt: new Date(),
      };

      const index = this.messageTemplates.findIndex((t) => t.id === templateId);
      this.messageTemplates[index] = updatedTemplate;

      this.eventEmitter.emit('message.template.updated', {
        templateId,
        updatedBy,
        changes: Object.keys(updates),
        timestamp: new Date(),
      });

      this.logger.log('Message template updated', {
        templateId,
        updatedBy,
        changes: Object.keys(updates),
      });
      return updatedTemplate;
    } catch (error) {
      this.logger.error('Error updating message template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      throw error;
    }
  }

  /**
   * Get message template by ID
   */
  getMessageTemplate(templateId: string): MessageTemplate | null {
    try {
      this.validateTemplateId(templateId);

      const template = this.messageTemplates.find((t) => t.id === templateId);
      if (!template) {
        this.logger.warn('Message template not found', { templateId });
        return null;
      }

      this.logger.log('Message template retrieved', { templateId });
      return template;
    } catch (error) {
      this.logger.error('Error retrieving message template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      return null;
    }
  }

  /**
   * Get message templates by category
   */
  getMessageTemplatesByCategory(category: string): MessageTemplate[] {
    try {
      this.validateCategory(category);

      const templates = this.messageTemplates.filter((t) => t.category === category && t.isActive);

      this.logger.log('Message templates retrieved by category', {
        category,
        count: templates.length,
      });
      return templates;
    } catch (error) {
      this.logger.error('Error retrieving message templates by category', {
        error: error instanceof Error ? error.message : String(error),
        category,
      });
      return [];
    }
  }

  /**
   * Get all active message templates
   */
  getAllActiveMessageTemplates(): MessageTemplate[] {
    try {
      const activeTemplates = this.messageTemplates.filter((t) => t.isActive);

      this.logger.log('All active message templates retrieved', {
        count: activeTemplates.length,
      });
      return activeTemplates;
    } catch (error) {
      this.logger.error('Error retrieving active message templates', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Render message template with variables
   */
  renderMessageTemplate(templateId: string, variables: Record<string, string>): string {
    try {
      this.validateRenderParameters(templateId, variables);

      const template = this.messageTemplates.find((t) => t.id === templateId);
      if (!template) {
        throw new Error(`Message template not found: ${templateId}`);
      }

      if (!template.isActive) {
        throw new Error(`Message template is not active: ${templateId}`);
      }

      let renderedContent = template.body;

      // Replace variables in content
      for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        renderedContent = renderedContent.replace(new RegExp(placeholder, 'g'), value);
      }

      // Check for missing variables
      const missingVars = this.findMissingVariables(renderedContent);
      if (missingVars.length > 0) {
        throw new Error(`Missing required variables: ${missingVars.join(', ')}`);
      }

      // Increment usage count
      template.usageCount += 1;

      this.eventEmitter.emit('message.template.rendered', {
        templateId,
        variables: Object.keys(variables),
        timestamp: new Date(),
      });

      this.logger.log('Message template rendered', {
        templateId,
        variablesCount: Object.keys(variables).length,
      });
      return renderedContent;
    } catch (error) {
      this.logger.error('Error rendering message template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      throw error;
    }
  }

  /**
   * Delete message template (soft delete)
   */
  deleteMessageTemplate(templateId: string, deletedBy: string): boolean {
    try {
      this.validateDeleteParameters(templateId, deletedBy);

      const template = this.messageTemplates.find((t) => t.id === templateId);
      if (!template) {
        throw new Error(`Message template not found: ${templateId}`);
      }

      template.isActive = false;
      template.updatedAt = new Date();

      this.eventEmitter.emit('message.template.deleted', {
        templateId,
        deletedBy,
        timestamp: new Date(),
      });

      this.logger.log('Message template deleted', { templateId, deletedBy });
      return true;
    } catch (error) {
      this.logger.error('Error deleting message template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      return false;
    }
  }

  /**
   * Get template usage statistics
   */
  getTemplateUsageStatistics(): Record<string, number> {
    try {
      const stats: Record<string, number> = {};

      for (const template of this.messageTemplates) {
        if (template.isActive) {
          stats[template.id] = template.usageCount;
        }
      }

      this.logger.log('Template usage statistics retrieved', {
        templateCount: Object.keys(stats).length,
      });
      return stats;
    } catch (error) {
      this.logger.error('Error retrieving template usage statistics', {
        error: error instanceof Error ? error.message : String(error),
      });
      return {};
    }
  }

  /**
   * Clone existing template
   */
  cloneMessageTemplate(templateId: string, newName: string, clonedBy: string): MessageTemplate {
    try {
      this.validateCloneParameters(templateId, newName, clonedBy);

      const originalTemplate = this.messageTemplates.find((t) => t.id === templateId);
      if (!originalTemplate) {
        throw new Error(`Message template not found: ${templateId}`);
      }

      const clonedTemplate: MessageTemplate = {
        ...originalTemplate,
        id: `MT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: clonedBy,
        usageCount: 0,
      };

      this.messageTemplates.push(clonedTemplate);

      this.eventEmitter.emit('message.template.cloned', {
        originalTemplateId: templateId,
        newTemplateId: clonedTemplate.id,
        clonedBy,
        timestamp: new Date(),
      });

      this.logger.log('Message template cloned', {
        originalTemplateId: templateId,
        newTemplateId: clonedTemplate.id,
        clonedBy,
      });
      return clonedTemplate;
    } catch (error) {
      this.logger.error('Error cloning message template', {
        error: error instanceof Error ? error.message : String(error),
        templateId,
      });
      throw error;
    }
  }

  /**
   * Validate template parameters
   */
  private validateTemplateParameters(
    name: string,
    category: string,
    subject: string,
    body: string,
    variables: string[],
    language: string,
  ): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Template name is required');
    }

    if (!category || category.trim().length === 0) {
      throw new Error('Template category is required');
    }

    if (!subject || subject.trim().length === 0) {
      throw new Error('Template subject is required');
    }

    if (!body || body.trim().length === 0) {
      throw new Error('Template body is required');
    }

    if (!variables || variables.length === 0) {
      throw new Error('Template variables are required');
    }

    if (!language || language.trim().length === 0) {
      throw new Error('Template language is required');
    }
  }

  /**
   * Validate update parameters
   */
  private validateUpdateParameters(
    templateId: string,
    updates: Partial<
      Pick<
        MessageTemplate,
        'name' | 'category' | 'subject' | 'body' | 'variables' | 'language' | 'isActive'
      >
    >,
    updatedBy: string,
  ): void {
    if (!templateId || templateId.trim().length === 0) {
      throw new Error('Template ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Updates are required');
    }

    if (!updatedBy || updatedBy.trim().length === 0) {
      throw new Error('Updated by is required');
    }
  }

  /**
   * Validate template ID
   */
  private validateTemplateId(templateId: string): void {
    if (!templateId || templateId.trim().length === 0) {
      throw new Error('Template ID is required');
    }
  }

  /**
   * Validate category
   */
  private validateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error('Category is required');
    }
  }

  /**
   * Validate render parameters
   */
  private validateRenderParameters(templateId: string, variables: Record<string, string>): void {
    if (!templateId || templateId.trim().length === 0) {
      throw new Error('Template ID is required');
    }

    if (!variables) {
      throw new Error('Variables are required');
    }
  }

  /**
   * Validate delete parameters
   */
  private validateDeleteParameters(templateId: string, deletedBy: string): void {
    if (!templateId || templateId.trim().length === 0) {
      throw new Error('Template ID is required');
    }

    if (!deletedBy || deletedBy.trim().length === 0) {
      throw new Error('Deleted by is required');
    }
  }

  /**
   * Validate clone parameters
   */
  private validateCloneParameters(templateId: string, newName: string, clonedBy: string): void {
    if (!templateId || templateId.trim().length === 0) {
      throw new Error('Template ID is required');
    }

    if (!newName || newName.trim().length === 0) {
      throw new Error('New name is required');
    }

    if (!clonedBy || clonedBy.trim().length === 0) {
      throw new Error('Cloned by is required');
    }
  }

  /**
   * Find missing variables in rendered content
   */
  private findMissingVariables(content: string): string[] {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const matches = content.match(variableRegex);
    if (!matches) return [];

    const foundVars = new Set(matches.map((match) => match.replace(/\{\{|\}\}/g, '')));
    return Array.from(foundVars);
  }
}
