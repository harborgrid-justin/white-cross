/**
 * Data Import/Export Type Definitions
 *
 * Comprehensive type system for healthcare data import/export with HIPAA compliance,
 * streaming support, and robust validation.
 */

// ============================================================================
// Entity Types
// ============================================================================

export type EntityType =
  | 'students'
  | 'medications'
  | 'health-records'
  | 'immunizations'
  | 'allergies'
  | 'appointments'
  | 'emergency-contacts'
  | 'incidents'
  | 'documents';

export type EntityTypeConfig = {
  [K in EntityType]: {
    displayName: string;
    fields: readonly string[];
    requiredFields: readonly string[];
    uniqueFields: readonly string[];
  };
};

// ============================================================================
// Import Types
// ============================================================================

export type ImportFormat = 'csv' | 'excel' | 'json';

export type ImportFormatConfig =
  | { type: 'csv'; delimiter: string; hasHeader: boolean; encoding: string }
  | { type: 'excel'; sheetName?: string; startRow?: number }
  | { type: 'json'; schema?: string };

export interface ImportOptions {
  batchSize: number;
  skipErrors: boolean;
  errorThreshold: number; // Max errors before aborting
  duplicateStrategy: DuplicateStrategy;
  validateOnly: boolean; // Dry run
  createCheckpoints: boolean;
  notifyOnComplete: boolean;
}

export type DuplicateStrategy = 'skip' | 'update' | 'error' | 'prompt';

export interface FieldMapping<T extends EntityType = EntityType> {
  entityType: T;
  mappings: Array<{
    sourceField: string;
    targetField: string;
    transform?: FieldTransform;
    validator?: FieldValidator;
  }>;
}

export type FieldTransform =
  | { type: 'uppercase' }
  | { type: 'lowercase' }
  | { type: 'trim' }
  | { type: 'date'; format: string }
  | { type: 'number'; decimals?: number }
  | { type: 'boolean'; trueValues: string[]; falseValues: string[] }
  | { type: 'split'; delimiter: string; index: number }
  | { type: 'regex'; pattern: string; replacement: string }
  | { type: 'custom'; fn: (value: unknown) => unknown };

export type FieldValidator =
  | { type: 'required' }
  | { type: 'email' }
  | { type: 'phone' }
  | { type: 'date'; format?: string }
  | { type: 'number'; min?: number; max?: number }
  | { type: 'length'; min?: number; max?: number }
  | { type: 'regex'; pattern: string }
  | { type: 'enum'; values: readonly string[] }
  | { type: 'custom'; fn: (value: unknown) => boolean; message: string };

export interface ImportConfig<T extends EntityType = EntityType> {
  entityType: T;
  format: ImportFormatConfig;
  mapping: FieldMapping<T>;
  options: ImportOptions;
}

export interface ImportResult {
  importId: string;
  status: ImportStatus;
  entityType: EntityType;
  startedAt: Date;
  completedAt?: Date;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  skippedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  checkpoints: ImportCheckpoint[];
  metadata: Record<string, unknown>;
}

export type ImportStatus =
  | 'pending'
  | 'validating'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

export interface ImportError {
  row: number;
  field?: string;
  code: string;
  message: string;
  severity: 'error' | 'critical';
  data?: unknown;
}

export interface ImportWarning {
  row: number;
  field?: string;
  message: string;
  data?: unknown;
}

export interface ImportCheckpoint {
  id: string;
  rowNumber: number;
  timestamp: Date;
  state: unknown;
}

export interface ImportProgress {
  importId: string;
  status: ImportStatus;
  currentRow: number;
  totalRows: number;
  percentage: number;
  estimatedTimeRemaining?: number;
  throughput: number; // rows per second
  errors: number;
  warnings: number;
}

// ============================================================================
// Export Types
// ============================================================================

export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

export type ExportFormatConfig =
  | { type: 'csv'; delimiter: string; includeHeader: boolean }
  | { type: 'excel'; sheetName: string; autoFilter: boolean }
  | { type: 'json'; pretty: boolean; schema?: string }
  | { type: 'pdf'; template?: string; orientation: 'portrait' | 'landscape' };

export interface ExportOptions {
  compress: boolean;
  sanitize: boolean; // Remove PHI
  includeMetadata: boolean;
  emailTo?: string[];
  schedule?: ExportSchedule;
  encryption?: ExportEncryption;
}

export interface ExportSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  time?: string; // HH:mm format
  dayOfWeek?: number; // 0-6
  dayOfMonth?: number; // 1-31
  enabled: boolean;
}

export interface ExportEncryption {
  enabled: boolean;
  algorithm: 'aes-256-gcm';
  password?: string;
}

export interface FieldSelection<T extends EntityType = EntityType> {
  entityType: T;
  fields: Array<{
    field: string;
    label?: string;
    transform?: FieldTransform;
  }>;
}

