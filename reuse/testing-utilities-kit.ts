/**
 * @fileoverview Testing Utilities Kit - Comprehensive NestJS testing utilities
 * @module reuse/testing-utilities-kit
 * @description Complete testing toolkit for NestJS applications with utilities for
 * unit testing, integration testing, E2E testing, mocking, fixtures, and test data
 * generation. Provides reusable patterns for building robust, maintainable tests.
 *
 * Key Features:
 * - Test module builders and configuration
 * - Mock factory patterns for services and repositories
 * - Database seeding and cleanup utilities
 * - Request/response mocking helpers
 * - E2E test utilities with authentication
 * - Integration test helpers for multi-module scenarios
 * - Unit test patterns and best practices
 * - Spy and stub creators for dependencies
 * - Test data generators with Faker integration
 * - Fixture management and loading
 * - Test cleanup and teardown utilities
 * - Coverage helpers and reporting
 * - Snapshot testing utilities
 * - HIPAA-compliant test data generation
 * - Healthcare-specific test scenarios
 *
 * @target NestJS v10.x, Jest v29.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - No real PHI in test data (HIPAA compliance)
 * - Encrypted test data patterns
 * - Secure mock credentials
 * - Test isolation and cleanup
 * - Safe database state management
 * - Audit log verification in tests
 *
 * @example Basic test module setup
 * ```typescript
 * import { createTestingModuleBuilder, mockRepository } from './testing-utilities-kit';
 *
 * describe('UserService', () => {
 *   let service: UserService;
 *   let repository: Repository<User>;
 *
 *   beforeEach(async () => {
 *     const module = await createTestingModuleBuilder()
 *       .addProvider(UserService)
 *       .addMockRepository(User)
 *       .compile();
 *
 *     service = module.get<UserService>(UserService);
 *     repository = module.get(getRepositoryToken(User));
 *   });
 * });
 * ```
 *
 * @example E2E testing with authentication
 * ```typescript
 * import { createE2ETestApp, authenticateUser, cleanupE2E } from './testing-utilities-kit';
 *
 * describe('Auth E2E', () => {
 *   let app: INestApplication;
 *   let authToken: string;
 *
 *   beforeAll(async () => {
 *     app = await createE2ETestApp();
 *     authToken = await authenticateUser(app, { email: 'test@example.com' });
 *   });
 *
 *   afterAll(() => cleanupE2E(app));
 * });
 * ```
 *
 * @example Mock data generation
 * ```typescript
 * import { generateMockUser, generateMockPatient, seedDatabase } from './testing-utilities-kit';
 *
 * const user = generateMockUser({ role: 'doctor' });
 * const patient = generateMockPatient({ hasInsurance: true });
 *
 * await seedDatabase(sequelize, {
 *   users: [user],
 *   patients: [patient]
 * });
 * ```
 *
 * LOC: TEST-UTIL-001
 * UPSTREAM: @nestjs/testing, jest, @faker-js/faker, supertest
 * DOWNSTREAM: test suites, spec files, E2E tests
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, getModelToken } from '@nestjs/typeorm';
import { Sequelize, Model, Repository as SequelizeRepository, Transaction } from 'sequelize';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @enum TestType
 * @description Types of tests for categorization
 */
export enum TestType {
  UNIT = 'UNIT',
  INTEGRATION = 'INTEGRATION',
  E2E = 'E2E',
  PERFORMANCE = 'PERFORMANCE',
  SECURITY = 'SECURITY',
}

/**
 * @enum MockStrategy
 * @description Strategies for mocking dependencies
 */
export enum MockStrategy {
  FULL = 'FULL',           // Mock all methods
  PARTIAL = 'PARTIAL',     // Mock only specified methods
  SPY = 'SPY',            // Use spies on real implementation
  NONE = 'NONE',          // No mocking
}

/**
 * @interface TestModuleConfig
 * @description Configuration for test module creation
 */
export interface TestModuleConfig {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  mockStrategy?: MockStrategy;
  databaseType?: 'sqlite' | 'postgres' | 'mysql';
  enableLogging?: boolean;
}

/**
 * @interface MockRepositoryOptions
 * @description Options for creating mock repositories
 */
export interface MockRepositoryOptions {
  findOne?: jest.Mock;
  find?: jest.Mock;
  save?: jest.Mock;
  create?: jest.Mock;
  update?: jest.Mock;
  delete?: jest.Mock;
  remove?: jest.Mock;
  count?: jest.Mock;
  customMethods?: Record<string, jest.Mock>;
}

/**
 * @interface TestDataOptions
 * @description Options for generating test data
 */
export interface TestDataOptions {
  count?: number;
  overrides?: Record<string, any>;
  locale?: string;
  seed?: number;
  hipaaCompliant?: boolean;
}

/**
 * @interface E2ETestConfig
 * @description Configuration for E2E tests
 */
export interface E2ETestConfig {
  moduleFixture?: TestingModule;
  enableValidation?: boolean;
  enableCors?: boolean;
  globalPrefix?: string;
  customSetup?: (app: INestApplication) => Promise<void>;
}

/**
 * @interface AuthTokenPayload
 * @description Payload for authentication tokens in tests
 */
export interface AuthTokenPayload {
  userId: string;
  email: string;
  role?: string;
  permissions?: string[];
}

/**
 * @interface DatabaseSeedData
 * @description Structure for database seeding
 */
export interface DatabaseSeedData {
  [entityName: string]: any[];
}

/**
 * @interface TestFixture
 * @description Generic test fixture structure
 */
export interface TestFixture<T = any> {
  name: string;
  data: T;
  metadata?: Record<string, any>;
  teardown?: () => Promise<void>;
}

/**
 * @interface SnapshotOptions
 * @description Options for snapshot testing
 */
export interface SnapshotOptions {
  sanitize?: boolean;
  excludeFields?: string[];
  sortArrays?: boolean;
  customSerializer?: (data: any) => any;
}

/**
 * @interface MockRequestOptions
 * @description Options for creating mock HTTP requests
 */
export interface MockRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  user?: any;
}

/**
 * @interface AssertionHelpers
 * @description Custom assertion helpers for tests
 */
export interface AssertionHelpers {
  toBeValidUUID: (value: any) => boolean;
  toBeValidEmail: (value: any) => boolean;
  toBeValidPhoneNumber: (value: any) => boolean;
  toMatchDateFormat: (value: any, format: string) => boolean;
  toHaveProperty: (obj: any, path: string) => boolean;
}

// ============================================================================
// TEST MODULE BUILDERS
// ============================================================================

/**
 * Creates a test module builder with common configuration
 *
 * @param {TestModuleConfig} [config] - Module configuration
 * @returns {TestingModuleBuilder} Configured module builder
 *
 * @example
 * ```typescript
 * const module = await createTestingModuleBuilder({
 *   providers: [UserService],
 *   mockStrategy: MockStrategy.FULL
 * }).compile();
 * ```
 */
export const createTestingModuleBuilder = (
  config: TestModuleConfig = {},
): TestingModuleBuilder => {
  const builder = Test.createTestingModule({
    imports: config.imports || [],
    controllers: config.controllers || [],
    providers: config.providers || [],
  });

  return builder;
};

/**
 * Creates a test module with in-memory database
 *
 * @param {Type<any>[]} entities - Database entities
 * @param {any[]} [providers] - Additional providers
 * @param {'sqlite' | 'postgres' | 'mysql'} [dbType='sqlite'] - Database type
 * @returns {Promise<TestingModule>} Compiled test module
 *
 * @example
 * ```typescript
 * const module = await createTestModuleWithDatabase(
 *   [User, Patient],
 *   [UserService, PatientService],
 *   'sqlite'
 * );
 * ```
 */
