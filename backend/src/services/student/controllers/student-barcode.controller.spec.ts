/**
 * @fileoverview Student Barcode Controller Tests
 * @module student/controllers/student-barcode.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentBarcodeController } from './student-barcode.controller';
import { StudentService } from '../student.service';
import { GenerateBarcodeDto } from '../dto/generate-barcode.dto';
import { VerifyBarcodeDto } from '../dto/verify-barcode.dto';

describe('StudentBarcodeController', () => {
  let controller: StudentBarcodeController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const mockStudentService = {
      generateStudentBarcode: jest.fn(),
      verifyStudentBarcode: jest.fn(),
      getStudentBarcodeInfo: jest.fn(),
      deactivateStudentBarcode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentBarcodeController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentBarcodeController>(StudentBarcodeController);
    studentService = module.get(StudentService);
  });

  describe('generateBarcode', () => {
    it('should generate barcode successfully', async () => {
      const generateDto: GenerateBarcodeDto = {
        barcodeType: 'CODE128',
        includePhoto: true,
      };

      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        barcode: '1234567890',
        barcodeType: 'CODE128',
        generatedAt: new Date(),
      };

      studentService.generateStudentBarcode.mockResolvedValue(mockResponse);

      const result = await controller.generateBarcode(mockStudentId, generateDto);

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.barcode).toBeDefined();
      expect(studentService.generateStudentBarcode).toHaveBeenCalledWith(mockStudentId, generateDto);
    });

    it('should handle barcode generation errors', async () => {
      const generateDto: GenerateBarcodeDto = { barcodeType: 'CODE128' };
      studentService.generateStudentBarcode.mockRejectedValue(new Error('Generation failed'));

      await expect(controller.generateBarcode(mockStudentId, generateDto)).rejects.toThrow(
        'Generation failed',
      );
    });
  });

  describe('verifyBarcode', () => {
    it('should verify barcode successfully', async () => {
      const verifyDto: VerifyBarcodeDto = {
        barcode: '1234567890',
      };

      const mockResponse = {
        success: true,
        valid: true,
        studentId: mockStudentId,
        studentName: 'John Doe',
        studentNumber: 'STU001',
        grade: '10',
        photo: 'photo-url',
      };

      studentService.verifyStudentBarcode.mockResolvedValue(mockResponse);

      const result = await controller.verifyBarcode(verifyDto);

      expect(result).toEqual(mockResponse);
      expect(result.valid).toBe(true);
      expect(result.studentId).toBe(mockStudentId);
      expect(studentService.verifyStudentBarcode).toHaveBeenCalledWith(verifyDto);
    });

    it('should return invalid for non-existent barcode', async () => {
      const verifyDto: VerifyBarcodeDto = {
        barcode: 'invalid-barcode',
      };

      const mockResponse = {
        success: true,
        valid: false,
        message: 'Barcode not found',
      };

      studentService.verifyStudentBarcode.mockResolvedValue(mockResponse);

      const result = await controller.verifyBarcode(verifyDto);

      expect(result.valid).toBe(false);
    });

    it('should handle verification errors', async () => {
      const verifyDto: VerifyBarcodeDto = { barcode: '1234567890' };
      studentService.verifyStudentBarcode.mockRejectedValue(new Error('Verification failed'));

      await expect(controller.verifyBarcode(verifyDto)).rejects.toThrow('Verification failed');
    });
  });

  describe('getBarcodeInfo', () => {
    it('should retrieve barcode information successfully', async () => {
      const mockInfo = {
        success: true,
        studentId: mockStudentId,
        barcode: '1234567890',
        barcodeType: 'CODE128',
        generatedAt: new Date('2024-01-01'),
        isActive: true,
        usageCount: 150,
      };

      studentService.getStudentBarcodeInfo.mockResolvedValue(mockInfo);

      const result = await controller.getBarcodeInfo(mockStudentId);

      expect(result).toEqual(mockInfo);
      expect(result.barcode).toBe('1234567890');
      expect(result.isActive).toBe(true);
      expect(studentService.getStudentBarcodeInfo).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle student with no barcode', async () => {
      studentService.getStudentBarcodeInfo.mockRejectedValue(new Error('No barcode found'));

      await expect(controller.getBarcodeInfo(mockStudentId)).rejects.toThrow('No barcode found');
    });
  });

  describe('deactivateBarcode', () => {
    it('should deactivate barcode successfully', async () => {
      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        barcode: '1234567890',
        deactivatedAt: new Date(),
        reason: 'Lost card',
      };

      studentService.deactivateStudentBarcode.mockResolvedValue(mockResponse);

      const result = await controller.deactivateBarcode(mockStudentId);

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(studentService.deactivateStudentBarcode).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle deactivation errors', async () => {
      studentService.deactivateStudentBarcode.mockRejectedValue(new Error('Deactivation failed'));

      await expect(controller.deactivateBarcode(mockStudentId)).rejects.toThrow(
        'Deactivation failed',
      );
    });
  });
});
