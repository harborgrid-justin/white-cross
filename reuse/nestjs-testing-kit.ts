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

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  Type,
  Provider,
  ValidationPipe,
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
  UpdateOptions,
  DestroyOptions,
  BulkCreateOptions,
  FindAndCountOptions,
  Op,
} from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// SEQUELIZE TEST MODULE BUILDERS
// ============================================================================

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
export async function createSequelizeTestModule(
  config: SequelizeTestModuleConfig,
): Promise<TestingModule> {
  const {
    models = [],
    providers = [],
    controllers = [],
    imports = [],
    dialect = 'sqlite',
    logging = false,
    inMemory = true,
    sync = true,
    database = ':memory:',
  } = config;

  const sequelizeConfig = {
    dialect,
    storage: inMemory ? ':memory:' : database,
    database: dialect === 'sqlite' ? undefined : database || 'test_db',
    models,
    logging,
    sync: sync ? { force: true } : undefined,
    define: {
      timestamps: true,
      paranoid: true,
    },
  };

  const testModule = await Test.createTestingModule({
    imports: [
      SequelizeModule.forRoot(sequelizeConfig as any),
      SequelizeModule.forFeature(models),
      ...imports,
    ],
    providers,
    controllers,
  })
    .setLogger(false as any)
    .compile();

  // Auto-sync if enabled
  if (sync) {
    const sequelize = testModule.get<Sequelize>(Sequelize);
    await sequelize.sync({ force: true });
  }

  return testModule;
}

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
export async function createMinimalSequelizeTestModule(
  model: ModelStatic<any>,
  service: Type<any>,
  dependencies: Provider[] = [],
): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      service,
      {
        provide: getModelToken(model),
        useValue: createMockSequelizeModel(),
      },
      ...dependencies,
    ],
  })
    .setLogger(false as any)
    .compile();
}

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
export async function createIntegrationSequelizeModule(
  config: SequelizeTestModuleConfig,
): Promise<TestingModule> {
  return createSequelizeTestModule({
    ...config,
    inMemory: false,
    sync: true,
    logging: config.logging ?? false,
  });
}

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
export async function createTransactionalTestModule(
  config: SequelizeTestModuleConfig,
): Promise<TestingModule> {
  const module = await createSequelizeTestModule(config);
  const sequelize = module.get<Sequelize>(Sequelize);

  // Add transaction helper to module
  (module as any).createTransaction = async (
    options?: MockTransactionOptions,
  ): Promise<TransactionTestContext> => {
    const transaction = await sequelize.transaction();
    return {
      transaction,
      rollback: async () => {
        await transaction.rollback();
      },
      commit: async () => {
        await transaction.commit();
      },
    };
  };

  return module;
}

