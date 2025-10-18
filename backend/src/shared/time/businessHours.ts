/**
 * LOC: CCE85F21EF
 * WC-GEN-324 | businessHours.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-324 | businessHours.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Business hours and time scheduling utilities
 * 
 * Provides utilities for business hours validation, time slot generation,
 * and healthcare-specific time formatting.
 */

export interface TimeSlot {
  start: Date;
  end: Date;
  duration: number; // in minutes
  isAvailable: boolean;
  type?: 'appointment' | 'break' | 'emergency';
}

export interface BusinessHours {
  monday: { start: string; end: string; closed?: boolean };
  tuesday: { start: string; end: string; closed?: boolean };
  wednesday: { start: string; end: string; closed?: boolean };
  thursday: { start: string; end: string; closed?: boolean };
  friday: { start: string; end: string; closed?: boolean };
  saturday: { start: string; end: string; closed?: boolean };
  sunday: { start: string; end: string; closed?: boolean };
}

// Default business hours for school health offices
const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { start: '08:00', end: '16:00' },
  tuesday: { start: '08:00', end: '16:00' },
  wednesday: { start: '08:00', end: '16:00' },
  thursday: { start: '08:00', end: '16:00' },
  friday: { start: '08:00', end: '16:00' },
  saturday: { closed: true, start: '00:00', end: '00:00' },
  sunday: { closed: true, start: '00:00', end: '00:00' }
};

// School holidays and breaks (can be configured per district)
const SCHOOL_HOLIDAYS = [
  // These would typically be loaded from configuration
  // Format: YYYY-MM-DD
  '2024-12-23', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-27',
  '2024-12-30', '2024-12-31',
  '2025-01-01', '2025-01-02', '2025-01-03',
  '2025-01-20', // MLK Day
  '2025-02-17', // Presidents Day
  '2025-05-26', // Memorial Day
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', '2025-11-28', // Thanksgiving
];

/**
 * Check if a given datetime is within business hours
 * 
 * @param datetime - Date and time to check
 * @param businessHours - Custom business hours (optional, uses default school hours)
 * @returns boolean indicating if datetime is within business hours
 */
