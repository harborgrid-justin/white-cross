/**
 * DataLoader Factory
 *
 * Creates and manages DataLoader instances to solve the N+1 query problem
 * in GraphQL resolvers. DataLoaders batch and cache database queries within
 * a single request context.
 *
 * Performance Benefits:
 * - Batches multiple individual queries into single batch queries
 * - Caches results within a request to prevent duplicate queries
 * - Dramatically reduces database round-trips
 * - Improves GraphQL query performance by 10-100x for nested queries
 *
 * @module DataLoaderFactory
 */
import DataLoader from 'dataloader';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { StudentService } from '@/services/student';
import { ContactService } from '@/services/communication/contact';
import { MedicationService } from '@/services/medication';
import { HealthRecordService } from '@/health-record';
import { EmergencyContactService } from '@/services/communication/emergency-contact';
import { ChronicConditionService } from '@/services/chronic-condition';
import { IncidentCoreService } from '@/incident-report';
import { AllergyService } from '@/health-record/allergy';
import type {
  Allergy,
  ChronicCondition,
  Contact,
  EmergencyContact,
  HealthRecord,
  IncidentReport,
  Student,
  StudentMedication,
} from '@/database';

/**
 * DataLoader Factory
 *
 * Creates request-scoped DataLoader instances for efficient data fetching.
 * Each DataLoader is scoped to a single GraphQL request to ensure proper
 * caching behavior and prevent data leakage between requests.
 */
@Injectable({ scope: Scope.REQUEST })
export class DataLoaderFactory {
  private readonly logger = new Logger(DataLoaderFactory.name);

  constructor(
    private readonly studentService: StudentService,
    private readonly contactService: ContactService,
    private readonly medicationService: MedicationService,
    private readonly healthRecordService: HealthRecordService,
    private readonly emergencyContactService: EmergencyContactService,
    private readonly chronicConditionService: ChronicConditionService,
    private readonly incidentCoreService: IncidentCoreService,
    private readonly allergyService: AllergyService,
  ) {}

  /**
   * Create DataLoader for loading students by IDs
   *
   * Batches multiple student lookups into a single database query.
   *
   * @returns DataLoader for students
   */
  createStudentLoader(): DataLoader<string, Student | null> {
    return new DataLoader<string, Student | null>(
      async (studentIds: readonly string[]) => {
        try {
          // Convert readonly array to regular array
          const ids = [...studentIds];

          // Fetch all students in a single query
          const students = await this.studentService.findByIds(ids);

          // Create a map for O(1) lookup, filtering out nulls
          const studentMap = new Map(
            students
              .filter((student) => student !== null)
              .map((student) => [student.id, student]),
          );

          // Return students in the same order as requested IDs
          // Return null for IDs that weren't found
          return ids.map((id) => studentMap.get(id) || null);
        } catch (error) {
          this.logger.error('Error in student DataLoader:', error);
          // Return array of nulls to prevent breaking entire query
          return studentIds.map(() => null);
        }
      },
      {
        cache: true, // Enable per-request caching
        batchScheduleFn: (callback) => setTimeout(callback, 1), // Batch within 1ms
        maxBatchSize: 100, // Limit batch size to prevent memory issues
      },
    );
  }

