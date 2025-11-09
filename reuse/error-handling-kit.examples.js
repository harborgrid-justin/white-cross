"use strict";
/**
 * Usage examples for error-handling-kit.prod.ts
 *
 * This file demonstrates common usage patterns for the error handling utilities.
 * These examples are for reference only and should not be executed directly.
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = exports.AppointmentController = exports.PatientController = void 0;
exports.example1_CustomExceptions = example1_CustomExceptions;
exports.example3_ZodValidation = example3_ZodValidation;
exports.example4_RetryLogic = example4_RetryLogic;
exports.example6_SentryIntegration = example6_SentryIntegration;
exports.example7_ErrorRecovery = example7_ErrorRecovery;
exports.example7_GracefulDegradation = example7_GracefulDegradation;
exports.example10_ErrorSanitization = example10_ErrorSanitization;
exports.example11_DeadLetterQueue = example11_DeadLetterQueue;
exports.bootstrap = bootstrap;
const error_handling_kit_prod_1 = require("./error-handling-kit.prod");
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
// ============================================================================
// EXAMPLE 1: CUSTOM EXCEPTIONS
// ============================================================================
/**
 * Example: Using custom domain exceptions
 */
async function example1_CustomExceptions() {
    // Throw a validation exception with details
    throw new error_handling_kit_prod_1.ValidationException('User input validation failed', [
        { field: 'email', message: 'Invalid email format', constraint: 'email' },
        { field: 'age', message: 'Must be at least 18', constraint: 'min' },
    ], { source: 'user-registration' });
    // Throw a resource not found exception
    throw new error_handling_kit_prod_1.ResourceNotFoundException('Patient', '123', { requestedBy: 'doctor-456' });
    // Throw a business rule exception
    throw new error_handling_kit_prod_1.BusinessRuleException('Cannot cancel appointment less than 24 hours before scheduled time', 'appointment-cancellation-24h', { appointmentId: '789', scheduledTime: '2025-11-09T10:00:00Z' });
    // Throw an external service exception
    throw new error_handling_kit_prod_1.ExternalServiceException('Failed to verify insurance eligibility', 'insurance-verification-api', new Error('Connection timeout'), { patientId: '123', insuranceProvider: 'BlueCross' });
}
// ============================================================================
// EXAMPLE 2: NESTJS EXCEPTION FILTERS
// ============================================================================
/**
 * Example: Using exception filters in NestJS controllers
 */
let PatientController = (() => {
    let _classDecorators = [(0, common_1.Controller)('patients'), (0, common_1.UseFilters)(error_handling_kit_prod_1.GlobalExceptionFilter, error_handling_kit_prod_1.ValidationExceptionFilter)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findOne_decorators;
    let _create_decorators;
    var PatientController = _classThis = class {
        async findOne(id) {
            const patient = await this.patientService.findOne(id);
            if (!patient) {
                throw new error_handling_kit_prod_1.ResourceNotFoundException('Patient', id);
            }
            return patient;
        }
        async create(dto) {
            // Validation happens automatically via ValidationPipe
            // If validation fails, ValidationExceptionFilter catches it
            try {
                return await this.patientService.create(dto);
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    throw new error_handling_kit_prod_1.ResourceConflictException('Patient with this email already exists', 'duplicate_email', { email: dto.email });
                }
                throw error;
            }
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "PatientController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, error_handling_kit_prod_1.ApiNotFoundErrorResponse)('Patient')];
        _create_decorators = [(0, common_1.Post)(), (0, error_handling_kit_prod_1.ApiValidationErrorResponse)(), (0, error_handling_kit_prod_1.ApiAllErrorResponses)()];
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatientController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatientController = _classThis;
})();
exports.PatientController = PatientController;
// ============================================================================
// EXAMPLE 3: ZOD VALIDATION WITH ERROR HANDLING
// ============================================================================
/**
 * Example: Using Zod validation with error formatting
 */
const CreatePatientSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    dateOfBirth: zod_1.z.string().datetime('Invalid date format'),
    phone: zod_1.z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
});
async function example3_ZodValidation(data) {
    try {
        const validated = CreatePatientSchema.parse(data);
        return validated;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const details = (0, error_handling_kit_prod_1.formatZodErrors)(error);
            throw new error_handling_kit_prod_1.ValidationException('Patient data validation failed', details);
        }
        throw error;
    }
}
// ============================================================================
// EXAMPLE 4: RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================================
/**
 * Example: Retry external API calls with backoff
 */
