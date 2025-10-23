import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import {
  Medication,
  StudentMedication,
  MedicationLog,
  MedicationInventory,
  Student,
  User,
  IncidentReport,
  sequelize
} from '../database/models';
import {
  MEDICATION_DOSAGE_FORMS,
  MEDICATION_CATEGORIES,
  MEDICATION_STRENGTH_UNITS,
  MEDICATION_ROUTES,
  MEDICATION_FREQUENCIES
} from './shared/constants/medicationConstants';
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  ConflictError
} from '../shared/errors';
import { retry } from '../shared/utils/resilience';

// Type augmentations for model associations
declare module '../database/models' {
  interface Medication {
    inventory?: MedicationInventory[];
    studentMedications?: StudentMedication[];
    name: string;
    strength: string;
    dosageForm: string;
  }
  
  interface StudentMedication {
    medication?: Medication;
    student?: Student;
    logs?: MedicationLog[];
    id: string;
    isActive: boolean;
    frequency: string;
    dosage: string;
    studentId: string;
  }
  
  interface MedicationLog {
    nurse?: User;
    studentMedication?: StudentMedication;
    timeGiven: Date;
  }
  
  interface MedicationInventory {
    medication?: Medication;
    quantity: number;
    reorderLevel: number;
    expirationDate: Date;
    batchNumber: string;
    medicationId: string;
  }
  
  interface Student {
    medications?: any[];
    firstName: string;
    lastName: string;
    studentNumber: string;
    id: string;
  }
  
  interface User {
    firstName: string;
    lastName: string;
  }
  
  interface IncidentReport {
    student?: Student;
    reportedBy?: User;
    studentId: string;
  }
}

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

export interface CreateAdverseReactionData {
  studentMedicationId: string;
  reportedBy: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  actionTaken: string;
  notes?: string;
  reportedAt: Date;
}

export interface MedicationReminder {
  id: string;
  studentMedicationId: string;
  studentName: string;
  medicationName: string;
  dosage: string;
  scheduledTime: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
}

