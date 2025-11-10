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

import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, QueryInterface } from 'sequelize';
import { z } from 'zod';
import { ModuleMetadata, Type, DynamicModule } from '@nestjs/common';
import { rest, RestHandler, RequestHandler } from 'msw';
import { setupServer, SetupServer } from 'msw/node';
import * as jwt from 'jsonwebtoken';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// TEST DATA FACTORIES - HEALTHCARE ENTITIES
// ============================================================================

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
export function generateMRN(): string {
  const letters = faker.string.alpha({ length: 3, casing: 'upper' });
  const numbers = faker.string.numeric({ length: 7 });
  return `${letters}${numbers}`;
}

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
export function generateNPI(): string {
  // Generate 9 random digits
  const base = faker.string.numeric({ length: 9 });

  // Calculate Luhn checksum
  const digits = base.split('').map(Number);
  let sum = 0;
  let isEven = true;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  // Calculate check digit to make sum divisible by 10
  const checkDigit = (10 - (sum % 10)) % 10;
  return `${base}${checkDigit}`;
}

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
export function generateICD10(options?: { simple?: boolean }): string {
  const letter = faker.string.alpha({ length: 1, casing: 'upper' });
  const twoDigits = faker.string.numeric({ length: 2 });

  if (options?.simple) {
    return `${letter}${twoDigits}`;
  }

  const decimal = faker.string.numeric({ length: faker.number.int({ min: 1, max: 4 }) });
  return `${letter}${twoDigits}.${decimal}`;
}

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
export function generateCPTCode(): string {
  return faker.string.numeric({ length: 5 });
}

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
export function generateLOINCCode(): string {
  const base = faker.string.numeric({ length: 5 });
  const check = faker.string.numeric({ length: 1 });
  return `${base}-${check}`;
}

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
export function generateSSN(options?: { dashes?: boolean }): string {
  // Use test-safe SSN ranges (avoid real SSNs)
  const area = faker.number.int({ min: 900, max: 999 }); // Test range
  const group = faker.string.numeric({ length: 2 });
  const serial = faker.string.numeric({ length: 4 });

  if (options?.dashes === false) {
    return `${area}${group}${serial}`;
  }

  return `${area}-${group}-${serial}`;
}

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
export function generateEIN(options?: { dashes?: boolean }): string {
  const prefix = faker.string.numeric({ length: 2 });
  const suffix = faker.string.numeric({ length: 7 });

  if (options?.dashes === false) {
    return `${prefix}${suffix}`;
  }

  return `${prefix}-${suffix}`;
}

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
export function createHealthcareTestData(): HealthcareTestData {
  return {
    mrn: generateMRN(),
    npi: generateNPI(),
    icd10: generateICD10(),
    cptCode: generateCPTCode(),
    loincCode: generateLOINCCode(),
    ssn: generateSSN(),
    ein: generateEIN(),
  };
}

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
export function createPatientFactory(options?: FactoryOptions<PatientTestData>): PatientTestData {
  const defaults: PatientTestData = {
    id: faker.string.uuid(),
    mrn: generateMRN(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    email: faker.internet.email(),
    phone: faker.phone.number('###-###-####'),
    ssn: generateSSN(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
    },
  };

  return { ...defaults, ...options?.overrides };
}

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
export function createProviderFactory(options?: FactoryOptions<ProviderTestData>): ProviderTestData {
  const specialties = [
    'Family Medicine',
    'Internal Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
  ];

  const defaults: ProviderTestData = {
    id: faker.string.uuid(),
    npi: generateNPI(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    specialty: faker.helpers.arrayElement(specialties),
    email: faker.internet.email(),
    phone: faker.phone.number('###-###-####'),
    licenseNumber: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
    licenseState: faker.location.state({ abbreviated: true }),
  };

  return { ...defaults, ...options?.overrides };
}

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
export function createAppointmentFactory(options?: FactoryOptions<AppointmentTestData>): AppointmentTestData {
  const types = ['initial', 'followup', 'consultation', 'procedure', 'telehealth'];
  const statuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'];

  const defaults: AppointmentTestData = {
    id: faker.string.uuid(),
    patientId: faker.string.uuid(),
    providerId: faker.string.uuid(),
    scheduledAt: faker.date.future(),
    duration: faker.helpers.arrayElement([15, 30, 45, 60]),
    type: faker.helpers.arrayElement(types),
    status: faker.helpers.arrayElement(statuses),
    reason: faker.lorem.sentence(),
    notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.3 }),
  };

  return { ...defaults, ...options?.overrides };
}

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
export function createMultiple<T>(
  factory: (options?: FactoryOptions<T>) => T,
  count: number,
  options?: FactoryOptions<T>
): T[] {
  return Array.from({ length: count }, () => factory(options));
}