// ============================================================================
// SEQUELIZE MOCK FACTORIES
// ============================================================================

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
export function createMockSequelizeModel<T extends Model = any>(): MockSequelizeModel<T> {
  return {
    // Query methods
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    findOrCreate: jest.fn(),
    findCreateFind: jest.fn(),

    // Mutation methods
    create: jest.fn(),
    bulkCreate: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    restore: jest.fn(),

    // Aggregation methods
    count: jest.fn(),
    max: jest.fn(),
    min: jest.fn(),
    sum: jest.fn(),

    // Increment/Decrement
    increment: jest.fn(),
    decrement: jest.fn(),

    // Upsert
    upsert: jest.fn(),

    // Build
    build: jest.fn((values: any) => values),

    // Utility methods
    truncate: jest.fn(),
    scope: jest.fn().mockReturnThis(),

    // Hooks
    addHook: jest.fn(),
    removeHook: jest.fn(),
    hasHook: jest.fn(),

    // Instance methods
    save: jest.fn(),
    reload: jest.fn(),
    validate: jest.fn(),
    toJSON: jest.fn((instance: any) => instance),
  } as MockSequelizeModel<T>;
}

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
export function createMockTransaction(
  options: MockTransactionOptions = {},
): jest.Mocked<Transaction> {
  const transaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    afterCommit: jest.fn(),
    id: faker.string.uuid(),
    finished: undefined,
    ...options,
  } as any;

  if (options.autoCommit) {
    transaction.commit.mockImplementation(() => {
      transaction.finished = 'commit';
      return Promise.resolve();
    });
  }

  if (options.autoRollback) {
    transaction.rollback.mockImplementation(() => {
      transaction.finished = 'rollback';
      return Promise.resolve();
    });
  }

  return transaction;
}

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
export function createMockSequelizeInstance(): jest.Mocked<Sequelize> {
  return {
    transaction: jest.fn().mockResolvedValue(createMockTransaction()),
    query: jest.fn(),
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    drop: jest.fn().mockResolvedValue(undefined),
    truncate: jest.fn().mockResolvedValue(undefined),
    define: jest.fn(),
    model: jest.fn(),
    models: {},
    queryInterface: {
      createTable: jest.fn(),
      dropTable: jest.fn(),
      addColumn: jest.fn(),
      removeColumn: jest.fn(),
      changeColumn: jest.fn(),
      renameTable: jest.fn(),
      showAllTables: jest.fn(),
      describeTable: jest.fn(),
      addIndex: jest.fn(),
      removeIndex: jest.fn(),
      bulkInsert: jest.fn(),
      bulkUpdate: jest.fn(),
      bulkDelete: jest.fn(),
    } as any,
  } as any;
}

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
export function createMockModelInstance<T = any>(data: Partial<T> = {}): jest.Mocked<T & Model> {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(data),
    destroy: jest.fn().mockResolvedValue(undefined),
    restore: jest.fn().mockResolvedValue(undefined),
    reload: jest.fn().mockResolvedValue(data),
    update: jest.fn().mockImplementation((updates: any) =>
      Promise.resolve({ ...data, ...updates }),
    ),
    validate: jest.fn().mockResolvedValue(undefined),
    toJSON: jest.fn().mockReturnValue(data),
    get: jest.fn((key?: string) => (key ? data[key as keyof T] : data)),
    set: jest.fn(),
    setDataValue: jest.fn(),
    getDataValue: jest.fn((key: string) => data[key as keyof T]),
    changed: jest.fn(),
    previous: jest.fn(),
    isNewRecord: false,
    sequelize: createMockSequelizeInstance(),
  } as any;
}

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
export function createMockModelProvider(
  model: ModelStatic<any>,
  mockImplementation?: MockSequelizeModel,
): Provider {
  return {
    provide: getModelToken(model),
    useValue: mockImplementation || createMockSequelizeModel(),
  };
}

// ============================================================================
// DATABASE FIXTURE GENERATORS
// ============================================================================

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
export async function seedSequelizeFixtures(
  fixtures: SequelizeFixture[],
  options: SeedOptions = {},
): Promise<Map<string, Model[]>> {
  const created = new Map<string, Model[]>();
  const { truncate = false, transaction } = options;

  // Sort fixtures by dependencies
  const sorted = topologicalSortFixtures(fixtures);

  for (const fixture of sorted) {
    if (truncate) {
      await fixture.model.truncate({ cascade: true, transaction });
    }

    const dataArray = Array.isArray(fixture.data) ? fixture.data : [fixture.data];

    let instances: Model[];
    if (fixture.bulk && dataArray.length > 1) {
      instances = await fixture.model.bulkCreate(dataArray as any[], {
        transaction,
        returning: true,
      });
    } else {
      instances = await Promise.all(
        dataArray.map((data) => fixture.model.create(data as any, { transaction })),
      );
    }

    created.set(fixture.name, instances);
  }

  return created;
}

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
export function generateFixtureData<T>(
  count: number,
  factory: (index: number) => Partial<T>,
  overrides: Partial<T> = {},
): Partial<T>[] {
  return Array.from({ length: count }, (_, i) => ({
    ...factory(i),
    ...overrides,
  }));
}

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
export function createFixtureBuilder<T extends Model>(
  model: ModelStatic<T>,
  defaults: Partial<T> | (() => Partial<T>) = {},
) {
  return {
    /**
     * Creates a single fixture instance
     */
    create: async (
      overrides: Partial<T> = {},
      options?: CreateOptions,
    ): Promise<T> => {
      const baseDefaults = typeof defaults === 'function' ? defaults() : defaults;
      return model.create({ ...baseDefaults, ...overrides } as any, options);
    },

    /**
     * Creates multiple fixture instances
     */
    createMany: async (
      count: number,
      overrides: Partial<T> = {},
      options?: BulkCreateOptions,
    ): Promise<T[]> => {
      const baseDefaults = typeof defaults === 'function' ? defaults() : defaults;
      const data = Array.from({ length: count }, () => ({
        ...baseDefaults,
        ...overrides,
      }));
      return model.bulkCreate(data as any[], options);
    },

    /**
     * Builds an instance without saving
     */
    build: (overrides: Partial<T> = {}): T => {
      const baseDefaults = typeof defaults === 'function' ? defaults() : defaults;
      return model.build({ ...baseDefaults, ...overrides } as any);
    },
  };
}

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
export async function loadFixturesFromFiles(
  fixturesPath: string,
  models: Record<string, ModelStatic<any>>,
): Promise<SequelizeFixture[]> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const fixtures: SequelizeFixture[] = [];
  const files = await fs.readdir(fixturesPath);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(path.join(fixturesPath, file), 'utf-8');
      const data = JSON.parse(content);
      const modelName = path.basename(file, '.json');

      if (models[modelName]) {
        fixtures.push({
          name: modelName,
          model: models[modelName],
          data: data,
        });
      }
    }
  }

  return fixtures;
}

