/**
 * Repository Factory
 * @description Factory for creating repository instances
 * Provides centralized access to all repository implementations
 */

import { IMedicationRepository } from '../interfaces/IMedicationRepository';
import { IHealthRecordRepository } from '../interfaces/IHealthRecordRepository';
import { IStudentRepository } from '../interfaces/IStudentRepository';
import { IIncidentReportRepository } from '../interfaces/IIncidentReportRepository';
import { IInventoryRepository } from '../interfaces/IInventoryRepository';

import { SequelizeMedicationRepository } from './SequelizeMedicationRepository';
import { SequelizeHealthRecordRepository } from './SequelizeHealthRecordRepository';
import { SequelizeStudentRepository } from './SequelizeStudentRepository';
import { SequelizeIncidentReportRepository } from './SequelizeIncidentReportRepository';
import { SequelizeInventoryRepository } from './SequelizeInventoryRepository';

/**
 * Repository Factory for creating repository instances
 * Uses Singleton pattern to ensure single instances of each repository
 */
export class RepositoryFactory {
  private static medicationRepository: IMedicationRepository;
  private static healthRecordRepository: IHealthRecordRepository;
  private static studentRepository: IStudentRepository;
  private static incidentReportRepository: IIncidentReportRepository;
  private static inventoryRepository: IInventoryRepository;

  /**
   * Get Medication Repository instance
   */
  static getMedicationRepository(): IMedicationRepository {
    if (!this.medicationRepository) {
      this.medicationRepository = new SequelizeMedicationRepository();
    }
    return this.medicationRepository;
  }

  /**
   * Get Health Record Repository instance
   */
  static getHealthRecordRepository(): IHealthRecordRepository {
    if (!this.healthRecordRepository) {
      this.healthRecordRepository = new SequelizeHealthRecordRepository();
    }
    return this.healthRecordRepository;
  }

  /**
   * Get Student Repository instance
   */
  static getStudentRepository(): IStudentRepository {
    if (!this.studentRepository) {
      this.studentRepository = new SequelizeStudentRepository();
    }
    return this.studentRepository;
  }

  /**
   * Get Incident Report Repository instance
   */
  static getIncidentReportRepository(): IIncidentReportRepository {
    if (!this.incidentReportRepository) {
      this.incidentReportRepository = new SequelizeIncidentReportRepository();
    }
    return this.incidentReportRepository;
  }

  /**
   * Get Inventory Repository instance
   */
  static getInventoryRepository(): IInventoryRepository {
    if (!this.inventoryRepository) {
      this.inventoryRepository = new SequelizeInventoryRepository();
    }
    return this.inventoryRepository;
  }

  /**
   * Clear all cached repository instances (for testing)
   */
  static clearCache(): void {
    this.medicationRepository = null as any;
    this.healthRecordRepository = null as any;
    this.studentRepository = null as any;
    this.incidentReportRepository = null as any;
    this.inventoryRepository = null as any;
  }

  /**
   * Create a new instance of all repositories (for testing)
   * This bypasses the singleton pattern and returns fresh instances
   */
  static createTestInstances() {
    return {
      medication: new SequelizeMedicationRepository(),
      healthRecord: new SequelizeHealthRecordRepository(),
      student: new SequelizeStudentRepository(),
      incidentReport: new SequelizeIncidentReportRepository(),
      inventory: new SequelizeInventoryRepository()
    };
  }
}

/**
 * Convenience exports for direct access to repositories
 */
export const medicationRepository = () => RepositoryFactory.getMedicationRepository();
export const healthRecordRepository = () => RepositoryFactory.getHealthRecordRepository();
export const studentRepository = () => RepositoryFactory.getStudentRepository();
export const incidentReportRepository = () => RepositoryFactory.getIncidentReportRepository();
export const inventoryRepository = () => RepositoryFactory.getInventoryRepository();
