/**
 * @fileoverview Student Service - Facade Pattern
 * @module student/student.service
 * @description Main service that delegates to specialized services
 * Maintains backward compatibility while providing clean separation of concerns
 */

import { Injectable, Logger } from '@nestjs/common';
import { StudentCrudService } from './services/student-crud.service';
import { StudentQueryService } from './services/student-query.service';
import { StudentHealthRecordsService } from './services/student-health-records.service';
import { StudentAcademicService } from './services/student-academic.service';
import { StudentPhotoService } from './services/student-photo.service';
import { StudentBarcodeService } from './services/student-barcode.service';
import { StudentWaitlistService } from './services/student-waitlist.service';
import { StudentValidationService } from './services/student-validation.service';
import { Student } from '@/database';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { TransferStudentDto } from './dto/transfer-student.dto';
import { StudentBulkUpdateDto } from './dto/bulk-update.dto';
import { StudentFilterDto } from './dto/student-filter.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { SearchPhotoDto } from './dto/search-photo.dto';
import { ImportTranscriptDto } from './dto/import-transcript.dto';
import { AcademicHistoryDto } from './dto/academic-history.dto';
import { PerformanceTrendsDto } from './dto/performance-trends.dto';
import { BulkGradeTransitionDto } from './dto/bulk-grade-transition.dto';
import { GraduatingStudentsDto } from './dto/graduating-students.dto';
import { GradeTransitionDto } from './dto/grade-transition.dto';
import { GraduationDto } from './dto/graduation.dto';
import { StudentScanBarcodeDto } from './dto/scan-barcode.dto';
import { VerifyMedicationDto } from './dto/verify-medication.dto';
import { AddWaitlistDto } from './dto/add-waitlist.dto';
import { WaitlistStatusDto } from './dto/waitlist-status.dto';
import { GenerateBarcodeDto } from './dto/generate-barcode.dto';
import { VerifyBarcodeDto } from './dto/verify-barcode.dto';
import {
  PaginatedResponse,
  StudentDataExport,
  StudentStatistics,
  HealthRecordsResponse,
  MentalHealthRecordsResponse,
  PhotoUploadResponse,
  PhotoSearchResponse,
  AcademicTranscriptImportResponse,
  AcademicHistoryResponse,
  PerformanceTrendsResponse,
  BulkGradeTransitionResponse,
  GraduatingStudentsResponse,
  GradeTransitionResponse,
  GraduationResponse,
  GradeTransitionHistoryResponse,
  BarcodeScanResult,
  MedicationVerificationResult,
  WaitlistAddResponse,
  WaitlistStatusResponse,
  WaitlistPriorityUpdateResponse,
  BarcodeGenerationResponse,
  BarcodeVerificationResponse,
} from './types';

import { BaseService } from '@/common/base';
/**
 * Student Service (Facade)
 *
 * Main entry point for student operations that delegates to specialized services:
 * - StudentCrudService: CRUD operations, bulk updates, statistics
 * - StudentQueryService: Search, filtering, batch operations
 * - StudentHealthRecordsService: Health and mental health records
 * - StudentAcademicService: Transcripts, grades, graduation
 * - StudentPhotoService: Photo management and facial recognition
 * - StudentBarcodeService: Barcode scanning and verification
 * - StudentWaitlistService: Waitlist management
 * - StudentValidationService: Validation and normalization
 *
 * This facade maintains backward compatibility while providing
 * clean separation of concerns and easier testing.
 */
@Injectable()
export class StudentService extends BaseService {
  constructor(
    private readonly crudService: StudentCrudService,
    private readonly queryService: StudentQueryService,
    private readonly healthRecordsService: StudentHealthRecordsService,
    private readonly academicService: StudentAcademicService,
    private readonly photoService: StudentPhotoService,
    private readonly barcodeService: StudentBarcodeService,
    private readonly waitlistService: StudentWaitlistService,
    private readonly validationService: StudentValidationService,
  ) {
    super('StudentService');
  }

