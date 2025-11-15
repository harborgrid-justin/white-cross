/**
 * Appointments API - Nurse Availability Management
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Handles nurse availability scheduling, time slot management, and
 * availability queries for appointment scheduling system.
 *
 * @module services/modules/appointmentsApi/availability
 */

import {
  NurseAvailability,
  NurseAvailabilityData,
  AvailabilitySlot,
  APPOINTMENT_VALIDATION
} from './types';
import {
  nurseAvailabilitySchema,
  getValidationErrors
} from './validation';

/**
 * Availability Query Parameters
 */
interface AvailabilityQuery {
  nurseId: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  dayOfWeek?: number;
}

/**
 * Time Slot Generation Parameters
 */
interface TimeSlotParams {
  startTime: string;
  endTime: string;
  duration: number;
  breakTime?: number;
  existingAppointments?: Array<{
    startTime: string;
    endTime: string;
  }>;
}

/**
 * Nurse Availability Service Class
 * 
 * Manages nurse availability schedules, generates available time slots,
 * and handles availability queries for appointment scheduling.
 */
export class AvailabilityService {
  private readonly endpoint = '/api/availability';

  // ==========================================
  // AVAILABILITY MANAGEMENT
  // ==========================================

  /**
   * Set nurse availability for recurring schedule
   * 
   * @param data - Availability data
   * @returns Promise resolving to created availability
   */
  async setAvailability(data: NurseAvailabilityData): Promise<NurseAvailability> {
    // Validate input data
    const validationResult = nurseAvailabilitySchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    const validatedData = validationResult.data;

    try {
      // This would typically make an API call
      const response: NurseAvailability = {
        id: `availability_${Date.now()}`,
        nurseId: validatedData.nurseId,
        dayOfWeek: validatedData.dayOfWeek ?? 1, // Default to Monday if not specified
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        date: validatedData.date,
        isRecurring: validatedData.isRecurring ?? true,
        maxAppointments: validatedData.maxAppointments,
        slotDuration: validatedData.slotDuration ?? APPOINTMENT_VALIDATION.DEFAULT_DURATION,
        breakTime: validatedData.breakTime ?? APPOINTMENT_VALIDATION.BREAK_TIME,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return response;
    } catch (error) {
      throw new Error(`Failed to set availability: ${error}`);
    }
  }

  /**
   * Get nurse availability schedules
   * 
   * @param query - Query parameters
   * @returns Promise resolving to availability schedules
   */
  async getAvailability(query: AvailabilityQuery): Promise<NurseAvailability[]> {
    if (!query.nurseId?.trim()) {
      throw new Error('Nurse ID is required');
    }

    try {
      // This would typically make an API call
      // For now, return mock data
      const mockAvailability: NurseAvailability[] = [
        {
          id: 'avail_1',
          nurseId: query.nurseId,
          dayOfWeek: 1, // Monday
          startTime: '08:00',
          endTime: '16:00',
          isRecurring: true,
          slotDuration: 30,
          breakTime: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      return mockAvailability.filter(avail => {
        if (query.dayOfWeek !== undefined && avail.dayOfWeek !== query.dayOfWeek) {
          return false;
        }
        if (query.date && avail.date !== query.date) {
          return false;
        }
        return true;
      });
    } catch (error) {
      throw new Error(`Failed to get availability: ${error}`);
    }
  }

  /**
   * Update existing availability
   * 
   * @param id - Availability ID
   * @param data - Update data
   * @returns Promise resolving to updated availability
   */
  async updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<NurseAvailability> {
    if (!id?.trim()) {
      throw new Error('Availability ID is required');
    }

    // Validate input data
    const validationResult = nurseAvailabilitySchema.partial().safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    try {
      // This would typically make an API call
      const updatedAvailability: NurseAvailability = {
        id,
        nurseId: data.nurseId || 'nurse_1',
        dayOfWeek: data.dayOfWeek ?? 1, // Default to Monday if not specified
        startTime: data.startTime || '08:00',
        endTime: data.endTime || '16:00',
        date: data.date,
        isRecurring: data.isRecurring ?? true,
        maxAppointments: data.maxAppointments,
        slotDuration: data.slotDuration ?? APPOINTMENT_VALIDATION.DEFAULT_DURATION,
        breakTime: data.breakTime ?? APPOINTMENT_VALIDATION.BREAK_TIME,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return updatedAvailability;
    } catch (error) {
      throw new Error(`Failed to update availability: ${error}`);
    }
  }

  /**
   * Delete availability schedule
   * 
   * @param id - Availability ID
   */
  async deleteAvailability(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('Availability ID is required');
    }

    try {
      // This would typically make an API call
      // For now, just simulate success
    } catch (error) {
      throw new Error(`Failed to delete availability: ${error}`);
    }
  }

  // ==========================================
  // TIME SLOT GENERATION
  // ==========================================

  /**
   * Generate available time slots for a given availability window
   * 
   * @param params - Time slot generation parameters
   * @returns Array of available time slots
   */
  generateTimeSlots(params: TimeSlotParams): AvailabilitySlot[] {
    const {
      startTime,
      endTime,
      duration,
      breakTime = APPOINTMENT_VALIDATION.BREAK_TIME,
      existingAppointments = []
    } = params;

    const slots: AvailabilitySlot[] = [];
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);

    let currentTime = start;
    const slotDurationMs = duration * 60 * 1000;
    const breakTimeMs = breakTime * 60 * 1000;

    while (currentTime + slotDurationMs <= end) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime + slotDurationMs);

      // Check if this slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(appointment => {
        const appointmentStart = this.parseTime(appointment.startTime);
        const appointmentEnd = this.parseTime(appointment.endTime);
        
        return (
          (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
          (currentTime + slotDurationMs > appointmentStart && currentTime + slotDurationMs <= appointmentEnd) ||
          (currentTime <= appointmentStart && currentTime + slotDurationMs >= appointmentEnd)
        );
      });

      slots.push({
        startTime: this.formatTime(slotStart),
        endTime: this.formatTime(slotEnd),
        duration,
        isAvailable: !hasConflict,
        nurseId: '', // Will be filled by calling function
        conflictingAppointments: hasConflict ? ['existing_appointment'] : undefined
      });

      // Move to next slot (including break time)
      currentTime += slotDurationMs + breakTimeMs;
    }

