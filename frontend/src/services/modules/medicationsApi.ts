import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { z } from 'zod';

// Types
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'topical' | 'drops';
  category: string;
  controlledSubstance: boolean;
  requiresPrescription: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  prescribedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  medication?: Medication;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface MedicationAdministration {
  id: string;
  studentMedicationId: string;
  administeredBy: string;
  administeredAt: string;
  dosage: string;
  notes?: string;
  status: 'administered' | 'missed' | 'refused' | 'held';
  createdAt: string;
}

export interface MedicationSchedule {
  id: string;
  studentMedicationId: string;
  scheduledTime: string;
  dosage: string;
  status: 'pending' | 'completed' | 'missed' | 'cancelled';
  administeredAt?: string;
  administeredBy?: string;
  notes?: string;
}

export interface MedicationFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  controlledSubstance?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  strength: string;
  form: Medication['form'];
  category: string;
  controlledSubstance?: boolean;
  requiresPrescription?: boolean;
}

export interface AssignMedicationRequest {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  prescribedBy?: string;
}

export interface LogAdministrationRequest {
  studentMedicationId: string;
  scheduledTime: string;
  dosage: string;
  status: MedicationAdministration['status'];
  notes?: string;
}

// Validation schemas
const createMedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  genericName: z.string().optional(),
  strength: z.string().min(1, 'Strength is required'),
  form: z.enum(['tablet', 'capsule', 'liquid', 'injection', 'inhaler', 'topical', 'drops']),
  category: z.string().min(1, 'Category is required'),
  controlledSubstance: z.boolean().optional(),
  requiresPrescription: z.boolean().optional(),
});

const assignMedicationSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  medicationId: z.string().min(1, 'Medication ID is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  instructions: z.string().min(1, 'Instructions are required'),
  prescribedBy: z.string().optional(),
});