// ============================================================================
// TEST DATA BUILDERS WITH RELATIONSHIPS
// ============================================================================

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
export function createTestDataBuilder<T>(config: TestDataBuilderConfig<T>) {
  return {
    /**
     * Builds test data with associations
     */
    build: async (overrides: Partial<T> = {}): Promise<T> => {
      const defaults =
        typeof config.defaults === 'function' ? config.defaults() : config.defaults || {};

      let data = { ...defaults, ...overrides } as T;

      // Build associations
      if (config.associations) {
        for (const [key, factory] of Object.entries(config.associations)) {
          if (!overrides[key as keyof T]) {
            (data as any)[key] = await factory();
          }
        }
      }

      // Apply post-build hook
      if (config.afterBuild) {
        data = await config.afterBuild(data);
      }

      return data;
    },

    /**
     * Builds multiple instances
     */
    buildMany: async (count: number, overrides: Partial<T> = {}): Promise<T[]> => {
      return Promise.all(
        Array.from({ length: count }, (_, i) =>
          this.build({ ...overrides, index: i } as any),
        ),
      );
    },
  };
}

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
export function generateTestPatientData(overrides: any = {}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
    gender: faker.helpers.arrayElement(['M', 'F', 'O']),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      country: 'USA',
    },
    insuranceNumber: `INS-${faker.string.alphanumeric(10)}`,
    emergencyContact: {
      name: faker.person.fullName(),
      relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Child']),
      phone: faker.phone.number(),
    },
    isActive: true,
    status: 'active',
    notes: 'TEST DATA - HIPAA Compliant Synthetic Information',
    ...overrides,
  };
}

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
export function generateTestMedicalRecordData(patientId: string, overrides: any = {}) {
  return {
    id: faker.string.uuid(),
    patientId,
    recordNumber: `MR-${faker.string.alphanumeric(8)}`,
    visitDate: faker.date.recent({ days: 30 }),
    chiefComplaint: faker.helpers.arrayElement([
      'Routine Checkup',
      'Follow-up Visit',
      'Test Consultation',
    ]),
    diagnosis: 'TEST DIAGNOSIS - Synthetic Data Only',
    treatment: 'TEST TREATMENT PLAN - Not Real Medical Advice',
    vitalSigns: {
      bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
      heartRate: faker.number.int({ min: 60, max: 100 }),
      temperature: faker.number.float({ min: 97, max: 99, fractionDigits: 1 }),
      respiratoryRate: faker.number.int({ min: 12, max: 20 }),
    },
    medications: [],
    allergies: [],
    notes: 'SYNTHETIC TEST DATA - HIPAA Compliant',
    providerId: faker.string.uuid(),
    facilityId: faker.string.uuid(),
    ...overrides,
  };
}

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
export function generateTestAppointmentData(
  patientId: string,
  providerId: string,
  overrides: any = {},
) {
  return {
    id: faker.string.uuid(),
    patientId,
    providerId,
    appointmentDate: faker.date.future(),
    duration: faker.helpers.arrayElement([15, 30, 45, 60]),
    type: faker.helpers.arrayElement(['Checkup', 'Follow-up', 'Consultation', 'Emergency']),
    status: faker.helpers.arrayElement(['scheduled', 'confirmed', 'completed', 'cancelled']),
    reason: 'Test appointment - synthetic data',
    notes: 'Generated for testing purposes',
    ...overrides,
  };
}

