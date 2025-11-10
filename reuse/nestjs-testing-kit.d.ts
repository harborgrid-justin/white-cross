/**
 * NESTJS TESTING KIT WITH SEQUELIZE SUPPORT
 *
 * Comprehensive testing toolkit for NestJS applications with Sequelize ORM.
 * Provides 50 specialized helper functions covering:
 * - Sequelize test module builders
 * - Sequelize mock factories (models, transactions, queries)
 * - Database fixture generators
 * - Test data builders with relationships
 * - Sequelize-specific assertion helpers
 * - Transaction testing utilities
 * - Model spy and stub generators
 * - Integration test patterns
 * - E2E database helpers
 * - Performance testing for queries
 * - Migration testing utilities
 * - Association testing helpers
 * - Scoped query testing
 * - Hook testing utilities
 * - HIPAA-compliant test data generators
 *
 * @module NestJSTestingKit
 * @version 1.0.0
 * @requires @nestjs/testing ^11.1.8
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires jest ^30.2.0
 * @requires supertest ^7.1.4
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all test data is synthetic and de-identified
 * @example
 * ```typescript
 * import {
 *   createSequelizeTestModule,
 *   createMockSequelizeModel,
 *   seedSequelizeFixtures
 * } from './nestjs-testing-kit';
 *
 * describe('PatientService', () => {
 *   let service: PatientService;
 *   let patientModel: MockSequelizeModel<Patient>;
 *
 *   beforeEach(async () => {
 *     const module = await createSequelizeTestModule({
 *       models: [Patient, MedicalRecord],
 *       providers: [PatientService]
 *     });
 *
 *     service = module.get<PatientService>(PatientService);
 *     patientModel = module.get(getModelToken(Patient));
 *   });
 * });
 * ```
 */
import { TestingModule } from '@nestjs/testing';
import { INestApplication, Type, Provider } from '@nestjs/common';
import { Sequelize, Model, ModelStatic, Transaction, WhereOptions, FindOptions, CreateOptions, BulkCreateOptions } from 'sequelize';
import * as request from 'supertest';
/**
 * Mock Sequelize model with all common methods mocked
 */
export type MockSequelizeModel<T extends Model = any> = {
    findOne: jest.Mock;
    findAll: jest.Mock;
    findByPk: jest.Mock;
    findAndCountAll: jest.Mock;
    findOrCreate: jest.Mock;
    findCreateFind: jest.Mock;
    create: jest.Mock;
    bulkCreate: jest.Mock;
    update: jest.Mock;
    destroy: jest.Mock;
    restore: jest.Mock;
    count: jest.Mock;
    max: jest.Mock;
    min: jest.Mock;
    sum: jest.Mock;
    increment: jest.Mock;
    decrement: jest.Mock;
    upsert: jest.Mock;
    build: jest.Mock;
    truncate: jest.Mock;
    scope: jest.Mock;
    addHook: jest.Mock;
    removeHook: jest.Mock;
    hasHook: jest.Mock;
    [key: string]: any;
};
/**
 * Sequelize test module configuration
 */
export interface SequelizeTestModuleConfig {
    /** Sequelize models to register */
    models?: ModelStatic<any>[];
    /** Service providers */
    providers?: Provider[];
    /** Controllers to test */
    controllers?: Type<any>[];
    /** Additional module imports */
    imports?: any[];
    /** Database dialect (default: sqlite) */
    dialect?: 'sqlite' | 'postgres' | 'mysql' | 'mariadb' | 'mssql';
    /** Enable query logging */
    logging?: boolean | ((sql: string) => void);
    /** Use in-memory database */
    inMemory?: boolean;
    /** Auto-sync models */
    sync?: boolean;
    /** Database name for tests */
    database?: string;
}
/**
 * Test fixture definition with relationships
 */
