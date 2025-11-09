/**
 * LOC: TESTUTIL123456
 * File: /reuse/testing-utilities-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/testing (v11.1.8)
 *   - jest (v29.7.0)
 *   - @faker-js/faker (v8.3.1)
 *   - sequelize (v6.35.2)
 *   - sequelize-typescript (v2.1.6)
 *   - zod (v3.22.4)
 *   - @nestjs/common (v11.1.8)
 *   - msw (v2.0.11)
 *   - jsonwebtoken (v9.0.2)
 *
 * DOWNSTREAM (imported by):
 *   - Unit test files (*.spec.ts)
 *   - Integration test files (*.integration.spec.ts)
 *   - E2E test files (*.e2e-spec.ts)
 *   - Test setup files
 *   - Test database seeders
 *   - Mock data generators
 */
/**
 * File: /reuse/testing-utilities-kit.prod.ts
 * Locator: WC-UTL-TEST-001
 * Purpose: Production-Grade Testing Utilities Kit - Comprehensive testing helpers, mocks, fixtures, and factories
 *
 * Upstream: Independent testing utility module with NestJS Testing, Jest, Faker, Sequelize, MSW, Zod
 * Downstream: All test files, test setup, database seeders, mock generators, E2E tests
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/testing, jest, @faker-js/faker, sequelize, msw, zod
 * Exports: 45 testing utilities including test data factories, mock generators, fixture loaders, database seeders,
 *          API mocking, authentication mocking, time mocking, snapshot helpers, database management, cleanup utilities
 *
 * LLM Context: Enterprise-grade testing utilities toolkit for White Cross healthcare platform testing infrastructure.
 * Provides comprehensive test data factories for healthcare entities (patients, providers, appointments, claims),
 * mock generators for APIs and services, fixture loaders for JSON and database data, Sequelize database seeders with
 * transaction support, API mocking utilities with MSW integration, authentication mocking (JWT, sessions, roles),
 * time/clock mocking for deterministic tests, snapshot testing helpers, test database management (setup, teardown,
 * cleanup, isolation), NestJS testing module builders, custom Jest matchers, parallel test support with isolation,
 * cleanup utilities for state reset, healthcare-specific test data generation (MRN, ICD-10, NPI, SSN), HIPAA-compliant
 * test PHI data, type-safe factory builders, and production-ready testing patterns for unit, integration, and E2E tests.
 */
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, QueryInterface } from 'sequelize';
import { ModuleMetadata, Type } from '@nestjs/common';
import { RestHandler, RequestHandler } from 'msw';
import { SetupServer } from 'msw/node';
/**
 * Test data factory options
 */
export interface FactoryOptions<T = any> {
    overrides?: Partial<T>;
    count?: number;
    associations?: Record<string, any>;
    traits?: string[];
    transient?: Record<string, any>;
}
/**
 * Database seeder configuration
 */
export interface SeederConfig {
    truncate?: boolean;
    cascade?: boolean;
    restartIdentity?: boolean;
    logging?: boolean;
    transaction?: Transaction;
    force?: boolean;
}
/**
 * Test database configuration
 */
export interface TestDatabaseConfig {
    dialect: 'postgres' | 'mysql' | 'sqlite';
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database: string;
    logging?: boolean;
    storage?: string;
    models?: Type<any>[];
    sync?: boolean;
    alter?: boolean;
}
/**
 * Mock service configuration
 */
export interface MockServiceConfig<T = any> {
    methods?: Array<keyof T>;
    implementations?: Partial<Record<keyof T, jest.Mock>>;
    returnValues?: Partial<Record<keyof T, any>>;
    autoMock?: boolean;
}
/**
 * API mock response configuration
 */
export interface MockResponseConfig {
    status?: number;
    headers?: Record<string, string>;
    delay?: number;
    errors?: any[];
    once?: boolean;
}
/**
 * JWT token payload
 */
