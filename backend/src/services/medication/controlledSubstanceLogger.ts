/**
 * LOC: CS001LOG
 * Controlled Substance Logging Service
 * 
 * DEA-compliant controlled substance tracking and documentation
 * Meets DEA Form 222 and state-specific requirements
 * 
 * UPSTREAM (imports from):
 *   - database models
 *   - logger utility
 * 
 * DOWNSTREAM (imported by):
 *   - medication routes
 *   - inventory services
 */

import { logger } from '../../utils/logger';
import { AuditService } from '../auditService';

/**
 * DEA Schedule Classifications
 */
export enum DEASchedule {
  SCHEDULE_I = 'I',    // No accepted medical use (rarely in schools)
  SCHEDULE_II = 'II',   // High abuse potential: Adderall, Ritalin, morphine
  SCHEDULE_III = 'III', // Moderate abuse potential: codeine combinations
  SCHEDULE_IV = 'IV',   // Lower abuse potential: Xanax, Valium
  SCHEDULE_V = 'V'      // Lowest abuse potential: cough preparations
}

/**
 * Transaction Types for Controlled Substances
 */
export enum TransactionType {
  RECEIPT = 'RECEIPT',           // Received from pharmacy/distributor
  ADMINISTRATION = 'ADMINISTRATION', // Given to student
  WASTE = 'WASTE',               // Disposal/destruction
  RETURN = 'RETURN',             // Returned to pharmacy
  TRANSFER_IN = 'TRANSFER_IN',   // Transferred from another location
  TRANSFER_OUT = 'TRANSFER_OUT', // Transferred to another location
  INVENTORY_ADJUSTMENT = 'INVENTORY_ADJUSTMENT', // Count correction
  EXPIRED = 'EXPIRED'            // Expired and awaiting disposal
}

/**
 * Controlled Substance Log Entry
 */
export interface ControlledSubstanceLogEntry {
  id: string;
  logDate: Date;
  medicationId: string;
  medicationName: string;
  genericName?: string;
  deaSchedule: DEASchedule;
  transactionType: TransactionType;
  
  // Quantity tracking
  quantity: number;
  unit: string; // mg, mL, tablets, etc.
  balanceBefore: number;
  balanceAfter: number;
  
  // Student information (for administration)
  studentId?: string;
  studentName?: string;
  
  // Personnel
  administeredBy?: string;
  witnessedBy?: string; // Required for Schedule II
  
  // Documentation
  prescriptionNumber?: string;
  lotNumber?: string;
  expirationDate?: Date;
  invoiceNumber?: string; // For receipts
  orderNumber?: string;
  
  // Disposal documentation (for waste)
  disposalMethod?: string;
  disposalWitnessName?: string;
  disposalWitnessLicense?: string;
  disposalDate?: Date;
  
  // Transfer documentation
  transferToLocation?: string;
  transferFromLocation?: string;
  transferAuthorization?: string;
  
  // Verification
  verifiedBy?: string;
  verificationDate?: Date;
  
  // Notes and compliance
  notes?: string;
  deaFormNumber?: string; // DEA Form 222 number
  reason?: string; // For adjustments or waste
  
  // Audit trail
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  schoolId?: string;
  
  // Flags
  requiresFollowUp: boolean;
  discrepancyReported: boolean;
}

/**
 * Controlled Substance Inventory Record
 */
export interface ControlledSubstanceInventory {
  medicationId: string;
  medicationName: string;
  deaSchedule: DEASchedule;
  currentBalance: number;
  unit: string;
  location: string;
  secureStorageLocation: string;
  lastInventoryDate: Date;
  nextInventoryDue: Date;
  discrepancyCount: number;
}

/**
 * Controlled Substance Report
 */
export interface ControlledSubstanceReport {
  reportDate: Date;
  reportPeriodStart: Date;
  reportPeriodEnd: Date;
  medications: {
    medicationId: string;
    medicationName: string;
    deaSchedule: DEASchedule;
    openingBalance: number;
    receipts: number;
    administered: number;
    wasted: number;
    transferred: number;
    closingBalance: number;
    expectedBalance: number;
    discrepancy: number;
    unit: string;
  }[];
  totalTransactions: number;
  discrepanciesFound: number;
  generatedBy: string;
}