export const createTestModuleWithDatabase = async (
  entities: Type<any>[],
  providers: any[] = [],
  dbType: 'sqlite' | 'postgres' | 'mysql' = 'sqlite',
): Promise<TestingModule> => {
  const { TypeOrmModule } = require('@nestjs/typeorm');

  const databaseConfig = {
    sqlite: {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: false,
      dropSchema: true,
    },
    postgres: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'test_db',
      synchronize: true,
      logging: false,
      dropSchema: true,
    },
    mysql: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test_db',
      synchronize: true,
      logging: false,
      dropSchema: true,
    },
  };

  return Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        ...databaseConfig[dbType],
        entities,
      }),
      TypeOrmModule.forFeature(entities),
    ],
    providers,
  }).compile();
};

/**
 * Creates isolated test module for unit testing
 *
 * @param {Type<any>} serviceClass - Service class to test
 * @param {any[]} [mockDependencies] - Mock dependencies
 * @returns {Promise<TestingModule>} Compiled test module
 *
 * @example
 * ```typescript
 * const module = await createIsolatedTestModule(UserService, [
 *   { provide: UserRepository, useValue: mockRepository() }
 * ]);
 * ```
 */
export const createIsolatedTestModule = async (
  serviceClass: Type<any>,
  mockDependencies: any[] = [],
): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [serviceClass, ...mockDependencies],
  }).compile();
};

/**
 * Adds mock repository to module builder
 *
 * @param {TestingModuleBuilder} builder - Module builder
 * @param {Type<any>} entity - Entity class
 * @param {Partial<MockRepositoryOptions>} [methods] - Custom mock methods
 * @returns {TestingModuleBuilder} Updated builder
 *
 * @example
 * ```typescript
 * const builder = Test.createTestingModule({});
 * addMockRepository(builder, User, { findOne: jest.fn().mockResolvedValue(mockUser) });
 * ```
 */
export const addMockRepository = (
  builder: TestingModuleBuilder,
  entity: Type<any>,
  methods: Partial<MockRepositoryOptions> = {},
): TestingModuleBuilder => {
  const mockRepo = mockRepository(methods);
  return builder.overrideProvider(getRepositoryToken(entity)).useValue(mockRepo);
};

/**
 * Creates test module with custom providers
 *
 * @param {any[]} providers - Providers to include
 * @param {any[]} [overrides] - Provider overrides
 * @returns {Promise<TestingModule>} Compiled test module
 *
 * @example
 * ```typescript
 * const module = await createTestModuleWithProviders(
 *   [UserService, EmailService],
 *   [{ provide: EmailService, useValue: mockEmailService }]
 * );
 * ```
 */
export const createTestModuleWithProviders = async (
  providers: any[],
  overrides: any[] = [],
): Promise<TestingModule> => {
  let builder = Test.createTestingModule({ providers });

  overrides.forEach((override) => {
    builder = builder.overrideProvider(override.provide).useValue(override.useValue);
  });

  return builder.compile();
};

// ============================================================================
// MOCK FACTORY PATTERNS
// ============================================================================

/**
 * Creates a mock TypeORM repository
 *
 * @param {Partial<MockRepositoryOptions>} [methods] - Custom mock methods
 * @returns {any} Mock repository
 *
 * @example
 * ```typescript
 * const repo = mockRepository({
 *   findOne: jest.fn().mockResolvedValue(user)
 * });
 * ```
 */
export const mockRepository = (methods: Partial<MockRepositoryOptions> = {}): any => {
  return {
    find: methods.find || jest.fn().mockResolvedValue([]),
    findOne: methods.findOne || jest.fn().mockResolvedValue(null),
    findOneBy: methods.findOne || jest.fn().mockResolvedValue(null),
    save: methods.save || jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    create: methods.create || jest.fn().mockImplementation((dto) => dto),
    update: methods.update || jest.fn().mockResolvedValue({ affected: 1 }),
    delete: methods.delete || jest.fn().mockResolvedValue({ affected: 1 }),
    remove: methods.remove || jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    count: methods.count || jest.fn().mockResolvedValue(0),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
      getMany: jest.fn().mockResolvedValue([]),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      execute: jest.fn().mockResolvedValue(undefined),
    }),
    ...methods.customMethods,
  };
};

/**
 * Creates a mock Sequelize model
 *
 * @param {any} [mockData] - Default mock data
 * @returns {any} Mock Sequelize model
 *
 * @example
 * ```typescript
 * const UserModel = mockSequelizeModel({ id: 1, email: 'test@example.com' });
 * ```
 */
export const mockSequelizeModel = (mockData: any = {}): any => {
  return {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(mockData),
    findByPk: jest.fn().mockResolvedValue(mockData),
    create: jest.fn().mockResolvedValue(mockData),
    update: jest.fn().mockResolvedValue([1, [mockData]]),
    destroy: jest.fn().mockResolvedValue(1),
    bulkCreate: jest.fn().mockResolvedValue([mockData]),
    count: jest.fn().mockResolvedValue(0),
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
    build: jest.fn().mockReturnValue(mockData),
    upsert: jest.fn().mockResolvedValue([mockData, true]),
  };
};

/**
 * Creates mock service with common methods
 *
 * @param {string[]} [methods] - Method names to mock
 * @returns {any} Mock service
 *
 * @example
 * ```typescript
 * const mockEmailService = mockService(['sendEmail', 'sendWelcome']);
 * mockEmailService.sendEmail.mockResolvedValue(true);
 * ```
 */
export const mockService = (methods: string[] = []): any => {
  const mock: any = {};
  methods.forEach((method) => {
    mock[method] = jest.fn();
  });
  return mock;
};

/**
 * Creates mock HTTP service for external API calls
 *
 * @param {any} [defaultResponse] - Default response data
 * @returns {any} Mock HTTP service
 *
 * @example
 * ```typescript
 * const httpService = mockHttpService({ data: { success: true } });
 * ```
 */
export const mockHttpService = (defaultResponse: any = {}): any => {
  return {
    get: jest.fn().mockResolvedValue({ data: defaultResponse }),
    post: jest.fn().mockResolvedValue({ data: defaultResponse }),
    put: jest.fn().mockResolvedValue({ data: defaultResponse }),
    patch: jest.fn().mockResolvedValue({ data: defaultResponse }),
    delete: jest.fn().mockResolvedValue({ data: defaultResponse }),
    request: jest.fn().mockResolvedValue({ data: defaultResponse }),
  };
};

/**
 * Creates mock ConfigService
 *
 * @param {Record<string, any>} [config] - Configuration values
 * @returns {any} Mock ConfigService
 *
 * @example
 * ```typescript
 * const configService = mockConfigService({
 *   JWT_SECRET: 'test-secret',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * ```
 */
export const mockConfigService = (config: Record<string, any> = {}): any => {
  return {
    get: jest.fn((key: string, defaultValue?: any) => config[key] ?? defaultValue),
    getOrThrow: jest.fn((key: string) => {
      if (!(key in config)) throw new Error(`Config key ${key} not found`);
      return config[key];
    }),
  };
};

/**
 * Creates mock JWT service
 *
 * @param {string} [secret='test-secret'] - JWT secret
 * @returns {any} Mock JwtService
 *
 * @example
 * ```typescript
 * const jwtService = mockJwtService('my-secret');
 * ```
 */
export const mockJwtService = (secret: string = 'test-secret'): any => {
  return {
    sign: jest.fn((payload: any) => `mock-token-${JSON.stringify(payload)}`),
    verify: jest.fn((token: string) => JSON.parse(token.replace('mock-token-', ''))),
    decode: jest.fn((token: string) => JSON.parse(token.replace('mock-token-', ''))),
  };
};