export interface JWTPayload {
    userId: string;
    email: string;
    roles?: string[];
    permissions?: string[];
    organizationId?: string;
    [key: string]: any;
}
/**
 * Test fixture metadata
 */
export interface FixtureMetadata {
    name: string;
    version: string;
    createdAt: Date;
    dependencies?: string[];
    tags?: string[];
}
/**
 * Snapshot testing options
 */
export interface SnapshotOptions {
    propertyMatchers?: Record<string, any>;
    hint?: string;
    anonymize?: string[];
    sort?: boolean;
}
/**
 * Test cleanup handler
 */
export type CleanupHandler = () => void | Promise<void>;
/**
 * Test isolation context
 */
export interface TestIsolationContext {
    testName: string;
    database?: Sequelize;
    transaction?: Transaction;
    mocks: jest.Mock[];
    timers: boolean;
    cleanup: CleanupHandler[];
}
/**
 * Healthcare test data
 */
export interface HealthcareTestData {
    mrn: string;
    npi: string;
    icd10: string;
    cptCode: string;
    loincCode: string;
    ssn: string;
    ein: string;
}
/**
 * Patient test data
 */
export interface PatientTestData {
    id: string;
    mrn: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    email: string;
    phone: string;
    ssn: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
}
/**
 * Provider test data
 */
export interface ProviderTestData {
    id: string;
    npi: string;
    firstName: string;
    lastName: string;
    specialty: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseState: string;
}
/**
 * Appointment test data
 */
export interface AppointmentTestData {
    id: string;
    patientId: string;
    providerId: string;
    scheduledAt: Date;
    duration: number;
    type: string;
    status: string;
    reason: string;
    notes?: string;
}
/**
 * Generates a valid Medical Record Number (MRN) for testing.
 * Format: 3 uppercase letters + 7 digits.
 *
 * @returns {string} Valid MRN
 *
 * @example
 * ```typescript
 * const mrn = generateMRN(); // 'ABC1234567'
 * ```
 */
export declare function generateMRN(): string;
/**
 * Generates a valid National Provider Identifier (NPI) with Luhn checksum.
 * Format: 10 digits with valid checksum.
 *
 * @returns {string} Valid NPI
 *
 * @example
 * ```typescript
 * const npi = generateNPI(); // '1234567893'
 * ```
 */
export declare function generateNPI(): string;
/**
 * Generates a valid ICD-10 diagnostic code for testing.
 * Format: Letter + 2 digits + optional decimal + up to 4 alphanumeric.
 *
 * @param {object} [options] - Generation options
 * @returns {string} Valid ICD-10 code
 *
 * @example
 * ```typescript
 * const code = generateICD10(); // 'A01.234'
 * const simpleCode = generateICD10({ simple: true }); // 'A01'
 * ```
 */
export declare function generateICD10(options?: {
    simple?: boolean;
}): string;
/**
 * Generates a valid CPT (Current Procedural Terminology) code.
 * Format: 5 digits.
 *
 * @returns {string} Valid CPT code
 *
 * @example
 * ```typescript
 * const cpt = generateCPTCode(); // '99213'
 * ```
 */
export declare function generateCPTCode(): string;
/**
 * Generates a valid LOINC (Logical Observation Identifiers Names and Codes) code.
 * Format: 5 digits + hyphen + 1 digit.
 *
 * @returns {string} Valid LOINC code
 *
 * @example
 * ```typescript
 * const loinc = generateLOINCCode(); // '12345-6'
 * ```
 */
export declare function generateLOINCCode(): string;
/**
 * Generates a valid US Social Security Number for testing.
 * Format: XXX-XX-XXXX. NOTE: Uses test-safe ranges.
 *
 * @param {object} [options] - Generation options
 * @returns {string} Valid SSN
 *
 * @example
 * ```typescript
 * const ssn = generateSSN(); // '123-45-6789'
 * const raw = generateSSN({ dashes: false }); // '123456789'
 * ```
 */