/**
 * Controlled Substance Logging Service
 * DEA-compliant tracking of controlled substances
 */
export class ControlledSubstanceLogger {
  
  // In-memory storage (replace with database in production)
  private static logs: ControlledSubstanceLogEntry[] = [];
  private static inventory: Map<string, ControlledSubstanceInventory> = new Map();
  
  /**
   * Log a controlled substance transaction
   */
  static async logTransaction(entry: Omit<ControlledSubstanceLogEntry, 'id' | 'createdAt'>): Promise<ControlledSubstanceLogEntry> {
    try {
      const logEntry: ControlledSubstanceLogEntry = {
        ...entry,
        id: this.generateLogId(),
        createdAt: new Date(),
        requiresFollowUp: entry.requiresFollowUp || false,
        discrepancyReported: entry.discrepancyReported || false
      };
      
      // Validate required fields based on transaction type
      this.validateLogEntry(logEntry);
      
      // Update inventory balance
      await this.updateInventoryBalance(logEntry);
      
      // Store log entry
      this.logs.push(logEntry);
      
      // Audit log
      await AuditService.logAction({
        userId: entry.createdBy,
        action: 'CREATE_CONTROLLED_SUBSTANCE_LOG',
        resourceType: 'ControlledSubstance',
        resourceId: logEntry.id,
        details: {
          medicationName: entry.medicationName,
          transactionType: entry.transactionType,
          quantity: entry.quantity,
          studentId: entry.studentId
        }
      });
      
      logger.info('Controlled substance transaction logged', {
        logId: logEntry.id,
        medicationName: entry.medicationName,
        transactionType: entry.transactionType,
        quantity: entry.quantity
      });
      
      // Check for witness requirement
      if (logEntry.deaSchedule === DEASchedule.SCHEDULE_II && 
          logEntry.transactionType === TransactionType.ADMINISTRATION &&
          !logEntry.witnessedBy) {
        logger.warn('Schedule II administration requires witness', { logId: logEntry.id });
        logEntry.requiresFollowUp = true;
      }
      
      return logEntry;
      
    } catch (error) {
      logger.error('Error logging controlled substance transaction', { error, entry });
      throw new Error('Failed to log controlled substance transaction');
    }
  }
  
  /**
   * Log medication administration (most common transaction)
   */
  static async logAdministration(params: {
    medicationId: string;
    medicationName: string;
    deaSchedule: DEASchedule;
    studentId: string;
    studentName: string;
    quantity: number;
    unit: string;
    administeredBy: string;
    witnessedBy?: string;
    prescriptionNumber?: string;
    notes?: string;
    schoolId?: string;
  }): Promise<ControlledSubstanceLogEntry> {
    
    const inventory = this.inventory.get(params.medicationId);
    const balanceBefore = inventory?.currentBalance || 0;
    const balanceAfter = balanceBefore - params.quantity;
    
    return this.logTransaction({
      logDate: new Date(),
      medicationId: params.medicationId,
      medicationName: params.medicationName,
      genericName: undefined,
      deaSchedule: params.deaSchedule,
      transactionType: TransactionType.ADMINISTRATION,
      quantity: params.quantity,
      unit: params.unit,
      balanceBefore,
      balanceAfter,
      studentId: params.studentId,
      studentName: params.studentName,
      administeredBy: params.administeredBy,
      witnessedBy: params.witnessedBy,
      prescriptionNumber: params.prescriptionNumber,
      notes: params.notes,
      createdBy: params.administeredBy,
      schoolId: params.schoolId,
      requiresFollowUp: false,
      discrepancyReported: false
    });
  }
  
