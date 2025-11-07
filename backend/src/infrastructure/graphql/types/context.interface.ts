/**
 * GraphQL Context Interface
 *
 * Defines the structure of the GraphQL context object that's passed
 * to all resolvers. This includes the HTTP request/response objects
 * and DataLoaders for efficient data fetching.
 *
 * @module GraphQLContext
 */
import type { Request, Response } from 'express';
import type DataLoader from 'dataloader';
import type { Contact, HealthRecord, Student, StudentMedication } from '@/database';

/**
 * GraphQL Context
 *
 * Available in all resolvers via the @Context() decorator
 *
 * @example
 * ```typescript
 * @ResolveField('contacts', () => [Contact])
 * async contacts(
 *   @Parent() student: Student,
 *   @Context() context: GraphQLContext,
 * ) {
 *   return context.loaders.contactsByStudentLoader.load(student.id);
 * }
 * ```
 */
export interface GraphQLContext {
  /**
   * Express HTTP request object
   * Contains headers, authentication info, etc.
   */
  req: Request;

  /**
   * Express HTTP response object
   * For setting cookies, headers, etc.
   */
  res: Response;

  /**
   * DataLoaders for efficient batch loading
   * Prevents N+1 query problems
   */
  loaders: {
    /**
     * Load students by ID
     * Batches multiple student lookups into single query
     */
    studentLoader: DataLoader<string, Student | null>;

    /**
     * Load contacts by ID
     * Batches multiple contact lookups into single query
     */
    contactLoader: DataLoader<string, Contact | null>;

    /**
     * Load contacts for students
     * Returns all contacts for each student ID
     */
    contactsByStudentLoader: DataLoader<string, Contact[]>;

    /**
     * Load medications by ID
     * Batches multiple medication lookups into single query
     */
    medicationLoader: DataLoader<string, StudentMedication | null>;

    /**
     * Load medications for students
     * Returns all active medications for each student ID
     */
    medicationsByStudentLoader: DataLoader<string, StudentMedication[]>;

    /**
     * Load health records for students
     * Returns latest health record for each student ID
     */
    healthRecordsByStudentLoader: DataLoader<string, HealthRecord | null>;
  };
}
