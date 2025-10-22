# Student Service JSDoc Documentation Guide

## Overview
This document provides comprehensive JSDoc documentation for all student-related service files in the backend.

## Files Documented
1. `services/studentService.ts` - Main student service
2. `services/studentPhotoService.ts` - Photo management service
3. `services/student/index.ts` - Module facade/exports
4. `services/student/types.ts` - Type definitions
5. `services/student/validation.ts` - Validation utilities
6. `services/student/queryBuilder.ts` - Query construction

---

## 1. studentService.ts

### File-Level Documentation

```typescript
/**
 * @fileoverview Student Service - Core Business Logic Layer
 * @module services/studentService
 * @description Comprehensive student management service handling all CRUD operations,
 * enrollment management, health record integration, and data validation.
 *
 * Key Features:
 * - Student CRUD operations with full validation
 * - Paginated search and filtering
 * - Grade management and student transfers
 * - Bulk operations for administrative efficiency
 * - Statistics and data export for compliance
 * - Cascade delete protection for related records
 *
 * Authorization Patterns:
 * - Nurse-based access control (students assigned to specific nurses)
 * - Role-based student data access (only authorized personnel)
 * - Audit logging for all modifications
 *
 * @compliance FERPA §99.3 - Education records protection
 * @compliance FERPA §99.31 - Disclosure requirements
 * @compliance HIPAA - PHI handling for health information
 * @audit All CRUD operations logged for compliance
 *
 * @requires ../database/models - Sequelize data models
 * @requires ../utils/logger - Audit logging service
 *
 * @see {@link https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html|FERPA Regulations}
 */
```

### Interface Documentation

```typescript
/**
 * @interface CreateStudentData
 * @description Data structure for creating a new student record
 *
 * @property {string} studentNumber - Unique student identifier (auto-normalized to uppercase)
 * @property {string} firstName - Student's legal first name
 * @property {string} lastName - Student's legal last name
 * @property {Date} dateOfBirth - Student's date of birth (must be 3-100 years ago)
 * @property {string} grade - Current grade level (K-12 or custom)
 * @property {Gender} gender - Student's gender from enum
 * @property {string} [photo] - Optional photo URL or base64 data
 * @property {string} [medicalRecordNum] - Optional unique medical record number
 * @property {string} [nurseId] - UUID of assigned school nurse
 * @property {Date} [enrollmentDate] - Date of school enrollment (defaults to today)
 * @property {string} [createdBy] - UUID of user creating the record
 *
 * @compliance FERPA - All fields are protected education records
 */
```

### Class Documentation

```typescript
/**
 * @class StudentService
 * @description Business logic layer for student operations
 *
 * Responsibilities:
 * - Student CRUD operations
 * - Search and filtering with pagination
 * - Data validation and sanitization
 * - Authorization checks (nurse assignments)
 * - Audit logging
 * - Bulk operations
 * - Statistics and reporting
 *
 * Authorization Model:
 * - Students are assigned to specific nurses
 * - Access controlled via nurseId relationship
 * - All operations logged for FERPA compliance
 *
 * Cascade Delete Behavior:
 * - Permanent delete cascades to all related records:
 *   - Emergency contacts
 *   - Health records
 *   - Allergies
 *   - Chronic conditions
 *   - Medications
 *   - Appointments
 *   - Incident reports
 *
 * @example
 * const student = await StudentService.createStudent({
 *   studentNumber: 'STU12345',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('2010-01-15'),
 *   grade: '5',
 *   gender: Gender.MALE,
 *   nurseId: 'nurse-uuid-123'
 * });
 */
```

### Method Documentation