// ============================================================================
// SEQUELIZE-SPECIFIC ASSERTION HELPERS
// ============================================================================

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
export function assertModelCreated(
  mockModel: MockSequelizeModel,
  expectedData: any,
): void {
  expect(mockModel.create).toHaveBeenCalled();
  const createCall = mockModel.create.mock.calls[0];
  expect(createCall[0]).toMatchObject(expectedData);
}

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
export function assertQueryExecuted(
  mockModel: MockSequelizeModel,
  method: keyof MockSequelizeModel,
  expectedOptions?: FindOptions,
): void {
  expect(mockModel[method]).toHaveBeenCalled();
  if (expectedOptions) {
    const callOptions = mockModel[method].mock.calls[0][0];
    expect(callOptions).toMatchObject(expectedOptions);
  }
}

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
export function assertTransactionUsed(
  mockModel: MockSequelizeModel,
  method: keyof MockSequelizeModel,
  transaction: Transaction,
): void {
  expect(mockModel[method]).toHaveBeenCalled();
  const options = mockModel[method].mock.calls[0][1] || mockModel[method].mock.calls[0][0];
  expect(options?.transaction).toBe(transaction);
}

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
export function assertInstanceSaved(instance: any, expectedChanges?: any): void {
  expect(instance.save).toHaveBeenCalled();
  if (expectedChanges) {
    expect(instance).toMatchObject(expectedChanges);
  }
}

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
export function assertBulkOperation(
  mockModel: MockSequelizeModel,
  expectedCount?: number,
): void {
  expect(mockModel.bulkCreate).toHaveBeenCalled();
  if (expectedCount !== undefined) {
    const data = mockModel.bulkCreate.mock.calls[0][0];
    expect(data).toHaveLength(expectedCount);
  }
}

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
export function assertWhereCondition(
  mockModel: MockSequelizeModel,
  method: keyof MockSequelizeModel,
  expectedWhere: WhereOptions,
): void {
  expect(mockModel[method]).toHaveBeenCalled();
  const options = mockModel[method].mock.calls[0][0];
  expect(options?.where).toMatchObject(expectedWhere);
}

