import { VisualizationType, ReportFrequency } from './enums';

export interface ReportDefinition {
  id: string;
  name: string;
  dataSource: string;
  fields: string[];
  filters: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
    value: string | number | Date;
  }>;
  grouping: string[];
  sorting: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  visualization: VisualizationType;
  schedule?: {
    frequency: ReportFrequency;
    recipients: string[];
    nextRun?: Date;
  };
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ReportExecutionResult {
  reportId: string;
  data: Record<string, unknown>[];
  metadata: {
    totalRecords: number;
    executionTime: number;
    generatedAt: Date;
    filters: Record<string, unknown>;
  };
}