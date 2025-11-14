"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hostname = exports.Protocol = exports.RequestUrl = exports.HttpMethod = exports.RouteParams = exports.QueryParams = exports.CustomHeaders = exports.RequestTimestamp = exports.CorrelationId = exports.TenantId = exports.UserAgent = exports.IpAddress = exports.UserRoles = exports.UserId = exports.CurrentUser = exports.API_VERSION_KEY = exports.TRANSACTION_KEY = exports.TENANT_KEY = exports.AUDIT_KEY = exports.RATE_LIMIT_KEY = exports.IS_PUBLIC_KEY = exports.PERMISSIONS_KEY = exports.ROLES_KEY = exports.CacheStrategy = exports.Permission = exports.UserRole = void 0;
exports.ApiGet = ApiGet;
exports.ApiPost = ApiPost;
exports.ApiPut = ApiPut;
exports.ApiPatch = ApiPatch;
exports.ApiDelete = ApiDelete;
exports.Roles = Roles;
exports.Public = Public;
exports.MedicalStaffOnly = MedicalStaffOnly;
exports.AdminOnly = AdminOnly;
exports.HealthcareProfessional = HealthcareProfessional;
exports.RequirePermissions = RequirePermissions;
exports.ReadPermission = ReadPermission;
exports.WritePermission = WritePermission;
exports.DeletePermission = DeletePermission;
exports.AdminPermission = AdminPermission;
exports.RateLimit = RateLimit;
exports.StrictRateLimit = StrictRateLimit;
exports.ModerateRateLimit = ModerateRateLimit;
exports.LenientRateLimit = LenientRateLimit;
exports.CacheControl = CacheControl;
exports.NoCache = NoCache;
exports.PrivateCache = PrivateCache;
exports.PublicCache = PublicCache;
exports.ImmutableCache = ImmutableCache;
exports.ApiVersion = ApiVersion;
exports.Deprecated = Deprecated;
exports.AcceptsContentType = AcceptsContentType;
exports.ProducesContentType = ProducesContentType;
exports.JsonOnly = JsonOnly;
exports.MultipartFormData = MultipartFormData;
exports.FileDownload = FileDownload;
exports.StrictValidation = StrictValidation;
exports.LenientValidation = LenientValidation;
exports.ValidateUUID = ValidateUUID;
exports.ApiPaginatedResponse = ApiPaginatedResponse;
exports.EnvelopedResponse = EnvelopedResponse;
exports.TimestampedResponse = TimestampedResponse;
exports.AuditLog = AuditLog;
exports.LogPHIAccess = LogPHIAccess;
exports.LogSensitiveModification = LogSensitiveModification;
exports.LogDataExport = LogDataExport;
exports.Transactional = Transactional;
exports.ReadOnlyTransaction = ReadOnlyTransaction;
exports.TenantIsolated = TenantIsolated;
exports.CrossTenantAccess = CrossTenantAccess;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["DOCTOR"] = "doctor";
    UserRole["NURSE"] = "nurse";
    UserRole["PATIENT"] = "patient";
    UserRole["PHARMACIST"] = "pharmacist";
    UserRole["LAB_TECHNICIAN"] = "lab_technician";
    UserRole["RECEPTIONIST"] = "receptionist";
    UserRole["BILLING_STAFF"] = "billing_staff";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
