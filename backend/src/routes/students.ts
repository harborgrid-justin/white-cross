import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const students = await prisma.student.findMany({
      skip,
      take: limit,
      include: {
        emergencyContacts: true,
        medications: {
          include: {
            medication: true
          }
        },
        allergies: true,
        nurse: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    const total = await prisma.student.count();

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Get student by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        medications: {
          include: {
            medication: true,
            logs: {
              include: {
                nurse: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              },
              orderBy: {
                timeGiven: 'desc'
              }
            }
          }
        },
        healthRecords: {
          orderBy: {
            date: 'desc'
          }
        },
        allergies: true,
        appointments: {
          include: {
            nurse: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            scheduledAt: 'desc'
          }
        },
        incidentReports: {
          include: {
            reportedBy: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            occurredAt: 'desc'
          }
        },
        nurse: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    res.json({
      success: true,
      data: { student }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Create new student
router.post('/', [
  auth,
  body('studentNumber').notEmpty(),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('dateOfBirth').isISO8601(),
  body('grade').notEmpty(),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const studentData = req.body;

    // Check if student number already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentNumber: studentData.studentNumber }
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        error: { message: 'Student number already exists' }
      });
    }

    const student = await prisma.student.create({
      data: {
        ...studentData,
        dateOfBirth: new Date(studentData.dateOfBirth)
      },
      include: {
        emergencyContacts: true,
        allergies: true
      }
    });

    res.status(201).json({
      success: true,
      data: { student }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        emergencyContacts: true,
        allergies: true
      }
    });

    res.json({
      success: true,
      data: { student }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.student.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Student deactivated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

export default router;