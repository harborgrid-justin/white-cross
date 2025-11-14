import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './token-blacklist.service';
import { LoggerService } from '@/common/logging/logger.service';
import Redis from 'ioredis';

// Mock Redis
jest.mock('ioredis');

describe('TokenBlacklistService', () => {
  let service: TokenBlacklistService;
  let configService: jest.Mocked<ConfigService>;
  let jwtService: jest.Mocked<JwtService>;
  let loggerService: jest.Mocked<LoggerService>;
  let mockRedisClient: jest.Mocked<Partial<Redis>>;

  beforeEach(async () => {
    mockRedisClient = {
      setex: jest.fn(),
      exists: jest.fn(),
      get: jest.fn(),
      ping: jest.fn(),
      on: jest.fn(),
      quit: jest.fn(),
    };

    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(() => mockRedisClient as Redis);

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    jwtService = {
      decode: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    loggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenBlacklistService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: LoggerService,
          useValue: loggerService,
        },
      ],
    }).compile();

    service = module.get<TokenBlacklistService>(TokenBlacklistService);

    // Setup default config
    configService.get.mockImplementation((key: string, defaultValue?: string | number) => {
      const config: Record<string, string | number> = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
      };
      return config[key] || defaultValue;
    });

    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize Redis connection successfully', async () => {
      (mockRedisClient.ping as jest.Mock).mockResolvedValue('PONG');

      await service.onModuleInit();

      expect(Redis).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'localhost',
          port: 6379,
          db: 0,
        })
      );
      expect(mockRedisClient.ping).toHaveBeenCalled();
    });

    it('should handle Redis connection failure gracefully', async () => {
      (mockRedisClient.ping as jest.Mock).mockRejectedValue(new Error('Connection failed'));

      await service.onModuleInit();

      expect(loggerService.error).toHaveBeenCalled();
      expect(loggerService.warning).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY WARNING: Token blacklist will use in-memory storage')
      );
    });

    it('should register Redis event handlers', async () => {
      await service.onModuleInit();

      expect(mockRedisClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should use Redis password if provided', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'REDIS_PASSWORD') return 'secret-password';
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        return undefined;
      });

      await service.onModuleInit();

      expect(Redis).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'secret-password',
        })
      );
    });
  });

  describe('blacklistToken', () => {
    beforeEach(async () => {
      (mockRedisClient.ping as jest.Mock).mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should blacklist token successfully', async () => {
      const token = 'valid.jwt.token';
      const decodedToken = {
        sub: 'user-123',
        exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
      };

      jwtService.decode.mockReturnValue(decodedToken as never);
      (mockRedisClient.setex as jest.Mock).mockResolvedValue('OK');

      await service.blacklistToken(token, 'user-123');

      expect(jwtService.decode).toHaveBeenCalledWith(token);
      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        expect.stringContaining('token:blacklist:'),
        expect.any(Number),
        expect.stringContaining('user-123')
      );
    });

    it('should skip blacklisting if token has no expiration', async () => {
      const token = 'invalid.token';
      jwtService.decode.mockReturnValue(null);

      await service.blacklistToken(token, 'user-123');

      expect(mockRedisClient.setex).not.toHaveBeenCalled();
    });

    it('should skip blacklisting if token is already expired', async () => {
      const token = 'expired.jwt.token';
      const decodedToken = {
        sub: 'user-123',
        exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
      };

      jwtService.decode.mockReturnValue(decodedToken as never);

      await service.blacklistToken(token, 'user-123');

      expect(mockRedisClient.setex).not.toHaveBeenCalled();
    });

    it('should handle Redis errors during blacklisting', async () => {
      const token = 'valid.jwt.token';
      const decodedToken = {
        sub: 'user-123',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      jwtService.decode.mockReturnValue(decodedToken as never);
      (mockRedisClient.setex as jest.Mock).mockRejectedValue(new Error('Redis error'));

      await expect(service.blacklistToken(token, 'user-123')).rejects.toThrow('Redis error');
    });

    it('should warn if Redis is not available', async () => {
      // Create service without Redis
      const serviceWithoutRedis = new TokenBlacklistService(loggerService, configService, jwtService);

      const token = 'valid.jwt.token';
      const decodedToken = {
        sub: 'user-123',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      jwtService.decode.mockReturnValue(decodedToken as never);

      await serviceWithoutRedis.blacklistToken(token, 'user-123');

      expect(loggerService.warning).toHaveBeenCalledWith('Redis not available, token not blacklisted');
    });
  });

  describe('isTokenBlacklisted', () => {
    beforeEach(async () => {
      (mockRedisClient.ping as jest.Mock).mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should return true for blacklisted token', async () => {
      const token = 'blacklisted.jwt.token';
      (mockRedisClient.exists as jest.Mock).mockResolvedValue(1);

      const result = await service.isTokenBlacklisted(token);

      expect(result).toBe(true);
      expect(mockRedisClient.exists).toHaveBeenCalledWith(expect.stringContaining('token:blacklist:'));
    });

    it('should return false for non-blacklisted token', async () => {
      const token = 'valid.jwt.token';
      (mockRedisClient.exists as jest.Mock).mockResolvedValue(0);

      const result = await service.isTokenBlacklisted(token);

      expect(result).toBe(false);
    });

    it('should return false if Redis is not available', async () => {
      const serviceWithoutRedis = new TokenBlacklistService(loggerService, configService, jwtService);
      const token = 'valid.jwt.token';

      const result = await serviceWithoutRedis.isTokenBlacklisted(token);

      expect(result).toBe(false);
      expect(loggerService.warning).toHaveBeenCalledWith(
        'Redis not available, cannot verify token blacklist'
      );
    });

    it('should handle Redis errors gracefully', async () => {
      const token = 'valid.jwt.token';
      (mockRedisClient.exists as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await service.isTokenBlacklisted(token);

      expect(result).toBe(false);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('blacklistAllUserTokens', () => {
    beforeEach(async () => {
      (mockRedisClient.ping as jest.Mock).mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should blacklist all user tokens successfully', async () => {
      const userId = 'user-123';
      (mockRedisClient.setex as jest.Mock).mockResolvedValue('OK');

      await service.blacklistAllUserTokens(userId);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'token:blacklist:user:user-123',
        7 * 24 * 60 * 60, // 7 days
        expect.any(String)
      );
    });

    it('should warn if Redis is not available', async () => {
      const serviceWithoutRedis = new TokenBlacklistService(loggerService, configService, jwtService);
      const userId = 'user-123';

      await serviceWithoutRedis.blacklistAllUserTokens(userId);

      expect(loggerService.warning).toHaveBeenCalledWith('Redis not available, cannot blacklist user tokens');
    });

    it('should handle Redis errors', async () => {
      const userId = 'user-123';
      (mockRedisClient.setex as jest.Mock).mockRejectedValue(new Error('Redis error'));

      await expect(service.blacklistAllUserTokens(userId)).rejects.toThrow('Redis error');
    });
  });

  describe('areUserTokensBlacklisted', () => {
    beforeEach(async () => {
      (mockRedisClient.ping as jest.Mock).mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should return true if token issued before blacklist timestamp', async () => {
      const userId = 'user-123';
      const tokenIssuedAt = Math.floor(Date.now() / 1000) - 3600; // issued 1 hour ago
      const blacklistTimestamp = Date.now().toString(); // blacklisted now

      (mockRedisClient.get as jest.Mock).mockResolvedValue(blacklistTimestamp);

      const result = await service.areUserTokensBlacklisted(userId, tokenIssuedAt);

      expect(result).toBe(true);
      expect(mockRedisClient.get).toHaveBeenCalledWith('token:blacklist:user:user-123');
    });

    it('should return false if token issued after blacklist timestamp', async () => {
      const userId = 'user-123';
      const blacklistTimestamp = (Date.now() - 7200000).toString(); // blacklisted 2 hours ago
      const tokenIssuedAt = Math.floor(Date.now() / 1000) - 3600; // issued 1 hour ago

      (mockRedisClient.get as jest.Mock).mockResolvedValue(blacklistTimestamp);

      const result = await service.areUserTokensBlacklisted(userId, tokenIssuedAt);

      expect(result).toBe(false);
    });

    it('should return false if no blacklist exists for user', async () => {
      const userId = 'user-123';
      const tokenIssuedAt = Math.floor(Date.now() / 1000);

      (mockRedisClient.get as jest.Mock).mockResolvedValue(null);

      const result = await service.areUserTokensBlacklisted(userId, tokenIssuedAt);

      expect(result).toBe(false);
    });

    it('should return false if Redis is not available', async () => {
      const serviceWithoutRedis = new TokenBlacklistService(loggerService, configService, jwtService);
      const userId = 'user-123';
      const tokenIssuedAt = Math.floor(Date.now() / 1000);

      const result = await serviceWithoutRedis.areUserTokensBlacklisted(userId, tokenIssuedAt);

      expect(result).toBe(false);
    });

    it('should handle Redis errors gracefully', async () => {
      const userId = 'user-123';
      const tokenIssuedAt = Math.floor(Date.now() / 1000);

      (mockRedisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await service.areUserTokensBlacklisted(userId, tokenIssuedAt);

      expect(result).toBe(false);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should close Redis connection on module destroy', async () => {
      (mockRedisClient.ping as jest.Mock).mockResolvedValue('PONG');
      (mockRedisClient.quit as jest.Mock).mockResolvedValue('OK');

      await service.onModuleInit();
      await service.onModuleDestroy();

      expect(mockRedisClient.quit).toHaveBeenCalled();
    });

    it('should handle cleanup when Redis is not initialized', async () => {
      const serviceWithoutRedis = new TokenBlacklistService(loggerService, configService, jwtService);

      await expect(serviceWithoutRedis.onModuleDestroy()).resolves.not.toThrow();
    });
  });
});
