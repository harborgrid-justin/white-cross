/**
 * @fileoverview Tests for Field Authorization Decorator
 * @module infrastructure/graphql/guards
 */

import { FieldAuthorization, PHIField, AdminOnlyField, FIELD_AUTH_KEY } from './field-authorization.guard';
import { UserRole } from '@/database';

describe('Field Authorization Decorators', () => {
  let mockContext: {
    req: {
      user: {
        id: string;
        role: UserRole;
      };
    };
  };

  beforeEach(() => {
    mockContext = {
      req: {
        user: {
          id: 'user-123',
          role: UserRole.ADMIN,
        },
      },
    };
  });

  describe('FieldAuthorization decorator', () => {
    it('should allow access for authorized roles', async () => {
      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN, UserRole.NURSE])
        async sensitiveField(): Promise<string> {
          return 'sensitive-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.sensitiveField.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('sensitive-data');
    });

    it('should deny access for unauthorized roles', async () => {
      mockContext.req.user.role = UserRole.PARENT;

      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN, UserRole.NURSE])
        async sensitiveField(): Promise<string> {
          return 'sensitive-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.sensitiveField.call(resolver, {}, {}, mockContext, {});

      expect(result).toBeNull();
    });

    it('should return null for unauthenticated users', async () => {
      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN])
        async sensitiveField(): Promise<string> {
          return 'sensitive-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.sensitiveField.call(resolver, {}, {}, {}, {});

      expect(result).toBeNull();
    });

    it('should return null when context is missing', async () => {
      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN])
        async sensitiveField(): Promise<string> {
          return 'sensitive-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.sensitiveField.call(resolver, {}, {}, null as unknown as typeof mockContext, {});

      expect(result).toBeNull();
    });

    it('should handle multiple allowed roles', async () => {
      mockContext.req.user.role = UserRole.NURSE;

      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN, UserRole.NURSE, UserRole.SCHOOL_ADMIN])
        async sensitiveField(): Promise<string> {
          return 'sensitive-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.sensitiveField.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('sensitive-data');
    });

    it('should preserve method context and arguments', async () => {
      class TestResolver {
        testValue = 'instance-value';

        @FieldAuthorization([UserRole.ADMIN])
        async sensitiveField(this: TestResolver): Promise<string> {
          return this.testValue;
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.sensitiveField.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('instance-value');
    });
  });

  describe('PHIField decorator', () => {
    it('should allow access for ADMIN role', async () => {
      mockContext.req.user.role = UserRole.ADMIN;

      class TestResolver {
        @PHIField()
        async phiData(): Promise<string> {
          return 'phi-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.phiData.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('phi-data');
    });

    it('should allow access for NURSE role', async () => {
      mockContext.req.user.role = UserRole.NURSE;

      class TestResolver {
        @PHIField()
        async phiData(): Promise<string> {
          return 'phi-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.phiData.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('phi-data');
    });

    it('should allow access for SCHOOL_ADMIN role', async () => {
      mockContext.req.user.role = UserRole.SCHOOL_ADMIN;

      class TestResolver {
        @PHIField()
        async phiData(): Promise<string> {
          return 'phi-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.phiData.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('phi-data');
    });

    it('should deny access for PARENT role', async () => {
      mockContext.req.user.role = UserRole.PARENT;

      class TestResolver {
        @PHIField()
        async phiData(): Promise<string> {
          return 'phi-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.phiData.call(resolver, {}, {}, mockContext, {});

      expect(result).toBeNull();
    });

    it('should deny access for TEACHER role', async () => {
      mockContext.req.user.role = UserRole.TEACHER;

      class TestResolver {
        @PHIField()
        async phiData(): Promise<string> {
          return 'phi-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.phiData.call(resolver, {}, {}, mockContext, {});

      expect(result).toBeNull();
    });
  });

  describe('AdminOnlyField decorator', () => {
    it('should allow access for ADMIN role', async () => {
      mockContext.req.user.role = UserRole.ADMIN;

      class TestResolver {
        @AdminOnlyField()
        async adminData(): Promise<string> {
          return 'admin-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.adminData.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('admin-data');
    });

    it('should deny access for all non-admin roles', async () => {
      const nonAdminRoles = [
        UserRole.NURSE,
        UserRole.TEACHER,
        UserRole.PARENT,
        UserRole.SCHOOL_ADMIN,
        UserRole.DISTRICT_ADMIN,
      ];

      for (const role of nonAdminRoles) {
        mockContext.req.user.role = role;

        class TestResolver {
          @AdminOnlyField()
          async adminData(): Promise<string> {
            return 'admin-data';
          }
        }

        const resolver = new TestResolver();
        const result = await resolver.adminData.call(resolver, {}, {}, mockContext, {});

        expect(result).toBeNull();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle async method execution', async () => {
      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN])
        async asyncField(): Promise<string> {
          await new Promise(resolve => setTimeout(resolve, 10));
          return 'async-data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.asyncField.call(resolver, {}, {}, mockContext, {});

      expect(result).toBe('async-data');
    });

    it('should handle errors in original method', async () => {
      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN])
        async errorField(): Promise<string> {
          throw new Error('Method error');
        }
      }

      const resolver = new TestResolver();

      await expect(
        resolver.errorField.call(resolver, {}, {}, mockContext, {}),
      ).rejects.toThrow('Method error');
    });

    it('should handle null return values', async () => {
      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN])
        async nullField(): Promise<string | null> {
          return null;
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.nullField.call(resolver, {}, {}, mockContext, {});

      expect(result).toBeNull();
    });

    it('should handle undefined user object', async () => {
      const invalidContext = {
        req: {
          user: undefined,
        },
      };

      class TestResolver {
        @FieldAuthorization([UserRole.ADMIN])
        async field(): Promise<string> {
          return 'data';
        }
      }

      const resolver = new TestResolver();
      const result = await resolver.field.call(resolver, {}, {}, invalidContext, {});

      expect(result).toBeNull();
    });
  });
});