  /**
   * Log medication receipt from pharmacy/distributor
   */
  static async logReceipt(params: {
    medicationId: string;
    medicationName: string;
    deaSchedule: DEASchedule;
    quantity: number;
    unit: string;
    lotNumber: string;
    expirationDate: Date;
    invoiceNumber?: string;
    orderNumber?: string;
    deaFormNumber?: string;
    receivedBy: string;
    schoolId?: string;
  }): Promise<ControlledSubstanceLogEntry> {
    
    const inventory = this.inventory.get(params.medicationId);
    const balanceBefore = inventory?.currentBalance || 0;
    const balanceAfter = balanceBefore + params.quantity;
    
    return this.logTransaction({
      logDate: new Date(),
      medicationId: params.medicationId,
      medicationName: params.medicationName,
      deaSchedule: params.deaSchedule,
      transactionType: TransactionType.RECEIPT,
      quantity: params.quantity,
      unit: params.unit,
      balanceBefore,
      balanceAfter,
      lotNumber: params.lotNumber,
      expirationDate: params.expirationDate,
      invoiceNumber: params.invoiceNumber,
      orderNumber: params.orderNumber,
      deaFormNumber: params.deaFormNumber,
      createdBy: params.receivedBy,
      schoolId: params.schoolId,
      requiresFollowUp: false,
      discrepancyReported: false
    });
  }
  
  /**
   * Log medication waste/disposal
   */
  static async logWaste(params: {
    medicationId: string;
    medicationName: string;
    deaSchedule: DEASchedule;
    quantity: number;
    unit: string;
    reason: string;
    disposalMethod: string;
    disposalWitnessName: string;
    disposalWitnessLicense: string;
    wastedBy: string;
    witnessedBy: string;
    notes?: string;
    schoolId?: string;
  }): Promise<ControlledSubstanceLogEntry> {
    
    const inventory = this.inventory.get(params.medicationId);
    const balanceBefore = inventory?.currentBalance || 0;
    const balanceAfter = balanceBefore - params.quantity;
    
    return this.logTransaction({
      logDate: new Date(),
      medicationId: params.medicationId,
      medicationName: params.medicationName,
      deaSchedule: params.deaSchedule,
      transactionType: TransactionType.WASTE,
      quantity: params.quantity,
      unit: params.unit,
      balanceBefore,
      balanceAfter,
      reason: params.reason,
      disposalMethod: params.disposalMethod,
      disposalWitnessName: params.disposalWitnessName,
      disposalWitnessLicense: params.disposalWitnessLicense,
      disposalDate: new Date(),
      administeredBy: params.wastedBy,
      witnessedBy: params.witnessedBy,
      notes: params.notes,
      createdBy: params.wastedBy,
      schoolId: params.schoolId,
      requiresFollowUp: false,
      discrepancyReported: false
    });
  }
  
  /**
   * Perform inventory count and log discrepancies
   */
  static async performInventoryCount(params: {
    medicationId: string;
    medicationName: string;
    deaSchedule: DEASchedule;
    physicalCount: number;
    unit: string;
    countedBy: string;
    witnessedBy: string;
    schoolId?: string;
  }): Promise<{ discrepancy: number; logEntry: ControlledSubstanceLogEntry | null }> {
    
    const inventory = this.inventory.get(params.medicationId);
    const systemBalance = inventory?.currentBalance || 0;
    const discrepancy = params.physicalCount - systemBalance;
    
    if (discrepancy !== 0) {
      // Log inventory adjustment
      const logEntry = await this.logTransaction({
        logDate: new Date(),
        medicationId: params.medicationId,
        medicationName: params.medicationName,
        deaSchedule: params.deaSchedule,
        transactionType: TransactionType.INVENTORY_ADJUSTMENT,
        quantity: Math.abs(discrepancy),
        unit: params.unit,
        balanceBefore: systemBalance,
        balanceAfter: params.physicalCount,
        reason: `Inventory count discrepancy: Physical count ${params.physicalCount}, System balance ${systemBalance}`,
        administeredBy: params.countedBy,
        witnessedBy: params.witnessedBy,
        createdBy: params.countedBy,
        schoolId: params.schoolId,
        requiresFollowUp: Math.abs(discrepancy) > 5, // Flag large discrepancies
        discrepancyReported: true
      });
      
      logger.warn('Controlled substance inventory discrepancy detected', {
        medicationId: params.medicationId,
        medicationName: params.medicationName,
        expected: systemBalance,
        actual: params.physicalCount,
        discrepancy
      });
      
      return { discrepancy, logEntry };
    }
    
    // Update last inventory date
    if (inventory) {
      inventory.lastInventoryDate = new Date();
      inventory.nextInventoryDue = this.calculateNextInventoryDate(params.deaSchedule);
    }
    
    return { discrepancy: 0, logEntry: null };
  }
  
