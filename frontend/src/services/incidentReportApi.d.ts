/**
 * WF-COMP-265 | incidentReportApi.d.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types | Dependencies: ../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { IncidentReport } from '../types';

export interface IncidentReportApi {
  getAll(page: number, limit: number): Promise<{ reports: IncidentReport[] }>;
  getById(id: string): Promise<{ report: IncidentReport }>;
  generateDocument(id: string): Promise<{ document: any }>;
  notifyParent(id: string, method: 'email' | 'sms' | 'voice'): Promise<void>;
}

export const incidentReportApi: IncidentReportApi;