export declare function generateSSN(options?: {
    dashes?: boolean;
}): string;
/**
 * Generates a valid EIN (Employer Identification Number) for testing.
 * Format: XX-XXXXXXX.
 *
 * @param {object} [options] - Generation options
 * @returns {string} Valid EIN
 *
 * @example
 * ```typescript
 * const ein = generateEIN(); // '12-3456789'
 * ```
 */
export declare function generateEIN(options?: {
    dashes?: boolean;
}): string;
/**
 * Creates a comprehensive healthcare-specific test data set.
 *
 * @returns {HealthcareTestData} Healthcare test data
 *
 * @example
 * ```typescript
 * const healthcareData = createHealthcareTestData();
 * // { mrn: 'ABC1234567', npi: '1234567893', icd10: 'A01.234', ... }
 * ```
 */
export declare function createHealthcareTestData(): HealthcareTestData;
/**
 * Creates a patient test data factory with faker integration.
 *
 * @param {FactoryOptions<PatientTestData>} [options] - Factory options
 * @returns {PatientTestData} Patient test data
 *
 * @example
 * ```typescript
 * const patient = createPatientFactory();
 * const customPatient = createPatientFactory({
 *   overrides: { firstName: 'John', lastName: 'Doe' }
 * });
 * ```
 */
export declare function createPatientFactory(options?: FactoryOptions<PatientTestData>): PatientTestData;
/**
 * Creates a provider test data factory with healthcare-specific fields.
 *
 * @param {FactoryOptions<ProviderTestData>} [options] - Factory options
 * @returns {ProviderTestData} Provider test data
 *
 * @example
 * ```typescript
 * const provider = createProviderFactory();
 * const specialist = createProviderFactory({
 *   overrides: { specialty: 'Cardiology' }
 * });
 * ```
 */
export declare function createProviderFactory(options?: FactoryOptions<ProviderTestData>): ProviderTestData;
/**
 * Creates an appointment test data factory with scheduling constraints.
 *
 * @param {FactoryOptions<AppointmentTestData>} [options] - Factory options
 * @returns {AppointmentTestData} Appointment test data
 *
 * @example
 * ```typescript
 * const appointment = createAppointmentFactory();
 * const futureAppt = createAppointmentFactory({
 *   overrides: { scheduledAt: new Date('2025-12-31') }
 * });
 * ```
 */
export declare function createAppointmentFactory(options?: FactoryOptions<AppointmentTestData>): AppointmentTestData;
/**
 * Creates multiple instances from a factory function.
 *
 * @template T - Data type
 * @param {Function} factory - Factory function
 * @param {number} count - Number of instances to create
 * @param {FactoryOptions<T>} [options] - Factory options
 * @returns {T[]} Array of factory instances
 *
 * @example
 * ```typescript
 * const patients = createMultiple(createPatientFactory, 10);
 * const providers = createMultiple(createProviderFactory, 5, {
 *   overrides: { specialty: 'Cardiology' }
 * });
 * ```
 */
export declare function createMultiple<T>(factory: (options?: FactoryOptions<T>) => T, count: number, options?: FactoryOptions<T>): T[];
/**
 * Creates a NestJS testing module builder with common test configuration.
 *
 * @param {ModuleMetadata} metadata - Module metadata
 * @returns {TestingModuleBuilder} Testing module builder
 *
 * @example
 * ```typescript
 * const builder = createTestingModuleBuilder({
 *   providers: [UserService],
 *   imports: [DatabaseModule],
 * });
 * const module = await builder.compile();
 * ```
 */
export declare function createTestingModuleBuilder(metadata: ModuleMetadata): TestingModuleBuilder;
/**
 * Creates a compiled NestJS testing module with optional mock overrides.
 *
 * @param {ModuleMetadata} metadata - Module metadata
 * @param {Record<string, any>} [mockOverrides] - Mock provider overrides
 * @returns {Promise<TestingModule>} Compiled testing module
 *
 * @example
 * ```typescript
 * const module = await createTestModule({
 *   providers: [UserService, UserRepository],
 * }, {
 *   UserRepository: createMockRepository(),
 * });
 * ```
 */
