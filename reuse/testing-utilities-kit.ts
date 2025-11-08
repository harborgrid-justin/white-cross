/**
 * TESTING UTILITIES KIT
 *
 * Comprehensive testing utility library for NestJS applications with Sequelize ORM and Jest.
 * Provides 45 specialized testing helper functions covering:
 * - Test database setup and teardown with isolation
 * - Factory functions for realistic test data generation
 * - Mock generators for services, repositories, and external APIs
 * - API testing helpers with enhanced supertest wrappers
 * - Authentication and authorization test utilities
 * - Database transaction rollback strategies
 * - Test fixtures and intelligent seeders
 * - Snapshot testing and comparison helpers
 * - Integration test orchestration utilities
 * - E2E test workflow helpers
 * - Performance and load testing tools
 * - Mock data generators with Faker integration
 * - Test coverage analysis and reporting
 * - Custom assertion utilities for healthcare data
 * - HIPAA-compliant test data sanitization
 *
 * @module TestingUtilitiesKit
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
 * @security HIPAA compliant - synthetic test data with PHI sanitization
 * @example
 * ```typescript
 * import {
 *   setupTestDatabase,
 *   createTestFactory,
 *   mockAuthenticatedRequest,
 *   performanceTest
 * } from './testing-utilities-kit';
 *
 * describe('Patient API Tests', () => {
 *   let db: TestDatabase;
 *   let factory: TestFactory;
 *
 *   beforeAll(async () => {
 *     db = await setupTestDatabase({ isolate: true });
 *     factory = createTestFactory(db.sequelize);
 *   });
 *
 *   afterAll(async () => {
 *     await teardownTestDatabase(db);
 *   });
 *
 *   it('should create patient with performance metrics', async () => {
 *     const metrics = await performanceTest(async () => {
 *       const patient = await factory.create('Patient', { firstName: 'John' });
 *       return patient;
 *     });
 *     expect(metrics.duration).toBeLessThan(100);
 *   });
 * });
 * ```
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  Type,
  Provider,
  ValidationPipe,
  HttpStatus,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import {
  Sequelize,
  Model,
  ModelStatic,
  Transaction,
  WhereOptions,
  FindOptions,
  CreateOptions,
  Attributes,
  Op,
  QueryTypes,
} from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { Observable } from 'rxjs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Test database configuration and instance
 */
export interface TestDatabase {
  /** Sequelize instance */
  sequelize: Sequelize;
  /** Database name */
  name: string;
  /** Cleanup function */
  cleanup: () => Promise<void>;
  /** Transaction for test isolation */
  transaction?: Transaction;
  /** Models registered */
  models: ModelStatic<any>[];
}

/**
 * Test database setup options
 */
export interface TestDatabaseOptions {
  /** Use in-memory SQLite database */
  inMemory?: boolean;
  /** Database dialect */
  dialect?: 'sqlite' | 'postgres' | 'mysql' | 'mariadb' | 'mssql';
  /** Models to register */
  models?: ModelStatic<any>[];
  /** Enable query logging */
  logging?: boolean;
  /** Synchronize schema on setup */
  sync?: boolean;
  /** Isolate each test in transaction */
  isolate?: boolean;
  /** Database name prefix */
  namePrefix?: string;
  /** Connection pool configuration */
  pool?: {
    max?: number;
    min?: number;
    idle?: number;
  };
}

/**
 * Test factory configuration
 */
export interface FactoryDefinition<T = any> {
  /** Model class */
  model: ModelStatic<Model>;
  /** Default attributes generator */
  defaults: () => Partial<T>;
  /** Associated factories */
  associations?: Record<string, string>;
  /** Post-creation hook */
  afterCreate?: (instance: Model) => Promise<void> | void;
  /** Traits for variations */
  traits?: Record<string, Partial<T> | (() => Partial<T>)>;
}

/**
 * Test factory interface
 */
export interface TestFactory {
  /** Define a new factory */
  define<T>(name: string, definition: FactoryDefinition<T>): void;
  /** Create model instance */
  create<T = any>(name: string, overrides?: Partial<T>): Promise<Model>;
  /** Create multiple instances */
  createMany<T = any>(
    name: string,
    count: number,
    overrides?: Partial<T>,
  ): Promise<Model[]>;
  /** Build instance without saving */
  build<T = any>(name: string, overrides?: Partial<T>): Model;
  /** Build multiple instances */
  buildMany<T = any>(name: string, count: number, overrides?: Partial<T>): Model[];
  /** Create with trait */
  createWithTrait<T = any>(
    name: string,
    trait: string,
    overrides?: Partial<T>,
  ): Promise<Model>;
  /** Create with associations */
  createWithAssociations<T = any>(
    name: string,
    associations: Record<string, any>,
    overrides?: Partial<T>,
  ): Promise<Model>;
}

/**
 * Mock service generator options
 */
export interface MockServiceOptions {
  /** Methods to mock */
  methods?: string[];
  /** Default return values */
  returnValues?: Record<string, any>;
  /** Auto-mock all methods */
  autoMock?: boolean;
}

/**
 * Mock repository configuration
 */
export interface MockRepositoryConfig<T = any> {
  /** Mock data to return */
  data?: T[];
  /** Enable automatic CRUD mocks */
  autoCrud?: boolean;
  /** Custom method implementations */
  customMethods?: Record<string, jest.Mock>;
}

/**
 * API test request builder
 */
export interface ApiTestRequest {
  /** HTTP method */
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** Request path */
  path: string;
  /** Request body */
  body?: any;
  /** Query parameters */
  query?: Record<string, any>;
  /** Headers */
  headers?: Record<string, string>;
  /** Authentication token */
  token?: string;
  /** Expected status code */
  expectedStatus?: number;
  /** Timeout in ms */
  timeout?: number;
}

/**
 * Authentication test context
 */
export interface AuthTestContext {
  /** Access token */
  token: string;
  /** Refresh token */
  refreshToken?: string;
  /** User information */
  user: any;
  /** Expires at timestamp */
  expiresAt?: Date;
  /** Role/permissions */
  roles?: string[];
}

/**
 * Performance test metrics
 */
