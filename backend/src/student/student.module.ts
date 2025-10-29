/**
 * @fileoverview Student Module
 * @module student/student.module
 * @description NestJS module for student management functionality
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentService } from './student-sequelize.service';
import { StudentController } from './student.controller';
import { Student } from '../database/models/student.model';

/**
 * Student Module
 *
 * Provides complete student management functionality:
 * - Model definition with Sequelize
 * - Service layer for business logic
 * - Controller layer for HTTP endpoints
 * - Repository pattern via Sequelize
 *
 * Exports:
 * - StudentService: For use in other modules (health records, appointments, etc.)
 *
 * Dependencies:
 * - SequelizeModule: For database operations
 * - ConfigModule: Inherited from AppModule (global)
 */
@Module({
  imports: [
    // Register Student model with Sequelize
    SequelizeModule.forFeature([Student]),

    // TODO: Import related modules when available
    // UserModule,           // For nurse validation
    // HealthRecordModule,   // For statistics
    // AllergyModule,        // For statistics
    // MedicationModule,     // For statistics
    // AppointmentModule,    // For statistics
    // IncidentModule,       // For statistics
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService], // Export for use in other modules
})
export class StudentModule {}
