import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@/database/models';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const createMockExecutionContext = (user: Record<string, unknown> | null, isPublic: boolean = false, requiredRoles: UserRole[] | null = null): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: reflector },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access for public routes', () => {
      reflector.getAllAndOverride.mockReturnValueOnce(true).mockReturnValueOnce(null);
      const context = createMockExecutionContext(null, true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when no roles required', () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false).mockReturnValueOnce(null);
      const context = createMockExecutionContext({ id: 'user-123', role: UserRole.ADMIN });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required role', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([UserRole.ADMIN]);
      const context = createMockExecutionContext({ id: 'user-123', role: UserRole.ADMIN });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([UserRole.ADMIN]);
      const context = createMockExecutionContext({ id: 'user-123', role: UserRole.NURSE });

      expect(() => guard.canActivate(context)).toThrow('Insufficient permissions. Required roles: ADMIN');
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([UserRole.ADMIN]);
      const context = createMockExecutionContext(null);

      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should allow access when user has one of multiple required roles', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
      const context = createMockExecutionContext({ id: 'user-123', role: UserRole.ADMIN });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user has none of the required roles', () => {
      reflector.getAllAndOverride
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
      const context = createMockExecutionContext({ id: 'user-123', role: UserRole.NURSE });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
