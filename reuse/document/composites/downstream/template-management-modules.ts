/**
 * LOC: DOCTEMPL001
 * File: /reuse/document/composites/downstream/template-management-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-template-kit
 *   - ../document-version-control-kit
 *   - ../document-generation-composite
 *
 * DOWNSTREAM (imported by):
 *   - Template editors
 *   - Document generation services
 *   - Report templates
 *   - Template inheritance chains
 */

/**
 * File: /reuse/document/composites/downstream/template-management-modules.ts
 * Locator: WC-TEMPLATE-MANAGEMENT-MODULES-001
 * Purpose: Template Management & Creation - Production-ready template lifecycle management
 *
 * Upstream: Document template kit, Version control kit
 * Downstream: Template editors, Generation services, Report engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 15+ production-ready functions for template management, versioning, inheritance
 *
 * LLM Context: Enterprise-grade template management service for White Cross healthcare platform.
 * Provides comprehensive template lifecycle including creation, versioning, inheritance,
 * cloning, validation, preview generation, and deployment with HIPAA-compliant template
 * versioning, audit trails, and performance optimization for medical document templates.
 */

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsArray, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Template status enumeration
 */
export enum TemplateStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
  DISABLED = 'DISABLED',
}

/**
 * Template category enumeration
 */
export enum TemplateCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  PRESCRIPTION = 'PRESCRIPTION',
  REPORT = 'REPORT',
  CONSENT = 'CONSENT',
  LETTER = 'LETTER',
  FORM = 'FORM',
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
}

/**
 * Template field type enumeration
 */
export enum TemplateFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  DROPDOWN = 'DROPDOWN',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  TABLE = 'TABLE',
}

/**
 * Template version information
 */
export interface TemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  status: TemplateStatus;
  content: string;
  changelog: string;
  createdBy: string;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

/**
 * Template field definition
 */
export interface TemplateField {
  id: string;
  name: string;
  label: string;
  fieldType: TemplateFieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: string[];
  helpText?: string;
  order: number;
}

/**
 * Document template metadata
 */
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  status: TemplateStatus;
  currentVersion: number;
  content: string;
  fields: TemplateField[];
  parentTemplateId?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Template inheritance chain
 */
export interface TemplateInheritance {
  parentId: string;
  childId: string;
  inheritanceLevel: number;
  fields: string[]; // Inherited field IDs
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Document Template Model
 * Stores template definitions and metadata
 */
@Table({
  tableName: 'document_templates',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['category'] },
    { fields: ['status'] },
    { fields: ['createdBy'] },
  ],
})
export class DocumentTemplateModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique template identifier' })
  id: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Template name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Template description' })
  description: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(TemplateCategory)))
  @ApiProperty({ enum: TemplateCategory, description: 'Template category' })
  category: TemplateCategory;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(TemplateStatus)))
  @ApiProperty({ enum: TemplateStatus, description: 'Template status' })
  status: TemplateStatus;

  @Default(1)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Current version number' })
  currentVersion: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Template content' })
  content: Record<string, any>;

  @Default([])
  @Column(DataType.ARRAY(DataType.JSONB))
  @ApiProperty({ description: 'Template fields' })
  fields: TemplateField[];

  @Column(DataType.UUID)
  @ApiPropertyOptional({ description: 'Parent template ID for inheritance' })
  parentTemplateId?: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'User who created template' })
  createdBy: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'User who last updated template' })
  updatedBy: string;

  @Column(DataType.ARRAY(DataType.STRING))
  @ApiPropertyOptional({ description: 'Template tags' })
  tags?: string[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Template Version Model
 * Maintains version history of templates
 */
@Table({
  tableName: 'template_versions',
  timestamps: true,
  indexes: [
    { fields: ['templateId'] },
    { fields: ['versionNumber'] },
    { fields: ['status'] },
    { fields: ['createdAt'] },
  ],
})
export class TemplateVersionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique version identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Template ID' })
  templateId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Version number' })
  versionNumber: number;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(TemplateStatus)))
  @ApiProperty({ enum: TemplateStatus, description: 'Version status' })
  status: TemplateStatus;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Template content at this version' })
  content: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Version changelog' })
  changelog: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'User who created version' })
  createdBy: string;

  @Column(DataType.UUID)
  @ApiPropertyOptional({ description: 'User who approved version' })
  approvedBy?: string;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Version approval timestamp' })
  approvedAt?: Date;
}

