/**
 * Appointment Module Barrel Export
 * Provides centralized exports for the appointment module
 */

// Module
export { AppointmentModule } from './appointment.module';

// Service
export { AppointmentService } from './appointment.service';

// Controller
export { AppointmentController } from './appointment.controller';

// DTOs
export { AppointmentStatus, AppointmentType } from './dto';

// Entities (excluding conflicting enums)
export { Appointment } from './entities';
export type { AvailabilitySlot } from './entities';

// Validators
export * from './validators';