async function example4_RetryLogic() {
    const config = {
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
        backoffMultiplier: 2,
        shouldRetry: (error, attempt) => {
            // Only retry on timeout or 5xx errors
            if (error instanceof error_handling_kit_prod_1.ExternalServiceException) {
                return true;
            }
            return false;
        },
    };
    const result = await (0, error_handling_kit_prod_1.retryWithBackoff)(async () => {
        // Call external insurance verification API
        return await insuranceAPI.verify({ patientId: '123' });
    }, config);
    return result;
}
// ============================================================================
// EXAMPLE 5: CIRCUIT BREAKER PATTERN
// ============================================================================
/**
 * Example: Using circuit breaker for external services
 */
class InsuranceService {
    constructor() {
        this.circuitBreaker = new error_handling_kit_prod_1.CircuitBreaker({
            failureThreshold: 5, // Open after 5 failures
            successThreshold: 2, // Close after 2 successes in half-open
            timeout: 10000, // 10 second timeout
            resetTimeoutMs: 60000, // Try again after 1 minute
            halfOpenMaxAttempts: 3, // Max attempts in half-open state
            name: 'insurance-verification-api',
        });
    }
    async verifyEligibility(patientId) {
        try {
            return await this.circuitBreaker.execute(async () => {
                // Call external API
                const response = await fetch(`https://api.insurance.com/verify/${patientId}`);
                if (!response.ok) {
                    throw new error_handling_kit_prod_1.ExternalServiceException('Insurance verification failed', 'insurance-api', new Error(`HTTP ${response.status}`));
                }
                return await response.json();
            });
        }
        catch (error) {
            if (error instanceof error_handling_kit_prod_1.CircuitBreakerOpenException) {
                // Circuit is open, use fallback or return cached data
                return this.getFallbackEligibility(patientId);
            }
            throw error;
        }
    }
    async getFallbackEligibility(patientId) {
        // Return cached data or default response
        return { eligible: null, cached: true };
    }
}
exports.InsuranceService = InsuranceService;
// ============================================================================
// EXAMPLE 6: SENTRY INTEGRATION
// ============================================================================
/**
 * Example: Initialize Sentry and capture errors
 */
function example6_SentryIntegration() {
    // Initialize in main.ts or app module
    (0, error_handling_kit_prod_1.initializeSentry)(process.env.SENTRY_DSN, {
        environment: process.env.NODE_ENV,
        release: process.env.APP_VERSION,
        tracesSampleRate: 0.1,
    });
    // Capture error with context
    try {
        // Some operation that might fail
        throw new Error('Database connection lost');
    }
    catch (error) {
        (0, error_handling_kit_prod_1.captureErrorToSentry)(error, {
            level: 'error',
            tags: {
                errorCode: error_handling_kit_prod_1.ErrorCode.DATABASE_CONNECTION_FAILED,
                category: error_handling_kit_prod_1.ErrorCategory.DATABASE,
            },
            extra: {
                database: 'patients-db',
                operation: 'findOne',
            },
            user: {
                id: '123',
                email: 'doctor@hospital.com',
            },
        });
    }
}
// ============================================================================
// EXAMPLE 7: ERROR RECOVERY STRATEGIES
// ============================================================================
/**
 * Example: Execute operation with automatic recovery
 */
async function example7_ErrorRecovery() {
    const result = await (0, error_handling_kit_prod_1.executeWithRecovery)(
    // Primary operation
    async () => {
        return await primaryDatabase.query('SELECT * FROM patients WHERE id = ?', ['123']);
    }, 
    // Recovery strategy
    {
        maxAttempts: 3,
        backoffMs: [1000, 2000, 4000],
        fallbackValue: null, // Return null if all attempts fail
        shouldRecover: (error, attempt) => {
            // Only recover from connection errors
            return error instanceof error_handling_kit_prod_1.DatabaseException;
        },
        onRecovery: (error, result) => {
            console.log('Recovered from error:', error.message);
        },
        onFailure: (error) => {
            console.error('Recovery failed:', error);
        },
    });
    return result;
}
/**
 * Example: Graceful degradation with fallback
 */
async function example7_GracefulDegradation() {
    const patientData = await (0, error_handling_kit_prod_1.gracefulDegradation)(
    // Primary: Fetch from database
    async () => {
        return await database.findPatient('123');
    }, 
    // Fallback: Fetch from cache
    async () => {
        return await cache.get('patient:123');
    }, 
    // Condition: Use fallback on database errors
    (error) => error instanceof error_handling_kit_prod_1.DatabaseException);
    return patientData;
}
// ============================================================================
// EXAMPLE 8: INTERCEPTORS
// ============================================================================
/**
 * Example: Using error interceptors in NestJS
 */