// ============================================================================
// NESTJS TESTING MODULE HELPERS
// ============================================================================

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
export function createTestingModuleBuilder(metadata: ModuleMetadata): TestingModuleBuilder {
  return Test.createTestingModule(metadata);
}

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
export async function createTestModule(
  metadata: ModuleMetadata,
  mockOverrides?: Record<string, any>
): Promise<TestingModule> {
  let builder = Test.createTestingModule(metadata);

  if (mockOverrides) {
    Object.entries(mockOverrides).forEach(([token, mock]) => {
      builder = builder.overrideProvider(token).useValue(mock);
    });
  }

  return builder.compile();
}

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
export function createMockService<T extends object>(
  serviceClass: Type<T>,
  config?: MockServiceConfig<T>
): jest.Mocked<T> {
  const mock: any = {};
  const prototype = serviceClass.prototype;
  const methods = Object.getOwnPropertyNames(prototype).filter(
    (name) => name !== 'constructor' && typeof prototype[name] === 'function'
  );

  methods.forEach((method) => {
    if (config?.implementations?.[method as keyof T]) {
      mock[method] = config.implementations[method as keyof T];
    } else if (config?.returnValues?.[method as keyof T]) {
      mock[method] = jest.fn().mockResolvedValue(config.returnValues[method as keyof T]);
    } else {
      mock[method] = jest.fn();
    }
  });

  return mock as jest.Mocked<T>;
}

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
export function createMockRepository<T = any>(defaultEntity?: Partial<T>): any {
  return {
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(defaultEntity || null),
    findOne: jest.fn().mockResolvedValue(defaultEntity || null),
    create: jest.fn().mockImplementation((data) => Promise.resolve({ ...defaultEntity, ...data })),
    update: jest.fn().mockResolvedValue([1]),
    destroy: jest.fn().mockResolvedValue(1),
    count: jest.fn().mockResolvedValue(0),
    bulkCreate: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
    upsert: jest.fn().mockResolvedValue([defaultEntity, true]),
    restore: jest.fn().mockResolvedValue(undefined),
    truncate: jest.fn().mockResolvedValue(undefined),
  };
}

// ============================================================================
// DATABASE SEEDERS AND MANAGEMENT
// ============================================================================

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
export async function seedDatabase(
  sequelize: Sequelize,
  seederFn: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>,
  config?: SeederConfig
): Promise<void> {
  const transaction = config?.transaction || (await sequelize.transaction());

  try {
    await seederFn(sequelize.getQueryInterface(), transaction);
    if (!config?.transaction) {
      await transaction.commit();
    }
  } catch (error) {
    if (!config?.transaction) {
      await transaction.rollback();
    }
    throw error;
  }
}

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
export async function truncateAllTables(sequelize: Sequelize, config?: SeederConfig): Promise<void> {
  const queryInterface = sequelize.getQueryInterface();
  const models = sequelize.models;

  const transaction = config?.transaction || (await sequelize.transaction());

  try {
    // Disable foreign key checks
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query('SET CONSTRAINTS ALL DEFERRED', { transaction });
    } else if (sequelize.getDialect() === 'mysql') {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
    }

    // Truncate each table
    for (const modelName of Object.keys(models)) {
      const model = models[modelName];
      await model.destroy({
        where: {},
        truncate: true,
        cascade: config?.cascade ?? true,
        restartIdentity: config?.restartIdentity ?? true,
        force: config?.force ?? true,
        transaction,
      });
    }

    // Re-enable foreign key checks
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE', { transaction });
    } else if (sequelize.getDialect() === 'mysql') {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
    }

    if (!config?.transaction) {
      await transaction.commit();
    }
  } catch (error) {
    if (!config?.transaction) {
      await transaction.rollback();
    }
    throw error;
  }
}

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
export async function createTestDatabase(config: TestDatabaseConfig): Promise<Sequelize> {
  const sequelize = new Sequelize({
    dialect: config.dialect,
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    storage: config.storage,
    logging: config.logging ?? false,
    models: config.models || [],
  });

  await sequelize.authenticate();

  if (config.sync) {
    await sequelize.sync({ force: true, alter: config.alter });
  }

  return sequelize;
}

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
export async function closeTestDatabase(sequelize: Sequelize): Promise<void> {
  await sequelize.close();
}

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
export async function createTestTransaction(sequelize: Sequelize): Promise<Transaction> {
  return sequelize.transaction();
}

