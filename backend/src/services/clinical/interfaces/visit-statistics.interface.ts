/**
 * Symptom Count
 */
export interface SymptomCount {
  symptom: string;
  count: number;
}

/**
 * Visit Statistics
 * Aggregated statistics for clinic visits over a time period
 */
export interface VisitStatistics {
  /** Total number of visits */
  totalVisits: number;

  /** Average visit duration in minutes */
  averageVisitDuration: number;

  /** Visits grouped by reason */
  byReason: Record<string, number>;

  /** Visits grouped by disposition */
  byDisposition: Record<string, number>;

  /** Total class time missed in minutes */
  totalMinutesMissed: number;

  /** Average class time missed per visit in minutes */
  averageMinutesMissed: number;

  /** Number of active (not yet checked out) visits */
  activeVisits: number;

  /** Most frequently reported symptoms */
  mostCommonSymptoms: SymptomCount[];
}
