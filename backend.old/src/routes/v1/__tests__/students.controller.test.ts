/**
 * STUDENTS CONTROLLER UNIT TESTS
 * Test suite for student management operations
 */

import { StudentsController } from '../operations/controllers/students.controller';
import { StudentService } from '../../../services/student';

// Mock dependencies
jest.mock('../../../services/student');

describe('StudentsController', () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    mockRequest = {
      query: {},
      params: {},
      payload: {},
      auth: {
        credentials: {
          userId: 'nurse-123',
          email: 'nurse@example.com',
          role: 'NURSE'
        }
      }
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return paginated students list', async () => {
      mockRequest.query = { page: '1', limit: '10' };

      (StudentService.getStudents as jest.Mock).mockResolvedValue({
        students: [
          { id: '1', firstName: 'John', lastName: 'Doe', grade: '5' },
          { id: '2', firstName: 'Jane', lastName: 'Smith', grade: '6' }
        ],
        total: 50
      });

      await StudentsController.list(mockRequest, mockH);

      expect(StudentService.getStudents).toHaveBeenCalledWith(1, 10, {});
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ firstName: 'John' })
        ]),
        pagination: {
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5
        }
      });
    });

    it('should apply filters when provided', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
        grade: '5',
        hasAllergies: 'true',
        search: 'Smith'
      };

      (StudentService.getStudents as jest.Mock).mockResolvedValue({
        students: [],
        total: 0
      });

      await StudentsController.list(mockRequest, mockH);

      expect(StudentService.getStudents).toHaveBeenCalledWith(1, 10, {
        grade: '5',
        hasAllergies: true,
        search: 'Smith'
      });
    });
  });

  describe('getById', () => {
    it('should return student by ID', async () => {
      mockRequest.params = { id: 'student-123' };

      (StudentService.getStudentById as jest.Mock).mockResolvedValue({
        id: 'student-123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-05-15',
        grade: '5'
      });

      await StudentsController.getById(mockRequest, mockH);

      expect(StudentService.getStudentById).toHaveBeenCalledWith('student-123');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          student: expect.objectContaining({ firstName: 'John' })
        }
      });
    });
  });

  describe('create', () => {
    it('should create new student with date conversion', async () => {
      mockRequest.payload = {
        firstName: 'Emma',
        lastName: 'Johnson',
        dateOfBirth: '2012-03-20',
        grade: '3',
        gender: 'Female'
      };

      (StudentService.createStudent as jest.Mock).mockResolvedValue({
        id: 'student-456',
        firstName: 'Emma',
        lastName: 'Johnson'
      });

      await StudentsController.create(mockRequest, mockH);

      expect(StudentService.createStudent).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Emma',
          lastName: 'Johnson',
          dateOfBirth: expect.any(Date)
        })
      );
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('update', () => {
    it('should update student information', async () => {
      mockRequest.params = { id: 'student-123' };
      mockRequest.payload = {
        grade: '6',
        nurseId: 'nurse-456'
      };

      (StudentService.updateStudent as jest.Mock).mockResolvedValue({
        id: 'student-123',
        grade: '6',
        nurseId: 'nurse-456'
      });

      await StudentsController.update(mockRequest, mockH);

      expect(StudentService.updateStudent).toHaveBeenCalledWith('student-123', {
        grade: '6',
        nurseId: 'nurse-456'
      });
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          student: expect.objectContaining({ grade: '6' })
        }
      });
    });

    it('should convert dateOfBirth if provided', async () => {
      mockRequest.params = { id: 'student-123' };
      mockRequest.payload = {
        dateOfBirth: '2010-06-15'
      };

      (StudentService.updateStudent as jest.Mock).mockResolvedValue({
        id: 'student-123',
        dateOfBirth: new Date('2010-06-15')
      });

      await StudentsController.update(mockRequest, mockH);

      expect(StudentService.updateStudent).toHaveBeenCalledWith(
        'student-123',
        expect.objectContaining({
          dateOfBirth: expect.any(Date)
        })
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate student with reason', async () => {
      mockRequest.params = { id: 'student-123' };
      mockRequest.payload = {
        reason: 'Student transferred to different school district'
      };

      (StudentService.deactivateStudent as jest.Mock).mockResolvedValue({
        id: 'student-123',
        isActive: false,
        deactivatedAt: new Date()
      });

      await StudentsController.deactivate(mockRequest, mockH);

      expect(StudentService.deactivateStudent).toHaveBeenCalledWith(
        'student-123',
        'Student transferred to different school district'
      );
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          student: expect.objectContaining({ isActive: false })
        }
      });
    });
  });
});
