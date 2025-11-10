/**
 * DATABASE TEST HELPERS
 *
 * Utilities for setting up and managing test databases in integration tests
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Create in-memory SQLite database configuration for testing
 */
export function createTestDatabaseConfig(entities: any[] = []): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: ':memory:',
    entities,
    synchronize: true,
    logging: false,
    dropSchema: true,
  };
}

/**
 * Create PostgreSQL test database configuration
 */
export function createPostgresTestConfig(entities: any[] = []): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    username: process.env.TEST_DB_USER || 'test',
    password: process.env.TEST_DB_PASSWORD || 'test',
    database: process.env.TEST_DB_NAME || 'white_cross_test',
    entities,
    synchronize: true,
    logging: false,
    dropSchema: true,
  };
}

/**
 * Database seeder for test data
 */
export class DatabaseSeeder {
  /**
   * Seed patients into database
   */
  static async seedPatients(repository: any, count: number = 5): Promise<any[]> {
    const patients = [];
    for (let i = 0; i < count; i++) {
      const patient = await repository.save({
        mrn: `MRN-TEST-${i}`,
        firstName: `Test${i}`,
        lastName: `Patient${i}`,
        dateOfBirth: new Date('1980-01-01'),
        gender: i % 2 === 0 ? 'M' : 'F',
      });
      patients.push(patient);
    }
    return patients;
  }

  /**
   * Seed medications into database
   */
  static async seedMedications(repository: any, count: number = 5): Promise<any[]> {
    const medications = [];
    for (let i = 0; i < count; i++) {
      const medication = await repository.save({
        name: `Test Medication ${i}`,
        genericName: `testmed${i}`,
        dosage: '250mg',
        route: 'ORAL',
        isControlled: i % 3 === 0,
      });
      medications.push(medication);
    }
    return medications;
  }

  /**
   * Seed appointments into database
   */
  static async seedAppointments(
    repository: any,
    patientIds: string[],
    count: number = 5
  ): Promise<any[]> {
    const appointments = [];
    for (let i = 0; i < count; i++) {
      const appointment = await repository.save({
        patientId: patientIds[i % patientIds.length],
        appointmentDate: new Date(Date.now() + i * 86400000),
        appointmentType: 'CHECKUP',
        status: 'SCHEDULED',
        duration: 30,
      });
      appointments.push(appointment);
    }
    return appointments;
  }

  /**
   * Seed lab results into database
   */
  static async seedLabResults(repository: any, patientIds: string[]): Promise<any[]> {
    const labResults = [];
    for (const patientId of patientIds) {
      const result = await repository.save({
        patientId,
        testName: 'Complete Blood Count',
        testCode: 'CBC',
        value: '12.5',
        units: 'g/dL',
        status: 'FINAL',
        performedAt: new Date(),
      });
      labResults.push(result);
    }
    return labResults;
  }
}

/**
 * Database cleaner for test cleanup
 */
export class DatabaseCleaner {
  /**
   * Clear all data from repositories
   */
  static async clearAll(repositories: any[]): Promise<void> {
    for (const repository of repositories) {
      await repository.clear();
    }
  }

  /**
   * Clear specific repository
   */
  static async clear(repository: any): Promise<void> {
    await repository.clear();
  }

  /**
   * Delete all records matching criteria
   */
  static async deleteWhere(repository: any, criteria: any): Promise<void> {
    await repository.delete(criteria);
  }

  /**
   * Truncate table (use with caution)
   */
  static async truncate(repository: any): Promise<void> {
    await repository.query(`DELETE FROM ${repository.metadata.tableName}`);
  }
}

/**
 * Transaction helper for test isolation
 */
export class TransactionHelper {
  private queryRunner: any;

  constructor(private connection: any) {}

  /**
   * Start transaction
   */
  async start(): Promise<void> {
    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  /**
   * Rollback transaction
   */
  async rollback(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
    }
  }

  /**
   * Commit transaction
   */
  async commit(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.commitTransaction();
      await this.queryRunner.release();
    }
  }
}

/**
 * Database assertion helpers
 */
export class DatabaseAssertions {
  /**
   * Assert record exists in database
   */
  static async assertExists(repository: any, criteria: any): Promise<void> {
    const record = await repository.findOne({ where: criteria });
    if (!record) {
      throw new Error(`Record not found with criteria: ${JSON.stringify(criteria)}`);
    }
  }

  /**
   * Assert record does not exist
   */
  static async assertNotExists(repository: any, criteria: any): Promise<void> {
    const record = await repository.findOne({ where: criteria });
    if (record) {
      throw new Error(`Record found but should not exist: ${JSON.stringify(criteria)}`);
    }
  }

  /**
   * Assert count of records
   */
  static async assertCount(repository: any, expectedCount: number, criteria: any = {}): Promise<void> {
    const count = await repository.count({ where: criteria });
    if (count !== expectedCount) {
      throw new Error(`Expected ${expectedCount} records but found ${count}`);
    }
  }

  /**
   * Get record count
   */
  static async getCount(repository: any, criteria: any = {}): Promise<number> {
    return await repository.count({ where: criteria });
  }
}

/**
 * Wait for database condition helper
 */
export async function waitForDatabaseCondition(
  checkFn: () => Promise<boolean>,
  timeoutMs: number = 5000,
  intervalMs: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (await checkFn()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Database condition not met within timeout');
}

/**
 * Create test database snapshot
 */
export class DatabaseSnapshot {
  private snapshots: Map<string, any[]> = new Map();

  /**
   * Take snapshot of repository
   */
  async take(repository: any, name: string): Promise<void> {
    const records = await repository.find();
    this.snapshots.set(name, records);
  }

  /**
   * Restore snapshot
   */
  async restore(repository: any, name: string): Promise<void> {
    const records = this.snapshots.get(name);
    if (!records) {
      throw new Error(`Snapshot ${name} not found`);
    }

    await repository.clear();
    await repository.save(records);
  }

  /**
   * Compare current state to snapshot
   */
  async compare(repository: any, name: string): Promise<boolean> {
    const snapshot = this.snapshots.get(name);
    const current = await repository.find();

    return JSON.stringify(snapshot) === JSON.stringify(current);
  }
}
