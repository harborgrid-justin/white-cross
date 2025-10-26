/**
 * Core Search Types and Interfaces
 *
 * Comprehensive type definitions for search functionality across all entities
 */

import { z } from 'zod';

// ==================== Enums ====================

export enum SearchEntityType {
  STUDENT = 'student',
  MEDICATION = 'medication',
  HEALTH_RECORD = 'health_record',
  DOCUMENT = 'document',
  APPOINTMENT = 'appointment',
  INCIDENT = 'incident',
  EMERGENCY_CONTACT = 'emergency_contact',
  INVENTORY_ITEM = 'inventory_item',
  USER = 'user',
  ALL = 'all',
}

export enum SearchOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  BETWEEN = 'between',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
  REGEX = 'regex',
}

export enum SearchSortOrder {
  RELEVANCE = 'relevance',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  CUSTOM = 'custom',
}

export enum SearchIndexField {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  TAGS = 'tags',
  METADATA = 'metadata',
  CONTENT = 'content',
  DATE_CREATED = 'dateCreated',
  DATE_MODIFIED = 'dateModified',
  ENTITY_TYPE = 'entityType',
}

// ==================== Zod Schemas ====================

export const FilterValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.date(),
  z.array(z.union([z.string(), z.number(), z.boolean(), z.date()])),
  z.null(),
]);

export const FilterConditionSchema = z.object({
  field: z.string(),
  operator: z.nativeEnum(FilterOperator),
  value: FilterValueSchema,
  label: z.string().optional(),
});

export const FilterGroupSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    operator: z.nativeEnum(SearchOperator),
    conditions: z.array(
      z.union([FilterConditionSchema, FilterGroupSchema])
    ),
  })
);

export const SearchQuerySchema = z.object({
  query: z.string(),
  entityType: z.nativeEnum(SearchEntityType).default(SearchEntityType.ALL),
  filters: FilterGroupSchema.optional(),
  sortBy: z.nativeEnum(SearchSortOrder).default(SearchSortOrder.RELEVANCE),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  includeMetadata: z.boolean().default(false),
  fuzzySearch: z.boolean().default(true),
  phoneticSearch: z.boolean().default(false),
  highlightResults: z.boolean().default(true),
});

export const SearchResultSchema = z.object({
  id: z.string(),
  entityType: z.nativeEnum(SearchEntityType),
  title: z.string(),
  description: z.string().optional(),
  snippet: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  score: z.number(),
  metadata: z.record(z.any()).optional(),
  url: z.string().optional(),
  dateCreated: z.date().optional(),
  dateModified: z.date().optional(),
});

export const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  query: z.string(),
  executionTimeMs: z.number(),
  facets: z.record(z.array(z.object({
    value: z.string(),
    count: z.number(),
  }))).optional(),
  suggestions: z.array(z.string()).optional(),
});

export const SearchSuggestionSchema = z.object({
  text: z.string(),
  score: z.number(),
  entityType: z.nativeEnum(SearchEntityType).optional(),
  metadata: z.record(z.any()).optional(),
});

export const SavedSearchSchema = z.object({
  id: z.string(),
  name: z.string(),
  query: SearchQuerySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  isShared: z.boolean().default(false),
  description: z.string().optional(),
});

export const SearchHistoryEntrySchema = z.object({
  id: z.string(),
  query: z.string(),
  entityType: z.nativeEnum(SearchEntityType),
  timestamp: z.date(),
  resultCount: z.number(),
  clickedResultId: z.string().optional(),
});

export const FilterPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  entityType: z.nativeEnum(SearchEntityType),
  filters: FilterGroupSchema,
  icon: z.string().optional(),
  color: z.string().optional(),
});

// ==================== Type Exports ====================

export type FilterValue = z.infer<typeof FilterValueSchema>;
export type FilterCondition = z.infer<typeof FilterConditionSchema>;
export type FilterGroup = z.infer<typeof FilterGroupSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type SearchSuggestion = z.infer<typeof SearchSuggestionSchema>;
export type SavedSearch = z.infer<typeof SavedSearchSchema>;
export type SearchHistoryEntry = z.infer<typeof SearchHistoryEntrySchema>;
export type FilterPreset = z.infer<typeof FilterPresetSchema>;

