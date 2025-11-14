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
var AuditInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let AuditInterceptor = AuditInterceptor_1 = class AuditInterceptor {
    logger = new common_1.Logger(AuditInterceptor_1.name);
    constructor() { }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const controller = context.getClass();
        const methodName = handler.name;
        const controllerName = controller.name;
        const startTime = Date.now();
        const user = request.user;
        const ipAddress = this.getClientIP(request);
        const userAgent = request.get('user-agent');
        this.logger.debug(`Executing ${controllerName}.${methodName}`, {
            userId: user?.userId,
            method: request.method,
            path: request.path,
            ipAddress,
        });
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            const isPHI = this.isPHIOperation(controllerName, methodName);
            if (isPHI && user) {
                this.logger.debug(`PHI operation detected: ${controllerName}.${methodName}`, {
                    userId: user.userId,
                    operation: this.getOperationType(request.method),
                });
            }
            this.logger.debug(`Completed ${controllerName}.${methodName}`, {
                duration,
                userId: user?.userId,
                success: true,
            });
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            if (user) {
                this.logger.error(`Method execution failed: ${controllerName}.${methodName}`, {
                    userId: user.userId,
                    userEmail: user.email,
                    error: error.message,
                    duration,
                });
            }
            this.logger.error(`Failed ${controllerName}.${methodName}`, {
                duration,
                userId: user?.userId,
                error: error.message,
            });
            throw error;
        }));
    }
    isPHIOperation(controllerName, methodName) {
        const phiControllers = [
            'PatientController',
            'HealthRecordController',
            'MedicationController',
            'ImmunizationController',
            'AllergyController',
        ];
        const phiMethods = [
            'getPatient',
            'updatePatient',
            'createPatient',
            'deletePatient',
            'getHealthRecord',
            'getMedications',
            'getImmunizations',
        ];
        return (phiControllers.some((c) => controllerName.includes(c)) ||
            phiMethods.some((m) => methodName.includes(m)));
    }
    extractStudentId(request) {
        return (request.params?.studentId ||
            request.params?.patientId ||
            request.params?.id ||
            request.query?.studentId ||
            'unknown');
    }
    getOperationType(method) {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'VIEW';
            case 'PUT':
            case 'PATCH':
                return 'EDIT';
            case 'POST':
                return 'CREATE';
            case 'DELETE':
                return 'DELETE';
            default:
                return 'VIEW';
        }
    }
    getClientIP(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.ip ||
            'unknown');
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = AuditInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map