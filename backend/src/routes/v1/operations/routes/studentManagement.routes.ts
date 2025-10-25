/**
 * Student Management Routes
 * HTTP endpoints for student photo management, academic transcripts, and grade transitions
 * All routes prefixed with /api/v1/student-management
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { StudentManagementController } from '../controllers/studentManagement.controller';
import {
  studentPhotoUploadSchema,
  studentPhotoSearchSchema,
  academicTranscriptSchema,
  gradeTransitionSchema,
  barcodeScanSchema,
  barcodeVerificationSchema,
  waitlistSchema,
  studentIdParamSchema
} from '../validators/studentManagement.validators';

/**
 * STUDENT PHOTO MANAGEMENT ROUTES
 */

const uploadStudentPhotoRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/photos/{studentId}',
  handler: asyncHandler(StudentManagementController.uploadPhoto),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'v1'],
    description: 'Upload student photo',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Uploads and stores student photo with metadata. Includes facial recognition indexing for identification purposes. Requires NURSE or ADMIN role. All photo uploads are audited.',
    validate: {
      params: studentIdParamSchema,
      payload: studentPhotoUploadSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Student photo uploaded successfully' },
          '400': { description: 'Validation error or invalid image format' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const searchStudentByPhotoRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/photos/search',
  handler: asyncHandler(StudentManagementController.searchByPhoto),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'v1'],
    description: 'Search for student by photo using facial recognition',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Uses facial recognition to identify students from uploaded photos. Returns potential matches with confidence scores. Used for student identification in emergency situations or when student ID is unknown.',
    validate: {
      payload: studentPhotoSearchSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Photo search completed successfully' },
          '400': { description: 'Validation error or invalid image format' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * ACADEMIC TRANSCRIPT ROUTES
 */

const importAcademicTranscriptRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/transcripts/{studentId}/import',
  handler: asyncHandler(StudentManagementController.importTranscript),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Academic Records', 'v1'],
    description: 'Import academic transcript for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Imports academic transcript data including grades, courses, GPA, and attendance records. Validates transcript format and calculates academic metrics. Requires ADMIN or COUNSELOR role.',
    validate: {
      params: studentIdParamSchema,
      payload: academicTranscriptSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Academic transcript imported successfully' },
          '400': { description: 'Validation error or invalid transcript format' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires ADMIN or COUNSELOR role' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getAcademicHistoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/student-management/transcripts/{studentId}/history',
  handler: asyncHandler(StudentManagementController.getAcademicHistory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Academic Records', 'v1'],
    description: 'Get complete academic history for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns comprehensive academic history including all transcripts, grades, courses, and academic achievements. Used for academic planning and college applications.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Academic history retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getPerformanceTrendsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/student-management/transcripts/{studentId}/trends',
  handler: asyncHandler(StudentManagementController.getPerformanceTrends),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Academic Records', 'v1'],
    description: 'Analyze academic performance trends for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Analyzes academic performance over time including GPA trends, subject performance patterns, and attendance correlation. Provides insights for intervention planning.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Performance trends analyzed successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found or insufficient data' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * GRADE TRANSITION ROUTES
 */

const performBulkGradeTransitionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/grade-transitions/bulk',
  handler: asyncHandler(StudentManagementController.performBulkGradeTransition),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Administration', 'v1'],
    description: 'Perform bulk grade transition for end of school year',
    notes: 'Processes grade level transitions for all eligible students. Includes promotion criteria validation, retention decisions, and graduation processing. Can be run in dry-run mode for testing. Requires ADMIN role.',
    validate: {
      payload: gradeTransitionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Bulk grade transition completed successfully' },
          '400': { description: 'Validation error or transition criteria not met' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires ADMIN role' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getGraduatingStudentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/student-management/graduating-students',
  handler: asyncHandler(StudentManagementController.getGraduatingStudents),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Administration', 'v1'],
    description: 'Get list of students eligible for graduation',
    notes: 'Returns students who meet graduation requirements including credit requirements, assessment scores, and attendance thresholds. Used for graduation planning and ceremonies.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Graduating students list retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * BARCODE SCANNING ROUTES
 */

const scanBarcodeRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/barcode/scan',
  handler: asyncHandler(StudentManagementController.scanBarcode),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Barcode', 'v1'],
    description: 'Scan and decode barcode for student/medication identification',
    notes: 'Scans various barcode formats (Code 128, QR, Data Matrix) to identify students, medications, or equipment. Returns decoded information and associated records. Used for quick identification and medication administration.',
    validate: {
      payload: barcodeScanSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Barcode scanned and decoded successfully' },
          '400': { description: 'Invalid barcode format or unrecognized code' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Barcode not found in system' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const verifyMedicationAdministrationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/barcode/verify-medication',
  handler: asyncHandler(StudentManagementController.verifyMedicationAdministration),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Barcode', 'Medications', 'v1'],
    description: 'Verify medication administration using three-point barcode verification',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Implements five rights of medication administration using barcode verification: Right Patient (student barcode), Right Medication (medication barcode), and Right Person (nurse barcode). Critical safety feature for medication administration.',
    validate: {
      payload: barcodeVerificationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication administration verified successfully' },
          '400': { description: 'Verification failed - barcode mismatch or safety violation' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' },
          '404': { description: 'Student, medication, or nurse not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * WAITLIST MANAGEMENT ROUTES
 */

const addToWaitlistRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/student-management/waitlist',
  handler: asyncHandler(StudentManagementController.addToWaitlist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Appointments', 'v1'],
    description: 'Add student to appointment waitlist',
    notes: 'Adds student to waitlist for specific appointment types when no immediate slots are available. Includes priority levels and automatic notification when slots become available.',
    validate: {
      payload: waitlistSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Student added to waitlist successfully' },
          '400': { description: 'Validation error or student already on waitlist' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getWaitlistStatusRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/student-management/waitlist/{studentId}',
  handler: asyncHandler(StudentManagementController.getWaitlistStatus),
  options: {
    auth: 'jwt',
    tags: ['api', 'Student Management', 'Operations', 'Appointments', 'v1'],
    description: 'Get waitlist status for student',
    notes: 'Returns current waitlist positions and estimated wait times for all appointment types the student is waitlisted for.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Waitlist status retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * EXPORT ALL ROUTES
 */

export const studentManagementRoutes: ServerRoute[] = [
  // Student Photo Management (2 routes)
  uploadStudentPhotoRoute,
  searchStudentByPhotoRoute,

  // Academic Transcripts (3 routes)
  importAcademicTranscriptRoute,
  getAcademicHistoryRoute,
  getPerformanceTrendsRoute,

  // Grade Transitions (2 routes)
  performBulkGradeTransitionRoute,
  getGraduatingStudentsRoute,

  // Barcode Scanning (2 routes)
  scanBarcodeRoute,
  verifyMedicationAdministrationRoute,

  // Waitlist Management (2 routes)
  addToWaitlistRoute,
  getWaitlistStatusRoute
];
