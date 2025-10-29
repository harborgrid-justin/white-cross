/**
 * Template Validation Schemas
 *
 * Zod schemas for message and broadcast templates
 */

import { z } from 'zod';
import { BroadcastCategorySchema } from './broadcast.schemas';
import { MessagePrioritySchema } from './message.schemas';

/**
 * Template type
 */
export const TemplateTypeSchema = z.enum(['message', 'broadcast', 'email', 'sms']);
export type TemplateType = z.infer<typeof TemplateTypeSchema>;

/**
 * Template category
 */
export const TemplateCategorySchema = z.enum([
  'health',
  'emergency',
  'appointment',
  'medication',
  'incident',
  'general',
  'announcement',
  'reminder',
  'custom'
]);
export type TemplateCategory = z.infer<typeof TemplateCategorySchema>;

/**
 * Template variable schema
 */
export const TemplateVariableSchema = z.object({
  key: z.string().regex(/^[a-zA-Z0-9_]+$/), // Alphanumeric and underscore only
  label: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  required: z.boolean().default(false),
  defaultValue: z.string().optional(),
  type: z.enum(['text', 'number', 'date', 'boolean', 'select']).default('text'),
  options: z.array(z.string()).optional(), // For select type
  validation: z.string().optional() // Regex pattern for validation
});
export type TemplateVariable = z.infer<typeof TemplateVariableSchema>;

/**
 * Create template schema
 */
export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  type: TemplateTypeSchema,
  category: TemplateCategorySchema,
  subject: z.string().min(1).max(255).optional(), // For message/email templates
  body: z.string().min(1).max(50000),
  variables: z.array(TemplateVariableSchema).default([]),
  tags: z.array(z.string().max(50)).max(10).default([]),
  isPublic: z.boolean().default(false), // Can other users use this template?
  isSystem: z.boolean().default(false), // System template (cannot be deleted)
  priority: MessagePrioritySchema.optional(),
  broadcastCategory: BroadcastCategorySchema.optional()
}).refine(
  (data) => {
    // Message and email templates should have a subject
    if ((data.type === 'message' || data.type === 'email') && !data.subject) {
      return false;
    }
    return true;
  },
  {
    message: 'Message and email templates must have a subject',
    path: ['subject']
  }
);
export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;

/**
 * Update template schema
 */
export const UpdateTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  category: TemplateCategorySchema.optional(),
  subject: z.string().min(1).max(255).optional(),
  body: z.string().min(1).max(50000).optional(),
  variables: z.array(TemplateVariableSchema).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPublic: z.boolean().optional(),
  priority: MessagePrioritySchema.optional(),
  broadcastCategory: BroadcastCategorySchema.optional()
});
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateSchema>;

/**
 * Template response schema
 */
export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  type: TemplateTypeSchema,
  category: TemplateCategorySchema,
  subject: z.string().optional(),
  body: z.string(),
  variables: z.array(TemplateVariableSchema),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
  isSystem: z.boolean(),
  priority: MessagePrioritySchema.optional(),
  broadcastCategory: BroadcastCategorySchema.optional(),
  createdBy: z.string().uuid(),
  createdByName: z.string(),
  usageCount: z.number().int().nonnegative(),
  lastUsedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Template = z.infer<typeof TemplateSchema>;

/**
 * Template filter schema
 */
export const TemplateFilterSchema = z.object({
  type: TemplateTypeSchema.optional(),
  category: TemplateCategorySchema.optional(),
  isPublic: z.boolean().optional(),
  isSystem: z.boolean().optional(),
  createdBy: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().max(255).optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['name', 'createdAt', 'usageCount', 'lastUsedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});
export type TemplateFilter = z.infer<typeof TemplateFilterSchema>;

/**
 * Template variable values schema
 */
export const TemplateVariableValuesSchema = z.record(z.string(), z.unknown());
export type TemplateVariableValues = z.infer<typeof TemplateVariableValuesSchema>;

/**
 * Render template schema
 */
export const RenderTemplateSchema = z.object({
  templateId: z.string().uuid(),
  variables: TemplateVariableValuesSchema
});
export type RenderTemplateInput = z.infer<typeof RenderTemplateSchema>;

/**
 * Rendered template response schema
 */
export const RenderedTemplateSchema = z.object({
  subject: z.string().optional(),
  body: z.string(),
  variables: TemplateVariableValuesSchema
});
export type RenderedTemplate = z.infer<typeof RenderedTemplateSchema>;

/**
 * Delete template schema
 */
export const DeleteTemplateSchema = z.object({
  id: z.string().uuid()
}).refine(
  async (data) => {
    // In real implementation, check if template is system template
    // System templates cannot be deleted
    return true;
  },
  {
    message: 'System templates cannot be deleted'
  }
);
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateSchema>;

/**
 * Duplicate template schema
 */
export const DuplicateTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional() // New name for duplicated template
});
export type DuplicateTemplateInput = z.infer<typeof DuplicateTemplateSchema>;

/**
 * Template preview schema
 */
export const TemplatePreviewSchema = z.object({
  templateId: z.string().uuid().optional(),
  subject: z.string().min(1).max(255).optional(),
  body: z.string().min(1).max(50000),
  variables: TemplateVariableValuesSchema.optional()
});
export type TemplatePreviewInput = z.infer<typeof TemplatePreviewSchema>;
