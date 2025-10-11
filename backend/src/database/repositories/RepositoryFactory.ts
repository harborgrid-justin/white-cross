/**
 * Repository Factory
 * Provides centralized repository instantiation with dependency injection
 *
 * Features:
 * - Singleton pattern for shared audit logger and cache manager
 * - Lazy initialization of repositories
 * - Type-safe repository access
 * - Easy testing with mock implementations
 */

import { IAuditLogger } from '../audit/IAuditLogger';
import { ICacheManager } from '../cache/ICacheManager';

// Import all repository implementations
import { StudentRepository } from './impl/StudentRepository';
import { UserRepository } from './impl/UserRepository';
import { HealthRecordRepository } from './impl/HealthRecordRepository';
import { AllergyRepository } from './impl/AllergyRepository';
import { MedicationRepository } from './impl/MedicationRepository';
import { AuditLogRepository } from './impl/AuditLogRepository';
import { AppointmentRepository } from './impl/AppointmentRepository';
import { DistrictRepository } from './impl/DistrictRepository';
import { SchoolRepository } from './impl/SchoolRepository';

// Import repository interfaces
import { IStudentRepository } from './interfaces/IStudentRepository';
import { IHealthRecordRepository } from './interfaces/IHealthRecordRepository';
import { IAllergyRepository } from './interfaces/IAllergyRepository';
import { IAuditLogRepository } from './interfaces/IAuditLogRepository';

/**
 * Repository Factory Interface
 * Defines all available repositories
 */
export interface IRepositoryFactory {
  // Core repositories
  getStudentRepository(): IStudentRepository;
  getUserRepository(): UserRepository;

  // Healthcare repositories
  getHealthRecordRepository(): IHealthRecordRepository;
  getAllergyRepository(): IAllergyRepository;
  getMedicationRepository(): MedicationRepository;
  getAppointmentRepository(): AppointmentRepository;

  // Compliance repositories
  getAuditLogRepository(): IAuditLogRepository;

  // Administration repositories
  getDistrictRepository(): DistrictRepository;
  getSchoolRepository(): SchoolRepository;
}

/**
 * Repository Factory Implementation
 * Singleton pattern with lazy initialization
 */
export class RepositoryFactory implements IRepositoryFactory {
  private static instance: RepositoryFactory;

  // Shared dependencies
  private readonly auditLogger: IAuditLogger;
  private readonly cacheManager: ICacheManager;

  // Repository instances (lazily initialized)
  private studentRepository?: StudentRepository;
  private userRepository?: UserRepository;
  private healthRecordRepository?: HealthRecordRepository;
  private allergyRepository?: AllergyRepository;
  private medicationRepository?: MedicationRepository;
  private auditLogRepository?: AuditLogRepository;
  private appointmentRepository?: AppointmentRepository;
  private districtRepository?: DistrictRepository;
  private schoolRepository?: SchoolRepository;

  /**
   * Private constructor for singleton pattern
   * @param auditLogger Audit logger implementation
   * @param cacheManager Cache manager implementation
   */
  private constructor(
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
  }

  /**
   * Get or create singleton instance
   * @param auditLogger Audit logger implementation
   * @param cacheManager Cache manager implementation
   * @returns Repository factory instance
   */
  public static getInstance(
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory(
        auditLogger,
        cacheManager
      );
    }
    return RepositoryFactory.instance;
  }

  /**
   * Reset singleton instance (for testing)
   */
  public static resetInstance(): void {
    RepositoryFactory.instance = null as any;
  }

  // ============ Repository Getters ============

  /**
   * Get Student Repository
   */
  public getStudentRepository(): IStudentRepository {
    if (!this.studentRepository) {
      this.studentRepository = new StudentRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.studentRepository;
  }

  /**
   * Get User Repository
   */
  public getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.userRepository;
  }

  /**
   * Get Health Record Repository
   */
  public getHealthRecordRepository(): IHealthRecordRepository {
    if (!this.healthRecordRepository) {
      this.healthRecordRepository = new HealthRecordRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.healthRecordRepository;
  }

  /**
   * Get Allergy Repository
   */
  public getAllergyRepository(): IAllergyRepository {
    if (!this.allergyRepository) {
      this.allergyRepository = new AllergyRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.allergyRepository;
  }

  /**
   * Get Medication Repository
   */
  public getMedicationRepository(): MedicationRepository {
    if (!this.medicationRepository) {
      this.medicationRepository = new MedicationRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.medicationRepository;
  }

  /**
   * Get Audit Log Repository
   */
  public getAuditLogRepository(): IAuditLogRepository {
    if (!this.auditLogRepository) {
      this.auditLogRepository = new AuditLogRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.auditLogRepository;
  }

  /**
   * Get Appointment Repository
   */
  public getAppointmentRepository(): AppointmentRepository {
    if (!this.appointmentRepository) {
      this.appointmentRepository = new AppointmentRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.appointmentRepository;
  }

  /**
   * Get District Repository
   */
  public getDistrictRepository(): DistrictRepository {
    if (!this.districtRepository) {
      this.districtRepository = new DistrictRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.districtRepository;
  }

  /**
   * Get School Repository
   */
  public getSchoolRepository(): SchoolRepository {
    if (!this.schoolRepository) {
      this.schoolRepository = new SchoolRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.schoolRepository;
  }

  /**
   * Get all repositories as an object
   * Useful for dependency injection containers
   */
  public getAllRepositories(): {
    student: IStudentRepository;
    user: UserRepository;
    healthRecord: IHealthRecordRepository;
    allergy: IAllergyRepository;
    medication: MedicationRepository;
    auditLog: IAuditLogRepository;
    appointment: AppointmentRepository;
    district: DistrictRepository;
    school: SchoolRepository;
  } {
    return {
      student: this.getStudentRepository(),
      user: this.getUserRepository(),
      healthRecord: this.getHealthRecordRepository(),
      allergy: this.getAllergyRepository(),
      medication: this.getMedicationRepository(),
      auditLog: this.getAuditLogRepository(),
      appointment: this.getAppointmentRepository(),
      district: this.getDistrictRepository(),
      school: this.getSchoolRepository()
    };
  }
}

/**
 * Helper function to create repository factory instance
 * @param auditLogger Audit logger implementation
 * @param cacheManager Cache manager implementation
 * @returns Repository factory instance
 */
export function createRepositoryFactory(
  auditLogger: IAuditLogger,
  cacheManager: ICacheManager
): RepositoryFactory {
  return RepositoryFactory.getInstance(auditLogger, cacheManager);
}

/**
 * Default export for convenience
 */
export default RepositoryFactory;