// ============================================================================
// API MOCKING WITH MSW
// ============================================================================

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
export function createMockServer(handlers: RequestHandler[] = []): SetupServer {
  return setupServer(...handlers);
}

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
export function createMockAPIHandler(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  response: any,
  config?: MockResponseConfig
): RestHandler {
  return rest[method](path, async (req, res, ctx) => {
    const transforms = [ctx.status(config?.status || 200)];

    if (config?.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        transforms.push(ctx.set(key, value));
      });
    }

    if (config?.delay) {
      transforms.push(ctx.delay(config.delay));
    }

    if (config?.errors) {
      transforms.push(ctx.json({ errors: config.errors }));
    } else {
      transforms.push(ctx.json(response));
    }

    const result = res(...transforms);

    if (config?.once) {
      return result.once();
    }

    return result;
  });
}

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
export function createMockCRUDHandlers(resource: string, mockData: any[]): RestHandler[] {
  let data = [...mockData];

  return [
    // GET /api/{resource}
    rest.get(`/api/${resource}`, (req, res, ctx) => {
      return res(ctx.json({ data, total: data.length }));
    }),

    // GET /api/{resource}/:id
    rest.get(`/api/${resource}/:id`, (req, res, ctx) => {
      const item = data.find((d) => d.id === req.params.id);
      if (!item) {
        return res(ctx.status(404), ctx.json({ error: 'Not found' }));
      }
      return res(ctx.json(item));
    }),

    // POST /api/{resource}
    rest.post(`/api/${resource}`, async (req, res, ctx) => {
      const body = await req.json();
      const newItem = { id: faker.string.uuid(), ...body };
      data.push(newItem);
      return res(ctx.status(201), ctx.json(newItem));
    }),

    // PUT /api/{resource}/:id
    rest.put(`/api/${resource}/:id`, async (req, res, ctx) => {
      const index = data.findIndex((d) => d.id === req.params.id);
      if (index === -1) {
        return res(ctx.status(404), ctx.json({ error: 'Not found' }));
      }
      const body = await req.json();
      data[index] = { ...data[index], ...body };
      return res(ctx.json(data[index]));
    }),

    // DELETE /api/{resource}/:id
    rest.delete(`/api/${resource}/:id`, (req, res, ctx) => {
      const index = data.findIndex((d) => d.id === req.params.id);
      if (index === -1) {
        return res(ctx.status(404), ctx.json({ error: 'Not found' }));
      }
      data.splice(index, 1);
      return res(ctx.status(204));
    }),
  ];
}

