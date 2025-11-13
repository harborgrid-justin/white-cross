/**
 * @fileoverview Transcript Report Interfaces
 * @module academic-transcript/interfaces/transcript-report.interface
 * @description Type-safe interfaces for transcript reports
 */

import { AcademicRecord } from './academic-record.interface';

/**
 * Student information for transcript report
 */
export interface TranscriptStudentInfo {
  id: string;
  name: string;
  studentNumber: string;
  grade: string;
  dateOfBirth: Date;
  enrollmentDate?: Date;
}

/**
 * Summary statistics for transcript report
 */
export interface TranscriptSummary {
  totalRecords: number;
  totalCredits: number;
  cumulativeGPA: number;
}

/**
 * Base transcript report data
 */
export interface TranscriptReportData {
  student: TranscriptStudentInfo;
  summary: TranscriptSummary;
  academicRecords: AcademicRecord[];
  generatedAt: Date;
  format: 'pdf' | 'html' | 'json';
}

/**
 * JSON format transcript report
 */
export interface JsonTranscriptReport extends TranscriptReportData {
  format: 'json';
}

/**
 * PDF format transcript report
 */
export interface PdfTranscriptReport extends TranscriptReportData {
  format: 'pdf';
  pdfData: string;
  downloadUrl: string;
  note?: string;
}

/**
 * HTML format transcript report
 */
export interface HtmlTranscriptReport extends TranscriptReportData {
  format: 'html';
  htmlContent: string;
  note?: string;
}

/**
 * Union type for all transcript report formats
 */
export type TranscriptReport =
  | JsonTranscriptReport
  | PdfTranscriptReport
  | HtmlTranscriptReport;