#### getStudents()
```typescript
/**
 * @method getStudents
 * @description Retrieve paginated list of students with optional filters
 * @async
 * @static
 *
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [limit=10] - Number of records per page
 * @param {StudentFilters} [filters={}] - Filter criteria
 *
 * @returns {Promise<{students: Student[], pagination: PaginationMetadata}>}
 * Paginated student list with metadata
 *
 * @throws {Error} Database query failure
 *
 * Search Features:
 * - Case-insensitive search across firstName, lastName, studentNumber
 * - Filter by grade, active status, nurse assignment
 * - Filter by allergies or medications presence
 * - Includes related data: emergency contacts, allergies, medications, assigned nurse
 *
 * @example
 * // Get active students in grade 5
 * const result = await StudentService.getStudents(1, 20, {
 *   grade: '5',
 *   isActive: true
 * });
 * console.log(`Found ${result.pagination.total} students`);
 */
```

#### getStudentById()
```typescript
/**
 * @method getStudentById
 * @description Retrieve complete student profile by ID with all related data
 * @async
 * @static
 *
 * @param {string} id - Student UUID
 *
 * @returns {Promise<Student>} Complete student profile with all associations
 *
 * @throws {Error} Student not found
 * @throws {Error} Database query failure
 *
 * Includes:
 * - Emergency contacts (active only)
 * - Medications with recent administration logs (last 10)
 * - Health records (most recent 20)
 * - Allergies (active, sorted by severity)
 * - Chronic conditions
 * - Recent appointments (last 10)
 * - Recent incident reports (last 10)
 * - Assigned nurse details
 *
 * Authorization:
 * - Caller should verify access rights to this student
 * - Access logged for FERPA compliance
 *
 * @example
 * const student = await StudentService.getStudentById('student-uuid-123');
 * console.log(`Student: ${student.firstName} ${student.lastName}`);
 */
```

#### createStudent()
```typescript
/**
 * @method createStudent
 * @description Create a new student record with validation
 * @async
 * @static
 *
 * @param {CreateStudentData} data - Student creation data
 *
 * @returns {Promise<Student>} Created student record with basic associations
 *
 * @throws {Error} Student number already exists
 * @throws {Error} Medical record number already exists
 * @throws {Error} Invalid date of birth (must be 3-100 years ago)
 * @throws {Error} Assigned nurse not found
 * @throws {Error} Validation errors
 *
 * Validation Rules:
 * - Student number: Uppercase, trimmed, unique
 * - Medical record number: Uppercase, trimmed, unique (if provided)
 * - Date of birth: Must be in past, student age 3-100 years
 * - Names: Trimmed whitespace
 * - Nurse ID: Must reference existing user (if provided)
 * - Enrollment date: Defaults to today if not provided
 * - Active status: Set to true by default
 *
 * Post-Creation:
 * - Reloads with emergency contacts, allergies, and nurse details
 * - Logs creation event for audit trail
 *
 * @example
 * const student = await StudentService.createStudent({
 *   studentNumber: 'STU12345',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   dateOfBirth: new Date('2012-05-20'),
 *   grade: '3',
 *   gender: Gender.FEMALE,
 *   nurseId: 'nurse-uuid-456'
 * });
 */
```

#### updateStudent()
```typescript
/**
 * @method updateStudent
 * @description Update existing student information with validation
 * @async
 * @static
 *
 * @param {string} id - Student UUID
 * @param {UpdateStudentData} data - Updated student data
 *
 * @returns {Promise<Student>} Updated student record with associations
 *
 * @throws {Error} Invalid UUID format
 * @throws {Error} Student not found
 * @throws {Error} Student number already exists (if changed)
 * @throws {Error} Medical record number already exists (if changed)
 * @throws {Error} Invalid date of birth
 * @throws {Error} Assigned nurse not found
 *
 * Validation:
 * - UUID format validation
 * - Uniqueness checks for changed student number or medical record number
 * - Date of birth validation (if changed)
 * - Nurse assignment validation (if changed)
 * - Name normalization (if changed)
 *
 * @example
 * const updated = await StudentService.updateStudent('student-uuid-123', {
 *   grade: '6',
 *   nurseId: 'new-nurse-uuid-456'
 * });
 */
```

