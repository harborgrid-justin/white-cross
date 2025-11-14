"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseErrorResponseDto = exports.SystemErrorResponseDto = exports.SecurityErrorResponseDto = exports.HealthcareErrorResponseDto = exports.BusinessErrorResponseDto = exports.ValidationErrorResponseDto = exports.ValidationErrorDetailDto = exports.ErrorResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class ErrorResponseDto {
    success;
    statusCode;
    timestamp;
    method;
    path;
    error;
    message;
    errorCode;
    requestId;
    details;
    stack;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, statusCode: { required: true, type: () => Number }, timestamp: { required: true, type: () => String }, method: { required: true, type: () => String }, path: { required: true, type: () => String }, error: { required: true, type: () => String }, message: { required: true, type: () => Object }, errorCode: { required: false, type: () => String }, requestId: { required: false, type: () => String }, details: { required: false, type: () => Object }, stack: { required: false, type: () => String } };
    }
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: false,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], ErrorResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code',
        example: 400,
        type: Number,
    }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ISO 8601 timestamp of when the error occurred',
        example: '2025-11-14T10:30:00.000Z',
        type: String,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP method that was used',
        example: 'POST',
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Request path that generated the error',
        example: '/api/v1/students',
        type: String,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type/name',
        example: 'Bad Request',
        type: String,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable error message or array of messages',
        example: 'Validation failed',
        oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
        ],
    }),
    __metadata("design:type", Object)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Machine-readable error code for client-side error handling',
        example: 'VALID_001',
        type: String,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unique request identifier for tracking and debugging',
        example: 'req_1234567890abcdef',
        type: String,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional error details',
        example: { field: 'email', constraint: 'isEmail' },
        type: Object,
    }),
    __metadata("design:type", Object)
], ErrorResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Stack trace (only in development)',
        example: 'Error: Validation failed\n    at ...',
        type: String,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "stack", void 0);