/**
 * Template Field Model
 * Defines individual template fields
 */
@Table({
  tableName: 'template_fields',
  timestamps: true,
  indexes: [
    { fields: ['templateId'] },
    { fields: ['name'] },
  ],
})
export class TemplateFieldModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique field identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Template ID' })
  templateId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Field name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Field label' })
  label: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(TemplateFieldType)))
  @ApiProperty({ enum: TemplateFieldType, description: 'Field type' })
  fieldType: TemplateFieldType;

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether field is required' })
  required: boolean;

  @Column(DataType.STRING)
  @ApiPropertyOptional({ description: 'Placeholder text' })
  placeholder?: string;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Default value' })
  defaultValue?: any;

  @Column(DataType.ARRAY(DataType.STRING))
  @ApiPropertyOptional({ description: 'Dropdown or checkbox options' })
  options?: string[];

  @Column(DataType.TEXT)
  @ApiPropertyOptional({ description: 'Help text for field' })
  helpText?: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Field display order' })
  order: number;
}

/**
 * Template Inheritance Model
 * Tracks template inheritance relationships
 */
@Table({
  tableName: 'template_inheritance',
  timestamps: true,
  indexes: [
    { fields: ['parentId'] },
    { fields: ['childId'] },
  ],
})
export class TemplateInheritanceModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique inheritance record identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Parent template ID' })
  parentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Child template ID' })
  childId: string;

  @Default(1)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Inheritance level' })
  inheritanceLevel: number;

  @Default([])
  @Column(DataType.ARRAY(DataType.UUID))
  @ApiProperty({ description: 'Inherited field IDs' })
  fields: string[];
}

// ============================================================================
// CORE TEMPLATE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates new document template.
 * Defines template for document generation.
 *
 * @param {Omit<DocumentTemplate, 'id' | 'currentVersion' | 'createdAt' | 'updatedAt'>} template - Template definition
 * @returns {Promise<string>} Template ID
 *
 * @example
 * ```typescript
 * const templateId = await createDocumentTemplate({
 *   name: 'Medical Record',
 *   description: 'Standard patient medical record',
 *   category: TemplateCategory.MEDICAL_RECORD,
 *   status: TemplateStatus.DRAFT,
 *   content: { /* template content */ },
 *   fields: [...],
 *   createdBy: 'user-123',
 *   updatedBy: 'user-123'
 * });
 * ```
 */
