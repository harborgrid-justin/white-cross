/**
 * Chronic Condition Types Module
 *
 * Centralized type definitions for chronic condition management.
 *
 * @module services/chronicCondition/types
 */

/**
 * Chronic condition status types
 */
export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING';

/**
 * Interface for creating a chronic condition record
 */
export interface CreateChronicConditionData {
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: Date;
  diagnosedBy?: string;
  status: ConditionStatus;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  accommodations?: string[];
  emergencyProtocol?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  requiresIEP?: boolean;
  requires504?: boolean;
}

/**
 * Interface for updating a chronic condition
 */
export interface UpdateChronicConditionData extends Partial<CreateChronicConditionData> {
  isActive?: boolean;
}

/**
 * Interface for chronic condition filters
 */
export interface ChronicConditionFilters {
  studentId?: string;
  status?: ConditionStatus;
  requiresIEP?: boolean;
  requires504?: boolean;
  isActive?: boolean;
  searchTerm?: string;
  reviewDueSoon?: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Statistics for chronic conditions
 */
export interface ChronicConditionStatistics {
  total: number;
  byStatus: Record<string, number>;
  requiresIEP: number;
  requires504: number;
  reviewDueSoon: number;
  activeConditions: number;
}

/**
 * Paginated search results
 */
export interface ChronicConditionSearchResult {
  conditions: any[]; // ChronicCondition type from models
  total: number;
  page: number;
  pages: number;
}

/**
 * Accommodation types
 */
export type AccommodationType = 'IEP' | '504' | 'BOTH';