// ==================== Interfaces ====================

export interface SearchIndexDocument {
  id: string;
  entityType: SearchEntityType;
  title: string;
  content: string;
  searchableText: string;
  metadata: Record<string, any>;
  dateCreated: Date;
  dateModified: Date;
  tags: string[];
  isPHI: boolean; // HIPAA compliance flag
}

export interface SearchOptions {
  caseSensitive?: boolean;
  fuzzyThreshold?: number; // 0-1, Levenshtein distance threshold
  maxSuggestions?: number;
  highlightPrefix?: string;
  highlightSuffix?: string;
  stopWords?: string[];
  stemming?: boolean;
  synonyms?: Record<string, string[]>;
}

export interface SearchConfig {
  indexName: string;
  entityType: SearchEntityType;
  searchableFields: string[];
  filterableFields: string[];
  sortableFields: string[];
  facetFields?: string[];
  defaultPageSize: number;
  maxPageSize: number;
  enableFuzzySearch: boolean;
  enablePhoneticSearch: boolean;
  enableSynonyms: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
}

export interface FacetResult {
  field: string;
  values: Array<{
    value: string;
    count: number;
    selected?: boolean;
  }>;
}

export interface SearchAnalytics {
  queryId: string;
  query: string;
  resultCount: number;
  clickPosition?: number;
  clickedResultId?: string;
  executionTimeMs: number;
  timestamp: Date;
  userId?: string;
  userAgent?: string;
}

export interface SearchAutocompleteOptions {
  minChars: number;
  maxSuggestions: number;
  debounceMs: number;
  includeRecent: boolean;
  includePopular: boolean;
}

export interface SearchExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  includeMetadata: boolean;
  maxRecords?: number;
  fields?: string[];
}

// ==================== Entity-Specific Types ====================

export interface StudentSearchMetadata {
  studentId: string;
  grade: string;
  schoolId: string;
  schoolName: string;
  isActive: boolean;
  hasHealthConditions: boolean;
  hasMedications: boolean;
}

export interface MedicationSearchMetadata {
  medicationId: string;
  studentId: string;
  studentName: string;
  medicationType: string;
  isActive: boolean;
  expirationDate?: Date;
  requiresAuthorization: boolean;
}

export interface DocumentSearchMetadata {
  documentId: string;
  documentType: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  isPHI: boolean;
}

export interface HealthRecordSearchMetadata {
  recordId: string;
  studentId: string;
  recordType: string;
  dateOfVisit: Date;
  provider?: string;
  diagnoses: string[];
}

export interface AppointmentSearchMetadata {
  appointmentId: string;
  studentId: string;
  studentName: string;
  appointmentType: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  provider?: string;
}

export interface IncidentSearchMetadata {
  incidentId: string;
  studentId: string;
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateReported: Date;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
}

// ==================== Search Context Types ====================

export interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  entityType: SearchEntityType;
  setEntityType: (type: SearchEntityType) => void;
  filters: FilterGroup | undefined;
  setFilters: (filters: FilterGroup | undefined) => void;
  results: SearchResult[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  executeSearch: () => Promise<void>;
  clearSearch: () => void;
  addFilter: (condition: FilterCondition) => void;
  removeFilter: (field: string) => void;
  saveSearch: (name: string, description?: string) => Promise<void>;
  loadSavedSearch: (id: string) => Promise<void>;
  exportResults: (options: SearchExportOptions) => Promise<void>;
}

// ==================== Utility Types ====================

export type SearchResultWithMetadata<T extends Record<string, any>> = SearchResult & {
  metadata: T;
};

export type EntitySearchResult =
  | SearchResultWithMetadata<StudentSearchMetadata>
  | SearchResultWithMetadata<MedicationSearchMetadata>
  | SearchResultWithMetadata<DocumentSearchMetadata>
  | SearchResultWithMetadata<HealthRecordSearchMetadata>
  | SearchResultWithMetadata<AppointmentSearchMetadata>
  | SearchResultWithMetadata<IncidentSearchMetadata>;

export interface SearchDebounceOptions {
  delay: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}