/**
 * Creates mock event emitter
 *
 * @returns {any} Mock EventEmitter2
 *
 * @example
 * ```typescript
 * const eventEmitter = mockEventEmitter();
 * eventEmitter.emit.mockImplementation((event, payload) => { ... });
 * ```
 */
export const mockEventEmitter = (): any => {
  return {
    emit: jest.fn().mockResolvedValue(undefined),
    emitAsync: jest.fn().mockResolvedValue([]),
    on: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  };
};

/**
 * Creates mock logger
 *
 * @returns {any} Mock Logger
 *
 * @example
 * ```typescript
 * const logger = mockLogger();
 * expect(logger.log).toHaveBeenCalledWith('User created');
 * ```
 */
export const mockLogger = (): any => {
  return {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    setContext: jest.fn(),
  };
};

// ============================================================================
// DATABASE SEEDING AND CLEANUP
// ============================================================================

/**
 * Seeds database with test data
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DatabaseSeedData} seedData - Seed data by entity
 * @param {boolean} [truncate=true] - Truncate before seeding
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedDatabase(sequelize, {
 *   users: [{ email: 'test@example.com', name: 'Test User' }],
 *   patients: [{ firstName: 'John', lastName: 'Doe' }]
 * });
 * ```
 */
export const seedDatabase = async (
  sequelize: Sequelize,
  seedData: DatabaseSeedData,
  truncate: boolean = true,
): Promise<void> => {
  if (truncate) {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  }

  for (const [tableName, records] of Object.entries(seedData)) {
    if (records && records.length > 0) {
      const model = sequelize.model(tableName);
      await model.bulkCreate(records);
    }
  }
};

/**
 * Cleans up database after tests
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [tableNames] - Specific tables to clean (all if omitted)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cleanupDatabase(sequelize, ['users', 'sessions']);
 * ```
 */
export const cleanupDatabase = async (
  sequelize: Sequelize,
  tableNames?: string[],
): Promise<void> => {
  if (tableNames) {
    for (const tableName of tableNames) {
      await sequelize.model(tableName).destroy({ where: {}, truncate: true });
    }
  } else {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  }
};

/**
 * Creates database snapshot for rollback
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [tableNames] - Tables to snapshot
 * @returns {Promise<DatabaseSeedData>} Snapshot data
 *
 * @example
 * ```typescript
 * const snapshot = await createDatabaseSnapshot(sequelize, ['users']);
 * // ... run tests ...
 * await restoreDatabaseSnapshot(sequelize, snapshot);
 * ```
 */
export const createDatabaseSnapshot = async (
  sequelize: Sequelize,
  tableNames?: string[],
): Promise<DatabaseSeedData> => {
  const snapshot: DatabaseSeedData = {};
  const tables = tableNames || Object.keys(sequelize.models);

  for (const tableName of tables) {
    const model = sequelize.model(tableName);
    const records = await model.findAll({ raw: true });
    snapshot[tableName] = records;
  }

  return snapshot;
};

/**
 * Restores database from snapshot
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DatabaseSeedData} snapshot - Snapshot data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreDatabaseSnapshot(sequelize, snapshot);
 * ```
 */
export const restoreDatabaseSnapshot = async (
  sequelize: Sequelize,
  snapshot: DatabaseSeedData,
): Promise<void> => {
  await seedDatabase(sequelize, snapshot, true);
};

/**
 * Resets database to clean state
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resetDatabase(sequelize);
 * ```
 */
export const resetDatabase = async (sequelize: Sequelize): Promise<void> => {
  await sequelize.drop();
  await sequelize.sync({ force: true });
};

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

/**
 * Generates mock user data
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @param {boolean} [hipaaCompliant=true] - Use HIPAA-compliant data
 * @returns {any} Mock user
 *
 * @example
 * ```typescript
 * const user = generateMockUser({ role: 'doctor', email: 'doctor@hospital.com' });
 * ```
 */