  // ==================== CRUD Operations (delegated to StudentCrudService) ====================

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.crudService.create(createStudentDto);
  }

  async findOne(id: string): Promise<Student> {
    return this.crudService.findOne(id);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    return this.crudService.update(id, updateStudentDto);
  }

  async remove(id: string): Promise<void> {
    return this.crudService.remove(id);
  }

  async deactivate(id: string, reason?: string): Promise<Student> {
    return this.crudService.deactivate(id, reason);
  }

  async reactivate(id: string): Promise<Student> {
    return this.crudService.reactivate(id);
  }

  async transfer(id: string, transferDto: TransferStudentDto): Promise<Student> {
    return this.crudService.transfer(id, transferDto);
  }

  async bulkUpdate(bulkUpdateDto: StudentBulkUpdateDto): Promise<{ updated: number }> {
    return this.crudService.bulkUpdate(bulkUpdateDto);
  }

  async getStatistics(studentId: string): Promise<StudentStatistics> {
    return this.crudService.getStatistics(studentId);
  }

  async exportData(studentId: string): Promise<StudentDataExport> {
    return this.crudService.exportData(studentId);
  }

  async findByIds(ids: string[]): Promise<(Student | null)[]> {
    return this.crudService.findByIds(ids);
  }

  // ==================== Query Operations (delegated to StudentQueryService) ====================

  async findAll(filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
    return this.queryService.findAll(filterDto);
  }

  async search(query: string, limit?: number): Promise<Student[]> {
    return this.queryService.search(query, limit);
  }

  async findByGrade(grade: string): Promise<Student[]> {
    return this.queryService.findByGrade(grade);
  }

  async findAllGrades(): Promise<string[]> {
    return this.queryService.findAllGrades();
  }

  async findAssignedStudents(nurseId: string): Promise<Student[]> {
    return this.queryService.findAssignedStudents(nurseId);
  }

  async findBySchoolIds(schoolIds: string[]): Promise<Student[][]> {
    return this.queryService.findBySchoolIds(schoolIds);
  }

  // ==================== Health Records (delegated to StudentHealthRecordsService) ====================

  async getStudentHealthRecords(
    studentId: string,
    page?: number,
    limit?: number,
  ): Promise<HealthRecordsResponse> {
    return this.healthRecordsService.getStudentHealthRecords(studentId, page, limit);
  }

  async getStudentMentalHealthRecords(
    studentId: string,
    page?: number,
    limit?: number,
  ): Promise<MentalHealthRecordsResponse> {
    return this.healthRecordsService.getStudentMentalHealthRecords(studentId, page, limit);
  }

  // ==================== Photo Management (delegated to StudentPhotoService) ====================

  async uploadStudentPhoto(studentId: string, uploadPhotoDto: UploadPhotoDto): Promise<PhotoUploadResponse> {
    return this.photoService.uploadStudentPhoto(studentId, uploadPhotoDto);
  }

  async searchStudentsByPhoto(searchPhotoDto: SearchPhotoDto): Promise<PhotoSearchResponse> {
    return this.photoService.searchStudentsByPhoto(searchPhotoDto);
  }

  // ==================== Academic Operations (delegated to StudentAcademicService) ====================

  async importAcademicTranscript(
    studentId: string,
    importTranscriptDto: ImportTranscriptDto,
  ): Promise<AcademicTranscriptImportResponse> {
    return this.academicService.importAcademicTranscript(studentId, importTranscriptDto);
  }

  async getAcademicHistory(studentId: string, query: AcademicHistoryDto): Promise<AcademicHistoryResponse> {
    return this.academicService.getAcademicHistory(studentId, query);
  }

  async getPerformanceTrends(studentId: string, query: PerformanceTrendsDto): Promise<PerformanceTrendsResponse> {
    return this.academicService.getPerformanceTrends(studentId, query);
  }

  async performBulkGradeTransition(bulkGradeTransitionDto: BulkGradeTransitionDto): Promise<BulkGradeTransitionResponse> {
    return this.academicService.performBulkGradeTransition(bulkGradeTransitionDto);
  }

  async getGraduatingStudents(query: GraduatingStudentsDto): Promise<GraduatingStudentsResponse> {
    return this.academicService.getGraduatingStudents(query);
  }

  // ==================== Individual Grade Transition Operations ====================

  async advanceStudentGrade(id: string, gradeTransitionDto: GradeTransitionDto): Promise<GradeTransitionResponse> {
    return this.academicService.advanceStudentGrade(id, gradeTransitionDto);
  }

  async retainStudentGrade(id: string, gradeTransitionDto: GradeTransitionDto): Promise<GradeTransitionResponse> {
    return this.academicService.retainStudentGrade(id, gradeTransitionDto);
  }

  async processStudentGraduation(id: string, graduationDto: GraduationDto): Promise<GraduationResponse> {
    return this.academicService.processStudentGraduation(id, graduationDto);
  }

  async getGradeTransitionHistory(id: string): Promise<GradeTransitionHistoryResponse> {
    return this.academicService.getGradeTransitionHistory(id);
  }

  // ==================== Barcode Operations (delegated to StudentBarcodeService) ====================

  async scanBarcode(scanBarcodeDto: StudentScanBarcodeDto): Promise<BarcodeScanResult> {
    return this.barcodeService.scanBarcode(scanBarcodeDto);
  }

  async verifyMedicationAdministration(verifyMedicationDto: VerifyMedicationDto): Promise<MedicationVerificationResult> {
    return this.barcodeService.verifyMedication(verifyMedicationDto);
  }

  // ==================== Waitlist Operations (delegated to StudentWaitlistService) ====================

  async addStudentToWaitlist(addWaitlistDto: AddWaitlistDto): Promise<WaitlistAddResponse> {
    return this.waitlistService.addStudentToWaitlist(addWaitlistDto);
  }

  async getStudentWaitlistStatus(studentId: string, query: WaitlistStatusDto): Promise<WaitlistStatusResponse> {
    return this.waitlistService.getStudentWaitlistStatus(studentId, query);
  }

  // ==================== Validation Methods (exposed for external use) ====================

  validateUUID(id: string): void {
    return this.validationService.validateUUID(id);
  }

  validateDateOfBirth(dateOfBirth: Date): void {
    return this.validationService.validateDateOfBirth(dateOfBirth);
  }

  calculateAge(dateOfBirth: Date): number {
    return this.validationService.calculateAge(dateOfBirth);
  }

  // ==================== Barcode Methods ====================

  /**
   * Generate barcode for student
   */
  async generateStudentBarcode(id: string, generateBarcodeDto: GenerateBarcodeDto): Promise<BarcodeGenerationResponse> {
    return await this.barcodeService.generateBarcode(id, generateBarcodeDto);
  }

  /**
   * Verify student barcode
   */
  async verifyStudentBarcode(verifyBarcodeDto: VerifyBarcodeDto): Promise<BarcodeVerificationResponse> {
    return await this.barcodeService.verifyBarcode(verifyBarcodeDto);
  }

  // ==================== Waitlist Methods ====================

  /**
   * Add student to waitlist
   */
  async addStudentToWaitlist(id: string, addWaitlistDto: AddWaitlistDto): Promise<WaitlistAddResponse> {
    // Add studentId to the DTO since the service method expects it
    const dtoWithStudentId = { ...addWaitlistDto, studentId: id };
    return await this.waitlistService.addStudentToWaitlist(dtoWithStudentId);
  }

  /**
   * Update waitlist priority
   */
  async updateWaitlistPriority(id: string, priorityDto: WaitlistPriorityDto): Promise<WaitlistPriorityUpdateResponse> {
    return await this.waitlistService.updateWaitlistPriority(id, priorityDto);
  }
}