export interface ExportConfig<T extends EntityType = EntityType> {
  entityType: T;
  format: ExportFormatConfig;
  fields: FieldSelection<T>;
  filters?: ExportFilters;
  options: ExportOptions;
}

export interface ExportFilters {
  dateRange?: { start: Date; end: Date };
  searchQuery?: string;
  customFilters?: Record<string, unknown>;
}

export interface ExportResult {
  exportId: string;
  status: ExportStatus;
  entityType: EntityType;
  startedAt: Date;
  completedAt?: Date;
  totalRecords: number;
  exportedRecords: number;
  fileSize?: number;
  fileUrl?: string;
  fileName?: string;
  errors: ExportError[];
}

export type ExportStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ExportError {
  recordId?: string;
  code: string;
  message: string;
  severity: 'error' | 'critical';
}

export interface ExportProgress {
  exportId: string;
  status: ExportStatus;
  currentRecord: number;
  totalRecords: number;
  percentage: number;
  estimatedTimeRemaining?: number;
}

// ============================================================================
// Template Types
// ============================================================================

export interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  entityType: EntityType;
  format: ImportFormatConfig;
  mapping: FieldMapping;
  options: Partial<ImportOptions>;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isPublic: boolean;
  tags: string[];
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  entityType: EntityType;
  format: ExportFormatConfig;
  fields: FieldSelection;
  filters?: ExportFilters;
  options: Partial<ExportOptions>;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isPublic: boolean;
  tags: string[];
}

// ============================================================================
// History Types
// ============================================================================

export interface ImportHistory {
  id: string;
  userId: string;
  userName: string;
  entityType: EntityType;
  fileName: string;
  fileSize: number;
  format: ImportFormat;
  status: ImportStatus;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  templateId?: string;
  metadata: Record<string, unknown>;
}

export interface ExportHistory {
  id: string;
  userId: string;
  userName: string;
  entityType: EntityType;
  fileName: string;
  fileSize?: number;
  format: ExportFormat;
  status: ExportStatus;
  totalRecords: number;
  exportedRecords: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  templateId?: string;
  downloadUrl?: string;
  expiresAt?: Date;
  metadata: Record<string, unknown>;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  row?: number;
  code: string;
  message: string;
  value?: unknown;
}

export interface ValidationWarning {
  field: string;
  row?: number;
  message: string;
  value?: unknown;
}

export interface ValidationRule {
  field: string;
  validators: FieldValidator[];
  required?: boolean;
}

export interface ValidationSchema {
  entityType: EntityType;
  rules: ValidationRule[];
  customValidators?: Array<{
    name: string;
    fn: (data: unknown) => ValidationResult;
  }>;
}

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export interface ConflictResolution {
  conflicts: DataConflict[];
  strategy: ConflictStrategy;
}

export interface DataConflict {
  id: string;
  row: number;
  field: string;
  existingValue: unknown;
  newValue: unknown;
  recordIdentifier: string;
  resolution?: 'keep-existing' | 'use-new' | 'merge' | 'skip';
}

export type ConflictStrategy =
  | { type: 'automatic'; strategy: DuplicateStrategy }
  | { type: 'manual'; resolutions: Map<string, DataConflict['resolution']> };

// ============================================================================
// Sanitization Types
// ============================================================================

export interface SanitizationConfig {
  removePHI: boolean;
  maskSSN: boolean;
  maskDOB: boolean;
  removeNotes: boolean;
  removeDiagnosticCodes: boolean;
  customRules?: SanitizationRule[];
}

export interface SanitizationRule {
  field: string;
  action: 'remove' | 'mask' | 'hash' | 'anonymize';
  options?: {
    maskChar?: string;
    keepFirst?: number;
    keepLast?: number;
    hashAlgorithm?: 'sha256' | 'md5';
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export type Branded<T, Brand extends string> = T & { __brand: Brand };

export type ValidatedData<T> = Branded<T, 'validated'>;
export type SanitizedData<T> = Branded<T, 'sanitized'>;
export type EncryptedData = Branded<string, 'encrypted'>;

// Type guard functions
export function isValidatedData<T>(data: T | ValidatedData<T>): data is ValidatedData<T> {
  return '__brand' in (data as object) && (data as { __brand: string }).__brand === 'validated';
}

export function isSanitizedData<T>(data: T | SanitizedData<T>): data is SanitizedData<T> {
  return '__brand' in (data as object) && (data as { __brand: string }).__brand === 'sanitized';
}

// ============================================================================
// API Types
// ============================================================================

export interface ImportApiRequest {
  file: File;
  config: ImportConfig;
}

export interface ImportApiResponse {
  importId: string;
  status: ImportStatus;
  message: string;
}

export interface ExportApiRequest {
  config: ExportConfig;
}

export interface ExportApiResponse {
  exportId: string;
  status: ExportStatus;
  message: string;
}