export interface SequelizeFixture<T = any> {
    /** Fixture name/identifier */
    name: string;
    /** Model class */
    model: ModelStatic<any>;
    /** Data to create */
    data: Partial<T> | Partial<T>[];
    /** Dependencies that must be created first */
    dependencies?: string[];
    /** Whether to use bulkCreate */
    bulk?: boolean;
}
/**
 * Transaction test context
 */
export interface TransactionTestContext {
    /** Active transaction */
    transaction: Transaction;
    /** Rollback function */
    rollback: () => Promise<void>;
    /** Commit function */
    commit: () => Promise<void>;
}
/**
 * Query performance metrics
 */
export interface QueryPerformanceMetrics {
    /** Query SQL */
    sql: string;
    /** Execution time in ms */
    executionTime: number;
    /** Number of rows returned */
    rowCount: number;
    /** Query plan (if available) */
    plan?: any;
}
/**
 * Database seeding options
 */
export interface SeedOptions {
    /** Clear existing data first */
    truncate?: boolean;
    /** Use transaction */
    transaction?: Transaction;
    /** Cascade delete on truncate */
    cascade?: boolean;
    /** Restart identity columns */
    restartIdentity?: boolean;
}
/**
 * Mock transaction options
 */
export interface MockTransactionOptions {
    /** Auto-commit on success */
    autoCommit?: boolean;
    /** Auto-rollback on error */
    autoRollback?: boolean;
    /** Isolation level */
    isolationLevel?: string;
}
/**
 * Test data builder configuration
 */
export interface TestDataBuilderConfig<T> {
    /** Default values */
    defaults?: Partial<T> | (() => Partial<T>);
    /** Relationships to build */
    associations?: Record<string, any>;
    /** Post-build hook */
    afterBuild?: (instance: T) => T | Promise<T>;
}
/**
 * Creates a comprehensive Sequelize test module with in-memory database
 *
 * @param config - Module configuration
 * @returns Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createSequelizeTestModule({
 *   models: [User, Patient, MedicalRecord],
 *   providers: [UserService, PatientService],
 *   inMemory: true,
 *   sync: true
 * });
 * ```
 */
export declare function createSequelizeTestModule(config: SequelizeTestModuleConfig): Promise<TestingModule>;
/**
 * Creates a minimal Sequelize test module for unit testing
 *
 * @param model - Model to test
 * @param service - Service class
 * @param dependencies - Additional dependencies
 * @returns Testing module
 *
 * @example
 * ```typescript
 * const module = await createMinimalSequelizeTestModule(
 *   Patient,
 *   PatientService,
 *   [{ provide: EmailService, useValue: mockEmailService }]
 * );
 * ```
 */
export declare function createMinimalSequelizeTestModule(model: ModelStatic<any>, service: Type<any>, dependencies?: Provider[]): Promise<TestingModule>;
/**
 * Creates a test module with real Sequelize connection for integration tests
 *
 * @param config - Integration test configuration
 * @returns Testing module with real database
 *
 * @example
 * ```typescript
 * const module = await createIntegrationSequelizeModule({
 *   models: [Patient, Doctor, Appointment],
 *   providers: [AppointmentService],
 *   dialect: 'postgres',
 *   database: 'test_integration_db'
 * });
 * ```
 */
export declare function createIntegrationSequelizeModule(config: SequelizeTestModuleConfig): Promise<TestingModule>;
/**
 * Creates a test module with transaction support enabled
 *
 * @param config - Module configuration
 * @returns Testing module with transaction helpers
 *
 * @example
 * ```typescript
 * const module = await createTransactionalTestModule({
 *   models: [Order, OrderItem, Payment],
 *   providers: [OrderService]
 * });
 * ```
 */
export declare function createTransactionalTestModule(config: SequelizeTestModuleConfig): Promise<TestingModule>;
/**
 * Creates a fully mocked Sequelize model with all methods
 *
 * @template T - Model type
 * @returns Mock Sequelize model
 *
 * @example
 * ```typescript
 * const mockPatientModel = createMockSequelizeModel<Patient>();
 * mockPatientModel.findOne.mockResolvedValue(mockPatient);
 * mockPatientModel.findAll.mockResolvedValue([mockPatient]);
 * ```
 */