#### deleteStudent()
```typescript
/**
 * @method deleteStudent
 * @description Permanently delete student and all related records
 * @async
 * @static
 *
 * @param {string} id - Student UUID
 *
 * @returns {Promise<{success: boolean, message: string}>} Deletion result
 *
 * @throws {Error} Student not found
 * @throws {Error} Database deletion failure
 *
 * DANGER - Cascade Delete:
 * Permanently removes ALL related records:
 * - Emergency contacts
 * - Health records
 * - Allergies and chronic conditions
 * - Medication records and logs
 * - Appointments
 * - Incident reports
 *
 * Compliance:
 * - Use only when legally required (e.g., GDPR/CCPA right to deletion)
 * - Prefer deactivateStudent() for normal operations
 * - Logs as WARNING level for extra visibility
 *
 * Transaction:
 * - Uses transaction for data integrity
 * - Rolls back on any failure
 *
 * @example
 * // DANGER: This permanently deletes all student data
 * const result = await StudentService.deleteStudent('student-uuid-123');
 */
```

---

## 2. studentPhotoService.ts

### File-Level Documentation

```typescript
/**
 * @fileoverview Student Photo Service - Photo Management and Facial Recognition
 * @module services/studentPhotoService
 * @description Service for handling student photo uploads, storage, and facial recognition
 * indexing for identification purposes.
 *
 * Key Features:
 * - Photo upload and storage (cloud-ready)
 * - Facial encoding extraction for recognition
 * - Photo-based student search
 * - Batch photo operations
 * - Metadata management
 *
 * Security:
 * - Photo data is sensitive PII
 * - Facial biometrics subject to privacy laws
 * - Audit logging for all photo operations
 *
 * @compliance FERPA - Photos are education records
 * @compliance BIPA - Biometric data handling (Illinois)
 * @compliance GDPR - Right to deletion of biometric data
 * @audit All photo operations logged
 *
 * @requires ../database/models - Student model
 * @requires ../utils/logger - Audit logging
 * @requires uuid - Unique filename generation
 *
 * LOC: 496851C598
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - enhancedFeatures.ts (routes/enhancedFeatures.ts)
 */
```

### Interface Documentation

```typescript
/**
 * @interface PhotoMetadata
 * @description Metadata associated with a student photo
 *
 * @property {string} filename - Generated filename for storage
 * @property {string} mimeType - Photo MIME type (e.g., 'image/jpeg')
 * @property {number} size - File size in bytes
 * @property {Date} uploadedAt - Upload timestamp
 * @property {string} uploadedBy - UUID of user who uploaded
 * @property {string} [faceEncoding] - Base64 encoded facial feature vector for recognition
 * @property {{width: number, height: number}} [dimensions] - Image dimensions in pixels
 *
 * @compliance BIPA - faceEncoding is biometric identifier
 */

/**
 * @interface PhotoUploadData
 * @description Data required for photo upload operation
 *
 * @property {string} studentId - Student UUID
 * @property {string} imageData - Base64 encoded image data
 * @property {string} uploadedBy - UUID of uploading user
 * @property {Partial<PhotoMetadata>} [metadata] - Optional additional metadata
 */

/**
 * @interface FacialRecognitionMatch
 * @description Result of facial recognition search
 *
 * @property {string} studentId - Matched student UUID
 * @property {string} studentName - Student full name
 * @property {number} confidence - Match confidence score (0-1)
 * @property {string} photo - Photo URL of matched student
 */
```

### Class Documentation

```typescript
/**
 * @class StudentPhotoService
 * @description Service for student photo management and facial recognition
 *
 * Responsibilities:
 * - Photo upload and validation
 * - Cloud storage integration (production)
 * - Facial encoding extraction
 * - Photo-based student search
 * - Batch photo operations
 * - Photo deletion
 *
 * Privacy Considerations:
 * - Facial encodings are biometric identifiers
 * - Subject to BIPA, GDPR, CCPA regulations
 * - Requires explicit consent in some jurisdictions
 * - Must support right to deletion
 *
 * @example
 * const result = await StudentPhotoService.uploadPhoto({
 *   studentId: 'student-uuid-123',
 *   imageData: 'base64-encoded-image-data',
 *   uploadedBy: 'user-uuid-456'
 * });
 */
```