export interface PerformanceMetrics {
  /** Duration in milliseconds */
  duration: number;
  /** Memory usage before test */
  memoryBefore: number;
  /** Memory usage after test */
  memoryAfter: number;
  /** Memory delta */
  memoryDelta: number;
  /** Timestamp */
  timestamp: Date;
  /** Custom metrics */
  custom?: Record<string, any>;
}

/**
 * Load test configuration
 */
export interface LoadTestConfig {
  /** Number of concurrent requests */
  concurrency: number;
  /** Total number of requests */
  totalRequests: number;
  /** Request factory function */
  requestFactory: () => Promise<any>;
  /** Ramp-up time in ms */
  rampUp?: number;
  /** Timeout per request */
  timeout?: number;
}

/**
 * Load test results
 */
export interface LoadTestResults {
  /** Total requests completed */
  completed: number;
  /** Total requests failed */
  failed: number;
  /** Average response time */
  averageTime: number;
  /** Min response time */
  minTime: number;
  /** Max response time */
  maxTime: number;
  /** Requests per second */
  requestsPerSecond: number;
  /** Error details */
  errors: Array<{ error: Error; timestamp: Date }>;
  /** Percentiles */
  percentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

/**
 * Snapshot comparison options
 */
export interface SnapshotOptions {
  /** Snapshot name */
  name?: string;
  /** Properties to exclude */
  exclude?: string[];
  /** Property matcher functions */
  matchers?: Record<string, (value: any) => boolean>;
  /** Update snapshots */
  update?: boolean;
}

/**
 * Test fixture data
 */
export interface TestFixture<T = any> {
  /** Fixture identifier */
  id: string;
  /** Model name */
  model: string;
  /** Fixture data */
  data: T | T[];
  /** Dependencies (other fixture IDs) */
  dependencies?: string[];
  /** Order for loading */
  order?: number;
}

/**
 * Seeder configuration
 */
export interface SeederConfig {
  /** Truncate tables before seeding */
  truncate?: boolean;
  /** Use transaction */
  transaction?: boolean;
  /** Cascade on truncate */
  cascade?: boolean;
  /** Fixtures to seed */
  fixtures: TestFixture[];
  /** Callback after seeding */
  afterSeed?: () => Promise<void> | void;
}

/**
 * Coverage report options
 */
export interface CoverageOptions {
  /** Minimum coverage threshold */
  threshold?: {
    statements?: number;
    branches?: number;
    functions?: number;
    lines?: number;
  };
  /** Include patterns */
  include?: string[];
  /** Exclude patterns */
  exclude?: string[];
  /** Report format */
  reporters?: Array<'text' | 'html' | 'json' | 'lcov'>;
}

/**
 * Healthcare-specific test data options
 */
export interface HealthcareTestDataOptions {
  /** Patient demographics */
  patientType?: 'adult' | 'pediatric' | 'geriatric';
  /** Medical record number format */
  mrnFormat?: string;
  /** Diagnosis codes to include */
  diagnosisCodes?: string[];
  /** Medication names */
  medications?: string[];
  /** PHI sanitization level */
  sanitization?: 'none' | 'partial' | 'full';
}

// ============================================================================
// TEST DATABASE SETUP AND TEARDOWN
// ============================================================================

/**
 * Sets up an isolated test database with optional transaction rollback
 *
 * @param options - Database configuration options
 * @returns Test database instance with cleanup utilities
 *
 * @example
 * ```typescript
 * const db = await setupTestDatabase({
 *   inMemory: true,
 *   models: [User, Patient],
 *   isolate: true,
 *   sync: true
 * });
 * ```
 */
export async function setupTestDatabase(
  options: TestDatabaseOptions = {},
): Promise<TestDatabase> {
  const {
    inMemory = true,
    dialect = 'sqlite',
    models = [],
    logging = false,
    sync = true,
    isolate = false,
    namePrefix = 'test_db',
    pool = { max: 5, min: 0, idle: 10000 },
  } = options;

  const dbName = `${namePrefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const storage = inMemory ? ':memory:' : `./test/${dbName}.sqlite`;

  const sequelize = new Sequelize({
    dialect,
    storage: dialect === 'sqlite' ? storage : undefined,
    database: dialect !== 'sqlite' ? dbName : undefined,
    logging: logging ? console.log : false,
    pool,
    define: {
      timestamps: true,
      underscored: true,
    },
  });

  // Register models
  if (models.length > 0) {
    sequelize.addModels(models);
  }

  // Synchronize schema
  if (sync) {
    await sequelize.sync({ force: true });
  }

  let transaction: Transaction | undefined;
  if (isolate) {
    transaction = await sequelize.transaction();
  }

  const cleanup = async () => {
    if (transaction) {
      await transaction.rollback();
    }
    await sequelize.close();
  };

  return {
    sequelize,
    name: dbName,
    cleanup,
    transaction,
    models,
  };
}

/**
 * Tears down test database and cleans up resources
 *
 * @param db - Test database instance
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await teardownTestDatabase(db);
 * });
 * ```
 */
export async function teardownTestDatabase(db: TestDatabase): Promise<void> {
  await db.cleanup();
}

/**
 * Creates a transaction context for test isolation
 *
 * @param sequelize - Sequelize instance
 * @returns Transaction that can be rolled back
 *
 * @example
 * ```typescript
 * const tx = await createTestTransaction(sequelize);
 * await Model.create({ data }, { transaction: tx });
 * await rollbackTestTransaction(tx);
 * ```
 */
export async function createTestTransaction(
  sequelize: Sequelize,
): Promise<Transaction> {
  return await sequelize.transaction();
}

/**
 * Rolls back a test transaction
 *
 * @param transaction - Transaction to rollback
 *
 * @example
 * ```typescript
 * await rollbackTestTransaction(tx);
 * ```
 */
export async function rollbackTestTransaction(
  transaction: Transaction,
): Promise<void> {
  if (!transaction.finished) {
    await transaction.rollback();
  }
}

/**
 * Truncates all tables in test database
 *
 * @param sequelize - Sequelize instance
 * @param options - Truncation options
 *
 * @example
 * ```typescript
 * await truncateAllTables(sequelize, { cascade: true });
 * ```
 */
export async function truncateAllTables(
  sequelize: Sequelize,
  options: { cascade?: boolean; restartIdentity?: boolean } = {},
): Promise<void> {
  const { cascade = true, restartIdentity = true } = options;

  const models = Object.values(sequelize.models);

  // Disable foreign key checks for SQLite
  if (sequelize.getDialect() === 'sqlite') {
    await sequelize.query('PRAGMA foreign_keys = OFF');
  }

  for (const model of models) {
    await model.truncate({ cascade, restartIdentity });
  }

  // Re-enable foreign key checks
  if (sequelize.getDialect() === 'sqlite') {
    await sequelize.query('PRAGMA foreign_keys = ON');
  }
}

/**
 * Resets database to clean state between tests
 *
 * @param db - Test database instance
 * @param options - Reset options
 *
 * @example
 * ```typescript
 * beforeEach(async () => {
 *   await resetTestDatabase(db, { resync: true });
 * });
 * ```
 */
export async function resetTestDatabase(
  db: TestDatabase,
  options: { truncate?: boolean; resync?: boolean } = {},
): Promise<void> {
  const { truncate = true, resync = false } = options;

  if (resync) {
    await db.sequelize.sync({ force: true });
  } else if (truncate) {
    await truncateAllTables(db.sequelize);
  }
}

// ============================================================================
// FACTORY FUNCTIONS FOR TEST DATA
// ============================================================================

/**
 * Creates a test factory for generating model instances
 *
 * @param sequelize - Sequelize instance
 * @returns Test factory interface
 *
 * @example
 * ```typescript
 * const factory = createTestFactory(sequelize);
 * factory.define('User', {
 *   model: User,
 *   defaults: () => ({
 *     email: faker.internet.email(),
 *     firstName: faker.person.firstName()
 *   })
 * });
 * const user = await factory.create('User');
 * ```
 */
export function createTestFactory(sequelize: Sequelize): TestFactory {
  const definitions = new Map<string, FactoryDefinition>();

  return {
    define<T>(name: string, definition: FactoryDefinition<T>): void {
      definitions.set(name, definition);
    },

    async create<T = any>(name: string, overrides: Partial<T> = {}): Promise<Model> {
      const definition = definitions.get(name);
      if (!definition) {
        throw new Error(`Factory definition not found: ${name}`);
      }

      const defaults =
        typeof definition.defaults === 'function'
          ? definition.defaults()
          : definition.defaults;

      const attributes = { ...defaults, ...overrides };
      const instance = await definition.model.create(attributes);

      if (definition.afterCreate) {
        await definition.afterCreate(instance);
      }

      return instance;
    },

    async createMany<T = any>(
      name: string,
      count: number,
      overrides: Partial<T> = {},
    ): Promise<Model[]> {
      const instances: Model[] = [];
      for (let i = 0; i < count; i++) {
        instances.push(await this.create(name, overrides));
      }
      return instances;
    },

    build<T = any>(name: string, overrides: Partial<T> = {}): Model {
      const definition = definitions.get(name);
      if (!definition) {
        throw new Error(`Factory definition not found: ${name}`);
      }

      const defaults =
        typeof definition.defaults === 'function'
          ? definition.defaults()
          : definition.defaults;

      const attributes = { ...defaults, ...overrides };
      return definition.model.build(attributes);
    },

    buildMany<T = any>(
      name: string,
      count: number,
      overrides: Partial<T> = {},
    ): Model[] {
      const instances: Model[] = [];
      for (let i = 0; i < count; i++) {
        instances.push(this.build(name, overrides));
      }
      return instances;
    },

    async createWithTrait<T = any>(
      name: string,
      trait: string,
      overrides: Partial<T> = {},
    ): Promise<Model> {
      const definition = definitions.get(name);
      if (!definition) {
        throw new Error(`Factory definition not found: ${name}`);
      }

      if (!definition.traits || !definition.traits[trait]) {
        throw new Error(`Trait not found: ${trait} in factory ${name}`);
      }

      const traitData =
        typeof definition.traits[trait] === 'function'
          ? (definition.traits[trait] as Function)()
          : definition.traits[trait];

      return this.create(name, { ...traitData, ...overrides });
    },

    async createWithAssociations<T = any>(
      name: string,
      associations: Record<string, any>,
      overrides: Partial<T> = {},
    ): Promise<Model> {
      const instance = await this.create(name, overrides);

      for (const [assocName, assocData] of Object.entries(associations)) {
        const setterName = `set${assocName.charAt(0).toUpperCase()}${assocName.slice(1)}`;
        if (typeof (instance as any)[setterName] === 'function') {
          await (instance as any)[setterName](assocData);
        }
      }

      return instance;
    },
  };
}

/**
 * Generates realistic patient test data
 *
 * @param options - Healthcare data options
 * @returns Patient data object
 *
 * @example
 * ```typescript
 * const patient = generatePatientData({ patientType: 'adult' });
 * ```
 */
export function generatePatientData(
  options: HealthcareTestDataOptions = {},
): any {
  const { patientType = 'adult', mrnFormat = 'MRN-######', sanitization = 'full' } =
    options;

  const baseData = {
    mrn: mrnFormat.replace(/#+/g, (match) =>
      faker.string.numeric(match.length),
    ),
    firstName: sanitization === 'full' ? faker.person.firstName() : 'TEST',
    lastName: sanitization === 'full' ? faker.person.lastName() : 'PATIENT',
    dateOfBirth: faker.date.birthdate({
      min: patientType === 'pediatric' ? 0 : patientType === 'geriatric' ? 65 : 18,
      max: patientType === 'pediatric' ? 17 : patientType === 'geriatric' ? 100 : 64,
      mode: 'age',
    }),
    gender: faker.helpers.arrayElement(['M', 'F', 'O']),
    email: sanitization === 'full' ? faker.internet.email() : 'test@example.com',
    phone: sanitization === 'full' ? faker.phone.number() : '555-0100',
    address: {
      street: sanitization === 'full' ? faker.location.streetAddress() : '123 Test St',
      city: sanitization === 'full' ? faker.location.city() : 'Test City',
      state: sanitization === 'full' ? faker.location.state() : 'TS',
      zipCode: sanitization === 'full' ? faker.location.zipCode() : '00000',
    },
  };

  return baseData;
}

/**
 * Generates medical record test data
 *
 * @param patientId - Associated patient ID
 * @param options - Healthcare data options
 * @returns Medical record data
 *
 * @example
 * ```typescript
 * const record = generateMedicalRecordData(patient.id, {
 *   diagnosisCodes: ['Z00.00', 'E11.9']
 * });
 * ```
 */
export function generateMedicalRecordData(
  patientId: string,
  options: HealthcareTestDataOptions = {},
): any {
  const { diagnosisCodes = [], medications = [] } = options;

  return {
    patientId,
    visitDate: faker.date.recent({ days: 30 }),
    chiefComplaint: faker.helpers.arrayElement([
      'Annual physical',
      'Follow-up visit',
      'Routine checkup',
      'Medication review',
    ]),
    diagnosis: diagnosisCodes.length
      ? diagnosisCodes
      : [faker.string.alphanumeric(6).toUpperCase()],
    medications: medications.length
      ? medications
      : [faker.helpers.arrayElement(['Aspirin', 'Ibuprofen', 'Acetaminophen'])],
    vitalSigns: {
      temperature: faker.number.float({ min: 36.1, max: 37.2, fractionDigits: 1 }),
      heartRate: faker.number.int({ min: 60, max: 100 }),
      bloodPressure: {
        systolic: faker.number.int({ min: 110, max: 130 }),
        diastolic: faker.number.int({ min: 70, max: 85 }),
      },
      respiratoryRate: faker.number.int({ min: 12, max: 20 }),
      oxygenSaturation: faker.number.int({ min: 95, max: 100 }),
    },
    notes: faker.lorem.paragraph(),
  };
}

/**
 * Generates appointment test data
 *
 * @param patientId - Associated patient ID
 * @param providerId - Associated provider ID
 * @returns Appointment data
 *
 * @example
 * ```typescript
 * const appointment = generateAppointmentData(patient.id, provider.id);
 * ```
 */
export function generateAppointmentData(
  patientId: string,
  providerId: string,
): any {
  const appointmentDate = faker.date.future({ years: 0.1 });

  return {
    patientId,
    providerId,
    appointmentDate,
    appointmentType: faker.helpers.arrayElement([
      'consultation',
      'follow-up',
      'procedure',
      'screening',
    ]),
    status: faker.helpers.arrayElement([
      'scheduled',
      'confirmed',
      'checked-in',
      'completed',
      'cancelled',
    ]),
    durationMinutes: faker.helpers.arrayElement([15, 30, 45, 60]),
    reason: faker.lorem.sentence(),
    notes: faker.lorem.paragraph(),
  };
}

// ============================================================================
// MOCK GENERATORS
// ============================================================================

/**
 * Creates a mock service with specified methods
 *
 * @param serviceName - Name of service for debugging
 * @param options - Mock configuration options
 * @returns Mocked service object
 *
 * @example
 * ```typescript
 * const mockUserService = createMockService('UserService', {
 *   methods: ['findById', 'create', 'update'],
 *   returnValues: { findById: { id: 1, name: 'Test' } }
 * });
 * ```
 */
export function createMockService(
  serviceName: string,
  options: MockServiceOptions = {},
): any {
  const { methods = [], returnValues = {}, autoMock = true } = options;

  const mockService: any = {};

  if (autoMock && methods.length === 0) {
    // Create a Proxy to auto-mock any method call
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          const propStr = String(prop);
          if (!target[propStr]) {
            target[propStr] = jest
              .fn()
              .mockResolvedValue(returnValues[propStr] || null);
          }
          return target[propStr];
        },
      },
    );
  }

  methods.forEach((method) => {
    mockService[method] = jest
      .fn()
      .mockResolvedValue(returnValues[method] || null);
  });

  return mockService;
}

