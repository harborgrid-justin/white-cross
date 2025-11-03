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
import { Injectable, Scope } from '@nestjs/common';
import { StudentService } from '../../../student/student.service';
import { ContactService } from '../../../contact/services/contact.service';
import { MedicationService } from '../../../medication/services/medication.service';

/**
 * DataLoader Factory
 *
 * Creates request-scoped DataLoader instances for efficient data fetching.
 * Each DataLoader is scoped to a single GraphQL request to ensure proper
 * caching behavior and prevent data leakage between requests.
 */
@Injectable({ scope: Scope.REQUEST })
export class DataLoaderFactory {
  constructor(
    private readonly studentService: StudentService,
    private readonly contactService: ContactService,
    private readonly medicationService: MedicationService,
  ) {}

  /**
   * Create DataLoader for loading students by IDs
   *
   * Batches multiple student lookups into a single database query.
   *
   * @returns DataLoader for students
   */
  createStudentLoader(): DataLoader<string, any> {
    return new DataLoader<string, any>(
      async (studentIds: readonly string[]) => {
        try {
          // Convert readonly array to regular array
          const ids = [...studentIds];

          // Fetch all students in a single query
          const students = await this.studentService.findByIds(ids);

          // Create a map for O(1) lookup
          const studentMap = new Map(
            students.map((student) => [student.id, student])
          );

          // Return students in the same order as requested IDs
          // Return null for IDs that weren't found
          return ids.map((id) => studentMap.get(id) || null);
        } catch (error) {
          console.error('Error in student DataLoader:', error);
          // Return array of errors matching the input length
          return studentIds.map(() => error);
        }
      },
      {
        cache: true, // Enable per-request caching
        batchScheduleFn: (callback) => setTimeout(callback, 1), // Batch within 1ms
        maxBatchSize: 100, // Limit batch size to prevent memory issues
      }
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
  createContactsByStudentLoader(): DataLoader<string, any[]> {
    return new DataLoader<string, any[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];

          // Fetch all contacts for these students in a single query
          const allContacts = await this.contactService.findByStudentIds(ids);

          // Group contacts by student ID
          const contactsByStudentId = new Map<string, any[]>();
          allContacts.forEach((contact) => {
            const studentId = contact.relationTo;
            if (!contactsByStudentId.has(studentId)) {
              contactsByStudentId.set(studentId, []);
            }
            contactsByStudentId.get(studentId)!.push(contact);
          });

          // Return contacts array for each student ID (empty array if none)
          return ids.map((id) => contactsByStudentId.get(id) || []);
        } catch (error) {
          console.error('Error in contacts-by-student DataLoader:', error);
          return studentIds.map(() => error);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      }
    );
  }

  /**
   * Create DataLoader for loading contacts by IDs
   *
   * Batches multiple contact lookups into a single database query.
   *
   * @returns DataLoader for contacts
   */
  createContactLoader(): DataLoader<string, any> {
    return new DataLoader<string, any>(
      async (contactIds: readonly string[]) => {
        try {
          const ids = [...contactIds];

          // Fetch all contacts in a single query
          const contacts = await this.contactService.findByIds(ids);

          // Create a map for O(1) lookup
          const contactMap = new Map(
            contacts.map((contact) => [contact.id, contact])
          );

          // Return contacts in the same order as requested IDs
          return ids.map((id) => contactMap.get(id) || null);
        } catch (error) {
          console.error('Error in contact DataLoader:', error);
          return contactIds.map(() => error);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      }
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
  createMedicationsByStudentLoader(): DataLoader<string, any[]> {
    return new DataLoader<string, any[]>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];

          // Fetch all medications for these students in a single query
          const allMedications = await this.medicationService.findByStudentIds(ids);

          // Group medications by student ID
          const medicationsByStudentId = new Map<string, any[]>();
          allMedications.forEach((medication) => {
            const studentId = medication.studentId;
            if (!medicationsByStudentId.has(studentId)) {
              medicationsByStudentId.set(studentId, []);
            }
            medicationsByStudentId.get(studentId)!.push(medication);
          });

          // Return medications array for each student ID (empty array if none)
          return ids.map((id) => medicationsByStudentId.get(id) || []);
        } catch (error) {
          console.error('Error in medications-by-student DataLoader:', error);
          return studentIds.map(() => error);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      }
    );
  }

  /**
   * Create DataLoader for loading medications by IDs
   *
   * Batches multiple medication lookups into a single database query.
   *
   * @returns DataLoader for medications
   */
  createMedicationLoader(): DataLoader<string, any> {
    return new DataLoader<string, any>(
      async (medicationIds: readonly string[]) => {
        try {
          const ids = [...medicationIds];

          // Fetch all medications in a single query
          const medications = await this.medicationService.findByIds(ids);

          // Create a map for O(1) lookup
          const medicationMap = new Map(
            medications.map((medication) => [medication.id, medication])
          );

          // Return medications in the same order as requested IDs
          return ids.map((id) => medicationMap.get(id) || null);
        } catch (error) {
          console.error('Error in medication DataLoader:', error);
          return medicationIds.map(() => error);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      }
    );
  }

  /**
   * Create DataLoader for loading health records by student IDs
   *
   * Batches multiple health record lookups for students.
   * Returns the latest health record for each student ID.
   *
   * @returns DataLoader for health records by student ID
   */
  createHealthRecordsByStudentLoader(): DataLoader<string, any> {
    return new DataLoader<string, any>(
      async (studentIds: readonly string[]) => {
        try {
          const ids = [...studentIds];

          // This is a placeholder - implement when HealthRecordService is available
          // For now, return null for all students
          console.warn('HealthRecord DataLoader not fully implemented - requires HealthRecordService');

          return ids.map(() => null);
        } catch (error) {
          console.error('Error in health-records-by-student DataLoader:', error);
          return studentIds.map(() => error);
        }
      },
      {
        cache: true,
        batchScheduleFn: (callback) => setTimeout(callback, 1),
        maxBatchSize: 100,
      }
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
      studentLoader: this.createStudentLoader(),
      contactLoader: this.createContactLoader(),
      contactsByStudentLoader: this.createContactsByStudentLoader(),
      medicationLoader: this.createMedicationLoader(),
      medicationsByStudentLoader: this.createMedicationsByStudentLoader(),
      healthRecordsByStudentLoader: this.createHealthRecordsByStudentLoader(),
    };
  }
}
