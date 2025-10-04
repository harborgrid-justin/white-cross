import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import { 
  Medication, 
  MedicationAdministration, 
  ApiResponse, 
  PaginationParams,
  DateRangeFilter 
} from '../types';

export interface MedicationFilters extends PaginationParams {
  search?: string;
  isControlled?: boolean;
  category?: string;
  expirationWarning?: boolean;
}

export interface StudentMedication {
  id: string;
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  prescribedBy: string;
  isActive: boolean;
  medication: Medication;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

export interface MedicationSchedule {
  id: string;
  studentMedicationId: string;
  scheduledTime: string;
  dosage: string;
  administered: boolean;
  administeredBy?: string;
  administeredAt?: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  medication: {
    id: string;
    name: string;
    dosage: string;
  };
}

export interface InventoryItem {
  id: string;
  medicationId: string;
  quantity: number;
  lotNumber?: string;
  expirationDate: string;
  location?: string;
  medication: Medication;
}

export interface AdverseReaction {
  id: string;
  studentId: string;
  medicationId: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  onset: string;
  treatment?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface MedicationsApi {
  // Medications CRUD
  getAll(filters?: MedicationFilters): Promise<{ medications: Medication[]; pagination: any }>;
  getById(id: string): Promise<{ medication: Medication }>;
  create(medicationData: Partial<Medication>): Promise<{ medication: Medication }>;
  update(id: string, medicationData: Partial<Medication>): Promise<{ medication: Medication }>;
  delete(id: string): Promise<void>;
  search(query: string, limit?: number): Promise<{ medications: Medication[] }>;

  // Student Medications
  assignToStudent(data: {
    studentId: string;
    medicationId: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    instructions: string;
    prescribedBy: string;
  }): Promise<{ studentMedication: StudentMedication }>;
  
  getStudentMedications(studentId: string): Promise<{ medications: StudentMedication[] }>;
  updateStudentMedication(id: string, data: Partial<StudentMedication>): Promise<{ studentMedication: StudentMedication }>;
  deactivateStudentMedication(id: string, reason?: string): Promise<{ studentMedication: StudentMedication }>;

  // Administration
  logAdministration(data: {
    studentMedicationId: string;
    administeredTime: string;
    dosageGiven: string;
    notes?: string;
    sideEffects?: string[];
  }): Promise<{ administration: MedicationAdministration }>;
  
  getStudentLogs(studentId: string, pagination?: PaginationParams): Promise<{ logs: MedicationAdministration[]; pagination: any }>;
  updateAdministrationLog(id: string, data: Partial<MedicationAdministration>): Promise<{ administration: MedicationAdministration }>;

  // Scheduling
  getSchedule(filters?: {
    startDate?: string;
    endDate?: string;
    nurseId?: string;
    studentId?: string;
  }): Promise<{ schedule: MedicationSchedule[] }>;
  
  getReminders(date?: string): Promise<{ reminders: MedicationSchedule[] }>;
  markAsAdministered(scheduleId: string, data: { administeredBy: string; notes?: string }): Promise<{ schedule: MedicationSchedule }>;
  markAsMissed(scheduleId: string, reason: string): Promise<{ schedule: MedicationSchedule }>;

  // Inventory Management
  getInventory(): Promise<{ inventory: InventoryItem[] }>;
  addToInventory(data: {
    medicationId: string;
    quantity: number;
    lotNumber?: string;
    expirationDate: string;
    location?: string;
  }): Promise<{ inventoryItem: InventoryItem }>;
  
  updateInventory(id: string, quantity: number, reason?: string): Promise<{ inventoryItem: InventoryItem }>;
  getInventoryByMedication(medicationId: string): Promise<{ inventory: InventoryItem[] }>;
  getLowStockAlerts(): Promise<{ alerts: any[] }>;
  getExpirationAlerts(days?: number): Promise<{ alerts: any[] }>;

  // Adverse Reactions
  reportAdverseReaction(data: {
    studentId: string;
    medicationId: string;
    reaction: string;
    severity: string;
    onset: string;
    treatment?: string;
  }): Promise<{ adverseReaction: AdverseReaction }>;
  
  getAdverseReactions(filters?: {
    medicationId?: string;
    studentId?: string;
    severity?: string;
  }): Promise<{ reactions: AdverseReaction[] }>;

  // Analytics and Reports
  getComplianceReport(dateRange?: DateRangeFilter): Promise<{ compliance: any }>;
  getUsageStatistics(dateRange?: DateRangeFilter): Promise<{ statistics: any }>;
  getMedicationEffectiveness(medicationId: string, dateRange?: DateRangeFilter): Promise<{ effectiveness: any }>;
}

class MedicationsApiImpl implements MedicationsApi {
  // Medications CRUD
  async getAll(filters: MedicationFilters = {}): Promise<{ medications: Medication[]; pagination: any }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ medications: Medication[]; pagination: any }>>(
      `${API_ENDPOINTS.MEDICATIONS}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getById(id: string): Promise<{ medication: Medication }> {
    const response = await apiInstance.get<ApiResponse<{ medication: Medication }>>(
      `${API_ENDPOINTS.MEDICATIONS}/${id}`
    );
    return extractApiData(response);
  }

  async create(medicationData: Partial<Medication>): Promise<{ medication: Medication }> {
    const response = await apiInstance.post<ApiResponse<{ medication: Medication }>>(
      API_ENDPOINTS.MEDICATIONS,
      medicationData
    );
    return extractApiData(response);
  }

  async update(id: string, medicationData: Partial<Medication>): Promise<{ medication: Medication }> {
    const response = await apiInstance.put<ApiResponse<{ medication: Medication }>>(
      `${API_ENDPOINTS.MEDICATIONS}/${id}`,
      medicationData
    );
    return extractApiData(response);
  }

  async delete(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.MEDICATIONS}/${id}`);
  }

