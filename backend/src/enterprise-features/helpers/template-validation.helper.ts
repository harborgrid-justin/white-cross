/**
 * Template Validation Helper
 * Extracted validation methods for message template library
 */

import { MessageTemplate } from '../enterprise-features-interfaces';

export class TemplateValidationHelper {
  /**
   * Validate template parameters
   */
  static validateTemplateParameters(
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
  static validateUpdateParameters(
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
  static validateTemplateId(templateId: string): void {
    if (!templateId || templateId.trim().length === 0) {
      throw new Error('Template ID is required');
    }
  }

  /**
   * Validate category
   */
  static validateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error('Category is required');
    }
  }

  /**
   * Validate render parameters
   */
  static validateRenderParameters(templateId: string, variables: Record<string, string>): void {
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
  static validateDeleteParameters(templateId: string, deletedBy: string): void {
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
  static validateCloneParameters(templateId: string, newName: string, clonedBy: string): void {
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
  static findMissingVariables(content: string): string[] {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const matches = content.match(variableRegex);
    if (!matches) return [];

    const foundVars = new Set(matches.map((match) => match.replace(/\{\{|\}\}/g, '')));
    return Array.from(foundVars);
  }
}
