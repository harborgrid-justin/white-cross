/**
 * @fileoverview Student DTOs Index
 * @module student/dto
 * @description Barrel export file for all student-related DTOs and types
 */

// CRUD DTOs
export * from './create-student.dto';
export * from './update-student.dto';
export * from './student-filter.dto';

// Management DTOs
export * from './transfer-student.dto';
export * from './bulk-update.dto';

// Health Records DTOs
export * from './student-health-records.dto';
export * from './mental-health-records.dto';

// Photo Management DTOs
export * from './upload-photo.dto';
export * from './search-photo.dto';

// Academic Transcript DTOs
export * from './import-transcript.dto';
export * from './academic-history.dto';
export * from './performance-trends.dto';

// Grade Transition DTOs
export * from './bulk-grade-transition.dto';
export * from './graduating-students.dto';
export * from './grade-transition.dto';
export * from './graduation.dto';

// Barcode Scanning DTOs
export * from './scan-barcode.dto';
export * from './generate-barcode.dto';
export * from './verify-barcode.dto';
export * from './verify-medication.dto';

// Waitlist Management DTOs
export * from './add-waitlist.dto';
export * from './waitlist-status.dto';
export * from './waitlist-priority.dto';

// Type definitions
export * from '../types';
