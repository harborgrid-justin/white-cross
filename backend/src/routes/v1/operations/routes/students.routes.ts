/**
 * Students Routes
 * HTTP endpoints for student management and health records access
 * All routes prefixed with /api/v1/students
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { StudentsController } from '../controllers/students.controller';
import {
  listStudentsQuerySchema,
  createStudentSchema,
  updateStudentSchema,
  deactivateStudentSchema,
  studentIdParamSchema,
  transferStudentSchema,
  gradeParamSchema,
  searchQueryParamSchema,
  healthRecordsQuerySchema
} from '../validators/students.validators';

/**
 * STUDENT CRUD ROUTES
 */

const listStudentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students',
  handler: asyncHandler(StudentsController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Get all students with pagination and filters',
    notes: '**PHI Protected Endpoint** - Returns paginated list of students. Supports filtering by grade, assigned nurse, active status, allergies, and medications. Search includes student name and ID. All access is audited.',
    validate: {
      query: listStudentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Students retrieved successfully with pagination' },
          '401': { description: 'Unauthorized - Authentication required' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getStudentRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students/{id}',
  handler: asyncHandler(StudentsController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Get student by ID',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns complete student information including demographics, emergency contacts, and health summary. Access is logged for HIPAA compliance.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const createStudentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/students',
  handler: asyncHandler(StudentsController.create),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Create new student',
    notes: '**PHI Protected Endpoint** - Enrolls a new student in the system. Requires admin or nurse role. Validates date of birth (cannot be future date), blood type format, and emergency contact information. Creates audit trail entry.',
    validate: {
      payload: createStudentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Student created successfully' },
          '400': { description: 'Validation error - Invalid student data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires ADMIN or NURSE role' },
          '409': { description: 'Conflict - Student with this ID already exists' }
        }
      }
    }
  }
};

const updateStudentRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/students/{id}',
  handler: asyncHandler(StudentsController.update),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Update student information',
    notes: '**PHI Protected Endpoint** - Updates student demographics, emergency contacts, or school assignment. Requires admin or assigned nurse role. All changes are logged for compliance. Does not modify health records (use health records endpoints).',
    validate: {
      params: studentIdParamSchema,
      payload: updateStudentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only update assigned students unless admin' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

const deactivateStudentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/students/{id}/deactivate',
  handler: asyncHandler(StudentsController.deactivate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Deactivate student',
    notes: '**PHI Protected Endpoint** - Soft-deletes a student (withdrawal, transfer, graduation). Requires detailed reason for audit trail. Does not delete historical health records - maintains complete history for compliance. Admin only.',
    validate: {
      params: studentIdParamSchema,
      payload: deactivateStudentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student deactivated successfully' },
          '400': { description: 'Validation error - Reason required' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

/**
 * STUDENT MANAGEMENT ROUTES
 */

const transferStudentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/students/{id}/transfer',
  handler: asyncHandler(StudentsController.transfer),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Transfer student to different nurse',
    notes: '**PHI Protected Endpoint** - Reassigns a student to a different nurse. Requires admin role. Creates audit trail entry for care handoff. Previous nurse retains read-only access to historical records.',
    validate: {
      params: studentIdParamSchema,
      payload: transferStudentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student transferred successfully' },
          '400': { description: 'Validation error - Invalid nurse ID' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Student or nurse not found' }
        }
      }
    }
  }
};

const getStudentsByGradeRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students/grade/{grade}',
  handler: asyncHandler(StudentsController.getByGrade),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Get students by grade',
    notes: '**PHI Protected Endpoint** - Returns all students in a specific grade level. Useful for grade-level health screenings and reports. Access is audited.',
    validate: {
      params: gradeParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Students retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'No students found for this grade' }
        }
      }
    }
  }
};

const searchStudentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students/search/{query}',
  handler: asyncHandler(StudentsController.search),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Search students by name or ID',
    notes: '**PHI Protected Endpoint** - Searches students by name (first/last) or student ID. Returns partial matches. Useful for quick student lookup in emergency situations.',
    validate: {
      params: searchQueryParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Search results returned successfully' },
          '400': { description: 'Validation error - Query must be at least 1 character' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getAssignedStudentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students/assigned',
  handler: asyncHandler(StudentsController.getAssigned),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Get students assigned to current nurse',
    notes: '**PHI Protected Endpoint** - Returns all students assigned to the authenticated nurse. Used for nurse dashboard and daily task list. Automatically filters by current user ID.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Assigned students retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Nurse role required' }
        }
      }
    }
  }
};

/**
 * STUDENT HEALTH RECORDS ACCESS ROUTES
 */

const getStudentHealthRecordsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students/{id}/health-records',
  handler: asyncHandler(StudentsController.getHealthRecords),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'Healthcare', 'v1'],
    description: 'Get student health records',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns paginated list of all health records for a student including medications, allergies, immunizations, and visit logs. Full audit trail maintained. Requires assigned nurse or admin access.',
    validate: {
      params: studentIdParamSchema,
      query: healthRecordsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Health records retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Must be assigned nurse or admin' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

const getStudentMentalHealthRecordsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students/{id}/mental-health-records',
  handler: asyncHandler(StudentsController.getMentalHealthRecords),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'Healthcare', 'MentalHealth', 'v1'],
    description: 'Get student mental health records',
    notes: '**EXTREMELY SENSITIVE PHI ENDPOINT** - Returns paginated mental health records including counseling sessions, behavioral assessments, and crisis interventions. Extra protection due to stigma concerns. Strict access control - mental health specialist or admin only. All access logged for compliance and ethical review.',
    validate: {
      params: studentIdParamSchema,
      query: healthRecordsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Mental health records retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Mental health specialist or admin role required' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const studentsRoutes: ServerRoute[] = [
  // CRUD operations
  listStudentsRoute,
  getStudentRoute,
  createStudentRoute,
  updateStudentRoute,
  deactivateStudentRoute,

  // Student management
  transferStudentRoute,
  getStudentsByGradeRoute,
  searchStudentsRoute,
  getAssignedStudentsRoute,

  // Health records access
  getStudentHealthRecordsRoute,
  getStudentMentalHealthRecordsRoute
];
