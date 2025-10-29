/**
 * @fileoverview Student Module
 * @module student/student.module
 * @description NestJS module for student management functionality
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from '../database/models/student.model';
import { User } from '../database/models/user.model';
import { HealthRecord } from '../database/models/health-record.model';
import { MentalHealthRecord } from '../database/models/mental-health-record.model';
import { AcademicTranscriptModule } from '../academic-transcript/academic-transcript.module';

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
