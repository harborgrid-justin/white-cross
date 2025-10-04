import type { IAppointmentsApi } from '../types'
import type { 
  Appointment, 
  AppointmentFilters, 
  AppointmentCreateData, 
  AppointmentUpdateData,
  AppointmentStatistics,
  NurseAvailability,
  NurseAvailabilityData,
  WaitlistEntry,
  WaitlistFilters,
  RecurringAppointmentData,
  AvailabilitySlot,
  PaginatedResponse
} from '../types'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError, buildUrlParams } from '../utils/apiUtils'

/**
 * Appointments API implementation
 * Handles appointment scheduling, availability management, and waitlist functionality
 */
class AppointmentsApiImpl implements IAppointmentsApi {
  /**
   * Get all appointments with optional filtering
   */
  async getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await apiInstance.get(`/appointments${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new appointment
   */
  async create(appointmentData: AppointmentCreateData): Promise<{ appointment: Appointment }> {
    try {
      const response = await apiInstance.post('/appointments', appointmentData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update an existing appointment
   */
  async update(id: string, data: AppointmentUpdateData): Promise<{ appointment: Appointment }> {
    try {
      const response = await apiInstance.put(`/appointments/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Cancel an appointment
   */
  async cancel(id: string, reason?: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await apiInstance.put(`/appointments/${id}/cancel`, { reason })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await apiInstance.put(`/appointments/${id}/no-show`, {})
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get available time slots for a nurse
   */
  async getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }> {
    try {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (duration) params.append('duration', String(duration))
      
      const response = await apiInstance.get(`/appointments/availability/${nurseId}?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get upcoming appointments for a nurse
   */
  async getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }> {
    try {
      const params = limit ? `?limit=${limit}` : ''
      const response = await apiInstance.get(`/appointments/upcoming/${nurseId}${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointment statistics
   */
  async getStatistics(filters?: {
    nurseId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AppointmentStatistics> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await apiInstance.get(`/appointments/statistics${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create recurring appointments
   */
  async createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }> {
    try {
      const response = await apiInstance.post('/appointments/recurring', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Nurse Availability Management
  /**
   * Set nurse availability
   */
  async setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await apiInstance.post('/appointments/availability', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get nurse availability schedule
   */
  async getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }> {
    try {
      const params = date ? `?date=${date}` : ''
      const response = await apiInstance.get(`/appointments/availability/nurse/${nurseId}${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update nurse availability
   */
  async updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await apiInstance.put(`/appointments/availability/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete nurse availability
   */
  async deleteAvailability(id: string): Promise<void> {
    try {
      await apiInstance.delete(`/appointments/availability/${id}`)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Waitlist Management
  /**
   * Add student to appointment waitlist
   */
  async addToWaitlist(data: {
    studentId: string
    nurseId?: string
    type: string
    reason: string
    priority?: string
    preferredDate?: string
    duration?: number
    notes?: string
  }): Promise<{ entry: WaitlistEntry }> {
    try {
      const response = await apiInstance.post('/appointments/waitlist', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointment waitlist
   */
  async getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: WaitlistEntry[] }> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await apiInstance.get(`/appointments/waitlist${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove student from waitlist
   */
  async removeFromWaitlist(id: string, reason?: string): Promise<{ entry: WaitlistEntry }> {
    try {
      const response = await apiInstance.delete(`/appointments/waitlist/${id}`, {
        data: { reason }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Calendar Export
  /**
   * Export nurse calendar
   */
  async exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob> {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      
      const response = await apiInstance.get(`/appointments/calendar/${nurseId}?${params.toString()}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const appointmentsApi = new AppointmentsApiImpl()
export type { IAppointmentsApi }
