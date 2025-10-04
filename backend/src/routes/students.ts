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
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10),
          search: Joi.string().optional(),
          grade: Joi.string().optional(),
          isActive: Joi.boolean().optional(),
          nurseId: Joi.string().optional(),
          hasAllergies: Joi.boolean().optional(),
          hasMedications: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/{id}',
    handler: getStudentByIdHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/students',
    handler: createStudentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentNumber: Joi.string().trim().required(),
          firstName: Joi.string().trim().required(),
          lastName: Joi.string().trim().required(),
          dateOfBirth: Joi.date().iso().required(),
          grade: Joi.string().trim().required(),
          gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/students/{id}',
    handler: updateStudentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentNumber: Joi.string().trim().optional(),
          firstName: Joi.string().trim().optional(),
          lastName: Joi.string().trim().optional(),
          dateOfBirth: Joi.date().iso().optional(),
          grade: Joi.string().trim().optional(),
          gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/students/{id}',
    handler: deactivateStudentHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'PUT',
    path: '/api/students/{id}/transfer',
    handler: transferStudentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          nurseId: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/grade/{grade}',
    handler: getStudentsByGradeHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/students/search/{query}',
    handler: searchStudentsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/students/assigned',
    handler: getAssignedStudentsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/students/{studentId}/health-records',
    handler: getStudentHealthRecordsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          sensitive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/{studentId}/mental-health-records',
    handler: getStudentMentalHealthRecordsHandler,
    options: {
      auth: 'jwt'
    }
  }
];
