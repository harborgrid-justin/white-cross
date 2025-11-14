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
exports.HealthRecordAuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("../../common/interceptors/base.interceptor");
const phi_access_logger_service_1 = require("../services/phi-access-logger.service");
let HealthRecordAuditInterceptor = class HealthRecordAuditInterceptor extends base_interceptor_1.BaseInterceptor {
    phiAccessLogger;
    constructor(phiAccessLogger) {
        super();
        this.phiAccessLogger = phiAccessLogger;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        const correlationId = this.getOrGenerateRequestId(request);
        request.headers['x-correlation-id'] = correlationId;
        this.setRequestIdHeader(response, correlationId);
        const auditContext = this.extractAuditContext(request, correlationId);
        this.logRequest('info', `PHI Operation Started: ${auditContext.method} ${auditContext.endpoint}`, {
            correlationId,
            operation: auditContext.operation,
            phiAccessed: auditContext.phiAccessed,
            complianceLevel: auditContext.complianceLevel,
        });
        return next.handle().pipe((0, operators_1.tap)((responseData) => {
            const responseTime = Date.now() - startTime;
            const auditEntry = this.createSuccessAuditEntry(auditContext, responseData, responseTime, response);
            this.logAuditEntry(auditEntry);
            this.logPHIAccess(auditEntry, responseData);
        }), (0, operators_1.catchError)((error) => {
            const responseTime = Date.now() - startTime;
            const auditEntry = this.createErrorAuditEntry(auditContext, error, responseTime);
            this.logAuditEntry(auditEntry);
            this.logSecurityIncident(auditEntry, error);
            if (auditContext.phiAccessed) {
                this.reportToSentry(error, {
                    correlationId,
                    operation: auditContext.operation,
                    complianceLevel: auditContext.complianceLevel,
                    tags: {
                        operation: auditContext.operation,
                        complianceLevel: auditContext.complianceLevel,
                    },
                });
            }
            throw error;
        }));
    }
    extractAuditContext(request, correlationId) {
        const studentId = this.extractStudentId(request);
        const resourceId = this.extractResourceId(request);
        const operation = this.determineOperation(request);
        const complianceLevel = this.determineComplianceLevel(request, operation);
        return {
            correlationId,
            timestamp: new Date(),
            userId: request.user?.id,
            userRole: request.user?.role,
            ipAddress: this.getClientIp(request),
            userAgent: request.get('user-agent') || 'Unknown',
            endpoint: request.originalUrl,
            method: request.method,
            operation,
            resourceId,
            studentId,
            sessionId: request.sessionID,
            requestSize: this.calculateRequestSize(request),
            complianceLevel,
            phiAccessed: complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI',
            dataTypes: this.identifyDataTypes(request, operation),
        };
    }
    createSuccessAuditEntry(context, responseData, responseTime, response) {
        return {
            ...context,
            success: true,
            responseTime,
            responseSize: this.calculateResponseSize(responseData),
        };
    }
    createErrorAuditEntry(context, error, responseTime) {
        return {
            ...context,
            success: false,
            errorMessage: error.message || 'Unknown error',
            responseTime,
            responseSize: 0,
        };
    }
    logAuditEntry(entry) {
        const logLevel = entry.success ? 'log' : 'error';
        const prefix = entry.phiAccessed ? 'PHI_AUDIT' : 'AUDIT';
        this.logger[logLevel](`[${prefix}][${entry.correlationId}] ` +
            `${entry.operation} - User: ${entry.userId || 'Anonymous'} ` +
            `(${entry.userRole || 'Unknown'}) - IP: ${entry.ipAddress} - ` +
            `Student: ${entry.studentId || 'N/A'} - ` +
            `Success: ${entry.success} - ` +
            `Response Time: ${entry.responseTime}ms - ` +
            `Data Types: [${entry.dataTypes.join(', ')}] - ` +
            `Compliance: ${entry.complianceLevel}` +
            (entry.errorMessage ? ` - Error: ${entry.errorMessage}` : ''));
        this.storeAuditEntry(entry);
    }
    logPHIAccess(entry, responseData) {
        if (!entry.phiAccessed)
            return;
        const phiDetails = this.extractPHIDetails(responseData, entry.operation);
        this.phiAccessLogger.logPHIAccess({
            correlationId: entry.correlationId,
            timestamp: entry.timestamp,
            userId: entry.userId,
            studentId: entry.studentId,
            operation: entry.operation,
            dataTypes: entry.dataTypes,
            recordCount: phiDetails.recordCount,
            sensitivityLevel: entry.complianceLevel,
            ipAddress: entry.ipAddress,
            userAgent: entry.userAgent,
            success: entry.success,
        });
    }
    logSecurityIncident(entry, error) {
        if (!entry.phiAccessed)
            return;
        this.logger.warn(`[SECURITY_INCIDENT][${entry.correlationId}] ` +
            `Failed PHI access attempt - User: ${entry.userId || 'Anonymous'} ` +
            `- IP: ${entry.ipAddress} - Operation: ${entry.operation} ` +
            `- Student: ${entry.studentId || 'N/A'} ` +
            `- Error: ${error.message}`);
        this.phiAccessLogger.logSecurityIncident({
            correlationId: entry.correlationId,
            timestamp: entry.timestamp,
            incidentType: 'FAILED_PHI_ACCESS',
            userId: entry.userId,
            ipAddress: entry.ipAddress,
            operation: entry.operation,
            errorMessage: error.message,
            severity: 'HIGH',
        });
    }
    extractStudentId(request) {
        return (request.params?.studentId ||
            request.body?.studentId ||
            request.query?.studentId);
    }
    extractResourceId(request) {
        return request.params?.id || request.params?.recordId;
    }
    determineOperation(request) {
        const method = request.method;
        const path = request.route?.path || request.originalUrl;
        if (path.includes('/summary'))
            return 'GET_HEALTH_SUMMARY';
        if (path.includes('/export'))
            return 'EXPORT_HEALTH_DATA';
        if (path.includes('/import'))
            return 'IMPORT_HEALTH_DATA';
        if (path.includes('/search'))
            return 'SEARCH_HEALTH_RECORDS';
        if (path.includes('/allergies'))
            return `${method}_ALLERGY_DATA`;
        if (path.includes('/vaccinations'))
            return `${method}_VACCINATION_DATA`;
        if (path.includes('/conditions'))
            return `${method}_CHRONIC_CONDITION_DATA`;
        if (path.includes('/vitals'))
            return `${method}_VITAL_SIGNS_DATA`;
        switch (method) {
            case 'GET':
                return 'READ_HEALTH_RECORD';
            case 'POST':
                return 'CREATE_HEALTH_RECORD';
            case 'PATCH':
            case 'PUT':
                return 'UPDATE_HEALTH_RECORD';
            case 'DELETE':
                return 'DELETE_HEALTH_RECORD';
            default:
                return 'UNKNOWN_OPERATION';
        }
    }
    determineComplianceLevel(request, operation) {
        if (request.originalUrl.includes('/public'))
            return 'PUBLIC';
        const sensitivePHIOperations = [
            'EXPORT_HEALTH_DATA',
            'GET_HEALTH_SUMMARY',
            'SEARCH_HEALTH_RECORDS',
        ];
        if (sensitivePHIOperations.includes(operation))
            return 'SENSITIVE_PHI';
        const phiOperations = [
            'READ_HEALTH_RECORD',
            'CREATE_HEALTH_RECORD',
            'UPDATE_HEALTH_RECORD',
            'DELETE_HEALTH_RECORD',
            'GET_ALLERGY_DATA',
            'POST_ALLERGY_DATA',
            'GET_VACCINATION_DATA',
            'POST_VACCINATION_DATA',
        ];
        if (phiOperations.includes(operation))
            return 'PHI';
        return 'INTERNAL';
    }
    identifyDataTypes(request, operation) {
        const dataTypes = [];
        const path = request.originalUrl.toLowerCase();
        if (path.includes('health-record') || operation.includes('HEALTH_RECORD')) {
            dataTypes.push('HEALTH_RECORDS');
        }
        if (path.includes('allerg') || operation.includes('ALLERGY')) {
            dataTypes.push('ALLERGIES');
        }
        if (path.includes('vaccination') || operation.includes('VACCINATION')) {
            dataTypes.push('VACCINATIONS');
        }
        if (path.includes('condition') || operation.includes('CONDITION')) {
            dataTypes.push('CHRONIC_CONDITIONS');
        }
        if (path.includes('vitals') || operation.includes('VITAL')) {
            dataTypes.push('VITAL_SIGNS');
        }
        if (path.includes('summary')) {
            dataTypes.push('COMPREHENSIVE_SUMMARY');
        }
        return dataTypes.length > 0 ? dataTypes : ['GENERAL_PHI'];
    }
    extractPHIDetails(responseData, operation) {
        if (!responseData)
            return {
                recordCount: 0,
                hasAllergies: false,
                hasVaccinations: false,
                hasConditions: false,
            };
        let recordCount = 0;
        let hasAllergies = false;
        let hasVaccinations = false;
        let hasConditions = false;
        if (Array.isArray(responseData)) {
            recordCount = responseData.length;
        }
        else if (responseData.records && Array.isArray(responseData.records)) {
            recordCount = responseData.records.length;
        }
        else if (responseData.pagination) {
            recordCount = responseData.pagination.total || 0;
        }
        else if (responseData) {
            recordCount = 1;
        }
        if (responseData.allergies)
            hasAllergies = true;
        if (responseData.vaccinations || responseData.recentVaccinations)
            hasVaccinations = true;
        if (responseData.chronicConditions || responseData.conditions)
            hasConditions = true;
        return { recordCount, hasAllergies, hasVaccinations, hasConditions };
    }
    storeAuditEntry(entry) {
        this.logger.debug(`[AUDIT_STORE][${entry.correlationId}] Storing audit entry for compliance reporting`);
    }
};
exports.HealthRecordAuditInterceptor = HealthRecordAuditInterceptor;
exports.HealthRecordAuditInterceptor = HealthRecordAuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [phi_access_logger_service_1.PHIAccessLogger])
], HealthRecordAuditInterceptor);
//# sourceMappingURL=health-record-audit.interceptor.js.map