export class MedicationService {
  /**
   * Get all medications with pagination
   */
  static async getMedications(page: number = 1, limit: number = 20, search?: string) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { genericName: { [Op.iLike]: `%${search}%` } },
          { manufacturer: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: medications, count: total } = await Medication.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: MedicationInventory,
            as: 'inventory',
            attributes: ['id', 'quantity', 'expirationDate', 'reorderLevel', 'supplier']
          },
          {
            model: StudentMedication,
            as: 'studentMedications',
            attributes: []
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM "StudentMedications" WHERE "StudentMedications"."medicationId" = "Medication"."id")'),
              'studentMedicationCount'
            ]
          ]
        },
        order: [['name', 'ASC']],
        distinct: true
      });

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
   * Create new medication with transaction protection
   */
  static async createMedication(data: CreateMedicationData) {
    const transaction = await sequelize.transaction();

    try {
      // Check if medication with same name and strength exists (inside transaction)
      const existingMedication = await Medication.findOne({
        where: {
          name: data.name,
          strength: data.strength,
          dosageForm: data.dosageForm
        },
        transaction
      });

      if (existingMedication) {
        await transaction.rollback();
        throw new ConflictError(
          'Medication',
          'duplicate',
          'Medication with same name, strength, and dosage form already exists',
          {
            name: data.name,
            strength: data.strength,
            dosageForm: data.dosageForm
          }
        );
      }

      // Check NDC uniqueness if provided (inside transaction)
      if (data.ndc) {
        const existingNDC = await Medication.findOne({
          where: { ndc: data.ndc },
          transaction
        });

        if (existingNDC) {
          await transaction.rollback();
          throw new ConflictError(
            'Medication',
            'duplicate_ndc',
            'Medication with this NDC already exists',
            { ndc: data.ndc }
          );
        }
      }

      // Create medication (inside transaction)
      const medication = await Medication.create(data, { transaction });

      // Reload with associations (inside transaction)
      await medication.reload({
        include: [
          {
            model: MedicationInventory,
            as: 'inventory'
          },
          {
            model: StudentMedication,
            as: 'studentMedications',
            attributes: []
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM "StudentMedications" WHERE "StudentMedications"."medicationId" = "Medication"."id")'),
              'studentMedicationCount'
            ]
          ]
        },
        transaction
      });

      // Commit transaction
      await transaction.commit();

      logger.info(`Medication created: ${medication.name} ${medication.strength}`, {
        medicationId: medication.id,
        name: medication.name,
        strength: medication.strength
      });

      return medication;

    } catch (error: any) {
      // Rollback transaction on any error
      await transaction.rollback();

      // Preserve custom errors
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }

      // Log and wrap database errors
      logger.error('Error creating medication:', {
        error: error.message,
        errorName: error.name,
        data
      });

      throw new DatabaseError('createMedication', error as Error, {
        medicationData: data
      });
    }
  }

  /**
   * Assign medication to student with transaction protection
   */
  static async assignMedicationToStudent(data: CreateStudentMedicationData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify student exists (inside transaction)
      const student = await Student.findByPk(data.studentId, { transaction });

      if (!student) {
        await transaction.rollback();
        throw new NotFoundError('Student', data.studentId);
      }

      // Verify medication exists (inside transaction)
      const medication = await Medication.findByPk(data.medicationId, { transaction });

      if (!medication) {
        await transaction.rollback();
        throw new NotFoundError('Medication', data.medicationId);
      }

      // Check if student already has active prescription for this medication (inside transaction)
      const existingPrescription = await StudentMedication.findOne({
        where: {
          studentId: data.studentId,
          medicationId: data.medicationId,
          isActive: true
        },
        transaction
      });

      if (existingPrescription) {
        await transaction.rollback();
        throw new ConflictError(
          'StudentMedication',
          'duplicate_prescription',
          'Student already has an active prescription for this medication',
          {
            studentId: data.studentId,
            medicationId: data.medicationId,
            existingPrescriptionId: existingPrescription.id
          }
        );
      }

      // Create student medication (inside transaction)
      const studentMedication = await StudentMedication.create(data, { transaction });

      // Reload with associations (inside transaction)
      await studentMedication.reload({
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        transaction
      });

      // Commit transaction
      await transaction.commit();

      logger.info(`Medication ${medication.name} assigned to student ${student.firstName} ${student.lastName}`, {
        studentMedicationId: studentMedication.id,
        studentId: data.studentId,
        medicationId: data.medicationId
      });

      return studentMedication;

    } catch (error: any) {
      // Rollback transaction on any error
      await transaction.rollback();

      // Preserve custom errors
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }

      // Log and wrap database errors
      logger.error('Error assigning medication to student:', {
        error: error.message,
        errorName: error.name,
        data
      });

      throw new DatabaseError('assignMedicationToStudent', error as Error, {
        assignmentData: data
      });
    }
  }

  /**
   * Log medication administration with transaction protection
   */
  static async logMedicationAdministration(data: CreateMedicationLogData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify student medication exists and is active (inside transaction)
      const studentMedication = await StudentMedication.findByPk(data.studentMedicationId, {
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ],
        transaction
      });

      if (!studentMedication) {
        await transaction.rollback();
        throw new NotFoundError('StudentMedication', data.studentMedicationId);
      }

      if (!studentMedication.isActive) {
        await transaction.rollback();
        throw new ValidationError(
          'Medication prescription is not active',
          {
            studentMedicationId: data.studentMedicationId,
            isActive: studentMedication.isActive
          }
        );
      }

      // Verify nurse exists (inside transaction)
      const nurse = await User.findByPk(data.nurseId, { transaction });

      if (!nurse) {
        await transaction.rollback();
        throw new NotFoundError('User (Nurse)', data.nurseId);
      }

      // Create medication log (inside transaction)
      const medicationLog = await MedicationLog.create({
        ...data,
        administeredBy: `${nurse.firstName} ${nurse.lastName}`,
        studentMedicationId: data.studentMedicationId,
        nurseId: data.nurseId,
        dosageGiven: data.dosageGiven,
        timeGiven: data.timeGiven,
        notes: data.notes,
        sideEffects: data.sideEffects
      }, { transaction });

      // Reload with associations (inside transaction)
      await medicationLog.reload({
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          },
          {
            model: StudentMedication,
            as: 'studentMedication',
            include: [
              {
                model: Medication,
                as: 'medication'
              },
              {
                model: Student,
                as: 'student',
                attributes: ['firstName', 'lastName', 'studentNumber']
              }
            ]
          }
        ],
        transaction
      });

      // Commit transaction
      await transaction.commit();

      logger.info(`Medication administration logged: ${studentMedication.medication!.name} to ${studentMedication.student!.firstName} ${studentMedication.student!.lastName} by ${nurse.firstName} ${nurse.lastName}`, {
        medicationLogId: medicationLog.id,
        studentMedicationId: data.studentMedicationId,
        nurseId: data.nurseId
      });

      return medicationLog;

    } catch (error: any) {
      // Rollback transaction on any error
      await transaction.rollback();

      // Preserve custom errors
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }

      // Log and wrap database errors
      logger.error('Error logging medication administration:', {
        error: error.message,
        errorName: error.name,
        data
      });

      throw new DatabaseError('logMedicationAdministration', error as Error, {
        administrationData: data
      });
    }
  }

  /**
   * Get medication administration logs for a student
   */
  static async getStudentMedicationLogs(studentId: string, page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await MedicationLog.findAndCountAll({
        include: [
          {
            model: StudentMedication,
            as: 'studentMedication',
            where: { studentId },
            include: [
              {
                model: Medication,
                as: 'medication'
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          }
        ],
        offset,
        limit,
        order: [['timeGiven', 'DESC']],
        distinct: true
      });

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
      const medication = await Medication.findByPk(data.medicationId);

      if (!medication) {
        throw new Error('Medication not found');
      }

      const inventory = await MedicationInventory.create(data);

      // Reload with associations
      await inventory.reload({
        include: [
          {
            model: Medication,
            as: 'medication'
          }
        ]
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
      const inventory = await MedicationInventory.findAll({
        include: [
          {
            model: Medication,
            as: 'medication'
          }
        ],
        order: [
          [{ model: Medication, as: 'medication' }, 'name', 'ASC'],
          ['expirationDate', 'ASC']
        ]
      });

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      // Categorize inventory items
      const categorizedInventory = inventory.map((item) => ({
        ...item.get({ plain: true }),
        alerts: {
          lowStock: item.quantity <= item.reorderLevel,
          nearExpiry: item.expirationDate <= thirtyDaysFromNow,
          expired: item.expirationDate <= now
        }
      }));

      const alerts = {
        lowStock: categorizedInventory.filter((item) => item.alerts.lowStock),
        nearExpiry: categorizedInventory.filter((item) => item.alerts.nearExpiry && !item.alerts.expired),
        expired: categorizedInventory.filter((item) => item.alerts.expired)
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
        startDate: { [Op.lte]: endDate },
        [Op.or]: [
          { endDate: { [Op.is]: null } },
          { endDate: { [Op.gte]: startDate } }
        ]
      };

      const includeStudent: any = {
        model: Student,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
      };

      if (nurseId) {
        includeStudent.where = { nurseId };
      }

      const medications = await StudentMedication.findAll({
        where: whereClause,
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          includeStudent,
          {
            model: MedicationLog,
            as: 'logs',
            where: {
              timeGiven: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
              }
            },
            required: false,
            include: [
              {
                model: User,
                as: 'nurse',
                attributes: ['firstName', 'lastName']
              }
            ]
          }
        ],
        order: [
          [{ model: Student, as: 'student' }, 'lastName', 'ASC'],
          [{ model: Student, as: 'student' }, 'firstName', 'ASC']
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
      const inventory = await MedicationInventory.findByPk(inventoryId, {
        include: [
          {
            model: Medication,
            as: 'medication'
          }
        ]
      });

      if (!inventory) {
        throw new Error('Inventory not found');
      }

      await inventory.update({ quantity: newQuantity });

      logger.info(`Inventory updated: ${inventory.medication!.name} quantity changed to ${newQuantity}${reason ? ` (${reason})` : ''}`);
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
      const studentMedication = await StudentMedication.findByPk(id, {
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!studentMedication) {
        throw new Error('Student medication not found');
      }

      await studentMedication.update({
        isActive: false,
        endDate: new Date()
      });

      logger.info(`Student medication deactivated: ${studentMedication.medication!.name} for ${studentMedication.student!.firstName} ${studentMedication.student!.lastName}${reason ? ` (${reason})` : ''}`);
      return studentMedication;
    } catch (error) {
      logger.error('Error deactivating student medication:', error);
      throw error;
    }
  }

  /**
   * Get medication reminders for today and upcoming doses
   */
  static async getMedicationReminders(date: Date = new Date()): Promise<MedicationReminder[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get active student medications
      const activeMedications = await StudentMedication.findAll({
        where: {
          isActive: true,
          startDate: { [Op.lte]: endOfDay },
          [Op.or]: [
            { endDate: { [Op.is]: null } },
            { endDate: { [Op.gte]: startOfDay } }
          ]
        },
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: MedicationLog,
            as: 'logs',
            where: {
              timeGiven: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay
              }
            },
            required: false
          }
        ]
      });

      // Parse frequency and generate reminders
      const reminders: MedicationReminder[] = [];

      for (const med of activeMedications) {
        // Parse frequency (e.g., "2x daily", "3 times daily", "every 8 hours")
        const scheduledTimes = this.parseFrequencyToTimes(med.frequency);

        for (const time of scheduledTimes) {
          const scheduledDateTime = new Date(date);
          scheduledDateTime.setHours(time.hour, time.minute, 0, 0);

          // Check if already administered
          const wasAdministered = med.logs!.some((log) => {
            const logTime = new Date(log.timeGiven);
            const timeDiff = Math.abs(logTime.getTime() - scheduledDateTime.getTime());
            return timeDiff < 3600000; // Within 1 hour
          });

          let status: 'PENDING' | 'COMPLETED' | 'MISSED' = 'PENDING';
          if (wasAdministered) {
            status = 'COMPLETED';
          } else if (scheduledDateTime < new Date()) {
            status = 'MISSED';
          }

          reminders.push({
            id: `${med.id}_${scheduledDateTime.toISOString()}`,
            studentMedicationId: med.id,
            studentName: `${med.student!.firstName} ${med.student!.lastName}`,
            medicationName: med.medication!.name,
            dosage: med.dosage,
            scheduledTime: scheduledDateTime,
            status
          });
        }
      }

      return reminders.sort((a, b) =>
        a.scheduledTime.getTime() - b.scheduledTime.getTime()
      );
    } catch (error) {
      logger.error('Error fetching medication reminders:', error);
      throw error;
    }
  }

  /**
   * Parse medication frequency to scheduled times
   * SECURITY FIX: Added validation to prevent malformed or malicious input
   */
  private static parseFrequencyToTimes(frequency: string): Array<{ hour: number; minute: number }> {
    // SECURITY: Import validation at top of file
    // Validate frequency input to prevent injection attacks and ensure medical safety
    const validation = this.validateFrequency(frequency);
    if (!validation.isValid) {
      logger.error(`Invalid medication frequency: ${frequency}`, { error: validation.error });
      throw new Error(validation.error || 'Invalid medication frequency');
    }

    const freq = validation.normalized;

    // Common medication schedules
    if (freq.includes('once') || freq.includes('1x') || freq === 'daily' || freq === 'qd') {
      return [{ hour: 9, minute: 0 }]; // 9 AM
    }

    if (freq.includes('twice') || freq.includes('2x') || freq.includes('bid') || freq.includes('b.i.d.')) {
      return [
        { hour: 9, minute: 0 },  // 9 AM
        { hour: 21, minute: 0 }  // 9 PM
      ];
    }

    if (freq.includes('3') || freq.includes('three') || freq.includes('tid') || freq.includes('t.i.d.')) {
      return [
        { hour: 8, minute: 0 },  // 8 AM
        { hour: 14, minute: 0 }, // 2 PM
        { hour: 20, minute: 0 }  // 8 PM
      ];
    }

    if (freq.includes('4') || freq.includes('four') || freq.includes('qid') || freq.includes('q.i.d.')) {
      return [
        { hour: 8, minute: 0 },  // 8 AM
        { hour: 12, minute: 0 }, // 12 PM
        { hour: 16, minute: 0 }, // 4 PM
        { hour: 20, minute: 0 }  // 8 PM
      ];
    }

    if (freq.includes('every 6 hours') || freq.includes('q6h')) {
      return [
        { hour: 6, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 18, minute: 0 },
        { hour: 0, minute: 0 }
      ];
    }

    if (freq.includes('every 8 hours') || freq.includes('q8h')) {
      return [
        { hour: 8, minute: 0 },
        { hour: 16, minute: 0 },
        { hour: 0, minute: 0 }
      ];
    }

    if (freq.includes('every 4 hours') || freq.includes('q4h')) {
      return [
        { hour: 6, minute: 0 },
        { hour: 10, minute: 0 },
        { hour: 14, minute: 0 },
        { hour: 18, minute: 0 },
        { hour: 22, minute: 0 },
        { hour: 2, minute: 0 }
      ];
    }

    if (freq.includes('every 12 hours') || freq.includes('q12h')) {
      return [
        { hour: 8, minute: 0 },
        { hour: 20, minute: 0 }
      ];
    }

    if (freq.includes('weekly') || freq.includes('once weekly')) {
      return [{ hour: 9, minute: 0 }]; // Once weekly at 9 AM
    }

    if (freq.includes('as needed') || freq.includes('prn') || freq.includes('p.r.n.')) {
      return []; // PRN medications have no fixed schedule
    }

    // Default to once daily for any remaining valid frequencies
    return [{ hour: 9, minute: 0 }];
  }

  /**
   * Validate medication frequency string
   * SECURITY: Helper method for frequency validation
   */
  private static validateFrequency(frequency: string): {
    isValid: boolean;
    normalized: string;
    error?: string;
  } {
    // Input sanitization
    if (!frequency || typeof frequency !== 'string') {
      return {
        isValid: false,
        normalized: '',
        error: 'Frequency must be a non-empty string'
      };
    }

    // Length validation (prevent DoS with very long strings)
    if (frequency.length > 100) {
      return {
        isValid: false,
        normalized: '',
        error: 'Frequency string too long (max 100 characters)'
      };
    }

    // Normalize: lowercase and trim
    const normalized = frequency.toLowerCase().trim();

    // Allowed patterns
    const allowedPatterns = [
      'once daily', 'once a day', '1x daily', '1x/day', 'daily', 'qd',
      'twice daily', 'twice a day', '2x daily', '2x/day', 'bid', 'b.i.d.',
      'three times daily', 'three times a day', '3x daily', '3x/day', 'tid', 't.i.d.',
      'four times daily', 'four times a day', '4x daily', '4x/day', 'qid', 'q.i.d.',
      'every 4 hours', 'every 6 hours', 'every 8 hours', 'every 12 hours',
      'q4h', 'q6h', 'q8h', 'q12h',
      'as needed', 'prn', 'p.r.n.',
      'weekly', 'once weekly', '1x weekly'
    ];

    // Check against allowed patterns
    const isValid = allowedPatterns.some(pattern =>
      normalized === pattern || normalized.includes(pattern)
    );

    if (!isValid) {
      return {
        isValid: false,
        normalized,
        error: `Invalid medication frequency: "${frequency}". Must be one of the standard medical frequency patterns.`
      };
    }

    return {
      isValid: true,
      normalized
    };
  }

  /**
   * Report adverse reaction to medication
   */
  static async reportAdverseReaction(data: CreateAdverseReactionData) {
    try {
      // Verify student medication exists
      const studentMedication = await StudentMedication.findByPk(data.studentMedicationId, {
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      if (!studentMedication) {
        throw new Error('Student medication not found');
      }

      // Create incident report for adverse reaction
      const nurse = await User.findByPk(data.reportedBy);

      if (!nurse) {
        throw new Error('Reporter not found');
      }

      const incidentReport = await IncidentReport.create({
        type: 'ALLERGIC_REACTION' as any,
        severity: data.severity as any,
        description: `Adverse reaction to ${studentMedication.medication!.name}: ${data.reaction}`,
        location: 'School Nurse Office',
        witnesses: [],
        actionsTaken: data.actionTaken,
        parentNotified: data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING',
        followUpRequired: data.severity !== 'MILD',
        followUpNotes: data.notes || undefined,
        attachments: [],
        occurredAt: data.reportedAt,
        studentId: studentMedication.studentId,
        reportedById: data.reportedBy
      });

      // Reload with associations
      await incidentReport.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      logger.info(`Adverse reaction reported: ${studentMedication.medication!.name} for ${studentMedication.student!.firstName} ${studentMedication.student!.lastName}`);

      return incidentReport;
    } catch (error) {
      logger.error('Error reporting adverse reaction:', error);
      throw error;
    }
  }

  /**
   * Get adverse reaction reports for a medication
   */
  static async getAdverseReactions(medicationId?: string, studentId?: string) {
    try {
      const whereClause: any = {
        type: 'ALLERGIC_REACTION'
      };

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const includeStudent: any = {
        model: Student,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName']
      };

      if (medicationId) {
        includeStudent.include = [
          {
            model: StudentMedication,
            as: 'medications',
            where: { medicationId },
            include: [
              {
                model: Medication,
                as: 'medication'
              }
            ]
          }
        ];
      }

      const reports = await IncidentReport.findAll({
        where: whereClause,
        include: [
          includeStudent,
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName']
          }
        ],
        order: [['occurredAt', 'DESC']]
      });

      // Filter by medication if specified
      if (medicationId) {
        return reports.filter((report) =>
          report.student &&
          report.student.medications &&
          report.student.medications.length > 0
        );
      }

      return reports;
    } catch (error) {
      logger.error('Error fetching adverse reactions:', error);
      throw error;
    }
  }

  /**
   * Get medication statistics
   */
  static async getMedicationStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const [
        totalMedications,
        activePrescriptions,
        administeredToday,
        adverseReactions,
        lowStockCount,
        expiringCount
      ] = await Promise.all([
        Medication.count(),
        StudentMedication.count({
          where: { isActive: true }
        }),
        MedicationLog.count({
          where: {
            timeGiven: {
              [Op.gte]: today,
              [Op.lte]: endOfDay
            }
          }
        }),
        IncidentReport.count({
          where: {
            type: 'ALLERGIC_REACTION',
            occurredAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        MedicationInventory.count({
          where: sequelize.where(
            sequelize.col('quantity'),
            Op.lte,
            sequelize.col('reorderLevel')
          )
        }),
        MedicationInventory.count({
          where: {
            expirationDate: {
              [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
              [Op.gte]: new Date()
            }
          }
        })
      ]);

      const statistics = {
        totalMedications,
        activePrescriptions,
        administeredToday,
        adverseReactions,
        lowStockCount,
        expiringCount
      };

      logger.info('Retrieved medication statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting medication statistics:', error);
      throw error;
    }
  }

  /**
   * Get medication alerts
   */
  static async getMedicationAlerts() {
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const [lowStockItems, expiringItems, missedDoses] = await Promise.all([
        MedicationInventory.findAll({
          where: {
            [Op.or]: [
              sequelize.where(
                sequelize.col('quantity'),
                Op.lte,
                sequelize.col('reorderLevel')
              ),
              { quantity: 0 }
            ]
          },
          include: [
            {
              model: Medication,
              as: 'medication',
              attributes: ['id', 'name', 'dosageForm', 'strength']
            }
          ],
          order: [
            ['quantity', 'ASC'],
            [{ model: Medication, as: 'medication' }, 'name', 'ASC']
          ]
        }),
        MedicationInventory.findAll({
          where: {
            expirationDate: {
              [Op.lte]: thirtyDaysFromNow,
              [Op.gte]: now
            }
          },
          include: [
            {
              model: Medication,
              as: 'medication',
              attributes: ['id', 'name', 'dosageForm', 'strength']
            }
          ],
          order: [['expirationDate', 'ASC']]
        }),
        // Get missed doses from today
        this.getMedicationReminders(now).then(reminders =>
          reminders.filter(r => r.status === 'MISSED')
        )
      ]);

      const alerts = {
        lowStock: lowStockItems.map(item => ({
          id: item.id,
          type: 'LOW_STOCK',
          severity: item.quantity === 0 ? 'CRITICAL' : 'HIGH',
          message: item.quantity === 0
            ? `${item.medication!.name} is out of stock`
            : `${item.medication!.name} is low in stock (${item.quantity} remaining, reorder at ${item.reorderLevel})`,
          medicationId: item.medicationId,
          medicationName: `${item.medication!.name} ${item.medication!.strength}`,
          currentQuantity: item.quantity,
          reorderLevel: item.reorderLevel
        })),
        expiring: expiringItems.map(item => {
          const daysUntilExpiry = Math.ceil((item.expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          return {
            id: item.id,
            type: 'EXPIRING',
            severity: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
            message: `${item.medication!.name} expires in ${daysUntilExpiry} days`,
            medicationId: item.medicationId,
            medicationName: `${item.medication!.name} ${item.medication!.strength}`,
            expirationDate: item.expirationDate,
            daysUntilExpiry
          };
        }),
        missedDoses: missedDoses.map(dose => ({
          id: dose.id,
          type: 'MISSED_DOSE',
          severity: 'MEDIUM',
          message: `Missed dose for ${dose.studentName}: ${dose.medicationName} ${dose.dosage}`,
          studentName: dose.studentName,
          medicationName: dose.medicationName,
          dosage: dose.dosage,
          scheduledTime: dose.scheduledTime
        }))
      };

      logger.info(`Retrieved medication alerts: ${lowStockItems.length} low stock, ${expiringItems.length} expiring, ${missedDoses.length} missed doses`);
      return alerts;
    } catch (error) {
      logger.error('Error getting medication alerts:', error);
      throw error;
    }
  }

  /**
   * Get medication form options
   * Now uses centralized constants from medicationConstants.ts
   */
  static async getMedicationFormOptions() {
    try {
      // Get unique dosage forms from existing medications
      const existingForms = await Medication.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('dosageForm')), 'dosageForm']],
        raw: true
      });

      // Combine standard forms with existing forms from database
      const allForms = [...new Set([
        ...MEDICATION_DOSAGE_FORMS,
        ...existingForms.map((f: any) => f.dosageForm).filter(Boolean)
      ])].sort();

      const formOptions = {
        dosageForms: allForms,
        categories: [...MEDICATION_CATEGORIES],
        strengthUnits: [...MEDICATION_STRENGTH_UNITS],
        routes: [...MEDICATION_ROUTES],
        frequencies: [...MEDICATION_FREQUENCIES]
      };

      logger.info('Retrieved medication form options');
      return formOptions;
    } catch (error) {
      logger.error('Error getting medication form options:', error);
      throw error;
    }
  }
}
