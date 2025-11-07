/**
 * @fileoverview Student Module
 * @module student/student.module
 * @description NestJS module for student management functionality
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { HealthRecord, MentalHealthRecord, Student, User } from '@/database';
import { AcademicTranscriptModule } from '@/academic-transcript';

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
    // Register models with Sequelize
    SequelizeModule.forFeature([
      Student,
      User,
      HealthRecord,
      MentalHealthRecord,
    ]),

    // Import AcademicTranscriptModule for transcript-related operations
    AcademicTranscriptModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService], // Export for use in other modules
})
export class StudentModule {}
