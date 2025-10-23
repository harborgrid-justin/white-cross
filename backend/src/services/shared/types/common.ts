/**
 * Common TypeScript types and interfaces used across multiple services
 */

import type { FieldChange, ValidationError as ValidationErrorType } from '../../../types/validation';

// Common ID type
export type ID = string;

// Common timestamp interface
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// Base entity interface
export interface BaseEntity extends Timestamps {
  id: ID;
  isActive?: boolean;
}

// Common service response interface
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Bulk operation result
export interface BulkOperationResult {
  processed: number;
  successful: number;
  failed: number;
  errors: string[];
}

// Search query interface
export interface SearchQuery {
  query: string;
  limit?: number;
  fields?: string[];
}

// Date range interface
export interface DateRange {
  from?: Date;
  to?: Date;
}

// Sort order interface
export interface SortOrder {
  field: string;
  direction: 'ASC' | 'DESC';
}

// Common metadata interface
export interface EntityMetadata {
  createdBy?: ID;
  updatedBy?: ID;
  version?: number;
  tags?: string[];
  notes?: string;
}

// File attachment interface
export interface FileAttachment {
  id: ID;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: ID;
}

// Address interface (for emergency contacts, etc.)
export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// Phone number interface
export interface PhoneNumber {
  number: string;
  type: 'HOME' | 'WORK' | 'MOBILE' | 'OTHER';
  isPrimary?: boolean;
}

// Email interface
export interface Email {
  address: string;
  type: 'PERSONAL' | 'WORK' | 'OTHER';
  isPrimary?: boolean;
}

// Contact information interface
export interface ContactInfo {
  phones?: PhoneNumber[];
  emails?: Email[];
  address?: Address;
}

// Audit trail entry
export interface AuditEntry {
  action: string;
  entityType: string;
  entityId: ID;
  userId: ID;
  timestamp: Date;
  changes?: FieldChange[];
  ipAddress?: string;
  userAgent?: string;
}

// Generic key-value pair (no default type - forces explicit typing)
export interface KeyValuePair<T> {
  key: string;
  value: T;
}

// Configuration setting
export interface ConfigSetting extends KeyValuePair<string | number | boolean> {
  description?: string;
  category?: string;
  isSystem?: boolean;
}

// Status interface for entities with lifecycle states
export interface EntityStatus {
  status: string;
  statusDate: Date;
  statusBy?: ID;
  statusReason?: string;
}

// Generic filter base
export interface BaseFilter {
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  createdBy?: ID;
  search?: string;
}

// Re-export ValidationError from centralized types
export type { ValidationError } from '../../../types/validation';

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Export/import operation result
export interface ExportImportResult {
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: string[];
  exportUrl?: string;
  completedAt: Date;
}

// Common enums as types
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL' | 'LIFE_THREATENING';
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'ARCHIVED';
