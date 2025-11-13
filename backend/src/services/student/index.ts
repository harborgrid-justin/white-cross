/**
 * Student Module Barrel Export
 * Provides centralized exports for the student module
 */

// Module
export { StudentModule } from './student.module';

// Service
export { StudentService } from './student.service';

// Controllers
export { StudentCrudController } from './controllers/student-crud.controller';
export { StudentManagementController } from './controllers/student-management.controller';
export { StudentQueryController } from './controllers/student-query.controller';
export { StudentAnalyticsController } from './controllers/student-analytics.controller';
export { StudentHealthController } from './controllers/student-health.controller';
export { StudentPhotoController } from './controllers/student-photo.controller';
export { StudentAcademicController } from './controllers/student-academic.controller';
export { StudentGradeController } from './controllers/student-grade.controller';
export { StudentBarcodeController } from './controllers/student-barcode.controller';
export { StudentWaitlistController } from './controllers/student-waitlist.controller';

// DTOs
export * from './dto';