export declare function createMockSequelizeModel<T extends Model = any>(): MockSequelizeModel<T>;
/**
 * Creates a mock Sequelize transaction
 *
 * @param options - Transaction options
 * @returns Mock transaction object
 *
 * @example
 * ```typescript
 * const mockTransaction = createMockTransaction();
 * await service.createPatient(data, mockTransaction);
 * expect(mockTransaction.commit).toHaveBeenCalled();
 * ```
 */
export declare function createMockTransaction(options?: MockTransactionOptions): jest.Mocked<Transaction>;
/**
 * Creates a mock Sequelize instance
 *
 * @returns Mock Sequelize instance
 *
 * @example
 * ```typescript
 * const mockSequelize = createMockSequelizeInstance();
 * mockSequelize.transaction.mockResolvedValue(mockTransaction);
 * ```
 */
export declare function createMockSequelizeInstance(): jest.Mocked<Sequelize>;
/**
 * Creates a mock model instance with spy methods
 *
 * @param data - Instance data
 * @returns Mock model instance
 *
 * @example
 * ```typescript
 * const patient = createMockModelInstance({
 *   id: '123',
 *   name: 'John Doe'
 * });
 * await patient.save();
 * expect(patient.save).toHaveBeenCalled();
 * ```
 */
export declare function createMockModelInstance<T = any>(data?: Partial<T>): jest.Mocked<T & Model>;
/**
 * Creates mock provider for Sequelize model in testing module
 *
 * @param model - Model class
 * @param mockImplementation - Optional mock implementation
 * @returns Provider configuration
 *
 * @example
 * ```typescript
 * const mockProvider = createMockModelProvider(Patient, customMock);
 * Test.createTestingModule({ providers: [mockProvider] });
 * ```
 */
export declare function createMockModelProvider(model: ModelStatic<any>, mockImplementation?: MockSequelizeModel): Provider;
/**
 * Seeds Sequelize fixtures with relationship handling
 *
 * @param fixtures - Array of fixtures to seed
 * @param options - Seeding options
 * @returns Created instances
 *
 * @example
 * ```typescript
 * const fixtures = [
 *   { name: 'admin', model: User, data: adminData },
 *   { name: 'patient1', model: Patient, data: patientData }
 * ];
 * const instances = await seedSequelizeFixtures(fixtures);
 * ```
 */
export declare function seedSequelizeFixtures(fixtures: SequelizeFixture[], options?: SeedOptions): Promise<Map<string, Model[]>>;
/**
 * Generates fixture data from factory functions
 *
 * @param count - Number of fixtures to generate
 * @param factory - Factory function
 * @param overrides - Common overrides for all fixtures
 * @returns Array of fixture data
 *
 * @example
 * ```typescript
 * const patients = generateFixtureData(10, () => ({
 *   firstName: faker.person.firstName(),
 *   lastName: faker.person.lastName(),
 *   dateOfBirth: faker.date.past()
 * }), { isActive: true });
 * ```
 */
export declare function generateFixtureData<T>(count: number, factory: (index: number) => Partial<T>, overrides?: Partial<T>): Partial<T>[];
/**
 * Creates a fixture builder with relationship support
 *
 * @param model - Model class
 * @param defaults - Default values
 * @returns Fixture builder
 *
 * @example
 * ```typescript
 * const patientBuilder = createFixtureBuilder(Patient, {
 *   isActive: true,
 *   status: 'active'
 * });
 * const patient = await patientBuilder.create({
 *   firstName: 'John'
 * });
 * ```
 */