let AppointmentController = (() => {
    let _classDecorators = [(0, common_1.Controller)('appointments'), (0, common_1.UseInterceptors)(error_handling_kit_prod_1.ErrorLoggingInterceptor, error_handling_kit_prod_1.ErrorTransformationInterceptor, new error_handling_kit_prod_1.TimeoutInterceptor(5000) // 5 second timeout
        )];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findOne_decorators;
    var AppointmentController = _classThis = class {
        async findOne(id) {
            // Any errors will be logged by ErrorLoggingInterceptor
            // ZodErrors will be transformed to ValidationException
            // Requests taking > 5s will timeout
            const appointment = await this.appointmentService.findOne(id);
            if (!appointment) {
                throw new error_handling_kit_prod_1.ResourceNotFoundException('Appointment', id);
            }
            return appointment;
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "AppointmentController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findOne_decorators = [(0, common_1.Get)(':id')];
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppointmentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppointmentController = _classThis;
})();
exports.AppointmentController = AppointmentController;
// ============================================================================
// EXAMPLE 9: SEQUELIZE ERROR HANDLING
// ============================================================================
/**
 * Example: Handling Sequelize errors with DatabaseExceptionFilter
 */
let PatientService = (() => {
    let _classDecorators = [(0, common_1.UseFilters)(error_handling_kit_prod_1.DatabaseExceptionFilter)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PatientService = _classThis = class {
        async createPatient(data) {
            try {
                const patient = await Patient.create(data);
                return patient;
            }
            catch (error) {
                // DatabaseExceptionFilter will catch and format these errors:
                // - UniqueConstraintError -> ResourceConflictException
                // - ForeignKeyConstraintError -> DatabaseException
                // - ValidationError -> ValidationException
                // - ConnectionError -> DatabaseException
                // - TimeoutError -> DatabaseException
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "PatientService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatientService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatientService = _classThis;
})();
// ============================================================================
// EXAMPLE 10: ERROR SANITIZATION (HIPAA COMPLIANCE)
// ============================================================================
/**
 * Example: Sanitize errors to remove sensitive patient information
 */
function example10_ErrorSanitization() {
    try {
        // Operation that might expose sensitive data in error
        throw new Error('Patient SSN 123-45-6789 is invalid for user token abc123xyz');
    }
    catch (error) {
        const sanitizedMessage = (0, error_handling_kit_prod_1.sanitizeErrorMessage)(error.message);
        // Returns: 'Patient SSN [REDACTED] is invalid for user token [REDACTED]'
        const sanitizedStack = (0, error_handling_kit_prod_1.sanitizeStackTrace)(error.stack);
        // Stack trace with all sensitive patterns redacted
        console.log('Safe to log:', sanitizedMessage);
    }
}
// ============================================================================
// EXAMPLE 11: DEAD LETTER QUEUE
// ============================================================================
/**
 * Example: Using dead letter queue for failed operations
 */
async function example11_DeadLetterQueue() {
    try {
        await processAppointmentReminder({
            appointmentId: '123',
            patientEmail: 'patient@example.com',
            scheduledTime: '2025-11-09T10:00:00Z',
        });
    }
    catch (error) {
        // Add to DLQ for retry later
        await addToDeadLetterQueue({
            appointmentId: '123',
            patientEmail: 'patient@example.com',
            scheduledTime: '2025-11-09T10:00:00Z',
        }, error, 3, // Attempt number
        {
            queue: 'appointment-reminders',
            priority: 'high',
        });
    }
}
const error_handling_kit_prod_2 = require("./error-handling-kit.prod");
function errorEnrichmentMiddleware(req, res, next) {
    try {
        // Your application logic
        next();
    }
    catch (error) {
        // Extract context from request
        const context = (0, error_handling_kit_prod_2.extractErrorContextFromRequest)(req);
        // Enrich error with context
        const enrichedError = (0, error_handling_kit_prod_2.enrichErrorContext)(error, context);
        // Error now has userId, sessionId, ipAddress, etc.
        throw enrichedError;
    }
}
// ============================================================================
// EXAMPLE 13: COMPLETE NESTJS APP SETUP
// ============================================================================
/**
 * Example: Complete error handling setup in NestJS application
 */
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule);
    // 1. Initialize Sentry
    (0, error_handling_kit_prod_1.initializeSentry)(process.env.SENTRY_DSN, {
        environment: process.env.NODE_ENV,
        release: process.env.APP_VERSION,
    });
    // 2. Global validation pipe (works with ValidationExceptionFilter)
    app.useGlobalPipes(new common_2.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    // 3. Global exception filters
    app.useGlobalFilters(new error_handling_kit_prod_1.GlobalExceptionFilter(), new error_handling_kit_prod_1.ValidationExceptionFilter(), new error_handling_kit_prod_1.DatabaseExceptionFilter());
    // 4. Global interceptors
    app.useGlobalInterceptors(new error_handling_kit_prod_1.ErrorLoggingInterceptor(), new error_handling_kit_prod_1.ErrorTransformationInterceptor(), new error_handling_kit_prod_1.TimeoutInterceptor(30000) // 30 second default timeout
    );
    await app.listen(3000);
}
//# sourceMappingURL=error-handling-kit.examples.js.map