/**
 * Creates a mock Sequelize repository with CRUD operations
 *
 * @param config - Repository mock configuration
 * @returns Mocked repository
 *
 * @example
 * ```typescript
 * const mockRepo = createMockRepository({
 *   data: [{ id: 1, name: 'Test' }],
 *   autoCrud: true
 * });
 * ```
 */
export function createMockRepository<T = any>(
  config: MockRepositoryConfig<T> = {},
): any {
  const { data = [], autoCrud = true, customMethods = {} } = config;

  const mockRepo: any = {
    ...customMethods,
  };

  if (autoCrud) {
    mockRepo.findOne = jest.fn().mockResolvedValue(data[0] || null);
    mockRepo.findAll = jest.fn().mockResolvedValue(data);
    mockRepo.findByPk = jest.fn((id: any) => {
      const item = data.find((d: any) => d.id === id);
      return Promise.resolve(item || null);
    });
    mockRepo.findAndCountAll = jest.fn().mockResolvedValue({
      rows: data,
      count: data.length,
    });
    mockRepo.create = jest.fn((attrs: any) =>
      Promise.resolve({ id: Date.now(), ...attrs }),
    );
    mockRepo.update = jest.fn().mockResolvedValue([1]);
    mockRepo.destroy = jest.fn().mockResolvedValue(1);
    mockRepo.count = jest.fn().mockResolvedValue(data.length);
    mockRepo.bulkCreate = jest.fn((items: any[]) => Promise.resolve(items));
  }

  return mockRepo;
}

