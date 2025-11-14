/**
 * Aggregated statistics for chronic condition management and reporting.
 *
 * Provides population health metrics, compliance tracking, and resource planning data.
 */
export interface ChronicConditionStatistics {
  /** Total count of active chronic conditions */
  total: number;

  /** Count breakdown by status (ACTIVE, MANAGED, RESOLVED, MONITORING) */
  byStatus: Record<string, number>;

  /** Count of conditions requiring IEP plans */
  requiresIEP: number;

  /** Count of conditions requiring 504 accommodation plans */
  requires504: number;

  /** Count of conditions needing review within 30 days */
  reviewDueSoon: number;

  /** Count of conditions with ACTIVE status */
  activeConditions: number;
}