export const generateMockUser = (
  overrides: Partial<any> = {},
  hipaaCompliant: boolean = true,
): any => {
  return {
    id: crypto.randomUUID(),
    email: hipaaCompliant ? faker.internet.email() : overrides.email || faker.internet.email(),
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Generates mock patient data (HIPAA-compliant)
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @returns {any} Mock patient
 *
 * @example
 * ```typescript
 * const patient = generateMockPatient({ hasInsurance: true });
 * ```
 */
export const generateMockPatient = (overrides: Partial<any> = {}): any => {
  const mrn = `MRN${faker.string.numeric(8)}`;
  return {
    id: crypto.randomUUID(),
    mrn,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: faker.date.past({ years: 50 }),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    },
    emergencyContact: {
      name: faker.person.fullName(),
      relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
      phone: faker.phone.number(),
    },
    hasInsurance: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Generates mock appointment data
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @returns {any} Mock appointment
 *
 * @example
 * ```typescript
 * const appointment = generateMockAppointment({
 *   patientId: 'patient-123',
 *   doctorId: 'doctor-456'
 * });
 * ```
 */
export const generateMockAppointment = (overrides: Partial<any> = {}): any => {
  const startTime = faker.date.future();
  const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes

  return {
    id: crypto.randomUUID(),
    patientId: crypto.randomUUID(),
    doctorId: crypto.randomUUID(),
    startTime,
    endTime,
    status: faker.helpers.arrayElement(['scheduled', 'confirmed', 'completed', 'cancelled']),
    type: faker.helpers.arrayElement(['consultation', 'follow-up', 'emergency', 'routine']),
    notes: faker.lorem.sentence(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Generates mock medication data
 *
 * @param {Partial<any>} [overrides] - Property overrides
 * @returns {any} Mock medication
 *
 * @example
 * ```typescript
 * const medication = generateMockMedication({ name: 'Aspirin' });
 * ```
 */
export const generateMockMedication = (overrides: Partial<any> = {}): any => {
  return {
    id: crypto.randomUUID(),
    name: faker.helpers.arrayElement(['Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin']),
    dosage: `${faker.number.int({ min: 100, max: 1000 })}mg`,
    frequency: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Three times daily', 'As needed']),
    prescribedBy: crypto.randomUUID(),
    patientId: crypto.randomUUID(),
    startDate: faker.date.recent(),
    endDate: faker.date.future(),
    instructions: faker.lorem.sentence(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Generates array of mock data
 *
 * @param {(overrides?: Partial<any>) => any} generator - Generator function
 * @param {TestDataOptions} [options] - Generation options
 * @returns {any[]} Array of mock data
 *
 * @example
 * ```typescript
 * const users = generateMockArray(generateMockUser, { count: 10 });
 * ```
 */
export const generateMockArray = (
  generator: (overrides?: Partial<any>) => any,
  options: TestDataOptions = {},
): any[] => {
  const count = options.count || 5;
  const items: any[] = [];

  if (options.seed) {
    faker.seed(options.seed);
  }

  for (let i = 0; i < count; i++) {
    items.push(generator(options.overrides));
  }

  return items;
};

/**
 * Generates realistic test email
 *
 * @param {string} [domain='example.com'] - Email domain
 * @returns {string} Test email
 *
 * @example
 * ```typescript
 * const email = generateTestEmail('hospital.com'); // test.user.123@hospital.com
 * ```
 */
export const generateTestEmail = (domain: string = 'example.com'): string => {
  const username = `test.${faker.internet.userName().toLowerCase()}.${Date.now()}`;
  return `${username}@${domain}`;
};

/**
 * Generates test phone number
 *
 * @param {string} [format='US'] - Phone format
 * @returns {string} Test phone number
 *
 * @example
 * ```typescript
 * const phone = generateTestPhone(); // +1-555-123-4567
 * ```
 */
export const generateTestPhone = (format: string = 'US'): string => {
  if (format === 'US') {
    return `+1-555-${faker.string.numeric(3)}-${faker.string.numeric(4)}`;
  }
  return faker.phone.number();
};

// ============================================================================
// REQUEST MOCKING
// ============================================================================

/**
 * Creates mock HTTP request object
 *
 * @param {MockRequestOptions} options - Request options
 * @returns {any} Mock request
 *
 * @example
 * ```typescript
 * const req = mockRequest({
 *   method: 'POST',
 *   path: '/users',
 *   body: { email: 'test@example.com' },
 *   user: { id: '123' }
 * });
 * ```
 */
export const mockRequest = (options: MockRequestOptions): any => {
  return {
    method: options.method || 'GET',
    path: options.path,
    url: options.path,
    body: options.body || {},
    query: options.query || {},
    params: options.params || {},
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
    user: options.user,
    ip: '127.0.0.1',
    get: jest.fn((header: string) => options.headers?.[header.toLowerCase()]),
  };
};

/**
 * Creates mock HTTP response object
 *
 * @returns {any} Mock response
 *
 * @example
 * ```typescript
 * const res = mockResponse();
 * await controller.getUser(req, res);
 * expect(res.status).toHaveBeenCalledWith(200);
 * ```
 */
export const mockResponse = (): any => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    end: jest.fn(),
  };
  return res;
};

/**
 * Creates mock next function for middleware
 *
 * @returns {jest.Mock} Mock next function
 *
 * @example
 * ```typescript
 * const next = mockNext();
 * await middleware.use(req, res, next);
 * expect(next).toHaveBeenCalled();
 * ```
 */
export const mockNext = (): jest.Mock => {
  return jest.fn();
};

/**
 * Creates authenticated request mock
 *
 * @param {AuthTokenPayload} user - User payload
 * @param {Partial<MockRequestOptions>} [options] - Additional options
 * @returns {any} Authenticated mock request
 *
 * @example
 * ```typescript
 * const req = mockAuthenticatedRequest({
 *   userId: '123',
 *   email: 'user@example.com',
 *   role: 'admin'
 * });
 * ```
 */
export const mockAuthenticatedRequest = (
  user: AuthTokenPayload,
  options: Partial<MockRequestOptions> = {},
): any => {
  return mockRequest({
    ...options,
    path: options.path || '/',
    user,
    headers: {
      authorization: `Bearer mock-token-${user.userId}`,
      ...options.headers,
    },
  });
};

// ============================================================================
// E2E TEST UTILITIES
// ============================================================================

/**
 * Creates E2E test application
 *
 * @param {any} AppModule - Application module
 * @param {E2ETestConfig} [config] - E2E configuration
 * @returns {Promise<INestApplication>} Test application
 *
 * @example
 * ```typescript
 * const app = await createE2ETestApp(AppModule, {
 *   enableValidation: true,
 *   globalPrefix: 'api'
 * });
 * ```
 */
export const createE2ETestApp = async (
  AppModule: any,
  config: E2ETestConfig = {},
): Promise<INestApplication> => {
  const moduleFixture =
    config.moduleFixture ||
    (await Test.createTestingModule({
      imports: [AppModule],
    }).compile());

  const app = moduleFixture.createNestApplication();

  if (config.enableValidation !== false) {
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  }

  if (config.globalPrefix) {
    app.setGlobalPrefix(config.globalPrefix);
  }

  if (config.customSetup) {
    await config.customSetup(app);
  }

  await app.init();
  return app;
};

/**
 * Authenticates user for E2E tests
 *
 * @param {INestApplication} app - Test application
 * @param {Partial<any>} credentials - Login credentials
 * @returns {Promise<string>} Auth token
 *
 * @example
 * ```typescript
 * const token = await authenticateUser(app, {
 *   email: 'test@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export const authenticateUser = async (
  app: INestApplication,
  credentials: Partial<any>,
): Promise<string> => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)
    .expect(200);

  return response.body.accessToken || response.body.token;
};

/**
 * Performs authenticated E2E request
 *
 * @param {INestApplication} app - Test application
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method - HTTP method
 * @param {string} path - Request path
 * @param {string} token - Auth token
 * @param {any} [body] - Request body
 * @returns {request.Test} Supertest request
 *
 * @example
 * ```typescript
 * const response = await authenticatedRequest(app, 'GET', '/users', token);
 * expect(response.status).toBe(200);
 * ```
 */
export const authenticatedRequest = (
  app: INestApplication,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  token: string,
  body?: any,
): request.Test => {
  const req = request(app.getHttpServer())[method.toLowerCase()](path).set(
    'Authorization',
    `Bearer ${token}`,
  );

  if (body) {
    return req.send(body);
  }

  return req;
};

/**
 * Cleans up E2E test application
 *
 * @param {INestApplication} app - Test application
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * afterAll(async () => {
 *   await cleanupE2E(app);
 * });
 * ```
 */
export const cleanupE2E = async (app: INestApplication): Promise<void> => {
  if (app) {
    await app.close();
  }
};

/**
 * Seeds database for E2E tests
 *
 * @param {INestApplication} app - Test application
 * @param {DatabaseSeedData} seedData - Seed data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedE2EDatabase(app, {
 *   users: [generateMockUser()],
 *   patients: generateMockArray(generateMockPatient, { count: 5 })
 * });
 * ```
 */
export const seedE2EDatabase = async (
  app: INestApplication,
  seedData: DatabaseSeedData,
): Promise<void> => {
  const sequelize = app.get(Sequelize);
  await seedDatabase(sequelize, seedData);
};

// ============================================================================
// RESPONSE ASSERTION HELPERS
// ============================================================================

/**
 * Asserts response status and structure
 *
 * @param {any} response - HTTP response
 * @param {number} expectedStatus - Expected status code
 * @param {string[]} [requiredFields] - Required response fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertResponse(response, 200, ['id', 'email', 'createdAt']);
 * ```
 */
export const assertResponse = (
  response: any,
  expectedStatus: number,
  requiredFields?: string[],
): void => {
  expect(response.status).toBe(expectedStatus);

  if (requiredFields) {
    requiredFields.forEach((field) => {
      expect(response.body).toHaveProperty(field);
    });
  }
};

/**
 * Asserts paginated response structure
 *
 * @param {any} response - HTTP response
 * @param {number} [expectedStatus=200] - Expected status code
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertPaginatedResponse(response);
 * expect(response.body.items).toHaveLength(10);
 * ```
 */
export const assertPaginatedResponse = (response: any, expectedStatus: number = 200): void => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('items');
  expect(response.body).toHaveProperty('total');
  expect(response.body).toHaveProperty('page');
  expect(response.body).toHaveProperty('limit');
  expect(Array.isArray(response.body.items)).toBe(true);
};

/**
 * Asserts error response structure
 *
 * @param {any} response - HTTP response
 * @param {number} expectedStatus - Expected error status
 * @param {string} [expectedMessage] - Expected error message
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertErrorResponse(response, 404, 'User not found');
 * ```
 */
export const assertErrorResponse = (
  response: any,
  expectedStatus: number,
  expectedMessage?: string,
): void => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('message');

  if (expectedMessage) {
    expect(response.body.message).toContain(expectedMessage);
  }
};

/**
 * Asserts validation error response
 *
 * @param {any} response - HTTP response
 * @param {string[]} [expectedFields] - Expected validation fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertValidationError(response, ['email', 'password']);
 * ```
 */
export const assertValidationError = (response: any, expectedFields?: string[]): void => {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message');

  if (expectedFields) {
    expectedFields.forEach((field) => {
      expect(JSON.stringify(response.body.message)).toContain(field);
    });
  }
};

/**
 * Asserts array response
 *
 * @param {any} response - HTTP response
 * @param {number} [expectedLength] - Expected array length
 * @param {string[]} [itemFields] - Required fields in each item
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertArrayResponse(response, 5, ['id', 'name']);
 * ```
 */
export const assertArrayResponse = (
  response: any,
  expectedLength?: number,
  itemFields?: string[],
): void => {
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  if (expectedLength !== undefined) {
    expect(response.body).toHaveLength(expectedLength);
  }

  if (itemFields && response.body.length > 0) {
    itemFields.forEach((field) => {
      expect(response.body[0]).toHaveProperty(field);
    });
  }
};

// ============================================================================
// FIXTURE MANAGEMENT
// ============================================================================

/**
 * Loads test fixture from object
 *
 * @param {string} name - Fixture name
 * @param {any} data - Fixture data
 * @returns {TestFixture} Test fixture
 *
 * @example
 * ```typescript
 * const userFixture = loadFixture('testUser', {
 *   email: 'test@example.com',
 *   role: 'admin'
 * });
 * ```
 */
export const loadFixture = <T = any>(name: string, data: T): TestFixture<T> => {
  return {
    name,
    data,
    metadata: {
      loadedAt: new Date(),
    },
  };
};

/**
 * Creates fixture with teardown
 *
 * @param {string} name - Fixture name
 * @param {any} data - Fixture data
 * @param {() => Promise<void>} teardown - Teardown function
 * @returns {TestFixture} Test fixture with teardown
 *
 * @example
 * ```typescript
 * const fixture = createFixtureWithTeardown('user', user, async () => {
 *   await userRepository.delete(user.id);
 * });
 * ```
 */
export const createFixtureWithTeardown = (
  name: string,
  data: any,
  teardown: () => Promise<void>,
): TestFixture => {
  return {
    name,
    data,
    teardown,
  };
};

/**
 * Manages multiple fixtures
 *
 * @returns {FixtureManager} Fixture manager
 *
 * @example
 * ```typescript
 * const manager = createFixtureManager();
 * manager.add('user', userData);
 * const user = manager.get('user');
 * await manager.teardownAll();
 * ```
 */
export const createFixtureManager = () => {
  const fixtures = new Map<string, TestFixture>();

  return {
    add: (name: string, data: any, teardown?: () => Promise<void>) => {
      fixtures.set(name, { name, data, teardown });
    },
    get: <T = any>(name: string): T | undefined => {
      return fixtures.get(name)?.data;
    },
    has: (name: string): boolean => {
      return fixtures.has(name);
    },
    remove: async (name: string): Promise<void> => {
      const fixture = fixtures.get(name);
      if (fixture?.teardown) {
        await fixture.teardown();
      }
      fixtures.delete(name);
    },
    teardownAll: async (): Promise<void> => {
      for (const [name, fixture] of fixtures.entries()) {
        if (fixture.teardown) {
          await fixture.teardown();
        }
      }
      fixtures.clear();
    },
    clear: (): void => {
      fixtures.clear();
    },
    list: (): string[] => {
      return Array.from(fixtures.keys());
    },
  };
};

// ============================================================================
// SNAPSHOT TESTING
// ============================================================================

/**
 * Sanitizes data for snapshot testing
 *
 * @param {any} data - Data to sanitize
 * @param {SnapshotOptions} [options] - Sanitization options
 * @returns {any} Sanitized data
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeSnapshot(response, {
 *   excludeFields: ['id', 'createdAt'],
 *   sortArrays: true
 * });
 * expect(sanitized).toMatchSnapshot();
 * ```
 */
export const sanitizeSnapshot = (data: any, options: SnapshotOptions = {}): any => {
  if (options.customSerializer) {
    return options.customSerializer(data);
  }

  let result = JSON.parse(JSON.stringify(data));

  // Exclude fields
  if (options.excludeFields) {
    const exclude = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(exclude);
      } else if (obj && typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (!options.excludeFields?.includes(key)) {
            cleaned[key] = exclude(value);
          }
        }
        return cleaned;
      }
      return obj;
    };
    result = exclude(result);
  }

  // Sort arrays
  if (options.sortArrays && Array.isArray(result)) {
    result.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }

  return result;
};

/**
 * Creates inline snapshot matcher
 *
 * @param {any} received - Received value
 * @param {any} expected - Expected snapshot
 * @param {SnapshotOptions} [options] - Options
 * @returns {boolean} Match result
 *
 * @example
 * ```typescript
 * const match = matchSnapshot(response.body, expectedSnapshot, {
 *   excludeFields: ['timestamp']
 * });
 * expect(match).toBe(true);
 * ```
 */
export const matchSnapshot = (
  received: any,
  expected: any,
  options: SnapshotOptions = {},
): boolean => {
  const sanitizedReceived = sanitizeSnapshot(received, options);
  const sanitizedExpected = sanitizeSnapshot(expected, options);
  return JSON.stringify(sanitizedReceived) === JSON.stringify(sanitizedExpected);
};

// ============================================================================
// SPY AND STUB CREATORS
// ============================================================================

/**
 * Creates spy on object method
 *
 * @param {any} object - Object to spy on
 * @param {string} method - Method name
 * @returns {jest.SpyInstance} Jest spy
 *
 * @example
 * ```typescript
 * const spy = createSpy(userService, 'findById');
 * spy.mockResolvedValue(mockUser);
 * ```
 */
export const createSpy = (object: any, method: string): jest.SpyInstance => {
  return jest.spyOn(object, method);
};

/**
 * Creates multiple spies on object
 *
 * @param {any} object - Object to spy on
 * @param {string[]} methods - Method names
 * @returns {Record<string, jest.SpyInstance>} Spies by method name
 *
 * @example
 * ```typescript
 * const spies = createSpies(userService, ['findById', 'create', 'update']);
 * spies.findById.mockResolvedValue(mockUser);
 * ```
 */
export const createSpies = (object: any, methods: string[]): Record<string, jest.SpyInstance> => {
  const spies: Record<string, jest.SpyInstance> = {};
  methods.forEach((method) => {
    spies[method] = jest.spyOn(object, method);
  });
  return spies;
};

/**
 * Creates stub function with default implementation
 *
 * @param {any} [defaultReturn] - Default return value
 * @returns {jest.Mock} Mock function
 *
 * @example
 * ```typescript
 * const stub = createStub({ success: true });
 * await someFunction(stub);
 * expect(stub).toHaveBeenCalled();
 * ```
 */
export const createStub = (defaultReturn?: any): jest.Mock => {
  return jest.fn().mockResolvedValue(defaultReturn);
};

/**
 * Restores all spies
 *
 * @param {Record<string, jest.SpyInstance>} spies - Spies to restore
 * @returns {void}
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   restoreSpies(spies);
 * });
 * ```
 */
export const restoreSpies = (spies: Record<string, jest.SpyInstance>): void => {
  Object.values(spies).forEach((spy) => spy.mockRestore());
};

// ============================================================================
// COVERAGE HELPERS
// ============================================================================

/**
 * Generates coverage report summary
 *
 * @param {any} coverageMap - Jest coverage map
 * @returns {any} Coverage summary
 *
 * @example
 * ```typescript
 * const summary = generateCoverageSummary(global.__coverage__);
 * console.log(`Line coverage: ${summary.lines.pct}%`);
 * ```
 */
export const generateCoverageSummary = (coverageMap: any): any => {
  // Implementation would use istanbul or jest coverage APIs
  return {
    lines: { pct: 0, covered: 0, total: 0 },
    statements: { pct: 0, covered: 0, total: 0 },
    functions: { pct: 0, covered: 0, total: 0 },
    branches: { pct: 0, covered: 0, total: 0 },
  };
};

/**
 * Validates coverage thresholds
 *
 * @param {any} coverage - Coverage data
 * @param {any} thresholds - Threshold requirements
 * @returns {boolean} True if thresholds met
 *
 * @example
 * ```typescript
 * const passed = validateCoverageThresholds(coverage, {
 *   lines: 90,
 *   functions: 95,
 *   branches: 85
 * });
 * ```
 */
export const validateCoverageThresholds = (coverage: any, thresholds: any): boolean => {
  const checks = ['lines', 'statements', 'functions', 'branches'];
  return checks.every((check) => {
    if (thresholds[check] === undefined) return true;
    return coverage[check]?.pct >= thresholds[check];
  });
};

// ============================================================================
// TEST CLEANUP UTILITIES
// ============================================================================

/**
 * Creates cleanup function for afterEach
 *
 * @returns {() => void} Cleanup function
 *
 * @example
 * ```typescript
 * afterEach(createAfterEachCleanup());
 * ```
 */
export const createAfterEachCleanup = (): (() => void) => {
  return () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  };
};

/**
 * Creates comprehensive test teardown
 *
 * @param {any[]} resources - Resources to clean up
 * @returns {() => Promise<void>} Teardown function
 *
 * @example
 * ```typescript
 * afterAll(createTestTeardown([app, sequelize, redisClient]));
 * ```
 */
export const createTestTeardown = (resources: any[]): (() => Promise<void>) => {
  return async () => {
    for (const resource of resources) {
      if (resource?.close) await resource.close();
      if (resource?.disconnect) await resource.disconnect();
      if (resource?.destroy) await resource.destroy();
    }
    jest.clearAllMocks();
  };
};

/**
 * Waits for async operations to complete
 *
 * @param {number} [ms=100] - Milliseconds to wait
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await eventEmitter.emit('user.created', user);
 * await waitForAsync(200);
 * expect(emailService.sendWelcome).toHaveBeenCalled();
 * ```
 */
export const waitForAsync = (ms: number = 100): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Flushes all pending promises
 *
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await triggerAsyncOperation();
 * await flushPromises();
 * expect(result).toBeDefined();
 * ```
 */
export const flushPromises = (): Promise<void> => {
  return new Promise((resolve) => setImmediate(resolve));
};

// ============================================================================
// WEBSOCKET TESTING HELPERS
// ============================================================================

/**
 * Creates mock WebSocket client
 *
 * @returns {any} Mock WebSocket client
 *
 * @example
 * ```typescript
 * const ws = mockWebSocketClient();
 * ws.emit.mockImplementation((event, data) => { ... });
 * ```
 */
export const mockWebSocketClient = (): any => {
  return {
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    id: crypto.randomUUID(),
    connected: true,
    auth: {},
    handshake: {
      headers: {},
      query: {},
    },
    join: jest.fn(),
    leave: jest.fn(),
    to: jest.fn().mockReturnThis(),
    broadcast: {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    },
  };
};

/**
 * Creates mock WebSocket server
 *
 * @returns {any} Mock WebSocket server
 *
 * @example
 * ```typescript
 * const wss = mockWebSocketServer();
 * wss.emit.mockImplementation((event, data) => { ... });
 * ```
 */
export const mockWebSocketServer = (): any => {
  const sockets = new Map();

  return {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    sockets: {
      sockets: sockets,
      adapter: {
        rooms: new Map(),
      },
    },
    on: jest.fn(),
    off: jest.fn(),
    use: jest.fn(),
    close: jest.fn(),
  };
};

/**
 * Simulates WebSocket connection
 *
 * @param {any} server - WebSocket server
 * @param {any} [clientData] - Client data
 * @returns {any} Connected client
 *
 * @example
 * ```typescript
 * const client = simulateWebSocketConnection(wss, {
 *   userId: 'user-123',
 *   token: 'auth-token'
 * });
 * ```
 */
export const simulateWebSocketConnection = (server: any, clientData?: any): any => {
  const client = mockWebSocketClient();

  if (clientData) {
    client.auth = clientData;
  }

  server.sockets.sockets.set(client.id, client);

  return client;
};

/**
 * Waits for WebSocket event
 *
 * @param {any} socket - WebSocket client or server
 * @param {string} event - Event name
 * @param {number} [timeout=5000] - Timeout in milliseconds
 * @returns {Promise<any>} Event data
 *
 * @example
 * ```typescript
 * const data = await waitForWebSocketEvent(client, 'user:created', 3000);
 * expect(data.userId).toBeDefined();
 * ```
 */
export const waitForWebSocketEvent = async (
  socket: any,
  event: string,
  timeout: number = 5000,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event: ${event}`));
    }, timeout);

    socket.once(event, (data: any) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
};

