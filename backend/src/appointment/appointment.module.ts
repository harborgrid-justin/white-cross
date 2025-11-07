/**
 * @fileoverview Appointment Module
 * @module appointment/appointment.module
 * @description NestJS module for appointment management functionality with comprehensive healthcare workflow support
 *
 * ARCHITECTURE UPDATE: Event-Driven Pattern
 * - Replaced circular dependency with AppointmentService → EventEmitter → Listeners pattern
 * - WebSocketModule provides listeners, not injected into AppointmentService
 * - EmailModule provides listeners for notifications
 * - EventEmitterModule enables decoupled event-based communication
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../database/models/appointment.model';
import { AppointmentReminder } from '../database/models/appointment-reminder.model';
import { AppointmentWaitlist } from '../database/models/appointment-waitlist.model';
import { User } from '../database/models/user.model';
import { WebSocketModule } from '../infrastructure/websocket/websocket.module';
import { EmailModule } from '../infrastructure/email/email.module';

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
 * EVENT-DRIVEN ARCHITECTURE:
 * - AppointmentService emits domain events via EventEmitter2
 * - WebSocketModule listeners handle real-time notifications
 * - EmailModule listeners handle email notifications
 * - No circular dependencies between services
 *
 * Exports:
 * - AppointmentService: For use in other modules (health records, student management, etc.)
 *
 * Dependencies:
 * - EventEmitterModule: For event-driven communication (global)
 * - SequelizeModule: For database operations with appointment-related models
 * - WebSocketModule: Provides WebSocket event listeners
 * - EmailModule: Provides email notification listeners
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
    // Event-driven architecture modules
    // EventEmitterModule is global (registered in AppModule)
    WebSocketModule, // Provides AppointmentWebSocketListener
    EmailModule, // Provides AppointmentEmailListener
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService], // Export for use in other modules
})
export class AppointmentModule {}