// ============================================================================
// AUTHENTICATION MOCKING
// ============================================================================

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
export function generateMockJWTToken(
  payload: JWTPayload,
  options?: {
    secret?: string;
    expiresIn?: string | number;
  }
): string {
  const secret = options?.secret || 'test-secret';
  const expiresIn = options?.expiresIn || '1h';

  return jwt.sign(payload, secret, { expiresIn });
}

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
export function createMockAuthContext(overrides?: Partial<JWTPayload>): {
  user: JWTPayload;
  token: string;
  headers: Record<string, string>;
} {
  const user: JWTPayload = {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    roles: ['user'],
    permissions: [],
    organizationId: faker.string.uuid(),
    ...overrides,
  };

  const token = generateMockJWTToken(user);

  return {
    user,
    token,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

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
export function createMockSession(overrides?: Partial<any>): any {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    token: faker.string.alphanumeric({ length: 32 }),
    createdAt: new Date(),
    expiresAt: faker.date.future(),
    ...overrides,
  };
}

// ============================================================================
// TIME MOCKING UTILITIES
// ============================================================================

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
export function freezeTime(date: Date | string | number): void {
  const targetDate = new Date(date);
  jest.useFakeTimers();
  jest.setSystemTime(targetDate);
}

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
export function unfreezeTime(): void {
  jest.useRealTimers();
}

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
export function advanceTimeBy(ms: number): void {
  jest.advanceTimersByTime(ms);
}

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
export function advanceToNextTimer(): void {
  jest.runOnlyPendingTimers();
}

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
export function runAllTimers(): void {
  jest.runAllTimers();
}

// ============================================================================
// SNAPSHOT TESTING HELPERS
// ============================================================================

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
export function createSnapshot(data: any, options?: SnapshotOptions): any {
  let snapshot = JSON.parse(JSON.stringify(data));

  // Anonymize specified fields
  if (options?.anonymize) {
    snapshot = anonymizeFields(snapshot, options.anonymize);
  }

  // Sort arrays and object keys
  if (options?.sort) {
    snapshot = sortDeep(snapshot);
  }

  return snapshot;
}

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
export function anonymizeFields(data: any, fields: string[]): any {
  if (Array.isArray(data)) {
    return data.map((item) => anonymizeFields(item, fields));
  }

  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (fields.includes(key)) {
        result[key] = `<${key}>`;
      } else {
        result[key] = anonymizeFields(value, fields);
      }
    }
    return result;
  }

  return data;
}

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
export function sortDeep(data: any): any {
  if (Array.isArray(data)) {
    return data.map(sortDeep).sort();
  }

  if (typeof data === 'object' && data !== null) {
    const sorted: any = {};
    Object.keys(data)
      .sort()
      .forEach((key) => {
        sorted[key] = sortDeep(data[key]);
      });
    return sorted;
  }

  return data;
}

// ============================================================================
// TEST CLEANUP AND ISOLATION
// ============================================================================

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
export function createTestIsolation(testName: string): TestIsolationContext {
  return {
    testName,
    mocks: [],
    timers: false,
    cleanup: [],
  };
}

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
export async function cleanupTestIsolation(context: TestIsolationContext): Promise<void> {
  // Clear all mocks
  context.mocks.forEach((mock) => mock.mockClear());

  // Rollback transaction if exists
  if (context.transaction && !context.transaction.finished) {
    await context.transaction.rollback();
  }

  // Restore timers
  if (context.timers) {
    jest.useRealTimers();
  }

  // Run cleanup handlers
  for (const handler of context.cleanup) {
    await handler();
  }

  // Clear cleanup array
  context.cleanup = [];
}

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
export function registerCleanup(context: TestIsolationContext, handler: CleanupHandler): void {
  context.cleanup.push(handler);
}

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
export function resetAllMocks(): void {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
}

// ============================================================================
// FIXTURE LOADERS
// ============================================================================

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
export function loadFixture<T = any>(fixtureOrPath: string | T): T {
  if (typeof fixtureOrPath === 'string') {
    // In a real implementation, this would load from filesystem
    throw new Error('File-based fixtures not implemented in this example');
  }
  return fixtureOrPath as T;
}

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
export function createFixture<T = any>(
  name: string,
  data: T,
  metadata?: Partial<FixtureMetadata>
): { data: T; metadata: FixtureMetadata } {
  return {
    data,
    metadata: {
      name,
      version: metadata?.version || '1.0.0',
      createdAt: new Date(),
      dependencies: metadata?.dependencies || [],
      tags: metadata?.tags || [],
    },
  };
}

