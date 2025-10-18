/**
 * WF-COMP-262 | emergencyContactsApi.d.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

export interface EmergencyContact {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';
  isActive: boolean;
  verified?: boolean;
  verifiedAt?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface EmergencyContactsApi {
  getByStudent(studentId: string): Promise<{ contacts: EmergencyContact[] }>;
  getStatistics(): Promise<any>;
  create(data: any): Promise<{ contact: EmergencyContact }>;
  update(id: string, data: any): Promise<{ contact: EmergencyContact }>;
  delete(id: string): Promise<void>;
  notifyStudent(studentId: string, data: any): Promise<void>;
  verify(contactId: string, method: 'sms' | 'email' | 'voice'): Promise<void>;
}

export const emergencyContactsApi: EmergencyContactsApi;
