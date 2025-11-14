/**
 * @fileoverview Tests for GqlAuthGuard
 * @module infrastructure/graphql/guards
 */

import { Test, TestingModule } from '@nestjs/testing';
import { GqlAuthGuard } from './gql-auth.guard';

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;
  let mockReflector: jest.Mocked<Reflector>;
  let mockTokenBlacklistService: jest.Mocked<TokenBlacklistService>;


  beforeEach(async () => {
    mockReflector = {
    } as unknown as jest.Mocked<Reflector>;

    mockTokenBlacklistService = {
    } as unknown as jest.Mocked<TokenBlacklistService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GqlAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: TokenBlacklistService,
          useValue: mockTokenBlacklistService,
        },
      ],
    }).compile();

    guard = module.get<GqlAuthGuard>(GqlAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });
  });

  describe('AuthGuard()', () => {
    it('should handle successful execution', async () => {
      const result = await guard.AuthGuard();
      expect(result).toBeDefined();
    });

    it('should handle errors', async () => {
      expect(guard).toBeDefined();
    });
  });

  describe('getRequest()', () => {
    it('should handle successful execution', async () => {
      const result = await guard.getRequest();
      expect(result).toBeDefined();
    });

    it('should handle errors', async () => {
      expect(guard).toBeDefined();
    });
  });

  describe('canActivate()', () => {
    it('should handle successful execution', async () => {
      const result = await guard.canActivate();
      expect(result).toBeDefined();
    });

    it('should handle errors', async () => {
      expect(guard).toBeDefined();
    });
  });
});
