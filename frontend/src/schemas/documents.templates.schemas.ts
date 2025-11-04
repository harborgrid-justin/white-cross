/**
 * @fileoverview Document template schemas
 * @module schemas/documents.templates
 *
 * Schemas for document templates and template instances.
 */

import { z } from 'zod';
import {
  DocumentCategory,
  DocumentAccessLevel,
  TemplateFieldType,
  TemplateStatus
} from '@/types/documents';

/**
 * Document template creation schema
 */
export const documentTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(255),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(DocumentCategory),
  status: z.nativeEnum(TemplateStatus).default(TemplateStatus.DRAFT),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Section title is required'),
    description: z.string().optional(),
    order: z.number().int().min(0),
    collapsible: z.boolean().default(false),
    defaultCollapsed: z.boolean().default(false),
    fields: z.array(z.object({
      id: z.string(),
      label: z.string().min(1, 'Field label is required'),
      type: z.nativeEnum(TemplateFieldType),
      required: z.boolean().default(false),
      defaultValue: z.unknown().optional(),
      placeholder: z.string().optional(),
      helpText: z.string().optional(),
      readonly: z.boolean().default(false),
      order: z.number().int().min(0),
      validation: z.object({
        pattern: z.string().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        minLength: z.number().int().optional(),
        maxLength: z.number().int().optional()
      }).optional(),
      options: z.array(z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()])
      })).optional()
    }))
  })),
  defaultAccessLevel: z.nativeEnum(DocumentAccessLevel),
  requiresSignature: z.boolean().default(false),
  signatureTemplateId: z.string().uuid().optional(),
  autoGenerate: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional()
});

export type DocumentTemplateFormData = z.infer<typeof documentTemplateSchema>;

/**
 * Template instance (document creation from template) schema
 */
export const templateInstanceSchema = z.object({
  templateId: z.string().uuid(),
  fieldValues: z.record(z.string(), z.unknown()),
  studentId: z.string().uuid().optional(),
  folderId: z.string().uuid().optional(),
  isDraft: z.boolean().default(false)
});

export type TemplateInstanceFormData = z.infer<typeof templateInstanceSchema>;