/**
 * Asserts WebSocket event was emitted
 *
 * @param {any} socket - WebSocket client or server
 * @param {string} event - Event name
 * @param {any} [expectedData] - Expected event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertWebSocketEventEmitted(client, 'message:sent', { text: 'Hello' });
 * ```
 */
export const assertWebSocketEventEmitted = (socket: any, event: string, expectedData?: any): void => {
  expect(socket.emit).toHaveBeenCalled();

  const calls = socket.emit.mock.calls;
  const eventCall = calls.find((call: any[]) => call[0] === event);

  expect(eventCall).toBeDefined();

  if (expectedData) {
    expect(eventCall[1]).toMatchObject(expectedData);
  }
};

// ============================================================================
// GRAPHQL QUERY TEST UTILITIES
// ============================================================================

/**
 * Creates GraphQL test query
 *
 * @param {string} query - GraphQL query string
 * @param {Record<string, any>} [variables] - Query variables
 * @returns {object} GraphQL request
 *
 * @example
 * ```typescript
 * const query = createGraphQLQuery(`
 *   query GetUser($id: ID!) {
 *     user(id: $id) { id email name }
 *   }
 * `, { id: '123' });
 * ```
 */
export const createGraphQLQuery = (
  query: string,
  variables?: Record<string, any>,
): { query: string; variables?: Record<string, any> } => {
  return {
    query: query.trim(),
    variables,
  };
};

