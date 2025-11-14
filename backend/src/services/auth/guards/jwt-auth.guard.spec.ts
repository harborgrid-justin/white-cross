import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenBlacklistService } from '../services/token-blacklist.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;
  let tokenBlacklistService: jest.Mocked<TokenBlacklistService>;

  const createMockExecutionContext = (
    user: Record<string, unknown> | null,
    authHeader: string | undefined,
    isPublic: boolean = false
  ): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        user,
        headers: { authorization: authHeader },
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    tokenBlacklistService = {
      isTokenBlacklisted: jest.fn(),
      areUserTokensBlacklisted: jest.fn(),
    } as unknown as jest.Mocked<TokenBlacklistService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: reflector },
        { provide: TokenBlacklistService, useValue: tokenBlacklistService },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access for public routes', async () => {
      reflector.getAllAndOverride.mockReturnValue(true);
      const context = createMockExecutionContext(null, undefined, true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should reject blacklisted tokens', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      const context = createMockExecutionContext(
        { id: 'user-123' },
        'Bearer valid-token'
      );

      // Mock parent canActivate to return true
      jest.spyOn(guard as never, 'canActivate').mockResolvedValue(true);
      tokenBlacklistService.isTokenBlacklisted.mockResolvedValue(true);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('Token has been revoked');
    });

    it('should allow valid non-blacklisted tokens', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImlhdCI6MTYwOTQ1OTIwMH0.mock';
      const context = createMockExecutionContext({ id: 'user-123' }, token);

      jest.spyOn(guard as never, 'canActivate').mockResolvedValue(true);
      tokenBlacklistService.isTokenBlacklisted.mockResolvedValue(false);
      tokenBlacklistService.areUserTokensBlacklisted.mockResolvedValue(false);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should reject tokens from blacklisted user session', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImlhdCI6MTYwOTQ1OTIwMH0.mock';
      const context = createMockExecutionContext({ id: 'user-123' }, token);

      jest.spyOn(guard as never, 'canActivate').mockResolvedValue(true);
      tokenBlacklistService.isTokenBlacklisted.mockResolvedValue(false);
      tokenBlacklistService.areUserTokensBlacklisted.mockResolvedValue(true);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('Session invalidated');
    });
  });

  describe('handleRequest', () => {
    it('should return user when valid', () => {
      const user = { id: 'user-123', email: 'test@example.com' };
      const context = createMockExecutionContext(user, 'Bearer token');

      const result = guard.handleRequest(null, user as never, undefined, context);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when user is false', () => {
      const context = createMockExecutionContext(null, 'Bearer token');

      expect(() => guard.handleRequest(null, false, undefined, context)).toThrow(
        UnauthorizedException
      );
      expect(() => guard.handleRequest(null, false, undefined, context)).toThrow(
        'Authentication required'
      );
    });

    it('should throw error when error is provided', () => {
      const error = new Error('Invalid token');
      const context = createMockExecutionContext(null, 'Bearer token');

      expect(() => guard.handleRequest(error, false, undefined, context)).toThrow(error);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from Bearer header', () => {
      const request = {
        headers: { authorization: 'Bearer test-token-123' },
      };

      const token = guard['extractTokenFromHeader'](request as never);

      expect(token).toBe('test-token-123');
    });

    it('should return null for missing authorization header', () => {
      const request = { headers: {} };

      const token = guard['extractTokenFromHeader'](request as never);

      expect(token).toBeNull();
    });

    it('should return null for non-Bearer auth', () => {
      const request = {
        headers: { authorization: 'Basic dGVzdDp0ZXN0' },
      };

      const token = guard['extractTokenFromHeader'](request as never);

      expect(token).toBeNull();
    });
  });

  describe('decodeToken', () => {
    it('should decode valid JWT payload', () => {
      const payload = { sub: 'user-123', iat: 1609459200 };
      const token =
        'header.' +
        Buffer.from(JSON.stringify(payload)).toString('base64') +
        '.signature';

      const decoded = guard['decodeToken'](token);

      expect(decoded).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      const decoded = guard['decodeToken']('invalid-token');

      expect(decoded).toBeNull();
    });
  });
});