### Method Documentation

```typescript
/**
 * @method uploadPhoto
 * @description Upload and process student photo with facial recognition indexing
 * @async
 * @static
 *
 * @param {PhotoUploadData} data - Photo upload data
 *
 * @returns {Promise<{success: boolean, photoUrl: string, metadata: PhotoMetadata}>}
 * Upload result with photo URL and metadata
 *
 * @throws {Error} Student not found
 * @throws {Error} Invalid image data
 * @throws {Error} Upload failure
 *
 * Process:
 * 1. Validate student exists
 * 2. Generate unique filename
 * 3. Extract facial encoding (ML model)
 * 4. Upload to storage (S3/Cloud in production)
 * 5. Update student record with photo URL
 * 6. Log operation for audit
 *
 * @compliance BIPA - Facial encoding creation requires consent
 *
 * @example
 * const result = await StudentPhotoService.uploadPhoto({
 *   studentId: 'student-uuid-123',
 *   imageData: base64Image,
 *   uploadedBy: 'nurse-uuid-456'
 * });
 * console.log(`Photo uploaded: ${result.photoUrl}`);
 */

/**
 * @method searchByPhoto
 * @description Search for students using facial recognition
 * @async
 * @static
 *
 * @param {string} imageData - Base64 encoded search image
 * @param {number} [threshold=0.6] - Minimum confidence threshold (0-1)
 *
 * @returns {Promise<FacialRecognitionMatch[]>} Array of matched students (top 10)
 *
 * @throws {Error} Invalid image data
 * @throws {Error} Recognition service failure
 *
 * Process:
 * 1. Extract facial encoding from search image
 * 2. Compare against all stored encodings
 * 3. Calculate confidence scores
 * 4. Filter by threshold
 * 5. Sort by confidence descending
 * 6. Return top 10 matches
 *
 * @compliance BIPA - Biometric search requires disclosure
 * @audit Search operations logged
 *
 * @example
 * const matches = await StudentPhotoService.searchByPhoto(searchImage, 0.7);
 * matches.forEach(m => {
 *   console.log(`${m.studentName}: ${(m.confidence * 100).toFixed(1)}%`);
 * });
 */

/**
 * @method deletePhoto
 * @description Delete student photo and facial encoding
 * @async
 * @static
 *
 * @param {string} studentId - Student UUID
 * @param {string} deletedBy - UUID of user deleting photo
 *
 * @returns {Promise<boolean>} true if successful
 *
 * @throws {Error} Student not found
 * @throws {Error} Student has no photo
 * @throws {Error} Deletion failure
 *
 * Process:
 * 1. Verify student exists
 * 2. Delete from cloud storage
 * 3. Remove facial encoding
 * 4. Update student record (set photo to null)
 * 5. Log operation
 *
 * @compliance GDPR - Right to deletion of biometric data
 *
 * @example
 * await StudentPhotoService.deletePhoto('student-uuid-123', 'admin-uuid-456');
 */

/**
 * @method batchUploadPhotos
 * @description Upload multiple student photos in batch
 * @async
 * @static
 *
 * @param {PhotoUploadData[]} uploads - Array of upload data
 *
 * @returns {Promise<{success: number, failed: number, results: any[]}>}
 * Batch operation summary
 *
 * Process:
 * - Processes each upload sequentially
 * - Continues on individual failures
 * - Returns summary with success/failure counts
 * - Includes detailed results for each upload
 *
 * @example
 * const result = await StudentPhotoService.batchUploadPhotos([
 *   { studentId: 'uuid-1', imageData: 'base64-1', uploadedBy: 'admin' },
 *   { studentId: 'uuid-2', imageData: 'base64-2', uploadedBy: 'admin' }
 * ]);
 * console.log(`Uploaded: ${result.success}, Failed: ${result.failed}`);
 */
```

---

## 3. student/types.ts

[Already documented above in file write attempt]

---

## 4. student/validation.ts

### File-Level Documentation

