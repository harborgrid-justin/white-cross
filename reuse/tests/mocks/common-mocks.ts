/**
 * Common Mock Factories
 * Reusable mocks for testing
 */

import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Mock ConfigService
 */
export const createMockConfigService = (overrides: Record<string, any> = {}) => ({
  get: jest.fn((key: string) => {
    const defaults = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '1h',
      DATABASE_URL: 'sqlite::memory:',
      PORT: 3000,
      NODE_ENV: 'test',
      ...overrides,
    };
    return defaults[key];
  }),
  getOrThrow: jest.fn((key: string) => {
    const value = overrides[key];
    if (!value) throw new Error(`Config key ${key} not found`);
    return value;
  }),
});

/**
 * Mock Logger
 */
export const createMockLogger = () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
});

/**
 * Mock Repository
 */
export const createMockRepository = <T = any>() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  increment: jest.fn(),
  decrement: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    getManyAndCount: jest.fn(),
  })),
});

/**
 * Mock Cache Manager
 */
export const createMockCacheManager = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
  wrap: jest.fn((key: string, fn: () => any) => fn()),
});

/**
 * Mock Event Emitter
 */
export const createMockEventEmitter = () => ({
  emit: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
});

/**
 * Mock Queue
 */
export const createMockQueue = () => ({
  add: jest.fn(),
  process: jest.fn(),
  on: jest.fn(),
  close: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  count: jest.fn(),
  empty: jest.fn(),
  clean: jest.fn(),
});

/**
 * Mock HTTP Request
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  headers: {},
  user: undefined,
  method: 'GET',
  url: '/',
  path: '/',
  ip: '127.0.0.1',
  ...overrides,
});

/**
 * Mock HTTP Response
 */
export const createMockResponse = (): Partial<Response> => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Mock Execution Context
 */
export const createMockExecutionContext = (
  request: Partial<Request> = {},
): ExecutionContext => {
  const mockRequest = createMockRequest(request);
  const mockResponse = createMockResponse();

  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as any;
};

/**
 * Mock JWT Service
 */
export const createMockJwtService = () => ({
  sign: jest.fn((payload: any) => 'mock-token'),
  verify: jest.fn((token: string) => ({ userId: '1', email: 'test@example.com' })),
  decode: jest.fn((token: string) => ({ userId: '1', email: 'test@example.com' })),
});

/**
 * Mock Email Service
 */
export const createMockEmailService = () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordReset: jest.fn().mockResolvedValue(true),
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
});

/**
 * Mock File Upload Service
 */
export const createMockFileUploadService = () => ({
  upload: jest.fn().mockResolvedValue({ url: 'https://example.com/file.pdf', key: 'file-key' }),
  delete: jest.fn().mockResolvedValue(true),
  getSignedUrl: jest.fn().mockResolvedValue('https://example.com/signed-url'),
});

/**
 * Mock Notification Service
 */
export const createMockNotificationService = () => ({
  send: jest.fn().mockResolvedValue(true),
  sendBulk: jest.fn().mockResolvedValue({ sent: 10, failed: 0 }),
  subscribe: jest.fn().mockResolvedValue(true),
  unsubscribe: jest.fn().mockResolvedValue(true),
});

/**
 * Mock Pagination Options
 */
export const createMockPaginationOptions = (overrides = {}) => ({
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'DESC',
  ...overrides,
});

/**
 * Mock Paginated Response
 */
export const createMockPaginatedResponse = <T>(items: T[], total: number = items.length) => ({
  items,
  total,
  page: 1,
  limit: items.length,
  totalPages: Math.ceil(total / items.length),
  hasNextPage: false,
  hasPreviousPage: false,
});

/**
 * Mock User Entity
 */
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Mock Database Transaction
 */
export const createMockTransaction = () => ({
  commit: jest.fn().mockResolvedValue(undefined),
  rollback: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
  release: jest.fn().mockResolvedValue(undefined),
});
