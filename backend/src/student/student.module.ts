/**
 * @fileoverview Student Module
 * @module student/student.module
 * @description NestJS module for student management functionality
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';

/**
 * Student Module
 *
 * Provides complete student management functionality:
 * - Entity definition with TypeORM
 * - Service layer for business logic
 * - Controller layer for HTTP endpoints
 * - Repository pattern via TypeORM
 *
 * Exports:
 * - StudentService: For use in other modules (health records, appointments, etc.)
 *
 * Dependencies:
 * - TypeOrmModule: For database operations
 * - ConfigModule: Inherited from AppModule (global)
 */
@Module({
  imports: [
    // Register Student entity with TypeORM
    TypeOrmModule.forFeature([Student]),

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