export declare function createFixtureBuilder<T extends Model>(model: ModelStatic<T>, defaults?: Partial<T> | (() => Partial<T>)): {
    /**
     * Creates a single fixture instance
     */
    create: (overrides?: Partial<T>, options?: CreateOptions) => Promise<T>;
    /**
     * Creates multiple fixture instances
     */
    createMany: (count: number, overrides?: Partial<T>, options?: BulkCreateOptions) => Promise<T[]>;
    /**
     * Builds an instance without saving
     */
    build: (overrides?: Partial<T>) => T;
};
/**
 * Loads fixtures from JSON files
 *
 * @param fixturesPath - Path to fixtures directory
 * @param models - Model mapping
 * @returns Loaded fixtures
 *
 * @example
 * ```typescript
 * const fixtures = await loadFixturesFromFiles(
 *   './test/fixtures',
 *   { users: User, patients: Patient }
 * );
 * ```
 */
export declare function loadFixturesFromFiles(fixturesPath: string, models: Record<string, ModelStatic<any>>): Promise<SequelizeFixture[]>;
/**
 * Creates a test data builder with association support
 *
 * @param config - Builder configuration
 * @returns Data builder instance
 *
 * @example
 * ```typescript
 * const patientBuilder = createTestDataBuilder<Patient>({
 *   defaults: () => ({
 *     firstName: faker.person.firstName(),
 *     lastName: faker.person.lastName()
 *   }),
 *   associations: {
 *     medicalRecords: () => createMedicalRecords(3)
 *   }
 * });
 * ```
 */
export declare function createTestDataBuilder<T>(config: TestDataBuilderConfig<T>): {
    /**
     * Builds test data with associations
     */
    build: (overrides?: Partial<T>) => Promise<T>;
    /**
     * Builds multiple instances
     */
    buildMany: (count: number, overrides?: Partial<T>) => Promise<T[]>;
};
/**
 * Generates HIPAA-compliant test patient data
 *
 * @param overrides - Property overrides
 * @returns Synthetic patient data
 *
 * @example
 * ```typescript
 * const patient = generateTestPatientData({
 *   age: 45,
 *   gender: 'M'
 * });
 * ```
 */
export declare function generateTestPatientData(overrides?: any): any;
/**
 * Generates test medical record data (de-identified)
 *
 * @param patientId - Patient identifier
 * @param overrides - Property overrides
 * @returns Synthetic medical record
 *
 * @example
 * ```typescript
 * const record = generateTestMedicalRecordData('patient-123');
 * ```
 */
export declare function generateTestMedicalRecordData(patientId: string, overrides?: any): any;
/**
 * Generates test appointment data
 *
 * @param patientId - Patient ID
 * @param providerId - Provider ID
 * @param overrides - Property overrides
 * @returns Test appointment data
 *
 * @example
 * ```typescript
 * const appointment = generateTestAppointmentData('p1', 'doc1');
 * ```
 */
export declare function generateTestAppointmentData(patientId: string, providerId: string, overrides?: any): any;
/**
 * Asserts that a Sequelize model was created with expected data
 *
 * @param mockModel - Mock model
 * @param expectedData - Expected creation data
 *
 * @example
 * ```typescript
 * assertModelCreated(mockPatientModel, {
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * ```
 */
export declare function assertModelCreated(mockModel: MockSequelizeModel, expectedData: any): void;
/**
 * Asserts that a model query was executed with correct options
 *
 * @param mockModel - Mock model
 * @param method - Query method name
 * @param expectedOptions - Expected query options
 *
 * @example
 * ```typescript
 * assertQueryExecuted(mockModel, 'findAll', {
 *   where: { status: 'active' }
 * });
 * ```
 */
export declare function assertQueryExecuted(mockModel: MockSequelizeModel, method: keyof MockSequelizeModel, expectedOptions?: FindOptions): void;
/**
 * Asserts transaction was used in operation
 *
 * @param mockModel - Mock model
 * @param method - Method name
 * @param transaction - Expected transaction
 *
 * @example
 * ```typescript
 * assertTransactionUsed(mockModel, 'create', mockTransaction);
 * ```
 */
export declare function assertTransactionUsed(mockModel: MockSequelizeModel, method: keyof MockSequelizeModel, transaction: Transaction): void;
/**
 * Asserts model instance was saved
 *
 * @param instance - Mock model instance
 * @param expectedChanges - Expected changes
 *
 * @example
 * ```typescript
 * assertInstanceSaved(patientInstance, { status: 'inactive' });
 * ```
 */