    return slots;
  }

  /**
   * Get available slots for a specific nurse on a specific date
   * 
   * @param nurseId - Nurse ID
   * @param date - Date in YYYY-MM-DD format
   * @param appointmentDuration - Duration of appointment in minutes
   * @returns Promise resolving to available slots
   */
  async getAvailableSlots(
    nurseId: string,
    date: string,
    appointmentDuration: number = APPOINTMENT_VALIDATION.DEFAULT_DURATION
  ): Promise<AvailabilitySlot[]> {
    if (!nurseId?.trim() || !date?.trim()) {
      throw new Error('Nurse ID and date are required');
    }

    try {
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();

      // Get nurse availability for this day
      const availability = await this.getAvailability({
        nurseId,
        dayOfWeek,
        date
      });

      if (!availability.length) {
        return [];
      }

      // Get existing appointments for this date
      const existingAppointments = await this.getExistingAppointments(nurseId, date);

      // Generate slots for each availability window
      const allSlots: AvailabilitySlot[] = [];
      
      for (const avail of availability) {
        const slots = this.generateTimeSlots({
          startTime: avail.startTime,
          endTime: avail.endTime,
          duration: appointmentDuration,
          breakTime: avail.breakTime ?? APPOINTMENT_VALIDATION.BREAK_TIME,
          existingAppointments
        });

        // Add nurse ID to each slot
        slots.forEach(slot => {
          slot.nurseId = nurseId;
        });

        allSlots.push(...slots);
      }

      return allSlots.filter(slot => slot.isAvailable);
    } catch (error) {
      throw new Error(`Failed to get available slots: ${error}`);
    }
  }

  /**
   * Find next available appointment slot for a nurse
   * 
   * @param nurseId - Nurse ID
   * @param startDate - Start searching from this date
   * @param duration - Appointment duration
   * @param maxDays - Maximum days to search
   * @returns Promise resolving to next available slot or null
   */
  async findNextAvailableSlot(
    nurseId: string,
    startDate: string = new Date().toISOString().split('T')[0],
    duration: number = APPOINTMENT_VALIDATION.DEFAULT_DURATION,
    maxDays: number = 30
  ): Promise<AvailabilitySlot | null> {
    const searchDate = new Date(startDate);

    for (let i = 0; i < maxDays; i++) {
      const dateStr = searchDate.toISOString().split('T')[0];
      
      try {
        const slots = await this.getAvailableSlots(nurseId, dateStr, duration);
        
        if (slots.length > 0) {
          return slots[0]; // Return the first available slot
        }
      } catch (error) {
        // Continue searching if there's an error for this date
        console.warn(`Error checking availability for ${dateStr}:`, error);
      }

      // Move to next day
      searchDate.setDate(searchDate.getDate() + 1);
    }

    return null;
  }

  // ==========================================
  // AVAILABILITY QUERIES
  // ==========================================

  /**
   * Check if a nurse is available at a specific time
   * 
   * @param nurseId - Nurse ID
   * @param startTime - Start time (ISO string)
   * @param duration - Duration in minutes
   * @returns Promise resolving to availability status
   */
  async isAvailable(nurseId: string, startTime: string, duration: number): Promise<boolean> {
    try {
      const date = startTime.split('T')[0];
      const slots = await this.getAvailableSlots(nurseId, date, duration);
      
      const requestedStartTime = new Date(startTime).toTimeString().slice(0, 5);
      
      return slots.some(slot => 
        slot.startTime === requestedStartTime && 
        slot.isAvailable &&
        slot.duration >= duration
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get nurse utilization for a date range
   * 
   * @param nurseId - Nurse ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise resolving to utilization data
   */
  async getNurseUtilization(nurseId: string, startDate: string, endDate: string) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      let totalAvailableMinutes = 0;
      let totalBookedMinutes = 0;
      let totalSlots = 0;
      let bookedSlots = 0;

      const currentDate = new Date(start);
      
      for (let i = 0; i <= days; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        try {
          const availability = await this.getAvailability({
            nurseId,
            date: dateStr,
            dayOfWeek: currentDate.getDay()
          });

          for (const avail of availability) {
            const dayStart = this.parseTime(avail.startTime);
            const dayEnd = this.parseTime(avail.endTime);
            const dayMinutes = (dayEnd - dayStart) / (1000 * 60);
            totalAvailableMinutes += dayMinutes;

            // Get slots for this day
            const slots = await this.getAvailableSlots(nurseId, dateStr);
            totalSlots += slots.length;
            bookedSlots += slots.filter(slot => !slot.isAvailable).length;
          }
        } catch (error) {
          // Skip this day if there's an error
          console.warn(`Error calculating utilization for ${dateStr}:`, error);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Calculate estimated booked minutes based on booked slots
      totalBookedMinutes = bookedSlots * APPOINTMENT_VALIDATION.DEFAULT_DURATION;

      const utilizationPercentage = totalAvailableMinutes > 0 
        ? (totalBookedMinutes / totalAvailableMinutes) * 100 
        : 0;

      return {
        nurseId,
        startDate,
        endDate,
        totalAvailableMinutes,
        totalBookedMinutes,
        totalSlots,
        bookedSlots,
        availableSlots: totalSlots - bookedSlots,
        utilizationPercentage: Math.round(utilizationPercentage * 100) / 100
      };
    } catch (error) {
      throw new Error(`Failed to calculate nurse utilization: ${error}`);
    }
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Set availability for multiple days/nurses
   * 
   * @param availabilityData - Array of availability data
   * @returns Promise resolving to creation results
   */
  async setBulkAvailability(availabilityData: NurseAvailabilityData[]): Promise<{
    successful: NurseAvailability[];
    failed: Array<{
      data: NurseAvailabilityData;
      error: string;
    }>;
  }> {
    const successful: NurseAvailability[] = [];
    const failed: Array<{ data: NurseAvailabilityData; error: string; }> = [];

    for (const data of availabilityData) {
      try {
        const result = await this.setAvailability(data);
        successful.push(result);
      } catch (error) {
        failed.push({
          data,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return { successful, failed };
  }

  /**
   * Copy availability from one nurse to another
   * 
   * @param sourceNurseId - Source nurse ID
   * @param targetNurseId - Target nurse ID
   * @param startDate - Start date for copying
   * @param endDate - End date for copying
   * @returns Promise resolving to copied availability
   */
  async copyAvailability(
    sourceNurseId: string,
    targetNurseId: string,
    startDate?: string,
    endDate?: string
  ): Promise<NurseAvailability[]> {
    try {
      // Get source nurse availability
      const sourceAvailability = await this.getAvailability({
        nurseId: sourceNurseId,
        startDate,
        endDate
      });

      // Copy to target nurse
      const copiedData: NurseAvailabilityData[] = sourceAvailability.map(avail => ({
        nurseId: targetNurseId,
        dayOfWeek: avail.dayOfWeek,
        startTime: avail.startTime,
        endTime: avail.endTime,
        date: avail.date,
        isRecurring: avail.isRecurring,
        maxAppointments: avail.maxAppointments,
        slotDuration: avail.slotDuration ?? APPOINTMENT_VALIDATION.DEFAULT_DURATION,
        breakTime: avail.breakTime ?? APPOINTMENT_VALIDATION.BREAK_TIME
      }));

      const result = await this.setBulkAvailability(copiedData);
      
      if (result.failed.length > 0) {
        console.warn('Some availability could not be copied:', result.failed);
      }

      return result.successful;
    } catch (error) {
      throw new Error(`Failed to copy availability: ${error}`);
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  /**
   * Parse time string (HH:MM) to milliseconds since midnight
   */
  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate.getTime();
  }

  /**
   * Format time from Date object to HH:MM string
   */
  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  /**
   * Get existing appointments for a nurse on a specific date
   * This would typically query the appointments service
   */
  private async getExistingAppointments(nurseId: string, date: string): Promise<Array<{ startTime: string; endTime: string; }>> {
    // This would typically make an API call to get existing appointments
    // For now, return empty array
    return [];
  }

  /**
   * Validate time range
   */
  private validateTimeRange(startTime: string, endTime: string): boolean {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    return end > start;
  }

  /**
   * Get business hours for validation
   */
  private getBusinessHours(): { start: string; end: string; } {
    return {
      start: '06:00', // 6:00 AM
      end: '18:00'    // 6:00 PM
    };
  }

  /**
   * Check if time is within business hours
   */
  private isWithinBusinessHours(time: string): boolean {
    const businessHours = this.getBusinessHours();
    const timeMs = this.parseTime(time);
    const startMs = this.parseTime(businessHours.start);
    const endMs = this.parseTime(businessHours.end);
    
    return timeMs >= startMs && timeMs <= endMs;
  }
}

// Export singleton instance
export const availabilityService = new AvailabilityService();
