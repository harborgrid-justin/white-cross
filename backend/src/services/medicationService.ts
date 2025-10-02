import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateMedicationData {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
}

export interface CreateStudentMedicationData {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
}

export interface CreateMedicationLogData {
  studentMedicationId: string;
  nurseId: string;
  dosageGiven: string;
  timeGiven: Date;
  notes?: string;
  sideEffects?: string;
}

export interface CreateInventoryData {
  medicationId: string;
  batchNumber: string;
  expirationDate: Date;
  quantity: number;
  reorderLevel?: number;
  costPerUnit?: number;
  supplier?: string;
}

export class MedicationService {
  /**
   * Get all medications with pagination
   */
  static async getMedications(page: number = 1, limit: number = 20, search?: string) {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause: any = {};
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { genericName: { contains: search, mode: 'insensitive' } },
          { manufacturer: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [medications, total] = await Promise.all([
        prisma.medication.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            inventory: {
              select: {
                id: true,
                quantity: true,
                expirationDate: true,
                reorderLevel: true,
                supplier: true
              }
            },
            _count: {
              select: {
                studentMedications: true
              }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.medication.count({ where: whereClause })
      ]);

      return {
        medications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching medications:', error);
      throw new Error('Failed to fetch medications');
    }
  }

  /**
   * Create new medication
   */
  static async createMedication(data: CreateMedicationData) {
    try {
      // Check if medication with same name and strength exists
      const existingMedication = await prisma.medication.findFirst({
        where: {
          name: data.name,
          strength: data.strength,
          dosageForm: data.dosageForm
        }
      });

      if (existingMedication) {
        throw new Error('Medication with same name, strength, and dosage form already exists');
      }

      // Check NDC uniqueness if provided
      if (data.ndc) {
        const existingNDC = await prisma.medication.findUnique({
          where: { ndc: data.ndc }
        });

        if (existingNDC) {
          throw new Error('Medication with this NDC already exists');
        }
      }

      const medication = await prisma.medication.create({
        data,
        include: {
          inventory: true,
          _count: {
            select: {
              studentMedications: true
            }
          }
        }
      });

      logger.info(`Medication created: ${medication.name} ${medication.strength}`);
      return medication;
    } catch (error) {
      logger.error('Error creating medication:', error);
      throw error;
    }
  }

  /**
   * Assign medication to student
   */
  static async assignMedicationToStudent(data: CreateStudentMedicationData) {
    try {
      // Verify student exists
      const student = await prisma.student.findUnique({
        where: { id: data.studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Verify medication exists
      const medication = await prisma.medication.findUnique({
        where: { id: data.medicationId }
      });

      if (!medication) {
        throw new Error('Medication not found');
      }

      // Check if student already has active prescription for this medication
      const existingPrescription = await prisma.studentMedication.findFirst({
        where: {
          studentId: data.studentId,
          medicationId: data.medicationId,
          isActive: true
        }
      });

      if (existingPrescription) {
        throw new Error('Student already has an active prescription for this medication');
      }

      const studentMedication = await prisma.studentMedication.create({
        data,
        include: {
          medication: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
      });

      logger.info(`Medication ${medication.name} assigned to student ${student.firstName} ${student.lastName}`);
      return studentMedication;
    } catch (error) {
      logger.error('Error assigning medication to student:', error);
      throw error;
    }
  }

  /**
   * Log medication administration
   */
  static async logMedicationAdministration(data: CreateMedicationLogData) {
    try {
      // Verify student medication exists and is active
      const studentMedication = await prisma.studentMedication.findUnique({
        where: { id: data.studentMedicationId },
        include: {
          medication: true,
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
      });

      if (!studentMedication) {
        throw new Error('Student medication prescription not found');
      }

      if (!studentMedication.isActive) {
        throw new Error('Medication prescription is not active');
      }

      // Verify nurse exists
      const nurse = await prisma.user.findUnique({
        where: { id: data.nurseId }
      });

      if (!nurse) {
        throw new Error('Nurse not found');
      }

      const medicationLog = await prisma.medicationLog.create({
        data: {
          studentMedicationId: data.studentMedicationId,
          nurseId: data.nurseId,
          dosageGiven: data.dosageGiven,
          timeGiven: data.timeGiven,
          administeredBy: nurse.firstName + ' ' + nurse.lastName,
          notes: data.notes,
          sideEffects: data.sideEffects
        },
        include: {
          nurse: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          studentMedication: {
            include: {
              medication: true,
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                  studentNumber: true
                }
              }
            }
          }
        }
      });

      logger.info(`Medication administration logged: ${studentMedication.medication.name} to ${studentMedication.student.firstName} ${studentMedication.student.lastName} by ${nurse.firstName} ${nurse.lastName}`);
      return medicationLog;
    } catch (error) {
      logger.error('Error logging medication administration:', error);
      throw error;
    }
  }

  /**
   * Get medication administration logs for a student
   */
  static async getStudentMedicationLogs(studentId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        prisma.medicationLog.findMany({
          where: {
            studentMedication: {
              studentId
            }
          },
          skip,
          take: limit,
          include: {
            nurse: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            studentMedication: {
              include: {
                medication: true
              }
            }
          },
          orderBy: { timeGiven: 'desc' }
        }),
        prisma.medicationLog.count({
          where: {
            studentMedication: {
              studentId
            }
          }
        })
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching student medication logs:', error);
      throw error;
    }
  }

  /**
   * Add medication to inventory
   */
  static async addToInventory(data: CreateInventoryData) {
    try {
      // Verify medication exists
      const medication = await prisma.medication.findUnique({
        where: { id: data.medicationId }
      });

      if (!medication) {
        throw new Error('Medication not found');
      }

      const inventory = await prisma.medicationInventory.create({
        data,
        include: {
          medication: true
        }
      });

      logger.info(`Inventory added: ${inventory.quantity} units of ${medication.name} (Batch: ${inventory.batchNumber})`);
      return inventory;
    } catch (error) {
      logger.error('Error adding to medication inventory:', error);
      throw error;
    }
  }

  /**
   * Get inventory with low stock alerts
   */
  static async getInventoryWithAlerts() {
    try {
      const inventory = await prisma.medicationInventory.findMany({
        include: {
          medication: true
        },
        orderBy: [
          { medication: { name: 'asc' } },
          { expirationDate: 'asc' }
        ]
      });

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      // Categorize inventory items
      const categorizedInventory = inventory.map((item: any) => ({
        ...item,
        alerts: {
          lowStock: item.quantity <= item.reorderLevel,
          nearExpiry: item.expirationDate <= thirtyDaysFromNow,
          expired: item.expirationDate <= now
        }
      }));

      const alerts = {
        lowStock: categorizedInventory.filter((item: any) => item.alerts.lowStock),
        nearExpiry: categorizedInventory.filter((item: any) => item.alerts.nearExpiry && !item.alerts.expired),
        expired: categorizedInventory.filter((item: any) => item.alerts.expired)
      };

      return {
        inventory: categorizedInventory,
        alerts
      };
    } catch (error) {
      logger.error('Error fetching inventory with alerts:', error);
      throw error;
    }
  }

  /**
   * Get medication schedule for a date range
   */
  static async getMedicationSchedule(startDate: Date, endDate: Date, nurseId?: string) {
    try {
      const whereClause: any = {
        isActive: true,
        startDate: { lte: endDate },
        OR: [
          { endDate: null },
          { endDate: { gte: startDate } }
        ]
      };

      if (nurseId) {
        whereClause.student = {
          nurseId
        };
      }

      const medications = await prisma.studentMedication.findMany({
        where: whereClause,
        include: {
          medication: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              grade: true
            }
          },
          logs: {
            where: {
              timeGiven: {
                gte: startDate,
                lte: endDate
              }
            },
            include: {
              nurse: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: [
          { student: { lastName: 'asc' } },
          { student: { firstName: 'asc' } }
        ]
      });

      return medications;
    } catch (error) {
      logger.error('Error fetching medication schedule:', error);
      throw error;
    }
  }

  /**
   * Update inventory quantity (for stock adjustments)
   */
  static async updateInventoryQuantity(inventoryId: string, newQuantity: number, reason?: string) {
    try {
      const inventory = await prisma.medicationInventory.update({
        where: { id: inventoryId },
        data: { quantity: newQuantity },
        include: {
          medication: true
        }
      });

      logger.info(`Inventory updated: ${inventory.medication.name} quantity changed to ${newQuantity}${reason ? ` (${reason})` : ''}`);
      return inventory;
    } catch (error) {
      logger.error('Error updating inventory quantity:', error);
      throw error;
    }
  }

  /**
   * Deactivate student medication (end prescription)
   */
  static async deactivateStudentMedication(id: string, reason?: string) {
    try {
      const studentMedication = await prisma.studentMedication.update({
        where: { id },
        data: { 
          isActive: false,
          endDate: new Date()
        },
        include: {
          medication: true,
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Student medication deactivated: ${studentMedication.medication.name} for ${studentMedication.student.firstName} ${studentMedication.student.lastName}${reason ? ` (${reason})` : ''}`);
      return studentMedication;
    } catch (error) {
      logger.error('Error deactivating student medication:', error);
      throw error;
    }
  }
}