export declare function assertInstanceSaved(instance: any, expectedChanges?: any): void;
/**
 * Asserts bulk operation was performed
 *
 * @param mockModel - Mock model
 * @param expectedCount - Expected number of records
 *
 * @example
 * ```typescript
 * assertBulkOperation(mockModel, 100);
 * ```
 */
export declare function assertBulkOperation(mockModel: MockSequelizeModel, expectedCount?: number): void;
/**
 * Asserts query used specific where conditions
 *
 * @param mockModel - Mock model
 * @param method - Query method
 * @param expectedWhere - Expected where clause
 *
 * @example
 * ```typescript
 * assertWhereCondition(mockModel, 'findAll', {
 *   status: 'active',
 *   age: { [Op.gte]: 18 }
 * });
 * ```
 */
export declare function assertWhereCondition(mockModel: MockSequelizeModel, method: keyof MockSequelizeModel, expectedWhere: WhereOptions): void;
/**
 * Wraps test in automatic transaction with rollback
 *
 * @param sequelize - Sequelize instance
 * @param testFn - Test function
 *
 * @example
 * ```typescript
 * await withTestTransaction(sequelize, async (t) => {
 *   await Patient.create(patientData, { transaction: t });
 *   const count = await Patient.count({ transaction: t });
 *   expect(count).toBe(1);
 *   // Auto-rollback after test
 * });
 * ```
 */
export declare function withTestTransaction<T>(sequelize: Sequelize, testFn: (transaction: Transaction) => Promise<T>): Promise<T>;
/**
 * Creates a transaction spy for testing transaction behavior
 *
 * @returns Transaction spy helpers
 *
 * @example
 * ```typescript
 * const txSpy = createTransactionSpy();
 * const result = await service.createWithTransaction();
 * expect(txSpy.wasCommitted()).toBe(true);
 * ```
 */
export declare function createTransactionSpy(): {
    transaction: jest.Mocked<Transaction>;
    wasCommitted: () => boolean;
    wasRolledBack: () => boolean;
    reset: () => void;
};
/**
 * Tests deadlock handling in transactions
 *
 * @param fn - Function that may deadlock
 * @param maxRetries - Maximum retry attempts
 * @returns Test result
 *
 * @example
 * ```typescript
 * await testDeadlockHandling(
 *   () => service.updateWithLock(id, data),
 *   3
 * );
 * ```
 */
export declare function testDeadlockHandling<T>(fn: () => Promise<T>, maxRetries?: number): Promise<{
    success: boolean;
    attempts: number;
    result?: T;
}>;
/**
 * Creates comprehensive spies on all model methods
 *
 * @param model - Model to spy on
 * @returns Map of method spies
 *
 * @example
 * ```typescript
 * const spies = createModelSpies(Patient);
 * await Patient.findAll();
 * expect(spies.get('findAll')).toHaveBeenCalled();
 * ```
 */
export declare function createModelSpies(model: ModelStatic<any>): Map<string, jest.SpyInstance>;
/**
 * Creates a stub for model with preset responses
 *
 * @param model - Model class
 * @param stubs - Method stubs configuration
 * @returns Stubbed model
 *
 * @example
 * ```typescript
 * const stubbedModel = createModelStub(Patient, {
 *   findAll: [patient1, patient2],
 *   findByPk: patient1,
 *   create: (data) => ({ ...data, id: 'new-id' })
 * });
 * ```
 */
export declare function createModelStub(model: ModelStatic<any>, stubs: Record<string, any>): MockSequelizeModel;
/**
 * Restores all model spies
 *
 * @param spies - Spy map to restore
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   restoreModelSpies(spies);
 * });
 * ```
 */