```typescript
/**
 * @fileoverview Student Data Validation Module
 * @module services/student/validation
 * @description Provides comprehensive validation utilities for student data operations.
 * Ensures data integrity, uniqueness constraints, and business rule compliance.
 *
 * Key Features:
 * - Student number and medical record number uniqueness validation
 * - Date of birth business rule validation (3-100 years)
 * - Nurse assignment validation
 * - UUID format validation
 * - Data normalization (uppercase, trimming)
 * - Sequelize error handling
 *
 * Validation Rules:
 * - Student numbers must be unique across all students
 * - Medical record numbers must be unique if provided
 * - Date of birth must be 3-100 years in the past
 * - Nurse IDs must reference existing users
 * - UUIDs must be valid v4 format
 *
 * @compliance FERPA - Validation ensures data accuracy
 *
 * LOC: C41E6D37EC-V01
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - crud.ts (./crud.ts)
 *   - enrollment.ts (./enrollment.ts)
 */
```

### Class Documentation

```typescript
/**
 * @class StudentValidator
 * @description Static validation utilities for student data
 *
 * All methods are static and throw descriptive errors on validation failure.
 * Designed to be called before database operations to ensure data integrity.
 *
 * Validation Categories:
 * - Uniqueness (student number, medical record number)
 * - Format (UUID, date ranges)
 * - References (nurse existence)
 * - Normalization (case, whitespace)
 * - Business rules (age constraints)
 *
 * @example
 * await StudentValidator.validateCreateData(studentData);
 * // Throws if validation fails, silent if successful
 */
```

### Method Documentation

```typescript
/**
 * @method validateStudentNumber
 * @description Validate and normalize student number for uniqueness
 * @async
 * @static
 *
 * @param {string} studentNumber - Raw student number
 * @param {string} [excludeId] - Student UUID to exclude from duplicate check (for updates)
 *
 * @returns {Promise<string>} Normalized student number (uppercase, trimmed)
 *
 * @throws {Error} Student number already exists
 *
 * Process:
 * 1. Normalize to uppercase and trim
 * 2. Query database for duplicates (excluding current student if updating)
 * 3. Throw error if duplicate found
 * 4. Return normalized value if unique
 *
 * @example
 * const normalized = await StudentValidator.validateStudentNumber('stu12345');
 * // Returns: 'STU12345'
 *
 * @example
 * // For updates, exclude current student
 * const normalized = await StudentValidator.validateStudentNumber(
 *   'stu12345',
 *   'current-student-uuid'
 * );
 */

/**
 * @method validateMedicalRecordNumber
 * @description Validate and normalize medical record number for uniqueness
 * @async
 * @static
 *
 * @param {string} medicalRecordNum - Raw medical record number
 * @param {string} [excludeId] - Student UUID to exclude (for updates)
 *
 * @returns {Promise<string>} Normalized medical record number
 *
 * @throws {Error} Medical record number already exists
 *
 * Similar to validateStudentNumber but for medical record numbers
 */

/**
 * @method validateDateOfBirth
 * @description Validate date of birth against business rules
 * @static
 *
 * @param {Date} dateOfBirth - Date to validate
 *
 * @returns {void}
 *
 * @throws {Error} Date of birth must be in the past
 * @throws {Error} Student age must be between 3 and 100 years
 *
 * Business Rules:
 * - Date must be in the past
 * - Student must be between 3 and 100 years old
 *
 * @example
 * StudentValidator.validateDateOfBirth(new Date('2010-05-15'));
 * // Silent if valid, throws if invalid
 */

/**
 * @method validateNurseAssignment
 * @description Validate that nurse ID references an existing user
 * @async
 * @static
 *
 * @param {string} nurseId - Nurse UUID to validate
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} Assigned nurse not found
 *
 * @example
 * await StudentValidator.validateNurseAssignment('nurse-uuid-123');
 */

/**
 * @method validateUUID
 * @description Validate UUID format (v4)
 * @static
 *
 * @param {string} id - UUID to validate
 *
 * @returns {void}
 *
 * @throws {Error} Invalid student ID format
 *
 * @example
 * StudentValidator.validateUUID('550e8400-e29b-41d4-a716-446655440000');
 */

/**
 * @method normalizeCreateData
 * @description Normalize student creation data
 * @static
 *
 * @param {CreateStudentData} data - Raw creation data
 *
 * @returns {CreateStudentData} Normalized data
 *
 * Normalization:
 * - Trim whitespace from names
 * - Uppercase student and medical record numbers
 * - Set default enrollment date if not provided
 *
 * @example
 * const normalized = StudentValidator.normalizeCreateData(rawData);
 */

/**
 * @method normalizeUpdateData
 * @description Normalize student update data
 * @static
 *
 * @param {UpdateStudentData} data - Raw update data
 *
 * @returns {UpdateStudentData} Normalized data
 *
 * Only normalizes fields that are present in the update data
 */

/**
 * @method validateCreateData
 * @description Comprehensive validation for student creation
 * @async
 * @static
 *
 * @param {CreateStudentData} data - Data to validate
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} Various validation errors
 *
 * Validates:
 * - Student number uniqueness
 * - Medical record number uniqueness (if provided)
 * - Date of birth business rules
 * - Nurse assignment (if provided)
 *
 * @example
 * await StudentValidator.validateCreateData(studentData);
 * // Will throw if any validation fails
 */

/**
 * @method validateUpdateData
 * @description Comprehensive validation for student updates
 * @async
 * @static
 *
 * @param {string} id - Student UUID
 * @param {UpdateStudentData} data - Update data
 * @param {any} existingStudent - Current student record
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} Various validation errors
 *
 * Validates:
 * - UUID format
 * - Changed fields for uniqueness
 * - Date of birth if changed
 * - Nurse assignment if changed
 */

/**
 * @method handleSequelizeError
 * @description Convert Sequelize errors to user-friendly messages
 * @static
 *
 * @param {any} error - Sequelize error object
 *
 * @returns {never} Always throws
 *
 * @throws {Error} User-friendly error message
 *
 * Handles:
 * - SequelizeValidationError
 * - SequelizeUniqueConstraintError
 * - Other errors (rethrown)
 *
 * @example
 * try {
 *   await student.save();
 * } catch (error) {
 *   StudentValidator.handleSequelizeError(error);
 * }
 */
```

