/**
 * LOC: C41E6D37EC
 * WC-SVC-STU-006 | Student Management Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - students.ts (routes/students.ts)
 */

/**
 * WC-SVC-STU-006 | Student Management Service
 * Purpose: Core student operations including enrollment, health records, and CRUD
 * Upstream: database/models/Student, validators/studentValidators | Dependencies: Sequelize, validators
 * Downstream: routes/students.ts, healthRecordService, medicationService | Called by: Student API routes
 * Related: studentValidators.ts, healthRecordService.ts, EmergencyContact.ts
 * Exports: StudentService class | Key Services: CRUD, enrollment, health record linkage
 * Last Updated: 2025-10-17 | Dependencies: sequelize, joi, lodash
 * Critical Path: Validation → Database operation → Health record setup → Response
 * LLM Context: HIPAA-compliant student management, school enrollment workflows
 */

import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  Student,
  EmergencyContact,
  HealthRecord,
  Allergy,
  ChronicCondition,
  StudentMedication,
  Medication,
  MedicationLog,
  Appointment,
  IncidentReport,
  User,
  sequelize
} from '../database/models';
import { Gender } from '../database/types/enums';

/**
 * Interface for creating a new student
 */
export interface CreateStudentData {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  enrollmentDate?: Date;
  createdBy?: string;
}

/**
 * Interface for updating student information
 */
export interface UpdateStudentData {
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  grade?: string;
  gender?: Gender;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  isActive?: boolean;
  enrollmentDate?: Date;
  updatedBy?: string;
}

/**
 * Interface for filtering student queries
 */
export interface StudentFilters {
  search?: string;
  grade?: string;
  isActive?: boolean;
  nurseId?: string;
  hasAllergies?: boolean;
  hasMedications?: boolean;
  gender?: Gender;
}

/**
 * Student Service
 * Handles all business logic for student management
 */
