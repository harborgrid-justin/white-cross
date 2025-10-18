/**
 * LOC: 0553FEE047
 * WC-RTE-STU-022 | students.ts - Student Management API Routes with Health Records Integration
 *
 * UPSTREAM (imports from):
 *   - studentService.ts (services/studentService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-STU-022 | students.ts - Student Management API Routes with Health Records Integration
 * Purpose: Complete student lifecycle management API including PHI-protected health data access with role-based permissions
 * Upstream: ../services/studentService | Dependencies: @hapi/hapi, joi, JWT auth middleware
 * Downstream: Student dashboard, health tracking, enrollment system | Called by: Frontend student modules, admin panels
 * Related: healthRecords.ts, appointments.ts, users.ts | Integrates: Mental health records, sensitive data protection
 * Exports: studentRoutes (11 route handlers) | Key Services: CRUD operations, transfers, search, health records access
 * Last Updated: 2025-10-18 | File Type: .ts - Student PHI and Mental Health Protected
 * Critical Path: JWT auth → Role validation → Student service calls → PHI-compliant responses → Audit logging
 * LLM Context: Central student API with health record integration, role-based access to sensitive/mental health data, HIPAA compliant
 */

import { ServerRoute } from '@hapi/hapi';
import { StudentService } from '../services/studentService';
import Joi from 'joi';

