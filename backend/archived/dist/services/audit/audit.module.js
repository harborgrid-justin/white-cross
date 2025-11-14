"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const phi_access_logger_service_1 = require("../../health-record/services/phi-access-logger.service");
const health_record_audit_interceptor_1 = require("../../health-record/interceptors/health-record-audit.interceptor");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const audit_service_1 = require("./audit.service");
const audit_controller_1 = require("./audit.controller");
const audit_log_service_1 = require("./services/audit-log.service");
const audit_query_service_1 = require("../../database/services/audit-query.service");
const audit_statistics_service_1 = require("../../database/services/audit-statistics.service");
const audit_utils_service_1 = require("./services/audit-utils.service");
const compliance_reporting_service_1 = require("./services/compliance-reporting.service");
const phi_access_service_1 = require("./services/phi-access.service");
const security_analysis_service_1 = require("./services/security-analysis.service");
let AuditModule = class AuditModule {
};
exports.AuditModule = AuditModule;
exports.AuditModule = AuditModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([models_1.AuditLog, models_2.PhiDisclosureAudit])],
        controllers: [audit_controller_1.AuditController],
        providers: [
            audit_service_1.AuditService,
            audit_log_service_1.AuditLogService,
            audit_query_service_1.AuditQueryService,
            audit_statistics_service_1.AuditStatisticsService,
            audit_utils_service_1.AuditUtilsService,
            compliance_reporting_service_1.ComplianceReportingService,
            phi_access_service_1.PHIAccessService,
            security_analysis_service_1.SecurityAnalysisService,
            phi_access_logger_service_1.PHIAccessLogger,
            health_record_audit_interceptor_1.HealthRecordAuditInterceptor,
        ],
        exports: [
            audit_service_1.AuditService,
            phi_access_logger_service_1.PHIAccessLogger,
            health_record_audit_interceptor_1.HealthRecordAuditInterceptor,
        ],
    })
], AuditModule);
//# sourceMappingURL=audit.module.js.map