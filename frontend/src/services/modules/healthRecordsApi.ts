import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import { 
  HealthRecord, 
  Allergy, 
  ChronicCondition, 
  VitalSigns,
  ApiResponse, 
  PaginationParams 
} from '../types';

export interface HealthRecordFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  provider?: string;
}

export interface GrowthData {
  date: string;
  height?: number;
  weight?: number;
  bmi?: number;
  recordType: string;
}

export interface VaccinationRecord extends HealthRecord {
  type: 'VACCINATION';
  vaccineType: string;
  manufacturer?: string;
  lotNumber?: string;
  administered: boolean;
  nextDueDate?: string;
}

export interface HealthSummary {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  recentVitals: VitalSigns;
  vaccinations: VaccinationRecord[];
  lastPhysical?: string;
  alerts: string[];
}

export interface HealthRecordsApi {
  // Health Records
  getStudentHealthRecords(studentId: string, filters?: HealthRecordFilters): Promise<{ records: HealthRecord[] }>;
  createHealthRecord(data: Partial<HealthRecord>): Promise<{ record: HealthRecord }>;
  updateHealthRecord(id: string, data: Partial<HealthRecord>): Promise<{ record: HealthRecord }>;
  deleteHealthRecord(id: string): Promise<void>;

  // Allergies
  getStudentAllergies(studentId: string): Promise<{ allergies: Allergy[] }>;
  addAllergy(data: Partial<Allergy>): Promise<{ allergy: Allergy }>;
  updateAllergy(id: string, data: Partial<Allergy>): Promise<{ allergy: Allergy }>;
  deleteAllergy(id: string): Promise<void>;
  verifyAllergy(id: string, verifiedBy: string): Promise<{ allergy: Allergy }>;

  // Chronic Conditions
  getStudentChronicConditions(studentId: string): Promise<{ conditions: ChronicCondition[] }>;
  addChronicCondition(data: Partial<ChronicCondition>): Promise<{ condition: ChronicCondition }>;
  updateChronicCondition(id: string, data: Partial<ChronicCondition>): Promise<{ condition: ChronicCondition }>;
  deleteChronicCondition(id: string): Promise<void>;

  // Vaccinations
  getVaccinationRecords(studentId: string): Promise<{ vaccinations: VaccinationRecord[] }>;
  addVaccinationRecord(data: Partial<VaccinationRecord>): Promise<{ vaccination: VaccinationRecord }>;
  updateVaccinationRecord(id: string, data: Partial<VaccinationRecord>): Promise<{ vaccination: VaccinationRecord }>;

  // Growth Chart
  getGrowthChartData(studentId: string): Promise<{ growthData: GrowthData[] }>;
  addGrowthMeasurement(studentId: string, data: Partial<GrowthData>): Promise<{ measurement: GrowthData }>;

  // Vitals
  getRecentVitals(studentId: string, limit?: number): Promise<{ vitals: VitalSigns[] }>;
  recordVitals(studentId: string, vitals: VitalSigns): Promise<{ record: HealthRecord }>;

  // Health Summary
  getHealthSummary(studentId: string): Promise<HealthSummary>;

  // Search and Reporting
  searchHealthRecords(query: string, filters?: HealthRecordFilters): Promise<{ records: HealthRecord[] }>;
  getAllRecords(pagination?: PaginationParams, filters?: HealthRecordFilters): Promise<{ records: HealthRecord[]; pagination: any }>;

  // Import/Export
  exportHealthHistory(studentId: string, format?: 'pdf' | 'json'): Promise<Blob>;
  importHealthRecords(studentId: string, file: File): Promise<{ imported: number; errors: any[] }>;

  // Audit and Access Logging
  logAccess(data: { action: string; studentId: string; resourceType?: string; resourceId?: string; details?: any }): Promise<void>;
  logSecurityEvent(data: { event: string; resourceType: string; studentId: string; details?: any }): Promise<void>;
}