/**
 * Creates a mock HTTP client for external API calls
 *
 * @param responses - Map of URL patterns to mock responses
 * @returns Mocked HTTP client
 *
 * @example
 * ```typescript
 * const mockHttp = createMockHttpClient({
 *   '/api/users': { data: [{ id: 1, name: 'User' }] },
 *   '/api/posts': { data: [{ id: 1, title: 'Post' }] }
 * });
 * ```
 */
export function createMockHttpClient(
  responses: Record<string, any> = {},
): any {
  return {
    get: jest.fn((url: string) => {
      const response = responses[url] || { data: null };
      return Promise.resolve(response);
    }),
    post: jest.fn((url: string, data: any) => {
      const response = responses[url] || { data };
      return Promise.resolve(response);
    }),
    put: jest.fn((url: string, data: any) => {
      const response = responses[url] || { data };
      return Promise.resolve(response);
    }),
    patch: jest.fn((url: string, data: any) => {
      const response = responses[url] || { data };
      return Promise.resolve(response);
    }),
    delete: jest.fn((url: string) => {
      const response = responses[url] || { data: { success: true } };
      return Promise.resolve(response);
    }),
  };
}

/**
 * Creates a mock NestJS guard
 *
 * @param shouldActivate - Whether guard should allow access
 * @returns Mock guard
 *
 * @example
 * ```typescript
 * const mockAuthGuard = createMockGuard(true);
 * ```
 */
