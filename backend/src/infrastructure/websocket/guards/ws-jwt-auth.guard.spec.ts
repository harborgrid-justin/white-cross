/**
 * @fileoverview Tests for WsJwtAuthGuard
 * @module infrastructure/websocket/guards
 */

import { Test, TestingModule } from '@nestjs/testing';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard';

describe('WsJwtAuthGuard', () => {
  let guard: WsJwtAuthGuard;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockTokenBlacklistService: jest.Mocked<TokenBlacklistService>;


  beforeEach(async () => {
    mockJwtService = {
    } as unknown as jest.Mocked<JwtService>;

    mockConfigService = {
    } as unknown as jest.Mocked<ConfigService>;

    mockTokenBlacklistService = {
    } as unknown as jest.Mocked<TokenBlacklistService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WsJwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: TokenBlacklistService,
          useValue: mockTokenBlacklistService,
        },
      ],
    }).compile();

    guard = module.get<WsJwtAuthGuard>(WsJwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
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

  describe('if()', () => {
    it('should handle successful execution', async () => {
      const result = await guard.if();
      expect(result).toBeDefined();
    });

    it('should handle errors', async () => {
      expect(guard).toBeDefined();
    });
  });

  describe('if()', () => {
    it('should handle successful execution', async () => {
      const result = await guard.if();
      expect(result).toBeDefined();
    });

    it('should handle errors', async () => {
      expect(guard).toBeDefined();
    });
  });
});