// ============================================================================
// CUSTOM JEST MATCHERS
// ============================================================================

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
export function setupCustomMatchers(): void {
  expect.extend({
    toBeValidMRN(received: string) {
      const pass = /^[A-Z]{3}\d{6,10}$/.test(received);
      return {
        pass,
        message: () =>
          pass
            ? `Expected ${received} not to be a valid MRN`
            : `Expected ${received} to be a valid MRN (format: 3 letters + 6-10 digits)`,
      };
    },

    toBeValidNPI(received: string) {
      if (!/^\d{10}$/.test(received)) {
        return {
          pass: false,
          message: () => `Expected ${received} to be a valid 10-digit NPI`,
        };
      }

      // Validate Luhn checksum
      const digits = received.split('').map(Number);
      let sum = 0;
      let isEven = false;

      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }

      const pass = sum % 10 === 0;
      return {
        pass,
        message: () =>
          pass
            ? `Expected ${received} not to be a valid NPI`
            : `Expected ${received} to be a valid NPI with correct checksum`,
      };
    },

    toBeValidICD10(received: string) {
      const pass = /^[A-Z]\d{2}(\.\d{0,4})?$/.test(received);
      return {
        pass,
        message: () =>
          pass
            ? `Expected ${received} not to be a valid ICD-10 code`
            : `Expected ${received} to be a valid ICD-10 code`,
      };
    },

    toBeValidSSN(received: string) {
      const cleaned = received.replace(/-/g, '');
      const pass = /^\d{9}$/.test(cleaned);
      return {
        pass,
        message: () =>
          pass
            ? `Expected ${received} not to be a valid SSN`
            : `Expected ${received} to be a valid SSN (format: XXX-XX-XXXX or XXXXXXXXX)`,
      };
    },
  });
}

// ============================================================================
// PARALLEL TEST SUPPORT
// ============================================================================

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
export async function createIsolatedTestDatabase(
  testId: string,
  baseConfig: TestDatabaseConfig
): Promise<Sequelize> {
  const isolatedConfig: TestDatabaseConfig = {
    ...baseConfig,
    database: `${baseConfig.database}_${testId}`,
  };

  return createTestDatabase(isolatedConfig);
}

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
export async function executeWithIsolation<T = void>(
  testFn: () => Promise<T>,
  options?: {
    database?: Sequelize;
    cleanup?: boolean;
  }
): Promise<T> {
  const transaction = options?.database ? await options.database.transaction() : null;

  try {
    const result = await testFn();

    if (transaction && options?.cleanup !== false) {
      await transaction.rollback();
    } else if (transaction) {
      await transaction.commit();
    }

    return result;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Common test utilities bundle for quick setup.
 */
export const TestUtils = {
  // Factories
  createPatient: createPatientFactory,
  createProvider: createProviderFactory,
  createAppointment: createAppointmentFactory,
  createMultiple,

  // Healthcare data generators
  generateMRN,
  generateNPI,
  generateICD10,
  generateCPTCode,
  generateLOINCCode,
  generateSSN,
  generateEIN,

  // Database
  seedDatabase,
  truncateAllTables,
  createTestDatabase,
  closeTestDatabase,
  createTestTransaction,

  // Mocking
  createMockService,
  createMockRepository,
  createMockServer,
  createMockAPIHandler,
  createMockCRUDHandlers,

  // Authentication
  generateMockJWTToken,
  createMockAuthContext,
  createMockSession,

  // Time
  freezeTime,
  unfreezeTime,
  advanceTimeBy,
  runAllTimers,

  // Cleanup
  resetAllMocks,
  createTestIsolation,
  cleanupTestIsolation,
  registerCleanup,

  // Snapshots
  createSnapshot,
  anonymizeFields,
  sortDeep,

  // Custom matchers
  setupCustomMatchers,
};

/**
 * Zod schemas for test data validation.
 */
export const TestSchemas = {
  patient: z.object({
    id: z.string().uuid(),
    mrn: z.string().regex(/^[A-Z]{3}\d{6,10}$/),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.date(),
    gender: z.enum(['male', 'female', 'other']),
    email: z.string().email(),
    phone: z.string(),
    ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
  }),

  provider: z.object({
    id: z.string().uuid(),
    npi: z.string().regex(/^\d{10}$/),
    firstName: z.string(),
    lastName: z.string(),
    specialty: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),

  appointment: z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid(),
    providerId: z.string().uuid(),
    scheduledAt: z.date(),
    duration: z.number().positive(),
    type: z.string(),
    status: z.string(),
  }),
};