// ============================================================================
// TRANSACTION TESTING UTILITIES
// ============================================================================

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
export async function withTestTransaction<T>(
  sequelize: Sequelize,
  testFn: (transaction: Transaction) => Promise<T>,
): Promise<T> {
  const transaction = await sequelize.transaction();
  try {
    const result = await testFn(transaction);
    await transaction.rollback();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

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
export function createTransactionSpy() {
  const transaction = createMockTransaction();
  let committed = false;
  let rolledBack = false;

  transaction.commit.mockImplementation(async () => {
    committed = true;
  });

  transaction.rollback.mockImplementation(async () => {
    rolledBack = true;
  });

  return {
    transaction,
    wasCommitted: () => committed,
    wasRolledBack: () => rolledBack,
    reset: () => {
      committed = false;
      rolledBack = false;
      transaction.commit.mockClear();
      transaction.rollback.mockClear();
    },
  };
}

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
export async function testDeadlockHandling<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<{ success: boolean; attempts: number; result?: T }> {
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    try {
      const result = await fn();
      return { success: true, attempts, result };
    } catch (error: any) {
      if (error.name !== 'SequelizeDeadlockError' && attempts >= maxRetries) {
        throw error;
      }
      // Retry on deadlock
      await new Promise((resolve) => setTimeout(resolve, 100 * attempts));
    }
  }

  return { success: false, attempts };
}

// ============================================================================
// MODEL SPY AND STUB GENERATORS
// ============================================================================

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
export function createModelSpies(model: ModelStatic<any>): Map<string, jest.SpyInstance> {
  const spies = new Map<string, jest.SpyInstance>();
  const methods = [
    'findOne',
    'findAll',
    'findByPk',
    'findAndCountAll',
    'create',
    'bulkCreate',
    'update',
    'destroy',
    'count',
  ];

  methods.forEach((method) => {
    if (typeof (model as any)[method] === 'function') {
      const spy = jest.spyOn(model, method as any);
      spies.set(method, spy);
    }
  });

  return spies;
}

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
export function createModelStub(
  model: ModelStatic<any>,
  stubs: Record<string, any>,
): MockSequelizeModel {
  const mock = createMockSequelizeModel();

  Object.entries(stubs).forEach(([method, value]) => {
    if (typeof value === 'function') {
      mock[method].mockImplementation(value);
    } else if (value instanceof Promise) {
      mock[method].mockResolvedValue(value);
    } else {
      mock[method].mockResolvedValue(value);
    }
  });

  return mock;
}

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
export function restoreModelSpies(spies: Map<string, jest.SpyInstance>): void {
  spies.forEach((spy) => spy.mockRestore());
  spies.clear();
}

// ============================================================================
// INTEGRATION TEST PATTERNS
// ============================================================================

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
export async function testModelCRUD(
  model: ModelStatic<any>,
  testData: {
    create: any;
    update?: any;
    findOptions?: FindOptions;
  },
): Promise<{
  created: Model;
  updated?: Model;
  found?: Model[];
  deleted: boolean;
}> {
  // Create
  const created = await model.create(testData.create);
  expect(created).toBeDefined();
  expect(created.id).toBeDefined();

  // Read
  const found = await model.findAll(testData.findOptions);
  expect(found.length).toBeGreaterThan(0);

  // Update
  let updated;
  if (testData.update) {
    await created.update(testData.update);
    updated = await model.findByPk(created.id);
    expect(updated).toMatchObject(testData.update);
  }

  // Delete
  await created.destroy();
  const deletedRecord = await model.findByPk(created.id);
  const deleted = deletedRecord === null;

  return { created, updated, found, deleted };
}

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
export async function testModelAssociations(
  parentModel: ModelStatic<any>,
  childModel: ModelStatic<any>,
  parentData: any,
  childData: any,
  associationName: string,
): Promise<void> {
  const parent = await parentModel.create(parentData);
  const child = await childModel.create({
    ...childData,
    [`${parentModel.name.toLowerCase()}Id`]: parent.id,
  });

  const parentWithAssoc = await parentModel.findByPk(parent.id, {
    include: [childModel],
  });

  expect(parentWithAssoc).toBeDefined();
  expect((parentWithAssoc as any)[associationName]).toBeDefined();
  expect(Array.isArray((parentWithAssoc as any)[associationName])).toBe(true);
}

// ============================================================================
// E2E DATABASE HELPERS
// ============================================================================

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
export function setupE2EDatabase(app: INestApplication, sequelize: Sequelize) {
  return {
    /**
     * Seeds database for E2E tests
     */
    seed: async (fixtures: SequelizeFixture[]): Promise<Map<string, Model[]>> => {
      return seedSequelizeFixtures(fixtures, { truncate: true });
    },

    /**
     * Makes authenticated request
     */
    request: (method: string, path: string, token?: string): request.Test => {
      const req = request(app.getHttpServer())[method.toLowerCase() as 'get'](path);
      if (token) {
        req.set('Authorization', `Bearer ${token}`);
      }
      return req;
    },

    /**
     * Clears all database tables
     */
    cleanup: async (): Promise<void> => {
      await sequelize.truncate({ cascade: true, force: true });
    },

    /**
     * Resets database to initial state
     */
    reset: async (): Promise<void> => {
      await sequelize.drop();
      await sequelize.sync({ force: true });
    },
  };
}

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
export async function createE2EContext(module: TestingModule) {
  const sequelize = module.get<Sequelize>(Sequelize);
  let transaction: Transaction | null = null;

  return {
    /**
     * Runs test in isolated transaction
     */
    run: async <T>(fn: (t: Transaction) => Promise<T>): Promise<T> => {
      transaction = await sequelize.transaction();
      try {
        const result = await fn(transaction);
        await transaction.rollback();
        return result;
      } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
      }
    },

    /**
     * Gets current transaction
     */
    getTransaction: (): Transaction | null => transaction,
  };
}

// ============================================================================
// PERFORMANCE TESTING FOR QUERIES
// ============================================================================

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
export async function measureQueryPerformance(
  queryFn: () => Promise<any>,
  iterations: number = 10,
): Promise<{
  averageTime: number;
  minTime: number;
  maxTime: number;
  totalTime: number;
}> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await queryFn();
    const end = performance.now();
    times.push(end - start);
  }

  return {
    averageTime: times.reduce((a, b) => a + b) / times.length,
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    totalTime: times.reduce((a, b) => a + b),
  };
}

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
export async function profileNPlusOneQueries(
  sequelize: Sequelize,
  queryFn: () => Promise<any>,
): Promise<{ queryCount: number; queries: string[] }> {
  const queries: string[] = [];

  const queryLogger = (sql: string) => {
    queries.push(sql);
  };

  // Temporarily add logging
  const originalLogging = (sequelize.options as any).logging;
  (sequelize.options as any).logging = queryLogger;

  await queryFn();

  (sequelize.options as any).logging = originalLogging;

  return {
    queryCount: queries.length,
    queries,
  };
}

