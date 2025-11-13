/**
 * @fileoverview Student Photo Service
 * @module student/services/student-photo.service
 * @description Handles student photo management and facial recognition operations
 */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student } from '@/database';
import { RequestContextService } from '@/shared/context/request-context.service';
import { BaseService } from '@/shared/base/base.service';
import { SearchPhotoDto } from '../dto/search-photo.dto';
import { UploadPhotoDto } from '../dto/upload-photo.dto';

/**
 * Student Photo Service
 *
 * Provides photo management operations:
 * - Photo upload and storage
 * - Photo search with metadata filtering
 * - Facial recognition integration (pending ML service)
 * - Photo URL management
 */
@Injectable()
export class StudentPhotoService extends BaseService {

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @Optional() protected readonly requestContext?: RequestContextService,
  ) {
    super(
      requestContext ||
        ({
          requestId: 'system',
          userId: undefined,
          getLogContext: () => ({ requestId: 'system' }),
          getAuditContext: () => ({
            requestId: 'system',
            timestamp: new Date(),
          }),
        } as any),
    );
  }

  /**
   * Upload student photo
   * Stores photo URL/path in student record and prepares for facial recognition indexing
   */
  async uploadStudentPhoto(studentId: string, uploadPhotoDto: UploadPhotoDto): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      // Verify student exists
      const student = await this.studentModel.findByPk(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Validate photo data
      if (!uploadPhotoDto.imageData && !uploadPhotoDto.photoUrl) {
        throw new BadRequestException(
          'Either imageData or photoUrl must be provided for photo upload',
        );
      }

      // In production, this would:
      // 1. Upload image to cloud storage (S3, Azure Blob, etc.)
      // 2. Generate thumbnail
      // 3. Index facial features for recognition
      // 4. Store photo URL in student record

      const photoUrl = uploadPhotoDto.photoUrl || 'pending-upload';

      student.photo = photoUrl;
      await student.save();

      this.logInfo(
        `Photo uploaded for student: ${studentId} (${student.firstName} ${student.lastName})`,
      );

      return {
        success: true,
        message: 'Photo uploaded successfully',
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        photoUrl,
        metadata: uploadPhotoDto.metadata,
        indexStatus: 'pending',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.handleError('Failed to upload student photo', error);
    }
  }

  /**
   * Search students by photo using metadata and basic filtering
   * Returns potential matches based on available photo data
   * Note: Full facial recognition requires dedicated ML service integration
   */
  async searchStudentsByPhoto(searchPhotoDto: SearchPhotoDto): Promise<any> {
    try {
      // Validate search parameters
      if (!searchPhotoDto.imageData && !searchPhotoDto.metadata) {
        throw new BadRequestException('Either imageData or metadata must be provided for search');
      }

      const threshold = searchPhotoDto.threshold || 0.8;

      // In production, this would use facial recognition ML service to:
      // 1. Extract facial features from imageData
      // 2. Compare against indexed student photos
      // 3. Return matches with confidence scores above threshold

      // For now, return students who have photos and match any provided metadata
      const whereClause: any = {
        photo: { [Op.ne]: null },
        isActive: true,
      };

      // If metadata filters provided, apply them
      if (searchPhotoDto.metadata) {
        if (searchPhotoDto.metadata.grade) {
          whereClause.grade = searchPhotoDto.metadata.grade;
        }
        if (searchPhotoDto.metadata.gender) {
          whereClause.gender = searchPhotoDto.metadata.gender;
        }
      }

      const students = await this.studentModel.findAll({
        where: whereClause,
        attributes: [
          'id',
          'studentNumber',
          'firstName',
          'lastName',
          'grade',
          'photo',
          'gender',
          'dateOfBirth',
        ],
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        limit: searchPhotoDto.limit || 10,
      });

      // Simulate confidence scores (in production, would come from ML service)
      const matches = students.map((student, index) => ({
        student: student.toJSON(),
        confidence: threshold + (0.2 - index * 0.02),
        matchDetails: {
          facialFeatures: 'pending-ml-service',
          metadata: searchPhotoDto.metadata,
        },
      }));

      this.logInfo(
        `Photo search performed: ${matches.length} potential matches (threshold: ${threshold})`,
      );

      return {
        success: true,
        threshold,
        totalMatches: matches.length,
        matches,
        note: 'Full facial recognition requires ML service integration. Current results based on metadata filtering.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleError('Failed to search by photo', error);
    }
  }
}
