import { ComplianceStatus } from '../enums/compliance-status.enum';
import { ReportFormat } from '../enums/report-format.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportType } from '../enums/report-type.enum';

/**
 * Report Chart Data (specific to compliance reports)
 */
export interface ReportChartData {
  chartType: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: { label: string; value: number }[];
}

/**
 * Table Data
 */
export interface TableData {
  headers: string[];
  rows: any[][];
  footer?: string[];
}

/**
 * Report Section
 */
export interface ReportSection {
  sectionTitle: string;
  sectionType: string;
  data: any;
  charts?: ReportChartData[];
  tables?: TableData[];
  summary?: string;
}

/**
 * Finding
 */
export interface Finding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  issue: string;
  details: string;
  affectedCount: number;
  requiresAction: boolean;
  dueDate?: Date;
  responsibleParty?: string;
}

/**
 * Compliance Report
 */
export interface ComplianceReport {
  id: string;
  reportType: ReportType;
  title: string;
  description?: string;
  periodStart: Date;
  periodEnd: Date;
  generatedDate: Date;
  schoolId?: string;
  schoolName?: string;
  district?: string;
  state?: string;
  summary: {
    totalRecords: number;
    compliantRecords: number;
    nonCompliantRecords: number;
    complianceRate: number;
    status: ComplianceStatus;
  };
  sections: ReportSection[];
  findings: Finding[];
  recommendations: string[];
  status: ReportStatus;
  format: ReportFormat;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  distributionList?: string[];
  sentAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Scheduled Report Configuration
 */
export interface ScheduledReportConfig {
  id: string;
  reportType: ReportType;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  format: ReportFormat;
  distributionList: string[];
  isActive: boolean;
  lastGenerated?: Date;
  nextScheduled: Date;
  createdBy: string;
}