const logAdministrationSchema = z.object({
  studentMedicationId: z.string().min(1, 'Student medication ID is required'),
  scheduledTime: z.string().min(1, 'Scheduled time is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  status: z.enum(['administered', 'missed', 'refused', 'held']),
  notes: z.string().optional(),
});

// Medications API class
export class MedicationsApi {
  /**
   * Get all medications with optional filtering
   */
  async getAll(filters: MedicationFilters = {}): Promise<PaginatedResponse<Medication>> {
    try {
      const params = buildPaginationParams(
        filters.page,
        filters.limit,
        filters.sort,
        filters.order
      );

      const queryString = new URLSearchParams();
      if (filters.search) queryString.append('search', filters.search);
      if (filters.category) queryString.append('category', filters.category);
      if (filters.isActive !== undefined) queryString.append('isActive', String(filters.isActive));
      if (filters.controlledSubstance !== undefined) queryString.append('controlledSubstance', String(filters.controlledSubstance));

      // Remove leading '?' from params since we're adding it below
      const cleanParams = params.startsWith('?') ? params.substring(1) : params;
      const finalParams = queryString.toString()
        ? `${cleanParams}&${queryString.toString()}`
        : cleanParams;

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<Medication>>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}?${finalParams}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch medications');
    }
  }

  /**
   * Get medication by ID
   */
  async getById(id: string): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await apiInstance.get<ApiResponse<Medication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch medication');
    }
  }

  /**
   * Create new medication
   */
  async create(medicationData: CreateMedicationRequest): Promise<Medication> {
    try {
      createMedicationSchema.parse(medicationData);

      const response = await apiInstance.post<ApiResponse<Medication>>(
        API_ENDPOINTS.MEDICATIONS.BASE,
        medicationData
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to create medication');
    }
  }

  /**
   * Update medication
   */
  async update(id: string, medicationData: Partial<CreateMedicationRequest>): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await apiInstance.put<ApiResponse<Medication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`,
        medicationData
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update medication');
    }
  }

  /**
   * Delete medication
   */
  async delete(id: string): Promise<{ id: string }> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await apiInstance.delete<ApiResponse<{ id: string }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete medication');
    }
  }

  /**
   * Assign medication to student
   */
  async assignToStudent(assignmentData: AssignMedicationRequest): Promise<StudentMedication> {
    try {
      assignMedicationSchema.parse(assignmentData);

      const response = await apiInstance.post<ApiResponse<StudentMedication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/assign`,
        assignmentData
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to assign medication');
    }
  }

  /**
   * Get student medications
   */
  async getStudentMedications(studentId: string): Promise<StudentMedication[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get<ApiResponse<StudentMedication[]>>(
        `${API_ENDPOINTS.MEDICATIONS.STUDENT(studentId)}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student medications');
    }
  }

  /**
   * Log medication administration
   */
  async logAdministration(logData: LogAdministrationRequest): Promise<MedicationAdministration> {
    try {
      logAdministrationSchema.parse(logData);

      const response = await apiInstance.post<ApiResponse<MedicationAdministration>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/administer`,
        logData
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to log administration');
    }
  }

  /**
   * Get administration logs for a student
   */
  async getStudentLogs(studentId: string, filters: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<MedicationAdministration>> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const params = buildPaginationParams(filters.page, filters.limit);

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<MedicationAdministration>>>(
        `${API_ENDPOINTS.MEDICATIONS.STUDENT(studentId)}/logs?${params}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch administration logs');
    }
  }

  /**
   * Get medication inventory
   */
  async getInventory(): Promise<any[]> {
    try {
      const response = await apiInstance.get<ApiResponse<any[]>>(
        API_ENDPOINTS.MEDICATIONS.INVENTORY
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory');
    }
  }

  /**
   * Get medication schedule for a date range
   */
  async getSchedule(startDate?: string, endDate?: string, nurseId?: string): Promise<MedicationSchedule[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (nurseId) params.append('nurseId', nurseId);

      const response = await apiInstance.get<ApiResponse<MedicationSchedule[]>>(
        `${API_ENDPOINTS.MEDICATIONS.SCHEDULE}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch schedule');
    }
  }

  /**
   * Get medication reminders for a specific date
   */
  async getReminders(date?: string): Promise<MedicationSchedule[]> {
    try {
      const params = date ? `?date=${date}` : '';

      const response = await apiInstance.get<ApiResponse<MedicationSchedule[]>>(
        `${API_ENDPOINTS.MEDICATIONS.REMINDERS}${params}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reminders');
    }
  }

  /**
   * Report adverse reaction
   */
  async reportAdverseReaction(studentMedicationId: string, reaction: {
    description: string;
    severity: 'mild' | 'moderate' | 'severe';
    symptoms: string[];
    actionTaken: string;
  }): Promise<any> {
    try {
      if (!studentMedicationId) throw new Error('Student medication ID is required');

      const response = await apiInstance.post<ApiResponse<any>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/adverse-reaction`,
        {
          studentMedicationId,
          ...reaction,
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to report adverse reaction');
    }
  }

  /**
   * Get adverse reactions for a student
   */
  async getAdverseReactions(studentId: string): Promise<any[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get<ApiResponse<any[]>>(
        `${API_ENDPOINTS.MEDICATIONS.STUDENT(studentId)}/adverse-reactions`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch adverse reactions');
    }
  }

  /**
   * Deactivate student medication
   */
  async deactivateStudentMedication(studentMedicationId: string, reason: string): Promise<StudentMedication> {
    try {
      if (!studentMedicationId) throw new Error('Student medication ID is required');

      const response = await apiInstance.patch<ApiResponse<StudentMedication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/student-medication/${studentMedicationId}/deactivate`,
        { reason }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to deactivate medication');
    }
  }

  /**
   * Update medication inventory
   */
  async updateInventory(inventoryData: {
    inventoryId: string;
    quantity: number;
    batchNumber: string;
    expirationDate: string;
    supplier?: string;
  }): Promise<any> {
    try {
      if (!inventoryData.inventoryId) throw new Error('Inventory ID is required');

      const response = await apiInstance.put<ApiResponse<any>>(
        `${API_ENDPOINTS.MEDICATIONS.INVENTORY}/${inventoryData.inventoryId}`,
        {
          quantity: inventoryData.quantity,
          batchNumber: inventoryData.batchNumber,
          expirationDate: inventoryData.expirationDate,
          supplier: inventoryData.supplier,
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update inventory');
    }
  }

  /**
   * Update reminder status (mark as completed or missed)
   */
  async updateReminderStatus(reminderId: string, status: 'COMPLETED' | 'MISSED'): Promise<any> {
    try {
      if (!reminderId) throw new Error('Reminder ID is required');

      const response = await apiInstance.patch<ApiResponse<any>>(
        `${API_ENDPOINTS.MEDICATIONS.REMINDERS}/${reminderId}`,
        { status }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update reminder status');
    }
  }
}

// Export singleton instance
export const medicationsApi = new MedicationsApi();
