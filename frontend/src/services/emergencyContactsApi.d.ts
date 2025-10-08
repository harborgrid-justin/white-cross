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