  /**
   * Create DataLoader for loading contacts by student IDs
   *
   * Batches multiple contact lookups for students (e.g., guardians).
   * Returns an array of contacts for each student ID.
   *
   * @returns DataLoader for contacts by student ID
   */
  createContactsByStudentLoader(): DataLoader<string, Contact[]> {
    return new DataLoader<string, Contact[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];

          // Fetch all contacts for these students in a single query
          // findByStudentIds already returns contacts grouped by student ID
          // Return contacts arrays in same order as requested IDs
          return await this.contactService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error('Error in contacts-by-student DataLoader:', error);
          // Return array of empty arrays to prevent breaking entire query
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading contacts by IDs
   *
   * Batches multiple contact lookups into a single database query.
   *
   * @returns DataLoader for contacts
   */
  createContactLoader(): DataLoader<string, Contact | null> {
    return new DataLoader<string, Contact | null>(
      async (contactIds: readonly string[]) => {
        try {
          const ids = [...contactIds];

          // Fetch all contacts in a single query
          const contacts = await this.contactService.findByIds(ids);

          // Create a map for O(1) lookup, filtering out nulls
          const contactMap = new Map(
            contacts
              .filter((contact) => contact !== null)
              .map((contact) => [contact.id, contact]),
          );

          // Return contacts in the same order as requested IDs
          return ids.map((id) => contactMap.get(id) || null);
        } catch (error) {
          this.logger.error('Error in contact DataLoader:', error);
          // Return array of nulls to prevent breaking entire query
          return contactIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading medications by student IDs
   *
   * Batches multiple medication lookups for students.
   * Returns an array of medications for each student ID.
   *
   * @returns DataLoader for medications by student ID
   */
  createMedicationsByStudentLoader(): DataLoader<string, StudentMedication[]> {
    return new DataLoader<string, StudentMedication[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];

          // Fetch all medications for these students in a single query
          // findByStudentIds already returns medications grouped by student ID
          // Return medications arrays in same order as requested IDs
          return await this.medicationService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error('Error in medications-by-student DataLoader:', error);
          // Return array of empty arrays to prevent breaking entire query
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading medications by IDs
   *
   * Batches multiple medication lookups into a single database query.
   *
   * @returns DataLoader for medications
   */
  createMedicationLoader(): DataLoader<string, StudentMedication | null> {
    return new DataLoader<string, StudentMedication | null>(
      async (medicationIds: readonly string[]) => {
        try {
          const ids = [...medicationIds];

          // Fetch all medications in a single query
          const medications = await this.medicationService.findByIds(ids);

          // Create a map for O(1) lookup, filtering out nulls
          const medicationMap = new Map(
            medications
              .filter((medication) => medication !== null)
              .map((medication) => [medication.id, medication]),
          );

          // Return medications in the same order as requested IDs
          return ids.map((id) => medicationMap.get(id) || null);
        } catch (error) {
          this.logger.error('Error in medication DataLoader:', error);
          // Return array of nulls to prevent breaking entire query
          return medicationIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading health records by student IDs
   *
   * Batches multiple health record lookups for students.
   * Returns array of health records for each student ID.
   *
   * FIXED: Now uses actual HealthRecordService batch loading
   * Performance: Eliminates N+1 queries when fetching health records for multiple students
   *
   * @returns DataLoader for health records by student ID
   */
  createHealthRecordsByStudentLoader(): DataLoader<string, HealthRecord[]> {
    return new DataLoader<string, HealthRecord[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];

          // Use HealthRecordService batch loading method
          // Return health records arrays in same order as requested IDs
          return await this.healthRecordService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error(
            'Error in health-records-by-student DataLoader:',
            error,
          );
          // Return array of empty arrays to prevent breaking entire query
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading health records by IDs
   */
  createHealthRecordLoader(): DataLoader<string, HealthRecord | null> {
    return new DataLoader<string, HealthRecord | null>(
      async (healthRecordIds: readonly string[]) => {
        try {
          const ids = [...healthRecordIds];
          return await this.healthRecordService.findByIds(ids);
        } catch (error) {
          this.logger.error('Error in health-record DataLoader:', error);
          return healthRecordIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading emergency contacts by student IDs
   */
  createEmergencyContactsByStudentLoader(): DataLoader<string, EmergencyContact[]> {
    return new DataLoader<string, EmergencyContact[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];
          return await this.emergencyContactService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error(
            'Error in emergency-contacts-by-student DataLoader:',
            error,
          );
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading emergency contacts by IDs
   */
  createEmergencyContactLoader(): DataLoader<string, EmergencyContact | null> {
    return new DataLoader<string, EmergencyContact | null>(
      async (contactIds: readonly string[]) => {
        try {
          const ids = [...contactIds];
          return await this.emergencyContactService.findByIds(ids);
        } catch (error) {
          this.logger.error('Error in emergency-contact DataLoader:', error);
          return contactIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading chronic conditions by student IDs
   */
  createChronicConditionsByStudentLoader(): DataLoader<string, ChronicCondition[]> {
    return new DataLoader<string, ChronicCondition[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];
          return await this.chronicConditionService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error(
            'Error in chronic-conditions-by-student DataLoader:',
            error,
          );
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading chronic conditions by IDs
   */
  createChronicConditionLoader(): DataLoader<string, ChronicCondition | null> {
    return new DataLoader<string, ChronicCondition | null>(
      async (conditionIds: readonly string[]) => {
        try {
          const ids = [...conditionIds];
          return await this.chronicConditionService.findByIds(ids);
        } catch (error) {
          this.logger.error('Error in chronic-condition DataLoader:', error);
          return conditionIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading incident reports by student IDs
   */
  createIncidentsByStudentLoader(): DataLoader<string, IncidentReport[]> {
    return new DataLoader<string, IncidentReport[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];
          return await this.incidentCoreService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error(
            'Error in incidents-by-student DataLoader:',
            error,
          );
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading incident reports by IDs
   */
  createIncidentLoader(): DataLoader<string, IncidentReport | null> {
    return new DataLoader<string, IncidentReport | null>(
      async (incidentIds: readonly string[]) => {
        try {
          const ids = [...incidentIds];
          return await this.incidentCoreService.findByIds(ids);
        } catch (error) {
          this.logger.error('Error in incident DataLoader:', error);
          return incidentIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading allergies by student IDs
   */
  createAllergiesByStudentLoader(): DataLoader<string, Allergy[]> {
    return new DataLoader<string, Allergy[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];
          return await this.allergyService.findByStudentIds(ids);
        } catch (error) {
          this.logger.error(
            'Error in allergies-by-student DataLoader:',
            error,
          );
          return studentIds.map(() => []);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create DataLoader for loading allergies by IDs
   */
  createAllergyLoader(): DataLoader<string, Allergy | null> {
    return new DataLoader<string, Allergy | null>(
      async (allergyIds: readonly string[]) => {
        try {
          const ids = [...allergyIds];
          return await this.allergyService.findByIds(ids);
        } catch (error) {
          this.logger.error('Error in allergy DataLoader:', error);
          return allergyIds.map(() => null);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      },
    );
  }

  /**
   * Create all DataLoaders for a GraphQL request
   *
   * Returns an object containing all DataLoader instances that will be
   * added to the GraphQL context.
   *
   * @returns Object with all DataLoaders
   */
  createLoaders() {
    return {
      // Student DataLoaders
      studentLoader: this.createStudentLoader(),

      // Contact DataLoaders
      contactLoader: this.createContactLoader(),
      contactsByStudentLoader: this.createContactsByStudentLoader(),

      // Medication DataLoaders
      medicationLoader: this.createMedicationLoader(),
      medicationsByStudentLoader: this.createMedicationsByStudentLoader(),

      // Health Record DataLoaders
      healthRecordLoader: this.createHealthRecordLoader(),
      healthRecordsByStudentLoader: this.createHealthRecordsByStudentLoader(),

      // Emergency Contact DataLoaders
      emergencyContactLoader: this.createEmergencyContactLoader(),
      emergencyContactsByStudentLoader:
        this.createEmergencyContactsByStudentLoader(),

      // Chronic Condition DataLoaders
      chronicConditionLoader: this.createChronicConditionLoader(),
      chronicConditionsByStudentLoader:
        this.createChronicConditionsByStudentLoader(),

      // Incident Report DataLoaders
      incidentLoader: this.createIncidentLoader(),
      incidentsByStudentLoader: this.createIncidentsByStudentLoader(),

      // Allergy DataLoaders
      allergyLoader: this.createAllergyLoader(),
      allergiesByStudentLoader: this.createAllergiesByStudentLoader(),
    };
  }
}