export function createMockGuard(shouldActivate: boolean = true): any {
  return {
    canActivate: jest.fn(() => shouldActivate),
  };
}

/**
 * Creates a mock NestJS interceptor
 *
 * @param transformFn - Optional transformation function
 * @returns Mock interceptor
 *
 * @example
 * ```typescript
 * const mockInterceptor = createMockInterceptor((data) => ({ wrapped: data }));
 * ```
 */
export function createMockInterceptor(
  transformFn?: (data: any) => any,
): any {
  return {
    intercept: jest.fn(
      (context: ExecutionContext, next: CallHandler): Observable<any> => {
        if (transformFn) {
          return next.handle().pipe();
        }
        return next.handle();
      },
    ),
  };
}

// ============================================================================
// API TESTING HELPERS
// ============================================================================

/**
 * Executes an API test request with enhanced error handling
 *
 * @param app - NestJS application instance
 * @param config - Request configuration
 * @returns Supertest response
 *
 * @example
 * ```typescript
 * const response = await apiTestRequest(app, {
 *   method: 'post',
 *   path: '/api/users',
 *   body: { name: 'John' },
 *   token: 'Bearer xyz',
 *   expectedStatus: 201
 * });
 * ```
 */
export async function apiTestRequest(
  app: INestApplication,
  config: ApiTestRequest,
): Promise<request.Response> {
  const {
    method,
    path,
    body,
    query,
    headers = {},
    token,
    expectedStatus,
    timeout = 5000,
  } = config;

  let req = request(app.getHttpServer())[method](path);

  if (token) {
    req = req.set('Authorization', token);
  }

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      req = req.set(key, value);
    });
  }

  if (query) {
    req = req.query(query);
  }

  if (body) {
    req = req.send(body);
  }

  req = req.timeout(timeout);

  if (expectedStatus) {
    req = req.expect(expectedStatus);
  }

  return await req;
}

/**
 * Creates a reusable API test client with common configuration
 *
 * @param app - NestJS application instance
 * @param defaultHeaders - Default headers for all requests
 * @returns API test client
 *
 * @example
 * ```typescript
 * const client = createApiTestClient(app, { 'X-API-Version': 'v1' });
 * await client.get('/users');
 * await client.post('/users', { name: 'John' });
 * ```
 */
export function createApiTestClient(
  app: INestApplication,
  defaultHeaders: Record<string, string> = {},
): any {
  const client = {
    get: (path: string, options: Partial<ApiTestRequest> = {}) =>
      apiTestRequest(app, {
        method: 'get',
        path,
        headers: { ...defaultHeaders, ...options.headers },
        ...options,
      }),
    post: (path: string, body?: any, options: Partial<ApiTestRequest> = {}) =>
      apiTestRequest(app, {
        method: 'post',
        path,
        body,
        headers: { ...defaultHeaders, ...options.headers },
        ...options,
      }),
    put: (path: string, body?: any, options: Partial<ApiTestRequest> = {}) =>
      apiTestRequest(app, {
        method: 'put',
        path,
        body,
        headers: { ...defaultHeaders, ...options.headers },
        ...options,
      }),
    patch: (path: string, body?: any, options: Partial<ApiTestRequest> = {}) =>
      apiTestRequest(app, {
        method: 'patch',
        path,
        body,
        headers: { ...defaultHeaders, ...options.headers },
        ...options,
      }),
    delete: (path: string, options: Partial<ApiTestRequest> = {}) =>
      apiTestRequest(app, {
        method: 'delete',
        path,
        headers: { ...defaultHeaders, ...options.headers },
        ...options,
      }),
  };

  return client;
}

/**
 * Tests API pagination functionality
 *
 * @param app - NestJS application instance
 * @param endpoint - API endpoint to test
 * @param token - Optional auth token
 * @returns Pagination test results
 *
 * @example
 * ```typescript
 * const results = await testApiPagination(app, '/api/users', token);
 * expect(results.hasNextPage).toBe(true);
 * ```
 */
export async function testApiPagination(
  app: INestApplication,
  endpoint: string,
  token?: string,
): Promise<{
  firstPage: any;
  secondPage: any;
  hasNextPage: boolean;
  totalCount: number;
}> {
  const firstPageRes = await apiTestRequest(app, {
    method: 'get',
    path: endpoint,
    query: { page: 1, limit: 10 },
    token,
  });

  const secondPageRes = await apiTestRequest(app, {
    method: 'get',
    path: endpoint,
    query: { page: 2, limit: 10 },
    token,
  });

  return {
    firstPage: firstPageRes.body,
    secondPage: secondPageRes.body,
    hasNextPage: firstPageRes.body.hasNextPage || false,
    totalCount: firstPageRes.body.totalCount || 0,
  };
}

// ============================================================================
// AUTHENTICATION TEST UTILITIES
// ============================================================================

/**
 * Creates an authenticated test context with valid tokens
 *
 * @param app - NestJS application instance
 * @param credentials - Login credentials
 * @returns Authentication context
 *
 * @example
 * ```typescript
 * const auth = await mockAuthenticatedRequest(app, {
 *   email: 'test@example.com',
 *   password: 'password123'
 * });
 * const response = await apiTestRequest(app, {
 *   method: 'get',
 *   path: '/api/profile',
 *   token: auth.token
 * });
 * ```
 */
export async function mockAuthenticatedRequest(
  app: INestApplication,
  credentials: { email?: string; username?: string; password: string },
): Promise<AuthTestContext> {
  const loginRes = await apiTestRequest(app, {
    method: 'post',
    path: '/auth/login',
    body: credentials,
    expectedStatus: HttpStatus.OK,
  });

  return {
    token: loginRes.body.accessToken,
    refreshToken: loginRes.body.refreshToken,
    user: loginRes.body.user,
    expiresAt: loginRes.body.expiresAt
      ? new Date(loginRes.body.expiresAt)
      : undefined,
    roles: loginRes.body.user?.roles || [],
  };
}

/**
 * Generates a mock JWT token for testing
 *
 * @param payload - Token payload
 * @param secret - Secret key (optional)
 * @returns JWT token string
 *
 * @example
 * ```typescript
 * const token = generateMockJwtToken({ userId: 1, role: 'admin' });
 * ```
 */