class ValidationErrorDetailDto {
    field;
    message;
    value;
    constraint;
    static _OPENAPI_METADATA_FACTORY() {
        return { field: { required: true, type: () => String }, message: { required: true, type: () => String }, value: { required: false, type: () => Object }, constraint: { required: false, type: () => String } };
    }
}
exports.ValidationErrorDetailDto = ValidationErrorDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Field name that failed validation',
        example: 'email',
        type: String,
    }),
    __metadata("design:type", String)
], ValidationErrorDetailDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Validation error message',
        example: 'Email must be a valid email address',
        type: String,
    }),
    __metadata("design:type", String)
], ValidationErrorDetailDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The value that failed validation',
        example: 'invalid-email',
    }),
    __metadata("design:type", Object)
], ValidationErrorDetailDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation constraint that was violated',
        example: 'isEmail',
        type: String,
    }),
    __metadata("design:type", String)
], ValidationErrorDetailDto.prototype, "constraint", void 0);
class ValidationErrorResponseDto extends ErrorResponseDto {
    statusCode;
    error;
    errorCode;
    errors;
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true }, error: { required: true, type: () => String }, errorCode: { required: true, type: () => String }, errors: { required: true, type: () => [require("./error-response.dto").ValidationErrorDetailDto] } };
    }
}
exports.ValidationErrorResponseDto = ValidationErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code (400 for validation errors)',
        example: 400,
        type: Number,
    }),
    __metadata("design:type", Number)
], ValidationErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Validation Error',
        type: String,
    }),
    __metadata("design:type", String)
], ValidationErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error code for validation failures',
        example: 'VALID_001',
        enum: ['VALID_001', 'VALID_002', 'VALID_003'],
    }),
    __metadata("design:type", String)
], ValidationErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of detailed validation errors',
        type: [ValidationErrorDetailDto],
        isArray: true,
    }),
    __metadata("design:type", Array)
], ValidationErrorResponseDto.prototype, "errors", void 0);
class BusinessErrorResponseDto extends ErrorResponseDto {
    statusCode;
    error;
    errorCode;
    rule;
    context;
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true, type: () => Number }, error: { required: true, type: () => String }, errorCode: { required: true, type: () => String }, rule: { required: false, type: () => String }, context: { required: false, type: () => Object } };
    }
}
exports.BusinessErrorResponseDto = BusinessErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code (400 or 409 for business logic errors)',
        example: 409,
        type: Number,
    }),
    __metadata("design:type", Number)
], BusinessErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Business Logic Error',
        type: String,
    }),
    __metadata("design:type", String)
], BusinessErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Machine-readable error code',
        example: 'BUSINESS_002',
        enum: [
            'BUSINESS_001',
            'BUSINESS_002',
            'BUSINESS_003',
            'BUSINESS_004',
            'BUSINESS_005',
            'BUSINESS_006',
            'BUSINESS_007',
        ],
    }),
    __metadata("design:type", String)
], BusinessErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business rule that was violated',
        example: 'unique_email',
        type: String,
    }),
    __metadata("design:type", String)
], BusinessErrorResponseDto.prototype, "rule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional context about the business error',
        example: { conflictingField: 'email', existingValue: 'user@example.com' },
        type: Object,
    }),
    __metadata("design:type", Object)
], BusinessErrorResponseDto.prototype, "context", void 0);
class HealthcareErrorResponseDto extends ErrorResponseDto {
    statusCode;
    error;
    errorCode;
    domain;
    safetyLevel;
    context;
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true, type: () => Number }, error: { required: true, type: () => String }, errorCode: { required: true, type: () => String }, domain: { required: true, type: () => String }, safetyLevel: { required: true, type: () => Object }, context: { required: false, type: () => Object } };
    }
}
exports.HealthcareErrorResponseDto = HealthcareErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code (400 or 422 for healthcare errors)',
        example: 422,
        type: Number,
    }),
    __metadata("design:type", Number)
], HealthcareErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Healthcare Error',
        type: String,
    }),
    __metadata("design:type", String)
], HealthcareErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Machine-readable error code for healthcare errors',
        example: 'HEALTHCARE_001',
        enum: [
            'HEALTHCARE_001',
            'HEALTHCARE_002',
            'HEALTHCARE_003',
            'HEALTHCARE_004',
            'HEALTHCARE_005',
            'HEALTHCARE_006',
            'HEALTHCARE_007',
            'HEALTHCARE_008',
            'HEALTHCARE_009',
            'HEALTHCARE_010',
            'HEALTHCARE_011',
        ],
    }),
    __metadata("design:type", String)
], HealthcareErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Healthcare domain where the error occurred',
        example: 'medication',
        enum: [
            'clinical',
            'medication',
            'allergy',
            'vaccination',
            'appointment',
            'consent',
            'incident',
            'vital-signs',
        ],
    }),
    __metadata("design:type", String)
], HealthcareErrorResponseDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Safety level of the healthcare error',
        example: 'critical',
        enum: ['critical', 'warning', 'info'],
    }),
    __metadata("design:type", String)
], HealthcareErrorResponseDto.prototype, "safetyLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional context specific to the healthcare error',
        example: {
            medication1: 'Aspirin',
            medication2: 'Warfarin',
            interactionSeverity: 'major',
        },
        type: Object,
    }),
    __metadata("design:type", Object)
], HealthcareErrorResponseDto.prototype, "context", void 0);
class SecurityErrorResponseDto extends ErrorResponseDto {
    statusCode;
    error;
    errorCode;
    wwwAuthenticate;
    requiredPermissions;
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true, type: () => Object }, error: { required: true, type: () => String }, errorCode: { required: true, type: () => String }, wwwAuthenticate: { required: false, type: () => String }, requiredPermissions: { required: false, type: () => [String] } };
    }
}
exports.SecurityErrorResponseDto = SecurityErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code (401 or 403 for security errors)',
        example: 401,
        enum: [401, 403],
    }),
    __metadata("design:type", Number)
], SecurityErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Unauthorized',
        enum: ['Unauthorized', 'Forbidden'],
    }),
    __metadata("design:type", String)
], SecurityErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Machine-readable error code for security errors',
        example: 'AUTH_001',
        enum: [
            'AUTH_001',
            'AUTH_002',
            'AUTH_003',
            'AUTH_004',
            'AUTH_005',
            'AUTH_006',
            'AUTH_007',
            'AUTHZ_001',
            'AUTHZ_002',
            'AUTHZ_003',
        ],
    }),
    __metadata("design:type", String)
], SecurityErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'WWW-Authenticate header value for 401 responses',
        example: 'Bearer realm="White Cross API", error="invalid_token"',
        type: String,
    }),
    __metadata("design:type", String)
], SecurityErrorResponseDto.prototype, "wwwAuthenticate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required permissions for the requested action',
        example: ['students:write', 'health-records:read'],
        type: [String],
        isArray: true,
    }),
    __metadata("design:type", Array)
], SecurityErrorResponseDto.prototype, "requiredPermissions", void 0);
class SystemErrorResponseDto extends ErrorResponseDto {
    statusCode;
    error;
    errorCode;
    trackingId;
    retryAfter;
    static _OPENAPI_METADATA_FACTORY() {
        return { statusCode: { required: true, type: () => Number }, error: { required: true, type: () => String }, errorCode: { required: true, type: () => String }, trackingId: { required: false, type: () => String }, retryAfter: { required: false, type: () => Number } };
    }
}
exports.SystemErrorResponseDto = SystemErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code (500, 503, or other 5xx for system errors)',
        example: 500,
        type: Number,
    }),
    __metadata("design:type", Number)
], SystemErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Internal Server Error',
        type: String,
    }),
    __metadata("design:type", String)
], SystemErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Machine-readable error code for system errors',
        example: 'SYSTEM_001',
        enum: [
            'SYSTEM_001',
            'SYSTEM_002',
            'SYSTEM_003',
            'SYSTEM_004',
            'SYSTEM_005',
            'SYSTEM_006',
        ],
    }),
    __metadata("design:type", String)
], SystemErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tracking ID for error investigation',
        example: 'err_1234567890abcdef',
        type: String,
    }),
    __metadata("design:type", String)
], SystemErrorResponseDto.prototype, "trackingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Retry-After header value in seconds',
        example: 60,
        type: Number,
    }),
    __metadata("design:type", Number)
], SystemErrorResponseDto.prototype, "retryAfter", void 0);
class DatabaseErrorResponseDto extends BusinessErrorResponseDto {
    errorCode;
    table;
    field;
    constraint;
    static _OPENAPI_METADATA_FACTORY() {
        return { errorCode: { required: true, type: () => String }, table: { required: false, type: () => String }, field: { required: false, type: () => String }, constraint: { required: false, type: () => String } };
    }
}
exports.DatabaseErrorResponseDto = DatabaseErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Database error code',
        example: 'BUSINESS_002',
        enum: [
            'BUSINESS_002',
            'VALID_003',
            'VALID_002',
            'SYSTEM_003',
            'SYSTEM_002',
        ],
    }),
    __metadata("design:type", String)
], DatabaseErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Database table involved in the error',
        example: 'students',
        type: String,
    }),
    __metadata("design:type", String)
], DatabaseErrorResponseDto.prototype, "table", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Database field involved in the error',
        example: 'email',
        type: String,
    }),
    __metadata("design:type", String)
], DatabaseErrorResponseDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Constraint name that was violated',
        example: 'students_email_key',
        type: String,
    }),
    __metadata("design:type", String)
], DatabaseErrorResponseDto.prototype, "constraint", void 0);
//# sourceMappingURL=error-response.dto.js.map