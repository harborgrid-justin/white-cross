import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { StudentService } from '../services/studentService';

const router = Router();

// Get all students
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const filters: any = {};
    if (req.query.search) filters.search = req.query.search as string;
    if (req.query.grade) filters.grade = req.query.grade as string;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
    if (req.query.nurseId) filters.nurseId = req.query.nurseId as string;
    if (req.query.hasAllergies !== undefined) filters.hasAllergies = req.query.hasAllergies === 'true';
    if (req.query.hasMedications !== undefined) filters.hasMedications = req.query.hasMedications === 'true';

    const result = await StudentService.getStudents(page, limit, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get student by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id);

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    if ((error as Error).message === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create new student
router.post('/', [
  auth,
  body('studentNumber').notEmpty().trim(),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('dateOfBirth').isISO8601(),
  body('grade').notEmpty().trim(),
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

    const student = await StudentService.createStudent({
      ...req.body,
      dateOfBirth: new Date(req.body.dateOfBirth)
    });

    res.status(201).json({
      success: true,
      data: { student }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Update student
router.put('/:id', [
  auth,
  body('studentNumber').optional().trim(),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('grade').optional().trim(),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  body('isActive').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const student = await StudentService.updateStudent(id, updateData);

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    if (errorMessage.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Delete student (deactivate)
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await StudentService.deactivateStudent(id);

    res.json({
      success: true,
      message: 'Student deactivated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Transfer student to different nurse
router.put('/:id/transfer', [
  auth,
  body('nurseId').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { nurseId } = req.body;
    
    const student = await StudentService.transferStudent(id, nurseId);

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get students by grade
router.get('/grade/:grade', auth, async (req: Request, res: Response) => {
  try {
    const { grade } = req.params;
    const students = await StudentService.getStudentsByGrade(grade);

    res.json({
      success: true,
      data: { students }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Search students
router.get('/search/:query', auth, async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const students = await StudentService.searchStudents(query);

    res.json({
      success: true,
      data: { students }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;