  /**
   * Get transaction history for a medication
   */
  static async getTransactionHistory(medicationId: string, startDate?: Date, endDate?: Date): Promise<ControlledSubstanceLogEntry[]> {
    try {
      let filtered = this.logs.filter(log => log.medicationId === medicationId);
      
      if (startDate) {
        filtered = filtered.filter(log => log.logDate >= startDate);
      }
      
      if (endDate) {
        filtered = filtered.filter(log => log.logDate <= endDate);
      }
      
      return filtered.sort((a, b) => b.logDate.getTime() - a.logDate.getTime());
      
    } catch (error) {
      logger.error('Error retrieving transaction history', { error, medicationId });
      throw error;
    }
  }
  
  /**
   * Get current inventory for all controlled substances
   */
  static async getCurrentInventory(schoolId?: string): Promise<ControlledSubstanceInventory[]> {
    try {
      const inventories = Array.from(this.inventory.values());
      
      if (schoolId) {
        // Filter by school if needed (would require schoolId in inventory)
        return inventories;
      }
      
      return inventories.sort((a, b) => a.medicationName.localeCompare(b.medicationName));
      
    } catch (error) {
      logger.error('Error retrieving controlled substance inventory', { error });
      throw error;
    }
  }
  
  /**
   * Generate DEA-compliant report for a date range
   */
  static async generateReport(startDate: Date, endDate: Date, generatedBy: string): Promise<ControlledSubstanceReport> {
    try {
      const medications = new Map<string, any>();
      
      // Get all medications that had transactions in this period
      const periodLogs = this.logs.filter(log => 
        log.logDate >= startDate && log.logDate <= endDate
      );
      
      // Calculate totals for each medication
      for (const log of periodLogs) {
        if (!medications.has(log.medicationId)) {
          medications.set(log.medicationId, {
            medicationId: log.medicationId,
            medicationName: log.medicationName,
            deaSchedule: log.deaSchedule,
            openingBalance: 0,
            receipts: 0,
            administered: 0,
            wasted: 0,
            transferred: 0,
            closingBalance: 0,
            expectedBalance: 0,
            discrepancy: 0,
            unit: log.unit
          });
        }
        
        const med = medications.get(log.medicationId);
        
        switch (log.transactionType) {
          case TransactionType.RECEIPT:
          case TransactionType.TRANSFER_IN:
            med.receipts += log.quantity;
            break;
          case TransactionType.ADMINISTRATION:
            med.administered += log.quantity;
            break;
          case TransactionType.WASTE:
          case TransactionType.EXPIRED:
            med.wasted += log.quantity;
            break;
          case TransactionType.TRANSFER_OUT:
          case TransactionType.RETURN:
            med.transferred += log.quantity;
            break;
        }
      }
      
      // Calculate expected vs actual balances
      const reportMedications = Array.from(medications.values()).map(med => {
        const inventory = this.inventory.get(med.medicationId);
        med.closingBalance = inventory?.currentBalance || 0;
        med.expectedBalance = med.openingBalance + med.receipts - med.administered - med.wasted - med.transferred;
        med.discrepancy = med.closingBalance - med.expectedBalance;
        return med;
      });
      
      const discrepanciesFound = reportMedications.filter(m => m.discrepancy !== 0).length;
      
      return {
        reportDate: new Date(),
        reportPeriodStart: startDate,
        reportPeriodEnd: endDate,
        medications: reportMedications,
        totalTransactions: periodLogs.length,
        discrepanciesFound,
        generatedBy
      };
      
    } catch (error) {
      logger.error('Error generating controlled substance report', { error });
      throw error;
    }
  }
  
  /**
   * Get medications requiring inventory count
   */
  static async getMedicationsDueForInventory(): Promise<ControlledSubstanceInventory[]> {
    const today = new Date();
    
    return Array.from(this.inventory.values()).filter(inv => 
      inv.nextInventoryDue <= today
    );
  }
  
  /**
   * Get logs requiring follow-up
   */
  static async getLogsRequiringFollowUp(): Promise<ControlledSubstanceLogEntry[]> {
    return this.logs.filter(log => log.requiresFollowUp && !log.verifiedBy);
  }
  
