/**
 * Appointments Module - Barrel Export
 * 
 * This file provides a centralized export point for all appointment-related components
 * in the healthcare management system. These components handle appointment scheduling,
 * management, tracking, and related functionality.
 */

// Core appointment components
export { default as AppointmentCard } from './AppointmentCard';
export { default as AppointmentHeader } from './AppointmentHeader';
export { default as AppointmentList } from './AppointmentList';
export { default as AppointmentDetail } from './AppointmentDetail';

// Scheduling and calendar components
export { default as AppointmentScheduler } from './AppointmentScheduler';
export { default as AppointmentCalendar } from './AppointmentCalendar';

// Workflow and process components
export { default as AppointmentCheckin } from './AppointmentCheckin';
export { default as AppointmentReminders } from './AppointmentReminders';
export { default as AppointmentWaitlist } from './AppointmentWaitlist';

// Analytics and reporting components
export { default as AppointmentReports } from './AppointmentReports';

// Type exports for external use
export type { Appointment } from './AppointmentCard';
