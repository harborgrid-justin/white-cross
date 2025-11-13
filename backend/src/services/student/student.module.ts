/**
 * @fileoverview Student Module
 * @module student/student.module
 * @description NestJS module for student management functionality
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentService } from './student.service';
import { StudentCoreController } from './controllers/student-core.controller';
import { StudentStatusController } from './controllers/student-status.controller';
import { StudentCrudController } from './controllers/student-crud.controller';
import { StudentManagementController } from './controllers/student-management.controller';
import { StudentQueryController } from './controllers/student-query.controller';
import { StudentAnalyticsController } from './controllers/student-analytics.controller';
import { StudentHealthController } from './controllers/student-health.controller';
import { StudentPhotoController } from './controllers/student-photo.controller';
import { StudentAcademicController } from './controllers/student-academic.controller';
import { StudentGradeController } from './controllers/student-grade.controller';
import { StudentBarcodeController } from './controllers/student-barcode.controller';
import { StudentWaitlistController } from './controllers/student-waitlist.controller';
import {
  StudentCrudService,
  StudentQueryService,
  StudentHealthRecordsService,
  StudentAcademicService,
  StudentPhotoService,
  StudentBarcodeService,
  StudentWaitlistService,
  StudentValidationService,
  StudentStatusService,
} from './services';
import { HealthRecord, MentalHealthRecord, Student, User } from '@/database';
import { AcademicTranscriptModule } from '../academic-transcript';
import { AuditModule } from '../audit';

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
    SequelizeModule.forFeature([Student, User, HealthRecord, MentalHealthRecord]),

    // Import AcademicTranscriptModule for transcript-related operations
    AcademicTranscriptModule,

    // Import AuditModule to access PHIAccessLogger for HealthRecordAuditInterceptor
    AuditModule,
  ],
  controllers: [
    StudentCoreController,
    StudentStatusController,
    StudentCrudController,
    StudentManagementController,
    StudentQueryController,
    StudentAnalyticsController,
    StudentHealthController,
    StudentPhotoController,
    StudentAcademicController,
    StudentGradeController,
    StudentBarcodeController,
    StudentWaitlistController,
  ],
  providers: [
    StudentService, // Main facade service for backward compatibility
    StudentCrudService,
    StudentQueryService,
    StudentHealthRecordsService,
    StudentAcademicService,
    StudentPhotoService,
    StudentBarcodeService,
    StudentWaitlistService,
    StudentValidationService,
    StudentStatusService,
  ],
  exports: [
    StudentService, // Main facade service for backward compatibility
    StudentCrudService,
    StudentQueryService,
    StudentHealthRecordsService,
    StudentAcademicService,
    StudentPhotoService,
    StudentBarcodeService,
    StudentWaitlistService,
    StudentValidationService,
    StudentStatusService,
  ],
})
export class StudentModule {}
