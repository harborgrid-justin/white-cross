import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicationController } from './medication.controller';
import { MedicationService } from './services/medication.service';
import { MedicationRepository } from './medication.repository';
import { StudentMedication } from '../database/models/student-medication.model';
import { Medication } from '../database/models/medication.model';
import { WebSocketModule } from '../infrastructure/websocket/websocket.module';

/**
 * Medication Module
 *
 * Provides comprehensive medication management functionality including:
 * - CRUD operations for medications
 * - Student medication tracking
 * - Medication activation/deactivation with audit trail
 * - Search and filtering capabilities
 * - Pagination support
 *
 * Current Implementation:
 * - Core CRUD operations for medications
 * - Validation and business rules
 * - Soft deletion with audit trail
 * - Student-medication relationships
 * - REST API endpoints with full Swagger documentation
 *
 * Architecture:
 * - Controller: Handles HTTP requests and responses
 * - Service: Implements business logic and validation
 * - Repository: Provides data access layer using Sequelize
 *
 * Security:
 * - All endpoints require JWT authentication (configured at app level)
 * - RBAC for create/update/delete operations (NURSE or ADMIN)
 * - PHI data protection and audit logging
 *
 * HIPAA Compliance:
 * - All medication data is Protected Health Information (PHI)
 * - Soft deletion preserves medical history
 * - Access logging for audit trail (implemented at controller level)
 *
 * Database:
 * - Uses Sequelize ORM with existing backend models
 * - Table: medications
 * - Supports legacy schema compatibility
 *
 * Future Enhancements:
 * - Medication administration logging
 * - Inventory management
 * - Adverse reaction tracking
 * - Medication reminders and scheduling
 * - Drug interaction checking
 * - Controlled substance tracking (DEA compliance)
 * - Medication history exports
 * - Integration with pharmacy systems
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      StudentMedication,
      Medication,
    ]),
    WebSocketModule,
  ],
  controllers: [MedicationController],
  providers: [MedicationService, MedicationRepository],
  exports: [MedicationService],
})
export class MedicationModule {}
