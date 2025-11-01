/**
 * @fileoverview Appointment Module
 * @module appointment/appointment.module
 * @description NestJS module for appointment management functionality with comprehensive healthcare workflow support
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../database/models/appointment.model';
import { AppointmentReminder } from '../database/models/appointment-reminder.model';
import { AppointmentWaitlist } from '../database/models/appointment-waitlist.model';
import { User } from '../database/models/user.model';

/**
 * Appointment Module
 *
 * Provides comprehensive appointment management functionality:
 * - CRUD operations for appointments with validation
 * - Scheduling with conflict detection and availability checking
 * - Status lifecycle management (scheduled → in-progress → completed)
 * - Recurring appointment support
 * - Waitlist management integration
 * - Healthcare workflow optimization
 * - Business hours and schedule validation
 * - Reminder scheduling and notification
 * - Comprehensive error handling and logging
 *
 * Exports:
 * - AppointmentService: For use in other modules (health records, student management, etc.)
 *
 * Dependencies:
 * - SequelizeModule: For database operations with appointment-related models
 * - ConfigModule: Inherited from AppModule (global)
 */
@Module({
  imports: [
    // Register models with Sequelize
    SequelizeModule.forFeature([
      Appointment,
      AppointmentReminder,
      AppointmentWaitlist,
      User,
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService], // Export for use in other modules
})
export class AppointmentModule {}