export class StudentService {
  /**
   * Get paginated list of students with optional filters
   * @param page - Page number (1-indexed)
   * @param limit - Number of records per page
   * @param filters - Filter criteria
   * @returns Paginated student list with metadata
   */
  static async getStudents(
    page: number = 1,
    limit: number = 10,
    filters: StudentFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      // Build where clause based on filters
      const whereClause: any = {};

      // Search filter - searches across first name, last name, and student number
      if (filters.search) {
        whereClause[Op.or] = [
          { firstName: { [Op.iLike]: `%${filters.search}%` } },
          { lastName: { [Op.iLike]: `%${filters.search}%` } },
          { studentNumber: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      // Grade filter
      if (filters.grade) {
        whereClause.grade = filters.grade;
      }

      // Active status filter
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      // Nurse assignment filter
      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }

      // Gender filter
      if (filters.gender) {
        whereClause.gender = filters.gender;
      }

      // Build include array for associations
      const includeArray: any[] = [
        {
          model: EmergencyContact,
          as: 'emergencyContacts',
          where: { isActive: true },
          required: false,
          order: [['priority', 'ASC']]
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ];

      // Filter by allergies if requested
      if (filters.hasAllergies) {
        includeArray.push({
          model: Allergy,
          as: 'allergies',
          required: true,
          where: { active: true }
        });
      } else {
        includeArray.push({
          model: Allergy,
          as: 'allergies',
          required: false,
          where: { active: true }
        });
      }

      // Filter by medications if requested
      if (filters.hasMedications) {
        includeArray.push({
          model: StudentMedication,
          as: 'medications',
          required: true,
          where: { isActive: true },
          include: [
            {
              model: Medication,
              as: 'medication',
              attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
            }
          ]
        });
      } else {
        includeArray.push({
          model: StudentMedication,
          as: 'medications',
          required: false,
          where: { isActive: true },
          include: [
            {
              model: Medication,
              as: 'medication',
              attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
            }
          ]
        });
      }

      const { rows: students, count: total } = await Student.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: includeArray,
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC']
        ],
        distinct: true
      });

      return {
        students,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  /**
   * Get student by ID with complete profile including all related data
   * @param id - Student ID (UUID)
   * @returns Complete student profile
   */
  static async getStudentById(id: string) {
    try {
      const student = await Student.findByPk(id, {
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false
          },
          {
            model: StudentMedication,
            as: 'medications',
            separate: true,
            include: [
              {
                model: Medication,
                as: 'medication'
              },
              {
                model: MedicationLog,
                as: 'logs',
                separate: true,
                limit: 10,
                order: [['administeredAt', 'DESC']],
                include: [
                  {
                    model: User,
                    as: 'nurse',
                    attributes: ['id', 'firstName', 'lastName']
                  }
                ]
              }
            ]
          },
          {
            model: HealthRecord,
            as: 'healthRecords',
            separate: true,
            order: [['recordDate', 'DESC']],
            limit: 20
          },
          {
            model: Allergy,
            as: 'allergies',
            where: { active: true },
            required: false,
            separate: true,
            order: [['severity', 'DESC']]
          },
          {
            model: ChronicCondition,
            as: 'chronicConditions',
            required: false,
            separate: true,
            order: [['diagnosisDate', 'DESC']]
          },
          {
            model: Appointment,
            as: 'appointments',
            separate: true,
            order: [['scheduledAt', 'DESC']],
            limit: 10,
            include: [
              {
                model: User,
                as: 'nurse',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          },
          {
            model: IncidentReport,
            as: 'incidentReports',
            separate: true,
            order: [['occurredAt', 'DESC']],
            limit: 10,
            include: [
              {
                model: User,
                as: 'reportedBy',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!student) {
        throw new Error('Student not found');
      }

      return student;
    } catch (error) {
      logger.error('Error fetching student by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new student record
   * @param data - Student creation data
   * @returns Created student record
   */
  static async createStudent(data: CreateStudentData) {
    try {
      // Normalize and validate student number format
      const normalizedStudentNumber = data.studentNumber.toUpperCase().trim();

      // Check if student number already exists
      const existingStudent = await Student.findOne({
        where: { studentNumber: normalizedStudentNumber }
      });

      if (existingStudent) {
        throw new Error('Student number already exists. Please use a unique student number.');
      }

      // Validate and normalize medical record number if provided
      if (data.medicalRecordNum) {
        const normalizedMedicalRecordNum = data.medicalRecordNum.toUpperCase().trim();

        // Check if medical record number exists
        const existingMedicalRecord = await Student.findOne({
          where: { medicalRecordNum: normalizedMedicalRecordNum }
        });

        if (existingMedicalRecord) {
          throw new Error('Medical record number already exists. Each student must have a unique medical record number.');
        }

        data.medicalRecordNum = normalizedMedicalRecordNum;
      }

      // Validate date of birth
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (dob >= today) {
        throw new Error('Date of birth must be in the past.');
      }

      if (age < 3 || age > 100) {
        throw new Error('Student age must be between 3 and 100 years.');
      }

      // Validate nurse assignment if provided
      if (data.nurseId) {
        const nurse = await User.findByPk(data.nurseId);
        if (!nurse) {
          throw new Error('Assigned nurse not found. Please select a valid nurse.');
        }
      }

      // Normalize names
      const normalizedFirstName = data.firstName.trim();
      const normalizedLastName = data.lastName.trim();

      // Create student record with normalized data
      const student = await Student.create({
        ...data,
        studentNumber: normalizedStudentNumber,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        enrollmentDate: data.enrollmentDate || new Date(),
        isActive: true
      });

      // Reload with associations
      await student.reload({
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false
          },
          {
            model: Allergy,
            as: 'allergies',
            required: false
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Student created: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return student;
    } catch (error: any) {
      logger.error('Error creating student:', error);

      // Provide user-friendly error messages for validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((e: any) => e.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('A student with this student number or medical record number already exists.');
      }

      throw error;
    }
  }

  /**
   * Update student information
   * @param id - Student ID
   * @param data - Updated student data
   * @returns Updated student record
   */
  static async updateStudent(id: string, data: UpdateStudentData) {
    try {
      // Validate UUID format
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error('Invalid student ID format. Must be a valid UUID.');
      }

      // Check if student exists
      const existingStudent = await Student.findByPk(id);

      if (!existingStudent) {
        throw new Error('Student not found. The student may have been deleted or the ID is incorrect.');
      }

      // Normalize and validate student number if being updated
      if (data.studentNumber) {
        const normalizedStudentNumber = data.studentNumber.toUpperCase().trim();

        if (normalizedStudentNumber !== existingStudent.studentNumber) {
          const duplicateStudent = await Student.findOne({
            where: {
              studentNumber: normalizedStudentNumber,
              id: { [Op.ne]: id }
            }
          });

          if (duplicateStudent) {
            throw new Error('Student number already exists. Please use a unique student number.');
          }

          data.studentNumber = normalizedStudentNumber;
        }
      }

      // Normalize and validate medical record number if being updated
      if (data.medicalRecordNum) {
        const normalizedMedicalRecordNum = data.medicalRecordNum.toUpperCase().trim();

        if (normalizedMedicalRecordNum !== existingStudent.medicalRecordNum) {
          const duplicateMedicalRecord = await Student.findOne({
            where: {
              medicalRecordNum: normalizedMedicalRecordNum,
              id: { [Op.ne]: id }
            }
          });

          if (duplicateMedicalRecord) {
            throw new Error('Medical record number already exists. Each student must have a unique medical record number.');
          }

          data.medicalRecordNum = normalizedMedicalRecordNum;
        }
      }

      // Validate date of birth if being updated
      if (data.dateOfBirth) {
        const dob = new Date(data.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();

        if (dob >= today) {
          throw new Error('Date of birth must be in the past.');
        }

        if (age < 3 || age > 100) {
          throw new Error('Student age must be between 3 and 100 years.');
        }
      }

      // Validate nurse assignment if being updated
      if (data.nurseId) {
        const nurse = await User.findByPk(data.nurseId);
        if (!nurse) {
          throw new Error('Assigned nurse not found. Please select a valid nurse.');
        }
      }

      // Normalize names if being updated
      if (data.firstName) {
        data.firstName = data.firstName.trim();
      }
      if (data.lastName) {
        data.lastName = data.lastName.trim();
      }

      // Update student record
      await existingStudent.update(data);

      // Reload with associations
      await existingStudent.reload({
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false
          },
          {
            model: Allergy,
            as: 'allergies',
            where: { active: true },
            required: false
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Student updated: ${existingStudent.firstName} ${existingStudent.lastName} (${existingStudent.studentNumber})`);
      return existingStudent;
    } catch (error: any) {
      logger.error('Error updating student:', error);

      // Provide user-friendly error messages for validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((e: any) => e.message).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('A student with this student number or medical record number already exists.');
      }

      throw error;
    }
  }

  /**
   * Soft delete student (deactivate)
   * @param id - Student ID
   * @returns Deactivated student record
   */
  static async deactivateStudent(id: string) {
    try {
      const student = await Student.findByPk(id);

      if (!student) {
        throw new Error('Student not found');
      }

      await student.update({ isActive: false });

      logger.info(`Student deactivated: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return student;
    } catch (error) {
      logger.error('Error deactivating student:', error);
      throw error;
    }
  }

  /**
   * Reactivate a previously deactivated student
   * @param id - Student ID
   * @returns Reactivated student record
   */
  static async reactivateStudent(id: string) {
    try {
      const student = await Student.findByPk(id);

      if (!student) {
        throw new Error('Student not found');
      }

      await student.update({ isActive: true });

      logger.info(`Student reactivated: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return student;
    } catch (error) {
      logger.error('Error reactivating student:', error);
      throw error;
    }
  }

  /**
   * Transfer student to a different nurse
   * @param id - Student ID
   * @param newNurseId - New nurse ID
   * @returns Updated student record
   */
  static async transferStudent(id: string, newNurseId: string) {
    try {
      // Verify new nurse exists
      const nurse = await User.findByPk(newNurseId);
      if (!nurse) {
        throw new Error('Nurse not found');
      }

      const student = await Student.findByPk(id);

      if (!student) {
        throw new Error('Student not found');
      }

      await student.update({ nurseId: newNurseId });

      // Reload with nurse details
      await student.reload({
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Student transferred: ${student.firstName} ${student.lastName} to nurse ${nurse.firstName} ${nurse.lastName}`);
      return student;
    } catch (error) {
      logger.error('Error transferring student:', error);
      throw error;
    }
  }

  /**
   * Get students by grade
   * @param grade - Grade level
   * @returns Array of students in the specified grade
   */
  static async getStudentsByGrade(grade: string) {
    try {
      const students = await Student.findAll({
        where: {
          grade,
          isActive: true
        },
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC']
        ]
      });

      return students;
    } catch (error) {
      logger.error('Error fetching students by grade:', error);
      throw error;
    }
  }

  /**
   * Search students by query string
   * @param query - Search query
   * @param limit - Maximum number of results
   * @returns Array of matching students
   */
  static async searchStudents(query: string, limit: number = 20) {
    try {
      const students = await Student.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } },
            { studentNumber: { [Op.iLike]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC']
        ],
        limit
      });

      return students;
    } catch (error) {
      logger.error('Error searching students:', error);
      throw error;
    }
  }

  /**
   * Get students assigned to a specific nurse/user
   * @param userId - Nurse/User ID
   * @returns Array of assigned students
   */
  static async getAssignedStudents(userId: string) {
    try {
      const students = await Student.findAll({
        where: {
          isActive: true,
          nurseId: userId
        },
        attributes: ['id', 'studentNumber', 'firstName', 'lastName', 'grade', 'dateOfBirth', 'gender', 'photo'],
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC']
        ]
      });

      return students;
    } catch (error) {
      logger.error('Error fetching assigned students:', error);
      throw error;
    }
  }

  /**
   * Get student statistics and counts
   * @param studentId - Student ID
   * @returns Object containing various counts
   */
  static async getStudentStatistics(studentId: string) {
    try {
      const [
        healthRecordCount,
        allergyCount,
        medicationCount,
        appointmentCount,
        incidentCount
      ] = await Promise.all([
        HealthRecord.count({ where: { studentId } }),
        Allergy.count({ where: { studentId, active: true } }),
        StudentMedication.count({ where: { studentId, isActive: true } }),
        Appointment.count({ where: { studentId } }),
        IncidentReport.count({ where: { studentId } })
      ]);

      return {
        healthRecords: healthRecordCount,
        allergies: allergyCount,
        medications: medicationCount,
        appointments: appointmentCount,
        incidents: incidentCount
      };
    } catch (error) {
      logger.error('Error fetching student statistics:', error);
      throw error;
    }
  }

  /**
   * Bulk update students
   * @param studentIds - Array of student IDs
   * @param updateData - Data to update
   * @returns Number of updated records
   */
  static async bulkUpdateStudents(studentIds: string[], updateData: Partial<UpdateStudentData>) {
    try {
      if (!studentIds || studentIds.length === 0) {
        throw new Error('No student IDs provided');
      }

      const [updatedCount] = await Student.update(updateData, {
        where: {
          id: { [Op.in]: studentIds }
        }
      });

      logger.info(`Bulk update completed: ${updatedCount} students updated`);
      return updatedCount;
    } catch (error) {
      logger.error('Error in bulk update:', error);
      throw error;
    }
  }

  /**
   * Delete student permanently (use with caution - HIPAA compliance)
   * @param id - Student ID
   * @returns Deletion result
   */
  static async deleteStudent(id: string) {
    const transaction = await sequelize.transaction();

    try {
      const student = await Student.findByPk(id, { transaction });

      if (!student) {
        throw new Error('Student not found');
      }

      // All related records will be cascade deleted due to onDelete: 'CASCADE' in associations
      await student.destroy({ transaction });

      await transaction.commit();

      logger.warn(`Student permanently deleted: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return { success: true, message: 'Student and all related records deleted' };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting student:', error);
      throw error;
    }
  }

  /**
   * Get all unique grades in the system
   * @returns Array of unique grade values
   */
  static async getAllGrades() {
    try {
      const grades = await Student.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('grade')), 'grade']],
        where: { isActive: true },
        order: [['grade', 'ASC']],
        raw: true
      });

      return grades.map((g: any) => g.grade);
    } catch (error) {
      logger.error('Error fetching grades:', error);
      throw error;
    }
  }

  /**
   * Export student data for reporting or compliance
   * @param studentId - Student ID
   * @returns Complete student data export
   */
  static async exportStudentData(studentId: string) {
    try {
      const student = await this.getStudentById(studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        student: student.toJSON(),
        statistics: await this.getStudentStatistics(studentId)
      };

      logger.info(`Student data exported: ${student.firstName} ${student.lastName}`);
      return exportData;
    } catch (error) {
      logger.error('Error exporting student data:', error);
      throw error;
    }
  }
}
