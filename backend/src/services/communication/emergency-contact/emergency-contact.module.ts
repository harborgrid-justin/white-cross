/**
 * Emergency Contact Module
 *
 * Comprehensive emergency contact management with:
 * - CRUD operations with validation
 * - Primary contact enforcement (max 2 primary contacts)
 * - Multi-channel notification support (SMS, email, voice)
 * - Contact verification workflows
 * - Statistics and reporting
 *
 * Architecture:
 * This module follows a service-oriented architecture with separation of concerns.
 * The main EmergencyContactService acts as a facade, delegating to specialized services:
 * - ContactValidationService: Data validation and integrity checks
 * - ContactManagementService: CRUD operations and business rules
 * - NotificationDeliveryService: Multi-channel message delivery
 * - NotificationOrchestrationService: Notification workflow coordination
 * - ContactVerificationService: Contact verification workflows
 * - ContactStatisticsService: Statistics and batch operations
 * - NotificationQueueService: Queue processing and lifecycle management
 *
 * @module EmergencyContactModule
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { EmergencyContact } from '@/database/models';
import { Student } from '@/database/models';

// Main Service (Facade)
import { EmergencyContactService } from './emergency-contact.service';

// Specialized Services
import { ContactValidationService } from '@/services/contact-validation.service';
import { ContactManagementService } from '@/services/contact-management.service';
import { NotificationDeliveryService } from '@/services/notification-delivery.service';
import { NotificationOrchestrationService } from '@/services/notification-orchestration.service';
import { ContactVerificationService } from '@/services/contact-verification.service';
import { ContactStatisticsService } from '@/services/contact-statistics.service';
import { NotificationQueueService } from '@/services/notification-queue.service';

// Controllers
import { EmergencyContactController } from './emergency-contact.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmergencyContact,
      Student, // Required for student validation
    ]),
  ],
  controllers: [EmergencyContactController],
  providers: [
    // Main facade service
    EmergencyContactService,

    // Specialized services (dependencies)
    ContactValidationService,
    ContactManagementService,
    NotificationDeliveryService,
    NotificationOrchestrationService,
    ContactVerificationService,
    ContactStatisticsService,
    NotificationQueueService,
  ],
  exports: [
    EmergencyContactService, // Main service export for other modules
    ContactStatisticsService, // Export statistics service for DataLoader support
  ],
})
export class EmergencyContactModule {}
