/**
 * LOC: 6601A30146
 * WC-GEN-114 | RepositoryFactory.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - IAuditLogger.ts (database/audit/IAuditLogger.ts)
 *   - ICacheManager.ts (database/cache/ICacheManager.ts)
 *   - StudentRepository.ts (database/repositories/impl/StudentRepository.ts)
 *   - UserRepository.ts (database/repositories/impl/UserRepository.ts)
 *   - HealthRecordRepository.ts (database/repositories/impl/HealthRecordRepository.ts)
 *   - ... and 10 more
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-114 | RepositoryFactory.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../audit/IAuditLogger, ../cache/ICacheManager, ./impl/StudentRepository | Dependencies: ../audit/IAuditLogger, ../cache/ICacheManager, ./impl/StudentRepository
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces, functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
import { ChronicConditionRepository } from './impl/ChronicConditionRepository';

// New repositories
import { ContactRepository } from './impl/ContactRepository';
import { EmergencyContactRepository } from './impl/EmergencyContactRepository';
import { RoleRepository } from './impl/RoleRepository';
import { PermissionRepository } from './impl/PermissionRepository';
import { SessionRepository } from './impl/SessionRepository';
import { DocumentRepository } from './impl/DocumentRepository';
import { MessageRepository } from './impl/MessageRepository';
import { IncidentReportRepository } from './impl/IncidentReportRepository';
import { IntegrationConfigRepository } from './impl/IntegrationConfigRepository';
import { IntegrationLogRepository } from './impl/IntegrationLogRepository';
import { MedicationLogRepository } from './impl/MedicationLogRepository';
import { MedicationInventoryRepository } from './impl/MedicationInventoryRepository';
import { StudentMedicationRepository } from './impl/StudentMedicationRepository';
import { VaccinationRepository } from './impl/VaccinationRepository';
import { ScreeningRepository } from './impl/ScreeningRepository';
import { GrowthMeasurementRepository } from './impl/GrowthMeasurementRepository';
import { VitalSignsRepository } from './impl/VitalSignsRepository';
import { InventoryItemRepository } from './impl/InventoryItemRepository';
import { ComplianceReportRepository } from './impl/ComplianceReportRepository';
import { ConsentFormRepository } from './impl/ConsentFormRepository';
import { SystemConfigurationRepository } from './impl/SystemConfigurationRepository';
import { BackupLogRepository } from './impl/BackupLogRepository';
import { LicenseRepository } from './impl/LicenseRepository';
import { TrainingModuleRepository } from './impl/TrainingModuleRepository';
import { AppointmentReminderRepository } from './impl/AppointmentReminderRepository';
import { BudgetCategoryRepository } from './impl/BudgetCategoryRepository';
import { BudgetTransactionRepository } from './impl/BudgetTransactionRepository';

// Import repository interfaces
import { IStudentRepository } from './interfaces/IStudentRepository';
import { IHealthRecordRepository } from './interfaces/IHealthRecordRepository';
import { IAllergyRepository } from './interfaces/IAllergyRepository';
import { IAuditLogRepository } from './interfaces/IAuditLogRepository';
import { IContactRepository } from './interfaces/IContactRepository';
import { IRoleRepository } from './interfaces/IRoleRepository';
import { IPermissionRepository } from './interfaces/IPermissionRepository';
import { IDocumentRepository } from './interfaces/IDocumentRepository';
import { IMessageRepository } from './interfaces/IMessageRepository';
import { IIncidentReportRepository } from './interfaces/IIncidentReportRepository';

/**
 * Repository Factory Interface
 * Defines all available repositories
 */
export interface IRepositoryFactory {
  // Core repositories
  getStudentRepository(): IStudentRepository;
  getUserRepository(): UserRepository;
  getContactRepository(): IContactRepository;
  getEmergencyContactRepository(): EmergencyContactRepository;

  // Healthcare repositories
  getHealthRecordRepository(): IHealthRecordRepository;
  getAllergyRepository(): IAllergyRepository;
  getMedicationRepository(): MedicationRepository;
  getAppointmentRepository(): AppointmentRepository;
  getChronicConditionRepository(): ChronicConditionRepository;
  getVaccinationRepository(): VaccinationRepository;
  getScreeningRepository(): ScreeningRepository;
  getGrowthMeasurementRepository(): GrowthMeasurementRepository;
  getVitalSignsRepository(): VitalSignsRepository;

  // Medication management
  getMedicationLogRepository(): MedicationLogRepository;
  getMedicationInventoryRepository(): MedicationInventoryRepository;
  getStudentMedicationRepository(): StudentMedicationRepository;

  // Security and access control
  getRoleRepository(): IRoleRepository;
  getPermissionRepository(): IPermissionRepository;
  getSessionRepository(): SessionRepository;

  // Documents
  getDocumentRepository(): IDocumentRepository;

