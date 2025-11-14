"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareExceptionFilter = exports.HealthcareErrorHandler = exports.HealthcareErrorAggregationService = exports.ClinicalSystemRecoveryStrategy = exports.PatientImpactLevel = exports.ErrorCategory = exports.ErrorSeverity = exports.HealthcareIntegrationError = exports.ClinicalWorkflowError = exports.HIPAAComplianceError = exports.PatientSafetyError = exports.MedicalDataError = exports.HealthcareError = void 0;
exports.createHealthcareErrorHandler = createHealthcareErrorHandler;
exports.HandleHealthcareErrors = HandleHealthcareErrors;
const common_1 = require("@nestjs/common");
const winston = __importStar(require("winston"));
class HealthcareError extends Error {
    timestamp;
    errorId;
    context;
    severity;
    category;
    retryable;
    patientImpact;
    constructor(message, context = {}, severity = ErrorSeverity.ERROR, category = ErrorCategory.APPLICATION, retryable = false, patientImpact = PatientImpactLevel.NONE) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = new Date();
        this.errorId = this.generateErrorId();
        this.context = { ...this.getDefaultContext(), ...context };
        this.severity = severity;
        this.category = category;
        this.retryable = retryable;
        this.patientImpact = patientImpact;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    getDefaultContext() {
        return {
            service: 'white-cross-backend',
            version: process.env.APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            nodeId: process.env.NODE_ID || 'unknown',
            facilityId: 'default',
        };
    }
    toLogFormat() {
        return {
            errorId: this.errorId,
            timestamp: this.timestamp,
            name: this.name,
            message: this.message,
            stack: this.stack,
            context: this.context,
            severity: this.severity,
            category: this.category,
            retryable: this.retryable,
            patientImpact: this.patientImpact,
        };
    }
    toApiFormat(includeStack = false) {
        return {
            error: {
                id: this.errorId,
                type: this.name,
                message: this.message,
                code: this.getErrorCode(),
                timestamp: this.timestamp.toISOString(),
                context: this.sanitizeContext(),
                patientImpact: this.patientImpact,
                ...(includeStack && { stack: this.stack }),
            },
        };
    }
    sanitizeContext() {
        const { patientId, sensitiveData, ...safeContext } = this.context;
        if (process.env.NODE_ENV === 'development') {
            safeContext.patientId = patientId;
        }
        return safeContext;
    }
}
exports.HealthcareError = HealthcareError;
class MedicalDataError extends HealthcareError {
    dataType;
    validationRule;
    constructor(message, dataType, validationRule, context = {}, patientImpact = PatientImpactLevel.LOW) {
        super(message, context, ErrorSeverity.ERROR, ErrorCategory.MEDICAL_DATA, false, patientImpact);
        this.dataType = dataType;
        this.validationRule = validationRule;
    }
    getErrorCode() {
        return 'MEDICAL_DATA_ERROR';
    }
}
exports.MedicalDataError = MedicalDataError;
class PatientSafetyError extends HealthcareError {
    safetyRule;
    alertRequired;
    constructor(message, safetyRule, context = {}, alertRequired = true) {
        super(message, context, ErrorSeverity.CRITICAL, ErrorCategory.PATIENT_SAFETY, false, PatientImpactLevel.HIGH);
        this.safetyRule = safetyRule;
        this.alertRequired = alertRequired;
    }
    getErrorCode() {
        return 'PATIENT_SAFETY_ERROR';
    }
}
exports.PatientSafetyError = PatientSafetyError;
class HIPAAComplianceError extends HealthcareError {
    complianceRule;
    auditRequired;
    constructor(message, complianceRule, context = {}, auditRequired = true) {
        super(message, context, ErrorSeverity.CRITICAL, ErrorCategory.COMPLIANCE, false, PatientImpactLevel.MEDIUM);
        this.complianceRule = complianceRule;
        this.auditRequired = auditRequired;
    }
    getErrorCode() {
        return 'HIPAA_COMPLIANCE_ERROR';
    }
}
exports.HIPAAComplianceError = HIPAAComplianceError;
class ClinicalWorkflowError extends HealthcareError {
    workflowStage;
    blockingOperation;
    constructor(message, workflowStage, context = {}, blockingOperation = false) {
        super(message, context, blockingOperation ? ErrorSeverity.CRITICAL : ErrorSeverity.ERROR, ErrorCategory.CLINICAL_WORKFLOW, true, blockingOperation ? PatientImpactLevel.HIGH : PatientImpactLevel.LOW);
        this.workflowStage = workflowStage;
        this.blockingOperation = blockingOperation;
    }
    getErrorCode() {
        return 'CLINICAL_WORKFLOW_ERROR';
    }
}
exports.ClinicalWorkflowError = ClinicalWorkflowError;
class HealthcareIntegrationError extends HealthcareError {
    system;
    endpoint;
    httpStatus;
    constructor(message, system, context = {}, patientImpact = PatientImpactLevel.MEDIUM) {
        super(message, context, ErrorSeverity.ERROR, ErrorCategory.HEALTHCARE_INTEGRATION, true, patientImpact);
        this.system = system;
        this.endpoint = context.endpoint;
        this.httpStatus = context.httpStatus;
    }
    getErrorCode() {
        return 'HEALTHCARE_INTEGRATION_ERROR';
    }
}
exports.HealthcareIntegrationError = HealthcareIntegrationError;
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["DEBUG"] = "debug";
    ErrorSeverity["INFO"] = "info";
    ErrorSeverity["WARN"] = "warn";
    ErrorSeverity["ERROR"] = "error";
    ErrorSeverity["CRITICAL"] = "critical";
    ErrorSeverity["FATAL"] = "fatal";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["APPLICATION"] = "application";
    ErrorCategory["MEDICAL_DATA"] = "medical_data";
    ErrorCategory["PATIENT_SAFETY"] = "patient_safety";
    ErrorCategory["COMPLIANCE"] = "compliance";
    ErrorCategory["CLINICAL_WORKFLOW"] = "clinical_workflow";
    ErrorCategory["HEALTHCARE_INTEGRATION"] = "healthcare_integration";
    ErrorCategory["DATABASE"] = "database";
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["SECURITY"] = "security";
    ErrorCategory["CONFIGURATION"] = "configuration";
    ErrorCategory["TIMEOUT"] = "timeout";
    ErrorCategory["UNKNOWN"] = "unknown";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