export declare function restoreModelSpies(spies: Map<string, jest.SpyInstance>): void;
/**
 * Tests model CRUD operations integration
 *
 * @param model - Model to test
 * @param testData - Test data for CRUD operations
 * @returns Test results
 *
 * @example
 * ```typescript
 * await testModelCRUD(Patient, {
 *   create: { firstName: 'John', lastName: 'Doe' },
 *   update: { firstName: 'Jane' },
 *   findOptions: { where: { lastName: 'Doe' } }
 * });
 * ```
 */
export declare function testModelCRUD(model: ModelStatic<any>, testData: {
    create: any;
    update?: any;
    findOptions?: FindOptions;
}): Promise<{
    created: Model;
    updated?: Model;
    found?: Model[];
    deleted: boolean;
}>;
/**
 * Tests model associations integrity
 *
 * @param parentModel - Parent model
 * @param childModel - Child model
 * @param parentData - Parent data
 * @param childData - Child data
 * @param associationName - Association name
 *
 * @example
 * ```typescript
 * await testModelAssociations(
 *   Patient,
 *   MedicalRecord,
 *   patientData,
 *   recordData,
 *   'medicalRecords'
 * );
 * ```
 */
export declare function testModelAssociations(parentModel: ModelStatic<any>, childModel: ModelStatic<any>, parentData: any, childData: any, associationName: string): Promise<void>;
/**
 * Sets up E2E test environment with database
 *
 * @param app - NestJS application
 * @param sequelize - Sequelize instance
 * @returns E2E helper functions
 *
 * @example
 * ```typescript
 * const e2e = setupE2EDatabase(app, sequelize);
 * await e2e.seed(fixtures);
 * const response = await e2e.request('GET', '/patients');
 * await e2e.cleanup();
 * ```
 */
export declare function setupE2EDatabase(app: INestApplication, sequelize: Sequelize): {
    /**
     * Seeds database for E2E tests
     */
    seed: (fixtures: SequelizeFixture[]) => Promise<Map<string, Model[]>>;
    /**
     * Makes authenticated request
     */
    request: (method: string, path: string, token?: string) => request.Test;
    /**
     * Clears all database tables
     */
    cleanup: () => Promise<void>;
    /**
     * Resets database to initial state
     */
    reset: () => Promise<void>;
};
/**
 * Creates E2E test context with transaction isolation
 *
 * @param module - Testing module
 * @returns E2E context
 *
 * @example
 * ```typescript
 * const context = await createE2EContext(module);
 * await context.run(async () => {
 *   // E2E test code - auto-rollback
 * });
 * ```
 */
export declare function createE2EContext(module: TestingModule): Promise<{
    /**
     * Runs test in isolated transaction
     */
    run: <T>(fn: (t: Transaction) => Promise<T>) => Promise<T>;
    /**
     * Gets current transaction
     */
    getTransaction: () => Transaction | null;
}>;
/**
 * Measures Sequelize query performance
 *
 * @param queryFn - Query function to measure
 * @param iterations - Number of iterations
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await measureQueryPerformance(
 *   () => Patient.findAll({ where: { status: 'active' } }),
 *   100
 * );
 * expect(metrics.averageTime).toBeLessThan(50);
 * ```
 */
export declare function measureQueryPerformance(queryFn: () => Promise<any>, iterations?: number): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
}>;
/**
 * Profiles N+1 query problems
 *
 * @param sequelize - Sequelize instance
 * @param queryFn - Query function to profile
 * @returns Query count and details
 *
 * @example
 * ```typescript
 * const profile = await profileNPlusOneQueries(sequelize, async () => {
 *   const patients = await Patient.findAll();
 *   await Promise.all(patients.map(p => p.getMedicalRecords()));
 * });
 * expect(profile.queryCount).toBeLessThan(5); // Should use include
 * ```
 */
export declare function profileNPlusOneQueries(sequelize: Sequelize, queryFn: () => Promise<any>): Promise<{
    queryCount: number;
    queries: string[];
}>;
/**
 * Tests migration up and down
 *
 * @param sequelize - Sequelize instance
 * @param migrationPath - Path to migration file
 * @returns Migration test result
 *
 * @example
 * ```typescript
 * await testMigration(sequelize, './migrations/001-add-patients.js');
 * ```
 */