  /**
   * Verify a log entry (for follow-up resolution)
   */
  static async verifyLogEntry(logId: string, verifiedBy: string, notes?: string): Promise<ControlledSubstanceLogEntry> {
    const log = this.logs.find(l => l.id === logId);
    
    if (!log) {
      throw new Error('Log entry not found');
    }
    
    log.verifiedBy = verifiedBy;
    log.verificationDate = new Date();
    log.requiresFollowUp = false;
    log.updatedAt = new Date();
    
    if (notes) {
      log.notes = log.notes ? `${log.notes}\n\nVerification: ${notes}` : notes;
    }
    
    logger.info('Controlled substance log verified', { logId, verifiedBy });
    
    return log;
  }
  
  // === Private helper methods ===
  
  private static generateLogId(): string {
    return `CS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static validateLogEntry(entry: ControlledSubstanceLogEntry): void {
    // Required fields for all transactions
    if (!entry.medicationId || !entry.medicationName || !entry.deaSchedule) {
      throw new Error('Missing required medication information');
    }
    
    if (!entry.quantity || entry.quantity <= 0) {
      throw new Error('Invalid quantity');
    }
    
    // Transaction-specific validation
    switch (entry.transactionType) {
      case TransactionType.ADMINISTRATION:
        if (!entry.studentId || !entry.administeredBy) {
          throw new Error('Student and administrator information required for administration');
        }
        if (entry.deaSchedule === DEASchedule.SCHEDULE_II && !entry.witnessedBy) {
          logger.warn('Schedule II administration should have witness');
        }
        break;
        
      case TransactionType.RECEIPT:
        if (!entry.lotNumber || !entry.expirationDate) {
          throw new Error('Lot number and expiration date required for receipts');
        }
        break;
        
      case TransactionType.WASTE:
        if (!entry.reason || !entry.disposalMethod || !entry.witnessedBy) {
          throw new Error('Reason, disposal method, and witness required for waste');
        }
        break;
    }
  }
  
  private static async updateInventoryBalance(entry: ControlledSubstanceLogEntry): Promise<void> {
    let inventory = this.inventory.get(entry.medicationId);
    
    if (!inventory) {
      // Create new inventory record
      inventory = {
        medicationId: entry.medicationId,
        medicationName: entry.medicationName,
        deaSchedule: entry.deaSchedule,
        currentBalance: 0,
        unit: entry.unit,
        location: 'Nurse Office', // Default
        secureStorageLocation: 'Locked Cabinet A',
        lastInventoryDate: new Date(),
        nextInventoryDue: this.calculateNextInventoryDate(entry.deaSchedule),
        discrepancyCount: 0
      };
      this.inventory.set(entry.medicationId, inventory);
    }
    
    // Update balance based on transaction type
    switch (entry.transactionType) {
      case TransactionType.RECEIPT:
      case TransactionType.TRANSFER_IN:
        inventory.currentBalance += entry.quantity;
        break;
        
      case TransactionType.ADMINISTRATION:
      case TransactionType.WASTE:
      case TransactionType.EXPIRED:
      case TransactionType.TRANSFER_OUT:
      case TransactionType.RETURN:
        inventory.currentBalance -= entry.quantity;
        break;
        
      case TransactionType.INVENTORY_ADJUSTMENT:
        // Set to exact balance
        inventory.currentBalance = entry.balanceAfter;
        if (entry.discrepancyReported) {
          inventory.discrepancyCount++;
        }
        break;
    }
    
    // Ensure balance doesn't go negative
    if (inventory.currentBalance < 0) {
      logger.error('Negative inventory balance detected', {
        medicationId: entry.medicationId,
        balance: inventory.currentBalance
      });
      throw new Error('Insufficient inventory balance');
    }
  }
  
  private static calculateNextInventoryDate(schedule: DEASchedule): Date {
    const today = new Date();
    const nextDate = new Date(today);
    
    // Schedule II requires more frequent counts
    switch (schedule) {
      case DEASchedule.SCHEDULE_II:
        nextDate.setDate(today.getDate() + 30); // Monthly
        break;
      case DEASchedule.SCHEDULE_III:
      case DEASchedule.SCHEDULE_IV:
        nextDate.setDate(today.getDate() + 90); // Quarterly
        break;
      default:
        nextDate.setDate(today.getDate() + 180); // Semi-annually
    }
    
    return nextDate;
  }
}