export declare function createTestModule(metadata: ModuleMetadata, mockOverrides?: Record<string, any>): Promise<TestingModule>;
/**
 * Creates a mock NestJS service with auto-mocked methods.
 *
 * @template T - Service type
 * @param {Type<T>} serviceClass - Service class
 * @param {MockServiceConfig<T>} [config] - Mock configuration
 * @returns {jest.Mocked<T>} Mocked service
 *
 * @example
 * ```typescript
 * const mockUserService = createMockService(UserService, {
 *   returnValues: {
 *     findById: Promise.resolve(mockUser),
 *   },
 * });
 * ```
 */
export declare function createMockService<T extends object>(serviceClass: Type<T>, config?: MockServiceConfig<T>): jest.Mocked<T>;
/**
 * Creates a mock Sequelize repository with common CRUD methods.
 *
 * @template T - Model type
 * @param {Partial<T>} [defaultEntity] - Default entity for mocked returns
 * @returns {any} Mocked repository
 *
 * @example
 * ```typescript
 * const mockRepo = createMockRepository<User>({ id: '1', email: 'test@example.com' });
 * mockRepo.findByPk.mockResolvedValue(mockUser);
 * ```
 */
export declare function createMockRepository<T = any>(defaultEntity?: Partial<T>): any;
/**
 * Seeds database with test data within a transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} seederFn - Seeder function
 * @param {SeederConfig} [config] - Seeder configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedDatabase(sequelize, async (queryInterface) => {
 *   await queryInterface.bulkInsert('users', [
 *     { id: '1', email: 'test@example.com', createdAt: new Date() }
 *   ]);
 * });
 * ```
 */
export declare function seedDatabase(sequelize: Sequelize, seederFn: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>, config?: SeederConfig): Promise<void>;
/**
 * Truncates all tables in the database with proper ordering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SeederConfig} [config] - Truncation configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await truncateAllTables(sequelize, { cascade: true });
 * ```
 */
export declare function truncateAllTables(sequelize: Sequelize, config?: SeederConfig): Promise<void>;
/**
 * Creates an isolated test database with transaction rollback support.
 *
 * @param {TestDatabaseConfig} config - Database configuration
 * @returns {Promise<Sequelize>} Sequelize instance
 *
 * @example
 * ```typescript
 * const db = await createTestDatabase({
 *   dialect: 'sqlite',
 *   storage: ':memory:',
 *   models: [User, Patient, Provider],
 * });
 * ```
 */
export declare function createTestDatabase(config: TestDatabaseConfig): Promise<Sequelize>;
/**
 * Closes test database connections and cleans up resources.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await closeTestDatabase(sequelize);
 * });
 * ```
 */
export declare function closeTestDatabase(sequelize: Sequelize): Promise<void>;
/**
 * Creates a database transaction for isolated test execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Transaction>} Database transaction
 *
 * @example
 * ```typescript
 * let transaction: Transaction;
 *
 * beforeEach(async () => {
 *   transaction = await createTestTransaction(sequelize);
 * });
 *
 * afterEach(async () => {
 *   await transaction.rollback();
 * });
 * ```
 */
export declare function createTestTransaction(sequelize: Sequelize): Promise<Transaction>;
/**
 * Creates an MSW server instance for API mocking in tests.
 *
 * @param {RequestHandler[]} [handlers] - Request handlers
 * @returns {SetupServer} MSW server instance
 *
 * @example
 * ```typescript
 * const server = createMockServer([
 *   rest.get('/api/users/:id', (req, res, ctx) => {
 *     return res(ctx.json({ id: req.params.id, name: 'John Doe' }));
 *   }),
 * ]);
 * ```
 */
