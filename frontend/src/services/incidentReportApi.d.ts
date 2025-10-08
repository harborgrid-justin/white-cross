import { IncidentReport } from '../types';

export interface IncidentReportApi {
  getAll(page: number, limit: number): Promise<{ reports: IncidentReport[] }>;
  getById(id: string): Promise<{ report: IncidentReport }>;
  generateDocument(id: string): Promise<{ document: any }>;
  notifyParent(id: string, method: 'email' | 'sms' | 'voice'): Promise<void>;
}

export const incidentReportApi: IncidentReportApi;