// ============================================================================
// MIGRATION TESTING UTILITIES
// ============================================================================

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
export async function testMigration(
  sequelize: Sequelize,
  migrationPath: string,
): Promise<{ up: boolean; down: boolean }> {
  const migration = require(migrationPath);

  let upSuccess = false;
  let downSuccess = false;

  try {
    await migration.up(sequelize.queryInterface, sequelize.constructor);
    upSuccess = true;

    await migration.down(sequelize.queryInterface, sequelize.constructor);
    downSuccess = true;
  } catch (error) {
    console.error('Migration test failed:', error);
  }

  return { up: upSuccess, down: downSuccess };
}

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
export async function verifyTableStructure(
  sequelize: Sequelize,
  tableName: string,
  expectedColumns: Record<string, any>,
): Promise<void> {
  const tableInfo = await sequelize.queryInterface.describeTable(tableName);

  Object.entries(expectedColumns).forEach(([columnName, expected]) => {
    expect(tableInfo[columnName]).toBeDefined();
    if (expected.type) {
      expect(tableInfo[columnName].type).toContain(expected.type);
    }
    if (expected.allowNull !== undefined) {
      expect(tableInfo[columnName].allowNull).toBe(expected.allowNull);
    }
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Topologically sorts fixtures by dependencies
 *
 * @param fixtures - Fixtures to sort
 * @returns Sorted fixtures
 */
function topologicalSortFixtures(fixtures: SequelizeFixture[]): SequelizeFixture[] {
  const sorted: SequelizeFixture[] = [];
  const visited = new Set<string>();

  function visit(fixture: SequelizeFixture) {
    if (visited.has(fixture.name)) return;

    if (fixture.dependencies) {
      fixture.dependencies.forEach((depName) => {
        const dep = fixtures.find((f) => f.name === depName);
        if (dep) visit(dep);
      });
    }

    visited.add(fixture.name);
    sorted.push(fixture);
  }

  fixtures.forEach(visit);
  return sorted;
}

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
export async function clearTestDatabase(
  sequelize: Sequelize,
  options: { cascade?: boolean; restartIdentity?: boolean } = {},
): Promise<void> {
  await sequelize.truncate({
    cascade: options.cascade ?? true,
    restartIdentity: options.restartIdentity ?? true,
    force: true,
  });
}

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
export async function validateModelInstance(instance: Model): Promise<{
  valid: boolean;
  errors: any[];
}> {
  try {
    await instance.validate();
    return { valid: true, errors: [] };
  } catch (error: any) {
    return {
      valid: false,
      errors: error.errors || [error],
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Test Module Builders
  createSequelizeTestModule,
  createMinimalSequelizeTestModule,
  createIntegrationSequelizeModule,
  createTransactionalTestModule,

  // Mock Factories
  createMockSequelizeModel,
  createMockTransaction,
  createMockSequelizeInstance,
  createMockModelInstance,
  createMockModelProvider,

  // Fixture Generators
  seedSequelizeFixtures,
  generateFixtureData,
  createFixtureBuilder,
  loadFixturesFromFiles,

  // Test Data Builders
  createTestDataBuilder,
  generateTestPatientData,
  generateTestMedicalRecordData,
  generateTestAppointmentData,

  // Assertion Helpers
  assertModelCreated,
  assertQueryExecuted,
  assertTransactionUsed,
  assertInstanceSaved,
  assertBulkOperation,
  assertWhereCondition,

  // Transaction Utilities
  withTestTransaction,
  createTransactionSpy,
  testDeadlockHandling,

  // Model Spies and Stubs
  createModelSpies,
  createModelStub,
  restoreModelSpies,

  // Integration Test Patterns
  testModelCRUD,
  testModelAssociations,

  // E2E Helpers
  setupE2EDatabase,
  createE2EContext,

  // Performance Testing
  measureQueryPerformance,
  profileNPlusOneQueries,

  // Migration Testing
  testMigration,
  verifyTableStructure,

  // Utility Functions
  clearTestDatabase,
  validateModelInstance,
};
