/**
 * LOC: VALIDATION-API-001
 * WC-RTE-VAL-001 | Validation API Routes
 *
 * Purpose: API endpoints for real-time validation (email uniqueness, student ID uniqueness, etc.)
 * Supports frontend form validation with debounced API calls
 */

import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { User, Student } from '../database/models';
import { auth, ExpressAuthRequest as AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Check if email is unique
 * GET /api/users/check-email?email=test@example.com&excludeId=123
 */
router.get('/users/check-email', [
  query('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  query('excludeId')
    .optional()
    .isString()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, excludeId } = req.query;

    // Build query conditions
    const whereConditions: any = {
      email: (email as string).toLowerCase()
    };

    // Exclude specific user ID if updating existing user
    if (excludeId) {
      whereConditions.id = { [Op.ne]: excludeId };
    }

    // Check if email exists
    const existingUser = await User.findOne({
      where: whereConditions,
      attributes: ['id', 'email']
    });

    const isUnique = !existingUser;

    logger.debug('Email uniqueness check', {
      email,
      excludeId,
      isUnique
    });

    return res.json({
      success: true,
      isUnique,
      ...(existingUser && {
        message: 'Email is already registered'
      })
    });
  } catch (error) {
    logger.error('Email uniqueness check failed', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to check email uniqueness' }
    });
  }
});

/**
 * Check if student ID is unique
 * GET /api/students/check-id?studentId=S12345&excludeId=123
 */
router.get('/students/check-id', [
  auth, // Requires authentication
  query('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isString()
    .trim(),
  query('excludeId')
    .optional()
    .isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { studentId, excludeId } = req.query;

    // Build query conditions
    const whereConditions: any = {
      studentId: (studentId as string).toUpperCase()
    };

    // Exclude specific student ID if updating existing student
    if (excludeId) {
      whereConditions.id = { [Op.ne]: excludeId };
    }

    // Check if student ID exists
    const existingStudent = await Student.findOne({
      where: whereConditions,
      attributes: ['id', 'studentId', 'firstName', 'lastName']
    });

    const isUnique = !existingStudent;

    logger.debug('Student ID uniqueness check', {
      studentId,
      excludeId,
      isUnique,
      checkedBy: req.user?.userId
    });

    return res.json({
      success: true,
      isUnique,
      ...(existingStudent && {
        message: `Student ID is already assigned to ${existingStudent.firstName} ${existingStudent.lastName}`,
        existingStudent: {
          id: existingStudent.id,
          name: `${existingStudent.firstName} ${existingStudent.lastName}`
        }
      })
    });
  } catch (error) {
    logger.error('Student ID uniqueness check failed', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to check student ID uniqueness' }
    });
  }
});

/**
 * Check if username is unique
 * GET /api/users/check-username?username=jdoe&excludeId=123
 */
router.get('/users/check-username', [
  query('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  query('excludeId')
    .optional()
    .isString()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, excludeId } = req.query;

    const whereConditions: any = {
      username: (username as string).toLowerCase()
    };

    if (excludeId) {
      whereConditions.id = { [Op.ne]: excludeId };
    }

    const existingUser = await User.findOne({
      where: whereConditions,
      attributes: ['id', 'username']
    });

    const isUnique = !existingUser;

    logger.debug('Username uniqueness check', {
      username,
      excludeId,
      isUnique
    });

    return res.json({
      success: true,
      isUnique,
      ...(existingUser && {
        message: 'Username is already taken'
      })
    });
  } catch (error) {
    logger.error('Username uniqueness check failed', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to check username uniqueness' }
    });
  }
});

/**
 * Check if medical record number is unique (within school)
 * GET /api/students/check-medical-record?mrn=MRN12345&schoolId=school-1&excludeId=123
 */
router.get('/students/check-medical-record', [
  auth,
  query('mrn')
    .notEmpty()
    .withMessage('Medical record number is required')
    .isString()
    .trim(),
  query('schoolId')
    .optional()
    .isString(),
  query('excludeId')
    .optional()
    .isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { mrn, schoolId, excludeId } = req.query;

    const whereConditions: any = {
      medicalRecordNumber: (mrn as string).toUpperCase()
    };

    if (schoolId) {
      whereConditions.schoolId = schoolId;
    }

    if (excludeId) {
      whereConditions.id = { [Op.ne]: excludeId };
    }

    const existingStudent = await Student.findOne({
      where: whereConditions,
      attributes: ['id', 'medicalRecordNumber', 'firstName', 'lastName']
    });

    const isUnique = !existingStudent;

    logger.debug('Medical record number uniqueness check', {
      mrn,
      schoolId,
      excludeId,
      isUnique,
      checkedBy: req.user?.userId
    });

    return res.json({
      success: true,
      isUnique,
      ...(existingStudent && {
        message: `Medical record number is already assigned`,
        existingStudent: {
          id: existingStudent.id,
          name: `${existingStudent.firstName} ${existingStudent.lastName}`
        }
      })
    });
  } catch (error) {
    logger.error('Medical record number uniqueness check failed', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to check medical record number uniqueness' }
    });
  }
});

/**
 * Batch validation endpoint
 * POST /api/validation/batch
 * Body: {
 *   validations: [
 *     { type: 'email', value: 'test@example.com', excludeId: '123' },
 *     { type: 'studentId', value: 'S12345' }
 *   ]
 * }
 */
router.post('/validation/batch', [
  auth
], async (req: AuthRequest, res: Response) => {
  try {
    const { validations } = req.body;

    if (!Array.isArray(validations)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validations must be an array' }
      });
    }

    const results = [];

    for (const validation of validations) {
      const { type, value, excludeId } = validation;
      let isUnique = true;
      let message = '';

      try {
        switch (type) {
          case 'email':
            const userByEmail = await User.findOne({
              where: {
                email: value.toLowerCase(),
                ...(excludeId && { id: { [Op.ne]: excludeId } })
              }
            });
            isUnique = !userByEmail;
            if (!isUnique) message = 'Email is already registered';
            break;

          case 'studentId':
            // TODO: Fix field name - currently disabled due to model mismatch
            isUnique = true;
            message = 'Student ID validation temporarily disabled';
            break;

          case 'username':
            // TODO: Fix field name - currently disabled due to model mismatch
            isUnique = true;
            message = 'Username validation temporarily disabled';
            break;

          default:
            message = 'Unknown validation type';
        }
      } catch (error) {
        logger.error(`Batch validation error for ${type}:`, error);
        message = 'Validation check failed';
      }

      results.push({
        type,
        value,
        isUnique,
        message
      });
    }

    logger.debug('Batch validation completed', {
      count: validations.length,
      userId: req.user?.userId
    });

    return res.json({
      success: true,
      results
    });
  } catch (error) {
    logger.error('Batch validation failed', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to perform batch validation' }
    });
  }
});

export default router;
