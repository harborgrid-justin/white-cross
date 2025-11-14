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
import { ConfigModule } from '@nestjs/config';
import { AppointmentCoreController } from './controllers/appointment-core.controller';
import { AppointmentStatusController } from './controllers/appointment-status.controller';
import { AppointmentQueryController } from './controllers/appointment-query.controller';
import { AppointmentStatisticsController } from './controllers/appointment-statistics.controller';
import { AppointmentAdvancedController } from './controllers/appointment-advanced.controller';
import { WaitlistController } from './controllers/waitlist.controller';
import { ReminderController } from './controllers/reminder.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentReadService } from '@/services/appointment/services/appointment-read.service';
import { AppointmentWriteService } from '@/services/appointment/services/appointment-write.service';
import { AppointmentStatusService } from '@/services/appointment/services/appointment-status.service';
import { AppointmentQueryService } from '@/services/appointment/services/appointment-query.service';
import { AppointmentSchedulingService } from '@/services/appointment/services/appointment-scheduling.service';
import { AppointmentStatisticsService } from '@/services/appointment/services/appointment-statistics.service';
import { AppointmentRecurringService } from '@/services/appointment/services/appointment-recurring.service';
import { WaitlistService } from '@/services/appointment/services/waitlist.service';
import { ReminderService } from './services/reminder.service';
import { Appointment } from '@/database/models';
import { AppointmentReminder } from '@/database/models';
import { AppointmentWaitlist } from '@/database/models';
import { User } from '@/database/models';
import { WebSocketModule } from '../../infrastructure/websocket/websocket.module';
import { EmailModule } from '../../infrastructure/email/email.module';
import { AppConfigService } from '@/common/config/app-config.service';

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
    SequelizeModule.forFeature([Appointment, AppointmentReminder, AppointmentWaitlist, User]),
    // Configuration module for AppConfigService
    ConfigModule,
    // Event-driven architecture modules
    // EventEmitterModule is global (registered in AppModule)
    WebSocketModule, // Provides AppointmentWebSocketListener
    EmailModule, // Provides AppointmentEmailListener
  ],
  controllers: [
    AppointmentCoreController,
    AppointmentStatusController,
    AppointmentQueryController,
    AppointmentStatisticsController,
    AppointmentAdvancedController,
    WaitlistController,
    ReminderController,
  ],
  providers: [
    // Main facade service
    AppointmentService,
    // Specialized services
    AppointmentReadService,
    AppointmentWriteService,
    AppointmentStatusService,
    AppointmentQueryService,
    AppointmentSchedulingService,
    AppointmentStatisticsService,
    AppointmentRecurringService,
    WaitlistService,
    ReminderService,
    // Configuration
    AppConfigService,
  ],
  exports: [
    // Main facade service for backward compatibility
    AppointmentService,
    // Specialized services for direct use if needed
    AppointmentReadService,
    AppointmentWriteService,
    AppointmentStatusService,
    AppointmentQueryService,
    AppointmentSchedulingService,
    AppointmentStatisticsService,
    AppointmentRecurringService,
    WaitlistService,
    ReminderService,
  ], // Export for use in other modules
})
export class AppointmentModule {}
