import { PrismaClient, Prisma } from '@prisma/client';
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
      const skip = (page - 1) * limit;
      
      const whereClause: Prisma.MedicationWhereInput = {};
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
          ...data,
          administeredBy: `${nurse.firstName} ${nurse.lastName}`,
          studentMedicationId: data.studentMedicationId,
          nurseId: data.nurseId,
          dosageGiven: data.dosageGiven,
          timeGiven: data.timeGiven,
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
      const categorizedInventory = inventory.map((item) => ({
        ...item,
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
      const whereClause: Prisma.StudentMedicationWhereInput = {
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
      const activeMedications = await prisma.studentMedication.findMany({
        where: {
          isActive: true,
          startDate: { lte: endOfDay },
          OR: [
            { endDate: null },
            { endDate: { gte: startOfDay } }
          ]
        },
        include: {
          medication: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          logs: {
            where: {
              timeGiven: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          }
        }
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
          const wasAdministered = med.logs.some((log) => {
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
            studentName: `${med.student.firstName} ${med.student.lastName}`,
            medicationName: med.medication.name,
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
   */
  private static parseFrequencyToTimes(frequency: string): Array<{ hour: number; minute: number }> {
    const freq = frequency.toLowerCase();
    
    // Common medication schedules
    if (freq.includes('once') || freq.includes('1x') || freq === 'daily') {
      return [{ hour: 9, minute: 0 }]; // 9 AM
    }
    
    if (freq.includes('twice') || freq.includes('2x') || freq.includes('bid')) {
      return [
        { hour: 9, minute: 0 },  // 9 AM
        { hour: 21, minute: 0 }  // 9 PM
      ];
    }
    
    if (freq.includes('3') || freq.includes('three') || freq.includes('tid')) {
      return [
        { hour: 8, minute: 0 },  // 8 AM
        { hour: 14, minute: 0 }, // 2 PM
        { hour: 20, minute: 0 }  // 8 PM
      ];
    }
    
    if (freq.includes('4') || freq.includes('four') || freq.includes('qid')) {
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
    
    // Default to once daily if can't parse
    return [{ hour: 9, minute: 0 }];
  }

  /**
   * Report adverse reaction to medication
   */
  static async reportAdverseReaction(data: CreateAdverseReactionData) {
    try {
      // Verify student medication exists
      const studentMedication = await prisma.studentMedication.findUnique({
        where: { id: data.studentMedicationId },
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

      if (!studentMedication) {
        throw new Error('Student medication not found');
      }

      // Create incident report for adverse reaction
      const nurse = await prisma.user.findUnique({
        where: { id: data.reportedBy }
      });

      if (!nurse) {
        throw new Error('Reporter not found');
      }

      const incidentReport = await prisma.incidentReport.create({
        data: {
          type: 'ALLERGIC_REACTION',
          severity: data.severity as any,
          description: `Adverse reaction to ${studentMedication.medication.name}: ${data.reaction}`,
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
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          reportedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Adverse reaction reported: ${studentMedication.medication.name} for ${studentMedication.student.firstName} ${studentMedication.student.lastName}`);
      
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
      const whereClause: Prisma.IncidentReportWhereInput = {
        type: 'ALLERGIC_REACTION'
      };

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const reports = await prisma.incidentReport.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              medications: medicationId ? {
                where: {
                  medicationId
                },
                include: {
                  medication: true
                }
              } : undefined
            }
          },
          reportedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          occurredAt: 'desc'
        }
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
        prisma.medication.count(),
        prisma.studentMedication.count({
          where: { isActive: true }
        }),
        prisma.medicationLog.count({
          where: {
            timeGiven: {
              gte: today,
              lte: endOfDay
            }
          }
        }),
        prisma.incidentReport.count({
          where: {
            type: 'ALLERGIC_REACTION',
            occurredAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        prisma.medicationInventory.count({
          where: {
            quantity: {
              lte: prisma.medicationInventory.fields.reorderLevel
            }
          }
        }),
        prisma.medicationInventory.count({
          where: {
            expirationDate: {
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
              gte: new Date()
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
        prisma.medicationInventory.findMany({
          where: {
            OR: [
              {
                quantity: {
                  lte: prisma.medicationInventory.fields.reorderLevel
                }
              },
              {
                quantity: 0
              }
            ]
          },
          include: {
            medication: {
              select: {
                id: true,
                name: true,
                dosageForm: true,
                strength: true
              }
            }
          },
          orderBy: [
            { quantity: 'asc' },
            { medication: { name: 'asc' } }
          ]
        }),
        prisma.medicationInventory.findMany({
          where: {
            expirationDate: {
              lte: thirtyDaysFromNow,
              gte: now
            }
          },
          include: {
            medication: {
              select: {
                id: true,
                name: true,
                dosageForm: true,
                strength: true
              }
            }
          },
          orderBy: { expirationDate: 'asc' }
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
            ? `${item.medication.name} is out of stock`
            : `${item.medication.name} is low in stock (${item.quantity} remaining, reorder at ${item.reorderLevel})`,
          medicationId: item.medicationId,
          medicationName: `${item.medication.name} ${item.medication.strength}`,
          currentQuantity: item.quantity,
          reorderLevel: item.reorderLevel
        })),
        expiring: expiringItems.map(item => {
          const daysUntilExpiry = Math.ceil((item.expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          return {
            id: item.id,
            type: 'EXPIRING',
            severity: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
            message: `${item.medication.name} expires in ${daysUntilExpiry} days`,
            medicationId: item.medicationId,
            medicationName: `${item.medication.name} ${item.medication.strength}`,
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
   */
  static async getMedicationFormOptions() {
    try {
      // Get unique dosage forms from existing medications
      const existingForms = await prisma.medication.findMany({
        select: {
          dosageForm: true
        },
        distinct: ['dosageForm']
      });

      // Standard medication forms
      const standardForms = [
        'Tablet',
        'Capsule',
        'Liquid',
        'Injection',
        'Topical',
        'Inhaler',
        'Drops',
        'Patch',
        'Suppository',
        'Powder',
        'Cream',
        'Ointment',
        'Gel',
        'Spray',
        'Lozenge'
      ];

      // Combine and deduplicate
      const allForms = [...new Set([
        ...standardForms,
        ...existingForms.map(f => f.dosageForm)
      ])].sort();

      // Standard medication categories
      const categories = [
        'Analgesic',
        'Antibiotic',
        'Antihistamine',
        'Anti-inflammatory',
        'Asthma Medication',
        'Diabetic Medication',
        'Cardiovascular',
        'Gastrointestinal',
        'Neurological',
        'Dermatological',
        'Ophthalmic',
        'Otic',
        'Emergency Medication',
        'Vitamin/Supplement',
        'Other'
      ];

      // Common strength units
      const strengthUnits = [
        'mg',
        'g',
        'mcg',
        'ml',
        'units',
        'mEq',
        '%'
      ];

      // Administration routes
      const routes = [
        'Oral',
        'Sublingual',
        'Topical',
        'Intravenous',
        'Intramuscular',
        'Subcutaneous',
        'Inhalation',
        'Ophthalmic',
        'Otic',
        'Nasal',
        'Rectal',
        'Transdermal'
      ];

      const formOptions = {
        dosageForms: allForms,
        categories,
        strengthUnits,
        routes,
        frequencies: [
          'Once daily',
          'Twice daily',
          'Three times daily',
          'Four times daily',
          'Every 4 hours',
          'Every 6 hours',
          'Every 8 hours',
          'Every 12 hours',
          'As needed',
          'Before meals',
          'After meals',
          'At bedtime',
          'Weekly',
          'Monthly'
        ]
      };

      logger.info('Retrieved medication form options');
      return formOptions;
    } catch (error) {
      logger.error('Error getting medication form options:', error);
      throw error;
    }
  }
}
