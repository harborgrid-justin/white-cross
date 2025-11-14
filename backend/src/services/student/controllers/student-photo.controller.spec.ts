/**
 * @fileoverview Student Photo Controller Tests
 * @module student/controllers/student-photo.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentPhotoController } from './student-photo.controller';
import { StudentService } from '../student.service';
import { UploadPhotoDto } from '../dto/upload-photo.dto';
import { SearchPhotoDto } from '../dto/search-photo.dto';

describe('StudentPhotoController', () => {
  let controller: StudentPhotoController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const mockStudentService = {
      uploadStudentPhoto: jest.fn(),
      searchStudentsByPhoto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentPhotoController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentPhotoController>(StudentPhotoController);
    studentService = module.get(StudentService);
  });

  describe('uploadPhoto', () => {
    it('should upload student photo successfully', async () => {
      const uploadDto: UploadPhotoDto = {
        photoData: 'base64-encoded-image',
        format: 'jpeg',
      };

      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        photoUrl: 'https://example.com/photo.jpg',
        uploadedAt: new Date(),
      };

      studentService.uploadStudentPhoto.mockResolvedValue(mockResponse);

      const result = await controller.uploadPhoto(mockStudentId, uploadDto);

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(studentService.uploadStudentPhoto).toHaveBeenCalledWith(mockStudentId, uploadDto);
    });

    it('should handle photo upload errors', async () => {
      const uploadDto: UploadPhotoDto = { photoData: 'invalid-data', format: 'jpeg' };
      studentService.uploadStudentPhoto.mockRejectedValue(new Error('Upload failed'));

      await expect(controller.uploadPhoto(mockStudentId, uploadDto)).rejects.toThrow('Upload failed');
    });
  });

  describe('searchByPhoto', () => {
    it('should search students by photo successfully', async () => {
      const searchDto: SearchPhotoDto = {
        photoData: 'base64-encoded-image',
        minConfidence: 0.8,
      };

      const mockResponse = {
        success: true,
        matches: [
          {
            studentId: mockStudentId,
            studentName: 'John Doe',
            confidence: 0.95,
            photo: 'photo-url',
          },
        ],
      };

      studentService.searchStudentsByPhoto.mockResolvedValue(mockResponse);

      const result = await controller.searchByPhoto(searchDto);

      expect(result).toEqual(mockResponse);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].confidence).toBe(0.95);
      expect(studentService.searchStudentsByPhoto).toHaveBeenCalledWith(searchDto);
    });

    it('should return empty matches when no students found', async () => {
      const searchDto: SearchPhotoDto = { photoData: 'base64-data', minConfidence: 0.9 };
      studentService.searchStudentsByPhoto.mockResolvedValue({ success: true, matches: [] });

      const result = await controller.searchByPhoto(searchDto);

      expect(result.matches).toEqual([]);
    });

    it('should handle photo search errors', async () => {
      const searchDto: SearchPhotoDto = { photoData: 'invalid', minConfidence: 0.8 };
      studentService.searchStudentsByPhoto.mockRejectedValue(new Error('Search failed'));

      await expect(controller.searchByPhoto(searchDto)).rejects.toThrow('Search failed');
    });
  });
});