export declare function createMockServer(handlers?: RequestHandler[]): SetupServer;
/**
 * Creates a mock REST API handler with response configuration.
 *
 * @param {'get' | 'post' | 'put' | 'patch' | 'delete'} method - HTTP method
 * @param {string} path - API path
 * @param {any} response - Response data
 * @param {MockResponseConfig} [config] - Response configuration
 * @returns {RestHandler} MSW request handler
 *
 * @example
 * ```typescript
 * const handler = createMockAPIHandler('get', '/api/users/:id', { id: '1', name: 'John' });
 * const errorHandler = createMockAPIHandler('post', '/api/users', null, {
 *   status: 400,
 *   errors: [{ message: 'Invalid email' }],
 * });
 * ```
 */
export declare function createMockAPIHandler(method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string, response: any, config?: MockResponseConfig): RestHandler;
/**
 * Creates mock CRUD API handlers for a resource.
 *
 * @param {string} resource - Resource name (e.g., 'users')
 * @param {any[]} mockData - Mock data array
 * @returns {RestHandler[]} Array of request handlers
 *
 * @example
 * ```typescript
 * const handlers = createMockCRUDHandlers('patients', [
 *   { id: '1', name: 'John Doe' },
 *   { id: '2', name: 'Jane Smith' },
 * ]);
 * ```
 */
export declare function createMockCRUDHandlers(resource: string, mockData: any[]): RestHandler[];
/**
 * Generates a mock JWT token for testing authentication.
 *
 * @param {JWTPayload} payload - JWT payload
 * @param {object} [options] - Token options
 * @returns {string} JWT token
 *
 * @example
 * ```typescript
 * const token = generateMockJWTToken({
 *   userId: '123',
 *   email: 'test@example.com',
 *   roles: ['admin'],
 * });
 * ```
 */
export declare function generateMockJWTToken(payload: JWTPayload, options?: {
    secret?: string;
    expiresIn?: string | number;
}): string;
/**
 * Creates a mock authentication context for tests.
 *
 * @param {Partial<JWTPayload>} [overrides] - Payload overrides
 * @returns {object} Authentication context
 *
 * @example
 * ```typescript
 * const authContext = createMockAuthContext({
 *   roles: ['admin', 'provider'],
 *   organizationId: 'org-123',
 * });
 * ```
 */
export declare function createMockAuthContext(overrides?: Partial<JWTPayload>): {
    user: JWTPayload;
    token: string;
    headers: Record<string, string>;
};
/**
 * Creates a mock user session for testing.
 *
 * @param {Partial<any>} [overrides] - Session overrides
 * @returns {any} Mock session
 *
 * @example
 * ```typescript
 * const session = createMockSession({
 *   userId: 'user-123',
 *   expiresAt: new Date('2025-12-31'),
 * });
 * ```
 */
export declare function createMockSession(overrides?: Partial<any>): any;
/**
 * Freezes time to a specific date for deterministic tests.
 *
 * @param {Date | string | number} date - Target date
 * @returns {void}
 *
 * @example
 * ```typescript
 * beforeEach(() => {
 *   freezeTime('2024-01-01T00:00:00Z');
 * });
 *
 * afterEach(() => {
 *   unfreezeTime();
 * });
 * ```
 */
export declare function freezeTime(date: Date | string | number): void;
/**
 * Unfreezes time and restores real timers.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   unfreezeTime();
 * });
 * ```
 */
export declare function unfreezeTime(): void;
/**
 * Advances time by a specific duration.
 *
 * @param {number} ms - Milliseconds to advance
 * @returns {void}
 *
 * @example
 * ```typescript
 * advanceTimeBy(1000 * 60 * 60); // Advance by 1 hour
 * ```
 */
export declare function advanceTimeBy(ms: number): void;
/**
 * Advances time to the next timer.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * setTimeout(() => console.log('timer'), 1000);
 * advanceToNextTimer(); // Executes the timer
 * ```
 */