---

## 5. student/queryBuilder.ts

### File-Level Documentation

```typescript
/**
 * @fileoverview Student Query Builder Module
 * @module services/student/queryBuilder
 * @description Constructs complex Sequelize queries for student data retrieval with
 * optimized performance and flexible filtering.
 *
 * Key Features:
 * - Dynamic where clause construction
 * - Association include building
 * - Pagination support
 * - Sorting and ordering
 * - Optimized eager loading
 * - Filter combinations
 *
 * Query Types:
 * - List queries (paginated, filtered)
 * - Detail queries (complete profile)
 * - Search queries (text-based)
 * - Grade-based queries
 * - Assignment queries (by nurse)
 *
 * Performance:
 * - Uses separate queries for one-to-many (separate: true)
 * - Distinct counting for accurate pagination
 * - Optimized association loading
 *
 * LOC: C41E6D37EC-Q01
 *
 * UPSTREAM (imports from):
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - search.ts (./search.ts)
 *   - crud.ts (./crud.ts)
 */
```

### Class Documentation

```typescript
/**
 * @class StudentQueryBuilder
 * @description Static utility for building Sequelize queries
 *
 * All methods are static and return query configuration objects that can be
 * passed directly to Sequelize methods (findAll, findAndCountAll, etc.)
 *
 * Design Pattern:
 * - Builder pattern for query construction
 * - Returns plain objects (Sequelize query options)
 * - Composable query parts
 *
 * @example
 * const whereClause = StudentQueryBuilder.buildWhereClause(filters);
 * const includeArray = StudentQueryBuilder.buildIncludeArray(filters);
 * const students = await Student.findAll({ where: whereClause, include: includeArray });
 */
```

