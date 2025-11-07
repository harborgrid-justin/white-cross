/**
 * Appointment Module Barrel Export
 * Provides centralized exports for the appointment module
 */

// Module
export { AppointmentModule } from './appointment.module';

// Services
export { AppointmentReadService } from './services/appointment-read.service';
export { AppointmentWriteService } from './services/appointment-write.service';
export { AppointmentStatusService } from './services/appointment-status.service';
export { AppointmentQueryService } from './services/appointment-query.service';
export { WaitlistService } from './services/waitlist.service';
export { ReminderService } from './services/reminder.service';

// Controllers
export { AppointmentCoreController } from './controllers/appointment-core.controller';
export { AppointmentStatusController } from './controllers/appointment-status.controller';
export { AppointmentQueryController } from './controllers/appointment-query.controller';
export { WaitlistController } from './controllers/waitlist.controller';
export { ReminderController } from './controllers/reminder.controller';

// DTOs
export { AppointmentStatus, AppointmentType } from './dto';

// Entities (excluding conflicting enums)
export { Appointment } from './entities';
export type { AvailabilitySlot } from './entities';

// Validators
export * from './validators';