export declare function advanceToNextTimer(): void;
/**
 * Advances time to run all timers.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * setTimeout(() => console.log('timer 1'), 1000);
 * setTimeout(() => console.log('timer 2'), 2000);
 * runAllTimers(); // Executes both timers
 * ```
 */
export declare function runAllTimers(): void;
/**
 * Creates a sanitized snapshot for consistent testing.
 *
 * @param {any} data - Data to snapshot
 * @param {SnapshotOptions} [options] - Snapshot options
 * @returns {any} Sanitized snapshot data
 *
 * @example
 * ```typescript
 * expect(createSnapshot(user, {
 *   anonymize: ['id', 'createdAt'],
 *   sort: true,
 * })).toMatchSnapshot();
 * ```
 */
export declare function createSnapshot(data: any, options?: SnapshotOptions): any;
/**
 * Anonymizes sensitive fields in snapshot data.
 *
 * @param {any} data - Data to anonymize
 * @param {string[]} fields - Field names to anonymize
 * @returns {any} Anonymized data
 *
 * @example
 * ```typescript
 * const anonymized = anonymizeFields(user, ['id', 'email', 'createdAt']);
 * ```
 */
export declare function anonymizeFields(data: any, fields: string[]): any;
/**
 * Sorts object keys and arrays recursively for consistent snapshots.
 *
 * @param {any} data - Data to sort
 * @returns {any} Sorted data
 *
 * @example
 * ```typescript
 * const sorted = sortDeep({ z: 1, a: 2, m: [3, 1, 2] });
 * // { a: 2, m: [1, 2, 3], z: 1 }
 * ```
 */
export declare function sortDeep(data: any): any;
/**
 * Creates a test isolation context with automatic cleanup.
 *
 * @param {string} testName - Test name
 * @returns {TestIsolationContext} Isolation context
 *
 * @example
 * ```typescript
 * let context: TestIsolationContext;
 *
 * beforeEach(() => {
 *   context = createTestIsolation('User service tests');
 * });
 *
 * afterEach(async () => {
 *   await cleanupTestIsolation(context);
 * });
 * ```
 */
export declare function createTestIsolation(testName: string): TestIsolationContext;
/**
 * Cleans up test isolation context.
 *
 * @param {TestIsolationContext} context - Isolation context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * afterEach(async () => {
 *   await cleanupTestIsolation(context);
 * });
 * ```
 */
export declare function cleanupTestIsolation(context: TestIsolationContext): Promise<void>;
/**
 * Registers a cleanup handler for test teardown.
 *
 * @param {TestIsolationContext} context - Isolation context
 * @param {CleanupHandler} handler - Cleanup handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * registerCleanup(context, async () => {
 *   await clearCache();
 * });
 * ```
 */
export declare function registerCleanup(context: TestIsolationContext, handler: CleanupHandler): void;
/**
 * Resets all Jest mocks to their initial state.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   resetAllMocks();
 * });
 * ```
 */
export declare function resetAllMocks(): void;
/**
 * Loads JSON fixture data from a file or object.
 *
 * @template T - Fixture data type
 * @param {string | T} fixtureOrPath - Fixture data or file path
 * @returns {T} Fixture data
 *
 * @example
 * ```typescript
 * const users = loadFixture<User[]>('./fixtures/users.json');
 * const inline = loadFixture<User>({ id: '1', name: 'John' });
 * ```
 */
export declare function loadFixture<T = any>(fixtureOrPath: string | T): T;
/**
 * Creates a fixture with metadata for tracking and versioning.
 *
 * @template T - Fixture data type
 * @param {string} name - Fixture name
 * @param {T} data - Fixture data
 * @param {Partial<FixtureMetadata>} [metadata] - Additional metadata
 * @returns {object} Fixture with metadata
 *
 * @example
 * ```typescript
 * const fixture = createFixture('users-v1', [user1, user2], {
 *   version: '1.0.0',
 *   tags: ['seed', 'production'],
 * });
 * ```
 */
