import { ChronicCondition } from '@/database';

/**
 * Paginated search results with metadata.
 */
export interface ChronicConditionSearchResult {
  /** Array of ChronicCondition instances with associations */
  conditions: ChronicCondition[];

  /** Total count of matching records (across all pages) */
  total: number;

  /** Current page number */
  page: number;

  /** Total number of pages available */
  pages: number;
}