### Method Documentation

```typescript
/**
 * @method buildWhereClause
 * @description Build Sequelize where clause from filters
 * @static
 *
 * @param {StudentFilters} filters - Filter criteria
 *
 * @returns {object} Sequelize where clause object
 *
 * Supported Filters:
 * - search: Case-insensitive OR search on firstName, lastName, studentNumber
 * - grade: Exact match on grade
 * - isActive: Boolean filter for active status
 * - nurseId: Filter by assigned nurse UUID
 * - gender: Exact match on gender enum
 *
 * @example
 * const where = StudentQueryBuilder.buildWhereClause({
 *   search: 'john',
 *   grade: '5',
 *   isActive: true
 * });
 * // Returns: { [Op.or]: [...], grade: '5', isActive: true }
 */

/**
 * @method buildIncludeArray
 * @description Build Sequelize include array for associations
 * @static
 *
 * @param {StudentFilters} filters - Filter criteria
 * @param {boolean} [includeAll=false] - Include all associations (for detail view)
 *
 * @returns {any[]} Sequelize include array
 *
 * Always Includes:
 * - Emergency contacts (active only, ordered by priority)
 * - Assigned nurse (basic attributes only)
 * - Allergies (conditional required based on filter)
 * - Medications (conditional required based on filter)
 *
 * Filter Behavior:
 * - hasAllergies: true → required: true (inner join)
 * - hasAllergies: false/undefined → required: false (left join)
 * - hasMedications: Similar behavior
 *
 * @example
 * const include = StudentQueryBuilder.buildIncludeArray({ hasAllergies: true });
 * // Students without allergies will be excluded
 */

/**
 * @method buildCompleteProfileInclude
 * @description Build complete association include for detail view
 * @static
 *
 * @returns {any[]} Comprehensive include array
 *
 * Includes ALL associations:
 * - Emergency contacts
 * - Medications with logs and nurse details
 * - Health records (recent 20)
 * - Allergies (sorted by severity)
 * - Chronic conditions
 * - Appointments (recent 10)
 * - Incident reports (recent 10)
 * - Assigned nurse
 *
 * Performance:
 * - Uses separate queries for large one-to-many (medications, health records)
 * - Limits included records to prevent huge result sets
 * - Ordered by relevance (most recent, highest severity)
 *
 * @example
 * const student = await Student.findByPk(id, {
 *   include: StudentQueryBuilder.buildCompleteProfileInclude()
 * });
 */

/**
 * @method buildBasicInclude
 * @description Build basic associations for list views
 * @static
 *
 * @returns {any[]} Minimal include array
 *
 * Includes:
 * - Emergency contacts (active)
 * - Allergies (active)
 * - Assigned nurse
 *
 * Use for list views where full associations not needed
 */

/**
 * @method buildSearchQuery
 * @description Build complete query configuration for text search
 * @static
 *
 * @param {string} query - Search string
 * @param {number} [limit=20] - Max results
 *
 * @returns {object} Complete Sequelize query options
 *
 * Search Behavior:
 * - Case-insensitive
 * - Partial match on firstName, lastName, studentNumber
 * - Active students only
 * - Ordered by lastName, firstName
 *
 * @example
 * const students = await Student.findAll(
 *   StudentQueryBuilder.buildSearchQuery('john', 10)
 * );
 */

/**
 * @method buildGradeQuery
 * @description Build query for students in a specific grade
 * @static
 *
 * @param {string} grade - Grade level
 *
 * @returns {object} Complete Sequelize query options
 *
 * @example
 * const fifthGraders = await Student.findAll(
 *   StudentQueryBuilder.buildGradeQuery('5')
 * );
 */

/**
 * @method buildAssignedStudentsQuery
 * @description Build query for students assigned to a nurse
 * @static
 *
 * @param {string} userId - Nurse UUID
 *
 * @returns {object} Complete Sequelize query options
 *
 * Returns minimal attributes for performance (list view)
 *
 * @example
 * const myStudents = await Student.findAll(
 *   StudentQueryBuilder.buildAssignedStudentsQuery('nurse-uuid-123')
 * );
 */
```