export declare function createFixture<T = any>(name: string, data: T, metadata?: Partial<FixtureMetadata>): {
    data: T;
    metadata: FixtureMetadata;
};
/**
 * Extends Jest matchers with healthcare-specific assertions.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * // In your test setup file
 * setupCustomMatchers();
 *
 * // In your tests
 * expect('ABC1234567').toBeValidMRN();
 * expect('1234567893').toBeValidNPI();
 * ```
 */
export declare function setupCustomMatchers(): void;
/**
 * Creates an isolated test database for parallel test execution.
 *
 * @param {string} testId - Unique test identifier
 * @param {TestDatabaseConfig} baseConfig - Base database configuration
 * @returns {Promise<Sequelize>} Isolated database instance
 *
 * @example
 * ```typescript
 * const db = await createIsolatedTestDatabase('test-suite-1', {
 *   dialect: 'postgres',
 *   database: 'test_db',
 *   models: [User, Patient],
 * });
 * ```
 */
export declare function createIsolatedTestDatabase(testId: string, baseConfig: TestDatabaseConfig): Promise<Sequelize>;
/**
 * Executes tests with isolated resources for parallel execution.
 *
 * @template T - Return type
 * @param {Function} testFn - Test function
 * @param {object} [options] - Execution options
 * @returns {Promise<T>} Test result
 *
 * @example
 * ```typescript
 * await executeWithIsolation(async () => {
 *   const user = await createUser();
 *   expect(user).toBeDefined();
 * });
 * ```
 */
export declare function executeWithIsolation<T = void>(testFn: () => Promise<T>, options?: {
    database?: Sequelize;
    cleanup?: boolean;
}): Promise<T>;
/**
 * Common test utilities bundle for quick setup.
 */
export declare const TestUtils: {
    createPatient: typeof createPatientFactory;
    createProvider: typeof createProviderFactory;
    createAppointment: typeof createAppointmentFactory;
    createMultiple: typeof createMultiple;
    generateMRN: typeof generateMRN;
    generateNPI: typeof generateNPI;
    generateICD10: typeof generateICD10;
    generateCPTCode: typeof generateCPTCode;
    generateLOINCCode: typeof generateLOINCCode;
    generateSSN: typeof generateSSN;
    generateEIN: typeof generateEIN;
    seedDatabase: typeof seedDatabase;
    truncateAllTables: typeof truncateAllTables;
    createTestDatabase: typeof createTestDatabase;
    closeTestDatabase: typeof closeTestDatabase;
    createTestTransaction: typeof createTestTransaction;
    createMockService: typeof createMockService;
    createMockRepository: typeof createMockRepository;
    createMockServer: typeof createMockServer;
    createMockAPIHandler: typeof createMockAPIHandler;
    createMockCRUDHandlers: typeof createMockCRUDHandlers;
    generateMockJWTToken: typeof generateMockJWTToken;
    createMockAuthContext: typeof createMockAuthContext;
    createMockSession: typeof createMockSession;
    freezeTime: typeof freezeTime;
    unfreezeTime: typeof unfreezeTime;
    advanceTimeBy: typeof advanceTimeBy;
    runAllTimers: typeof runAllTimers;
    resetAllMocks: typeof resetAllMocks;
    createTestIsolation: typeof createTestIsolation;
    cleanupTestIsolation: typeof cleanupTestIsolation;
    registerCleanup: typeof registerCleanup;
    createSnapshot: typeof createSnapshot;
    anonymizeFields: typeof anonymizeFields;
    sortDeep: typeof sortDeep;
    setupCustomMatchers: typeof setupCustomMatchers;
};
/**
 * Zod schemas for test data validation.
 */
export declare const TestSchemas: {
    patient: any;
    provider: any;
    appointment: any;
};
//# sourceMappingURL=testing-utilities-kit.prod.d.ts.map