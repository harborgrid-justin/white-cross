/**
 * API Client for White Cross Healthcare Platform - Next.js
 *
 * Centralized API client for backend communication through proxy route
 * Handles authentication, error handling, and request/response formatting
 *
 * @module lib/api-client
 * @version 1.0.0
 */

const API_PROXY_BASE = '/api/proxy';

interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_PROXY_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get auth token from cookie or localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        const error: ApiError = {
          message: 'API request failed',
          statusCode: response.status,
        };

        if (isJson) {
          const errorData = await response.json();
          error.message = errorData.message || error.message;
          error.details = errorData;
        } else {
          error.message = await response.text();
        }

        throw error;
      }

      if (isJson) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }

      throw {
        message: error instanceof Error ? error.message : 'Network error',
        statusCode: 0,
        details: error,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';

    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;

// Type-safe API endpoints
export const API_ENDPOINTS = {
  // Dashboard
  dashboardStats: '/dashboard/stats',

  // Students
  students: '/students',
  studentById: (id: string) => `/students/${id}`,
  studentDeactivate: (id: string) => `/students/${id}/deactivate`,

  // Health Records
  healthRecords: '/health-records',
  healthRecordById: (id: string) => `/health-records/${id}`,
  healthRecordsByStudent: (studentId: string) => `/health-records/student/${studentId}`,

  // Allergies
  allergies: '/allergies',
  allergiesByStudent: (studentId: string) => `/allergies/student/${studentId}`,

  // Conditions
  conditions: '/conditions',
  conditionsByStudent: (studentId: string) => `/conditions/student/${studentId}`,

  // Vaccinations
  vaccinations: '/vaccinations',
  vaccinationsByStudent: (studentId: string) => `/vaccinations/student/${studentId}`,

  // Vital Signs
  vitalSigns: '/vital-signs',
  vitalSignsByStudent: (studentId: string) => `/vital-signs/student/${studentId}`,

  // Growth Measurements
  growthMeasurements: '/growth-measurements',
  growthMeasurementsByStudent: (studentId: string) => `/growth-measurements/student/${studentId}`,

  // Screenings
  screenings: '/screenings',
  screeningsByStudent: (studentId: string) => `/screenings/student/${studentId}`,

  // Emergency Contacts
  emergencyContacts: '/emergency-contacts',
  emergencyContactsByStudent: (studentId: string) => `/emergency-contacts/student/${studentId}`,

  // Appointments
  appointments: '/appointments',
  appointmentById: (id: string) => `/appointments/${id}`,

  // Medications
  medications: '/medications',
  medicationById: (id: string) => `/medications/${id}`,
} as const;