  async search(query: string, limit: number = 20): Promise<{ medications: Medication[] }> {
    const params = buildUrlParams({ search: query, limit });
    const response = await apiInstance.get<ApiResponse<{ medications: Medication[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/search?${params.toString()}`
    );
    return extractApiData(response);
  }

  // Student Medications
  async assignToStudent(data: {
    studentId: string;
    medicationId: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    instructions: string;
    prescribedBy: string;
  }): Promise<{ studentMedication: StudentMedication }> {
    const response = await apiInstance.post<ApiResponse<{ studentMedication: StudentMedication }>>(
      `${API_ENDPOINTS.MEDICATIONS}/assign`,
      data
    );
    return extractApiData(response);
  }

  async getStudentMedications(studentId: string): Promise<{ medications: StudentMedication[] }> {
    const response = await apiInstance.get<ApiResponse<{ medications: StudentMedication[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/student/${studentId}`
    );
    return extractApiData(response);
  }

  async updateStudentMedication(id: string, data: Partial<StudentMedication>): Promise<{ studentMedication: StudentMedication }> {
    const response = await apiInstance.put<ApiResponse<{ studentMedication: StudentMedication }>>(
      `${API_ENDPOINTS.MEDICATIONS}/student-medication/${id}`,
      data
    );
    return extractApiData(response);
  }

  async deactivateStudentMedication(id: string, reason?: string): Promise<{ studentMedication: StudentMedication }> {
    const response = await apiInstance.put<ApiResponse<{ studentMedication: StudentMedication }>>(
      `${API_ENDPOINTS.MEDICATIONS}/student-medication/${id}/deactivate`,
      { reason }
    );
    return extractApiData(response);
  }

  // Administration
  async logAdministration(data: {
    studentMedicationId: string;
    administeredTime: string;
    dosageGiven: string;
    notes?: string;
    sideEffects?: string[];
  }): Promise<{ administration: MedicationAdministration }> {
    const response = await apiInstance.post<ApiResponse<{ administration: MedicationAdministration }>>(
      `${API_ENDPOINTS.MEDICATIONS}/administration`,
      data
    );
    return extractApiData(response);
  }

  async getStudentLogs(studentId: string, pagination: PaginationParams = {}): Promise<{ logs: MedicationAdministration[]; pagination: any }> {
    const params = buildUrlParams(pagination);
    const response = await apiInstance.get<ApiResponse<{ logs: MedicationAdministration[]; pagination: any }>>(
      `${API_ENDPOINTS.MEDICATIONS}/logs/${studentId}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async updateAdministrationLog(id: string, data: Partial<MedicationAdministration>): Promise<{ administration: MedicationAdministration }> {
    const response = await apiInstance.put<ApiResponse<{ administration: MedicationAdministration }>>(
      `${API_ENDPOINTS.MEDICATIONS}/administration/${id}`,
      data
    );
    return extractApiData(response);
  }

  // Scheduling
  async getSchedule(filters: {
    startDate?: string;
    endDate?: string;
    nurseId?: string;
    studentId?: string;
  } = {}): Promise<{ schedule: MedicationSchedule[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ schedule: MedicationSchedule[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/schedule?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getReminders(date?: string): Promise<{ reminders: MedicationSchedule[] }> {
    const params = date ? buildUrlParams({ date }) : '';
    const response = await apiInstance.get<ApiResponse<{ reminders: MedicationSchedule[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/reminders?${params.toString()}`
    );
    return extractApiData(response);
  }

  async markAsAdministered(scheduleId: string, data: { administeredBy: string; notes?: string }): Promise<{ schedule: MedicationSchedule }> {
    const response = await apiInstance.post<ApiResponse<{ schedule: MedicationSchedule }>>(
      `${API_ENDPOINTS.MEDICATIONS}/schedule/${scheduleId}/administered`,
      data
    );
    return extractApiData(response);
  }

  async markAsMissed(scheduleId: string, reason: string): Promise<{ schedule: MedicationSchedule }> {
    const response = await apiInstance.post<ApiResponse<{ schedule: MedicationSchedule }>>(
      `${API_ENDPOINTS.MEDICATIONS}/schedule/${scheduleId}/missed`,
      { reason }
    );
    return extractApiData(response);
  }

  // Inventory Management
  async getInventory(): Promise<{ inventory: InventoryItem[] }> {
    const response = await apiInstance.get<ApiResponse<{ inventory: InventoryItem[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/inventory`
    );
    return extractApiData(response);
  }

  async addToInventory(data: {
    medicationId: string;
    quantity: number;
    lotNumber?: string;
    expirationDate: string;
    location?: string;
  }): Promise<{ inventoryItem: InventoryItem }> {
    const response = await apiInstance.post<ApiResponse<{ inventoryItem: InventoryItem }>>(
      `${API_ENDPOINTS.MEDICATIONS}/inventory`,
      data
    );
    return extractApiData(response);
  }

  async updateInventory(id: string, quantity: number, reason?: string): Promise<{ inventoryItem: InventoryItem }> {
    const response = await apiInstance.put<ApiResponse<{ inventoryItem: InventoryItem }>>(
      `${API_ENDPOINTS.MEDICATIONS}/inventory/${id}`,
      { quantity, reason }
    );
    return extractApiData(response);
  }

  async getInventoryByMedication(medicationId: string): Promise<{ inventory: InventoryItem[] }> {
    const response = await apiInstance.get<ApiResponse<{ inventory: InventoryItem[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/inventory/medication/${medicationId}`
    );
    return extractApiData(response);
  }

  async getLowStockAlerts(): Promise<{ alerts: any[] }> {
    const response = await apiInstance.get<ApiResponse<{ alerts: any[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/inventory/alerts/low-stock`
    );
    return extractApiData(response);
  }

  async getExpirationAlerts(days: number = 30): Promise<{ alerts: any[] }> {
    const params = buildUrlParams({ days });
    const response = await apiInstance.get<ApiResponse<{ alerts: any[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/inventory/alerts/expiration?${params.toString()}`
    );
    return extractApiData(response);
  }

  // Adverse Reactions
  async reportAdverseReaction(data: {
    studentId: string;
    medicationId: string;
    reaction: string;
    severity: string;
    onset: string;
    treatment?: string;
  }): Promise<{ adverseReaction: AdverseReaction }> {
    const response = await apiInstance.post<ApiResponse<{ adverseReaction: AdverseReaction }>>(
      `${API_ENDPOINTS.MEDICATIONS}/adverse-reaction`,
      data
    );
    return extractApiData(response);
  }

  async getAdverseReactions(filters: {
    medicationId?: string;
    studentId?: string;
    severity?: string;
  } = {}): Promise<{ reactions: AdverseReaction[] }> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get<ApiResponse<{ reactions: AdverseReaction[] }>>(
      `${API_ENDPOINTS.MEDICATIONS}/adverse-reactions?${params.toString()}`
    );
    return extractApiData(response);
  }

  // Analytics and Reports
  async getComplianceReport(dateRange: DateRangeFilter = {}): Promise<{ compliance: any }> {
    const params = buildUrlParams(dateRange);
    const response = await apiInstance.get<ApiResponse<{ compliance: any }>>(
      `${API_ENDPOINTS.MEDICATIONS}/reports/compliance?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getUsageStatistics(dateRange: DateRangeFilter = {}): Promise<{ statistics: any }> {
    const params = buildUrlParams(dateRange);
    const response = await apiInstance.get<ApiResponse<{ statistics: any }>>(
      `${API_ENDPOINTS.MEDICATIONS}/reports/usage?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getMedicationEffectiveness(medicationId: string, dateRange: DateRangeFilter = {}): Promise<{ effectiveness: any }> {
    const params = buildUrlParams(dateRange);
    const response = await apiInstance.get<ApiResponse<{ effectiveness: any }>>(
      `${API_ENDPOINTS.MEDICATIONS}/${medicationId}/effectiveness?${params.toString()}`
    );
    return extractApiData(response);
  }
}

export const medicationsApi = new MedicationsApiImpl();
