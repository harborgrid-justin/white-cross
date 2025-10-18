/**
 * WC-IDX-212 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: types | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

// Barrel export file for appointment services
export { AppointmentService } from './AppointmentService';
export { AppointmentAvailabilityService } from './AppointmentAvailabilityService';
export { AppointmentReminderService } from './AppointmentReminderService';
export { AppointmentWaitlistService } from './AppointmentWaitlistService';
export { AppointmentRecurringService } from './AppointmentRecurringService';
export { AppointmentStatisticsService } from './AppointmentStatisticsService';
export { AppointmentCalendarService } from './AppointmentCalendarService';
export { NurseAvailabilityService } from './NurseAvailabilityService';

// Re-export types for convenience
export * from '../../types/appointment';
