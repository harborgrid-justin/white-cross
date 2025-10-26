/**
 * Document template types
 *
 * @module types/documents/template
 * @description Defines document template types for reusable forms and documents
 */

import { DocumentCategory, DocumentAccessLevel } from './core';

/**
 * Template field type
 */
export enum TemplateFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  SIGNATURE = 'signature',
  INITIAL = 'initial',
  IMAGE = 'image',
  TABLE = 'table'
}

/**
 * Template status
 */
export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DEPRECATED = 'deprecated'
}

/**
 * Template field definition
 */
export interface TemplateField {
  /** Field ID */
  id: string;

  /** Field label */
  label: string;

  /** Field type */
  type: TemplateFieldType;

  /** Required field */
  required: boolean;

  /** Field position in template */
  position: {
    page?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };

  /** Default value */
  defaultValue?: unknown;

  /** Placeholder text */
  placeholder?: string;

  /** Help text */
  helpText?: string;

  /** Validation rules */
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: string;
  };

  /** Options for select, radio, checkbox */
  options?: Array<{
    label: string;
    value: string | number;
  }>;

  /** Conditional display logic */
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: unknown;
  }[];

  /** Auto-populate from student data */
  autoPopulate?: {
    source: 'student' | 'school' | 'district' | 'user';
    field: string;
  };

  /** Read-only field */
  readonly: boolean;

  /** Field order */
  order: number;
}

/**
 * Template section for grouping fields
 */
export interface TemplateSection {
  /** Section ID */
  id: string;

  /** Section title */
  title: string;

  /** Section description */
  description?: string;

  /** Section fields */
  fields: TemplateField[];

  /** Section order */
  order: number;

  /** Collapsible section */
  collapsible: boolean;

  /** Default collapsed state */
  defaultCollapsed: boolean;

  /** Conditional section display */
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: unknown;
  }[];
}

/**
 * Document template
 */
export interface DocumentTemplate {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description?: string;

  /** Template category */
  category: DocumentCategory;

  /** Template status */
  status: TemplateStatus;

  /** Template version */
  version: number;

  /** Template sections */
  sections: TemplateSection[];

  /** Template file (PDF, DOCX) */
  templateFile?: {
    id: string;
    url: string;
    mimeType: string;
  };

  /** Template thumbnail */
  thumbnailUrl?: string;

  /** Default access level for documents created from template */
  defaultAccessLevel: DocumentAccessLevel;

  /** Requires signature */
  requiresSignature: boolean;

  /** Signature template ID */
  signatureTemplateId?: string;

  /** Auto-generate from student data */
  autoGenerate: boolean;

  /** Tags */
  tags: string[];

  /** Created by */
  createdBy: string;

  /** Created by name */
  createdByName: string;

  /** Created timestamp */
  createdAt: Date;

  /** Last modified by */
  modifiedBy?: string;

  /** Last modified timestamp */
  modifiedAt?: Date;

  /** Published timestamp */
  publishedAt?: Date;

  /** Usage count */
  usageCount: number;

  /** Last used timestamp */
  lastUsedAt?: Date;

  /** School ID */
  schoolId?: string;

  /** District ID */
  districtId?: string;

  /** Is system template (cannot be deleted) */
  isSystemTemplate: boolean;

  /** Template permissions */
  permissions: {
    canView: string[];
    canUse: string[];
    canEdit: string[];
    canDelete: string[];
  };
}

/**
 * Document created from template
 */
export interface TemplateInstance {
  /** Instance ID (same as document ID) */
  id: string;

  /** Template ID */
  templateId: string;

  /** Template version used */
  templateVersion: number;

  /** Field values */
  fieldValues: Record<string, unknown>;

  /** Created from template timestamp */
  createdAt: Date;

  /** Completed timestamp */
  completedAt?: Date;

  /** Is draft */
  isDraft: boolean;

  /** Validation errors */
  validationErrors?: Array<{
    fieldId: string;
    message: string;
  }>;
}

/**
 * Template library category
 */
export interface TemplateLibraryCategory {
  /** Category ID */
  id: string;

  /** Category name */
  name: string;

  /** Category description */
  description?: string;

  /** Category icon */
  icon?: string;

  /** Number of templates */
  templateCount: number;

  /** Parent category ID */
  parentId?: string;

  /** Display order */
  order: number;
}