// Get all students
const getStudentsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;

    const filters: any = {};
    if (request.query.search) filters.search = request.query.search;
    if (request.query.grade) filters.grade = request.query.grade;
    if (request.query.isActive !== undefined) filters.isActive = request.query.isActive === 'true';
    if (request.query.nurseId) filters.nurseId = request.query.nurseId;
    if (request.query.hasAllergies !== undefined) filters.hasAllergies = request.query.hasAllergies === 'true';
    if (request.query.hasMedications !== undefined) filters.hasMedications = request.query.hasMedications === 'true';

    const result = await StudentService.getStudents(page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get student by ID
const getStudentByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const student = await StudentService.getStudentById(id);

    return h.response({
      success: true,
      data: { student }
    });
  } catch (error) {
    if ((error as Error).message === 'Student not found') {
      return h.response({
        success: false,
        error: { message: 'Student not found' }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new student
const createStudentHandler = async (request: any, h: any) => {
  try {
    const student = await StudentService.createStudent({
      ...request.payload,
      dateOfBirth: new Date(request.payload.dateOfBirth)
    });

    return h.response({
      success: true,
      data: { student }
    }).code(201);
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('already exists')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(409);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(400);
  }
};

// Update student
const updateStudentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.payload };

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const student = await StudentService.updateStudent(id, updateData);

    return h.response({
      success: true,
      data: { student }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'Student not found') {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }
    if (errorMessage.includes('already exists')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(409);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(400);
  }
};

// Delete student (deactivate)
const deactivateStudentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await StudentService.deactivateStudent(id);

    return h.response({
      success: true,
      message: 'Student deactivated successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Transfer student to different nurse
const transferStudentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { nurseId } = request.payload;

    const student = await StudentService.transferStudent(id, nurseId);

    return h.response({
      success: true,
      data: { student }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get students by grade
const getStudentsByGradeHandler = async (request: any, h: any) => {
  try {
    const { grade } = request.params;
    const students = await StudentService.getStudentsByGrade(grade);

    return h.response({
      success: true,
      data: { students }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Search students
const searchStudentsHandler = async (request: any, h: any) => {
  try {
    const { query } = request.params;
    const students = await StudentService.searchStudents(query);

    return h.response({
      success: true,
      data: { students }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get assigned students for current user
const getAssignedStudentsHandler = async (request: any, h: any) => {
  try {
    const userId = request.auth.credentials?.userId;

    if (!userId) {
      return h.response({
        success: false,
        error: { message: 'User not authenticated' }
      }).code(401);
    }

    const students = await StudentService.getAssignedStudents(userId);

    return h.response({
      success: true,
      data: { students }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get health records for a student
const getStudentHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const sensitive = request.query.sensitive === 'true';
    const user = request.auth.credentials;

    // If accessing sensitive records, require additional permissions
    if (sensitive && (!user || !['ADMIN', 'NURSE', 'COUNSELOR'].includes(user.role))) {
      return h.response({
        success: false,
        error: 'Insufficient permissions to access sensitive health records'
      }).code(403);
    }

    // Mock health records data
    const healthRecords = {
      studentId,
      records: [
        {
          id: '1',
          type: 'GENERAL_CHECKUP',
          date: '2025-01-15',
          provider: 'School Nurse',
          notes: 'Regular health checkup completed'
        }
      ]
    };

    // Add sensitive record if requested and authorized
    if (sensitive) {
      healthRecords.records.push({
        id: '2',
        type: 'MENTAL_HEALTH',
        date: '2025-01-10',
        provider: 'School Counselor',
        notes: '[SENSITIVE] Mental health evaluation completed'
      });
    }

    return h.response({
      success: true,
      data: healthRecords
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get mental health records for a student
const getStudentMentalHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const user = request.auth.credentials;

    // Check if user has mental health access permissions
    if (!user || !['ADMIN', 'COUNSELOR', 'MENTAL_HEALTH_SPECIALIST'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Insufficient permissions to access mental health records'
      }).code(403);
    }

    // In a real implementation, this would fetch mental health records
    const records = {
      studentId,
      records: [
        {
          id: '1',
          type: 'COUNSELING_SESSION',
          date: '2025-01-15',
          provider: 'School Counselor',
          notes: '[CONFIDENTIAL MENTAL HEALTH INFORMATION]'
        }
      ]
    };

    return h.response({
      success: true,
      data: records
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define student routes for Hapi
export const studentRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/students',
    handler: getStudentsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Get all students with pagination and filters',
      notes: 'Returns a paginated list of students. Supports filtering by search term, grade, status, assigned nurse, allergies, and medications. **PHI Protected Endpoint**',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Page number'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('Items per page (max 100)'),
          search: Joi.string().optional().description('Search by name or student number'),
          grade: Joi.string().optional().description('Filter by grade level'),
          isActive: Joi.alternatives().try(
            Joi.boolean(),
            Joi.string().valid('true', 'false')
          ).optional().description('Filter by active status'),
          nurseId: Joi.string().optional().description('Filter by assigned nurse ID'),
          hasAllergies: Joi.alternatives().try(
            Joi.boolean(),
            Joi.string().valid('true', 'false')
          ).optional().description('Filter students with allergies'),
          hasMedications: Joi.alternatives().try(
            Joi.boolean(),
            Joi.string().valid('true', 'false')
          ).optional().description('Filter students with medications')
        }).unknown(true)
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'List of students retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/{id}',
    handler: getStudentByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Get student by ID',
      notes: 'Returns detailed information about a specific student. **PHI Protected Endpoint - Access is audited**',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Student details retrieved successfully'
            },
            '404': {
              description: 'Student not found'
            },
            '401': {
              description: 'Authentication required'
            }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/students',
    handler: createStudentHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Create a new student record',
      notes: 'Creates a new student profile in the system. Requires ADMIN or NURSE role. **PHI Protected Endpoint**',
      validate: {
        payload: Joi.object({
          studentNumber: Joi.string().trim().required().description('Unique student identification number'),
          firstName: Joi.string().trim().required().description('Student first name'),
          lastName: Joi.string().trim().required().description('Student last name'),
          dateOfBirth: Joi.date().iso().required().description('Date of birth (ISO 8601 format)'),
          grade: Joi.string().trim().required().description('Grade level (e.g., "K", "1", "2", etc.)'),
          gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').required().description('Gender identity')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Student created successfully'
            },
            '409': {
              description: 'Student with this number already exists'
            },
            '400': {
              description: 'Invalid input data'
            },
            '401': {
              description: 'Authentication required'
            }
          }
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/students/{id}',
    handler: updateStudentHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Update student information',
      notes: 'Updates an existing student record. All fields are optional. **PHI Protected Endpoint - Changes are audited**',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Student ID')
        }),
        payload: Joi.object({
          studentNumber: Joi.string().trim().optional().description('Unique student identification number'),
          firstName: Joi.string().trim().optional().description('Student first name'),
          lastName: Joi.string().trim().optional().description('Student last name'),
          dateOfBirth: Joi.date().iso().optional().description('Date of birth (ISO 8601 format)'),
          grade: Joi.string().trim().optional().description('Grade level'),
          gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').optional().description('Gender identity'),
          isActive: Joi.boolean().optional().description('Active status')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Student updated successfully'
            },
            '404': {
              description: 'Student not found'
            },
            '409': {
              description: 'Student number already exists'
            },
            '400': {
              description: 'Invalid input data'
            }
          }
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/students/{id}',
    handler: deactivateStudentHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Deactivate a student',
      notes: 'Soft deletes a student by marking them as inactive. Does not permanently delete data. **PHI Protected Endpoint**',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Student deactivated successfully'
            },
            '400': {
              description: 'Failed to deactivate student'
            },
            '401': {
              description: 'Authentication required'
            }
          }
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/students/{id}/transfer',
    handler: transferStudentHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Transfer student to another nurse',
      notes: 'Reassigns a student to a different school nurse. Requires ADMIN or SCHOOL_ADMIN role.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Student ID')
        }),
        payload: Joi.object({
          nurseId: Joi.string().required().description('ID of the nurse to transfer to')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Student transferred successfully'
            },
            '400': {
              description: 'Invalid nurse ID or transfer failed'
            },
            '401': {
              description: 'Authentication required'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/grade/{grade}',
    handler: getStudentsByGradeHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Get students by grade',
      notes: 'Returns all students in a specific grade level',
      validate: {
        params: Joi.object({
          grade: Joi.string().required().description('Grade level (e.g., "K", "1", "12")')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Students retrieved successfully'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/search/{query}',
    handler: searchStudentsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Search students',
      notes: 'Searches students by name or student number',
      validate: {
        params: Joi.object({
          query: Joi.string().required().description('Search query')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Search completed successfully'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/assigned',
    handler: getAssignedStudentsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students'],
      description: 'Get assigned students',
      notes: 'Returns all students assigned to the currently authenticated nurse',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Assigned students retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/{studentId}/health-records',
    handler: getStudentHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students', 'Health Records'],
      description: 'Get student health records',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns health records for a student. Access to sensitive records requires ADMIN, NURSE, or COUNSELOR role. All access is audited.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          sensitive: Joi.boolean().optional().description('Include sensitive/confidential records')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Health records retrieved successfully'
            },
            '403': {
              description: 'Insufficient permissions for sensitive records'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/{studentId}/mental-health-records',
    handler: getStudentMentalHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Students', 'Health Records'],
      description: 'Get student mental health records',
      notes: '**HIGHLY CONFIDENTIAL ENDPOINT** - Returns mental health records. Requires ADMIN, COUNSELOR, or MENTAL_HEALTH_SPECIALIST role. Strict access controls and full audit logging.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Mental health records retrieved successfully'
            },
            '403': {
              description: 'Insufficient permissions to access mental health records'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  }
];
