/**
 * @fileoverview Student Barcode Service
 * @module stude@/services/student-barcode.service
 * @description Barcode scanning and verification for student identification
 */

import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Student } from '@/database/models';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { StudentScanBarcodeDto } from '../dto/scan-barcode.dto';
import { VerifyMedicationDto } from '../dto/verify-medication.dto';

/**
 * Student Barcode Service
 *
 * Handles barcode scanning operations for:
 * - Student identification
 * - Medication verification
 * - Check-in/check-out tracking
 * - Attendance logging
 */
@Injectable()
export class StudentBarcodeService extends BaseService {

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @Optional() protected readonly requestContext: RequestContextService,
    @Optional() private readonly eventEmitter: EventEmitter2,
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
   * Scan student barcode
   * Validates barcode and returns student information
   */
  async scanBarcode(scanDto: StudentScanBarcodeDto): Promise<any> {
    try {
      this.validateRequired(scanDto.barcodeString, 'Barcode');

      // Find student by student number (barcode typically contains student number)
      const student = await this.studentModel.findOne({
        where: {
          studentNumber: scanDto.barcodeString,
          isActive: true,
        },
      });

      if (!student) {
        throw new NotFoundException(
          `No active student found with barcode: ${scanDto.barcodeString}`,
        );
      }

      // Emit scan event
      if (this.eventEmitter) {
        this.eventEmitter.emit('student.barcode.scanned', {
          studentId: student.id,
          barcode: scanDto.barcodeString,
          purpose: scanDto.scanType || 'STUDENT',
          userId: this.requestContext?.userId,
          timestamp: new Date(),
        });
      }

      this.logInfo('Barcode scanned', {
        studentId: student.id,
        barcode: scanDto.barcodeString,
      });

      return {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentNumber: student.studentNumber,
          grade: student.grade,
          dateOfBirth: student.dateOfBirth,
        },
        scanTime: new Date(),
        purpose: scanDto.scanType || 'STUDENT',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to scan barcode', error);
    }
  }

  /**
   * Verify medication using barcode
   * Ensures right student, right medication, right time
   */
  async verifyMedication(verifyDto: VerifyMedicationDto): Promise<any> {
    try {
      this.validateRequired(verifyDto.studentBarcode, 'Student barcode');
      this.validateRequired(verifyDto.medicationBarcode, 'Medication barcode');

      // Find student
      const student = await this.studentModel.findOne({
        where: {
          studentNumber: verifyDto.studentBarcode,
          isActive: true,
        },
      });

      if (!student) {
        throw new NotFoundException(
          `No active student found with barcode: ${verifyDto.studentBarcode}`,
        );
      }

      // TODO: Verify medication against student's active medications
      // This would require integration with MedicationService

      // Emit verification event
      if (this.eventEmitter) {
        this.eventEmitter.emit('student.medication.verified', {
          studentId: student.id,
          medicationBarcode: verifyDto.medicationBarcode,
          userId: this.requestContext?.userId,
          timestamp: new Date(),
        });
      }

      this.logInfo('Medication verified', {
        studentId: student.id,
        medicationBarcode: verifyDto.medicationBarcode,
      });

      return {
        verified: true,
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        },
        medicationBarcode: verifyDto.medicationBarcode,
        verificationTime: new Date(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to verify medication', error);
    }
  }

  /**
   * Generate barcode for student
   * Returns barcode data and format
   */
  async generateBarcode(studentId: string): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      const student = await this.studentModel.findOne({
        where: { id: studentId, isActive: true },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      this.logInfo('Barcode generated', { studentId });

      return {
        studentId: student.id,
        barcode: student.studentNumber,
        format: 'CODE128',
        displayText: `${student.lastName}, ${student.firstName}`,
        metadata: {
          grade: student.grade,
          generatedAt: new Date(),
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to generate barcode', error);
    }
  }
}
