import {
  UserRole,
  Permission,
  CacheStrategy,
  RateLimitConfig,
  AuditMetadata,
  TenantContext,
  PaginationMeta,
  PaginatedResponse,
  ApiGet,
  ApiPost,
  ApiPut,
  ApiPatch,
  ApiDelete,
  Roles,
  Public,
  MedicalStaffOnly,
  AdminOnly,
  HealthcareProfessional,
  RequirePermissions,
  ReadPermission,
  WritePermission,
  DeletePermission,
  AdminPermission,
  RateLimit,
  StrictRateLimit,
  ModerateRateLimit,
  LenientRateLimit,
  CacheControl,
  NoCache,
  PrivateCache,
  PublicCache,
  ImmutableCache,
  ApiVersion,
  Deprecated,
  AcceptsContentType,
  ProducesContentType,
  JsonOnly,
  MultipartFormData,
  FileDownload,
  StrictValidation,
  LenientValidation,
  ValidateUUID,
  ApiPaginatedResponse,
  EnvelopedResponse,
  TimestampedResponse,
  AuditLog,
  LogPHIAccess,
  LogSensitiveModification,
  LogDataExport,
  Transactional,
  ReadOnlyTransaction,
  TenantIsolated,
  CrossTenantAccess,
  CurrentUser,
  UserId,
  UserRoles,
  IpAddress,
  UserAgent,
  TenantId,
  CorrelationId,
  RequestTimestamp,
  CustomHeaders,
  QueryParams,
  RouteParams,
  HttpMethod,
  RequestUrl,
  Protocol,
  Hostname,
  ROLES_KEY,
  PERMISSIONS_KEY,
  IS_PUBLIC_KEY,
  RATE_LIMIT_KEY,
  AUDIT_KEY,
  TENANT_KEY,
  TRANSACTION_KEY,
  API_VERSION_KEY,
} from './controller-decorators.service';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('ControllerDecoratorsService', () => {
  describe('Enums and Constants', () => {
    it('should define UserRole enum correctly', () => {
      expect(UserRole.SUPER_ADMIN).toBe('super_admin');
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.DOCTOR).toBe('doctor');
      expect(UserRole.NURSE).toBe('nurse');
      expect(UserRole.PATIENT).toBe('patient');
      expect(UserRole.PHARMACIST).toBe('pharmacist');
      expect(UserRole.LAB_TECHNICIAN).toBe('lab_technician');
      expect(UserRole.RECEPTIONIST).toBe('receptionist');
      expect(UserRole.BILLING_STAFF).toBe('billing_staff');
      expect(UserRole.GUEST).toBe('guest');
    });

    it('should define Permission enum correctly', () => {
      expect(Permission.READ).toBe('read');
      expect(Permission.WRITE).toBe('write');
      expect(Permission.UPDATE).toBe('update');
      expect(Permission.DELETE).toBe('delete');
      expect(Permission.ADMIN).toBe('admin');
      expect(Permission.EXECUTE).toBe('execute');
      expect(Permission.APPROVE).toBe('approve');
      expect(Permission.AUDIT).toBe('audit');
    });

    it('should define CacheStrategy enum correctly', () => {
      expect(CacheStrategy.NO_CACHE).toBe('no-cache');
      expect(CacheStrategy.PRIVATE).toBe('private');
      expect(CacheStrategy.PUBLIC).toBe('public');
      expect(CacheStrategy.IMMUTABLE).toBe('immutable');
    });

    it('should define metadata keys correctly', () => {
      expect(ROLES_KEY).toBe('roles');
      expect(PERMISSIONS_KEY).toBe('permissions');
      expect(IS_PUBLIC_KEY).toBe('isPublic');
      expect(RATE_LIMIT_KEY).toBe('rateLimit');
      expect(AUDIT_KEY).toBe('audit');
      expect(TENANT_KEY).toBe('tenant');
      expect(TRANSACTION_KEY).toBe('transaction');
      expect(API_VERSION_KEY).toBe('apiVersion');
    });
  });

  describe('Route Decorators', () => {
    describe('ApiGet', () => {
      it('should create decorator without parameters', () => {
        const decorator = ApiGet();
        expect(decorator).toBeDefined();
      });

      it('should create decorator with path', () => {
        const decorator = ApiGet('users');
        expect(decorator).toBeDefined();
      });

      it('should create decorator with path and summary', () => {
        const decorator = ApiGet('users', 'Get all users');
        expect(decorator).toBeDefined();
      });

      it('should create decorator with array of paths', () => {
        const decorator = ApiGet(['users', 'list']);
        expect(decorator).toBeDefined();
      });
    });

    describe('ApiPost', () => {
      it('should create decorator without parameters', () => {
        const decorator = ApiPost();
        expect(decorator).toBeDefined();
      });

      it('should create decorator with path and summary', () => {
        const decorator = ApiPost('users', 'Create a user');
        expect(decorator).toBeDefined();
      });
    });

    describe('ApiPut', () => {
      it('should create decorator with path', () => {
        const decorator = ApiPut(':id');
        expect(decorator).toBeDefined();
      });

      it('should create decorator with path and summary', () => {
        const decorator = ApiPut(':id', 'Update user');
        expect(decorator).toBeDefined();
      });
    });

    describe('ApiPatch', () => {
      it('should create decorator with path', () => {
        const decorator = ApiPatch(':id');
        expect(decorator).toBeDefined();
      });

      it('should create decorator with path and summary', () => {
        const decorator = ApiPatch(':id', 'Partially update user');
        expect(decorator).toBeDefined();
      });
    });

    describe('ApiDelete', () => {
      it('should create decorator with path', () => {
        const decorator = ApiDelete(':id');
        expect(decorator).toBeDefined();
      });

      it('should create decorator with path and summary', () => {
        const decorator = ApiDelete(':id', 'Delete user');
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Role-Based Access Control Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('Roles', () => {
      it('should set roles metadata', () => {
        const RolesDecorator = Roles(UserRole.ADMIN, UserRole.DOCTOR);

        class TestController {
          @RolesDecorator
          testMethod() {}
        }

        const roles = reflector.get(ROLES_KEY, TestController.prototype.testMethod);
        expect(roles).toEqual([UserRole.ADMIN, UserRole.DOCTOR]);
      });

      it('should set single role', () => {
        const RolesDecorator = Roles(UserRole.PATIENT);

        class TestController {
          @RolesDecorator
          testMethod() {}
        }

        const roles = reflector.get(ROLES_KEY, TestController.prototype.testMethod);
        expect(roles).toEqual([UserRole.PATIENT]);
      });
    });

    describe('Public', () => {
      it('should set public metadata', () => {
        const PublicDecorator = Public();

        class TestController {
          @PublicDecorator
          testMethod() {}
        }

        const isPublic = reflector.get(IS_PUBLIC_KEY, TestController.prototype.testMethod);
        expect(isPublic).toBe(true);
      });
    });

    describe('MedicalStaffOnly', () => {
      it('should set medical staff roles', () => {
        const decorator = MedicalStaffOnly();

        class TestController {
          @decorator
          testMethod() {}
        }

        const roles = reflector.get(ROLES_KEY, TestController.prototype.testMethod);
        expect(roles).toContain(UserRole.DOCTOR);
        expect(roles).toContain(UserRole.NURSE);
      });
    });

    describe('AdminOnly', () => {
      it('should set admin roles', () => {
        const decorator = AdminOnly();

        class TestController {
          @decorator
          testMethod() {}
        }

        const roles = reflector.get(ROLES_KEY, TestController.prototype.testMethod);
        expect(roles).toContain(UserRole.ADMIN);
        expect(roles).toContain(UserRole.SUPER_ADMIN);
      });
    });

    describe('HealthcareProfessional', () => {
      it('should create decorator with healthcare professional roles', () => {
        const decorator = HealthcareProfessional();
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Permission Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('RequirePermissions', () => {
      it('should set permissions metadata', () => {
        const decorator = RequirePermissions(Permission.READ, Permission.WRITE);

        class TestController {
          @decorator
          testMethod() {}
        }

        const permissions = reflector.get(PERMISSIONS_KEY, TestController.prototype.testMethod);
        expect(permissions).toEqual([Permission.READ, Permission.WRITE]);
      });
    });

    describe('ReadPermission', () => {
      it('should set read permission', () => {
        const decorator = ReadPermission();

        class TestController {
          @decorator
          testMethod() {}
        }

        const permissions = reflector.get(PERMISSIONS_KEY, TestController.prototype.testMethod);
        expect(permissions).toContain(Permission.READ);
      });
    });

    describe('WritePermission', () => {
      it('should set write permission', () => {
        const decorator = WritePermission();

        class TestController {
          @decorator
          testMethod() {}
        }

        const permissions = reflector.get(PERMISSIONS_KEY, TestController.prototype.testMethod);
        expect(permissions).toContain(Permission.WRITE);
      });
    });

    describe('DeletePermission', () => {
      it('should set delete permission', () => {
        const decorator = DeletePermission();

        class TestController {
          @decorator
          testMethod() {}
        }

        const permissions = reflector.get(PERMISSIONS_KEY, TestController.prototype.testMethod);
        expect(permissions).toContain(Permission.DELETE);
      });
    });

    describe('AdminPermission', () => {
      it('should set admin permission', () => {
        const decorator = AdminPermission();

        class TestController {
          @decorator
          testMethod() {}
        }

        const permissions = reflector.get(PERMISSIONS_KEY, TestController.prototype.testMethod);
        expect(permissions).toContain(Permission.ADMIN);
      });
    });
  });

  describe('Rate Limit Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('RateLimit', () => {
      it('should set rate limit metadata', () => {
        const config: RateLimitConfig = { ttl: 60, limit: 10 };
        const decorator = RateLimit(config);

        class TestController {
          @decorator
          testMethod() {}
        }

        const rateLimitConfig = reflector.get(RATE_LIMIT_KEY, TestController.prototype.testMethod);
        expect(rateLimitConfig).toEqual(config);
      });

      it('should set rate limit with key prefix', () => {
        const config: RateLimitConfig = { ttl: 60, limit: 10, keyPrefix: 'api' };
        const decorator = RateLimit(config);

        class TestController {
          @decorator
          testMethod() {}
        }

        const rateLimitConfig = reflector.get(RATE_LIMIT_KEY, TestController.prototype.testMethod);
        expect(rateLimitConfig).toEqual(config);
      });
    });

    describe('StrictRateLimit', () => {
      it('should create strict rate limit decorator', () => {
        const decorator = StrictRateLimit();
        expect(decorator).toBeDefined();
      });
    });

    describe('ModerateRateLimit', () => {
      it('should create moderate rate limit decorator', () => {
        const decorator = ModerateRateLimit();
        expect(decorator).toBeDefined();
      });
    });

    describe('LenientRateLimit', () => {
      it('should create lenient rate limit decorator', () => {
        const decorator = LenientRateLimit();
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Cache Control Decorators', () => {
    describe('CacheControl', () => {
      it('should create cache control decorator with strategy', () => {
        const decorator = CacheControl(CacheStrategy.PUBLIC, 3600);
        expect(decorator).toBeDefined();
      });

      it('should use default max age when not provided', () => {
        const decorator = CacheControl(CacheStrategy.PRIVATE);
        expect(decorator).toBeDefined();
      });
    });

    describe('NoCache', () => {
      it('should create no-cache decorator', () => {
        const decorator = NoCache();
        expect(decorator).toBeDefined();
      });
    });

    describe('PrivateCache', () => {
      it('should create private cache decorator with default max age', () => {
        const decorator = PrivateCache();
        expect(decorator).toBeDefined();
      });

      it('should create private cache decorator with custom max age', () => {
        const decorator = PrivateCache(600);
        expect(decorator).toBeDefined();
      });
    });

    describe('PublicCache', () => {
      it('should create public cache decorator with default max age', () => {
        const decorator = PublicCache();
        expect(decorator).toBeDefined();
      });

      it('should create public cache decorator with custom max age', () => {
        const decorator = PublicCache(7200);
        expect(decorator).toBeDefined();
      });
    });

    describe('ImmutableCache', () => {
      it('should create immutable cache decorator', () => {
        const decorator = ImmutableCache();
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('API Versioning Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('ApiVersion', () => {
      it('should set API version metadata', () => {
        const decorator = ApiVersion('v2');

        class TestController {
          @decorator
          testMethod() {}
        }

        const version = reflector.get(API_VERSION_KEY, TestController.prototype.testMethod);
        expect(version).toBe('v2');
      });
    });

    describe('Deprecated', () => {
      it('should create deprecated decorator with version info', () => {
        const decorator = Deprecated('v1.0', 'v2.0');
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Content Negotiation Decorators', () => {
    describe('AcceptsContentType', () => {
      it('should create decorator accepting single content type', () => {
        const decorator = AcceptsContentType('application/json');
        expect(decorator).toBeDefined();
      });

      it('should create decorator accepting multiple content types', () => {
        const decorator = AcceptsContentType('application/json', 'application/xml');
        expect(decorator).toBeDefined();
      });
    });

    describe('ProducesContentType', () => {
      it('should create decorator producing content types', () => {
        const decorator = ProducesContentType('application/json', 'text/csv');
        expect(decorator).toBeDefined();
      });
    });

    describe('JsonOnly', () => {
      it('should create JSON-only decorator', () => {
        const decorator = JsonOnly();
        expect(decorator).toBeDefined();
      });
    });

    describe('MultipartFormData', () => {
      it('should create multipart form data decorator', () => {
        const decorator = MultipartFormData();
        expect(decorator).toBeDefined();
      });
    });

    describe('FileDownload', () => {
      it('should create file download decorator with default MIME type', () => {
        const decorator = FileDownload();
        expect(decorator).toBeDefined();
      });

      it('should create file download decorator with custom MIME type', () => {
        const decorator = FileDownload('application/pdf');
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Request Validation Decorators', () => {
    describe('StrictValidation', () => {
      it('should create strict validation decorator', () => {
        const decorator = StrictValidation();
        expect(decorator).toBeDefined();
      });
    });

    describe('LenientValidation', () => {
      it('should create lenient validation decorator', () => {
        const decorator = LenientValidation();
        expect(decorator).toBeDefined();
      });
    });

    describe('ValidateUUID', () => {
      it('should create UUID validation decorator', () => {
        const decorator = ValidateUUID();
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Response Transformation Decorators', () => {
    describe('ApiPaginatedResponse', () => {
      it('should create paginated response decorator', () => {
        class UserDto {
          id!: string;
          name!: string;
        }

        const decorator = ApiPaginatedResponse(UserDto);
        expect(decorator).toBeDefined();
      });
    });

    describe('EnvelopedResponse', () => {
      it('should create enveloped response decorator', () => {
        const decorator = EnvelopedResponse();
        expect(decorator).toBeDefined();
      });
    });

    describe('TimestampedResponse', () => {
      it('should create timestamped response decorator', () => {
        const decorator = TimestampedResponse();
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Audit Logging Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('AuditLog', () => {
      it('should set audit metadata', () => {
        const metadata: AuditMetadata = {
          action: 'CREATE',
          resourceType: 'User',
          severity: 'medium',
        };
        const decorator = AuditLog(metadata);

        class TestController {
          @decorator
          testMethod() {}
        }

        const auditMeta = reflector.get(AUDIT_KEY, TestController.prototype.testMethod);
        expect(auditMeta).toEqual(metadata);
      });

      it('should set audit metadata with request/response body inclusion', () => {
        const metadata: AuditMetadata = {
          action: 'UPDATE',
          resourceType: 'Patient',
          severity: 'high',
          includeRequestBody: true,
          includeResponseBody: true,
        };
        const decorator = AuditLog(metadata);

        class TestController {
          @decorator
          testMethod() {}
        }

        const auditMeta = reflector.get(AUDIT_KEY, TestController.prototype.testMethod);
        expect(auditMeta).toEqual(metadata);
      });
    });

    describe('LogPHIAccess', () => {
      it('should create PHI access logging decorator', () => {
        const decorator = LogPHIAccess('MedicalRecord');
        expect(decorator).toBeDefined();
      });
    });

    describe('LogSensitiveModification', () => {
      it('should create sensitive modification logging decorator', () => {
        const decorator = LogSensitiveModification('PatientData');
        expect(decorator).toBeDefined();
      });
    });

    describe('LogDataExport', () => {
      it('should create data export logging decorator', () => {
        const decorator = LogDataExport('LabResults');
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Transaction Boundary Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('Transactional', () => {
      it('should set transactional metadata', () => {
        const decorator = Transactional();

        class TestController {
          @decorator
          testMethod() {}
        }

        const isTransactional = reflector.get(TRANSACTION_KEY, TestController.prototype.testMethod);
        expect(isTransactional).toBe(true);
      });
    });

    describe('ReadOnlyTransaction', () => {
      it('should set read-only transaction metadata', () => {
        const decorator = ReadOnlyTransaction();

        class TestController {
          @decorator
          testMethod() {}
        }

        const transactionConfig = reflector.get(TRANSACTION_KEY, TestController.prototype.testMethod);
        expect(transactionConfig).toEqual({ readOnly: true });
      });
    });
  });

  describe('Tenant Isolation Decorators', () => {
    let reflector: Reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    describe('TenantIsolated', () => {
      it('should set tenant isolation metadata', () => {
        const decorator = TenantIsolated();

        class TestController {
          @decorator
          testMethod() {}
        }

        const isTenantIsolated = reflector.get(TENANT_KEY, TestController.prototype.testMethod);
        expect(isTenantIsolated).toBe(true);
      });
    });

    describe('CrossTenantAccess', () => {
      it('should create cross-tenant access decorator', () => {
        const decorator = CrossTenantAccess();
        expect(decorator).toBeDefined();
      });
    });
  });

  describe('Metadata Extraction Decorators (Parameter Decorators)', () => {
    describe('CurrentUser', () => {
      it('should extract current user from request', () => {
        const mockRequest = {
          user: { id: '123', name: 'John Doe', email: 'john@example.com' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CurrentUser(undefined, mockContext);

        expect(result).toEqual(mockRequest.user);
      });

      it('should extract specific user property', () => {
        const mockRequest = {
          user: { id: '123', name: 'John Doe', email: 'john@example.com' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CurrentUser('email', mockContext);

        expect(result).toBe('john@example.com');
      });

      it('should throw error when user not found', () => {
        const mockRequest = {};

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        expect(() => CurrentUser(undefined, mockContext)).toThrow('User not found in request');
      });
    });

    describe('UserId', () => {
      it('should extract user ID from request', () => {
        const mockRequest = {
          user: { id: 'user-123' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = UserId(undefined, mockContext);

        expect(result).toBe('user-123');
      });

      it('should extract userId field', () => {
        const mockRequest = {
          user: { userId: 'user-456' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = UserId(undefined, mockContext);

        expect(result).toBe('user-456');
      });
    });

    describe('UserRoles', () => {
      it('should extract user roles from request', () => {
        const mockRequest = {
          user: { roles: [UserRole.DOCTOR, UserRole.ADMIN] },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = UserRoles(undefined, mockContext);

        expect(result).toEqual([UserRole.DOCTOR, UserRole.ADMIN]);
      });

      it('should return empty array when no roles', () => {
        const mockRequest = {
          user: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = UserRoles(undefined, mockContext);

        expect(result).toEqual([]);
      });
    });

    describe('IpAddress', () => {
      it('should extract IP address from request.ip', () => {
        const mockRequest = {
          ip: '192.168.1.1',
          headers: {},
          socket: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = IpAddress(undefined, mockContext);

        expect(result).toBe('192.168.1.1');
      });

      it('should extract IP from x-forwarded-for header', () => {
        const mockRequest = {
          headers: { 'x-forwarded-for': '203.0.113.0' },
          socket: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = IpAddress(undefined, mockContext);

        expect(result).toBe('203.0.113.0');
      });

      it('should return unknown when no IP available', () => {
        const mockRequest = {
          headers: {},
          socket: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = IpAddress(undefined, mockContext);

        expect(result).toBe('unknown');
      });
    });

    describe('UserAgent', () => {
      it('should extract user agent from request headers', () => {
        const mockRequest = {
          headers: { 'user-agent': 'Mozilla/5.0' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = UserAgent(undefined, mockContext);

        expect(result).toBe('Mozilla/5.0');
      });

      it('should return unknown when no user agent', () => {
        const mockRequest = {
          headers: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = UserAgent(undefined, mockContext);

        expect(result).toBe('unknown');
      });
    });

    describe('TenantId', () => {
      it('should extract tenant ID from request header', () => {
        const mockRequest = {
          headers: { 'x-tenant-id': 'tenant-123' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = TenantId(undefined, mockContext);

        expect(result).toBe('tenant-123');
      });

      it('should extract tenant ID from request property', () => {
        const mockRequest = {
          headers: {},
          tenantId: 'tenant-456',
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = TenantId(undefined, mockContext);

        expect(result).toBe('tenant-456');
      });

      it('should throw error when tenant ID not found', () => {
        const mockRequest = {
          headers: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        expect(() => TenantId(undefined, mockContext)).toThrow('Tenant ID is required');
      });
    });

    describe('CorrelationId', () => {
      it('should extract correlation ID from request header', () => {
        const mockRequest = {
          headers: { 'x-correlation-id': 'corr-123' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CorrelationId(undefined, mockContext);

        expect(result).toBe('corr-123');
      });

      it('should return empty string when no correlation ID', () => {
        const mockRequest = {
          headers: {},
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CorrelationId(undefined, mockContext);

        expect(result).toBe('');
      });
    });

    describe('RequestTimestamp', () => {
      it('should return current date', () => {
        const mockContext = {} as ExecutionContext;
        const before = new Date();

        const result = RequestTimestamp(undefined, mockContext);

        const after = new Date();

        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
      });
    });

    describe('CustomHeaders', () => {
      it('should extract all headers when no specific headers requested', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer token',
          },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CustomHeaders(undefined, mockContext);

        expect(result).toEqual(mockRequest.headers);
      });

      it('should extract specific headers', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer token',
            'x-custom': 'value',
          },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CustomHeaders(['Content-Type', 'X-Custom'], mockContext);

        expect(result).toEqual({
          'Content-Type': 'application/json',
          'X-Custom': 'value',
        });
      });

      it('should handle array header values', () => {
        const mockRequest = {
          headers: {
            'x-multi': ['value1', 'value2'],
          },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = CustomHeaders(['X-Multi'], mockContext);

        expect(result['X-Multi']).toBe('value1');
      });
    });

    describe('QueryParams', () => {
      it('should extract query parameters from request', () => {
        const mockRequest = {
          query: { page: '1', limit: '10', search: 'test' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = QueryParams(undefined, mockContext);

        expect(result).toEqual({ page: '1', limit: '10', search: 'test' });
      });
    });

    describe('RouteParams', () => {
      it('should extract route parameters from request', () => {
        const mockRequest = {
          params: { id: '123', slug: 'test-post' },
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = RouteParams(undefined, mockContext);

        expect(result).toEqual({ id: '123', slug: 'test-post' });
      });
    });

    describe('HttpMethod', () => {
      it('should extract HTTP method from request', () => {
        const mockRequest = {
          method: 'POST',
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = HttpMethod(undefined, mockContext);

        expect(result).toBe('POST');
      });
    });

    describe('RequestUrl', () => {
      it('should construct full request URL', () => {
        const mockRequest = {
          protocol: 'https',
          get: (header: string) => 'example.com',
          originalUrl: '/api/users?page=1',
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = RequestUrl(undefined, mockContext);

        expect(result).toBe('https://example.com/api/users?page=1');
      });
    });

    describe('Protocol', () => {
      it('should extract protocol from request', () => {
        const mockRequest = {
          protocol: 'https',
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = Protocol(undefined, mockContext);

        expect(result).toBe('https');
      });
    });

    describe('Hostname', () => {
      it('should extract hostname from request', () => {
        const mockRequest = {
          hostname: 'api.example.com',
        };

        const mockContext = {
          switchToHttp: () => ({
            getRequest: () => mockRequest,
          }),
        } as unknown as ExecutionContext;

        const result = Hostname(undefined, mockContext);

        expect(result).toBe('api.example.com');
      });
    });
  });
});
