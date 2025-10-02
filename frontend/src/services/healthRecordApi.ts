import api from './api';

export interface HealthRecord {
  id: string;
  type: string;
  date: string;
  description: string;
  vital?: any;
  provider?: string;
  notes?: string;
  attachments?: string[];
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface ChronicCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: string;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface VaccinationRecord extends HealthRecord {
  type: 'VACCINATION';
}

export interface GrowthData {
  date: string;
  height?: number;
  weight?: number;
  bmi?: number;
  recordType: string;
}

export const healthRecordApi = {
  // Health Records
  getStudentHealthRecords: async (studentId: string, params?: any) => {
    const response = await api.get(`/health-records/student/${studentId}`, { params });
    return response.data;
  },

  createHealthRecord: async (data: any) => {
    const response = await api.post('/health-records', data);
    return response.data;
  },

  updateHealthRecord: async (id: string, data: any) => {
    const response = await api.put(`/health-records/${id}`, data);
    return response.data;
  },

  // Allergies
  getStudentAllergies: async (studentId: string) => {
    const response = await api.get(`/health-records/allergies/${studentId}`);
    return response.data;
  },

  addAllergy: async (data: any) => {
    const response = await api.post('/health-records/allergies', data);
    return response.data;
  },

  updateAllergy: async (id: string, data: any) => {
    const response = await api.put(`/health-records/allergies/${id}`, data);
    return response.data;
  },

  deleteAllergy: async (id: string) => {
    const response = await api.delete(`/health-records/allergies/${id}`);
    return response.data;
  },

  // Chronic Conditions
  getStudentChronicConditions: async (studentId: string) => {
    const response = await api.get(`/health-records/chronic-conditions/${studentId}`);
    return response.data;
  },

  addChronicCondition: async (data: any) => {
    const response = await api.post('/health-records/chronic-conditions', data);
    return response.data;
  },

  updateChronicCondition: async (id: string, data: any) => {
    const response = await api.put(`/health-records/chronic-conditions/${id}`, data);
    return response.data;
  },

  deleteChronicCondition: async (id: string) => {
    const response = await api.delete(`/health-records/chronic-conditions/${id}`);
    return response.data;
  },

  // Vaccinations
  getVaccinationRecords: async (studentId: string) => {
    const response = await api.get(`/health-records/vaccinations/${studentId}`);
    return response.data;
  },

  // Growth Chart
  getGrowthChartData: async (studentId: string) => {
    const response = await api.get(`/health-records/growth/${studentId}`);
    return response.data;
  },

  // Vitals
  getRecentVitals: async (studentId: string, limit?: number) => {
    const response = await api.get(`/health-records/vitals/${studentId}`, {
      params: { limit }
    });
    return response.data;
  },

  // Health Summary
  getHealthSummary: async (studentId: string) => {
    const response = await api.get(`/health-records/summary/${studentId}`);
    return response.data;
  },

  // Search
  searchHealthRecords: async (query: string, params?: any) => {
    const response = await api.get('/health-records/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Import/Export
  exportHealthHistory: async (studentId: string) => {
    const response = await api.get(`/health-records/export/${studentId}`);
    return response.data;
  },

  importHealthRecords: async (studentId: string, data: any) => {
    const response = await api.post(`/health-records/import/${studentId}`, data);
    return response.data;
  }
};