var PatientImpactLevel;
(function (PatientImpactLevel) {
    PatientImpactLevel["NONE"] = "none";
    PatientImpactLevel["LOW"] = "low";
    PatientImpactLevel["MEDIUM"] = "medium";
    PatientImpactLevel["HIGH"] = "high";
    PatientImpactLevel["CRITICAL"] = "critical";
})(PatientImpactLevel || (exports.PatientImpactLevel = PatientImpactLevel = {}));
let ClinicalSystemRecoveryStrategy = class ClinicalSystemRecoveryStrategy {
    logger = new common_1.Logger('ClinicalSystemRecoveryStrategy');
    canRecover(error) {
        if (error.category === ErrorCategory.PATIENT_SAFETY ||
            error.category === ErrorCategory.COMPLIANCE) {
            return false;
        }
        return error.retryable && error.patientImpact !== PatientImpactLevel.CRITICAL;
    }
    async recover(error) {
        this.logger.warn(`Attempting clinical system recovery for error: ${error.errorId}`);
        if (error instanceof HealthcareIntegrationError) {
            await this.recoverIntegrationConnection(error.system);
        }
        if (error instanceof ClinicalWorkflowError && !error.blockingOperation) {
            await this.resumeWorkflow(error.workflowStage);
        }
    }
    async recoverIntegrationConnection(system) {
        this.logger.log(`Attempting to recover connection to ${system}`);
    }
    async resumeWorkflow(workflowStage) {
        this.logger.log(`Attempting to resume workflow at stage: ${workflowStage}`);
    }
};
exports.ClinicalSystemRecoveryStrategy = ClinicalSystemRecoveryStrategy;
exports.ClinicalSystemRecoveryStrategy = ClinicalSystemRecoveryStrategy = __decorate([
    (0, common_1.Injectable)()
], ClinicalSystemRecoveryStrategy);
let HealthcareErrorAggregationService = class HealthcareErrorAggregationService {
    logger = new common_1.Logger('HealthcareErrorAggregationService');
    errorsByPatient = new Map();
    errorsByProvider = new Map();
    criticalErrors = [];
    recordError(error) {
        const logEntry = error.toLogFormat();
        if (logEntry.context.patientId) {
            this.addToPatientErrors(logEntry.context.patientId, logEntry);
        }
        if (logEntry.context.providerId) {
            this.addToProviderErrors(logEntry.context.providerId, logEntry);
        }
        if (logEntry.patientImpact === PatientImpactLevel.HIGH ||
            logEntry.patientImpact === PatientImpactLevel.CRITICAL) {
            this.criticalErrors.push(logEntry);
            this.alertClinicalStaff(logEntry);
        }
        this.analyzePatientSafetyPatterns(logEntry);
    }
    addToPatientErrors(patientId, error) {
        if (!this.errorsByPatient.has(patientId)) {
            this.errorsByPatient.set(patientId, []);
        }
        this.errorsByPatient.get(patientId).push(error);
    }
    addToProviderErrors(providerId, error) {
        if (!this.errorsByProvider.has(providerId)) {
            this.errorsByProvider.set(providerId, []);
        }
        this.errorsByProvider.get(providerId).push(error);
    }
    alertClinicalStaff(error) {
        this.logger.error(`CRITICAL HEALTHCARE ERROR - Patient Impact: ${error.patientImpact}`, {
            errorId: error.errorId,
            patientId: error.context.patientId,
        });
    }
    analyzePatientSafetyPatterns(error) {
        if (error.context.patientId) {
            const patientErrors = this.errorsByPatient.get(error.context.patientId) || [];
            if (patientErrors.length > 3) {
                this.logger.warn(`Multiple errors detected for patient ${error.context.patientId}`, {
                    errorCount: patientErrors.length,
                });
            }
        }
    }
    getCriticalErrors() {
        return [...this.criticalErrors];
    }
    getPatientErrors(patientId) {
        return this.errorsByPatient.get(patientId) || [];
    }
};
exports.HealthcareErrorAggregationService = HealthcareErrorAggregationService;
exports.HealthcareErrorAggregationService = HealthcareErrorAggregationService = __decorate([
    (0, common_1.Injectable)()
], HealthcareErrorAggregationService);
let HealthcareErrorHandler = class HealthcareErrorHandler {
    aggregationService;
    recoveryStrategy;
    logger = new common_1.Logger('HealthcareErrorHandler');
    winstonLogger;
    constructor(aggregationService, recoveryStrategy) {
        this.aggregationService = aggregationService;
        this.recoveryStrategy = recoveryStrategy;
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: 'healthcare-errors.log',
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: 'patient-safety-errors.log',
                    level: 'error',
                    format: winston.format.combine(winston.format.timestamp(), winston.format((info) => {
                        return info.category === ErrorCategory.PATIENT_SAFETY ? info : false;
                    })(), winston.format.json()),
                }),
            ],
        });
    }
    async handleError(error, context = {}) {
        const startTime = Date.now();
        const structuredError = this.ensureHealthcareError(error, context);
        try {
            this.logHealthcareError(structuredError);
            this.aggregationService.recordError(structuredError);
            const recoveryAttempted = await this.attemptRecovery(structuredError);
            await this.handleComplianceRequirements(structuredError);
            const duration = Date.now() - startTime;
            this.logger.debug(`Error handling completed in ${duration}ms`);
        }
        catch (handlingError) {
            this.logger.error(`Error occurred while handling healthcare error ${structuredError.errorId}`, handlingError);
        }
    }
    ensureHealthcareError(error, context = {}) {
        if (error instanceof HealthcareError) {
            return error;
        }
        if (error.message.includes('validation') || error.message.includes('invalid')) {
            return new MedicalDataError(error.message, 'unknown', 'general_validation', context, PatientImpactLevel.LOW);
        }
        return new ClinicalWorkflowError(error.message, 'unknown_stage', context, false);
    }
    logHealthcareError(error) {
        const logEntry = error.toLogFormat();
        switch (error.patientImpact) {
            case PatientImpactLevel.CRITICAL:
            case PatientImpactLevel.HIGH:
                this.winstonLogger.error(logEntry);
                break;
            case PatientImpactLevel.MEDIUM:
                this.winstonLogger.warn(logEntry);
                break;
            default:
                this.winstonLogger.info(logEntry);
        }
    }
    async attemptRecovery(error) {
        if (!this.recoveryStrategy.canRecover(error)) {
            return false;
        }
        try {
            await this.recoveryStrategy.recover(error);
            this.logger.log(`Recovery successful for error: ${error.errorId}`);
            return true;
        }
        catch (recoveryError) {
            this.logger.error(`Recovery failed for error: ${error.errorId}`, recoveryError);
            return false;
        }
    }
    async handleComplianceRequirements(error) {
        if (error instanceof HIPAAComplianceError && error.auditRequired) {
            this.winstonLogger.error('HIPAA_COMPLIANCE_VIOLATION', error.toLogFormat());
        }
        if (error instanceof PatientSafetyError && error.alertRequired) {
            this.logger.error('PATIENT_SAFETY_ALERT', {
                errorId: error.errorId,
                safetyRule: error.safetyRule,
            });
        }
    }
    createSafeApiResponse(error) {
        const healthcareError = this.ensureHealthcareError(error);
        return healthcareError.toApiFormat(process.env.NODE_ENV === 'development');
    }
};
exports.HealthcareErrorHandler = HealthcareErrorHandler;
exports.HealthcareErrorHandler = HealthcareErrorHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HealthcareErrorAggregationService,
        ClinicalSystemRecoveryStrategy])
], HealthcareErrorHandler);
let HealthcareExceptionFilter = class HealthcareExceptionFilter {
    errorHandler;
    constructor(errorHandler) {
        this.errorHandler = errorHandler;
    }
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const error = exception instanceof Error ? exception : new Error(String(exception));
        const context = {
            requestId: request.headers['x-request-id'],
            userId: request.user?.id,
            patientId: request.patientId || request.params?.patientId,
            providerId: request.user?.providerId,
            facilityId: request.user?.facilityId || 'default',
            operation: `${request.method} ${request.path}`,
            clinicalContext: {
                department: request.headers['x-department'],
                specialty: request.headers['x-specialty'],
                urgencyLevel: request.headers['x-urgency'] || 'routine',
            },
            additionalData: {
                userAgent: request.headers['user-agent'],
                ip: request.ip,
                query: request.query,
            },
        };
        await this.errorHandler.handleError(error, context);
        const apiResponse = this.errorHandler.createSafeApiResponse(error);
        const statusCode = this.getHttpStatusCode(exception);
        response.status(statusCode).json(apiResponse);
    }
    getHttpStatusCode(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        if (exception instanceof MedicalDataError) {
            return common_1.HttpStatus.BAD_REQUEST;
        }
        if (exception instanceof PatientSafetyError) {
            return common_1.HttpStatus.FORBIDDEN;
        }
        if (exception instanceof HIPAAComplianceError) {
            return common_1.HttpStatus.FORBIDDEN;
        }
        if (exception instanceof HealthcareIntegrationError) {
            return common_1.HttpStatus.BAD_GATEWAY;
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
};
exports.HealthcareExceptionFilter = HealthcareExceptionFilter;
exports.HealthcareExceptionFilter = HealthcareExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [HealthcareErrorHandler])
], HealthcareExceptionFilter);
function createHealthcareErrorHandler() {
    const aggregationService = new HealthcareErrorAggregationService();
    const recoveryStrategy = new ClinicalSystemRecoveryStrategy();
    return new HealthcareErrorHandler(aggregationService, recoveryStrategy);
}
function HandleHealthcareErrors(context) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const errorHandler = createHealthcareErrorHandler();
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                await errorHandler.handleError(error, {
                    ...context,
                    operation: `${target.constructor.name}.${propertyKey}`,
                });
                throw error;
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=production-error-handler.js.map