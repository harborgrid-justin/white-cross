/**
 * Pagination Interfaces
 *
 * Standard pagination structures for health record queries
 *
 * @module PaginationInterfaces
 */

/**
 * Pagination metadata for query results
 */
export interface PaginationResult {
  /** Current page number */
  page: number;

  /** Records per page limit */
  limit: number;

  /** Total number of records */
  total: number;

  /** Total number of pages */
  pages: number;
}

/**
 * Paginated health records response
 */
export interface PaginatedHealthRecords<T> {
  /** Array of records */
  records: T[];

  /** Pagination metadata */
  pagination: PaginationResult;
}

/**
 * Growth data point for CDC growth charts
 */
export interface GrowthDataPoint {
  /** Measurement date */
  date: Date;

  /** Height in centimeters */
  height?: number;

  /** Weight in kilograms */
  weight?: number;

  /** Body Mass Index */
  bmi?: number;

  /** Type of health record */
  recordType: string;
}

/**
 * Comprehensive health summary
 */
export interface HealthSummary {
  /** Student demographic information */
  student: any;

  /** All student allergies */
  allergies: any[];

  /** Recent vital signs measurements */
  recentVitals: any[];

  /** Recent vaccinations */
  recentVaccinations: any[];

  /** Count of records by type */
  recordCounts: Record<string, number>;
}

/**
 * Import operation results
 */
export interface ImportResults {
  /** Number of records successfully imported */
  imported: number;

  /** Number of records skipped */
  skipped: number;

  /** Array of error messages */
  errors: string[];
}

/**
 * Bulk delete operation results
 */
export interface BulkDeleteResults {
  /** Number of records deleted */
  deleted: number;

  /** Number of records not found */
  notFound: number;

  /** Overall operation success */
  success: boolean;
}

/**
 * Health record statistics
 */
export interface HealthRecordStatistics {
  /** Total number of health records */
  totalRecords: number;

  /** Number of active allergies */
  activeAllergies: number;

  /** Number of chronic conditions */
  chronicConditions: number;

  /** Number of vaccinations due */
  vaccinationsDue: number;

  /** Number of recent records (last 30 days) */
  recentRecords: number;
}