var Permission;
(function (Permission) {
    Permission["READ"] = "read";
    Permission["WRITE"] = "write";
    Permission["UPDATE"] = "update";
    Permission["DELETE"] = "delete";
    Permission["ADMIN"] = "admin";
    Permission["EXECUTE"] = "execute";
    Permission["APPROVE"] = "approve";
    Permission["AUDIT"] = "audit";
})(Permission || (exports.Permission = Permission = {}));
var CacheStrategy;
(function (CacheStrategy) {
    CacheStrategy["NO_CACHE"] = "no-cache";
    CacheStrategy["PRIVATE"] = "private";
    CacheStrategy["PUBLIC"] = "public";
    CacheStrategy["IMMUTABLE"] = "immutable";
})(CacheStrategy || (exports.CacheStrategy = CacheStrategy = {}));
exports.ROLES_KEY = 'roles';
exports.PERMISSIONS_KEY = 'permissions';
exports.IS_PUBLIC_KEY = 'isPublic';
exports.RATE_LIMIT_KEY = 'rateLimit';
exports.AUDIT_KEY = 'audit';
exports.TENANT_KEY = 'tenant';
exports.TRANSACTION_KEY = 'transaction';
exports.API_VERSION_KEY = 'apiVersion';
function ApiGet(path, summary) {
    const decorators = [
        (0, common_1.Get)(path),
    ];
    if (summary) {
        decorators.push((0, swagger_1.ApiOperation)({ summary }));
    }
    decorators.push((0, swagger_1.ApiResponse)({ status: 200, description: 'Request successful' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiPost(path, summary) {
    const decorators = [
        (0, common_1.Post)(path),
        (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    ];
    if (summary) {
        decorators.push((0, swagger_1.ApiOperation)({ summary }));
    }
    decorators.push((0, swagger_1.ApiResponse)({ status: 201, description: 'Resource created successfully' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body or parameters' }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiPut(path, summary) {
    const decorators = [
        (0, common_1.Put)(path),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    ];
    if (summary) {
        decorators.push((0, swagger_1.ApiOperation)({ summary }));
    }
    decorators.push((0, swagger_1.ApiResponse)({ status: 200, description: 'Resource updated successfully' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body or parameters' }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiPatch(path, summary) {
    const decorators = [
        (0, common_1.Patch)(path),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    ];
    if (summary) {
        decorators.push((0, swagger_1.ApiOperation)({ summary }));
    }
    decorators.push((0, swagger_1.ApiResponse)({ status: 200, description: 'Resource partially updated successfully' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body or parameters' }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiDelete(path, summary) {
    const decorators = [
        (0, common_1.Delete)(path),
        (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    ];
    if (summary) {
        decorators.push((0, swagger_1.ApiOperation)({ summary }));
    }
    decorators.push((0, swagger_1.ApiResponse)({ status: 204, description: 'Resource deleted successfully' }));
    decorators.push((0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }));
    return (0, common_1.applyDecorators)(...decorators);
}
function Roles(...roles) {
    return (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
}
function Public() {
    return (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
}
function MedicalStaffOnly() {
    return Roles(UserRole.DOCTOR, UserRole.NURSE);
}
function AdminOnly() {
    return Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN);
}
function HealthcareProfessional() {
    return (0, common_1.applyDecorators)(Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST, UserRole.LAB_TECHNICIAN), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized: Healthcare professional credentials required' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden: Insufficient healthcare professional permissions' }));
}
function RequirePermissions(...permissions) {
    return (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
}
function ReadPermission() {
    return RequirePermissions(Permission.READ);
}
function WritePermission() {
    return RequirePermissions(Permission.WRITE);
}
function DeletePermission() {
    return RequirePermissions(Permission.DELETE);
}
function AdminPermission() {
    return RequirePermissions(Permission.ADMIN);
}
function RateLimit(config) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, config), (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too Many Requests - Rate limit exceeded' }));
}
function StrictRateLimit() {
    return RateLimit({ ttl: 60, limit: 10 });
}
function ModerateRateLimit() {
    return RateLimit({ ttl: 60, limit: 100 });
}
function LenientRateLimit() {
    return RateLimit({ ttl: 60, limit: 1000 });
}
function CacheControl(strategy, maxAge = 3600) {
    const cacheValue = `${strategy}, max-age=${maxAge}`;
    return (0, common_1.Header)('Cache-Control', cacheValue);
}
function NoCache() {
    return (0, common_1.applyDecorators)((0, common_1.Header)('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'), (0, common_1.Header)('Pragma', 'no-cache'), (0, common_1.Header)('Expires', '0'));
}
function PrivateCache(maxAge = 300) {
    return CacheControl(CacheStrategy.PRIVATE, maxAge);
}
function PublicCache(maxAge = 3600) {
    return CacheControl(CacheStrategy.PUBLIC, maxAge);
}
function ImmutableCache() {
    return (0, common_1.Header)('Cache-Control', 'public, max-age=31536000, immutable');
}
function ApiVersion(version) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.API_VERSION_KEY, version), (0, swagger_1.ApiHeader)({ name: 'X-API-Version', description: `API Version ${version}` }));
}
function Deprecated(deprecatedSince, removeInVersion) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        deprecated: true,
        summary: `DEPRECATED since ${deprecatedSince}, will be removed in ${removeInVersion}`,
    }), (0, common_1.Header)('X-Deprecated', 'true'), (0, common_1.Header)('X-Deprecated-Since', deprecatedSince), (0, common_1.Header)('X-Remove-In-Version', removeInVersion));
}
function AcceptsContentType(...contentTypes) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiConsumes)(...contentTypes), (0, swagger_1.ApiResponse)({ status: 415, description: 'Unsupported Media Type' }));
}
function ProducesContentType(...contentTypes) {
    return (0, swagger_1.ApiProduces)(...contentTypes);
}
function JsonOnly() {
    return (0, common_1.applyDecorators)(AcceptsContentType('application/json'), ProducesContentType('application/json'));
}
function MultipartFormData() {
    return AcceptsContentType('multipart/form-data');
}
function FileDownload(mimeType = 'application/octet-stream') {
    return (0, common_1.applyDecorators)(ProducesContentType(mimeType), (0, common_1.Header)('Content-Disposition', 'attachment'));
}
function StrictValidation() {
    return (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map((error) => ({
                field: error.property,
                constraints: error.constraints,
                value: error.value,
            }));
            return new common_1.BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        },
    }));
}
function LenientValidation() {
    return (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: false,
        forbidNonWhitelisted: false,
    }));
}
function ValidateUUID() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }));
}
function ApiPaginatedResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(model), (0, swagger_1.ApiOkResponse)({
        description: 'Paginated response',
        schema: {
            allOf: [
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                limit: { type: 'number' },
                                total: { type: 'number' },
                                totalPages: { type: 'number' },
                            },
                        },
                    },
                },
            ],
        },
    }));
}
function EnvelopedResponse() {
    return (0, common_1.applyDecorators)((0, common_1.Header)('X-Response-Format', 'enveloped'));
}
function TimestampedResponse() {
    return (0, common_1.applyDecorators)((0, common_1.Header)('X-Response-Time', new Date().toISOString()));
}
function AuditLog(metadata) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.AUDIT_KEY, metadata));
}
function LogPHIAccess(resourceType) {
    return AuditLog({
        action: 'PHI_ACCESS',
        resourceType,
        severity: 'high',
        includeRequestBody: false,
        includeResponseBody: false,
    });
}
function LogSensitiveModification(resourceType) {
    return AuditLog({
        action: 'SENSITIVE_MODIFICATION',
        resourceType,
        severity: 'critical',
        includeRequestBody: true,
        includeResponseBody: true,
    });
}
function LogDataExport(resourceType) {
    return AuditLog({
        action: 'DATA_EXPORT',
        resourceType,
        severity: 'high',
        includeRequestBody: true,
        includeResponseBody: false,
    });
}
function Transactional() {
    return (0, common_1.SetMetadata)(exports.TRANSACTION_KEY, true);
}
function ReadOnlyTransaction() {
    return (0, common_1.SetMetadata)(exports.TRANSACTION_KEY, { readOnly: true });
}
function TenantIsolated() {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.TENANT_KEY, true), (0, swagger_1.ApiHeader)({ name: 'X-Tenant-ID', description: 'Tenant identifier', required: true }));
}
function CrossTenantAccess() {
    return (0, common_1.applyDecorators)(AdminOnly(), (0, swagger_1.ApiHeader)({ name: 'X-Target-Tenant-ID', description: 'Target tenant identifier' }));
}
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        throw new common_1.UnauthorizedException('User not found in request');
    }
    return data ? user?.[data] : user;
});
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.id || user?.userId;
});
exports.UserRoles = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.roles || [];
});
exports.IpAddress = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.ip ||
        request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.socket.remoteAddress ||
        'unknown');
});
exports.UserAgent = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'unknown';
});
exports.TenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] || request.tenantId;
    if (!tenantId) {
        throw new common_1.BadRequestException('Tenant ID is required');
    }
    return tenantId;
});
exports.CorrelationId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-correlation-id'] || request.correlationId || '';
});
exports.RequestTimestamp = (0, common_1.createParamDecorator)((data, ctx) => {
    return new Date();
});
exports.CustomHeaders = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!data || data.length === 0) {
        return request.headers;
    }
    const headers = {};
    data.forEach((headerName) => {
        const value = request.headers[headerName.toLowerCase()];
        if (value) {
            headers[headerName] = Array.isArray(value) ? value[0] : value;
        }
    });
    return headers;
});
exports.QueryParams = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.query;
});
exports.RouteParams = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.params;
});
exports.HttpMethod = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.method;
});
exports.RequestUrl = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
});
exports.Protocol = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
});
exports.Hostname = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.hostname;
});
//# sourceMappingURL=controller-decorators.service.js.map