  // Communication
  getMessageRepository(): IMessageRepository;

  // Incidents
  getIncidentReportRepository(): IIncidentReportRepository;

  // Integration
  getIntegrationConfigRepository(): IntegrationConfigRepository;
  getIntegrationLogRepository(): IntegrationLogRepository;

  // Inventory
  getInventoryItemRepository(): InventoryItemRepository;

  // Compliance
  getAuditLogRepository(): IAuditLogRepository;
  getComplianceReportRepository(): ComplianceReportRepository;
  getConsentFormRepository(): ConsentFormRepository;

  // Administration repositories
  getDistrictRepository(): DistrictRepository;
  getSchoolRepository(): SchoolRepository;
  getSystemConfigurationRepository(): SystemConfigurationRepository;
  getBackupLogRepository(): BackupLogRepository;
  getLicenseRepository(): LicenseRepository;
  getTrainingModuleRepository(): TrainingModuleRepository;

  // Operations
  getAppointmentReminderRepository(): AppointmentReminderRepository;

  // Budget
  getBudgetCategoryRepository(): BudgetCategoryRepository;
  getBudgetTransactionRepository(): BudgetTransactionRepository;
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
  private chronicConditionRepository?: ChronicConditionRepository;
  
  // New repositories
  private contactRepository?: ContactRepository;
  private emergencyContactRepository?: EmergencyContactRepository;
  private roleRepository?: RoleRepository;
  private permissionRepository?: PermissionRepository;
  private sessionRepository?: SessionRepository;
  private documentRepository?: DocumentRepository;
  private messageRepository?: MessageRepository;
  private incidentReportRepository?: IncidentReportRepository;
  private integrationConfigRepository?: IntegrationConfigRepository;
  private integrationLogRepository?: IntegrationLogRepository;
  private medicationLogRepository?: MedicationLogRepository;
  private medicationInventoryRepository?: MedicationInventoryRepository;
  private studentMedicationRepository?: StudentMedicationRepository;
  private vaccinationRepository?: VaccinationRepository;
  private screeningRepository?: ScreeningRepository;
  private growthMeasurementRepository?: GrowthMeasurementRepository;
  private vitalSignsRepository?: VitalSignsRepository;
  private inventoryItemRepository?: InventoryItemRepository;
  private complianceReportRepository?: ComplianceReportRepository;
  private consentFormRepository?: ConsentFormRepository;
  private systemConfigurationRepository?: SystemConfigurationRepository;
  private backupLogRepository?: BackupLogRepository;
  private licenseRepository?: LicenseRepository;
  private trainingModuleRepository?: TrainingModuleRepository;
  private appointmentReminderRepository?: AppointmentReminderRepository;
  private budgetCategoryRepository?: BudgetCategoryRepository;
  private budgetTransactionRepository?: BudgetTransactionRepository;

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
   * Get Chronic Condition Repository
   */
  public getChronicConditionRepository(): ChronicConditionRepository {
    if (!this.chronicConditionRepository) {
      this.chronicConditionRepository = new ChronicConditionRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.chronicConditionRepository;
  }

  /**
   * Get Contact Repository
   */
  public getContactRepository(): IContactRepository {
    if (!this.contactRepository) {
      this.contactRepository = new ContactRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.contactRepository;
  }

  /**
   * Get Emergency Contact Repository
   */
  public getEmergencyContactRepository(): EmergencyContactRepository {
    if (!this.emergencyContactRepository) {
      this.emergencyContactRepository = new EmergencyContactRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.emergencyContactRepository;
  }

  /**
   * Get Role Repository
   */
  public getRoleRepository(): IRoleRepository {
    if (!this.roleRepository) {
      this.roleRepository = new RoleRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.roleRepository;
  }

  /**
   * Get Permission Repository
   */
  public getPermissionRepository(): IPermissionRepository {
    if (!this.permissionRepository) {
      this.permissionRepository = new PermissionRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.permissionRepository;
  }

  /**
   * Get Session Repository
   */
  public getSessionRepository(): SessionRepository {
    if (!this.sessionRepository) {
      this.sessionRepository = new SessionRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.sessionRepository;
  }

  /**
   * Get Document Repository
   */
  public getDocumentRepository(): IDocumentRepository {
    if (!this.documentRepository) {
      this.documentRepository = new DocumentRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.documentRepository;
  }

  /**
   * Get Message Repository
   */
  public getMessageRepository(): IMessageRepository {
    if (!this.messageRepository) {
      this.messageRepository = new MessageRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.messageRepository;
  }

  /**
   * Get Incident Report Repository
   */
  public getIncidentReportRepository(): IIncidentReportRepository {
    if (!this.incidentReportRepository) {
      this.incidentReportRepository = new IncidentReportRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.incidentReportRepository;
  }

  /**
   * Get Integration Config Repository
   */
  public getIntegrationConfigRepository(): IntegrationConfigRepository {
    if (!this.integrationConfigRepository) {
      this.integrationConfigRepository = new IntegrationConfigRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.integrationConfigRepository;
  }

  /**
   * Get Integration Log Repository
   */
  public getIntegrationLogRepository(): IntegrationLogRepository {
    if (!this.integrationLogRepository) {
      this.integrationLogRepository = new IntegrationLogRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.integrationLogRepository;
  }

  /**
   * Get Medication Log Repository
   */
  public getMedicationLogRepository(): MedicationLogRepository {
    if (!this.medicationLogRepository) {
      this.medicationLogRepository = new MedicationLogRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.medicationLogRepository;
  }

  /**
   * Get Medication Inventory Repository
   */
  public getMedicationInventoryRepository(): MedicationInventoryRepository {
    if (!this.medicationInventoryRepository) {
      this.medicationInventoryRepository = new MedicationInventoryRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.medicationInventoryRepository;
  }

  /**
   * Get Student Medication Repository
   */
  public getStudentMedicationRepository(): StudentMedicationRepository {
    if (!this.studentMedicationRepository) {
      this.studentMedicationRepository = new StudentMedicationRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.studentMedicationRepository;
  }

  /**
   * Get Vaccination Repository
   */
  public getVaccinationRepository(): VaccinationRepository {
    if (!this.vaccinationRepository) {
      this.vaccinationRepository = new VaccinationRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.vaccinationRepository;
  }

  /**
   * Get Screening Repository
   */
  public getScreeningRepository(): ScreeningRepository {
    if (!this.screeningRepository) {
      this.screeningRepository = new ScreeningRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.screeningRepository;
  }

  /**
   * Get Growth Measurement Repository
   */
  public getGrowthMeasurementRepository(): GrowthMeasurementRepository {
    if (!this.growthMeasurementRepository) {
      this.growthMeasurementRepository = new GrowthMeasurementRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.growthMeasurementRepository;
  }

  /**
   * Get Vital Signs Repository
   */
  public getVitalSignsRepository(): VitalSignsRepository {
    if (!this.vitalSignsRepository) {
      this.vitalSignsRepository = new VitalSignsRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.vitalSignsRepository;
  }

  /**
   * Get Inventory Item Repository
   */
  public getInventoryItemRepository(): InventoryItemRepository {
    if (!this.inventoryItemRepository) {
      this.inventoryItemRepository = new InventoryItemRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.inventoryItemRepository;
  }

  /**
   * Get Compliance Report Repository
   */
  public getComplianceReportRepository(): ComplianceReportRepository {
    if (!this.complianceReportRepository) {
      this.complianceReportRepository = new ComplianceReportRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.complianceReportRepository;
  }

  /**
   * Get Consent Form Repository
   */
  public getConsentFormRepository(): ConsentFormRepository {
    if (!this.consentFormRepository) {
      this.consentFormRepository = new ConsentFormRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.consentFormRepository;
  }

  /**
   * Get System Configuration Repository
   */
  public getSystemConfigurationRepository(): SystemConfigurationRepository {
    if (!this.systemConfigurationRepository) {
      this.systemConfigurationRepository = new SystemConfigurationRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.systemConfigurationRepository;
  }

  /**
   * Get Backup Log Repository
   */
  public getBackupLogRepository(): BackupLogRepository {
    if (!this.backupLogRepository) {
      this.backupLogRepository = new BackupLogRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.backupLogRepository;
  }

  /**
   * Get License Repository
   */
  public getLicenseRepository(): LicenseRepository {
    if (!this.licenseRepository) {
      this.licenseRepository = new LicenseRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.licenseRepository;
  }

  /**
   * Get Training Module Repository
   */
  public getTrainingModuleRepository(): TrainingModuleRepository {
    if (!this.trainingModuleRepository) {
      this.trainingModuleRepository = new TrainingModuleRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.trainingModuleRepository;
  }

  /**
   * Get Appointment Reminder Repository
   */
  public getAppointmentReminderRepository(): AppointmentReminderRepository {
    if (!this.appointmentReminderRepository) {
      this.appointmentReminderRepository = new AppointmentReminderRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.appointmentReminderRepository;
  }

  /**
   * Get Budget Category Repository
   */
  public getBudgetCategoryRepository(): BudgetCategoryRepository {
    if (!this.budgetCategoryRepository) {
      this.budgetCategoryRepository = new BudgetCategoryRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.budgetCategoryRepository;
  }

  /**
   * Get Budget Transaction Repository
   */
  public getBudgetTransactionRepository(): BudgetTransactionRepository {
    if (!this.budgetTransactionRepository) {
      this.budgetTransactionRepository = new BudgetTransactionRepository(
        this.auditLogger,
        this.cacheManager
      );
    }
    return this.budgetTransactionRepository;
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
