import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './services/appointment.service';

/**
 * Appointment Module
 *
 * Provides comprehensive appointment management functionality including:
 * - CRUD operations for appointments
 * - Scheduling with conflict detection
 * - Status lifecycle management
 * - Availability checking
 * - Business hours validation
 * - Reminder scheduling (future)
 * - Waitlist management (future)
 * - Recurring appointments (future)
 * - Statistics and analytics (future)
 * - Calendar export (future)
 *
 * Current Implementation:
 * - Core CRUD operations
 * - Validation and business rules
 * - Status transitions (state machine)
 * - Availability checking
 * - REST API endpoints
 *
 * Future Enhancements:
 * - Database integration (TypeORM/Sequelize)
 * - Reminder service integration
 * - Waitlist service integration
 * - Recurring appointment patterns
 * - Statistics and reporting
 * - iCalendar export
 * - Nurse availability management
 */
@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