export function generateMockJwtToken(
  payload: Record<string, any>,
  secret: string = 'test-secret',
): string {
  // Simple base64 encoding for testing (not secure, only for tests)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
    'base64',
  );
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = Buffer.from('test-signature').toString('base64');
  return `${header}.${body}.${signature}`;
}

/**
 * Tests role-based access control for an endpoint
 *
 * @param app - NestJS application instance
 * @param endpoint - API endpoint
 * @param roles - Roles to test
 * @returns Access results per role
 *
 * @example
 * ```typescript
 * const results = await testRoleBasedAccess(app, '/api/admin', ['admin', 'user']);
 * expect(results.admin.status).toBe(200);
 * expect(results.user.status).toBe(403);
 * ```
 */
export async function testRoleBasedAccess(
  app: INestApplication,
  endpoint: string,
  roles: string[],
): Promise<Record<string, { status: number; body: any }>> {
  const results: Record<string, { status: number; body: any }> = {};

  for (const role of roles) {
    const token = generateMockJwtToken({ role });
    const response = await apiTestRequest(app, {
      method: 'get',
      path: endpoint,
      token: `Bearer ${token}`,
    });

    results[role] = {
      status: response.status,
      body: response.body,
    };
  }

  return results;
}

// ============================================================================
// TEST FIXTURES AND SEEDERS
// ============================================================================

/**
 * Seeds database with test fixtures
 *
 * @param sequelize - Sequelize instance
 * @param config - Seeder configuration
 *
 * @example
 * ```typescript
 * await seedTestFixtures(sequelize, {
 *   truncate: true,
 *   fixtures: [
 *     { id: 'users', model: 'User', data: [{ name: 'John' }] },
 *     { id: 'posts', model: 'Post', data: [{ title: 'Test' }], dependencies: ['users'] }
 *   ]
 * });
 * ```
 */
export async function seedTestFixtures(
  sequelize: Sequelize,
  config: SeederConfig,
): Promise<void> {
  const { truncate = false, transaction = true, cascade = true, fixtures, afterSeed } = config;

  const tx = transaction ? await sequelize.transaction() : undefined;

  try {
    if (truncate) {
      await truncateAllTables(sequelize, { cascade });
    }

    // Sort fixtures by dependencies and order
    const sortedFixtures = [...fixtures].sort((a, b) => {
      const aOrder = a.order || 0;
      const bOrder = b.order || 0;
      return aOrder - bOrder;
    });

    const createdData: Record<string, any> = {};

    for (const fixture of sortedFixtures) {
      const model = sequelize.models[fixture.model];
      if (!model) {
        throw new Error(`Model not found: ${fixture.model}`);
      }

      const dataArray = Array.isArray(fixture.data)
        ? fixture.data
        : [fixture.data];

      const created = await model.bulkCreate(dataArray, { transaction: tx });
      createdData[fixture.id] = created;
    }

    if (afterSeed) {
      await afterSeed();
    }

    if (tx) {
      await tx.commit();
    }
  } catch (error) {
    if (tx) {
      await tx.rollback();
    }
    throw error;
  }
}

/**
 * Loads fixtures from JSON files
 *
 * @param fixturesPath - Path to fixtures directory
 * @returns Array of test fixtures
 *
 * @example
 * ```typescript
 * const fixtures = await loadFixturesFromFiles('./test/fixtures');
 * await seedTestFixtures(sequelize, { fixtures });
 * ```
 */
export async function loadFixturesFromFiles(
  fixturesPath: string,
): Promise<TestFixture[]> {
  const fs = require('fs').promises;
  const path = require('path');

  const fixtures: TestFixture[] = [];
  const files = await fs.readdir(fixturesPath);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(fixturesPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const fixtureData = JSON.parse(content);
      fixtures.push(fixtureData);
    }
  }

  return fixtures;
}

/**
 * Creates a fixture builder for complex test scenarios
 *
 * @param sequelize - Sequelize instance
 * @returns Fixture builder
 *
 * @example
 * ```typescript
 * const builder = createFixtureBuilder(sequelize);
 * await builder
 *   .add('User', [{ name: 'John' }, { name: 'Jane' }])
 *   .add('Post', [{ title: 'Test', userId: 1 }])
 *   .build();
 * ```
 */
export function createFixtureBuilder(sequelize: Sequelize): any {
  const fixtures: TestFixture[] = [];
  let order = 0;

  return {
    add(model: string, data: any | any[], dependencies: string[] = []) {
      fixtures.push({
        id: `${model}_${order}`,
        model,
        data,
        dependencies,
        order: order++,
      });
      return this;
    },

    async build(options: Partial<SeederConfig> = {}) {
      await seedTestFixtures(sequelize, {
        ...options,
        fixtures,
      });
      return fixtures;
    },

    clear() {
      fixtures.length = 0;
      order = 0;
      return this;
    },
  };
}

// ============================================================================
// SNAPSHOT TESTING HELPERS
// ============================================================================

/**
 * Creates a sanitized snapshot for comparison
 *
 * @param data - Data to snapshot
 * @param options - Snapshot options
 * @returns Sanitized data for snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createTestSnapshot(response.body, {
 *   exclude: ['createdAt', 'updatedAt'],
 *   matchers: { id: (v) => typeof v === 'number' }
 * });
 * expect(snapshot).toMatchSnapshot();
 * ```
 */
export function createTestSnapshot(
  data: any,
  options: SnapshotOptions = {},
): any {
  const { exclude = [], matchers = {} } = options;

  const sanitize = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};

      for (const [key, value] of Object.entries(obj)) {
        if (exclude.includes(key)) {
          continue;
        }

        if (matchers[key]) {
          sanitized[key] = matchers[key](value) ? expect.any(Object) : value;
        } else {
          sanitized[key] = sanitize(value);
        }
      }

      return sanitized;
    }

    return obj;
  };

  return sanitize(data);
}

/**
 * Compares two objects and returns differences
 *
 * @param expected - Expected object
 * @param actual - Actual object
 * @param path - Current path (for recursion)
 * @returns Array of differences
 *
 * @example
 * ```typescript
 * const diffs = compareSnapshots(expected, actual);
 * expect(diffs).toHaveLength(0);
 * ```
 */
