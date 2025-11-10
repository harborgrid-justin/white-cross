/**
 * Appointment Module Barrel Export
 * Provides centralized exports for the appointment module
 */

// Module
export { AppointmentModule } from './appointment.module';

// Main facade service
export { AppointmentService } from './appointment.service';

// Specialized services
export { AppointmentReadService } from './services/appointment-read.service';
export { AppointmentWriteService } from './services/appointment-write.service';
export { AppointmentStatusService } from './services/appointment-status.service';
export { AppointmentQueryService } from './services/appointment-query.service';
export { AppointmentSchedulingService } from './services/appointment-scheduling.service';
export { AppointmentStatisticsService } from './services/appointment-statistics.service';
export { AppointmentRecurringService } from './services/appointment-recurring.service';
export { WaitlistService } from './services/waitlist.service';
export { ReminderService } from './services/reminder.service';

// Controllers
export { AppointmentCoreController } from './controllers/appointment-core.controller';
export { AppointmentStatusController } from './controllers/appointment-status.controller';
export { AppointmentQueryController } from './controllers/appointment-query.controller';
export { WaitlistController } from './controllers/waitlist.controller';
export { ReminderController } from './controllers/reminder.controller';

// DTOs
export { AppointmentStatus } from './dto/update-appointment.dto';
export { AppointmentType } from './dto/create-appointment.dto';

// Entities (excluding conflicting enums)
export { Appointment } from './entities/appointment.entity';
export type { AvailabilitySlot } from './entities/appointment.entity';

// Validators
export * from './validators/appointment-validation';
export * from './validators/status-transitions';