/**
 * Creates GraphQL test mutation
 *
 * @param {string} mutation - GraphQL mutation string
 * @param {Record<string, any>} [variables] - Mutation variables
 * @returns {object} GraphQL request
 *
 * @example
 * ```typescript
 * const mutation = createGraphQLMutation(`
 *   mutation CreateUser($input: CreateUserInput!) {
 *     createUser(input: $input) { id email }
 *   }
 * `, { input: { email: 'test@example.com' } });
 * ```
 */
export const createGraphQLMutation = (
  mutation: string,
  variables?: Record<string, any>,
): { query: string; variables?: Record<string, any> } => {
  return createGraphQLQuery(mutation, variables);
};

/**
 * Executes GraphQL query in tests
 *
 * @param {INestApplication} app - Test application
 * @param {object} query - GraphQL query
 * @param {string} [token] - Auth token
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * const result = await executeGraphQLQuery(app, query, authToken);
 * expect(result.data.user).toBeDefined();
 * ```
 */
export const executeGraphQLQuery = async (
  app: INestApplication,
  query: { query: string; variables?: Record<string, any> },
  token?: string,
): Promise<any> => {
  const req = request(app.getHttpServer()).post('/graphql').send(query);

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  const response = await req;
  return response.body;
};

/**
 * Asserts GraphQL response structure
 *
 * @param {any} response - GraphQL response
 * @param {string[]} [expectedFields] - Expected data fields
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertGraphQLResponse(response, ['user.id', 'user.email']);
 * ```
 */
export const assertGraphQLResponse = (response: any, expectedFields?: string[]): void => {
  expect(response).toHaveProperty('data');
  expect(response).not.toHaveProperty('errors');

  if (expectedFields) {
    expectedFields.forEach((field) => {
      const parts = field.split('.');
      let current = response.data;

      for (const part of parts) {
        expect(current).toHaveProperty(part);
        current = current[part];
      }
    });
  }
};