class HealthRecordsApiImpl implements HealthRecordsApi {
  // Health Records
  async getStudentHealthRecords(studentId: string, filters: HealthRecordFilters = {}): Promise<{ records: HealthRecord[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<({ records: HealthRecord[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/student/${studentId}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async createHealthRecord(data: Partial<HealthRecord>): Promise<{ record: HealthRecord }> {
    const response = await apiInstance.post<ApiResponse<({ record: HealthRecord })> | undefined>(
      API_ENDPOINTS.HEALTH_RECORDS.BASE,
      data
    );
    return extractApiData(response as any);
  }

  async updateHealthRecord(id: string, data: Partial<HealthRecord>): Promise<{ record: HealthRecord }> {
    const response = await apiInstance.put<ApiResponse<({ record: HealthRecord })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/${id}`,
      data
    );
    return extractApiData(response as any);
  }

  async deleteHealthRecord(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/${id}`);
  }

  // Allergies
  async getStudentAllergies(studentId: string): Promise<{ allergies: Allergy[] }> {
    const response = await apiInstance.get<ApiResponse<({ allergies: Allergy[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${studentId}`
    );
    return extractApiData(response as any);
  }

  async addAllergy(data: Partial<Allergy>): Promise<{ allergy: Allergy }> {
    const response = await apiInstance.post<ApiResponse<({ allergy: Allergy })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/allergies`,
      data
    );
    return extractApiData(response as any);
  }

  async updateAllergy(id: string, data: Partial<Allergy>): Promise<{ allergy: Allergy }> {
    const response = await apiInstance.put<ApiResponse<({ allergy: Allergy })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${id}`,
      data
    );
    return extractApiData(response as any);
  }

  async deleteAllergy(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${id}`);
  }

  async verifyAllergy(id: string, verifiedBy: string): Promise<{ allergy: Allergy }> {
    const response = await apiInstance.post<ApiResponse<({ allergy: Allergy })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/allergies/${id}/verify`,
      { verifiedBy }
    );
    return extractApiData(response as any);
  }

  // Chronic Conditions
  async getStudentChronicConditions(studentId: string): Promise<{ conditions: ChronicCondition[] }> {
    const response = await apiInstance.get<ApiResponse<({ conditions: ChronicCondition[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions/${studentId}`
    );
    return extractApiData(response as any);
  }

  async addChronicCondition(data: Partial<ChronicCondition>): Promise<{ condition: ChronicCondition }> {
    const response = await apiInstance.post<ApiResponse<({ condition: ChronicCondition })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions`,
      data
    );
    return extractApiData(response as any);
  }

  async updateChronicCondition(id: string, data: Partial<ChronicCondition>): Promise<{ condition: ChronicCondition }> {
    const response = await apiInstance.put<ApiResponse<({ condition: ChronicCondition })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions/${id}`,
      data
    );
    return extractApiData(response as any);
  }

  async deleteChronicCondition(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.HEALTH_RECORDS}/chronic-conditions/${id}`);
  }

  // Vaccinations
  async getVaccinationRecords(studentId: string): Promise<{ vaccinations: VaccinationRecord[] }> {
    const response = await apiInstance.get<ApiResponse<({ vaccinations: VaccinationRecord[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations/${studentId}`
    );
    return extractApiData(response as any);
  }

  async addVaccinationRecord(data: Partial<VaccinationRecord>): Promise<{ vaccination: VaccinationRecord }> {
    const response = await apiInstance.post<ApiResponse<({ vaccination: VaccinationRecord })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations`,
      data
    );
    return extractApiData(response as any);
  }

  async updateVaccinationRecord(id: string, data: Partial<VaccinationRecord>): Promise<{ vaccination: VaccinationRecord }> {
    const response = await apiInstance.put<ApiResponse<({ vaccination: VaccinationRecord })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations/${id}`,
      data
    );
    return extractApiData(response as any);
  }

  // Growth Chart
  async getGrowthChartData(studentId: string): Promise<{ growthData: GrowthData[] }> {
    const response = await apiInstance.get<ApiResponse<({ growthData: GrowthData[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/growth/${studentId}`
    );
    return extractApiData(response as any);
  }

  async addGrowthMeasurement(studentId: string, data: Partial<GrowthData>): Promise<{ measurement: GrowthData }> {
    const response = await apiInstance.post<ApiResponse<({ measurement: GrowthData })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/growth/${studentId}`,
      data
    );
    return extractApiData(response as any);
  }

  // Vitals
  async getRecentVitals(studentId: string, limit: number = 10): Promise<{ vitals: VitalSigns[] }> {
    const params = buildUrlParams({ limit });
    const response = await apiInstance.get<ApiResponse<({ vitals: VitalSigns[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/vitals/${studentId}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async recordVitals(studentId: string, vitals: VitalSigns): Promise<{ record: HealthRecord }> {
    const response = await apiInstance.post<ApiResponse<({ record: HealthRecord })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/vitals/${studentId}`,
      vitals
    );
    return extractApiData(response as any);
  }

  // Health Summary
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    const response = await apiInstance.get<ApiResponse<(HealthSummary)> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/summary/${studentId}`
    );
    return extractApiData(response as any);
  }

  // Search and Reporting
  async searchHealthRecords(query: string, filters: HealthRecordFilters = {}): Promise<{ records: HealthRecord[] }> {
    const params = buildUrlParams({ q: query, ...filters });
    const response = await apiInstance.get<ApiResponse<({ records: HealthRecord[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/search?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  async getAllRecords(pagination: PaginationParams = {}, filters: HealthRecordFilters = {}): Promise<{ records: HealthRecord[]; pagination: any }> {
    const params = buildUrlParams({ ...pagination, ...filters });
    const response = await apiInstance.get<ApiResponse<({ records: HealthRecord[]; pagination: any })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}?${params.toString()}`
    );
    return extractApiData(response as any);
  }

  // Import/Export
  async exportHealthHistory(studentId: string, format: 'pdf' | 'json' = 'pdf'): Promise<Blob> {
    const response = await apiInstance.get(
      `${API_ENDPOINTS.HEALTH_RECORDS}/export/${studentId}?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async importHealthRecords(studentId: string, file: File): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiInstance.post<ApiResponse<({ imported: number; errors: any[] })> | undefined>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/import/${studentId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return extractApiData(response as any);
  }

  // Audit and Access Logging
  async logAccess(data: { action: string; studentId: string; resourceType?: string; resourceId?: string; details?: any }): Promise<void> {
    await apiInstance.post(`${`/audit`}/access-log`, {
      ...data,
      resourceType: data.resourceType || 'HEALTH_RECORD'
    });
  }

  async logSecurityEvent(data: { event: string; resourceType: string; studentId: string; details?: any }): Promise<void> {
    await apiInstance.post(`${`/audit`}/security-log`, data);
  }
}

export const healthRecordsApi = new HealthRecordsApiImpl();