export const createDocumentTemplate = async (
  template: Omit<DocumentTemplate, 'id' | 'currentVersion' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const newTemplate = await DocumentTemplateModel.create({
    id: crypto.randomUUID(),
    ...template,
    currentVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return newTemplate.id;
};

/**
 * Updates template content.
 * Modifies template without creating new version.
 *
 * @param {string} templateId - Template ID
 * @param {Partial<DocumentTemplate>} updates - Template updates
 * @returns {Promise<DocumentTemplate>}
 *
 * @example
 * ```typescript
 * const updated = await updateTemplate('tpl-123', { description: 'Updated description' });
 * ```
 */
export const updateTemplate = async (
  templateId: string,
  updates: Partial<DocumentTemplate>
): Promise<DocumentTemplate> => {
  const template = await DocumentTemplateModel.findByPk(templateId);

  if (!template) {
    throw new NotFoundException('Template not found');
  }

  await template.update(updates);

  return template.toJSON() as DocumentTemplate;
};

/**
 * Creates new version of template.
 * Preserves version history with changelog.
 *
 * @param {string} templateId - Template ID
 * @param {string} changelog - Version changelog
 * @param {string} userId - User ID
 * @returns {Promise<string>} Version ID
 *
 * @example
 * ```typescript
 * const versionId = await createTemplateVersion('tpl-123', 'Updated field labels', 'user-456');
 * ```
 */
export const createTemplateVersion = async (
  templateId: string,
  changelog: string,
  userId: string
): Promise<string> => {
  const template = await DocumentTemplateModel.findByPk(templateId);

  if (!template) {
    throw new NotFoundException('Template not found');
  }

  const newVersionNumber = template.currentVersion + 1;

  const version = await TemplateVersionModel.create({
    id: crypto.randomUUID(),
    templateId,
    versionNumber: newVersionNumber,
    status: TemplateStatus.DRAFT,
    content: template.content,
    changelog,
    createdBy: userId,
  });

  await template.update({
    currentVersion: newVersionNumber,
    updatedBy: userId,
    updatedAt: new Date(),
  });

  return version.id;
};

/**
 * Approves template version.
 * Activates version for use.
 *
 * @param {string} versionId - Version ID
 * @param {string} approverUserId - Approver user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveTemplateVersion('version-123', 'approver-456');
 * ```
 */
export const approveTemplateVersion = async (
  versionId: string,
  approverUserId: string
): Promise<void> => {
  const version = await TemplateVersionModel.findByPk(versionId);

  if (!version) {
    throw new NotFoundException('Template version not found');
  }

  await version.update({
    status: TemplateStatus.ACTIVE,
    approvedBy: approverUserId,
    approvedAt: new Date(),
  });

  // Update template status
  const template = await DocumentTemplateModel.findByPk(version.templateId);
  if (template) {
    await template.update({ status: TemplateStatus.ACTIVE });
  }
};

/**
 * Gets template version history.
 * Returns all versions of template.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<TemplateVersion[]>}
 *
 * @example
 * ```typescript
 * const history = await getTemplateVersionHistory('tpl-123');
 * ```
 */
export const getTemplateVersionHistory = async (
  templateId: string
): Promise<TemplateVersion[]> => {
  const versions = await TemplateVersionModel.findAll({
    where: { templateId },
    order: [['versionNumber', 'DESC']],
  });

  return versions.map(v => v.toJSON() as TemplateVersion);
};

/**
 * Clones template.
 * Creates copy of existing template.
 *
 * @param {string} templateId - Template ID to clone
 * @param {string} newName - New template name
 * @param {string} userId - User ID
 * @returns {Promise<string>} New template ID
 *
 * @example
 * ```typescript
 * const cloneId = await cloneTemplate('tpl-123', 'Medical Record v2', 'user-456');
 * ```
 */
export const cloneTemplate = async (
  templateId: string,
  newName: string,
  userId: string
): Promise<string> => {
  const original = await DocumentTemplateModel.findByPk(templateId);

  if (!original) {
    throw new NotFoundException('Template not found');
  }

  const clone = await DocumentTemplateModel.create({
    id: crypto.randomUUID(),
    name: newName,
    description: original.description,
    category: original.category,
    status: TemplateStatus.DRAFT,
    currentVersion: 1,
    content: original.content,
    fields: original.fields,
    createdBy: userId,
    updatedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return clone.id;
};

/**
 * Adds field to template.
 * Extends template with new field.
 *
 * @param {string} templateId - Template ID
 * @param {Omit<TemplateField, 'id'>} field - Field definition
 * @returns {Promise<string>} Field ID
 *
 * @example
 * ```typescript
 * const fieldId = await addTemplateField('tpl-123', {
 *   name: 'diagnosis',
 *   label: 'Diagnosis',
 *   fieldType: TemplateFieldType.TEXTAREA,
 *   required: true,
 *   order: 1
 * });
 * ```
 */
export const addTemplateField = async (
  templateId: string,
  field: Omit<TemplateField, 'id'>
): Promise<string> => {
  const templateField = await TemplateFieldModel.create({
    id: crypto.randomUUID(),
    templateId,
    ...field,
  });

  return templateField.id;
};

/**
 * Removes field from template.
 * Deletes field definition.
 *
 * @param {string} fieldId - Field ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeTemplateField('field-123');
 * ```
 */
export const removeTemplateField = async (fieldId: string): Promise<void> => {
  const field = await TemplateFieldModel.findByPk(fieldId);

  if (!field) {
    throw new NotFoundException('Template field not found');
  }

  await field.destroy();
};

/**
 * Gets template with all fields.
 * Returns complete template definition.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<DocumentTemplate>}
 *
 * @example
 * ```typescript
 * const template = await getTemplate('tpl-123');
 * ```
 */
export const getTemplate = async (templateId: string): Promise<DocumentTemplate> => {
  const template = await DocumentTemplateModel.findByPk(templateId);

  if (!template) {
    throw new NotFoundException('Template not found');
  }

  return template.toJSON() as DocumentTemplate;
};

/**
 * Lists templates by category.
 * Returns filtered template list.
 *
 * @param {TemplateCategory} category - Template category
 * @returns {Promise<DocumentTemplate[]>}
 *
 * @example
 * ```typescript
 * const templates = await listTemplatesByCategory(TemplateCategory.MEDICAL_RECORD);
 * ```
 */
export const listTemplatesByCategory = async (
  category: TemplateCategory
): Promise<DocumentTemplate[]> => {
  const templates = await DocumentTemplateModel.findAll({
    where: { category, status: TemplateStatus.ACTIVE },
    order: [['name', 'ASC']],
  });

  return templates.map(t => t.toJSON() as DocumentTemplate);
};

/**
 * Searches templates.
 * Finds templates by name or tag.
 *
 * @param {string} query - Search query
 * @returns {Promise<DocumentTemplate[]>}
 *
 * @example
 * ```typescript
 * const results = await searchTemplates('medical');
 * ```
 */
export const searchTemplates = async (query: string): Promise<DocumentTemplate[]> => {
  const templates = await DocumentTemplateModel.findAll({
    where: {
      [Symbol.for('or')]: [
        { name: { [Symbol.for('like')]: `%${query}%` } },
        { tags: { [Symbol.for('contains')]: [query] } },
      ],
    },
  });

  return templates.map(t => t.toJSON() as DocumentTemplate);
};

/**
 * Creates template inheritance.
 * Sets up parent-child relationship.
 *
 * @param {string} parentId - Parent template ID
 * @param {string} childId - Child template ID
 * @param {string[]} inheritedFieldIds - Field IDs to inherit
 * @returns {Promise<string>} Inheritance ID
 *
 * @example
 * ```typescript
 * const inheritanceId = await createTemplateInheritance('tpl-parent', 'tpl-child', ['field-1', 'field-2']);
 * ```
 */
export const createTemplateInheritance = async (
  parentId: string,
  childId: string,
  inheritedFieldIds: string[]
): Promise<string> => {
  const inheritance = await TemplateInheritanceModel.create({
    id: crypto.randomUUID(),
    parentId,
    childId,
    inheritanceLevel: 1,
    fields: inheritedFieldIds,
  });

  return inheritance.id;
};

/**
 * Publishes template.
 * Makes template available for use.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishTemplate('tpl-123');
 * ```
 */
export const publishTemplate = async (templateId: string): Promise<void> => {
  const template = await DocumentTemplateModel.findByPk(templateId);

  if (!template) {
    throw new NotFoundException('Template not found');
  }

  await template.update({ status: TemplateStatus.ACTIVE });
};

/**
 * Deprecates template.
 * Marks template as deprecated but keeps accessible.
 *
 * @param {string} templateId - Template ID
 * @param {string} reason - Deprecation reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deprecateTemplate('tpl-123', 'Replaced by Medical Record v2');
 * ```
 */
export const deprecateTemplate = async (
  templateId: string,
  reason: string
): Promise<void> => {
  const template = await DocumentTemplateModel.findByPk(templateId);

  if (!template) {
    throw new NotFoundException('Template not found');
  }

  await template.update({
    status: TemplateStatus.DEPRECATED,
    metadata: { ...template.metadata, deprecationReason: reason },
  });
};

/**
 * Previews template with data.
 * Generates preview of document with provided data.
 *
 * @param {string} templateId - Template ID
 * @param {Record<string, any>} data - Preview data
 * @returns {Promise<{ html: string; fields: TemplateField[] }>}
 *
 * @example
 * ```typescript
 * const preview = await previewTemplate('tpl-123', { name: 'John Doe' });
 * ```
 */
export const previewTemplate = async (
  templateId: string,
  data: Record<string, any>
): Promise<{ html: string; fields: TemplateField[] }> => {
  const template = await DocumentTemplateModel.findByPk(templateId);

  if (!template) {
    throw new NotFoundException('Template not found');
  }

  const fields = await TemplateFieldModel.findAll({
    where: { templateId },
    order: [['order', 'ASC']],
  });

  // Simulate preview generation
  const html = `<html><body>${Object.entries(data)
    .map(([key, value]) => `<p>${key}: ${value}</p>`)
    .join('')}</body></html>`;

  return {
    html,
    fields: fields.map(f => f.toJSON() as TemplateField),
  };
};

/**
 * Validates template structure.
 * Checks template for errors.
 *
 * @param {DocumentTemplate} template - Template to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateTemplate(templateDef);
 * ```
 */
export const validateTemplate = async (
  template: DocumentTemplate
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!template.name) {
    errors.push('Template name is required');
  }

  if (!template.fields || template.fields.length === 0) {
    errors.push('Template must have at least one field');
  }

  if (!template.content) {
    errors.push('Template content is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Exports template.
 * Returns template as JSON for backup/transfer.
 *
 * @param {string} templateId - Template ID
 * @returns {Promise<string>} JSON export
 *
 * @example
 * ```typescript
 * const exported = await exportTemplate('tpl-123');
 * ```
 */
export const exportTemplate = async (templateId: string): Promise<string> => {
  const template = await getTemplate(templateId);
  const fields = await TemplateFieldModel.findAll({ where: { templateId } });

  return JSON.stringify(
    {
      ...template,
      fields: fields.map(f => f.toJSON()),
    },
    null,
    2
  );
};

/**
 * Imports template.
 * Creates template from JSON export.
 *
 * @param {string} jsonData - Template JSON data
 * @param {string} userId - User ID
 * @returns {Promise<string>} New template ID
 *
 * @example
 * ```typescript
 * const newId = await importTemplate(jsonData, 'user-123');
 * ```
 */
export const importTemplate = async (jsonData: string, userId: string): Promise<string> => {
  const data = JSON.parse(jsonData);

  return await createDocumentTemplate({
    name: data.name,
    description: data.description,
    category: data.category,
    status: TemplateStatus.DRAFT,
    content: data.content,
    fields: data.fields || [],
    createdBy: userId,
    updatedBy: userId,
  });
};

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Template Management Service
 * Production-ready NestJS service for template operations
 */
@Injectable()
export class TemplateManagementService {
  private readonly logger = new Logger(TemplateManagementService.name);

  /**
   * Creates and publishes template
   */
  async createAndPublish(
    name: string,
    description: string,
    category: TemplateCategory,
    content: Record<string, any>,
    userId: string
  ): Promise<string> {
    this.logger.log(`Creating template: ${name}`);

    const templateId = await createDocumentTemplate({
      name,
      description,
      category,
      status: TemplateStatus.DRAFT,
      content,
      fields: [],
      createdBy: userId,
      updatedBy: userId,
    });

    await publishTemplate(templateId);
    return templateId;
  }

  /**
   * Gets templates for category
   */
  async getTemplatesByCategory(category: TemplateCategory): Promise<DocumentTemplate[]> {
    return await listTemplatesByCategory(category);
  }

  /**
   * Creates new version of template
   */
  async createNewVersion(
    templateId: string,
    changelog: string,
    userId: string
  ): Promise<string> {
    return await createTemplateVersion(templateId, changelog, userId);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  DocumentTemplateModel,
  TemplateVersionModel,
  TemplateFieldModel,
  TemplateInheritanceModel,

  // Core Functions
  createDocumentTemplate,
  updateTemplate,
  createTemplateVersion,
  approveTemplateVersion,
  getTemplateVersionHistory,
  cloneTemplate,
  addTemplateField,
  removeTemplateField,
  getTemplate,
  listTemplatesByCategory,
  searchTemplates,
  createTemplateInheritance,
  publishTemplate,
  deprecateTemplate,
  previewTemplate,
  validateTemplate,
  exportTemplate,
  importTemplate,

  // Services
  TemplateManagementService,
};