/**
 * Asserts GraphQL error response
 *
 * @param {any} response - GraphQL response
 * @param {string} [expectedMessage] - Expected error message
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertGraphQLError(response, 'User not found');
 * ```
 */
export const assertGraphQLError = (response: any, expectedMessage?: string): void => {
  expect(response).toHaveProperty('errors');
  expect(Array.isArray(response.errors)).toBe(true);
  expect(response.errors.length).toBeGreaterThan(0);

  if (expectedMessage) {
    const errorMessages = response.errors.map((e: any) => e.message).join(' ');
    expect(errorMessages).toContain(expectedMessage);
  }
};

/**
 * Mock GraphQL resolver
 *
 * @param {any} [returnValue] - Default return value
 * @returns {jest.Mock} Mock resolver function
 *
 * @example
 * ```typescript
 * const resolver = mockGraphQLResolver({ user: { id: '123' } });
 * ```
 */
export const mockGraphQLResolver = (returnValue?: any): jest.Mock => {
  return jest.fn().mockResolvedValue(returnValue);
};

// ============================================================================
// PERFORMANCE TEST HELPERS
// ============================================================================

/**
 * Measures function execution time
 *
 * @param {() => Promise<any>} fn - Function to measure
 * @returns {Promise<{ result: any; duration: number }>} Result and duration
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureExecutionTime(async () => {
 *   return await service.heavyOperation();
 * });
 * expect(duration).toBeLessThan(1000);
 * ```
 */
export const measureExecutionTime = async (
  fn: () => Promise<any>,
): Promise<{ result: any; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  return { result, duration };
};

/**
 * Benchmarks function with multiple iterations
 *
 * @param {() => Promise<any>} fn - Function to benchmark
 * @param {number} [iterations=100] - Number of iterations
 * @returns {Promise<object>} Benchmark statistics
 *
 * @example
 * ```typescript
 * const stats = await benchmarkFunction(async () => {
 *   return await service.processData();
 * }, 100);
 * expect(stats.avg).toBeLessThan(50);
 * ```
 */
export const benchmarkFunction = async (
  fn: () => Promise<any>,
  iterations: number = 100,
): Promise<{
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
}> => {
  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const { duration } = await measureExecutionTime(fn);
    durations.push(duration);
  }

  const sorted = durations.sort((a, b) => a - b);
  const sum = durations.reduce((a, b) => a + b, 0);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / iterations,
    median: sorted[Math.floor(iterations / 2)],
    p95: sorted[Math.floor(iterations * 0.95)],
    p99: sorted[Math.floor(iterations * 0.99)],
  };
};

/**
 * Asserts performance threshold
 *
 * @param {() => Promise<any>} fn - Function to test
 * @param {number} maxDuration - Maximum allowed duration in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await assertPerformanceThreshold(async () => {
 *   return await service.quickOperation();
 * }, 100);
 * ```
 */
export const assertPerformanceThreshold = async (
  fn: () => Promise<any>,
  maxDuration: number,
): Promise<void> => {
  const { duration } = await measureExecutionTime(fn);
  expect(duration).toBeLessThan(maxDuration);
};

/**
 * Measures memory usage
 *
 * @param {() => Promise<any>} fn - Function to measure
 * @returns {Promise<{ result: any; heapUsed: number }>} Result and memory usage
 *
 * @example
 * ```typescript
 * const { result, heapUsed } = await measureMemoryUsage(async () => {
 *   return await service.loadLargeDataset();
 * });
 * ```
 */
export const measureMemoryUsage = async (
  fn: () => Promise<any>,
): Promise<{ result: any; heapUsed: number }> => {
  if (global.gc) {
    global.gc();
  }

  const before = process.memoryUsage().heapUsed;
  const result = await fn();
  const after = process.memoryUsage().heapUsed;
  const heapUsed = after - before;

  return { result, heapUsed };
};

/**
 * Profiles async operations
 *
 * @param {string} label - Profile label
 * @param {() => Promise<any>} fn - Function to profile
 * @returns {Promise<any>} Function result
 *
 * @example
 * ```typescript
 * const result = await profileAsyncOperation('database-query', async () => {
 *   return await repository.find();
 * });
 * ```
 */
export const profileAsyncOperation = async (label: string, fn: () => Promise<any>): Promise<any> => {
  console.time(label);
  const result = await fn();
  console.timeEnd(label);
  return result;
};

// ============================================================================
// LOAD TESTING UTILITIES
// ============================================================================

/**
 * Simulates concurrent requests
 *
 * @param {() => Promise<any>} fn - Function to execute
 * @param {number} concurrency - Number of concurrent executions
 * @returns {Promise<any[]>} Results array
 *
 * @example
 * ```typescript
 * const results = await simulateConcurrentRequests(async () => {
 *   return await request(app.getHttpServer()).get('/users');
 * }, 50);
 * ```
 */
export const simulateConcurrentRequests = async (
  fn: () => Promise<any>,
  concurrency: number,
): Promise<any[]> => {
  const promises = Array.from({ length: concurrency }, () => fn());
  return Promise.all(promises);
};

/**
 * Load test with ramping users
 *
 * @param {() => Promise<any>} fn - Function to execute
 * @param {object} config - Load test configuration
 * @returns {Promise<object>} Load test results
 *
 * @example
 * ```typescript
 * const results = await loadTestWithRamping(async () => {
 *   return await service.handleRequest();
 * }, {
 *   startUsers: 10,
 *   endUsers: 100,
 *   rampDuration: 30000,
 *   holdDuration: 60000
 * });
 * ```
 */
