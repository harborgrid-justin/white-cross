/**
 * Student Visit Summary
 * Aggregated visit history for a specific student
 */
export interface StudentVisitSummary {
  /** Student ID */
  studentId: string;

  /** Total number of visits */
  totalVisits: number;

  /** Average visit duration in minutes */
  averageDuration: number;

  /** Total class time missed in minutes */
  totalMinutesMissed: number;

  /** Most common reasons for visits */
  mostCommonReasons: string[];

  /** Date of most recent visit */
  lastVisitDate: Date;

  /** Visit frequency (visits per month) */
  visitFrequency: number;
}
