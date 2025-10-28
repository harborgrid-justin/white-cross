/**
 * LOC: C6BF3D5EA9-TMPL
 * WC-SVC-COM-017-TMPL | templateOperations.ts - Message Template Operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (main service aggregator)
 */

/**
 * WC-SVC-COM-017-TMPL | templateOperations.ts - Message Template Operations
 * Purpose: CRUD operations for message templates with validation
 * Upstream: database models, validation utilities | Dependencies: sequelize, joi
 * Downstream: index.ts | Called by: CommunicationService
 * Related: messageOperations, channelService
 * Exports: Template CRUD functions
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: No PHI - templates only
 * Critical Path: Template creation → Variable extraction → Content validation → Storage
 * LLM Context: Message template management - supports reusable message formats with variable substitution
 */

import { logger } from '../../utils/logger';
import { MessageTemplate, User } from '../../database/models';
import { MessageType, MessageCategory } from '../../database/types/enums';
import { CreateMessageTemplateData } from './types';
import {
  validateMessageContent,
  validateTemplateVariables,
  createMessageTemplateSchema,
  updateMessageTemplateSchema
} from '../../utils/communicationValidation';
import { extractTemplateVariables } from '../../shared/communication/templates';

/**
 * Create message template
 * @param data - Template creation data
 * @returns Created message template with creator details
 */
export async function createMessageTemplate(data: CreateMessageTemplateData): Promise<MessageTemplate> {
  try {
    // Validate input data
    const { error, value } = createMessageTemplateSchema.validate(data, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }

    // Verify creator exists
    const creator = await User.findByPk(data.createdBy);

    if (!creator) {
      throw new Error('Creator not found');
    }

    // Extract and validate template variables
    const extractedVariables = extractTemplateVariables(data.content);
    const declaredVariables = data.variables || [];

    const variableValidation = validateTemplateVariables(data.content, declaredVariables);

    // Log warnings if any
    if (variableValidation.warnings.length > 0) {
      logger.warn(`Template variable warnings: ${variableValidation.warnings.join(', ')}`);
    }

    // Use extracted variables if none were declared
    const finalVariables = declaredVariables.length > 0 ? declaredVariables : extractedVariables;

    // Validate content for the specified message type
    if (data.type !== MessageType.EMAIL && data.type !== MessageType.PUSH_NOTIFICATION) {
      const contentValidation = validateMessageContent(data.content, data.type, data.subject);

      if (!contentValidation.isValid) {
        throw new Error(`Content validation failed: ${contentValidation.errors.join(', ')}`);
      }

      if (contentValidation.warnings.length > 0) {
        logger.warn(`Template content warnings: ${contentValidation.warnings.join(', ')}`);
      }
    }

    const template = await MessageTemplate.create({
      name: data.name,
      subject: data.subject,
      content: data.content,
      type: data.type,
      category: data.category,
      variables: finalVariables,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdById: data.createdBy
    });

    // Reload with associations
    await template.reload({
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'role']
        }
      ]
    });

    logger.info(`Message template created: ${template.name} (${template.type}) by ${creator.firstName} ${creator.lastName}`);
    return template;
  } catch (error) {
    logger.error('Error creating message template:', error);
    throw error;
  }
}

/**
 * Get message templates with optional filters
 * @param type - Filter by message type
 * @param category - Filter by message category
 * @param isActive - Filter by active status
 * @returns Array of message templates
 */
export async function getMessageTemplates(
  type?: MessageType,
  category?: MessageCategory,
  isActive: boolean = true
): Promise<MessageTemplate[]> {
  try {
    const whereClause: any = { isActive };

    if (type) {
      whereClause.type = type;
    }

    if (category) {
      whereClause.category = category;
    }

    const templates = await MessageTemplate.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'role']
        }
      ],
      order: [
        ['category', 'ASC'],
        ['name', 'ASC']
      ]
    });

    return templates;
  } catch (error) {
    logger.error('Error fetching message templates:', error);
    throw error;
  }
}

/**
 * Get a single message template by ID
 * @param id - Template ID
 * @returns Message template
 */
export async function getMessageTemplateById(id: string): Promise<MessageTemplate | null> {
  try {
    const template = await MessageTemplate.findByPk(id, {
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'role']
        }
      ]
    });

    return template;
  } catch (error) {
    logger.error('Error fetching message template:', error);
    throw error;
  }
}

/**
 * Update message template
 * @param id - Template ID
 * @param data - Fields to update
 * @returns Updated template
 */
export async function updateMessageTemplate(
  id: string,
  data: Partial<CreateMessageTemplateData>
): Promise<MessageTemplate> {
  try {
    // Validate input data
    const { error, value } = updateMessageTemplateSchema.validate(data, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }

    const template = await MessageTemplate.findByPk(id);

    if (!template) {
      throw new Error('Message template not found');
    }

    // If content is being updated, validate template variables
    if (data.content) {
      const extractedVariables = extractTemplateVariables(data.content);
      const declaredVariables = data.variables || template.variables || [];

      const variableValidation = validateTemplateVariables(data.content, declaredVariables);

      if (variableValidation.warnings.length > 0) {
        logger.warn(`Template variable warnings: ${variableValidation.warnings.join(', ')}`);
      }

      // Use extracted variables if none were declared
      if (!data.variables || data.variables.length === 0) {
        data.variables = extractedVariables;
      }
    }

    // If content and type are being updated, validate content for the type
    if (data.content && data.type) {
      const contentValidation = validateMessageContent(data.content, data.type, data.subject);

      if (!contentValidation.isValid) {
        throw new Error(`Content validation failed: ${contentValidation.errors.join(', ')}`);
      }

      if (contentValidation.warnings.length > 0) {
        logger.warn(`Template content warnings: ${contentValidation.warnings.join(', ')}`);
      }
    }

    await template.update({
      name: data.name,
      subject: data.subject,
      content: data.content,
      type: data.type,
      category: data.category,
      variables: data.variables,
      isActive: data.isActive
    });

    // Reload with associations
    await template.reload({
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'role']
        }
      ]
    });

    logger.info(`Message template updated: ${template.name} (${template.id})`);
    return template;
  } catch (error) {
    logger.error('Error updating message template:', error);
    throw error;
  }
}

/**
 * Delete message template
 * @param id - Template ID
 * @returns Success status
 */
export async function deleteMessageTemplate(id: string): Promise<{ success: boolean }> {
  try {
    const template = await MessageTemplate.findByPk(id);

    if (!template) {
      throw new Error('Message template not found');
    }

    const templateName = template.name;
    await template.destroy();

    logger.info(`Message template deleted: ${templateName} (${id})`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting message template:', error);
    throw error;
  }
}