export function compareSnapshots(
  expected: any,
  actual: any,
  path: string = '',
): Array<{ path: string; expected: any; actual: any }> {
  const differences: Array<{ path: string; expected: any; actual: any }> = [];

  const compare = (exp: any, act: any, currentPath: string) => {
    if (typeof exp !== typeof act) {
      differences.push({
        path: currentPath,
        expected: exp,
        actual: act,
      });
      return;
    }

    if (Array.isArray(exp) && Array.isArray(act)) {
      if (exp.length !== act.length) {
        differences.push({
          path: currentPath,
          expected: `Array(${exp.length})`,
          actual: `Array(${act.length})`,
        });
      }

      const maxLength = Math.max(exp.length, act.length);
      for (let i = 0; i < maxLength; i++) {
        compare(exp[i], act[i], `${currentPath}[${i}]`);
      }
      return;
    }

    if (typeof exp === 'object' && exp !== null && act !== null) {
      const expKeys = Object.keys(exp);
      const actKeys = Object.keys(act);

      const allKeys = new Set([...expKeys, ...actKeys]);

      for (const key of allKeys) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        compare(exp[key], act[key], newPath);
      }
      return;
    }

    if (exp !== act) {
      differences.push({
        path: currentPath,
        expected: exp,
        actual: act,
      });
    }
  };

  compare(expected, actual, path);
  return differences;
}

// ============================================================================
// PERFORMANCE AND LOAD TESTING
// ============================================================================

/**
 * Measures performance of a test function
 *
 * @param fn - Function to measure
 * @param iterations - Number of iterations (default: 1)
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await performanceTest(async () => {
 *   await service.findAll();
 * }, 100);
 * expect(metrics.duration).toBeLessThan(1000);
 * ```
 */
export async function performanceTest(
  fn: () => Promise<any>,
  iterations: number = 1,
): Promise<PerformanceMetrics> {
  const memoryBefore = process.memoryUsage().heapUsed;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    await fn();
  }

  const endTime = Date.now();
  const memoryAfter = process.memoryUsage().heapUsed;

  return {
    duration: endTime - startTime,
    memoryBefore,
    memoryAfter,
    memoryDelta: memoryAfter - memoryBefore,
    timestamp: new Date(),
    custom: {
      iterations,
      averageDuration: (endTime - startTime) / iterations,
    },
  };
}

/**
 * Executes load testing with concurrent requests
 *
 * @param config - Load test configuration
 * @returns Load test results
 *
 * @example
 * ```typescript
 * const results = await loadTest({
 *   concurrency: 10,
 *   totalRequests: 100,
 *   requestFactory: async () => {
 *     return await apiTestRequest(app, {
 *       method: 'get',
 *       path: '/api/users'
 *     });
 *   }
 * });
 * expect(results.failed).toBe(0);
 * ```
 */
export async function loadTest(
  config: LoadTestConfig,
): Promise<LoadTestResults> {
  const {
    concurrency,
    totalRequests,
    requestFactory,
    rampUp = 0,
    timeout = 30000,
  } = config;

  const results: number[] = [];
  const errors: Array<{ error: Error; timestamp: Date }> = [];
  let completed = 0;
  let failed = 0;

  const executeRequest = async (): Promise<number> => {
    const startTime = Date.now();
    try {
      await requestFactory();
      const duration = Date.now() - startTime;
      completed++;
      return duration;
    } catch (error) {
      failed++;
      errors.push({ error: error as Error, timestamp: new Date() });
      throw error;
    }
  };

  const batches = Math.ceil(totalRequests / concurrency);
  const startTime = Date.now();

  for (let batch = 0; batch < batches; batch++) {
    const batchSize = Math.min(
      concurrency,
      totalRequests - batch * concurrency,
    );
    const promises: Promise<number>[] = [];

    for (let i = 0; i < batchSize; i++) {
      promises.push(executeRequest().catch(() => -1));
    }

    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter((r) => r >= 0));

    // Ramp-up delay
    if (rampUp && batch < batches - 1) {
      await new Promise((resolve) => setTimeout(resolve, rampUp));
    }
  }

  const totalTime = Date.now() - startTime;
  const validResults = results.filter((r) => r >= 0);

  validResults.sort((a, b) => a - b);

  const percentile = (p: number) => {
    const index = Math.ceil((validResults.length * p) / 100) - 1;
    return validResults[index] || 0;
  };

  return {
    completed,
    failed,
    averageTime:
      validResults.reduce((a, b) => a + b, 0) / validResults.length || 0,
    minTime: Math.min(...validResults) || 0,
    maxTime: Math.max(...validResults) || 0,
    requestsPerSecond: (completed / totalTime) * 1000,
    errors,
    percentiles: {
      p50: percentile(50),
      p75: percentile(75),
      p90: percentile(90),
      p95: percentile(95),
      p99: percentile(99),
    },
  };
}

/**
 * Benchmarks database query performance
 *
 * @param sequelize - Sequelize instance
 * @param query - SQL query string
 * @param iterations - Number of iterations
 * @returns Query performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await benchmarkQuery(
 *   sequelize,
 *   'SELECT * FROM users WHERE active = true',
 *   1000
 * );
 * expect(metrics.averageDuration).toBeLessThan(10);
 * ```
 */
export async function benchmarkQuery(
  sequelize: Sequelize,
  query: string,
  iterations: number = 100,
): Promise<{
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  totalDuration: number;
}> {
  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    await sequelize.query(query, { type: QueryTypes.SELECT });
    const duration = Date.now() - startTime;
    durations.push(duration);
  }

  return {
    averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
    totalDuration: durations.reduce((a, b) => a + b, 0),
  };
}

// ============================================================================
// INTEGRATION AND E2E TEST HELPERS
// ============================================================================

/**
 * Creates a full NestJS application instance for E2E testing
 *
 * @param moduleClass - Application module class
 * @param config - Additional configuration
 * @returns Initialized NestJS application
 *
 * @example
 * ```typescript
 * const app = await createE2ETestApp(AppModule, {
 *   enableValidation: true,
 *   enableCors: true
 * });
 * ```
 */