---

## 6. student/index.ts

### File-Level Documentation

```typescript
/**
 * @fileoverview Student Service Module Index - Facade and Exports
 * @module services/student
 * @description Main entry point for student service modules. Currently acts as a facade
 * to the monolithic studentService during migration. Will be fully modularized in future.
 *
 * Architecture:
 * - Temporary facade pattern during migration
 * - Delegates to monolithic studentService.ts
 * - Re-exports types from types.ts
 * - Will be split into modules: crud, search, statistics, transfer, bulk, export
 *
 * Future Modules (Planned):
 * - crudOperations.ts: Create, read, update, delete
 * - queryOperations.ts: Search, filtering, pagination
 * - statisticsOperations.ts: Analytics and reporting
 * - transferOperations.ts: Grade progression and nurse transfers
 * - bulkOperations.ts: Batch updates
 * - exportOperations.ts: Data export for compliance
 *
 * LOC: C41E6D37EC-I
 *
 * UPSTREAM (imports from):
 *   - studentService.ts (../studentService.ts)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - students.ts (routes/students.ts)
 */
```

---

## Summary

### Authorization Patterns Documented

1. **Nurse-Based Access Control**
   - Students assigned to specific nurses via `nurseId`
   - `getAssignedStudents()` filters by nurse
   - Transfer operations validate nurse existence
   - All operations logged for FERPA compliance

2. **Role-Based Access (Implied)**
   - Services expect caller to enforce role-based access
   - Authentication/authorization in route layer
   - Services focus on data validation and business logic

### CRUD Operations Documented

1. **Create**: `createStudent()` with validation and normalization
2. **Read**:
   - `getStudents()` - Paginated list with filters
   - `getStudentById()` - Complete profile
   - `searchStudents()` - Text search
   - `getStudentsByGrade()` - Grade-based retrieval
3. **Update**: `updateStudent()` with validation
4. **Delete**:
   - `deactivateStudent()` - Soft delete (preferred)
   - `deleteStudent()` - Permanent delete with cascade (dangerous)
5. **Transfer**: `transferStudent()` - Nurse reassignment

### Search/Filter Features Documented

1. **Pagination**: Page/limit parameters with metadata
2. **Text Search**: Case-insensitive across name and student number
3. **Grade Filter**: Exact match on grade level
4. **Active Status Filter**: Boolean for active/inactive
5. **Nurse Assignment Filter**: Filter by assigned nurse
6. **Health Filters**:
   - `hasAllergies` - Students with allergies
   - `hasMedications` - Students with medications
7. **Gender Filter**: Enum-based filtering

### Compliance Notes

1. **FERPA Compliance**:
   - All student data is protected education records
   - Access logging for audit trail
   - Disclosure requirements documented
   - Export functionality for legitimate requests

2. **HIPAA Compliance**:
   - PHI handling for health-related fields
   - Medical record number protection
   - Audit logging for access

3. **BIPA Compliance** (Photo Service):
   - Facial biometrics are sensitive identifiers
   - Consent requirements noted
   - Right to deletion supported

4. **Cascade Delete Warnings**:
   - Permanent deletion documented as dangerous
   - All related records cascade deleted
   - Transaction safety ensured
   - Prefer soft delete for normal operations

### Key Validation Rules

1. Student number: Unique, uppercase, trimmed
2. Medical record number: Unique if provided
3. Date of birth: 3-100 years in past
4. Nurse assignment: Must reference valid user
5. UUID format: Valid v4 UUIDs required

---

## Implementation Instructions

1. Copy the JSDoc blocks from this document
2. Paste into the respective files
3. Adjust line numbers and indentation as needed
4. Ensure consistency with existing code
5. Run TypeScript compiler to verify no syntax errors
6. Update related documentation if needed

## Maintenance Notes

- Keep JSDoc in sync with code changes
- Update compliance references as regulations change
- Add examples for new methods
- Document new authorization patterns
- Keep validation rules up to date