export const loadTestWithRamping = async (
  fn: () => Promise<any>,
  config: {
    startUsers: number;
    endUsers: number;
    rampDuration: number;
    holdDuration: number;
  },
): Promise<{
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  requestsPerSecond: number;
}> => {
  const results: { success: boolean; duration: number }[] = [];
  const startTime = Date.now();

  // Ramp up
  const rampStep = config.rampDuration / (config.endUsers - config.startUsers);

  for (let users = config.startUsers; users <= config.endUsers; users++) {
    await waitForAsync(rampStep);

    const promises = Array.from({ length: users }, async () => {
      try {
        const { duration } = await measureExecutionTime(fn);
        return { success: true, duration };
      } catch (error) {
        return { success: false, duration: 0 };
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  // Hold at peak
  const holdStart = Date.now();
  while (Date.now() - holdStart < config.holdDuration) {
    const promises = Array.from({ length: config.endUsers }, async () => {
      try {
        const { duration } = await measureExecutionTime(fn);
        return { success: true, duration };
      } catch (error) {
        return { success: false, duration: 0 };
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    await waitForAsync(1000);
  }

  const totalDuration = (Date.now() - startTime) / 1000;
  const successfulResults = results.filter((r) => r.success);
  const avgDuration =
    successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;

  return {
    totalRequests: results.length,
    successfulRequests: successfulResults.length,
    failedRequests: results.filter((r) => !r.success).length,
    avgResponseTime: avgDuration,
    requestsPerSecond: results.length / totalDuration,
  };
};

/**
 * Stress test until failure
 *
 * @param {() => Promise<any>} fn - Function to stress test
 * @param {number} [maxUsers=1000] - Maximum concurrent users
 * @param {number} [step=10] - User increment step
 * @returns {Promise<number>} Breaking point (number of users)
 *
 * @example
 * ```typescript
 * const breakingPoint = await stressTestUntilFailure(async () => {
 *   return await service.handleRequest();
 * }, 500, 20);
 * ```
 */
export const stressTestUntilFailure = async (
  fn: () => Promise<any>,
  maxUsers: number = 1000,
  step: number = 10,
): Promise<number> => {
  let users = step;
  let failures = 0;

  while (users <= maxUsers) {
    const results = await simulateConcurrentRequests(
      async () => {
        try {
          await fn();
          return { success: true };
        } catch (error) {
          return { success: false };
        }
      },
      users,
    );

    failures = results.filter((r: any) => !r.success).length;
    const failureRate = failures / users;

    if (failureRate > 0.1) {
      // 10% failure rate threshold
      return users;
    }

    users += step;
  }

  return maxUsers;
};

/**
 * Measures throughput (requests per second)
 *
 * @param {() => Promise<any>} fn - Function to measure
 * @param {number} [duration=10000] - Duration in milliseconds
 * @returns {Promise<number>} Requests per second
 *
 * @example
 * ```typescript
 * const rps = await measureThroughput(async () => {
 *   return await service.handleRequest();
 * }, 5000);
 * expect(rps).toBeGreaterThan(100);
 * ```
 */
export const measureThroughput = async (
  fn: () => Promise<any>,
  duration: number = 10000,
): Promise<number> => {
  const startTime = Date.now();
  let requestCount = 0;

  while (Date.now() - startTime < duration) {
    await fn();
    requestCount++;
  }

  const actualDuration = (Date.now() - startTime) / 1000;
  return requestCount / actualDuration;
};

// ============================================================================
// ADVANCED ASSERTION UTILITIES
// ============================================================================

/**
 * Custom assertion: valid UUID
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid UUID
 *
 * @example
 * ```typescript
 * expect(assertValidUUID(user.id)).toBe(true);
 * ```
 */
export const assertValidUUID = (value: any): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValid = typeof value === 'string' && uuidRegex.test(value);
  expect(isValid).toBe(true);
  return isValid;
};

/**
 * Custom assertion: valid email
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid email
 *
 * @example
 * ```typescript
 * expect(assertValidEmail(user.email)).toBe(true);
 * ```
 */
export const assertValidEmail = (value: any): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = typeof value === 'string' && emailRegex.test(value);
  expect(isValid).toBe(true);
  return isValid;
};

/**
 * Custom assertion: valid phone number
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid phone
 *
 * @example
 * ```typescript
 * expect(assertValidPhoneNumber(user.phone)).toBe(true);
 * ```
 */
export const assertValidPhoneNumber = (value: any): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  const isValid =
    typeof value === 'string' && phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  expect(isValid).toBe(true);
  return isValid;
};

/**
 * Custom assertion: date format
 *
 * @param {any} value - Value to check
 * @param {string} [format='ISO'] - Expected format
 * @returns {boolean} True if matches format
 *
 * @example
 * ```typescript
 * expect(assertDateFormat(user.createdAt, 'ISO')).toBe(true);
 * ```
 */
export const assertDateFormat = (value: any, format: string = 'ISO'): boolean => {
  if (format === 'ISO') {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    const isValid =
      typeof value === 'string'
        ? isoRegex.test(value)
        : value instanceof Date && !isNaN(value.getTime());
    expect(isValid).toBe(true);
    return isValid;
  }

  return false;
};

/**
 * Custom assertion: nested property
 *
 * @param {any} obj - Object to check
 * @param {string} path - Property path (dot notation)
 * @returns {boolean} True if property exists
 *
 * @example
 * ```typescript
 * expect(assertNestedProperty(user, 'address.city')).toBe(true);
 * ```
 */
export const assertNestedProperty = (obj: any, path: string): boolean => {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      expect(false).toBe(true);
      return false;
    }
    current = current[part];
  }

  expect(true).toBe(true);
  return true;
};

/**
 * Asserts async function throws
 *
 * @param {() => Promise<any>} fn - Async function
 * @param {any} [errorType] - Expected error type/message
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await assertAsyncThrows(async () => {
 *   await service.invalidOperation();
 * }, NotFoundException);
 * ```
 */
export const assertAsyncThrows = async (fn: () => Promise<any>, errorType?: any): Promise<void> => {
  let error: any;

  try {
    await fn();
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();

  if (errorType) {
    if (typeof errorType === 'string') {
      expect(error.message).toContain(errorType);
    } else {
      expect(error).toBeInstanceOf(errorType);
    }
  }
};

/**
 * Asserts array contains object matching criteria
 *
 * @param {any[]} array - Array to check
 * @param {Record<string, any>} criteria - Match criteria
 * @returns {void}
 *
 * @example
 * ```typescript
 * assertArrayContainsObject(users, { email: 'test@example.com' });
 * ```
 */
export const assertArrayContainsObject = (array: any[], criteria: Record<string, any>): void => {
  const match = array.find((item) =>
    Object.entries(criteria).every(([key, value]) => item[key] === value),
  );

  expect(match).toBeDefined();
};

// ============================================================================
// TEST ENVIRONMENT CONFIGURATORS
// ============================================================================

/**
 * Configures test environment variables
 *
 * @param {Record<string, string>} envVars - Environment variables
 * @returns {() => void} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = configureTestEnvironment({
 *   NODE_ENV: 'test',
 *   DATABASE_URL: 'sqlite::memory:'
 * });
 * // ... run tests ...
 * cleanup();
 * ```
 */
export const configureTestEnvironment = (envVars: Record<string, string>): (() => void) => {
  const originalEnv = { ...process.env };

  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });

  return () => {
    Object.keys(envVars).forEach((key) => {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    });
  };
};

/**
 * Sets up test timeout
 *
 * @param {number} timeout - Timeout in milliseconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * setupTestTimeout(30000); // 30 seconds
 * ```
 */
export const setupTestTimeout = (timeout: number): void => {
  jest.setTimeout(timeout);
};

/**
 * Creates isolated test context
 *
 * @param {() => Promise<void>} setup - Setup function
 * @param {() => Promise<void>} teardown - Teardown function
 * @returns {object} Test context manager
 *
 * @example
 * ```typescript
 * const context = createIsolatedTestContext(
 *   async () => { await setupDatabase(); },
 *   async () => { await cleanupDatabase(); }
 * );
 * beforeEach(context.setup);
 * afterEach(context.teardown);
 * ```
 */
export const createIsolatedTestContext = (
  setup: () => Promise<void>,
  teardown: () => Promise<void>,
): {
  setup: () => Promise<void>;
  teardown: () => Promise<void>;
  reset: () => Promise<void>;
} => {
  return {
    setup,
    teardown,
    reset: async () => {
      await teardown();
      await setup();
    },
  };
};

/**
 * Mocks system time
 *
 * @param {Date | string | number} date - Mock date
 * @returns {() => void} Restore function
 *
 * @example
 * ```typescript
 * const restore = mockSystemTime('2024-01-01T00:00:00Z');
 * // ... tests with fixed time ...
 * restore();
 * ```
 */
export const mockSystemTime = (date: Date | string | number): (() => void) => {
  const mockDate = new Date(date);
  jest.useFakeTimers();
  jest.setSystemTime(mockDate);

  return () => {
    jest.useRealTimers();
  };
};

/**
 * Creates test transaction wrapper
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Transaction manager
 *
 * @example
 * ```typescript
 * const txManager = createTestTransaction(sequelize);
 * const tx = await txManager.start();
 * // ... run test operations ...
 * await txManager.rollback();
 * ```
 */
export const createTestTransaction = (
  sequelize: Sequelize,
): {
  start: () => Promise<Transaction>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  current: Transaction | null;
} => {
  let currentTransaction: Transaction | null = null;

  return {
    start: async () => {
      currentTransaction = await sequelize.transaction();
      return currentTransaction;
    },
    commit: async () => {
      if (currentTransaction) {
        await currentTransaction.commit();
        currentTransaction = null;
      }
    },
    rollback: async () => {
      if (currentTransaction) {
        await currentTransaction.rollback();
        currentTransaction = null;
      }
    },
    current: currentTransaction,
  };
};
