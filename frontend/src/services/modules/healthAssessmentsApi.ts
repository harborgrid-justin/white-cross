/**
 * Health Assessments API Module
 * Provides frontend access to health assessment endpoints
 */

import { apiInstance } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';

/**
 * Health Assessments API interfaces
 */
export interface HealthRiskAssessment {
  id: string;
  studentId: string;
  assessmentDate: string;
  assessedBy: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categories: Array<{
    category: string;
    score: number;
    risk: string;
    notes?: string;
  }>;
  overallScore: number;
  recommendations: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiskAssessmentRequest {
  studentId: string;
  assessmentDate?: string;
  categories: Array<{
    category: string;
    score: number;
    risk: string;
    notes?: string;
  }>;
  recommendations?: string[];
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

export interface HealthScreening {
  id: string;
  studentId: string;
  screeningType: 'VISION' | 'HEARING' | 'DENTAL' | 'SCOLIOSIS' | 'BMI' | 'OTHER';
  screeningDate: string;
  screenedBy: string;
  result: 'PASS' | 'FAIL' | 'REFER' | 'INCONCLUSIVE';
  measurements?: Record<string, any>;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScreeningRequest {
  studentId: string;
  screeningType: 'VISION' | 'HEARING' | 'DENTAL' | 'SCOLIOSIS' | 'BMI' | 'OTHER';
  screeningDate?: string;
  result: 'PASS' | 'FAIL' | 'REFER' | 'INCONCLUSIVE';
  measurements?: Record<string, any>;
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface GrowthTracking {
  id: string;
  studentId: string;
  measurementDate: string;
  height: number;
  heightUnit: 'CM' | 'IN';
  weight: number;
  weightUnit: 'KG' | 'LB';
  bmi: number;
  bmiPercentile?: number;
  bmiCategory?: 'UNDERWEIGHT' | 'HEALTHY' | 'OVERWEIGHT' | 'OBESE';
  headCircumference?: number;
  headCircumferenceUnit?: 'CM' | 'IN';
  measuredBy: string;
  notes?: string;
  createdAt: string;
}

export interface CreateGrowthTrackingRequest {
  studentId: string;
  measurementDate?: string;
  height: number;
  heightUnit?: 'CM' | 'IN';
  weight: number;
  weightUnit?: 'KG' | 'LB';
  headCircumference?: number;
  headCircumferenceUnit?: 'CM' | 'IN';
  notes?: string;
}

export interface ImmunizationForecast {
  studentId: string;
  studentName: string;
  dateOfBirth: string;
  forecasts: Array<{
    vaccineName: string;
    doseNumber: number;
    dueDate: string;
    earliestDate: string;
    status: 'DUE' | 'OVERDUE' | 'UP_TO_DATE' | 'NOT_DUE';
    notes?: string;
  }>;
  upToDate: boolean;
  generatedAt: string;
}

export interface EmergencyNotification {
  id: string;
  type: 'EPIDEMIC' | 'OUTBREAK' | 'RECALL' | 'SAFETY_ALERT' | 'OTHER';
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedStudents?: string[];
  targetAudience: 'ALL' | 'SPECIFIC_STUDENTS' | 'GRADE' | 'SCHOOL';
  targetGrade?: string;
  targetSchoolId?: string;
  sentBy: string;
  sentAt: string;
  expiresAt?: string;
  actionRequired: boolean;
  actionInstructions?: string;
  createdAt: string;
}

export interface CreateEmergencyNotificationRequest {
  type: 'EPIDEMIC' | 'OUTBREAK' | 'RECALL' | 'SAFETY_ALERT' | 'OTHER';
  title: string;
  message: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedStudents?: string[];
  targetAudience: 'ALL' | 'SPECIFIC_STUDENTS' | 'GRADE' | 'SCHOOL';
  targetGrade?: string;
  targetSchoolId?: string;
  expiresAt?: string;
  actionRequired?: boolean;
  actionInstructions?: string;
}

/**
 * Health Assessments API Service
 * Handles all health assessment related API calls
 */
export class HealthAssessmentsApi {
  /**
   * Get risk assessments for a student
   */
  async getRiskAssessments(studentId: string, params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<HealthRiskAssessment>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<HealthRiskAssessment>>(
      `/api/v1/healthcare/health-assessments/risk-assessment/${studentId}`,
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create risk assessment
   */
  async createRiskAssessment(
    assessmentData: CreateRiskAssessmentRequest
  ): Promise<HealthRiskAssessment> {
    const response = await apiInstance.post<ApiResponse<HealthRiskAssessment>>(
      '/api/v1/healthcare/health-assessments/risk-assessment',
      assessmentData
    );
    return response.data.data!;
  }

  /**
   * Get health screenings for a student
   */
  async getScreenings(studentId: string, params?: {
    screeningType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<HealthScreening>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<HealthScreening>>(
      `/api/v1/healthcare/health-assessments/screenings/${studentId}`,
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create health screening
   */
  async createScreening(screeningData: CreateScreeningRequest): Promise<HealthScreening> {
    const response = await apiInstance.post<ApiResponse<HealthScreening>>(
      '/api/v1/healthcare/health-assessments/screenings',
      screeningData
    );
    return response.data.data!;
  }

  /**
   * Get growth tracking data for a student
   */
  async getGrowthTracking(studentId: string, params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<GrowthTracking>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<GrowthTracking>>(
      `/api/v1/healthcare/health-assessments/growth/${studentId}`,
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create growth tracking record
   */
  async createGrowthTracking(trackingData: CreateGrowthTrackingRequest): Promise<GrowthTracking> {
    const response = await apiInstance.post<ApiResponse<GrowthTracking>>(
      '/api/v1/healthcare/health-assessments/growth',
      trackingData
    );
    return response.data.data!;
  }

  /**
   * Get immunization forecast for a student
   */
  async getImmunizationForecast(studentId: string): Promise<ImmunizationForecast> {
    const response = await apiInstance.get<ApiResponse<ImmunizationForecast>>(
      `/api/v1/healthcare/health-assessments/immunization-forecast/${studentId}`
    );
    return response.data.data!;
  }

  /**
   * Get emergency notifications
   */
  async getEmergencyNotifications(params?: {
    type?: string;
    severity?: string;
    active?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<EmergencyNotification>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<EmergencyNotification>>(
      '/api/v1/healthcare/health-assessments/emergency-notifications',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create emergency notification
   */
  async createEmergencyNotification(
    notificationData: CreateEmergencyNotificationRequest
  ): Promise<EmergencyNotification> {
    const response = await apiInstance.post<ApiResponse<EmergencyNotification>>(
      '/api/v1/healthcare/health-assessments/emergency-notifications',
      notificationData
    );
    return response.data.data!;
  }

  /**
   * Get student emergency notifications
   */
  async getStudentEmergencyNotifications(
    studentId: string,
    params?: {
      active?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<EmergencyNotification>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<EmergencyNotification>>(
      `/api/v1/healthcare/health-assessments/emergency-notifications/student/${studentId}`,
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Update emergency notification
   */
  async updateEmergencyNotification(
    notificationId: string,
    updateData: Partial<EmergencyNotification>
  ): Promise<EmergencyNotification> {
    const response = await apiInstance.put<ApiResponse<EmergencyNotification>>(
      `/api/v1/healthcare/health-assessments/emergency-notifications/${notificationId}`,
      updateData
    );
    return response.data.data!;
  }

  /**
   * Delete emergency notification
   */
  async deleteEmergencyNotification(
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiInstance.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/healthcare/health-assessments/emergency-notifications/${notificationId}`
    );
    return response.data.data!;
  }
}

// Export singleton instance
export const healthAssessmentsApi = new HealthAssessmentsApi();
