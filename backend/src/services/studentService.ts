import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateStudentData {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
}

export interface UpdateStudentData {
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  grade?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  isActive?: boolean;
}

export interface StudentFilters {
  search?: string;
  grade?: string;
  isActive?: boolean;
  nurseId?: string;
  hasAllergies?: boolean;
  hasMedications?: boolean;
}

export class StudentService {
  /**
   * Get paginated list of students with optional filters
   */
  static async getStudents(
    page: number = 1,
    limit: number = 10,
    filters: StudentFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      // Build where clause based on filters
      const whereClause: any = {};
      
      if (filters.search) {
        whereClause.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { studentNumber: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      
      if (filters.grade) {
        whereClause.grade = filters.grade;
      }
      
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      
      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }
      
      if (filters.hasAllergies) {
        whereClause.allergies = { some: {} };
      }
      
      if (filters.hasMedications) {
        whereClause.medications = { some: { isActive: true } };
      }

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            emergencyContacts: {
              where: { isActive: true },
              orderBy: { priority: 'asc' }
            },
            medications: {
              where: { isActive: true },
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
            },
            _count: {
              select: {
                healthRecords: true,
                appointments: true,
                incidentReports: true
              }
            }
          },
          orderBy: [
            { lastName: 'asc' },
            { firstName: 'asc' }
          ]
        }),
        prisma.student.count({ where: whereClause })
      ]);

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
   * Get student by ID with complete profile
   */
  static async getStudentById(id: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          emergencyContacts: {
            where: { isActive: true },
            orderBy: { priority: 'asc' }
          },
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
                orderBy: { timeGiven: 'desc' },
                take: 10 // Recent logs only
              }
            }
          },
          healthRecords: {
            orderBy: { date: 'desc' }
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
            orderBy: { scheduledAt: 'desc' }
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
            orderBy: { occurredAt: 'desc' }
          },
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
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
   * Create new student
   */
  static async createStudent(data: CreateStudentData) {
    try {
      // Check if student number already exists
      const existingStudent = await prisma.student.findUnique({
        where: { studentNumber: data.studentNumber }
      });

      if (existingStudent) {
        throw new Error('Student number already exists');
      }

      // Check if medical record number exists (if provided)
      if (data.medicalRecordNum) {
        const existingMedicalRecord = await prisma.student.findUnique({
          where: { medicalRecordNum: data.medicalRecordNum }
        });

        if (existingMedicalRecord) {
          throw new Error('Medical record number already exists');
        }
      }

      const student = await prisma.student.create({
        data,
        include: {
          emergencyContacts: true,
          allergies: true,
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Student created: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return student;
    } catch (error) {
      logger.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Update student information
   */
  static async updateStudent(id: string, data: UpdateStudentData) {
    try {
      // Check if student exists
      const existingStudent = await prisma.student.findUnique({
        where: { id }
      });

      if (!existingStudent) {
        throw new Error('Student not found');
      }

      // Check student number uniqueness if being updated
      if (data.studentNumber && data.studentNumber !== existingStudent.studentNumber) {
        const duplicateStudent = await prisma.student.findUnique({
          where: { studentNumber: data.studentNumber }
        });

        if (duplicateStudent) {
          throw new Error('Student number already exists');
        }
      }

      // Check medical record number uniqueness if being updated
      if (data.medicalRecordNum && data.medicalRecordNum !== existingStudent.medicalRecordNum) {
        const duplicateMedicalRecord = await prisma.student.findUnique({
          where: { medicalRecordNum: data.medicalRecordNum }
        });

        if (duplicateMedicalRecord) {
          throw new Error('Medical record number already exists');
        }
      }

      const student = await prisma.student.update({
        where: { id },
        data,
        include: {
          emergencyContacts: {
            where: { isActive: true },
            orderBy: { priority: 'asc' }
          },
          allergies: true,
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Student updated: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return student;
    } catch (error) {
      logger.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Soft delete student (deactivate)
   */
  static async deactivateStudent(id: string) {
    try {
      const student = await prisma.student.update({
        where: { id },
        data: { isActive: false }
      });

      logger.info(`Student deactivated: ${student.firstName} ${student.lastName} (${student.studentNumber})`);
      return student;
    } catch (error) {
      logger.error('Error deactivating student:', error);
      throw error;
    }
  }

  /**
   * Transfer student to different nurse
   */
  static async transferStudent(id: string, newNurseId: string) {
    try {
      const student = await prisma.student.update({
        where: { id },
        data: { nurseId: newNurseId },
        include: {
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Student transferred: ${student.firstName} ${student.lastName} to nurse ${student.nurse?.firstName} ${student.nurse?.lastName}`);
      return student;
    } catch (error) {
      logger.error('Error transferring student:', error);
      throw error;
    }
  }

  /**
   * Get students by grade
   */
  static async getStudentsByGrade(grade: string) {
    try {
      const students = await prisma.student.findMany({
        where: {
          grade,
          isActive: true
        },
        include: {
          emergencyContacts: {
            where: { isActive: true },
            orderBy: { priority: 'asc' }
          },
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ]
      });

      return students;
    } catch (error) {
      logger.error('Error fetching students by grade:', error);
      throw error;
    }
  }

  /**
   * Search students
   */
  static async searchStudents(query: string) {
    try {
      const students = await prisma.student.findMany({
        where: {
          isActive: true,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { studentNumber: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          nurse: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ],
        take: 20 // Limit search results
      });

      return students;
    } catch (error) {
      logger.error('Error searching students:', error);
      throw error;
    }
  }
}