export declare function testMigration(sequelize: Sequelize, migrationPath: string): Promise<{
    up: boolean;
    down: boolean;
}>;
/**
 * Verifies table structure after migration
 *
 * @param sequelize - Sequelize instance
 * @param tableName - Table to verify
 * @param expectedColumns - Expected column definitions
 *
 * @example
 * ```typescript
 * await verifyTableStructure(sequelize, 'patients', {
 *   id: { type: 'UUID' },
 *   firstName: { type: 'VARCHAR(255)', allowNull: false }
 * });
 * ```
 */
export declare function verifyTableStructure(sequelize: Sequelize, tableName: string, expectedColumns: Record<string, any>): Promise<void>;
/**
 * Clears all test data from database
 *
 * @param sequelize - Sequelize instance
 * @param options - Clear options
 *
 * @example
 * ```typescript
 * await clearTestDatabase(sequelize, { cascade: true });
 * ```
 */
export declare function clearTestDatabase(sequelize: Sequelize, options?: {
    cascade?: boolean;
    restartIdentity?: boolean;
}): Promise<void>;
/**
 * Validates model instance against schema
 *
 * @param instance - Model instance to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = await validateModelInstance(patient);
 * expect(result.valid).toBe(true);
 * ```
 */
export declare function validateModelInstance(instance: Model): Promise<{
    valid: boolean;
    errors: any[];
}>;
declare const _default: {
    createSequelizeTestModule: typeof createSequelizeTestModule;
    createMinimalSequelizeTestModule: typeof createMinimalSequelizeTestModule;
    createIntegrationSequelizeModule: typeof createIntegrationSequelizeModule;
    createTransactionalTestModule: typeof createTransactionalTestModule;
    createMockSequelizeModel: typeof createMockSequelizeModel;
    createMockTransaction: typeof createMockTransaction;
    createMockSequelizeInstance: typeof createMockSequelizeInstance;
    createMockModelInstance: typeof createMockModelInstance;
    createMockModelProvider: typeof createMockModelProvider;
    seedSequelizeFixtures: typeof seedSequelizeFixtures;
    generateFixtureData: typeof generateFixtureData;
    createFixtureBuilder: typeof createFixtureBuilder;
    loadFixturesFromFiles: typeof loadFixturesFromFiles;
    createTestDataBuilder: typeof createTestDataBuilder;
    generateTestPatientData: typeof generateTestPatientData;
    generateTestMedicalRecordData: typeof generateTestMedicalRecordData;
    generateTestAppointmentData: typeof generateTestAppointmentData;
    assertModelCreated: typeof assertModelCreated;
    assertQueryExecuted: typeof assertQueryExecuted;
    assertTransactionUsed: typeof assertTransactionUsed;
    assertInstanceSaved: typeof assertInstanceSaved;
    assertBulkOperation: typeof assertBulkOperation;
    assertWhereCondition: typeof assertWhereCondition;
    withTestTransaction: typeof withTestTransaction;
    createTransactionSpy: typeof createTransactionSpy;
    testDeadlockHandling: typeof testDeadlockHandling;
    createModelSpies: typeof createModelSpies;
    createModelStub: typeof createModelStub;
    restoreModelSpies: typeof restoreModelSpies;
    testModelCRUD: typeof testModelCRUD;
    testModelAssociations: typeof testModelAssociations;
    setupE2EDatabase: typeof setupE2EDatabase;
    createE2EContext: typeof createE2EContext;
    measureQueryPerformance: typeof measureQueryPerformance;
    profileNPlusOneQueries: typeof profileNPlusOneQueries;
    testMigration: typeof testMigration;
    verifyTableStructure: typeof verifyTableStructure;
    clearTestDatabase: typeof clearTestDatabase;
    validateModelInstance: typeof validateModelInstance;
};
export default _default;
//# sourceMappingURL=nestjs-testing-kit.d.ts.map