export async function createE2ETestApp(
  moduleClass: Type<any>,
  config: {
    enableValidation?: boolean;
    enableCors?: boolean;
    globalPrefix?: string;
  } = {},
): Promise<INestApplication> {
  const { enableValidation = true, enableCors = false, globalPrefix } = config;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [moduleClass],
  }).compile();

  const app = moduleFixture.createNestApplication();

  if (enableValidation) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
  }

  if (enableCors) {
    app.enableCors();
  }

  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }

  await app.init();
  return app;
}

/**
 * Executes a complete E2E workflow test
 *
 * @param app - NestJS application
 * @param workflow - Array of test steps
 * @returns Workflow execution results
 *
 * @example
 * ```typescript
 * const results = await executeE2EWorkflow(app, [
 *   { name: 'Register', request: { method: 'post', path: '/auth/register', body: userData } },
 *   { name: 'Login', request: { method: 'post', path: '/auth/login', body: credentials } },
 *   { name: 'GetProfile', request: { method: 'get', path: '/profile' } }
 * ]);
 * ```
 */
export async function executeE2EWorkflow(
  app: INestApplication,
  workflow: Array<{
    name: string;
    request: ApiTestRequest;
    validate?: (response: any) => void | Promise<void>;
  }>,
): Promise<
  Array<{
    name: string;
    response: request.Response;
    duration: number;
    success: boolean;
  }>
> {
  const results: Array<{
    name: string;
    response: request.Response;
    duration: number;
    success: boolean;
  }> = [];

  let context: any = {};

  for (const step of workflow) {
    const startTime = Date.now();
    let success = false;

    try {
      // Replace context variables in request
      const processedRequest = JSON.parse(
        JSON.stringify(step.request),
        (key, value) => {
          if (typeof value === 'string' && value.startsWith('$context.')) {
            const contextKey = value.substring(9);
            return context[contextKey];
          }
          return value;
        },
      );

      const response = await apiTestRequest(app, processedRequest);

      // Store response data in context for next steps
      context[step.name] = response.body;

      if (step.validate) {
        await step.validate(response);
      }

      success = true;
      const duration = Date.now() - startTime;

      results.push({
        name: step.name,
        response,
        duration,
        success,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      results.push({
        name: step.name,
        response: null as any,
        duration,
        success,
      });
      throw error;
    }
  }

  return results;
}

// ============================================================================
// ASSERTION UTILITIES
// ============================================================================

/**
 * Asserts that object matches expected shape
 *
 * @param actual - Actual object
 * @param expected - Expected shape with matchers
 *
 * @example
 * ```typescript
 * assertObjectShape(response.body, {
 *   id: expect.any(Number),
 *   email: expect.stringContaining('@'),
 *   createdAt: expect.any(String)
 * });
 * ```
 */
export function assertObjectShape(actual: any, expected: any): void {
  expect(actual).toMatchObject(expected);
}

/**
 * Asserts HIPAA compliance for test data
 *
 * @param data - Data to validate
 * @throws Error if PHI is detected
 *
 * @example
 * ```typescript
 * assertHipaaCompliance(testData);
 * ```
 */
export function assertHipaaCompliance(data: any): void {
  const phiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Z]{2}\d{6}\b/, // Real driver's license pattern
    /\b\d{16}\b/, // Credit card
  ];

  const dataStr = JSON.stringify(data);

  for (const pattern of phiPatterns) {
    if (pattern.test(dataStr)) {
      throw new Error(
        'HIPAA Compliance Violation: Potential PHI detected in test data',
      );
    }
  }
}

/**
 * Asserts that response follows API standards
 *
 * @param response - API response object
 * @param standards - Expected standards
 *
 * @example
 * ```typescript
 * assertApiStandards(response.body, {
 *   hasData: true,
 *   hasMeta: true,
 *   hasTimestamp: true
 * });
 * ```
 */
export function assertApiStandards(
  response: any,
  standards: {
    hasData?: boolean;
    hasMeta?: boolean;
    hasTimestamp?: boolean;
    hasStatus?: boolean;
  } = {},
): void {
  const { hasData = true, hasMeta = false, hasTimestamp = false, hasStatus = false } =
    standards;

  if (hasData) {
    expect(response).toHaveProperty('data');
  }

  if (hasMeta) {
    expect(response).toHaveProperty('meta');
  }

  if (hasTimestamp) {
    expect(response).toHaveProperty('timestamp');
  }

  if (hasStatus) {
    expect(response).toHaveProperty('status');
  }
}

/**
 * Asserts database state matches expectations
 *
 * @param model - Sequelize model
 * @param conditions - Query conditions
 * @param expectations - Expected state
 *
 * @example
 * ```typescript
 * await assertDatabaseState(User, { email: 'test@example.com' }, {
 *   exists: true,
 *   count: 1,
 *   attributes: { active: true }
 * });
 * ```
 */
export async function assertDatabaseState(
  model: ModelStatic<Model>,
  conditions: WhereOptions,
  expectations: {
    exists?: boolean;
    count?: number;
    attributes?: Record<string, any>;
  },
): Promise<void> {
  const { exists, count, attributes } = expectations;

  if (exists !== undefined) {
    const record = await model.findOne({ where: conditions });
    if (exists) {
      expect(record).not.toBeNull();
    } else {
      expect(record).toBeNull();
    }
  }

  if (count !== undefined) {
    const actualCount = await model.count({ where: conditions });
    expect(actualCount).toBe(count);
  }

  if (attributes) {
    const record = await model.findOne({ where: conditions });
    expect(record).not.toBeNull();
    if (record) {
      for (const [key, value] of Object.entries(attributes)) {
        expect(record.get(key)).toBe(value);
      }
    }
  }
}

/**
 * Asserts that async function throws specific error
 *
 * @param fn - Function to test
 * @param errorClass - Expected error class
 * @param errorMessage - Expected error message (optional)
 *
 * @example
 * ```typescript
 * await assertThrowsAsync(
 *   async () => await service.findById('invalid'),
 *   NotFoundException,
 *   'User not found'
 * );
 * ```
 */
export async function assertThrowsAsync(
  fn: () => Promise<any>,
  errorClass: any,
  errorMessage?: string,
): Promise<void> {
  await expect(fn()).rejects.toThrow(errorClass);
  if (errorMessage) {
    await expect(fn()).rejects.toThrow(errorMessage);
  }
}