export function isWithinBusinessHours(datetime: Date, businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS): boolean {
  if (!datetime || !(datetime instanceof Date)) {
    return false;
  }

  // Check if it's a school holiday
  const dateString = datetime.toISOString().split('T')[0]; // YYYY-MM-DD
  if (SCHOOL_HOLIDAYS.includes(dateString)) {
    return false;
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[datetime.getDay()] as keyof BusinessHours;
  const dayHours = businessHours[dayName];

  // Check if day is closed
  if (dayHours.closed) {
    return false;
  }

  // Parse time strings
  const [startHour, startMinute] = dayHours.start.split(':').map(Number);
  const [endHour, endMinute] = dayHours.end.split(':').map(Number);

  // Create start and end times for the same date
  const startTime = new Date(datetime);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(datetime);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Check if datetime falls within business hours
  return datetime >= startTime && datetime <= endTime;
}

/**
 * Calculate time slots between start and end times
 * 
 * @param startTime - Start time for slot generation
 * @param endTime - End time for slot generation
 * @param duration - Duration of each slot in minutes
 * @param bufferTime - Buffer time between slots in minutes (default: 0)
 * @returns Array of TimeSlot objects
 */
export function calculateTimeSlots(
  startTime: Date, 
  endTime: Date, 
  duration: number,
  bufferTime: number = 0
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  if (!startTime || !endTime || !(startTime instanceof Date) || !(endTime instanceof Date)) {
    return slots;
  }

  if (duration <= 0 || duration > 480) { // Max 8 hours per slot
    return slots;
  }

  if (startTime >= endTime) {
    return slots;
  }

  const totalSlotTime = duration + bufferTime; // Total time per slot including buffer
  const current = new Date(startTime);

  while (current < endTime) {
    const slotEnd = new Date(current);
    slotEnd.setMinutes(slotEnd.getMinutes() + duration);

    // Check if slot fits within the end time
    if (slotEnd <= endTime) {
      slots.push({
        start: new Date(current),
        end: slotEnd,
        duration,
        isAvailable: true, // Default to available, can be updated based on bookings
        type: 'appointment'
      });
    }

    // Move to next slot
    current.setMinutes(current.getMinutes() + totalSlotTime);
  }

  return slots;
}

/**
 * Get the next business day
 * 
 * @param date - Starting date
 * @param businessHours - Custom business hours (optional)
 * @returns Date of the next business day
 */
export function getNextBusinessDay(date: Date, businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS): Date {
  if (!date || !(date instanceof Date)) {
    return new Date();
  }

  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(8, 0, 0, 0); // Start at 8 AM

  // Keep looking until we find a business day
  let attempts = 0;
  while (attempts < 14) { // Max 2 weeks to prevent infinite loop
    if (isWithinBusinessHours(nextDay, businessHours)) {
      return nextDay;
    }

    nextDay.setDate(nextDay.getDate() + 1);
    attempts++;
  }

  // Fallback to the original next day if no business day found
  const fallback = new Date(date);
  fallback.setDate(fallback.getDate() + 1);
  return fallback;
}

/**
 * Format appointment time for display in healthcare context
 * 
 * @param date - Date to format
 * @param includeSeconds - Whether to include seconds (default: false)
 * @returns Formatted time string
 */
export function formatAppointmentTime(date: Date, includeSeconds: boolean = false): string {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  return date.toLocaleDateString('en-US', options);
}

/**
 * Calculate duration between two times in minutes
 * 
 * @param startTime - Start time
 * @param endTime - End time
 * @returns Duration in minutes
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
  if (!startTime || !endTime || !(startTime instanceof Date) || !(endTime instanceof Date)) {
    return 0;
  }

  const diffMs = endTime.getTime() - startTime.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60))); // Convert to minutes
}

/**
 * Check if two time periods overlap
 * 
 * @param start1 - Start of first period
 * @param end1 - End of first period
 * @param start2 - Start of second period
 * @param end2 - End of second period
 * @returns boolean indicating if periods overlap
 */
export function timePeriodsOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  if (!start1 || !end1 || !start2 || !end2) {
    return false;
  }

  return start1 < end2 && start2 < end1;
}

/**
 * Add business days to a date (skipping weekends and holidays)
 * 
 * @param date - Starting date
 * @param businessDays - Number of business days to add
 * @param businessHours - Custom business hours (optional)
 * @returns New date with business days added
 */
export function addBusinessDays(
  date: Date, 
  businessDays: number,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): Date {
  if (!date || !(date instanceof Date) || businessDays <= 0) {
    return new Date(date);
  }

  const result = new Date(date);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1);
    
    // Check if this is a business day
    if (isWithinBusinessHours(result, businessHours)) {
      daysAdded++;
    }
  }

  return result;
}

/**
 * Get available time slots for a specific date
 * 
 * @param date - Date to get slots for
 * @param slotDuration - Duration of each slot in minutes
 * @param businessHours - Custom business hours (optional)
 * @param bookedSlots - Already booked time periods (optional)
 * @returns Array of available TimeSlot objects
 */
export function getAvailableSlots(
  date: Date,
  slotDuration: number = 30,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS,
  bookedSlots: { start: Date; end: Date }[] = []
): TimeSlot[] {
  if (!isWithinBusinessHours(date, businessHours)) {
    return [];
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()] as keyof BusinessHours;
  const dayHours = businessHours[dayName];

  if (dayHours.closed) {
    return [];
  }

  // Create start and end times for the business day
  const [startHour, startMinute] = dayHours.start.split(':').map(Number);
  const [endHour, endMinute] = dayHours.end.split(':').map(Number);

  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Generate all possible slots
  const allSlots = calculateTimeSlots(startTime, endTime, slotDuration, 5); // 5-minute buffer

  // Filter out booked slots
  return allSlots.filter(slot => {
    return !bookedSlots.some(booked => 
      timePeriodsOverlap(slot.start, slot.end, booked.start, booked.end)
    );
  });
}